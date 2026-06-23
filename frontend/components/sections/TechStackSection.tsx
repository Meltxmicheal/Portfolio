'use client'
import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const techCategories = [
  {
    title: 'Frontend',
    skills: ['React', 'Next.js', 'TypeScript', 'Tailwind']
  },
  {
    title: 'Backend',
    skills: ['Node.js', 'FastAPI', 'Express']
  },
  {
    title: 'AI/ML',
    skills: ['Python', 'scikit-learn', 'OpenAI API', 'LangChain']
  },
  {
    title: 'Database',
    skills: ['Supabase', 'PostgreSQL', 'MongoDB']
  },
  {
    title: 'Tools',
    skills: ['Git', 'Vercel', 'Cloudinary', 'Figma']
  }
]

export default function TechStackSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section id="tech-stack" className="py-20 md:py-32 px-6 md:px-12 relative overflow-hidden" ref={ref}>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-xs uppercase tracking-[0.25em] text-slate-500 font-mono mb-4">
            Skills
          </p>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
            Tech Stack
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {techCategories.map((category, index) => (
            <motion.div 
              key={category.title}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex flex-col gap-4"
            >
              <h3 className="font-mono text-sm text-slate-400 uppercase tracking-wider">{category.title}</h3>
              <div className="flex flex-wrap gap-3">
                {category.skills.map(skill => (
                  <span 
                    key={skill}
                    className="font-mono"
                    style={{
                      background: 'var(--bg-surface, #13132A)',
                      border: '1px solid var(--border, #1E1E3F)',
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '13px',
                      color: 'var(--text-primary, #E8E8F0)'
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
