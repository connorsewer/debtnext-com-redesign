/**
 * /platform/reporting accordion payloads (PLATVIS-01).
 *
 * One typed payload per FeatureAccordion item id, authored against the approved
 * 11-ARCHETYPE-MAP.md mapping (the reporting rows are authoritative). Each payload
 * reads DISTINCTLY (D-02): its own numbers, its own row/chart shape, no two alike,
 * and distinct from every placement, optimization, and issues payload.
 *
 * Approved reporting mapping (11-ARCHETYPE-MAP.md):
 *   inventory -> Console            open-inventory rows by tier + aging bar + count + liquidation KPI
 *   vendor    -> Data-story (bars)  liquidation-rate bars for 4 vendors in a pool + blended-rate note
 *   cost      -> Data-story (area)  commission-cost / net-back area across 8 periods + net-back note
 *   sla       -> Console            vendor adherence rows + adherence bar + resolution-time trailing
 *   activity  -> Data-story (bars)  activity-type volume bars (phones, contacts, letters, settlements)
 *
 * Distinctness notes (D-02):
 *   - The reporting `sla` payload is vendor ADHERENCE to work standards with a
 *     resolution-time trailing value; the issues `sla` payload is an SLA-timer
 *     worklist of individual issues (ISS ids, hours-left, escalation). Different
 *     numbers, different row meaning, different archetype intent.
 *   - The reporting `vendor` bars cover a DIFFERENT pool with DIFFERENT liquidation
 *     rates and a blended-rate annotation; the optimization `bands` bars sort
 *     vendors into configured high/mid/low bands with their own values. No overlap.
 *
 * Governance (D-09 / D-10): numbers are real-shaped, anonymized, generic, and
 * qualified. No client identifiers (CLAUDE.md §15). Every numeric payload carries
 * a [CLAIMS REVIEW] comment; captions touching the vendor network or cross-vendor
 * comparison carry [COI REVIEW]. Andrew pre-cleared these figures and the
 * vendor/TSI framing for Phase 11 (D-10); tags stay for audit and are non-blocking
 * this phase. Every payload sets the REQUIRED ariaSummary. Voice: no em dashes, no
 * "not X, it's Y", no banned phrases, sentence case, digits (CLAUDE.md §5).
 */

import type { ConsoleData, DataStoryData } from "./types";

// ---------------------------------------------------------------------------
// inventory -> Console (open-inventory rows by tier, aging bar, count, KPI)
// ---------------------------------------------------------------------------
// [CLAIMS REVIEW] open-inventory counts, aging percentages, and the portfolio
// liquidation rate are illustrative, real-shaped magnitudes, anonymized; not a
// client's measured inventory.
// [COI REVIEW] inventory rows track accounts across the originator's existing
// vendor tiers; agency-network-agnostic framing.
export const reportingInventory = {
  header: {
    eyebrow: "INVENTORY AND LIQUIDATION",
    title: "Open inventory by treatment tier",
    subtitle: "All portfolios · aging against your treatment cycle",
    status: { label: "LIVE", live: true },
    kpi: {
      caption: "Portfolio liquidation rate",
      value: 18.6,
      valueSuffix: "%",
      decimals: 1,
      sub: "trailing 12 months · across closed pools",
    },
  },
  columns: {
    primary: "Tier",
    bar: "Share aging past window",
    trailing: "Open accounts",
  },
  rows: [
    {
      primary: "Pre-collect",
      secondary: "30-day window · 3 vendors",
      bar: { segments: [18], tone: "success" },
      trailing: { value: 41280, animate: "count" },
    },
    {
      primary: "Primary",
      secondary: "60-day window · 3 vendors",
      bar: { segments: [34], tone: "indigo" },
      trailing: { value: 28640, animate: "count" },
    },
    {
      primary: "Secondary",
      secondary: "90-day window · 2 vendors",
      bar: { segments: [52], tone: "warning" },
      trailing: { value: 16110, animate: "count" },
    },
    {
      primary: "Tertiary",
      secondary: "120-day window · 2 vendors",
      bar: { segments: [71], tone: "warning" },
      trailing: { value: 9425, animate: "count" },
    },
  ],
  pills: [
    { label: "Aging shown against your treatment cycle", tone: "indigo" },
    { label: "Filter by tier, vendor, product, or period" },
  ],
  ariaSummary:
    "Inventory console. Open inventory is grouped by treatment tier and aged against the cycle the originator configures, with a 18.6% trailing-12-month portfolio liquidation rate across closed pools. Pre-collect holds 41,280 open accounts with 18% aging past its 30-day window, primary holds 28,640 with 34% aging past 60 days, secondary holds 16,110 with 52% aging past 90 days, and tertiary holds 9,425 with 71% aging past 120 days. Inventory filters by tier, vendor, product, or period.",
} satisfies ConsoleData;

