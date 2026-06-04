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

const opts = { ssr: false, loading: Fallback } as const;

const VISUALS: Record<AccordionVisualId, React.ComponentType> = {
  placement: dynamic(
    () => import("./PlacementMatrix").then((m) => m.PlacementMatrix),
    opts,
  ),
  optimization: dynamic(
    () => import("./OptimizationEngine").then((m) => m.OptimizationEngine),
    opts,
  ),
  issues: dynamic(
    () => import("./IssuesWorklist").then((m) => m.IssuesWorklist),
    opts,
  ),
  reporting: dynamic(
    () => import("./ReportingDashboard").then((m) => m.ReportingDashboard),
    opts,
  ),
  compliance: dynamic(
    () => import("./ComplianceStandards").then((m) => m.ComplianceStandards),
    opts,
  ),
};

export function AccordionVisual({ id }: { id: AccordionVisualId }) {
  const Cmp = VISUALS[id];
  return <Cmp />;
}
