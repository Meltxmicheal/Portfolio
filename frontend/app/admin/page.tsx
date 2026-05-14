'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { api } from '@/lib/api'

export default function AdminDashboard() {
  const [stats, setStats] = useState({ projects: 0, skills: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const data = await api.getStats()
        setStats({ 
          projects: data.projects, 
          skills: data.skills
        })
      } catch (err) {
        console.error('Failed to load stats', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const cards = [
    { label: 'Total Projects', value: stats.projects, href: '/admin/projects', icon: '◫', color: 'rgba(124,58,237,0.2)', border: 'rgba(124,58,237,0.3)' },
    { label: 'Skills Listed', value: stats.skills, href: '/admin/skills', icon: '◈', color: 'rgba(37,99,235,0.2)', border: 'rgba(37,99,235,0.3)' },
    { label: 'Edit Profile', value: '→', href: '/admin/profile', icon: '◉', color: 'rgba(236,72,153,0.15)', border: 'rgba(236,72,153,0.25)' },
    { label: 'Live Site', value: '↗', href: '/', icon: '🌐', color: 'rgba(16,185,129,0.15)', border: 'rgba(16,185,129,0.25)' },
  ]

  const quickActions = [
    { label: 'Add Project', href: '/admin/projects?new=1', icon: '+' },
    { label: 'Edit Profile', href: '/admin/profile', icon: '◉' },
    { label: 'Add Skill', href: '/admin/skills?new=1', icon: '◈' },
    { label: 'View Portfolio', href: '/', icon: '↗' },
  ]

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 48 }}>
        <h1 className="font-display" style={{ fontSize: 32, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.03em', marginBottom: 8 }}>
          Mission Control
        </h1>
        <p style={{ fontSize: 14, color: '#64748b', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
          System Clock: {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* Stats grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 24, marginBottom: 48 }}>
        {cards.map(card => (
          <Link key={card.label} href={card.href} style={{ textDecoration: 'none' }}>
            <div className="glass-card" style={{ 
              padding: 32, borderRadius: 24, cursor: 'none', 
              background: 'rgba(15, 2, 40, 0.4)', 
              border: '1px solid rgba(255, 255, 255, 0.05)',
              boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
              position: 'relative', overflow: 'hidden'
            }}>
              <div style={{ position: 'absolute', top: 0, right: 0, width: '100%', height: '100%', background: `radial-gradient(circle at top right, ${card.color}, transparent 60%)`, opacity: 0.3 }} />
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, position: 'relative', zIndex: 1 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, color: 'var(--violet-glow)' }}>
                  {card.icon}
                </div>
              </div>
              <div className="font-display" style={{ fontSize: 40, fontWeight: 700, color: '#f8fafc', marginBottom: 8, position: 'relative', zIndex: 1 }}>
                {loading ? '—' : card.value}
              </div>
              <div style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 800, position: 'relative', zIndex: 1 }}>{card.label}</div>
            </div>
          </Link>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 32 }}>
        {/* Quick Operations (Moved to left for balance since Satellite Feed is gone) */}
        <div className="glass-card" style={{ padding: 40, borderRadius: 24, background: 'rgba(10, 1, 30, 0.4)', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: '#f8fafc', marginBottom: 32, letterSpacing: '-0.02em' }}>Quick Operations</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
            {quickActions.map(action => (
              <Link key={action.label} href={action.href} target={action.href === '/' ? '_blank' : undefined} style={{
                display: 'flex', alignItems: 'center', gap: 16, padding: '20px 24px',
                borderRadius: 16, textDecoration: 'none',
                background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.05)',
                color: '#94a3b8', fontSize: 15, transition: 'all 0.3s cubic-bezier(0.23, 1, 0.32, 1)',
                fontWeight: 700
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(124,58,237,0.1)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(124,58,237,0.3)'; (e.currentTarget as HTMLElement).style.color = '#f8fafc'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255, 255, 255, 0.02)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255, 255, 255, 0.05)'; (e.currentTarget as HTMLElement).style.color = '#94a3b8'; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)' }}>
                <span style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(124,58,237,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, color: 'var(--violet-glow)' }}>
                  {action.icon}
                </span>
                {action.label}
              </Link>
            ))}
          </div>
        </div>

        {/* System Status / Health */}
        <div className="glass-card" style={{ padding: 40, borderRadius: 24, alignSelf: 'start', background: 'rgba(10, 1, 30, 0.4)', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#f8fafc', marginBottom: 32, letterSpacing: '-0.02em' }}>System Status</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
               <span style={{ color: '#64748b', fontSize: 13 }}>Database</span>
               <span style={{ color: '#10b981', fontSize: 12, fontWeight: 700, textTransform: 'uppercase' }}>Online</span>
             </div>
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
               <span style={{ color: '#64748b', fontSize: 13 }}>Storage</span>
               <span style={{ color: '#10b981', fontSize: 12, fontWeight: 700, textTransform: 'uppercase' }}>Connected</span>
             </div>
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
               <span style={{ color: '#64748b', fontSize: 13 }}>API Layer</span>
               <span style={{ color: '#10b981', fontSize: 12, fontWeight: 700, textTransform: 'uppercase' }}>Stable</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  )
}
