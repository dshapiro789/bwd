'use client';

import styled from 'styled-components';
import { motion, useTransform, useMotionValue, animate } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { Section, Container } from '../layout/Container';
import GradientText from '../common/GradientText';
import { FiArrowUpRight, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

// Project Data
const projects = [
  {
    id: 0,
    title: 'AthleteXperience',
    category: 'Feature Rich Mobile App',
    description: 'Coming Soon - A premium mobile experience for athletes',
    url: 'https://theathletexperience.com',
    gradient: 'linear-gradient(135deg, #1a3a2a 0%, #0d1f15 100%)',
  },
  {
    id: 1,
    title: 'Emerald Grove Digital',
    category: 'AI Services Demo',
    description: 'Showcasing AI-powered digital solutions',
    url: 'https://emeraldgrovedigital.com',
    gradient: 'linear-gradient(135deg, #2a4a3a 0%, #152a1f 100%)',
  },
  {
    id: 2,
    title: 'Shapiro Works',
    category: 'Digital Freelance Agency',
    description: 'Professional digital services portfolio',
    url: 'https://shapiroworks.com',
    gradient: 'linear-gradient(135deg, #3a2a1a 0%, #1f150d 100%)',
  },
  {
    id: 3,
    title: 'UPrompt',
    category: 'AI Prompt Engineering',
    description: 'Tools for crafting perfect AI prompts',
    url: 'https://uprompt.me',
    gradient: 'linear-gradient(135deg, #2a2a3a 0%, #15151f 100%)',
  },
  {
    id: 4,
    title: 'AI Bitcoin Tutor',
    category: 'EdTech / Crypto',
    description: 'AI-powered cryptocurrency education',
    url: 'https://aibitcointutor.com',
    gradient: 'linear-gradient(135deg, #3a3a2a 0%, #1f1f15 100%)',
  },
  {
    id: 5,
    title: 'Crypto Apparel',
    category: 'E-Commerce',
    description: 'Premium cryptocurrency merchandise',
    url: 'https://cryptoapparel.net',
    gradient: 'linear-gradient(135deg, #2a3a3a 0%, #151f1f 100%)',
  },
  {
    id: 6,
    title: 'Weatherford Ranches',
    category: 'E-Commerce',
    description: 'Ranch products and lifestyle goods',
    url: 'https://weatherfordranchesllc.com',
    gradient: 'linear-gradient(135deg, #3a2a2a 0%, #1f1515 100%)',
  },
  {
    id: 7,
    title: 'Luxury Vacation Rental',
    category: 'Rental Property Demo',
    description: 'Premium vacation rental booking experience',
    url: 'https://rental-property-booking-template-kg5og73xk.vercel.app/',
    gradient: 'linear-gradient(135deg, #2a2a2a 0%, #151515 100%)',
  },
  {
    id: 8,
    title: 'Live Pura Vida',
    category: 'Travel Agency Demo',
    description: 'Costa Rica travel experiences',
    url: 'https://livepuravida.net',
    gradient: 'linear-gradient(135deg, #1a3a3a 0%, #0d1f1f 100%)',
  },
];

const PortfolioWrapper = styled(Section)`
  background: linear-gradient(
    180deg,
    rgba(20, 40, 30, 0.2) 0%,
    rgba(16, 32, 24, 0.3) 50%,
    rgba(20, 40, 30, 0.2) 100%
  );
  padding: ${({ theme }) => theme.spacing.xxxl} 0;
  position: relative;
  overflow: hidden;
`;

const Header = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  text-align: center;
`;

const SectionTitle = styled(motion.h2)`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: 3rem;
  font-weight: 300;
  color: ${({ theme }) => theme.colors.primary};
  letter-spacing: 0.05em;
  text-shadow: 0 2px 12px rgba(200, 159, 129, 0.2);
  
  @media (max-width: 768px) {
    font-size: 2.25rem;
  }
`;

const Subtitle = styled(motion.p)`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 1.1rem;
  margin-top: ${({ theme }) => theme.spacing.md};
  opacity: 0.8;
`;

const ScrollContainer = styled.div`
  position: relative;
  width: 100%;
  overflow: hidden;
`;

const ScrollTrack = styled(motion.div)`
  display: flex;
  gap: 32px;
  padding: 40px 0;
  cursor: grab;
  
  &:active {
    cursor: grabbing;
  }
`;

const ProjectCard = styled(motion.a) <{ $gradient: string }>`
  flex-shrink: 0;
  width: 400px;
  height: 320px;
  background: ${({ $gradient }) => $gradient};
  border-radius: 24px;
  padding: ${({ theme }) => theme.spacing.xl};
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  text-decoration: none;
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(200, 159, 129, 0.15);
  
  /* Shine effect */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.05),
      transparent
    );
    transition: left 0.6s ease;
  }
  
  &:hover::before {
    left: 100%;
  }
  
  /* Border glow */
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 24px;
    padding: 2px;
    background: linear-gradient(
      135deg,
      rgba(200, 159, 129, 0.5),
      transparent 40%,
      transparent 60%,
      rgba(200, 159, 129, 0.5)
    );
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    opacity: 0.4;
    transition: opacity 0.4s ease;
  }
  
  &:hover::after {
    opacity: 1;
  }
  
  @media (max-width: 768px) {
    width: 320px;
    height: 280px;
  }
