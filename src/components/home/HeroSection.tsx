'use client';

import { useEffect, useRef, useSyncExternalStore } from 'react';
import styled, { css, keyframes } from 'styled-components';
import {
  cubicBezier,
  motion,
  useMotionTemplate,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useTransform,
  type MotionStyle,
} from 'framer-motion';
import { Container } from '../layout/Container';
import { useMediaQuery, useReducedMotionSafe } from '@/lib/useMediaQuery';
import { DUR, EASE_OUT, RISE } from '@/lib/motion';
import {
  BAND_REST,
  BAND_START,
  Cord,
  CordSlot,
  HangingCaption,
  HangingPlate,
  type PlateStyles,
} from '../plates/HangingScroll';
import { MarkLabel, MarkNumeral, MarkRow, MarkRule } from '../plates/ChapterMark';
import { PIN_QUERY, SPLIT_QUERY } from '../plates/queries';

/*
 * Hero: "The Hanging Scroll".
 *
 * Desktop (PIN_QUERY): a 160svh runway with a sticky 100svh stage. As the
 * reader scrolls, the light comes up on the bark, then the scroll is taken
 * down: the plate rolls up onto its rod, the cord lifts it away, the copy
 * fades (calls to action last), and the running header for the work draws in
 * where the plate hung. Everywhere else the hero is a plain section with a
 * light scroll-linked exit on the plate, and under reduced motion it is still.
 *
 * Copy is server-rendered and visible; the entrance runs on CSS keyframes.
 * Scroll values attach only after hydration, so the server HTML carries no
 * inline transforms and CSS alone sets each layout's resting frame.
 */

type Range = [number, number];

/** Runway choreography, as fractions of the pinned scroll. p = 0 is the resting hero. */
const RUN: Record<string, Range> = {
  band: [0.03, 0.46], // the light comes up and settles on the trunk
  // 0.46-0.49: a short hold on the lit tree
  caption: [0.47, 0.54],
  roll: [0.49, 0.76], // the plate rolls up onto its rod
  lift: [0.74, 0.88], // the cord draws the rolled scroll up and away
  head: [0.53, 0.66], // eyebrow, headline, subhead: a short fade, no muddy middle
  actions: [0.82, 0.93], // calls to action, price, colophon: last to leave
  rule: [0.8, 0.97], // "01 / 07 · Selected work" draws in where the plate hung
  label: [0.86, 1],
};

/** Unpinned layouts: a light exit on the plate over ['start start', 'end start']. */
const EXIT = {
  scale: 0.94,
  rise: '-3vh',
  fade: [0.15, 0.75] as Range,
};

/** The band arrives steadily and takes its time to come to rest. */
const settle = cubicBezier(0.3, 0, 0.15, 1);
/** Rolling and lifting: an even hand, gentle at both ends. */
const steady = cubicBezier(0.35, 0, 0.65, 1);
const draw = cubicBezier(0.65, 0, 0.35, 1);

const noopSubscribe = () => () => {};
/** False on the server and during hydration, true after: gates client-only styles. */
const useHydrated = () =>
  useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false
  );

/* ---------- Entrance (CSS, before hydration) ---------- */

const heroIn = keyframes`
  from { opacity: 0; transform: translateY(${RISE.item}px); }
  to { opacity: 1; transform: none; }
`;

const entrance = (delayMs: number) => css`
  @media (prefers-reduced-motion: no-preference) {
    animation: ${heroIn} ${DUR.hero}s cubic-bezier(${EASE_OUT.join(', ')}) ${delayMs}ms both;
  }
`;

const focusRing = css`
  &:focus-visible {
    outline: 1px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 3px;
  }
`;

/* ---------- Runway and stage ---------- */

const Runway = styled.section`
  position: relative;
  background-color: ${({ theme }) => theme.colors.background};

  @media ${PIN_QUERY} {
    height: 160svh;
  }
`;

/*
 * The stage is a 12-column grid. Rows: the cord's drop, the plate, its
 * caption, and the floor. The copy spans the first two rows and sits on the
 * plate's bottom edge, so the headline block and the rod share one line.
 */
const Stage = styled(Container)`
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  grid-template-rows: [top] 128px [plate-top] auto [plate-bottom] auto [caption-bottom] auto [end];
  padding-bottom: ${({ theme }) => theme.spacing.xxl};

  @media ${SPLIT_QUERY} {
    min-height: 100vh;
    min-height: 100svh;
    padding-bottom: 0;
    grid-template-columns: repeat(12, minmax(0, 1fr));
    column-gap: ${({ theme }) => theme.spacing.lg};
    /* The plate hangs a little below centre, like a picture at eye level */
    grid-template-rows:
      [top] minmax(120px, 1.5fr)
      [plate-top] auto
      [plate-bottom] auto
      [caption-bottom] minmax(${({ theme }) => theme.spacing.xl}, 0.5fr)
      [end];
  }

  @media ${PIN_QUERY} {
    position: sticky;
    top: 0;
    height: 100vh;
    height: 100svh;
    min-height: 0;
    overflow: clip;
  }
`;

