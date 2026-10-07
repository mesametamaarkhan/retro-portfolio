'use client';

import Hero from '@/components/hero';
import FeaturedProjects from '@/components/featured-projects';
import ExperienceTimeline from '@/components/experience-timeline';
import SkillsBlock from '@/components/skills-block';
import CertificationsGrid from '@/components/certifications-grid';
import ContactCTA from '@/components/contact-cta';

export default function HomePage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-12 space-y-16 md:space-y-24">
      <Hero />
      <FeaturedProjects />
      <ExperienceTimeline />
      <SkillsBlock />
      <CertificationsGrid />
      <ContactCTA />
    </main>
  );
}
