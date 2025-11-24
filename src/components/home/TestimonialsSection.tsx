'use client';

import styled from 'styled-components';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Section, Container } from '../layout/Container';

const testimonials = [
  {
    id: 1,
    name: 'Nick Jabbour',
    role: 'Founder, RxChat.com',
    content:
      "Not a day goes by where I don't feel grateful to be working with David. He is not only thorough and skilled, but takes pride in his work and applies himself consistently to the challenges at hand. As an individual, he demonstrates kindness and integrity — and these qualities spill into his professional life as well. For lack of a better term, David is truly a ‘gem’ to know and work with.",
    rating: 5,
  },
  {
    id: 2,
    name: 'Tony',
    role: 'Founder, Palm Breeze Real Estate',
    content:
      'David elevated our online presence with clean, human-centered design across our website, blog and weekly newsletter. The results were both positive and impactful.',
    rating: 5,
  },
  {
    id: 3,
    name: 'Cherie Woodworth',
    role: 'Manager, Weatherford Ranches',
    content:
      'Seamless communication and a thoughtful approach to content. Couldn’t have asked for a better partner!',
    rating: 5,
  },
];

const TestimonialsWrapper = styled(Section)`
  background-color: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  text-align: center;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
`;

const CarouselContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  position: relative;
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 768px) {
    height: 600px;
  }
`;

const TestimonialCard = styled(motion.div)`
  position: absolute;
  width: 100%;
  padding: ${({ theme }) => theme.spacing.xl};

  @media (max-width: 768px) {
    padding: ${({ theme }) => theme.spacing.md};
  }
`;

const Quote = styled.p`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: 1.8rem;
  line-height: 1.6;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  font-style: italic;
  color: ${({ theme }) => theme.colors.text};
  font-weight: 300;

  @media (max-width: 768px) {
    font-size: 1.25rem;
  }
`;

const Author = styled.div`
  margin-top: ${({ theme }) => theme.spacing.md};
`;

const Name = styled.h4`
  color: ${({ theme }) => theme.colors.gold};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const Role = styled.p`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.1em;
`;

const Stars = styled.div`
  color: ${({ theme }) => theme.colors.gold};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  font-size: 1.2rem;
`;

const Controls = styled.div`
  display: flex;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.lg};
`;

const Dot = styled.button<{ $active: boolean }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: ${({ $active, theme }) =>
    $active ? theme.colors.gold : 'rgba(255, 255, 255, 0.2)'};
  transition: background-color 0.3s ease;
`;

export default function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <TestimonialsWrapper>
      <Container>
        <h2 style={{ color: '#C1A240', marginBottom: '2rem' }}>Client Stories</h2>
        <CarouselContainer>
          <AnimatePresence mode="wait">
            <TestimonialCard
              key={currentIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
            >
              <Stars>{'★'.repeat(testimonials[currentIndex].rating)}</Stars>
              <Quote>"{testimonials[currentIndex].content}"</Quote>
              <Author>
                <Name>{testimonials[currentIndex].name}</Name>
                <Role>{testimonials[currentIndex].role}</Role>
              </Author>
            </TestimonialCard>
          </AnimatePresence>
        </CarouselContainer>
        <Controls>
          {testimonials.map((_, index) => (
            <Dot
              key={index}
              $active={index === currentIndex}
              onClick={() => setCurrentIndex(index)}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </Controls>
      </Container>
    </TestimonialsWrapper>
  );
}
