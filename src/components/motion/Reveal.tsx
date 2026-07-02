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

/** Spread onto a motion stagger container to trigger on scroll-into-view. */
export const inViewProps = {
  initial: "hidden" as const,
  whileInView: "show" as const,
  viewport: { once: true, amount: 0.3 },
};

/**
 * Reduced-motion-aware reveal props. Use instead of spreading `inViewProps`
 * directly on a motion element: under prefers-reduced-motion it renders the
 * element at its final "show" state (fail open, never stuck at opacity:0).
 */
export function useInViewProps() {
  const reduce = useReducedMotion();
  return reduce
    ? { initial: "show" as const, animate: "show" as const }
    : inViewProps;
}

type DivProps = React.ComponentPropsWithRef<typeof motion.div>;

/**
 * Stagger container that fades its children up as it scrolls into view.
 * Under reduced motion it renders straight to the "show" state (fail open).
 */
export function RevealStagger({ children, ...rest }: DivProps) {
  const reduce = useReducedMotion();
  if (reduce) {
    return (
      <motion.div variants={staggerContainer} initial="show" animate="show" {...rest}>
        {children}
      </motion.div>
    );
  }
  return (
    <motion.div variants={staggerContainer} {...inViewProps} {...rest}>
      {children}
    </motion.div>
  );
}

/**
 * Single fade-up item, meant as a child of RevealStagger. Under reduced motion
 * it renders at opacity 1 with no transform.
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
