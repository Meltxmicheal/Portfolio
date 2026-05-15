'use client'
import { useEffect, useState } from 'react'
import { Toaster } from 'react-hot-toast'
import CustomCursor from '@/components/ui/CustomCursor'
import LoadingScreen from '@/components/ui/LoadingScreen'
import AnimatedBackground from '@/components/ui/AnimatedBackground'

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Disable Lenis on mobile — native momentum scroll feels better on iOS
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)

    let lenis: any
    const initLenis = async () => {
      if (isMobile) return // Skip Lenis on mobile
      try {
        const Lenis = (await import('lenis')).default
        lenis = new Lenis({
          duration: 1.2,
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

    const timer = setTimeout(() => setLoading(false), 2000)
    return () => {
      clearTimeout(timer)
      lenis?.destroy()
    }
  }, [])

  return (
    <>
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
    </>
  )
}
