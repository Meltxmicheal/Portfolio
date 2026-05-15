'use client'

/**
 * Cloudinary image loader for Next.js <Image> component.
 * Automatically applies: f_auto (WebP/AVIF), q_auto, responsive width.
 * This file is referenced by next.config.js → images.loaderFile
 */
export default function cloudinaryLoader({ src, width, quality }) {
  if (src && src.startsWith('https://res.cloudinary.com')) {
    // Insert transformation parameters before the version/file segment
    const q = quality || 'auto'
    return src.replace('/upload/', `/upload/f_auto,q_${q},w_${width}/`)
  }
  // Fallback for non-Cloudinary images
  return src
}
