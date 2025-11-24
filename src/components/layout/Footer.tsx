'use client';

import styled from 'styled-components';
import { Container } from './Container';
import { SiBitcoin, SiMonero, SiLitecoin, SiVenmo } from 'react-icons/si';

const FooterWrapper = styled.footer`
  background-color: ${({ theme }) => theme.colors.secondary};
  color: ${({ theme }) => theme.colors.background};
  padding: ${({ theme }) => theme.spacing.xxl} 0;
`;

const FooterContent = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${({ theme }) => theme.spacing.xl};

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const FooterColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const FooterTitle = styled.h3`
  color: ${({ theme }) => theme.colors.gold};
  font-size: 1.2rem;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const FooterLink = styled.a`
  color: rgba(255, 255, 255, 0.8);
  transition: color 0.3s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.gold};
  }
`;

const PaymentIcons = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.sm};
  font-size: 1.8rem; // Increased base size
  color: rgba(255, 255, 255, 0.6);
  align-items: center; // Ensure vertical alignment
`;

const Copyright = styled.div`
  margin-top: ${({ theme }) => theme.spacing.xxl};
  text-align: center;
  color: rgba(255, 255, 255, 0.4);
  font-size: 0.9rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: ${({ theme }) => theme.spacing.lg};
`;

export default function Footer() {
  return (
    <FooterWrapper>
      <Container>
        <FooterContent>
          <FooterColumn>
            <FooterTitle>Bonsai Web Design</FooterTitle>
            <p style={{ color: 'rgba(255,255,255,0.8)' }}>
              Crafting timeless design and meaningful content for modern brands.
            </p>
          </FooterColumn>
          <FooterColumn>
            <FooterTitle>Contact</FooterTitle>
            <FooterLink href="mailto:contact@bonsaiwebdesign.com">
              contact@bonsaiwebdesign.com
            </FooterLink>
          </FooterColumn>
          <FooterColumn>
            <FooterTitle>Social</FooterTitle>
            <FooterLink href="#">Instagram</FooterLink>
            <FooterLink href="#">LinkedIn</FooterLink>
            <FooterLink href="#">Twitter</FooterLink>
          </FooterColumn>
          <FooterColumn>
            <FooterTitle>Accepted Payments</FooterTitle>
            <PaymentIcons>
              <SiBitcoin title="Bitcoin" />
              <SiMonero title="Monero" />
              <SiLitecoin title="Litecoin" />
              <SiVenmo title="Venmo" style={{ fontSize: '2rem' }} /> {/* Slightly larger for visibility */}
            </PaymentIcons>
          </FooterColumn>
        </FooterContent>
        <Copyright>
          &copy; {new Date().getFullYear()} Bonsai Web Design. All rights reserved.
        </Copyright>
      </Container>
    </FooterWrapper>
  );
}
