import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import EnquiryForm from '../components/EnquiryForm'
import { PACKAGES } from '../lib/data'

function getWindowWidth() {
  return typeof window === 'undefined' ? 1200 : window.innerWidth
}

export default function PackageDetail() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [isMobile, setIsMobile] = useState(getWindowWidth() < 640)
  const [activeTab, setActiveTab] = useState('itinerary')
  const [imageIndex, setImageIndex] = useState(0)
  const pkg = PACKAGES.find((item) => item.slug === slug)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [slug])

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 640)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  if (!pkg) {
    return (
      <div style={{ minHeight: '100vh', background: '#0c0f15', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '20px' }}>
        <div style={{ color: '#ffffff', fontSize: '22px' }}>Package not found</div>
        <button onClick={() => navigate('/')} style={{ background: '#d4891a', color: '#0c0f15', border: 'none', borderRadius: '8px', padding: '10px 24px', cursor: 'pointer', fontWeight: '700' }}>
          Back to Home
        </button>
      </div>
    )
  }

  const allImages = [pkg.imageUrl, ...(pkg.gallery || [])].filter(Boolean)
  const tabs = ['itinerary', 'inclusions', 'highlights']

  return (
    <div style={{ background: '#0c0f15', minHeight: '100vh' }}>
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, padding: '16px 20px', background: 'rgba(12,15,21,0.95)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button onClick={() => navigate(-1)} style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', padding: '8px 14px', color: '#ffffff', fontSize: '13px', cursor: 'pointer' }}>
          Back
        </button>
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: isMobile ? '15px' : '18px', fontWeight: '600', color: '#ffffff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {pkg.title}
        </div>
      </div>

      <div style={{ paddingTop: '56px', position: 'relative', height: isMobile ? '280px' : '420px', overflow: 'hidden' }}>
        <img src={allImages[imageIndex]} alt={pkg.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(12,15,21,1) 0%, rgba(12,15,21,0.2) 50%, transparent 100%)' }} />

        {allImages.length > 1 && (
          <div style={{ position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '8px' }}>
            {allImages.map((_, index) => (
              <button key={index} onClick={() => setImageIndex(index)} style={{ width: index === imageIndex ? '20px' : '8px', height: '8px', borderRadius: '4px', background: index === imageIndex ? '#d4891a' : 'rgba(255,255,255,0.4)', border: 'none', cursor: 'pointer' }} />
            ))}
          </div>
        )}
      </div>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: isMobile ? '0 20px 60px' : '0 40px 80px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 380px', gap: isMobile ? '32px' : '48px', alignItems: 'start' }}>
          <div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '14px', marginTop: '-10px' }}>
              <span style={{ background: 'rgba(212,137,26,0.15)', border: '1px solid rgba(212,137,26,0.3)', color: '#d4891a', fontSize: '10px', fontWeight: '700', padding: '4px 12px', borderRadius: '100px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                {pkg.category}
              </span>
              {pkg.badge && <span style={{ background: 'rgba(255,255,255,0.08)', color: '#ffffff', fontSize: '10px', fontWeight: '600', padding: '4px 12px', borderRadius: '100px' }}>{pkg.badge}</span>}
            </div>

            <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: isMobile ? '30px' : '44px', fontWeight: '300', color: '#ffffff', lineHeight: '1.15', marginBottom: '12px' }}>{pkg.title}</h1>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginBottom: '16px' }}>
              <span style={{ fontSize: '13px', color: '#7a8899' }}>{pkg.destination}</span>
              <span style={{ fontSize: '13px', color: '#7a8899' }}>{pkg.nights} Nights / {pkg.days} Days</span>
              <span style={{ fontSize: '13px', color: '#7a8899' }}>Min {pkg.minPax} persons</span>
            </div>

            {pkg.location?.mapUrl && (
              <a href={pkg.location.mapUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(52,152,219,0.1)', border: '1px solid rgba(52,152,219,0.25)', borderRadius: '8px', padding: '8px 14px', color: '#5baddc', fontSize: '13px', textDecoration: 'none', marginBottom: '20px' }}>
                View location on Google Maps
              </a>
            )}

            <p style={{ fontSize: '15px', color: '#b8c4d4', lineHeight: '1.75', marginBottom: '28px' }}>{pkg.description}</p>

            <div style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', marginBottom: '24px', display: 'flex', overflowX: 'auto' }}>
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    padding: '10px 20px',
                    fontSize: '13px',
                    fontWeight: '600',
                    color: activeTab === tab ? '#d4891a' : '#7a8899',
                    background: 'none',
                    border: 'none',
                    borderBottom: `2px solid ${activeTab === tab ? '#d4891a' : 'transparent'}`,
                    marginBottom: '-1px',
                    cursor: 'pointer',
                    textTransform: 'capitalize',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>

            {activeTab === 'itinerary' && (
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {(pkg.itinerary || []).map((day, index) => (
                  <div key={index} style={{ display: 'flex', gap: '16px', paddingBottom: '20px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                      <div style={{ width: '32px', height: '32px', background: '#d4891a', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: '700', color: '#0c0f15' }}>{index + 1}</div>
                      {index < pkg.itinerary.length - 1 && <div style={{ width: '1px', flex: 1, background: 'rgba(212,137,26,0.2)', marginTop: '4px' }} />}
                    </div>
                    <div>
                      <div style={{ fontSize: '10px', fontWeight: '700', letterSpacing: '1px', color: '#d4891a', textTransform: 'uppercase', marginBottom: '4px' }}>{day.day}</div>
                      <div style={{ fontSize: '16px', fontWeight: '700', color: '#ffffff', marginBottom: '6px' }}>{day.title}</div>
                      <div style={{ fontSize: '13px', color: '#7a8899', lineHeight: '1.65' }}>{day.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'inclusions' && (
              <div>
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ fontSize: '12px', fontWeight: '700', color: '#2ecc71', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '12px' }}>Included</div>
                  <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '8px' }}>
                    {(pkg.inclusions || []).map((item) => (
                      <div key={item} style={{ fontSize: '13px', color: '#b8c4d4' }}>
                        + {item}
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '12px', fontWeight: '700', color: '#e05c6a', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '12px' }}>Not Included</div>
                  <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '8px' }}>
                    {(pkg.exclusions || []).map((item) => (
                      <div key={item} style={{ fontSize: '13px', color: '#b8c4d4' }}>
                        - {item}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'highlights' && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {(pkg.highlights || []).map((item) => (
                  <div key={item} style={{ background: 'rgba(212,137,26,0.1)', border: '1px solid rgba(212,137,26,0.2)', borderRadius: '8px', padding: '10px 16px', fontSize: '13px', color: '#f0b445', fontWeight: '500' }}>
                    {item}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ position: isMobile ? 'static' : 'sticky', top: '76px' }}>
            <div style={{ background: '#141920', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '18px', padding: isMobile ? '22px' : '28px' }}>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '20px', fontWeight: '600', color: '#ffffff', marginBottom: '6px' }}>Enquire About This Package</div>
              <div style={{ fontSize: '12px', color: '#7a8899', marginBottom: '20px' }}>Share your dates and preferences and our team will follow up soon.</div>
              <EnquiryForm prefilledDestination={pkg.destination} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
