/**
 * /solutions/fintech visual payloads (Plan 12-03, Task 1).
 *
 * Four typed payloads that replace the duplicate SolutionsIndustryCards widget
 * on /solutions/fintech with a real per-industry visual library:
 *   - fintechConsole: the ProductVisualBand hero (SOLVIS-02)
 *   - fintechRouting: placement accordion item Schematic (SOLVIS-03)
 *   - fintechConfig: optimization accordion item Console (SOLVIS-05)
 *   - fintechConsolidation: reporting accordion item DataStory (SOLVIS-04)
 *
 * Archetype + placement per 12-ARCHETYPE-MAP.md (D-08 approved). Fintech accent
 * is --chart-5 (D-11), which it SHARES with utilities. To keep the two routes
 * distinct under a shared accent, fintech composition differs deliberately:
 * BNPL installment and personal-loan row nouns (not utility arrears or deposits),
 * an API-first lending stack source node (not billing / CIS), and a steep
 * early-delinquency framing (not utilities' flat seasonal-arrears shape). The
 * cross-route distinctness spec asserts this.
 *
 * Distinctness hook: the hero and config carry "BNPL", fintech's industry-unique
 * string (locked in 12-01-SUMMARY).
 *
 * [CLAIMS REVIEW] Every figure below is a numeric claim: account counts,
 * balances, cycle times, consolidation rates. Real-shaped, anonymized, generic
 * per D-09; Andrew pre-cleared 2026-06-12 (AUDIT FIX-03, project memory). Tag
 * retained for audit traceability, non-blocking this phase. No named clients,
 * no client logos.
 *
 * [COI REVIEW] Routing captions reference the originator's vendor network.
 * Framing stays agency-network-agnostic per CLAUDE.md §6 ("routes across the
 * originator's existing vendors"); no claim positions dPlat as structurally
 * separate from TSI's ARM business.
 *
 * Voice per CLAUDE.md §5: no em dashes (· as separator), no banned phrases,
 * sentence case, digits.
 */

import type { ConsoleData, DataStoryData, SchematicData } from "./types";

/** Hero Console: fintech accounts in treatment. BNPL installments, personal
 *  loans, revolving cards, and disputed charge-backs. Fast cycle pills. Steep
 *  early-delinquency callout (vs utilities' flat seasonal shape). */
export const fintechConsole = {
  header: {
    eyebrow: "FINTECH RECOVERY",
    title: "Accounts in treatment",
    subtitle: "BNPL and personal loans · routed from the lending stack · early-stage delinquency",
    status: { label: "LIVE", live: true },
    kpi: {
      caption: "In treatment",
      value: 71840,
      sub: "accounts · $38.2M",
    },
  },
  callout: {
    icon: "alert",
    title: "12,600 accounts hit delinquency inside 30 days",
    sub: "Thin-file, fast-curve segments · routed before they age",
    action: "Routing now",
  },
  columns: {
    primary: "Product",
    bar: "Vendor allocation",
    trailing: "Accounts",
  },
  rows: [
    {
      primary: "BNPL installments",
      secondary: "Missed installment · 14-day curve",
      bar: { segments: [50, 30, 20] },
      trailing: { value: 31240, animate: "count" },
    },
    {
      primary: "Personal loans",
      secondary: "Unsecured · first missed payment",
      bar: { segments: [55, 45] },
      trailing: { value: 19880, animate: "count" },
    },
    {
      primary: "Revolving cards",
      secondary: "Over-limit · rolling balance",
      bar: { segments: [60, 40] },
      trailing: { value: 14130, animate: "count" },
    },
    {
      primary: "Disputed charge-backs",
      secondary: "In dispute workflow · on hold",
      bar: { segments: [72, 28] },
      trailing: { value: 6590, animate: "count" },
    },
  ],
  pills: [
    { label: "Early-stage 68%" },
    { label: "Late-stage 32%", tone: "indigo" },
    { label: "Routed within 24h" },
  ],
  ariaSummary:
    "Fintech recovery console. 71,840 accounts are in treatment, worth $38.2M, with 12,600 accounts that hit delinquency inside 30 days. Four products split across the vendor network: 31,240 BNPL installment accounts on a 14-day missed-installment curve, 19,880 unsecured personal loans at first missed payment, 14,130 over-limit revolving cards, and 6,590 disputed charge-backs held in the dispute workflow. The book skews early-stage at 68% against 32% late-stage, and accounts route within 24 hours so thin-file segments do not age before treatment.",
} satisfies ConsoleData;

