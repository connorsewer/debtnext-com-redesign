/**
 * Handoff performance-tab Console payload (Phase 13 / SYSVIS-01).
 *
 * Mapped field-for-field from src/components/sections/mockups/VendorPerformanceMockup.tsx
 * so the homepage handoff's performance tab renders a Console archetype instance
 * (bare, inside FramedDashboard) instead of the bespoke mockup.
 *
 * RESEARCH Open Question 2: the bespoke grade badge + per-row sparkline are NOT
 * native Console row features. We approximate within the existing schema with no
 * schema extension: the vendor grade and its delta ride in `secondary` as TEXT
 * (label-paired severity, Pitfall 8; color never carries the meaning alone), the
 * liquidation percent rides in `trailing`, and the bar `tone` is a supporting cue
 * only. No sparkline. The header KPI carries the all-pools liquidation headline.
 *
 * `satisfies ConsoleData` proves the mapping fits the schema. Bar color comes from
 * DESIGN.md chart tokens via `tone` only; there are zero hex literals in this
 * module by design. ConsoleData has no "danger" tone, so the weakest vendor uses
 * `tone: "warning"` and the row text ("Grade C") carries the real severity.
 *
 * The FramedDashboard chrome title ("Vendor scorecard . YTD") is supplied
 * separately by mockupTitleForTab and is NOT part of this in-canvas payload.
 */

import type { PerformanceShowcaseData } from "./types";

// [CLAIMS REVIEW] liquidation percentages and deltas are governed copy mirrored
// from the existing VendorPerformanceMockup wording; real-shaped anonymized
// figures only, Andrew sign-off tracked for audit (non-blocking per 2026-06
// pre-clearance).
// [COI REVIEW] vendor names are real-shaped anonymized labels for the originator's
// recovery vendor network. Framing stays agency-network-agnostic (the scorecard
// grades the customer's existing vendors); confirm framing with Andrew.
export const handoffPerformanceConsole = {
  header: {
    title: "Vendor scorecard",
    kpi: {
      caption: "Liquidation, all pools",
      value: 14.7,
      valueSuffix: "%",
      decimals: 1,
      sub: "+1.3% vs prior 30d",
    },
  },
  rows: [
    {
      primary: "ABC Recovery",
      secondary: "Grade A · +2.1 vs prior 30d",
      bar: { segments: [18.7], tone: "success" },
      trailing: { value: 18.7, suffix: "%", decimals: 1 },
    },
    {
      primary: "Global Collect",
      secondary: "Grade A- · +0.8 vs prior 30d",
      bar: { segments: [16.3], tone: "success" },
      trailing: { value: 16.3, suffix: "%", decimals: 1 },
    },
    {
      primary: "Summit Recovery",
      secondary: "Grade B · -0.4 vs prior 30d",
      bar: { segments: [13.5], tone: "warning" },
      trailing: { value: 13.5, suffix: "%", decimals: 1 },
    },
    {
      primary: "GDW Recovery",
      secondary: "Grade C · -1.7 vs prior 30d",
      bar: { segments: [9.6], tone: "warning" },
      trailing: { value: 9.6, suffix: "%", decimals: 1 },
    },
  ],
  pills: [{ label: "4 vendors scored" }, { label: "Liquidation, trailing 30d" }],
  ariaSummary:
    "Vendor scorecard console. Liquidation across all pools is 14.7%, up 1.3% versus the prior 30 days. Four vendors are graded: ABC Recovery grade A at 18.7% liquidation, up 2.1; Global Collect grade A- at 16.3%, up 0.8; Summit Recovery grade B at 13.5%, down 0.4; GDW Recovery grade C at 9.6%, down 1.7.",
  showcase: {
    // Vendor names are FIXED anonymized labels (do not rename). Liquidation %,
    // grade, and delta mirror the payload rows; ROI% and collections are drawn
    // from the approved Vendor Performance Scorecard reference table.
    vendors: [
      {
        name: "ABC Recovery",
        grade: "A",
        gradeTone: "success",
        liquidation: 18.7,
        liquidationDelta: "+2.1 vs prior 30d",
        deltaTone: "success",
        roi: 18.7,
        collections: "$5.6M",
        trend: [0.62, 0.68, 0.71, 0.74, 0.79, 0.83, 0.88, 0.94],
      },
      {
        name: "Global Collect",
        grade: "A-",
        gradeTone: "success",
        liquidation: 16.3,
        liquidationDelta: "+0.8 vs prior 30d",
        deltaTone: "success",
        roi: 16.3,
        collections: "$4.2M",
        trend: [0.58, 0.6, 0.63, 0.66, 0.68, 0.72, 0.76, 0.81],
      },
      {
        name: "Summit Recovery",
        grade: "B",
        gradeTone: "warning",
        liquidation: 13.5,
        liquidationDelta: "-0.4 vs prior 30d",
        deltaTone: "breach",
        roi: 13.5,
        collections: "$2.1M",
        trend: [0.7, 0.68, 0.66, 0.64, 0.63, 0.61, 0.6, 0.58],
      },
      {
        name: "GDW Recovery",
        grade: "C",
        gradeTone: "breach",
        liquidation: 9.6,
        liquidationDelta: "-1.7 vs prior 30d",
        deltaTone: "breach",
        roi: 9.6,
        collections: "$1.1M",
        trend: [0.72, 0.68, 0.62, 0.56, 0.5, 0.45, 0.41, 0.38],
      },
    ],
  },
} satisfies PerformanceShowcaseData;
