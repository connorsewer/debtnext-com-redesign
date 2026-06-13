/**
 * Stable facade for the homepage handoff dashboards (Phase 13 / SYSVIS-01).
 *
 * MockupForTab renders the BARE inner content for each platform tab as a Console
 * archetype instance fed a typed payload (src/content/visuals/handoff-*.ts); the
 * parent (HomepageHandoffSection / HomepageHero) supplies one shared
 * FramedDashboard bezel so the bezel stays anchored across tab switches and across
 * the hero->Platform handoff. The 4 bespoke per-tab mockup files were retired in
 * Phase 13 once parity held; this facade keeps the byte-identical public surface
 * the firewall depends on: MockupForTab, mockupTitleForTab, and the FramedDashboard
 * re-export. The chrome titles below feed FramedDashboard's window-chrome label and
 * are independent of each Console's in-canvas header.
 */

export { FramedDashboard } from "./FramedDashboard";

import type { PlatformTab } from "@/content/homepage-hero";
import { Console } from "@/components/product/visuals/Console";
import {
  handoffPlacementConsole,
  handoffPerformanceConsole,
  handoffIssuesConsole,
  handoffReportingConsole,
} from "@/content/visuals";

const placementMockupTitle = "Placement run · 12:04 PM";
const vendorPerformanceMockupTitle = "Vendor scorecard · YTD";
const issuesMockupTitle = "Issues queue · all vendors";
const reportingMockupTitle = "Liquidation trend · 8 weeks";

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
