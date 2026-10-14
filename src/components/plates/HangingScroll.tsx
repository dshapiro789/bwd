'use client';

import Image from 'next/image';
import styled, { css, keyframes } from 'styled-components';
import { motion, type MotionStyle } from 'framer-motion';
import { DUR, EASE_OUT } from '@/lib/motion';
import { CaptionDot, PlateNo, captionText, plateHairline } from './Plate';
import { PIN_QUERY } from './queries';

/*
 * The hero's hanging scroll: a 4:5 plate on a 1px bronze cord, with a bronze
 * rod along its bottom edge.
 *
 * Two registered exposures of the same photograph are stacked. The base is a
 * static, dimmed "ambient" exposure; the lit exposure shows only through a
 * soft band of light. The band is a static mask on a mover: the mover slides
 * the band across the plate while the image inside it slides back the same
 * distance, so the lit image never moves, only the light does. Rolling the
 * plate up uses the same counter-translate idea vertically. Only transforms
 * change, so the whole sequence stays on the compositor.
 *
 * The hero owns the choreography and passes in either scroll-linked motion
 * values or the matching resting values (see HeroSection). Before hydration
 * nothing is passed, and the CSS below shows the right resting frame for the
 * layout: the band resting on the trunk, or, where the runway pins, the band
 * waiting just off the plate's left edge.
 */

const SRC = '/images/bonsai-divider-4.png'; // a 1264x848 JPEG despite the name

/**
 * The cover crop shows only the middle ~54% of the source, so these describe
 * the rendered width of the whole image (plate height x 1.49), not the 4:5
 * box, or the browser would pick a candidate half as wide as it draws.
 * Desktop: plate height 72vh. Two columns: about 0.72vw. Stacked: 1.04vw.
 */
export const PLATE_SIZES = '(min-width: 1024px) 108vh, (min-width: 768px) 72vw, 104vw';

/** Crop that centres the tree and leaves the tool wall out (source x 152-830). */
const CROP = '26% 50%';

/** Band offsets, as % of the plate width: waiting off-plate, and resting on the trunk. */
export const BAND_START = -60;
export const BAND_REST = -5;

const EASE = `cubic-bezier(${EASE_OUT.join(', ')})`;
const DRAW = 'cubic-bezier(0.65, 0, 0.35, 1)';

const cordIn = keyframes`
  from { transform: scaleY(0); }
  to { transform: scaleY(1); }
`;

const fadeUp = keyframes`
  from { opacity: 0.92; }
  to { opacity: 0.45; }
`;

const fadeIn = keyframes`
  from { opacity: 0; }
`;

/* ---------- Cord ---------- */

/** Grid slot from the top of the stage down to the plate. Draws down on load. */
export const CordSlot = styled.div`
  position: relative;
  width: 1px;
  height: 100%;
  transform-origin: 50% 0;

  @media (prefers-reduced-motion: no-preference) {
    animation: ${cordIn} 600ms ${DRAW} both;
  }
`;

/* The cord comes down from above the frame. Its first ~56px pass behind the
   fixed header's links, wherever they fall at this width, so it fades in
   below them instead of striking through a label. */
const CordLine = styled(motion.span)`
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(200, 159, 129, 0) 0,
    rgba(200, 159, 129, 0) 56px,
    ${({ theme }) => theme.colors.primary} 112px
  );
  transform-origin: 50% 0;

  @media ${PIN_QUERY} {
    will-change: transform;
  }
`;

export function Cord({ style }: { style?: MotionStyle }) {
  return <CordLine style={style} />;
}

/* ---------- Plate ---------- */

const Box = styled(motion.div)`
  position: relative;
  aspect-ratio: 4 / 5;
  transform-origin: 50% 0;

  @media ${PIN_QUERY} {
    will-change: transform;
  }
`;

const layer = css`
  position: absolute;
  inset: 0;
`;

const coverImage = css`
  img {
    object-fit: cover;
    object-position: ${CROP};
  }
`;

const Roller = styled(motion.div)`
  ${layer}
  overflow: clip;

  @media ${PIN_QUERY} {
    will-change: transform;
  }
`;

