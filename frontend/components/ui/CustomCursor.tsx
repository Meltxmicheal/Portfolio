'use client'
import { useEffect, useRef } from 'react'

export default function CustomCursor() {
  const ringRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    const ring = ringRef.current
    if (!ring) return

    const isTouch = window.matchMedia('(hover: none)').matches;
    if (isTouch) {
      ring.style.display = 'none';
      return;
    }

    let mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2
    let ringX = window.innerWidth / 2, ringY = window.innerHeight / 2
    let hovering = false
    let animId: number
    let lastTime = performance.now()

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
    }

    const onHoverIn = () => {
      hovering = true
      ring.classList.add('is-hovering')
    }

    const onHoverOut = () => {
      hovering = false
      ring.classList.remove('is-hovering')
    }

    const onMouseDown = () => ring.classList.add('is-clicking')
    const onMouseUp = () => ring.classList.remove('is-clicking')

    const animate = (time: number) => {
      lastTime = time

      // Softer, smoother lag
      const dx = mouseX - ringX
      const dy = mouseY - ringY
      ringX += dx * 0.12 // Slightly slower follow for elegance
      ringY += dy * 0.12
      ring.style.left = ringX + 'px'
      ring.style.top = ringY + 'px'

      // Subtle scaling and blur based on velocity
      const velocity = Math.sqrt(dx * dx + dy * dy)
      
      if (!hovering) {
        ring.style.transform = `translate(-50%, -50%) scale(${1 + Math.min(velocity * 0.002, 0.2)})`
        ring.style.filter = `blur(${Math.max(6, 6 + velocity * 0.05)}px)`
        ring.style.opacity = '0.6'
      } else {
        ring.style.transform = `translate(-50%, -50%) scale(1.5)`
        ring.style.filter = `blur(12px)`
        ring.style.opacity = '0.4'
      }

      animId = requestAnimationFrame(animate)
    }

    animId = requestAnimationFrame(animate)
    document.addEventListener('mousemove', onMove)
    document.addEventListener('mousedown', onMouseDown)
    document.addEventListener('mouseup', onMouseUp)

    // Add hover detection to interactive elements
    const selectors = 'a, button, [data-cursor-hover], input, textarea, select, label, .glass-card, .project-card'
    
    const addListeners = () => {
      document.querySelectorAll(selectors).forEach(el => {
        el.addEventListener('mouseenter', onHoverIn)
        el.addEventListener('mouseleave', onHoverOut)
      })
    }
    
    addListeners()
    const observer = new MutationObserver(addListeners)
    observer.observe(document.body, { childList: true, subtree: true })

    return () => {
      cancelAnimationFrame(animId)
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mousedown', onMouseDown)
      document.removeEventListener('mouseup', onMouseUp)
      observer.disconnect()
    }
  }, [])

  return (
    <div ref={ringRef} className="cursor-ring" />
  )
}
