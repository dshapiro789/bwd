'use client';

import Layout from '@/components/layout/Layout';
import HeroSection from '@/components/home/HeroSection';
import PortfolioSection from '@/components/home/PortfolioSection';
import ContactWizard from '@/components/contact/ContactWizard';
import TestimonialsSection from '@/components/home/TestimonialsSection';

import ServicesSection from '@/components/home/ServicesSection';
import StudioSection from '@/components/home/StudioSection';

import ParallaxDivider from '@/components/common/ParallaxDivider';

export default function Home() {
  return (
    <Layout>
      <HeroSection />

      <ParallaxDivider
        image="/images/bonsai-divider-1.png"
        height="250px"
      />

      <PortfolioSection />

      <ParallaxDivider
        image="/images/bonsai-divider-2.png"
        height="250px"
      />

      <ServicesSection />

      <ParallaxDivider
        image="/images/bonsai-divider-3.png"
        height="300px"
      />

      <StudioSection />

      <ParallaxDivider
        image="/images/bonsai-divider-4.png"
        height="250px"
      />

      <TestimonialsSection />
      <ContactWizard />
    </Layout>
  );
}
