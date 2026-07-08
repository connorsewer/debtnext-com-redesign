"use client";

import * as React from "react";

export interface CountUpProps {
  to: number;
  className?: string;
  durationMs?: number;
  /** Rendered before the number (e.g. "$"). */
  prefix?: string;
  /** Rendered after the number (e.g. "M", "B+", "+"). */
  suffix?: string;
  /** Fixed decimal places. Defaults to 0 (integer). */
  decimals?: number;
}

/**
 * Counts up to `to` when scrolled into view. Renders the final value during
 * SSR (so no-JS and reduced-motion users see the real number), then animates
 * from zero on the client. Supports prefix/suffix/decimals so composite figures
 * like "$1B+" or "100M+" animate while keeping their formatting. Used by
 * PartnerMap's stat row and the homepage proof band.
 */
export function CountUp({
  to,
  className,
  durationMs = 1600,
  prefix = "",
  suffix = "",
  decimals = 0,
}: CountUpProps) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const [value, setValue] = React.useState(to);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        io.disconnect();
        const start = performance.now();
        // First rAF frame computes value at p≈0, so no synchronous reset needed.
        const step = (now: number) => {
          const p = Math.min((now - start) / durationMs, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          setValue(to * eased);
          if (p < 1) raf = requestAnimationFrame(step);
        };
        raf = requestAnimationFrame(step);
      },
      { rootMargin: "-10% 0px" },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [to, durationMs]);

  const formatted = value.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return (
    <span ref={ref} className={className}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}
