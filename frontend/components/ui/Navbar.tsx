'use client'
import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { CLOUDINARY_BASE_URL } from '@/lib/config'

import { Profile } from '@/lib/supabase'

const navLinks = [
  { label: 'About', href: '#about' },
  { label: 'Journey', href: '#journey' },
  { label: 'Projects', href: '#projects' },
  { label: 'Contact', href: '#contact' },
]

export default function Navbar({ profile }: { profile?: Profile | null }) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('')

  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach((e: any) => { if (e.isIntersecting) setActiveSection(e.target.id) })
      },
      { rootMargin: '-40% 0px -55% 0px' }
    )
    document.querySelectorAll('section[id]').forEach(s => observer.observe(s))
    return () => observer.disconnect()
  }, [])

  const handleNavClick = (e: React.MouseEvent, href: string) => {
    e.preventDefault()
    if (pathname !== '/') {
      router.push('/' + href)
    } else {
      const el = document.querySelector(href)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  return (
    <>
      <nav 
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 9000,
          padding: '0 24px',
          transition: 'all 0.4s cubic-bezier(0.23, 1, 0.32, 1)',
          background: scrolled ? 'rgba(10, 10, 25, 0.85)' : 'rgba(10, 10, 25, 0.55)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: scrolled ? '0 10px 40px rgba(0,0,0,0.4)' : 'none'
        }}
        role="navigation"
        aria-label="Main navigation"
      >
        <div style={{ maxWidth: 1200, margin: '0 auto', height: 68, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Logo */}
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none' }}>
            <div className="logo-glow-pulse" style={{
              width: 42, height: 42, borderRadius: '14px',
              border: '1px solid rgba(255,255,255,0.15)',
              boxShadow: '0 4px 20px rgba(124,58,237,0.4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.3s ease',
              overflow: 'hidden',
              background: 'var(--bg-card, rgba(10,10,25,0.8))'
            }}>
              <img 
                src={`${CLOUDINARY_BASE_URL}/image/upload/v1778765549/20260514_185944_bwzrqw.png`} 
                alt="Meltx Micheal Logo" 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
              />
            </div>
            <span className="font-display" style={{ fontSize: 18, fontWeight: 700, color: '#FFFFFF', letterSpacing: '-0.01em', textTransform: 'uppercase' }}>
              MELTX MICHEAL
            </span>
          </Link>

          {/* Desktop Nav */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }} className="hidden-mobile">
            {navLinks.map(link => {
              const isActive = activeSection === link.href.slice(1);
              return (
                <a
                  key={link.href}
                  href={`/${link.href}`}
                  onClick={(e) => handleNavClick(e, link.href)}
                  style={{
                    padding: '8px 18px',
                    borderRadius: 10,
                    fontSize: 14,
                    fontWeight: isActive ? 700 : 600,
                    textDecoration: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.3s cubic-bezier(0.23, 1, 0.32, 1)',
                    color: isActive ? '#FFFFFF' : '#94a3b8',
                    background: isActive ? 'rgba(124, 58, 237, 0.15)' : 'transparent',
                    textShadow: isActive ? '0 0 15px rgba(124, 58, 237, 0.5)' : 'none',
                    border: isActive ? '1px solid rgba(124, 58, 237, 0.2)' : '1px solid transparent'
                  }}
                  onMouseEnter={e => {
                    if (!isActive) {
                      e.currentTarget.style.color = '#FFFFFF';
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                    }
                  }}
                  onMouseLeave={e => {
                    if (!isActive) {
                      e.currentTarget.style.color = '#94a3b8';
                      e.currentTarget.style.background = 'transparent';
                    }
                  }}
                >
                  {link.label}
                </a>
              );
            })}
          </div>

          {/* CTA */}
          <div className="hidden-mobile" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            {profile?.resume_url && (
              <a href={profile.resume_url} target="_blank" rel="noopener noreferrer" style={{ fontSize: 13, fontWeight: 600, color: '#FFFFFF', textDecoration: 'none' }}>
                Resume
              </a>
            )}
            <a href="#contact" style={{ fontSize: 13, padding: '8px 20px', borderRadius: 100, fontWeight: 600, border: '1px solid rgba(255,255,255,0.2)', color: '#FFFFFF', textDecoration: 'none' }}>
              Hire me
            </a>
          </div>
          {/* Mobile Menu Toggle */}
          <div className="mobile-toggle" style={{ display: 'none', alignItems: 'center', cursor: 'pointer', zIndex: 9001 }} onClick={() => setMenuOpen(!menuOpen)}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              {menuOpen ? <path d="M18 6L6 18M6 6l12 12" /> : <path d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </div>
        </div>

        {/* Mobile Nav Drawer */}
        <div className={`mobile-nav ${menuOpen ? 'open' : ''}`} style={{
          position: 'fixed', top: 0, right: 0, bottom: 0, width: '100vw',
          background: 'rgba(10, 10, 25, 0.98)', backdropFilter: 'blur(20px)',
          padding: '100px 24px 24px', display: 'flex', flexDirection: 'column', gap: 24,
          transform: menuOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.4s cubic-bezier(0.23, 1, 0.32, 1)',
          zIndex: 9000
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {navLinks.map(link => {
              const isActive = activeSection === link.href.slice(1);
              return (
                <a
                  key={link.href}
                  href={`/${link.href}`}
                  onClick={(e) => { setMenuOpen(false); handleNavClick(e, link.href); }}
                  style={{
                    fontSize: 28, fontWeight: 500, textDecoration: 'none',
                    color: isActive ? '#FFFFFF' : '#94a3b8',
                    padding: '20px 0', borderBottom: '1px solid rgba(255,255,255,0.05)'
                  }}
                >
                  {link.label}
                </a>
              );
            })}
          </div>

          {/* Mobile CTA Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 'auto', paddingBottom: 24 }}>
            {profile?.resume_url && (
              <a 
                href={profile.resume_url} 
                target="_blank" 
                rel="noopener noreferrer" 
                style={{ justifyContent: 'center', display: 'flex', alignItems: 'center', padding: '16px', fontSize: 16, borderRadius: 100, border: '1px solid rgba(255,255,255,0.2)', color: '#FFFFFF', textDecoration: 'none', fontWeight: 600 }}
              >
                Resume
              </a>
            )}
            <a 
              href="#contact" 
              onClick={() => setMenuOpen(false)} 
              style={{ justifyContent: 'center', display: 'flex', alignItems: 'center', padding: '16px', fontSize: 16, borderRadius: 100, border: '1px solid rgba(255,255,255,0.2)', color: '#FFFFFF', textDecoration: 'none', fontWeight: 600 }}
            >
              Hire me
            </a>
          </div>
        </div>
      </nav>

      {/* Overlay */}
      {menuOpen && (
        <div 
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 8999, backdropFilter: 'blur(4px)' }} 
          onClick={() => setMenuOpen(false)} 
        />
      )}

      <style>{`
        @media (max-width: 768px) { 
          .hidden-mobile { display: none !important; } 
          .mobile-toggle { display: flex !important; }
        }
      `}</style>
    </>
  )
}
