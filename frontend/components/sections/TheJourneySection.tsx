'use client'
import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const timeline = [
  {
    year: '2023–2027',
    institution: 'Arunai Engineering College',
    degree: 'B.E. CSE (AI & ML)',
    grade: '7.5 CGPA',
    accent: true
  },
  {
    year: '2025',
    institution: 'IBM',
    degree: 'Certification',
    grade: 'Completed',
    accent: false
  },
  {
    year: '2024',
    institution: 'TANSAM',
    degree: 'Certification',
    grade: 'Completed',
    accent: false
  },
  {
    year: '2022–2023',
    institution: 'HSC',
    degree: 'Higher Secondary',
    grade: '76%',
    accent: false
  }
]

export default function TheJourneySection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section id="journey" className="py-20 md:py-32 px-6 md:px-12 relative overflow-hidden" ref={ref}>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16 md:mb-24">
          <p className="text-xs uppercase tracking-[0.25em] text-slate-500 font-mono mb-4">
            Timeline
          </p>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight">
            My Journey
          </h2>
        </div>

        <div className="relative pl-6 md:pl-0">
          {/* Vertical line */}
          <div className="absolute left-[20px] md:left-1/2 top-0 bottom-0 w-[1px] bg-white/10 md:-ml-[0.5px]" />

          <div className="flex flex-col gap-12">
            {timeline.map((item, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className={`relative flex flex-col md:flex-row items-start md:items-center w-full ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
              >
                {/* Dot */}
                <div className={`absolute left-[-26px] md:left-1/2 md:-ml-[6px] top-1 md:top-auto w-3 h-3 rounded-full border-2 ${item.accent ? 'bg-[#0A0A19] border-[#7B61FF] shadow-[0_0_10px_rgba(124,58,237,0.5)]' : 'bg-[#0A0A19] border-white/30'} z-10`} />

                {/* Content */}
                <div className={`w-full md:w-1/2 flex flex-col ${index % 2 === 0 ? 'md:pl-12' : 'md:pr-12 md:items-end md:text-right'}`}>
                  <span className="font-mono text-xs text-slate-400 mb-2 bg-[#13132A] border border-[#1E1E3F] px-3 py-1 rounded-full w-fit">
                    {item.year}
                  </span>
                  <h3 className="text-xl font-bold text-white mb-1">{item.institution}</h3>
                  <div className={`flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-3 flex-wrap ${index % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}>
                    <p className="text-slate-300">{item.degree}</p>
                    <span 
                      className="font-mono text-[11px] font-bold tracking-wide"
                      style={{ 
                        border: '1px solid #7B61FF', 
                        borderRadius: '10px', 
                        padding: '2px 8px', 
                        color: '#7B61FF',
                        background: 'rgba(124,58,237,0.1)'
                      }}
                    >
                      {item.grade}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
