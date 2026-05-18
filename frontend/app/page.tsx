import { api } from '@/lib/api'
import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/ui/Footer'
import HeroSection from '@/components/sections/HeroSection'
import AboutSection from '@/components/sections/AboutSection'
import FeaturedProjectSection from '@/components/sections/FeaturedProjectSection'
import ProjectsSection from '@/components/sections/ProjectsSection'
import TheJourneySection from '@/components/sections/TheJourneySection'
import ContactSection from '@/components/sections/ContactSection'
import ThankYouSection from '@/components/sections/ThankYouSection'

export const revalidate = 60 // ISR: re-fetch every 60 seconds

// Helper: safely fetch — returns null on any error (e.g. backend not running at build time)
async function safe<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn()
  } catch {
    return fallback
  }
}

export default async function HomePage() {
  const [profile, skills, projects, education, experience, featuredProject, socialLinks] = await Promise.all([
    safe(() => api.getProfile(), null),
    safe(() => api.getSkills(), []),
    safe(() => api.getProjects(), []),
    safe(() => api.getEducation(), []),
    safe(() => api.getExperience(), []),
    safe(() => api.getFeaturedProject(), null),
    safe(() => api.getSocialLinks(), null),
  ])

  const projectsTitle = featuredProject ? 'Featured Projects' : 'My Works'

  return (
    <>
      <Navbar profile={profile} />
      <main>
        <HeroSection profile={profile} />
        <AboutSection profile={profile} />
        <TheJourneySection experience={experience} skills={skills} education={education} />
        {featuredProject && <FeaturedProjectSection project={featuredProject} />}
        <ProjectsSection projects={projects} title={projectsTitle} />
        <ContactSection profile={profile} />
        <ThankYouSection />
      </main>
      <Footer socials={socialLinks} />
    </>
  )
}
