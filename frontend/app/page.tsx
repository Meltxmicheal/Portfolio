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

export default async function HomePage() {
  const [profile, skills, projects, education, experience, featuredProject, socialLinks] = await Promise.all([
    api.getProfile(),
    api.getSkills(),
    api.getProjects(),
    api.getEducation(),
    api.getExperience(),
    api.getFeaturedProject(),
    api.getSocialLinks(),
  ])

  const projectsTitle = featuredProject ? 'Featured Projects' : 'My Works'

  return (
    <>
      <Navbar />
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
