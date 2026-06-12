/**
 * /platform/placement accordion payloads (PLATVIS-01).
 *
 * One typed payload per FeatureAccordion item id, authored against the approved
 * 11-ARCHETYPE-MAP.md mapping (Plan 11-01, Task 2 gate). Each payload reads
 * DISTINCTLY (D-02): its own numbers, its own node/row shape, no two alike.
 *
 * decision-engine reuses the existing `placementConsole` (placement.ts); it is
 * not re-authored here. The page imports it directly. This module adds the four
 * remaining items:
 *   vendor-pools  -> Schematic (pool fan-out)
 *   recall        -> Schematic (tier cascade)
 *   business-rules-> Console   (3-level override hierarchy)
 *   reconciliation-> Data-story(daily-run spark)
 *
 * Governance (D-09 / D-10): numbers are real-shaped, anonymized, generic, and
 * qualified. No client identifiers. Every numeric payload carries a
 * [CLAIMS REVIEW] comment; vendor-network framing carries [COI REVIEW]. Andrew
 * pre-cleared these figures and framing for Phase 11; tags stay for audit and
 * are non-blocking this phase. Every payload sets the REQUIRED ariaSummary.
 * Voice: no em dashes, no "not X, it's Y", no banned phrases, sentence case,
 * digits (CLAUDE.md §5).
 */

import type { ConsoleData, DataStoryData, SchematicData } from "./types";

// ---------------------------------------------------------------------------
// vendor-pools -> Schematic (pool fan-out)
// ---------------------------------------------------------------------------
// [CLAIMS REVIEW] vendor counts per pool are illustrative, real-shaped magnitudes.
// [COI REVIEW] the diagram frames placement fanning out across the originator's
// existing vendor network (pools by treatment stage); agency-network-agnostic.
export const placementVendorPools = {
  eyebrow: "VENDOR POOLS",
  title: "Placement fans out across treatment-stage pools",
  nodes: [
    { id: "placement", label: "Placement engine", sub: "1 source", kind: "engine" },
    { id: "pre-collect", label: "Pre-collect", sub: "3 vendors", kind: "vendor" },
    { id: "primary", label: "Primary", sub: "3 vendors", kind: "vendor" },
    { id: "secondary", label: "Secondary", sub: "2 vendors", kind: "vendor" },
    { id: "tertiary", label: "Tertiary", sub: "2 vendors", kind: "vendor" },
    { id: "specialty", label: "Specialty", sub: "2 vendors", kind: "vendor" },
  ],
  edges: [
    { from: "placement", to: "pre-collect", label: "30%", flow: true },
    { from: "placement", to: "primary", label: "28%", flow: true },
    { from: "placement", to: "secondary", label: "18%", flow: true },
    { from: "placement", to: "tertiary", label: "14%", flow: true },
    { from: "placement", to: "specialty", label: "10%", flow: true },
  ],
  ariaSummary:
    "Vendor pool diagram. One placement engine fans accounts out across five treatment-stage pools by allocation share: pre-collect takes 30% across 3 vendors, primary 28% across 3 vendors, secondary 18% across 2 vendors, tertiary 14% across 2 vendors, and specialty 10% across 2 vendors. Allocation share adjusts as performance shifts.",
} satisfies SchematicData;

