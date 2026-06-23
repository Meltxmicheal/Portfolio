'use client'

export default function Footer() {
  return (
    <footer style={{ 
      padding: '40px 24px', 
      borderTop: '1px solid var(--border)', 
      background: 'rgba(10, 10, 25, 0.4)', 
      backdropFilter: 'blur(24px)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
          <p style={{ fontSize: 14, color: 'var(--text-primary)', fontWeight: 600 }}>
            Built by Micheal Johnson Raj P
          </p>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 500 }}>
            Next.js · Supabase · Vercel
          </p>
        </div>
      </div>
    </footer>
  )
}
