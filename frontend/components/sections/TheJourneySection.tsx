'use client'
import { useEffect, useRef } from 'react'
import { Experience, Education, Skill } from '@/lib/supabase'

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

  // 1. Dynamic Experience fallbacks
  const displayExperience = experience && experience.length > 0 ? experience : [
    {
      id: 'default-exp',
      role: 'Student',
      company: 'Fresher',
      description: 'Building end-to-end full stack web applications and exploring advanced AI/ML capabilities. Currently focusing on integrating modern front-end frameworks with robust back-end APIs to deliver scalable, real-world solutions.',
      start_date: '2023-01-01',
      end_date: null,
      is_current: true,
      technologies: [],
      company_url: '',
      logo_url: '',
      sort_order: 0
    }
  ]

  // 2. Dynamic Education fallbacks
  const displayEducation = education && education.length > 0 ? education : [
    {
      id: 'default-edu',
      degree: 'B.E-CSE',
      field: 'ARTIFICIAL INTELLIGENCE AND MACHINE LEARNING',
      institution: 'Arunai Engineering College',
      start_year: 2023,
      end_year: 2026
    }
  ]

  // 3. Dynamic Skills category grouping
  const categoriesMap: Record<string, string> = {
    frontend: 'Frontend',
    backend: 'Backend & Data',
    devops: 'AI/ML',
    design: 'Design',
    other: 'Tools'
  }

  const groupedMap: Record<string, string[]> = {}

  // Initialize display labels so they preserve a standard sorting order
  const displayLabels = ['Frontend', 'Backend & Data', 'AI/ML', 'Tools']
  displayLabels.forEach(label => {
    groupedMap[label] = []
  })

  if (skills && skills.length > 0) {
    skills.forEach(s => {
      const catKey = (s.category || 'other').toLowerCase()
      const label = categoriesMap[catKey] || catKey.toUpperCase()
      if (!groupedMap[label]) {
        groupedMap[label] = []
      }
      // Support database field maps for skill name (e.g. name or skill_name)
      const nameVal = s.name || (s as any).skill_name
      if (nameVal) groupedMap[label].push(nameVal)
    })
  }

  const skillGroups = Object.entries(groupedMap)
    .map(([name, list]) => ({ name, skills: list }))
    .filter(g => g.skills.length > 0)

  const displaySkills = skillGroups.length > 0 ? skillGroups : [
    { name: 'Frontend', skills: ['HTML5', 'CSS3', 'JavaScript', 'React.js', 'TypeScript', 'Next.js', 'Tailwind CSS'] },
    { name: 'Backend & Data', skills: ['Node.js', 'Express.js', 'Python', 'FastAPI', 'PostgreSQL', 'Supabase'] },
    { name: 'AI/ML', skills: ['Machine Learning', 'Scikit-learn', 'Pandas', 'NumPy', 'LLM APIs'] },
    { name: 'Tools', skills: ['Git', 'GitHub', 'Cloudinary', 'Vercel', 'Figma', 'Framer Motion'] }
  ]

  return (
    <section id="journey" className="py-20 md:py-32 px-6 md:px-12 relative overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <div ref={headRef} className="reveal text-center mb-16 md:mb-24">
          <p className="text-xs uppercase tracking-[0.3em] text-violet-400 font-mono mb-4 font-bold">
            The Journey
          </p>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight">
            Experience & Expertise
          </h2>
        </div>

        <div ref={contentRef} className="reveal reveal-delay-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {/* 1. EXPERIENCE */}
          <div className="glass-card flex flex-col p-6 sm:p-10 rounded-[24px] bg-slate-950/40 border border-white/5 relative overflow-hidden">
            <h3 className="font-display text-lg sm:text-xl font-bold text-white mb-8 flex items-center gap-3">
              <span className="text-lg text-violet-400">💼</span> Experience
            </h3>
            
            <div className="flex flex-col gap-8 flex-1">
              {displayExperience.map(exp => (
                <div key={exp.id}>
                  <h4 className="text-base sm:text-lg font-bold text-white mb-1">{exp.role}</h4>
                  <p className="text-xs sm:text-sm text-violet-300 font-semibold mb-3 tracking-wide">{exp.company}</p>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-normal">
                    {exp.description || (exp.role?.includes('Student') || exp.role?.includes('Fresher') ? "Building end-to-end full stack web applications and exploring advanced AI/ML capabilities. Currently focusing on integrating modern front-end frameworks with robust back-end APIs to deliver scalable, real-world solutions." : "")}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* 2. SKILLS */}
          <div className="glass-card flex flex-col p-6 sm:p-10 rounded-[24px] bg-slate-950/40 border border-white/5 relative overflow-hidden">
            <h3 className="font-display text-lg sm:text-xl font-bold text-white mb-8 flex items-center gap-3">
              <span className="text-lg text-violet-400">◈</span> Skills
            </h3>
            
            <div className="flex flex-col gap-6 flex-1">
              {displaySkills.map(group => (
                <div key={group.name}>
                  <h4 className="text-xs uppercase tracking-wider text-slate-500 mb-3 font-bold">{group.name}</h4>
                  <div className="flex flex-wrap gap-2">
                    {group.skills.map(skill => (
                      <span
                        key={skill}
                        className="px-3 py-1.5 text-xs font-semibold rounded-full
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
          <div className="glass-card flex flex-col p-6 sm:p-10 rounded-[24px] bg-slate-950/40 border border-white/5 relative overflow-hidden">
            <h3 className="font-display text-lg sm:text-xl font-bold text-white mb-8 flex items-center gap-3">
              <span className="text-lg text-violet-400">🎓</span> Education
            </h3>
            
            <div className="flex flex-col gap-8 flex-1">
              {displayEducation.map(edu => (
                <div key={edu.id}>
                  <div className="flex justify-between items-start gap-2 mb-2">
                    <h4 className="text-sm sm:text-base font-bold text-white leading-snug flex-1">{edu.degree}</h4>
                    <span className="text-[10px] sm:text-xs text-violet-400 font-mono font-bold bg-violet-500/10 px-2 py-0.5 rounded border border-violet-500/20 whitespace-nowrap">
                      {edu.start_year}—{edu.end_year || 'Present'}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-violet-300 font-semibold mb-2 tracking-wide">{edu.field}</p>
                  <p className="text-xs sm:text-sm text-slate-400 font-medium">{edu.institution}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default JourneySection;
