"use client";

import * as React from "react";

import { track } from "@/lib/analytics";

const CTA_EVENTS = new Set(["cta_primary_click", "cta_secondary_click"]);

/**
 * Single delegated listener for CTA click analytics. Server-rendered links
 * carry `data-track-event` / `data-track-location` / `data-track-label`
 * attributes instead of per-component onClick handlers, so CTA sections
 * (FinalCTA, BenefitSplit, ProofBand, ...) can stay Server Components.
 * Mounted once in the root layout; renders nothing.
 */
export function ClickTracker() {
  React.useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const target = e.target instanceof Element ? e.target : null;
      const el = target?.closest<HTMLElement>("[data-track-event]");
      if (!el) return;
      const { trackEvent, trackLocation = "", trackLabel = "" } = el.dataset;
      if (!trackEvent || !CTA_EVENTS.has(trackEvent)) return;
      track({
        event: trackEvent as "cta_primary_click" | "cta_secondary_click",
        location: trackLocation,
        label: trackLabel,
      });
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);
  return null;
}
