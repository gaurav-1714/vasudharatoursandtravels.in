import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const navLinks = [
  { href: '#packages', label: 'States' },
  { href: '#destinations', label: 'Destinations' },
  { href: '#testimonials', label: 'Reviews' },
  { href: '#enquiry', label: 'Contact' },
]

function getWindowWidth() {
  return typeof window === 'undefined' ? 1200 : window.innerWidth
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(getWindowWidth() < 768)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    const onResize = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      if (!mobile) {
        setOpen(false)
      }
    }

    onScroll()
    window.addEventListener('scroll', onScroll)
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  const handleNavClick = (href) => {
    setOpen(false)
    if (href.startsWith('#')) {
      document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <>
      <nav
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          padding: '0 20px',
          height: '64px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          transition: 'background 0.3s, backdrop-filter 0.3s, box-shadow 0.3s',
          background: scrolled || open ? 'rgba(12,15,21,0.95)' : 'transparent',
          backdropFilter: scrolled || open ? 'blur(20px)' : 'none',
          boxShadow: scrolled || open ? '0 1px 0 rgba(255,255,255,0.06)' : 'none',
        }}
      >
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }} onClick={() => setOpen(false)}>
          <div
            style={{
              width: '36px',
              height: '36px',
              background: '#d4891a',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '20px',
              fontWeight: '700',
              color: '#0c0f15',
            }}
          >
            V
          </div>
          <div>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '18px', fontWeight: '700', color: '#ffffff' }}>Vasudhara</div>
            <div style={{ fontSize: '10px', color: '#7a8899', letterSpacing: '0.5px' }}>Tour and Travels</div>
          </div>
        </Link>

        {!isMobile && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                style={{
                  padding: '7px 14px',
                  borderRadius: '8px',
                  color: '#b8c4d4',
                  fontSize: '13px',
                  fontWeight: '500',
                  textDecoration: 'none',
                }}
                onClick={(event) => {
                  event.preventDefault()
                  handleNavClick(link.href)
                }}
              >
                {link.label}
              </a>
            ))}
            <a
              href="#enquiry"
              onClick={(event) => {
                event.preventDefault()
                handleNavClick('#enquiry')
              }}
              style={{
                background: '#d4891a',
                color: '#0c0f15',
                borderRadius: '8px',
                padding: '9px 20px',
                fontSize: '13px',
                fontWeight: '700',
                textDecoration: 'none',
                display: 'inline-block',
                marginLeft: '8px',
              }}
            >
              Plan My Tour
            </a>
          </div>
        )}

        {isMobile && (
          <button
            type="button"
            style={{ background: 'none', border: 'none', display: 'flex', flexDirection: 'column', gap: '5px', padding: '6px', cursor: 'pointer' }}
            onClick={() => setOpen((value) => !value)}
            aria-label="Toggle menu"
          >
            {[0, 1, 2].map((index) => (
              <span
                key={index}
                style={{
                  display: 'block',
                  width: '22px',
                  height: '2px',
                  background: '#ffffff',
                  borderRadius: '2px',
                  transition: 'transform 0.25s, opacity 0.25s',
                  transform:
                    open && index === 0
                      ? 'rotate(45deg) translate(5px, 5px)'
                      : open && index === 2
                        ? 'rotate(-45deg) translate(5px, -5px)'
                        : 'none',
                  opacity: open && index === 1 ? 0 : 1,
                }}
              />
            ))}
          </button>
        )}
      </nav>

      {isMobile && (
        <div
          style={{
            position: 'fixed',
            top: '64px',
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(12,15,21,0.98)',
            backdropFilter: 'blur(20px)',
            display: 'flex',
            flexDirection: 'column',
            padding: '32px 24px',
            gap: '8px',
            transform: open ? 'translateX(0)' : 'translateX(100%)',
            transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            zIndex: 99,
          }}
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              style={{
                padding: '14px 0',
                fontSize: '22px',
                fontWeight: '500',
                fontFamily: "'Cormorant Garamond', serif",
                color: '#ffffff',
                textDecoration: 'none',
                borderBottom: '1px solid rgba(255,255,255,0.08)',
              }}
              onClick={(event) => {
                event.preventDefault()
                handleNavClick(link.href)
              }}
            >
              {link.label}
            </a>
          ))}
          <a
            href="#enquiry"
            style={{
              background: '#d4891a',
              color: '#0c0f15',
              borderRadius: '8px',
              textAlign: 'center',
              padding: '14px 20px',
              fontSize: '16px',
              fontWeight: '700',
              textDecoration: 'none',
              marginTop: '24px',
            }}
            onClick={(event) => {
              event.preventDefault()
              handleNavClick('#enquiry')
            }}
          >
            Plan My Tour
          </a>
        </div>
      )}
    </>
  )
}
