/**
 * /solutions/financial-services visual payloads (Plan 12-02, Task 1).
 *
 * Four typed payloads that replace the duplicate SolutionsIndustryCards widget
 * on /solutions/financial-services with a real per-industry visual library:
 *   - financialServicesConsole: the ProductVisualBand hero (SOLVIS-02)
 *   - financialServicesRouting: placement accordion item Schematic (SOLVIS-03)
 *   - financialServicesExceptions: issues accordion item DataStory (SOLVIS-04)
 *   - financialServicesSettlement: optimization accordion item Console (SOLVIS-05)
 *
 * Archetype + placement per 12-ARCHETYPE-MAP.md (D-08 approved). Financial
 * services accent is --chart-1 (unique among the six). The DataStory carrier is
 * the issues item (this page has no reporting item). All payloads use
 * `satisfies <Schema>` (never a type annotation) so excess/missing fields fail
 * at compile time.
 *
 * Distinctness hooks (the spec asserts these): the hero carries "charge-off",
 * financial-services' industry-unique string, on charged-off card, consumer
 * loan, and line-of-credit rows. Larger balances and lower counts than utilities
 * (relative-magnitude guardrail). The routing source is core banking / loan
 * servicing, distinct from utilities' billing/CIS and telecom's OSS/BSS. The
 * issues DataStory (bankruptcy, deceased, disputes) is an exception subject no
 * other page carries.
 *
 * [CLAIMS REVIEW] Every figure below is a numeric claim: account counts,
 * balances, settlement floors, exception volumes. Real-shaped, anonymized,
 * generic per D-09; Andrew pre-cleared 2026-06-12 (AUDIT FIX-03, project
 * memory). Reg F is referenced as a configured treatment, not a certification
 * claim. Tag retained for audit traceability, non-blocking this phase. No named
 * clients, no client logos.
 *
 * [COI REVIEW] Routing captions reference the originator's vendor network.
 * Framing stays agency-network-agnostic per CLAUDE.md §6 ("routes across the
 * originator's existing agencies and law firms"); no claim positions dPlat as
 * structurally separate from TSI's ARM business.
 *
 * Voice per CLAUDE.md §5: no em dashes (· as separator), no banned phrases,
 * sentence case, digits.
 */

import type { ConsoleData, DataStoryData, SchematicData } from "./types";

/** Hero Console: charged-off financial-services receivables in treatment.
 *  Charge-off card, consumer loan, line-of-credit rows with $ balances. Larger
 *  balances, lower counts (vs utilities). Bank and credit-union book pills. */
export const financialServicesConsole = {
  header: {
    eyebrow: "FINANCIAL SERVICES RECOVERY",
    title: "Charged-off receivables in treatment",
    subtitle: "Charge-off card, consumer loan, line of credit · routed from core banking · Reg F windows applied",
    status: { label: "LIVE", live: true },
    kpi: {
      caption: "In treatment",
      value: 31480,
      sub: "accounts · $204.8M",
    },
  },
  callout: {
    icon: "route",
    title: "$58.2M in charge-off balances ready to route",
    sub: "Segmented by product and balance band · settlement floors applied",
    action: "Routing now",
  },
  columns: {
    primary: "Product",
    bar: "Vendor allocation",
    trailing: "Balance",
  },
  rows: [
    {
      primary: "Charge-off card",
      secondary: "Post charge-off · Reg F contact cadence",
      bar: { segments: [40, 35, 25] },
      trailing: { value: 92.4, prefix: "$", suffix: "M", decimals: 1, animate: "count" },
    },
    {
      primary: "Consumer loan",
      secondary: "Installment · higher balance band",
      bar: { segments: [55, 45] },
      trailing: { value: 67.1, prefix: "$", suffix: "M", decimals: 1, animate: "count" },
    },
    {
      primary: "Line of credit",
      secondary: "Revolving · settlement-eligible",
      bar: { segments: [50, 30, 20] },
      trailing: { value: 31.6, prefix: "$", suffix: "M", decimals: 1, animate: "count" },
    },
    {
      primary: "Secured deficiency",
      secondary: "Post-repossession balance · documentation hold",
      bar: { segments: [65, 35] },
      trailing: { value: 13.7, prefix: "$", suffix: "M", decimals: 1, animate: "count" },
    },
  ],
  pills: [
    { label: "Bank book 64%" },
    { label: "Credit-union book 36%", tone: "indigo" },
    { label: "Reconciled 04:00 today" },
  ],
  ariaSummary:
    "Financial services recovery console. 31,480 charged-off accounts are in treatment, worth $204.8M, with $58.2M in charge-off balances ready to route. Four products split across the vendor network by balance: $92.4M in charge-off card receivables on a Reg F contact cadence, $67.1M in consumer-loan installment balances, $31.6M in revolving line-of-credit balances that are settlement-eligible, and $13.7M in secured deficiency balances on a documentation hold. The book is 64% bank and 36% credit-union, reconciled at 04:00 today.",
} satisfies ConsoleData;

