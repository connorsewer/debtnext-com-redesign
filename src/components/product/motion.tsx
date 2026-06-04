"use client";

import * as React from "react";
import {
  animate,
  motion,
  useInView,
  useReducedMotion,
  type Variants,
} from "framer-motion";

// ---- Timing + easing tokens (docs/product-visuals-system.md motion vocab) ----
export const EASE_ENTRANCE = [0.16, 1, 0.3, 1] as const; // calm ease-out
export const EASE_STATE = [0.2, 0.7, 0.2, 1] as const; // state / number shift
export const STAGGER = 0.06;
export const DUR_ITEM = 0.5;
export const DUR_BAR = 0.8;
export const DUR_COUNT = 1.0;
export const TINT = "#9CB4E8"; // --status-focus, number-shift tint
export const TEXT_DEFAULT = "#EDEDF3"; // --product-text

// ---- Entrance variants ----
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
