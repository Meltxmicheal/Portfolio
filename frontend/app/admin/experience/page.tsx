'use client'
import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import toast from 'react-hot-toast'

export default function AdminExperiencePage() {
  const [profileRecord, setProfileRecord] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Fresher Fields
  const [title, setTitle] = useState('Fresher / AI-ML Student')
  const [description, setDescription] = useState('')
  const [availability, setAvailability] = useState('Available for Opportunities')
  const [isAvailable, setIsAvailable] = useState(true)
  const [statusTags, setStatusTags] = useState<string[]>(['Open to Internships', 'Open to Freelance', 'Open to Collaborations'])
  const [newTag, setNewTag] = useState('')

  const load = async () => { 
    try {
      const e = await api.getExperience(); 
      if (e && e.length > 0) {
        // The first record in our experience matrix is our Fresher Profile
        const record = e[0]
        setProfileRecord(record)
        setTitle(record.role || 'Fresher / AI-ML Student')
        setDescription(record.description || '')
        setAvailability(record.company || 'Available for Opportunities')
        setIsAvailable(!!record.is_current)
        setStatusTags(record.technologies || ['Open to Internships', 'Open to Freelance', 'Open to Collaborations'])
      } else {
        // Populate default fresher text
        setDescription('Passionate AI/ML and Full Stack developer focused on building modern web applications, intelligent systems, and real-world projects while continuously learning new technologies.')
      }
    } catch (err) {
      toast.error('Failed to load Fresher settings')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const handleSave = async () => {
    if (!title.trim() || !description.trim()) {
      toast.error('Title and Profile summary description are required')
      return
    }
    setSaving(true)
    const toastId = toast.loading('Syncing Fresher profile...')
    try {
      const payload = {
        role: title.trim(),
        description: description.trim(),
        company: availability.trim(),
        technologies: statusTags,
        is_current: isAvailable,
        start_date: new Date().toISOString(),
        end_date: null,
        company_url: '',
        logo_url: '',
        sort_order: 0
      }

      if (profileRecord?.id) {
        const res = await api.updateExperience(profileRecord.id, payload)
        setProfileRecord(res)
      } else {
        const res = await api.createExperience(payload)
        setProfileRecord(res)
      }
      toast.success('Fresher profile synced!', { id: toastId })
    } catch (err: any) {
      toast.error(err.message || 'Sync failed', { id: toastId })
    } finally {
      setSaving(false)
    }
  }

  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTag.trim()) return
    if (statusTags.includes(newTag.trim())) {
      toast.error('Tag already exists')
      return
    }
    setStatusTags([...statusTags, newTag.trim()])
    setNewTag('')
  }

  const handleRemoveTag = (tag: string) => {
    setStatusTags(statusTags.filter(t => t !== tag))
  }

  if (loading) return <div style={{ color: '#94a3b8', padding: 24, fontSize: 16 }}>Syncing Fresher core details...</div>

  return (
    <div>
      <div style={{ marginBottom: 48 }}>
        <h1 className="font-display" style={{ fontSize: 32, fontWeight: 700, color: '#f8fafc', letterSpacing: '-0.03em', marginBottom: 8 }}>Fresher Profile Settings</h1>
        <p style={{ fontSize: 14, color: '#64748b', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Unified Fresher & AI-ML Identity</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
        {/* Editor Card */}
        <div className="glass-card" style={{ padding: 40, borderRadius: 24, background: 'rgba(10, 1, 30, 0.4)', border: '1px solid rgba(255, 255, 255, 0.05)', boxShadow: '0 20px 60px rgba(0,0,0,0.4)', alignSelf: 'start' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: '#f8fafc', letterSpacing: '-0.02em' }}>Edit Identity Card</h2>
            <button onClick={handleSave} className="btn-primary" disabled={saving} style={{ fontSize: 13, padding: '10px 24px', borderRadius: 14, fontWeight: 800 }}>
              {saving ? 'SYNCING...' : 'COMMIT CHANGES'}
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {/* Title / Role */}
            <div>
              <label style={{ fontSize: 11, color: '#64748b', letterSpacing: '0.15em', textTransform: 'uppercase', display: 'block', marginBottom: 12, fontWeight: 700 }}>Professional Title</label>
              <input className="input-field" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Fresher / AI-ML Student" />
            </div>

            {/* Availability Badge */}
            <div>
              <label style={{ fontSize: 11, color: '#64748b', letterSpacing: '0.15em', textTransform: 'uppercase', display: 'block', marginBottom: 12, fontWeight: 700 }}>Availability State / Status</label>
              <input className="input-field" value={availability} onChange={e => setAvailability(e.target.value)} placeholder="e.g. Available for Opportunities" />
            </div>

            {/* Active Toggle */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px', borderRadius: 16, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
              <input type="checkbox" id="isAvailable" checked={isAvailable} onChange={e => setIsAvailable(e.target.checked)} style={{ width: 18, height: 18, accentColor: 'var(--violet-glow)', cursor: 'pointer' }} />
              <label htmlFor="isAvailable" style={{ fontSize: 12, color: '#94a3b8', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', cursor: 'pointer' }}>Active for Hires (Shows Available Badge)</label>
            </div>

            {/* Description */}
            <div>
              <label style={{ fontSize: 11, color: '#64748b', letterSpacing: '0.15em', textTransform: 'uppercase', display: 'block', marginBottom: 12, fontWeight: 700 }}>Profile Summary</label>
              <textarea className="input-field" rows={5} value={description} onChange={e => setDescription(e.target.value)} placeholder="Detail your focal capabilities and passion..." style={{ resize: 'vertical' }} />
            </div>
          </div>
        </div>

        {/* Status Tags Card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Status Tags / Core Badges */}
          <div className="glass-card" style={{ padding: 40, borderRadius: 24, background: 'rgba(10, 1, 30, 0.4)', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
            <h2 style={{ fontSize: 14, fontWeight: 800, color: '#64748b', marginBottom: 24, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Recruiter Status Tags</h2>
            
            <form onSubmit={handleAddTag} style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
              <input className="input-field" value={newTag} onChange={e => setNewTag(e.target.value)} placeholder="e.g. Open to Internships" style={{ flex: 1 }} />
              <button type="submit" className="btn-primary" style={{ padding: '0 24px', borderRadius: 14, fontSize: 12, fontWeight: 800 }}>ADD TAG</button>
            </form>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              {statusTags.map(tag => (
                <div key={tag} className="glass-card" style={{ padding: '8px 14px', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(124, 58, 237, 0.1)', border: '1px solid rgba(124, 58, 237, 0.2)' }}>
                  <span style={{ fontSize: 12, color: 'var(--violet-glow)', fontWeight: 800 }}>{tag}</span>
                  <button type="button" onClick={() => handleRemoveTag(tag)} style={{ color: '#ef4444', background: 'none', border: 'none', fontWeight: 800, fontSize: 14, cursor: 'pointer' }}>×</button>
                </div>
              ))}
              {statusTags.length === 0 && (
                <p style={{ color: '#64748b', fontSize: 13, fontStyle: 'italic' }}>No availability flags configured.</p>
              )}
            </div>
          </div>

          {/* Interactive Preview Card */}
          <div className="glass-card" style={{ padding: 40, borderRadius: 24, background: 'rgba(10, 1, 30, 0.2)', border: '1px solid rgba(255, 255, 255, 0.03)', position: 'relative' }}>
            <div style={{ position: 'absolute', top: 20, right: 20, fontSize: 10, color: '#475569', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Live Preview</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: isAvailable ? '#10b981' : '#ef4444', boxShadow: isAvailable ? '0 0 8px #10b981' : '0 0 8px #ef4444' }} />
              <span style={{ fontSize: 11, color: isAvailable ? '#10b981' : '#ef4444', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{availability || (isAvailable ? 'AVAILABLE FOR HIRES' : 'NOT ACTIVE')}</span>
            </div>
            <h3 style={{ fontSize: 20, fontWeight: 700, color: '#f8fafc', marginBottom: 12 }}>{title}</h3>
            <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.6, marginBottom: 20 }}>{description || 'No profile summary entered yet.'}</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {statusTags.map(tag => (
                <span key={tag} style={{ fontSize: 10, color: '#f8fafc', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', padding: '4px 10px', borderRadius: 20, fontWeight: 700 }}>{tag}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
