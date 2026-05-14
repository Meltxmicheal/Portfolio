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
    try {
      await api.deleteSkill(id)
      toast.success('Deleted')
      load()
    } catch (err: any) {
      toast.error(err.message)
    }
  }

  const updateSkill = async (id: string, updates: Partial<Skill>) => {
    // Backend doesn't have updateSkill yet, we could add it
    toast.error('Update not implemented in backend yet')
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
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto auto', gap: 20, alignItems: 'center' }}>
          <input className="input-field" placeholder="Skill Identifier (e.g. React)" value={newSkill.name} onChange={e => setNewSkill(s => ({ ...s, name: e.target.value }))} onKeyDown={e => e.key === 'Enter' && handleAdd()} />
          <select className="input-field" value={newSkill.category} onChange={e => setNewSkill(s => ({ ...s, category: e.target.value }))} style={{ appearance: 'none' }}>
            {categories.map(c => <option key={c} value={c}>{c.toUpperCase()}</option>)}
          </select>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <input type="range" min={10} max={100} step={5} value={newSkill.proficiency} onChange={e => setNewSkill(s => ({ ...s, proficiency: parseInt(e.target.value) }))} style={{ flex: 1, accentColor: 'var(--violet-glow)', height: 4, borderRadius: 2 }} />
            <span style={{ fontSize: 13, color: '#94a3b8', minWidth: 36, fontWeight: 700, fontFamily: 'JetBrains Mono, monospace' }}>{newSkill.proficiency}%</span>
          </div>
          <label style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 11, color: '#64748b', whiteSpace: 'nowrap', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', cursor: 'none' }}>
            <input type="checkbox" checked={newSkill.is_featured} onChange={e => setNewSkill(s => ({ ...s, is_featured: e.target.checked })) } style={{ width: 16, height: 16, accentColor: 'var(--violet-glow)', cursor: 'none' }} />
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
                {catSkills.map(skill => (
                  <div key={skill.id} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '14px 18px', borderRadius: 16, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', transition: 'all 0.2s ease' }}>
                    <span style={{ fontSize: 14, color: '#f8fafc', flex: 1, fontWeight: 700 }}>{skill.name}</span>
                    {skill.is_featured && <span style={{ fontSize: 12, color: 'var(--violet-glow)', textShadow: '0 0 8px rgba(124,58,237,0.4)' }}>★</span>}
                    <div style={{ width: 80, height: 4, background: 'rgba(255,255,255,0.05)', borderRadius: 2, overflow: 'hidden' }}>
                      <div style={{ width: `${skill.proficiency}%`, height: '100%', background: catColor[cat] }} />
                    </div>
                    <span style={{ fontSize: 11, color: '#64748b', minWidth: 32, fontFamily: 'JetBrains Mono, monospace', fontWeight: 700 }}>{skill.proficiency}%</span>
                    <button onClick={() => handleDelete(skill.id)} style={{ color: '#475569', background: 'none', border: 'none', transition: 'all 0.2s ease', cursor: 'none', padding: 4 }}
                      onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#ef4444'}
                      onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = '#475569'}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
