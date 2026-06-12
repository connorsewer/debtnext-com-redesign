/**
 * /solutions hub cross-industry visual payload (Plan 12-05, Task 1).
 *
 * One typed DataStory payload that replaces the duplicate SolutionsIndustryCards
 * widget on the /solutions hub with a purpose-built cross-industry overview:
 *   - solutionsHubStory: the BenefitSplit visual (cards branch, 6 industries)
 *
 * This is the LAST consumer of the duplicate widget. With the hub repointed here
 * and the 6 industry pages repointed in Plans 12-01..12-04, the widget and its
 * lazy export are deleted in this same task (no consumer left orphaned, AUDIT
 * P12-01).
 *
 * Distinctness (D-08): this payload is an OVERVIEW, not any single industry's
 * hero. It carries one card per industry with that industry's accent token, the
 * industry noun, and a liquidation/match figure. It reads distinct from all 6
 * industry pages, which each lead with a Console hero (never a 6-card grid). The
 * only other cards-branch instance in the phase is the fintech reporting card,
 * which is a per-vendor network-consolidation subject, not this cross-industry
 * roll-up.
 *
 * Accents per 12-ARCHETYPE-MAP.md hub row (D-11, chart-1/3/4/5 only):
 *   utilities --chart-5, financial-services --chart-1, telecom --chart-3,
 *   fintech --chart-5, insurance --chart-3, healthcare --chart-4.
 * Accents repeat by design across 4 hues / 6 industries; the cards differ by
 * industry noun, tag, and figure so no two read alike.
 *
 * [CLAIMS REVIEW] Every figure below is a numeric claim: liquidation and match
 * rates per industry. Real-shaped, anonymized, generic with plausible relative
 * magnitudes per D-09; Andrew pre-cleared 2026-06-12 (AUDIT FIX-03, project
 * memory). Tag retained for audit traceability, non-blocking this phase. No
 * named clients, no client logos.
 *
 * [COI REVIEW] The roll-up references recovery across the originator's vendor
 * network. Framing stays agency-network-agnostic per CLAUDE.md §6 ("one platform
 * across the vendors each originator already runs"); no claim positions dPlat as
 * structurally separate from TSI's ARM business.
 *
 * Voice per CLAUDE.md §5: no em dashes (· as separator), no banned phrases,
 * sentence case, digits.
 */

import type { DataStoryData } from "./types";

/** Hub DataStory: one card per industry, each with its own accent token, noun,
 *  and a liquidation/match figure. A cross-industry overview that reads distinct
 *  from every industry page's Console hero. */
export const solutionsHubStory = {
  eyebrow: "ONE PLATFORM",
  headline: "One platform across every portfolio you run",
  chart: {
    kind: "cards",
    cards: [
      {
        name: "Utilities",
        accent: "var(--chart-5)",
        tag: "Regulated",
        value: 16.2,
        decimals: 1,
        suffix: "%",
        bar: 62,
        sub: "Liquidation · 30D",
      },
      {
        name: "Financial services",
        accent: "var(--chart-1)",
        tag: "Bank · card",
        value: 21.4,
        decimals: 1,
        suffix: "%",
        bar: 80,
        sub: "Liquidation · 30D",
      },
      {
        name: "Telecom",
        accent: "var(--chart-3)",
        tag: "Subscriber",
        value: 18.9,
        decimals: 1,
        suffix: "%",
        bar: 71,
        sub: "Liquidation · 30D",
      },
      {
        name: "Fintech",
        accent: "var(--chart-5)",
        tag: "Digital lending",
        value: 24.6,
        decimals: 1,
        suffix: "%",
        bar: 88,
        sub: "Liquidation · 30D",
      },
      {
        name: "Insurance",
        accent: "var(--chart-3)",
        tag: "Policy · subrogation",
        value: 14.8,
        decimals: 1,
        suffix: "%",
        bar: 57,
        sub: "Recovery · 30D",
      },
      {
        name: "Healthcare",
        accent: "var(--chart-4)",
        tag: "Self-pay",
        value: 12.4,
        decimals: 1,
        suffix: "%",
        bar: 49,
        sub: "Liquidation · 30D",
      },
    ],
  },
  annotation: {
    value: "6 portfolios",
    caption: "One decision engine, one reporting surface, your existing vendors in every market",
  },
  ariaSummary:
    "Cross-industry overview. dPlat runs six portfolio types on one platform, each routed across the originator's existing vendors. Utilities holds a 16.2% 30-day liquidation rate, financial services 21.4%, telecom 18.9%, fintech 24.6%, insurance a 14.8% 30-day recovery rate, and healthcare a 12.4% liquidation rate. The figures vary by portfolio because balances, cycle length, and vendor mix differ across markets, yet every market runs on the same decision engine and reconciles to one reporting surface. The numbers are anonymized and generic, with relative magnitudes that hold across industries.",
} satisfies DataStoryData;
