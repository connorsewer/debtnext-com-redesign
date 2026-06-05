# Architecture Research

**Domain:** Premium visual + motion system integration into an existing Next.js 16 / React 19 marketing site (M6)
**Researched:** 2026-06-04
**Confidence:** HIGH (grounded in direct reads of the live codebase, not training data)

This is an *integration* architecture, not a greenfield one. The recommendations below are anchored to what already ships in `src/components/product/`, `src/components/sections/mockups/`, `src/components/motion/`, and `src/components/ambient/`. The job is to consolidate two parallel visual libraries into one archetype-driven library, formalize shared motion primitives, and convert hardcoded visuals into "archetype + typed data payload" without regressing the homepage cinematic handoff.

---

## Standard Architecture

### System Overview (target end state)

```
┌──────────────────────────────────────────────────────────────────────┐
│  CONTENT LAYER  (server modules, no "use client")                      │
│  src/content/visuals/*.ts  +  src/content/<page>.ts                     │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐                    │
│  │ console data │ │ datastory    │ │ schematic    │  typed payloads     │
│  │ payloads     │ │ payloads     │ │ payloads     │  (per page/industry)│
│  └──────┬───────┘ └──────┬───────┘ └──────┬───────┘                    │
├─────────┼────────────────┼────────────────┼───────────────────────────┤
│  PAGE / SECTION LAYER  (Server Components by default)                   │
│  src/app/**/page.tsx  →  FeatureAccordion / BenefitSplit / Hero        │
│         passes payload into a lazy archetype via `visual=` / `visuals=`│
├─────────┼────────────────┼────────────────┼───────────────────────────┤
│  ARCHETYPE LAYER  ("use client", lazy ssr:false)                       │
│  src/components/product/visuals/                                        │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐                    │
│  │ <Console      │ │ <DataStory    │ │ <Schematic    │  3 parametrized  │
│  │  data=…/>     │ │  data=…/>     │ │  data=…/>     │  archetypes      │
│  └──────┬───────┘ └──────┬───────┘ └──────┬───────┘                    │
├─────────┼────────────────┼────────────────┼───────────────────────────┤
│  PRIMITIVE + MOTION LAYER  (shared atoms; the contract everyone obeys) │
│  src/components/product/primitives/   src/components/product/visuals/   │
│  MetricCell StatPill LiveStatus       parts.tsx (bars, charts, tags)    │
│  + NEW: WorklistRow, FlowNode, Edge, ChartFrame, Annotation            │
│                                                                         │
│  src/components/motion/  (the 7-type motion vocabulary, ONE source)     │
│  Reveal · LiveValue · Hoverable · AmbientField · Transition · Explore  │
│  (Framer/GSAP wrapped here; pages never import framer-motion directly) │
└──────────────────────────────────────────────────────────────────────┘
```

### Component Responsibilities

| Component | Responsibility | Current state |
|-----------|----------------|---------------|
| `src/content/visuals/*.ts` | Typed per-context data payloads (numbers, account types, rows, nodes). The only place "what data this visual shows" lives. | **NEW** — does not exist; data is currently baked into each visual as module constants |
| Archetype (`Console` / `DataStory` / `Schematic`) | Parametrized renderer. Takes a typed payload, renders the visual. No baked data. | **NEW** — today there are 8 single-purpose visuals (`PlacementMatrix`, `IssuesWorklist`, etc.) with data hardcoded inside |
| `product/primitives/` | Style atoms enforcing one stroke weight, type scale, color logic | EXISTS (`MetricCell`, `StatPill`, `LiveStatus`, `ProductCanvas`, `ProductCard`, `EyebrowLabel`, `EventBadge`) — **extend** with chart/flow/worklist atoms |
| `product/visuals/parts.tsx` | Mid-level animated parts (`SegmentedBar`, `ValueBar`, `Sparkline`, `AreaLine`, `Tag`, `TypeChip`) | EXISTS — these become the building blocks of the archetypes |
| `product/motion.tsx` | Visual-internal motion tokens + `AnimatedNumber` / `NumberShift` | EXISTS — partial. Should be promoted/merged into `src/components/motion/` as the canonical home |
| `src/components/motion/` | The 7-type motion vocabulary as named, reduced-motion-aware primitives | PARTIAL (`CursorGlow`, `hover.module.css`) — **extend** into the full vocabulary |
| `src/components/ambient/` | Ambient drift layer (blurred light behind dark bands) | EXISTS (`AmbientField`) — keep, re-export through motion barrel |
| `product/visuals/index.tsx` + `lazy.tsx` | Lazy `ssr:false` registry that bridges Server page → client visual | EXISTS — **the consolidation seam**; will route to archetypes |
| `sections/mockups/` | Second parallel visual library for the homepage handoff tabs | EXISTS — **to be folded into `Console` archetype instances** |

