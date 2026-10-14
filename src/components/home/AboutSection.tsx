'use client';

import { useRef, useSyncExternalStore, type ReactNode } from 'react';
import Image from 'next/image';
import styled, { keyframes } from 'styled-components';
import {
  motion,
  useScroll,
  useTransform,
  type MotionStyle,
  type MotionValue,
} from 'framer-motion';
import { Section, Container } from '../layout/Container';
import GradientText from '../common/GradientText';
import { useMediaQuery, useReducedMotionSafe } from '@/lib/useMediaQuery';
import { DUR, EASE_OUT, RISE } from '@/lib/motion';
import { CaptionDot, PlateFrame, PlateNo, captionText } from '../plates/Plate';
import { SPLIT_QUERY } from '../plates/queries';

/*
 * About as "Plate II": a diptych of the two of them, matched 4:5 crops with
 * square corners and a bone hairline, captioned like art-book plates.
 *
 * Exposure & Drift (two columns, motion welcome): as the section scrolls
 * through, a background-coloured overlay on each portrait lifts from 0.7 to
 * 0, so the key light seems to come up as they step into frame; the two
 * columns drift at different rates (David 4vh to -4vh, Jenna 10vh to -6vh)
 * so Jenna's offset closes as you pass; each caption rises 8px and fades in
 * as it enters. Phones: stacked, the overlay only (a CSS view timeline per
 * portrait), no drift. Reduced motion: no overlay, no drift, captions shown.
 */

/*
 * Rendered widths. David: columns 2-6 (5 of 12) from 1024px, 1-6 on tablets,
 * 88% of the column on phones; his 824x1024 source is already 4:5. Jenna:
 * columns 8-11 from 1024px, 8-12 on tablets, 88% on phones; her square
 * source is cropped by height, so it draws 1.25x the frame's width.
 */
const DAVID_SIZES = '(min-width: 1024px) 40vw, (min-width: 768px) 48vw, 82vw';
const JENNA_SIZES = '(min-width: 1024px) 40vw, (min-width: 768px) 50vw, 102vw';

const noopSubscribe = () => () => {};
const useHydrated = () =>
  useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false
  );

const AboutWrapper = styled(Section)`
  background: linear-gradient(
    180deg,
    rgba(16, 32, 24, 0.3) 0%,
    rgba(20, 40, 30, 0.2) 50%,
    rgba(16, 32, 24, 0.3) 100%
  );
  padding-top: ${({ theme }) => theme.spacing.xxxl};
  padding-bottom: ${({ theme }) => theme.spacing.xxxl};
  overflow: clip;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.xxl};

  @media ${SPLIT_QUERY} {
    margin-bottom: 96px;
  }
`;

const Title = styled(motion.h2)`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: 3.5rem;
  font-weight: 400;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 0;
  letter-spacing: 0.05em;

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

/* ---------- Diptych ---------- */

const Diptych = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  row-gap: 96px;

  @media ${SPLIT_QUERY} {
    grid-template-columns: repeat(12, minmax(0, 1fr));
    column-gap: ${({ theme }) => theme.spacing.lg};
    align-items: start;
  }
`;

const Column = styled(motion.div)<{ $side: 'a' | 'b' }>`
  min-width: 0;

  /* Phones: a gentle stagger, David to the left and Jenna to the right */
  @media (max-width: 767px) {
    width: 88%;
    justify-self: ${({ $side }) => ($side === 'a' ? 'start' : 'end')};
  }

  @media ${SPLIT_QUERY} {
    grid-column: ${({ $side }) => ($side === 'a' ? '1 / 7' : '8 / 13')};
    /* Jenna hangs lower; the drift closes part of the gap as you pass */
    margin-top: ${({ $side }) => ($side === 'a' ? '0' : '12vh')};
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.desktop}) {
    grid-column: ${({ $side }) => ($side === 'a' ? '2 / 7' : '8 / 12')};
  }

  @media ${SPLIT_QUERY} and (prefers-reduced-motion: no-preference) {
    will-change: transform;
  }
`;

const Figure = styled.figure`
  margin: 0;
`;

const Portrait = styled(PlateFrame)`
  img {
    object-fit: cover;
    object-position: 50% 15%;
  }
`;

/*
 * One shared grade for both plates: a soft falloff into the page colour at
 * the edges. David's seamless is already black; on Jenna's brighter bokeh it
 * brings the corners down so the pair reads as one low-key light.
 */
const Grade = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: radial-gradient(
    ellipse 80% 72% at 50% 40%,
    transparent 52%,
    ${({ theme }) => `color-mix(in srgb, ${theme.colors.background} 62%, transparent)`} 100%
  );
`;

const keyLight = keyframes`
  from { opacity: 0.7; }
  to { opacity: 0; }
`;

/** The key light coming up: a background-coloured veil that lifts. */
const Veil = styled(motion.div)`
  position: absolute;
  inset: 0;
  background-color: ${({ theme }) => theme.colors.background};
  opacity: 0;
  pointer-events: none;

  /* Phones: each portrait lifts its own veil as it enters (no JS) */
  @media (max-width: 767px) and (prefers-reduced-motion: no-preference) {
    @supports (animation-timeline: view()) {
      animation: ${keyLight} linear both;
      animation-timeline: view();
      animation-range: entry 0% cover 40%;
    }
  }
`;

const Caption = styled(motion.figcaption)`
  ${captionText}
  margin: ${({ theme }) => theme.spacing.md} 0 0;
