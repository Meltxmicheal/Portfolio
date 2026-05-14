'use client';
import React, { useEffect, useState } from 'react';

export default function AnimatedBackground() {
  const [scrollY, setScrollY] = useState(0);
  const [maxScroll, setMaxScroll] = useState(1);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      setMaxScroll(scrollHeight > 0 ? scrollHeight : 1);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    handleScroll();
    
    const interval = setInterval(handleScroll, 1000);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      clearInterval(interval);
    };
  }, []);

  const progress = scrollY / maxScroll;

  // Render variables for exact gradients
  const innerPagesOpacity = progress > 0.05 && progress < 0.95 ? 1 : 0;
  const heroOpacity = Math.max(0, 1 - progress * 2.5);

  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden bg-[#02000a] pointer-events-none">
      {/* Cinematic Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)] z-20 pointer-events-none"></div>

      {/* Noise Texture */}
      <div 
        className="absolute inset-0 opacity-[0.05] mix-blend-overlay z-30" 
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat'
        }}
      ></div>

      {/* ========================================================
          HERO & THANK YOU PAGE
          ======================================================== */}
      
      {/* Center Wave Glow (Hero) */}
      <div 
        className="absolute top-[5%] right-[10%] w-[90vw] h-[70vw] rounded-[100%] blur-[140px] mix-blend-screen transition-opacity duration-[1500ms] ease-in-out"
        style={{ 
          background: 'linear-gradient(135deg, rgba(88, 28, 135, 0.5) 0%, rgba(124, 58, 237, 0.4) 30%, rgba(37, 99, 235, 0.2) 70%, rgba(139, 92, 246, 0.1) 100%)',
          transform: `translate(0, ${scrollY * -0.4}px)`,
          opacity: heroOpacity
        }}
      />
      {/* Top Right Glow (Hero) */}
      <div 
        className="absolute top-[-15%] right-[-10%] w-[60vw] h-[60vw] rounded-full blur-[150px] mix-blend-screen transition-opacity duration-[1500ms] ease-in-out"
        style={{ 
          background: 'radial-gradient(circle, rgba(30, 64, 175, 0.8) 0%, rgba(30, 58, 138, 0.2) 60%, transparent 80%)',
          transform: `translate(0, ${scrollY * -0.2}px)`,
          opacity: heroOpacity
        }}
      />
      {/* Bottom Left Glow (Hero) */}
      <div 
        className="absolute top-[35%] left-[-15%] w-[70vw] h-[70vw] rounded-full blur-[160px] mix-blend-screen transition-opacity duration-[1500ms] ease-in-out"
        style={{ 
          background: 'radial-gradient(circle, rgba(76, 29, 149, 0.4) 0%, rgba(15, 23, 42, 0.1) 60%, transparent 80%)',
          transform: `translate(0, ${scrollY * -0.15}px)`,
          opacity: heroOpacity
        }}
      />

      {/* ========================================================
          INNER PAGES
          ======================================================== */}
      {/* Left Side Glow */}
      <div 
        className="absolute top-[25%] left-[-25%] w-[80vw] h-[90vw] rounded-[100%] blur-[160px] mix-blend-screen transition-opacity duration-[1500ms] ease-in-out"
        style={{ 
          background: 'linear-gradient(135deg, rgba(147, 51, 234, 0.4) 0%, rgba(30, 64, 175, 0.1) 70%, transparent 100%)',
          transform: `translate(0, ${(scrollY - maxScroll * 0.3) * -0.1}px)`,
          opacity: innerPagesOpacity * 0.6
        }}
      />
      {/* Top Right Glow */}
      <div 
        className="absolute top-[15%] right-[-15%] w-[60vw] h-[60vw] rounded-full blur-[150px] mix-blend-screen transition-opacity duration-[1500ms] ease-in-out"
        style={{ 
          background: 'radial-gradient(circle, rgba(30, 58, 138, 0.25) 0%, rgba(15, 23, 42, 0.05) 60%, transparent 80%)',
          transform: `translate(0, ${(scrollY - maxScroll * 0.4) * -0.15}px)`,
          opacity: innerPagesOpacity * 0.5
        }}
      />
      {/* Bottom Right Glow */}
      <div 
        className="absolute bottom-[15%] right-[-5%] w-[70vw] h-[70vw] rounded-[100%] blur-[150px] mix-blend-screen transition-opacity duration-[1500ms] ease-in-out"
        style={{ 
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.2) 0%, rgba(76, 29, 149, 0.6) 60%, transparent 80%)',
          transform: `translate(0, ${(scrollY - maxScroll * 0.6) * -0.12}px)`,
          opacity: innerPagesOpacity * 0.7
        }}
      />

      {/* Deep Glass Overlay */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] z-10 pointer-events-none transition-all duration-[2000ms]"></div>
    </div>
  );
}
