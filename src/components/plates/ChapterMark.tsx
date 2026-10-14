'use client';

import { useRef } from 'react';
import styled, { css, keyframes } from 'styled-components';
import { motion, useInView } from 'framer-motion';
import { Container } from '../layout/Container';
import { PIN_QUERY } from './queries';

/*
 * ChapterMark: a book-style running header between sections, e.g.
 * "02 / 07 · The people" followed by a long bronze hairline. The hairline
 * draws in from the left once as the mark scrolls into view: a CSS view
 * timeline where supported, otherwise a one-shot transition when it enters
 * the viewport. Under reduced motion it is simply drawn.
 *
 * The parts are exported so the hero can draw its own "01 / 07" mark with
 * scroll-linked values at the end of its runway.
 */

const pad = (n: number) => String(n).padStart(2, '0');

/* Numeral and label share a baseline */
export const MarkRow = styled.div`
  display: flex;
  align-items: baseline;
  min-width: 0;
`;

export const MarkNumeral = styled(motion.span)`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-style: italic;
  font-weight: 400;
  font-size: 1.125rem;
  line-height: 1;
  letter-spacing: 0.02em;
  font-variant-numeric: lining-nums tabular-nums;
  color: ${({ theme }) => theme.colors.primary};
  white-space: nowrap;
`;

export const MarkLabel = styled(motion.span)`
  font-family: ${({ theme }) => theme.fonts.main};
  font-size: 0.75rem;
  font-weight: 400;
  line-height: 1;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textSecondary};
  white-space: nowrap;

  &::before {
    content: '·';
    color: ${({ theme }) => theme.colors.primary};
    margin: 0 0.75em 0 0.65em;
    letter-spacing: 0;
  }
`;

const ruleLine = css`
  display: block;
  flex: 1 1 auto;
  /* On the shared baseline, lifted to the middle of the label's capitals
     (offset, not transform: the transform carries the draw) */
  align-self: baseline;
  position: relative;
  top: -4px;
  min-width: 48px;
  height: 1px;
  margin-left: ${({ theme }) => theme.spacing.lg};
  background: linear-gradient(90deg, rgba(200, 159, 129, 0.5), rgba(200, 159, 129, 0.12));
  transform-origin: 0 50%;
`;

/** The hairline as a motion element, for marks driven by scroll-linked values. */
export const MarkRule = styled(motion.span)`
  ${ruleLine}
`;

const draw = keyframes`
  from { transform: scaleX(0); }
  to { transform: scaleX(1); }
`;

const DrawnRule = styled.span`
  ${ruleLine}

  @media (prefers-reduced-motion: no-preference) {
    @supports (animation-timeline: view()) {
      animation: ${draw} linear both;
      animation-timeline: --chapter-mark;
      animation-range: cover 6% cover 38%;
    }

    @supports not (animation-timeline: view()) {
      transform: scaleX(0);
      transition: transform 1.2s cubic-bezier(0.65, 0, 0.35, 1);

      &[data-drawn] {
        transform: scaleX(1);
      }
    }
  }
`;

/* Space above the mark, the row itself, and the gap down to the section's
   own heading. Together they replace that section's top padding. */
const ABOVE = 'clamp(40px, 6vh, 72px)';
const ROW = '1.25rem';
const BELOW = 'clamp(48px, 8vh, 96px)';

/*
 * The mark is the opening of the page that follows, like a running header
 * at the top of a book page: the next section is pulled up underneath it, so
 * that section's background edge falls above the mark rather than just under
 * its hairline, and its top padding becomes the space around the mark.
 */
const Mark = styled.div<{ $unpinnedOnly: boolean }>`
  position: relative;
  z-index: 1;
  padding-top: ${ABOVE};
  margin-bottom: calc(-1 * (${ABOVE} + ${ROW}));

  & + section {
    padding-top: calc(${ABOVE} + ${ROW} + ${BELOW});
  }

  ${({ $unpinnedOnly }) =>
    $unpinnedOnly &&
    css`
      /* Where the hero pins, its runway draws this mark itself, so only the
         gap below it is kept */
      @media ${PIN_QUERY} {
        display: none;

        & + section {
          padding-top: ${BELOW};
        }
      }
    `}
`;

const Row = styled(MarkRow)`
  height: ${ROW};
  view-timeline-name: --chapter-mark;
  view-timeline-axis: block;
`;

interface ChapterMarkProps {
  index: number;
  of?: number;
  label: string;
  /** Hide where the pinned hero already draws this mark in its runway. */
  unpinnedOnly?: boolean;
}

export default function ChapterMark({ index, of = 7, label, unpinnedOnly = false }: ChapterMarkProps) {
  const rowRef = useRef<HTMLDivElement>(null);
  // Only used where view timelines are unsupported; harmless elsewhere
  const inView = useInView(rowRef, { once: true, margin: '0px 0px -12% 0px' });

  return (
    // A visual running header: the section's own heading follows and carries the name
    <Mark aria-hidden="true" $unpinnedOnly={unpinnedOnly}>
      <Container>
        <Row ref={rowRef}>
          <MarkNumeral>
            {pad(index)} / {pad(of)}
          </MarkNumeral>
          <MarkLabel>{label}</MarkLabel>
          <DrawnRule data-drawn={inView ? '' : undefined} />
        </Row>
      </Container>
    </Mark>
  );
}
