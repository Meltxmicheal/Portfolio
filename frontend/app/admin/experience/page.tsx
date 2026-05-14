'use client'
import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import toast from 'react-hot-toast'

interface Experience {
  id: string;
  company: string;
  role: string;
  start_date: string;
  end_date: string | null;
  is_current: boolean;
  description: string;
  technologies: string[];
  company_url: string;
  logo_url: string;
  sort_order: number;
}

const empty: Omit<Experience, 'id'> = {
  company: '', role: '', start_date: '', end_date: null,
  is_current: false, description: '', technologies: [],
  company_url: '', logo_url: '', sort_order: 0,
}

export default function AdminExperiencePage() {
  const [items, setItems] = useState<Experience[]>([])
  const [selected, setSelected] = useState<Partial<Experience> | null>(null)
  const [saving, setSaving] = useState(false)

  const load = async () => { 
    try {
      const e = await api.getExperience(); 
      setItems(e) 
    } catch (err) {
      toast.error('Failed to load experience')
    }
  }
  useEffect(() => { load() }, [])

  const handleSave = async () => {
    if (!selected?.company || !selected?.role) { toast.error('Company and role required'); return }
    setSaving(true)
    try {
      if (selected.id) {
        await api.updateExperience(selected.id, selected)
        toast.success('Updated!')
      } else {
        await api.createExperience({ ...empty, ...selected, sort_order: items.length })
        toast.success('Added!')
        setSelected(null)
      }
      load()
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete?')) return
    try {
      await api.deleteExperience(id)
      toast.success('Deleted')
      load()
      if (selected?.id === id) setSelected(null)
    } catch (err: any) {
      toast.error(err.message)
    }
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '360px 1fr', gap: 32, minHeight: 'calc(100vh - 96px)' }}>
      {/* List */}
      <div className="glass-card" style={{ borderRadius: 24, overflow: 'hidden', alignSelf: 'start', background: 'rgba(10, 1, 30, 0.4)', border: '1px solid rgba(255, 255, 255, 0.05)', boxShadow: '0 10px 40px rgba(0,0,0,0.3)' }}>
        <div style={{ padding: '24px 28px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 className="font-display" style={{ fontSize: 20, fontWeight: 700, color: '#f8fafc', letterSpacing: '-0.02em' }}>Career Log</h1>
          <button onClick={() => setSelected({ ...empty })} className="btn-primary" style={{ fontSize: 11, padding: '8px 16px', borderRadius: 10, textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 800 }}>+ ADD</button>
        </div>
        <div style={{ padding: '16px' }} className="custom-scrollbar">
          {items.map(item => (
            <div key={item.id} onClick={() => setSelected(item)} style={{ padding: '16px 20px', borderRadius: 16, marginBottom: 10, cursor: 'none', transition: 'all 0.3s cubic-bezier(0.23, 1, 0.32, 1)', background: selected?.id === item.id ? 'rgba(124, 58, 237, 0.1)' : 'rgba(255, 255, 255, 0.02)', border: `1px solid ${selected?.id === item.id ? 'rgba(124, 58, 237, 0.3)' : 'rgba(255, 255, 255, 0.05)'}`, transform: selected?.id === item.id ? 'translateX(4px)' : 'none' }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: selected?.id === item.id ? '#f8fafc' : '#94a3b8', marginBottom: 4 }}>{item.company}</div>
              <div style={{ fontSize: 11, color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>{item.role}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 10, color: 'var(--violet-glow)', fontFamily: 'JetBrains Mono, monospace', fontWeight: 800 }}>
                  {new Date(item.start_date).getFullYear()} — {item.is_current ? 'PRESENT' : item.end_date ? new Date(item.end_date).getFullYear() : '—'}
                </span>
                <button onClick={e => { e.stopPropagation(); handleDelete(item.id) }} style={{ color: '#475569', background: 'none', border: 'none', transition: 'all 0.2s ease', cursor: 'none', padding: 4 }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#ef4444'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = '#475569'}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>
              </div>
            </div>
          ))}
          {items.length === 0 && <p style={{ color: '#64748b', fontSize: 13, padding: '32px 20px', fontStyle: 'italic', textAlign: 'center' }}>No experience logged.</p>}
        </div>
      </div>

      {/* Editor */}
      {selected ? (
        <div className="glass-card" style={{ padding: 40, borderRadius: 24, alignSelf: 'start', background: 'rgba(10, 1, 30, 0.4)', border: '1px solid rgba(255, 255, 255, 0.05)', boxShadow: '0 20px 60px rgba(0,0,0,0.4)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: '#f8fafc', letterSpacing: '-0.02em' }}>{selected.id ? 'Modify Record' : 'Initialize Record'}</h2>
            <button onClick={handleSave} className="btn-primary" disabled={saving} style={{ fontSize: 13, padding: '10px 24px', borderRadius: 14, opacity: saving ? 0.7 : 1, fontWeight: 800 }}>
              {saving ? 'SYNCING...' : 'COMMIT CHANGES'}
            </button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
            {[
              { label: 'Company Name', key: 'company' },
              { label: 'Designation / Role', key: 'role' },
              { label: 'Corporate Uplink (URL)', key: 'company_url', type: 'url' },
            ].map(f => (
              <div key={f.key}>
                <label style={{ fontSize: 11, color: '#64748b', letterSpacing: '0.15em', textTransform: 'uppercase', display: 'block', marginBottom: 12, fontWeight: 700 }}>{f.label}</label>
                <input className="input-field" type={f.type || 'text'} value={(selected as any)[f.key] || ''} onChange={e => setSelected(p => p ? { ...p, [f.key]: e.target.value } : p)} />
              </div>
            ))}
            <div>
              <label style={{ fontSize: 11, color: '#64748b', letterSpacing: '0.15em', textTransform: 'uppercase', display: 'block', marginBottom: 12, fontWeight: 700 }}>Start Date</label>
              <input className="input-field" type="date" value={selected.start_date?.slice(0, 10) || ''} onChange={e => setSelected(p => p ? { ...p, start_date: e.target.value } : p)} />
            </div>
            <div>
              <label style={{ fontSize: 11, color: '#64748b', letterSpacing: '0.15em', textTransform: 'uppercase', display: 'block', marginBottom: 12, fontWeight: 700 }}>End Date</label>
              <input className="input-field" type="date" value={selected.end_date?.slice(0, 10) || ''} onChange={e => setSelected(p => p ? { ...p, end_date: e.target.value || null } : p)} disabled={!!selected.is_current} />
            </div>
            <div style={{ gridColumn: '1/-1', display: 'flex', alignItems: 'center', gap: 12, padding: '16px', borderRadius: 16, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
              <input type="checkbox" id="is_current" checked={!!selected.is_current} onChange={e => setSelected(p => p ? { ...p, is_current: e.target.checked, end_date: e.target.checked ? null : p.end_date } : p)} style={{ width: 18, height: 18, accentColor: 'var(--violet-glow)', cursor: 'none' }} />
              <label htmlFor="is_current" style={{ fontSize: 12, color: '#94a3b8', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', cursor: 'none' }}>Active Deployment (Currently working here)</label>
            </div>
            <div style={{ gridColumn: '1/-1' }}>
              <label style={{ fontSize: 11, color: '#64748b', letterSpacing: '0.15em', textTransform: 'uppercase', display: 'block', marginBottom: 12, fontWeight: 700 }}>Mission Brief (Description)</label>
              <textarea className="input-field" rows={5} value={selected.description || ''} onChange={e => setSelected(p => p ? { ...p, description: e.target.value } : p)} style={{ resize: 'vertical' }} placeholder="Detail your core responsibilities..." />
            </div>
            <div style={{ gridColumn: '1/-1' }}>
              <label style={{ fontSize: 11, color: '#64748b', letterSpacing: '0.15em', textTransform: 'uppercase', display: 'block', marginBottom: 12, fontWeight: 700 }}>Neural Links (Technologies)</label>
              <input className="input-field" value={(selected.technologies || []).join(', ')} onChange={e => setSelected(p => p ? { ...p, technologies: e.target.value.split(',').map(t => t.trim()).filter(Boolean) } : p)} placeholder="React, Node.js, AWS..." />
            </div>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', background: 'rgba(10, 1, 30, 0.4)', borderRadius: 24, border: '1px solid rgba(255, 255, 255, 0.05)' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 56, marginBottom: 24, color: 'var(--violet-glow)', opacity: 0.5 }}>◎</div>
            <p style={{ fontSize: 16, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Select Record for Modification</p>
          </div>
        </div>
      )}
    </div>
  )
}
