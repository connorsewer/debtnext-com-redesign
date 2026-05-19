"use client";

import * as React from "react";

import { track } from "@/lib/analytics";

/**
 * Fires scroll_depth events at 25/50/75/100% once per page per session.
 * Mount once in a page that should report scroll depth.
 */
export function ScrollDepthTracker() {
  React.useEffect(() => {
    const fired = new Set<number>();
    const thresholds = [25, 50, 75, 100] as const;

    function onScroll() {
      const doc = document.documentElement;
      const total = doc.scrollHeight - window.innerHeight;
      if (total <= 0) return;
      const pct = Math.min(100, Math.max(0, (window.scrollY / total) * 100));

      for (const t of thresholds) {
        if (!fired.has(t) && pct >= t) {
          fired.add(t);
          track({ event: "scroll_depth", depth: t });
        }
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return null;
}