/** Placement Schematic: how dPlat routes charged-off financial-services
 *  accounts. Core banking / loan servicing source feeds a routing decision
 *  engine that splits product and balance band across the originator's agency
 *  and law-firm pools, with recovered balances flowing to a sink. */
export const financialServicesRouting = {
  eyebrow: "HOW IT ROUTES",
  title: "Routing charged-off accounts",
  nodes: [
    { id: "core", label: "Core banking / loan servicing", sub: "FIS · Fiserv · Jack Henry · system of record", kind: "source" },
    { id: "engine", label: "Routing decision engine", sub: "Product · balance band · charge-off age · Reg F state", kind: "engine" },
    { id: "agency", label: "Agency pool", sub: "First and second placement", kind: "vendor" },
    { id: "legal", label: "Law-firm pool", sub: "Higher-balance · litigation-eligible", kind: "vendor" },
    { id: "sink", label: "Recovered and closed", sub: "Reconciled to core banking", kind: "sink" },
  ],
  edges: [
    { from: "core", to: "engine", label: "Loaded daily", flow: true },
    { from: "engine", to: "agency", label: "Standard band" },
    { from: "engine", to: "legal", label: "Higher balance" },
    { from: "agency", to: "sink", label: "Recovered" },
    { from: "legal", to: "sink", label: "Recovered" },
  ],
  ariaSummary:
    "Routing diagram for charged-off financial-services accounts. The core banking or loan-servicing system of record loads accounts daily into the routing decision engine, which sorts by product, balance band, charge-off age, and Reg F state. Standard-band balances route to an agency pool and higher-balance, litigation-eligible accounts route to a law-firm pool, both drawn from the originator's existing vendors. Recovered balances reconcile back to core banking and close.",
} satisfies SchematicData;

/** Issues DataStory (the financial-services DataStory carrier, SOLVIS-04):
 *  bankruptcy, deceased, and dispute exception volumes as bars with an
 *  examiner-ready annotation. Distinct exception subject vs every other page. */
export const financialServicesExceptions = {
  eyebrow: "EXCEPTIONS",
  headline: "Bankruptcy, deceased, and disputes apply their treatment automatically",
  chart: {
    kind: "bars",
    series: [
      { label: "Bankruptcy", value: 1840, tone: "indigo" },
      { label: "Deceased", value: 920 },
      { label: "Dispute", value: 2380, tone: "warning" },
      { label: "Documentation hold", value: 1360 },
    ],
  },
  annotation: {
    value: "100%",
    caption: "Reg F and bankruptcy treatments apply on detection · every exception stays recorded on the account for examiner review",
  },
  ariaSummary:
    "Exception volumes over the current cycle. dPlat applies the configured treatment automatically as each condition is detected: 1,840 bankruptcy accounts move to a hold, 920 deceased accounts route to estate handling, 2,380 disputes pause contact pending resolution, and 1,360 accounts wait on a documentation hold. Reg F and bankruptcy treatments apply on detection, and every exception stays recorded on the account for examiner review.",
} satisfies DataStoryData;

/** Optimization Console: settlement floors and payment plans enforced per pool.
 *  Each product band gets its own settlement floor and authorized cap. */
export const financialServicesSettlement = {
  header: {
    eyebrow: "WORKFLOW CONFIG",
    title: "Settlement floors and payment plans, enforced",
    subtitle: "Floors set per product and tier · nothing settles below your floor · plans tracked automatically",
  },
  columns: {
    primary: "Product",
    bar: "Authorized settlement range",
    trailing: "Floor",
  },
  rows: [
    {
      primary: "Charge-off card",
      secondary: "Tier 1 · plans tracked · delinquency flagged on miss",
      bar: { segments: [60, 40] },
      trailing: { value: 60, suffix: "%", animate: "shift" },
    },
    {
      primary: "Consumer loan",
      secondary: "Higher balance · supervisor cap above floor",
      bar: { segments: [70, 30] },
      trailing: { value: 65, suffix: "%", animate: "shift" },
    },
    {
      primary: "Line of credit",
      secondary: "Revolving · plan-eligible · floor enforced",
      bar: { segments: [55, 45] },
      trailing: { value: 55, suffix: "%", animate: "shift" },
    },
  ],
  pills: [
    { label: "Plans tracked automatically" },
    { label: "Delinquency flagged on miss", tone: "indigo" },
  ],
  ariaSummary:
    "Settlement configuration console. Settlement floors are set per product and tier, so nothing settles below the floor. Charge-off card settles at a 60% floor on tier 1, consumer loan at 65% with a supervisor cap above the floor, and line of credit at 55% with plans enforced. Payment plans track automatically across all three, and delinquency is flagged the moment a payment is missed.",
} satisfies ConsoleData;
