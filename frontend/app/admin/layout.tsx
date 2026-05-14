'use client'
import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'


const navItems = [
  { href: '/admin', label: 'Dashboard', icon: '⬡' },
  { href: '/admin/profile', label: 'Profile', icon: '◉' },
  { href: '/admin/featured-project', label: 'Featured Project', icon: '✦' },
  { href: '/admin/profile-info', label: 'Profile Information', icon: '◈' },
  { href: '/admin/projects', label: 'Projects', icon: '◫' },
  { href: '/admin/socials', label: 'Social Links', icon: '🖧' },
  { href: '/admin/media', label: 'Media & Assets', icon: '🖼️' },
  { href: '/admin/certificates', label: 'Certificates', icon: '◆' },
  { href: '/admin/experience', label: 'Experience', icon: '◎' },
]

import { api } from '@/lib/api'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    if (!token && pathname !== '/admin/login') {
      router.push('/admin/login')
      setLoading(false)
      return
    }

    if (token) {
      api.getMe()
        .then((data) => {
          setUser(data)
          setLoading(false)
        })
        .catch(() => {
          localStorage.removeItem('admin_token')
          if (pathname !== '/admin/login') router.push('/admin/login')
          setLoading(false)
        })
    } else {
      setLoading(false)
    }
  }, [pathname])

  const handleSignOut = () => {
    localStorage.removeItem('admin_token')
    router.push('/admin/login')
  }

  if (pathname === '/admin/login') return <>{children}</>
  if (loading) return (
    <div style={{ minHeight: '100vh', background: 'var(--void)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 40, height: 40, border: '3px solid rgba(124,58,237,0.1)', borderTopColor: 'var(--violet-glow)', borderRadius: '50%', animation: 'spin 1s cubic-bezier(0.4, 0, 0.2, 1) infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
  if (!user && pathname !== '/admin/login') return null

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: 'var(--void)' }}>
      {/* Sidebar */}
      <aside className="admin-sidebar" style={{
        width: 260,
        flexShrink: 0,
        position: 'fixed',
        top: 0,
        left: 0,
        bottom: 0,
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
        padding: '32px 20px',
        background: 'rgba(10, 1, 30, 0.4)',
        backdropFilter: 'blur(40px)',
        borderRight: '1px solid rgba(255, 255, 255, 0.05)',
        boxShadow: '20px 0 60px rgba(0,0,0,0.5)'
      }}>
        {/* Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none', marginBottom: 48, padding: '0 8px' }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, var(--violet-glow), var(--electric-blue))', border: '1px solid rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px rgba(124,58,237,0.3)' }}>
            <svg width="16" height="16" viewBox="0 0 14 14" fill="none">
              <path d="M1.5 12L7 1.5 12.5 12" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M3 9h8" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'Clash Display, sans-serif', letterSpacing: '0.02em' }}>MELTX</div>
            <div style={{ fontSize: 10, color: '#64748b', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 800 }}>Master Control</div>
          </div>
        </Link>

        {/* Nav */}
        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
          {navItems.map(item => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  padding: '14px 18px',
                  borderRadius: 14,
                  fontSize: 14,
                  fontWeight: 600,
                  color: isActive ? '#f8fafc' : '#94a3b8',
                  background: isActive ? 'rgba(124, 58, 237, 0.15)' : 'transparent',
                  transition: 'all 0.3s cubic-bezier(0.23, 1, 0.32, 1)',
                  border: isActive ? '1px solid rgba(124, 58, 237, 0.3)' : '1px solid transparent',
                  boxShadow: isActive ? '0 8px 16px -8px rgba(124, 58, 237, 0.4)' : 'none'
                }}
              >
                <span style={{ fontSize: 16, opacity: isActive ? 1 : 0.7 }}>{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* User info + sign out */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ padding: '12px 16px', borderRadius: 14, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ fontSize: 10, color: '#64748b', marginBottom: 4, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Identity</div>
            <div style={{ fontSize: 13, color: '#f8fafc', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: 600 }}>{user?.email}</div>
          </div>
          <button onClick={handleSignOut} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', borderRadius: 14, fontSize: 14, color: '#ef4444', background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.1)', width: '100%', transition: 'all 0.3s ease', fontWeight: 700, cursor: 'none' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(239,68,68,0.15)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(239,68,68,0.3)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(239,68,68,0.05)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(239,68,68,0.1)' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" strokeLinecap="round" strokeLinejoin="round" /></svg>
            Terminal Shutdown
          </button>
        </div>
      </aside>

      {/* Main */}
      <main style={{ marginLeft: 260, flex: 1, minHeight: '100vh', padding: '48px 60px' }}>
        {children}
      </main>
    </div>
  )
}
