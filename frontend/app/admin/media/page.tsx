'use client'
import { useState, useEffect } from 'react'
import { api } from '@/lib/api'
import { toast } from 'react-hot-toast'

export default function MediaAdmin() {
  const [assets, setAssets] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [section, setSection] = useState('general')

  useEffect(() => {
    loadAssets()
  }, [])

  const loadAssets = async () => {
    try {
      const res = await api.getMediaAssets()
      setAssets(res)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const toastId = toast.loading('Uploading asset...')
    try {
      const uploadRes = await api.uploadImage(file)
      await api.createMediaAsset({ image_url: uploadRes.url, section_name: section })
      toast.success('Asset added', { id: toastId })
      loadAssets()
    } catch (err: any) {
      toast.error('Upload failed', { id: toastId })
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure?')) return
    try {
      await api.deleteMediaAsset(id)
      setAssets(assets.filter(a => a.id !== id))
      toast.success('Asset deleted')
    } catch (err: any) {
      toast.error(err.message)
    }
  }

  if (loading) return <div>Loading...</div>

  return (
    <div>
      <div style={{ marginBottom: 48 }}>
        <h1 className="font-display" style={{ fontSize: 32, fontWeight: 700, color: '#f8fafc', letterSpacing: '-0.03em', marginBottom: 8 }}>Media Archive</h1>
        <p style={{ fontSize: 14, color: '#64748b', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Central Asset Repository</p>
      </div>
      
      {/* Upload section */}
      <div className="glass-card" style={{ padding: 32, borderRadius: 24, marginBottom: 48, background: 'rgba(10, 1, 30, 0.4)', border: '1px solid rgba(255, 255, 255, 0.05)', boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}>
        <h2 style={{ fontSize: 11, fontWeight: 800, color: '#64748b', marginBottom: 24, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Ingest New Asset</h2>
        <div style={{ display: 'flex', gap: 24, alignItems: 'flex-end' }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', fontSize: 11, color: '#64748b', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 12, fontWeight: 700 }}>Deployment Sector (e.g. Hero, About, Gallery)</label>
            <input 
              className="input-field"
              value={section}
              onChange={e => setSection(e.target.value)}
              placeholder="e.g. hero"
            />
          </div>
          <label className="btn-primary" style={{ cursor: 'none', height: 52, padding: '0 32px', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800 }}>
            {uploading ? 'SYNCING...' : 'SELECT SOURCE'}
            <input type="file" hidden onChange={handleUpload} disabled={uploading} accept="image/*" />
          </label>
        </div>
      </div>

      {/* Gallery */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 24 }}>
        {assets.map(asset => (
          <div key={asset.id} className="glass-card" style={{ padding: 16, borderRadius: 20, position: 'relative', background: 'rgba(10, 1, 30, 0.4)', border: '1px solid rgba(255, 255, 255, 0.05)', transition: 'all 0.3s ease' }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'}>
            <div style={{ width: '100%', aspectRatio: '16/9', borderRadius: 12, overflow: 'hidden', background: 'rgba(255,255,255,0.02)', marginBottom: 16, border: '1px solid rgba(255,255,255,0.05)' }}>
              <img src={asset.image_url} alt={asset.section_name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--violet-glow)', background: 'rgba(124,58,237,0.1)', padding: '6px 12px', borderRadius: 8, fontWeight: 800 }}>
                {asset.section_name}
              </span>
              <div style={{ display: 'flex', gap: 12 }}>
                <button 
                  onClick={() => { navigator.clipboard.writeText(asset.image_url); toast.success('Link copied to neural link') }}
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', color: '#94a3b8', cursor: 'none', width: 32, height: 32, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s ease' }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = 'var(--violet-glow)'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = '#94a3b8'}
                  title="Copy Uplink"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>
                <button 
                  onClick={() => handleDelete(asset.id)}
                  style={{ background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.1)', color: '#ef4444', cursor: 'none', width: 32, height: 32, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s ease' }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(239, 68, 68, 0.1)'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'rgba(239, 68, 68, 0.05)'}
                  title="Wipe Asset"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>
              </div>
            </div>
          </div>
        ))}
        {assets.length === 0 && <p style={{ color: '#64748b', fontSize: 14, fontWeight: 600, gridColumn: '1/-1', textAlign: 'center', padding: '48px 0', fontStyle: 'italic' }}>No assets detected in current sector.</p>}
      </div>
    </div>
  )
}
