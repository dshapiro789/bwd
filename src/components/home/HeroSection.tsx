'use client';

import { useEffect, useRef, useState } from 'react';
import styled, { css, keyframes } from 'styled-components';
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from 'framer-motion';
import { Container } from '../layout/Container';
import { useMediaQuery, useReducedMotionSafe } from '@/lib/useMediaQuery';
import { DUR, EASE_OUT, RISE } from '@/lib/motion';
import WireTree, { BEATS } from '../wire/WireTree';
import WireTail from '../wire/WireTail';

/*
 * Copper Wire hero. On a desktop window the section is a 150svh runway with a
 * sticky 100svh stage: scrolling prunes the tree's stray shoots, wires the
 * trunk and two limbs, sets those limbs, and draws the wire's tail out of the
 * pot and down toward the work. Elsewhere the hero scrolls normally (the same
 * story plays as the tree rises into view) and, under reduced motion, the
 * shaped tree is shown still. The layout switch is CSS only.
 */
const PIN = '(min-width: 1024px) and (min-height: 700px)';
const PINNED_CSS = `${PIN} and (prefers-reduced-motion: no-preference)`;
const WIDE = '(min-width: 1024px)';

const EASE = `cubic-bezier(${EASE_OUT.join(', ')})`;

/* Entrance: CSS keyframes, so it runs at first paint with no JS. The H1 only
   settles (transform), so it is visible from the first frame. */
const heroIn = keyframes`
  from { opacity: 0; transform: translateY(${RISE.item}px); }
  to { opacity: 1; transform: none; }
`;

const settle = keyframes`
  from { transform: translateY(0.18em); }
  to { transform: none; }
`;

const entrance = (delayMs: number) => css`
  @media (prefers-reduced-motion: no-preference) {
    animation: ${heroIn} ${DUR.hero}s ${EASE} ${delayMs}ms both;
  }
`;

const Runway = styled.section`
  position: relative;
  background-color: ${({ theme }) => theme.colors.background};

  @media ${PINNED_CSS} {
    height: 150svh;
  }
`;

const Stage = styled.div`
  position: relative;
  overflow: clip;

  @media ${WIDE} {
    height: 100vh;
    height: 100svh;
    min-height: 560px;
  }

  @media ${PINNED_CSS} {
    position: sticky;
    top: 0;
  }
`;

const Grid = styled(Container)`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xxl};
  padding-top: 112px;
  padding-bottom: 88px;

  @media ${WIDE} {
    display: grid;
    grid-template-columns: repeat(12, minmax(0, 1fr));
    column-gap: ${({ theme }) => theme.spacing.lg};
    align-items: center;
    height: 100%;
    padding-top: 88px;
    padding-bottom: ${({ theme }) => theme.spacing.lg};
  }
`;

const Copy = styled(motion.div)`
  position: relative;
  z-index: 1;

  @media ${WIDE} {
    grid-column: 1 / span 6;
    padding-bottom: 2vh;
  }
`;

const Eyebrow = styled.p`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px 12px;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  font-family: ${({ theme }) => theme.fonts.main};
  font-size: 0.72rem;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.primary};
  ${entrance(0)}

  @media (max-width: 767px) {
    font-size: 0.68rem;
    letter-spacing: 0.16em;
    gap: 6px 10px;
  }
`;

const MetaDot = styled.span`
  display: inline-block;
  flex-shrink: 0;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.primary};
`;

/* On phones the first dot goes and the eyebrow breaks into two clean lines */
const LeadDot = styled(MetaDot)`
  @media (max-width: 479px) {
    display: none;
  }
`;

const EyebrowRest = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 12px;

  @media (max-width: 767px) {
    gap: 10px;
  }

  @media (max-width: 479px) {
    flex-basis: 100%;
  }
