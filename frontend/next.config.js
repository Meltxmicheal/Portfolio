/** @type {import('next').NextConfig} */

const cloudinaryLoader = ({ src, width, quality }) => {
  // If already a Cloudinary URL, inject transformation params
  if (src.startsWith('https://res.cloudinary.com')) {
    const base = src.replace('/upload/', `/upload/f_auto,q_${quality || 'auto'},w_${width}/`)
    return base
  }
  return src
}

const nextConfig = {
  images: {
    loader: 'custom',
    loaderFile: './cloudinary-loader.js',
    remotePatterns: [
      { protocol: 'https', hostname: '*.supabase.co' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'avatars.githubusercontent.com' },
      { protocol: 'https', hostname: '*.githubusercontent.com' },
      { protocol: 'https', hostname: 'res.cloudinary.com' },
    ],
  },

  // Performance: compress responses
  compress: true,

  // Reduce JS bundle by externalizing heavy server-only libs
  experimental: {
    optimizePackageImports: ['framer-motion', 'react-icons'],
  },

  // Security Headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://fonts.googleapis.com https://api.fontshare.com https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://api.fontshare.com; font-src 'self' https://fonts.gstatic.com https://api.fontshare.com data:; img-src 'self' data: https: blob:; connect-src 'self' https: wss:; frame-ancestors 'none';"
          },
        ],
      },
    ];
  },

  // Redirects for SEO
  async redirects() {
    return [
      {
        source: '/github',
        destination: 'https://github.com/Meltxmicheal',
        permanent: false,
      },
      {
        source: '/linkedin',
        destination: 'https://linkedin.com/in/meltxmicheal',
        permanent: false,
      },
    ];
  },
}

module.exports = nextConfig

