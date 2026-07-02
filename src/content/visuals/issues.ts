/**
 * /platform/issues accordion payloads (PLATVIS-01).
 *
 * One typed payload per FeatureAccordion item id, authored against the approved
 * 11-ARCHETYPE-MAP.md mapping (the issues rows are authoritative). Each payload
 * reads DISTINCTLY (D-02): its own numbers, its own row/node/chart shape, no two
 * alike, and distinct from every placement and optimization payload.
 *
 * Approved issues mapping (11-ARCHETYPE-MAP.md):
 *   auto-handling -> Console    regulated-condition rows + configured treatment + live status
 *   workflows     -> Schematic  custom issue type traveling created -> triaged -> SLA -> resolved
 *   vendor-portal -> Console    issue message thread, vendor and operator rows (uses align?)
 *   sla           -> Console    open-issue worklist rows with SLA timer bar + escalation pill
 *   audit         -> Data-story audit-event spark over a period + exportable annotation
 *
 * Governance (D-09 / D-10): numbers are real-shaped, anonymized, generic, and
 * qualified. No client identifiers (CLAUDE.md §15). Every numeric payload carries
 * a [CLAIMS REVIEW] comment; captions touching regulators or the vendor network
 * carry [COI REVIEW]. Andrew pre-cleared these figures and the vendor/regulatory
 * framing for Phase 11 (D-10); tags stay for audit and are non-blocking this
 * phase. Every payload sets the REQUIRED ariaSummary. Voice: no em dashes, no
 * "not X, it's Y", no banned phrases, sentence case, digits (CLAUDE.md §5).
 */

import type { ConsoleData, DataStoryData, SchematicData } from "./types";

// ---------------------------------------------------------------------------
// auto-handling -> Console (regulated-condition rows with configured treatment)
// ---------------------------------------------------------------------------
// [CLAIMS REVIEW] handled counts and the auto-handled rate are illustrative,
// real-shaped magnitudes, anonymized; not a client's measured results.
// [COI REVIEW] regulated-condition framing (deceased, bankruptcy, SCRA) and the
// vendor-notification treatment touch live regulatory language; Andrew's D-10
// clearance covers it, agency-network-agnostic.
export const issuesAutoHandling = {
  header: {
    eyebrow: "AUTO-HANDLING",
    title: "Regulated conditions handle themselves",
    subtitle: "Configured treatments · applied without operator action",
    status: { label: "ACTIVE", live: true },
  },
  columns: {
    primary: "Condition",
    bar: "Handled this month",
    trailing: "Auto-handled",
  },
  rows: [
    {
      primary: "Deceased",
      secondary: "Suspend treatment · open estate workflow · notify vendor",
      bar: { segments: [100], tone: "success" },
      trailing: { value: 312, animate: "count" },
    },
    {
      primary: "Bankruptcy",
      secondary: "Auto-recall · cease contact · flag account",
      bar: { segments: [100], tone: "success" },
      trailing: { value: 268, animate: "count" },
    },
    {
      primary: "SCRA",
      secondary: "Apply rate cap · confirm active duty · notify vendor",
      bar: { segments: [96], tone: "indigo" },
      trailing: { value: 74, animate: "count" },
    },
    {
      primary: "Balance discrepancy",
      secondary: "Hold contact · route to reconciliation queue",
      bar: { segments: [88], tone: "warning" },
      trailing: { value: 143, animate: "count" },
    },
  ],
  pills: [
    { label: "Treatments configured per condition", tone: "indigo" },
    { label: "Manual exceptions route to a queue" },
  ],
  ariaSummary:
    "Auto-handling console. Regulated conditions apply the treatment you configure without operator action. This month 312 deceased indicators suspended treatment and opened an estate workflow, 268 bankruptcy notices triggered auto-recall and cease-contact, 74 SCRA matches applied a rate cap after confirming active duty, and 143 balance discrepancies held contact and routed to reconciliation. Conditions that cannot resolve automatically route to a manual queue.",
} satisfies ConsoleData;

