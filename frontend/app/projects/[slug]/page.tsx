'use client'
import { useEffect, useRef, useState } from 'react'
import { api } from '@/lib/api'
import { Project } from '@/lib/supabase'
import { notFound, useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { motion, useScroll, useTransform } from 'framer-motion'
import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/ui/Footer'

export default function ProjectPage() {
  const params = useParams()
  const slug = params.slug as string
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const projects = await api.getProjects()
        const p = projects.find((p: any) => p.slug === slug)
        if (p) setProject(p)
        else setLoading(false)
      } catch (err) {
        setLoading(false)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [slug])

  if (loading) return null
  if (!project) notFound()

  return (
    <div style={{ background: '#050505', color: '#f1f5f9', minHeight: '100vh', position: 'relative', overflowX: 'hidden' }}>
      <Navbar />
      
      {/* Aurora Background System */}
      <div className="aurora-container">
        <div className="aurora blue-glow" />
        <div className="aurora indigo-haze" />
        <div className="aurora violet-glow" />
        <div className="aurora center-fog" />
      </div>

      <main style={{ position: 'relative', zIndex: 2, paddingTop: 100, maxWidth: 1400, margin: '0 auto', padding: '0 24px' }}>
        <div className="project-grid-system">
          {/* Left Side: Content */}
          <div className="project-content-col">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <Link href="/#projects" className="back-link-v2">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                <span>Back to Projects</span>
              </Link>

              <div className="badge-group">
                <span className="premium-badge cat-badge">{project.category}</span>
                <span className="premium-badge status-badge">{project.status}</span>
              </div>

              <h1 className="cinematic-title">{project.title}</h1>
              <div className="cinematic-description">
                {project.description?.split('\n').map((para, i) => (
                  <p key={i} style={{ marginBottom: '1.5em' }}>{para}</p>
                ))}
              </div>

              {/* Core Features */}
              <div className="details-section">
                <h2 className="section-heading">Key Features</h2>
                <div className="feature-grid-v2">
                  {project.features?.map((feature, i) => (
                    <motion.div 
                      key={i} 
                      className="feature-item-v2"
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <div className="feature-icon-v2" />
                      <span>{feature}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Tech Stack */}
              <div className="details-section">
                <h2 className="section-heading">Technology Suite</h2>
                <div className="tech-pills">
                  {project.technologies?.map(tech => (
                    <span key={tech} className="tech-pill">{tech}</span>
                  ))}
                </div>
              </div>

              {/* Bottom Buttons */}
              <div className="cta-group-v2">
                {project.live_url && (
                  <button onClick={() => window.open(project.live_url, "_blank")} className="project-detail-website-btn">
                    <span>Explore Live Project</span>
                  </button>
                )}
                {project.github_url && (
                  <a href={project.github_url} target="_blank" rel="noopener noreferrer" className="mag-btn github-mag">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.79 8.205 11.385.6.11.82-.26.82-.577v-2.234c-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.73.083-.73 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.305-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22v3.293c0 .319.2.694.825.576C20.565 21.795 24 17.29 24 12c0-6.63-5.37-12-12-12z"/></svg>
                    <span>View Repository</span>
                  </a>
                )}
              </div>
            </motion.div>
          </div>

          {/* Right Side: Image Showcase */}
          <div className="project-showcase-col">
            <h2 className="section-heading" style={{ marginBottom: 24, fontSize: 14 }}>Project Gallery</h2>
            <div className="showcase-scroll-area">
              {(() => {
                const showcaseImages = (project.gallery_images || []).filter(Boolean);
                if (!showcaseImages || showcaseImages.length === 0) {
                  return (
                    <div className="showcase-placeholder">
                       <p>No gallery images available.</p>
                    </div>
                  );
                }

                return showcaseImages.map((image: string, index: number) => (
                  <motion.div 
                    className="showcase-card" 
                    key={index}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <img
                      src={image}
                      alt={`Project Showcase ${index + 1}`}
                      loading="lazy"
                    />
                  </motion.div>
                ));
              })()}
            </div>
          </div>
        </div>
      </main>

      <Footer />

      <style jsx>{`
        .aurora-container { position: fixed; inset: 0; z-index: 1; pointer-events: none; overflow: hidden; }
        .aurora { position: absolute; filter: blur(140px); opacity: 0.4; border-radius: 50%; }
        .blue-glow { width: 50vw; height: 50vw; background: #1E3A8A; top: 10%; left: -10%; }
        .indigo-haze { width: 60vw; height: 60vw; background: #312E81; top: -15%; right: -5%; }
        .violet-glow { width: 45vw; height: 45vw; background: #7B2FF7; bottom: -10%; right: -5%; }
        .center-fog { width: 100vw; height: 100vh; background: radial-gradient(circle at center, rgba(123, 47, 247, 0.05) 0%, transparent 70%); }

        .project-grid-system {
          display: grid;
          grid-template-columns: 1fr 400px;
          gap: 60px;
          align-items: start;
        }

        @media (max-width: 1024px) {
          .project-grid-system { grid-template-columns: 1fr; gap: 60px; }
          .project-showcase-col { position: relative !important; top: 0 !important; }
        }

        .project-content-col { padding-bottom: 120px; }
        
        .project-showcase-col {
          position: sticky;
          top: 100px;
          height: fit-content;
        }

        .showcase-scroll-area {
          display: flex;
          flex-direction: column;
          gap: 20px;
          padding-bottom: 40px;
          max-height: calc(100vh - 160px);
          overflow-y: auto;
          padding-right: 12px;
        }
        
        .showcase-scroll-area::-webkit-scrollbar { width: 6px; }
        .showcase-scroll-area::-webkit-scrollbar-track { background: rgba(0,0,0,0.2); border-radius: 4px; }
        .showcase-scroll-area::-webkit-scrollbar-thumb { background: rgba(123, 47, 247, 0.4); border-radius: 4px; }
        .showcase-scroll-area::-webkit-scrollbar-thumb:hover { background: rgba(123, 47, 247, 0.8); }

        .showcase-placeholder {
          padding: 60px 24px;
          border-radius: 24px;
          background: rgba(255,255,255,0.02);
          border: 1px dashed rgba(255,255,255,0.1);
          text-align: center;
          color: #64748b;
          font-size: 14px;
        }

        .cinematic-img-card {
          position: relative;
          width: 100%;
          aspect-ratio: 16 / 9;
          border-radius: 24px;
          overflow: hidden;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow: 0 20px 40px -15px rgba(0,0,0,0.5);
          transition: transform 0.6s cubic-bezier(0.23, 1, 0.32, 1);
        }

        .img-glass-wrap {
          position: absolute;
          inset: 0;
          overflow: hidden;
          z-index: 2;
        }

        .showcase-img {
          transition: transform 1s ease;
        }

        .cinematic-img-card:hover { transform: translateY(-8px) scale(1.02); }
        .cinematic-img-card:hover .showcase-img { transform: scale(1.08); }

        .img-shine {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 40%, rgba(255,255,255,0.04) 100%);
          pointer-events: none;
          z-index: 3;
        }

        .card-glow-effect {
          position: absolute;
          inset: -20px;
          background: radial-gradient(circle at center, rgba(123, 47, 247, 0.1), transparent 70%);
          opacity: 0;
          transition: opacity 0.5s ease;
          z-index: 1;
        }
        .cinematic-img-card:hover .card-glow-effect { opacity: 1; }

        .showcase-card {
          width: 100%;
          aspect-ratio: 16 / 9;
          overflow: hidden;
          border-radius: 20px;
          margin-bottom: 20px;
          background: rgba(255,255,255,0.05);
          backdrop-filter: blur(20px);
        }

        .showcase-card img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .live-link-text-btn {
          background: none;
          border: none;
          color: #f1f5f9;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          padding: 0;
          margin-bottom: 48px;
          position: relative;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          transition: color 0.3s ease;
        }
        .live-link-text-btn::after {
          content: '';
          position: absolute;
          bottom: -4px;
          left: 0;
          width: 100%;
          height: 2px;
          background: linear-gradient(90deg, #7B2FF7, #3B82F6);
          box-shadow: 0 0 10px rgba(123, 47, 247, 0.5);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.3s ease;
        }
        .live-link-text-btn:hover {
          color: #c4b5fd;
        }
        .live-link-text-btn:hover::after {
          transform: scaleX(1);
        }

        .back-link-v2 {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          color: #94a3b8;
          text-decoration: none;
          font-size: 14px;
          font-weight: 500;
          margin-bottom: 32px;
          transition: all 0.3s ease;
        }
        .back-link-v2:hover { color: #f1f5f9; transform: translateX(-4px); }

        .badge-group { display: flex; gap: 10px; margin-bottom: 24px; }
        .premium-badge {
          padding: 6px 16px;
          border-radius: 100px;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .cat-badge { background: rgba(123, 47, 247, 0.1); color: #c4b5fd; }
        .status-badge { background: rgba(255, 255, 255, 0.05); color: #94a3b8; }

        .cinematic-title {
          font-size: clamp(36px, 5vw, 64px);
          font-weight: 800;
          color: #fff;
          line-height: 1.1;
          letter-spacing: -0.03em;
          margin-bottom: 24px;
        }

        .cinematic-description {
          font-size: 18px;
          line-height: 1.9;
          color: rgba(255, 255, 255, 0.82);
          max-width: 620px;
          margin-bottom: 48px;
          font-weight: 400;
        }

        .details-section { margin-bottom: 48px; }
        .section-heading {
          font-size: 18px;
          font-weight: 700;
          color: #f1f5f9;
          margin-bottom: 24px;
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }

        .feature-grid-v2 { display: flex; flex-direction: column; gap: 16px; }
        .feature-item-v2 { display: flex; align-items: center; gap: 16px; color: #cbd5e1; font-size: 16px; }
        .feature-icon-v2 { width: 8px; height: 8px; border-radius: 50%; background: #7B2FF7; box-shadow: 0 0 12px #7B2FF7; }

        .tech-pills { display: flex; flex-wrap: wrap; gap: 10px; }
        .tech-pill {
          padding: 8px 18px;
          background: rgba(123, 47, 247, 0.08);
          border: 1px solid rgba(123, 47, 247, 0.2);
          color: #a78bfa;
          border-radius: 12px;
          font-size: 13px;
          font-weight: 600;
        }

        .cta-group-v2 { display: flex; gap: 20px; flex-wrap: wrap; margin-top: 64px; }
        .mag-btn {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px 36px;
          border-radius: 16px;
          font-size: 16px;
          font-weight: 700;
          text-decoration: none;
          transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .primary-mag { background: linear-gradient(135deg, #7B2FF7, #3B82F6); color: white; border: none; }
        .github-mag { background: #171515; color: white; }
        .mag-btn:hover { transform: translateY(-5px); box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.5); }

        .project-detail-website-btn {
          display: flex;
          align-items: center;
          justify-content: flex-start;
          gap: 12px;
          padding: 18px 36px;
          border-radius: 16px;
          font-size: 18px;
          font-weight: 800;
          color: white;
          background: linear-gradient(135deg, #7B2FF7, #3B82F6);
          border: 1px solid rgba(255, 255, 255, 0.12);
          box-shadow: 0 0 40px rgba(123, 47, 247, 0.35);
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
          font-family: inherit;
        }
        .project-detail-website-btn:hover {
          transform: translateY(-5px);
          box-shadow: 0 0 60px rgba(123, 47, 247, 0.5);
          border-color: rgba(255, 255, 255, 0.25);
        }
      `}</style>
    </div>
  )
}
