/**
 * Handoff issues-tab Console payload (Phase 13 / SYSVIS-01).
 *
 * Mapped field-for-field from src/components/sections/mockups/IssuesMockup.tsx so
 * the homepage handoff's issues tab renders a Console archetype instance (bare,
 * inside FramedDashboard) instead of the bespoke mockup.
 *
 * Pitfall 8 (label-paired status): the SLA ("Overdue 1h", "Due 22h", "Due 3d") and
 * the status ("Escalated", "Investigating", "Auto-handled") are carried as TEXT in
 * each row's `secondary`, never as a color-only cue. The bespoke mockup leaned on
 * destructive/warning/success color for SLA tone; here the words carry the meaning
 * and ConsoleData has no per-row text tone to mislead.
 *
 * The three queue stats map to a header KPI ("Open" 127) plus two footer pills
 * ("Due today 12", "Overdue 3"). `satisfies ConsoleData` proves the mapping fits
 * the schema. There are zero hex literals in this module by design.
 *
 * The FramedDashboard chrome title ("Issues queue . all vendors") is supplied
 * separately by mockupTitleForTab and is NOT part of this in-canvas payload.
 */

import type { ConsoleData } from "./types";

// [CLAIMS REVIEW] queue counts and SLA windows are governed copy mirrored from the
// existing IssuesMockup wording; real-shaped anonymized figures only, Andrew
// sign-off tracked for audit (non-blocking per 2026-06 pre-clearance).
// [COI REVIEW] vendor names are real-shaped anonymized labels for the originator's
// recovery vendor network. Framing stays agency-network-agnostic (issues route to
// the customer's existing vendors); confirm framing with Andrew.
export const handoffIssuesConsole = {
  header: {
    title: "Issues queue",
    kpi: {
      caption: "Open",
      value: 127,
      sub: "across all vendors",
    },
  },
  rows: [
    {
      primary: "SCRA · Active-duty verification",
      secondary: "Account 7715-009 · Best Resolution · Overdue 1h · Escalated",
    },
    {
      primary: "Dispute · Balance contested by consumer",
      secondary: "Account 1042-887 · Global Collect · Due 22h · Investigating",
    },
    {
      primary: "Decedent · Probate confirmation pending",
      secondary: "Account 9821-204 · ABC Recovery · Due 3d · Auto-handled",
    },
  ],
  pills: [{ label: "Due today 12" }, { label: "Overdue 3" }],
  ariaSummary:
    "Issues queue console. 127 issues are open across all vendors, with 12 due today and 3 overdue. Three issues are in view: an SCRA active-duty verification on account 7715-009 with Best Resolution, overdue 1 hour and escalated; a dispute over a contested balance on account 1042-887 with Global Collect, due in 22 hours and under investigation; a decedent probate confirmation on account 9821-204 with ABC Recovery, due in 3 days and auto-handled.",
} satisfies ConsoleData;
