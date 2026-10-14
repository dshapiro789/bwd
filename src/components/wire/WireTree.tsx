'use client';

import { forwardRef, useEffect, useRef, type CSSProperties } from 'react';
import styled, { keyframes } from 'styled-components';
import {
  easeIn,
  easeOut,
  motion,
  useMotionValueEvent,
  useTransform,
  type MotionStyle,
  type MotionValue,
} from 'framer-motion';
import { EASE_OUT } from '@/lib/motion';
import { BARK, BRANCHES, CROWN, LIMBS, PADS, POT, ROOTS, SHOOTS, TRUNK, TRUNK_COILS, VIEW, type Box } from './treeArt';

/**
 * The story told on the hero's scroll progress (0 = rest, 1 = shaped).
 * Pruning, then wiring, then the wire's tail leads down to the work.
 */
export const BEATS = {
  prune: 0.08,
  /** Each stray shoot owns this much progress, one after another. */
  shoot: 0.045,
  trunkWire: [0.3, 0.42],
  limbs: {
    R1: { wire: [0.42, 0.5], set: [0.49, 0.56] },
    L1: { wire: [0.53, 0.6], set: [0.59, 0.65] },
  },
  shaped: 0.65,
  tail: [0.65, 0.97],
} as const;

const [VW, VH] = VIEW;
const EASE = `cubic-bezier(${EASE_OUT.join(', ')})`;

/** Position a layer over the tree using its box in viewBox units. */
const boxStyle = ([x, y, w, h]: Box): CSSProperties => ({
  left: `${(x / VW) * 100}%`,
  top: `${(y / VH) * 100}%`,
  width: `${(w / VW) * 100}%`,
  height: `${(h / VH) * 100}%`,
});

/** Motion style with CSS custom properties (framer sets them per frame). */
const cssVars = (style: Record<string, unknown>) => style as MotionStyle;

const timing = (delay: number, duration?: number) =>
  ({ '--d': `${delay}s`, ...(duration ? { '--t': `${duration}s` } : {}) }) as CSSProperties;

/* Undrawn strokes sit just before the path start (1.01) with a long gap
   after the dash: at exactly 1, round caps paint a dot at the start. */
const draw = keyframes`
  from { stroke-dashoffset: 1.01; }
  to { stroke-dashoffset: 0; }
`;

const fade = keyframes`
  from { opacity: 0; }
`;

/* Pad rows: the lit, scalloped top is near-solid; deeper rows thin out. */
const PAD_DASH = ['9 1.8 6 2.4 11 1.6', '5 2.5 3 3.5 6 3', '2.5 4 3.5 5 2 4.5', '1.5 5.5 2.5 7 1 6'];
const PAD_OPACITY = [1, 0.8, 0.6, 0.45];

/**
 * The tree box. --tree-h is set by the parent layout; --s is the rendered
 * size of one viewBox unit (tree height / 720), so strokes can be divided by
 * it and stay 1.25px at any size. vector-effect: non-scaling-stroke would do
 * the same, but it breaks stroke-dash drawing in Chromium.
 */
const Figure = styled.div`
  position: relative;
  height: var(--tree-h, 68svh);
  aspect-ratio: ${VW} / ${VH};
  --s: tan(atan2(var(--tree-h, 68svh), ${VH}px));
  /* Fallback width (viewBox units) for browsers without CSS trig */
  stroke-width: 1.6;
  color: ${({ theme }) => theme.colors.primary};

  svg {
    position: absolute;
    overflow: visible;
    fill: none;
    stroke: currentColor;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-width: calc(1.25px / var(--s));
  }

  @media (prefers-reduced-motion: no-preference) {
    [data-draw] {
      stroke-dasharray: 1 2;
      animation: ${draw} var(--t, 0.6s) var(--e, cubic-bezier(0.33, 0, 0.2, 1)) var(--d, 0s) both;
    }

    [data-fade] {
      animation: ${fade} 0.6s ${EASE} var(--d, 0s) both;
    }
  }
`;

const Full = styled.svg`
  inset: 0;
  width: 100%;
  height: 100%;
`;

const Pad = styled.g`
  stroke: ${({ theme }) => theme.colors.accent};
  opacity: 0.9;

  ${PAD_DASH.map(
    (dash, k) => `
  path:nth-child(${k + 1}) {
    stroke-dasharray: ${dash};
    opacity: ${PAD_OPACITY[k]};
  }`
  ).join('')}
`;

const Bark = styled.path`
  opacity: 0.5;
`;

/* A moving part of the tree: an HTML box holding its own small SVG,
   cropped to the part's box, so a transform moves it as one piece and the
   static tree's paths are never touched. */
const Layer = styled(motion.div)`
  position: absolute;

  svg {
    inset: 0;
    width: 100%;
    height: 100%;
  }
`;

/* Wire coils draw in order: coil i of n shows as --w passes i/n..(i+1)/n.
   One coil is mid-draw at a time. */
