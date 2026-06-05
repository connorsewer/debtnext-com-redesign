/**
 * /platform/optimization accordion payloads (PLATVIS-01).
 *
 * One typed payload per FeatureAccordion item id, authored against the approved
 * 11-ARCHETYPE-MAP.md mapping (the optimization rows are authoritative). Each
 * payload reads DISTINCTLY (D-02): its own numbers, its own chart/row shape, no
 * two alike, and distinct from every placement payload.
 *
 * Approved optimization mapping (11-ARCHETYPE-MAP.md):
 *   bands   -> Data-story (bars)  performance-band liquidation bars + threshold note
 *   share   -> Console            per-vendor share rows with per-cycle shift + caps/floors
 *   bonus   -> Console            pool rows with a target bar, achieved fill, payout
 *   history -> Data-story (cards) dated adjustment-trail cards (vendor, old/new share, trigger)
 *
 * Governance (D-09 / D-10): numbers are real-shaped, anonymized, generic, and
 * qualified. No client identifiers. Every numeric payload carries a
 * [CLAIMS REVIEW] comment; vendor-network framing carries [COI REVIEW]. Andrew
 * pre-cleared these figures and framing for Phase 11; tags stay for audit and
 * are non-blocking this phase. Every payload sets the REQUIRED ariaSummary.
 * Voice: no em dashes, no "not X, it's Y", no banned phrases, sentence case,
 * digits (CLAUDE.md §5).
 */

import type { ConsoleData, DataStoryData } from "./types";

// ---------------------------------------------------------------------------
// bands -> Data-story (performance-band liquidation bars)
// ---------------------------------------------------------------------------
// [CLAIMS REVIEW] liquidation percentages and band thresholds are illustrative,
// real-shaped magnitudes, anonymized; not a client's contracted results.
// [COI REVIEW] bars compare vendors inside the originator's existing network;
// agency-network-agnostic framing.
export const optimizationBands = {
  eyebrow: "PERFORMANCE BANDS",
  headline: "Liquidation performance sorts into the bands you define",
  chart: {
    kind: "bars",
    series: [
      { label: "Recovery partner A", value: 24.6, tone: "success" },
      { label: "Recovery partner B", value: 19.1, tone: "indigo" },
      { label: "Recovery partner C", value: 15.8, tone: "warning" },
      { label: "Recovery partner D", value: 11.3, tone: "warning" },
    ],
  },
  annotation: {
    value: "High 20%+ · Mid 16 to 20% · Low under 16%",
    caption: "closed-pool liquidation against your configured bands",
  },
  ariaSummary:
    "Performance-band bars. Four vendors are ranked by closed-pool liquidation against bands the originator configures: Recovery partner A at 24.6% lands in the high band, Recovery partner B at 19.1% in the mid band, and Recovery partners C and D at 15.8% and 11.3% in the low band. Bands can vary by tier, product, or account attribute.",
} satisfies DataStoryData;

// ---------------------------------------------------------------------------
// share -> Console (per-vendor share adjustment with caps and floors)
// ---------------------------------------------------------------------------
// [CLAIMS REVIEW] share percentages and per-cycle shifts are illustrative,
// real-shaped configuration magnitudes, anonymized.
// [COI REVIEW] share moves across the originator's existing vendor network;
// agency-network-agnostic framing.
export const optimizationShare = {
  header: {
    eyebrow: "SHARE ADJUSTMENT",
    title: "Share moves inside the caps you authorize",
    subtitle: "Next placement cycle · caps and floors enforced · 5% max move",
    status: { label: "QUEUED" },
  },
  columns: {
    primary: "Vendor",
    bar: "Next-cycle share",
    trailing: "Shift",
  },
  rows: [
    {
      primary: "Recovery partner A",
      secondary: "High band · room under ceiling",
      bar: { segments: [47], tone: "success" },
      trailing: { value: 5, suffix: "%", animate: "shift" },
    },
    {
      primary: "Recovery partner B",
      secondary: "Mid band · held steady",
      bar: { segments: [33], tone: "indigo" },
      trailing: { value: 0, suffix: "%", animate: "none" },
    },
    {
      primary: "Recovery partner C",
      secondary: "Low band · above floor",
      bar: { segments: [13], tone: "warning" },
      trailing: { value: 5, suffix: "%", animate: "shift" },
    },
    {
      primary: "Recovery partner D",
      secondary: "Low band · at 7% floor",
      bar: { segments: [7], tone: "warning" },
      trailing: { value: 0, suffix: "%", animate: "none" },
    },
  ],
  pills: [
    { label: "Per-cycle move capped at 5%", tone: "indigo" },
    { label: "Vendor floor 7%" },
    { label: "Strategic holds honored" },
  ],
  ariaSummary:
    "Share-adjustment console. The next placement cycle moves share inside the caps the originator authorizes, with a 5% maximum move per cycle. Recovery partner A gains 5% to a 47% share, Recovery partner B holds steady at 33%, Recovery partner C gains 5% to 13%, and Recovery partner D holds at the 7% floor. Caps, floors, and strategic holds keep final control with your strategy team.",
} satisfies ConsoleData;

