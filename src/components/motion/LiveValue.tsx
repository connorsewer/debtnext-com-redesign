// src/components/motion/LiveValue.tsx
// Motion type 2: live data (Framer). AnimatedNumber + NumberShift moved verbatim
// from src/components/product/motion.tsx. `LiveValue` is the new preferred name
// (alias of AnimatedNumber); the AnimatedNumber export stays so the shim and the
// 17 existing consumers compile unchanged.
//
// Reduced-motion contract (fail open): AnimatedNumber early-returns the final
// formatted value under prefers-reduced-motion; NumberShift renders the static
// string. Content is never stuck mid-count or at opacity:0.
"use client";

import * as React from "react";
import { animate, motion, useInView, useReducedMotion } from "framer-motion";
import { DUR_COUNT, EASE_ENTRANCE, EASE_STATE, TEXT_DEFAULT, TINT } from "./tokens";

/** Count a number up from 0 when it scrolls into view. tabular-nums keeps
 *  width stable. Reduced motion renders the final value immediately. */
export function AnimatedNumber({
  value,
  prefix = "",
  suffix = "",
  decimals = 0,
  className,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const ref = React.useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });

  const format = React.useCallback(
    (n: number) =>
      `${prefix}${n.toLocaleString("en-US", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}${suffix}`,
    [prefix, suffix, decimals],
  );

  React.useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (reduce) {
      node.textContent = format(value);
      return;
    }
    if (!inView) {
      node.textContent = format(0);
      return;
    }
    const controls = animate(0, value, {
      duration: DUR_COUNT,
      ease: EASE_ENTRANCE,
      onUpdate: (v) => {
        node.textContent = format(v);
      },
    });
    return () => controls.stop();
  }, [value, reduce, inView, format]);

  return (
    <span
      ref={ref}
      className={className}
      style={{ fontVariantNumeric: "tabular-nums" }}
    >
      {format(reduce ? value : 0)}
    </span>
  );
}

/** New preferred name for the live-data primitive. */
export { AnimatedNumber as LiveValue };

/** For composite/formatted values that read awkwardly counting up
 *  ($847.2M, "42% → 47%"). Renders the static string but tints from the
 *  focus color to the default text color on entrance. */
export function NumberShift({
  children,
  color = TEXT_DEFAULT,
  className,
}: {
  children: React.ReactNode;
  color?: string;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const ref = React.useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  if (reduce) return <span className={className}>{children}</span>;
  return (
    <motion.span
      ref={ref}
      className={className}
      initial={{ color: TINT }}
      animate={{ color: inView ? color : TINT }}
      transition={{ duration: DUR_COUNT, ease: EASE_STATE }}
    >
      {children}
    </motion.span>
  );
}
