'use client'
import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Profile, Skill, Education, Experience } from '@/lib/supabase'

interface AboutProps {
  profile: Profile | null
}

function useReveal() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { el.classList.add('in-view'); obs.disconnect() }
    }, { threshold: 0.15 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return ref
}

const categoryColors: Record<string, string> = {
  frontend: 'rgba(124,58,237,0.15)',
  backend: 'rgba(37,99,235,0.15)',
  devops: 'rgba(6,182,212,0.15)',
  design: 'rgba(236,72,153,0.15)',
  other: 'rgba(100,116,139,0.15)',
}
const categoryBorder: Record<string, string> = {
  frontend: 'rgba(124,58,237,0.3)',
  backend: 'rgba(37,99,235,0.3)',
  devops: 'rgba(6,182,212,0.3)',
  design: 'rgba(236,72,153,0.3)',
  other: 'rgba(100,116,139,0.3)',
}

export default function AboutSection({ profile }: AboutProps) {
  const headRef = useReveal()
  const bioRef = useReveal()



  return (
    <section id="about" style={{ padding: '120px 24px', position: 'relative' }}>
      {/* Blob */}
      <div className="blob" style={{ width: 400, height: 400, background: 'radial-gradient(circle, rgba(37,99,235,0.12) 0%, transparent 70%)', top: '10%', right: '-5%' }} />

      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        {/* Section header */}
        <div ref={headRef} className="reveal" style={{ marginBottom: 72, textAlign: 'center' }}>
          <p style={{ fontSize: 12, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace', marginBottom: 16 }}>
            About
          </p>
          <h2 className="font-display" style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 700, letterSpacing: '-0.03em', color: 'var(--text-primary)' }}>
            About Me
          </h2>
        </div>

        {/* Bio + photo */}
        <div ref={bioRef} className="reveal" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center', marginBottom: 96, position: 'relative' }}>
          {/* Photo */}
          <div style={{ position: 'relative', perspective: 1000, zIndex: 10 }}>
            <div style={{ animation: 'float 6s ease-in-out infinite', width: '100%' }}>
              <motion.div 
                style={{ 
                  position: 'relative', width: '100%', maxWidth: 420, aspectRatio: '3/4', 
                  borderRadius: 24, overflow: 'hidden',
                  boxShadow: '0 20px 50px rgba(124,58,237,0.15)',
                  border: '1px solid rgba(124,58,237,0.1)',
                  // Sharp viewport focus, blur ONLY on exit
                  y: typeof window !== 'undefined' ? useTransform(useScroll({ target: bioRef, offset: ["start center", "end start"] }).scrollYProgress, [0.5, 1], [0, 100]) : 0,
                  x: typeof window !== 'undefined' ? useTransform(useScroll({ target: bioRef, offset: ["start center", "end start"] }).scrollYProgress, [0.5, 1], [0, 100]) : 0,
                  scale: typeof window !== 'undefined' ? useTransform(useScroll({ target: bioRef, offset: ["start center", "end start"] }).scrollYProgress, [0.5, 1], [1, 0.9]) : 1,
                  filter: typeof window !== 'undefined' ? useTransform(useScroll({ target: bioRef, offset: ["start center", "end start"] }).scrollYProgress, [0.7, 1], ["blur(0px)", "blur(12px)"]) : "blur(0px)",
                  opacity: typeof window !== 'undefined' ? useTransform(useScroll({ target: bioRef, offset: ["start center", "end start"] }).scrollYProgress, [0.5, 1], [1, 0]) : 1,
                }}
              >
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(124,58,237,0.1), rgba(59,130,246,0.05))', zIndex: 1, mixBlendMode: 'multiply' }} />
              {profile?.avatar_url ? (
                <Image 
                  src={profile.avatar_url.includes('/upload/') ? profile.avatar_url.replace('/upload/', '/upload/f_auto,q_auto,w_600,h_600,c_fill,g_face/') : profile.avatar_url} 
                  alt={profile.name} 
                  width={600}
                  height={600}
                  sizes="(max-width: 768px) 80vw, 300px"
                  className="rounded-2xl object-cover"
                  style={{ objectFit: 'cover' }} 
                  priority
                  unoptimized={true}
                />
              ) : (
                <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #f3f0ff, #e0e7ff)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
                    <circle cx="40" cy="30" r="16" stroke="var(--violet-glow)" strokeWidth="2" opacity="0.3"/>
                    <path d="M10 72 C10 54 70 54 70 72" stroke="var(--violet-glow)" strokeWidth="2" fill="none" opacity="0.3"/>
                  </svg>
                </div>
              )}
            </motion.div>
          </div>
            
            {/* Animated Glow Trail Connection */}
            <motion.div 
              style={{
                position: 'absolute', top: '50%', left: '50%', width: '100%', height: '100%',
                background: 'radial-gradient(ellipse, rgba(124,58,237,0.2) 0%, rgba(59,130,246,0.1) 50%, transparent 70%)',
                filter: 'blur(60px)', zIndex: -1, pointerEvents: 'none',
                y: typeof window !== 'undefined' ? useTransform(useScroll({ target: bioRef, offset: ["start center", "end start"] }).scrollYProgress, [0, 1], [0, 300]) : 0,
                x: typeof window !== 'undefined' ? useTransform(useScroll({ target: bioRef, offset: ["start center", "end start"] }).scrollYProgress, [0, 1], [0, 300]) : 0,
                opacity: typeof window !== 'undefined' ? useTransform(useScroll({ target: bioRef, offset: ["start center", "end start"] }).scrollYProgress, [0, 0.5, 1], [0, 1, 0]) : 0,
              }}
            />

            {/* Floating card */}
            <div className="glass-card" style={{ 
              position: 'absolute', bottom: -24, right: -24, 
              padding: '20px 32px', borderRadius: 20, 
              minWidth: 180, zIndex: 20, 
              border: '1px solid rgba(255,255,255,0.1)', 
              background: 'rgba(10, 1, 30, 0.6)', 
              backdropFilter: 'blur(20px)',
              boxShadow: '0 10px 40px rgba(0,0,0,0.3)' 
            }}>
              <div style={{ fontSize: 24, fontWeight: 700, color: '#c4b5fd', fontFamily: 'Clash Display, sans-serif', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {profile?.status_badge || 'Fresher'}
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 600 }}>Current Status</div>
            </div>
          </div>

          {/* Text */}
          <div>
            <h3 className="font-display" style={{ fontSize: 'clamp(28px, 4vw, 36px)', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 24, letterSpacing: '-0.03em' }}>
              Building the Future with AI
            </h3>
            <p style={{ fontSize: 'clamp(15px, 1.1vw, 17px)', lineHeight: 1.8, color: '#94a3b8', marginBottom: 32, fontWeight: 400 }}>
              {profile?.about || 'I am a passionate AI & ML Engineering student with a focus on building intelligent systems and modern web applications. I love exploring the intersection of data science and full-stack development.'}
            </p>
            <div style={{ display: 'grid', gap: 16, marginBottom: 40 }}>
              {[
                { icon: '📍', label: profile?.location || 'San Francisco, CA' },
                { icon: '📧', label: 'michealjohnsonraj16@gmail.com' },
                { icon: '💼', label: 'Open to Internships' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: 15, color: '#94a3b8' }}>
                  <span style={{ fontSize: 18 }}>{item.icon}</span>
                  <span style={{ fontWeight: 500 }}>{item.label}</span>
                </div>
              ))}
            </div>

            {/* Resume download */}
            {profile?.resume_url && (
              <a href={profile.resume_url} download className="btn-primary" style={{ display: 'inline-flex', padding: '16px 36px', borderRadius: 12, fontSize: 15 }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ marginRight: 10 }}>
                  <path d="M12 15V3M12 15L8 11M12 15L16 11M5 21H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Download Portfolio PDF
              </a>
            )}
          </div>
        </div>

      </div>
    </section>
  )
}
