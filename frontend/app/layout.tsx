'use client'
import './globals.css'
import { useEffect, useRef, useState } from 'react'
import { Toaster } from 'react-hot-toast'
import CustomCursor from '@/components/ui/CustomCursor'
import LoadingScreen from '@/components/ui/LoadingScreen'
import AnimatedBackground from '@/components/ui/AnimatedBackground'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Initialize Lenis smooth scrolling
    let lenis: any
    const initLenis = async () => {
      try {
        const Lenis = (await import('lenis')).default
        lenis = new Lenis({
          duration: 1.4,
          easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          smoothWheel: true,
          wheelMultiplier: 0.9,
        })
        const raf = (time: number) => {
          lenis.raf(time)
          requestAnimationFrame(raf)
        }
        requestAnimationFrame(raf)
      } catch (e) {
        // Lenis not available, use default scroll
      }
    }
    initLenis()

    // Loading screen timer
    const timer = setTimeout(() => setLoading(false), 2200)
    return () => {
      clearTimeout(timer)
      lenis?.destroy()
    }
  }, [])

  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <title>Meltx Micheal Portfolio</title>
        <meta name="description" content="Meltx Micheal — Full Stack Developer & AI Engineer. Premium portfolio showcasing projects, skills, and experience." />
        <meta name="keywords" content="Meltx Micheal, portfolio, full stack developer, AI engineer, web developer" />
        <meta name="author" content="Meltx Micheal" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content="Meltx Micheal Portfolio" />
        <meta property="og:description" content="Full Stack Developer & AI Engineer — premium cinematic portfolio." />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Meltx Micheal Portfolio" />
        <meta name="twitter:description" content="Full Stack Developer & AI Engineer — premium cinematic portfolio." />
        {/* Favicon — all sizes & browsers */}
        <link rel="icon" type="image/png" sizes="32x32" href="https://res.cloudinary.com/drwecuwj3/image/upload/c_fill,w_32,h_32/v1778765549/20260514_185944_bwzrqw.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="https://res.cloudinary.com/drwecuwj3/image/upload/c_fill,w_16,h_16/v1778765549/20260514_185944_bwzrqw.png" />
        <link rel="shortcut icon" href="https://res.cloudinary.com/drwecuwj3/image/upload/c_fill,w_32,h_32/v1778765549/20260514_185944_bwzrqw.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="https://res.cloudinary.com/drwecuwj3/image/upload/c_fill,w_180,h_180/v1778765549/20260514_185944_bwzrqw.png" />
        <meta name="theme-color" content="#0a0a19" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://api.fontshare.com" />
      </head>
      <body className="bg-transparent text-slate-100 min-h-screen relative selection:bg-purple-500/30">
        <AnimatedBackground />
        {loading && <LoadingScreen />}
        <CustomCursor />
        <div className="relative z-10 flex flex-col min-h-screen">
          {children}
        </div>
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: 'rgba(15, 18, 25, 0.8)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(124,58,237,0.3)',
              color: '#f1f5f9',
              borderRadius: '8px',
              fontSize: '14px',
            },
          }}
        />
      </body>
    </html>
  )
}