// ---------------------------------------------------------------------------
// recall -> Schematic (tier cascade)
// ---------------------------------------------------------------------------
// [CLAIMS REVIEW] recall window lengths are illustrative configuration values.
// [COI REVIEW] recall framing routes accounts between tiers within the
// originator's network; agency-network-agnostic.
export const placementRecall = {
  eyebrow: "RECALL AND REALLOCATION",
  title: "Closed recall windows cascade accounts to the next tier",
  nodes: [
    { id: "pre", label: "Pre-collect", sub: "30-day window", kind: "source" },
    { id: "engine", label: "Recall engine", sub: "evaluates windows", kind: "engine" },
    { id: "primary", label: "Primary", sub: "60-day window", kind: "vendor" },
    { id: "secondary", label: "Secondary", sub: "90-day window", kind: "vendor" },
    { id: "recall", label: "Permanent recall", sub: "manual or auto", kind: "sink" },
  ],
  edges: [
    { from: "pre", to: "engine", label: "window closes", flow: true },
    { from: "engine", to: "primary", label: "to 60-day", flow: true },
    { from: "engine", to: "secondary", label: "to 90-day", flow: true },
    { from: "engine", to: "recall", label: "no further tier" },
  ],
  ariaSummary:
    "Recall cascade diagram. When a pre-collect 30-day window closes, the recall engine routes the account forward: to the primary 60-day tier, to the secondary 90-day tier, or to permanent recall when no further tier applies. Recall windows are configurable per tier and per vendor, and manual recall keeps a full audit trail.",
} satisfies SchematicData;

// ---------------------------------------------------------------------------
// business-rules -> Console (3-level override hierarchy)
// ---------------------------------------------------------------------------
// [CLAIMS REVIEW] commission, settlement, and plan-length values are illustrative
// configuration defaults and overrides, not a client's contracted terms.
export const placementBusinessRules = {
  header: {
    eyebrow: "BUSINESS RULES",
    title: "Rule resolution",
    subtitle: "Platform default, tier override, vendor override · 14 rules live",
    status: { label: "RESOLVED" },
  },
  columns: {
    primary: "Scope",
    bar: "Rule",
    trailing: "Resolved value",
  },
  rows: [
    {
      primary: "Platform default",
      secondary: "Commission rate",
      bar: { segments: [22], tone: "neutral" },
      trailing: { value: 22, suffix: "%", animate: "none" },
    },
    {
      primary: "Tier override",
      secondary: "Commission · secondary tier",
      bar: { segments: [28], tone: "indigo" },
      trailing: { value: 28, suffix: "%", animate: "none" },
    },
    {
      primary: "Vendor override",
      secondary: "Settlement threshold · specialty",
      bar: { segments: [65], tone: "warning" },
      trailing: { value: 65, suffix: "%", animate: "none" },
    },
    {
      primary: "Vendor override",
      secondary: "Payment plan length · max",
      bar: { segments: [80], tone: "indigo" },
      trailing: { value: 24, suffix: " mo", animate: "none" },
    },
  ],
  pills: [
    { label: "Set at platform, override at tier, override at vendor" },
    { label: "14 rules live", tone: "indigo" },
  ],
  ariaSummary:
    "Business-rule resolution console. Rules set at the platform level are overridden at the tier level and again at the vendor level. The platform commission default is 22%, overridden to 28% for the secondary tier; a specialty vendor sets a 65% settlement threshold; and a vendor override caps payment plan length at 24 months. 14 rules are live and resolve in this order.",
} satisfies ConsoleData;

// ---------------------------------------------------------------------------
// reconciliation -> Data-story (daily-run spark)
// ---------------------------------------------------------------------------
// [CLAIMS REVIEW] match rate and exception count are illustrative, real-shaped.
export const placementReconciliation = {
  eyebrow: "DAILY RECONCILIATION",
  headline: "Balances reconcile daily, exceptions surface for review",
  chart: {
    kind: "spark",
    // 7 daily reconciliation runs, match rate climbing into a steady band.
    bars: [0.962, 0.97, 0.958, 0.974, 0.981, 0.977, 0.986],
  },
  annotation: {
    value: "98.6%",
    caption: "match rate today · 42 exceptions queued for review",
  },
  ariaSummary:
    "Reconciliation trend. Across the last 7 daily runs the balance match rate held in a high band and reached 98.6% today, with 42 balance differences surfaced as exceptions for review. Every vendor uploads activity and payment data on the schedule the originator defines, and reconciliation runs are auditable end to end.",
} satisfies DataStoryData;