`;

const VisuallyHidden = styled.span`
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
`;

const Headline = styled.h1`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: clamp(2.4rem, 10vw, 2.75rem);
  font-weight: 400;
  line-height: 1.06;
  letter-spacing: -0.01em;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.lg};

  @media (prefers-reduced-motion: no-preference) {
    animation: ${settle} ${DUR.hero}s ${EASE} both;
  }

  em {
    display: block;
    font-style: italic;
    color: ${({ theme }) => theme.colors.primary};
  }

  @media (min-width: 768px) {
    font-size: clamp(3rem, 6.2vw, 4.5rem);
  }

  @media ${WIDE} {
    font-size: clamp(2.9rem, 4.5vw, 4.5rem);
    line-height: 1.04;
  }
`;

const SubText = styled.p`
  max-width: 36ch;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  font-size: 1.1rem;
  font-weight: 300;
  line-height: 1.75;
  color: ${({ theme }) => theme.colors.textSecondary};
  ${entrance(100)}
`;

const focusRing = css`
  &:focus-visible {
    outline: 1px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 3px;
  }
`;

const CtaRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.xl};
  ${entrance(200)}

  @media (max-width: 767px) {
    column-gap: ${({ theme }) => theme.spacing.lg};
  }
`;

const PrimaryCta = styled.a`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 48px;
  padding: 0 ${({ theme }) => theme.spacing.xl};
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.background};
  font-family: ${({ theme }) => theme.fonts.main};
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  border-radius: 0;
  /* Override GlobalStyle's a { transition: all }; only the halo below fades */
  transition: none;

  @media (max-width: 767px) {
    padding: 0 ${({ theme }) => theme.spacing.lg};
  }

  /* Bronze hover halo (0.15), faded in on opacity rather than box-shadow */
  &::after {
    content: '';
    position: absolute;
    inset: -4px;
    border: 4px solid rgba(200, 159, 129, 0.15);
    opacity: 0;
    pointer-events: none;
    transition: opacity ${DUR.hover}s ${EASE};
  }

  &:hover::after {
    opacity: 1;
  }

  ${focusRing}
`;

const SecondaryCta = styled.a`
  display: inline-flex;
  align-items: center;
  min-height: 48px;
  font-family: ${({ theme }) => theme.fonts.main};
  font-size: 0.85rem;
  font-weight: 400;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.text};
  text-decoration: underline;
  text-decoration-color: ${({ theme }) => theme.colors.primary};
  text-decoration-thickness: 1px;
  text-underline-offset: 6px;
  transition: color ${DUR.hover}s ${EASE};

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }

  ${focusRing}
`;

const PriceLine = styled.p`
  margin: ${({ theme }) => theme.spacing.lg} 0 0;
  font-family: ${({ theme }) => theme.fonts.main};
  font-size: 0.85rem;
  font-weight: 400;
  letter-spacing: 0.02em;
  color: ${({ theme }) => theme.colors.textSecondary};
  ${entrance(300)}
`;

const PriceClause = styled.span`
  @media (max-width: 767px) {
    display: block;
  }
`;

const PriceSeparator = styled.span`
  color: ${({ theme }) => theme.colors.primary};

  /* On phones the two clauses stack, so the dot is not needed */
  @media (max-width: 767px) {
    display: none;
  }
`;

/* The tree column is a size container: the tree is 68svh tall on desktop
   but never wider than its six columns (600:720 art, so 120cqw tall). */
const TreeCol = styled.div`
  container-type: inline-size;
  display: flex;
  justify-content: center;
  padding-bottom: ${({ theme }) => theme.spacing.lg};
  --tree-h: min(120cqw, 480px, 70svh);

  /* Tablets: the tree steps to the right, a diagonal from the copy above */
  @media (min-width: 640px) and (max-width: 1023px) {
    justify-content: flex-end;
    padding-right: 4%;
  }

  @media ${WIDE} {
    grid-column: 7 / span 6;
    align-self: stretch;
    align-items: center;
    padding-bottom: 0;
    --tree-h: min(68svh, 120cqw);
  }
`;

