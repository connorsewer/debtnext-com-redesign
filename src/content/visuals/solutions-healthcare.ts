/**
 * /solutions/healthcare visual payloads (Plan 12-04, Task 1).
 *
 * Four typed payloads that replace the duplicate SolutionsIndustryCards widget
 * on /solutions/healthcare with a real per-industry visual library:
 *   - healthcareConsole: the ProductVisualBand hero (SOLVIS-02)
 *   - healthcareRouting: placement accordion item Schematic (SOLVIS-03)
 *   - healthcareConfig: optimization accordion item Console (SOLVIS-05)
 *   - healthcareReconciliation: reporting accordion item DataStory (SOLVIS-04)
 *
 * Archetype + placement per 12-ARCHETYPE-MAP.md (D-08 approved). Healthcare
 * accent is --chart-4 (D-11, unshared). All payloads use `satisfies <Schema>`
 * (never a type annotation) so excess/missing fields fail at compile time.
 *
 * Cluster differentiation (the binding burden of this plan): healthcare is the
 * third member of the utilities/insurance/healthcare "reconcile daily" cluster.
 * Its reconciliation DataStory is an AREA chart (utilities = spark, insurance =
 * bars), its Schematic source node is EHR / clearinghouse (utilities = billing /
 * CIS, insurance = policy admin), and its row nouns are self-pay and
 * balance-after-insurance (no other industry uses them).
 *
 * Distinctness hooks (the spec asserts these): the hero and config rows carry
 * "self-pay", healthcare's industry-unique string. Balances and counts sit
 * plausibly between utilities (small balances, high counts) and
 * financial-services (large balances), per the relative-magnitude guardrail.
 *
 * [CLAIMS REVIEW] Every figure below is a numeric claim: account counts,
 * balances, match rates. Real-shaped, anonymized, generic per D-09; Andrew
 * pre-cleared 2026-06-12 (AUDIT FIX-03, project memory). Tag retained for audit
 * traceability, non-blocking this phase. No named clients, no client logos.
 * Patient-data framing is illustrative only: no real PHI, no real identifiers.
 *
 * [COI REVIEW] Routing captions reference the originator's vendor network.
 * Framing stays agency-network-agnostic per CLAUDE.md §6 ("routes across the
 * provider's existing vendors"); no claim positions dPlat as structurally
 * separate from TSI's ARM business.
 *
 * Voice per CLAUDE.md §5: no em dashes (· as separator), no banned phrases,
 * sentence case, digits.
 */

import type { ConsoleData, DataStoryData, SchematicData } from "./types";

/** Hero Console: patient accounts in treatment. Self-pay and
 *  balance-after-insurance rows, split across EBO and bad-debt tracks, with a
 *  billing-cycle-driven placement-timing callout. Mid-size balances, high
 *  counts (between utilities and financial-services). */
export const healthcareConsole = {
  header: {
    eyebrow: "HEALTHCARE RECOVERY",
    title: "Patient accounts in treatment",
    subtitle: "Self-pay and balance-after-insurance · EBO and bad-debt tracks · routed from patient accounting",
    status: { label: "LIVE", live: true },
    kpi: {
      caption: "In treatment",
      value: 36740,
      sub: "accounts · $48.9M",
    },
  },
  callout: {
    icon: "route",
    title: "7,260 accounts cleared the billing cycle and are ready to route",
    sub: "Statement cycle complete · self-pay and balance-after-insurance segmented",
    action: "Routing now",
  },
  columns: {
    primary: "Balance type",
    bar: "Track allocation",
    trailing: "Accounts",
  },
  rows: [
    {
      primary: "Self-pay",
      secondary: "No coverage on file · early-out track",
      bar: { segments: [50, 30, 20] },
      trailing: { value: 14120, animate: "count" },
    },
    {
      primary: "Balance after insurance",
      secondary: "Payer adjudicated · patient responsibility",
      bar: { segments: [55, 45] },
      trailing: { value: 12480, animate: "count" },
    },
    {
      primary: "Extended business office",
      secondary: "Pre-bad-debt · soft treatment",
      bar: { segments: [60, 40] },
      trailing: { value: 6320, animate: "count" },
    },
    {
      primary: "Bad debt",
      secondary: "Charity screened · placed to recovery",
      bar: { segments: [70, 30] },
      trailing: { value: 3820, animate: "count" },
    },
  ],
  pills: [
    { label: "Self-pay 58%" },
    { label: "Balance after insurance 42%", tone: "indigo" },
    { label: "Reconciled 04:00 today" },
  ],
  ariaSummary:
    "Healthcare recovery console. 36,740 patient accounts are in treatment, worth $48.9M, with 7,260 accounts that cleared the statement cycle and are ready to route. Four balance types split across the EBO and bad-debt tracks: 14,120 self-pay accounts with no coverage on file on an early-out track, 12,480 balance-after-insurance accounts where the payer has adjudicated and the balance is patient responsibility, 6,320 extended business office accounts in pre-bad-debt soft treatment, and 3,820 bad-debt accounts that were charity screened then placed to recovery. The book is 58% self-pay and 42% balance after insurance, reconciled at 04:00 today.",
} satisfies ConsoleData;

