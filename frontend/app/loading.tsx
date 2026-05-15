export default function Loading() {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--void, #030014)',
        display: 'flex',
        flexDirection: 'column',
        gap: 0,
        overflow: 'hidden',
      }}
    >
      {/* Navbar skeleton */}
      <div style={{
        height: 68,
        background: 'rgba(10,10,25,0.8)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        display: 'flex',
        alignItems: 'center',
        padding: '0 24px',
        gap: 16,
      }}>
        <div className="skeleton-box" style={{ width: 42, height: 42, borderRadius: 14 }} />
        <div className="skeleton-box" style={{ width: 140, height: 18, borderRadius: 8 }} />
        <div style={{ flex: 1 }} />
        <div className="skeleton-box" style={{ width: 80, height: 36, borderRadius: 10 }} />
      </div>

      {/* Hero skeleton */}
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 32,
        padding: '100px 24px',
      }}>
        <div className="skeleton-box" style={{ width: 180, height: 32, borderRadius: 100 }} />
        <div className="skeleton-box" style={{ width: '60%', maxWidth: 600, height: 80, borderRadius: 12 }} />
        <div className="skeleton-box" style={{ width: '80%', maxWidth: 700, height: 24, borderRadius: 8 }} />
        <div className="skeleton-box" style={{ width: '65%', maxWidth: 550, height: 20, borderRadius: 8 }} />
        <div style={{ display: 'flex', gap: 16, marginTop: 16 }}>
          <div className="skeleton-box" style={{ width: 160, height: 52, borderRadius: 12 }} />
          <div className="skeleton-box" style={{ width: 140, height: 52, borderRadius: 12 }} />
        </div>
      </div>

      <style>{`
        .skeleton-box {
          background: linear-gradient(
            90deg,
            rgba(255,255,255,0.03) 0%,
            rgba(255,255,255,0.08) 40%,
            rgba(255,255,255,0.03) 80%
          );
          background-size: 200% 100%;
          animation: shimmer 1.6s ease-in-out infinite;
          border-radius: 8px;
        }
        @keyframes shimmer {
          0%   { background-position: -200% 0; }
          100% { background-position:  200% 0; }
        }
      `}</style>
    </div>
  )
}
