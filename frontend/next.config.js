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
}

module.exports = nextConfig
