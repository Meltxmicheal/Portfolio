'use client'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Project } from '@/lib/supabase'

interface ProjectsProps { 
  projects: Project[]
  title?: string
}

function useReveal() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current; if (!el) return
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { el.classList.add('in-view'); obs.disconnect() } }, { threshold: 0.1 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return ref
}

const categoryLabels: Record<string, string> = {
  all: 'All', web: 'Web Apps', ai: 'AI/ML', mobile: 'Mobile', tool: 'Tools', design: 'Design',
}

const gradients = [
  'linear-gradient(135deg, rgba(124,58,237,0.4), rgba(37,99,235,0.3))',
  'linear-gradient(135deg, rgba(37,99,235,0.4), rgba(6,182,212,0.3))',
  'linear-gradient(135deg, rgba(236,72,153,0.3), rgba(124,58,237,0.3))',
  'linear-gradient(135deg, rgba(6,182,212,0.3), rgba(37,99,235,0.3))',
]

export default function ProjectsSection({ projects, title: sectionTitle }: ProjectsProps) {
  const headRef = useReveal()
  const [filter, setFilter] = useState('all')
  const categories = ['all', ...Array.from(new Set(projects.map(p => p.category)))]
  const filtered = filter === 'all' ? projects : projects.filter(p => p.category === filter)

  return (
    <section id="projects" style={{ padding: '120px 24px', position: 'relative', background: 'transparent' }}>
      <div className="blob" style={{ width: 500, height: 500, background: 'radial-gradient(circle, rgba(124,58,237,0.05) 0%, transparent 70%)', top: '20%', left: '-10%' }} />

      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        {/* Header */}
        <div ref={headRef} className="reveal" style={{ textAlign: 'center', marginBottom: 56 }}>
          <p style={{ fontSize: 12, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(167,139,250,0.7)', fontFamily: 'JetBrains Mono, monospace', marginBottom: 16 }}>
            Work
          </p>
          <h2 className="font-display" style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 700, letterSpacing: '-0.03em', color: '#f1f5f9', marginBottom: 16 }}>
            {sectionTitle || 'My Works'}
          </h2>
          <p style={{ fontSize: 15, color: '#64748b', maxWidth: 640, margin: '0 auto', lineHeight: 1.6 }}>
            A collection of AI/ML, full-stack, and modern web applications built through hands-on learning and real-world development.
          </p>
        </div>

        {/* Filter tabs */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 56, flexWrap: 'wrap' }}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              style={{
                padding: '8px 20px', borderRadius: 100, fontSize: 13, fontWeight: 500,
                border: `1px solid ${filter === cat ? 'rgba(124,58,237,0.5)' : 'rgba(255,255,255,0.06)'}`,
                background: filter === cat ? 'rgba(124,58,237,0.15)' : 'transparent',
                color: filter === cat ? '#c4b5fd' : '#64748b',
                transition: 'all 0.2s ease',
              }}
            >
              {categoryLabels[cat] || cat}
            </button>
          ))}
        </div>

        {/* Project grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 24 }}>
          {filtered.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
          {filtered.length === 0 && (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '80px 0', color: '#334155' }}>
              No projects in this category yet.
            </div>
          )}
        </div>

        {/* View all link */}
        <div style={{ textAlign: 'center', marginTop: 56 }}>
          <a href="https://github.com/Meltxmicheal" target="_blank" rel="noopener noreferrer" className="btn-ghost">
            View More on GitHub
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2.5 7h9M8 3.5L11.5 7 8 10.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>
          </a>
        </div>
      </div>
    </section>
  )
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current; if (!el) return
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setTimeout(() => el.classList.add('in-view'), index * 100); obs.disconnect() }
    }, { threshold: 0.1 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [index])

  return (
    <div ref={ref} className="reveal project-card-v2" style={{ position: 'relative', borderRadius: 24, overflow: 'hidden', transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)', cursor: 'none' }}>
      {/* Glow Effect */}
      <div className="card-glow" />
      
      <div style={{ 
        position: 'relative', 
        zIndex: 2, 
        background: 'rgba(15, 15, 20, 0.4)', 
        backdropFilter: 'blur(16px)', 
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: 24,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        {/* Image Section - Strict 16:9 */}
        <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', overflow: 'hidden' }}>
          <div className="image-overlay" />
          {project.cover_image ? (
            <Image 
              src={project.cover_image.includes('/upload/') ? project.cover_image.replace('/upload/', '/upload/f_auto,q_auto,w_800,ar_16:9,c_fill/') : project.cover_image} 
              alt={project.title} 
              fill 
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              style={{ objectFit: 'cover', transition: 'transform 0.8s ease' }} 
              className="project-main-image"
              unoptimized={true}
            />
          ) : (
            <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #312E81, #7B2FF7)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
               <span style={{ fontSize: 40 }}>{project.category === 'ai' ? '🧠' : '🌐'}</span>
            </div>
          )}
          
          {/* Category Badge */}
          <div style={{ position: 'absolute', top: 16, left: 16, zIndex: 10 }}>
            <span className="card-badge-v3">
              {project.category}
            </span>
          </div>

          {/* Status Badge */}
          <div style={{ position: 'absolute', top: 16, right: 16, zIndex: 10 }}>
            <span className="card-status-v3">
              {project.status}
            </span>
          </div>
        </div>

        {/* Content Section */}
        <div style={{ padding: '28px', flex: 1, display: 'flex', flexDirection: 'column' }}>
          <h3 className="font-display card-title-v3">
            {project.title}
          </h3>
          <p className="card-desc-v3">
            {project.short_description}
          </p>

          {/* Tech Stack */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 28 }}>
            {project.technologies?.slice(0, 3).map(tech => (
              <span key={tech} className="tech-tag-v3">
                {tech}
              </span>
            ))}
          </div>

          {/* Actions */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <Link href={`/projects/${project.slug}`}
               className="flex justify-center items-center gap-1.5 px-4 py-2 rounded-lg
                          border border-white/10 text-white/60 text-sm
                          hover:text-white hover:border-white/20
                          transition-all duration-200"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg> Details
            </Link>
            
            {project.live_url ? (
              <a href={project.live_url} target="_blank"
                 className="flex justify-center items-center gap-1.5 px-4 py-2 rounded-lg
                            bg-white/10 border border-white/15
                            text-white text-sm font-medium
                            hover:bg-white/20 hover:border-white/25
                            transition-all duration-200 text-decoration-none"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg> View Live
              </a>
            ) : (
              <button disabled className="flex justify-center items-center gap-1.5 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white/40 text-sm font-medium cursor-not-allowed">
                Coming Soon
              </button>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .project-card-v2 { transform: translateY(0); }
        .project-card-v2:hover { transform: translateY(-12px); }
        .project-card-v2:hover .card-glow { opacity: 1; }
        .project-card-v2:hover .project-main-image { transform: scale(1.1); }
        
        .card-glow {
          position: absolute;
          inset: -20px;
          background: radial-gradient(circle at center, rgba(124, 58, 237, 0.2), rgba(59, 130, 246, 0.15), transparent 70%);
          opacity: 0;
          transition: opacity 0.5s ease;
          pointer-events: none;
          z-index: 1;
        }

        .image-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to bottom, transparent 40%, rgba(3, 0, 20, 0.4));
          z-index: 1;
        }

        .card-badge-v3 {
          padding: 5px 12px;
          border-radius: 100px;
          font-size: 10px;
          font-weight: 700;
          background: rgba(124, 58, 237, 0.15);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(124, 58, 237, 0.3);
          color: #c4b5fd;
          text-transform: uppercase;
          letter-spacing: 0.15em;
        }

        .card-status-v3 {
          padding: 5px 12px;
          border-radius: 100px;
          font-size: 10px;
          font-weight: 600;
          background: rgba(15, 23, 42, 0.6);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: var(--text-secondary);
          text-transform: capitalize;
        }

        .card-title-v3 {
          font-size: 24px;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 12px;
          letter-spacing: -0.03em;
        }

        .card-desc-v3 {
          font-size: 14px;
          color: var(--text-secondary);
          line-height: 1.7;
          margin-bottom: 24px;
          flex: 1;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
          font-weight: 400;
        }

        .tech-tag-v3 {
          font-size: 11px;
          padding: 5px 14px;
          border-radius: 100px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
          color: #94a3b8;
          font-weight: 600;
          transition: all 0.2s ease;
        }
        .tech-tag-v3:hover {
          background: rgba(124, 58, 237, 0.1);
          border-color: rgba(124, 58, 237, 0.3);
          color: #c4b5fd;
        }

        .view-more-btn-v3 {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 14px;
          border-radius: 16px;
          background: linear-gradient(135deg, var(--violet-glow), #4338ca);
          color: white;
          font-size: 14px;
          font-weight: 700;
          transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
          box-shadow: 0 8px 24px -12px var(--violet-glow);
          height: 100%;
        }
        .view-more-btn-v3:hover {
          transform: translateY(-2px) scale(1.02);
          box-shadow: 0 12px 32px -8px var(--violet-glow);
          filter: brightness(1.1);
        }

        .view-website-btn-v3 {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 14px;
          border-radius: 16px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: var(--text-primary);
          font-size: 14px;
          font-weight: 700;
          transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
          cursor: pointer;
          height: 100%;
          font-family: inherit;
        }
        .view-website-btn-v3:hover:not(:disabled) {
          transform: translateY(-2px) scale(1.02);
          background: rgba(255, 255, 255, 0.06);
          border-color: rgba(255, 255, 255, 0.2);
          box-shadow: 0 8px 24px -12px rgba(0,0,0,0.5);
        }
        .view-website-btn-v3:disabled {
          opacity: 0.4;
          cursor: not-allowed;
          filter: grayscale(1);
        }
      `}</style>
    </div>
  )
}
