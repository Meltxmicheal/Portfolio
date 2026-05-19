'use client'
import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import toast from 'react-hot-toast'

interface Skill {
  id: string;
  name: string;
  category: string;
  proficiency: number;
  is_featured: boolean;
}

const categories = ['frontend', 'backend', 'devops', 'design', 'other']

export default function AdminSkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([])
  const [newSkill, setNewSkill] = useState({ name: '', category: 'frontend', proficiency: 80, is_featured: false })
  const [adding, setAdding] = useState(false)

  // Edit states
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState({ name: '', category: 'frontend', proficiency: 80, is_featured: false })

  const load = async () => { 
    try {
      const s = await api.getSkills(); 
      setSkills(s) 
    } catch (err) {
      toast.error('Failed to load skills')
    }
  }

  useEffect(() => { load() }, [])

  const handleAdd = async () => {
    if (!newSkill.name.trim()) { toast.error('Skill name required'); return }
    setAdding(true)
    try {
      await api.createSkill({ ...newSkill, skill_name: newSkill.name })
      toast.success('Skill added!')
      setNewSkill({ name: '', category: 'frontend', proficiency: 80, is_featured: false })
      load()
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setAdding(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete skill?')) return
    try {
      await api.deleteSkill(id)
      toast.success('Deleted')
      load()
    } catch (err: any) {
      toast.error(err.message)
    }
  }

  const startEdit = (skill: Skill) => {
    setEditingId(skill.id)
    setEditForm({ name: skill.name, category: skill.category, proficiency: skill.proficiency, is_featured: skill.is_featured })
  }

  const handleUpdate = async (id: string) => {
    if (!editForm.name.trim()) {
      toast.error('Skill name required')
      return
    }
    const toastId = toast.loading('Saving changes...')
    try {
      await api.updateSkill(id, editForm)
      toast.success('Skill updated successfully', { id: toastId })
      setEditingId(null)
      load()
    } catch (err: any) {
      toast.error(err.message || 'Update failed', { id: toastId })
    }
  }

  const grouped = categories.reduce((acc, cat) => {
    acc[cat] = skills.filter(s => s.category === cat)
    return acc
  }, {} as Record<string, Skill[]>)

  const catColor: Record<string, string> = {
    frontend: '#a78bfa', backend: '#60a5fa', devops: '#22d3ee', design: '#f472b6', other: '#94a3b8'
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 48 }}>
        <div>
          <h1 className="font-display" style={{ fontSize: 32, fontWeight: 700, color: '#f8fafc', letterSpacing: '-0.03em', marginBottom: 8 }}>Skill Matrix</h1>
          <p style={{ fontSize: 14, color: '#64748b', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>{skills.length} Protocols Active</p>
        </div>
      </div>

      {/* Add new */}
      <div className="glass-card" style={{ padding: 32, borderRadius: 24, marginBottom: 48, background: 'rgba(10, 1, 30, 0.4)', border: '1px solid rgba(255, 255, 255, 0.05)', boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}>
        <h2 style={{ fontSize: 11, fontWeight: 800, color: '#64748b', marginBottom: 24, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Initialize New Protocol</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto auto', gap: 20, alignItems: 'center', flexWrap: 'wrap' }}>
          <input className="input-field" placeholder="Skill Identifier (e.g. React)" value={newSkill.name} onChange={e => setNewSkill(s => ({ ...s, name: e.target.value }))} onKeyDown={e => e.key === 'Enter' && handleAdd()} />
          <select className="input-field" value={newSkill.category} onChange={e => setNewSkill(s => ({ ...s, category: e.target.value }))} style={{ appearance: 'none' }}>
            {categories.map(c => <option key={c} value={c}>{c.toUpperCase()}</option>)}
          </select>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <input type="range" min={10} max={100} step={5} value={newSkill.proficiency} onChange={e => setNewSkill(s => ({ ...s, proficiency: parseInt(e.target.value) }))} style={{ flex: 1, accentColor: 'var(--violet-glow)', height: 4, borderRadius: 2 }} />
            <span style={{ fontSize: 13, color: '#94a3b8', minWidth: 36, fontWeight: 700, fontFamily: 'JetBrains Mono, monospace' }}>{newSkill.proficiency}%</span>
          </div>
          <label style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 11, color: '#64748b', whiteSpace: 'nowrap', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', cursor: 'pointer' }}>
            <input type="checkbox" checked={newSkill.is_featured} onChange={e => setNewSkill(s => ({ ...s, is_featured: e.target.checked })) } style={{ width: 16, height: 16, accentColor: 'var(--violet-glow)', cursor: 'pointer' }} />
            Priority
          </label>
          <button onClick={handleAdd} className="btn-primary" disabled={adding} style={{ fontSize: 12, padding: '12px 24px', whiteSpace: 'nowrap', borderRadius: 12, fontWeight: 800 }}>
            ADD PROTOCOL
          </button>
        </div>
      </div>

      {/* Skills by category */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: 24 }}>
        {categories.map(cat => {
          const catSkills = grouped[cat] || []
          if (catSkills.length === 0) return null
          return (
            <div key={cat} className="glass-card" style={{ padding: 32, borderRadius: 24, background: 'rgba(10, 1, 30, 0.4)', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: catColor[cat], boxShadow: `0 0 10px ${catColor[cat]}` }} />
                <h3 style={{ fontSize: 12, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em', color: catColor[cat] }}>{cat}</h3>
                <span style={{ fontSize: 11, color: '#475569', marginLeft: 'auto', fontWeight: 800 }}>{catSkills.length} UNITS</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {catSkills.map(skill => {
                  const isEditing = editingId === skill.id

                  return (
                    <div key={skill.id} style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: '14px 18px', borderRadius: 16, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', transition: 'all 0.2s ease' }}>
                      {isEditing ? (
                        /* Edit mode row */
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%' }}>
                          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 12 }}>
                            <input 
                              className="input-field" 
                              style={{ padding: '8px 12px', fontSize: 13 }}
                              value={editForm.name} 
                              onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))}
                              placeholder="Skill name..."
                            />
                            <select 
                              className="input-field" 
                              style={{ padding: '8px 12px', fontSize: 13, appearance: 'none' }}
                              value={editForm.category} 
                              onChange={e => setEditForm(f => ({ ...f, category: e.target.value }))}
                            >
                              {categories.map(c => <option key={c} value={c}>{c.toUpperCase()}</option>)}
                            </select>
                          </div>
                          
                          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1 }}>
                              <input 
                                type="range" 
                                min={10} 
                                max={100} 
                                step={5} 
                                value={editForm.proficiency} 
                                onChange={e => setEditForm(f => ({ ...f, proficiency: parseInt(e.target.value) }))} 
                                style={{ flex: 1, accentColor: 'var(--violet-glow)', height: 4 }} 
                              />
                              <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 700, fontFamily: 'JetBrains Mono' }}>{editForm.proficiency}%</span>
                            </div>
                            <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#64748b', cursor: 'pointer', userSelect: 'none' }}>
                              <input 
                                type="checkbox" 
                                checked={editForm.is_featured} 
                                onChange={e => setEditForm(f => ({ ...f, is_featured: e.target.checked }))} 
                                style={{ width: 14, height: 14, accentColor: 'var(--violet-glow)' }} 
                              />
                              Starred
                            </label>
                          </div>

                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 4 }}>
                            <button 
                              onClick={() => handleUpdate(skill.id)} 
                              className="btn-primary" 
                              style={{ padding: '8px', fontSize: 11, justifyContent: 'center', borderRadius: 8 }}
                            >
                              Save
                            </button>
                            <button 
                              onClick={() => setEditingId(null)} 
                              className="btn-ghost" 
                              style={{ padding: '8px', fontSize: 11, justifyContent: 'center', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)' }}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        /* Normal display row */
                        <div style={{ display: 'flex', alignItems: 'center', gap: 14, width: '100%' }}>
                          <span style={{ fontSize: 14, color: '#f8fafc', flex: 1, fontWeight: 700 }}>{skill.name}</span>
                          {skill.is_featured && <span style={{ fontSize: 12, color: 'var(--violet-glow)', textShadow: '0 0 8px rgba(124,58,237,0.4)' }}>★</span>}
                          <div style={{ width: 80, height: 4, background: 'rgba(255,255,255,0.05)', borderRadius: 2, overflow: 'hidden' }}>
                            <div style={{ width: `${skill.proficiency}%`, height: '100%', background: catColor[cat] }} />
                          </div>
                          <span style={{ fontSize: 11, color: '#64748b', minWidth: 32, fontFamily: 'JetBrains Mono, monospace', fontWeight: 700 }}>{skill.proficiency}%</span>
                          
                          {/* Actions */}
                          <div style={{ display: 'flex', gap: 8 }}>
                            <button 
                              onClick={() => startEdit(skill)} 
                              style={{ color: '#475569', background: 'none', border: 'none', transition: 'all 0.2s ease', cursor: 'pointer', padding: 4 }}
                              onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#60a5fa'}
                              onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = '#475569'}
                              title="Edit Skill"
                            >
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 20h9M16.5 3.5a2.121 2.121 0 113 3L7 19l-4 1 1-4L16.5 3.5z" strokeLinecap="round" strokeLinejoin="round"/></svg>
                            </button>
                            <button 
                              onClick={() => handleDelete(skill.id)} 
                              style={{ color: '#475569', background: 'none', border: 'none', transition: 'all 0.2s ease', cursor: 'pointer', padding: 4 }}
                              onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#ef4444'}
                              onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = '#475569'}
                              title="Wipe Skill"
                            >
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" strokeLinecap="round" strokeLinejoin="round"/></svg>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
