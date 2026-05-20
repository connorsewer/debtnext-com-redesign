/**
 * Per-tab mockup components used in HomepageHandoffSection (and
 * potentially other capability surfaces later). Each is a self-contained
 * CSS/SVG composition that conveys the active tab's capability without
 * leaning on the full dashboard PNG.
 */

export { FramedDashboard } from "./FramedDashboard";
export { PlacementMockup } from "./PlacementMockup";
export { VendorPerformanceMockup } from "./VendorPerformanceMockup";
export { IssuesMockup } from "./IssuesMockup";
export { ReportingMockup } from "./ReportingMockup";

import type { PlatformTab } from "@/content/homepage-hero";
import { PlacementMockup } from "./PlacementMockup";
import { VendorPerformanceMockup } from "./VendorPerformanceMockup";
import { IssuesMockup } from "./IssuesMockup";
import { ReportingMockup } from "./ReportingMockup";

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
