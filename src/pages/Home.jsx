import React, { useEffect, useRef, useState } from 'react'
import EnquiryForm from '../components/EnquiryForm'
import Navbar from '../components/Navbar'
import PackageCard from '../components/PackageCard'
import { CATEGORIES, DESTINATIONS, PACKAGES, TESTIMONIALS } from '../lib/data'

const CONTACT_PHONE_DISPLAY = '+91 9046605444'
const CONTACT_PHONE_LINK = '+919046605444'
const CONTACT_EMAIL = 'vasudharatravel@gmail.com'
const CONTACT_ADDRESS = 'Park Tower, Mahishmari, Milan More Rd, Siliguri, West Bengal 734003'
const SOCIAL_LINKS = [
  { label: 'WhatsApp', href: 'https://wa.me/919046605444' },
  { label: 'Facebook', href: 'https://facebook.com/vasudharatoursandtravels' },
  { label: 'Instagram', href: 'https://instagram.com/vasudharatoursandtravels' },
]

function getWindowWidth() {
  return typeof window === 'undefined' ? 1200 : window.innerWidth
}

function useBreakpoint() {
  const [width, setWidth] = useState(getWindowWidth())

  useEffect(() => {
    const onResize = () => setWidth(window.innerWidth)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  return {
    isMobile: width < 640,
    isTablet: width < 1024,
  }
}

function useScrollReveal() {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 },
    )

    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return { ref, visible }
}

function Reveal({ children, delay = 0 }) {
  const { ref, visible } = useScrollReveal()

  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'none' : 'translateY(28px)',
        transition: `opacity 0.7s ${delay}ms ease, transform 0.7s ${delay}ms ease`,
      }}
    >
      {children}
    </div>
  )
}

function SectionHeader({ eyebrow, title, desc, center = false }) {
  return (
    <div style={{ textAlign: center ? 'center' : 'left', marginBottom: '40px' }}>
      <div style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '2.5px', textTransform: 'uppercase', color: '#d4891a', marginBottom: '10px' }}>{eyebrow}</div>
      <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(28px, 4vw, 46px)', fontWeight: '300', color: '#ffffff', lineHeight: '1.15', marginBottom: '12px' }}>{title}</h2>
      {desc && <p style={{ color: '#7a8899', fontSize: '15px', lineHeight: '1.7', maxWidth: center ? '520px' : '480px', margin: center ? '0 auto' : '0' }}>{desc}</p>}
    </div>
  )
}

