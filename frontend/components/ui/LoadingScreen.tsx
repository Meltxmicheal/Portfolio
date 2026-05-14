'use client'
import { useEffect, useState } from 'react'

export default function LoadingScreen() {
  const [progress, setProgress] = useState(0)
  const [phase, setPhase] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p: number) => {
        if (p >= 100) { clearInterval(interval); return 100 }
        return p + Math.random() * 12 + 3
      })
    }, 80)
    const phaseTimer = setTimeout(() => setPhase(1), 1000)
    return () => { clearInterval(interval); clearTimeout(phaseTimer) }
  }, [])

  return (
    <div className="loading-screen" style={{ zIndex: 99990 }}>
      {/* Ambient blobs */}
      <div className="blob" style={{ width: 400, height: 400, background: 'rgba(124,58,237,0.15)', top: '20%', left: '20%' }} />
      <div className="blob" style={{ width: 300, height: 300, background: 'rgba(37,99,235,0.12)', bottom: '20%', right: '20%', animationDelay: '2s' }} />

      <div className="relative z-10 flex flex-col items-center gap-8">
        {/* Logo mark */}
        <div className="relative">
          <div style={{
            width: 64, height: 64,
            border: '1.5px solid rgba(124,58,237,0.5)',
            borderRadius: 16,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(124,58,237,0.08)',
          }}>
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <path d="M4 24 L14 4 L24 24" stroke="url(#lg1)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M7 18 L21 18" stroke="url(#lg1)" strokeWidth="2.5" strokeLinecap="round"/>
              <defs>
                <linearGradient id="lg1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#a78bfa"/>
                  <stop offset="100%" stopColor="#60a5fa"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
          {/* Spinning ring */}
          <div style={{
            position: 'absolute', inset: -8,
            border: '1px solid transparent',
            borderTopColor: 'rgba(124,58,237,0.6)',
            borderRadius: '50%',
            animation: 'spin 1.2s linear infinite',
          }} />
        </div>

        {/* Brand name */}
        <div style={{ textAlign: 'center' }}>
          <p className="font-display" style={{ fontSize: 13, letterSpacing: '0.3em', color: 'rgba(167,139,250,0.7)', textTransform: 'uppercase' }}>
            Loading Portfolio
          </p>
        </div>

        {/* Progress bar */}
        <div style={{ width: 200, height: 1, background: 'rgba(255,255,255,0.06)', borderRadius: 1, overflow: 'hidden' }}>
          <div style={{
            height: '100%',
            width: `${Math.min(progress, 100)}%`,
            background: 'linear-gradient(90deg, #7c3aed, #3b82f6)',
            borderRadius: 1,
            transition: 'width 0.2s ease',
          }} />
        </div>

        <p style={{ fontSize: 11, color: 'rgba(148,163,184,0.4)', letterSpacing: '0.1em', fontFamily: 'JetBrains Mono, monospace' }}>
          {Math.min(Math.round(progress), 100)}%
        </p>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
