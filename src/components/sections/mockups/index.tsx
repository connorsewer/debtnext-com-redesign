/**
 * Per-tab mockup components used in HomepageHandoffSection. Each renders
 * the BARE inner content of a framed dashboard — the parent supplies one
 * shared FramedDashboard bezel so the bezel stays anchored across tab
 * switches and across the hero→Platform handoff.
 */

export { FramedDashboard } from "./FramedDashboard";
export {
  PlacementMockup,
  placementMockupTitle,
} from "./PlacementMockup";
export {
  VendorPerformanceMockup,
  vendorPerformanceMockupTitle,
} from "./VendorPerformanceMockup";
export {
  IssuesMockup,
  issuesMockupTitle,
} from "./IssuesMockup";
export {
  ReportingMockup,
  reportingMockupTitle,
} from "./ReportingMockup";

import type { PlatformTab } from "@/content/homepage-hero";
import { Console } from "@/components/product/visuals/Console";
import {
  handoffPlacementConsole,
  handoffPerformanceConsole,
  handoffIssuesConsole,
  handoffReportingConsole,
} from "@/content/visuals";
import { placementMockupTitle } from "./PlacementMockup";
import { vendorPerformanceMockupTitle } from "./VendorPerformanceMockup";
import { issuesMockupTitle } from "./IssuesMockup";
import { reportingMockupTitle } from "./ReportingMockup";

export function MockupForTab({ id }: { id: PlatformTab["id"] }) {
  switch (id) {
    case "placement":
      return <Console bare data={handoffPlacementConsole} />;
    case "performance":
      return <Console bare data={handoffPerformanceConsole} />;
    case "issues":
      return <Console bare data={handoffIssuesConsole} />;
    case "reporting":
      return <Console bare data={handoffReportingConsole} />;
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
