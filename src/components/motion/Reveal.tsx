// src/components/motion/Reveal.tsx
// Motion type 1: scroll reveal (Framer). Stagger fade-up on scroll-into-view.
// Variants + inViewProps moved verbatim from src/components/product/motion.tsx;
// RevealStagger/RevealItem are thin named wrappers so consumers import a
// primitive rather than hand-rolling motion.div + variants per page.
//
// Reduced-motion contract (fail open): under prefers-reduced-motion the
// hidden variant's opacity:0 must never leave content stuck invisible. Framer's
// useReducedMotion disables transform/opacity transitions, so the show state is
// applied immediately; the wrappers below also force the visible state so a
// reveal that never scrolls into view still renders at opacity 1.
"use client";

import * as React from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { DUR_ITEM, EASE_ENTRANCE, STAGGER } from "./tokens";
import { useHydrated } from "./useHydrated";

// ---- Entrance variants (named exports kept for the 17 existing consumers) ----
export const staggerContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: STAGGER, delayChildren: 0.05 } },
};

export const fadeUpItem: Variants = {
  hidden: { opacity: 0, y: 8 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: DUR_ITEM, ease: EASE_ENTRANCE },
  },
};

export const popItem: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.35, ease: EASE_ENTRANCE },
  },
};

/**
 * Spread onto a motion stagger container to trigger on scroll-into-view.
 *
 * NOTE: this arms `initial: "hidden"` unconditionally, so the SSR markup ships
 * at opacity 0. Prefer `useInViewProps` for anything server-rendered: it holds
 * `initial` off until hydration so content is visible in the pre-hydration DOM
 * (fail open). This constant stays exported for the client-only visuals that
 * mount after user interaction and never SSR a hidden band.
 */
export const inViewProps = {
  initial: "hidden" as const,
  whileInView: "show" as const,
  viewport: { once: true, amount: 0.3 },
};

/**
 * Reduced-motion-aware, fail-open reveal props. Use instead of spreading
 * `inViewProps` directly on a motion element.
 *
 *  - prefers-reduced-motion: renders the element at its final "show" state
 *    immediately (never stuck at opacity:0).
 *  - SSR + first client render (not yet hydrated): omits `initial`, so the
 *    element renders at its natural visible resting state. Server HTML is never
 *    opacity 0, so crawlers, print, find-in-page, capture tools, and users who
 *    scroll before hydration all see the content.
 *  - after hydration: arms `initial: "hidden"` + `whileInView: "show"` with
 *    `once: true`. Below-viewport elements fade up on scroll-in; elements
 *    already on screen fade up once. Since the pre-hydration markup was already
 *    visible, above-fold content does a single clean entrance, not a flicker.
 */
export function useInViewProps() {
  const reduce = useReducedMotion();
  const hydrated = useHydrated();
  if (reduce) {
    return { initial: "show" as const, animate: "show" as const };
  }
  if (!hydrated) {
    // No `initial`: element paints at its resting (visible) state. `whileInView`
    // still arms the scroll reveal once hydration re-renders with `initial`.
    return {
      whileInView: "show" as const,
      viewport: { once: true, amount: 0.3 },
    };
  }
  return inViewProps;
}

type DivProps = React.ComponentPropsWithoutRef<typeof motion.div>;

/**
 * Stagger container that fades its children up as it scrolls into view.
 * Under reduced motion it renders straight to the "show" state (fail open).
 */
export function RevealStagger({ children, ...rest }: DivProps) {
  const reveal = useInViewProps();
  return (
    <motion.div variants={staggerContainer} {...reveal} {...rest}>
      {children}
    </motion.div>
  );
}

/**
 * Single fade-up item, meant as a child of RevealStagger. Under reduced motion
 * it renders at opacity 1 with no transform (fail open).
 *
 * In every non-reduced case the item carries only `variants` and inherits its
 * animation state from the RevealStagger container: pre-hydration the container
 * has no `initial`, so the item paints at its visible resting state; once the
 * container arms `initial="hidden"` after hydration, the item inherits "hidden"
 * and reveals on scroll-in. The item must not set its own `initial`, or it
 * would break that inheritance (and could ship hidden while the container is
 * visible). So the fail-open behavior lives entirely on the container.
 */
export function RevealItem({ children, ...rest }: DivProps) {
  const reduce = useReducedMotion();
  if (reduce) {
    return (
      <motion.div variants={fadeUpItem} initial="show" animate="show" {...rest}>
        {children}
      </motion.div>
    );
  }
  return (
    <motion.div variants={fadeUpItem} {...rest}>
      {children}
    </motion.div>
  );
}
