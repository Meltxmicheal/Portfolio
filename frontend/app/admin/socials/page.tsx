'use client'
import { useState, useEffect } from 'react'
import { api } from '@/lib/api'
import { toast } from 'react-hot-toast'

export default function SocialsAdmin() {
  const [data, setData] = useState({
    github: '',
    linkedin: '',
    email: '',
    whatsapp: ''
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    api.getSocialLinks()
      .then(res => {
        if (res) {
          setData({
            github: res.github || '',
            linkedin: res.linkedin || '',
            email: res.email || '',
            whatsapp: res.whatsapp || ''
          })
        }
      })
      .finally(() => setLoading(false))
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      await api.updateSocialLinks(data)
      toast.success('Social links updated')
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div>Loading...</div>

  return (
    <div style={{ maxWidth: 700 }}>
      <div style={{ marginBottom: 48 }}>
        <h1 className="font-display" style={{ fontSize: 32, fontWeight: 700, color: '#f8fafc', letterSpacing: '-0.03em', marginBottom: 8 }}>Signal Protocol</h1>
        <p style={{ fontSize: 14, color: '#64748b', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>External Communication Nodes</p>
      </div>

      <form onSubmit={handleSubmit} className="glass-card" style={{ padding: 48, borderRadius: 24, background: 'rgba(10, 1, 30, 0.4)', border: '1px solid rgba(255, 255, 255, 0.05)', boxShadow: '0 20px 60px rgba(0,0,0,0.4)' }}>
        <div style={{ display: 'grid', gap: 32 }}>
          <div>
            <label style={{ display: 'block', fontSize: 11, color: '#64748b', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 12, fontWeight: 700 }}>GitHub Archive</label>
            <input
              className="input-field"
              value={data.github}
              onChange={e => setData({ ...data, github: e.target.value })}
              placeholder="https://github.com/identity"
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 11, color: '#64748b', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 12, fontWeight: 700 }}>LinkedIn Uplink</label>
            <input
              className="input-field"
              value={data.linkedin}
              onChange={e => setData({ ...data, linkedin: e.target.value })}
              placeholder="https://linkedin.com/in/identity"
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 11, color: '#64748b', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 12, fontWeight: 700 }}>Primary Neural Link (Email)</label>
            <input
              className="input-field"
              value={data.email}
              onChange={e => setData({ ...data, email: e.target.value })}
              placeholder="signal@MELTX.ai"
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 11, color: '#64748b', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 12, fontWeight: 700 }}>Secure Frequency (WhatsApp)</label>
            <input
              className="input-field"
              value={data.whatsapp}
              onChange={e => setData({ ...data, whatsapp: e.target.value })}
              placeholder="+00 000 000 0000"
            />
          </div>

          <button type="submit" className="btn-primary" disabled={saving} style={{ marginTop: 16, padding: '18px', borderRadius: 16, fontSize: 15, fontWeight: 800 }}>
            {saving ? 'SYNCHRONIZING...' : 'COMMIT PROTOCOLS'}
          </button>
        </div>
      </form>
    </div>
  )
}