// ---------------------------------------------------------------------------
// vendor -> Data-story (bars: per-vendor liquidation in a pool, blended note)
// ---------------------------------------------------------------------------
// [CLAIMS REVIEW] per-vendor liquidation rates and the blended pool rate are
// illustrative, real-shaped magnitudes, anonymized; not a client's contracted
// vendor results.
// [COI REVIEW] the bars compare vendors head to head inside the originator's
// existing network; agency-network-agnostic framing.
export const reportingVendor = {
  eyebrow: "VENDOR PERFORMANCE",
  headline: "Compare vendors head to head inside a pool",
  chart: {
    kind: "bars",
    // Primary-pool liquidation, distinct vendors and rates from the optimization
    // bands payload (which sorts a different vendor set into configured bands).
    series: [
      { label: "Recovery partner D", value: 21.3, tone: "success" },
      { label: "Recovery partner A", value: 18.9, tone: "indigo" },
      { label: "Recovery partner F", value: 16.4, tone: "indigo" },
      { label: "Recovery partner C", value: 13.7, tone: "warning" },
    ],
  },
  annotation: {
    value: "Blended pool rate 17.6%",
    caption: "primary pool · liquidation, net-back, activity, and compliance roll up the same way",
  },
  ariaSummary:
    "Vendor-comparison bars. Within one primary pool four vendors are compared on liquidation: Recovery partner D leads at 21.3%, Recovery partner A follows at 18.9%, Recovery partner F at 16.4%, and Recovery partner C at 13.7%, against a blended pool rate of 17.6%. Net-back, activity volume, and compliance to your work standards roll up the same way, and the comparison feeds the optimization engine when it is in use.",
} satisfies DataStoryData;

// ---------------------------------------------------------------------------
// cost -> Data-story (area: commission cost / net-back across 8 periods)
// ---------------------------------------------------------------------------
// [CLAIMS REVIEW] the net-back trajectory and the per-account net-back figure are
// illustrative, real-shaped magnitudes, anonymized.
// [COI REVIEW] cost and net-back are modeled across the originator's vendor
// commissions; agency-network-agnostic framing.
export const reportingCost = {
  eyebrow: "COST AND NET-BACK",
  headline: "Net-back trended over time with commission modeling",
  chart: {
    kind: "area",
    // 8 monthly net-back-per-account points climbing as cost is tuned.
    points: [0.34, 0.41, 0.46, 0.52, 0.58, 0.67, 0.74, 0.82],
  },
  annotation: {
    value: "$162.40 net-back per account",
    caption: "this period · model commission changes against historical placement",
  },
  ariaSummary:
    "Cost and net-back trend. Across the last 8 monthly periods net-back per account climbed as commission terms were tuned at the tier, pool, and vendor level, reaching $162.40 per account this period. Commission cost and net-back trend together, and proposed commission changes can be modeled against historical placement before they ship.",
} satisfies DataStoryData;

