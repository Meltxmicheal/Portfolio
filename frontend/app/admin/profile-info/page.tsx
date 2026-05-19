'use client'
import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import toast from 'react-hot-toast'

export default function ProfileInfoPage() {
  const [skills, setSkills] = useState<any[]>([])
  const [experience, setExperience] = useState<any[]>([])
  const [education, setEducation] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const [newSkill, setNewSkill] = useState('')
  const [activeTab, setActiveTab] = useState<'skills' | 'experience' | 'education'>('experience')

  const loadAll = async () => {
    setLoading(true)
    try {
      const [s, exp, edu] = await Promise.all([
        api.getSkills(),
        api.getExperience(),
        api.getEducation()
      ])
      setSkills(s)
      setExperience(exp)
      setEducation(edu)
    } catch (err) {
      toast.error('Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadAll() }, [])

  // SKILLS LOGIC
  const handleAddSkill = async () => {
    if (!newSkill.trim()) return
    try {
      await api.createSkill({ name: newSkill, category: 'other', proficiency: 100 })
      setNewSkill('')
      loadAll()
      toast.success('Skill added')
    } catch (err) { toast.error('Failed to add skill') }
  }

  const handleDeleteSkill = async (id: string) => {
    try {
      await api.deleteSkill(id)
      loadAll()
      toast.success('Skill removed')
    } catch (err) { toast.error('Failed to remove skill') }
  }

  // SKILLS EDIT LOGIC
  const [editingSkillId, setEditingSkillId] = useState<string | null>(null)
  const [editSkillName, setEditSkillName] = useState('')
  const handleSaveSkill = async (id: string) => {
    if (!editSkillName.trim()) return
    try {
      const existing = skills.find(s => s.id === id)
      await api.updateSkill(id, { 
        name: editSkillName, 
        category: existing?.category || 'other', 
        proficiency: existing?.proficiency || 100,
        is_featured: existing?.is_featured || false
      })
      setEditingSkillId(null)
      loadAll()
      toast.success('Skill updated')
    } catch (err) { toast.error('Failed to update skill') }
  }

  // EXPERIENCE LOGIC
  const [editExp, setEditExp] = useState<any>(null)
  const handleSaveExperience = async () => {
    if (!editExp.role || !editExp.company) { toast.error('Title and Subtitle required'); return }
    try {
      if (editExp.id) await api.updateExperience(editExp.id, editExp)
      else await api.createExperience(editExp)
      setEditExp(null)
      loadAll()
      toast.success('Experience saved')
    } catch (err) { toast.error('Failed to save') }
  }

  // EDUCATION LOGIC
  const [editEdu, setEditEdu] = useState<any>(null)
  const handleSaveEducation = async () => {
    if (!editEdu.degree || !editEdu.institution) { toast.error('Degree and College required'); return }
    try {
      if (editEdu.id) await api.updateEducation(editEdu.id, editEdu)
      else await api.createEducation(editEdu)
      setEditEdu(null)
      loadAll()
      toast.success('Education saved')
    } catch (err) { toast.error('Failed to save') }
  }

  if (loading) return <div style={{ color: '#475569', fontSize: 14 }}>Loading Profile Information...</div>

  return (
    <div>
      <div style={{ marginBottom: 48 }}>
        <h1 className="font-display" style={{ fontSize: 32, fontWeight: 700, color: '#f8fafc', letterSpacing: '-0.03em', marginBottom: 8 }}>Profile Matrix</h1>
        <p style={{ fontSize: 14, color: '#64748b', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Synchronize Identity Records</p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 40, background: 'rgba(255,255,255,0.02)', padding: 8, borderRadius: 20, border: '1px solid rgba(255,255,255,0.05)', width: 'fit-content' }}>
        {[
          { id: 'experience', label: 'EXPERIENCE', icon: '💼' },
          { id: 'skills', label: 'SKILLS', icon: '◈' },
          { id: 'education', label: 'EDUCATION', icon: '🎓' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            style={{
              padding: '12px 24px',
              fontSize: 11,
              fontWeight: 800,
              color: activeTab === tab.id ? '#f8fafc' : '#64748b',
              background: activeTab === tab.id ? 'rgba(124, 58, 237, 0.2)' : 'transparent',
              border: `1px solid ${activeTab === tab.id ? 'rgba(124, 58, 237, 0.3)' : 'transparent'}`,
              cursor: 'none',
              transition: 'all 0.3s cubic-bezier(0.23, 1, 0.32, 1)',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              borderRadius: 14,
              letterSpacing: '0.1em'
            }}
          >
            <span style={{ fontSize: 16, opacity: activeTab === tab.id ? 1 : 0.5 }}>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      <div style={{ minHeight: 400 }}>
        {/* EXPERIENCE SECTION */}
        {activeTab === 'experience' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ fontSize: 14, fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.15em' }}>Deployment History</h2>
              {!editExp && (
                <button onClick={() => setEditExp({ role: '', company: '', description: '', start_date: new Date().toISOString() })} className="btn-primary" style={{ fontSize: 11, padding: '10px 24px', borderRadius: 12, fontWeight: 800 }}>
                  + INITIALIZE RECORD
                </button>
              )}
            </div>

            {editExp ? (
              <div className="glass-card" style={{ padding: 40, borderRadius: 24, background: 'rgba(10, 1, 30, 0.4)', border: '1px solid rgba(255, 255, 255, 0.05)', boxShadow: '0 20px 60px rgba(0,0,0,0.4)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 32 }}>
                  <div>
                    <label style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: 12, fontWeight: 700, letterSpacing: '0.1em' }}>Operational Role</label>
                    <input className="input-field" value={editExp.role} onChange={e => setEditExp({ ...editExp, role: e.target.value })} placeholder="e.g. Lead AI Engineer" />
                  </div>
                  <div>
                    <label style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: 12, fontWeight: 700, letterSpacing: '0.1em' }}>Entity / Company</label>
                    <input className="input-field" value={editExp.company} onChange={e => setEditExp({ ...editExp, company: e.target.value })} placeholder="e.g. MELTX" />
                  </div>
                  <div style={{ gridColumn: '1/-1' }}>
                    <label style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: 12, fontWeight: 700, letterSpacing: '0.1em' }}>Mission Log (Description)</label>
                    <textarea className="input-field" rows={5} value={editExp.description} onChange={e => setEditExp({ ...editExp, description: e.target.value })} placeholder="Detailed responsibilities..." />
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 16 }}>
                  <button onClick={handleSaveExperience} className="btn-primary" style={{ padding: '14px 28px', borderRadius: 14, fontWeight: 800 }}>COMMIT RECORD</button>
                  <button onClick={() => setEditExp(null)} style={{ padding: '14px 28px', borderRadius: 14, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8', fontSize: 13, fontWeight: 700, cursor: 'none' }}>CANCEL</button>
                </div>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: 20 }}>
                {experience.map(exp => (
                  <div key={exp.id} className="glass-card" style={{ padding: 32, borderRadius: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', background: 'rgba(10, 1, 30, 0.4)', border: '1px solid rgba(255, 255, 255, 0.05)', transition: 'all 0.3s ease' }}>
                    <div>
                      <h3 style={{ fontSize: 18, fontWeight: 700, color: '#f8fafc', marginBottom: 6 }}>{exp.role}</h3>
                      <p style={{ fontSize: 13, color: 'var(--violet-glow)', marginBottom: 16, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{exp.company}</p>
                      <p style={{ fontSize: 14, color: '#94a3b8', maxWidth: 700, fontWeight: 500, lineHeight: 1.6 }}>{exp.description}</p>
                    </div>
                    <div style={{ display: 'flex', gap: 20 }}>
                      <button onClick={() => setEditExp(exp)} style={{ fontSize: 12, color: 'var(--violet-glow)', background: 'rgba(124, 58, 237, 0.1)', border: '1px solid rgba(124, 58, 237, 0.2)', padding: '6px 16px', borderRadius: 8, cursor: 'none', fontWeight: 800 }}>EDIT</button>
                      <button onClick={async () => { if (confirm('Wipe record?')) { await api.deleteExperience(exp.id); loadAll(); } }} style={{ fontSize: 12, color: '#ef4444', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '6px 16px', borderRadius: 8, cursor: 'none', fontWeight: 800 }}>WIPE</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* SKILLS SECTION */}
        {activeTab === 'skills' && (
          <div>
            <div style={{ marginBottom: 32 }}>
              <h2 style={{ fontSize: 14, fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 24 }}>Rapid Ingestion</h2>
              <div className="glass-card" style={{ padding: 32, borderRadius: 24, background: 'rgba(10, 1, 30, 0.4)', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                <div style={{ display: 'flex', gap: 16 }}>
                  <input
                    className="input-field"
                    value={newSkill}
                    onChange={e => setNewSkill(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleAddSkill()}
                    placeholder="Identify new protocol (e.g. Neural Networks)"
                  />
                  <button onClick={handleAddSkill} className="btn-primary" style={{ whiteSpace: 'nowrap', padding: '0 32px', borderRadius: 14, fontWeight: 800 }}>INGEST</button>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
              {skills.map(skill => {
                const isEditing = editingSkillId === skill.id;

                return (
                  <div key={skill.id} className="glass-card" style={{ padding: '12px 20px', borderRadius: 14, display: 'flex', alignItems: 'center', gap: 14, background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.05)', transition: 'all 0.2s ease' }}>
                    {isEditing ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <input 
                          className="input-field" 
                          style={{ padding: '6px 12px', fontSize: 13, minWidth: 160 }}
                          value={editSkillName}
                          onChange={e => setEditSkillName(e.target.value)}
                          onKeyDown={e => e.key === 'Enter' && handleSaveSkill(skill.id)}
                          autoFocus
                        />
                        <button onClick={() => handleSaveSkill(skill.id)} style={{ color: '#10b981', background: 'none', border: 'none', fontWeight: 800, fontSize: 14, cursor: 'pointer' }}>✓</button>
                        <button onClick={() => setEditingSkillId(null)} style={{ color: '#94a3b8', background: 'none', border: 'none', fontWeight: 800, fontSize: 14, cursor: 'pointer' }}>×</button>
                      </div>
                    ) : (
                      <>
                        <span 
                          onClick={() => { setEditingSkillId(skill.id); setEditSkillName(skill.name || skill.skill_name); }}
                          style={{ fontSize: 14, fontWeight: 700, color: '#f8fafc', cursor: 'pointer' }}
                          title="Click to Edit"
                        >
                          {skill.name || skill.skill_name}
                        </span>
                        <button onClick={() => handleDeleteSkill(skill.id)} style={{ background: 'rgba(239, 68, 68, 0.1)', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: 18, width: 24, height: 24, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>×</button>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* EDUCATION SECTION */}
        {activeTab === 'education' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ fontSize: 14, fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.15em' }}>Academic Matrix</h2>
              {!editEdu && (
                <button onClick={() => setEditEdu({ degree: '', field: '', institution: '', start_year: 2021, end_year: 2025 })} className="btn-primary" style={{ fontSize: 11, padding: '10px 24px', borderRadius: 12, fontWeight: 800 }}>
                  + INITIALIZE RECORD
                </button>
              )}
            </div>

            {editEdu ? (
              <div className="glass-card" style={{ padding: 40, borderRadius: 24, background: 'rgba(10, 1, 30, 0.4)', border: '1px solid rgba(255, 255, 255, 0.05)', boxShadow: '0 20px 60px rgba(0,0,0,0.4)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 32 }}>
                  <div>
                    <label style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: 12, fontWeight: 700, letterSpacing: '0.1em' }}>Degree Program</label>
                    <input className="input-field" value={editEdu.degree} onChange={e => setEditEdu({ ...editEdu, degree: e.target.value })} placeholder="e.g. Master of Science" />
                  </div>
                  <div>
                    <label style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: 12, fontWeight: 700, letterSpacing: '0.1em' }}>Specialization</label>
                    <input className="input-field" value={editEdu.field} onChange={e => setEditEdu({ ...editEdu, field: e.target.value })} placeholder="e.g. Computer Science" />
                  </div>
                  <div>
                    <label style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: 12, fontWeight: 700, letterSpacing: '0.1em' }}>Academic Institution</label>
                    <input className="input-field" value={editEdu.institution} onChange={e => setEditEdu({ ...editEdu, institution: e.target.value })} placeholder="University Name" />
                  </div>
                  <div>
                    <label style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: 12, fontWeight: 700, letterSpacing: '0.1em' }}>Temporal Cycle (Years)</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <input className="input-field" type="number" value={editEdu.start_year} onChange={e => setEditEdu({ ...editEdu, start_year: parseInt(e.target.value) })} style={{ width: 120 }} />
                      <span style={{ color: '#475569', fontWeight: 800 }}>—</span>
                      <input className="input-field" type="number" value={editEdu.end_year} onChange={e => setEditEdu({ ...editEdu, end_year: parseInt(e.target.value) })} style={{ width: 120 }} />
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 16 }}>
                  <button onClick={handleSaveEducation} className="btn-primary" style={{ padding: '14px 28px', borderRadius: 14, fontWeight: 800 }}>COMMIT RECORD</button>
                  <button onClick={() => setEditEdu(null)} style={{ padding: '14px 28px', borderRadius: 14, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8', fontSize: 13, fontWeight: 700, cursor: 'none' }}>CANCEL</button>
                </div>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: 20 }}>
                {education.map(edu => (
                  <div key={edu.id} className="glass-card" style={{ padding: 32, borderRadius: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', background: 'rgba(10, 1, 30, 0.4)', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    <div>
                      <h3 style={{ fontSize: 18, fontWeight: 700, color: '#f8fafc', marginBottom: 6 }}>{edu.degree}</h3>
                      <p style={{ fontSize: 13, color: 'var(--violet-glow)', marginBottom: 12, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{edu.field}</p>
                      <p style={{ fontSize: 14, color: '#94a3b8', fontWeight: 500 }}>{edu.institution} <span style={{ color: '#475569', margin: '0 8px' }}>//</span> {edu.start_year} — {edu.end_year}</p>
                    </div>
                    <div style={{ display: 'flex', gap: 20 }}>
                      <button onClick={() => setEditEdu(edu)} style={{ fontSize: 12, color: 'var(--violet-glow)', background: 'rgba(124, 58, 237, 0.1)', border: '1px solid rgba(124, 58, 237, 0.2)', padding: '6px 16px', borderRadius: 8, cursor: 'none', fontWeight: 800 }}>EDIT</button>
                      <button onClick={async () => { if (confirm('Wipe record?')) { await api.deleteEducation(edu.id); loadAll(); } }} style={{ fontSize: 12, color: '#ef4444', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '6px 16px', borderRadius: 8, cursor: 'none', fontWeight: 800 }}>WIPE</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
