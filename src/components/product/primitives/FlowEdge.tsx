"use client";

// PROVISIONAL (A2): there is no existing schematic implementation to extract
// from; SchematicData is MEDIUM confidence. Harden this shape in Phase 11
// against PlatformSystemMap.tsx + the real "how it works" data before locking it.

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";

import { DUR_BAR, EASE_ENTRANCE } from "@/components/product/motion";

export interface FlowEdgePoint {
  x: number;
  y: number;
}

export interface FlowEdgeProps {
  /** Explicit SVG path data. Takes precedence over from/to when supplied. */
  d?: string;
  /** Endpoint geometry (used to build a straight path when `d` is absent). */
  from?: FlowEdgePoint;
  to?: FlowEdgePoint;
  /** Optional text label for a meaningful edge (drives aria-label). */
  label?: string;
  /** When true (and motion is allowed), animate data traveling along the edge. */
  flow?: boolean;
  className?: string;
}

/**
 * Schematic edge atom — an SVG `<path>` connecting two nodes. When `flow` is set
 * and motion is allowed, it animates `strokeDashoffset` (the AreaLine pathLength
 * model, compositor-safe) so data appears to travel along the edge; under reduced
 * motion it renders the static path (Pitfall 5 / T-10-06).
 *
 * CSS strokeDashoffset is the default engine. If GSAP-driven flow is ever needed
 * it must stay desktop-only + lazy (engine-per-job); the mobile-GSAP-free spec
 * (10-01) guards it. No GSAP is imported here.
 *
 * Must be rendered inside an <svg>. Decorative by default; a `label` makes it
 * meaningful and adds an aria-label.
 */
export const FlowEdge = React.memo(function FlowEdge({
  d,
  from,
  to,
  label,
  flow = false,
  className,
}: FlowEdgeProps) {
  const reduce = useReducedMotion();
  const path =
    d ?? (from && to ? `M${from.x},${from.y} L${to.x},${to.y}` : undefined);
  if (!path) return null;

  const animated = flow && !reduce;
  const a11y = label
    ? ({ role: "img", "aria-label": label } as const)
    : ({ "aria-hidden": true } as const);

  return (
    <g {...a11y}>
      {/* Base edge — always visible. */}
      <path
        d={path}
        className={className}
        fill="none"
        stroke="color-mix(in srgb, var(--primary) 35%, transparent)"
        strokeWidth="1.5"
        vectorEffect="non-scaling-stroke"
      />
      {/* Flow overlay — a dash that travels via strokeDashoffset (compositor-safe). */}
      {animated ? (
        <motion.path
          d={path}
          fill="none"
          stroke="var(--primary)"
          strokeWidth="1.5"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          strokeDasharray="6 18"
          initial={{ strokeDashoffset: 24 }}
          animate={{ strokeDashoffset: 0 }}
          transition={{
            duration: DUR_BAR * 2,
            ease: EASE_ENTRANCE,
            repeat: Infinity,
          }}
        />
      ) : null}
    </g>
  );
});