// ---------------------------------------------------------------------------
// sla -> Console (vendor adherence rows, adherence bar, resolution-time)
// ---------------------------------------------------------------------------
// Distinct from issues `sla`: this is vendor ADHERENCE to your work standards with
// an issue-resolution-time trailing value, not an open-issue SLA-timer worklist.
// [CLAIMS REVIEW] per-vendor adherence percentages and resolution-time figures are
// illustrative, real-shaped magnitudes, anonymized.
// [COI REVIEW] adherence measures vendors in the originator's network against the
// originator's work standards; agency-network-agnostic framing.
export const reportingSla = {
  header: {
    eyebrow: "SLA AND COMPLIANCE",
    title: "Vendor adherence to your work standards",
    subtitle: "Trailing 90 days · scheduled to compliance stakeholders",
    status: { label: "REPORTED" },
  },
  columns: {
    primary: "Vendor",
    bar: "Adherence to work standard",
    trailing: "Avg resolution",
  },
  rows: [
    {
      primary: "Recovery partner A",
      secondary: "Meets standard · 0 regulatory exceptions open",
      bar: { segments: [98], tone: "success" },
      trailing: { value: 2.1, suffix: "d", decimals: 1, animate: "none" },
    },
    {
      primary: "Recovery partner D",
      secondary: "Meets standard · 1 exception in review",
      bar: { segments: [95], tone: "success" },
      trailing: { value: 2.8, suffix: "d", decimals: 1, animate: "none" },
    },
    {
      primary: "Recovery partner C",
      secondary: "Below standard · improvement plan active",
      bar: { segments: [89], tone: "warning" },
      trailing: { value: 4.3, suffix: "d", decimals: 1, animate: "none" },
    },
  ],
  pills: [
    { label: "Adherence measured against your work standard", tone: "indigo" },
    { label: "Export for audit · schedule recurring delivery" },
  ],
  ariaSummary:
    "SLA-adherence console. Vendors are measured against the work standard the originator defines over a trailing 90 days, with average issue-resolution time alongside. Recovery partner A meets the standard at 98% adherence and a 2.1-day average resolution with no open regulatory exceptions, Recovery partner D meets it at 95% with one exception in review and 2.8 days, and Recovery partner C sits below standard at 89% with a 4.3-day average and an active improvement plan. Adherence exports for audit and schedules recurring delivery to compliance stakeholders.",
} satisfies ConsoleData;

// ---------------------------------------------------------------------------
// activity -> Data-story (bars: vendor activity types by volume)
// ---------------------------------------------------------------------------
// [CLAIMS REVIEW] activity-volume counts are illustrative, real-shaped magnitudes,
// anonymized; not a client's measured activity.
// [COI REVIEW] activity rolls up across the originator's existing vendor network;
// agency-network-agnostic framing.
export const reportingActivity = {
  eyebrow: "ACTIVITY ANALYSIS",
  headline: "Vendor activity broken down by type",
  chart: {
    kind: "bars",
    // Activity-type volume in thousands across the network this period.
    series: [
      { label: "Phones attempted", value: 84.2, tone: "indigo" },
      { label: "Contacts established", value: 31.6, tone: "indigo" },
      { label: "Letters sent", value: 52.9, tone: "success" },
      { label: "Settlements offered", value: 12.4, tone: "warning" },
    ],
  },
  annotation: {
    value: "Groupings are configurable",
    caption: "this period in thousands · match the categories to your activity taxonomy",
  },
  ariaSummary:
    "Activity-breakdown bars. Vendor activity this period is broken down by type, in thousands: 84.2 phones attempted, 31.6 contacts established, 52.9 letters sent, and 12.4 settlements offered. The activity categories are configurable so the breakdown matches your own activity taxonomy, and the same view filters by vendor, tier, or period.",
} satisfies DataStoryData;

