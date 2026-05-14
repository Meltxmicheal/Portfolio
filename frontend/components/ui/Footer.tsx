'use client'
interface FooterProps {
  socials?: {
    github?: string;
    linkedin?: string;
    email?: string;
    whatsapp?: string;
  } | null
}

export default function Footer({ socials }: FooterProps) {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer style={{ 
      padding: '80px 24px 40px', 
      borderTop: '1px solid var(--border)', 
      background: 'rgba(255, 255, 255, 0.4)', 
      backdropFilter: 'blur(24px)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background Glow */}
      <div style={{ position: 'absolute', bottom: '-10%', left: '50%', transform: 'translateX(-50%)', width: '60%', height: '40%', background: 'radial-gradient(ellipse, rgba(124, 58, 237, 0.05) 0%, transparent 70%)', filter: 'blur(60px)', zIndex: 0, pointerEvents: 'none' }} />

      <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 32 }}>
          {/* Logo / Brand */}
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              width: 44, height: 44, borderRadius: 12, 
              background: 'linear-gradient(135deg, var(--violet-glow), var(--electric-blue))', 
              border: '1px solid rgba(255,255,255,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 16px',
              boxShadow: '0 4px 12px rgba(124,58,237,0.2)'
            }}>
              <svg width="22" height="22" viewBox="0 0 18 18" fill="none">
                <path d="M2 16 L9 2 L16 16" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M4.5 11.5 L13.5 11.5" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
            </div>
            <h2 className="font-display" style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>Portfolio</h2>
          </div>

          {/* Social Links */}
          <div style={{ display: 'flex', gap: 24 }}>
            {socials?.github && (
              <a href={socials.github} target="_blank" rel="noopener" style={{ color: 'var(--text-secondary)', transition: 'all 0.3s ease', textDecoration: 'none', fontWeight: 500 }} onMouseEnter={e => e.currentTarget.style.color = 'var(--violet-glow)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}>
                GitHub
              </a>
            )}
            {socials?.linkedin && (
              <a href={socials.linkedin} target="_blank" rel="noopener" style={{ color: 'var(--text-secondary)', transition: 'all 0.3s ease', textDecoration: 'none', fontWeight: 500 }} onMouseEnter={e => e.currentTarget.style.color = 'var(--violet-glow)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}>
                LinkedIn
              </a>
            )}
            {socials?.email && (
              <a href={`mailto:${socials.email}`} style={{ color: 'var(--text-secondary)', transition: 'all 0.3s ease', textDecoration: 'none', fontWeight: 500 }} onMouseEnter={e => e.currentTarget.style.color = 'var(--violet-glow)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}>
                Email
              </a>
            )}
          </div>

          {/* Copyright */}
          <div style={{ width: '100%', height: 1, background: 'linear-gradient(90deg, transparent, var(--border), transparent)', margin: '8px 0' }} />
          
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 500 }}>
              © {currentYear} Designed & Built with passion.
            </p>
            <div style={{ display: 'flex', gap: 24, fontSize: 13, color: 'var(--text-muted)', fontWeight: 500 }}>
              <span>Next.js</span>
              <span>Express</span>
              <span>Supabase</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