`;

const CardIndex = styled.div`
  position: absolute;
  top: 20px;
  right: 24px;
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: 5rem;
  font-weight: 100;
  color: rgba(200, 159, 129, 0.15);
  line-height: 1;
  pointer-events: none;
`;

const CardContent = styled.div`
  position: relative;
  z-index: 1;
`;

const CategoryBadge = styled.span`
  display: inline-block;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  background: rgba(200, 159, 129, 0.2);
  color: ${({ theme }) => theme.colors.primary};
  border: 1px solid rgba(200, 159, 129, 0.3);
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const ProjectTitle = styled.h3`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: 1.8rem;
  font-weight: 300;
  color: ${({ theme }) => theme.colors.text};
  letter-spacing: 0.02em;
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  
  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const ProjectDescription = styled.p`
  font-size: 0.95rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  opacity: 0.8;
  line-height: 1.5;
`;

const ExternalIcon = styled(motion.span)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  color: ${({ theme }) => theme.colors.primary};
  opacity: 0;
  transform: translateX(-5px);
  transition: all 0.3s ease;
  
  ${ProjectCard}:hover & {
    opacity: 1;
    transform: translateX(0);
  }
`;

const NavigationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.lg};
  margin-top: ${({ theme }) => theme.spacing.xl};
`;

const NavButton = styled(motion.button)`
  background: rgba(20, 30, 25, 0.8);
  border: 1px solid rgba(200, 159, 129, 0.3);
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.primary};
  cursor: pointer;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;

  &:hover {
    background: rgba(25, 35, 30, 0.9);
    border-color: rgba(200, 159, 129, 0.5);
    box-shadow: 0 0 20px rgba(200, 159, 129, 0.2);
  }
  
  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }

  svg {
    font-size: 1.3rem;
  }
`;

const ProgressBar = styled.div`
  width: 200px;
  height: 3px;
  background: rgba(200, 159, 129, 0.2);
  border-radius: 3px;
  overflow: hidden;
`;

const ProgressFill = styled(motion.div)`
  height: 100%;
  background: linear-gradient(
    90deg,
    ${({ theme }) => theme.colors.primary},
    ${({ theme }) => theme.colors.accent}
  );
  border-radius: 3px;
`;

const ScrollHint = styled(motion.div)`
  position: relative;
  margin-top: ${({ theme }) => theme.spacing.lg};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 0.85rem;
  opacity: 0.6;
  
  @media (min-width: 769px) {
    display: none;
  }
