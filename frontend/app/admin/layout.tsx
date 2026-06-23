'use client'
import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { api } from '@/lib/api'
import './admin.css'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
    </svg>
  )},
  { href: '/admin/profile', label: 'Profile', icon: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
    </svg>
  )},
  { href: '/admin/projects', label: 'Projects', icon: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 7h20M2 12h20M2 17h20"/>
    </svg>
  )},
  { href: '/admin/experience', label: 'Availability', icon: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><path d="M12 8v4l2 2"/>
    </svg>
  )},
  { href: '/admin/socials', label: 'Social Links', icon: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
    </svg>
  )},
  { href: '/admin/certificates', label: 'Certificates', icon: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="6"/><path d="M9 18v4l3-1 3 1v-4"/>
    </svg>
  )},
  { href: '/admin/media', label: 'Media', icon: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
      <polyline points="21 15 16 10 5 21"/>
    </svg>
  )},
  { href: '/admin/featured-project', label: 'Featured', icon: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  )},
  { href: '/admin/settings', label: 'Settings', icon: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
    </svg>
  )},
]

const mobileNavItems = [
  { href: '/admin', label: 'Home', icon: '⬡' },
  { href: '/admin/profile', label: 'Profile', icon: '◉' },
  { href: '/admin/projects', label: 'Projects', icon: '◫' },
  { href: '/admin/media', label: 'Media', icon: '🖼' },
  { href: '/admin/settings', label: 'Settings', icon: '⚙' },
]

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
        .then((data) => { setUser(data); setLoading(false) })
        .catch(() => {
          localStorage.removeItem('admin_token')
          if (pathname !== '/admin/login') router.push('/admin/login')
          setLoading(false)
        })
    } else {
      setLoading(false)
    }
  }, [pathname, router])

  const handleSignOut = () => {
    localStorage.removeItem('admin_token')
    router.push('/admin/login')
  }

  if (pathname === '/admin/login') return <>{children}</>
  if (loading) return (
    <div className="admin-root" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 32, height: 32, border: '2px solid var(--admin-border)', borderTopColor: 'var(--admin-accent)', borderRadius: '50%', animation: 'admin-spin 0.8s linear infinite' }} />
      <style>{`@keyframes admin-spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
  if (!user && pathname !== '/admin/login') return null

  return (
    <div className="admin-root" style={{ minHeight: '100vh', display: 'flex' }}>
      {/* Sidebar */}
      <aside className="admin-sidebar" style={{
        width: 220,
        flexShrink: 0,
        position: 'fixed',
        top: 0, left: 0, bottom: 0,
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--admin-surface)',
        borderRight: '1px solid var(--admin-border)',
        overflow: 'hidden',
      }}>
        {/* Logo */}
        <div style={{ padding: '24px 20px 16px', borderBottom: '1px solid var(--admin-border)' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <div style={{
              width: 36, height: 36, borderRadius: 8,
              background: 'rgba(123,97,255,0.15)',
              border: '1px solid rgba(123,97,255,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--admin-accent)', fontSize: 15, fontWeight: 700, letterSpacing: '-0.02em'
            }}>
              MJ
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--admin-text-1)' }}>Meltx Micheal</div>
              <div style={{ fontSize: 10, color: 'var(--admin-text-3)', marginTop: 1 }}>Admin Panel</div>
            </div>
          </Link>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 2, overflowY: 'auto' }}>
          {navItems.map(item => {
            const isActive = item.href === '/admin' ? pathname === '/admin' : pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-item ${isActive ? 'active' : ''}`}
              >
                <span style={{ flexShrink: 0, opacity: isActive ? 1 : 0.6 }}>{item.icon}</span>
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Bottom: user + sign out */}
        <div style={{ padding: '16px', borderTop: '1px solid var(--admin-border)' }}>
          <div style={{ fontSize: 12, color: 'var(--admin-text-3)', marginBottom: 2, fontFamily: 'JetBrains Mono, monospace' }}>
            {user?.email}
          </div>
          <button
            onClick={handleSignOut}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: 'none', border: 'none', padding: '8px 0',
              fontSize: 13, color: 'var(--admin-text-2)',
              cursor: 'pointer', transition: 'color 0.15s', width: '100%', fontFamily: 'Inter, sans-serif'
            }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = 'var(--admin-danger)'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'var(--admin-text-2)'}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/>
            </svg>
            Sign out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="admin-main" style={{ marginLeft: 220, flex: 1, minHeight: '100vh', padding: '40px 48px', background: 'var(--admin-bg)' }}>
        {children}
      </main>

      {/* Mobile bottom nav */}
      <nav className="admin-bottom-nav">
        {mobileNavItems.map(item => {
          const isActive = item.href === '/admin' ? pathname === '/admin' : pathname.startsWith(item.href)
          return (
            <Link key={item.href} href={item.href} className={`admin-bottom-nav-item ${isActive ? 'active' : ''}`}>
              <span style={{ fontSize: 20 }}>{item.icon}</span>
              {item.label}
            </Link>
          )
        })}
      </nav>

      <style>{`
        @keyframes admin-spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}
