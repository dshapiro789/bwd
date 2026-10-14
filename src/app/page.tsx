'use client';

import Layout from '@/components/layout/Layout';
import HeroSection from '@/components/home/HeroSection';
import PortfolioSection from '@/components/home/PortfolioSection';
import AboutSection from '@/components/home/AboutSection';
import ContactWizard from '@/components/contact/ContactWizard';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import PricingSection from '@/components/home/PricingSection';

import ServicesSection from '@/components/home/ServicesSection';
import StudioSection from '@/components/home/StudioSection';
import ChapterMark from '@/components/plates/ChapterMark';

// Each section opens on a running header ("02 / 07 · The people"). Where the
// hero pins, its runway draws the first one itself.
export default function Home() {
  return (
    <Layout>
      <HeroSection />
      <ChapterMark index={1} label="Selected work" unpinnedOnly />
      <PortfolioSection />
      <ChapterMark index={2} label="The people" />
      <AboutSection />
      <ChapterMark index={3} label="Services" />
      <ServicesSection />
      <ChapterMark index={4} label="Investment" />
      <PricingSection />
      <ChapterMark index={5} label="The studio" />
      <StudioSection />
      <ChapterMark index={6} label="Clients" />
      <TestimonialsSection />
      <ChapterMark index={7} label="Begin" />
      <ContactWizard />
    </Layout>
  );
}
