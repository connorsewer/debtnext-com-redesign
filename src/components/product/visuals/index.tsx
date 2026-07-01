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
const VISUALS: Record<AccordionVisualId, React.ComponentType> = {
  placement: dynamic(
    () => import("./PlacementFlagship").then((m) => m.PlacementFlagship),
    { ssr: false, loading: Fallback },
  ),
  optimization: dynamic(
    () => import("./OptimizationFlagship").then((m) => m.OptimizationFlagship),
    { ssr: false, loading: Fallback },
  ),
  issues: dynamic(
    () => import("./IssuesFlagship").then((m) => m.IssuesFlagship),
    { ssr: false, loading: Fallback },
  ),
  reporting: dynamic(
    () => import("./ReportingFlagship").then((m) => m.ReportingFlagship),
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
