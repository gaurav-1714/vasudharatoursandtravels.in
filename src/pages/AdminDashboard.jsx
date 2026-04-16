import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { adminLogout, getEnquiries, updateEnquiryStatus } from '../lib/firebase'

const statusColors = {
  new: { bg: 'rgba(52,152,219,0.15)', color: '#5baddc' },
  contacted: { bg: 'rgba(155,89,182,0.15)', color: '#ab47bc' },
  quoted: { bg: 'rgba(230,126,34,0.15)', color: '#ffa726' },
  confirmed: { bg: 'rgba(46,204,113,0.15)', color: '#2ecc71' },
  cancelled: { bg: 'rgba(220,53,69,0.15)', color: '#e05c6a' },
}

function getWindowWidth() {
  return typeof window === 'undefined' ? 1200 : window.innerWidth
}

function formatDate(value) {
  if (!value) return '-'
  if (typeof value?.toDate === 'function') return value.toDate().toLocaleDateString('en-IN')
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? '-' : date.toLocaleDateString('en-IN')
}

export default function AdminDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [enquiries, setEnquiries] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [selected, setSelected] = useState(null)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [isMobile, setIsMobile] = useState(getWindowWidth() < 768)

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const load = async () => {
    setLoading(true)
    setLoadError('')
    try {
      setEnquiries(await getEnquiries())
    } catch (error) {
      console.error(error)
      setLoadError('We could not load enquiries from Firebase, so only locally saved data may be available.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const filtered = enquiries.filter((item) => {
    const matchStatus = filter === 'all' || item.status === filter
    const q = search.toLowerCase()
    const matchSearch = !q || item.name?.toLowerCase().includes(q) || item.phone?.includes(search) || item.destination?.toLowerCase().includes(q)
    return matchStatus && matchSearch
  })

  const stats = {
    total: enquiries.length,
    new: enquiries.filter((item) => item.status === 'new').length,
    confirmed: enquiries.filter((item) => item.status === 'confirmed').length,
    contacted: enquiries.filter((item) => item.status === 'contacted').length,
  }

  const handleStatusUpdate = async (id, status) => {
    await updateEnquiryStatus(id, status)
    setEnquiries((current) => current.map((item) => (item.id === id ? { ...item, status } : item)))
    setSelected((current) => (current?.id === id ? { ...current, status } : current))
  }

  const handleLogout = async () => {
    await adminLogout()
    navigate('/admin/login', { replace: true })
  }

  const infoCell = (label, value) => (
    <div style={{ marginBottom: '12px' }}>
      <div style={{ fontSize: '10px', fontWeight: '700', letterSpacing: '1.2px', textTransform: 'uppercase', color: '#7a8899', marginBottom: '3px' }}>{label}</div>
      <div style={{ fontSize: '13px', color: '#ffffff' }}>{value || '-'}</div>
    </div>
  )

  return (
    <div style={{ background: '#0c0f15', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ background: '#141920', borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '0 20px', minHeight: '56px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50, gap: '12px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '32px', height: '32px', background: '#d4891a', borderRadius: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Cormorant Garamond', serif", fontSize: '17px', fontWeight: '700', color: '#0c0f15' }}>V</div>
          <div style={{ fontSize: '14px', fontWeight: '700', color: '#ffffff' }}>Vasudhara Admin</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '12px', color: '#7a8899' }}>{user?.email || 'Local demo mode'}</span>
          <button onClick={handleLogout} style={{ background: 'transparent', border: '1px solid rgba(231,76,60,0.3)', borderRadius: '7px', padding: '6px 14px', color: '#e05c6a', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}>Sign Out</button>
        </div>
      </div>

      <div style={{ flex: 1, padding: isMobile ? '20px' : '28px', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: '12px', marginBottom: '24px' }}>
          {[
            { label: 'Total Enquiries', value: stats.total, color: '#d4891a' },
            { label: 'New', value: stats.new, color: '#5baddc' },
            { label: 'Contacted', value: stats.contacted, color: '#ab47bc' },
            { label: 'Confirmed', value: stats.confirmed, color: '#2ecc71' },
          ].map((item) => (
            <div key={item.label} style={{ background: '#141920', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px', padding: '16px', borderTop: `3px solid ${item.color}` }}>
              <div style={{ fontSize: '10px', color: '#7a8899', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>{item.label}</div>
              <div style={{ fontSize: '28px', fontWeight: '700', color: '#ffffff' }}>{item.value}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '16px', alignItems: 'center' }}>
          <input
            type="text"
            placeholder="Search name, phone, destination..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            style={{ flex: '1', minWidth: '200px', maxWidth: '300px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '9px 13px', color: '#ffffff', fontSize: '13px', outline: 'none' }}
          />
          {['all', 'new', 'contacted', 'quoted', 'confirmed', 'cancelled'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              style={{
                padding: '7px 14px',
                borderRadius: '7px',
                fontSize: '12px',
                fontWeight: '600',
                border: filter === status ? '1px solid #d4891a' : '1px solid rgba(255,255,255,0.1)',
                background: filter === status ? '#d4891a' : 'transparent',
                color: filter === status ? '#0c0f15' : '#7a8899',
                cursor: 'pointer',
                textTransform: 'capitalize',
              }}
            >
              {status}
            </button>
          ))}
          <button onClick={load} style={{ marginLeft: 'auto', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '7px', padding: '7px 14px', color: '#7a8899', fontSize: '12px', cursor: 'pointer' }}>Refresh</button>
        </div>

        {loadError && (
          <div style={{ marginBottom: '16px', background: 'rgba(240,180,69,0.1)', border: '1px solid rgba(240,180,69,0.25)', borderRadius: '10px', padding: '12px 14px', color: '#f0b445', fontSize: '13px' }}>
            {loadError}
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: selected && !isMobile ? '1fr 400px' : '1fr', gap: '16px', alignItems: 'start' }}>
          <div style={{ background: '#141920', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', overflow: 'hidden' }}>
            {loading ? (
              <div style={{ padding: '40px', textAlign: 'center', color: '#7a8899' }}>Loading enquiries...</div>
            ) : filtered.length === 0 ? (
              <div style={{ padding: '40px', textAlign: 'center', color: '#7a8899' }}>No enquiries found.</div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                      {['Name', 'Phone', 'Destination', 'Pax', 'Month', 'Status', 'Received'].map((heading) => (
                        <th key={heading} style={{ padding: '10px 14px', textAlign: 'left', fontSize: '9px', fontWeight: '700', letterSpacing: '1.2px', textTransform: 'uppercase', color: '#7a8899', whiteSpace: 'nowrap' }}>
                          {heading}
                        </th>
                      ))}
                      <th style={{ padding: '10px 14px' }} />
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((item) => {
                      const colors = statusColors[item.status] || statusColors.new
                      return (
                        <tr key={item.id} onClick={() => setSelected(selected?.id === item.id ? null : item)} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', cursor: 'pointer', background: selected?.id === item.id ? 'rgba(212,137,26,0.06)' : 'transparent' }}>
                          <td style={{ padding: '12px 14px', color: '#ffffff', fontWeight: '600' }}>{item.name}</td>
                          <td style={{ padding: '12px 14px' }}><a href={`tel:${item.phone}`} onClick={(event) => event.stopPropagation()} style={{ color: '#f0b445', textDecoration: 'none' }}>{item.phone}</a></td>
                          <td style={{ padding: '12px 14px', color: '#b8c4d4' }}>{item.destination || '-'}</td>
                          <td style={{ padding: '12px 14px', color: '#7a8899' }}>{item.pax || '-'}</td>
                          <td style={{ padding: '12px 14px', color: '#7a8899' }}>{item.month || '-'}</td>
                          <td style={{ padding: '12px 14px' }}><span style={{ background: colors.bg, color: colors.color, padding: '3px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{item.status}</span></td>
                          <td style={{ padding: '12px 14px', color: '#7a8899', whiteSpace: 'nowrap' }}>{formatDate(item.createdAt)}</td>
                          <td style={{ padding: '12px 14px' }}>
                            <select
                              value={item.status}
                              onChange={(event) => {
                                event.stopPropagation()
                                handleStatusUpdate(item.id, event.target.value)
                              }}
                              onClick={(event) => event.stopPropagation()}
                              style={{ background: '#1c2330', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', padding: '4px 8px', color: '#ffffff', fontSize: '11px', cursor: 'pointer' }}
                            >
                              {['new', 'contacted', 'quoted', 'confirmed', 'cancelled'].map((status) => (
                                <option key={status} value={status} style={{ background: '#1c2330', color: '#ffffff' }}>{status}</option>
                              ))}
                            </select>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {selected && (
            <div style={{ background: '#141920', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', padding: '22px', position: isMobile ? 'static' : 'sticky', top: '76px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '18px' }}>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '18px', fontWeight: '600', color: '#ffffff' }}>{selected.name}</div>
                <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', color: '#7a8899', fontSize: '20px', cursor: 'pointer' }}>x</button>
              </div>
              {infoCell('Phone', <a href={`tel:${selected.phone}`} style={{ color: '#f0b445' }}>{selected.phone}</a>)}
              {infoCell('Email', selected.email)}
              {infoCell('Destination', selected.destination)}
              {infoCell('Travellers', selected.pax)}
              {infoCell('Month of Travel', selected.month)}
              {infoCell('Duration', selected.duration)}
              {infoCell('Budget', selected.budget)}
              {infoCell('Status', <span style={{ background: statusColors[selected.status]?.bg, color: statusColors[selected.status]?.color, padding: '3px 10px', borderRadius: '4px', fontSize: '11px', fontWeight: '700' }}>{selected.status}</span>)}
              {selected.message && infoCell('Message', <div style={{ background: '#1c2330', borderRadius: '8px', padding: '10px', fontSize: '13px', lineHeight: '1.6', color: '#b8c4d4' }}>{selected.message}</div>)}

              <div style={{ marginTop: '18px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {['contacted', 'quoted', 'confirmed', 'cancelled'].map((status) => (
                  <button
                    key={status}
                    onClick={() => handleStatusUpdate(selected.id, status)}
                    style={{
                      padding: '7px 12px',
                      borderRadius: '7px',
                      fontSize: '11px',
                      fontWeight: '700',
                      background: selected.status === status ? '#d4891a' : 'rgba(255,255,255,0.06)',
                      border: `1px solid ${selected.status === status ? '#d4891a' : 'rgba(255,255,255,0.1)'}`,
                      color: selected.status === status ? '#0c0f15' : '#b8c4d4',
                      cursor: 'pointer',
                      textTransform: 'capitalize',
                    }}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
