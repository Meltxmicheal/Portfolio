import { API_URL } from './config';
import { Profile, Education, Experience, Skill, Project, Certificate } from './supabase';

// TypeScript Interfaces for Type Safety
interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
}

interface MediaAsset {
  id: string;
  [key: string]: any;
}

interface SocialLinks {
  github?: string;
  linkedin?: string;
  email?: string;
  whatsapp?: string;
}

async function fetcher<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null;
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'API request failed');
  }

  return response.json();
}

export const api = {
  // Auth
  login: (credentials: LoginRequest) => 
    fetcher<LoginResponse>('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  getMe: () => fetcher('/auth/me'),

  // Stats
  getStats: () => fetcher('/stats'),

  // Messages
  getMessages: () => fetcher('/messages'),
  markMessageAsRead: (id: string) => fetcher(`/messages/${id}/read`, { method: 'PUT' }),
  deleteMessage: (id: string) => fetcher(`/messages/${id}`, { method: 'DELETE' }),

  // Education & Experience
  getEducation: () => fetcher<Education[]>('/education'),
  createEducation: (data: Partial<Education>) => 
    fetcher('/education', { method: 'POST', body: JSON.stringify(data) }),
  updateEducation: (id: string, data: Partial<Education>) => 
    fetcher(`/education/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteEducation: (id: string) => fetcher(`/education/${id}`, { method: 'DELETE' }),
  
  getExperience: () => fetcher<Experience[]>('/experience'),
  createExperience: (data: Partial<Experience>) => 
    fetcher('/experience', { method: 'POST', body: JSON.stringify(data) }),
  updateExperience: (id: string, data: Partial<Experience>) => 
    fetcher(`/experience/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteExperience: (id: string) => fetcher(`/experience/${id}`, { method: 'DELETE' }),
  
  // Profile
  getProfile: () => fetcher<Profile>('/profile'),
  updateProfile: (data: Partial<Profile>) => 
    fetcher('/profile', { method: 'PUT', body: JSON.stringify(data) }),

  // Certificates
  getCertificates: () => fetcher<Certificate[]>('/certificates'),
  createCertificate: (data: Partial<Certificate>) => 
    fetcher('/certificates', { method: 'POST', body: JSON.stringify(data) }),
  updateCertificate: (id: string, data: Partial<Certificate>) => 
    fetcher(`/certificates/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteCertificate: (id: string) => fetcher(`/certificates/${id}`, { method: 'DELETE' }),
  
  // Projects
  getProjects: () => fetcher<Project[]>('/projects'),
  createProject: (data: Partial<Project>) => 
    fetcher('/projects', { method: 'POST', body: JSON.stringify(data) }),
  updateProject: (id: string, data: Partial<Project>) => 
    fetcher(`/projects/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteProject: (id: string) => fetcher(`/projects/${id}`, { method: 'DELETE' }),

  // Skills
  getSkills: () => fetcher<Skill[]>('/skills'),
  createSkill: (data: Partial<Skill>) => 
    fetcher('/skills', { method: 'POST', body: JSON.stringify(data) }),
  updateSkill: (id: string, data: Partial<Skill>) => 
    fetcher(`/skills/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteSkill: (id: string) => fetcher(`/skills/${id}`, { method: 'DELETE' }),

  // Social
  getSocialLinks: () => fetcher<SocialLinks | null>('/social-links'),
  updateSocialLinks: (data: SocialLinks) => 
    fetcher('/social-links', { method: 'PUT', body: JSON.stringify(data) }),

  // Featured Project
  getFeaturedProject: () => fetcher<Project | null>('/featured-project'),
  updateFeaturedProject: (data: Partial<Project>) => 
    fetcher('/featured-project', { method: 'PUT', body: JSON.stringify(data) }),

  // Media Assets
  getMediaAssets: () => fetcher<MediaAsset[]>('/media-assets'),
  createMediaAsset: (data: Partial<MediaAsset>) => 
    fetcher('/media-assets', { method: 'POST', body: JSON.stringify(data) }),
  updateMediaAsset: (id: string, data: Partial<MediaAsset>) => 
    fetcher(`/media-assets/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteMediaAsset: (id: string) => fetcher(`/media-assets/${id}`, { method: 'DELETE' }),

  // Upload
  uploadImage: async (file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    
    const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null;
    const response = await fetch(`${API_URL}/upload`, {
      method: 'POST',
      headers: {
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
      body: formData
    });

    if (!response.ok) throw new Error('Upload failed');
    return response.json();
  },

  // Contact form - NEW ENDPOINT
  submitContactForm: (data: { name: string; email: string; subject: string; message: string }) =>
    fetcher('/messages', { method: 'POST', body: JSON.stringify(data) }),
};

/**
 * Triggers on-demand ISR revalidation for the frontend homepage.
 * Call this after any admin update (profile, avatar, projects, etc.)
 * so visitors see the new data immediately instead of waiting up to 60s.
 */
export async function revalidateFrontend(): Promise<void> {
  try {
    const secret = process.env.NEXT_PUBLIC_REVALIDATE_SECRET || ''
    await fetch('/api/revalidate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(secret ? { 'x-revalidate-secret': secret } : {}),
      },
    })
  } catch {
    // Non-fatal — page will self-heal after the revalidate window expires
    console.warn('[revalidateFrontend] Could not revalidate cache — will expire naturally')
  }
}
