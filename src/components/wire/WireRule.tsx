'use client';

import { useSyncExternalStore } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';
import { useReducedMotionSafe } from '@/lib/useMediaQuery';

/*
 * Wire Rule: the divider between sections. A short lateral copper branch
 * sprouts in from the left edge, like a branch entering a scroll painting
 * from its frame, with a bud at its tip. It draws itself with a
 * CSS view timeline where supported, otherwise once with framer whileInView;
 * under reduced motion it is simply drawn. It sits on the section boundary
 * with zero height, so it adds no vertical space.
 */

const W = 168;
const H = 40;

const SPROUTS = [
  {
    main: 'M0 33C34 32 76 27 116 18c12-3 24-6 34-9',
    twig: 'M92 23c3-5 8-10 15-13',
    bud: 'M150 9c3-4 9-5 13-3c-3 4-9 5-13 3z',
  },
  {
    main: 'M0 28C30 32 62 31 92 24c20-5 36-11 52-15',
    twig: 'M50 30c5-4 9-9 11-15',
    bud: 'M144 9c3-4 9-6 13-4c-2 5-8 6-13 4z',
  },
  {
    main: 'M0 31c28-1 58-4 86-11c16-4 30-8 44-10',
    twig: 'M74 23c5 2 11 6 14 11',
    bud: 'M130 10c4-3 10-3 13 0c-4 3-10 3-13 0z',
  },
] as const;

const grow = keyframes`
  from { stroke-dashoffset: 1; }
  to { stroke-dashoffset: 0; }
`;

const budIn = keyframes`
  from { opacity: 0; transform: scale(0.4); }
  to { opacity: 1; transform: none; }
`;

const Band = styled.div`
  position: relative;
  z-index: 1;
  height: 0;
`;

const Svg = styled.svg`
  position: absolute;
  top: 0;
  left: 0;
  width: ${W}px;
  height: ${H}px;
  transform: translateY(-50%);
  overflow: visible;
  fill: none;
  stroke: ${({ theme }) => theme.colors.primary};
  stroke-width: 1;
  stroke-linecap: round;
  stroke-linejoin: round;
  view-timeline: --sprout block;

  .stem {
    opacity: 0.6;
  }

  .bud {
    stroke-width: 1.25;
  }

  .bud {
    fill: ${({ theme }) => theme.colors.background};
    transform-box: fill-box;
    transform-origin: 0 50%;
  }

  @supports (animation-timeline: view()) {
    @media (prefers-reduced-motion: no-preference) {
      .stem {
        stroke-dasharray: 1;
        animation: ${grow} linear both;
        animation-timeline: --sprout;
        animation-range: entry 20% cover 42%;
      }

      .twig {
        animation-range: cover 30% cover 46%;
      }

      .bud {
        animation: ${budIn} linear both;
        animation-timeline: --sprout;
        animation-range: cover 40% cover 50%;
      }
    }
  }
`;

const noSubscribe = () => () => {};
/** True where CSS scroll-driven animations are missing (false on the server). */
const useNeedsFallback = () =>
  useSyncExternalStore(
    noSubscribe,
    () => !CSS.supports('animation-timeline: view()'),
    () => false
  );

export default function WireRule({ variant = 0 }: { variant?: number }) {
  const sprout = SPROUTS[variant % SPROUTS.length];
  const reduce = useReducedMotionSafe();
  // Browsers without scroll-driven animations draw it once with framer
  const animate = useNeedsFallback() && !reduce;

  return (
    <Band aria-hidden="true">
      <Svg viewBox={`0 0 ${W} ${H}`} key={animate ? 'once' : 'css'}>
        {animate ? (
          <>
            <motion.path
              className="stem"
              d={sprout.main}
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true, margin: '0px 0px -20% 0px' }}
              transition={{ duration: 1.1, ease: [0.65, 0, 0.35, 1] }}
            />
            <motion.path
              className="stem"
              d={sprout.twig}
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true, margin: '0px 0px -20% 0px' }}
              transition={{ duration: 0.5, delay: 0.7, ease: [0.65, 0, 0.35, 1] }}
            />
            <motion.path
              className="bud"
              d={sprout.bud}
              initial={{ opacity: 0, scale: 0.4 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: '0px 0px -20% 0px' }}
              transition={{ duration: 0.4, delay: 1.05, ease: [0.16, 1, 0.3, 1] }}
            />
          </>
        ) : (
          <>
            <path className="stem" d={sprout.main} pathLength={1} />
            <path className="stem twig" d={sprout.twig} pathLength={1} />
            <path className="bud" d={sprout.bud} />
          </>
        )}
      </Svg>
    </Band>
  );
}
