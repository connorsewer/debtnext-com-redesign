"use client";

import * as React from "react";
import { useInView, useReducedMotion } from "framer-motion";

export interface CountUpProps {
  to: number;
  className?: string;
  durationMs?: number;
}

/**
 * Counts up to `to` when scrolled into view. Renders the final value during
 * SSR (so no-JS and reduced-motion users see the real number), then animates
 * from zero on the client. Used by PartnerMap's stat row.
 */
export function CountUp({ to, className, durationMs = 1600 }: CountUpProps) {
  const reduce = useReducedMotion();
  const ref = React.useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const [value, setValue] = React.useState(to);

  React.useEffect(() => {
    if (reduce || !inView) return;
    let raf = 0;
    const start = performance.now();
    setValue(0);
    const step = (now: number) => {
      const p = Math.min((now - start) / durationMs, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(to * eased));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduce, to, durationMs]);

  return (
    <span ref={ref} className={className}>
      {value.toLocaleString()}
    </span>
  );
}
