/**
 * /solutions/insurance visual payloads (Plan 12-03, Task 2).
 *
 * Four typed payloads that replace the duplicate SolutionsIndustryCards widget
 * on /solutions/insurance with a real per-industry visual library:
 *   - insuranceConsole: the ProductVisualBand hero (SOLVIS-02)
 *   - insuranceRouting: placement accordion item Schematic (SOLVIS-03)
 *   - insuranceConfig: optimization accordion item Console (SOLVIS-05)
 *   - insuranceReconciliation: reporting accordion item DataStory (SOLVIS-04)
 *
 * Archetype + placement per 12-ARCHETYPE-MAP.md (D-08 approved). Insurance accent
 * is --chart-3 (D-11), which it SHARES with telecom. To keep the two routes
 * distinct under a shared accent, insurance composition differs deliberately:
 * earned-premium, subrogation, and deductible row nouns (not telecom's prepaid /
 * postpaid short-cycle), a policy-admin source node (not OSS / BSS), and a
 * jurisdiction-variance framing (not high-volume short-cycle recall).
 *
 * The reporting DataStory is a BARS chart, the reconcile-daily cluster
 * differentiator: insurance bars vs utilities spark vs healthcare area, so the
 * three reconciliation stories never read alike.
 *
 * Distinctness hook: the hero and config carry "subrogation", insurance's
 * industry-unique string (locked in 12-01-SUMMARY).
 *
 * [CLAIMS REVIEW] Every figure below is a numeric claim: account counts,
 * balances, match rates, reconciliation values. Real-shaped, anonymized, generic
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

/** Hero Console: insurance recovery accounts in treatment. Earned-premium,
 *  subrogation, deductible, and salvage receivables. Business vs consumer
 *  obligor pills. Jurisdiction-variance callout (policy-admin framing, not
 *  telecom's short-cycle). */
export const insuranceConsole = {
  header: {
    eyebrow: "INSURANCE RECOVERY",
    title: "Recovery accounts in treatment",
    subtitle: "Earned premium and subrogation · routed from policy admin · jurisdiction-aware",
    status: { label: "LIVE", live: true },
    kpi: {
      caption: "In treatment",
      value: 26480,
      sub: "accounts · $54.7M",
    },
  },
  callout: {
    icon: "route",
    title: "4,310 subrogation files ready to route",
    sub: "Liability established · third-party carrier identified · jurisdiction tagged",
    action: "Routing now",
  },
  columns: {
    primary: "Recovery type",
    bar: "Vendor allocation",
    trailing: "Accounts",
  },
  rows: [
    {
      primary: "Earned-premium receivables",
      secondary: "Audit premium · cancelled mid-term",
      bar: { segments: [50, 35, 15] },
      trailing: { value: 10240, animate: "count" },
    },
    {
      primary: "Subrogation recovery",
      secondary: "Liability established · third-party carrier",
      bar: { segments: [55, 45] },
      trailing: { value: 8120, animate: "count" },
    },
    {
      primary: "Deductible recovery",
      secondary: "Insured deductible owed back",
      bar: { segments: [60, 40] },
      trailing: { value: 5360, animate: "count" },
    },
    {
      primary: "Disputed salvage",
      secondary: "In dispute workflow · on hold",
      bar: { segments: [70, 30] },
      trailing: { value: 2760, animate: "count" },
    },
  ],
  pills: [
    { label: "Business 58%" },
    { label: "Consumer 42%", tone: "indigo" },
    { label: "Reconciled 04:00 today" },
  ],
  ariaSummary:
    "Insurance recovery console. 26,480 accounts are in treatment, worth $54.7M, with 4,310 subrogation files ready to route once liability is established and the third-party carrier is identified. Four recovery types split across the vendor network: 10,240 earned-premium receivables from audit premium and mid-term cancellations, 8,120 subrogation recoveries against a third-party carrier, 5,360 deductible recoveries owed back by the insured, and 2,760 disputed salvage accounts held in the dispute workflow. The book is 58% business and 42% consumer obligor, reconciled at 04:00 today.",
} satisfies ConsoleData;

/** Placement Schematic: how dPlat routes insurance accounts. The policy admin
 *  system feeds a routing decision engine that splits by recovery type and
 *  obligor across the originator's vendor pools, with recovered balances flowing
 *  to a sink. */