export default function Home() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [searchDest, setSearchDest] = useState('')
  const [activeInfoPanel, setActiveInfoPanel] = useState(null)
  const { isMobile, isTablet } = useBreakpoint()

  const scrollToSection = (sectionId) => {
    document.querySelector(sectionId)?.scrollIntoView({ behavior: 'smooth' })
  }

  const openCategory = (categoryId) => {
    setActiveCategory(categoryId)
    scrollToSection('#packages')
  }

  const destinationLinks = [
    { label: 'Darjeeling Tours', category: 'darjeeling' },
    { label: 'Sikkim Packages', category: 'sikkim' },
    { label: 'Kalimpong Tours', category: 'kalimpong' },
    { label: 'Dooars Safari', category: 'dooars' },
    { label: 'Sandakphu Trek', category: 'trek' },
    { label: 'Pelling Retreat', category: 'honeymoon' },
  ]

  const quickLinks = [
    { label: 'All Packages', action: () => openCategory('all') },
    { label: 'About Us', action: () => scrollToSection('#about') },
    { label: 'Group Tours', action: () => openCategory('combo') },
    { label: 'Custom Trips', action: () => scrollToSection('#enquiry') },
    { label: 'Contact Us', action: () => scrollToSection('#enquiry') },
  ]

  const supportLinks = [
    { label: 'Customer Support', action: () => setActiveInfoPanel('support') },
    { label: 'Cancellation Policy', action: () => setActiveInfoPanel('cancellation') },
    { label: 'Terms and Conditions', action: () => setActiveInfoPanel('terms') },
    { label: 'Privacy Policy', action: () => setActiveInfoPanel('privacy') },
    { label: 'FAQs', action: () => setActiveInfoPanel('faq') },
  ]

  const infoPanels = {
    support: {
      title: 'Customer Support',
      body: `For trip planning, changes, and urgent travel help, call ${CONTACT_PHONE_DISPLAY} or email ${CONTACT_EMAIL}. We are happy to guide you before and during your trip.`,
    },
    cancellation: {
      title: 'Cancellation Policy',
      body: 'Cancellation charges depend on hotel, transport, and permit timelines. Contact us before travel changes and we will share the exact refund or reschedule options for your booking.',
    },
    terms: {
      title: 'Terms and Conditions',
      body: 'Trip plans, inclusions, hotel categories, permit availability, weather conditions, and transport timings are confirmed at booking time. Final travel documents should always be reviewed before departure.',
    },
    privacy: {
      title: 'Privacy Policy',
      body: 'Your enquiry details are used only for trip planning, follow-up, and customer support. We do not sell your personal information to third parties.',
    },
    faq: {
      title: 'Frequently Asked Questions',
      body: 'Most travellers ask about best season, permits, hotel options, payment schedule, pickup points, and custom itinerary changes. Send an enquiry and we will answer based on your travel plan.',
    },
  }

  const filteredPackages = PACKAGES.filter((item) => {
    const matchCategory = activeCategory === 'all' || item.category === activeCategory
    const q = searchDest.toLowerCase()
    const matchSearch = !q || item.destination.toLowerCase().includes(q) || item.title.toLowerCase().includes(q)
    return matchCategory && matchSearch
  })

  return (
    <div style={{ background: '#0c0f15', minHeight: '100vh' }}>
      <Navbar />

      <section style={{ position: 'relative', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: isMobile ? '100px 20px 60px' : '120px 40px 80px', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(12,15,21,0.3) 0%, rgba(12,15,21,0.15) 40%, rgba(12,15,21,0.75) 80%, #0c0f15 100%)', zIndex: 1 }} />
        <img src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1800&q=80" alt="Eastern Himalayas" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0 }} />

        <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', maxWidth: '780px', width: '100%' }}>
          <div style={{ display: 'inline-block', background: 'rgba(212,137,26,0.15)', border: '1px solid rgba(212,137,26,0.4)', color: '#f0b445', fontSize: '11px', fontWeight: '600', letterSpacing: '2px', textTransform: 'uppercase', padding: '6px 18px', borderRadius: '100px', marginBottom: '24px' }}>
            Siliguri-Based - Est. 2008
          </div>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(38px, 7vw, 82px)', fontWeight: '300', color: '#ffffff', lineHeight: '1.08', marginBottom: '20px', letterSpacing: '-0.02em' }}>
            Journeys into the
            <br />
            <em style={{ color: '#f0b445', fontStyle: 'normal' }}>Eastern Himalayas</em>
          </h1>
          <p style={{ color: 'rgba(184,196,212,0.85)', fontSize: isMobile ? '16px' : '18px', lineHeight: '1.65', marginBottom: '36px', fontWeight: '300' }}>
            Darjeeling tea gardens, Sikkim monasteries, and Dooars jungles crafted by local experts who know every turn of the route.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="#packages" onClick={(event) => { event.preventDefault(); document.querySelector('#packages')?.scrollIntoView({ behavior: 'smooth' }) }} style={{ background: '#d4891a', color: '#0c0f15', borderRadius: '10px', padding: '14px 32px', fontSize: '15px', fontWeight: '700', textDecoration: 'none' }}>
              Explore Packages
            </a>
            <a href="#enquiry" onClick={(event) => { event.preventDefault(); document.querySelector('#enquiry')?.scrollIntoView({ behavior: 'smooth' }) }} style={{ background: 'transparent', color: '#ffffff', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '10px', padding: '14px 32px', fontSize: '15px', fontWeight: '500', textDecoration: 'none' }}>
              Get Free Quote
            </a>
          </div>

          <div style={{ display: 'flex', gap: isMobile ? '24px' : '48px', justifyContent: 'center', flexWrap: 'wrap', marginTop: '56px' }}>
            {[
              ['15+', 'Years Experience'],
              ['5000+', 'Happy Travellers'],
              ['30+', 'Destinations'],
              ['4.9', 'Average Rating'],
            ].map(([number, label]) => (
              <div key={label} style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: isMobile ? '28px' : '36px', fontWeight: '700', color: '#ffffff', lineHeight: '1' }}>{number}</div>
                <div style={{ fontSize: '11px', color: '#7a8899', letterSpacing: '1px', textTransform: 'uppercase', marginTop: '4px' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="packages" style={{ padding: isMobile ? '60px 20px' : '80px 40px' }}>
        <div style={{ maxWidth: '1180px', margin: '0 auto' }}>
          <Reveal>
            <SectionHeader eyebrow="Our Curated Tours" title={<>Best Selling <em style={{ fontStyle: 'italic', color: '#f0b445' }}>Packages</em></>} desc="Carefully crafted tours from Siliguri into the Eastern Himalayas. Pricing is shared as a custom quote based on your dates and preferences." />
          </Reveal>

          <Reveal delay={100}>
            <div style={{ marginBottom: '20px' }}>
              <input type="text" placeholder="Search destination or package..." value={searchDest} onChange={(event) => setSearchDest(event.target.value)} style={{ width: '100%', maxWidth: '380px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '11px 16px', color: '#ffffff', fontSize: '14px', fontFamily: "'DM Sans', sans-serif", outline: 'none' }} />
            </div>
          </Reveal>

          <Reveal delay={150}>
            <div style={{ display: 'flex', gap: '8px', flexWrap: isMobile ? 'nowrap' : 'wrap', overflowX: isMobile ? 'auto' : 'visible', paddingBottom: isMobile ? '8px' : '0', marginBottom: '32px', scrollbarWidth: 'none' }}>
              {CATEGORIES.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '100px',
                    border: activeCategory === category.id ? '1px solid #d4891a' : '1px solid rgba(255,255,255,0.12)',
                    background: activeCategory === category.id ? '#d4891a' : 'transparent',
                    color: activeCategory === category.id ? '#0c0f15' : '#7a8899',
                    fontSize: '12px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {category.icon} {category.label}
                </button>
              ))}
            </div>
          </Reveal>

          {filteredPackages.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: '#7a8899' }}>No packages found for your search.</div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)', gap: '22px' }}>
              {filteredPackages.map((pkg, index) => (
                <Reveal key={pkg.id} delay={index * 60}>
                  <PackageCard pkg={pkg} />
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

      <section id="about" style={{ padding: isMobile ? '60px 20px' : '80px 40px', background: '#0e1219' }}>
        <div style={{ maxWidth: '1180px', margin: '0 auto' }}>
          <Reveal>
            <SectionHeader center eyebrow="Why Choose Vasudhara" title={<>Local Experts, <em style={{ fontStyle: 'italic', color: '#f0b445' }}>Real Journeys</em></>} desc="Born in Siliguri, the team understands the routes, the seasons, and the little details that shape a smooth mountain holiday." />
          </Reveal>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)', gap: '16px' }}>
            {[
              { title: '15+ Years Local', desc: 'Deep knowledge of every trail, route, and season' },
              { title: 'Fully Personalised', desc: 'Trips built around your dates, pace, and interests' },
              { title: 'Own Fleet', desc: 'Reliable transport without unnecessary middle layers' },
              { title: '24/7 Support', desc: 'Reachable support throughout the journey' },
            ].map((item, index) => (
              <Reveal key={item.title} delay={index * 80}>
                <div style={{ background: '#141920', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', padding: '24px 18px', textAlign: isMobile ? 'center' : 'left' }}>
                  <div style={{ fontSize: '15px', fontWeight: '700', color: '#ffffff', marginBottom: '8px' }}>{item.title}</div>
                  <div style={{ fontSize: '13px', color: '#7a8899', lineHeight: '1.6' }}>{item.desc}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="destinations" style={{ padding: isMobile ? '60px 20px' : '80px 40px' }}>
        <div style={{ maxWidth: '1180px', margin: '0 auto' }}>
          <Reveal>
            <SectionHeader eyebrow="Explore by Region" title={<>Top <em style={{ fontStyle: 'italic', color: '#f0b445' }}>Destinations</em></>} desc="From tea gardens to snow viewpoints, these are some of the most loved regions for Vasudhara travellers." />
          </Reveal>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)', gap: '14px' }}>
            {DESTINATIONS.map((destination, index) => (
              <Reveal key={destination.id} delay={index * 70}>
                <div onClick={() => { setActiveCategory(destination.id); document.querySelector('#packages')?.scrollIntoView({ behavior: 'smooth' }) }} style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', cursor: 'pointer', aspectRatio: isMobile ? '4/3' : '3/2' }}>
                  <img src={destination.imageUrl} alt={destination.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 55%)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '16px' }}>
                    <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: isMobile ? '18px' : '22px', fontWeight: '700', color: '#ffffff' }}>{destination.name}</div>
                    <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)' }}>{destination.pkgCount} packages - {destination.region}</div>
                    {destination.location?.mapUrl && (
                      <a href={destination.location.mapUrl} target="_blank" rel="noopener noreferrer" onClick={(event) => event.stopPropagation()} style={{ fontSize: '10px', color: '#d4891a', marginTop: '4px', textDecoration: 'none' }}>
                        View on map
                      </a>
                    )}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="testimonials" style={{ padding: isMobile ? '60px 20px' : '80px 40px', background: '#0e1219' }}>
        <div style={{ maxWidth: '1180px', margin: '0 auto' }}>
          <Reveal>
            <SectionHeader center eyebrow="Happy Travellers" title={<>What Our Guests <em style={{ fontStyle: 'italic', color: '#f0b445' }}>Say</em></>} />
          </Reveal>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)', gap: '18px' }}>
            {TESTIMONIALS.map((item, index) => (
              <Reveal key={item.id} delay={index * 80}>
                <div style={{ background: '#141920', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', padding: '24px', borderLeft: '3px solid #d4891a' }}>
                  <div style={{ color: '#d4891a', fontSize: '14px', marginBottom: '12px' }}>{'*'.repeat(item.rating)}</div>
                  <p style={{ color: '#7a8899', fontSize: '14px', lineHeight: '1.7', fontStyle: 'italic', marginBottom: '18px' }}>"{item.reviewText}"</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'linear-gradient(135deg, #d4891a, #b06010)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px', fontWeight: '700', color: '#0c0f15' }}>{item.avatarChar}</div>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: '700', color: '#ffffff' }}>{item.authorName}</div>
                      <div style={{ fontSize: '11px', color: '#7a8899' }}>{item.authorFrom} - {item.tripName}</div>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="enquiry" style={{ padding: isMobile ? '60px 20px' : '80px 40px', background: 'linear-gradient(135deg, #0c1a10 0%, #0a0d14 100%)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1.2fr', gap: isMobile ? '40px' : '64px', alignItems: 'start' }}>
          <div>
            <Reveal>
              <div style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '2.5px', textTransform: 'uppercase', color: '#d4891a', marginBottom: '10px' }}>Get a Free Quote</div>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(28px, 4vw, 46px)', fontWeight: '300', color: '#ffffff', lineHeight: '1.15', marginBottom: '16px' }}>
                Plan Your Dream
                <br />
                <em style={{ color: '#f0b445' }}>Himalayan Escape</em>
              </h2>
              <p style={{ color: '#7a8899', fontSize: '15px', lineHeight: '1.75', marginBottom: '28px' }}>
                Share your dates, destination ideas, and budget range. A tailored itinerary can be prepared within 24 hours.
              </p>
              {[
                'Free personalised itinerary',
                'Best stays at every budget',
                'Expert local guides',
                'Flexible planning support',
                'No hidden fees',
                'Responsive on-trip support',
              ].map((text) => (
                <div key={text} style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'rgba(255,255,255,0.85)', fontSize: '14px', marginBottom: '10px' }}>
                  <div style={{ width: '22px', height: '22px', background: 'rgba(212,137,26,0.15)', border: '1px solid rgba(212,137,26,0.35)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', color: '#d4891a', flexShrink: 0 }}>
                    +
                  </div>
                  {text}
                </div>
              ))}
              <div style={{ marginTop: '32px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <a href={`tel:${CONTACT_PHONE_LINK}`} style={{ color: '#f0b445', fontSize: '14px', textDecoration: 'none' }}>{CONTACT_PHONE_DISPLAY}</a>
                <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: '#f0b445', fontSize: '14px', textDecoration: 'none' }}>{CONTACT_EMAIL}</a>
                <div style={{ color: '#7a8899', fontSize: '13px' }}>{CONTACT_ADDRESS}</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '6px' }}>
                  {SOCIAL_LINKS.map((item) => (
                    <a
                      key={item.label}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: '#f0b445', fontSize: '13px', textDecoration: 'none' }}
                    >
                      {item.label}
                    </a>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>

          <Reveal delay={150}>
            <div style={{ background: '#141920', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: isMobile ? '24px' : '36px' }}>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '22px', fontWeight: '600', color: '#ffffff', marginBottom: '22px' }}>Enquire Now</div>
              <EnquiryForm />
            </div>
          </Reveal>
        </div>
      </section>

      <footer style={{ background: '#0a0c12', borderTop: '1px solid rgba(255,255,255,0.06)', padding: isMobile ? '40px 20px 0' : '56px 40px 0' }}>
        <div style={{ maxWidth: '1180px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : isTablet ? '1fr 1fr' : '2fr 1fr 1fr 1fr', gap: isMobile ? '28px' : '40px', paddingBottom: '40px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                <div style={{ width: '34px', height: '34px', background: '#d4891a', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Cormorant Garamond', serif", fontSize: '18px', fontWeight: '700', color: '#0c0f15' }}>V</div>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '16px', fontWeight: '700', color: '#ffffff' }}>Vasudhara Tour and Travels</div>
              </div>
              <p style={{ fontSize: '13px', color: '#7a8899', lineHeight: '1.7' }}>
                A trusted local travel partner for the Eastern Himalayas, built around careful planning and warm on-ground support.
              </p>
              <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <a href={`tel:${CONTACT_PHONE_LINK}`} style={{ color: '#f0b445', fontSize: '13px', textDecoration: 'none' }}>{CONTACT_PHONE_DISPLAY}</a>
                <div style={{ color: '#7a8899', fontSize: '13px', lineHeight: '1.6' }}>{CONTACT_ADDRESS}</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                  {SOCIAL_LINKS.map((item) => (
                    <a
                      key={item.label}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: '#f0b445', fontSize: '12px', textDecoration: 'none' }}
                    >
                      {item.label}
                    </a>
                  ))}
                </div>
              </div>
            </div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: '700', color: '#ffffff', marginBottom: '14px' }}>Destinations</div>
              {destinationLinks.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => openCategory(item.category)}
                  style={{ display: 'block', width: '100%', marginBottom: '8px', color: '#7a8899', fontSize: '13px', background: 'none', border: 'none', padding: 0, cursor: 'pointer', textAlign: 'left' }}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: '700', color: '#ffffff', marginBottom: '14px' }}>Quick Links</div>
              {quickLinks.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={item.action}
                  style={{ display: 'block', width: '100%', marginBottom: '8px', color: '#7a8899', fontSize: '13px', background: 'none', border: 'none', padding: 0, cursor: 'pointer', textAlign: 'left' }}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: '700', color: '#ffffff', marginBottom: '14px' }}>Support</div>
              {supportLinks.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={item.action}
                  style={{ display: 'block', width: '100%', marginBottom: '8px', color: '#7a8899', fontSize: '13px', background: 'none', border: 'none', padding: 0, cursor: 'pointer', textAlign: 'left' }}
                >
                  {item.label}
                </button>
              ))}
              <a href="/admin/login" style={{ display: 'inline-block', marginTop: '16px', color: '#7a8899', fontSize: '11px', textDecoration: 'none', opacity: '0.7' }}>
                Admin
              </a>
            </div>
          </div>
          <div style={{ padding: '20px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', fontSize: '12px', color: '#4a5568' }}>
            <div>(c) 2026 Vasudhara Tour and Travels. Siliguri, West Bengal.</div>
            <div>Built with React and ready for Vercel deployment.</div>
          </div>
        </div>
      </footer>

      {activeInfoPanel && infoPanels[activeInfoPanel] && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setActiveInfoPanel(null)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(6, 9, 14, 0.76)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
            zIndex: 200,
          }}
        >
          <div
            onClick={(event) => event.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: '560px',
              background: '#141920',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '18px',
              padding: isMobile ? '24px' : '30px',
              boxShadow: '0 32px 80px rgba(0,0,0,0.45)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', marginBottom: '18px' }}>
              <div>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '28px', fontWeight: '600', color: '#ffffff', lineHeight: '1.1' }}>
                  {infoPanels[activeInfoPanel].title}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveInfoPanel(null)}
                style={{ background: 'none', border: 'none', color: '#7a8899', fontSize: '22px', cursor: 'pointer' }}
              >
                x
              </button>
            </div>
            <p style={{ margin: 0, color: '#b8c4d4', fontSize: '14px', lineHeight: '1.8' }}>
              {infoPanels[activeInfoPanel].body}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