const Coil = styled.path`
  stroke-width: calc(1.6px / var(--s));
  stroke-dasharray: 1 2;
  stroke-dashoffset: calc(1.01 * clamp(0, var(--i) + 1 - var(--n) * var(--w, 0), 1));
`;

const LimbLayer = styled(Layer)`
  @media (prefers-reduced-motion: reduce) {
    transform: none !important;
    --w: 1 !important;
  }
`;

const WireLayer = styled(Layer)`
  inset: 0;

  @media (prefers-reduced-motion: reduce) {
    --w: 1 !important;
  }
`;

const ShootLayer = styled(Layer)`
  @media (prefers-reduced-motion: reduce) {
    display: none;
  }
`;

/* The cut mark: a 2px bronze tick across the shoot at the snip point */
const Tick = styled.span`
  position: absolute;
  width: 0;
  height: 0;
  transform: rotate(var(--a));

  @media (prefers-reduced-motion: reduce) {
    display: none;
  }
`;

const TickMark = styled(motion.span)`
  position: absolute;
  left: -4px;
  top: -1px;
  width: 8px;
  height: 2px;
  background: ${({ theme }) => theme.colors.primary};
  opacity: 0;
`;

/* Specimen tag: steps through Pruned, Wired, Shaped as the story plays */
const Tag = styled.p`
  position: absolute;
  top: ${(704 / VH) * 100}%;
  right: ${((VW - 468) / VW) * 100}%;
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0;
  font-family: ${({ theme }) => theme.fonts.main};
  font-size: 0.66rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  white-space: nowrap;
  color: ${({ theme }) => theme.colors.textSecondary};

  @media (max-width: 767px) {
    gap: 8px;
    font-size: 0.62rem;
    letter-spacing: 0.16em;
  }
`;

const Step = styled.span`
  position: relative;
  transition: color 0.3s ${EASE};

  &::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0.2em;
    bottom: -5px;
    height: 1px;
    background: ${({ theme }) => theme.colors.primary};
    transform: scaleX(0);
    transform-origin: left center;
    transition: transform 0.3s ${EASE};
  }

  ${Tag}[data-step='1'] &[data-i='1'],
  ${Tag}[data-step='2'] &[data-i='1'],
  ${Tag}[data-step='2'] &[data-i='2'],
  ${Tag}[data-step='3'] & {
    color: ${({ theme }) => theme.colors.primary};
  }

  ${Tag}[data-step='1'] &[data-i='1']::after,
  ${Tag}[data-step='2'] &[data-i='2']::after,
  ${Tag}[data-step='3'] &[data-i='3']::after {
    transform: scaleX(1);
  }

  /* Reduced motion shows the shaped tree, so the tag reads Shaped */
  @media (prefers-reduced-motion: reduce) {
    color: ${({ theme }) => theme.colors.primary};
    transition: none;

    &[data-i='3']::after {
      transform: scaleX(1);
      transition: none;
    }

    &:not([data-i='3'])::after {
      transform: scaleX(0);
    }
  }
`;

const Dot = styled.span`
  width: 4px;
  height: 4px;
  border-radius: 50%;
  flex-shrink: 0;
  background: ${({ theme }) => theme.colors.primary};
`;

/* Every pad renders all four rows (an empty one draws nothing) so each
   row's style can come from its position */
function PadRows({ rows, delay }: { rows: readonly string[]; delay: number }) {
  return (
    <Pad data-fade="" style={timing(delay)}>
      {PAD_DASH.map((_, k) => (
        <path key={k} d={rows[k] ?? ''} />
      ))}
    </Pad>
  );
}

function Shoot({ index, progress }: { index: number; progress: MotionValue<number> }) {
  const shoot = SHOOTS[index];
  const start = BEATS.prune + index * BEATS.shoot;
  // Snip, then it tumbles: drops 60px (gravity), drifts a little away from
  // the trunk, turns 18 degrees and is gone before it crosses much foliage
  const fall = [start + 0.008, start + 0.052];
  const gone = [start + 0.014, start + 0.046];
  const y = useTransform(progress, fall, [0, 60], { ease: easeIn });
  const x = useTransform(progress, fall, [0, 12 * shoot.swing], { ease: easeOut });
  const rotate = useTransform(progress, fall, [0, 18 * shoot.swing]);
  const opacity = useTransform(progress, gone, [1, 0]);
  const tick = useTransform(progress, [start, start + 0.006, start + 0.02, start + 0.034], [0, 1, 1, 0]);
  const tickScale = useTransform(progress, [start, start + 0.006], [0.3, 1]);
  const [x0, y0, w, h] = shoot.box;

  return (
    <>
      <ShootLayer style={{ ...boxStyle(shoot.box), x, y, rotate, opacity }}>
        <svg viewBox={`${x0} ${y0} ${w} ${h}`}>
          <path d={shoot.d} pathLength={1} data-draw="" style={timing(shoot.t, 0.4)} />
        </svg>
      </ShootLayer>
      <Tick
        style={
          {
            left: `${(shoot.cut[0] / VW) * 100}%`,
            top: `${(shoot.cut[1] / VH) * 100}%`,
            '--a': `${shoot.tick}deg`,
          } as CSSProperties
        }
      >
        <TickMark style={{ opacity: tick, scaleX: tickScale }} />
      </Tick>
    </>
  );
}

