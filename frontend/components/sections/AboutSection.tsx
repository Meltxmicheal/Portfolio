'use client'
import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Profile, Skill, Education, Experience } from '@/lib/supabase'

interface AboutProps {
  profile: Profile | null
  experience?: Experience[]
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

export default function AboutSection({ profile, experience }: AboutProps) {
  const headRef = useReveal()
  const bioRef = useReveal()

  // Unconditional hook calls for Framer Motion scroll and transform values to comply with Rules of Hooks
  const scrollInfo = useScroll({ target: bioRef, offset: ["start center", "end start"] })
  const transformY = useTransform(scrollInfo.scrollYProgress, [0.5, 1], [0, 100])
  const transformX = useTransform(scrollInfo.scrollYProgress, [0.5, 1], [0, 100])
  const transformScale = useTransform(scrollInfo.scrollYProgress, [0.5, 1], [1, 0.9])
  const transformFilter = useTransform(scrollInfo.scrollYProgress, [0.7, 1], ["blur(0px)", "blur(12px)"])
  const transformOpacity = useTransform(scrollInfo.scrollYProgress, [0.5, 1], [1, 0])

  const connectionY = useTransform(scrollInfo.scrollYProgress, [0, 1], [0, 300])
  const connectionX = useTransform(scrollInfo.scrollYProgress, [0, 1], [0, 300])
  const connectionOpacity = useTransform(scrollInfo.scrollYProgress, [0, 0.5, 1], [0, 1, 0])

  return (
    <section id="about" className="py-20 md:py-32 px-6 md:px-12 relative overflow-hidden" role="region" aria-label="About me section">
      {/* Blob */}
      <div className="blob" style={{ width: 400, height: 400, background: 'radial-gradient(circle, rgba(37,99,235,0.12) 0%, transparent 70%)', top: '10%', right: '-5%' }} />

      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div ref={headRef} className="reveal text-center mb-16 md:mb-24">
          <p className="text-xs uppercase tracking-[0.25em] text-slate-500 font-mono mb-4">
            About
          </p>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight">
            About Me
          </h2>
        </div>

        {/* Bio + photo */}
        <div ref={bioRef} className="reveal grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center mb-16 md:mb-24 relative">
          {/* Photo */}
          <div className="lg:col-span-5 flex justify-center w-full relative mb-12 lg:mb-0" style={{ perspective: 1000, zIndex: 10 }}>
            <div className="w-full max-w-[340px] sm:max-w-[400px] relative" style={{ animation: 'float 6s ease-in-out infinite' }}>
              <motion.div 
                style={{ 
                  position: 'relative', 
                  width: '100%', 
                  aspectRatio: '3/4.4', 
                  borderRadius: 24, 
                  overflow: 'hidden',
                  boxShadow: '0 20px 50px rgba(124,58,237,0.15)',
                  border: '1px solid rgba(124,58,237,0.1)',
                  // Sharp viewport focus, blur ONLY on exit
                  y: transformY,
                  x: transformX,
                  scale: transformScale,
                  filter: transformFilter,
                  opacity: transformOpacity,
                }}
              >
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(124,58,237,0.1), rgba(59,130,246,0.05))', zIndex: 1, mixBlendMode: 'multiply' }} />
                {profile?.avatar_url ? (
                  <Image 
                    src={profile.avatar_url} 
                    alt={`Portrait of ${profile.name}`} 
                    fill
                    sizes="(max-width: 768px) 80vw, 400px"
                    className="rounded-2xl object-cover"
                    style={{ objectFit: 'cover', objectPosition: 'center 15%' }} 
                    priority
                    loading="eager"
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

              {/* Floating card */}
              {(experience && experience.length > 0 || profile?.status_badge) && (
                <div className="glass-card absolute -bottom-6 -right-4 sm:-right-6 md:-right-8" style={{ 
                  padding: '16px 28px', borderRadius: 20, 
                  minWidth: 160, zIndex: 20, 
                  border: '1px solid rgba(255,255,255,0.1)', 
                  background: 'rgba(10, 1, 30, 0.75)', 
                  backdropFilter: 'blur(20px)',
                  boxShadow: '0 10px 40px rgba(0,0,0,0.3)' 
                }}>
                  <div style={{ fontSize: 20, fontWeight: 700, color: '#c4b5fd', fontFamily: 'Clash Display, sans-serif', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {experience && experience.length > 0 ? experience[0].role : profile?.status_badge}
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 600 }}>Current Status</div>
                </div>
              )}
            </div>
            
            {/* Animated Glow Trail Connection */}
            <motion.div 
              style={{
                position: 'absolute', top: '50%', left: '50%', width: '100%', height: '100%',
                background: 'radial-gradient(ellipse, rgba(124,58,237,0.2) 0%, rgba(59,130,246,0.1) 50%, transparent 70%)',
                filter: 'blur(60px)', zIndex: -1, pointerEvents: 'none',
                y: connectionY,
                x: connectionX,
                opacity: connectionOpacity,
              }}
            />
          </div>

          {/* Text */}
          <div className="lg:col-span-7 text-center lg:text-left flex flex-col items-center lg:items-start">
            <h3 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 tracking-tight leading-tight">
              Building the Future with AI
            </h3>
            <p className="text-base sm:text-lg text-slate-400 mb-8 max-w-2xl leading-relaxed font-normal">
              {profile?.about || 'I am a passionate AI & ML Engineering student with a focus on building intelligent systems and modern web applications. I love exploring the intersection of data science and full-stack development.'}
            </p>
            <div className="flex flex-col gap-4 mb-8 w-full max-w-md">
              {[
                { icon: '📍', label: profile?.location || 'San Francisco, CA' },
                { icon: '📧', label: profile?.email || 'michealjohnsonraj16@gmail.com' },
                { icon: '💼', label: experience && experience.length > 0 ? experience[0].company : 'Available' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 text-slate-300 justify-center lg:justify-start">
                  <span className="text-lg">{item.icon}</span>
                  <span className="font-medium text-sm sm:text-base">{item.label}</span>
                </div>
              ))}
            </div>

            {/* Resume download */}
            {profile?.resume_url && (
              <a href={profile.resume_url} download className="btn-primary inline-flex py-4 px-8 rounded-xl text-sm sm:text-base transition-all duration-300 shadow-lg shadow-violet-500/10">
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
