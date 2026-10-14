'use client';

import styled, { css } from 'styled-components';

/*
 * Plates are the page's image grammar: square corners, a 1px bone hairline at
 * 12%, and a caption set like an art-book plate ("Pl. II a · Name, Role").
 */

/** The 1px bone hairline, drawn above the image so overlays never hide it. */
export const plateHairline = css`
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    box-shadow: inset 0 0 0 1px
      ${({ theme }) => `color-mix(in srgb, ${theme.colors.text} 12%, transparent)`};
    pointer-events: none;
  }
`;

/** A 4:5 frame for one image layer stack. Children are absolutely positioned. */
export const PlateFrame = styled.div`
  position: relative;
  aspect-ratio: 4 / 5;
  overflow: clip;
  background-color: ${({ theme }) => theme.colors.surface};
  ${plateHairline}
`;

/** Inter caption style shared by every plate caption. */
export const captionText = css`
  font-family: ${({ theme }) => theme.fonts.main};
  font-size: 0.75rem;
  font-weight: 400;
  line-height: 1.6;
  letter-spacing: 0.04em;
  color: ${({ theme }) => theme.colors.textSecondary};
  /* No one-word last lines where the browser supports it */
  text-wrap: pretty;
`;

export const PlateCaption = styled.figcaption`
  ${captionText}
  margin: 0;
`;

/** "Pl. II a": the plate number, in bronze, before the description. */
export const PlateNo = styled.span`
  color: ${({ theme }) => theme.colors.primary};
  letter-spacing: 0.08em;
`;

/** Separator dot. Put real spaces either side of it in the markup. */
export const CaptionDot = styled.span.attrs({ 'aria-hidden': true })`
  color: ${({ theme }) => theme.colors.primary};
  margin: 0 0.2em;
`;
