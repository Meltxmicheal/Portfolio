'use client'
import Link from 'next/link'

export default function ProjectsError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
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
    }}>
      {/* Ambient glow */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse at center, rgba(124,58,237,0.08) 0%, transparent 70%)',
      }} />

      <div style={{ position: 'relative', zIndex: 2, maxWidth: 560 }}>
        {/* Status */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 10,
          padding: '8px 20px', borderRadius: 100,
          background: 'rgba(239,68,68,0.08)',
          border: '1px solid rgba(239,68,68,0.2)',
          marginBottom: 32,
        }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#ef4444', boxShadow: '0 0 8px #ef4444', display: 'inline-block' }} />
          <span style={{ fontSize: 11, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#fca5a5', fontFamily: 'monospace', fontWeight: 700 }}>
            Failed to Load
          </span>
        </div>

        <h1 style={{
          fontSize: 'clamp(32px, 6vw, 56px)',
          fontWeight: 900,
          lineHeight: 1.1,
          marginBottom: 20,
          letterSpacing: '-0.02em',
        }}>
          Project Not Found
        </h1>

        <p style={{ fontSize: 16, color: '#64748b', lineHeight: 1.7, marginBottom: 40 }}>
          The project you&apos;re looking for doesn&apos;t exist or couldn&apos;t be loaded.
        </p>

        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={reset}
            style={{
              padding: '14px 32px', borderRadius: 12,
              background: 'linear-gradient(135deg, #7c3aed, #2563eb)',
              color: 'white', fontSize: 15, fontWeight: 700,
              border: 'none', cursor: 'pointer',
              fontFamily: 'inherit',
              transition: 'all 0.3s ease',
            }}
          >
            Try Again
          </button>
          <Link
            href="/"
            style={{
              padding: '13px 31px', borderRadius: 12,
              background: 'transparent',
              border: '1px solid rgba(255,255,255,0.1)',
              color: '#94a3b8', fontSize: 15, fontWeight: 600,
              textDecoration: 'none', display: 'inline-flex', alignItems: 'center',
            }}
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  )
}
