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

interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  start_year: number;
  end_year: number | null;
  gpa: string;
  description: string;
}

const skillCategories = ['Frontend', 'Backend', 'AI/ML', 'Database', 'Tools', 'Extra Skills']

export default function ProfileInfoPage() {
  const [skills, setSkills] = useState<Skill[]>([])
  const [experience, setExperience] = useState<any[]>([])
  const [education, setEducation] = useState<Education[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'skills' | 'experience' | 'education'>('experience')

  // EXPERIENCE STATES (Unified Fresher Profile)
  const [expRecord, setExpRecord] = useState<any>(null)
  const [expTitle, setExpTitle] = useState('Fresher / AI-ML Student')
  const [expDescription, setExpDescription] = useState('')
  const [expAvailability, setExpAvailability] = useState('Available for Opportunities')
  const [expIsAvailable, setExpIsAvailable] = useState(true)
  const [expTags, setExpTags] = useState<string[]>(['Open to Internships', 'Open to Freelance', 'Open to Collaborations'])
  const [newExpTag, setNewExpTag] = useState('')

  // SKILLS STATES
  const [newSkill, setNewSkill] = useState({ name: '', category: 'Frontend', is_featured: false })
  const [addingSkill, setAddingSkill] = useState(false)
  const [editingSkillId, setEditingSkillId] = useState<string | null>(null)
  const [editSkillForm, setEditSkillForm] = useState({ name: '', category: 'Frontend', is_featured: false })

  // EDUCATION STATES
  const [editingEduId, setEditingEduId] = useState<string | null>(null)
  const [newEdu, setNewEdu] = useState({ institution: '', degree: '', field: '', start_year: 2023, end_year: 2026, gpa: '', description: '' })
  const [editEduForm, setEditEduForm] = useState({ institution: '', degree: '', field: '', start_year: 2023, end_year: 2026, gpa: '', description: '' })
  const [addingEdu, setAddingEdu] = useState(false)

  const loadAll = async () => {
    setLoading(true)
    try {
      const [s, exp, edu] = await Promise.all([
        api.getSkills(),
        api.getExperience(),
        api.getEducation()
      ])
      setSkills(s || [])
      setExperience(exp || [])
      setEducation(edu || [])

      // Load Experience Fresher Settings
      if (exp && exp.length > 0) {
        const record = exp[0]
        setExpRecord(record)
        setExpTitle(record.role || 'Fresher / AI-ML Student')
        setExpDescription(record.description || '')
        setExpAvailability(record.company || 'Available for Opportunities')
        setExpIsAvailable(!!record.is_current)
        setExpTags(record.technologies || ['Open to Internships', 'Open to Freelance', 'Open to Collaborations'])
      } else {
        setExpDescription('Passionate AI/ML and Full Stack developer focused on building modern web applications, intelligent systems, and real-world projects while continuously learning new technologies.')
      }
    } catch (err) {
      toast.error('Failed to load neural identity sectors')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadAll() }, [])

  // ================= EXPERIENCE LOGIC =================
  const handleSaveExperience = async () => {
    if (!expTitle.trim() || !expDescription.trim()) {
      toast.error('Title and Summary Description required')
      return
    }
    const toastId = toast.loading('Syncing Fresher matrix...')
    try {
      const payload = {
        role: expTitle.trim(),
        description: expDescription.trim(),
        company: expAvailability.trim(),
        technologies: expTags,
        is_current: expIsAvailable,
        start_date: new Date().toISOString(),
        end_date: null,
        company_url: '',
        logo_url: '',
        sort_order: 0
      }

      if (expRecord?.id) {
        const res = await api.updateExperience(expRecord.id, payload)
        setExpRecord(res)
      } else {
        const res = await api.createExperience(payload)
        setExpRecord(res)
      }
      toast.success('Fresher profile synchronized', { id: toastId })
      loadAll()
    } catch (err) {
      toast.error('Failed to synchronize Fresher Profile', { id: toastId })
    }
  }

  const handleAddExpTag = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newExpTag.trim()) return
    if (expTags.includes(newExpTag.trim())) {
      toast.error('Tag already exists')
      return
    }
    setExpTags([...expTags, newExpTag.trim()])
    setNewExpTag('')
  }

  const handleRemoveExpTag = (tag: string) => {
    setExpTags(expTags.filter(t => t !== tag))
  }

  // ================= SKILLS LOGIC =================
  const handleAddSkill = async () => {
    if (!newSkill.name.trim()) return
    setAddingSkill(true)
    const toastId = toast.loading('Ingesting skill...')
    try {
      const res = await api.createSkill({
        name: newSkill.name.trim(),
        category: newSkill.category,
        proficiency: 100,
        is_featured: newSkill.is_featured
      })
      toast.success('Skill added successfully', { id: toastId })
      setSkills(prev => [...prev, res])
      setNewSkill({ name: '', category: 'Frontend', is_featured: false })
    } catch (err) { 
      toast.error('Failed to add skill', { id: toastId }) 
    } finally {
      setAddingSkill(false)
    }
  }

  const handleDeleteSkill = async (id: string) => {
    if (!confirm('Are you sure you want to delete this skill?')) return
    const originalSkills = [...skills]
    // Optimistic Delete
    setSkills(prev => prev.filter(s => s.id !== id))
    try {
      await api.deleteSkill(id)
      toast.success('Skill removed')
    } catch (err) { 
      setSkills(originalSkills)
      toast.error('Failed to remove skill') 
    }
  }

  const handleStartEditSkill = (skill: Skill) => {
    setEditingSkillId(skill.id)
    setEditSkillForm({ name: skill.name, category: skill.category, is_featured: skill.is_featured })
  }

  const handleUpdateSkill = async (id: string) => {
    if (!editSkillForm.name.trim()) return
    const toastId = toast.loading('Updating skill tag...')
    try {
      const updated = await api.updateSkill(id, {
        name: editSkillForm.name.trim(),
        category: editSkillForm.category,
        proficiency: 100,
        is_featured: editSkillForm.is_featured
      })
      toast.success('Skill updated successfully', { id: toastId })
      setSkills(prev => prev.map(s => s.id === id ? { ...s, ...updated } : s))
      setEditingSkillId(null)
    } catch (err) {
      toast.error('Failed to update skill', { id: toastId })
    }
  }

  // ================= EDUCATION LOGIC =================
  const handleAddEducation = async () => {
    if (!newEdu.institution.trim() || !newEdu.degree.trim()) {
      toast.error('Institution and Degree Program are required')
      return
    }
    setAddingEdu(true)
    const toastId = toast.loading('Initializing Academic Record...')
    try {
      const res = await api.createEducation({
        ...newEdu,
        is_current: false,
        logo_url: '',
        sort_order: education.length
      })
      toast.success('Academic record added!', { id: toastId })
      setEducation(prev => [...prev, res])
      setNewEdu({ institution: '', degree: '', field: '', start_year: 2023, end_year: 2026, gpa: '', description: '' })
    } catch (err: any) {
      toast.error(err.message || 'Failed to add record', { id: toastId })
    } finally {
      setAddingEdu(false)
    }
  }

  const handleDeleteEducation = async (id: string) => {
    if (!confirm('Are you sure you want to delete this educational record?')) return
    const originalEdu = [...education]
    // Optimistic Delete
    setEducation(prev => prev.filter(e => e.id !== id))
    try {
      await api.deleteEducation(id)
      toast.success('Record wiped successfully')
    } catch (err) {
      setEducation(originalEdu)
      toast.error('Failed to delete education record')
    }
  }

  const handleStartEditEdu = (edu: Education) => {
    setEditingEduId(edu.id)
    setEditEduForm({
      institution: edu.institution,
      degree: edu.degree,
      field: edu.field,
      start_year: edu.start_year || 2023,
      end_year: edu.end_year || 2026,
      gpa: edu.gpa || '',
      description: edu.description || ''
    })
  }

  const handleUpdateEducation = async (id: string) => {
    if (!editEduForm.institution.trim() || !editEduForm.degree.trim()) {
      toast.error('Institution and Degree required')
      return
    }
    const toastId = toast.loading('Syncing educational updates...')
    try {
      const updated = await api.updateEducation(id, {
        ...editEduForm,
        is_current: false,
        logo_url: '',
        sort_order: 0
      })
      toast.success('Education record updated!', { id: toastId })
      setEducation(prev => prev.map(e => e.id === id ? { ...e, ...updated } : e))
      setEditingEduId(null)
    } catch (err: any) {
      toast.error(err.message || 'Failed to update', { id: toastId })
    }
  }

  if (loading) return <div style={{ color: '#475569', fontSize: 14 }}>Syncing Profile Information...</div>

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
              cursor: 'pointer',
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
        {/* ================= EXPERIENCE TAB ================= */}
        {activeTab === 'experience' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
            <div className="glass-card" style={{ padding: 40, borderRadius: 24, background: 'rgba(10, 1, 30, 0.4)', border: '1px solid rgba(255, 255, 255, 0.05)', boxShadow: '0 20px 60px rgba(0,0,0,0.4)', alignSelf: 'start' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
                <h2 style={{ fontSize: 14, fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.15em' }}>Fresher Profile Settings</h2>
                <button onClick={handleSaveExperience} className="btn-primary" style={{ fontSize: 11, padding: '10px 24px', borderRadius: 12, fontWeight: 800 }}>
                  SAVE IDENTITY
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                {/* Title */}
                <div>
                  <label style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: 12, fontWeight: 700, letterSpacing: '0.1em' }}>Fresher / AI-ML Title</label>
                  <input className="input-field" value={expTitle} onChange={e => setExpTitle(e.target.value)} placeholder="e.g. Fresher / AI-ML Student" />
                </div>

                {/* Availability State */}
                <div>
                  <label style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: 12, fontWeight: 700, letterSpacing: '0.1em' }}>Hiring Status Badge</label>
                  <input className="input-field" value={expAvailability} onChange={e => setExpAvailability(e.target.value)} placeholder="e.g. Available for Opportunities" />
                </div>

                {/* Checkbox */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px', borderRadius: 16, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <input type="checkbox" id="expIsAvailable" checked={expIsAvailable} onChange={e => setExpIsAvailable(e.target.checked)} style={{ width: 18, height: 18, accentColor: 'var(--violet-glow)', cursor: 'pointer' }} />
                  <label htmlFor="expIsAvailable" style={{ fontSize: 12, color: '#94a3b8', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', cursor: 'pointer' }}>Active for Hires (Green Glow Indicator)</label>
                </div>

                {/* Description */}
                <div>
                  <label style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: 12, fontWeight: 700, letterSpacing: '0.1em' }}>Mission Log Description</label>
                  <textarea className="input-field" rows={5} value={expDescription} onChange={e => setExpDescription(e.target.value)} placeholder="Detail your focal capabilities..." style={{ resize: 'vertical' }} />
                </div>
              </div>
            </div>

            {/* Tags Config + Preview */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              <div className="glass-card" style={{ padding: 40, borderRadius: 24, background: 'rgba(10, 1, 30, 0.4)', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                <h2 style={{ fontSize: 14, fontWeight: 800, color: '#64748b', marginBottom: 24, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Recruiter Tags</h2>
                <form onSubmit={handleAddExpTag} style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
                  <input className="input-field" value={newExpTag} onChange={e => setNewExpTag(e.target.value)} placeholder="e.g. Open to Internships" style={{ flex: 1 }} />
                  <button type="submit" className="btn-primary" style={{ padding: '0 24px', borderRadius: 14, fontSize: 12, fontWeight: 800 }}>ADD</button>
                </form>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                  {expTags.map(tag => (
                    <div key={tag} className="glass-card" style={{ padding: '8px 14px', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(124, 58, 237, 0.1)', border: '1px solid rgba(124, 58, 237, 0.2)' }}>
                      <span style={{ fontSize: 12, color: 'var(--violet-glow)', fontWeight: 800 }}>{tag}</span>
                      <button type="button" onClick={() => handleRemoveExpTag(tag)} style={{ color: '#ef4444', background: 'none', border: 'none', fontWeight: 800, fontSize: 14, cursor: 'pointer' }}>×</button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recruiter Preview */}
              <div className="glass-card" style={{ padding: 40, borderRadius: 24, background: 'rgba(10, 1, 30, 0.2)', border: '1px solid rgba(255, 255, 255, 0.03)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: expIsAvailable ? '#10b981' : '#ef4444', boxShadow: expIsAvailable ? '0 0 8px #10b981' : '0 0 8px #ef4444' }} />
                  <span style={{ fontSize: 11, color: expIsAvailable ? '#10b981' : '#ef4444', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{expAvailability}</span>
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: '#f8fafc', marginBottom: 12 }}>{expTitle}</h3>
                <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.6, marginBottom: 20 }}>{expDescription}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {expTags.map(tag => (
                    <span key={tag} style={{ fontSize: 10, color: '#f8fafc', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', padding: '4px 10px', borderRadius: 20, fontWeight: 700 }}>{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= SKILLS TAB ================= */}
        {activeTab === 'skills' && (
          <div>
            <div style={{ marginBottom: 32 }}>
              <h2 style={{ fontSize: 14, fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 24 }}>Ingest Tech Protocol</h2>
              <div className="glass-card" style={{ padding: 32, borderRadius: 24, background: 'rgba(10, 1, 30, 0.4)', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                  <input
                    className="input-field"
                    value={newSkill.name}
                    onChange={e => setNewSkill({ ...newSkill, name: e.target.value })}
                    onKeyDown={e => e.key === 'Enter' && handleAddSkill()}
                    placeholder="e.g. React.js"
                    style={{ flex: 2 }}
                  />
                  <select 
                    className="input-field"
                    value={newSkill.category}
                    onChange={e => setNewSkill({ ...newSkill, category: e.target.value })}
                    style={{ flex: 1, appearance: 'none' }}
                  >
                    {skillCategories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, color: '#64748b', fontWeight: 800, textTransform: 'uppercase', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                    <input 
                      type="checkbox" 
                      checked={newSkill.is_featured} 
                      onChange={e => setNewSkill({ ...newSkill, is_featured: e.target.checked })} 
                      style={{ width: 16, height: 16, accentColor: 'var(--violet-glow)' }} 
                    />
                    Starred
                  </label>
                  <button onClick={handleAddSkill} className="btn-primary" disabled={addingSkill} style={{ whiteSpace: 'nowrap', padding: '0 32px', borderRadius: 14, height: 50, fontWeight: 800 }}>INGEST</button>
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
              {skillCategories.map(cat => {
                const catSkills = skills.filter(s => (s.category || '').toLowerCase() === cat.toLowerCase())

                return (
                  <div key={cat} className="glass-card" style={{ padding: 24, borderRadius: 20, background: 'rgba(10, 1, 30, 0.4)', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    <h3 style={{ fontSize: 12, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--violet-glow)', marginBottom: 16 }}>{cat}</h3>
                    
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                      {catSkills.map(skill => {
                        const isEditing = editingSkillId === skill.id

                        return (
                          <div key={skill.id} className="glass-card" style={{ padding: '8px 12px', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                            {isEditing ? (
                              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                <input 
                                  className="input-field" 
                                  style={{ padding: '2px 6px', fontSize: 12, width: 100 }}
                                  value={editSkillForm.name}
                                  onChange={e => setEditSkillForm({ ...editSkillForm, name: e.target.value })}
                                  onKeyDown={e => e.key === 'Enter' && handleUpdateSkill(skill.id)}
                                  autoFocus
                                />
                                <button onClick={() => handleUpdateSkill(skill.id)} style={{ color: '#10b981', fontWeight: 800, fontSize: 12, cursor: 'pointer' }}>✓</button>
                                <button onClick={() => setEditingSkillId(null)} style={{ color: '#94a3b8', fontWeight: 800, fontSize: 12, cursor: 'pointer' }}>×</button>
                              </div>
                            ) : (
                              <>
                                <span 
                                  onClick={() => handleStartEditSkill(skill)}
                                  style={{ fontSize: 12, fontWeight: 700, color: '#f8fafc', cursor: 'pointer' }}
                                  title="Edit skill tag"
                                >
                                  {skill.name}
                                </span>
                                {skill.is_featured && <span style={{ fontSize: 10, color: 'var(--violet-glow)' }}>★</span>}
                                <button onClick={() => handleDeleteSkill(skill.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: 14, fontWeight: 800 }}>×</button>
                              </>
                            )}
                          </div>
                        )
                      })}
                      {catSkills.length === 0 && <span style={{ fontSize: 12, color: '#475569', fontStyle: 'italic' }}>Empty sector</span>}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* ================= EDUCATION TAB ================= */}
        {activeTab === 'education' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ fontSize: 14, fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.15em' }}>Academic Matrix</h2>
              {editingEduId === null && (
                <button onClick={() => setEditingEduId('new')} className="btn-primary" style={{ fontSize: 11, padding: '10px 24px', borderRadius: 12, fontWeight: 800 }}>
                  + INITIALIZE RECORD
                </button>
              )}
            </div>

            {/* Create/Edit Form Overlay */}
            {editingEduId !== null && (
              <div className="glass-card" style={{ padding: 40, borderRadius: 24, background: 'rgba(10, 1, 30, 0.4)', border: '1px solid rgba(255, 255, 255, 0.05)', boxShadow: '0 20px 60px rgba(0,0,0,0.4)', marginBottom: 32 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#f8fafc', marginBottom: 24 }}>
                  {editingEduId === 'new' ? 'Initialize Academic Record' : 'Modify Academic Record'}
                </h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 32 }}>
                  <div>
                    <label style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: 12, fontWeight: 700 }}>Institution Name</label>
                    <input 
                      className="input-field" 
                      value={editingEduId === 'new' ? newEdu.institution : editEduForm.institution} 
                      onChange={e => editingEduId === 'new' ? setNewEdu({ ...newEdu, institution: e.target.value }) : setEditEduForm({ ...editEduForm, institution: e.target.value })} 
                      placeholder="e.g. Arunai Engineering College" 
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: 12, fontWeight: 700 }}>Degree / Standard</label>
                    <input 
                      className="input-field" 
                      value={editingEduId === 'new' ? newEdu.degree : editEduForm.degree} 
                      onChange={e => editingEduId === 'new' ? setNewEdu({ ...newEdu, degree: e.target.value }) : setEditEduForm({ ...editEduForm, degree: e.target.value })} 
                      placeholder="e.g. B.E CSE (AI & ML) or 12th Standard" 
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: 12, fontWeight: 700 }}>Specialization / Stream</label>
                    <input 
                      className="input-field" 
                      value={editingEduId === 'new' ? newEdu.field : editEduForm.field} 
                      onChange={e => editingEduId === 'new' ? setNewEdu({ ...newEdu, field: e.target.value }) : setEditEduForm({ ...editEduForm, field: e.target.value })} 
                      placeholder="e.g. Artificial Intelligence or Science" 
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: 12, fontWeight: 700 }}>GPA / Percentage</label>
                    <input 
                      className="input-field" 
                      value={editingEduId === 'new' ? newEdu.gpa : editEduForm.gpa} 
                      onChange={e => editingEduId === 'new' ? setNewEdu({ ...newEdu, gpa: e.target.value }) : setEditEduForm({ ...editEduForm, gpa: e.target.value })} 
                      placeholder="e.g. 8.5 CGPA or 92%" 
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: 12, fontWeight: 700 }}>Temporal Range (Years)</label>
                    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                      <input 
                        type="number"
                        className="input-field" 
                        value={editingEduId === 'new' ? newEdu.start_year : editEduForm.start_year} 
                        onChange={e => editingEduId === 'new' ? setNewEdu({ ...newEdu, start_year: parseInt(e.target.value) || 2023 }) : setEditEduForm({ ...editEduForm, start_year: parseInt(e.target.value) || 2023 })} 
                        style={{ width: 100 }}
                      />
                      <span style={{ color: '#475569' }}>—</span>
                      <input 
                        type="number"
                        className="input-field" 
                        value={editingEduId === 'new' ? newEdu.end_year || 2026 : editEduForm.end_year || 2026} 
                        onChange={e => editingEduId === 'new' ? setNewEdu({ ...newEdu, end_year: parseInt(e.target.value) || 2026 }) : setEditEduForm({ ...editEduForm, end_year: parseInt(e.target.value) || 2026 })} 
                        style={{ width: 100 }}
                      />
                    </div>
                  </div>
                  <div>
                    <label style={{ fontSize: 11, color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: 12, fontWeight: 700 }}>Description (Optional)</label>
                    <input 
                      className="input-field" 
                      value={editingEduId === 'new' ? newEdu.description : editEduForm.description} 
                      onChange={e => editingEduId === 'new' ? setNewEdu({ ...newEdu, description: e.target.value }) : setEditEduForm({ ...editEduForm, description: e.target.value })} 
                      placeholder="Additional details..." 
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 16 }}>
                  {editingEduId === 'new' ? (
                    <button onClick={handleAddEducation} className="btn-primary" disabled={addingEdu} style={{ padding: '14px 28px', borderRadius: 14, fontWeight: 800 }}>COMMIT RECORD</button>
                  ) : (
                    <button onClick={() => handleUpdateEducation(editingEduId)} className="btn-primary" style={{ padding: '14px 28px', borderRadius: 14, fontWeight: 800 }}>SAVE CHANGES</button>
                  )}
                  <button onClick={() => setEditingEduId(null)} style={{ padding: '14px 28px', borderRadius: 14, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>CANCEL</button>
                </div>
              </div>
            )}

            {/* Education Records List */}
            <div style={{ display: 'grid', gap: 20 }}>
              {education.map(edu => (
                <div key={edu.id} className="glass-card" style={{ padding: 32, borderRadius: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', background: 'rgba(10, 1, 30, 0.4)', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                  <div>
                    <h3 style={{ fontSize: 18, fontWeight: 700, color: '#f8fafc', marginBottom: 6 }}>{edu.degree}</h3>
                    <p style={{ fontSize: 13, color: 'var(--violet-glow)', marginBottom: 12, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      {edu.field} {edu.gpa && <span style={{ color: '#64748b', margin: '0 8px' }}>|</span>} {edu.gpa}
                    </p>
                    <p style={{ fontSize: 14, color: '#94a3b8', fontWeight: 500 }}>
                      {edu.institution} <span style={{ color: '#475569', margin: '0 8px' }}>//</span> {edu.start_year} — {edu.end_year || 'Present'}
                    </p>
                    {edu.description && (
                      <p style={{ fontSize: 12, color: '#64748b', marginTop: 10 }}>{edu.description}</p>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: 20 }}>
                    <button onClick={() => handleStartEditEdu(edu)} style={{ fontSize: 12, color: 'var(--violet-glow)', background: 'rgba(124, 58, 237, 0.1)', border: '1px solid rgba(124, 58, 237, 0.2)', padding: '6px 16px', borderRadius: 8, cursor: 'pointer', fontWeight: 800 }}>EDIT</button>
                    <button onClick={() => handleDeleteEducation(edu.id)} style={{ fontSize: 12, color: '#ef4444', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '6px 16px', borderRadius: 8, cursor: 'pointer', fontWeight: 800 }}>WIPE</button>
                  </div>
                </div>
              ))}
              {education.length === 0 && (
                <p style={{ color: '#64748b', fontSize: 14, fontStyle: 'italic', padding: '48px 0', textAlign: 'center' }}>No educational records loaded.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
