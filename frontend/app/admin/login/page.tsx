'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api'
import toast from 'react-hot-toast'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { token } = await api.login({ email, password })
      localStorage.setItem('admin_token', token)
      toast.success('Welcome back!')
      router.push('/admin')
    } catch (error: any) {
      toast.error(error.message || 'Login failed')
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--void)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
      {/* Background Blobs */}
      <div className="blob" style={{ width: 600, height: 600, background: 'radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 70%)', top: '-15%', left: '-15%', filter: 'blur(100px)' }} />
      <div className="blob" style={{ width: 500, height: 500, background: 'radial-gradient(circle, rgba(37,99,235,0.1) 0%, transparent 70%)', bottom: '-10%', right: '0%', animationDelay: '3s', filter: 'blur(80px)' }} />

      <div style={{ position: 'relative', zIndex: 2, width: '100%', maxWidth: 440, padding: '0 24px' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{ width: 64, height: 64, borderRadius: 18, background: 'rgba(10, 1, 30, 0.6)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', boxShadow: '0 0 30px rgba(124,58,237,0.2)' }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="11" width="18" height="11" rx="2" stroke="var(--violet-glow)" strokeWidth="2" />
              <path d="M7 11V7a5 5 0 0110 0v4" stroke="var(--violet-glow)" strokeWidth="2" strokeLinecap="round" />
              <circle cx="12" cy="16.5" r="1.5" fill="var(--violet-glow)" />
            </svg>
          </div>
          <h1 className="font-display" style={{ fontSize: 28, fontWeight: 700, color: '#f8fafc', letterSpacing: '-0.03em', marginBottom: 8 }}>Restricted Access</h1>
          <p style={{ fontSize: 14, color: '#94a3b8', fontWeight: 500, letterSpacing: '0.02em' }}>Initialize administrative session</p>
        </div>

        {/* Card */}
        <div className="glass-card" style={{ padding: 48, borderRadius: 24, background: 'rgba(10, 1, 30, 0.4)', border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}>
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div>
              <label style={{ fontSize: 11, color: '#64748b', letterSpacing: '0.15em', textTransform: 'uppercase', display: 'block', marginBottom: 10, fontWeight: 700 }}>Identity</label>
              <input
                className="input-field"
                type="email"
                placeholder="system@MELTX.ai"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoFocus
              />
            </div>
            <div>
              <label style={{ fontSize: 11, color: '#64748b', letterSpacing: '0.15em', textTransform: 'uppercase', display: 'block', marginBottom: 10, fontWeight: 700 }}>Credentials</label>
              <input
                className="input-field"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
              style={{ marginTop: 8, justifyContent: 'center', opacity: loading ? 0.7 : 1, padding: '16px 24px', borderRadius: 16, fontSize: 15, fontWeight: 700 }}
            >
              {loading ? 'Authenticating...' : 'Enter Console'}
              {!loading && (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ marginLeft: 10 }}><path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
              )}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', fontSize: 11, color: '#475569', marginTop: 32, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          MELTX Core · Kernel Security v4.2
        </p>
      </div>
    </div>
  )
}
