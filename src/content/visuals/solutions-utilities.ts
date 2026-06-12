/**
 * /solutions/utilities visual payloads (Plan 12-01, Task 3).
 *
 * Four typed payloads that replace the duplicate SolutionsIndustryCards widget
 * on /solutions/utilities with a real per-industry visual library:
 *   - utilitiesConsole: the ProductVisualBand hero (SOLVIS-02)
 *   - utilitiesRouting: placement accordion item Schematic (SOLVIS-03)
 *   - utilitiesConfig: optimization accordion item Console (SOLVIS-05)
 *   - utilitiesReconciliation: reporting accordion item DataStory (SOLVIS-04)
 *
 * Archetype + placement per 12-ARCHETYPE-MAP.md (D-08 approved). Utilities
 * accent is --chart-5 (D-11). All payloads use `satisfies <Schema>` (never a
 * type annotation) so excess/missing fields fail at compile time.
 *
 * Distinctness hooks (the spec asserts these): the hero and config rows carry
 * "arrears" and "deposit", utilities' industry-unique strings. Utilities runs
 * smaller balances and higher counts than financial-services (relative-magnitude
 * guardrail), and a seasonal (not steep-early) delinquency shape vs fintech,
 * which shares the chart-5 accent.
 *
 * [CLAIMS REVIEW] Every figure below is a numeric claim: account counts,
 * balances, match rates. Real-shaped, anonymized, generic per D-09; Andrew
 * pre-cleared 2026-06-12 (AUDIT FIX-03, project memory). Tag retained for audit
 * traceability, non-blocking this phase. No named clients, no client logos.
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

/** Hero Console: utility accounts in treatment. Final-bill, active-service
 *  arrears, deposit offsets, and write-off disputes. Residential and commercial
 *  pills. Smaller balances, higher counts (vs financial-services). */
export const utilitiesConsole = {
  header: {
    eyebrow: "UTILITY RECOVERY",
    title: "Accounts in treatment",
    subtitle: "Residential and commercial · routed from billing · deposit balances applied",
    status: { label: "LIVE", live: true },
    kpi: {
      caption: "In treatment",
      value: 48210,
      sub: "accounts · $61.4M",
    },
  },
  callout: {
    icon: "route",
    title: "9,140 final-bill accounts ready to route",
    sub: "Segmented from active-service arrears · deposit offsets applied",
    action: "Routing now",
  },
  columns: {
    primary: "Account type",
    bar: "Vendor allocation",
    trailing: "Accounts",
  },
  rows: [
    {
      primary: "Final bill",
      secondary: "Post move-out · 30-day",
      bar: { segments: [45, 35, 20] },
      trailing: { value: 18420, animate: "count" },
    },
    {
      primary: "Active-service arrears",
      secondary: "Service kept on · soft treatment",
      bar: { segments: [55, 45] },
      trailing: { value: 16830, animate: "count" },
    },
    {
      primary: "Deposit offsets",
      secondary: "Deposit netted against balance",
      bar: { segments: [60, 40] },
      trailing: { value: 8120, animate: "count" },
    },
    {
      primary: "Write-off disputes",
      secondary: "In dispute workflow · on hold",
      bar: { segments: [70, 30] },
      trailing: { value: 4840, animate: "count" },
    },
  ],
  pills: [
    { label: "Residential 71%" },
    { label: "Commercial 29%", tone: "indigo" },
    { label: "Reconciled 04:00 today" },
  ],
  ariaSummary:
    "Utility recovery console. 48,210 accounts are in treatment, worth $61.4M, with 9,140 final-bill accounts ready to route. Four account types split across the vendor network: 18,420 final-bill accounts on a 30-day window, 16,830 active-service arrears kept on soft treatment, 8,120 deposit-offset accounts where the deposit nets against the balance, and 4,840 write-off disputes held in the dispute workflow. The book is 71% residential and 29% commercial, reconciled at 04:00 today.",
} satisfies ConsoleData;