---

## Recommended Project Structure

```
src/
├── content/
│   ├── visuals/                      # NEW — typed visual payloads, server-safe
│   │   ├── types.ts                  #   ConsoleData, DataStoryData, SchematicData
│   │   ├── solutions-utilities.ts    #   per-industry payloads (console+schematic+datastory)
│   │   ├── solutions-telecom.ts
│   │   ├── platform-placement.ts     #   per-capability payloads
│   │   └── homepage-handoff.ts       #   the 4 handoff tabs, as Console payloads
│   └── <page>.ts                     # EXISTING content modules (may import from visuals/)
│
├── components/
│   ├── motion/                       # ONE source of truth for the 7 motion types
│   │   ├── index.ts                  # NEW barrel — named exports only
│   │   ├── Reveal.tsx                # type 1: staggered fade-up (wraps fadeUpItem/stagger)
│   │   ├── LiveValue.tsx             # type 2: AnimatedNumber/NumberShift/filling bars (moved)
│   │   ├── Hoverable.tsx             # type 3: card lift + CursorGlow (wraps existing)
│   │   ├── transitions.ts            # type 6: crossfade/morph variants (shared)
│   │   ├── Explorable.tsx            # type 7: hover-to-inspect / toggle-state shell
│   │   ├── tokens.ts                 # EASE_*, DUR_*, STAGGER (moved from product/motion.tsx)
│   │   ├── CursorGlow.tsx            # EXISTING
│   │   ├── hover.module.css          # EXISTING (type 5 micro-interactions)
│   │   └── CursorGlow.module.css     # EXISTING
│   │
│   ├── ambient/                      # type 4: ambient drift (EXISTING, unchanged)
│   │   └── AmbientField.tsx
│   │
│   └── product/
│       ├── primitives/               # EXISTING + new chart/flow/worklist atoms
│       │   ├── (existing atoms)
│       │   ├── WorklistRow.tsx       # NEW
│       │   ├── ChartFrame.tsx        # NEW
│       │   ├── FlowNode.tsx          # NEW
│       │   └── FlowEdge.tsx          # NEW
│       └── visuals/
│           ├── parts.tsx             # EXISTING animated parts
│           ├── Console.tsx           # NEW archetype (parametrized)
│           ├── DataStory.tsx         # NEW archetype (parametrized)
│           ├── Schematic.tsx         # NEW archetype (parametrized)
│           ├── index.tsx             # MODIFIED registry → archetype + payload
│           └── lazy.tsx              # MODIFIED — lazy archetype wrappers
│
└── (sections/mockups/ is RETIRED — folded into Console payloads)
```

### Structure Rationale

