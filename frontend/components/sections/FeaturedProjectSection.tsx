'use client'
import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Image from 'next/image'
import { Project } from '@/lib/supabase'

export default function FeaturedProjectSection({ project }: { project: Project }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })

  // Cinematic liquid morph & motion blur effect coming from top-left (About section connection)
  const y = useTransform(scrollYProgress, [0, 0.4, 1], [-200, 0, 0])
  const x = useTransform(scrollYProgress, [0, 0.4, 1], [-200, 0, 0])
  const scale = useTransform(scrollYProgress, [0, 0.4, 1], [0.5, 1, 1])
  const blur = useTransform(scrollYProgress, [0, 0.3, 0.5, 1], ["blur(40px)", "blur(20px)", "blur(0px)", "blur(0px)"])
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.4, 1], [0, 0.5, 1, 1])
  
  // Connection glow
  const glowOpacity = useTransform(scrollYProgress, [0, 0.3, 0.5, 1], [1, 0.5, 0, 0])

  return (
    <section id="work" ref={containerRef} style={{ padding: '160px 24px', position: 'relative', overflow: 'hidden' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 64, alignItems: 'center' }}>
        
        {/* Left Content */}
        <div className="reveal">
          <p style={{ fontSize: 12, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--violet-glow)', fontFamily: 'JetBrains Mono, monospace', marginBottom: 20, fontWeight: 700 }}>
            Featured Masterpiece
          </p>
          <h2 className="font-display" style={{ fontSize: 'clamp(40px, 5vw, 64px)', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 28, lineHeight: 1, letterSpacing: '-0.04em' }}>
            {project.title}
          </h2>
          <p style={{ fontSize: 'clamp(15px, 1.1vw, 17px)', color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: 40, maxWidth: '90%', fontWeight: 400 }}>
            {project.short_description}
          </p>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 48 }}>
            {project.technologies?.slice(0, 5).map(tag => (
              <span key={tag} style={{ padding: '6px 16px', borderRadius: 100, background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)', fontSize: 12, color: '#94a3b8', fontWeight: 600 }}>
                {tag}
              </span>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
            {project.live_url && (
              <a href={project.live_url} target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ padding: '16px 40px', borderRadius: 12, fontSize: 15 }}>
                Live Website
              </a>
            )}
            {project.github_url && (
              <a href={project.github_url} target="_blank" rel="noopener noreferrer" className="btn-ghost" style={{ padding: '15px 39px', display: 'flex', alignItems: 'center', gap: 10, color: 'var(--text-primary)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: 12, fontSize: 15 }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>
                GitHub
              </a>
            )}
          </div>
        </div>

        {/* Right Image - Advanced Morphing Transition */}
        <div style={{ position: 'relative', perspective: 1000 }}>
          <motion.div 
            style={{ 
              y, x, scale, filter: blur, opacity,
              position: 'relative', width: '100%', aspectRatio: '16/9', 
              borderRadius: 32, overflow: 'hidden',
              boxShadow: '0 30px 100px -20px rgba(124,58,237,0.15)',
              border: '1px solid var(--border)'
            }}
          >
            {/* Morphing Glow Connection Trail */}
            <motion.div style={{
              position: 'absolute', top: '-50%', left: '-50%', width: '200%', height: '200%',
              background: 'radial-gradient(circle, rgba(124,58,237,0.2) 0%, rgba(59,130,246,0.1) 40%, transparent 70%)',
              opacity: glowOpacity, mixBlendMode: 'multiply', zIndex: 10, pointerEvents: 'none'
            }} />

            {/* Cinematic Overlay */}
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(124,58,237,0.1) 0%, transparent 50%, rgba(59,130,246,0.05) 100%)', zIndex: 1, mixBlendMode: 'multiply' }} />
            
            {project.cover_image && (
              <Image 
                src={project.cover_image} 
                alt={project.title} 
                fill 
                style={{ objectFit: 'cover' }} 
              />
            )}
            
            {/* Glass reflection */}
            <div className="glass-shine" style={{ position: 'absolute', top: 0, left: '-100%', width: '50%', height: '100%', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)', transform: 'skewX(-25deg)' }} />
          </motion.div>
        </div>

      </div>
    </section>
  )
}
