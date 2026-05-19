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

  // 1. Fresher Experience fallback
  const displayExperience = experience && experience.length > 0 ? experience : [
    {
      id: 'default-fresher',
      role: 'Fresher / AI-ML Student',
      company: 'Available for Opportunities',
      description: 'Passionate AI/ML and Full Stack developer focused on building modern web applications, intelligent systems, and real-world projects while continuously learning new technologies.',
      start_date: '2023-01-01',
      end_date: null,
      is_current: true,
      technologies: ['Open to Internships', 'Open to Freelance', 'Open to Collaborations'],
      company_url: '',
      logo_url: '',
      sort_order: 0
    }
  ]

  // 2. Academic timeline / education default values
  const displayEducation = education && education.length > 0 ? education : [
    {
      id: 'default-edu-college',
      degree: 'B.E CSE (AI & ML)',
      field: 'Arunai Engineering College',
      institution: 'ARTIFICIAL INTELLIGENCE AND MACHINE LEARNING',
      start_year: 2023,
      end_year: 2026,
      gpa: '8.5 CGPA (Current)',
      is_current: true,
      description: '',
      logo_url: '',
      sort_order: 0
    },
    {
      id: 'default-edu-12th',
      degree: '12th Standard',
      field: 'School Name',
      institution: 'Science Stream',
      start_year: 2021,
      end_year: 2022,
      gpa: '92%',
      is_current: false,
      description: '',
      logo_url: '',
      sort_order: 1
    },
    {
      id: 'default-edu-10th',
      degree: '10th Standard',
      field: 'School Name',
      institution: 'General Education',
      start_year: 2019,
      end_year: 2020,
      gpa: '95%',
      is_current: false,
      description: '',
      logo_url: '',
      sort_order: 2
    }
  ]

  // 3. Fresher dynamic Skill groupings with precise ordering
  const skillCategories = ['Frontend', 'Backend', 'AI/ML', 'Database', 'Tools', 'Extra Skills']
  const groupedMap: Record<string, string[]> = {}

  skillCategories.forEach(cat => {
    groupedMap[cat] = []
  })

  if (skills && skills.length > 0) {
    skills.forEach(s => {
      const catVal = s.category || ''
      // Try exact category match or case insensitive matching
      const targetCategory = skillCategories.find(c => c.toLowerCase() === catVal.toLowerCase()) || 'Extra Skills'
      const skillName = s.name || (s as any).skill_name
      if (skillName && groupedMap[targetCategory]) {
        groupedMap[targetCategory].push(skillName)
      }
    })
  }

  const skillGroups = Object.entries(groupedMap)
    .map(([name, list]) => ({ name, skills: list }))
    .filter(g => g.skills.length > 0)

  const displaySkills = skillGroups.length > 0 ? skillGroups : [
    { name: 'Frontend', skills: ['React.js', 'TypeScript', 'JavaScript', 'HTML5', 'CSS3'] },
    { name: 'Backend', skills: ['Node.js', 'Express.js'] },
    { name: 'AI/ML', skills: ['Python', 'AI', 'Machine Learning'] },
    { name: 'Database', skills: ['SQL', 'PostgreSQL', 'Supabase'] },
    { name: 'Tools', skills: ['GitHub', 'Figma', 'VS Code'] },
    { name: 'Extra Skills', skills: ['MS Word', 'Editing', 'AI Tools'] }
  ]

  return (
    <section id="journey" className="py-20 md:py-32 px-6 md:px-12 relative overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <div ref={headRef} className="reveal text-center mb-16 md:mb-24">
          <p className="text-xs uppercase tracking-[0.3em] text-violet-400 font-mono mb-4 font-bold">
            The Journey
          </p>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight">
            Academic & Tech Profile
          </h2>
        </div>

        <div ref={contentRef} className="reveal reveal-delay-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {/* 1. FRESHER EXPERIENCE */}
          <div className="glass-card flex flex-col p-6 sm:p-10 rounded-[24px] bg-slate-950/40 border border-white/5 relative overflow-hidden">
            <h3 className="font-display text-lg sm:text-xl font-bold text-white mb-8 flex items-center gap-3">
              <span className="text-lg text-violet-400">💼</span> Profile
            </h3>
            
            <div className="flex flex-col gap-6 flex-1 justify-center">
              {displayExperience.map(exp => (
                <div key={exp.id} className="flex flex-col gap-5">
                  <div className="flex items-center gap-2.5">
                    <span className={`w-2.5 h-2.5 rounded-full ${exp.is_current ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-rose-500 shadow-[0_0_8px_#f43f5e]'}`} />
                    <span className={`text-xs uppercase font-mono tracking-wider font-extrabold ${exp.is_current ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {exp.company || (exp.is_current ? 'Available' : 'Not Available')}
                    </span>
                  </div>

                  <h4 className="text-xl sm:text-2xl font-display font-bold text-white tracking-tight leading-snug">
                    {exp.role}
                  </h4>

                  <p className="text-sm text-slate-400 leading-relaxed font-normal">
                    {exp.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mt-2">
                    {(exp.technologies || []).map(tag => (
                      <span 
                        key={tag}
                        className="px-3.5 py-2 text-[11px] font-bold rounded-full
                                   bg-violet-500/10 border border-violet-500/20
                                   text-violet-300 hover:bg-violet-500/15 transition-all duration-200 cursor-default"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 2. DYNAMIC CATEGORIZED SKILLS */}
          <div className="glass-card flex flex-col p-6 sm:p-10 rounded-[24px] bg-slate-950/40 border border-white/5 relative overflow-hidden">
            <h3 className="font-display text-lg sm:text-xl font-bold text-white mb-8 flex items-center gap-3">
              <span className="text-lg text-violet-400">◈</span> Skills
            </h3>
            
            <div className="flex flex-col gap-6 flex-1 custom-scrollbar" style={{ maxHeight: 520, overflowY: 'auto', paddingRight: 4 }}>
              {displaySkills.map(group => (
                <div key={group.name} className="flex flex-col">
                  <h4 className="text-[10px] sm:text-xs uppercase tracking-wider text-slate-500 mb-3 font-extrabold">{group.name}</h4>
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

          {/* 3. TIMELINE ACADEMIC EDUCATION */}
          <div className="glass-card flex flex-col p-6 sm:p-10 rounded-[24px] bg-slate-950/40 border border-white/5 relative overflow-hidden">
            <h3 className="font-display text-lg sm:text-xl font-bold text-white mb-8 flex items-center gap-3">
              <span className="text-lg text-violet-400">🎓</span> Education
            </h3>
            
            <div className="flex flex-col gap-6 flex-1">
              {displayEducation.map(edu => (
                <div key={edu.id} className="relative pl-6 border-l border-white/10 hover:border-violet-500/30 transition-all duration-300 group">
                  <span className="absolute -left-1.5 top-1.5 w-3 h-3 rounded-full bg-slate-950 border-2 border-white/20 group-hover:border-violet-500 group-hover:bg-violet-500/20 transition-all duration-300" />
                  
                  <div className="flex justify-between items-start gap-2 mb-1">
                    <h4 className="text-sm sm:text-base font-bold text-white leading-snug flex-1 group-hover:text-violet-300 transition-colors duration-300">
                      {edu.degree}
                    </h4>
                    <span className="text-[9px] sm:text-[10px] text-violet-400 font-mono font-bold bg-violet-500/10 px-2 py-0.5 rounded border border-violet-500/20 whitespace-nowrap">
                      {edu.start_year}—{edu.end_year || 'Present'}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-violet-300 font-semibold mb-1 tracking-wide">{edu.field || edu.institution}</p>
                  <p className="text-xs text-slate-400 font-medium">{edu.institution || edu.field}</p>
                  
                  {edu.gpa && (
                    <div className="mt-2.5 text-[10px] sm:text-xs font-mono font-bold text-emerald-400 bg-emerald-500/5 border border-emerald-500/10 px-2 py-1 rounded w-fit">
                      {edu.gpa}
                    </div>
                  )}
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
