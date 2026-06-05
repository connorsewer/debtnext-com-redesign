# Phase 10: Foundation - Research

**Researched:** 2026-06-04
**Domain:** Centralized motion + visual-archetype foundation for a perf/a11y-constrained Next.js 16 / React 19 dark-fintech marketing site (DebtNext M6)
**Confidence:** HIGH (grounded in direct reads of this repo's shipped code, the M5 LHCI post-mortem, the approved M6 design spec, the skills briefing, and current Next/LHCI/Motion guidance)

## Summary

Phase 10 builds the one-time foundation that makes Phases 11-15 mechanical: a single motion primitive barrel (7-type vocabulary, reduced-motion handled once, fails open), three parametrized visual archetypes (Console / Data story / Schematic) that render from typed payloads with zero baked constants, an extended shared-primitive set, a typed payload home, and the CI guardrails that make all of the above impossible to violate later. Zero new runtime dependencies: Framer Motion 12.39.0, GSAP 3.15.0 + @gsap/react 2.1.2 are already installed and validated, and the charting decision is locked to hand-built SVG (project-level `STACK.md`).

The single highest design risk is the three payload schemas, specifically `ConsoleData`. The two existing Placement implementations (`PlacementMatrix.tsx` in `product/visuals/` and `PlacementMockup.tsx` in `sections/mockups/`) are structurally different consoles — different header semantics (eyebrow+title+LiveStatus vs. a KPI-with-pulse), different bar semantics (multi-segment vendor allocation vs. single-value pct), and different supporting rows (callout-card + stat-pills vs. a flat pool list). A `ConsoleData` schema that cannot express *both* without baked constants will force Phase 13's homepage-handoff consolidation to either fork the archetype or hardcode again. This research proposes a slot-based compound `Console` schema that covers both cases and maps every field; the one gap (the always-on "Engine running" pulse dot) is flagged.

The second hard constraint is the cross-milestone perf gate. Phase 10 co-lands with or after M5 Phase 5.3 (lazy-GSAP, already shipped in code: `HeroCinematicController.tsx`). The motion-barrel migration must move `AnimatedNumber`/variants/tokens out of `product/motion.tsx` without pulling eager Framer Motion into the `/` shared chunk and without breaking 17 current consumers. The safe path is a re-export shim: create `src/components/motion/`, move the source, and leave `product/motion.tsx` re-exporting so no consumer edit is required in Phase 10.

**Primary recommendation:** Build the motion barrel + 3 archetypes + typed payloads + extended primitives, prototype `ConsoleData` against *both* Placement files before committing the schema, migrate the motion barrel via a re-export shim (zero consumer edits this phase), and land four CI guardrails (route First-Load-JS budget on `/`, TBT in LHCI on visual-heavy routes as the INP lab proxy, a "no stuck opacity:0" reveal spec, a mobile-GSAP-free spec) modeled on the patterns M5 already shipped.

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| FND-01 | Shared motion primitive barrel (`src/components/motion/`) exposing the full 7-type vocabulary; each primitive reduced-motion-aware and fails OPEN | §"Motion primitive vocabulary" maps all 7 types to engine + API + the fail-open contract; `RevealSection`/`AnimatedNumber`/`AmbientField` are the proven fail-open references |
| FND-02 | Three parametrized archetypes (Console, Data story, Schematic) render from typed payload, no hardcoded per-page numbers | §"The three payload schemas" proposes concrete TS shapes; Console validated against both Placement implementations |
| FND-03 | Typed per-context payload model (dedicated location, `[CLAIMS REVIEW]`-auditable), visual = archetype + payload | §"Payload home" confirms `src/content/visuals/` as the dir; `types.ts` shapes; `[CLAIMS REVIEW]` comment convention from existing visuals |
| FND-04 | Shared product primitives (chart atoms, flow nodes, worklist rows, bars, status) extend the existing `parts.tsx` set under one stroke/type/color logic | §"Extended primitives" lists existing atoms to reuse + new atoms to add and where |
| FND-05 | CI guardrails: route First-Load-JS budget, INP/TBT in LHCI, "no stuck opacity:0" spec, mobile-GSAP-free spec; all existing specs stay green | §"CI guardrails" gives the concrete mechanism for each, modeled on shipped M5 patterns; corrects INP→TBT (INP not lab-measurable) |
| FND-06 | No eager motion code in homepage/shared chunk; co-lands with/after M5 Phase 5.3 lazy-GSAP so `/` LCP budget not re-opened | §"Motion-barrel migration" (re-export shim keeps `/` chunk lean) + §"CI guardrails" (route JS budget + mobile-GSAP-free spec enforce it) |
</phase_requirements>

## Project Constraints (from CLAUDE.md)

- **§2 No new dependencies** beyond the approved stack without a chat flag. This phase adds ZERO deps (Framer Motion 12 + GSAP 3 already installed; charting is hand-built SVG). `[VERIFIED: package.json]`
- **§3 Tokens are DESIGN.md only.** No local colors/spacing/type. Motion tokens come from DESIGN.md §4.7 (`--duration-instant/fast/normal`, `--ease-standard`, `--ease-in-out`). Visuals read `var(--chart-1..5)`, `var(--status-*)`, never hex literals. `[CITED: DESIGN.md §4.7]`
- **§11 A11y floor WCAG 2.2 AA.** Visible focus `#9CB4E8` 2px/2px, 44px targets, reduced-motion respected, one H1/page, axe-core CI on every PR. Decorative visuals `aria-hidden`; meaningful visuals get descriptive label. `[CITED: CLAUDE.md §11]`
- **§12 Perf targets.** LCP <2.5s, CLS <0.1, INP <200ms. Visuals lazy (`ssr:false` dynamic import), Server Components by default, transform/opacity-only animation. `[CITED: CLAUDE.md §12]`
- **§5 Voice rules + governance.** Any new caption is governed copy: no em dashes, no "not X, it's Y", banned-phrase list; any metric → `[CLAIMS REVIEW]`; any TSI/vendor framing → `[COI REVIEW]`. Payloads centralize numbers so the claims gate is enforceable. `[CITED: CLAUDE.md §5, §6, §7]`
- **§15 No invented data.** Console/data-story numbers stay anonymized, generic, qualified; carry `[CLAIMS REVIEW]` until Andrew sign-off (existing visuals already do this). `[CITED: CLAUDE.md §15]`
- **Docs-in-sync (memory + spec §5).** DESIGN.md §4.7 and `.impeccable.md` update in the SAME commit as the code they describe. The engine-per-job rule must be written into DESIGN.md §4.7 in Phase 10. `[CITED: spec §5]`

## Skills Constraints (from 10-SKILLS-BRIEFING.md — binding; CLAUDE.md/DESIGN.md still win)

- **`architecture-avoid-boolean-props` (HIGH).** Three archetypes are explicit separate components (`<ConsoleVisual payload>`, `<DataStoryVisual>`, `<SchematicVisual>`), NOT one `<Visual type="console">`. This is the override that kills the `SolutionsIndustryCards` no-prop duplicate.
- **`architecture-compound-components` (HIGH).** Explorable visuals use compound components with shared context (`<Console><Console.Worklist/><Console.KPIs/></Console>`), not `showKpis`/`interactive` booleans. The Console schema below is slot-shaped to enable this.
- **`react19-no-forwardref` (MEDIUM).** No `forwardRef` (React 19.2.4); pass `ref` as a normal prop; use `use()` not `useContext()` for archetype/motion context.
- **GSAP lazy + client-only + out of the eager chunk.** Generalize `HeroCinematicController.tsx`'s dynamic-`import("gsap")`-inside-effect pattern. `gsap.context()`+`ctx.revert()` cleanup in the lazy case; `useGSAP()` only when GSAP is statically available (not the default here).
- **Engine-per-job (set ONCE here, documented in DESIGN.md §4.7):** GSAP → scroll-scrub/pin cinematics only (lazy, desktop-only, client-only). Framer → entrances/reveals/`whileInView`/tab+section+route transitions. CSS → hover/focus/ambient drift/the 7 interaction states. Consumers import a named primitive; never hand-roll.
- **Reduced-motion fails OPEN** at the primitive level (final visible state, never stuck `opacity:0`).

---

## 1. The three payload schemas (HIGHEST RISK)

A visual = archetype component + typed payload. Payloads are plain server-safe data in `src/content/visuals/`. Archetypes are `"use client"`, lazy `ssr:false`, render the payload with zero baked constants. The schemas must cover the *real* cases that exist today, validated by mapping the two Placement implementations onto `ConsoleData`.

### Proposed `ConsoleData` (slot-shaped, compound-component-ready)

```typescript
// src/content/visuals/types.ts  (server-safe, no "use client")

/** A single-segment OR multi-segment horizontal bar.
 *  segments: [40,35,25] → multi-segment vendor allocation (PlacementMatrix)
 *  segments: [35]       → single-value pct fill (PlacementMockup pool row) */
export interface BarSpec {
  segments: number[];               // percentages; one entry = single-value bar
  label?: string;                   // optional bar caption (a11y + visible)
  tone?: "indigo" | "success" | "warning" | "neutral";
}

export interface ConsoleHeader {
  eyebrow?: string;                 // PlacementMatrix: "PLACEMENT MANAGEMENT"
  title: string;                    // "Routing rules" | "Placement run · 12:04 PM"
  subtitle?: string;                // "National network · decision engine active · 14 rules live"
  status?: { label: string; live?: boolean }; // LiveStatus "LIVE" | "Engine running" (live=pulse)
  kpi?: {                           // PlacementMockup left-side KPI block
    caption: string;                // "Inbound batch"
    value: number;                  // 120418
    valueSuffix?: string;
    decimals?: number;
    sub?: string;                   // "accounts · $284.6M"
  };
}

export interface ConsoleCallout {  // PlacementMatrix "ready to route" card; optional
  icon?: "route" | "alert" | "check";
  title: string;                    // "1,847 accounts ready to route"
  sub?: string;                     // "Loaded from billing · evaluated against tier rules"
  action?: string;                  // "Routing now" pill text
}

export interface ConsoleRow {
  primary: string;                  // "Pre-collect"
  secondary?: string;               // "3 vendors · 30-day" | "2 vendors"
  bar?: BarSpec;                    // segmented or single-value
  trailing?: {                      // right column: count OR pct
    value: number;
    suffix?: string;                // "%" for the mockup, none for the matrix count
    decimals?: number;
    animate?: "count" | "shift" | "none"; // AnimatedNumber vs NumberShift vs static
  };
}

export interface ConsoleData {
  header: ConsoleHeader;
  callout?: ConsoleCallout;
  columns?: { primary?: string; bar?: string; trailing?: string }; // optional header row labels
  rows: ConsoleRow[];
  pills?: { label: string; tone?: "indigo" | "neutral" }[]; // PlacementMatrix StatPills
  ariaSummary: string;              // REQUIRED text alternative (Pitfall 8) — governed copy
}
```

### Validation: mapping BOTH Placement implementations onto `ConsoleData`

| Real element | `PlacementMatrix` value | `PlacementMockup` value | Schema field | Covered? |
|---|---|---|---|---|
| Eyebrow | "PLACEMENT MANAGEMENT" | (none) | `header.eyebrow?` | yes (optional) |
| Title | "Routing rules" | "Placement run · 12:04 PM" | `header.title` | yes |
| Subtitle | "National network · …14 rules live" | (none) | `header.subtitle?` | yes |
| Status chip | LiveStatus "LIVE" | "Engine running" + ping dot | `header.status{label, live}` | **partial** — see gap |
| KPI block | (none) | "Inbound batch" 120,418 · $284.6M | `header.kpi?` | yes (optional) |
| Callout card | "1,847 accounts ready to route" + "Routing now" | (none) | `callout?` | yes (optional) |
| Column headers | "Treatment tier / Vendor allocation / Accounts" | (none) | `columns?` | yes (optional) |
| Rows | 4 rows: tier+sub, multi-segment bar, count | 4 pools: tier+vendors, single pct bar, pct | `rows[]` with `bar.segments` 1-or-N | yes |
| Bar semantics | `segments:[40,35,25]` multi | `pct:35` single → `segments:[35]` | `BarSpec.segments` | yes (unifies both) |
| Trailing value | count "12,847" (count-up) | "35%" (static) | `row.trailing{value,suffix,animate}` | yes |
| Stat pills | 3 pills incl. "27 vendors active" | (none) | `pills?` | yes (optional) |

**The one gap (flagged):** The mockup's "Engine running" status carries an **always-on `animate-ping` pulse dot**; the matrix's "LIVE" is a static `LiveStatus`. `header.status.live: true` is proposed to signal "render a pulse," but the *pulse itself* is a motion concern, not a data concern. Resolution: model it as data (`live: boolean`) and let the `Console` archetype render the pulse via the `<PulseDot>` motion primitive when `live` is true. This keeps the payload pure and the motion centralized. **Confirm during Phase 10 prototype that the pulse reads correctly under reduced motion (must collapse to a static dot).** `[ASSUMED]` — pulse-as-data modeling is a design call; validate in the schema prototype task.

**Conclusion:** A single slot-based `ConsoleData` covers both real Placement consoles without baked constants, *provided* the bar atom accepts both single- and multi-segment input (it already exists as two atoms: `SegmentedBar` for multi, `ValueBar` for single — the archetype picks based on `segments.length`). This is the strongest evidence the schema is real-data-shaped. `[VERIFIED: PlacementMatrix.tsx, PlacementMockup.tsx, parts.tsx]`

### Proposed `DataStoryData`

The data-story archetype is "one focused, annotated chart that teaches something true" (spec §3.3) — 2-6 points. It must subsume the `SolutionsIndustryCards` 4-card grid (the duplicate being killed) and the single-chart cases.

```typescript
export interface DataStoryData {
  eyebrow?: string;
  headline: string;                 // the true thing it teaches
  chart:
    | { kind: "area"; points: number[] }        // reuse parts.tsx AreaLine
    | { kind: "spark"; bars: number[] }          // reuse Sparkline
    | { kind: "bars"; series: { label: string; value: number; tone?: string }[] }
    | { kind: "cards"; cards: {                   // subsumes SolutionsIndustryCards
        name: string; accent: string; tag: string;
        value: number; decimals?: number; suffix?: string;
        bar: number; sub: string;
      }[] };
  annotation?: { value: string; caption: string }; // the callout that teaches
  ariaSummary: string;              // REQUIRED text alternative; governed copy
}
```

`[VERIFIED: SolutionsIndustryCards.tsx, parts.tsx AreaLine/Sparkline]` — the `cards` variant is a 1:1 lift of the existing duplicate widget's data, which is exactly the duplicate Phase 12 deletes (fed 6 per-industry payloads instead of one baked array).

### Proposed `SchematicData`

The schematic is a "precise routing/flow diagram with data traveling the edges" (spec §3.3). No existing implementation is a true schematic, so this is the lowest-confidence schema and should be hardened in Phase 11 (platform "how it works"). `PlatformSystemMap.tsx` is the nearest existing reference (read it in Phase 11 before locking).

```typescript
export interface SchematicNode {
  id: string;
  label: string;
  sub?: string;
  kind?: "source" | "engine" | "vendor" | "sink";
}
export interface SchematicEdge {
  from: string; to: string;
  label?: string;                   // "30-day" etc.
  flow?: boolean;                   // animate data traveling (GSAP/strokeDashoffset) when true
}
export interface SchematicData {
  eyebrow?: string;
  title: string;
  nodes: SchematicNode[];
  edges: SchematicEdge[];
  ariaSummary: string;              // REQUIRED; describes the routing in words
}
```

`[ASSUMED]` — node/edge shape is inferred from the spec description, not an existing implementation. Flag A2.

### Anti-pattern this kills

`SolutionsIndustryCards` takes **no props** and renders the identical widget on all 7 solutions pages (`[VERIFIED: SolutionsIndustryCards.tsx]`). The archetype + payload structure makes that class of duplicate *impossible to construct* — there is no component to copy, only a payload to author. This is the structural realization of skill `architecture-avoid-boolean-props` + `state-decouple-implementation`.

---

## 2. Motion primitive vocabulary (7 types) + engine-per-job

All seven live behind named exports in `src/components/motion/`. Pages and archetypes import `<Reveal>`, `<LiveValue>`, `<Hoverable>` — never `framer-motion`/`gsap` directly (Architecture Anti-Pattern 3). Each primitive owns its reduced-motion collapse.

| # | Type | Engine (per briefing rule) | Primitive + API | Reduced-motion = fail-open final state |
|---|------|----------------------------|-----------------|----------------------------------------|
| 1 | Scroll reveal (staggered fade-up) | **Framer** | `<Reveal>` / `<RevealList stagger>` wrapping `staggerContainer`/`fadeUpItem`/`inViewProps` | render children untouched, opacity 1, no transform (the `RevealSection` contract) |
| 2 | Live data (number roll-up, filling bar, pulse dot) | **Framer** | `<LiveValue value suffix decimals>` (=AnimatedNumber), `<NumberShift>`, `<FillBar segments tone>` (=SegmentedBar/ValueBar), `<PulseDot tone>` | LiveValue renders final value immediately; FillBar renders final width; PulseDot renders static dot |
| 3 | Hover + cursor (card lift, cursor glow) | **CSS (lift) + vanilla rAF (CursorGlow)** | `<Hoverable lift glow>` wrapping `hover.module.css` + `<CursorGlow>` | glow gated to `pointer:fine` + off under reduced motion; lift = CSS only |
| 4 | Ambient drift | **CSS keyframes** | `<AmbientField>` (exists in `ambient/`, re-export through barrel) | `bloomStatic` static fallback (already shipped) |
| 5 | Micro-interactions (the 7 component states) | **CSS** | `hover.module.css` + Button states; document the 7-state contract | CSS `@media (prefers-reduced-motion)` neutralizes; `:focus-visible` stays |
| 6 | Section/tab/route transitions (crossfade/morph) | **Framer** (GSAP only for the existing pinned hero→Platform seam) | `transitions.ts` shared crossfade variants + `AnimatePresence` | instant swap, no transition |
| 7 | Explorable (hover-to-inspect, toggle state) | **Framer** + local state (GSAP `Observer`/`Draggable` only if drag added later — none in scope) | `<Explorable>` shell as a **compound component** (skill HIGH); keyboard-operable `<button>` controls, focus parity with hover (Pitfall 7) | toggles still keyboard-operable; values visible by default, not hover-gated |

### The shared fail-open contract (FND-01 — bake into the primitive, not the consumer)

Every reveal/live primitive MUST:
1. Under `prefers-reduced-motion: reduce`, render the **final, fully-visible** state with zero opacity/transform gating. References that already do this correctly: `RevealSection`, `AnimatedNumber` (`if (reduce) { node.textContent = format(value); return; }`), `AmbientField.bloomStatic`. `[VERIFIED: motion.tsx, parts.tsx]`
2. Never set `initial={{ opacity: 0 }}` without a guaranteed trigger or a reduced-motion bypass. The current `parts.tsx` atoms use `const shown = reduce || inView` and `initial={reduce ? false : ...}` — the correct pattern; centralize it so consumers can't forget it.
3. Never gate *mounting* on intersection for layout-affecting content (animate already-rendered content; Pitfall 4).

This contract is verified by the "no stuck opacity:0" Playwright spec (§4c) and the extended reduced-motion spec.

### Engine-per-job must be written into DESIGN.md §4.7

DESIGN.md §4.7 currently has motion tokens + 4 rules but **no engine-per-job rule**. `[VERIFIED: DESIGN.md §4.7]` Phase 10 adds the GSAP/Framer/CSS division to §4.7 in the same commit as the barrel (docs-in-sync). This is where the rule lives per the briefing.

---

## 3. Motion-barrel migration (FND-06 — without breaking 17 consumers or fattening `/`)

### Current consumers of `@/components/product/motion` (17 files) `[VERIFIED: grep]`

Sections (7): `CompareMatrix`, `IntegrationStrip`, `CardGrid`, `LeadershipTable`, `ProcessStrip`, `BulletList`, `IntegrationTable`.
Product (10): `visuals/{OptimizationEngine, ComplianceStandards, PlacementMatrix, ReportingDashboard, SolutionsIndustryCards, PlatformSystemMap, DecisionEnginePreview, IssuesWorklist}`, `primitives/MetricCell`, `visuals/parts`.

What they import: `AnimatedNumber`, `NumberShift`, `fadeUpItem`, `popItem`, `staggerContainer`, `inViewProps`, and tokens (`EASE_ENTRANCE`, `EASE_STATE`, `DUR_BAR`, `DUR_COUNT`, `STAGGER`, etc.). `[VERIFIED: motion.tsx exports]`

### Recommended migration path: **re-export shim** (NOT a codemod this phase)

1. Create `src/components/motion/tokens.ts` (move `EASE_*`/`DUR_*`/`STAGGER`/`TINT`/`TEXT_DEFAULT`) and `src/components/motion/LiveValue.tsx` (move `AnimatedNumber`/`NumberShift`), plus `Reveal.tsx`/`transitions.ts` (move `fadeUpItem`/`popItem`/`staggerContainer`/`inViewProps`).
2. Add `src/components/motion/index.ts` barrel exporting all of the above + re-exporting existing `CursorGlow`, `hover.module.css` users, and `AmbientField` (from `ambient/`).
3. **Leave `src/components/product/motion.tsx` in place as a thin re-export shim:** `export * from "@/components/motion";` (or named re-exports). All 17 consumers keep their existing import path and compile unchanged. Zero consumer edits in Phase 10.
4. New code (the 3 archetypes, new primitives) imports from `@/components/motion` directly.
5. Consumer import-path cleanup (delete the shim) is deferred to a later phase or a mechanical codemod — NOT required for FND-01..06.

**Why shim over codemod:** A codemod touching 17 files is 17 chances to introduce an eager-import regression on a shared/critical path, and several consumers (`CompareMatrix`, `IntegrationStrip`, `CardGrid`) are used on routes adjacent to `/`. The shim is a zero-risk move that satisfies "barrel exists" (FND-01) and "no eager motion in `/` chunk" (FND-06) without a wide blast radius. `[ASSUMED — recommended approach; validate the shim re-export compiles clean with tsc]` Flag A3.

### Keeping `/` lean (FND-06)

- The barrel modules are `"use client"`, so importing them only pulls Framer into whatever route imports them. The `/` homepage critical path must NOT statically import any reveal/live primitive into `layout.tsx`, `SiteHeader`, or the eager part of `HomepageHero`. (Pitfall 1/6.)
- GSAP stays in exactly one module via dynamic import (`HeroCinematicController.tsx`); the barrel does NOT re-export GSAP. `[VERIFIED: HeroCinematicController.tsx — single dynamic-import owner]`
- The route First-Load-JS budget (§4a) catches any regression at build time.

---

## 4. CI guardrails (FND-04/FND-05)

Four guardrails, each modeled on a pattern M5 already shipped. All wire into the existing `perf.yml` / `a11y.yml` workflows; all existing 170 Playwright specs stay green.

### (a) Route-level First-Load-JS budget on `/`

**Finding:** Next.js 16 has **no built-in build-failing JS budget.** `[VERIFIED: WebSearch — Next 16 prints First Load JS in build output but does not fail on it; no `next.config` knob]` The standard mechanisms are (1) parse the build output / `.next/app-build-manifest.json` in a script that exits 1 over budget (the exact shape of the existing `scripts/check-hero-assets.sh` byte-budget guard), or (2) add `size-limit` (a new dev dep — needs a CLAUDE.md §2 flag).

**Recommendation:** Build a `scripts/check-route-js-budget.sh` (or `.mjs`) modeled on `check-hero-assets.sh`: after `npm run build`, read the per-route First-Load-JS for `/` from the build manifest, compare to a byte budget, exit 1 if over. Wire it into `perf.yml` right after the existing "Verify hero asset budgets" step. Set the initial budget at the *current* `/` First-Load-JS measured on the post-5.3 build + a small headroom (capture the number in Phase 10 and write it into the script comment, exactly as the hero budgets cite Phase 5.1 D-07). No new dependency. `[VERIFIED: check-hero-assets.sh is the proven exit-1 budget-guard pattern; perf.yml runs it before LHCI]`

### (b) INP/TBT assertions in LHCI on visual-heavy routes

**Critical correction:** INP **cannot be measured in a Lighthouse lab run** (no synthetic interactions). `[VERIFIED: WebSearch — searchenginejournal, web.dev/tbt]` The correct lab proxy is **`total-blocking-time`** (and optionally `interactive`). FND-05 says "INP/TBT in LHCI"; the implementable form is `total-blocking-time` assertions, with real INP deferred to RUM (already a deferred item in REQUIREMENTS — "Vercel Speed Insights RUM").

**Recommendation:** Extend `lighthouserc.json`'s `assertMatrix` with `total-blocking-time` (e.g. `["error", { "maxNumericValue": 200, "aggregationMethod": "median-run" }]`) and add the visual-heavy routes to `collect.url`. Today `collect.url` is `["http://localhost:3200/"]` only `[VERIFIED: lighthouserc.json]`; Phase 10 adds at least one platform and one solutions route. Note: `throttlingMethod` is already `"devtools"` (changed in 5.3) — keep it; TBT numbers under `devtools` throttling differ from `simulate`, so set the budget against a measured devtools-throttled run, not a guessed number. `[VERIFIED: lighthouserc.json throttlingMethod: "devtools"]`

### (c) "No stuck opacity:0" reveal Playwright spec

**Recommendation:** New `tests/responsive/reveal-fail-open.spec.ts`. For each route (extend `tests/helpers/routes.ts` to include the new visual routes): goto, scroll to bottom and back, open each tab/accordion, then assert **no in-viewport element sits at computed `opacity < 1`** for text-bearing nodes. This directly catches the audit's false-positive class (Pitfall 2) as a real regression net. Model the scroll-to-surface + poll structure on the existing `reduced-motion.spec.ts` (which already scrolls bottom-and-back to force IO entrances). `[VERIFIED: reduced-motion.spec.ts scroll pattern]`

Also extend `reduced-motion.spec.ts` itself to additionally assert computed `opacity === 1` for revealed content under reduced motion on the new routes (today it only asserts no running animations).

### (d) Mobile-GSAP-free spec

**Recommendation:** The spec already exists — `tests/responsive/hero-gsap-free-mobile.spec.ts` asserts zero `/gsap/` requests at 412×823 on `/`. `[VERIFIED]` Phase 10 generalizes it: parametrize the same network-watcher across the visual-heavy routes (or add a sibling spec) so that as Phases 11-15 add archetypes, no archetype accidentally pulls GSAP onto a mobile route. The Console/DataStory archetypes use Framer/CSS only; only a Schematic with `edge.flow` animation may touch GSAP, and that must stay desktop-only + lazy like the hero. The spec is the enforcement.

### Validation note on `collect.url` and ROUTES drift

`tests/helpers/routes.ts` lists 11 routes but **omits the 6 solutions sub-pages and the company/compare sub-pages** `[VERIFIED]`. The reveal/reduced-motion specs that iterate `ROUTES` therefore don't cover the pages where Phases 11-12 add the most visuals. Phase 10 should extend `ROUTES` (or add a `VISUAL_ROUTES` list) so the foundation's specs actually guard the routes later phases touch. Flag for the planner.

---

## 5. Payload home + dead-asset cleanup (FND-05/SYSVIS-02 prep)

### Payload home

**Confirmed: `src/content/visuals/`** as the dedicated typed-payload dir (Architecture §"Structure Rationale"). Rationale: payloads are dense, numeric, `[CLAIMS REVIEW]`-sensitive; a dedicated dir gives Andrew/Paul one place to audit every number rendered inside a product visual, and keeps page content modules readable. `types.ts` holds `ConsoleData`/`DataStoryData`/`SchematicData`; per-context payload modules import from it. Payloads stay server-safe (no `"use client"`), importable by Server Component pages at zero client cost. `[CITED: ARCHITECTURE.md; design spec §4.2]`

### Dead `dashboard-dark.png` BenefitSplit `media` fallbacks (6 to remove)

`[VERIFIED: grep]` The 6 dead `BenefitSplit.media` fallbacks (every page supplies a live `visual=`, so the `media` fallback never renders):

1. `src/content/reporting.ts:108`
2. `src/content/placement.ts:104`
3. `src/content/homepage.ts:134`
4. `src/content/solutions.ts:85`
5. `src/content/optimization.ts:102`
6. `src/content/issues.ts:121`

Each is a `media: { src: "/product/dashboard-dark.png", alt, width, height }` block on a BenefitSplit content object. Removing them is the FND-05 dead-asset cleanup. **Verify before removing** that each page genuinely supplies a live `visual=` (so the fallback is truly dead) — this is a per-file check the planner should make a task precondition.

### Hero use is OUT of scope (deferred to Phase 15)

`[VERIFIED]` The 7th reference is `src/components/sections/HomepageHero.tsx:187` — `<Image src="/product/dashboard-dark.png">` inside the hero's `FramedDashboard`. This is the homepage hero centerpiece, **not** a dead fallback. Per ROADMAP and spec §4.3, its fate (keep vs. replace with a Console instance) is resolved in **Phase 15 (homepage capstone)**, not Phase 10. Phase 10 must NOT touch it, and must NOT delete the PNG file itself (the hero still references it). FND-05 removes only the 6 content-file fallbacks.

---

## 6. Extended primitives (FND-04)

Reuse unchanged (one stroke weight, type scale, color logic already established): `MetricCell`, `StatPill`, `LiveStatus`, `ProductCanvas`, `ProductCard`, `EyebrowLabel`, `EventBadge`, and `parts.tsx` (`SegmentedBar`, `ValueBar`, `Sparkline`, `AreaLine`, `Tag`, `TypeChip`). `[VERIFIED: parts.tsx, primitives/]`

Add to `src/components/product/primitives/` (Architecture §"New vs Modified"):
- `WorklistRow` (Console rows — generalizes the inline grid in `PlacementMatrix`/`IssuesWorklist`)
- `ChartFrame` (Data-story chart container with caption/annotation slots + `ariaSummary` wiring)
- `FlowNode`, `FlowEdge` (Schematic atoms — node groups + `<path>` edges)

All new atoms: token-driven (`var(--chart-*)`/`var(--status-*)`), `transform`/`opacity`/`scaleX`/`clipPath`/`pathLength`-only animation (Pitfall 5 — never animate `width`/`height`/`top`), label-paired status (Pitfall 8 — make a color-only state impossible to construct), `role="img"`+`aria-label` for meaningful or `aria-hidden` for decorative.

---

## Runtime State Inventory

> This is a refactor/migration phase (motion-barrel move, library consolidation prep, dead-asset removal). No external runtime systems store the affected identifiers.

| Category | Items Found | Action Required |
|----------|-------------|------------------|
| Stored data | None — no database/datastore in this static marketing site; payloads are typed source modules, not stored records. Verified: no DB client in `package.json`. | none |
| Live service config | None — the only externals are Zoho webhook + Resend (demo form), unaffected by motion/visual refactor. Verified: grep of changed surface touches no service config. | none |
| OS-registered state | None — no OS-level registrations; CI runs on GitHub Actions ephemeral runners. | none |
| Secrets/env vars | None renamed. `NEXT_PUBLIC_GA4_ID`/`GTM_ID`/`ZOHO_WEBHOOK_URL`/`RESEND_API_KEY` are untouched by Phase 10. Verified: no env var reads in the motion/visual surface. | none |
| Build artifacts | `.next/` build cache + `.lighthouseci/` (gitignored). The motion-barrel move via re-export shim means **no import path breaks**; a stale `.next` is harmless (rebuilt by CI). Removing 6 content fallbacks + the PNG-still-referenced-by-hero means **do NOT delete `public/product/dashboard-dark.png`** (hero references it). | rebuild on CI (automatic); do not delete the PNG |

**The canonical question — after every repo file is updated, what runtime systems still have the old string cached?** Answer: none. This is a code-internal refactor on a static site; the only "old string" risk is import paths, and the re-export shim eliminates that by keeping `@/components/product/motion` valid.

---

## Common Pitfalls

(Full catalog in project-level `.planning/research/PITFALLS.md`; the Phase-10-owned ones:)

### Pitfall 1: Re-opening the `/` LCP gate by piling JS onto the mobile critical path
**Avoid:** Re-export shim (not codemod) for the barrel; route First-Load-JS budget guard; GSAP stays single-dynamic-owner; never static-import a motion primitive into `layout`/`SiteHeader`/eager hero. **Verify:** route JS budget green; mobile-GSAP-free spec.

### Pitfall 2: `whileInView` reveals ship blank (stuck `opacity:0`)
**Avoid:** Centralize the fail-open contract in the primitives; never `initial={{opacity:0}}` without a guaranteed trigger or reduced-motion bypass. **Verify:** "no stuck opacity:0" spec + reduced-motion opacity===1 assertion.

### Pitfall 5: Animating layout properties (the filling-bar trap)
**Avoid:** `FillBar` animates `scaleX`/`clipPath`, never `width` — note the existing `PlacementMockup` animates raw `width` (the wrong way) while `parts.tsx` `SegmentedBar`/`ValueBar` use `clipPath`/`scaleX` (the right way). The Console archetype must consume the `parts.tsx` atoms, not re-implement the mockup's `width` animation. `[VERIFIED: PlacementMockup.tsx animates width; parts.tsx uses scaleX/clipPath]`

### Pitfall 6/10: Two engines on mobile + inconsistent reduced-motion
**Avoid:** Engine-per-job rule in DESIGN.md §4.7; reduced-motion handled once in the barrel. **Verify:** mobile-GSAP-free spec; reduced-motion spec extended to new routes.

### Pitfall 7/8: Hover/color-only data (explorable + status)
**Avoid:** `<Explorable>` controls are real `<button>`s with focus parity; every status field is label-paired by API; every archetype payload carries a required `ariaSummary`. **Verify:** axe-CI + keyboard-walk specs (consumers verify in Phases 11-12; Phase 10 sets the contract).

---

## Code Examples (verified patterns from this repo)

### Lazy GSAP, single owner, fail-open (the pattern Phase 10 generalizes)
```typescript
// Source: src/components/sections/HeroCinematicController.tsx (shipped 5.3)
// GSAP loaded ONLY via dynamic import inside an effect; module mounted only via
// next/dynamic({ssr:false}) behind !isMobile && !prefersReducedMotion.
try {
  gsapMod = await import("gsap");
  scrollTriggerMod = await import("gsap/ScrollTrigger");
  gsapReactMod = await import("@gsap/react");
} catch { return; } // fail-open: parents keep static fallback
const gsap = gsapMod.default;
gsap.registerPlugin(ScrollTrigger, useGSAP); // idempotent
// cleanup: triggers.forEach(t => t.kill())
```

### Reduced-motion fail-open (the contract every primitive must follow)
```typescript
// Source: src/components/product/motion.tsx — AnimatedNumber
if (reduce) { node.textContent = format(value); return; } // final value, immediate
if (!inView) { node.textContent = format(0); return; }
const controls = animate(0, value, { duration: DUR_COUNT, ... });
return () => controls.stop(); // stop one-shot loop, never leave rAF running
```

### Compositor-only bar fill (the right way — Console must use this, not width)
```typescript
// Source: src/components/product/visuals/parts.tsx — ValueBar
initial={reduce ? false : { scaleX: 0 }}
animate={{ scaleX: shown ? 1 : 0 }}   // scaleX, NOT width
transition={{ duration: DUR_BAR, ease: EASE_ENTRANCE }}
```

### Lazy archetype wrapper (Turbopack inline-literal requirement)
```typescript
// Source: src/components/product/visuals/lazy.tsx pattern
const LazyConsole = dynamic(
  () => import("./Console").then((m) => m.Console),
  { ssr: false, loading: VisualSkeleton }, // MUST be inline literal (Turbopack)
);
export function ConsoleVisual({ data }: { data: ConsoleData }) {
  return <LazyConsole data={data} />;
}
```

---

## State of the Art

| Old approach | Current approach | Why it matters here |
|---|---|---|
| INP asserted in Lighthouse lab | INP is field-only; `total-blocking-time` is the lab proxy | FND-05 "INP/TBT in LHCI" implements as TBT; real INP → RUM (deferred) |
| GSAP plugins paid (ScrollTrigger/SplitText/MorphSVG) | Free for commercial use since GSAP 3.13 (Apr 2025); repo runs 3.15 | No license blocker for any GSAP feature in M6 |
| `forwardRef` for ref forwarding | React 19: `ref` is a normal prop; no `forwardRef` | All new primitives/archetypes (React 19.2.4) |
| `useContext()` | `use()` for context consumption (React 19) | Explorable compound-component context |
| Framer Motion `whileInView` had IO fallback | Current Motion assumes IO is universal (no fallback) | Fail-open contract is the only safety net for reveals |

---

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | Modeling the "Engine running" pulse as `header.status.live: boolean` (data) with the archetype rendering the pulse via `<PulseDot>` (motion) | §1 ConsoleData gap | Low — if it reads wrong under reduced motion, adjust the primitive; schema unaffected |
| A2 | `SchematicData` node/edge shape (inferred from spec, no existing implementation) | §1 SchematicData | Medium — harden against `PlatformSystemMap.tsx` + real "how it works" data in Phase 11 before locking; Phase 10 should ship it as provisional |
| A3 | Re-export shim (not codemod) is the right barrel-migration path | §3 | Low — if tsc/lint flags a circular or duplicate export, fall back to named re-exports; either way no consumer edits |
| A4 | The 6 `dashboard-dark.png` `media` blocks are truly dead (live `visual=` always supplied) | §5 | Low-Medium — per-file precondition check before removal; if any page lacks a live `visual=`, removing its fallback would blank that BenefitSplit |
| A5 | Initial route JS budget should be "current post-5.3 `/` First-Load-JS + headroom" | §4a | Low — set by measurement at implementation time, not guessed |

**These need confirmation before becoming locked decisions.** A2 is the most consequential: the Schematic schema is the least-evidenced and should be explicitly marked provisional in the plan, to be finalized in Phase 11.

## Open Questions

1. **Does `FramedDashboard` relocate to `product/visuals/` or stay in a slimmed `sections/mockups/`?**
   - Known: it is the bezel, not a visual; survives consolidation (Phase 13).
   - Unclear: cosmetic placement.
   - Recommendation: leave in place in Phase 10; decide in Phase 13. Out of Phase 10 scope.

2. **One union type vs three separate schemas?**
   - Known: skill `architecture-avoid-boolean-props` says three explicit archetype components.
   - Recommendation: three separate interfaces (`ConsoleData`/`DataStoryData`/`SchematicData`), three components. No discriminated union, no `type` field. The lazy registry picks the component; the page picks the payload.

3. **Should Phase 10 build a real `<Explorable>` flagship, or just the shell + contract?**
   - Known: explorable flagships are Phase 11 (PLATVIS-02) consumers.
   - Recommendation: Phase 10 ships the `<Explorable>` compound-component *shell* + the keyboard/focus-parity contract + a keyboard-walk spec template; the first real explorable is Phase 11. Avoids building a flagship against unproven payloads.

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| framer-motion | motion barrel, archetypes | yes | 12.39.0 | — |
| gsap + @gsap/react | schematic edge-flow (desktop, lazy) | yes | 3.15.0 / 2.1.2 | CSS strokeDashoffset |
| @lhci/cli | TBT/LCP assertions | yes | 0.15.1 | — |
| @playwright/test | reveal-fail-open, mobile-GSAP-free, reduced-motion specs | yes | 1.60.0 | — |
| @axe-core/playwright | a11y CI | yes | 4.11.3 | — |
| Next.js build manifest | route JS budget guard | yes | next 16.2.6 | parse build stdout |
| size-limit (route JS budget) | optional alternative to manifest-parse script | NO | — | manifest-parse script (no new dep — preferred) |

**Missing with no fallback:** none.
**Missing with fallback:** `size-limit` is not installed; the route-JS budget is built as a no-new-dep manifest/stdout-parse script modeled on `check-hero-assets.sh` (avoids a CLAUDE.md §2 dependency flag).

---

## Validation Architecture

> nyquist_validation is enabled (`config.json` workflow.nyquist_validation: true). This section maps every FND requirement + success criterion to a concrete proof.

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Playwright 1.60 (e2e/a11y/responsive) + LHCI 0.15 (perf) + tsc (types) + eslint (lint) |
| Config files | `lighthouserc.json` (throttlingMethod `devtools`, mobile 412×823, LCP gate 2300ms on `/`), `.github/workflows/{perf,a11y}.yml`, `tests/helpers/routes.ts` |
| Quick run command | `npx tsc --noEmit && npx eslint` (type + lint) |
| Full suite command | `npm run test:e2e` (Playwright) + `npx --no-install lhci autorun` (perf) |

### Phase Requirements → Test Map
| Req | Behavior | Test type | Automated command / proof | Exists? |
|-----|----------|-----------|---------------------------|---------|
| FND-01 | Barrel exposes 7-type vocabulary; reduced-motion fails open | type + e2e | `tsc` (barrel exports compile); `tests/responsive/reduced-motion.spec.ts` extended (opacity===1) + new `reveal-fail-open.spec.ts` | partial — reduced-motion exists; reveal-fail-open ❌ Wave 0 |
| FND-02 | 3 archetypes render from typed payload, no baked numbers | type + grep | `tsc` (archetype takes `data: XData` prop); grep asserts no numeric literals in archetype JSX (manual/code-review) | ❌ Wave 0 (archetypes don't exist) |
| FND-03 | Typed payload model in `src/content/visuals/`, `[CLAIMS REVIEW]`-auditable | type + grep | `tsc` against `types.ts`; grep `[CLAIMS REVIEW]` present in payload modules | ❌ Wave 0 |
| FND-04 | New primitives extend `parts.tsx` under one stroke/type/color logic | type + a11y | `tsc`; `tests/a11y/axe-routes.spec.ts` (label-paired status, role/aria) | partial — axe exists; new atoms ❌ Wave 0 |
| FND-05a | Route First-Load-JS budget on `/` | CI script | `scripts/check-route-js-budget.sh` exit 1 over budget; wired in `perf.yml` | ❌ Wave 0 (model on `check-hero-assets.sh`) |
| FND-05b | TBT (INP lab proxy) on visual-heavy routes | LHCI | `lighthouserc.json` assertMatrix adds `total-blocking-time` + visual routes in `collect.url` | partial — LHCI exists, LCP-only ❌ Wave 0 |
| FND-05c | "No stuck opacity:0" reveal spec | e2e | new `tests/responsive/reveal-fail-open.spec.ts` (scroll + tab/accordion open; assert no in-viewport opacity<1) | ❌ Wave 0 |
| FND-05d | Mobile-GSAP-free spec | e2e | `tests/responsive/hero-gsap-free-mobile.spec.ts` generalized across visual routes | partial — exists for `/` only ✅; extend ❌ Wave 0 |
| FND-05e | All existing specs stay green | e2e | `npm run test:e2e` (170 specs) | ✅ exists |
| FND-06 | No eager motion in `/`/shared chunk; co-land with 5.3 lazy-GSAP | CI script + e2e | `scripts/check-route-js-budget.sh` (`/` budget) + mobile-GSAP-free spec; LHCI Case C LCP still ≤ gate | partial — LCP gate ✅; route JS budget ❌ Wave 0 |

### Success Criteria → Proof (from ROADMAP Phase 10)
- *7-type vocabulary exists, reduced-motion-aware, fails open* → reduced-motion spec (opacity===1) + reveal-fail-open spec.
- *Reduced-motion final visible state, no stuck opacity:0* → reveal-fail-open spec is the dedicated net.
- *Every product number lives in a typed payload, archetypes render with zero baked constants* → `tsc` (payload-typed props) + grep for numeric literals in archetype JSX (code-review gate).
- *Route-level First-Load-JS budget on `/`* → `check-route-js-budget.sh` in CI.
- *Existing Playwright specs green* → full `test:e2e` run.

### Sampling Rate
- **Per task commit:** `npx tsc --noEmit && npx eslint` (fast type+lint).
- **Per wave merge:** relevant Playwright spec(s) for the wave + `npm run build` (so the route JS budget script can run).
- **Phase gate:** full `npm run test:e2e` green + `lhci autorun` green (LCP ≤ gate, TBT ≤ budget) + `check-route-js-budget.sh` exit 0, before `/gsd-verify-work`.

### Wave 0 Gaps (build before/with implementation)
- [ ] `tests/responsive/reveal-fail-open.spec.ts` — covers FND-01, FND-05c (no stuck opacity:0)
- [ ] `scripts/check-route-js-budget.sh` — covers FND-05a, FND-06 (route `/` JS budget); model on `scripts/check-hero-assets.sh`; wire into `perf.yml`
- [ ] `lighthouserc.json` extension — add `total-blocking-time` assertion + visual-heavy routes to `collect.url` (FND-05b)
- [ ] `tests/responsive/hero-gsap-free-mobile.spec.ts` generalization (or sibling spec) across visual routes (FND-05d)
- [ ] `tests/helpers/routes.ts` extension — add the 6 solutions sub-pages + compare/company sub-pages (or a `VISUAL_ROUTES` list) so iterating specs cover the routes Phases 11-12 touch
- [ ] `reduced-motion.spec.ts` extension — add computed `opacity===1` assertion for revealed content on new routes (FND-01)

*Framework install: none — all test tooling already present.*

---

## Security Domain

> `security_enforcement` not present in config; this is a static marketing site with no auth/session/PII surface in Phase 10. The relevant governance is content-claims + COI, not classic ASVS.

| ASVS category | Applies | Standard control |
|---|---|---|
| V5 Input Validation | partial | Demo form (Zod) — untouched by Phase 10 |
| V6 Cryptography | no | No crypto in motion/visual layer |
| Others (V2/V3/V4) | no | No auth/session/access-control surface |

**Phase-10-relevant threat:** invented or unqualified metrics leaking into visual captions/payloads (CLAUDE.md §15, §7). Mitigation: every payload number carries `[CLAIMS REVIEW]`; centralizing numbers in `src/content/visuals/` makes the claims gate enforceable (one audit surface for Andrew/Paul). Any caption touching the TSI/vendor relationship → `[COI REVIEW]`. `[CITED: CLAUDE.md §6, §7, §15]`

---

## Sources

### Primary (HIGH confidence)
- This repo, direct reads: `HeroCinematicController.tsx`, `product/motion.tsx`, `product/visuals/{index,lazy,parts,PlacementMatrix,SolutionsIndustryCards}.tsx`, `sections/mockups/{index,PlacementMockup}.tsx`, `sections/FeatureAccordion.tsx`, `lighthouserc.json`, `scripts/check-hero-assets.sh`, `.github/workflows/perf.yml`, `tests/responsive/{hero-gsap-free-mobile,reduced-motion}.spec.ts`, `tests/hero/source-ladder.spec.ts`, `tests/helpers/routes.ts`, `next.config.ts`, `package.json`, `DESIGN.md §4.7`, content files (`placement/homepage/reporting/solutions/optimization/issues.ts`), `HomepageHero.tsx`
- `.planning/research/{STACK,ARCHITECTURE,PITFALLS}.md` (project-level M6 research, built on)
- `docs/superpowers/specs/2026-06-04-premium-visual-motion-system-design.md`
- `.planning/{ROADMAP,REQUIREMENTS,STATE}.md`, `.planning/phases/10-foundation/10-SKILLS-BRIEFING.md`
- `CLAUDE.md` (§2,3,5,6,7,11,12,15)

### Secondary (MEDIUM, verified against authoritative source)
- INP not lab-measurable; `total-blocking-time` is the lab proxy — searchenginejournal + web.dev/articles/tbt (WebSearch-verified)
- Next.js 16 has no built-in build-failing JS budget; First-Load-JS printed in build output; community pattern is manifest-parse / `size-limit` — WebSearch (vercel/next.js issues #85712, next-js-budget-enforcer)

## Metadata

**Confidence breakdown:**
- Payload schemas (Console): HIGH — validated field-by-field against both real Placement implementations
- Payload schemas (DataStory): HIGH — 1:1 lift of existing `SolutionsIndustryCards` data
- Payload schemas (Schematic): MEDIUM — inferred from spec, no existing implementation (A2; harden in Phase 11)
- Motion vocabulary + engine-per-job: HIGH — grounded in shipped primitives + briefing rule
- Barrel migration: HIGH — 17 consumers verified by grep; shim is zero-edit
- CI guardrails: HIGH — each modeled on a shipped M5 pattern; INP→TBT correction verified
- Dead-asset cleanup: HIGH — 6 fallbacks + 1 hero use verified by grep

**Research date:** 2026-06-04
**Valid until:** 2026-07-04 (stable — internal codebase + locked stack; re-verify only if Framer/GSAP/Next major-bump)

## RESEARCH COMPLETE
