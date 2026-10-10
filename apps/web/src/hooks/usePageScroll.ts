'use client';

import { useSpring, useTransform, useScroll } from 'framer-motion';

/**
 * Returns scroll-driven motion values bound to the window. `scrollY` is bound
 * to `window.scrollY` automatically, so parallax and stagger logic behaves
 * correctly on both client and server (SSR) navigation.
 */
export function usePageScroll() {
  const scrollY = useScroll();
  const springY = useSpring(scrollY.scrollY, { stiffness: 120, damping: 30 });
  const y = useTransform(springY, (v) => Math.max(0, v));

  return { scrollY: y, raw: scrollY };
}
