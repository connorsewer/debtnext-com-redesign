"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";

import { useHydrated } from "@/components/motion/useHydrated";

export interface RevealSectionProps {
  children: React.ReactNode;
  /** Stagger entrance by a small delay when several reveals sit close together. */
  delay?: number;
}

/**
 * Scroll-reveal wrapper for the otherwise-static section bands on the
 * /solutions child pages. A single fade-and-rise on first intersection,
 * matching the entrance curve used by ProofBand and the product visuals
 * (DESIGN.md motion guidance: fade-ins only, restrained).
 *
 * Respects prefers-reduced-motion: the wrapper renders its children
 * untouched, so content is fully visible with no transform under that
 * setting (and the section never ships blank).
 *
 * Fails open on SSR: the `opacity:0` initial state is armed only after the
 * client hydrates. Server-rendered HTML (and the pre-hydration DOM) renders the
 * children untouched at opacity 1, so a fast scroll before hydration, a
 * crawler, print, or a capture tool never sees a blank band. Once hydrated the
 * wrapper arms `initial`, so below-viewport sections fade up on scroll-in and
 * an above-fold section does a single clean entrance from its already-visible
 * resting state.
 */
export function RevealSection({ children, delay = 0 }: RevealSectionProps) {
  const reduceMotion = useReducedMotion();
  const hydrated = useHydrated();

  // Reduced motion, and the SSR + first client render, both render children
  // untouched (visible). Only arm the reveal once JS is confirmed in control.
  if (reduceMotion || !hydrated) return <>{children}</>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-12% 0px" }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay }}
    >
      {children}
    </motion.div>
  );
}
