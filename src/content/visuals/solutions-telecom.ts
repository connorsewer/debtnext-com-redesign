/**
 * /solutions/telecom visual payloads (Plan 12-02, Task 2).
 *
 * Four typed payloads that replace the duplicate SolutionsIndustryCards widget
 * on /solutions/telecom with a real per-industry visual library:
 *   - telecomConsole: the ProductVisualBand hero (SOLVIS-02)
 *   - telecomRouting: placement accordion item Schematic (SOLVIS-03)
 *   - telecomRecall: optimization accordion item Console (SOLVIS-05)
 *   - telecomPrepaidPostpaid: issues accordion item DataStory (SOLVIS-04)
 *
 * Archetype + placement per 12-ARCHETYPE-MAP.md (D-08 approved). Telecom accent
 * is --chart-3 (shared with insurance; the Distinctness check separates them:
 * telecom is OSS/BSS high-volume short-cycle, device vs service receivables,
 * large counts; insurance is policy-admin lower-volume, larger balances). The
 * DataStory carrier is the issues item (this page has no reporting item). All
 * payloads use `satisfies <Schema>` (never a type annotation) so excess/missing
 * fields fail at compile time.
 *
 * Distinctness hooks (the spec asserts these): the hero carries "prepaid",
 * telecom's industry-unique string, on device-receivable vs service-balance rows
 * split prepaid and postpaid. High account counts (telecom counts exceed
 * insurance counts, relative-magnitude guardrail). The routing source is OSS /
 * BSS, distinct from utilities' billing/CIS and financial-services' core
 * banking. The vendor pool structure is sized for high daily volume, visibly
 * different from financial-services' agency/law-firm split.
 *
 * [CLAIMS REVIEW] Every figure below is a numeric claim: account counts,
 * receivable balances, recall windows, treatment splits. Real-shaped,
 * anonymized, generic per D-09; Andrew pre-cleared 2026-06-12 (AUDIT FIX-03,
 * project memory). Tag retained for audit traceability, non-blocking this phase.
 * No named clients, no client logos.
 *
 * [COI REVIEW] Routing captions reference the originator's vendor network.
 * Framing stays agency-network-agnostic per CLAUDE.md §6 ("routes across the
 * carrier's existing vendors"); no claim positions dPlat as structurally
 * separate from TSI's ARM business.
 *
 * Voice per CLAUDE.md §5: no em dashes (· as separator), no banned phrases,
 * sentence case, digits.
 */

import type { ConsoleData, DataStoryData, SchematicData } from "./types";

/** Hero Console: telecom receivables in treatment. Device-receivable vs
 *  service-balance rows split prepaid and postpaid. High counts, short-cycle
 *  windows in the callout. Prepaid and postpaid book pills. */
export const telecomConsole = {
  header: {
    eyebrow: "TELECOM RECOVERY",
    title: "Receivables in treatment",
    subtitle: "Device receivables and service balances · prepaid and postpaid · routed from OSS / BSS",
    status: { label: "LIVE", live: true },
    kpi: {
      caption: "In treatment",
      value: 214680,
      sub: "accounts · $96.3M",
    },
  },
  callout: {
    icon: "route",
    title: "38,420 accounts placed in the last 24 hours",
    sub: "High daily volume · short recall window applied per tier",
    action: "Routing now",
  },
  columns: {
    primary: "Receivable type",
    bar: "Vendor allocation",
    trailing: "Accounts",
  },
  rows: [
    {
      primary: "Postpaid service balance",
      secondary: "Final bill · 30-day window",
      bar: { segments: [40, 35, 25] },
      trailing: { value: 98240, animate: "count" },
    },
    {
      primary: "Device receivable",
      secondary: "Equipment installment balance · postpaid",
      bar: { segments: [50, 30, 20] },
      trailing: { value: 62180, animate: "count" },
    },
    {
      primary: "Prepaid recharge shortfall",
      secondary: "Prepaid · negative balance · short cycle",
      bar: { segments: [60, 40] },
      trailing: { value: 38760, animate: "count" },
    },
    {
      primary: "Disconnect deficiency",
      secondary: "Service terminated · documentation hold",
      bar: { segments: [70, 30] },
      trailing: { value: 15500, animate: "count" },
    },
  ],
  pills: [
    { label: "Postpaid 78%" },
    { label: "Prepaid 22%", tone: "indigo" },
    { label: "Reconciled 04:00 today" },
  ],
  ariaSummary:
    "Telecom recovery console. 214,680 accounts are in treatment, worth $96.3M, with 38,420 accounts placed in the last 24 hours on a short recall window per tier. Four receivable types split across the vendor network: 98,240 postpaid service balances on a 30-day final-bill window, 62,180 device-receivable equipment installments, 38,760 prepaid recharge shortfalls on a short cycle, and 15,500 disconnect deficiencies on a documentation hold. The book is 78% postpaid and 22% prepaid, reconciled at 04:00 today.",
} satisfies ConsoleData;

