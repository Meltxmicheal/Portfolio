'use client'
import { useEffect, useRef } from 'react'

function useReveal() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current; if (!el) return
    const obs = new IntersectionObserver(([e]) => { 
      if (e.isIntersecting) { 
        el.classList.add('in-view'); 
        obs.disconnect() 
      } 
    }, { threshold: 0.1 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return ref
}

export default function ThankYouSection() {
  const revealRef = useReveal()

  return (
    <section 
      style={{ 
        minHeight: '80vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        position: 'relative',
        padding: '120px 24px',
        overflow: 'hidden'
      }}
    >
      {/* Aurora Backgrounds */}
      <div className="blob animate-blob" style={{ width: 800, height: 800, background: 'radial-gradient(circle, rgba(124, 58, 237, 0.1) 0%, transparent 70%)', top: '-20%', left: '-20%', opacity: 0.6 }} />
      <div className="blob animate-blob animation-delay-4000" style={{ width: 700, height: 700, background: 'radial-gradient(circle, rgba(37, 99, 235, 0.08) 0%, transparent 70%)', bottom: '-20%', right: '-20%', opacity: 0.6 }} />

      <div 
        ref={revealRef} 
        className="reveal" 
        style={{ textAlign: 'center', zIndex: 10 }}
      >
        <h1 
          className="font-display" 
          style={{ 
            fontSize: 'clamp(60px, 15vw, 180px)', 
            fontWeight: 800, 
            letterSpacing: '-0.05em', 
            lineHeight: 0.9,
            marginBottom: '32px',
            color: 'var(--text-primary)',
            textShadow: '0 0 100px rgba(124,58,237,0.3)'
          }}
        >
          THANK YOU
        </h1>
        <p 
          style={{ 
            fontSize: 'clamp(16px, 1.4vw, 22px)', 
            color: '#94a3b8', 
            maxWidth: '700px', 
            margin: '0 auto',
            fontWeight: 400,
            letterSpacing: '0.02em',
            lineHeight: 1.6
          }}
        >
          For exploring my digital universe. I&apos;m currently open to new opportunities and creative collaborations. Let&apos;s build the future together.
        </p>
      </div>
    </section>
  )
}
