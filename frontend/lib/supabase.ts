import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for database tables
export type Profile = {
  id: string
  name: string
  title: string
  tagline: string
  about: string
  email: string
  phone: string
  location: string
  avatar_url: string
  resume_url: string
  github_url: string
  linkedin_url: string
  twitter_url: string
  whatsapp: string
  website_url: string
  years_experience: number
  projects_count: number
  clients_count: number
  contact_image_url: string
  status_badge: string
}

export type Skill = {
  id: string
  name: string
  category: string
  icon_url: string
  proficiency: number
  sort_order: number
  is_featured: boolean
}

export type Education = {
  id: string
  institution: string
  degree: string
  field: string
  start_year: number
  end_year: number | null
  is_current: boolean
  description: string
  gpa: string
  logo_url: string
  sort_order: number
}

export type Experience = {
  id: string
  company: string
  role: string
  start_date: string
  end_date: string | null
  is_current: boolean
  description: string
  technologies: string[]
  company_url: string
  logo_url: string
  sort_order: number
}

export type Project = {
  id: string
  title: string
  slug: string
  short_description: string
  description: string
  thumbnail_image?: string
  gallery_images: string[]
  technologies: string[]
  github_url: string
  live_url: string
  features: string[]
  category: string
  status: string
  is_featured: boolean
  sort_order: number
  views: number
  created_at: string
}

export type Certificate = {
  id: string
  title: string
  issuer: string
  issue_date: string
  expiry_date: string | null
  credential_url: string
  image_url: string
  description: string
  sort_order: number
}

export type ContactMessage = {
  id: string
  name: string
  email: string
  subject: string
  message: string
  is_read: boolean
  created_at: string
}

// Data fetching helpers
export async function getProfile(): Promise<Profile | null> {
  const { data } = await supabase.from('profile').select('*').single()
  return data
}

export async function getSkills(): Promise<Skill[]> {
  const { data } = await supabase.from('skills').select('*').order('sort_order')
  return data || []
}

export async function getEducation(): Promise<Education[]> {
  const { data } = await supabase.from('education').select('*').order('sort_order')
  return data || []
}

export async function getExperience(): Promise<Experience[]> {
  const { data } = await supabase.from('experience').select('*').order('sort_order')
  return data || []
}

export async function getProjects(): Promise<Project[]> {
  const { data } = await supabase.from('projects').select('*').order('sort_order')
  return data || []
}

export async function getFeaturedProjects(): Promise<Project[]> {
  const { data } = await supabase
    .from('projects')
    .select('*')
    .eq('is_featured', true)
    .order('sort_order')
  return data || []
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const { data } = await supabase.from('projects').select('*').eq('slug', slug).single()
  return data
}

export async function getCertificates(): Promise<Certificate[]> {
  const { data } = await supabase.from('certificates').select('*').order('sort_order')
  return data || []
}

export async function sendContactMessage(msg: {
  name: string
  email: string
  subject: string
  message: string
}) {
  const { error } = await supabase.from('contact_messages').insert([msg])
  return { error }
}

// Upload file to Supabase storage
export async function uploadFile(file: File, bucket: string, path: string) {
  const { data, error } = await supabase.storage.from(bucket).upload(path, file, {
    upsert: true,
    cacheControl: '3600',
  })
  if (error) throw error
  const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(path)
  return urlData.publicUrl
}
