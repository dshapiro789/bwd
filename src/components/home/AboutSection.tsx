'use client';

import styled from 'styled-components';
import { Section, Container } from '../layout/Container';
import { motion, useScroll, useTransform, useMotionTemplate } from 'framer-motion';
import { useRef } from 'react';
import Image from 'next/image';
import GradientText from '../common/GradientText';
import AnimatedCounter from '../common/AnimatedCounter';

const AboutWrapper = styled(Section)`
  background: linear-gradient(
    180deg,
    rgba(16, 32, 24, 0.3) 0%,
    rgba(20, 40, 30, 0.2) 50%,
    rgba(16, 32, 24, 0.3) 100%
  );
  padding-top: ${({ theme }) => theme.spacing.xxxl};
  padding-bottom: ${({ theme }) => theme.spacing.xxxl};
  overflow: hidden;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.xxl};
`;

const Title = styled(motion.h2)`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: 3.5rem;
  font-weight: 300;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  letter-spacing: 0.05em;
  text-shadow: 0 2px 12px rgba(200, 159, 129, 0.2);
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const ContentGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${({ theme }) => theme.spacing.xxl};
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: 1fr 1.5fr;
    gap: ${({ theme }) => theme.spacing.xxxl};
  }
`;

const PhotoContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

const PhotoFrame = styled(motion.div)`
  position: relative;
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
  aspect-ratio: 1;
  border-radius: 20px;
  overflow: hidden;
  background: rgba(20, 30, 25, 0.6);
  backdrop-filter: blur(12px);
  border: 2px solid rgba(200, 159, 129, 0.2);
  box-shadow: 
    0 20px 40px rgba(0, 0, 0, 0.3),
    0 0 30px rgba(200, 159, 129, 0.1);
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 20px;
    padding: 2px;
    background: linear-gradient(
      135deg,
      rgba(200, 159, 129, 0.5),
      transparent 50%,
      rgba(200, 159, 129, 0.5)
    );
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    opacity: 0.6;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const NameLabel = styled(motion.div)`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: 1.8rem;
  font-weight: 300;
  text-align: center;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.primary},
    ${({ theme }) => theme.colors.accent}
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 50%;
    transform: translateX(-50%);
    width: 60px;
    height: 1px;
    background: linear-gradient(
      90deg,
      transparent,
      ${({ theme }) => theme.colors.primary},
      transparent
    );
  }

  @media (max-width: 768px) {
    font-size: 1.4rem;
    letter-spacing: 0.1em;
  }
`;

const RoleLabel = styled(motion.div)`
  font-family: ${({ theme }) => theme.fonts.main};
  font-size: 1rem;
  font-weight: 400;
  text-align: center;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textSecondary};
  opacity: 0.7;

  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
`;

const BioContent = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const IntroText = styled.p`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: 1.3rem;
  line-height: 1.9;
  color: ${({ theme }) => theme.colors.text};
  font-weight: 300;
  letter-spacing: 0.02em;
  background: rgba(20, 30, 25, 0.3);
  padding: ${({ theme }) => theme.spacing.lg};
  border-radius: 12px;
  border: 1px solid rgba(200, 159, 129, 0.1);
  backdrop-filter: blur(8px);
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 3px;
    background: linear-gradient(
      180deg,
      ${({ theme }) => theme.colors.primary},
      ${({ theme }) => theme.colors.accent}
    );
    border-radius: 12px 0 0 12px;
  }

  &::first-line {
    font-weight: 400;
    letter-spacing: 0.03em;
  }

  @media (max-width: 768px) {
    font-size: 1.15rem;
    line-height: 1.8;
    padding: ${({ theme }) => theme.spacing.md};
  }
`;

const PhilosophyText = styled.p`
  font-size: 1.15rem;
  line-height: 1.7;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-weight: 300;
  font-style: italic;
  padding-left: ${({ theme }) => theme.spacing.md};
  border-left: 2px solid ${({ theme }) => theme.colors.primary};
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${({ theme }) => theme.spacing.lg};
  margin-top: ${({ theme }) => theme.spacing.lg};
`;

const StatCard = styled(motion.div)`
  background: rgba(20, 30, 25, 0.4);
  padding: ${({ theme }) => theme.spacing.lg};
  border-radius: 12px;
  border: 1px solid rgba(200, 159, 129, 0.1);
  backdrop-filter: blur(8px);
  text-align: center;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(25, 35, 30, 0.6);
    border-color: rgba(200, 159, 129, 0.3);
    transform: translateY(-2px);
  }
`;

const StatNumber = styled.div`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: 2.5rem;
  font-weight: 300;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const StatLabel = styled.div`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

export default function AboutSection() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.25, 0.75, 1], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.25, 0.75, 1], [50, 0, 0, 50]);
  const blur = useTransform(scrollYProgress, [0, 0.25, 0.75, 1], [10, 0, 0, 10]);
  const filter = useMotionTemplate`blur(${blur}px)`;

  return (
    <AboutWrapper id="about" ref={ref}>
      <Container>
        <Header>
          <Title
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <GradientText>About</GradientText>
          </Title>
        </Header>

        <ContentGrid
          style={{ opacity, y, filter }}
        >
          <PhotoContainer>
            <PhotoFrame
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Image
                src="/images/headshot.jpg"
                alt="Professional headshot"
                width={400}
                height={400}
                priority
              />
            </PhotoFrame>
            <NameLabel
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              David Aaron Shapiro
            </NameLabel>
            <RoleLabel
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 0.7 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              Bonsai Web Designer
            </RoleLabel>
          </PhotoContainer>

          <BioContent
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <IntroText>
              With a decade of experience building for the web and a Software Engineering degree from Western Governors University, I've dedicated my career to transforming ideas into refined digital realities.
            </IntroText>

            <PhilosophyText>
              "I don't just build websites—I craft digital experiences that resonate, engage, and endure."
            </PhilosophyText>

            <StatsGrid>
              <StatCard
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <StatNumber>
                  <AnimatedCounter to={10} suffix="+" />
                </StatNumber>
                <StatLabel>Years Experience</StatLabel>
              </StatCard>
              <StatCard
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <StatNumber>WGU</StatNumber>
                <StatLabel>BS Software Engineering</StatLabel>
              </StatCard>
            </StatsGrid>
          </BioContent>
        </ContentGrid>
      </Container>
    </AboutWrapper>
  );
}
