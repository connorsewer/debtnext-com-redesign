/**
 * Typed visual payload model (FND-03). Server-safe; importable by Server
 * Components at zero client cost. Single [CLAIMS REVIEW]-auditable home for
 * product numbers.
 *
 * A visual = archetype component + typed payload. Three explicit schemas
 * (ConsoleData / DataStoryData / SchematicData) — no discriminated union, no
 * `type` discriminator field (10-RESEARCH.md §1, Open Question 2). The lazy
 * registry picks the component; the page picks the payload.
 *
 * Governance: every payload number is governed copy. Numbers stay anonymized,
 * generic, and qualified, and carry a [CLAIMS REVIEW] comment in the payload
 * module until Andrew sign-off. Any caption touching the TSI/vendor
 * relationship carries [COI REVIEW]. ariaSummary and any caption follow the
 * voice rules (no em dashes, no "not X, it's Y", no banned phrases, sentence
 * case, digits).
 */

// ---------------------------------------------------------------------------
// ConsoleData (10-RESEARCH.md §1 — slot-shaped, compound-component-ready)
// ---------------------------------------------------------------------------

/** A single-segment OR multi-segment horizontal bar.
 *  segments: [40,35,25] → multi-segment vendor allocation (PlacementMatrix)
 *  segments: [35]       → single-value pct fill (PlacementMockup pool row) */
export interface BarSpec {
  segments: number[]; // percentages; one entry = single-value bar
  label?: string; // optional bar caption (a11y + visible)
  tone?: "indigo" | "success" | "warning" | "neutral";
}

export interface ConsoleHeader {
  eyebrow?: string; // PlacementMatrix: "PLACEMENT MANAGEMENT"
  title: string; // "Routing rules" | "Placement run · 12:04 PM"
  subtitle?: string; // "National network · decision engine active · 14 rules live"
  status?: { label: string; live?: boolean }; // LiveStatus "LIVE" | "Engine running" (live=pulse)
  kpi?: {
    // PlacementMockup left-side KPI block
    caption: string; // "Inbound batch"
    value: number; // 120418
    valueSuffix?: string;
    decimals?: number;
    sub?: string; // "accounts · $284.6M"
  };
}

export interface ConsoleCallout {
  // PlacementMatrix "ready to route" card; optional
  icon?: "route" | "alert" | "check";
  title: string; // "1,847 accounts ready to route"
  sub?: string; // "Loaded from billing · evaluated against tier rules"
  action?: string; // "Routing now" pill text
}

export interface ConsoleRow {
  primary: string; // "Pre-collect"
  secondary?: string; // "3 vendors · 30-day" | "2 vendors"
  bar?: BarSpec; // segmented or single-value
  trailing?: {
    // right column: count OR pct
    value: number;
    prefix?: string; // "$" for currency cells (optimizationBonus); none for pct/count. Additive/backward-compatible.
    suffix?: string; // "%" for the mockup, none for the matrix count
    decimals?: number;
    animate?: "count" | "shift" | "none"; // AnimatedNumber vs NumberShift vs static
  };
  // D-08 additive optional field (11-03, issues vendor-portal). Horizontal
  // alignment hint for a message-thread row so vendor vs operator messages read
  // as a two-sided conversation. Optional and backward-compatible: every existing
  // payload omits it and keeps its `satisfies ConsoleData` green. Renderers that
  // don't read it fall back to the default left alignment.
  align?: "start" | "end";
}

export interface ConsoleData {
  header: ConsoleHeader;
  callout?: ConsoleCallout;
  columns?: { primary?: string; bar?: string; trailing?: string }; // optional header row labels
  rows: ConsoleRow[];
  pills?: { label: string; tone?: "indigo" | "neutral" }[]; // PlacementMatrix StatPills
  ariaSummary: string; // REQUIRED text alternative (Pitfall 8) — governed copy
}

// ---------------------------------------------------------------------------
// DataStoryData (10-RESEARCH.md §1)
// ---------------------------------------------------------------------------

export interface DataStoryData {
  eyebrow?: string;
  headline: string; // the true thing it teaches
  chart:
    | { kind: "area"; points: number[] } // reuse parts.tsx AreaLine
    | { kind: "spark"; bars: number[] } // reuse Sparkline
    | { kind: "bars"; series: { label: string; value: number; tone?: string }[] }
    | {
        kind: "cards"; // subsumes SolutionsIndustryCards
        cards: {
          name: string;
          accent: string;
          tag: string;
          value: number;
          decimals?: number;
          suffix?: string;
          bar: number;
          sub: string;
        }[];
      };
  annotation?: { value: string; caption: string }; // the callout that teaches
  ariaSummary: string; // REQUIRED text alternative; governed copy
}

// ---------------------------------------------------------------------------
// SchematicData (10-RESEARCH.md §1)
// PROVISIONAL (A2): no existing schematic implementation to validate against;
// node/edge shape is inferred from the design spec. Hardened in Phase 11
// against PlatformSystemMap.tsx + the real "how it works" data before locking.
// ---------------------------------------------------------------------------

export interface SchematicNode {
  id: string;
  label: string;
  sub?: string;
  kind?: "source" | "engine" | "vendor" | "sink";
}

export interface SchematicEdge {
  from: string;
  to: string;
  label?: string; // "30-day" etc.
  flow?: boolean; // animate data traveling (GSAP/strokeDashoffset) when true
}

export interface SchematicData {
  eyebrow?: string;
  title: string;
  nodes: SchematicNode[];
  edges: SchematicEdge[];
  ariaSummary: string; // REQUIRED; describes the routing in words
}
