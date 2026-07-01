/**
 * Handoff reporting-tab Console payload (Phase 13 / SYSVIS-01).
 *
 * Mapped from src/components/sections/mockups/ReportingMockup.tsx so the homepage
 * handoff's reporting tab renders a Console archetype instance (bare, inside
 * FramedDashboard) instead of the bespoke mockup.
 *
 * D-04 decision (Plan 03 Task 3): Console-with-KPIs, NOT a DataStory exception.
 * D-04 locks a Console-archetype instance for all 4 tabs; a scoped DataStory
 * exception for reporting's dual-line 8-week trend was NOT approved this run, so
 * the trend is rendered the closest D-04-compliant way: the three summary tiles
 * become a Net-back header KPI plus Inventory and Liquidation rows, and the 8-week
 * direction is stated in row `secondary` and the ariaSummary as TEXT ("up across 8
 * weeks") rather than a polyline. RESEARCH Open Question 1 flagged that this drops
 * the literal trend line; the trade is recorded in the DEFERRED HUMAN-VERIFY list
 * for Connor's preview judgment (DataStory exception is the fallback if it reads
 * weak, but it is never taken without explicit approval).
 *
 * `satisfies ConsoleData` proves the mapping fits the schema. There are zero hex
 * literals in this module by design.
 *
 * The FramedDashboard chrome title ("Liquidation trend . 8 weeks") is supplied
 * separately by mockupTitleForTab and is NOT part of this in-canvas payload.
 */

import type { ConsoleData } from "./types";

// [CLAIMS REVIEW] inventory, liquidation, and net-back figures are governed copy
// mirrored from the existing ReportingMockup wording; real-shaped anonymized
// figures only, Andrew sign-off tracked for audit (non-blocking per 2026-06
// pre-clearance).
// [COI REVIEW] reporting framing references the originator's recovery program
// outcomes. Language stays agency-network-agnostic (the program spans the
// customer's existing vendor network); confirm framing with Andrew.
export const handoffReportingConsole = {
  header: {
    title: "Liquidation trend",
    kpi: {
      caption: "Net-back",
      value: 68.2,
      valueSuffix: "%",
      decimals: 1,
      sub: "trailing 8 weeks",
    },
  },
  rows: [
    {
      primary: "Inventory",
      secondary: "Placed balances · up across 8 weeks",
      trailing: { value: 2.48, prefix: "$", suffix: "B", decimals: 2 },
    },
    {
      primary: "Liquidation",
      secondary: "Recovered to date · up across 8 weeks",
      trailing: { value: 38.7, prefix: "$", suffix: "M", decimals: 1 },
    },
  ],
  pills: [{ label: "Scheduled · weekly" }, { label: "Power BI · Snowflake" }],
  ariaSummary:
    "Reporting console. Net-back is 68.2% across the trailing 8 weeks. Placed inventory stands at $2.48B and liquidation at $38.7M, both rising across the 8-week window. Reports run on a scheduled weekly cadence into Power BI and Snowflake.",
} satisfies ConsoleData;
