'use client';

import styled from 'styled-components';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { Section, Container } from '../layout/Container';
import GradientText from '../common/GradientText';

// Updated Project Data
const projects = [
  {
    id: 1,
    title: 'Emerald Grove Digital',
    category: 'AI Services Demo',
    url: 'https://emeraldgrovedigital.com',
  },
  {
    id: 2,
    title: 'Quality Prompt',
    category: 'AI Engineering',
    url: 'https://qualityprompt.cv',
  },
  {
    id: 3,
    title: 'AI Bitcoin Tutor',
    category: 'EdTech / Crypto',
    url: 'https://aibitcointutor.com',
  },
  {
    id: 4,
    title: 'Crypto Apparel',
    category: 'E-Commerce',
    url: 'https://cryptoapparel.net',
  },
  {
    id: 5,
    title: 'Weatherford Ranches',
    category: 'E-Commerce',
    url: 'https://weatherfordranchesllc.com',
  },
  {
    id: 6,
    title: 'Shapiro Works',
    category: 'Digital Agency Demo',
    url: 'https://shapiroworks.com',
  },
  {
    id: 7,
    title: 'Luxury Vacation Rental',
    category: 'Rental Property Demo',
    url: 'https://rental-property-booking-template-kg5og73xk.vercel.app/',
  },

  {
    id: 8,
    title: 'Live Pura Vida',
    category: 'Travel Agency Demo',
    url: 'https://livepuravida.net',
  },
];

const PortfolioWrapper = styled(Section)`
  background-color: ${({ theme }) => theme.colors.background};
  padding: ${({ theme }) => theme.spacing.xl} 0;
  position: relative;
  overflow: hidden;
`;

const Header = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  text-align: left;
`;

const SectionTitle = styled(motion.h2)`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: 3rem;
  font-weight: 300;
  color: ${({ theme }) => theme.colors.primary};
  letter-spacing: 0.05em;
  text-shadow: 0 2px 12px rgba(200, 159, 129, 0.2);
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  
  @media (max-width: 768px) {
    font-size: 2.25rem;
  }
`;

const ProjectList = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 2;
`;

const ItemWrapper = styled(motion.a)`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing.lg} 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  cursor: pointer;
  text-decoration: none;
  position: relative;
  transition: padding-left 0.4s cubic-bezier(0.16, 1, 0.3, 1),
              border-color 0.4s cubic-bezier(0.16, 1, 0.3, 1);

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    padding-left: ${({ theme }) => theme.spacing.md};
    border-bottom-color: ${({ theme }) => theme.colors.primary};
  }
`;

const ProjectTitle = styled.h3`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: 1.5rem;
  color: ${({ theme }) => theme.colors.text};
  font-weight: 400;
  margin: 0;
  font-style: normal;
  transition: color 0.3s ease;

  ${ItemWrapper}:hover & {
    color: ${({ theme }) => theme.colors.primary};
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    font-size: 2.5rem;
  }
`;

const ProjectCategory = styled.span`
  font-family: ${({ theme }) => theme.fonts.main};
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.1em;
  transition: color 0.3s ease;

  ${ItemWrapper}:hover & {
    color: ${({ theme }) => theme.colors.text};
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    display: none;
  }
`;

function ProjectItem({ project }: { project: typeof projects[0] }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  // Enhanced parallax with scale and depth
  const opacity = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [80, 0, 0, -80]);
  const scale = useTransform(scrollYProgress, [0, 0.15, 0.5, 0.85, 1], [0.9, 1, 1, 1, 0.9]);

  return (
    <ItemWrapper
      ref={ref}
      href={project.url}
      target="_blank"
      rel="noopener noreferrer"
      style={{ opacity, y, scale }}
    >
      <ProjectTitle>{project.title}</ProjectTitle>
      <ProjectCategory>{project.category}</ProjectCategory>
    </ItemWrapper>
  );
}

export default function PortfolioSection() {
  return (
    <PortfolioWrapper id="portfolio">
      <Container>
        <Header>
          <SectionTitle
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <GradientText>Projects</GradientText>
          </SectionTitle>
        </Header>

        <ProjectList>
          {projects.map((project) => (
            <ProjectItem key={project.id} project={project} />
          ))}
        </ProjectList>
      </Container>
    </PortfolioWrapper>
  );
}
