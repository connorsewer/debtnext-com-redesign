"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";

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
 */
export function RevealSection({ children, delay = 0 }: RevealSectionProps) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) return <>{children}</>;

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
