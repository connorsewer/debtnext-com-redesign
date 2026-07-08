"use client";

import * as React from "react";

import { useCssReveal } from "@/components/motion/useCssReveal";

export interface RevealSectionProps {
  children: React.ReactNode;
  /** Stagger entrance by a small delay when several reveals sit close together. */
  delay?: number;
}

/**
 * Scroll-reveal wrapper for otherwise-static section bands. A single
 * fade-and-rise on first intersection, matching the entrance curve used by
 * ProofBand and the product visuals (DESIGN.md motion guidance: fade-ins
 * only, restrained).
 *
 * CSS-driven (globals.css `[data-reveal]`): this leaf only arms the reveal
 * after mount, so the children stay untouched Server Component output — no
 * framer-motion on the route and no hydration of the section markup.
 *
 * Fails open: SSR/no-JS render the children visible (the hidden state is
 * armed client-side only), and reduced-motion users never get armed at all.
 */
export function RevealSection({ children, delay = 0 }: RevealSectionProps) {
  const ref = useCssReveal<HTMLDivElement>("data-reveal", "-12% 0px", 0);
  return (
    <div
      ref={ref}
      style={
        delay
          ? ({ "--reveal-delay": `${delay}s` } as React.CSSProperties)
          : undefined
      }
    >
      {children}
    </div>
  );
}