export default function HeroSection() {
  const runwayRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const figureRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);

  const reduce = useReducedMotionSafe();
  const pinned = useMediaQuery(PIN) && !reduce;

  // Pinned runway: progress through the 150svh section, lightly smoothed so a
  // wheel notch reads as one stroke rather than a jump
  const { scrollYProgress: runway } = useScroll({ target: runwayRef, offset: ['start start', 'end end'] });
  const smooth = useSpring(runway, { stiffness: 120, damping: 30, restDelta: 0.0005 });

  // Unpinned: the hero scrolls away normally. The story plays while the tree
  // is fully in view: from when its pot clears the bottom of the screen to
  // when it has risen to the upper third.
  const { scrollYProgress: exit } = useScroll({ target: runwayRef, offset: ['start start', 'end start'] });
  const { scrollY } = useScroll();
  const [storyWindow, setStoryWindow] = useState<[number, number]>([80, 440]);
  const free = useTransform(scrollY, storyWindow, [0, 1]);

  // Reduced motion: the story is told; show the shaped tree, still
  const shaped = useMotionValue(1);
  const story: MotionValue<number> = reduce ? shaped : pinned ? smooth : free;
  const tail = useTransform(story, [...BEATS.tail], [0, 1]);

  useEffect(() => {
    if (pinned || reduce) return;
    const measure = () => {
      const fig = figureRef.current;
      if (!fig) return;
      const r = fig.getBoundingClientRect();
      const top = r.top + window.scrollY;
      const vh = window.innerHeight;
      // The specimen tag hangs about 4% of the tree height below the pot
      const start = Math.max(0, Math.round(top + r.height * 1.04 - vh));
      const end = Math.max(start + 240, Math.round(top + r.height * 0.5 - vh * 0.35));
      setStoryWindow((prev) => (prev[0] === start && prev[1] === end ? prev : [start, end]));
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (runwayRef.current) ro.observe(runwayRef.current);
    window.addEventListener('resize', measure);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [pinned, reduce]);

  // Copy: on the runway it stays put (the tree is what moves, and the CTAs
  // stay live throughout); unpinned it lifts away lightly with the page.
  const freeO = useTransform(exit, [0.28, 0.6], [1, 0]);
  const freeY = useTransform(exit, [0, 0.6], [0, -40]);
  const still = useMotionValue(0);
  const moving = !reduce && !pinned;
  const copyO = moving ? freeO : 1;
  const copyY = moving ? freeY : still;

  // A faded-out copy block leaves the tab order and the accessibility tree
  const setInert = (opacity: number) => {
    const el = copyRef.current;
    if (!el) return;
    const gone = opacity < 0.05;
    if (el.inert !== gone) el.inert = gone;
  };
  useMotionValueEvent(freeO, 'change', (v) => moving && setInert(v));
  useEffect(() => {
    setInert(moving ? freeO.get() : 1);
  }, [moving, freeO]);

  return (
    <Runway id="hero" ref={runwayRef}>
      <Stage ref={stageRef}>
        <Grid>
          <Copy ref={copyRef} style={{ opacity: copyO, y: copyY }}>
            <Eyebrow>
              <span>Bonsai Web Design</span>
              <LeadDot aria-hidden="true" />
              <VisuallyHidden>, </VisuallyHidden>
              <EyebrowRest>
                <span>A studio of two</span>
                <MetaDot aria-hidden="true" />
                <VisuallyHidden>, </VisuallyHidden>
                <span>Est. 2022</span>
              </EyebrowRest>
            </Eyebrow>

            <Headline>
              Timeless websites, <em>shaped by hand.</em>
            </Headline>

            <SubText>
              We&apos;re David and Jenna Shapiro. We design and build custom websites, then keep tending them for years.
            </SubText>

            <CtaRow>
              <PrimaryCta href="#contact">Start a project</PrimaryCta>
              <SecondaryCta href="#portfolio">See the work</SecondaryCta>
            </CtaRow>

            <PriceLine>
              <PriceClause>Custom sites from $1500 per page</PriceClause>{' '}
              <PriceSeparator>·</PriceSeparator>{' '}
              <PriceClause>Updates and care at $120/hr</PriceClause>
            </PriceLine>
          </Copy>

          <TreeCol>
            <WireTree ref={figureRef} progress={story} />
          </TreeCol>
        </Grid>

        <WireTail progress={tail} stageRef={stageRef} figureRef={figureRef} />
      </Stage>
    </Runway>
  );
}
