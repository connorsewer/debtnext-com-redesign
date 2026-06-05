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

// CLS-SKELETON (Pitfall 4, locked in 11-01 for Wave 2 to copy):
// The placement flagship resolves to a TALL composite box (Console rows + the
// tier-inspect panel), much taller than the 22rem accordion-visual default. Its
// skeleton reserves min-h-[44rem] so the lazy chunk resolves with no layout
// shift. Wave 2 flagships (optimization / issues / reporting) copy this 44rem box
// rather than guessing. The accordion-archetype visuals keep the shared 20rem
// VisualSkeleton in archetypes.tsx; this constant is only for the BenefitSplit
// flagship box. Proven against the /platform/placement CLS gate (Task 6).
const FLAGSHIP_SKELETON_MIN_H = "min-h-[44rem]"; // 704px reserved box
function FlagshipSkeleton() {
  return (
    <div
      aria-hidden="true"
      className={`${FLAGSHIP_SKELETON_MIN_H} w-full animate-pulse rounded-[16px] bg-[var(--product-canvas)]`}
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

// Placement explorable flagship (PLATVIS-02). Uses the taller FlagshipSkeleton so
// the resolved Console + tier-inspect box reserves its height and the lazy swap is
// CLS-free. Inline-literal options per Turbopack static-analysis.
export const LazyPlacementFlagship = dynamic(
  () => import("./PlacementFlagship").then((m) => m.PlacementFlagship),
  { ssr: false, loading: FlagshipSkeleton },
);
