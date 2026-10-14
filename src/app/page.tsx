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
import WireRule from '@/components/wire/WireRule';

// The hero's wire tail hands off into Projects; a Wire Rule marks each
// boundary after that.
export default function Home() {
  return (
    <Layout>
      <HeroSection />
      <PortfolioSection />
      <WireRule variant={0} />
      <AboutSection />
      <WireRule variant={1} />
      <ServicesSection />
      <WireRule variant={2} />
      <PricingSection />
      <WireRule variant={0} />
      <StudioSection />
      <WireRule variant={1} />
      <TestimonialsSection />
      <WireRule variant={2} />
      <ContactWizard />
    </Layout>
  );
}
