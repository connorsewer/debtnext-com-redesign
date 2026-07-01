/**
 * Handoff placement-tab Console payload (Phase 13 / SYSVIS-01).
 *
 * Mapped field-for-field from src/components/sections/mockups/PlacementMockup.tsx
 * so the homepage handoff's placement tab can render a Console archetype instance
 * (bare, inside FramedDashboard) instead of the bespoke mockup. NO tab is repointed
 * by this module; it is the Wave 0 reference payload that Plan 02 wires in.
 *
 * `satisfies ConsoleData` proves the mapping fits the schema with zero baked
 * constants. The three off-token gradient endpoints in PlacementMockup do NOT
 * survive here (D-10): bar color comes from DESIGN.md chart tokens via `tone`,
 * never raw hex. There are zero hex literals in this module by design.
 *
 * The FramedDashboard chrome title ("Placement run · 12:04 PM") is supplied
 * separately by mockupTitleForTab and is NOT part of this in-canvas payload.
 */

import type { ConsoleData } from "./types";

// [CLAIMS REVIEW] KPI and pool numbers are governed copy mirrored from the
// existing PlacementMockup wording; real-shaped anonymized figures only,
// Andrew sign-off tracked for audit (non-blocking per 2026-06 pre-clearance).
// [COI REVIEW] vendor-count framing references the originator's recovery vendor
// network. Language stays agency-network-agnostic (the engine routes across the
// customer's existing vendors); confirm framing with Andrew.
export const handoffPlacementConsole = {
  header: {
    title: "Routing pools",
    kpi: {
      caption: "Inbound batch",
      value: 120418,
      sub: "accounts · $284.6M",
    },
    status: { label: "Engine running", live: true },
  },
  rows: [
    {
      primary: "Pre-collect",
      secondary: "2 vendors",
      bar: { segments: [35] },
      trailing: { value: 35, suffix: "%" },
    },
    {
      primary: "Primary",
      secondary: "3 vendors",
      bar: { segments: [28] },
      trailing: { value: 28, suffix: "%" },
    },
    {
      primary: "Secondary",
      secondary: "2 vendors",
      bar: { segments: [18] },
      trailing: { value: 18, suffix: "%" },
    },
    {
      primary: "Tertiary",
      secondary: "4 vendors",
      bar: { segments: [12] },
      trailing: { value: 12, suffix: "%" },
    },
  ],
  ariaSummary:
    "Placement run console. 120,418 accounts are loaded in the inbound batch worth $284.6M, with the routing engine running. Four pools split the batch: pre-collect 35% across 2 vendors, primary 28% across 3 vendors, secondary 18% across 2 vendors, tertiary 12% across 4 vendors.",
} satisfies ConsoleData;
