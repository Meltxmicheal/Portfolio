'use client'
import { useEffect, useState, useCallback } from 'react'
import { api, revalidateFrontend } from '@/lib/api'
import { useDropzone } from 'react-dropzone'
import toast from 'react-hot-toast'
import Image from 'next/image'

import { Profile } from '@/lib/supabase'

export default function AdminProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [saving, setSaving] = useState(false)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const [newTag, setNewTag] = useState('')

  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTag.trim() || !profile) return
    if (profile.experience_tags?.includes(newTag.trim())) {
      toast.error('Tag already exists')
      return
    }
    setProfile({ ...profile, experience_tags: [...(profile.experience_tags || []), newTag.trim()] })
    setNewTag('')
  }

  const handleRemoveTag = (tag: string) => {
    if (!profile) return
    setProfile({ ...profile, experience_tags: profile.experience_tags.filter(t => t !== tag) })
  }

  useEffect(() => { 
    api.getProfile().then(setProfile).catch(err => toast.error('Failed to load profile'))
  }, [])

  const handleSave = async () => {
    if (!profile) return
    setSaving(true)
    try {
      await api.updateProfile(profile)
      // Immediately purge ISR cache so the new avatar/data is live on frontend
      await revalidateFrontend()
      toast.success('Profile saved! Frontend updated.')
    } catch (error: any) {
      toast.error('Save failed: ' + error.message)
    } finally {
      setSaving(false)
    }
  }

  const onDropAvatar = useCallback(async (files: File[]) => {
    const file = files[0]
    if (!file || !profile) return
    setUploadingAvatar(true)
    try {
      const { url } = await api.uploadImage(file)
      const updated = { ...profile, avatar_url: url };
      setProfile(updated)
      await api.updateProfile(updated)
      // Purge ISR cache so the new avatar is immediately visible on the frontend
      await revalidateFrontend()
      toast.success('Avatar updated! Live on frontend.')
    } catch (e: any) { toast.error('Upload failed: ' + e.message) }
    setUploadingAvatar(false)
  }, [profile])

  const [uploadingLogo, setUploadingLogo] = useState(false)
  const onDropLogo = useCallback(async (files: File[]) => {
    const file = files[0]
    if (!file || !profile) return
    setUploadingLogo(true)
    try {
      const { url } = await api.uploadImage(file)
      const updated = { ...profile, logo_url: url };
      setProfile(updated)
      await api.updateProfile(updated)
      toast.success('Logo updated!')
    } catch (e: any) { toast.error('Upload failed: ' + e.message) }
    setUploadingLogo(false)
  }, [profile])

  const [uploadingContact, setUploadingContact] = useState(false)
  const onDropContact = useCallback(async (files: File[]) => {
    const file = files[0]
    if (!file || !profile) return
    setUploadingContact(true)
    try {
      const { url } = await api.uploadImage(file)
      const updated = { ...profile, contact_image_url: url };
      setProfile(updated)
      await api.updateProfile(updated)
      toast.success('Contact Image updated!')
    } catch (e: any) { toast.error('Upload failed: ' + e.message) }
    setUploadingContact(false)
  }, [profile])

  const onDropResume = useCallback(async (files: File[]) => {
    const file = files[0]
    if (!file || !profile) return
    try {
      const { url } = await api.uploadImage(file)
      const updated = { ...profile, resume_url: url };
      setProfile(updated)
      await api.updateProfile(updated)
      toast.success('Resume uploaded!')
    } catch (e: any) { toast.error('Upload failed: ' + e.message) }
  }, [profile])

  const { getRootProps: getAvatarProps, getInputProps: getAvatarInput, isDragActive: isAvatarDrag } = useDropzone({ onDrop: onDropAvatar, accept: { 'image/*': [] }, maxFiles: 1 })
  const { getRootProps: getLogoProps, getInputProps: getLogoInput, isDragActive: isLogoDrag } = useDropzone({ onDrop: onDropLogo, accept: { 'image/*': [] }, maxFiles: 1 })
  const { getRootProps: getContactProps, getInputProps: getContactInput, isDragActive: isContactDrag } = useDropzone({ onDrop: onDropContact, accept: { 'image/*': [] }, maxFiles: 1 })
  const { getRootProps: getResumeProps, getInputProps: getResumeInput } = useDropzone({ onDrop: onDropResume, accept: { 'application/pdf': [] }, maxFiles: 1 })

  if (!profile) return <div style={{ color: '#475569', fontSize: 14 }}>Loading profile...</div>

  const field = (label: string, key: keyof Profile, type = 'text', rows?: number) => (
    <div>
      <label style={{ fontSize: 11, color: '#64748b', letterSpacing: '0.15em', textTransform: 'uppercase', display: 'block', marginBottom: 10, fontWeight: 700 }}>{label}</label>
      {rows ? (
        <textarea
          className="input-field"
          rows={rows}
          value={(profile[key] as string) || ''}
          onChange={e => setProfile(p => p ? { ...p, [key]: e.target.value } : p)}
          style={{ resize: 'vertical', minHeight: 120 }}
        />
      ) : (
        <input
          className="input-field"
          type={type}
          value={(profile[key] as string | number) || ''}
          onChange={e => setProfile(p => p ? { ...p, [key]: type === 'number' ? parseInt(e.target.value) || 0 : e.target.value } : p)}
        />
      )}
    </div>
  )

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 48 }}>
        <div>
          <h1 className="font-display" style={{ fontSize: 32, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.03em', marginBottom: 8 }}>Identity Core</h1>
          <p style={{ fontSize: 14, color: '#64748b', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Synchronize personal neural profile</p>
        </div>
        <button onClick={handleSave} className="btn-primary" disabled={saving} style={{ opacity: saving ? 0.7 : 1, padding: '16px 32px', borderRadius: 16, fontSize: 15 }}>
          {saving ? 'Synchronizing...' : 'Save Configuration'}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 32, alignItems: 'start' }}>
        {/* Assets */}
        <div className="glass-card" style={{ padding: 32, borderRadius: 24, background: 'rgba(10, 1, 30, 0.4)', border: '1px solid rgba(255,255,255,0.05)' }}>
          <h2 style={{ fontSize: 13, fontWeight: 800, color: '#64748b', marginBottom: 24, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Visual Assets</h2>
          
          <div style={{ marginBottom: 32 }}>
            <label style={{ fontSize: 11, color: '#64748b', letterSpacing: '0.15em', textTransform: 'uppercase', display: 'block', marginBottom: 12, fontWeight: 700 }}>Primary Avatar</label>
            <div {...getAvatarProps()} style={{ position: 'relative', width: '100%', aspectRatio: '3/4', borderRadius: 16, overflow: 'hidden', border: `2px dashed ${isAvatarDrag ? 'var(--violet-glow)' : 'rgba(255,255,255,0.1)'}`, background: 'rgba(255,255,255,0.02)', marginBottom: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s ease' }}>
              <input {...getAvatarInput()} />
              {profile.avatar_url ? (
                <>
                  <Image src={profile.avatar_url} alt="Avatar" fill style={{ objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', inset: 0, background: 'rgba(10,1,30,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: 'opacity 0.2s', backdropFilter: 'blur(4px)' }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.opacity = '1'}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.opacity = '0'}>
                    <span style={{ fontSize: 12, color: '#f1f5f9', fontWeight: 700 }}>UPDATE NEURAL LINK</span>
                  </div>
                </>
              ) : (
                <div style={{ textAlign: 'center', padding: 20 }}>
                  <div style={{ fontSize: 32, marginBottom: 8 }}>📷</div>
                  <p style={{ fontSize: 12, color: '#64748b' }}>{uploadingAvatar ? 'Uploading...' : 'Drop or click'}</p>
                </div>
              )}
            </div>
          </div>

          <div style={{ marginBottom: 32 }}>
            <label style={{ fontSize: 11, color: '#64748b', letterSpacing: '0.15em', textTransform: 'uppercase', display: 'block', marginBottom: 12, fontWeight: 700 }}>Brand Logo</label>
            <div {...getLogoProps()} style={{ position: 'relative', width: '100%', aspectRatio: '1/1', borderRadius: 16, overflow: 'hidden', border: `2px dashed ${isLogoDrag ? 'var(--violet-glow)' : 'rgba(255,255,255,0.1)'}`, background: 'rgba(255,255,255,0.02)', marginBottom: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s ease' }}>
              <input {...getLogoInput()} />
              {profile.logo_url ? (
                <>
                  <Image src={profile.logo_url} alt="Logo" fill style={{ objectFit: 'contain', padding: 20 }} />
                  <div style={{ position: 'absolute', inset: 0, background: 'rgba(10,1,30,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: 'opacity 0.2s', backdropFilter: 'blur(4px)' }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.opacity = '1'}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.opacity = '0'}>
                    <span style={{ fontSize: 12, color: '#f1f5f9', fontWeight: 700 }}>UPDATE ICON</span>
                  </div>
                </>
              ) : (
                <div style={{ textAlign: 'center', padding: 20 }}>
                  <div style={{ fontSize: 32, marginBottom: 8 }}>💎</div>
                  <p style={{ fontSize: 12, color: '#64748b' }}>{uploadingLogo ? 'Uploading...' : 'Drop logo'}</p>
                </div>
              )}
            </div>
          </div>

          <div style={{ marginBottom: 32 }}>
            <label style={{ fontSize: 11, color: '#64748b', letterSpacing: '0.15em', textTransform: 'uppercase', display: 'block', marginBottom: 12, fontWeight: 700 }}>Contact Image</label>
            <div {...getContactProps()} style={{ position: 'relative', width: '100%', aspectRatio: '16/9', borderRadius: 16, overflow: 'hidden', border: `2px dashed ${isContactDrag ? 'var(--violet-glow)' : 'rgba(255,255,255,0.1)'}`, background: 'rgba(255,255,255,0.02)', marginBottom: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s ease' }}>
              <input {...getContactInput()} />
              {profile.contact_image_url ? (
                <>
                  <Image src={profile.contact_image_url} alt="Contact Image" fill style={{ objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', inset: 0, background: 'rgba(10,1,30,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: 'opacity 0.2s', backdropFilter: 'blur(4px)' }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.opacity = '1'}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.opacity = '0'}>
                    <span style={{ fontSize: 12, color: '#f1f5f9', fontWeight: 700 }}>UPDATE CONTACT IMAGE</span>
                  </div>
                </>
              ) : (
                <div style={{ textAlign: 'center', padding: 20 }}>
                  <div style={{ fontSize: 32, marginBottom: 8 }}>🖼️</div>
                  <p style={{ fontSize: 12, color: '#64748b' }}>{uploadingContact ? 'Uploading...' : 'Drop contact image'}</p>
                </div>
              )}
            </div>
          </div>

          <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', marginTop: 24, paddingTop: 24 }}>
            <h2 style={{ fontSize: 11, fontWeight: 800, color: '#64748b', marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Archives</h2>
            <div {...getResumeProps()} style={{ padding: '20px', borderRadius: 16, border: '2px dashed rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.02)', textAlign: 'center', transition: 'all 0.3s ease' }}>
              <input {...getResumeInput()} />
              <p style={{ fontSize: 12, color: '#94a3b8', fontWeight: 600 }}>{profile.resume_url ? '📄 DATA UPLOADED' : '📄 UPLOAD RESUME (PDF)'}</p>
            </div>
          </div>
        </div>

        {/* Fields */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div className="glass-card" style={{ padding: 40, borderRadius: 24, display: 'grid', gridTemplateColumns: '1fr', gap: 24, background: 'rgba(10, 1, 30, 0.4)', border: '1px solid rgba(255,255,255,0.05)' }}>
            <h2 style={{ fontSize: 13, fontWeight: 800, color: '#64748b', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Professional Identity (LinkedIn Style)</h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
              <div>
                <label style={{ fontSize: 11, color: '#64748b', letterSpacing: '0.15em', textTransform: 'uppercase', display: 'block', marginBottom: 10, fontWeight: 700 }}>Professional Headline</label>
                <input className="input-field" value={profile.title || ''} onChange={e => setProfile({ ...profile, title: e.target.value })} placeholder="e.g. AI/ML Engineer | Software Developer" />
              </div>

              <div>
                <label style={{ fontSize: 11, color: '#64748b', letterSpacing: '0.15em', textTransform: 'uppercase', display: 'block', marginBottom: 10, fontWeight: 700 }}>Opportunity Status</label>
                <select className="input-field" value={profile.opportunity_status || 'Open to Internships'} onChange={e => setProfile({ ...profile, opportunity_status: e.target.value })} style={{ appearance: 'none' }}>
                  <option value="Open to Internships">Open to Internships</option>
                  <option value="Open to Full-Time Roles">Open to Full-Time Roles</option>
                  <option value="Open to Freelance Work">Open to Freelance Work</option>
                  <option value="Open to Collaboration">Open to Collaboration</option>
                  <option value="Currently Employed">Currently Employed</option>
                  <option value="Not Available">Not Available</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: 11, color: '#64748b', letterSpacing: '0.15em', textTransform: 'uppercase', display: 'block', marginBottom: 10, fontWeight: 700 }}>Career Stage</label>
                <select className="input-field" value={profile.career_stage || 'Student'} onChange={e => setProfile({ ...profile, career_stage: e.target.value })} style={{ appearance: 'none' }}>
                  <option value="Student">Student</option>
                  <option value="Fresher">Fresher</option>
                  <option value="Intern">Intern</option>
                  <option value="Graduate">Graduate</option>
                  <option value="Junior Developer">Junior Developer</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: 11, color: '#64748b', letterSpacing: '0.15em', textTransform: 'uppercase', display: 'block', marginBottom: 10, fontWeight: 700 }}>Availability</label>
                <select className="input-field" value={profile.availability || 'Actively Looking'} onChange={e => setProfile({ ...profile, availability: e.target.value })} style={{ appearance: 'none' }}>
                  <option value="Actively Looking">Actively Looking</option>
                  <option value="Open to Opportunities">Open to Opportunities</option>
                  <option value="Not Looking">Not Looking</option>
                </select>
              </div>
            </div>

            <div>
              <label style={{ fontSize: 11, color: '#64748b', letterSpacing: '0.15em', textTransform: 'uppercase', display: 'block', marginBottom: 10, fontWeight: 700 }}>Experience Tags</label>
              <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
                <input className="input-field" value={newTag} onChange={e => setNewTag(e.target.value)} placeholder="e.g. IBM Trainer" />
                <button type="button" onClick={handleAddTag} className="btn-primary" style={{ padding: '0 24px', borderRadius: 14, fontSize: 12, fontWeight: 800 }}>ADD</button>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                {(profile.experience_tags || []).map(tag => (
                  <div key={tag} className="glass-card" style={{ padding: '8px 14px', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(124, 58, 237, 0.1)', border: '1px solid rgba(124, 58, 237, 0.2)' }}>
                    <span style={{ fontSize: 12, color: 'var(--violet-glow)', fontWeight: 800 }}>{tag}</span>
                    <button type="button" onClick={() => handleRemoveTag(tag)} style={{ color: '#ef4444', background: 'none', border: 'none', fontWeight: 800, fontSize: 14, cursor: 'pointer' }}>×</button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="glass-card" style={{ padding: 40, borderRadius: 24, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, background: 'rgba(10, 1, 30, 0.4)', border: '1px solid rgba(255,255,255,0.05)' }}>
            <h2 style={{ fontSize: 13, fontWeight: 800, color: '#64748b', marginBottom: 8, gridColumn: '1/-1', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Core Configuration</h2>
            {field('Biological Label', 'name')}
            {field('Neural Tagline', 'tagline')}
            {field('Status Indicator', 'status_badge')}
            {field('Physical Location', 'location')}
            {field('Communication Link', 'email', 'email')}
            <div style={{ gridColumn: '1/-1' }}>{field('Neural Bio / Overview', 'about', 'text', 6)}</div>
          </div>

          <div className="glass-card" style={{ padding: 40, borderRadius: 24, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, background: 'rgba(10, 1, 30, 0.4)', border: '1px solid rgba(255,255,255,0.05)' }}>
            <h2 style={{ fontSize: 13, fontWeight: 800, color: '#64748b', marginBottom: 8, gridColumn: '1/-1', textTransform: 'uppercase', letterSpacing: '0.1em' }}>External Nodes</h2>
            {field('GitHub Protocol', 'github_url', 'url')}
            {field('LinkedIn Uplink', 'linkedin_url', 'url')}
            {field('Twitter Signal', 'twitter_url', 'url')}
            {field('Secure Link (WhatsApp)', 'whatsapp')}
          </div>

          <div className="glass-card" style={{ padding: 40, borderRadius: 24, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 24, background: 'rgba(10, 1, 30, 0.4)', border: '1px solid rgba(255,255,255,0.05)' }}>
            <h2 style={{ fontSize: 13, fontWeight: 800, color: '#64748b', marginBottom: 8, gridColumn: '1/-1', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Performance Metrics</h2>
            {field('Cycle Experience', 'years_experience', 'number')}
            {field('Deployment Count', 'projects_count', 'number')}
            {field('Client Node Count', 'clients_count', 'number')}
          </div>
        </div>
      </div>
    </div>
  )
}
