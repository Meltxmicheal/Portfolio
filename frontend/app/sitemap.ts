import { MetadataRoute } from 'next'
import { SITE_URL, API_URL } from '@/lib/config'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = SITE_URL

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
  ]

  try {
    const apiUrl = API_URL
    // Skip dynamic routes if no API URL configured (e.g. local build without backend)
    if (!apiUrl || apiUrl.includes('localhost')) return staticRoutes

    const res = await fetch(`${apiUrl}/projects`, { next: { revalidate: 3600 } })
    if (!res.ok) return staticRoutes

    const projects = await res.json()
    const projectRoutes: MetadataRoute.Sitemap = projects
      .filter((p: any) => p.slug)
      .map((p: any) => ({
        url: `${siteUrl}/projects/${p.slug}`,
        lastModified: new Date(p.updated_at || Date.now()),
        changeFrequency: 'monthly' as const,
        priority: 0.8,
      }))

    return [...staticRoutes, ...projectRoutes]
  } catch {
    return staticRoutes
  }
}