- **`src/content/visuals/` is a dedicated dir, not bolted onto `src/content/<page>.ts`.** Visual payloads are dense, numeric, and `[CLAIMS REVIEW]`-sensitive. Keeping them in their own dir gives reviewers (Andrew/Paul) a single place to audit every number that renders inside a product visual, and keeps the page content modules readable. Page modules may re-export or reference these so a page still has one import surface.
- **Content stays server-safe (no `"use client"`).** Payloads are plain typed data, importable by Server Component pages with zero client cost. Only the archetype that *consumes* the payload is a client component, and it stays lazy.
- **`src/components/motion/` is promoted to the single motion authority.** Today motion logic is split across `product/motion.tsx` (number animation + entrance variants), `motion/` (cursor glow + hover CSS), and `ambient/` (drift). Consolidating the tokens and exposing named primitives is the only way to enforce restraint centrally and handle `prefers-reduced-motion` once.
- **Archetypes live where the old visuals live (`product/visuals/`).** This preserves the proven `parts.tsx` + `ProductCanvas` pattern (the tier-3 pattern that just shipped Jun 4, per memory) and means the lazy/index registry seam does not move — minimizing blast radius.

---

## Architectural Patterns

### Pattern 1: Visual = Archetype + Typed Payload

**What:** Each visual is one of three parametrized archetypes fed a typed data object. No more one-file-per-visual with baked-in constants.

**When to use:** Every product visual on the site (accordions, splits, industry heroes, handoff tabs).

**Trade-offs:** Up-front cost to design three flexible payload schemas that cover real cases (worklist, KPIs, routing flow, annotated chart). Payoff: the 7-page `SolutionsIndustryCards` duplicate collapses to one `<DataStory>` fed 6 payloads, and the ~45 accordion placeholders become payloads instead of new components.

**Example:**
```typescript
// src/content/visuals/types.ts  (server-safe)
export interface ConsoleData {
  eyebrow: string;
  title: string;
  subtitle: string;
  status?: "live" | "idle";
  metrics: { label: string; value: number; suffix?: string; decimals?: number }[];
  rows: { tier: string; sub: string; segments: number[]; accounts: number }[];
  pills: { label: string; tone?: "indigo" | "neutral" }[];
}

// src/content/visuals/platform-placement.ts
import type { ConsoleData } from "./types";
// [CLAIMS REVIEW] all figures pending Andrew sign-off
export const placementConsole: ConsoleData = {
  eyebrow: "PLACEMENT MANAGEMENT",
  title: "Routing rules",
  subtitle: "National network · decision engine active · 14 rules live",
  status: "live",
  metrics: [{ label: "Ready to route", value: 1847 }],
  rows: [{ tier: "Pre-collect", sub: "3 vendors · 30-day", segments: [40, 35, 25], accounts: 12847 }],
  pills: [{ label: "27 vendors active", tone: "indigo" }],
};

// src/components/product/visuals/Console.tsx  ("use client")
export const Console = React.memo(function Console({ data }: { data: ConsoleData }) {
  // renders ProductCanvas + parts.tsx using data.* — zero baked constants
});
```

### Pattern 2: Server Page → Lazy Client Visual via Registry Seam

**What:** Server Component pages pass `React.ReactNode` visuals into `FeatureAccordion.visuals` / `BenefitSplit.visual`. The node is a lazy `ssr:false` archetype wrapper from `lazy.tsx`. This pattern *already exists* and works — keep it.

**When to use:** Every page that renders a product visual.

**Trade-offs:** Turbopack requires the `next/dynamic` option object to be an inline literal (documented in `index.tsx:32` and `lazy.tsx:17`), so each lazy wrapper repeats `{ ssr: false, loading }`. With three archetypes this is *fewer* repetitions than the current 7+ per-visual wrappers.

**Example:**
```typescript
// src/components/product/visuals/lazy.tsx  ("use client")
const LazyConsole = dynamic(
  () => import("./Console").then((m) => m.Console),
  { ssr: false, loading: VisualSkeleton },
);
// Helper so pages stay declarative and never touch dynamic():
export function ConsoleVisual({ data }: { data: ConsoleData }) {
  return <LazyConsole data={data} />;
}

// src/app/platform/placement/page.tsx  (Server Component)
import { ConsoleVisual } from "@/components/product/visuals/lazy";
import { placementConsole } from "@/content/visuals/platform-placement";
<FeatureAccordion visuals={{ placement: <ConsoleVisual data={placementConsole} /> }} ... />
```

### Pattern 3: Named Motion Primitives, Never Raw Framer/GSAP in Pages