export const insuranceRouting = {
  eyebrow: "HOW IT ROUTES",
  title: "Routing insurance recovery accounts",
  nodes: [
    { id: "pas", label: "Policy admin system", sub: "Claims · billing · policy of record", kind: "source" },
    { id: "engine", label: "Routing decision engine", sub: "Recovery type · obligor · loss date · jurisdiction", kind: "engine" },
    { id: "biz", label: "Business obligor pool", sub: "Subrogation and premium specialists", kind: "vendor" },
    { id: "cons", label: "Consumer obligor pool", sub: "Deductible and salvage recovery", kind: "vendor" },
    { id: "sink", label: "Recovered and closed", sub: "Reconciled to policy admin", kind: "sink" },
  ],
  edges: [
    { from: "pas", to: "engine", label: "Loaded daily", flow: true },
    { from: "engine", to: "biz", label: "Business obligor" },
    { from: "engine", to: "cons", label: "Consumer obligor" },
    { from: "biz", to: "sink", label: "Recovered" },
    { from: "cons", to: "sink", label: "Recovered" },
  ],
  ariaSummary:
    "Routing diagram for insurance recovery accounts. The policy admin system loads accounts daily into the routing decision engine, which sorts by recovery type, obligor, loss date, and jurisdiction. Business-obligor accounts route to a subrogation and premium specialist pool and consumer-obligor accounts route to a deductible and salvage recovery pool, both drawn from the originator's existing vendors. Recovered balances reconcile back to policy admin and close.",
} satisfies SchematicData;

/** Optimization Console: business and consumer books configured separately. Each
 *  book gets its own vendor pool, share, and cycle. */
export const insuranceConfig = {
  header: {
    eyebrow: "WORKFLOW CONFIG",
    title: "Business and consumer books, configured separately",
    subtitle: "Two books · shared or split vendor pools · jurisdiction rules per book",
  },
  columns: {
    primary: "Book",
    bar: "Vendor pool share",
    trailing: "Accounts",
  },
  rows: [
    {
      primary: "Business obligor",
      secondary: "Subrogation and premium · 120-day cycle · carrier-to-carrier",
      bar: { segments: [55, 30, 15] },
      trailing: { value: 15360, animate: "count" },
    },
    {
      primary: "Consumer obligor",
      secondary: "Deductible and salvage · 90-day cycle · jurisdiction caps on",
      bar: { segments: [60, 40] },
      trailing: { value: 11120, animate: "count" },
    },
  ],
  pills: [
    { label: "Carrier-to-carrier · business" },
    { label: "Jurisdiction caps · consumer", tone: "indigo" },
  ],
  ariaSummary:
    "Workflow configuration console. Business and consumer obligor books are configured separately. The business book runs subrogation and premium recovery on a 120-day carrier-to-carrier cycle across 15,360 accounts. The consumer book runs deductible and salvage recovery on a 90-day cycle with jurisdiction caps on, across 11,120 accounts. Vendor pools can be shared or split between the two books.",
} satisfies ConsoleData;

/** Reporting DataStory (the insurance DataStory carrier, SOLVIS-04): a daily
 *  reconciliation BARS chart of premium and subrogation balance matches by
 *  recovery type, with a match-rate annotation. Bars are the reconcile-daily
 *  cluster differentiator: insurance bars vs utilities spark vs healthcare area. */
export const insuranceReconciliation = {
  eyebrow: "RECONCILIATION",
  headline: "Premium and subrogation balances reconcile daily by recovery type",
  chart: {
    kind: "bars",
    series: [
      { label: "Earned premium", value: 99 },
      { label: "Subrogation", value: 97, tone: "indigo" },
      { label: "Deductible", value: 98 },
      { label: "Salvage", value: 96, tone: "indigo" },
    ],
  },
  annotation: {
    value: "98.1%",
    caption: "Daily match rate across recovery types · exceptions surface for review",
  },
  ariaSummary:
    "Daily reconciliation bars by recovery type. Earned-premium balances match at 99%, subrogation at 97%, deductible at 98%, and salvage at 96%, for a 98.1% daily match rate across the vendor network. Unmatched balances surface as exceptions for review, so reporting stays accurate by recovery type.",
} satisfies DataStoryData;
