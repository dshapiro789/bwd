'use client';

import styled from 'styled-components';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { Section, Container } from '../layout/Container';
import GradientText from '../common/GradientText';
import { FiArrowUpRight } from 'react-icons/fi';

// Updated Project Data with enhanced metadata
const projects = [
  {
    id: 1,
    title: 'Emerald Grove Digital',
    category: 'AI Services Demo',
    url: 'https://emeraldgrovedigital.com',
    year: '2024',
    status: 'Live',
    tech: ['Next.js', 'AI'],
    categoryColor: '#4ade80',
  },
  {
    id: 2,
    title: 'Shapiro Works',
    category: 'Digital Agency Demo',
    url: 'https://shapiroworks.com',
    year: '2024',
    status: 'Live',
    tech: ['Agency'],
    categoryColor: '#8b5cf6',
  },
  {
    id: 3,
    title: 'Quality Prompt',
    category: 'AI Engineering',
    url: 'https://qualityprompt.cv',
    year: '2024',
    status: 'Live',
    tech: ['AI', 'Engineering'],
    categoryColor: '#60a5fa',
  },
  {
    id: 4,
    title: 'AI Bitcoin Tutor',
    category: 'EdTech / Crypto',
    url: 'https://aibitcointutor.com',
    year: '2024',
    status: 'Live',
    tech: ['AI', 'Crypto'],
    categoryColor: '#f59e0b',
  },
  {
    id: 5,
    title: 'Crypto Apparel',
    category: 'E-Commerce',
    url: 'https://cryptoapparel.net',
    year: '2024',
    status: 'Live',
    tech: ['E-Commerce'],
    categoryColor: '#ec4899',
  },
  {
    id: 6,
    title: 'Weatherford Ranches',
    category: 'E-Commerce',
    url: 'https://weatherfordranchesllc.com',
    year: '2024',
    status: 'Live',
    tech: ['E-Commerce'],
    categoryColor: '#ec4899',
  },
  {
    id: 7,
    title: 'Luxury Vacation Rental',
    category: 'Rental Property Demo',
    url: 'https://rental-property-booking-template-kg5og73xk.vercel.app/',
    year: '2024',
    status: 'Demo',
    tech: ['Booking'],
    categoryColor: '#06b6d4',
  },
  {
    id: 8,
    title: 'Live Pura Vida',
    category: 'Travel Agency Demo',
    url: 'https://livepuravida.net',
    year: '2024',
    status: 'Demo',
    tech: ['Travel'],
    categoryColor: '#10b981',
  },
];

const PortfolioWrapper = styled(Section)`
  background: linear-gradient(
    180deg,
    rgba(20, 40, 30, 0.2) 0%,
    rgba(16, 32, 24, 0.3) 50%,
    rgba(20, 40, 30, 0.2) 100%
  );
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
  gap: ${({ theme }) => theme.spacing.md};
  position: relative;
  z-index: 2;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    display: none;
  }
`;

const MobileCarousel = styled.div`
  display: none;
  position: relative;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    display: block;
    overflow: hidden;
    padding: ${({ theme }) => theme.spacing.md} 0;
  }
`;

const MobileCarouselTrack = styled(motion.div)`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  padding: 0 ${({ theme }) => theme.spacing.md};
  cursor: grab;
  
  &:active {
    cursor: grabbing;
  }
`;



const ItemWrapper = styled(motion.a)`
  display: block;
  padding: ${({ theme }) => theme.spacing.lg};
  cursor: pointer;
  text-decoration: none;
  position: relative;
  background: rgba(20, 30, 25, 0.3);
  border-radius: 16px;
  overflow: hidden;
  backdrop-filter: blur(10px);
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  min-height: 120px;

  /* Animated gradient border */
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 16px;
    padding: 2px;
    background: linear-gradient(
      135deg,
      rgba(200, 159, 129, 0.3),
      rgba(200, 159, 129, 0.1),
      rgba(200, 159, 129, 0.3)
    );
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    opacity: 0.5;
    transition: opacity 0.4s ease;
  }

  &:hover::before {
    opacity: 1;
  }

  &:hover {
    transform: translateY(-8px);
    box-shadow: 
      0 4px 20px rgba(0, 0, 0, 0.3),
      0 8px 40px rgba(200, 159, 129, 0.2),
      0 16px 80px rgba(200, 159, 129, 0.1);
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    min-width: 280px;
    flex-shrink: 0;
  }
`;

const ContentWrapper = styled.div`
  position: relative;
  z-index: 1;
`;

const IndexNumber = styled.div`
  position: absolute;
  top: -20px;
  left: -10px;
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: 8rem;
  font-weight: 100;
  background: linear-gradient(
    135deg,
    rgba(200, 159, 129, 0.15),
    rgba(200, 159, 129, 0.05)
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1;
  pointer-events: none;
  z-index: 0;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    font-size: 5rem;
    top: -10px;
  }
`;

const ProjectHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  position: relative;
  z-index: 1;
  gap: ${({ theme }) => theme.spacing.md};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    flex-direction: column;
    align-items: flex-start;
    gap: ${({ theme }) => theme.spacing.sm};
  }
`;

const ProjectTitleWrapper = styled.div`
  flex: 1;
`;

const ProjectTitle = styled.h3`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: 2rem;
  color: ${({ theme }) => theme.colors.text};
  font-weight: 400;
  margin: 0 0 ${({ theme }) => theme.spacing.xs} 0;
  transition: color 0.3s ease;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};

  ${ItemWrapper}:hover & {
    color: ${({ theme }) => theme.colors.primary};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    font-size: 1.5rem;
  }
