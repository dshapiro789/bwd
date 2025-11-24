'use client';

import { useEffect } from 'react';
import styled from 'styled-components';
import { motion, useMotionValue, useSpring } from 'framer-motion';

const CursorWrapper = styled(motion.div)`
  pointer-events: none;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9999;
  
  @media (hover: none) and (pointer: coarse) {
    display: none;
  }
`;

const CursorBody = styled(motion.div)`
  border: 2px solid ${({ theme }) => theme.colors.primary}; // Bronze color
  background-color: transparent;
  border-radius: 50%;
  position: absolute;
  top: 0;
  left: 0;
  transform-origin: center center;
  box-sizing: border-box;
  width: 20px;
  height: 20px;
`;

export default function CustomCursor() {
    // Mouse Position
    const mouseX = useMotionValue(-100);
    const mouseY = useMotionValue(-100);

    // Smooth Physics for "Following"
    const springConfig = { damping: 25, stiffness: 150, mass: 0.5 };
    const cursorX = useSpring(mouseX, springConfig);
    const cursorY = useSpring(mouseY, springConfig);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);
        };

        window.addEventListener('mousemove', handleMouseMove);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, [mouseX, mouseY]);

    return (
        <CursorWrapper
            style={{
                x: cursorX,
                y: cursorY,
            }}
        >
            <CursorBody
                style={{
                    x: '-50%', // Center the cursor body on the coordinate
                    y: '-50%',
                }}
            />
        </CursorWrapper>
    );
}
