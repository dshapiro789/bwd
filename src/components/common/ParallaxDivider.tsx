'use client';

import styled from 'styled-components';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

interface ParallaxDividerProps {
    image: string;
    height?: string;
}

const DividerWrapper = styled.div<{ $height: string }>`
  height: ${({ $height }) => $height};
  width: 100%;
  position: relative;
  overflow: hidden;
  background: ${({ theme }) => theme.colors.background};
`;

const ParallaxImage = styled(motion.div)`
  position: absolute;
  top: -20%;
  left: 0;
  right: 0;
  bottom: -20%;
  background-size: cover;
  background-position: center;
  opacity: 0.6;
`;

export default function ParallaxDivider({ image, height = '300px' }: ParallaxDividerProps) {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"]
    });

    const y = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

    return (
        <DividerWrapper ref={ref} $height={height}>
            <ParallaxImage
                style={{ backgroundImage: `url(${image})`, y }}
            />
        </DividerWrapper>
    );
}