// ---------------------------------------------------------------------------
// bonus -> Console (pool bonus targets: target bar, achieved fill, payout)
// ---------------------------------------------------------------------------
// [CLAIMS REVIEW] liquidation targets and bonus payout amounts are illustrative,
// real-shaped magnitudes, anonymized; not a client's contracted bonus terms.
// [COI REVIEW] bonuses reward vendors in the originator's network on closed-pool
// results; agency-network-agnostic framing.
export const optimizationBonus = {
  header: {
    eyebrow: "BONUS PAYOUTS",
    title: "Bonuses pay when a pool clears its target",
    subtitle: "Closed pools this month · calculated automatically",
    status: { label: "CALCULATED" },
  },
  columns: {
    primary: "Pool",
    bar: "Target vs achieved",
    trailing: "Payout",
  },
  rows: [
    {
      primary: "Primary · Q2",
      secondary: "Target 22% · achieved 24.6%",
      bar: { segments: [100], tone: "success" },
      trailing: { value: 18400, suffix: "", animate: "count" },
    },
    {
      primary: "Secondary · Q2",
      secondary: "Target 18% · achieved 19.1%",
      bar: { segments: [100], tone: "success" },
      trailing: { value: 9250, suffix: "", animate: "count" },
    },
    {
      primary: "Tertiary · Q2",
      secondary: "Target 16% · achieved 15.8%",
      bar: { segments: [88], tone: "warning" },
      trailing: { value: 0, suffix: "", animate: "none" },
    },
  ],
  pills: [
    { label: "Target met pays automatically", tone: "indigo" },
    { label: "Calculated on closed-pool data" },
  ],
  ariaSummary:
    "Bonus-payout console. Pool bonuses calculate automatically against closed-pool liquidation targets. The primary Q2 pool cleared its 22% target at 24.6% and pays a $18,400 bonus, the secondary Q2 pool cleared 18% at 19.1% and pays $9,250, and the tertiary Q2 pool reached 88% of its 16% target so no bonus is due. Targets and payout structures are configured per pool.",
} satisfies ConsoleData;

// ---------------------------------------------------------------------------
// history -> Data-story (dated optimization adjustment-trail cards)
// ---------------------------------------------------------------------------
// [CLAIMS REVIEW] dated adjustments, share moves, and trigger metrics are
// illustrative, real-shaped magnitudes, anonymized.
// [COI REVIEW] adjustments reallocate across the originator's existing vendor
// network; agency-network-agnostic framing.
export const optimizationHistory = {
  eyebrow: "OPTIMIZATION HISTORY",
  headline: "Every adjustment is logged and reversible",
  chart: {
    kind: "cards",
    cards: [
      {
        name: "Recovery partner A",
        accent: "#5266EB",
        tag: "MAY 02",
        value: 47,
        suffix: "%",
        bar: 47,
        sub: "42% to 47% · 24.6% liquidation",
      },
      {
        name: "Recovery partner C",
        accent: "#E0A33E",
        tag: "MAY 02",
        value: 13,
        suffix: "%",
        bar: 13,
        sub: "18% to 13% · 15.8% liquidation",
      },
      {
        name: "Recovery partner B",
        accent: "#4C8DFF",
        tag: "APR 04",
        value: 33,
        suffix: "%",
        bar: 33,
        sub: "33% held · mid band",
      },
      {
        name: "Recovery partner D",
        accent: "#E0A33E",
        tag: "APR 04",
        value: 7,
        suffix: "%",
        bar: 7,
        sub: "10% to 7% · floor reached",
      },
    ],
  },
  annotation: {
    value: "4 adjustments logged",
    caption: "vendor, old and new share, and the trigger metric, all reversible",
  },
  ariaSummary:
    "Optimization-history cards. Four dated adjustments are logged and reversible. On May 2 Recovery partner A moved from 42% to 47% on 24.6% liquidation and Recovery partner C moved from 18% to 13% on 15.8% liquidation; on April 4 Recovery partner B held at 33% in the mid band and Recovery partner D moved from 10% to 7% as its floor was reached. Each adjustment records what changed, when, and the performance that triggered it.",
} satisfies DataStoryData;

