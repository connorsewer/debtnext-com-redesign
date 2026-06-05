/**
 * Reference Console payload: the validation that ConsoleData expresses the
 * real PlacementMatrix data with zero baked constants (FND-03 / FND-02).
 *
 * Source of the data: src/components/product/visuals/PlacementMatrix.tsx.
 * Mapped field-by-field per 10-RESEARCH.md §1 "Validation: mapping BOTH
 * Placement implementations onto ConsoleData".
 *
 * `satisfies ConsoleData` is used (not a type annotation) so excess or missing
 * fields are caught at compile time; this is the proof the schema fits the
 * real console exactly.
 *
 * VALIDATION CONCLUSION (the schema-validation deliverable):
 * The SAME ConsoleData schema also expresses the PlacementMockup case without
 * baked constants:
 *   - single-value pct rows → `bar.segments: [N]` (one entry instead of many);
 *   - the "Inbound batch" KPI block → `header.kpi` (present on the Mockup,
 *     absent here);
 *   - the always-on "Engine running" pulse → `header.status.live: true`, with
 *     the pulse rendered by the Console archetype via <PulseDot> (A1), which
 *     collapses to a static dot under reduced motion.
 * So one slot-based ConsoleData covers BOTH real Placement consoles. No field
 * the Mockup case needs is missing from the schema.
 */

import type { ConsoleData } from "./types";

// [CLAIMS REVIEW] placeholder values; Andrew sign-off required before production.
// Mirrors the existing convention in PlacementMatrix.tsx. Numbers stay generic
// and illustrative until claims review.
// [COI REVIEW] callout/pills/ariaSummary reference the customer's vendor
// network and routing. Language is agency-network-agnostic (the platform routes
// across the originator's existing vendors); confirm framing with Andrew.
export const placementConsole = {
  header: {
    eyebrow: "PLACEMENT MANAGEMENT",
    title: "Routing rules",
    subtitle: "National network · decision engine active · 14 rules live",
    status: { label: "LIVE" },
  },
  callout: {
    icon: "route",
    title: "1,847 accounts ready to route",
    sub: "Loaded from billing · evaluated against tier rules",
    action: "Routing now",
  },
  columns: {
    primary: "Treatment tier",
    bar: "Vendor allocation",
    trailing: "Accounts",
  },
  rows: [
    {
      primary: "Pre-collect",
      secondary: "3 vendors · 30-day",
      bar: { segments: [40, 35, 25] },
      trailing: { value: 12847, animate: "count" },
    },
    {
      primary: "Primary",
      secondary: "3 vendors · 60-day",
      bar: { segments: [45, 35, 20] },
      trailing: { value: 8420, animate: "count" },
    },
    {
      primary: "Secondary",
      secondary: "2 vendors · 90-day",
      bar: { segments: [60, 40] },
      trailing: { value: 4108, animate: "count" },
    },
    {
      primary: "Tertiary",
      secondary: "2 vendors · 120-day",
      bar: { segments: [55, 45] },
      trailing: { value: 2290, animate: "count" },
    },
  ],
  pills: [
    { label: "Reconciliation 04:00 today" },
    { label: "Recall windows configured" },
    { label: "27 vendors active", tone: "indigo" },
  ],
  ariaSummary:
    "Placement routing console. 1,847 accounts are loaded from billing and ready to route against 14 live tier rules. Four treatment tiers split accounts across the network: pre-collect holds 12,847 accounts over a 30-day window, primary holds 8,420 over 60 days, secondary holds 4,108 over 90 days, and tertiary holds 2,290 over 120 days. 27 vendors are active and recall windows are configured.",
} satisfies ConsoleData;
