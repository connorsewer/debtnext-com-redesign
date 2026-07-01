/**
 * /compare visual payload (Plan 14-03, Task 2).
 *
 * One DataStory (cards branch) for the ProductVisualBand slot on /compare, per
 * the approved 14-ARCHETYPE-MAP.md (D-01 lift). The CompareMatrix table maps each
 * platform's SCOPE ("built for / chosen by / stops"); it says nothing about TIME
 * TO PRODUCTION. This DataStory advances that distinct, non-duplicative argument:
 * dPlat is already in production (in continuous production since 2003, so the
 * buyer's implementation runway is short), where a greenfield build or a
 * competitor is a multi-month runway.
 *
 * Grayscale survival (D-11): the argument reads WITHOUT color. dPlat's card is
 * chart-1 (indigo) with a short bar (a short runway); the typical build's card is
 * chart-2 (muted, near-canvas) with a long bar (a long runway). Bar LENGTH, not
 * hue, carries the point, so a colorblind or grayscale reader still sees the
 * short-vs-long contrast.
 *
 * Distinctness (the 14-page-elevation spec asserts these verbatim, sourced from
 * 14-ARCHETYPE-MAP.md "Per-route distinctness strings"): the payload carries
 * "time to production" (the headline) and "already in production" (the dPlat card
 * tag + annotation). Neither appears in the CompareMatrix scope copy, so a
 * copy-pasted or decorative payload fails the assertion. The payload does NOT
 * reuse the banned "digital journeys" string (BL-01).
 *
 * [CLAIMS REVIEW] This is a COMPARATIVE claim (dPlat time-to-production vs a
 * typical greenfield build). Beyond [CLAIMS REVIEW], comparative-claim copy needs
 * the LEGAL GATE (14-03 punch-list #4) before merge; do not merge without it. The
 * "since 2003 / continuous production" figure traces to compare.ts (20 years in
 * continuous production). Real-shaped, anonymized, generic; no named clients, no
 * client logos.
 *
 * [COI REVIEW] Vendor framing stays agency-network-agnostic per CLAUDE.md §6; no
 * claim positions dPlat as structurally separate from TSI's ARM business.
 *
 * Voice per CLAUDE.md §5: no em dashes (· as separator), no banned phrases,
 * sentence case, digits.
 */

import type { DataStoryData } from "./types";

/** Time-to-production DataStory: dPlat is already in production (short runway)
 *  against a typical greenfield build's multi-month runway. dPlat card on
 *  chart-1 (indigo, short bar); typical build on chart-2 (muted, long bar) so the
 *  contrast survives grayscale. */
export const compareTimeToProduction = {
  eyebrow: "TIME TO PRODUCTION",
  headline: "Time to production: dPlat is already running",
  chart: {
    kind: "cards",
    cards: [
      {
        name: "dPlat",
        accent: "var(--chart-1)",
        tag: "Already in production",
        value: 0,
        suffix: " mo",
        bar: 12,
        sub: "In continuous production since 2003",
      },
      {
        name: "Typical greenfield build",
        accent: "var(--chart-2)",
        tag: "Runway ahead",
        value: 9,
        suffix: " mo",
        bar: 100,
        sub: "6 to 9 months before first placement",
      },
    ],
  },
  annotation: {
    value: "0 mo",
    caption:
      "dPlat is already in production, so your runway is short · a greenfield build is 6 to 9 months out",
  },
  ariaSummary:
    "Time-to-production comparison. dPlat is already in production, in continuous production since 2003, so a credit originator's implementation runway is short and measured in weeks of configuration. A typical greenfield build or a competitor stood up from scratch is a 6 to 9 month runway before the first placement moves. The argument is time to production, not scope: the comparison matrix already covers scope, and this contrast survives grayscale because the dPlat runway bar is short and the greenfield runway bar is long.",
} satisfies DataStoryData;
