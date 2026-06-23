'use client'
import { useEffect, useRef, useState } from 'react'
import { Profile } from '@/lib/supabase'
import { api } from '@/lib/api'
import toast from 'react-hot-toast'

interface ContactProps { profile: Profile | null }

function useReveal() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current; if (!el) return
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { el.classList.add('in-view'); obs.disconnect() } }, { threshold: 0.1 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return ref
}

export default function ContactSection({ profile }: ContactProps) {
  const headRef = useReveal()
  const formRef = useReveal()
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Form validation
  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!form.name.trim()) newErrors.name = 'Name is required'
    if (!form.email.trim()) newErrors.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = 'Invalid email format'
    if (!form.message.trim()) newErrors.message = 'Message is required'
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      toast.error('Please fix the errors in the form')
      return
    }

    setLoading(true)
    try {
      await api.submitContactForm({
        name: form.name.trim(),
        email: form.email.trim(),
        subject: form.subject.trim() || `Portfolio Message from ${form.name}`,
        message: form.message.trim(),
      })
      
      toast.success('Message sent successfully! I\'ll get back to you soon.')
      setForm({ name: '', email: '', subject: '', message: '' })
      setErrors({})
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to send message'
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  const socials = [
    { label: 'GitHub', href: profile?.github_url || '#', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>, color: '#171515', glow: 'rgba(23,21,21,0.5)' },
    { label: 'LinkedIn', href: profile?.linkedin_url || '#', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>, color: '#0A66C2', glow: 'rgba(10,102,194,0.5)' },
    { label: 'Email', href: `mailto:${profile?.email || 'michealjohnsonraj16@gmail.com'}`, icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 7l10 7 10-7"/></svg>, color: '#EA4335', glow: 'rgba(234,67,53,0.5)' },
  ]

  return (
    <section id="contact" className="py-20 md:py-32 px-6 md:px-12 relative overflow-hidden" role="region" aria-label="Contact section">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div ref={headRef} className="reveal text-center mb-12 md:mb-16">
          <p className="text-xs uppercase tracking-[0.25em] text-slate-500 font-mono mb-4">
            Contact
          </p>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight mb-6">
            Get in Touch
          </h2>
          <div className="flex justify-center mb-6">
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 12px', borderRadius: '100px', background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.2)', fontSize: '13px', color: '#c4b5fd', fontWeight: 600 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#7B61FF', boxShadow: '0 0 10px #7B61FF' }}></span>
              Available for Internships
            </div>
          </div>
          <p className="text-base sm:text-lg text-slate-400 max-w-xl mx-auto leading-relaxed">
            Have a project in mind or just want to connect? My inbox is always open.
          </p>
        </div>

        {/* Center container */}
        <div ref={formRef} className="reveal max-w-2xl mx-auto w-full">
            <div className="glass-card p-6 sm:p-10 md:p-12 rounded-[24px] bg-slate-950/40 border border-white/5 shadow-xl relative overflow-hidden">
              <h3 className="font-display text-2xl font-bold text-white mb-8 tracking-tight">Send a Message</h3>
              <form onSubmit={handleSubmit} className="flex flex-col gap-6" noValidate>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="name" className="text-[10px] sm:text-xs text-slate-500 uppercase tracking-widest block mb-2.5 font-bold">Name <span aria-label="required">*</span></label>
                    <input 
                      id="name"
                      className="input-field w-full" 
                      type="text" 
                      placeholder="Your Name" 
                      value={form.name} 
                      onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      aria-invalid={!!errors.name}
                      aria-describedby={errors.name ? 'name-error' : undefined}
                      required 
                    />
                    {errors.name && <p id="name-error" className="text-red-400 text-xs mt-1">{errors.name}</p>}
                  </div>
                  <div>
                    <label htmlFor="email" className="text-[10px] sm:text-xs text-slate-500 uppercase tracking-widest block mb-2.5 font-bold">Email <span aria-label="required">*</span></label>
                    <input 
                      id="email"
                      className="input-field w-full" 
                      type="email" 
                      placeholder="email@example.com" 
                      value={form.email} 
                      onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                      aria-invalid={!!errors.email}
                      aria-describedby={errors.email ? 'email-error' : undefined}
                      required 
                    />
                    {errors.email && <p id="email-error" className="text-red-400 text-xs mt-1">{errors.email}</p>}
                  </div>
                </div>
                <div>
                  <label htmlFor="subject" className="text-[10px] sm:text-xs text-slate-500 uppercase tracking-widest block mb-2.5 font-bold">Subject</label>
                  <input 
                    id="subject"
                    className="input-field w-full" 
                    type="text" 
                    placeholder="Project collaboration" 
                    value={form.subject} 
                    onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} 
                  />
                </div>
                <div>
                  <label htmlFor="message" className="text-[10px] sm:text-xs text-slate-500 uppercase tracking-widest block mb-2.5 font-bold">Message <span aria-label="required">*</span></label>
                  <textarea 
                    id="message"
                    className="input-field w-full" 
                    rows={5} 
                    placeholder="Tell me about your project..." 
                    value={form.message} 
                    onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                    aria-invalid={!!errors.message}
                    aria-describedby={errors.message ? 'message-error' : undefined}
                    required 
                    style={{ resize: 'vertical', minHeight: 140 }} 
                  />
                  {errors.message && <p id="message-error" className="text-red-400 text-xs mt-1">{errors.message}</p>}
                </div>
                <button 
                  type="submit" 
                  className="btn-primary w-full justify-center py-4 px-6 mt-4 rounded-xl text-base font-bold shadow-lg shadow-violet-500/10"
                  disabled={loading}
                  aria-busy={loading}
                >
                  {loading ? 'Sending...' : 'Send Message'}
                  {!loading && (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ marginLeft: 10 }} aria-hidden="true">
                      <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </button>
              </form>
            </div>
            
            <div className="mt-12 flex justify-center gap-6">
              {socials.map(s => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={`Connect on ${s.label}`} className="text-slate-400 hover:text-white transition-colors">
                  <span style={{ width: 24, height: 24, display: 'block' }}>{s.icon}</span>
                </a>
              ))}
            </div>
          </div>
      </div>
    </section>
  )
}