`;

const ExternalIcon = styled(motion.span)`
  font-size: 1.4rem;
  color: ${({ theme }) => theme.colors.primary};
  opacity: 0;
  transform: translateX(-10px);
  display: inline-flex;
  align-items: center;
  justify-content: center;

  svg {
    stroke-width: 2.5px;
  }

  ${ItemWrapper}:hover & {
    opacity: 1;
    transform: translateX(0);
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    opacity: 1;
    transform: translateX(0);
  }
`;

const CategoryBadge = styled.span`
  display: inline-block;
  padding: 6px 14px;
  border-radius: 20px;
  font-family: ${({ theme }) => theme.fonts.main};
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  background: linear-gradient(
    135deg,
    rgba(200, 159, 129, 0.2),
    rgba(200, 159, 129, 0.1)
  );
  color: ${({ theme }) => theme.colors.primary};
  border: 1px solid rgba(200, 159, 129, 0.3);
  box-shadow: 0 0 20px rgba(200, 159, 129, 0.15);
  transition: all 0.3s ease;

  ${ItemWrapper}:hover & {
    box-shadow: 0 0 30px rgba(200, 159, 129, 0.25);
    border-color: rgba(200, 159, 129, 0.4);
  }
`;

const MetaRow = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  align-items: center;
  flex-wrap: wrap;
`;

// Removed MetaBadge, StatusDot, ExpandableDetails, TechStack, and TechBadge components


interface ProjectItemProps {
  project: typeof projects[0];
  index: number;
  isMobile?: boolean;
}

function ProjectItem({ project, index, isMobile = false }: ProjectItemProps) {
  const ref = useRef<HTMLAnchorElement>(null);

  // Magnetic hover effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 150 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (isMobile) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const distanceX = e.clientX - centerX;
    const distanceY = e.clientY - centerY;

    // Subtle magnetic pull (max 12px movement)
    mouseX.set(distanceX * 0.03);
    mouseY.set(distanceY * 0.03);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const indexStr = String(index + 1).padStart(2, '0');

  return (
    <ItemWrapper
      ref={ref}
      href={project.url}
      target="_blank"
      rel="noopener noreferrer"
      style={isMobile ? {} : { x, y }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
    >
      <IndexNumber>{indexStr}</IndexNumber>

      <ContentWrapper>
        <ProjectHeader>
          <ProjectTitleWrapper>
            <ProjectTitle>
              {project.title}
              <ExternalIcon>
                <FiArrowUpRight />
              </ExternalIcon>
            </ProjectTitle>
          </ProjectTitleWrapper>

          <CategoryBadge>
            {project.category}
          </CategoryBadge>
        </ProjectHeader>

      </ContentWrapper>
    </ItemWrapper>
  );
}

const ProgressContainer = styled.div`
  padding: 0 ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.md};
  display: flex;
  justify-content: center;
`;

const ProgressTrack = styled.div`
  width: 100%;
  max-width: 200px;
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  overflow: visible;
  position: relative;
  box-shadow: 
    inset 0 1px 2px rgba(0, 0, 0, 0.5),
    0 1px 0 rgba(255, 255, 255, 0.1);
`;

const ProgressBar = styled(motion.div)`
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 100%;
  background: linear-gradient(90deg, 
    ${({ theme }) => theme.colors.primary}40, 
    ${({ theme }) => theme.colors.primary}
  );
  border-radius: 4px;
  transform-origin: 0%;
  box-shadow: 0 0 10px ${({ theme }) => theme.colors.primary}60;

  /* The Glowing Spark Tip */
  &::after {
    content: '';
    position: absolute;
    right: -2px;
    top: 50%;
    transform: translateY(-50%);
    width: 4px;
    height: 12px;
    background: #fff;
    border-radius: 2px;
    box-shadow: 
      0 0 10px #fff,
      0 0 20px ${({ theme }) => theme.colors.primary};
    animation: pulse 2s infinite ease-in-out;
  }

  @keyframes pulse {
    0% { opacity: 0.8; transform: translateY(-50%) scale(1); }
    50% { opacity: 1; transform: translateY(-50%) scale(1.2); box-shadow: 0 0 15px #fff, 0 0 30px ${({ theme }) => theme.colors.primary}; }
    100% { opacity: 0.8; transform: translateY(-50%) scale(1); }
  }
`;

export default function PortfolioSection() {
  const constraintsRef = useRef(null);
  const x = useMotionValue(0);

  // Calculate progress based on scroll position
  // We estimate the total scrollable width based on number of items
  // This is an approximation that works well for the visual indicator
  const cardWidth = 300; // Approximate width of card + gap
  const maxScroll = (projects.length - 1) * cardWidth;

  const progressScale = useTransform(
    x,
    [0, -maxScroll],
    [0, 1]
  );

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

        {/* Desktop List */}
        <ProjectList>
          {projects.map((project, index) => (
            <ProjectItem key={project.id} project={project} index={index} />
          ))}
        </ProjectList>

        {/* Mobile Carousel */}
        <MobileCarousel ref={constraintsRef}>
          <MobileCarouselTrack
            style={{ x }}
            drag="x"
            dragConstraints={{ left: -2000, right: 0 }}
            dragElastic={0.1}
          >
            {projects.map((project, index) => (
              <ProjectItem key={project.id} project={project} index={index} isMobile />
            ))}
          </MobileCarouselTrack>

          <ProgressContainer>
            <ProgressTrack>
              <ProgressBar style={{ scaleX: progressScale }} />
            </ProgressTrack>
          </ProgressContainer>
        </MobileCarousel>
      </Container>
    </PortfolioWrapper>
  );
}
