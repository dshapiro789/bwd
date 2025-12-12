'use client';

import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useEffect, useRef } from 'react';
import styled from 'styled-components';

const CursorOuter = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid ${({ theme }) => theme.colors.primary};
  pointer-events: none;
  z-index: 9998;
  mix-blend-mode: difference;
  
  @media (max-width: 768px) {
    display: none;
  }
  
  @media (pointer: coarse) {
    display: none;
  }
`;

const CursorInner = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.gold};
  pointer-events: none;
  z-index: 9999;
  box-shadow: 0 0 20px ${({ theme }) => theme.colors.primary};
  
  @media (max-width: 768px) {
    display: none;
  }
  
  @media (pointer: coarse) {
    display: none;
  }
`;

export default function CursorGlow() {
  const isMountedRef = useRef(false);

  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  const scale = useMotionValue(1);

  const springConfig = { damping: 25, stiffness: 200, mass: 0.5 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);
  const scaleSpring = useSpring(scale, { damping: 20, stiffness: 300 });

  const innerSpringConfig = { damping: 30, stiffness: 400, mass: 0.1 };
  const innerX = useSpring(cursorX, innerSpringConfig);
  const innerY = useSpring(cursorY, innerSpringConfig);

  useEffect(() => {
    isMountedRef.current = true;

    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX - 20);
      cursorY.set(e.clientY - 20);

      // Check if hovering over clickable element
      const target = e.target as HTMLElement;
      const isClickable = target.closest('button, a, input, textarea, select, [role="button"], [onclick]');

      if (isClickable) {
        scale.set(1.25);
      } else {
        scale.set(1);
      }
    };

    window.addEventListener('mousemove', moveCursor);
    return () => window.removeEventListener('mousemove', moveCursor);
  }, [cursorX, cursorY, scale]);

  // Return null during SSR - the component will render properly after hydration
  if (typeof window === 'undefined') return null;

  return (
    <>
      <CursorOuter
        style={{
          translateX: cursorXSpring,
          translateY: cursorYSpring,
          scale: scaleSpring,
        }}
      />
      <CursorInner
        style={{
          translateX: innerX,
          translateY: innerY,
          scale: scaleSpring,
        }}
      />
    </>
  );
}
