import React, { useEffect, useState } from 'react'
import { submitEnquiry } from '../lib/firebase'

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
  transition: 'border-color 0.18s',
  appearance: 'none',
  WebkitAppearance: 'none',
}

const selectStyle = {
  ...inputStyle,
  background: '#141920',
  color: '#ffffff',
}

const optionStyle = {
  background: '#141920',
  color: '#ffffff',
}

const labelStyle = {
  display: 'block',
  fontSize: '10px',
  fontWeight: '700',
  letterSpacing: '1.5px',
  textTransform: 'uppercase',
  color: '#7a8899',
  marginBottom: '6px',
}

const destinations = [
  'Darjeeling',
  'Sikkim (Gangtok)',
  'Kalimpong',
  'Dooars',
  'Sandakphu Trek',
  'Pelling',
  'Lachung and Yumthang',
  'Darjeeling + Sikkim Combo',
  'Custom Package',
]

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

function getWindowWidth() {
  return typeof window === 'undefined' ? 1200 : window.innerWidth
}

export default function EnquiryForm({ prefilledDestination = '' }) {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    destination: prefilledDestination || '',
    pax: '2 Persons',
    month: '',
    duration: '3 Nights',
    budget: 'Standard',
    message: '',
  })
  const [status, setStatus] = useState('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [lastSubmitted, setLastSubmitted] = useState(null)
  const [isMobile, setIsMobile] = useState(getWindowWidth() < 640)

  useEffect(() => {
    setForm((current) => ({
      ...current,
      destination: prefilledDestination || current.destination,
    }))
  }, [prefilledDestination])

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 640)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const update = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }))
  }

  const focus = (event) => {
    event.target.style.borderColor = '#d4891a'
    event.target.style.background = 'rgba(212,137,26,0.05)'
  }

  const blur = (event) => {
    event.target.style.borderColor = 'rgba(255,255,255,0.1)'
    event.target.style.background = 'rgba(255,255,255,0.05)'
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!form.name.trim()) {
      setErrorMessage('Please enter your name.')
      return
    }

    if (!form.phone.trim() || form.phone.replace(/\D/g, '').length < 7) {
      setErrorMessage('Please enter a valid phone number.')
      return
    }

    if (!form.destination) {
      setErrorMessage('Please select a destination.')
      return
    }

    setErrorMessage('')
    setStatus('loading')

    try {
      await submitEnquiry(form)
      setLastSubmitted(form)

      // Best-effort email notification via Vercel serverless function.
      // If the endpoint/env vars aren't configured yet, we still consider the enquiry received.
      fetch('/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      }).catch(() => {})

      setStatus('success')
      setForm({
        name: '',
        phone: '',
        email: '',
        destination: prefilledDestination || '',
        pax: '2 Persons',
        month: '',
        duration: '3 Nights',
        budget: 'Standard',
        message: '',
      })
    } catch (error) {
      console.error(error)
      setStatus('error')
      setErrorMessage('Something went wrong. Please call +919046605444 or try again later.')
    }
  }

  if (status === 'success') {
    const whatsappText = lastSubmitted
      ? [
          'Hello Vasudhara, I want to enquire.',
          `Name: ${lastSubmitted.name || ''}`,
          `Phone: ${lastSubmitted.phone || ''}`,
          `Email: ${lastSubmitted.email || ''}`,
          `Destination: ${lastSubmitted.destination || ''}`,
          `Travellers: ${lastSubmitted.pax || ''}`,
          `Month: ${lastSubmitted.month || ''}`,
          `Duration: ${lastSubmitted.duration || ''}`,
          `Requirements: ${lastSubmitted.message || ''}`,
        ].join('\n')
      : 'Hello Vasudhara, I want to enquire about a package.'

    return (
      <div
        style={{
          background: 'rgba(46,204,113,0.08)',
          border: '1px solid rgba(46,204,113,0.25)',
          borderRadius: '16px',
          padding: '40px 24px',
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>Success</div>
        <div
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: '26px',
            fontWeight: '600',
            color: '#2ecc71',
            marginBottom: '10px',
          }}
        >
          Enquiry Received
        </div>
        <div style={{ color: '#7a8899', fontSize: '14px', lineHeight: '1.7' }}>
          Thank you. The team will follow up within 24 hours.
        </div>
        <a
          href={`https://wa.me/919046605444?text=${encodeURIComponent(whatsappText)}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-block',
            marginTop: '18px',
            background: 'rgba(240,180,69,0.10)',
            border: '1px solid rgba(240,180,69,0.30)',
            borderRadius: '10px',
            padding: '10px 18px',
            color: '#f0b445',
            fontSize: '13px',
            fontWeight: '700',
            textDecoration: 'none',
          }}
        >
          WhatsApp Us Now
        </a>
        <button
          type="button"
          onClick={() => setStatus('idle')}
          style={{
            marginTop: '24px',
            background: 'transparent',
            border: '1px solid rgba(46,204,113,0.4)',
            borderRadius: '8px',
            padding: '10px 24px',
            color: '#2ecc71',
            fontSize: '13px',
            fontWeight: '600',
            cursor: 'pointer',
          }}
        >
          Send Another Enquiry
        </button>
      </div>
    )
  }

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
    gap: '14px',
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      {errorMessage && (
        <div
          style={{
            background: 'rgba(220,53,69,0.1)',
            border: '1px solid rgba(220,53,69,0.3)',
            borderRadius: '8px',
            padding: '12px 14px',
            color: '#e05c6a',
            fontSize: '13px',
            marginBottom: '16px',
          }}
        >
          {errorMessage}
        </div>
      )}

      <div style={gridStyle}>
        <div>
          <label style={labelStyle}>Full Name *</label>
          <input type="text" value={form.name} onChange={update('name')} placeholder="Rahul Sharma" required style={inputStyle} onFocus={focus} onBlur={blur} />
        </div>
        <div>
          <label style={labelStyle}>Mobile *</label>
          <input type="tel" value={form.phone} onChange={update('phone')} placeholder="+91 9876543210" required style={inputStyle} onFocus={focus} onBlur={blur} />
        </div>
      </div>

      <div style={{ marginTop: '14px' }}>
        <label style={labelStyle}>Email Address</label>
        <input type="email" value={form.email} onChange={update('email')} placeholder="rahul@email.com" style={inputStyle} onFocus={focus} onBlur={blur} />
      </div>

      <div style={{ ...gridStyle, marginTop: '14px' }}>
        <div>
          <label style={labelStyle}>Destination *</label>
          <select value={form.destination} onChange={update('destination')} required style={selectStyle} onFocus={focus} onBlur={blur}>
            <option value="" style={optionStyle}>Select</option>
            {destinations.map((destination) => (
              <option key={destination} value={destination} style={optionStyle}>
                {destination}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label style={labelStyle}>Travellers</label>
          <select value={form.pax} onChange={update('pax')} style={selectStyle} onFocus={focus} onBlur={blur}>
            <option style={optionStyle}>1 Person</option>
            <option style={optionStyle}>2 Persons</option>
            <option style={optionStyle}>3-5 Persons</option>
            <option style={optionStyle}>6-10 Persons</option>
            <option style={optionStyle}>10+ Persons (Group)</option>
          </select>
        </div>
      </div>

      <div style={{ ...gridStyle, marginTop: '14px' }}>
        <div>
          <label style={labelStyle}>Month of Travel</label>
          <select value={form.month} onChange={update('month')} style={selectStyle} onFocus={focus} onBlur={blur}>
            <option value="" style={optionStyle}>Select month</option>
            {months.map((month) => (
              <option key={month} value={month} style={optionStyle}>
                {month}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label style={labelStyle}>Duration</label>
          <select value={form.duration} onChange={update('duration')} style={selectStyle} onFocus={focus} onBlur={blur}>
            <option style={optionStyle}>2 Nights</option>
            <option style={optionStyle}>3 Nights</option>
            <option style={optionStyle}>4 Nights</option>
            <option style={optionStyle}>5 Nights</option>
            <option style={optionStyle}>6 Nights</option>
            <option style={optionStyle}>7+ Nights</option>
          </select>
        </div>
      </div>

      <div style={{ marginTop: '14px' }}>
        <label style={labelStyle}>Budget Per Person</label>
        <select value={form.budget} onChange={update('budget')} style={selectStyle} onFocus={focus} onBlur={blur}>
          <option value="Budget" style={optionStyle}>Budget (Under Rs. 5,000)</option>
          <option value="Standard" style={optionStyle}>Standard (Rs. 5,000 - Rs. 10,000)</option>
          <option value="Comfort" style={optionStyle}>Comfort (Rs. 10,000 - Rs. 20,000)</option>
          <option value="Premium" style={optionStyle}>Premium (Rs. 20,000 - Rs. 40,000)</option>
          <option value="Luxury" style={optionStyle}>Luxury (Above Rs. 40,000)</option>
        </select>
      </div>

      <div style={{ marginTop: '14px' }}>
        <label style={labelStyle}>Special Requirements</label>
        <textarea
          value={form.message}
          onChange={update('message')}
          rows={3}
          placeholder="Vegetarian meals, honeymoon arrangements, trekking support..."
          style={{ ...inputStyle, resize: 'vertical', minHeight: '80px' }}
          onFocus={focus}
          onBlur={blur}
        />
      </div>

      <button
        type="submit"
        disabled={status === 'loading'}
        style={{
          width: '100%',
          marginTop: '18px',
          background: status === 'loading' ? '#7a5a10' : '#d4891a',
          color: '#0c0f15',
          border: 'none',
          borderRadius: '10px',
          padding: '14px',
          fontSize: '15px',
          fontWeight: '700',
          cursor: status === 'loading' ? 'not-allowed' : 'pointer',
        }}
      >
        {status === 'loading' ? 'Sending...' : 'Send My Enquiry'}
      </button>

      <div style={{ marginTop: '12px', textAlign: 'center', fontSize: '11px', color: '#7a8899' }}>
        We never share your details. Response within 24 hours.
      </div>
    </form>
  )
}