/* Columns: stacked on phones; copy 1-6 / plate 7-12 on tablets; copy 1-6 /
   plate 7-11 from 1024px, with column 12 left empty. */
const plateColumns = css`
  grid-column: 1 / -1;
  justify-self: end;

  @media ${SPLIT_QUERY} {
    grid-column: 7 / 13;
    justify-self: center;
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.desktop}) {
    grid-column: 7 / 12;
  }
`;

/* Plate width: on phones a modest frontispiece that leaves the headline above
   the fold; in two columns 72svh tall (4:5) unless the column is narrower. */
const plateWidth = css`
  width: clamp(168px, calc((100svh - 460px) * 0.8), 56vw);
  max-width: 300px;

  @media ${SPLIT_QUERY} {
    width: min(57.6svh, 100%);
    max-width: none;
  }
`;

const CordCell = styled.div`
  ${plateColumns}
  grid-row: top / plate-top;
  display: flex;
  justify-content: center;
  ${plateWidth}
`;

const PlateCell = styled(HangingPlate)`
  ${plateColumns}
  grid-row: plate-top / plate-bottom;
  ${plateWidth}
`;

const CaptionCell = styled(HangingCaption)`
  ${plateColumns}
  grid-row: plate-bottom / caption-bottom;
  ${plateWidth}
  padding-top: ${({ theme }) => theme.spacing.md};
`;

/* ---------- Copy ---------- */

const Copy = styled.div`
  grid-column: 1 / -1;
  grid-row: caption-bottom / end;
  padding-top: ${({ theme }) => theme.spacing.xl};

  @media ${SPLIT_QUERY} {
    grid-column: 1 / 7;
    grid-row: top / plate-bottom;
    align-self: end;
    padding-top: 112px;
  }
`;

const Head = styled(motion.div)``;

const Actions = styled(motion.div)``;

const Eyebrow = styled.p`
  font-family: ${({ theme }) => theme.fonts.main};
  font-size: 0.75rem;
  font-weight: 400;
  letter-spacing: 0.24em;
  line-height: 1.6;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.primary};
  margin: 0 0 ${({ theme }) => theme.spacing.lg};
  ${entrance(0)}

  @media (max-width: 767px) {
    font-size: 0.6875rem;
    letter-spacing: 0.2em;
  }
`;

/* Real spaces sit either side of each dot, so the text reads naturally aloud */
const EyebrowDot = styled.span.attrs({ 'aria-hidden': true })`
  margin: 0 0.25em;
`;

/* Below 1024px the copy column is narrower than the whole line, so the
   studio's name takes its own line rather than leaving "2022" orphaned. */
const EyebrowName = styled.span`
  @media (max-width: 1023px) {
    display: block;

    & + ${EyebrowDot} {
      display: none;
    }
  }
`;

const Headline = styled.h1`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: clamp(2.25rem, 9.4vw, 3rem);
  font-weight: 400;
  line-height: 1.06;
  letter-spacing: -0.01em;
  color: ${({ theme }) => theme.colors.text};
  margin: 0 0 ${({ theme }) => theme.spacing.lg};
  ${entrance(0)}

  span,
  em {
    display: block;
  }

  em {
    font-style: italic;
    color: ${({ theme }) => theme.colors.primary};
  }

  @media ${SPLIT_QUERY} {
    font-size: clamp(2.5rem, 4.4vw, 4.5rem);
  }
`;

const Subhead = styled.p`
  font-family: ${({ theme }) => theme.fonts.main};
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.7;
  color: ${({ theme }) => theme.colors.textSecondary};
  max-width: 34rem;
  margin: 0 0 ${({ theme }) => theme.spacing.xl};
  ${entrance(100)}

  @media (min-width: ${({ theme }) => theme.breakpoints.desktop}) {
    font-size: 1.0625rem;
    max-width: 30rem;
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
    transition: opacity ${DUR.hover}s cubic-bezier(${EASE_OUT.join(', ')});
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
  transition: color ${DUR.hover}s cubic-bezier(${EASE_OUT.join(', ')});

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }

  ${focusRing}
`;

const PriceLine = styled.p`
  font-family: ${({ theme }) => theme.fonts.main};
  font-size: 0.85rem;
  font-weight: 400;
  letter-spacing: 0.02em;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin: ${({ theme }) => theme.spacing.lg} 0 0;
  ${entrance(300)}
`;

/* Below 1024px the copy column is too narrow for one line, so the two
   clauses stack and the dot between them goes */
