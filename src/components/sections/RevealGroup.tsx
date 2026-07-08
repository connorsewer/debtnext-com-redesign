"use client";

import * as React from "react";

import { useCssReveal } from "@/components/motion/useCssReveal";

export interface RevealGroupProps {
  /** Element the group renders as; lists keep their semantic tag. */
  as?: "ul" | "ol" | "div";
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
  /** Portion of the group that must be visible before the reveal fires. */
  threshold?: number;
}

/**
 * Staggered scroll-reveal container. The (server-rendered) children stay
 * untouched RSC output; this thin client wrapper only arms the CSS reveal on
 * the group element. Per-child stagger comes from the `--reveal-i` custom
 * property the server parent sets on each child (globals.css).
 */
export function RevealGroup({
  as: As = "div",
  className,
  style,
  children,
  threshold = 0.15,
}: RevealGroupProps) {
  const ref = useCssReveal<HTMLElement>("data-reveal-group", "0px", threshold);
  return React.createElement(As, { ref, className, style }, children);
}
