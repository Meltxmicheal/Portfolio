'use client'
import { useEffect, useRef } from 'react'
import { Experience, Education, Skill } from '@/lib/supabase'
import { motion } from 'framer-motion'

interface JourneyProps {
  experience: Experience[]
  skills: Skill[]
  education: Education[]
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

export function JourneySection({ experience, skills, education }: JourneyProps) {
  const headRef = useReveal()
  const contentRef = useReveal()

  return (
    <section id="journey" style={{ padding: '120px 24px', position: 'relative' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div ref={headRef} className="reveal" style={{ textAlign: 'center', marginBottom: 72 }}>
          <p style={{ fontSize: 12, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(167,139,250,0.6)', fontFamily: 'JetBrains Mono, monospace', marginBottom: 16, fontWeight: 700 }}>
            The Journey
          </p>
          <h2 className="font-display" style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 700, letterSpacing: '-0.04em', color: 'var(--text-primary)' }}>
            Experience & Expertise
          </h2>
        </div>

        <div ref={contentRef} className="reveal reveal-delay-2" style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
          gap: 32,
          alignItems: 'stretch'
        }}>
          {/* 1. EXPERIENCE */}
          <div className="glass-card" style={{ padding: 40, borderRadius: 24, display: 'flex', flexDirection: 'column', background: 'rgba(10, 1, 30, 0.4)', border: '1px solid rgba(255,255,255,0.05)' }}>
            <h3 className="font-display" style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 32, display: 'flex', alignItems: 'center', gap: 14 }}>
              <span style={{ fontSize: 20, color: 'var(--violet-glow)' }}>💼</span> Experience
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 32, flex: 1 }}>
              {experience.length > 0 ? experience.map(exp => (
                <div key={exp.id}>
                  <h4 style={{ fontSize: 19, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>{exp.role}</h4>
                  <p style={{ fontSize: 14, color: '#c4b5fd', fontWeight: 600, marginBottom: 14, letterSpacing: '0.02em' }}>{exp.company}</p>
                  <p style={{ fontSize: 14, color: '#94a3b8', lineHeight: 1.7, fontWeight: 400 }}>
                    {exp.description}
                  </p>
                </div>
              )) : (
                <p style={{ fontSize: 14, color: 'var(--text-muted)', fontStyle: 'italic' }}>Details coming soon...</p>
              )}
            </div>
          </div>

          {/* 2. SKILLS */}
          <div className="glass-card" style={{ padding: 40, borderRadius: 24, display: 'flex', flexDirection: 'column', background: 'rgba(10, 1, 30, 0.4)', border: '1px solid rgba(255,255,255,0.05)' }}>
            <h3 className="font-display" style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 32, display: 'flex', alignItems: 'center', gap: 14 }}>
              <span style={{ fontSize: 20, color: 'var(--violet-glow)' }}>◈</span> Skills
            </h3>
            
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignContent: 'flex-start', flex: 1 }}>
              {skills.length > 0 ? skills.map(skill => (
                <motion.div 
                  key={skill.id}
                  whileHover={{ scale: 1.05, y: -4, backgroundColor: 'rgba(124, 58, 237, 0.15)', borderColor: 'rgba(124, 58, 237, 0.4)' }}
                  style={{
                    padding: '10px 22px', borderRadius: 100,
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    fontSize: 13, color: '#94a3b8',
                    fontWeight: 600,
                    transition: 'all 0.4s cubic-bezier(0.23, 1, 0.32, 1)',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {skill.name || (skill as any).skill_name}
                </motion.div>
              )) : (
                <p style={{ fontSize: 14, color: 'var(--text-muted)', fontStyle: 'italic' }}>Learning new things...</p>
              )}
            </div>
          </div>

          {/* 3. EDUCATION */}
          <div className="glass-card" style={{ padding: 40, borderRadius: 24, display: 'flex', flexDirection: 'column', background: 'rgba(10, 1, 30, 0.4)', border: '1px solid rgba(255,255,255,0.05)' }}>
            <h3 className="font-display" style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 32, display: 'flex', alignItems: 'center', gap: 14 }}>
              <span style={{ fontSize: 20, color: 'var(--violet-glow)' }}>🎓</span> Education
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 32, flex: 1 }}>
              {education.length > 0 ? education.map(edu => (
                <div key={edu.id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                    <h4 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', flex: 1, lineHeight: 1.3 }}>{edu.degree}</h4>
                    <span style={{ fontSize: 11, color: 'var(--violet-glow)', fontFamily: 'JetBrains Mono, monospace', marginLeft: 12, fontWeight: 700, background: 'rgba(124, 58, 237, 0.1)', padding: '2px 8px', borderRadius: 4 }}>
                      {edu.start_year}—{edu.end_year || 'Present'}
                    </span>
                  </div>
                  <p style={{ fontSize: 14, color: '#c4b5fd', fontWeight: 600, marginBottom: 10, letterSpacing: '0.02em' }}>{edu.field}</p>
                  <p style={{ fontSize: 14, color: '#94a3b8', fontWeight: 400 }}>{edu.institution}</p>
                </div>
              )) : (
                <p style={{ fontSize: 14, color: 'var(--text-muted)', fontStyle: 'italic' }}>Graduating soon...</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default JourneySection;
