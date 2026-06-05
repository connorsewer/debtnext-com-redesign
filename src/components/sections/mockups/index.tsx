"use client";

/**
 * Per-tab mockup components used in HomepageHandoffSection. Each renders
 * the BARE inner content of a framed dashboard — the parent supplies one
 * shared FramedDashboard bezel so the bezel stays anchored across tab
 * switches and across the hero→Platform handoff.
 *
 * FND-06 LHCI TBT lever: the four mockups are heavy framer-motion product
 * visuals that sit BELOW the fold on `/` (and render all-at-once on mobile,
 * where the handoff section lists every tab). They are loaded via
 * next/dynamic({ ssr: false }) so their chunks stay out of the eager `/`
 * bundle and their hydration does not block the main thread during the
 * initial load window. The bezel (FramedDashboard) and the per-tab title
 * stay static so the layout and chrome render server-side with no shift.
 */

import dynamic from "next/dynamic";

import type { PlatformTab } from "@/content/homepage-hero";

export { FramedDashboard } from "./FramedDashboard";

// Titles are inlined here (not imported from the heavy mockup modules) so a
// static `import { ...Title }` cannot pull a mockup back into the eager chunk.
export const placementMockupTitle = "Placement run · 12:04 PM";
export const vendorPerformanceMockupTitle = "Vendor scorecard · YTD";
export const issuesMockupTitle = "Issues queue · all vendors";
export const reportingMockupTitle = "Liquidation trend · 8 weeks";

/** Holds the framed-dashboard inner area while a mockup chunk loads, so the
 *  bezel never collapses. Off-screen on mobile (below the fold), so no CLS. */
function MockupSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="min-h-[18rem] w-full animate-pulse rounded-[12px] bg-[var(--product-canvas)]"
    />
  );
}

// Each next/dynamic option object must be an inline literal (Turbopack static
// analysis), so the { ssr: false, loading } block is repeated per component.
const PlacementMockup = dynamic(
  () => import("./PlacementMockup").then((m) => m.PlacementMockup),
  { ssr: false, loading: MockupSkeleton },
);
const VendorPerformanceMockup = dynamic(
  () =>
    import("./VendorPerformanceMockup").then((m) => m.VendorPerformanceMockup),
  { ssr: false, loading: MockupSkeleton },
);
const IssuesMockup = dynamic(
  () => import("./IssuesMockup").then((m) => m.IssuesMockup),
  { ssr: false, loading: MockupSkeleton },
);
const ReportingMockup = dynamic(
  () => import("./ReportingMockup").then((m) => m.ReportingMockup),
  { ssr: false, loading: MockupSkeleton },
);

export function MockupForTab({ id }: { id: PlatformTab["id"] }) {
  switch (id) {
    case "placement":
      return <PlacementMockup />;
    case "performance":
      return <VendorPerformanceMockup />;
    case "issues":
      return <IssuesMockup />;
    case "reporting":
      return <ReportingMockup />;
  }
}

export function mockupTitleForTab(id: PlatformTab["id"]): string {
  switch (id) {
    case "placement":
      return placementMockupTitle;
    case "performance":
      return vendorPerformanceMockupTitle;
    case "issues":
      return issuesMockupTitle;
    case "reporting":
      return reportingMockupTitle;
  }
}