/** Placement Schematic: how dPlat routes telecom accounts. OSS / BSS source
 *  feeds a routing decision engine that splits prepaid, postpaid, and device
 *  receivables across high-volume vendor pools, with recovered balances flowing
 *  to a sink. Pool structure sized for high daily volume. */
export const telecomRouting = {
  eyebrow: "HOW IT ROUTES",
  title: "Routing telecom accounts at volume",
  nodes: [
    { id: "oss", label: "OSS / BSS billing", sub: "ICOMS · CSG · Amdocs · carrier system", kind: "source" },
    { id: "engine", label: "Routing decision engine", sub: "Receivable type · prepaid vs postpaid · recall window", kind: "engine" },
    { id: "highvol", label: "High-volume vendor pool", sub: "Bulk daily placement · short cycle", kind: "vendor" },
    { id: "device", label: "Device-receivable pool", sub: "Installment-balance specialists", kind: "vendor" },
    { id: "sink", label: "Recovered and recalled", sub: "Reconciled to OSS / BSS", kind: "sink" },
  ],
  edges: [
    { from: "oss", to: "engine", label: "Loaded daily at volume", flow: true },
    { from: "engine", to: "highvol", label: "Service balance" },
    { from: "engine", to: "device", label: "Device receivable" },
    { from: "highvol", to: "sink", label: "Recovered or recalled" },
    { from: "device", to: "sink", label: "Recovered or recalled" },
  ],
  ariaSummary:
    "Routing diagram for telecom accounts at volume. The OSS or BSS billing system loads accounts daily at high volume into the routing decision engine, which sorts by receivable type, prepaid versus postpaid, and recall window. Service balances route to a high-volume vendor pool tuned for bulk daily placement on a short cycle, and device receivables route to an installment-balance specialist pool, both drawn from the carrier's existing vendors. Recovered or recalled balances reconcile back to OSS or BSS.",
} satisfies SchematicData;

/** Optimization Console (the telecom optimization item): short-cycle recall and
 *  reallocation rows with window timers per tier. */
export const telecomRecall = {
  header: {
    eyebrow: "WORKFLOW CONFIG",
    title: "Short-cycle recall, tuned to write-off timelines",
    subtitle: "Recall windows per tier · idle accounts reallocated · counts move every cycle",
  },
  columns: {
    primary: "Tier",
    bar: "Reallocated share",
    trailing: "Accounts",
  },
  rows: [
    {
      primary: "Tier 1 · 21-day window",
      secondary: "First placement · recall on no contact",
      bar: { segments: [55, 45] },
      trailing: { value: 84210, animate: "shift" },
    },
    {
      primary: "Tier 2 · 30-day window",
      secondary: "Reallocated from tier 1 · fresh vendor",
      bar: { segments: [60, 40] },
      trailing: { value: 51640, animate: "shift" },
    },
    {
      primary: "Tier 3 · 45-day window",
      secondary: "Aged balance · final pool before write-off",
      bar: { segments: [70, 30] },
      trailing: { value: 28930, animate: "shift" },
    },
  ],
  pills: [
    { label: "Recall on no contact" },
    { label: "Idle accounts reallocated", tone: "indigo" },
  ],
  ariaSummary:
    "Short-cycle recall console. Recall windows are configured per tier and tuned to telecom write-off timelines, so accounts do not sit idle in a pool that is not producing. Tier 1 runs a 21-day window across 84,210 accounts with recall on no contact, tier 2 runs a 30-day window across 51,640 accounts reallocated to a fresh vendor, and tier 3 runs a 45-day window across 28,930 aged accounts in the final pool before write-off. Counts move every cycle as accounts reallocate.",
} satisfies ConsoleData;

/** Issues DataStory (the telecom DataStory carrier, SOLVIS-04): prepaid vs
 *  postpaid treatment-path split as bars with an annotation. */
export const telecomPrepaidPostpaid = {
  eyebrow: "PREPAID VS POSTPAID",
  headline: "Prepaid and postpaid run separate treatment paths under one platform",
  chart: {
    kind: "bars",
    series: [
      { label: "Postpaid · final bill", value: 98240, tone: "indigo" },
      { label: "Postpaid · device receivable", value: 62180 },
      { label: "Prepaid · recharge shortfall", value: 38760, tone: "success" },
      { label: "Prepaid · short-cycle recall", value: 14900, tone: "warning" },
    ],
  },
  annotation: {
    value: "2 paths",
    caption: "Prepaid runs a shorter cycle with lighter contact · postpaid carries device-receivable and final-bill treatment",
  },
  ariaSummary:
    "Prepaid versus postpaid treatment split. Postpaid and prepaid run separate paths under one platform. Postpaid carries 98,240 final-bill accounts and 62,180 device-receivable accounts on standard treatment. Prepaid carries 38,760 recharge-shortfall accounts and 14,900 short-cycle recall accounts on a shorter cycle with lighter contact. Each account type gets the treatment path it calls for.",
} satisfies DataStoryData;