const PriceClause = styled.span`
  @media (max-width: 1023px) {
    display: block;
  }
`;

const PriceSeparator = styled.span`
  color: ${({ theme }) => theme.colors.primary};

  @media (max-width: 1023px) {
    display: none;
  }
`;

const ColophonLine = styled.p`
  margin: ${({ theme }) => theme.spacing.md} 0 0;
  ${entrance(400)}
`;

const ColophonName = styled.span`
  color: ${({ theme }) => theme.colors.text};
`;

const ColophonArrow = styled.span.attrs({ 'aria-hidden': true })`
  display: inline-block;
  margin-left: 0.4em;
  color: ${({ theme }) => theme.colors.primary};
  transition: transform ${DUR.hover}s cubic-bezier(${EASE_OUT.join(', ')});
`;

const Colophon = styled.a`
  display: inline-block;
  padding: ${({ theme }) => theme.spacing.xs} 0;
  font-family: ${({ theme }) => theme.fonts.main};
  font-size: 0.8125rem;
  font-weight: 400;
  letter-spacing: 0.02em;
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.textSecondary};
  transition: color ${DUR.hover}s cubic-bezier(${EASE_OUT.join(', ')});

  &:hover {
    color: ${({ theme }) => theme.colors.text};
  }

  &:hover ${ColophonArrow} {
    transform: translateX(4px);
  }

  ${focusRing}
`;

/* ---------- The runway's closing running header ---------- */

/* Drawn only by the pinned runway; elsewhere the page's own 01 mark shows */
const StageMark = styled(MarkRow)`
  display: none;
  ${plateColumns}
  ${plateWidth}
  grid-row: plate-bottom / caption-bottom;
  align-self: start;
  /* Where the plate hung, centred on the line where its rod rested */
  transform: translateY(-50%);

  @media ${PIN_QUERY} {
    display: flex;

    /* Resting frame before hydration: not yet drawn */
    ${MarkRule} {
      transform: scaleX(0);
    }

    ${MarkNumeral}, ${MarkLabel} {
      opacity: 0;
    }
  }
`;

type Mode = 'ssr' | 'pin' | 'exit' | 'still';

