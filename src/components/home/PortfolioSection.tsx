'use client';

import styled from 'styled-components';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { Section, Container } from '../layout/Container';

// Updated Project Data
const projects = [
  {
    id: 1,
    title: 'Emerald Grove Digital',
    category: 'Digital Agency',
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
  font-size: 1.5rem;
  color: ${({ theme }) => theme.colors.primary};
  text-transform: uppercase;
  letter-spacing: 0.2em;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  font-weight: 400;
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
  transition: all 0.3s ease;

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

  // Smooth fade in and out based on scroll position
  // 0 -> 0.2 (fade in) | 0.2 -> 0.8 (visible) | 0.8 -> 1 (fade out)
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [50, 0, 0, -50]);

  return (
    <ItemWrapper
      ref={ref}
      href={project.url}
      target="_blank"
      rel="noopener noreferrer"
      style={{ opacity, y }}
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
            Selected Works
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
