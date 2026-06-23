'use client'
import { useEffect, useState } from 'react'

export default function LoadingScreen() {
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 1200)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className={`loading-screen ${loaded ? 'hidden' : ''}`} style={{ zIndex: 99990, opacity: loaded ? 0 : 1, transition: 'opacity 0.4s ease', pointerEvents: loaded ? 'none' : 'auto' }}>
      {/* Ambient blobs */}
      <div className="blob" style={{ width: 400, height: 400, background: 'rgba(124,58,237,0.15)', top: '20%', left: '20%' }} />
      <div className="blob" style={{ width: 300, height: 300, background: 'rgba(37,99,235,0.12)', bottom: '20%', right: '20%', animationDelay: '2s' }} />

      <div className="relative z-10 flex flex-col items-center gap-8">
        <div style={{ textAlign: 'center' }}>
          <p className="font-display" style={{ fontSize: 48, letterSpacing: '0.1em', color: '#f8fafc', fontWeight: 700 }}>
            MJ
          </p>
        </div>
      </div>
    </div>
  )
}
