import type { Metadata, Viewport } from 'next'
import './globals.css'
import ClientProviders from '@/components/ui/ClientProviders'

import { SITE_URL, CLOUDINARY_BASE_URL } from '@/lib/config'

const siteUrl = SITE_URL
const ogImage = `${CLOUDINARY_BASE_URL}/image/upload/f_auto,q_auto,w_1200/v1778765549/20260514_185944_bwzrqw.png`

export const metadata: Metadata = {
  title: {
    default: 'Meltx Micheal — Full Stack Developer & AI Engineer',
    template: '%s | Meltx Micheal',
  },
  description:
    'Meltx Micheal — Full-stack AI/ML developer portfolio. Next.js, Supabase, Cloudinary. Building premium cinematic web experiences and intelligent systems.',
  keywords: [
    'Meltx Micheal', 'portfolio', 'full stack developer', 'AI engineer',
    'Next.js', 'React', 'TypeScript', 'Supabase', 'machine learning',
    'web developer', 'framer motion', 'cinematic portfolio',
  ],
  authors: [{ name: 'Meltx Micheal' }],
  creator: 'Meltx Micheal',
  metadataBase: new URL(siteUrl),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName: 'Meltx Micheal Portfolio',
    title: 'Meltx Micheal — Full Stack Developer & AI Engineer',
    description:
      'Full-stack AI/ML developer portfolio. Next.js 14, Supabase, Cloudinary. Premium cinematic web experience.',
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: 'Meltx Micheal Portfolio Preview',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Meltx Micheal — Full Stack Developer & AI Engineer',
    description:
      'Full-stack AI/ML developer portfolio. Next.js 14, Supabase, Cloudinary.',
    images: [ogImage],
    creator: '@meltxmicheal',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: `${CLOUDINARY_BASE_URL}/image/upload/c_fill,w_32,h_32/v1778765549/20260514_185944_bwzrqw.png`, sizes: '32x32', type: 'image/png' },
      { url: `${CLOUDINARY_BASE_URL}/image/upload/c_fill,w_16,h_16/v1778765549/20260514_185944_bwzrqw.png`, sizes: '16x16', type: 'image/png' },
    ],
    apple: [
      { url: `${CLOUDINARY_BASE_URL}/image/upload/c_fill,w_180,h_180/v1778765549/20260514_185944_bwzrqw.png`, sizes: '180x180' },
    ],
    shortcut: `${CLOUDINARY_BASE_URL}/image/upload/c_fill,w_32,h_32/v1778765549/20260514_185944_bwzrqw.png`,
  },
  manifest: undefined,
}

export const viewport: Viewport = {
  themeColor: '#0a0a19',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#0a0a19" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://api.fontshare.com" />
        
        {/* JSON-LD Structured Data for Person/Portfolio */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Person',
              name: 'Meltx Micheal',
              url: SITE_URL,
              jobTitle: 'Full Stack Developer & AI Engineer',
              description: 'Full-stack AI/ML developer portfolio. Next.js, Supabase, Cloudinary. Building premium cinematic web experiences and intelligent systems.',
              image: `${CLOUDINARY_BASE_URL}/image/upload/f_auto,q_auto,w_400/v1778765549/20260514_185944_bwzrqw.png`,
              sameAs: [
                'https://github.com/Meltxmicheal',
                'https://linkedin.com/in/meltxmicheal',
              ],
              knowsLanguage: ['en', 'Malayalam'],
              skills: ['Next.js', 'React', 'TypeScript', 'Supabase', 'Machine Learning', 'Python', 'JavaScript'],
            }),
          }}
        />
      </head>
      <body className="bg-transparent text-slate-100 min-h-screen relative selection:bg-purple-500/30">
        {/* Skip to main content link for accessibility */}
        <a
          href="#main"
          className="absolute -top-10 left-0 bg-purple-600 text-white px-4 py-2 rounded-br-md z-[9999] text-sm font-semibold transition-all focus:top-0 focus:outline-none focus:ring-2 focus:ring-purple-400"
        >
          Skip to main content
        </a>
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
