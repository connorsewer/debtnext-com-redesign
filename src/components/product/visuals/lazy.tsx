"use client";

import * as React from "react";
import dynamic from "next/dynamic";

/** Lightweight skeleton shown while a product visual chunk loads. Holds the
 *  dark canvas shape so there's no layout shift on hydration. */
function VisualSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="min-h-[22rem] w-full animate-pulse rounded-[16px] bg-[var(--product-canvas)]"
    />
  );
}

// Each next/dynamic option object must be an inline literal (Turbopack static
// analysis), so the { ssr: false, loading } block is repeated per component.
export const LazyDecisionEnginePreview = dynamic(
  () => import("./DecisionEnginePreview").then((m) => m.DecisionEnginePreview),
  { ssr: false, loading: VisualSkeleton },
);

export const LazyPlatformSystemMap = dynamic(
  () => import("./PlatformSystemMap").then((m) => m.PlatformSystemMap),
  { ssr: false, loading: VisualSkeleton },
);

export const LazySolutionsIndustryCards = dynamic(
  () => import("./SolutionsIndustryCards").then((m) => m.SolutionsIndustryCards),
  { ssr: false, loading: VisualSkeleton },
);

export const LazyPlacementMatrix = dynamic(
  () => import("./PlacementMatrix").then((m) => m.PlacementMatrix),
  { ssr: false, loading: VisualSkeleton },
);

export const LazyOptimizationEngine = dynamic(
  () => import("./OptimizationEngine").then((m) => m.OptimizationEngine),
  { ssr: false, loading: VisualSkeleton },
);

export const LazyIssuesWorklist = dynamic(
  () => import("./IssuesWorklist").then((m) => m.IssuesWorklist),
  { ssr: false, loading: VisualSkeleton },
);

export const LazyReportingDashboard = dynamic(
  () => import("./ReportingDashboard").then((m) => m.ReportingDashboard),
  { ssr: false, loading: VisualSkeleton },
);
