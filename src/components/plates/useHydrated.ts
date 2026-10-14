'use client';

import { useSyncExternalStore } from 'react';

const subscribe = () => () => {};

/**
 * False on the server and during hydration, true after. Scroll-linked styles
 * attach only once this is true, so the server HTML carries no inline
 * transforms and CSS alone sets each layout's resting frame.
 */
export function useHydrated() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  );
}
