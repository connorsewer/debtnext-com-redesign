"use client";

import * as React from "react";
import dynamic from "next/dynamic";

export const ACCORDION_VISUAL_IDS = [
  "placement",
  "optimization",
  "issues",
  "reporting",
  "compliance",
] as const;

export type AccordionVisualId = (typeof ACCORDION_VISUAL_IDS)[number];

/** Type guard: only the homepage feature accordion uses these ids. Other
 *  pages share FeatureAccordion with different ids and must NOT render a
 *  product visual (they keep the original placeholder). */
export function isAccordionVisualId(id: string): id is AccordionVisualId {
  return (ACCORDION_VISUAL_IDS as readonly string[]).includes(id);
}

function Fallback() {
  return (
    <div
      aria-hidden="true"
      className="h-full min-h-[20rem] w-full rounded-[16px] bg-[var(--product-canvas)]"
    />
  );
}

// next/dynamic options must be an inline object literal (Turbopack static
// analysis requirement), so each call repeats { ssr: false, loading }.
// The accordion renders the Console HALF of each platform flagship only; the
// Explorable inspect panel stays on the /platform/* deep-dive pages. Mounting
// the full *Flagship here stacked two visuals per item (Connor, 2026-07-02).
const VISUALS: Record<AccordionVisualId, React.ComponentType> = {
  placement: dynamic(
    () =>
      import("./accordion-consoles").then((m) => m.PlacementAccordionConsole),
    { ssr: false, loading: Fallback },
  ),
  optimization: dynamic(
    () =>
      import("./accordion-consoles").then(
        (m) => m.OptimizationAccordionConsole,
      ),
    { ssr: false, loading: Fallback },
  ),
  issues: dynamic(
    () => import("./accordion-consoles").then((m) => m.IssuesAccordionConsole),
    { ssr: false, loading: Fallback },
  ),
  reporting: dynamic(
    () =>
      import("./accordion-consoles").then((m) => m.ReportingAccordionConsole),
    { ssr: false, loading: Fallback },
  ),
  compliance: dynamic(
    () => import("./ComplianceStandards").then((m) => m.ComplianceStandards),
    { ssr: false, loading: Fallback },
  ),
};

export function AccordionVisual({ id }: { id: AccordionVisualId }) {
  const Cmp = VISUALS[id];
  return <Cmp />;
}
