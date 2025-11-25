'use client';

import styled from 'styled-components';
import { Section, Container } from '../layout/Container';
import { motion } from 'framer-motion';
import { SiReact, SiFigma, SiShopify, SiNextdotjs } from 'react-icons/si';
import GradientText from '../common/GradientText';

const ServicesWrapper = styled(Section)`
  background: linear-gradient(
    180deg,
    rgba(16, 32, 24, 0.3) 0%,
    rgba(20, 40, 30, 0.2) 50%,
    rgba(16, 32, 24, 0.3) 100%
  );
  padding-top: ${({ theme }) => theme.spacing.xxxl};
  padding-bottom: ${({ theme }) => theme.spacing.xxxl};
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.xxl};
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
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

const Subtitle = styled(motion.p)`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 1.1rem;
  line-height: 1.6;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${({ theme }) => theme.spacing.xl};

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const ServiceCard = styled(motion.div)`
  background: ${({ theme }) => theme.colors.surface};
  padding: ${({ theme }) => theme.spacing.xl};
  border: 1px solid rgba(255, 255, 255, 0.05);
  transition: border-color 0.3s ease, background-color 0.3s ease;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const IconWrapper = styled.div`
  font-size: 2.5rem;
  color: ${({ theme }) => theme.colors.primary};
  opacity: 0.8;
`;

const ServiceTitle = styled.h3`
  font-size: 1.5rem;
  color: ${({ theme }) => theme.colors.text};
  font-weight: 400;
`;

const ServiceDescription = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.6;
  font-size: 1rem;
`;

const services = [
  {
    id: 1,
    title: 'Experience Design',
    description: 'Intuitive interfaces designed to captivate and convert. We blend aesthetics with functionality to create seamless user journeys.',
    icon: <SiFigma />,
  },
  {
    id: 2,
    title: 'Technical Development',
    description: 'Robust, scalable architectures built with modern frameworks. Speed, security, and performance come as standard.',
    icon: <SiNextdotjs />,
  },
  {
    id: 3,
    title: 'Brand Identity',
    description: 'Crafting visual languages that tell your story. From logos to typography, we build systems that resonate with your audience.',
    icon: <SiReact />, // Using React icon as abstract symbol for "System"
  },
  {
    id: 4,
    title: 'E-Commerce',
    description: 'Seamless shopping experiences. From custom storefronts to secure payment integrations, we help you sell with style.',
    icon: <SiShopify />,
  },
];

export default function ServicesSection() {
  return (
    <ServicesWrapper id="services">
      <Container>
        <Header>
          <Title
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <GradientText>Refined Digital Solutions</GradientText>
          </Title>
          <Subtitle
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            We don't just build websites; we craft digital legacies.
          </Subtitle>
        </Header>

        <Grid>
          {services.map((service, index) => (
            <ServiceCard
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -5 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <IconWrapper>{service.icon}</IconWrapper>
              <ServiceTitle>{service.title}</ServiceTitle>
              <ServiceDescription>{service.description}</ServiceDescription>
            </ServiceCard>
          ))}
        </Grid>
      </Container>
    </ServicesWrapper>
  );
}
