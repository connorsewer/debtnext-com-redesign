"use client";

import * as React from "react";

/**
 * Matches the cinematic hero's mobile gate. Components that need to swap
 * out GSAP-driven layouts on phones should use this hook to render a
 * structurally simpler tree.
 */
export function useIsMobile(query: string = "(max-width: 767px)"): boolean {
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const mq = window.matchMedia(query);
    const handler = () => setIsMobile(mq.matches);
    handler();
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [query]);

  return isMobile;
}
