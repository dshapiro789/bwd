'use client';

import styled from 'styled-components';
import { Container } from './Container';
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import Link from 'next/link';

const HeaderWrapper = styled(motion.header) < { $hidden: boolean }>`
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
  position: relative;
  z-index: 1002;
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
  position: relative;
  z-index: 1002;
  cursor: pointer;

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    display: none;
  }
`;

const MobileMenuOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.95);
  backdrop-filter: blur(10px);
  z-index: 1001;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.xl};
`;

const MobileNavLink = styled(motion.a)`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: 2rem;
  font-weight: 300;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.primary};
  opacity: 0.9;
  cursor: pointer;

  &:hover {
    opacity: 1;
  }
`;

export default function Header() {
  const [hidden, setHidden] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() || 0;
    if (latest > previous && latest > 150) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  });

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleMobileNavClick = (href: string) => {
    setMobileMenuOpen(false);
    // Smooth scroll to section
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
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
            <MobileMenuButton
              aria-label="Menu"
              onClick={toggleMobileMenu}
            >
              {mobileMenuOpen ? '✕' : '☰'}
            </MobileMenuButton>
          </Nav>
        </Container>
      </HeaderWrapper>

      <AnimatePresence>
        {mobileMenuOpen && (
          <MobileMenuOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setMobileMenuOpen(false)}
          >
            <MobileNavLink
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              onClick={(e) => {
                e.stopPropagation();
                handleMobileNavClick('#portfolio');
              }}
            >
              Work
            </MobileNavLink>
            <MobileNavLink
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              onClick={(e) => {
                e.stopPropagation();
                handleMobileNavClick('#services');
              }}
            >
              Services
            </MobileNavLink>
            <MobileNavLink
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              onClick={(e) => {
                e.stopPropagation();
                handleMobileNavClick('#about');
              }}
            >
              Studio
            </MobileNavLink>
            <MobileNavLink
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              onClick={(e) => {
                e.stopPropagation();
                handleMobileNavClick('#contact');
              }}
            >
              Contact
            </MobileNavLink>
          </MobileMenuOverlay>
        )}
      </AnimatePresence>
    </>
  );
}
