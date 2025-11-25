'use client';

import styled from 'styled-components';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Container } from '../layout/Container';
import { useRef } from 'react';
import GradientText from '../common/GradientText';

const HeroWrapper = styled.section`
  height: 100vh;
  width: 100%;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.background};
`;

const BackgroundImage = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  /* Elegant Multi-layered Gradient */
  background: 
    /* Subtle vignette with deep green */
    radial-gradient(ellipse at center, transparent 0%, rgba(16, 32, 24, 0.5) 100%),
    /* Primary gold accent - top left */
    radial-gradient(circle at 15% 20%, rgba(200, 159, 129, 0.15) 0%, transparent 40%),
    /* Secondary emerald accent - bottom right */
    radial-gradient(circle at 85% 80%, rgba(93, 117, 102, 0.18) 0%, transparent 40%),
    /* Tertiary gold accent - center right */
    radial-gradient(circle at 90% 40%, rgba(200, 159, 129, 0.08) 0%, transparent 35%),
    /* Ambient depth - subtle overall glow */
    radial-gradient(ellipse at 50% 50%, rgba(93, 117, 102, 0.06) 0%, transparent 60%),
    /* Base gradient for depth with deep greens */
    linear-gradient(180deg, rgba(20, 40, 30, 0.6) 0%, transparent 50%, rgba(16, 32, 24, 0.8) 100%);
  z-index: 1;
`;

const Content = styled(Container)`
  position: relative;
  z-index: 2;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const PreTitle = styled(motion.span)`
  font-family: ${({ theme }) => theme.fonts.main};
  font-size: 0.9rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.gold};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  display: block;
`;

const Tagline = styled(motion.h1)`
  font-size: 3.5rem;
  line-height: 1.1;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  max-width: 900px;
  font-weight: 400;

  span {
    color: ${({ theme }) => theme.colors.gold};
    font-style: italic;
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    font-size: 5rem;
  }
`;

const SubText = styled(motion.p)`
  font-size: 1.1rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing.xxl};
  max-width: 500px;
  line-height: 1.8;
  font-weight: 300;
`;

const ScrollIndicator = styled(motion.div)`
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  opacity: 0.5;
`;

const Line = styled.div`
  width: 1px;
  height: 60px;
  background: ${({ theme }) => theme.colors.textSecondary};
`;

export default function HeroSection() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <HeroWrapper ref={ref}>
      <BackgroundImage style={{ y, opacity }} />

      <Content>
        <PreTitle
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Est. 2024
        </PreTitle>

        <Tagline
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
        >
          <GradientText>Crafting <span>timeless</span> digital legacies.</GradientText>
        </Tagline>

        <SubText
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
        >
          We craft tailored web experiences for brands that refuse to compromise on elegance.
        </SubText>
      </Content>

      <ScrollIndicator
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ delay: 1, duration: 1 }}
      >
        <span style={{ fontSize: '0.8rem', letterSpacing: '0.1em' }}>SCROLL</span>
        <Line />
      </ScrollIndicator>
    </HeroWrapper>
  );
}