// ---------------------------------------------------------------------------
// workflows -> Schematic (custom issue type state machine)
// ---------------------------------------------------------------------------
// [CLAIMS REVIEW] the SLA window length on the timed node is an illustrative
// configuration value.
// [COI REVIEW] the manual branch routes to a recovery vendor in the originator's
// network; agency-network-agnostic framing.
export const issuesWorkflows = {
  eyebrow: "CONFIGURABLE WORKFLOWS",
  title: "A custom issue type moves through the states you define",
  nodes: [
    { id: "created", label: "Created", sub: "by rule, team, or vendor", kind: "source" },
    { id: "triaged", label: "Triaged", sub: "issue type assigned", kind: "engine" },
    { id: "auto", label: "Auto-resolved", sub: "rule applies treatment", kind: "sink" },
    { id: "manual", label: "Vendor action", sub: "SLA-timed, 48-hour window", kind: "vendor" },
    { id: "resolved", label: "Resolved", sub: "logged and audited", kind: "sink" },
  ],
  edges: [
    { from: "created", to: "triaged", label: "classify", flow: true },
    { from: "triaged", to: "auto", label: "automated path", flow: true },
    { from: "triaged", to: "manual", label: "manual path", flow: true },
    { from: "manual", to: "resolved", label: "action taken", flow: true },
  ],
  ariaSummary:
    "Workflow state diagram. A custom issue type is created by a rule, your team, or a vendor, then triaged so the issue type drives its path. From triage it branches: the automated path applies a configured treatment and auto-resolves, while the manual path opens a 48-hour SLA window for vendor action before resolving. Each issue type has its own states, SLA windows, and escalation rules.",
} satisfies SchematicData;

// ---------------------------------------------------------------------------
// vendor-portal -> Console (issue message thread, vendor and operator rows)
// ---------------------------------------------------------------------------
// Uses the D-08 additive optional `align?` field so vendor messages read on one
// side and operator messages on the other, a two-sided shared workspace.
// [CLAIMS REVIEW] the issue reference and timestamps are illustrative, anonymized
// placeholders; no real account or client identifier appears.
// [COI REVIEW] the thread shows a recovery vendor and an operator collaborating
// inside the originator's network; agency-network-agnostic framing.
export const issuesVendorPortal = {
  header: {
    eyebrow: "VENDOR PORTAL",
    title: "One issue thread, both sides of the work",
    subtitle: "Issue ISS-4821 · dispute · shared audit trail",
    status: { label: "OPEN" },
  },
  rows: [
    {
      primary: "Recovery partner A · 09:14",
      secondary: "Consumer disputes the balance after settlement, requests itemization.",
      align: "start",
    },
    {
      primary: "Operator · 09:41",
      secondary: "Itemization pulled from billing and attached. Routing to your review.",
      align: "end",
    },
    {
      primary: "Recovery partner A · 10:02",
      secondary: "Confirmed with the consumer, sharing the signed acknowledgment.",
      align: "start",
    },
    {
      primary: "Operator · 10:20",
      secondary: "Acknowledgment logged to the account. Marking the dispute resolved.",
      align: "end",
    },
  ],
  pills: [
    { label: "2 media items attached to the account", tone: "indigo" },
    { label: "No email reconciliation" },
  ],
  ariaSummary:
    "Vendor-portal issue thread. A single dispute, issue ISS-4821, is worked by a recovery vendor and an operator in one shared thread. At 09:14 the vendor logs that the consumer disputes the balance and requests itemization; at 09:41 the operator attaches the itemization from billing and routes it for review; at 10:02 the vendor shares a signed acknowledgment; at 10:20 the operator logs it to the account and resolves the dispute. Two media items attach to the account and the full thread is auditable, with no email reconciliation.",
} satisfies ConsoleData;

