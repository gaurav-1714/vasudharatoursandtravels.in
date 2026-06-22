import React, { useEffect, useState } from 'react'

// Automatically pull in every image dropped into src/assets/hero/
// Add or remove files in that folder — no code changes needed here.
const heroImageModules = import.meta.glob(
  '../assets/hero/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}',
  { eager: true, import: 'default' }
)

const HERO_IMAGES = Object.keys(heroImageModules)
  .sort()
  .map((key) => heroImageModules[key])

// Used only if the hero folder is empty.
const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1800&q=80'

const images = HERO_IMAGES.length > 0 ? HERO_IMAGES : [FALLBACK_IMAGE]

const ROTATE_INTERVAL_MS = 6000
const FADE_DURATION_MS = 1200

export default function RotatingHeroBackground({ alt = 'Himalayas' }) {
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    if (images.length <= 1) return
    const timer = setInterval(() => {
      setActiveIndex((current) => (current + 1) % images.length)
    }, ROTATE_INTERVAL_MS)
    return () => clearInterval(timer)
  }, [])

  return (
    <>
      {images.map((src, index) => (
        <img
          key={src}
          src={src}
          alt={alt}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            zIndex: 0,
            opacity: index === activeIndex ? 1 : 0,
            transition: `opacity ${FADE_DURATION_MS}ms ease-in-out`,
          }}
        />
      ))}
    </>
  )
}
