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

const categories = ['Frontend', 'Backend', 'AI/ML', 'Database', 'Tools', 'Extra Skills']

export default function AdminSkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([])
  const [newSkill, setNewSkill] = useState({ name: '', category: 'Frontend', is_featured: false })
  const [adding, setAdding] = useState(false)
  const [loading, setLoading] = useState(true)

  // Edit states
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState({ name: '', category: 'Frontend', is_featured: false })

  const load = async () => { 
    try {
      const s = await api.getSkills(); 
      setSkills(s || []) 
    } catch (err) {
      toast.error('Failed to load skills')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const handleAdd = async () => {
    if (!newSkill.name.trim()) { toast.error('Skill name required'); return }
    setAdding(true)
    const toastId = toast.loading('Adding skill...')
    try {
      const res = await api.createSkill({ 
        name: newSkill.name.trim(), 
        category: newSkill.category, 
        proficiency: 100, 
        is_featured: newSkill.is_featured 
      })
      toast.success('Skill added!', { id: toastId })
      setSkills(prev => [...prev, res])
      setNewSkill({ name: '', category: 'Frontend', is_featured: false })
    } catch (err: any) {
      toast.error(err.message || 'Failed to add', { id: toastId })
    } finally {
      setAdding(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this skill?')) return
    const originalSkills = [...skills]
    // Optimistic state update
    setSkills(prev => prev.filter(s => s.id !== id))
    try {
      await api.deleteSkill(id)
      toast.success('Skill deleted successfully')
    } catch (err: any) {
      setSkills(originalSkills)
      toast.error(err.message || 'Failed to delete skill')
    }
  }

  const startEdit = (skill: Skill) => {
    setEditingId(skill.id)
    setEditForm({ name: skill.name, category: skill.category, is_featured: skill.is_featured })
  }

  const handleUpdate = async (id: string) => {
    if (!editForm.name.trim()) {
      toast.error('Skill name required')
      return
    }
    const toastId = toast.loading('Saving changes...')
    try {
      const updated = await api.updateSkill(id, {
        name: editForm.name.trim(),
        category: editForm.category,
        proficiency: 100,
        is_featured: editForm.is_featured
      })
      toast.success('Skill updated successfully', { id: toastId })
      setSkills(prev => prev.map(s => s.id === id ? { ...s, ...updated } : s))
      setEditingId(null)
    } catch (err: any) {
      toast.error(err.message || 'Update failed', { id: toastId })
    }
  }

  // Group by category correctly matching exact user casing
  const grouped = categories.reduce((acc, cat) => {
    acc[cat] = skills.filter(s => (s.category || '').toLowerCase() === cat.toLowerCase())
    return acc
  }, {} as Record<string, Skill[]>)

  const catColor: Record<string, string> = {
    Frontend: '#a78bfa', 
    Backend: '#60a5fa', 
    'AI/ML': '#22d3ee', 
    Database: '#34d399',
    Tools: '#f472b6', 
    'Extra Skills': '#94a3b8'
  }

  if (loading) return <div style={{ color: '#94a3b8', padding: 24, fontSize: 16 }}>Loading skill sectors...</div>

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 48 }}>
        <div>
          <h1 className="font-display" style={{ fontSize: 32, fontWeight: 700, color: '#f8fafc', letterSpacing: '-0.03em', marginBottom: 8 }}>Skill Matrix</h1>
          <p style={{ fontSize: 14, color: '#64748b', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>{skills.length} Fresher Tech Pillars</p>
        </div>
      </div>

      {/* Add new */}
      <div className="glass-card" style={{ padding: 32, borderRadius: 24, marginBottom: 48, background: 'rgba(10, 1, 30, 0.4)', border: '1px solid rgba(255, 255, 255, 0.05)', boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}>
        <h2 style={{ fontSize: 11, fontWeight: 800, color: '#64748b', marginBottom: 24, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Add Category Skill</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr auto auto', gap: 20, alignItems: 'center', flexWrap: 'wrap' }}>
          <input 
            className="input-field" 
            placeholder="Skill Identifier (e.g. React.js)" 
            value={newSkill.name} 
            onChange={e => setNewSkill(s => ({ ...s, name: e.target.value }))} 
            onKeyDown={e => e.key === 'Enter' && handleAdd()} 
          />
          <select 
            className="input-field" 
            value={newSkill.category} 
            onChange={e => setNewSkill(s => ({ ...s, category: e.target.value }))} 
            style={{ appearance: 'none' }}
          >
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <label style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 11, color: '#64748b', whiteSpace: 'nowrap', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', cursor: 'pointer' }}>
            <input 
              type="checkbox" 
              checked={newSkill.is_featured} 
              onChange={e => setNewSkill(s => ({ ...s, is_featured: e.target.checked })) } 
              style={{ width: 16, height: 16, accentColor: 'var(--violet-glow)', cursor: 'pointer' }} 
            />
            Priority Star
          </label>
          <button onClick={handleAdd} className="btn-primary" disabled={adding} style={{ fontSize: 12, padding: '12px 24px', whiteSpace: 'nowrap', borderRadius: 12, fontWeight: 800 }}>
            ADD SKILL
          </button>
        </div>
      </div>

      {/* Skills by category */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: 24 }}>
        {categories.map(cat => {
          const catSkills = grouped[cat] || []
          return (
            <div key={cat} className="glass-card" style={{ padding: 32, borderRadius: 24, background: 'rgba(10, 1, 30, 0.4)', border: '1px solid rgba(255, 255, 255, 0.05)', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: catColor[cat] || '#64748b', boxShadow: `0 0 10px ${catColor[cat] || '#64748b'}` }} />
                <h3 style={{ fontSize: 12, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em', color: catColor[cat] || '#f8fafc' }}>{cat}</h3>
                <span style={{ fontSize: 11, color: '#475569', marginLeft: 'auto', fontWeight: 800 }}>{catSkills.length} SKILLS</span>
              </div>
              
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, flex: 1 }}>
                {catSkills.map(skill => {
                  const isEditing = editingId === skill.id

                  return (
                    <div 
                      key={skill.id} 
                      className="glass-card"
                      style={{ 
                        padding: '10px 16px', 
                        borderRadius: 14, 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 12, 
                        background: 'rgba(255,255,255,0.02)', 
                        border: '1px solid rgba(255,255,255,0.05)', 
                        transition: 'all 0.2s ease' 
                      }}
                    >
                      {isEditing ? (
                        /* Edit mode row */
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <input 
                            className="input-field" 
                            style={{ padding: '4px 8px', fontSize: 12, width: 120 }}
                            value={editForm.name} 
                            onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))}
                            placeholder="Name..."
                          />
                          <select 
                            className="input-field" 
                            style={{ padding: '4px 8px', fontSize: 12, width: 90 }}
                            value={editForm.category} 
                            onChange={e => setEditForm(f => ({ ...f, category: e.target.value }))}
                          >
                            {categories.map(c => <option key={c} value={c}>{c}</option>)}
                          </select>
                          <label style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, color: '#64748b', cursor: 'pointer' }}>
                            <input 
                              type="checkbox" 
                              checked={editForm.is_featured} 
                              onChange={e => setEditForm(f => ({ ...f, is_featured: e.target.checked }))} 
                              style={{ width: 12, height: 12, accentColor: 'var(--violet-glow)' }} 
                            />
                            ★
                          </label>
                          <button 
                            onClick={() => handleUpdate(skill.id)} 
                            style={{ color: '#10b981', background: 'none', border: 'none', fontWeight: 800, fontSize: 12, cursor: 'pointer' }}
                          >
                            ✓
                          </button>
                          <button 
                            onClick={() => setEditingId(null)} 
                            style={{ color: '#94a3b8', background: 'none', border: 'none', fontWeight: 800, fontSize: 12, cursor: 'pointer' }}
                          >
                            ×
                          </button>
                        </div>
                      ) : (
                        /* Normal display row */
                        <>
                          <span style={{ fontSize: 13, color: '#f8fafc', fontWeight: 700 }}>{skill.name}</span>
                          {skill.is_featured && <span style={{ fontSize: 11, color: 'var(--violet-glow)' }}>★</span>}
                          
                          {/* Actions */}
                          <div style={{ display: 'flex', gap: 6 }}>
                            <button 
                              onClick={() => startEdit(skill)} 
                              style={{ color: '#475569', background: 'none', border: 'none', transition: 'all 0.2s ease', cursor: 'pointer', padding: 2 }}
                              onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#60a5fa'}
                              onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = '#475569'}
                              title="Edit Skill"
                            >
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 20h9M16.5 3.5a2.121 2.121 0 113 3L7 19l-4 1 1-4L16.5 3.5z" strokeLinecap="round" strokeLinejoin="round"/></svg>
                            </button>
                            <button 
                              onClick={() => handleDelete(skill.id)} 
                              style={{ color: '#475569', background: 'none', border: 'none', transition: 'all 0.2s ease', cursor: 'pointer', padding: 2 }}
                              onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#ef4444'}
                              onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = '#475569'}
                              title="Delete Skill"
                            >
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" strokeLinecap="round" strokeLinejoin="round"/></svg>
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  )
                })}
                {catSkills.length === 0 && (
                  <p style={{ color: '#475569', fontSize: 12, fontStyle: 'italic', margin: 'auto 0', width: '100%', textAlign: 'center', padding: '16px 0' }}>No skills in this category.</p>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