/** Placement Schematic: how dPlat routes fintech accounts. The lending stack
 *  (API) feeds a routing decision engine that splits early and late stage across
 *  the originator's vendor pools, with recovered balances flowing to a sink.
 *  API-first, not a nightly file load. */
export const fintechRouting = {
  eyebrow: "HOW IT ROUTES",
  title: "Routing fintech accounts",
  nodes: [
    { id: "stack", label: "Lending stack (API)", sub: "Origination · servicing · ledger", kind: "source" },
    { id: "engine", label: "Routing decision engine", sub: "Days delinquent · product · balance · risk band", kind: "engine" },
    { id: "early", label: "Early-stage vendor pool", sub: "Fast-curve specialists", kind: "vendor" },
    { id: "late", label: "Late-stage vendor pool", sub: "Higher-balance recovery", kind: "vendor" },
    { id: "sink", label: "Recovered and closed", sub: "Posted back over the API", kind: "sink" },
  ],
  edges: [
    { from: "stack", to: "engine", label: "Streamed via API", flow: true },
    { from: "engine", to: "early", label: "Early stage" },
    { from: "engine", to: "late", label: "Late stage" },
    { from: "early", to: "sink", label: "Recovered" },
    { from: "late", to: "sink", label: "Recovered" },
  ],
  ariaSummary:
    "Routing diagram for fintech accounts. The lending stack streams accounts over an API into the routing decision engine, which sorts by days delinquent, product, balance, and risk band. Early-stage accounts route to a fast-curve vendor pool and late-stage accounts route to a higher-balance recovery pool, both drawn from the originator's existing vendors. Recovered balances post back over the API and close.",
} satisfies SchematicData;

/** Optimization Console: configured in-app, no release cycle. Placement rules,
 *  settlement thresholds, payment plans, and recall windows adjust inside the
 *  application. */
export const fintechConfig = {
  header: {
    eyebrow: "WORKFLOW CONFIG",
    title: "Configured in-app, no release cycle",
    subtitle: "BNPL and loan books · rules change inside the application",
  },
  columns: {
    primary: "Book",
    bar: "Vendor pool share",
    trailing: "Accounts",
  },
  rows: [
    {
      primary: "BNPL book",
      secondary: "14-day curve · settlement floor 70% · 2 recall windows",
      bar: { segments: [55, 30, 15] },
      trailing: { value: 31240, animate: "count" },
    },
    {
      primary: "Loan and card book",
      secondary: "30-day curve · payment plans on · 1 recall window",
      bar: { segments: [60, 40] },
      trailing: { value: 40600, animate: "count" },
    },
  ],
  pills: [
    { label: "Settlement floors · per book" },
    { label: "Payment plans · loan and card", tone: "indigo" },
  ],
  ariaSummary:
    "Workflow configuration console. Recovery rules change inside the application with no release cycle. The BNPL book runs a 14-day curve with a 70% settlement floor and 2 recall windows across 31,240 accounts. The loan and card book runs a 30-day curve with payment plans on and 1 recall window across 40,600 accounts. Settlement floors and payment plans are set per book.",
} satisfies ConsoleData;

/** Reporting DataStory (the fintech DataStory carrier, SOLVIS-04): one
 *  standardized connection consolidates the vendor network. An area curve of
 *  how many vendors report through one connection, climbing as the network
 *  consolidates, with a single-view annotation. Distinct from utilities' flat
 *  reconciliation spark. */
export const fintechConsolidation = {
  eyebrow: "NETWORK CONSOLIDATION",
  headline: "One connection consolidates the whole vendor network",
  chart: {
    kind: "area",
    points: [22, 34, 41, 55, 63, 78, 92],
  },
  annotation: {
    value: "1",
    caption: "One standardized connection across every agency and law firm · single current view of recovery",
  },
  ariaSummary:
    "Network consolidation area chart over 7 reporting periods. The share of the vendor network reporting through one standardized connection climbs from 22% to 92% as agencies and law firms move onto a single feed. A fast-moving fintech operation keeps one current view of recovery instead of stitching together separate vendor reports.",
} satisfies DataStoryData;
