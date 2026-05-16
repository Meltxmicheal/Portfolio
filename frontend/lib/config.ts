/**
 * Centralized Application Configuration
 * This file handles environment variables for both frontend and backend communication.
 * Using NEXT_PUBLIC_ prefix is required for Next.js to expose variables to the browser.
 */

const RENDER_URL = 'https://portfolio-no33.onrender.com';

export const CONFIG = {
  // API URLs — NEXT_PUBLIC_ vars are injected at build time by Vercel
  API_URL: process.env.NEXT_PUBLIC_API_URL || `${RENDER_URL}/api`,
  BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL || RENDER_URL,
  SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'https://portfolio-olive-six-qw461lauko.vercel.app',

  // Cloudinary
  CLOUDINARY: {
    CLOUD_NAME: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'drwecuwj3',
    UPLOAD_PRESET: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'portfolio_uploads',
    BASE_URL: `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'drwecuwj3'}`,
  },

  // Feature Flags / Settings
  IS_PRODUCTION: process.env.NODE_ENV === 'production',
};

// For convenience, export individual constants
export const API_URL = CONFIG.API_URL;
export const BACKEND_URL = CONFIG.BACKEND_URL;
export const SITE_URL = CONFIG.SITE_URL;
export const CLOUDINARY_CLOUD_NAME = CONFIG.CLOUDINARY.CLOUD_NAME;
export const CLOUDINARY_UPLOAD_PRESET = CONFIG.CLOUDINARY.UPLOAD_PRESET;
export const CLOUDINARY_BASE_URL = CONFIG.CLOUDINARY.BASE_URL;
