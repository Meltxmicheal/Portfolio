import Link from 'next/link'

export default function NotFound() {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#030014',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 24px',
      textAlign: 'center',
      fontFamily: "'DM Sans', sans-serif",
      color: '#f1f5f9',
      overflow: 'hidden',
      position: 'relative',
    }}>
      {/* Cinematic ambient glows */}
      <div style={{
        position: 'absolute', top: '20%', left: '15%',
        width: 500, height: 500, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%)',
        filter: 'blur(80px)', pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '20%', right: '10%',
        width: 400, height: 400, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(37,99,235,0.08) 0%, transparent 70%)',
        filter: 'blur(80px)', pointerEvents: 'none',
      }} />

      {/* Noise texture */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        opacity: 0.03, mixBlendMode: 'overlay',
      }} />

      <div style={{ position: 'relative', zIndex: 2, maxWidth: 600 }}>
        {/* Glitchy 404 */}
        <div style={{ position: 'relative', marginBottom: 32 }}>
          <p style={{
            fontSize: 'clamp(100px, 20vw, 180px)',
            fontWeight: 900,
            lineHeight: 1,
            letterSpacing: '-0.05em',
            fontFamily: "'Clash Display', 'DM Sans', sans-serif",
            background: 'linear-gradient(135deg, rgba(124,58,237,0.6) 0%, rgba(37,99,235,0.4) 50%, rgba(124,58,237,0.2) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            userSelect: 'none',
            animation: 'glitch404 8s ease-in-out infinite',
          }}>
            404
          </p>
        </div>

        {/* Status badge */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 10,
          padding: '8px 20px', borderRadius: 100,
          background: 'rgba(124,58,237,0.08)',
          border: '1px solid rgba(124,58,237,0.2)',
          marginBottom: 28,
        }}>
          <span style={{
            width: 8, height: 8, borderRadius: '50%',
            background: '#7c3aed',
            boxShadow: '0 0 10px rgba(124,58,237,0.8)',
            display: 'inline-block',
            animation: 'pulseDot 2s ease-in-out infinite',
          }} />
          <span style={{
            fontSize: 11, letterSpacing: '0.3em', textTransform: 'uppercase',
            color: '#a78bfa', fontFamily: 'monospace', fontWeight: 700,
          }}>
            Signal Lost
          </span>
        </div>

        <h1 style={{
          fontSize: 'clamp(24px, 4vw, 36px)',
          fontWeight: 800,
          lineHeight: 1.2,
          marginBottom: 16,
          letterSpacing: '-0.02em',
          color: '#f1f5f9',
        }}>
          Page Not Found
        </h1>
        <p style={{
          fontSize: 16, color: '#64748b', lineHeight: 1.7,
          marginBottom: 48, maxWidth: 440, margin: '0 auto 48px',
        }}>
          The coordinates you entered don&apos;t match any known sector. 
          This page may have been relocated or decommissioned.
        </p>

        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link
            href="/"
            style={{
              padding: '14px 36px', borderRadius: 12,
              background: 'linear-gradient(135deg, #7c3aed, #2563eb)',
              color: 'white', fontSize: 15, fontWeight: 700,
              textDecoration: 'none', display: 'inline-flex',
              alignItems: 'center', gap: 8,
              boxShadow: '0 8px 24px -8px rgba(124,58,237,0.5)',
              transition: 'all 0.3s ease',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
            </svg>
            Return to Base
          </Link>
          <Link
            href="/#projects"
            style={{
              padding: '13px 35px', borderRadius: 12,
              background: 'transparent',
              border: '1px solid rgba(255,255,255,0.1)',
              color: '#94a3b8', fontSize: 15, fontWeight: 600,
              textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8,
            }}
          >
            View Projects
          </Link>
        </div>
      </div>

      <style>{`
        @keyframes glitch404 {
          0%, 92%, 100% { transform: translate(0, 0); filter: none; }
          93% { transform: translate(-2px, 0); filter: hue-rotate(30deg); }
          94% { transform: translate(2px, 0); filter: hue-rotate(-30deg); }
          95% { transform: translate(0, 0); filter: none; }
          96% { transform: translate(-1px, 0); filter: brightness(1.3); }
          97% { transform: translate(0, 0); filter: none; }
        }
        @keyframes pulseDot {
          0%, 100% { opacity: 1; box-shadow: 0 0 10px rgba(124,58,237,0.8); }
          50% { opacity: 0.5; box-shadow: 0 0 20px rgba(124,58,237,0.4); }
        }
      `}</style>
    </div>
  )
}