// ---------------------------------------------------------------------------
// sla -> Console (open-issue worklist with SLA timer bar + escalation)
// ---------------------------------------------------------------------------
// [CLAIMS REVIEW] open counts, time-remaining values, and the adherence figure
// are illustrative, real-shaped magnitudes, anonymized.
// [COI REVIEW] escalation routes aging issues to a vendor in the originator's
// network; agency-network-agnostic framing.
export const issuesSla = {
  header: {
    eyebrow: "SLA ENFORCEMENT",
    title: "Open issues, sorted by time remaining",
    subtitle: "94 open · 11 escalated · 30-day adherence 97.4%",
    status: { label: "TIMING", live: true },
  },
  columns: {
    primary: "Issue",
    bar: "SLA window remaining",
    trailing: "Hours left",
  },
  rows: [
    {
      primary: "Dispute · ISS-4829",
      secondary: "On time · assigned to Recovery partner A",
      bar: { segments: [62], tone: "success" },
      trailing: { value: 4.2, suffix: "h", decimals: 1, animate: "none" },
    },
    {
      primary: "Bankruptcy · ISS-4827",
      secondary: "Warning · auto-recall pending vendor confirmation",
      bar: { segments: [27], tone: "warning" },
      trailing: { value: 1.6, suffix: "h", decimals: 1, animate: "none" },
    },
    {
      primary: "Complaint · ISS-4818",
      secondary: "Escalated · routed to compliance review",
      bar: { segments: [9], tone: "warning" },
      trailing: { value: 0.3, suffix: "h", decimals: 1, animate: "none" },
    },
  ],
  pills: [
    { label: "Aging issues escalate on your rules", tone: "indigo" },
    { label: "Adherence audited by vendor and type" },
  ],
  ariaSummary:
    "SLA-worklist console. Open issues sort by time remaining against the window tied to each issue type. The ISS-4829 dispute is on time with 4.2 hours left, the ISS-4827 bankruptcy is in warning at 1.6 hours with an auto-recall pending vendor confirmation, and the ISS-4818 complaint has escalated to compliance review with 0.3 hours left. Of 94 open issues 11 have escalated, and 30-day SLA adherence is 97.4%, auditable by vendor and issue type.",
} satisfies ConsoleData;

// ---------------------------------------------------------------------------
// audit -> Data-story (audit-event spark over a period + exportable annotation)
// ---------------------------------------------------------------------------
// [CLAIMS REVIEW] the daily audit-event counts and the period total are
// illustrative, real-shaped magnitudes, anonymized.
// [COI REVIEW] the audit trail records vendor and operator interactions for
// regulatory review; agency-network-agnostic framing.
export const issuesAudit = {
  eyebrow: "AUDIT TRAIL",
  headline: "Every interaction is recorded and queryable",
  chart: {
    kind: "spark",
    // 8 daily audit-event volumes across an issue-heavy week.
    bars: [0.58, 0.71, 0.64, 0.83, 0.79, 0.92, 0.74, 0.88],
  },
  annotation: {
    value: "18,402 events logged",
    caption: "this period · timestamped, attributed, exportable for review",
  },
  ariaSummary:
    "Audit-trail trend. Across the last 8 days the volume of timestamped audit events tracked the week's issue load and totaled 18,402 events this period. Every interaction on every issue is attributed to a person or a rule and recorded with a timestamp, and the full log exports for regulatory review or internal compliance audits. Issue history follows the account through every placement.",
} satisfies DataStoryData;

