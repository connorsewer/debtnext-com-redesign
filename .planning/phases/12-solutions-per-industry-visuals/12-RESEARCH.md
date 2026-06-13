# Phase 12: Solutions per-industry visuals - Research

**Researched:** 2026-06-12
**Domain:** Per-industry archetype visuals (Console / Schematic / DataStory) on the 6 solutions sub-pages + hub; migration off the duplicate `SolutionsIndustryCards` widget
**Confidence:** HIGH (all claims verified against the live codebase this session unless tagged otherwise)

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

#### Duplicate-widget replacement (SOLVIS-01)
- **D-01:** Delete `src/components/product/visuals/SolutionsIndustryCards.tsx` and its `LazySolutionsIndustryCards` wrapper entirely. AUDIT correction P12-01 applies: this is a live component on all 7 pages (6 industry `ProductVisualBand`s + the `/solutions` hub's BenefitSplit `visual` prop), so this is a migration, not a dead-code deletion — every consumer must be repointed in the same plan that deletes it.
- **D-02:** Each industry page's `ProductVisualBand` slot renders that industry's Console hero (satisfies SOLVIS-02 in the same move as SOLVIS-01).
- **D-03:** The `/solutions` hub gets ONE cross-industry overview visual (DataStory cards-branch fed a cross-industry payload), visually distinct from all 6 industry pages. The hub is not required to carry the full triad.

#### Per-industry triad placement (SOLVIS-02/03/04)
- **D-04:** Console hero lives in the existing `ProductVisualBand` slot under the PageHero on each industry page. Static archetype rendering; Explorable shells are NOT required (Claude's discretion to add one only where it costs nothing).
- **D-05:** Schematic ("how dPlat routes <industry> accounts") attaches to the routing-themed FeatureAccordion item where one exists; where no accordion item is routing-themed, it gets its own band. Planner maps this per page in 12-ARCHETYPE-MAP.md.
- **D-06:** Data-story proof visual pairs with each page's proof content (accordion outcomes item or adjacent to the proof ProseSection). Same per-page mapping artifact decides placement.

#### Accordion visuals (SOLVIS-05)
- **D-07:** 18 accordion placeholders (3 per industry, identified via `visualLabel` in `src/content/solutions-*.ts`) all get real archetype visuals via the proven `FeatureAccordion.visuals` mechanism from Phase 11.
- **D-08:** Produce `12-ARCHETYPE-MAP.md` (item → archetype + payload) BEFORE page work begins, mirroring Phase 11's approved 11-ARCHETYPE-MAP / D-03 gate pattern. Distinctness check is part of the map: no two industries may receive an identical visual composition.

#### Payload realism and governance
- **D-09:** Per-industry payloads use real-shaped, anonymized, industry-realistic data: account types and dynamics that differ per vertical (utility arrears/deposit cycles; financial-services charge-off/card portfolios; telecom device + service receivables; fintech BNPL/personal loans; insurance premium/subrogation; healthcare self-pay/balance-after-insurance). Andrew Budish's complete sign-off (2026-06-12, recorded in AUDIT FIX-03 and project memory) clears real-shaped anonymized figures and vendor/TSI framing; `[CLAIMS REVIEW]`/`[COI REVIEW]` tags are RETAINED as audit-trail markers, non-blocking.
- **D-10:** Every number lives in typed payloads under `src/content/visuals/` (one module per industry, e.g. `solutions-utilities.ts`, plus a hub payload), validated against the existing schemas in `src/content/visuals/types.ts`. Zero baked constants in components. No named clients, no invented testimonials.

#### Industry accent treatment (AUDIT P12-02)
- **D-11:** No new colors. Industries map to the EXISTING DESIGN.md chart-palette tokens (chart-1..chart-5 family + primary) for any per-industry accent; the invented hexes (#4AA8C9, #8472F0, #3D9DE0) die with the deleted component. This avoids a CLAUDE.md §16 new-color stop.
- **D-12:** Status colors are always label-paired (text or icon beside color) per the Pitfall 8 contract; data stories must survive grayscale and screen readers (ariaSummary on every archetype instance, role="img" pattern from Phase 11).

#### Perf and regression posture
- **D-13:** LHCI keeps `/solutions/utilities` as the representative solutions route (already in lighthouserc.json). Do NOT add the other 5 industry routes to LHCI — the 6-URL collection already runs ~21 minutes; representative-route sampling is the documented tradeoff. Content-route TBT bar is 300ms (AUDIT BL-07); CLS < 0.1; LCP < 2.5s.
- **D-14:** A `solutions-visuals.spec.ts` Playwright spec mirrors `platform-visuals.spec.ts` (archetype presence per accordion item, default-visible values, reduced-motion data parity, no stuck opacity) across all 6 industry pages + the hub. axe + touch-target specs already cover all 23 routes (AUDIT FIX-02). Lazy skeletons must match resolved boxes (Pitfall 4); accordion visuals keep the shared 20rem `VisualSkeleton`.

### Claude's Discretion
- Exact archetype assignment per accordion item (within the D-08 map artifact).
- Whether any industry page gets a zero-cost Explorable flourish (not required).
- Payload module naming/structure within `src/content/visuals/` conventions.
- Wave structure for the 6 industry pages (e.g., utilities first as the proven pattern, then parallel).

### Deferred Ideas (OUT OF SCOPE)
- Explorable flagships on solutions pages — platform-page contract; revisit only if a page begs for it (zero-cost discretion per D-04).
- Adding all 6 industry routes to LHCI — revisit if representative sampling misses a regression; would need CI wall-clock budget work first.
- RSC re-architecture for hydration-bound TBT — already backlogged (AUDIT BL-07).
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| SOLVIS-01 | Duplicate `SolutionsIndustryCards` widget gone; no two solutions pages show an identical visual | §"Migration map" lists all 7 consumers + the 4 comment-only references; §"ID-collision finding" shows distinctness must also be asserted against the homepage registry, not just the deleted widget |
| SOLVIS-02 | Console hero per industry with real-shaped account types/numbers | `ConsoleData` schema fits as-is (§"Schema fit"); `ProductVisualBand` slot verified on all 6 pages; per-industry data dimensions in §"Per-industry payload raw material" |
| SOLVIS-03 | Schematic "how dPlat routes <industry> accounts" per industry | `SchematicData` fits as-is; every industry page has a routing-themed `placement` accordion item (§"Accordion inventory"), so D-05's attach-to-accordion branch applies on all 6 pages — no extra band needed |
| SOLVIS-04 | Data-story proof visual per industry | `DataStoryData` (area/spark/bars/cards + annotation) fits as-is; proof ProseSection has no visual slot, so the DataStory rides an accordion item or a second `ProductVisualBand` (§"Slot math") |
| SOLVIS-05 | All 18 solutions accordion placeholders replaced with archetype visuals | `FeatureAccordion.visuals` prop verified: keyed by item id, takes precedence over the homepage registry (§"Code examples"); full 18-item inventory with ids + visualLabels in §"Accordion inventory" |
</phase_requirements>

## Project Constraints (from CLAUDE.md)

- **§3 brand:** primary `#5266EB`, dark canvas `#171721`, no new colors/sizes/spacing without a §16 stop. D-11 handles the accent question by remapping to chart tokens.
- **§4 CTA:** one filled "Request a demo" per band; visuals never introduce competing CTAs.
- **§5 voice:** no em dashes, no "not X, it's Y", banned-phrase list, sentence case, digits — applies to every payload caption, `ariaSummary`, eyebrow, and annotation string.
- **§6 COI:** vendor/TSI framing stays agency-network-agnostic ("routes across the originator's existing vendors"); `[COI REVIEW]` tag on any vendor-network framing (audit-trail, non-blocking per Andrew's 2026-06-12 sign-off).
- **§7 claims:** all figures real-shaped anonymized generic; `[CLAIMS REVIEW]` tag on every payload module (non-blocking, retained for audit).
- **§11 a11y:** WCAG 2.2 AA, 44px touch targets, `prefers-reduced-motion`, axe-core in CI (already covers all 23 routes per AUDIT FIX-02).
- **§12 perf:** LCP < 2.5s, CLS < 0.1, INP < 200ms; visuals stay lazy `ssr:false`, no eager motion code.
- **§15:** no invented client names/testimonials; generic ranges only.
- **§16 stop-list:** no new colors, no new section components, no new nav/CTA. The triad maps onto existing slots (verified — see Slot math), so no stop is triggered.
- **Memory rules:** docs (HANDOFF.md etc.) update in the SAME commit as code; `next dev`/`next start` hang in this sandbox — use `next build`, `tsc --noEmit`, eslint locally and Playwright against CI/preview.

## Summary

This phase is mechanical replication of the proven Phase 11 pattern onto 7 pages, with one migration twist and one trap. The twist (AUDIT P12-01): `SolutionsIndustryCards` is live in 7 places — 6 industry `page.tsx` files render `<LazySolutionsIndustryCards />` inside `ProductVisualBand`, and `src/app/solutions/page.tsx` passes it as BenefitSplit's `visual` prop — so deletion and repointing must land together. The trap (new finding, verified): the 18 solutions accordion items reuse the ids `placement` / `optimization` / `issues` / `reporting`, which are ALSO the homepage `ACCORDION_VISUAL_IDS`. `FeatureAccordion` falls through to the homepage `VISUALS` registry for those ids, so today the solutions accordions silently render the homepage bespoke visuals (`PlacementMatrix`, `OptimizationEngine`, `IssuesWorklist`, `ReportingDashboard`) — identical across all 6 industries — NOT the text-on-dark placeholder. The `visuals` prop takes precedence over the registry (verified in `FeatureAccordion.tsx:159-162`), so wiring per-item visuals fixes it without touching the registry, but the new Playwright spec must assert industry-specific content, because a platform-style "role=img exists" check alone would not prove distinctness once everything is an archetype.

All three Phase 10 schemas fit the per-industry needs as-is: zero schema extensions required. `ConsoleData` (header KPI + rows with bars + trailing values + pills) expresses every industry hero; `SchematicData` (source/engine/vendor/sink nodes + labeled edges) expresses every "how dPlat routes X accounts" flow; `DataStoryData` covers the proofs, and its `cards` branch was explicitly built to subsume `SolutionsIndustryCards` (comment in `DataStory.tsx:9-11`) — its card shape (`name/accent/tag/value/bar/sub`) maps 1:1 onto the widget's `INDUSTRIES` shape, so the hub payload is a direct port extended from 4 to 6 industries. The accent question resolves to 4 usable chart tokens (`chart-1/3/4/5`; `chart-2` at `#323649` is near-canvas and unusable as an accent), meaning accents repeat across 6 industries — acceptable because D-08 distinctness is data/composition, not hue, and D-12 requires label-pairing anyway.

**Primary recommendation:** Wave-0 the 12-ARCHETYPE-MAP (18 items + 6 heroes + 6 schematic/proof placements + hub payload) and the `solutions-visuals.spec.ts` skeleton; then utilities end-to-end as the proven pattern (mirrors 11-01); then the remaining 5 industries in parallel waves; hub migration + widget deletion ride the last wave so no consumer is ever orphaned.

## Standard Stack

No new libraries. The phase uses only what's installed (CLAUDE.md §2 forbids additions without flagging).

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| next | 16.2.6 | App Router pages, `next/dynamic` lazy visuals | `[VERIFIED: package.json]` |
| framer-motion | ^12.39.0 | Reveal/LiveValue via the motion barrel only | `[VERIFIED: package.json]` — never imported directly in page work |
| @playwright/test | ^1.60.0 | `solutions-visuals.spec.ts` (D-14) | `[VERIFIED: package.json]` |
| typescript | ^5 | `satisfies ConsoleData/...` payload validation | `[VERIFIED: package.json]` |

### Repo assets to reuse (the real "stack")
| Asset | Path | Role in this phase |
|---|---|---|
| Archetype wrappers | `src/components/product/visuals/archetypes.tsx` | `ConsoleVisual` / `DataStoryVisual` / `SchematicVisual` — lazy, ssr:false, 20rem `VisualSkeleton` |
| Payload schemas | `src/content/visuals/types.ts` | `ConsoleData` / `DataStoryData` / `SchematicData` |
| Payload barrel | `src/content/visuals/index.ts` | New per-industry modules export here |
| Accordion visuals mechanism | `src/components/sections/FeatureAccordion.tsx` (`visuals` prop) | SOLVIS-05 wiring, proven on 19 platform items |
| Hero band slot | `src/components/sections/ProductVisualBand.tsx` | SOLVIS-02 Console hero slot (already on all 6 pages) |
| Spec template | `tests/responsive/platform-visuals.spec.ts` | Shape for `solutions-visuals.spec.ts`, incl. `iterations === Infinity` idle-guard |

**Installation:** none.

## Architecture Patterns

### Migration map (SOLVIS-01, D-01)

`[VERIFIED: grep this session]` References to `SolutionsIndustryCards`:

| File | Kind | Action |
|---|---|---|
| `src/app/solutions/{utilities,financial-services,telecom,fintech,insurance,healthcare}/page.tsx` | Live consumer — `<LazySolutionsIndustryCards />` inside `<ProductVisualBand>` | Repoint to `<ConsoleVisual data={<industry>Console} />` (D-02) |
| `src/app/solutions/page.tsx` | Live consumer — BenefitSplit `visual={<LazySolutionsIndustryCards />}` | Repoint to `<DataStoryVisual data={solutionsHubStory} />` (D-03, cards branch) |
| `src/components/product/visuals/SolutionsIndustryCards.tsx` | The component (contains the 3 invented hexes, P12-02) | Delete |
| `src/components/product/visuals/lazy.tsx` | `LazySolutionsIndustryCards` export | Delete the export block |
| `src/components/product/visuals/Console.tsx`, `DataStory.tsx`, `src/content/visuals/types.ts` | Comment-only mentions | Optional comment cleanup (e.g., DataStory.tsx:9 "subsumes SolutionsIndustryCards" can stay as history) |
| `tests/responsive/reduced-motion.spec.ts:90` | Comment-only mention (ssr:false visual example) | Update the comment; no behavior change `[VERIFIED: grep — comment only]` |

The homepage `VISUALS` registry (`src/components/product/visuals/index.tsx`) never referenced `SolutionsIndustryCards` — its 5 entries (placement/optimization/issues/reporting/compliance) are untouched by this phase. P13-01 owns their eventual migration.

### ID-collision finding (CRITICAL for the planner and the spec)

`[VERIFIED: code read]` `FeatureAccordion.tsx` resolution order (lines 159-172):

1. `visuals?.[item.id]` — page-supplied visual (takes precedence)
2. `isAccordionVisualId(item.id)` — homepage registry fallback (`placement`, `optimization`, `issues`, `reporting`, `compliance`)
3. Text-on-dark placeholder with `visualLabel`

Every solutions accordion item id is one of `placement` / `optimization` / `issues` / `reporting` — all registry ids. **So the "18 placeholders" are not text placeholders today: they render the homepage bespoke visuals, identical across industries.** Consequences:

- Wiring the `visuals` prop per page fixes SOLVIS-05 with no registry change (precedence verified).
- The new spec cannot rely on "no text placeholder" or "role=img exists" alone for distinctness. (`PlacementMatrix.tsx` has no `role="img"`/`aria-label` `[VERIFIED: grep]`, so an archetype-presence assertion does catch the *current* state — but it cannot distinguish two industries that both render archetypes.) The spec must assert **industry-specific payload strings** per route (e.g., a utilities-only Console title and a healthcare-only one).
- Do NOT rename the solutions item ids to dodge the collision: ids feed `#feat-{id}-button` anchors, analytics `accordion_toggle` events, and the content modules' typed exports. The `visuals` prop precedence makes renaming unnecessary.

### Slot math (D-04/05/06 — how the triad lands with zero new sections)

Page anatomy on all 6 industry pages `[VERIFIED: utilities/page.tsx read; CONTEXT confirms identical anatomy]`: PageHero → ProductVisualBand → CardGrid(challenges) → FeatureAccordion(3 items) → ProseSection(proof) → BulletList(regulatory) → FinalCTA.

- **Console hero (SOLVIS-02):** the existing `ProductVisualBand` slot. 1 per page.
- **Schematic (SOLVIS-03):** every industry has a routing-themed `placement` accordion item (see inventory), so D-05's primary branch applies on all 6 pages — Schematic attaches to the `placement` item. No extra band required anywhere.
- **DataStory proof (SOLVIS-04):** `ProseSection` has no visual/media slot `[VERIFIED: ProseSectionProps grep — text-only]`. Two compliant options: (a) ride the most proof-adjacent accordion item (the `reporting`/reconcile item on 4 pages; `issues`/`optimization` on the others), or (b) add a second `ProductVisualBand` instance adjacent to the proof ProseSection (an existing component, so no §16 stop). Option (a) is the economical default: 3 accordion items = Schematic + DataStory + 1 Console/other, satisfying SOLVIS-03/04/05 inside existing slots; the 12-ARCHETYPE-MAP decides per page.
- **Hub (D-03):** BenefitSplit `visual` prop ← `DataStoryVisual` with a 6-card `cards` payload. The cards branch renders a `grid grid-cols-2` (3 rows of 2 at 6 cards) inside `ProductCanvas` `[VERIFIED: DataStory.tsx read]` — same physical footprint family as the old widget, so the BenefitSplit media column needs no layout change.

Per-page totals: 1 Console hero (band) + 3 accordion archetype visuals = 4 visuals/page × 6 pages + 1 hub DataStory = **25 archetype instances, ~25 payload exports**.

### Payload module structure (D-10)

One module per industry under `src/content/visuals/`, following `placement-accordion.ts` conventions: `solutions-utilities.ts`, `solutions-financial-services.ts`, `solutions-telecom.ts`, `solutions-fintech.ts`, `solutions-insurance.ts`, `solutions-healthcare.ts`, plus `solutions-hub.ts`. Each exports its Console + Schematic + DataStory (+ any extra Console) payloads with `satisfies <Schema>` (never type annotations — excess-property checking is the compile-time proof, per `placement.ts` precedent), a `[CLAIMS REVIEW]`/`[COI REVIEW]` header block, and re-exports through `src/content/visuals/index.ts`. Note: `src/content/solutions-utilities.ts` (page copy) and `src/content/visuals/solutions-utilities.ts` (payloads) will share a basename in different directories — same pattern as `placement.ts` vs `visuals/placement.ts`, already proven non-confusing `[VERIFIED: both exist]`.

### Schema fit (research focus 1) — zero extensions needed

| Need | Schema | Fit |
|---|---|---|
| Industry Console hero: account types as rows, balance/volume KPI, live status, network pills | `ConsoleData` — `header.kpi` (caption/value/sub), `rows[].primary/secondary/bar/trailing` (with `prefix: "$"` for currency), `pills`, `callout` | As-is. The placement hero precedent (`placementConsole`) maps 1:1 |
| "How dPlat routes <industry> accounts" | `SchematicData` — `kind: "source"` (billing system / core banking / EHR / lending stack), `"engine"` (decision engine), `"vendor"` (pools), `"sink"`; labeled edges, `flow: true` | As-is. Phase 11 shipped 3 schematics on this schema (vendor-pools fan-out, recall cascade, workflow state machine) |
| Industry proof DataStory | `DataStoryData` — `area`/`spark`/`bars` + `annotation` | As-is |
| Hub cross-industry overview | `DataStoryData` `chart.kind: "cards"` — `name/accent/tag/value/decimals/suffix/bar/sub` | Exact 1:1 superset of the widget's `INDUSTRIES` shape (`name/accent/tag/liq/bar/second`); extend 4 → 6 cards (widget lacks insurance + healthcare) `[VERIFIED: SolutionsIndustryCards.tsx read]` |

Phase 11's result was 18/19 items fitting as-is with one additive optional extension (`ConsoleRow.align`); the solutions content is structurally simpler (routing, configuration, reconciliation — all proven shapes), so HIGH confidence no extension is needed. If authoring surfaces a gap, the precedent is an additive optional field with a D-08-style note, keeping all existing `satisfies` green.

### Industry accent mapping (D-11, P12-02)

`[VERIFIED: DESIGN.md §4.1]` Available tokens: `--chart-1 #5266EB` (indigo = primary), `--chart-2 #323649` (near-canvas muted — **unusable as an accent** on the `#171721` canvas; it's the baseline/grid tone), `--chart-3 #10b981` (green), `--chart-4 #f59e0b` (amber), `--chart-5 #06b6d4` (cyan). That is **4 usable accent hues for 6 industries**, so accents must repeat. This is compliant: D-08 distinctness is composition/data, not hue, and D-12 makes color non-load-bearing (label-paired, grayscale-survivable). Suggested mapping (planner's discretion, nearest-hue to the dying hexes): utilities → `chart-5` (was #4AA8C9), financial services → `chart-1` (was #5266EB, unchanged), telecom → `chart-1` or `chart-3` (was #8472F0 violet — no token equivalent), fintech → `chart-5` (was #3D9DE0), insurance → `chart-3`, healthcare → `chart-4`. Any two industries sharing an accent must differ visibly in composition (the map's distinctness check enforces this). Hub cards pass accents as strings: `accent: "var(--chart-5)"` works inside the cards branch's `color-mix()`/gradient inline styles — the repo already mixes `var(--product-canvas)` inside `color-mix` in the same expression `[VERIFIED: DataStory.tsx:63]`.

### Anti-patterns to avoid
- **Hand-rolling Framer/GSAP in payload or page work** — everything motion comes from the barrel via the archetypes; pages import only `ConsoleVisual`/`DataStoryVisual`/`SchematicVisual` + payloads.
- **Type-annotating payloads (`: ConsoleData`)** instead of `satisfies ConsoleData` — loses excess-property checking, the compile-time distinctness/correctness proof.
- **Renaming accordion item ids** to avoid the registry collision — breaks anchors/analytics for zero gain; the `visuals` prop precedence already wins.
- **Adding solutions routes to LHCI** — explicitly locked out (D-13).
- **Numbers in components** — every figure lives in `src/content/visuals/` (D-10); the deleted widget's inline `INDUSTRIES` array is the cautionary example.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Per-industry card grid for the hub | A new cards component | `DataStoryData` `chart.kind: "cards"` | Built specifically to subsume the widget (`DataStory.tsx:9`); reduced-motion fail-open + role="img" already solved |
| Industry hero console | Bespoke per-industry components | `ConsoleVisual` + per-industry `ConsoleData` | The whole point of FND-02/03; bespoke components are what P13-01 is cleaning up |
| Lazy-loading wrappers | New `next/dynamic` call sites per page | Existing `ConsoleVisual`/`DataStoryVisual`/`SchematicVisual` | Already lazy ssr:false with CLS-matched skeletons; Turbopack inline-literal constraint already handled |
| Accordion visual switching | Custom visual-pairing logic | `FeatureAccordion.visuals` prop | Proven on 19 platform items; handles precedence, cross-fade, reduced-motion |
| Reveal/count-up motion | Framer in page code | Motion barrel via archetypes | FND-01 contract; reveal-fail-open spec guards it |

**Key insight:** Phase 10/11 already paid every infrastructure cost. This phase should add ~7 payload modules, edit 7 page files, delete 1 component + 1 lazy export, and add 1 spec — nothing else.

## Runtime State Inventory

(Migration phase — component deletion + repoint. All categories checked explicitly.)

| Category | Items Found | Action Required |
|----------|-------------|------------------|
| Stored data | None — static marketing site, no datastore | None |
| Live service config | None for this component. LHCI config (`lighthouserc.json`) already lists `/solutions/utilities` and stays as-is per D-13 `[VERIFIED: grep]` | None |
| OS-registered state | None | None |
| Secrets/env vars | None touched (GA4/GTM/Zoho unrelated) | None |
| Build artifacts | `.next/` cache may hold stale chunks after deletion | `next build` from clean in CI (default) — nothing manual |
| Test references | `tests/responsive/reduced-motion.spec.ts:90` comment names the widget | Comment edit in the deletion commit |

## Common Pitfalls

### Pitfall 1: ProductVisualBand has no height floor (CLS — Pitfall 4 instance)
**What goes wrong:** `ProductVisualBand` renders bare children with no min-height `[VERIFIED: component read]`. `ConsoleVisual`'s lazy skeleton is `min-h-[20rem]`; if an industry Console hero resolves taller (likely — the placement console with callout + 4 rows + pills is tall), the swap shifts layout. The old widget's `min-h-[22rem]` skeleton masked this.
**How to avoid:** Author the 6 hero Console payloads to a consistent row/pill budget, then verify resolved height on the preview and, if needed, follow the `FLAGSHIP_SKELETON_MIN_H` precedent in `lazy.tsx` (a taller dedicated skeleton, or a min-h wrapper on the band's child). Verify against the `/solutions/utilities` LHCI CLS gate (< 0.1).
**Warning signs:** LHCI CLS regression on `/solutions/utilities`; visible jump under throttled load.

### Pitfall 2: Distinctness theater (SOLVIS-01's actual bar)
**What goes wrong:** All pages render archetypes and the spec passes "role=img exists", but two industries still read identically (same composition, same shaped numbers, different label). The current state is the proof this can hide: 6 pages "have visuals" today and all are identical.
**How to avoid:** D-08's map carries an explicit distinctness table (Phase 11 precedent: per-item one-line data-shape intents, no two alike). The spec asserts per-route industry-specific strings (account types: "arrears", "charge-off", "BNPL", "subrogation", "self-pay"...). The 12-ARCHETYPE-MAP distinctness check covers compositions; the spec covers shipped content.

### Pitfall 3: Color-only status (Pitfall 8 instance)
**What goes wrong:** Industry accents carry meaning (tags, bars) without text pairing; greyscale/screen-reader users lose the story. With only 4 usable accent hues for 6 industries, hue cannot be the differentiator anyway.
**How to avoid:** Every accent appears beside a text tag (the cards branch already pairs `accent` with `tag` text); every archetype instance has a complete `ariaSummary` that tells the industry's story in words (D-12). FIX-01 (IssuesWorklist status label) is the recent cautionary example.

### Pitfall 4: Spec false-pass from the registry fallback
**What goes wrong:** A `solutions-visuals.spec.ts` copied too literally from `platform-visuals.spec.ts` (which asserts archetype presence + no "Visual" placeholder) would pass even if a page's `visuals` wiring is dropped, because the registry fallback renders *something*... actually no — the bespoke registry visuals lack `role="img"` `[VERIFIED: PlacementMatrix grep]`, so the archetype assertion fails correctly. The real false-pass risk is **after** wiring: a copy-paste payload (utilities payload on the telecom page) passes archetype presence.
**How to avoid:** Per-route config includes industry-unique value strings (mirror `flagshipValues` but per-industry: e.g. utilities Console title, healthcare schematic ariaSummary fragment) asserted on load AND under reduced motion (D-05 data-parity shape).

### Pitfall 5: TBT drift on content routes (BL-07)
**What goes wrong:** `/solutions/utilities` hovers in the 230-280ms TBT band on shared runners; adding 4 lazy visuals nudges hydration cost. The bar is 300ms; an eager import (a static archetype import at page top instead of the lazy wrappers) would blow well past it.
**How to avoid:** Import only `archetypes.tsx` wrappers (lazy by construction) and server-safe payload modules (zero client cost — `index.ts` has no "use client"). Never import `Console.tsx`/`DataStory.tsx`/`Schematic.tsx` directly from a page. TBT is hydration-bound (project memory) — do not chase JS-size micro-cuts if a run lands at ~290ms; that's runner noise.

### Pitfall 6: Voice/COI violations in payload copy
**What goes wrong:** ~25 payloads × several strings each (titles, subs, pills, annotations, ariaSummaries) is the phase's largest new-copy surface. Em dashes, "seamless", company-focused framing, or vendor-independence claims slip in.
**How to avoid:** §5 self-check per payload module; `·` separators (the established console convention, e.g. "3 vendors · 30-day") instead of em dashes; `[CLAIMS REVIEW]`/`[COI REVIEW]` headers on every module per the `placement.ts` template.

## Code Examples

All from the repo (the patterns to replicate verbatim).

### Accordion wiring (Phase 11 pattern → apply per industry page)
```tsx
// Source: src/app/platform/placement/page.tsx (verified)
<FeatureAccordion
  section="utilities_how_it_runs"
  ...
  items={utilitiesHowItRuns.items}
  visuals={{
    placement: <SchematicVisual data={utilitiesRouting} />,      // SOLVIS-03
    optimization: <ConsoleVisual data={utilitiesConfig} />,
    reporting: <DataStoryVisual data={utilitiesReconciliation} />, // SOLVIS-04 candidate
  }}
/>
```
Keys are the item ids from `src/content/solutions-utilities.ts`; the `visuals` prop wins over the homepage registry for the colliding ids (FeatureAccordion.tsx:159).

### Hero band repoint (D-02)
```tsx
// Before (all 6 industry pages today):
<ProductVisualBand>
  <LazySolutionsIndustryCards />
</ProductVisualBand>

// After:
<ProductVisualBand>
  <ConsoleVisual data={utilitiesConsole} />
</ProductVisualBand>
```

### Hub repoint (D-03)
```tsx
// src/app/solutions/page.tsx — BenefitSplit visual prop
<BenefitSplit ... visual={<DataStoryVisual data={solutionsHubStory} />} surface="light" />
```
```ts
// src/content/visuals/solutions-hub.ts — direct port of the widget's INDUSTRIES, 4 → 6 cards
// [CLAIMS REVIEW] real-shaped anonymized figures; Andrew pre-cleared 2026-06-12, tag retained for audit.
export const solutionsHubStory = {
  headline: "One platform across every portfolio you run.",
  chart: {
    kind: "cards",
    cards: [
      { name: "Utilities", accent: "var(--chart-5)", tag: "Regulated",
        value: 16.2, decimals: 1, suffix: "%", bar: 62,
        sub: "84,200 accounts in treatment" },
      // ...financial services, telecom, fintech, insurance, healthcare (6 total)
    ],
  },
  ariaSummary: "Cross-industry recovery overview. ...",
} satisfies DataStoryData;
```

### Payload authoring contract
```ts
// Source: src/content/visuals/placement.ts (verified) — the template:
// [CLAIMS REVIEW] + [COI REVIEW] header comments, `satisfies` (not annotation),
// ariaSummary as full governed prose, "·" separators, no em dashes.
export const utilitiesConsole = { ... } satisfies ConsoleData;
```

## Accordion inventory (raw material for 12-ARCHETYPE-MAP)

`[VERIFIED: grep of all 6 src/content/solutions-*.ts this session]` — 18 items, 3 per industry. Item ids repeat across pages (and collide with the homepage registry — see ID-collision finding).

| Page | Item id | Item title | Current visualLabel |
|---|---|---|---|
| utilities | placement | Route by utility-specific attributes | Placement matrix routing utility accounts across vendor pools |
| utilities | optimization | Configure residential and commercial separately | Configuration model for separate residential and commercial workflows |
| utilities | reporting | Reconcile daily across the network | Reporting dashboard reconciling balances across the vendor network |
| financial-services | placement | One standardized connection to every vendor | Placement matrix connecting core systems to the vendor network |
| financial-services | issues | Bankruptcy, deceased, and disputes as exceptions | Issue worklist with bankruptcy and dispute exceptions |
| financial-services | optimization | Settlement floors and payment plans, enforced | Optimization engine enforcing settlement thresholds and payment plans |
| telecom | placement | High-volume daily placement, routed automatically | Placement matrix routing high daily volume across vendor pools |
| telecom | optimization | Short-cycle recall and reallocation | Decision engine running short-cycle recall logic |
| telecom | issues | Prepaid and postpaid, worked separately | Worklist separating prepaid and postpaid treatment paths |
| fintech | placement | API-first integration with your stack | Placement matrix fed by API integration with your stack |
| fintech | optimization | Configure in-app, with no release cycle | Configuration model applying changes inside the platform |
| fintech | reporting | One connection across the vendor network | Reporting view consolidating updates across the vendor network |
| insurance | placement | Route by recovery type and obligor | Placement matrix routing insurance recovery accounts across vendor pools |
| insurance | optimization | Configure business and consumer books separately | Configuration model for separate business and consumer recovery workflows |
| insurance | reporting | Reconcile daily across the network | Reporting dashboard reconciling balances across the vendor network |
| healthcare | placement | Route by balance stage and account attributes | Placement matrix routing healthcare accounts across vendor pools |
| healthcare | optimization | Configure EBO and bad-debt work separately | Configuration model for separate EBO and bad-debt workflows |
| healthcare | reporting | Reconcile daily across the network | Reporting dashboard reconciling balances across the vendor network |

Distinctness pressure points for the map: utilities/insurance/healthcare share near-identical `reporting` ("Reconcile daily across the network") and parallel "configure X and Y separately" `optimization` items — the templated tell this phase exists to kill. The payloads (not the archetype choice alone) must differentiate them: utilities reconciles arrears/deposit balances, insurance reconciles premium/subrogation recoveries, healthcare reconciles self-pay/balance-after-insurance — different row nouns, different chart kinds where possible, different numbers.

Natural archetype gravity (planner's discretion per D-08): every `placement` item is routing-themed → Schematic candidate (satisfies SOLVIS-03 in-accordion on all 6 pages); `optimization`/configuration items → Console; `reporting`/reconcile and `issues`/worklist items → DataStory or Console. With 6 Schematics on the placement items, the map must vary node/edge composition per industry (different sources: billing system / core banking / OSS-BSS / lending API / policy admin / EHR-clearinghouse; different pool structures) to hold D-08.

## Per-industry payload raw material (D-09)

Real-shaped dimensions that differ per vertical — the grounding for payload authoring. Account-type vocabulary `[VERIFIED: present in the repo's own approved page copy, src/content/solutions-*.ts]`; the illustrative dynamics are `[ASSUMED]` industry knowledge, pre-cleared in shape by Andrew's 2026-06-12 sign-off (real-shaped anonymized figures, non-blocking; tags retained).

| Industry | Account types (Console rows) | Source node (Schematic) | Recovery dynamics for the DataStory |
|---|---|---|---|
| Utilities | Final-bill, active-service arrears, deposit offsets, write-off disputes; residential vs commercial | Billing/CIS system | Seasonal arrears spikes, deposit reconciliation, state-commission variance; smaller balances, high counts |
| Financial services | Charge-off card, consumer loan, line of credit; Reg F contact constraints | Core banking / system of record | Post-charge-off liquidation curves, settlement-floor enforcement, examiner-ready audit trail |
| Telecom | Device receivables vs service balances; prepaid vs postpaid | OSS/BSS billing | High daily volume, short treatment windows, short-cycle recall/reallocation |
| Fintech | BNPL installments, personal loans | Lending stack via API | Steep early-delinquency curve, fast cycle times, in-app configuration changes |
| Insurance | Earned-premium balances, subrogation recoveries, deductibles; business vs consumer obligors | Policy admin system | Recovery types behave on their own terms; jurisdiction-by-jurisdiction variance |
| Healthcare | Self-pay, balance-after-insurance; EBO vs bad-debt tracks | EHR / patient accounting | Billing-cycle-driven placement timing, EBO→bad-debt track split, patient-data handling constraints |

Figure-shaping guardrails: generic and qualified (no client-specific claims, CLAUDE.md §7/§15); plausible relative magnitudes (utilities balances < financial-services balances; telecom counts > insurance counts); liquidation/net-back style metrics follow the existing console vocabulary ("Liquidation · 30D", "net-back per account") so the system reads coherent.

## State of the Art

| Old Approach (current repo state) | Current Approach (this phase) | Changed | Impact |
|---|---|---|---|
| One prop-less widget on 7 pages + homepage-registry fallback on 18 accordion items | Archetype + per-industry typed payload everywhere | Phase 10 built it; Phase 11 proved it | The no-prop copy becomes impossible to construct (DataStory.tsx:11) |
| Inline `INDUSTRIES` constants with invented hexes | Payloads in `src/content/visuals/` with chart tokens | D-10/D-11 | Single auditable home; no §16 color stop |
| Text `visualLabel` as the rendered placeholder contract | `visualLabel` remains as the motion wrapper's `aria-label` (FeatureAccordion.tsx:152) | Phase 11 | Keep `visualLabel` fields accurate to the new visuals when wiring |

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | Industry recovery dynamics (seasonality, delinquency-curve shapes, relative balance magnitudes) used to shape payload figures are based on domain knowledge, not a source document | Per-industry payload raw material | Low — Andrew pre-cleared real-shaped anonymized figures; tags retained; source-materials dir is absent (AUDIT punch-list #9) so traceability lands in Phase 9 |
| A2 | Console hero in `ProductVisualBand` resolves taller than the 20rem skeleton | Pitfall 1 | If wrong (it fits 20rem), no action needed; if right and unhandled, CLS gate fails — verify on preview either way |
| A3 | 6-card `cards` grid (3×2) reads well in the hub BenefitSplit media column without layout changes | Slot math / Hub | Low — same component family and grid as the 4-card widget; visual review on preview confirms |

All other claims in this document are `[VERIFIED]` against the codebase this session or `[CITED]` from the named planning artifacts.

## Open Questions

1. **DataStory proof placement on pages where no accordion item is proof-themed (D-06)**
   - What we know: ProseSection has no visual slot; option (a) ride an accordion item, option (b) second ProductVisualBand adjacent to proof.
   - What's unclear: whether (a) leaves the proof section visually bare on some pages.
   - Recommendation: default to (a) per page in the 12-ARCHETYPE-MAP (economical, zero new bands); the map is the approval artifact where Connor sees the per-page call.

2. **Accent repetition across 6 industries (4 usable hues)**
   - What we know: chart-2 is unusable as an accent; D-11 forbids new colors; D-08 distinctness is composition-based.
   - Recommendation: assign in the map with the rule "shared-accent industries must differ in composition"; no escalation needed — this stays inside locked constraints.

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| node / npm | build, tsc, eslint | ✓ | repo-pinned | — |
| next build | local verification | ✓ (works in sandbox) | 16.2.6 | — |
| next dev / next start | local visual checks | ✗ HANGS in this sandbox (project memory) | — | `next build` + `tsc --noEmit` + eslint locally; Playwright + LHCI against CI/Vercel preview |
| Playwright | solutions-visuals.spec.ts | ✓ | ^1.60.0 | Runs via `PLAYWRIGHT_BASE_URL` against preview (platform-visuals precedent) |
| LHCI | D-13 perf gate | ✓ (CI, perf.yml) | — | — |

**Missing dependencies with no fallback:** none. The dev-server constraint is fully routed around by the Phase 11 workflow (build/typecheck locally, behavioral specs against preview).

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Playwright `@playwright/test` ^1.60.0 (+ `tsc --noEmit`, eslint, `next build`, LHCI in CI) |
| Config file | `playwright.config.*` at repo root (existing); `lighthouserc.json`; `.github/workflows/perf.yml` |
| Quick run command | `npx tsc --noEmit && npx eslint <changed files>` (local); `npx playwright test tests/responsive/solutions-visuals.spec.ts` (vs `PLAYWRIGHT_BASE_URL` preview) |
| Full suite command | `npx playwright test` (vs preview) + LHCI via CI |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| SOLVIS-01 | Widget deleted; no two pages identical | static + e2e | `grep -rn "SolutionsIndustryCards" src/ \| wc -l` → 0; spec asserts per-route industry-unique value strings (cross-route distinctness config) | ❌ Wave 0 (spec) |
| SOLVIS-02 | Console hero per industry, industry-shaped data | e2e | spec: per route, `ProductVisualBand` contains `role="img"` archetype whose aria-label/values contain industry-specific strings (e.g. "arrears", "charge-off") | ❌ Wave 0 |
| SOLVIS-03 | Schematic per industry | e2e | spec: per route, activating the mapped accordion item (or band) surfaces the Schematic's industry-specific ariaSummary fragment | ❌ Wave 0 |
| SOLVIS-04 | DataStory proof per industry | e2e | spec: same shape as SOLVIS-03 for the mapped DataStory item | ❌ Wave 0 |
| SOLVIS-05 | 18 accordion items all render archetypes | e2e | spec: `assertAccordionArchetypes`-style loop per route (click `#feat-{id}-button`, assert `role="img"` non-empty label) — catches the current registry-fallback state because the bespoke visuals lack `role="img"` | ❌ Wave 0 |
| (D-14) | Reduced-motion data parity + no stuck opacity | e2e | spec: port `assertReducedMotionDataParity` + `assertNoStuckOpacity` (keep the `iterations === Infinity` idle-guard) from `platform-visuals.spec.ts` | ❌ Wave 0 |
| (D-13) | TBT ≤ 300ms, CLS < 0.1, LCP < 2.5s on `/solutions/utilities` | CI perf | LHCI run in `perf.yml` (route already in `lighthouserc.json` — no config change) | ✅ exists |
| (a11y) | axe + touch targets on all solutions routes | CI e2e | existing `axe-routes.spec.ts` + `touch-targets.spec.ts` over `VISUAL_ROUTES` (23 routes, AUDIT FIX-02) | ✅ exists |
| (typing) | Payloads satisfy schemas | compile | `npx tsc --noEmit` (the `satisfies` proofs) | ✅ exists |

Manual-only residue: per-page visual review by Connor on the Vercel preview (CLAUDE.md §14) and the D-08 archetype-map approval gate — human gates by design, not automatable.

### Sampling Rate
- **Per task commit:** `npx tsc --noEmit && npx eslint <changed>` + `next build` locally (dev server unavailable in sandbox)
- **Per wave merge:** `npx playwright test tests/responsive/solutions-visuals.spec.ts` against the preview (plus reduced-motion + reveal-fail-open specs if visuals changed)
- **Phase gate:** full Playwright suite + axe + LHCI green in CI on the PR before `/gsd-verify-work`; zero `SolutionsIndustryCards` references in `src/`

### Wave 0 Gaps
- [ ] `tests/responsive/solutions-visuals.spec.ts` — covers SOLVIS-01..05 + D-14; per-route config `{ route, accordionItemIds, heroValues, industryUniqueStrings }` for 6 industry routes + hub; mirrors `platform-visuals.spec.ts` structure (minus the Explorable-toggle assertion — flagships are not required on solutions pages per D-04)
- [ ] `12-ARCHETYPE-MAP.md` — the D-08 approval artifact (18 items + 6 heroes + hub + distinctness table) before any page work
- Framework install: none — all tooling exists

## Sources

### Primary (HIGH confidence — verified this session)
- `src/content/visuals/types.ts` — all three schemas, field-by-field
- `src/components/sections/FeatureAccordion.tsx` — `visuals` prop precedence chain (lines 159-172), the ID-collision mechanics
- `src/components/product/visuals/{index.tsx,lazy.tsx,archetypes.tsx,SolutionsIndustryCards.tsx,DataStory.tsx}` — registry ids, lazy wrappers, skeleton sizes, the widget's INDUSTRIES shape + invented hexes, the cards-branch subsumption
- `src/app/solutions/page.tsx` + `src/app/solutions/utilities/page.tsx` + `src/app/platform/placement/page.tsx` — the 7-consumer migration map and the Phase 11 wiring pattern
- `src/content/solutions-{utilities,financial-services,telecom,fintech,insurance,healthcare}.ts` — full 18-item inventory (ids, titles, visualLabels)
- `src/content/visuals/{placement.ts,index.ts}` — payload authoring + barrel conventions
- `tests/responsive/platform-visuals.spec.ts` — spec shape incl. idle-guard; `tests/responsive/reduced-motion.spec.ts:90` (comment-only widget ref)
- `DESIGN.md` §4.1 — chart token values; `lighthouserc.json` — `/solutions/utilities` only; `package.json` — versions; `.planning/config.json` — `nyquist_validation: true`
- `.planning/phases/12-solutions-per-industry-visuals/12-CONTEXT.md`, `.planning/AUDIT-2026-06-12.md` (P12-01, P12-02, BL-07), `.planning/phases/11-platform-deep-dive-visuals/11-ARCHETYPE-MAP.md`

### Secondary (MEDIUM)
- Project memory: next dev/start hang in sandbox; TBT hydration-bound; Andrew's figures/COI clearance

### Tertiary (LOW / assumed)
- Industry recovery-dynamics shaping (A1) — training-data domain knowledge, pre-cleared in shape, flagged in Assumptions Log

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — no new dependencies; everything verified in-repo
- Architecture: HIGH — direct replication of the shipped Phase 11 pattern; all 7 consumers and the precedence chain read directly
- Schema fit: HIGH — schemas read field-by-field against the needs; Phase 11's 18/19 as-is precedent; hub cards branch is a designed 1:1 fit
- Pitfalls: HIGH for 1-5 (each anchored to a verified code fact or AUDIT item); MEDIUM for the A2 skeleton-height assumption (verify on preview)
- Payload realism: MEDIUM — account-type vocabulary verified in approved copy; dynamics are assumed domain knowledge (A1, pre-cleared)

**Research date:** 2026-06-12
**Valid until:** stable while the repo is on this branch state — re-verify the consumer map and accordion ids if Phases 13/14 land first (~30 days)
