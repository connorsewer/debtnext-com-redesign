// src/components/motion/LiveValue.tsx
// Motion type 2: live data (Framer). AnimatedNumber + NumberShift moved verbatim
// from src/components/product/motion.tsx. `LiveValue` is the new preferred name
// (alias of AnimatedNumber); the AnimatedNumber export stays so the shim and the
// 17 existing consumers compile unchanged.
//
// Reduced-motion contract (fail open): AnimatedNumber early-returns the final
// formatted value under prefers-reduced-motion; NumberShift renders the static
// string. Content is never stuck mid-count or at opacity:0.
//
// SSR contract (fail open): the final formatted value is the server-rendered
// text. The count-up from zero is a post-hydration enhancement only, so a
// crawler, a capture tool, or a user who reads the number before hydration sees
// the real figure, never a 0.
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
    // Fail open: the count-up runs only as a post-hydration enhancement, and
    // only once the element scrolls into view. Until then the node keeps the
    // final value it was server-rendered with, so it is never captured at 0.
    if (reduce || !inView) return;
    // Reset to 0 synchronously here (not in render), so the first animated
    // frame starts from zero without ever server-rendering a 0.
    node.textContent = format(0);
    const controls = animate(0, value, {
      duration: DUR_COUNT,
      ease: EASE_ENTRANCE,
      onUpdate: (v) => {
        node.textContent = format(v);
      },
    });
    return () => controls.stop();
  }, [value, reduce, inView, format]);

  // Always render the final value as the SSR / pre-hydration text. The effect
  // above (post-mount, on scroll-into-view) is what swaps in the count-up.
  return (
    <span
      ref={ref}
      className={className}
      style={{ fontVariantNumeric: "tabular-nums" }}
    >
      {format(value)}
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
