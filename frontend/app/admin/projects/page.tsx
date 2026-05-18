'use client'
import { useEffect, useState, useCallback } from 'react'
import { api } from '@/lib/api'
import { useDropzone } from 'react-dropzone'
import toast from 'react-hot-toast'
import Image from 'next/image'

interface Project {
  id: string;
  title: string;
  slug: string;
  short_description?: string;
  description?: string;
  cover_image?: string;
  images: string[];
  technologies: string[];
  github_url?: string;
  live_url?: string;
  category: string;
  status: string;
  is_featured: boolean;
  features: string[];
  created_at: string;
}

const emptyProject: Omit<Project, 'id' | 'created_at'> = {
  title: '', slug: '', short_description: '', description: '',
  cover_image: '', images: [], 
  technologies: [], github_url: '',
  live_url: '', category: 'web', status: 'completed',
  is_featured: false, features: []
}

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [selected, setSelected] = useState<Partial<Project> | null>(null)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState<string | null>(null)

  const loadProjects = async () => { 
    try {
      const p = await api.getProjects(); 
      setProjects(p) 
    } catch (err) {
      toast.error('Failed to load projects')
    }
  }

  useEffect(() => { loadProjects() }, [])

  const handleSave = async () => {
    if (!selected?.title || !selected?.slug) { toast.error('Title and slug are required'); return }
    setSaving(true)
    try {
      if (selected.id) {
        await api.updateProject(selected.id, selected)
        toast.success('Project updated!')
      } else {
        await api.createProject(selected)
        toast.success('Project created!')
        setSelected(null)
      }
      loadProjects()
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this project?')) return
    try {
      await api.deleteProject(id)
      toast.success('Deleted')
      loadProjects()
      if (selected?.id === id) setSelected(null)
    } catch (err: any) {
      toast.error(err.message)
    }
  }

  const onUpload = async (file: File, type: string, index?: number) => {
    setUploading(type + (index !== undefined ? index : ''))
    try {
      const { url } = await api.uploadImage(file)
      if (type === 'showcase' && index !== undefined) {
        const newGallery = [...(selected?.images || [])]
        newGallery[index] = url
        setSelected(p => p ? { ...p, images: newGallery } : p)
      } else if (type === 'thumbnail') {
        setSelected(p => p ? { ...p, cover_image: url } : p)
      }
      toast.success('Uploaded!')
    } catch (e: any) { toast.error(e.message) }
    setUploading(null)
  }

  const toggleFeature = async (id: string, val: boolean) => {
    try {
      await api.updateProject(id, { is_featured: val })
      loadProjects()
      if (selected?.id === id) setSelected(p => p ? { ...p, is_featured: val } : p)
    } catch (err) {}
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '360px 1fr', gap: 32, height: 'calc(100vh - 96px)', overflow: 'hidden' }}>
      {/* List */}
      <div className="glass-card" style={{ borderRadius: 24, overflow: 'hidden', display: 'flex', flexDirection: 'column', background: 'rgba(10, 1, 30, 0.4)', border: '1px solid rgba(255, 255, 255, 0.05)', boxShadow: '0 10px 40px rgba(0,0,0,0.3)' }}>
        <div style={{ padding: '24px 28px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 className="font-display" style={{ fontSize: 20, fontWeight: 700, color: '#f8fafc', letterSpacing: '-0.02em' }}>Deployments</h1>
          <button onClick={() => setSelected({ ...emptyProject })} className="btn-primary" style={{ fontSize: 11, padding: '8px 16px', borderRadius: 10, textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 800 }}>
            + NEW UNIT
          </button>
        </div>
        <div style={{ overflowY: 'auto', flex: 1, padding: '16px' }} className="custom-scrollbar">
          {projects.map(p => (
            <div key={p.id}
              onClick={() => setSelected(p)}
              style={{ 
                padding: '16px 20px', 
                borderRadius: 16, 
                marginBottom: 10, 
                cursor: 'none', 
                transition: 'all 0.3s cubic-bezier(0.23, 1, 0.32, 1)', 
                background: selected?.id === p.id ? 'rgba(124, 58, 237, 0.1)' : 'rgba(255, 255, 255, 0.02)', 
                border: `1px solid ${selected?.id === p.id ? 'rgba(124, 58, 237, 0.3)' : 'rgba(255, 255, 255, 0.05)'}`,
                transform: selected?.id === p.id ? 'translateX(4px)' : 'none'
              }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: selected?.id === p.id ? '#f8fafc' : '#94a3b8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: 6 }}>{p.title}</div>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 9, padding: '3px 8px', borderRadius: 6, background: 'rgba(124, 58, 237, 0.1)', color: 'var(--violet-glow)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{p.category}</span>
                    {p.is_featured && <span style={{ fontSize: 9, padding: '3px 8px', borderRadius: 6, background: 'rgba(250, 204, 21, 0.1)', color: '#facc15', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>⭐ ELITE</span>}
                  </div>
                </div>
                <button onClick={e => { e.stopPropagation(); handleDelete(p.id) }} style={{ color: '#64748b', background: 'none', border: 'none', padding: '4px', marginLeft: 8, transition: 'all 0.2s ease', cursor: 'none' }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#ef4444'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = '#64748b'}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>
              </div>
            </div>
          ))}
          {projects.length === 0 && <p style={{ color: '#64748b', fontSize: 13, padding: '32px 20px', fontStyle: 'italic', textAlign: 'center' }}>No deployments active.</p>}
        </div>
      </div>

      {/* Editor */}
      {selected ? (
        <div className="glass-card" style={{ borderRadius: 24, overflow: 'hidden', display: 'flex', flexDirection: 'column', background: 'rgba(10, 1, 30, 0.4)', border: '1px solid rgba(255, 255, 255, 0.05)', boxShadow: '0 20px 60px rgba(0,0,0,0.4)' }}>
          <div style={{ padding: '24px 32px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: '#f8fafc', letterSpacing: '-0.02em' }}>{selected.id ? 'System Module Override' : 'New System Initialization'}</h2>
            <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 12, color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', cursor: 'none' }}>
                <input type="checkbox" style={{ width: 16, height: 16, cursor: 'none' }} checked={!!selected.is_featured} onChange={e => { setSelected(p => p ? { ...p, is_featured: e.target.checked } : p); if (selected.id) toggleFeature(selected.id, e.target.checked) }} />
                Elite Status
              </label>
              <button onClick={handleSave} className="btn-primary" disabled={saving} style={{ fontSize: 13, padding: '10px 24px', borderRadius: 14, opacity: saving ? 0.7 : 1, fontWeight: 800 }}>
                {saving ? 'COMMITTING...' : 'COMMIT CHANGES'}
              </button>
            </div>
          </div>

          <div style={{ overflowY: 'auto', flex: 1, padding: '40px 40px 100px' }} className="custom-scrollbar">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
              
              {[
                { label: 'Deployment Label', key: 'title', placeholder: 'Project Title' },
                { label: 'System ID (Slug)', key: 'slug', placeholder: 'project-slug' },
              ].map(f => (
                <div key={f.key}>
                  <label style={{ fontSize: 11, color: '#64748b', letterSpacing: '0.15em', textTransform: 'uppercase', display: 'block', marginBottom: 12, fontWeight: 700 }}>{f.label}</label>
                  <input className="input-field" value={(selected as any)[f.key] || ''} onChange={e => setSelected(p => p ? { ...p, [f.key]: e.target.value } : p)} placeholder={f.placeholder} />
                </div>
              ))}

              <div style={{ gridColumn: '1/-1' }}>
                <label style={{ fontSize: 11, color: '#64748b', letterSpacing: '0.15em', textTransform: 'uppercase', display: 'block', marginBottom: 12, fontWeight: 700 }}>Short Transmission (Preview)</label>
                <input className="input-field" value={selected.short_description || ''} onChange={e => setSelected(p => p ? { ...p, short_description: e.target.value } : p)} placeholder="Brief summary for data cards..." />
              </div>

              <div style={{ gridColumn: '1/-1' }}>
                <label style={{ fontSize: 11, color: '#64748b', letterSpacing: '0.15em', textTransform: 'uppercase', display: 'block', marginBottom: 12, fontWeight: 700 }}>Full Log / Narrative</label>
                <textarea className="input-field" rows={8} value={selected.description || ''} onChange={e => setSelected(p => p ? { ...p, description: e.target.value } : p)} style={{ resize: 'vertical', minHeight: 160 }} placeholder="Comprehensive project documentation..." />
              </div>

              {/* Main Thumbnail */}
              <div style={{ gridColumn: '1/-1', background: 'rgba(255,255,255,0.02)', padding: 32, borderRadius: 24, border: '1px solid rgba(255,255,255,0.05)' }}>
                <label style={{ fontSize: 12, color: '#f8fafc', letterSpacing: '0.15em', textTransform: 'uppercase', display: 'block', marginBottom: 20, fontWeight: 800 }}>
                  Primary Visual Interface (Thumbnail)
                </label>
                <div style={{ maxWidth: 480 }}>
                  <ImageUpload 
                    url={selected.cover_image} 
                    onUpload={(f) => onUpload(f, 'thumbnail')} 
                    uploading={uploading === 'thumbnail'} 
                    aspectRatio="16/9"
                  />
                </div>
              </div>

              {/* Showcase Images */}
              <div style={{ gridColumn: '1/-1', background: 'rgba(255,255,255,0.02)', padding: 32, borderRadius: 24, border: '1px solid rgba(255,255,255,0.05)' }}>
                <label style={{ fontSize: 12, color: '#f8fafc', letterSpacing: '0.15em', textTransform: 'uppercase', display: 'block', marginBottom: 24, fontWeight: 800 }}>
                  Satellite Gallery Feed (Up to 4)
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 24 }}>
                  {[0, 1, 2, 3].map((idx) => (
                    <div key={idx} style={{ position: 'relative' }}>
                      <label style={{ fontSize: 10, color: '#64748b', display: 'block', marginBottom: 12, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Node {idx + 1}</label>
                      <ImageUpload 
                        url={selected.images?.[idx]} 
                        onUpload={(f) => onUpload(f, 'showcase', idx)} 
                        uploading={uploading === `showcase${idx}`} 
                        aspectRatio="16/9"
                        compact
                      />
                      {selected.images?.[idx] && (
                        <button 
                          onClick={() => {
                            const newG = [...(selected.images || [])]
                            newG[idx] = ''
                            setSelected(p => p ? { ...p, images: newG } : p)
                          }}
                          style={{ position: 'absolute', top: 38, right: 12, zIndex: 10, padding: '4px 8px', fontSize: 9, borderRadius: 6, color: '#ef4444', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', cursor: 'none', fontWeight: 800, textTransform: 'uppercase' }}
                        >
                          Wipe
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ gridColumn: '1/-1' }}>
                <label style={{ fontSize: 11, color: '#64748b', letterSpacing: '0.15em', textTransform: 'uppercase', display: 'block', marginBottom: 12, fontWeight: 700 }}>Operational Terminal (Live URL)</label>
                <input 
                  className="input-field" 
                  type="url" 
                  value={selected.live_url || ''} 
                  onChange={e => setSelected(p => p ? { ...p, live_url: e.target.value } : p)} 
                  placeholder="https://..." 
                />
              </div>

              <div>
                <label style={{ fontSize: 11, color: '#64748b', letterSpacing: '0.15em', textTransform: 'uppercase', display: 'block', marginBottom: 12, fontWeight: 700 }}>Sector (Category)</label>
                <select className="input-field" value={selected.category || 'web'} onChange={e => setSelected(p => p ? { ...p, category: e.target.value } : p)} style={{ appearance: 'none' }}>
                  {['web', 'mobile', 'ai', 'tool', 'design', 'other'].map(c => <option key={c} value={c}>{c.toUpperCase()}</option>)}
                </select>
              </div>

              <div>
                <label style={{ fontSize: 11, color: '#64748b', letterSpacing: '0.15em', textTransform: 'uppercase', display: 'block', marginBottom: 12, fontWeight: 700 }}>Mission Status</label>
                <select className="input-field" value={selected.status || 'completed'} onChange={e => setSelected(p => p ? { ...p, status: e.target.value } : p)} style={{ appearance: 'none' }}>
                  {['completed', 'in-progress', 'archived'].map(s => <option key={s} value={s}>{s.toUpperCase()}</option>)}
                </select>
              </div>

              <div>
                <label style={{ fontSize: 11, color: '#64748b', letterSpacing: '0.15em', textTransform: 'uppercase', display: 'block', marginBottom: 12, fontWeight: 700 }}>Source Protocol (GitHub)</label>
                <input className="input-field" type="url" value={selected.github_url || ''} onChange={e => setSelected(p => p ? { ...p, github_url: e.target.value } : p)} placeholder="https://github.com/..." />
              </div>

              <div style={{ gridColumn: '1/-1' }}>
                <label style={{ fontSize: 11, color: '#64748b', letterSpacing: '0.15em', textTransform: 'uppercase', display: 'block', marginBottom: 12, fontWeight: 700 }}>Tech Stack (Neural Links)</label>
                <input className="input-field" value={(selected.technologies || []).join(', ')} onChange={e => setSelected(p => p ? { ...p, technologies: e.target.value.split(',').map(t => t.trim()).filter(Boolean) } : p)} placeholder="React, Next.js, AI, etc." />
              </div>

              <div style={{ gridColumn: '1/-1' }}>
                <label style={{ fontSize: 11, color: '#64748b', letterSpacing: '0.15em', textTransform: 'uppercase', display: 'block', marginBottom: 12, fontWeight: 700 }}>Module Features (One per line)</label>
                <textarea className="input-field" rows={5} value={(selected.features || []).join('\n')} onChange={e => setSelected(p => p ? { ...p, features: e.target.value.split('\n').filter(Boolean) } : p)} placeholder="Feature 1&#10;Feature 2..." />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', background: 'rgba(10, 1, 30, 0.4)', borderRadius: 24, border: '1px solid rgba(255, 255, 255, 0.05)' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 56, marginBottom: 24, color: 'var(--violet-glow)', opacity: 0.5 }}>◫</div>
            <p style={{ fontSize: 16, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Select Unit for Modification</p>
          </div>
        </div>
      )}
    </div>
  )
}

function ImageUpload({ url, onUpload, uploading, aspectRatio, compact }: { url?: string; onUpload: (f: File) => void; uploading: boolean; aspectRatio: string; compact?: boolean }) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop: (files) => files[0] && onUpload(files[0]), accept: { 'image/*': [] }, maxFiles: 1 })
  
  return (
    <div {...getRootProps()} style={{ 
      borderRadius: 20, 
      border: `2px dashed ${isDragActive ? 'var(--violet-glow)' : 'rgba(255,255,255,0.1)'}`, 
      background: isDragActive ? 'rgba(124,58,237,0.05)' : 'rgba(255,255,255,0.01)', 
      overflow: 'hidden', 
      transition: 'all 0.3s ease', 
      aspectRatio, 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      position: 'relative',
      cursor: 'none'
    }}>
      <input {...getInputProps()} />
      {url ? (
        <>
          <Image src={url} alt="Uploaded" fill style={{ objectFit: 'cover', opacity: compact ? 1 : 0.7 }} />
          {!compact && (
            <div style={{ position: 'relative', zIndex: 1, padding: '10px 20px', borderRadius: 12, background: 'rgba(10, 1, 30, 0.6)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <span style={{ fontSize: 12, color: '#f8fafc', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {uploading ? 'UPLOADING...' : 'WIPE & REPLACE'}
              </span>
            </div>
          )}
          {uploading && (
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(10, 1, 30, 0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2 }}>
               <div style={{ width: 24, height: 24, border: '3px solid rgba(124,58,237,0.1)', borderTopColor: 'var(--violet-glow)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
            </div>
          )}
        </>
      ) : (
        <div style={{ textAlign: 'center', padding: 12 }}>
          <div style={{ fontSize: compact ? 24 : 32, marginBottom: 8, color: '#475569' }}>{uploading ? '...' : '+'}</div>
          {!compact && <p style={{ fontSize: 11, color: '#64748b', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{uploading ? 'SYNCING...' : 'INIT UPLOAD'}</p>}
        </div>
      )}
    </div>
  )
}