// ---------------------------------------------------------------------------
// Flagship payload: the issues BenefitSplit Explorable Console (PLATVIS-02/03)
// ---------------------------------------------------------------------------
// Refactors IssuesWorklist (D-07) into a typed ConsoleData payload plus per-issue
// detail. The IssuesFlagship component composes Explorable.Toggle (one per
// worklist row) + Explorable.Panel (that issue's thread and SLA detail) around
// this data; all worklist values and the three metric cells render by default
// (D-05 parity), status is paired with a text label (Pitfall 8), motion is
// additive. The metric cells (SLA adherence, average resolution, auto-resolved)
// ride the pills so they render by default.
// [CLAIMS REVIEW] the open/escalated counts, SLA timers, status labels, and the
// adherence / resolution / auto-resolved metrics are illustrative, real-shaped
// magnitudes, anonymized; not a client's measured results.
// [COI REVIEW] the worklist routes issues across operators and recovery vendors
// in the originator's network; agency-network-agnostic framing.
export const issuesFlagshipConsole = {
  header: {
    eyebrow: "ISSUES MANAGEMENT",
    title: "Active worklist · sorted by SLA proximity",
    subtitle: "94 open · 11 escalated · auto-routed across portfolios",
    status: { label: "LIVE", live: true },
  },
  columns: {
    primary: "Issue · status",
    bar: "SLA window remaining",
    trailing: "Time left",
  },
  // Ordered by SLA proximity: soonest deadline first (matches the header
  // "sorted by SLA proximity" label). The resolved SCRA issue has no live SLA
  // window, so it sorts last with a neutral empty bar and a "Closed" text label
  // rather than a full green bar reading "0h" (HOME-3).
  rows: [
    {
      primary: "Complaint · ISS-4818 · escalated",
      secondary: "Routed to compliance review",
      bar: { segments: [9], tone: "warning" },
      trailing: { value: 0.3, suffix: "h", decimals: 1, animate: "none" },
    },
    {
      primary: "Bankruptcy · ISS-4827 · warning",
      secondary: "Auto-recall pending vendor confirmation",
      bar: { segments: [27], tone: "warning" },
      trailing: { value: 1.6, suffix: "h", decimals: 1, animate: "none" },
    },
    {
      primary: "Dispute · ISS-4829 · on time",
      secondary: "Assigned to Recovery partner A · itemization requested",
      bar: { segments: [62], tone: "success" },
      trailing: { value: 4.2, suffix: "h", decimals: 1, animate: "none" },
    },
    {
      primary: "SCRA · ISS-4824 · resolved · closed",
      secondary: "Active duty confirmed · rate cap applied · no SLA window",
      bar: { segments: [0], tone: "neutral" },
    },
  ],
  pills: [
    { label: "SLA adherence 30-day 97.4%", tone: "indigo" },
    { label: "Average resolution 3.2h" },
    { label: "Auto-resolved 64%" },
  ],
  ariaSummary:
    "Issues worklist console. An active worklist of 94 open issues, 11 escalated, sorts by SLA proximity across portfolios, soonest deadline first. The ISS-4818 complaint has escalated to compliance review with 0.3 hours left, the ISS-4827 bankruptcy is in warning at 1.6 hours with auto-recall pending, and the ISS-4829 dispute is on time with 4.2 hours left. The ISS-4824 SCRA issue is resolved and closed with no live SLA window after the engine applied a rate cap, so it sorts last with an empty bar. Across the portfolio 30-day SLA adherence is 97.4%, average resolution is 3.2 hours, and 64% of issues auto-resolve. Each status is shown with a text label, not color alone.",
} satisfies ConsoleData;

// Per-issue detail revealed inside the flagship Explorable panels. Each id
// matches a row above; the panel shows that issue's type, the assigned party, the
// SLA window, and the resolution status. Values render by default in the panel
// content (D-05); the toggle only highlights which issue is in focus, and status
// is carried as a text label (Pitfall 8), never color alone.
// [CLAIMS REVIEW] per-issue SLA windows and time-left values are illustrative,
// real-shaped magnitudes, anonymized.
export const issuesFlagshipItems = [
  {
    id: "iss-4829",
    label: "Dispute · ISS-4829",
    type: "Consumer dispute",
    assignedTo: "Recovery partner A",
    statusLabel: "On time",
    statusTone: "success",
    slaWindow: "8-hour window",
    timeLeft: "4.2h left",
    detail: "Consumer disputes the balance after settlement and requested itemization.",
  },
  {
    id: "iss-4827",
    label: "Bankruptcy · ISS-4827",
    type: "Bankruptcy notice",
    assignedTo: "Routing to recall",
    statusLabel: "Warning",
    statusTone: "warning",
    slaWindow: "4-hour window",
    timeLeft: "1.6h left",
    detail: "Chapter 7 notice received from the court feed, auto-recall pending vendor confirmation.",
  },
  {
    id: "iss-4824",
    label: "SCRA · ISS-4824",
    type: "SCRA match",
    assignedTo: "Resolved by the engine",
    statusLabel: "Resolved",
    statusTone: "success",
    slaWindow: "Auto-handled",
    timeLeft: "Closed",
    detail: "Active duty status confirmed, interest rate cap applied, vendor notified.",
  },
  {
    id: "iss-4818",
    label: "Complaint · ISS-4818",
    type: "Regulatory complaint",
    assignedTo: "Compliance review",
    statusLabel: "Escalated",
    statusTone: "breach",
    slaWindow: "2-hour window",
    timeLeft: "0.3h left",
    detail: "Complaint received, response draft routed to compliance review.",
  },
] as const;

export type IssuesFlagshipItem = (typeof issuesFlagshipItems)[number];
