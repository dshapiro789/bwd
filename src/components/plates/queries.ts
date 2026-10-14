// Layout and motion gates shared by the hero, the About diptych and the
// chapter marks. CSS media rules and useMediaQuery read the same strings, so
// the server-rendered layout and the client's scroll wiring can never disagree.

/** The hero pins and plays its runway only where there is room and motion is welcome. */
export const PIN_QUERY =
  '(min-width: 1024px) and (min-height: 700px) and (prefers-reduced-motion: no-preference)';

/** From here the hero and the About diptych sit in two columns instead of stacking. */
export const SPLIT_QUERY = '(min-width: 768px)';