`;

const Bio = styled.div`
  margin-top: ${({ theme }) => theme.spacing.xl};
  max-width: 32rem;
`;

const BioText = styled.p`
  font-family: ${({ theme }) => theme.fonts.main};
  font-size: 1.0625rem;
  font-weight: 400;
  line-height: 1.75;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin: 0;
`;

const Credential = styled.p`
  display: flex;
  align-items: baseline;
  gap: ${({ theme }) => theme.spacing.md};
  margin: ${({ theme }) => theme.spacing.lg} 0 0;
  padding-top: ${({ theme }) => theme.spacing.md};
  border-top: 1px solid rgba(200, 159, 129, 0.15);
`;

const CredentialMark = styled.span`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: 1.5rem;
  font-weight: 400;
  line-height: 1;
  color: ${({ theme }) => theme.colors.primary};
`;

const CredentialLabel = styled.span`
  font-family: ${({ theme }) => theme.fonts.main};
  font-size: 0.75rem;
  letter-spacing: 0.14em;
  line-height: 1.5;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

interface PlateProps {
  captionRef: React.RefObject<HTMLElement | null>;
  no: string;
  name: string;
  role: string;
  src: string;
  sizes: string;
  veil?: MotionStyle;
  caption?: MotionStyle;
}

function PortraitPlate({ captionRef, no, name, role, src, sizes, veil, caption }: PlateProps) {
  return (
    <Figure>
      <Portrait>
        <Image src={src} alt={`${name}, ${role}`} fill sizes={sizes} />
        <Grade />
        <Veil style={veil} />
      </Portrait>
      <Caption ref={captionRef} style={caption}>
        <PlateNo>{no}</PlateNo> <CaptionDot>·</CaptionDot> {name}, {role}
      </Caption>
    </Figure>
  );
}

/** Each caption rises 8px and fades in as it comes into view. */
function useCaptionReveal(target: React.RefObject<HTMLElement | null>) {
  const { scrollYProgress } = useScroll({ target, offset: ['start 0.98', 'start 0.82'] });
  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [RISE.word, 0]);
  return { opacity, y };
}

function Member({
  side,
  drift,
  children,
}: {
  side: 'a' | 'b';
  drift?: MotionValue<string> | 0;
  children: ReactNode;
}) {
  return (
    <Column $side={side} style={drift === undefined ? undefined : { y: drift }}>
      {children}
    </Column>
  );
}

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const davidCaptionRef = useRef<HTMLElement>(null);
  const jennaCaptionRef = useRef<HTMLElement>(null);

  const hydrated = useHydrated();
  const split = useMediaQuery(SPLIT_QUERY);
  const reduce = useReducedMotionSafe();
  // Exposure & Drift runs in two columns with motion; phones get the CSS veil only
  const drifting = hydrated && split && !reduce;

  const { scrollYProgress: p } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] });
  const veilOpacity = useTransform(p, [0, 0.35], [0.7, 0]);
  const davidY = useTransform(p, [0, 1], ['4vh', '-4vh']);
  const jennaY = useTransform(p, [0, 1], ['10vh', '-6vh']);

  const davidCaption = useCaptionReveal(davidCaptionRef);
  const jennaCaption = useCaptionReveal(jennaCaptionRef);

  // Once hydrated, every element always gets the same keys (live or resting)
  const veil: MotionStyle | undefined = hydrated ? { opacity: drifting ? veilOpacity : 0 } : undefined;
  const captionStyle = (c: { opacity: MotionValue<number>; y: MotionValue<number> }): MotionStyle | undefined =>
    hydrated ? { opacity: drifting ? c.opacity : 1, y: drifting ? c.y : 0 } : undefined;

  return (
    <AboutWrapper id="about" ref={sectionRef}>
      <Container>
        <Header>
          <Title
            initial={{ opacity: 0, y: RISE.item }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: DUR.reveal, ease: EASE_OUT }}
          >
            <GradientText>Meet The Team</GradientText>
          </Title>
        </Header>

        <Diptych>
          <Member side="a" drift={hydrated ? (drifting ? davidY : 0) : undefined}>
            <PortraitPlate
              captionRef={davidCaptionRef}
              no="Pl. II a"
              name="David Aaron Shapiro"
              role="Bonsai Web Designer"
              src="/images/headshot.png"
              sizes={DAVID_SIZES}
              veil={veil}
              caption={captionStyle(davidCaption)}
            />
            <Bio>
              <BioText>
                With years of experience building for the web and a Software Engineering degree from
                Western Governors University, David has dedicated his career to transforming ideas
                into refined digital realities.
              </BioText>
              <Credential>
                <CredentialMark>WGU</CredentialMark>
                <CredentialLabel>Bachelor of Science in Software Engineering</CredentialLabel>
              </Credential>
            </Bio>
          </Member>

          <Member side="b" drift={hydrated ? (drifting ? jennaY : 0) : undefined}>
            <PortraitPlate
              captionRef={jennaCaptionRef}
              no="Pl. II b"
              name="Jenna Shapiro"
              role="Creative Director"
              src="/images/jenna-headshot.jpg"
              sizes={JENNA_SIZES}
              veil={veil}
              caption={captionStyle(jennaCaption)}
            />
            <Bio>
              <BioText>
                With an eye for elegance and a passion for visual storytelling, Jenna brings a refined
                creative vision to every project. Her expertise in design aesthetics ensures each
                website captures the essence of your brand.
              </BioText>
            </Bio>
          </Member>
        </Diptych>
      </Container>
    </AboutWrapper>
  );
}
