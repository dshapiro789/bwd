'use client';

import { useEffect, useState, type RefObject } from 'react';
import styled from 'styled-components';
import { motion, type MotionStyle, type MotionValue } from 'framer-motion';
import { VIEW } from './treeArt';

/** Put this attribute on the element the tail should hand off to. */
export const WIRE_TARGET = 'data-wire-target';

/* An HTML box carries the draw progress (--t) so framer only writes a CSS
   variable per frame; the path reads it. */
const TailBox = styled(motion.div)`
  position: absolute;
  inset: 0;
  pointer-events: none;

  @media (prefers-reduced-motion: reduce) {
    --t: 1 !important;
  }
`;

const TailSvg = styled.svg`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  overflow: visible;
  fill: none;
  stroke: ${({ theme }) => theme.colors.primary};
  stroke-width: 1.6;
  stroke-linecap: round;
  stroke-linejoin: round;
`;

const Wire = styled.path`
  stroke-dasharray: 1;
  stroke-dashoffset: calc(1 - var(--t, 0));
`;

type Pt = [number, number];
const add = (a: Pt, b: Pt): Pt => [a[0] + b[0], a[1] + b[1]];
const f = (p: Pt) => `${Math.round(p[0] * 10) / 10} ${Math.round(p[1] * 10) / 10}`;

/**
 * The wire's tail: it comes up out of the soil by the left rim, clears the
 * lip in a low arc, then bends once, from heading left to straight down, and
 * drops off the bottom of the stage at the x of the target (the Healthspan
 * branch trunk). Stage pixel coordinates.
 */
function tailPath(stage: DOMRect, fig: DOMRect, targetX: number | null) {
  const s = fig.height / VIEW[1];
  const at = (x: number, y: number): Pt => [fig.left - stage.left + x * s, fig.top - stage.top + y * s];
  const w = stage.width;
  const h = stage.height;

  const start = at(172, 638);
  const lip = at(124, 643);
  // Always drop clear of the pot's left end
  const X = Math.min(targetX ?? lip[0] - 120 * s, lip[0] - 16 * s);
  const bottom = h + 4;
  const dropY = Math.max(lip[1] + 40 * s, bottom - Math.max(36, (bottom - lip[1]) * 0.36));
  const dx = lip[0] - X;
  const dy = dropY - lip[1];
  // Leaving the lip: heading left, a little down (matches the arch's end)
  const t0: Pt = [-0.94, 0.34];

  const d = [
    `M${f(start)}`,
    `C${f(at(160, 629))} ${f(at(140, 637))} ${f(lip)}`,
    `C${f(add(lip, [t0[0] * dx * 0.56, t0[1] * dx * 0.56]))} ${f([X, dropY - dy * 0.5])} ${f([X, dropY])}`,
    `L${f([X, bottom])}`,
  ].join('');
  return { w, h, d };
}

interface WireTailProps {
  /** Draw progress of the tail, 0 to 1. */
  progress: MotionValue<number>;
  stageRef: RefObject<HTMLElement | null>;
  figureRef: RefObject<HTMLElement | null>;
}

export default function WireTail({ progress, stageRef, figureRef }: WireTailProps) {
  const [geom, setGeom] = useState<{ w: number; h: number; d: string } | null>(null);

  useEffect(() => {
    const stage = stageRef.current;
    const fig = figureRef.current;
    if (!stage || !fig) return;

    let frame = 0;
    const measure = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const target = document.querySelector(`[${WIRE_TARGET}]`);
        const t = target?.getBoundingClientRect();
        const s = stage.getBoundingClientRect();
        const next = tailPath(s, fig.getBoundingClientRect(), t ? t.left + t.width / 2 - s.left : null);
        setGeom((prev) => (prev && prev.d === next.d && prev.w === next.w && prev.h === next.h ? prev : next));
      });
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(stage);
    ro.observe(fig);
    window.addEventListener('resize', measure);
    return () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [stageRef, figureRef]);

  if (!geom) return null;

  return (
    <TailBox style={{ '--t': progress } as MotionStyle} aria-hidden="true">
      <TailSvg viewBox={`0 0 ${geom.w} ${geom.h}`}>
        <Wire d={geom.d} pathLength={1} />
      </TailSvg>
    </TailBox>
  );
}
