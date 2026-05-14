'use client'
import { useEffect, useState, useCallback } from 'react'
import { api } from '@/lib/api'
import { useDropzone } from 'react-dropzone'
import toast from 'react-hot-toast'
import Image from 'next/image'

interface Certificate {
  id: string;
  title: string;
  issuer: string;
  issue_date: string;
  expiry_date: string | null;
  credential_url: string;
  image_url: string;
  description: string;
  sort_order: number;
}

const empty: Omit<Certificate, 'id'> = {
  title: '', issuer: '', issue_date: '', expiry_date: null,
  credential_url: '', image_url: '', description: '', sort_order: 0,
}

export default function AdminCertificatesPage() {
  const [certs, setCerts] = useState<Certificate[]>([])
  const [selected, setSelected] = useState<Partial<Certificate> | null>(null)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)

  const load = async () => { 
    try {
      const c = await api.getCertificates(); 
      setCerts(c) 
    } catch (err) {
      toast.error('Failed to load certificates')
    }
  }
  useEffect(() => { load() }, [])

  const handleSave = async () => {
    if (!selected?.title || !selected?.issuer || !selected?.issue_date) { toast.error('Title, issuer, and date required'); return }
    setSaving(true)
    try {
      if (selected.id) {
        await api.updateCertificate(selected.id, selected)
        toast.success('Updated!')
      } else {
        await api.createCertificate({ ...empty, ...selected, sort_order: certs.length })
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
      await api.deleteCertificate(id)
      toast.success('Deleted')
      load()
      if (selected?.id === id) setSelected(null)
    } catch (err: any) {
      toast.error(err.message)
    }
  }

  const onDropImage = useCallback(async (files: File[]) => {
    if (!files[0]) return
    setUploading(true)
    try {
      const { url } = await api.uploadImage(files[0])
      setSelected(p => p ? { ...p, image_url: url } : p)
      toast.success('Image uploaded!')
    } catch (e: any) { toast.error(e.message) }
    setUploading(false)
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop: onDropImage, accept: { 'image/*': [] }, maxFiles: 1 })

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '360px 1fr', gap: 32, minHeight: 'calc(100vh - 96px)' }}>
      {/* List */}
      <div className="glass-card" style={{ borderRadius: 24, overflow: 'hidden', alignSelf: 'start', background: 'rgba(10, 1, 30, 0.4)', border: '1px solid rgba(255, 255, 255, 0.05)', boxShadow: '0 10px 40px rgba(0,0,0,0.3)' }}>
        <div style={{ padding: '24px 28px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 className="font-display" style={{ fontSize: 20, fontWeight: 700, color: '#f8fafc', letterSpacing: '-0.02em' }}>Credentials</h1>
          <button onClick={() => setSelected({ ...empty })} className="btn-primary" style={{ fontSize: 11, padding: '8px 16px', borderRadius: 10, textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 800 }}>+ ADD</button>
        </div>
        <div style={{ padding: '16px' }} className="custom-scrollbar">
          {certs.map(cert => (
            <div key={cert.id} onClick={() => setSelected(cert)} style={{ padding: '16px 20px', borderRadius: 16, marginBottom: 10, cursor: 'none', transition: 'all 0.3s cubic-bezier(0.23, 1, 0.32, 1)', background: selected?.id === cert.id ? 'rgba(124, 58, 237, 0.1)' : 'rgba(255, 255, 255, 0.02)', border: `1px solid ${selected?.id === cert.id ? 'rgba(124, 58, 237, 0.3)' : 'rgba(255, 255, 255, 0.05)'}`, display: 'flex', gap: 16, alignItems: 'center', transform: selected?.id === cert.id ? 'translateX(4px)' : 'none' }}>
              {cert.image_url && (
                <div style={{ width: 44, height: 44, borderRadius: 10, overflow: 'hidden', flexShrink: 0, position: 'relative', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <Image src={cert.image_url} alt={cert.title} fill style={{ objectFit: 'cover' }} />
                </div>
              )}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: selected?.id === cert.id ? '#f8fafc' : '#94a3b8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: 4 }}>{cert.title}</div>
                <div style={{ fontSize: 11, color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{cert.issuer}</div>
              </div>
              <button onClick={e => { e.stopPropagation(); handleDelete(cert.id) }} style={{ color: '#475569', background: 'none', border: 'none', transition: 'all 0.2s ease', flexShrink: 0, cursor: 'none', padding: 4 }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#ef4444'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = '#475569'}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
            </div>
          ))}
          {certs.length === 0 && <p style={{ color: '#64748b', fontSize: 13, padding: '32px 20px', fontStyle: 'italic', textAlign: 'center' }}>No credentials logged.</p>}
        </div>
      </div>

      {/* Editor */}
      {selected ? (
        <div className="glass-card" style={{ padding: 40, borderRadius: 24, alignSelf: 'start', background: 'rgba(10, 1, 30, 0.4)', border: '1px solid rgba(255, 255, 255, 0.05)', boxShadow: '0 20px 60px rgba(0,0,0,0.4)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: '#f8fafc', letterSpacing: '-0.02em' }}>{selected.id ? 'Modify Credential' : 'Initialize Credential'}</h2>
            <button onClick={handleSave} className="btn-primary" disabled={saving} style={{ fontSize: 13, padding: '10px 24px', borderRadius: 14, opacity: saving ? 0.7 : 1, fontWeight: 800 }}>
              {saving ? 'SYNCING...' : 'COMMIT CHANGES'}
            </button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
            {/* Image upload */}
            <div style={{ gridColumn: '1/-1' }}>
              <label style={{ fontSize: 11, color: '#64748b', letterSpacing: '0.15em', textTransform: 'uppercase', display: 'block', marginBottom: 12, fontWeight: 700 }}>Credential Visual Asset</label>
              <div {...getRootProps()} style={{ height: 160, borderRadius: 20, border: `2px dashed ${isDragActive ? 'var(--violet-glow)' : 'rgba(255,255,255,0.1)'}`, background: isDragActive ? 'rgba(124,58,237,0.05)' : 'rgba(255,255,255,0.01)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden', transition: 'all 0.3s ease', cursor: 'none' }}>
                <input {...getInputProps()} />
                {selected.image_url ? (
                  <>
                    <Image src={selected.image_url} alt="cert" fill style={{ objectFit: 'contain', padding: 20, opacity: 0.8 }} />
                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(10, 1, 30, 0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: 'all 0.2s ease' }}
                      onMouseEnter={e => (e.currentTarget as HTMLElement).style.opacity = '1'}
                      onMouseLeave={e => (e.currentTarget as HTMLElement).style.opacity = '0'}>
                      <span style={{ fontSize: 12, color: '#f8fafc', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{uploading ? 'SYNCING...' : 'WIPE & REPLACE'}</span>
                    </div>
                  </>
                ) : (
                  <p style={{ fontSize: 12, color: '#64748b', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{uploading ? 'SYNCING...' : 'INIT ASSET UPLOAD'}</p>
                )}
              </div>
            </div>
            {[
              { label: 'Credential Title', key: 'title' },
              { label: 'Issuing Authority', key: 'issuer' },
              { label: 'Initialization Date', key: 'issue_date', type: 'date' },
              { label: 'Expiration Cycle', key: 'expiry_date', type: 'date' },
              { label: 'External Uplink (URL)', key: 'credential_url', type: 'url' },
            ].map(f => (
              <div key={f.key}>
                <label style={{ fontSize: 11, color: '#64748b', letterSpacing: '0.15em', textTransform: 'uppercase', display: 'block', marginBottom: 12, fontWeight: 700 }}>{f.label}</label>
                <input className="input-field" type={f.type || 'text'}
                  value={(selected as any)[f.key]?.slice(0, 10) || ''}
                  onChange={e => setSelected(p => p ? { ...p, [f.key]: e.target.value || null } : p)}
                />
              </div>
            ))}
            <div style={{ gridColumn: '1/-1' }}>
              <label style={{ fontSize: 11, color: '#64748b', letterSpacing: '0.15em', textTransform: 'uppercase', display: 'block', marginBottom: 12, fontWeight: 700 }}>Credential Log / Narrative</label>
              <textarea className="input-field" rows={4} value={selected.description || ''} onChange={e => setSelected(p => p ? { ...p, description: e.target.value } : p)} style={{ resize: 'vertical' }} placeholder="Detail the specialization..." />
            </div>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', background: 'rgba(10, 1, 30, 0.4)', borderRadius: 24, border: '1px solid rgba(255, 255, 255, 0.05)' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 56, marginBottom: 24, color: 'var(--violet-glow)', opacity: 0.5 }}>◆</div>
            <p style={{ fontSize: 16, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Select Credential for Modification</p>
          </div>
        </div>
      )}
    </div>
  )
}
