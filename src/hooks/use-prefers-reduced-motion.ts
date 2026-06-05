"use client";

import * as React from "react";

/**
 * Framer-free replacement for framer-motion's `useReducedMotion`. Mirrors the
 * `use-is-mobile` hook so reduced-motion gating no longer pulls framer-motion
 * into the eager `/` chunk (FND-06 TBT lever). Returns false on the server and
 * first client render (matching framer), then resolves the live media query.
 */
export function usePrefersReducedMotion(): boolean {
  const [reduce, setReduce] = React.useState(false);

  React.useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = () => setReduce(mq.matches);
    handler();
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return reduce;
}