// ---------------------------------------------------------------------------
// Flagship payload: the optimization BenefitSplit Explorable Console (PLATVIS-02/03)
// ---------------------------------------------------------------------------
// Refactors OptimizationEngine (D-07) into a typed ConsoleData payload plus
// per-vendor detail. The OptimizationFlagship component composes Explorable.Toggle
// (one per vendor) + Explorable.Panel (that vendor's band detail and this-cycle to
// next-cycle share shift) around this data; all values render by default (D-05
// parity), motion is additive.
// [CLAIMS REVIEW] closed-pool liquidation, band, share shifts, and the bonus
// callout are illustrative, real-shaped magnitudes, anonymized.
// [COI REVIEW] the engine evaluates and rewards vendors in the originator's
// existing network; agency-network-agnostic framing.
export const optimizationFlagshipConsole = {
  header: {
    eyebrow: "OPTIMIZATION ENGINE",
    title: "Closed pool · Q2 primary evaluated",
    subtitle: "12,847 accounts · bands applied · reallocation queued",
    status: { label: "EVALUATED", live: true },
  },
  callout: {
    icon: "check",
    title: "Bonus triggered · Recovery partner A cleared its 22% target",
    sub: "Monthly bonus calculated automatically · applied to next settlement",
    action: "Applied",
  },
  columns: {
    primary: "Vendor · closed pool",
    bar: "Next-cycle share",
    trailing: "Liquidation",
  },
  rows: [
    {
      primary: "Recovery partner A",
      secondary: "High band · 4,206 accounts",
      bar: { segments: [47], tone: "success" },
      trailing: { value: 24.6, suffix: "%", decimals: 1, animate: "none" },
    },
    {
      primary: "Recovery partner B",
      secondary: "Mid band · 3,521 accounts",
      bar: { segments: [33], tone: "indigo" },
      trailing: { value: 19.1, suffix: "%", decimals: 1, animate: "none" },
    },
    {
      primary: "Recovery partner C",
      secondary: "Low band · 5,120 accounts",
      bar: { segments: [13], tone: "warning" },
      trailing: { value: 15.8, suffix: "%", decimals: 1, animate: "none" },
    },
  ],
  pills: [
    { label: "Reallocation applies next placement run", tone: "indigo" },
    { label: "Caps and floors enforced" },
    { label: "Per-cycle move capped at 5%" },
  ],
  ariaSummary:
    "Optimization engine console. A closed Q2 primary pool of 12,847 accounts has been evaluated against the configured bands and reallocation is queued. Recovery partner A sits in the high band at 24.6% liquidation and moves to a 47% next-cycle share, Recovery partner B holds the mid band at 19.1% and a 33% share, and Recovery partner C sits in the low band at 15.8% and moves to a 13% share. Recovery partner A cleared its 22% bonus target, so a bonus is applied to the next settlement. Reallocation applies on the next placement run inside the caps and floors you authorize.",
} satisfies ConsoleData;

// Per-vendor detail revealed inside the flagship Explorable panels. Each id
// matches a row above; the panel shows that vendor's band, accounts, this-cycle
// to next-cycle share shift, and the trigger metric. Values render by default in
// the panel content (D-05); the toggle only highlights which vendor is in focus.
// [CLAIMS REVIEW] per-vendor band, share shift, and liquidation are illustrative,
// real-shaped magnitudes, anonymized.
export const optimizationFlagshipVendors = [
  {
    id: "partner-a",
    label: "Recovery partner A",
    band: "High",
    accounts: 4206,
    liquidation: "24.6%",
    fromShare: 42,
    toShare: 47,
    trigger: "Cleared 22% bonus target",
  },
  {
    id: "partner-b",
    label: "Recovery partner B",
    band: "Mid",
    accounts: 3521,
    liquidation: "19.1%",
    fromShare: 33,
    toShare: 33,
    trigger: "Held steady inside the mid band",
  },
  {
    id: "partner-c",
    label: "Recovery partner C",
    band: "Low",
    accounts: 5120,
    liquidation: "15.8%",
    fromShare: 18,
    toShare: 13,
    trigger: "Below band · share trimmed above floor",
  },
] as const;

export type OptimizationFlagshipVendor = (typeof optimizationFlagshipVendors)[number];
