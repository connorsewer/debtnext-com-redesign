"use client";

import * as React from "react";

import { RevealOnView } from "@/components/motion/css-reveal";

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
 * FND-06 framer-free: the wrapper observes itself via RevealOnView and the
 * visual transition is pure CSS (`.dn-reveal`). Reduced motion is handled in
 * CSS, which forces the rested, fully-visible state, so the section never
 * ships blank. The optional `delay` reuses the per-child stagger custom
 * property consumed by `.dn-reveal`.
 */
export function RevealSection({ children, delay = 0 }: RevealSectionProps) {
  return (
    <RevealOnView
      className="dn-reveal"
      margin="-12% 0px"
      style={{ ["--dn-reveal-i" as string]: delay } as React.CSSProperties}
    >
      {children}
    </RevealOnView>
  );
}
