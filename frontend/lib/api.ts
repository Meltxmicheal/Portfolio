import { API_URL } from './config';


async function fetcher(endpoint: string, options: RequestInit = {}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null;
  
  const headers = {
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
  login: (credentials: any) => fetcher('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  getMe: () => fetcher('/auth/me'),

  // Stats
  getStats: () => fetcher('/stats'),

  // Messages
  getMessages: () => fetcher('/messages'),
  markMessageAsRead: (id: string) => fetcher(`/messages/${id}/read`, { method: 'PUT' }),
  deleteMessage: (id: string) => fetcher(`/messages/${id}`, { method: 'DELETE' }),

  // Education & Experience
  getEducation: () => fetcher('/education'),
  createEducation: (data: any) => fetcher('/education', { method: 'POST', body: JSON.stringify(data) }),
  updateEducation: (id: string, data: any) => fetcher(`/education/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteEducation: (id: string) => fetcher(`/education/${id}`, { method: 'DELETE' }),
  
  getExperience: () => fetcher('/experience'),
  createExperience: (data: any) => fetcher('/experience', { method: 'POST', body: JSON.stringify(data) }),
  updateExperience: (id: string, data: any) => fetcher(`/experience/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteExperience: (id: string) => fetcher(`/experience/${id}`, { method: 'DELETE' }),
  
  // Profile
  getProfile: () => fetcher('/profile'),
  updateProfile: (data: any) => fetcher('/profile', { method: 'PUT', body: JSON.stringify(data) }),

  // Certificates
  getCertificates: () => fetcher('/certificates'),
  createCertificate: (data: any) => fetcher('/certificates', { method: 'POST', body: JSON.stringify(data) }),
  updateCertificate: (id: string, data: any) => fetcher(`/certificates/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteCertificate: (id: string) => fetcher(`/certificates/${id}`, { method: 'DELETE' }),
  
  // Projects
  getProjects: () => fetcher('/projects'),
  createProject: (data: any) => fetcher('/projects', { method: 'POST', body: JSON.stringify(data) }),
  updateProject: (id: string, data: any) => fetcher(`/projects/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteProject: (id: string) => fetcher(`/projects/${id}`, { method: 'DELETE' }),

  // Skills
  getSkills: () => fetcher('/skills'),
  createSkill: (data: any) => fetcher('/skills', { method: 'POST', body: JSON.stringify(data) }),
  deleteSkill: (id: string) => fetcher(`/skills/${id}`, { method: 'DELETE' }),

  // Social
  getSocialLinks: () => fetcher('/social-links'),
  updateSocialLinks: (data: any) => fetcher('/social-links', { method: 'PUT', body: JSON.stringify(data) }),

  // Featured Project
  getFeaturedProject: () => fetcher('/featured-project'),
  updateFeaturedProject: (data: any) => fetcher('/featured-project', { method: 'PUT', body: JSON.stringify(data) }),

  // Media Assets
  getMediaAssets: () => fetcher('/media-assets'),
  createMediaAsset: (data: any) => fetcher('/media-assets', { method: 'POST', body: JSON.stringify(data) }),
  updateMediaAsset: (id: string, data: any) => fetcher(`/media-assets/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteMediaAsset: (id: string) => fetcher(`/media-assets/${id}`, { method: 'DELETE' }),

  // Upload
  uploadImage: async (file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    
    const token = localStorage.getItem('admin_token');
    const response = await fetch(`${API_URL}/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    if (!response.ok) throw new Error('Upload failed');
    return response.json();
  }
};