**What:** All motion is consumed through `src/components/motion/` named exports. Pages and archetypes import `<Reveal>`, `useLiveValue`, `<Hoverable>` — never `framer-motion` or `gsap` directly. Each primitive collapses to an instant fade / no-transform under `prefers-reduced-motion` internally.

**When to use:** All seven motion types, everywhere.

**Trade-offs:** A thin wrapper layer to maintain. Payoff: restraint (timings/easings/distances from DESIGN.md §4.7) is enforced in one place, and `useReducedMotion` is handled once instead of being re-implemented in every visual (today every part in `parts.tsx` re-derives `const shown = reduce || inView`).

**Example:**
```typescript
// src/components/motion/Reveal.tsx
"use client";
export function Reveal({ children, ...props }: RevealProps) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      variants={reduce ? undefined : fadeUpItem}
      initial={reduce ? false : "hidden"}
      whileInView="show"
      viewport={{ once: true, amount: 0.3 }}
      {...props}
    >{children}</motion.div>
  );
}
```

### Suggested Motion Primitive API (the 7 types)

| # | Motion type | Primitive | API sketch |
|---|-------------|-----------|------------|
| 1 | Scroll reveal | `<Reveal>` / `<RevealList stagger>` | wraps `staggerContainer`/`fadeUpItem` + `inViewProps` (already in `product/motion.tsx`) |
| 2 | Live data motion | `<LiveValue value suffix decimals>`, `<FillBar value tone>`, `<PulseDot tone>` | `AnimatedNumber`/`NumberShift` moved here; `ValueBar`/`SegmentedBar` re-homed or re-exported |
| 3 | Hover + cursor | `<Hoverable lift glow>` | wraps `hover.module.css` + `<CursorGlow>` (both already exist) |
| 4 | Ambient drift | `<AmbientField>` | already exists in `ambient/`; re-export via motion barrel for one import surface |
| 5 | Micro-interactions | CSS modules (`hover.module.css`) + Button states | already partially present; document the 7-state contract |
| 6 | Section/tab/route transitions | `transitions.ts` (shared crossfade/morph variants) | extract the bezel-morph used by the handoff so it is reusable, not inline |
| 7 | Explorable visuals | `<Explorable>` shell + per-archetype hooks | new — hover-to-inspect / toggle-state wrapper; flagship platform items only |

---

## Data Flow

### Visual Render Flow

```
[Server page.tsx]
   imports typed payload from src/content/visuals/*.ts   (zero client JS)
   passes <ConsoleVisual data={payload}/> into section prop (visuals= / visual=)
        ↓
[Section: FeatureAccordion / BenefitSplit]  ("use client" shell)
   renders the passed React node when item active (crossfade via Reveal/transitions)
        ↓
[lazy.tsx wrapper]  next/dynamic ssr:false  → code-split chunk, VisualSkeleton placeholder
        ↓
[Archetype: Console/DataStory/Schematic]  ("use client")
   reads data.* → composes primitives + parts + motion primitives
        ↓
[Primitives + parts + motion]  render, animate on whileInView, honor reduced-motion
```

### Consolidation Migration Path (no homepage-handoff regression)

The homepage handoff is the highest-risk surface. It is a 400vh GSAP-pinned cinematic (desktop) / static stack (mobile) that swaps `MockupForTab(id)` inside ONE shared `FramedDashboard` bezel that must stay anchored across tab switches and the hero→Platform seam. Consumers: `HomepageHero.tsx` and `HomepageHandoffSection.tsx` only.

Migrate in this safe order:

1. **Build `Console` archetype + payloads first, prove it elsewhere.** Land `Console` on a low-risk accordion page (e.g. `/platform/placement`) before touching the handoff. This validates the payload schema against the real Placement data that already lives in both libraries.
2. **Author the 4 handoff tabs as `Console` payloads** in `src/content/visuals/homepage-handoff.ts` (placement, performance, issues, reporting). Match the existing `sections/mockups/*Mockup.tsx` output visually.
3. **Keep `FramedDashboard` and the GSAP pin untouched.** `FramedDashboard` is the bezel, not a visual — it survives consolidation. Only the *inner content* (`MockupForTab`) is replaced. Re-point `MockupForTab` / `mockupTitleForTab` to return `<Console data={handoffTabs[id]} />` and `handoffTabs[id].title`.
4. **Hold the `MockupForTab(id)` and `mockupTitleForTab(id)` function signatures stable** so `HomepageHero` / `HomepageHandoffSection` need no changes. Swap the implementation behind the same API; this is the regression firewall.
5. **Verify against the locked decisions:** dashboard never moves during the crossfade, bezel stays viewport-centered across the seam (PROJECT.md Key Decisions). Re-run the platform-mobile + reduced-motion Playwright specs.
6. **Only after the handoff renders identically through `Console`, delete `sections/mockups/`** (the 4 `*Mockup.tsx` + index; `FramedDashboard` relocates to `product/visuals/` or stays, but is kept).
7. **Retire dead assets:** remove the 6 `dashboard-dark.png` `media` fallbacks from content modules (every page supplies a live `visual=`, so `BenefitSplit.media` fallback never renders). Decide hero PNG fate in Phase 4 capstone.

### New vs Modified Components (explicit)

**NEW:**
- `src/content/visuals/types.ts` + per-context payload modules (`ConsoleData`/`DataStoryData`/`SchematicData`)
- `src/components/product/visuals/Console.tsx`, `DataStory.tsx`, `Schematic.tsx`
- `src/components/product/primitives/`: `WorklistRow`, `ChartFrame`, `FlowNode`, `FlowEdge` (Schematic + DataStory atoms)
- `src/components/motion/`: `index.ts` barrel, `Reveal.tsx`, `LiveValue.tsx`, `Hoverable.tsx`, `transitions.ts`, `Explorable.tsx`, `tokens.ts`

**MODIFIED:**
- `src/components/product/visuals/index.tsx` + `lazy.tsx` — registry routes to archetypes; add `ConsoleVisual`/`DataStoryVisual`/`SchematicVisual` helper wrappers
- `src/components/product/motion.tsx` — tokens + `AnimatedNumber`/`NumberShift` move to `motion/`; leave a re-export shim or update imports
- `src/components/sections/mockups/index.tsx` — `MockupForTab`/`mockupTitleForTab` re-implemented over `Console` (same signatures), then dir retired
- All 13 `src/app/**/page.tsx` consumers — swap per-visual lazy imports for archetype+payload calls (mechanical, page by page, per phase)
- `src/content/<page>.ts` (6 files) — remove dead `dashboard-dark.png` `media` fallbacks

**REUSED UNCHANGED:** `ProductCanvas`, `ProductCard`, `MetricCell`, `StatPill`, `LiveStatus`, `EyebrowLabel`, `EventBadge`, `parts.tsx`, `ambient/AmbientField`, `CursorGlow`, `FramedDashboard`, `FeatureAccordion` (it already accepts a `visuals` prop — no change needed), `BenefitSplit` (already accepts `visual`).

> Key leverage point: `FeatureAccordion.visuals?: Record<string, ReactNode>` and `BenefitSplit.visual?: ReactNode` ALREADY exist as the injection seams. Pages can adopt archetypes with **zero changes to the section components** — this is why the section layer is "reused unchanged."

---

## Build Order (dependency-ordered, maps to spec Phase 0–4)