export default function HeroSection() {
  const runwayRef = useRef<HTMLElement>(null);
  const cordRef = useRef<HTMLDivElement>(null);
  const actionsRef = useRef<HTMLDivElement>(null);

  const hydrated = useHydrated();
  const pinned = useMediaQuery(PIN_QUERY);
  const reduce = useReducedMotionSafe();
  const mode: Mode = !hydrated ? 'ssr' : pinned ? 'pin' : reduce ? 'still' : 'exit';

  // p: the pinned runway. e: the unpinned hero leaving the viewport.
  const { scrollYProgress: p } = useScroll({ target: runwayRef, offset: ['start start', 'end end'] });
  const { scrollYProgress: e } = useScroll({ target: runwayRef, offset: ['start start', 'end start'] });

  // The light comes up: the band slides in, its image slides back by the same amount
  const band = useTransform(p, RUN.band, [BAND_START, BAND_REST], { ease: settle });
  const bandX = useMotionTemplate`${band}%`;
  const bandCounterX = useTransform(band, (v) => `${-v}%`);

  // The scroll is taken down: roll up from the bottom, rod on the rising edge
  const roll = useTransform(p, RUN.roll, [0, 100], { ease: steady });
  const rollerY = useTransform(roll, (v) => `${-v}%`);
  const rollerCounterY = useMotionTemplate`${roll}%`;

  // Then the cord retracts, lifting the rolled scroll (now just its rod) away
  const lift = useTransform(p, RUN.lift, [0, 1], { ease: steady });
  const cordScale = useTransform(lift, (v) => 1 - v);
  const cordHeight = useMotionValue(0);
  // A few px past the cord's length, so the rod clears the stage's top edge
  const liftY = useTransform([lift, cordHeight], ([l, h]: number[]) => -l * (h + 8));

  const captionOpacity = useTransform(p, RUN.caption, [1, 0]);
  const headOpacity = useTransform(p, RUN.head, [1, 0]);
  const headY = useTransform(p, RUN.head, [0, -RISE.item]);
  const actionsOpacity = useTransform(p, RUN.actions, [1, 0]);
  const actionsY = useTransform(p, RUN.actions, [0, -RISE.word]);

  const ruleScale = useTransform(p, RUN.rule, [0, 1], { ease: draw });
  const labelOpacity = useTransform(p, RUN.label, [0, 1]);
  const labelY = useTransform(p, RUN.label, [8, 0]);

  // Unpinned exit: the plate settles back and dims as the hero leaves
  const exitScale = useTransform(e, [0, 1], [1, EXIT.scale]);
  const exitY = useTransform(e, [0, 1], ['0vh', EXIT.rise]);
  const exitOpacity = useTransform(e, EXIT.fade, [1, 0.3]);
  const exitCaption = useTransform(e, [0, 0.35], [1, 0]);

  // The cord's height is the lift distance; transforms do not change offsetHeight
  useEffect(() => {
    const el = cordRef.current;
    if (!el) return;
    const measure = () => cordHeight.set(el.offsetHeight);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [cordHeight]);

  // Faded calls to action leave the tab order (and return with them)
  const setActionsInert = (opacity: number) => {
    const el = actionsRef.current;
    if (el) el.inert = mode === 'pin' && opacity < 0.35;
  };
  useMotionValueEvent(actionsOpacity, 'change', setActionsInert);
  useEffect(() => {
    const el = actionsRef.current;
    if (el) el.inert = mode === 'pin' && actionsOpacity.get() < 0.35;
  }, [mode, actionsOpacity]);

  /*
   * Every element always receives the same keys once hydrated: the live
   * motion value in its active mode, the resting value otherwise. Swapping a
   * key out entirely would leave a stale inline value behind on mode changes.
   */
  const pin = mode === 'pin';
  const exit = mode === 'exit';
  const live = mode !== 'ssr';

  const plateStyles: PlateStyles | undefined = live
    ? {
        box: {
          y: pin ? liftY : exit ? exitY : 0,
          scale: exit ? exitScale : 1,
          opacity: exit ? exitOpacity : 1,
        },
        roller: { y: pin ? rollerY : '0%' },
        rollerInner: { y: pin ? rollerCounterY : '0%' },
        band: { x: pin ? bandX : `${BAND_REST}%` },
        bandInner: { x: pin ? bandCounterX : `${-BAND_REST}%` },
        rod: { y: pin ? rollerY : '0%' },
      }
    : undefined;

  const cordStyle: MotionStyle | undefined = live
    ? { scaleY: pin ? cordScale : 1, y: exit ? exitY : 0 }
    : undefined;
  const captionStyle: MotionStyle | undefined = live
    ? { opacity: pin ? captionOpacity : exit ? exitCaption : 1, y: exit ? exitY : 0 }
    : undefined;
  const headStyle: MotionStyle | undefined = live
    ? { opacity: pin ? headOpacity : 1, y: pin ? headY : 0 }
    : undefined;
  const actionsStyle: MotionStyle | undefined = live
    ? { opacity: pin ? actionsOpacity : 1, y: pin ? actionsY : 0 }
    : undefined;
  const ruleStyle: MotionStyle | undefined = live ? { scaleX: pin ? ruleScale : 0 } : undefined;
  const labelStyle: MotionStyle | undefined = live
    ? { opacity: pin ? labelOpacity : 0, y: pin ? labelY : 0 }
    : undefined;

  return (
    <Runway id="hero" ref={runwayRef}>
      <Stage data-hero-stage>
        <CordCell>
          <CordSlot ref={cordRef}>
            <Cord style={cordStyle} />
          </CordSlot>
        </CordCell>

        <PlateCell styles={plateStyles} />
        <CaptionCell style={captionStyle} />

        <Copy>
          <Head style={headStyle}>
            <Eyebrow>
              <EyebrowName>Bonsai Web Design</EyebrowName> <EyebrowDot>·</EyebrowDot> A studio of
              two <EyebrowDot>·</EyebrowDot> Est.&nbsp;2022
            </Eyebrow>

            <Headline>
              <span>Timeless websites,</span> <em>shaped by hand.</em>
            </Headline>

            <Subhead>
              We&apos;re David and Jenna Shapiro. We design and build custom websites, then keep
              tending them for years.
            </Subhead>
          </Head>

          <Actions ref={actionsRef} style={actionsStyle}>
            <CtaRow>
              <PrimaryCta href="#contact">Start a project</PrimaryCta>
              <SecondaryCta href="#portfolio">See the work</SecondaryCta>
            </CtaRow>

            <PriceLine>
              <PriceClause>Custom sites from $1500 per page</PriceClause>{' '}
              <PriceSeparator>·</PriceSeparator>{' '}
              <PriceClause>Updates and care at $120/hr</PriceClause>
            </PriceLine>

            <ColophonLine>
              <Colophon href="#portfolio">
                Now cultivating: <ColophonName>Healthspan Collective</ColophonName>, five sites
                <ColophonArrow>→</ColophonArrow>
              </Colophon>
            </ColophonLine>
          </Actions>
        </Copy>

        <StageMark aria-hidden="true">
          <MarkNumeral style={labelStyle}>01 / 07</MarkNumeral>
          <MarkLabel style={labelStyle}>Selected work</MarkLabel>
          <MarkRule style={ruleStyle} />
        </StageMark>
      </Stage>
    </Runway>
  );
}