/* Counter-translated, so it stays registered with the plate: anything
   painted here (fill, hairline) stays inside the plate as the window rises. */
const RollerInner = styled(motion.div)`
  ${layer}
  background-color: ${({ theme }) => theme.colors.background};
  ${plateHairline}

  @media ${PIN_QUERY} {
    will-change: transform;
  }
`;

/** The ambient exposure: the same photograph, held down to a low, cool level. */
const Ambient = styled.div`
  ${layer}
  ${coverImage}
  filter: brightness(0.38) saturate(0.7);
`;

/** Fades the plate up from black on load, then rests over the ambient layer only. */
const Scrim = styled.div`
  ${layer}
  background-color: ${({ theme }) => theme.colors.background};
  opacity: 0.45;

  @media (prefers-reduced-motion: no-preference) {
    animation: ${fadeUp} 1.2s ${EASE} both;
  }
`;

const Band = styled(motion.div)`
  ${layer}
  -webkit-mask-image: linear-gradient(100deg, transparent 0 38%, black 47% 53%, transparent 62%);
  mask-image: linear-gradient(100deg, transparent 0 38%, black 47% 53%, transparent 62%);
  transform: translateX(${BAND_REST}%);

  @media ${PIN_QUERY} {
    transform: translateX(${BAND_START}%);
    will-change: transform;
  }
`;

const BandInner = styled(motion.div)`
  ${layer}
  ${coverImage}
  transform: translateX(${-BAND_REST}%);

  @media ${PIN_QUERY} {
    transform: translateX(${-BAND_START}%);
    will-change: transform;
  }
`;

/** The bottom rod. Rides the rising edge as the plate rolls up. */
const RodTrack = styled(motion.div)`
  position: absolute;
  top: 0;
  bottom: 0;
  left: -12px;
  right: -12px;
  pointer-events: none;

  @media ${PIN_QUERY} {
    will-change: transform;
  }
`;

const Rod = styled.span`
  position: absolute;
  left: 0;
  right: 0;
  bottom: -1px;
  height: 1px;
  background-color: ${({ theme }) => theme.colors.primary};
`;

export interface PlateStyles {
  box?: MotionStyle;
  roller?: MotionStyle;
  rollerInner?: MotionStyle;
  band?: MotionStyle;
  bandInner?: MotionStyle;
  rod?: MotionStyle;
}

interface HangingPlateProps {
  styles?: PlateStyles;
  className?: string;
}

export function HangingPlate({ styles, className }: HangingPlateProps) {
  return (
    // An atmospheric placeholder plate: decorative, so hidden from assistive tech
    <Box className={className} style={styles?.box} aria-hidden="true">
      <Roller style={styles?.roller}>
        <RollerInner style={styles?.rollerInner}>
          <Ambient>
            {/* The LCP element: visible from first paint, never faded from 0 */}
            <Image src={SRC} alt="" fill preload fetchPriority="high" sizes={PLATE_SIZES} />
          </Ambient>
          <Scrim />
          <Band style={styles?.band}>
            <BandInner style={styles?.bandInner}>
              {/* Same URL and sizes as the ambient layer, so it is one download */}
              <Image src={SRC} alt="" fill loading="eager" sizes={PLATE_SIZES} />
            </BandInner>
          </Band>
        </RollerInner>
      </Roller>
      <RodTrack style={styles?.rod}>
        <Rod />
      </RodTrack>
    </Box>
  );
}

/* ---------- Caption ---------- */

/* The load fade and the scroll-linked fade live on separate elements, so the
   CSS animation never competes with framer's inline style. */
const CaptionSlot = styled.div`
  @media (prefers-reduced-motion: no-preference) {
    animation: ${fadeIn} ${DUR.hero}s ${EASE} 500ms both;
  }
`;

const CaptionText = styled(motion.p)`
  ${captionText}
  margin: 0;
`;

export function HangingCaption({ style, className }: { style?: MotionStyle; className?: string }) {
  return (
    <CaptionSlot className={className} aria-hidden="true">
      <CaptionText style={style}>
        <PlateNo>Pl. I</PlateNo> <CaptionDot>·</CaptionDot> Placeholder plate
      </CaptionText>
    </CaptionSlot>
  );
}