```
Phase 0 — FOUNDATION (unblocks everything)
  0a. Promote motion → src/components/motion/ barrel + primitives + tokens.ts
      (move AnimatedNumber/NumberShift/variants; add Reveal/LiveValue/Hoverable/
       transitions/Explorable; re-export AmbientField). Reduced-motion handled once.
  0b. Add new primitives (WorklistRow, ChartFrame, FlowNode, FlowEdge).
  0c. Define src/content/visuals/types.ts (ConsoleData/DataStoryData/SchematicData).
  0d. Build the 3 archetypes (Console, DataStory, Schematic) consuming payloads,
      built on primitives + parts + motion primitives.
  0e. Add ConsoleVisual/DataStoryVisual/SchematicVisual lazy wrappers in lazy.tsx.
  0f. Retire dead dashboard-dark.png media fallbacks (6 content files).
        │  depends on: nothing new; reuses existing parts.tsx + primitives
        ▼
Phase 1 — PLATFORM deep-dive (4 pages, ~20 items)
  Convert accordion placeholders → archetype payloads. Flagship item per page = Explorable.
  Proves Console/Schematic/DataStory against real platform data.
        │  depends on: Phase 0 (archetypes + Explorable)
        ▼
Phase 2 — SOLUTIONS (7 pages, ~25 items + kill duplicate)
  Replace SolutionsIndustryCards no-prop duplicate with DataStory fed 6 industry payloads.
  Per-industry: Console hero + Schematic + DataStory. Accordion placeholders → payloads.
        │  depends on: Phase 0; Phase 1 hardens the schemas
        ▼
Phase 2.5 / interleaved — CONSOLIDATION (homepage handoff)
  Author handoff tabs as Console payloads; re-point MockupForTab over Console (same
  signature); verify pin + bezel + reduced-motion; delete sections/mockups/.
        │  depends on: Phase 0 (Console proven); SAFEST after Phase 1 validates Console
        ▼
Phase 3 — TEXT-ONLY page elevation (8+ pages)
  Add archetype visuals + motion where they lift (compare/why-dplat/company/resources/
  integrations/demo). Mostly DataStory + Schematic + Reveal/Ambient.
        │  depends on: Phase 0; archetypes matured by Phases 1–2
        ▼
Phase 4 — HOMEPAGE flagship capstone
  Apply matured system to hero; resolve dashboard-dark.png hero fate; final motion polish.
        │  depends on: everything above (capstone)
```

**Critical sequencing note:** Phase 0 is a hard prerequisite for all others. The consolidation (spec workstream 6) should be scheduled *after* `Console` is proven on at least one Platform page (Phase 1), not first — the homepage handoff is the riskiest surface and you want the archetype battle-tested before re-pointing `MockupForTab`. This inverts the naive "consolidate first" instinct and is the single most important ordering decision for avoiding a homepage regression.

---

## Anti-Patterns

### Anti-Pattern 1: Consolidating the homepage handoff first
**What people do:** Treat "merge two libraries" as step one and rewrite `MockupForTab` before any archetype is proven.
**Why it's wrong:** The handoff is a 400vh GSAP pin with a bezel that must stay anchored across the hero seam (a locked decision). Rewriting its inner content against an unproven `Console` schema risks the highest-visibility surface on the site.
**Do this instead:** Prove `Console` on `/platform/placement` first; re-point `MockupForTab` last, behind its existing function signature.

### Anti-Pattern 2: Per-visual components with baked-in data (the current state)
**What people do:** Add a new `.tsx` file per visual with the numbers hardcoded as module constants (as `PlacementMatrix`, `IssuesWorklist`, `SolutionsIndustryCards` do today).
**Why it's wrong:** Produced the 7-page duplicate widget and ~45 placeholders. Numbers are scattered across components, defeating `[CLAIMS REVIEW]` auditing.
**Do this instead:** One archetype + a typed payload in `src/content/visuals/`. New visual = new payload, not new component.

### Anti-Pattern 3: Importing framer-motion / gsap directly in pages or new visuals
**What people do:** Re-derive `const reduce = useReducedMotion(); const shown = reduce || inView` in every component (as every part in `parts.tsx` does today).
**Why it's wrong:** Restraint and reduced-motion handling drift; timings diverge from DESIGN.md §4.7; a11y regressions slip in.
**Do this instead:** Consume `src/components/motion/` named primitives. They own the reduced-motion collapse.

