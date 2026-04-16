import { initializeApp } from 'firebase/app'
import { getAnalytics, isSupported as analyticsSupported } from 'firebase/analytics'
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import {
  addDoc,
  collection,
  doc,
  getDocs,
  getFirestore,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore'
import { PACKAGES } from './data'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
}

export const isFirebaseConfigured = Object.values(firebaseConfig)
  .filter((value, index) => index < 6)
  .every(Boolean)

const app = isFirebaseConfigured ? initializeApp(firebaseConfig) : null
const db = app ? getFirestore(app) : null
const auth = app ? getAuth(app) : null

if (app && typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
  analyticsSupported()
    .then((supported) => {
      if (supported) {
        getAnalytics(app)
      }
    })
    .catch(() => {})
}

const LOCAL_ENQUIRIES_KEY = 'vasudhara-enquiries'

function readLocalEnquiries() {
  if (typeof window === 'undefined') {
    return []
  }

  try {
    return JSON.parse(window.localStorage.getItem(LOCAL_ENQUIRIES_KEY) || '[]')
  } catch {
    return []
  }
}

function writeLocalEnquiries(items) {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(LOCAL_ENQUIRIES_KEY, JSON.stringify(items))
  }
}

function normalizeEnquiry(record, fallbackId = `local-${Date.now()}`) {
  return {
    id: record.id || fallbackId,
    ...record,
    status: record.status || 'new',
    createdAt: record.createdAt || new Date().toISOString(),
  }
}

function upsertLocalEnquiry(record) {
  const normalized = normalizeEnquiry(record)
  const existing = readLocalEnquiries()
  const filtered = existing.filter((item) => item.id !== normalized.id)
  writeLocalEnquiries([normalized, ...filtered])
  return normalized
}

export async function submitEnquiry(data) {
  const localRecord = upsertLocalEnquiry({
    ...data,
    id: `local-${Date.now()}`,
    status: 'new',
    createdAt: new Date().toISOString(),
  })

  if (db) {
    try {
      const docRef = await addDoc(collection(db, 'enquiries'), {
        ...data,
        status: 'new',
        createdAt: serverTimestamp(),
      })

      upsertLocalEnquiry({
        ...localRecord,
        id: docRef.id,
      })

      return docRef
    } catch (error) {
      console.error('Failed to save enquiry to Firestore, keeping local backup.', error)
      return localRecord
    }
  }

  return localRecord
}

export async function getPackages(category = null) {
  if (!db) {
    return PACKAGES.filter((item) => item.isActive && (!category || item.category === category))
  }

  const packageQuery = category
    ? query(collection(db, 'packages'), where('category', '==', category), where('isActive', '==', true), orderBy('sortOrder'))
    : query(collection(db, 'packages'), where('isActive', '==', true), orderBy('sortOrder'))

  const snap = await getDocs(packageQuery)
  return snap.docs.map((item) => ({ id: item.id, ...item.data() }))
}

export async function getPackageBySlug(slug) {
  if (!db) {
    return PACKAGES.find((item) => item.slug === slug) || null
  }

  const packageQuery = query(collection(db, 'packages'), where('slug', '==', slug))
  const snap = await getDocs(packageQuery)
  if (snap.empty) {
    return null
  }

  return { id: snap.docs[0].id, ...snap.docs[0].data() }
}

export async function getEnquiries() {
  if (!db) {
    return readLocalEnquiries()
  }

  try {
    const enquiriesQuery = query(collection(db, 'enquiries'), orderBy('createdAt', 'desc'))
    const snap = await getDocs(enquiriesQuery)
    const remote = snap.docs.map((item) => normalizeEnquiry({ id: item.id, ...item.data() }, item.id))

    if (remote.length > 0) {
      writeLocalEnquiries(remote)
      return remote
    }
  } catch (error) {
    console.error('Failed to load enquiries from Firestore, using local backup.', error)
  }

  return readLocalEnquiries()
}

export async function updateEnquiryStatus(id, status, notes = '') {
  const updatedLocal = readLocalEnquiries().map((item) =>
    item.id === id ? { ...item, status, notes, updatedAt: new Date().toISOString() } : item,
  )
  writeLocalEnquiries(updatedLocal)

  if (!db) {
    return
  }

  try {
    return await updateDoc(doc(db, 'enquiries', id), {
      status,
      notes,
      updatedAt: serverTimestamp(),
    })
  } catch (error) {
    console.error('Failed to update enquiry in Firestore, local status was updated.', error)
  }
}

export async function adminLogin(email, password) {
  if (!auth) {
    throw new Error('Firebase authentication is not configured.')
  }

  return signInWithEmailAndPassword(auth, email, password)
}

export async function adminLogout() {
  if (auth) {
    return signOut(auth)
  }
}

export function onAuthChange(callback) {
  if (!auth) {
    callback(null)
    return () => {}
  }

  return onAuthStateChanged(auth, callback)
}