function Limb({ index, progress }: { index: number; progress: MotionValue<number> }) {
  const limb = LIMBS[index];
  const beat = BEATS.limbs[limb.id];
  const wire = useTransform(progress, [...beat.wire], [0, 1]);
  const rotate = useTransform(progress, [...beat.set], [limb.rest, 0]);
  const [x0, y0, w, h] = limb.box;

  return (
    <LimbLayer
      style={cssVars({
        ...boxStyle(limb.box),
        rotate,
        transformOrigin: `${limb.origin[0]}% ${limb.origin[1]}%`,
        '--w': wire,
      })}
    >
      <svg viewBox={`${x0} ${y0} ${w} ${h}`}>
        <g style={timing(limb.t[0], limb.t[1])}>
          <path d={limb.d[0]} pathLength={1} data-draw="" />
          <path d={limb.d[1]} pathLength={1} data-draw="" />
        </g>
        <PadRows rows={limb.pad.rows} delay={limb.pad.t} />
        <g style={{ '--n': limb.coils.length } as CSSProperties}>
          {limb.coils.map((d, i) => (
            <Coil key={i} d={d} pathLength={1} style={{ '--i': i } as CSSProperties} />
          ))}
        </g>
      </svg>
    </LimbLayer>
  );
}

interface WireTreeProps {
  /** Story progress, 0 (rest) to 1 (shaped). */
  progress: MotionValue<number>;
}

/**
 * Hand-drawn juniper in bronze line with stippled sage pads. Load-in draws
 * run on CSS keyframes (no JS needed, off under reduced motion); scroll
 * progress prunes the stray shoots, wires the trunk and two limbs, and sets
 * those limbs. Under reduced motion the shaped tree is shown, static.
 */
const WireTree = forwardRef<HTMLDivElement, WireTreeProps>(function WireTree({ progress }, ref) {
  const tagRef = useRef<HTMLParagraphElement>(null);
  const trunkWire = useTransform(progress, [...BEATS.trunkWire], [0, 1]);

  // The tag's step is set on the element directly: no React render per frame
  const showStep = (p: number) => {
    const step = String(p >= BEATS.shaped ? 3 : p >= BEATS.trunkWire[0] ? 2 : p >= BEATS.prune ? 1 : 0);
    if (tagRef.current && tagRef.current.dataset.step !== step) tagRef.current.dataset.step = step;
  };
  useMotionValueEvent(progress, 'change', showStep);
  useEffect(() => showStep(progress.get()));

  return (
    <Figure ref={ref} role="img" aria-label="Line drawing of a juniper bonsai in a shallow pot">
      <Full viewBox={`0 0 ${VW} ${VH}`} aria-hidden="true">
        <path d={POT} />
        <path d={ROOTS} pathLength={1} data-draw="" style={timing(0.05, 0.45)} />
        {TRUNK.map((seg, i) => (
          <path
            key={i}
            d={seg.d}
            pathLength={1}
            data-draw=""
            style={{ ...timing(seg.t[0], seg.t[1]), '--e': 'linear' } as CSSProperties}
          />
        ))}
        <Bark d={BARK} data-fade="" style={timing(0.6)} />
        {BRANCHES.map((b, i) => (
          <g key={i} style={timing(b.t[0], b.t[1])}>
            <path d={b.d[0]} pathLength={1} data-draw="" />
            <path d={b.d[1]} pathLength={1} data-draw="" />
          </g>
        ))}
        <path d={CROWN} pathLength={1} data-draw="" style={timing(1.05, 0.45)} />
        {PADS.map((pad, i) => (
          <PadRows key={i} rows={pad.rows} delay={pad.t} />
        ))}
      </Full>

      <WireLayer style={cssVars({ '--w': trunkWire, '--n': TRUNK_COILS.length })}>
        <svg viewBox={`0 0 ${VW} ${VH}`} aria-hidden="true">
          {TRUNK_COILS.map((d, i) => (
            <Coil key={i} d={d} pathLength={1} style={{ '--i': i } as CSSProperties} />
          ))}
        </svg>
      </WireLayer>

      {LIMBS.map((_, i) => (
        <Limb key={i} index={i} progress={progress} />
      ))}
      {SHOOTS.map((_, i) => (
        <Shoot key={i} index={i} progress={progress} />
      ))}

      <Tag ref={tagRef} data-step="0" aria-hidden="true">
        <Step data-i="1">Pruned</Step>
        <Dot />
        <Step data-i="2">Wired</Step>
        <Dot />
        <Step data-i="3">Shaped</Step>
      </Tag>
    </Figure>
  );
});

export default WireTree;
