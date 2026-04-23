import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const badgeColors = {
  red: { bg: 'rgba(220,53,69,0.15)', color: '#e05c6a', border: 'rgba(220,53,69,0.3)' },
  blue: { bg: 'rgba(52,152,219,0.15)', color: '#5baddc', border: 'rgba(52,152,219,0.3)' },
  amber: { bg: 'rgba(212,137,26,0.15)', color: '#d4891a', border: 'rgba(212,137,26,0.3)' },
  green: { bg: 'rgba(46,204,113,0.15)', color: '#2ecc71', border: 'rgba(46,204,113,0.3)' },
  pink: { bg: 'rgba(233,30,99,0.12)', color: '#e91e63', border: 'rgba(233,30,99,0.3)' },
  purple: { bg: 'rgba(156,39,176,0.12)', color: '#ab47bc', border: 'rgba(156,39,176,0.3)' },
  orange: { bg: 'rgba(255,152,0,0.15)', color: '#ffa726', border: 'rgba(255,152,0,0.3)' },
  teal: { bg: 'rgba(0,150,136,0.15)', color: '#26a69a', border: 'rgba(0,150,136,0.3)' },
}

export default function PackageCard({ pkg }) {
  const [hovered, setHovered] = useState(false)
  const [imageError, setImageError] = useState(false)
  const navigate = useNavigate()
  const badge = badgeColors[pkg.badgeColor] || badgeColors.amber
  const fallbackImage = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80'

  return (
    <div
      onClick={() => navigate(`/package/${pkg.slug}`)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: '#141920',
        border: `1px solid ${hovered ? 'rgba(212,137,26,0.35)' : 'rgba(255,255,255,0.07)'}`,
        borderRadius: '16px',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'transform 0.25s, border-color 0.25s, box-shadow 0.25s',
        transform: hovered ? 'translateY(-5px)' : 'none',
        boxShadow: hovered ? '0 20px 50px rgba(0,0,0,0.5)' : '0 4px 20px rgba(0,0,0,0.3)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div style={{ position: 'relative', height: '200px', overflow: 'hidden', flexShrink: 0 }}>
        <img
          src={imageError ? fallbackImage : pkg.imageUrl}
          alt={pkg.title}
          onError={() => setImageError(true)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.5s',
            transform: hovered ? 'scale(1.07)' : 'scale(1)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(20,25,32,0.7) 0%, transparent 50%)',
          }}
        />

        {pkg.badge && (
          <div
            style={{
              position: 'absolute',
              top: '12px',
              left: '12px',
              background: badge.bg,
              color: badge.color,
              border: `1px solid ${badge.border}`,
              fontSize: '10px',
              fontWeight: '700',
              padding: '4px 10px',
              borderRadius: '5px',
              letterSpacing: '0.7px',
              textTransform: 'uppercase',
            }}
          >
            {pkg.badge}
          </div>
        )}

        <div
          style={{
            position: 'absolute',
            bottom: '12px',
            right: '12px',
            background: 'rgba(12,15,21,0.8)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: '6px',
            padding: '4px 10px',
            fontSize: '11px',
            color: '#ffffff',
            fontWeight: '600',
          }}
        >
          {pkg.nights}N / {pkg.days}D
        </div>
      </div>

      <div style={{ padding: '18px', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <div
          style={{
            fontSize: '10px',
            fontWeight: '700',
            letterSpacing: '1.5px',
            textTransform: 'uppercase',
            color: '#d4891a',
            marginBottom: '6px',
          }}
        >
          {pkg.destination}
        </div>

        <div
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: '20px',
            fontWeight: '600',
            color: '#ffffff',
            lineHeight: '1.25',
            marginBottom: '10px',
          }}
        >
          {pkg.title}
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '14px' }}>
          {(pkg.tags || []).slice(0, 3).map((tag) => (
            <span
              key={tag}
              style={{
                background: 'rgba(212,137,26,0.1)',
                border: '1px solid rgba(212,137,26,0.2)',
                color: '#f0b445',
                fontSize: '11px',
                padding: '3px 9px',
                borderRadius: '4px',
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        <div
          style={{
            marginTop: 'auto',
            paddingTop: '14px',
            borderTop: '1px solid rgba(255,255,255,0.06)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
          }}
        >
          <div style={{ fontSize: '12px', color: '#7a8899' }}>Min {pkg.minPax} pax</div>
          <div
            style={{
              color: '#d4891a',
              border: '1px solid rgba(212,137,26,0.4)',
              borderRadius: '7px',
              padding: '6px 14px',
              fontSize: '12px',
              fontWeight: '700',
            }}
          >
            <a
              href="#enquiry"
              onClick={(event) => {
                event.stopPropagation()
                event.preventDefault()

                if (typeof window !== 'undefined' && window.location.pathname !== '/') {
                  window.location.href = '/#enquiry'
                  return
                }

                document.querySelector('#enquiry')?.scrollIntoView({ behavior: 'smooth' })
              }}
              style={{ color: 'inherit', textDecoration: 'none' }}
            >
              Enquire
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