/** Placement Schematic: how dPlat routes healthcare accounts. EHR /
 *  clearinghouse source feeds a routing decision engine that splits accounts by
 *  balance stage across the provider's EBO and bad-debt vendor pools, with
 *  recovered balances flowing to a sink. Source node is distinct from utilities
 *  billing/CIS and insurance policy admin. */
export const healthcareRouting = {
  eyebrow: "HOW IT ROUTES",
  title: "Routing healthcare accounts",
  nodes: [
    { id: "ehr", label: "EHR / clearinghouse", sub: "Epic · Cerner · patient accounting feed", kind: "source" },
    { id: "engine", label: "Routing decision engine", sub: "Balance stage · service date · coverage status", kind: "engine" },
    { id: "ebo", label: "EBO vendor pool", sub: "Early-out · pre-bad-debt", kind: "vendor" },
    { id: "bd", label: "Bad-debt vendor pool", sub: "Post charity screen · recovery", kind: "vendor" },
    { id: "sink", label: "Recovered and reconciled", sub: "Posted back to patient accounting", kind: "sink" },
  ],
  edges: [
    { from: "ehr", to: "engine", label: "Loaded daily", flow: true },
    { from: "engine", to: "ebo", label: "Early stage" },
    { from: "engine", to: "bd", label: "Bad debt" },
    { from: "ebo", to: "sink", label: "Recovered" },
    { from: "bd", to: "sink", label: "Recovered" },
  ],
  ariaSummary:
    "Routing diagram for healthcare accounts. The EHR or clearinghouse loads accounts daily into the routing decision engine, which sorts by balance stage, service date, and coverage status. Early-stage accounts route to an extended business office vendor pool and bad-debt accounts route to a recovery vendor pool after charity screening, both drawn from the provider's existing vendors. Recovered balances post back to patient accounting and reconcile.",
} satisfies SchematicData;

/** Optimization Console: EBO and bad-debt work configured separately. Each
 *  track gets its own vendor pool, cycle, and treatment posture. */
export const healthcareConfig = {
  header: {
    eyebrow: "WORKFLOW CONFIG",
    title: "EBO and bad-debt, configured separately",
    subtitle: "Two tracks · shared or split vendor pools · independent cycles",
  },
  columns: {
    primary: "Track",
    bar: "Vendor pool share",
    trailing: "Accounts",
  },
  rows: [
    {
      primary: "Extended business office",
      secondary: "Early-out · 120-day cycle · self-pay outreach first",
      bar: { segments: [55, 25, 20] },
      trailing: { value: 20440, animate: "count" },
    },
    {
      primary: "Bad debt",
      secondary: "Specialist pool · 90-day cycle · charity screen on",
      bar: { segments: [60, 40] },
      trailing: { value: 16300, animate: "count" },
    },
  ],
  pills: [
    { label: "Self-pay outreach · EBO" },
    { label: "Charity screen · bad debt", tone: "indigo" },
  ],
  ariaSummary:
    "Workflow configuration console. The extended business office and bad-debt tracks are configured separately. EBO runs an early-out posture on a 120-day cycle with self-pay outreach first, across 20,440 accounts. Bad debt runs a specialist pool on a 90-day cycle with charity screening on, across 16,300 accounts. Vendor pools can be shared or split between the two tracks.",
} satisfies ConsoleData;

/** Reporting DataStory (the healthcare DataStory carrier, SOLVIS-04, and the
 *  cluster differentiator): a daily reconciliation AREA chart of self-pay and
 *  balance-after-insurance recoveries with a match-rate annotation. The area
 *  shape is distinct from utilities' spark and insurance's bars. */
export const healthcareReconciliation = {
  eyebrow: "RECONCILIATION",
  headline: "Self-pay and balance-after-insurance recoveries reconcile daily across the network",
  chart: {
    kind: "area",
    points: [62, 65, 64, 68, 71, 70, 74, 76, 78],
  },
  annotation: {
    value: "99.1%",
    caption: "Daily match rate on self-pay and balance-after-insurance recoveries · exceptions surface for review",
  },
  ariaSummary:
    "Daily reconciliation area chart over 9 days. Self-pay and balance-after-insurance recoveries trend upward and match against the vendor network every day, holding a 99.1% daily match rate. Unmatched balances surface as exceptions for review, so reporting stays accurate across the network.",
} satisfies DataStoryData;
