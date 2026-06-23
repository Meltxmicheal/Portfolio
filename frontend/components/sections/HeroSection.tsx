'use client'
import { useEffect, useState } from 'react'
import { Profile, Experience, supabase } from '@/lib/supabase'

interface HeroProps { profile: Profile | null, experience?: Experience[] }

export default function HeroSection({ profile: initialProfile, experience }: HeroProps) {
  const [profile, setProfile] = useState(initialProfile)

  useEffect(() => { setProfile(initialProfile) }, [initialProfile])

  useEffect(() => {
    const channel = supabase.channel('schema-db-changes')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'profile' }, (payload) => {
        if (profile && payload.new.id === profile.id) {
          setProfile(payload.new as Profile)
        } else if (!profile) {
          setProfile(payload.new as Profile)
        }
      })
      .subscribe()
      
    return () => { supabase.removeChannel(channel) }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile?.id])

  return (
    <section
      style={{
        minHeight: '100vh', position: 'relative', display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        background: '#0a0a19', padding: '100px 24px',
        color: '#f8fafc',
      }}
    >
      <div style={{ maxWidth: 1200, width: '100%', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 2 }}>
        {/* Availability Badge */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          marginBottom: 32, padding: '6px 16px', borderRadius: '100px',
          background: 'transparent',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          animation: 'fadeUp 0.8s ease both',
        }}>
          <span style={{
            width: 6, height: 6, borderRadius: '50%',
            background: '#7B61FF', display: 'inline-block',
          }} />
          <span style={{ fontSize: 13, color: '#f8fafc', fontWeight: 500 }}>
            Open to internships · 2025
          </span>
        </div>

        {/* Name */}
        <h1 style={{
          fontSize: 'clamp(32px, 5vw, 64px)',
          fontWeight: 700, 
          lineHeight: 1.2,
          letterSpacing: '-0.02em',
          color: '#f8fafc',
          marginBottom: 24,
          textAlign: 'center',
          maxWidth: '800px',
          margin: '0 auto 24px',
          animation: 'fadeUp 0.8s 0.1s ease both'
        }}>
          Hi, I&apos;m Micheal — AI/ML & Full Stack Developer
        </h1>

        {/* Subtitle */}
        <div style={{
          fontSize: 'clamp(16px, 1.5vw, 20px)', lineHeight: 1.6, color: '#94a3b8',
          maxWidth: 680, margin: '0 auto 48px',
          animation: 'fadeUp 0.8s 0.2s ease both',
          fontWeight: 400,
          display: 'flex', flexDirection: 'column', gap: 8
        }}>
          <span>B.E. CSE (AI & ML) at Arunai Engineering College · Kallakurichi</span>
          <span>Building real projects with Next.js, Python & AI tools</span>
        </div>

        {/* CTA Buttons */}
        <div 
          style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16,
            animation: 'fadeUp 0.8s 0.3s ease both',
          }}
        >
          <a href="#projects" style={{ 
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            fontSize: 16, padding: '16px 36px', borderRadius: 8, 
            background: '#7B61FF', color: '#ffffff', fontWeight: 600, textDecoration: 'none',
            transition: 'opacity 0.2s'
          }} onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'} onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}>
            View My Projects &rarr;
          </a>
          <a href={profile?.resume_url || "#"} target="_blank" rel="noopener noreferrer" style={{ 
            fontSize: 14, color: '#94a3b8', textDecoration: 'none', fontWeight: 500,
            borderBottom: '1px solid transparent', paddingBottom: 2, transition: 'all 0.2s'
          }} onMouseEnter={(e) => {e.currentTarget.style.color = '#f8fafc'; e.currentTarget.style.borderBottomColor = '#f8fafc'}} onMouseLeave={(e) => {e.currentTarget.style.color = '#94a3b8'; e.currentTarget.style.borderBottomColor = 'transparent'}}>
            Download Resume
          </a>
        </div>
      </div>
    </section>
  )
}
