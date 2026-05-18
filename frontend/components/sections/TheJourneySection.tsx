'use client'
import { useEffect, useRef } from 'react'
import { Experience, Education, Skill } from '@/lib/supabase'
import { motion } from 'framer-motion'

const frontendSkills = ['HTML5', 'CSS3', 'JavaScript', 'React.js', 'TypeScript', 'Next.js', 'Tailwind CSS'];
const backendSkills = ['Node.js', 'Express.js', 'Python', 'FastAPI', 'PostgreSQL', 'Supabase'];
const aiSkills = ['Machine Learning', 'Scikit-learn', 'Pandas', 'NumPy', 'LLM APIs'];
const toolSkills = ['Git', 'GitHub', 'Cloudinary', 'Vercel', 'Figma', 'Framer Motion'];

const skillGroups = [
  { name: 'Frontend', skills: frontendSkills },
  { name: 'Backend & Data', skills: backendSkills },
  { name: 'AI/ML', skills: aiSkills },
  { name: 'Tools', skills: toolSkills }
];

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
                    {exp.description || (exp.role?.includes('Student') || exp.role?.includes('Fresher') ? "Building end-to-end full stack web applications and exploring advanced AI/ML capabilities. Currently focusing on integrating modern front-end frameworks with robust back-end APIs to deliver scalable, real-world solutions." : "")}
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
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24, flex: 1 }}>
              {skillGroups.map(group => (
                <div key={group.name}>
                  <h4 style={{ fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#64748b', marginBottom: 12, fontWeight: 700 }}>{group.name}</h4>
                  <div className="flex flex-wrap gap-2">
                    {group.skills.map(skill => (
                      <span
                        key={skill}
                        className="px-3 py-1.5 text-sm font-medium rounded-full
                                   bg-white/5 border border-white/10
                                   text-white/80 hover:bg-white/10
                                   hover:border-white/20 hover:text-white
                                   transition-all duration-200 cursor-default"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
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