`;

export default function PortfolioSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const [isDragging, setIsDragging] = useState(false);
  const [trackWidth, setTrackWidth] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);

  // Calculate dimensions
  useEffect(() => {
    const updateDimensions = () => {
      if (trackRef.current && scrollRef.current) {
        setTrackWidth(trackRef.current.scrollWidth);
        setContainerWidth(scrollRef.current.offsetWidth);
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const maxScroll = Math.max(0, trackWidth - containerWidth);
  const cardWidth = 432; // card width + gap

  // Progress based on scroll position
  const progress = useTransform(x, [0, -maxScroll], [0, 100]);

  const scrollTo = (direction: 'left' | 'right') => {
    const currentX = x.get();
    let newX = direction === 'left'
      ? Math.min(currentX + cardWidth, 0)
      : Math.max(currentX - cardWidth, -maxScroll);

    // If scrolling right and we're near the end, snap to end
    if (direction === 'right' && Math.abs(newX) >= maxScroll - 50) {
      newX = -maxScroll;
      animate(x, newX, { type: 'spring', stiffness: 300, damping: 30 });
      setCurrentIndex(projects.length - 1);
      return;
    }

    animate(x, newX, { type: 'spring', stiffness: 300, damping: 30 });

    // Update current index
    const newIndex = Math.round(Math.abs(newX) / cardWidth);
    setCurrentIndex(Math.min(newIndex, projects.length - 1));
  };

  // Handle drag end to snap to cards
  const handleDragEnd = () => {
    setIsDragging(false);
    const currentX = x.get();

    // If we're near the end, snap to end
    if (Math.abs(currentX) >= maxScroll - 50) {
      animate(x, -maxScroll, { type: 'spring', stiffness: 300, damping: 30 });
      setCurrentIndex(projects.length - 1);
      return;
    }

    const snapIndex = Math.round(Math.abs(currentX) / cardWidth);
    const snapX = -snapIndex * cardWidth;
    const clampedX = Math.max(Math.min(snapX, 0), -maxScroll);

    animate(x, clampedX, { type: 'spring', stiffness: 300, damping: 30 });
    setCurrentIndex(Math.min(snapIndex, projects.length - 1));
  };

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
          <Subtitle
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Drag to explore our portfolio
          </Subtitle>
        </Header>
      </Container>

      <ScrollContainer ref={scrollRef}>
        <ScrollTrack
          ref={trackRef}
          drag="x"
          dragConstraints={{ left: -maxScroll, right: 0 }}
          dragElastic={0.1}
          dragTransition={{ bounceStiffness: 300, bounceDamping: 30 }}
          style={{ x, paddingLeft: 'calc(50vw - 200px)', paddingRight: 'calc(50vw - 200px)' }}
          onDragStart={() => setIsDragging(true)}
          onDragEnd={handleDragEnd}
        >
          {projects.map((project, index) => (
            <ProjectCard
              key={project.id}
              href={isDragging ? undefined : project.url}
              target="_blank"
              rel="noopener noreferrer"
              $gradient={project.gradient}
              whileHover={{ scale: 1.02, y: -8 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => isDragging && e.preventDefault()}
            >
              <CardIndex>{String(index + 1).padStart(2, '0')}</CardIndex>
              <CardContent>
                <CategoryBadge>{project.category}</CategoryBadge>
                <ProjectTitle>
                  {project.title}
                  <ExternalIcon>
                    <FiArrowUpRight />
                  </ExternalIcon>
                </ProjectTitle>
                <ProjectDescription>{project.description}</ProjectDescription>
              </CardContent>
            </ProjectCard>
          ))}
        </ScrollTrack>

        <ScrollHint
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ delay: 1 }}
        >
          ← Swipe to explore →
        </ScrollHint>
      </ScrollContainer>

      <Container>
        <NavigationContainer>
          <NavButton
            onClick={() => scrollTo('left')}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            disabled={currentIndex === 0}
          >
            <FiChevronLeft />
          </NavButton>

          <ProgressBar>
            <ProgressFill style={{ width: `${Math.min(100, ((currentIndex + 1) / projects.length) * 100)}%` }} />
          </ProgressBar>

          <NavButton
            onClick={() => scrollTo('right')}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            disabled={currentIndex >= projects.length - 1}
          >
            <FiChevronRight />
          </NavButton>
        </NavigationContainer>
      </Container>
    </PortfolioWrapper>
  );
}

