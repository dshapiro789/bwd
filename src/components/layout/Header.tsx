'use client';

import styled from 'styled-components';
import { Container } from './Container';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { useState } from 'react';
import Link from 'next/link';

const HeaderWrapper = styled(motion.header) <{ $hidden: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  padding: ${({ theme }) => theme.spacing.lg} 0;
  transform: translateY(${({ $hidden }) => ($hidden ? '-100%' : '0')});
  transition: transform 0.3s ease-in-out;
  mix-blend-mode: difference;
  color: white;
`;

const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled(Link)`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: 1.5rem;
  font-weight: 400;
  letter-spacing: 0.05em;
  color: white;
  text-transform: uppercase;
`;

const NavLinks = styled.div`
  display: none;
  gap: ${({ theme }) => theme.spacing.xl};

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    display: flex;
  }
`;

const NavLink = styled(Link)`
  font-family: ${({ theme }) => theme.fonts.main};
  font-size: 0.9rem;
  font-weight: 300;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: white;
  position: relative;
  opacity: 0.8;
  transition: opacity 0.3s ease;

  &:hover {
    opacity: 1;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -4px;
    left: 50%;
    width: 0;
    height: 1px;
    background-color: white;
    transition: all 0.3s ease;
    transform: translateX(-50%);
  }

  &:hover::after {
    width: 100%;
  }
`;

const MobileMenuButton = styled.button`
  display: block;
  color: white;
  font-size: 1.5rem;
  background: none;

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    display: none;
  }
`;

export default function Header() {
  const [hidden, setHidden] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() || 0;
    if (latest > previous && latest > 150) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  });

  return (
    <HeaderWrapper $hidden={hidden}>
      <Container>
        <Nav>
          <Logo href="/">Bonsai</Logo>
          <NavLinks>
            <NavLink href="#portfolio">Work</NavLink>
            <NavLink href="#services">Services</NavLink>
            <NavLink href="#about">Studio</NavLink>
            <NavLink href="#contact">Contact</NavLink>
          </NavLinks>
          <MobileMenuButton aria-label="Menu">
            ☰
          </MobileMenuButton>
        </Nav>
      </Container>
    </HeaderWrapper>
  );
}