// ---------------------------------------------------------------------------
// Flagship payload: the placement BenefitSplit Explorable Console (PLATVIS-02/03)
// ---------------------------------------------------------------------------
// Refactors DecisionEnginePreview (D-07) into a typed ConsoleData payload. The
// PlacementFlagship component composes Explorable.Toggle (one per treatment tier)
// + Explorable.Panel (the per-tier vendor allocation) around this data; all values
// render by default (D-05 parity), motion is additive.
// [CLAIMS REVIEW] tier allocations, account counts, and the closed-pool metrics
// are illustrative, real-shaped magnitudes, anonymized.
// [COI REVIEW] the engine routes across the originator's vendor pools;
// agency-network-agnostic framing.
export const placementFlagshipConsole = {
  header: {
    eyebrow: "DECISION ENGINE",
    title: "Placement decision engine",
    subtitle: "National network · 4 treatment tiers · engine running",
    status: { label: "LIVE", live: true },
  },
  callout: {
    icon: "route",
    title: "1,847 accounts ready to route",
    sub: "Loaded from billing · evaluated against live tier rules",
    action: "Routing now",
  },
  columns: {
    primary: "Treatment tier",
    bar: "Vendor allocation",
    trailing: "Accounts",
  },
  rows: [
    {
      primary: "Pre-collect",
      secondary: "3 vendors · 30-day",
      bar: { segments: [40, 35, 25] },
      trailing: { value: 12847, animate: "count" },
    },
    {
      primary: "Primary",
      secondary: "3 vendors · 60-day",
      bar: { segments: [47, 35, 18] },
      trailing: { value: 8420, animate: "count" },
    },
    {
      primary: "Secondary",
      secondary: "2 vendors · 90-day",
      bar: { segments: [60, 40] },
      trailing: { value: 4108, animate: "count" },
    },
    {
      primary: "Tertiary",
      secondary: "2 vendors · 120-day",
      bar: { segments: [55, 45] },
      trailing: { value: 2290, animate: "count" },
    },
  ],
  pills: [
    { label: "Closed-pool liquidation 17.4%", tone: "indigo" },
    { label: "Net-back per account $148.62" },
    { label: "Last reconciliation 04:00 today" },
  ],
  ariaSummary:
    "Placement decision engine console. 1,847 accounts are loaded from billing and ready to route against live tier rules. Four treatment tiers split accounts across the vendor network: pre-collect holds 12,847 accounts over a 30-day window across 3 vendors, primary 8,420 over 60 days across 3 vendors, secondary 4,108 over 90 days across 2 vendors, and tertiary 2,290 over 120 days across 2 vendors. Closed-pool liquidation is 17.4% and net-back per account is $148.62.",
} satisfies ConsoleData;

// Per-tier vendor allocation revealed inside the flagship Explorable panels.
// Each tier id matches a row above; the panel lists that tier's vendor split.
// Values are visible by default in the panel content (D-05), the toggle only
// re-focuses which tier's detail is highlighted.
// [CLAIMS REVIEW] per-vendor split percentages are illustrative, real-shaped.
export const placementFlagshipTiers = [
  {
    id: "pre-collect",
    label: "Pre-collect",
    accounts: 12847,
    window: "30-day",
    vendors: [
      { name: "Recovery partner A", share: 40 },
      { name: "Recovery partner B", share: 35 },
      { name: "Recovery partner C", share: 25 },
    ],
  },
  {
    id: "primary",
    label: "Primary",
    accounts: 8420,
    window: "60-day",
    vendors: [
      { name: "Recovery partner A", share: 47 },
      { name: "Recovery partner B", share: 35 },
      { name: "Recovery partner D", share: 18 },
    ],
  },
  {
    id: "secondary",
    label: "Secondary",
    accounts: 4108,
    window: "90-day",
    vendors: [
      { name: "Recovery partner B", share: 60 },
      { name: "Recovery partner E", share: 40 },
    ],
  },
  {
    id: "tertiary",
    label: "Tertiary",
    accounts: 2290,
    window: "120-day",
    vendors: [
      { name: "Recovery partner E", share: 55 },
      { name: "Recovery partner F", share: 45 },
    ],
  },
] as const;

export type PlacementFlagshipTier = (typeof placementFlagshipTiers)[number];