// ---------------------------------------------------------------------------
// Flagship payload: the reporting BenefitSplit Explorable Console (PLATVIS-02/03)
// ---------------------------------------------------------------------------
// Refactors ReportingDashboard (D-07) into a typed ConsoleData payload plus
// per-metric detail. The ReportingFlagship component composes Explorable.Toggle
// (one per dashboard metric) + Explorable.Panel (that metric's detail chart and
// figures) around this data. The four ReportingDashboard cards are preserved:
// liquidation by treatment tier, net-back trend, top vendors, and SLA adherence.
// All headline values render by default (D-05 parity): the console rows carry the
// liquidation-by-tier figures, the pills carry the net-back, top-vendor, and SLA
// headline metrics, and the detail panels render their figures unconditionally.
// Motion is additive.
// [CLAIMS REVIEW] liquidation-by-tier rates, net-back, top-vendor shares, and SLA
// adherence are illustrative, real-shaped magnitudes, anonymized; not a client's
// measured results.
// [COI REVIEW] the dashboard ranks and rewards vendors in the originator's
// existing network; agency-network-agnostic framing.
export const reportingFlagshipConsole = {
  header: {
    eyebrow: "REPORTING · EXECUTIVE VIEW",
    title: "Portfolio performance · liquidation by tier",
    subtitle: "All portfolios · refreshed 04:00 today · feeds your BI environment",
    status: { label: "LIVE", live: true },
  },
  columns: {
    primary: "Treatment tier",
    bar: "Liquidation rate",
    trailing: "Rate",
  },
  rows: [
    {
      primary: "Pre-collect",
      secondary: "30-day window · highest yield",
      bar: { segments: [85], tone: "success" },
      trailing: { value: 28.4, suffix: "%", decimals: 1, animate: "none" },
    },
    {
      primary: "Primary",
      secondary: "60-day window",
      bar: { segments: [55], tone: "indigo" },
      trailing: { value: 18.4, suffix: "%", decimals: 1, animate: "none" },
    },
    {
      primary: "Secondary",
      secondary: "90-day window",
      bar: { segments: [34], tone: "indigo" },
      trailing: { value: 11.2, suffix: "%", decimals: 1, animate: "none" },
    },
    {
      primary: "Tertiary",
      secondary: "120-day window",
      bar: { segments: [19], tone: "warning" },
      trailing: { value: 6.4, suffix: "%", decimals: 1, animate: "none" },
    },
  ],
  pills: [
    { label: "Net-back per account $162.40", tone: "indigo" },
    { label: "SLA adherence 30-day 97.4%" },
    { label: "Feeds Power BI, Tableau, Looker" },
  ],
  ariaSummary:
    "Reporting executive console. Portfolio performance refreshes at 04:00 daily and feeds your BI environment. Liquidation by treatment tier reads 28.4% pre-collect, 18.4% primary, 11.2% secondary, and 6.4% tertiary. Net-back per account is $162.40 and 30-day SLA adherence is 97.4%, and the same data feeds Power BI, Tableau, and Looker. Open a metric below to inspect its detail.",
} satisfies ConsoleData;

// Per-metric detail revealed inside the flagship Explorable panels. Each id is a
// dashboard metric from ReportingDashboard. Values render by default in the panel
// content (D-05); the toggle only highlights which metric is in focus. Each metric
// carries a small typed series so the panel can draw a sparkline-style trend, and
// the headline figure is always present as text (never chart-only, Pitfall 8).
// [CLAIMS REVIEW] per-metric headline figures, deltas, and trend series are
// illustrative, real-shaped magnitudes, anonymized.
// [COI REVIEW] the top-vendor metric ranks vendors in the originator's network;
// agency-network-agnostic framing.
export const reportingFlagshipMetrics = [
  {
    id: "liquidation",
    label: "Liquidation by tier",
    headline: "28.4% pre-collect",
    delta: "Up 2.1 points",
    deltaTone: "success",
    detail:
      "Liquidation by treatment tier, highest in pre-collect at 28.4% and stepping down through primary, secondary, and tertiary as accounts age.",
    trend: [0.62, 0.66, 0.64, 0.71, 0.74, 0.78, 0.85],
  },
  {
    id: "net-back",
    label: "Net-back · 12 months",
    headline: "$162.40 per account",
    delta: "Up $11.40",
    deltaTone: "success",
    detail:
      "Net-back per account across the last 12 months, climbing as commission terms were tuned against historical placement.",
    trend: [0.2, 0.3, 0.42, 0.5, 0.62, 0.7, 0.78, 0.85, 0.9, 0.96],
  },
  {
    id: "vendors",
    label: "Top vendors · liquidation",
    headline: "Recovery partner D 21.3%",
    delta: "Recovery partner A 18.9%",
    deltaTone: "indigo",
    detail:
      "Top vendors ranked by liquidation in the primary pool: Recovery partner D at 21.3%, Recovery partner A at 18.9%, Recovery partner F at 16.4%, and Recovery partner C at 13.7%.",
    trend: [0.71, 0.63, 0.55, 0.46],
  },
  {
    id: "sla",
    label: "SLA adherence · 30D",
    headline: "97.4% adherence",
    delta: "Target 95.0% exceeded",
    deltaTone: "success",
    detail:
      "30-day SLA adherence at 97.4% against a 95.0% target, audited by vendor and issue type and exportable for compliance review.",
    trend: [0.5, 0.6, 0.55, 0.7, 0.8, 0.75, 1],
  },
] as const;

export type ReportingFlagshipMetric = (typeof reportingFlagshipMetrics)[number];
