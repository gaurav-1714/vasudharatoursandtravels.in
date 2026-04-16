import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { adminLogin, isFirebaseConfigured } from '../lib/firebase'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      navigate('/admin', { replace: true })
    }
  }, [navigate, user])

  const inputStyle = {
    width: '100%',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '10px',
    padding: '12px 14px',
    color: '#ffffff',
    fontSize: '14px',
    fontFamily: "'DM Sans', sans-serif",
    outline: 'none',
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!isFirebaseConfigured) {
      setError('Firebase Auth is not configured. Add VITE_FIREBASE_* values before using the admin login.')
      return
    }

    if (!email || !password) {
      setError('Enter email and password.')
      return
    }

    setLoading(true)
    setError('')

    try {
      await adminLogin(email, password)
      navigate('/admin', { replace: true })
    } catch {
      setError('Invalid email or password. Check your Firebase Authentication setup.')
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0c0f15', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ background: '#141920', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '40px', width: '100%', maxWidth: '420px', boxShadow: '0 32px 80px rgba(0,0,0,0.5)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '28px' }}>
          <div style={{ width: '38px', height: '38px', background: '#d4891a', borderRadius: '9px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Cormorant Garamond', serif", fontSize: '20px', fontWeight: '700', color: '#0c0f15' }}>V</div>
          <div>
            <div style={{ fontSize: '15px', fontWeight: '700', color: '#ffffff' }}>Vasudhara Admin</div>
            <div style={{ fontSize: '11px', color: '#7a8899' }}>Management Panel</div>
          </div>
        </div>

        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '24px', fontWeight: '600', color: '#ffffff', marginBottom: '6px' }}>Welcome back</h2>
        <p style={{ fontSize: '13px', color: '#7a8899', marginBottom: '24px' }}>Sign in with your Firebase account</p>

        {!isFirebaseConfigured && (
          <div style={{ background: 'rgba(240,180,69,0.1)', border: '1px solid rgba(240,180,69,0.25)', borderRadius: '8px', padding: '10px 13px', color: '#f0b445', fontSize: '13px', marginBottom: '14px' }}>
            Admin login is disabled until Firebase environment variables are set in Vercel and locally.
          </div>
        )}

        {error && (
          <div style={{ background: 'rgba(220,53,69,0.1)', border: '1px solid rgba(220,53,69,0.3)', borderRadius: '8px', padding: '10px 13px', color: '#e05c6a', fontSize: '13px', marginBottom: '14px' }}>{error}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '10px', fontWeight: '700', letterSpacing: '1.2px', textTransform: 'uppercase', color: '#7a8899', marginBottom: '6px' }}>Email</label>
            <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="admin@vasudharatravels.com" required style={inputStyle} />
          </div>
          <div style={{ marginBottom: '22px' }}>
            <label style={{ display: 'block', fontSize: '10px', fontWeight: '700', letterSpacing: '1.2px', textTransform: 'uppercase', color: '#7a8899', marginBottom: '6px' }}>Password</label>
            <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Password" required style={inputStyle} />
          </div>
          <button
            type="submit"
            disabled={loading || !isFirebaseConfigured}
            style={{
              width: '100%',
              background: loading || !isFirebaseConfigured ? '#7a5a10' : '#d4891a',
              color: '#0c0f15',
              border: 'none',
              borderRadius: '10px',
              padding: '13px',
              fontSize: '15px',
              fontWeight: '700',
              cursor: loading || !isFirebaseConfigured ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p style={{ marginTop: '20px', fontSize: '11px', color: '#4a5568', textAlign: 'center', lineHeight: '1.6' }}>
          Create your admin account in Firebase Console under Authentication, then use those credentials here.
        </p>
      </div>
    </div>
  )
}
