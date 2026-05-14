'use client'
import { useState, useEffect } from 'react'
import { api } from '@/lib/api'
import { toast } from 'react-hot-toast'

export default function FeaturedProjectAdmin() {
  const [data, setData] = useState({
    title: '',
    description: '',
    image: '',
    github_link: '',
    live_link: '',
    technologies: [] as string[]
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [techInput, setTechInput] = useState('')

  useEffect(() => {
    api.getFeaturedProject()
      .then(res => {
        if (res) setData(res)
      })
      .finally(() => setLoading(false))
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      await api.updateFeaturedProject(data)
      toast.success('Featured project updated')
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const toastId = toast.loading('Uploading...')
    try {
      const res = await api.uploadImage(file)
      setData({ ...data, image: res.url })
      toast.success('Uploaded', { id: toastId })
    } catch (err: any) {
      toast.error('Upload failed', { id: toastId })
    }
  }

  const addTech = () => {
    if (techInput && !data.technologies.includes(techInput)) {
      setData({ ...data, technologies: [...data.technologies, techInput] })
      setTechInput('')
    }
  }

  const removeTech = (t: string) => {
    setData({ ...data, technologies: data.technologies.filter(item => item !== t) })
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', background: 'var(--void)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 40, height: 40, border: '3px solid rgba(124,58,237,0.1)', borderTopColor: 'var(--violet-glow)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
    </div>
  )

  return (
    <div style={{ maxWidth: 900 }}>
      <div style={{ marginBottom: 48 }}>
        <h1 className="font-display" style={{ fontSize: 32, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.03em', marginBottom: 8 }}>Primary Masterpiece</h1>
        <p style={{ fontSize: 14, color: '#64748b', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Configure top-level showcase deployment</p>
      </div>
      
      <form onSubmit={handleSubmit} className="glass-card" style={{ padding: 48, borderRadius: 24, background: 'rgba(10, 1, 30, 0.4)', border: '1px solid rgba(255, 255, 255, 0.05)', boxShadow: '0 20px 60px rgba(0,0,0,0.4)' }}>
        <div style={{ display: 'grid', gap: 32 }}>
          <div>
            <label style={{ display: 'block', fontSize: 11, color: '#64748b', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 12, fontWeight: 700 }}>Project Title</label>
            <input 
              className="input-field"
              value={data.title}
              onChange={e => setData({...data, title: e.target.value})}
              required
              placeholder="e.g. Quantum Analytics Engine"
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 11, color: '#64748b', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 12, fontWeight: 700 }}>Brief Summary / Narrative</label>
            <textarea 
              className="input-field"
              style={{ minHeight: 140, resize: 'vertical' }}
              value={data.description}
              onChange={e => setData({...data, description: e.target.value})}
              placeholder="Describe the masterpiece..."
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 11, color: '#64748b', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 12, fontWeight: 700 }}>Visual Component (Cover)</label>
            <div style={{ display: 'flex', gap: 16 }}>
              <input 
                className="input-field"
                value={data.image}
                onChange={e => setData({...data, image: e.target.value})}
                placeholder="https://..."
              />
              <label className="btn-ghost" style={{ cursor: 'none', whiteSpace: 'nowrap', padding: '0 24px', borderRadius: 14, border: '1px solid rgba(255,255,255,0.1)', color: '#f8fafc', fontSize: 14, fontWeight: 700 }}>
                UPLOAD
                <input type="file" hidden onChange={handleUpload} accept="image/*" />
              </label>
            </div>
            {data.image && (
              <div style={{ marginTop: 20, position: 'relative', width: '100%', aspectRatio: '16/9', borderRadius: 16, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}>
                <img src={data.image} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
            <div>
              <label style={{ display: 'block', fontSize: 11, color: '#64748b', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 12, fontWeight: 700 }}>Source Uplink (GitHub)</label>
              <input 
                className="input-field"
                value={data.github_link}
                onChange={e => setData({...data, github_link: e.target.value})}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 11, color: '#64748b', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 12, fontWeight: 700 }}>Active Terminal (Live)</label>
              <input 
                className="input-field"
                value={data.live_link}
                onChange={e => setData({...data, live_link: e.target.value})}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 11, color: '#64748b', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 12, fontWeight: 700 }}>Core Technologies</label>
            <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
              <input 
                className="input-field"
                value={techInput}
                onChange={e => setTechInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTech())}
                placeholder="Add protocol and press enter"
              />
              <button type="button" onClick={addTech} className="btn-ghost" style={{ padding: '0 24px', borderRadius: 14, border: '1px solid rgba(255,255,255,0.1)', color: '#f8fafc', fontSize: 14, fontWeight: 700 }}>ADD</button>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              {data.technologies.map(t => (
                <span key={t} style={{ padding: '8px 16px', borderRadius: 100, background: 'rgba(124, 58, 237, 0.1)', border: '1px solid rgba(124, 58, 237, 0.2)', fontSize: 12, color: 'var(--violet-glow)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
                  {t}
                  <button type="button" onClick={() => removeTech(t)} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'none', fontSize: 16, display: 'flex' }}>×</button>
                </span>
              ))}
            </div>
          </div>

          <button type="submit" className="btn-primary" disabled={saving} style={{ marginTop: 16, padding: '18px', borderRadius: 16, fontSize: 16, fontWeight: 700 }}>
            {saving ? 'SYNCHRONIZING...' : 'COMMIT CHANGES'}
          </button>
        </div>
      </form>
    </div>
  )
}
