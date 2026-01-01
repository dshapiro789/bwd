'use client';

import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useCallback } from 'react';
import { Section, Container } from '../layout/Container';
import GradientText from '../common/GradientText';
import { FiArrowUpRight, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

// Project Data
const projects = [
  {
    id: 0,
    title: 'AthleteXperience',
    category: 'Feature Rich Mobile App (Coming Soon)',
    url: 'https://theathletexperience.com',
  },
  {
    id: 1,
    title: 'Emerald Grove Digital',
    category: 'AI Services Demo',
    url: 'https://emeraldgrovedigital.com',
  },
  {
    id: 2,
    title: 'Shapiro Works',
    category: 'Digital Freelance Agency',
    url: 'https://shapiroworks.com',
  },
  {
    id: 3,
    title: 'UPrompt',
    category: 'AI Prompt Engineering',
    url: 'https://uprompt.me',
  },
  {
    id: 4,
    title: 'AI Bitcoin Tutor',
    category: 'EdTech / Crypto',
    url: 'https://aibitcointutor.com',
  },
  {
    id: 5,
    title: 'Crypto Apparel',
    category: 'E-Commerce',
    url: 'https://cryptoapparel.net',
  },
  {
    id: 6,
    title: 'Weatherford Ranches',
    category: 'E-Commerce',
    url: 'https://weatherfordranchesllc.com',
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
  margin-bottom: ${({ theme }) => theme.spacing.xxl};
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

const CarouselContainer = styled.div`
  position: relative;
  max-width: 900px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.xl} 0;
  padding-bottom: 80px;
  min-height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 768px) {
    padding-bottom: 80px;
    min-height: 450px;
  }
`;

const CardWrapper = styled(motion.div)`
  position: absolute;
  width: 100%;
  max-width: 700px;
  padding: 0 ${({ theme }) => theme.spacing.lg};
  
  @media (max-width: 768px) {
    max-width: 90%;
  }
`;

const ProjectCard = styled(motion.a)`
  display: block;
  padding: ${({ theme }) => theme.spacing.xl};
  cursor: pointer;
  text-decoration: none;
  position: relative;
  background: rgba(20, 30, 25, 0.6);
  border-radius: 20px;
  overflow: hidden;
  backdrop-filter: blur(12px);
  min-height: 280px;
  
  /* Gradient border */
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 20px;
    padding: 2px;
    background: linear-gradient(
      135deg,
      rgba(200, 159, 129, 0.4),
      rgba(200, 159, 129, 0.1),
      rgba(200, 159, 129, 0.4)
    );
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    opacity: 0.6;
    transition: opacity 0.4s ease;
  }

  &:hover::before {
    opacity: 1;
  }

  &:hover {
    box-shadow: 
      0 20px 40px rgba(0, 0, 0, 0.3),
      0 0 30px rgba(200, 159, 129, 0.15);
  }
`;

const IndexNumber = styled.div`
  position: absolute;
  top: -20px;
  left: -10px;
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: 12rem;
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
  user-select: none;

  @media (max-width: 768px) {
    font-size: 8rem;
  }
`;

const ContentWrapper = styled.div`
  position: relative;
  z-index: 1;
`;

const ProjectHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  gap: ${({ theme }) => theme.spacing.sm};
`;

const ProjectTitle = styled.h3`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: 2.5rem;
  font-weight: 300;
  color: ${({ theme }) => theme.colors.text};
  letter-spacing: 0.02em;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};

  @media (max-width: 768px) {
    font-size: 1.8rem;
  }
`;

const ExternalIcon = styled(motion.span)`
  font-size: 1.8rem;
  color: ${({ theme }) => theme.colors.primary};
  opacity: 0;
  transform: translateX(-10px);
  display: inline-flex;
  align-items: center;
  justify-content: center;

  svg {
    stroke-width: 2.5px;
  }

  ${ProjectCard}:hover & {
    opacity: 1;
    transform: translateX(0);
  }

  @media (max-width: 768px) {
    opacity: 1;
    transform: translateX(0);
  }
`;

const CategoryBadge = styled.span`
  display: inline-block;
  padding: 8px 16px;
  border-radius: 20px;
  font-family: ${({ theme }) => theme.fonts.main};
  font-size: 0.85rem;
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

  ${ProjectCard}:hover & {
    box-shadow: 0 0 30px rgba(200, 159, 129, 0.25);
    border-color: rgba(200, 159, 129, 0.4);
  }
`;

const ArrowButton = styled(motion.button)`
  position: absolute;
  bottom: 10px;
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
  z-index: 10;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(25, 35, 30, 0.9);
    border-color: rgba(200, 159, 129, 0.5);
    box-shadow: 0 0 20px rgba(200, 159, 129, 0.2);
  }

  svg {
    font-size: 1.5rem;
  }

  @media (max-width: 768px) {
    width: 44px;
    height: 44px;
    
    svg {
      font-size: 1.2rem;
    }
  }
`;

const PrevButton = styled(ArrowButton)`
  left: 20px;
`;

const NextButton = styled(ArrowButton)`
  right: 20px;
`;

const ProgressContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-top: ${({ theme }) => theme.spacing.xl};
`;

const ProgressDot = styled(motion.button) <{ $active: boolean }>`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  background: ${({ $active, theme }) =>
    $active
      ? theme.colors.primary
      : 'rgba(200, 159, 129, 0.2)'};
  transition: all 0.3s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.primary};
    transform: scale(1.2);
  }
`;

export default function PortfolioSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const paginate = useCallback((newDirection: number) => {
    setDirection(newDirection);
    setActiveIndex((prevIndex) => {
      const nextIndex = prevIndex + newDirection;
      // Loop around
      if (nextIndex < 0) return projects.length - 1;
      if (nextIndex >= projects.length) return 0;
      return nextIndex;
    });
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        paginate(-1);
      } else if (e.key === 'ArrowRight') {
        paginate(1);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [paginate]);

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.8,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.8,
    }),
  };

  const currentProject = projects[activeIndex];
  const indexStr = String(activeIndex + 1).padStart(2, '0');

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

        <CarouselContainer>
          <PrevButton
            onClick={() => paginate(-1)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <FiChevronLeft />
          </PrevButton>

          <AnimatePresence initial={false} custom={direction} mode="wait">
            <CardWrapper
              key={activeIndex}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
                scale: { duration: 0.2 },
              }}
            >
              <ProjectCard
                href={currentProject.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <IndexNumber>{indexStr}</IndexNumber>
                <ContentWrapper>
                  <ProjectHeader>
                    <ProjectTitle>
                      {currentProject.title}
                      <ExternalIcon
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                      >
                        <FiArrowUpRight />
                      </ExternalIcon>
                    </ProjectTitle>
                    <CategoryBadge>{currentProject.category}</CategoryBadge>
                  </ProjectHeader>
                </ContentWrapper>
              </ProjectCard>
            </CardWrapper>
          </AnimatePresence>

          <NextButton
            onClick={() => paginate(1)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <FiChevronRight />
          </NextButton>
        </CarouselContainer>

        <ProgressContainer>
          {projects.map((_, index) => (
            <ProgressDot
              key={index}
              $active={index === activeIndex}
              onClick={() => {
                setDirection(index > activeIndex ? 1 : -1);
                setActiveIndex(index);
              }}
              whileHover={{ scale: 1.2 }}
            />
          ))}
        </ProgressContainer>
      </Container>
    </PortfolioWrapper>
  );
}
