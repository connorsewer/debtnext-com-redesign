// src/components/motion/PulseDot.tsx
// Motion type 2 (live data, status flavor): a small "live system" indicator dot
// with an expanding ping ring. Color comes from design tokens only (never hex).
//
// Reduced-motion contract (fail open): under prefers-reduced-motion the ping ring
// is dropped and a static dot renders. The CSS module also disables the ring via
// a reduced-motion media query as a second line of defense.
//
// Decorative by default (aria-hidden); the dot conveys no information a screen
// reader needs. Pass a label only if the dot is the sole carrier of state, in
// which case it is exposed via role="img" + aria-label.
"use client";

import * as React from "react";
import { useReducedMotion } from "framer-motion";
import styles from "./PulseDot.module.css";

type PulseTone = "indigo" | "success" | "warning" | "breach" | "special" | "focus";

const TONE_VAR: Record<PulseTone, string> = {
  indigo: "var(--primary)",
  success: "var(--status-success)",
  warning: "var(--status-warning)",
  breach: "var(--status-breach)",
  special: "var(--status-special)",
  focus: "var(--status-focus)",
};

interface PulseDotProps {
  /** Token-backed color. Defaults to the indigo primary. */
  tone?: PulseTone;
  /** Diameter of the solid dot in px. */
  size?: number;
  className?: string;
  /** Accessible label. When provided the dot is exposed as role="img". */
  label?: string;
  ref?: React.Ref<HTMLSpanElement>;
}

export function PulseDot({
  tone = "indigo",
  size = 8,
  className,
  label,
  ref,
}: PulseDotProps) {
  const reduce = useReducedMotion();
  const a11y = label
    ? { role: "img" as const, "aria-label": label }
    : { "aria-hidden": true as const };

  return (
    <span
      ref={ref}
      className={`${styles.root} ${className ?? ""}`}
      style={
        {
          width: size,
          height: size,
          "--pulse-color": TONE_VAR[tone],
        } as React.CSSProperties
      }
      {...a11y}
    >
      {!reduce && <span className={styles.ping} />}
      <span className={styles.dot} />
    </span>
  );
}