### Anti-Pattern 4: Making payloads `"use client"` or putting them in the archetype file
**What people do:** Co-locate data with the client visual.
**Why it's wrong:** Forces client-component status onto data, breaks Server-Component-by-default, bloats the visual chunk, and hides numbers from reviewers.
**Do this instead:** Plain typed data in `src/content/visuals/*.ts`, imported by the Server page, passed down as a prop.

### Anti-Pattern 5: Animating layout properties (width/height/top) in motion primitives
**What people do:** Animate `width`/`height` for filling bars or reveals.
**Why it's wrong:** Triggers layout, hurts INP/CLS (spec perf gate: INP <200ms, CLS <0.1). The existing parts correctly use `scaleX`/`clipPath`/`pathLength`.
**Do this instead:** transform/opacity/clip-path only — codify this in the motion primitives so consumers can't get it wrong.

---

## Integration Points

### Internal Boundaries

| Boundary | Communication | Notes |
|----------|---------------|-------|
| Server page ↔ Archetype | Props (typed payload as `ReactNode` via `visual=`/`visuals=`) | Seam already exists on `FeatureAccordion`/`BenefitSplit`; no section changes needed |
| Page ↔ lazy registry | `next/dynamic ssr:false` wrappers in `lazy.tsx` | Turbopack requires inline option literals — keep one wrapper per archetype |
| Archetype ↔ Motion | Named imports from `src/components/motion/` | Hard rule: no direct framer/gsap below the page layer except inside motion/ |
| `HomepageHero`/`HandoffSection` ↔ visuals | `MockupForTab(id)` / `mockupTitleForTab(id)` function API | Keep signatures stable across consolidation = regression firewall |
| Content payloads ↔ reviewers | `[CLAIMS REVIEW]` / `[COI REVIEW]` comments in `src/content/visuals/*.ts` | Centralizing numbers here makes the review gate enforceable |
| GSAP pin ↔ FramedDashboard bezel | Pin spacer wraps the static bezel; inner content swaps | Do not touch pin or bezel during consolidation |

### External Services
None new. The visual/motion system is self-contained client rendering; no new runtime deps (Framer Motion 12 + GSAP 3 already in stack, per spec non-goal "no new dependencies").

---

## Open Questions for the Roadmapper

1. **Where exactly do payloads import?** Recommendation is a dedicated `src/content/visuals/` dir (cleaner review surface), but the spec leaves open "extend `solutions-*.ts` vs dedicated dir." Either works; dedicated dir scales better for `[CLAIMS REVIEW]`.
2. **Does `FramedDashboard` relocate to `product/visuals/` or stay in a slimmed `sections/mockups/`?** Functionally either; relocating completes "one library" but is cosmetic. Low risk, defer to consolidation phase.
3. **Three payload schemas vs one union:** designing `ConsoleData`/`DataStoryData`/`SchematicData` to cover all real cases (worklist, KPI grid, routing flow, annotated chart, per-industry numbers) is the main Phase 0 design risk. Recommend prototyping the Console schema against the two existing Placement implementations (mockup + visual) to validate it covers both before committing.
4. **M5 Phase 8 "Motion pass" supersession:** spec §7 flags this; the milestone flow already decided M6 Phase 0 absorbs it. Roadmap should not double-schedule motion work.

## Sources

- Direct codebase reads (HIGH): `src/components/product/visuals/{index,lazy,parts,SolutionsIndustryCards,PlacementMatrix}.tsx`, `product/motion.tsx`, `product/primitives/{index,ProductCanvas}.tsx`, `sections/{FeatureAccordion,BenefitSplit,mockups/index}.tsx`, `motion/` + `ambient/` listings, consumer grep across `src/app/**`, `src/content/homepage-hero.ts`
- `docs/superpowers/specs/2026-06-04-premium-visual-motion-system-design.md` (the approved design spec)
- `.planning/PROJECT.md` (milestone scope, locked decisions, tech stack)
- Memory: tier3 visual pattern (visuals use `parts.tsx` pattern, not the tier-3 zip CSS-module pattern; ambient/ + motion/hover taken from the zip)

---
*Architecture research for: premium visual + motion system integration (M6)*
*Researched: 2026-06-04*