/** Placement Schematic: how dPlat routes utility accounts. Billing / CIS source
 *  feeds a routing decision engine that splits residential and commercial across
 *  the originator's vendor pools, with recovered balances flowing to a sink. */
export const utilitiesRouting = {
  eyebrow: "HOW IT ROUTES",
  title: "Routing utility accounts",
  nodes: [
    { id: "cis", label: "Billing / CIS system", sub: "SAP · Oracle CC&B · C2M", kind: "source" },
    { id: "engine", label: "Routing decision engine", sub: "Disconnect reason · service class · deposit balance", kind: "engine" },
    { id: "res", label: "Residential vendor pool", sub: "Soft-treatment agencies", kind: "vendor" },
    { id: "com", label: "Commercial vendor pool", sub: "Higher-balance specialists", kind: "vendor" },
    { id: "sink", label: "Recovered and closed", sub: "Reconciled to billing", kind: "sink" },
  ],
  edges: [
    { from: "cis", to: "engine", label: "Loaded daily", flow: true },
    { from: "engine", to: "res", label: "Residential" },
    { from: "engine", to: "com", label: "Commercial" },
    { from: "res", to: "sink", label: "Recovered" },
    { from: "com", to: "sink", label: "Recovered" },
  ],
  ariaSummary:
    "Routing diagram for utility accounts. The billing or CIS system loads accounts daily into the routing decision engine, which sorts by disconnect reason, service class, and deposit balance. Residential accounts route to a soft-treatment vendor pool and commercial accounts route to a higher-balance specialist pool, both drawn from the originator's existing vendors. Recovered balances reconcile back to billing and close.",
} satisfies SchematicData;

/** Optimization Console: residential and commercial configured separately. Each
 *  book gets its own vendor pool, share, and cycle. */
export const utilitiesConfig = {
  header: {
    eyebrow: "WORKFLOW CONFIG",
    title: "Residential and commercial, configured separately",
    subtitle: "Two books · shared or split vendor pools · independent cycles",
  },
  columns: {
    primary: "Book",
    bar: "Vendor pool share",
    trailing: "Accounts",
  },
  rows: [
    {
      primary: "Residential",
      secondary: "Soft treatment · 90-day cycle · deposit netting on",
      bar: { segments: [50, 30, 20] },
      trailing: { value: 34230, animate: "count" },
    },
    {
      primary: "Commercial",
      secondary: "Specialist pool · 60-day cycle · arrears priority",
      bar: { segments: [65, 35] },
      trailing: { value: 13980, animate: "count" },
    },
  ],
  pills: [
    { label: "Deposit netting · residential" },
    { label: "Arrears priority · commercial", tone: "indigo" },
  ],
  ariaSummary:
    "Workflow configuration console. Residential and commercial books are configured separately. Residential runs soft treatment on a 90-day cycle with deposit netting on, across 34,230 accounts. Commercial runs a specialist pool on a 60-day cycle with arrears given priority, across 13,980 accounts. Vendor pools can be shared or split between the two books.",
} satisfies ConsoleData;

/** Reporting DataStory (the utilities DataStory carrier, SOLVIS-04): a daily
 *  reconciliation spark of arrears and deposit balance matches with a match-rate
 *  annotation. Seasonal, steady shape (vs fintech's steep early curve). */
export const utilitiesReconciliation = {
  eyebrow: "RECONCILIATION",
  headline: "Arrears and deposit balances reconcile daily across the network",
  chart: {
    kind: "spark",
    bars: [97, 98, 96, 99, 97, 98, 99],
  },
  annotation: {
    value: "99.2%",
    caption: "Daily match rate on arrears and deposit balances · exceptions surface for review",
  },
  ariaSummary:
    "Daily reconciliation spark over 7 days. Arrears and deposit balances match against the vendor network every day, holding a 99.2% daily match rate. Unmatched balances surface as exceptions for review, so reporting stays accurate across the network.",
} satisfies DataStoryData;
