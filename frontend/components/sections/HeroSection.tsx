'use client'
import { useEffect, useRef } from 'react'
import { Profile } from '@/lib/supabase'

interface HeroProps { profile: Profile | null }

export default function HeroSection({ profile }: HeroProps) {
  const titleRef = useRef<HTMLHeadingElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const name = profile?.name || 'Alex Chen'
  const title = profile?.title || 'Full Stack Developer & Designer'
  const tagline = profile?.tagline || 'Crafting digital experiences that blur the line between art and technology'

  useEffect(() => {
    // Stagger in chars of title
    const el = titleRef.current
    if (!el) return
    const text = name.toUpperCase()
    el.innerHTML = text.split(' ').map((word) => {
      const chars = word.split('').map((char, i) => {
        return `<span class="char" style="display:inline-block;overflow:hidden;vertical-align:bottom;"><span class="char-inner" style="display:inline-block;animation:fadeUp 0.6s ${i * 0.05}s ease forwards;opacity:0;">${char}</span></span>`
      }).join('')
      return `<span class="word" style="display:inline-block;white-space:nowrap;margin: 0 0.12em;">${chars}</span>`
    }).join(' ')
  }, [name])

  // Parallax on mouse move
  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    const onMove = (e: MouseEvent) => {
      const { innerWidth: W, innerHeight: H } = window
      const x = (e.clientX / W - 0.5) * 20
      const y = (e.clientY / H - 0.5) * 15
      const blobs = container.querySelectorAll<HTMLElement>('.hero-blob')
      blobs.forEach((blob, i) => {
        const factor = (i + 1) * 0.2
        blob.style.transform = `translate(${x * factor}px, ${y * factor}px)`
      })
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  return (
    <section
      ref={containerRef}
      style={{
        minHeight: '100vh', position: 'relative', display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden', padding: '100px 24px',
      }}
    >
      {/* Background Blobs for depth */}
      <div className="hero-blob" style={{ position: 'absolute', top: '10%', left: '5%', width: 600, height: 600, background: 'radial-gradient(circle, rgba(124,58,237,0.1) 0%, transparent 70%)', filter: 'blur(80px)', zIndex: 1 }} />
      <div className="hero-blob" style={{ position: 'absolute', bottom: '10%', right: '5%', width: 500, height: 500, background: 'radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%)', filter: 'blur(80px)', zIndex: 1 }} />

      {/* Main content */}
      <div style={{ maxWidth: 1200, width: '100%', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 2 }}>
        {/* Badge */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12, marginBottom: 32, animation: 'fadeUp 0.8s ease forwards', background: 'rgba(124, 58, 237, 0.08)', padding: '8px 20px', borderRadius: '100px', border: '1px solid rgba(124, 58, 237, 0.2)' }}>
          <div className="pulse-dot" style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--violet-glow)', boxShadow: '0 0 12px var(--violet-glow)' }} />
          <span style={{ fontSize: 11, letterSpacing: '0.4em', textTransform: 'uppercase', color: 'var(--text-accent)', fontFamily: 'JetBrains Mono, monospace', fontWeight: 700 }}>
            System Online
          </span>
        </div>

        {/* Name */}
        <h1 ref={titleRef} className="font-display hero-name-text" style={{
          fontSize: 'clamp(28px, 6.5vw, 80px)',
          fontWeight: 900, 
          lineHeight: 1.1,
          letterSpacing: '-0.02em',
          color: '#FFFFFF',
          marginBottom: 32,
          textTransform: 'uppercase',
          textAlign: 'center',
          maxWidth: '100%',
          display: 'block',
          wordBreak: 'keep-all',
          overflowWrap: 'break-word',
          padding: '0 15px'
        }}>
          {name}
        </h1>

        {/* Title line */}
        <div style={{ marginBottom: 40, opacity: 0, animation: 'fadeUp 0.8s 0.6s ease forwards' }}>
          <span className="text-shimmer font-display" style={{ fontSize: 'clamp(18px, 3.5vw, 28px)', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#94a3b8' }}>
            {title}
          </span>
        </div>

        {/* Tagline */}
        <p style={{
          fontSize: 'clamp(15px, 1.1vw, 18px)', lineHeight: 1.7, color: '#94a3b8',
          maxWidth: 680, margin: '0 auto 56px',
          opacity: 0, animation: 'fadeUp 0.8s 0.8s ease forwards',
          fontWeight: 450
        }}>
          {tagline}
        </p>

        {/* CTA Buttons */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 24, flexWrap: 'wrap',
          opacity: 0, animation: 'fadeUp 0.8s 1s ease forwards',
        }}>
          <a href="#projects" className="btn-primary" style={{ fontSize: 16, padding: '16px 40px', borderRadius: 12 }}>
            View My Work
            <svg width="18" height="18" viewBox="0 0 16 16" fill="none" style={{ marginLeft: 8 }}>
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
          <a href="#contact" className="btn-ghost" style={{ fontSize: 16, padding: '15px 39px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)' }}>
            Get in Touch
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div style={{
        position: 'absolute', bottom: 36, left: '50%', transform: 'translateX(-50%)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
        opacity: 0, animation: 'fadeUp 1s 1.6s ease forwards',
      }}>
        <span style={{ fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Scroll</span>
        <div style={{ width: 1, height: 40, background: 'linear-gradient(180deg, var(--violet-glow), transparent)', animation: 'float 2s ease-in-out infinite' }} />
      </div>
    </section>
  )
}
