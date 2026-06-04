"use client";

import * as React from "react";
import dynamic from "next/dynamic";

export type AccordionVisualId =
  | "placement"
  | "optimization"
  | "issues"
  | "reporting"
  | "compliance";

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
    () => import("./PlacementMatrix").then((m) => m.PlacementMatrix),
    { ssr: false, loading: Fallback },
  ),
  optimization: dynamic(
    () => import("./OptimizationEngine").then((m) => m.OptimizationEngine),
    { ssr: false, loading: Fallback },
  ),
  issues: dynamic(
    () => import("./IssuesWorklist").then((m) => m.IssuesWorklist),
    { ssr: false, loading: Fallback },
  ),
  reporting: dynamic(
    () => import("./ReportingDashboard").then((m) => m.ReportingDashboard),
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
