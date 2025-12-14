'use client';

import styled from 'styled-components';
import { Section, Container } from '../layout/Container';
import { motion } from 'framer-motion';
import { FaTools, FaLaptopCode, FaLayerGroup } from 'react-icons/fa';
import GradientText from '../common/GradientText';
import { useRef } from 'react';
import { useScroll, useTransform } from 'framer-motion';

const PricingWrapper = styled(Section)`
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
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
  position: relative;
  z-index: 2;
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

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${({ theme }) => theme.spacing.xl};
  position: relative;
  z-index: 2;

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: repeat(3, 1fr);
    gap: ${({ theme }) => theme.spacing.lg};
  }
`;

const CardWrapper = styled(motion.div)`
  perspective: 1000px;
`;

const PricingCard = styled(motion.div)`
  background: rgba(20, 30, 25, 0.6);
  padding: ${({ theme }) => theme.spacing.xl};
  border-radius: 16px;
  border: 1px solid rgba(200, 159, 129, 0.1);
  backdrop-filter: blur(12px);
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
  position: relative;
  overflow: hidden;
  height: 100%;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  align-items: center;
  text-align: center;

  /* Elegant Gold Glow on Hover */
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 16px;
    padding: 1px;
    background: linear-gradient(
      135deg,
      rgba(200, 159, 129, 0.4),
      transparent 50%,
      rgba(200, 159, 129, 0.4)
    );
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    opacity: 0.5;
    transition: opacity 0.4s ease;
  }

  &:hover {
    transform: translateY(-5px);
    background: rgba(25, 35, 30, 0.8);
    box-shadow: 
      0 10px 30px rgba(0, 0, 0, 0.2),
      0 0 20px rgba(200, 159, 129, 0.1);
    border-color: rgba(200, 159, 129, 0.3);
  }

  &:hover::before {
    opacity: 1;
  }
`;

const IconWrapper = styled.div`
  font-size: 2.5rem;
  color: ${({ theme }) => theme.colors.primary};
  opacity: 0.9;
  filter: drop-shadow(0 0 10px rgba(200, 159, 129, 0.3));
  transition: transform 0.3s ease;
  margin-bottom: ${({ theme }) => theme.spacing.sm};

  ${PricingCard}:hover & {
    transform: scale(1.05) translateY(-2px);
    filter: drop-shadow(0 0 15px rgba(200, 159, 129, 0.5));
  }
`;

const Price = styled.div`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: 2.5rem;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const PriceLabel = styled.div`
  font-family: ${({ theme }) => theme.fonts.main};
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const Divider = styled.div`
  width: 40px;
  height: 1px;
  background: ${({ theme }) => theme.colors.primary};
  opacity: 0.3;
  margin: ${({ theme }) => theme.spacing.sm} auto;
`;

const FeatureList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const FeatureItem = styled.li`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 0.95rem;
  line-height: 1.5;
`;

function ScrollRevealCard({ children, index }: { children: React.ReactNode; index: number }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  // Staggered entry
  const yOffset = 50 + (index * 20);

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [yOffset, 0, 0, -yOffset]);

  return (
    <CardWrapper
      ref={ref}
      style={{ opacity, y }}
    >
      {children}
    </CardWrapper>
  );
}

interface PricingOption {
  id: number;
  title: string;
  price: string;
  description: string;
  icon: React.ReactNode;
  features: string[];
  pricePrefix?: string;
}

const pricingOptions: PricingOption[] = [
  {
    id: 1,
    title: 'Maintenance',
    price: '$40',
    description: '/ hour',
    icon: <FaTools />,
    features: [
      'Website Updates',
      'Content Refresh',
      'Technical Support',
      'Performance Checks'
    ]
  },
  {
    id: 2,
    title: 'Custom Website',
    price: '$500+',
    pricePrefix: 'Starting at',
    description: '/ page',
    icon: <FaLaptopCode />,
    features: [
      'Up To 5 Sections Per Page',
      'Custom Contact Form',
      'Styled Components',
      'Mobile Responsive',
      'Brand Integration',
      'Domain Integration',
      'GitHub Integration',
      'Vercel Deployment'
    ]
  },
  {
    id: 3,
    title: 'Custom Add-ons',
    price: '$250+',
    pricePrefix: 'Starting at',
    description: 'Per Custom Feature',
    icon: <FaLayerGroup />,
    features: [
      'Custom Content Integration',
      'Custom Layouts',
      'Advanced Features',
      'Custom Components',
      'Database Integration',
      'Custom API Endpoints',
      'Custom Authentication',
      'Custom Deployment',
      'AI Integration',
      'Website Analytics',
      'Custom Email Integration'
    ]
  },
];

export default function PricingSection() {
  return (
    <PricingWrapper id="pricing">
      <Container>
        <Header>
          <Title
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <GradientText>Investment</GradientText>
          </Title>
        </Header>

        <Grid>
          {pricingOptions.map((option, index) => (
            <ScrollRevealCard key={option.id} index={index}>
              <PricingCard>
                <IconWrapper>{option.icon}</IconWrapper>
                <div>
                  {option.pricePrefix && (
                    <div style={{ fontSize: '0.85rem', color: '#9CA59E', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      {option.pricePrefix}
                    </div>
                  )}
                  <Price>{option.price}</Price>
                  <PriceLabel>{option.title}</PriceLabel>
                  <div style={{ fontSize: '0.8rem', opacity: 0.7, marginTop: '4px' }}>{option.description}</div>
                </div>
                <Divider />
                <FeatureList>
                  {option.features.map((feature, i) => (
                    <FeatureItem key={i}>{feature}</FeatureItem>
                  ))}
                </FeatureList>
              </PricingCard>
            </ScrollRevealCard>
          ))}
        </Grid>
      </Container>
    </PricingWrapper>
  );
}
