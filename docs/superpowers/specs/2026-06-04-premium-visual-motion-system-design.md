# Premium visual + motion system — design spec

**Date:** 2026-06-04
**Status:** Approved (brainstorm complete) — routing to GSD milestone flow
**Author:** Connor + Claude (brainstorming session)
**Brainstorm mockups:** `.superpowers/brainstorm/16012-1780620889/content/` (scope-map, motion-vocab, industry-directions)

---

## 1. Problem

A visual-asset audit of the repo + live site (`debtnext-website.vercel.app`) found that the
site's visual layer, while sophisticated, has real gaps the premium tier exposes:

1. **Duplicate visual.** `SolutionsIndustryCards` (`src/components/product/visuals/SolutionsIndustryCards.tsx`)
   takes no props and renders the identical 4-card portfolio widget on all 7 solutions pages
   (`/solutions` + 6 industry sub-pages). No industry sees its own data.
2. **Placeholder visuals.** `FeatureAccordion` renders text-on-dark placeholder surfaces
   (explicitly marked "Visuals for M2 are dark placeholder surfaces… Real product screenshots
   arrive in M3" in `FeatureAccordion.tsx:44` and gated by `isAccordionVisualId` in
   `product/visuals/index.tsx:14`) on every non-homepage page that uses it — ~20 items across
   the 4 platform deep-dive pages and ~25 items across the 6 solutions sub-pages.
3. **Vestigial asset.** The single raster `public/product/dashboard-dark.png` is the homepage
   hero centerpiece, and is *also* declared as the `BenefitSplit` `media` fallback in 6 content
   files where it never renders (every page supplies a live `visual=`). 6 dead references.
4. **Parallel systems.** Two hand-built visual libraries coexist — `src/components/sections/mockups/`
   (used in the homepage handoff tabs) and `src/components/product/visuals/` (used in
   accordions/splits) — with duplicate placement/issues/reporting treatments.

Note: several "empty dark panel" findings in the live crawl were **false positives** — real
content gated behind Framer Motion `whileInView`/`CountUp` scroll-reveals that don't fire in a
headless full-page screenshot (`ProcessStrip.tsx:45`, `CountUp.tsx`). Those are not placeholders.

## 2. Goal

Fill every gap with thoughtful, premium design, and lift the entire site to a flagship "lux"
feel — adding motion, interactivity, and subtle movement anywhere it earns its place — **without
breaking the brand's core restraint.** Premium and restraint hold hands here (Mercury is the
proof): the site feels expensive because motion is subtle and perfectly executed, not because
there is a lot of it.

**Brand guardrail (unchanged):** calm, precise, technical. "Quiet competence over performance."
Product visuals explain, not decorate (DESIGN.md §3.4). Buyer emotional goal: reduce decision
risk, not amplify it.

### Non-goals
- No new dependencies beyond the approved stack (Framer Motion + GSAP already in use).
- No new color/spacing/type tokens outside DESIGN.md (raise first if needed).
- No copy rewrites except where a new visual needs a caption (subject to voice rules + COI/CLAIMS).
- Not redesigning IA, nav, or routes. Visuals + motion only.

## 3. Locked decisions (from brainstorm)

### 3.1 Scope — 7 workstreams (all approved in-scope)
1. Per-industry solutions visuals (kills the 7-page duplicate widget)
2. Platform capability visuals (~20 accordion placeholders)
3. Solutions capability visuals (~25 accordion placeholders)
4. Premium motion + interactivity system (cross-cutting)
5. Text-only page elevation (`/compare`, `/why-dplat`, `/company/*`, `/resources`, `/platform/integrations`, `/demo`)
6. Visual system consolidation (merge the two libraries; retire dead PNG fallbacks)
7. Homepage / hero flagship capstone pass

### 3.2 Motion vocabulary — 7 types (all approved, restraint level confirmed)
All implemented as shared, `prefers-reduced-motion`-aware primitives that collapse to instant
fades when reduced motion is requested:
1. **Scroll reveal** — staggered fade-up (refine existing timing + extend coverage)
2. **Live data motion** — number roll-ups, filling bars, pulsing status dots
3. **Hover + cursor interactivity** — card lift, cursor-reactive glow on dark panels
4. **Ambient drift** — slow blurred light behind dark bands (barely perceptible)
5. **Micro-interactions** — button press, toggles, focus glow, input states (the 7 component states)
6. **Section + tab + route transitions** — crossfade/morph, no hard cuts
7. **Explorable visuals** — hover to inspect data points, toggle states inside a visual

### 3.3 Visual architecture — archetype library (approved)
One coherent library of **three parametrized archetypes**, each fed real per-context data, built
on shared primitives. A visual = "an archetype + a data payload," never a copy-paste.
- **Console** — realistic dPlat UI slice (worklist, KPIs, pools, statuses)
- **Data story** — one focused, annotated chart that teaches something true
- **Schematic** — precise routing/flow diagram with data traveling the edges

Per-industry solutions pages use **all three as a library** (Console = industry hero visual,
Schematic = "how it works", Data story = proof beat), each with its own real numbers + account types.

## 4. Architecture

### 4.1 Motion system — `src/components/motion/`
A small set of shared primitives/hooks implementing the 7 motion types. Single source of truth so:
- Restraint is enforced centrally (timings, easings, distances from DESIGN.md §4.7).
- `prefers-reduced-motion` is handled once (all motion → instant fade/no transform).
- Consumers import named primitives; no ad-hoc Framer/GSAP in pages.

Builds on existing `src/components/ambient/` and `src/components/motion/` (tier-3 work) rather
than replacing them — see `2026-06-04-product-visuals-motion-design.md`.

### 4.2 Archetype library — `src/components/product/`
- `product/primitives/` — atoms (MetricCell, StatPill, LiveStatus already exist; add chart atoms,
  flow nodes, bars, worklist rows). One stroke weight, one type scale, one color logic.
- `product/visuals/` — the three archetypes as parametrized components consuming typed data payloads.
- Per-context data lives in typed modules (e.g. `src/content/solutions-*.ts` extended with a
  visual payload, or a dedicated `src/content/visuals/*.ts`).

### 4.3 Consolidation
- Fold `src/components/sections/mockups/` into the archetype library (the homepage handoff tabs
  become Console-archetype instances). Remove duplicate placement/issues/reporting treatments.
- Remove the 6 dead `dashboard-dark.png` `media` fallbacks from content (or wire a real fallback).
  Keep the hero's use of the PNG (or replace with a Console instance during the homepage capstone).

### 4.4 How each workstream consumes the system
| Workstream | Application |
|---|---|
| 1 + 3 Solutions | Each of 6 industries: Console hero + Schematic + Data story, real per-industry data. Accordion placeholders → archetype instances. |
| 2 Platform | ~20 accordion items → archetype instances; flagship item per page is **explorable**. |
| 5 Text-only pages | Archetype visuals + motion where they lift (not decoration). |
| 6 Consolidation | Merge libraries, retire dead assets. |
| 7 Homepage | Capstone pass applying the matured system; hero elevation. |

## 5. Guardrails (every phase)
- **Tokens:** DESIGN.md only. One filled CTA per band (single-voltage rule).
- **Accessibility:** WCAG 2.2 AA. Visible focus (`#9CB4E8`, 2px/2px). 44px targets. Reduced-motion.
  One H1/page. Decorative visuals `aria-hidden`; meaningful ones get descriptive alt/label.
- **Performance:** LCP <2.5s, CLS <0.1, INP <200ms. Visuals stay lazy (`ssr:false`, dynamic import).
  Server Components by default. Animations use transform/opacity only (no layout-property animation).
- **Compliance:** any copy touching the vendor/TSI relationship → `[COI REVIEW]`; any metric →
  `[CLAIMS REVIEW]`. Use generic/qualified numbers; no invented clients or outcomes.
- **Docs in sync:** DESIGN.md §4.7 (motion) and `.impeccable.md` updated in the **same commit** as
  the code they describe. HANDOFF.md / STATE.md / ROADMAP.md updated per GSD flow.

## 6. Phased delivery (feeds GSD roadmap)
Each phase ships independently and is reviewable on its own Vercel preview.
- **Phase 0 — Foundation:** motion primitives + consolidated archetype library + primitives;
  retire dead assets. Unblocks everything.
- **Phase 1 — Platform deep-dive visuals** (4 pages, ~20 items; explorable flagships).
- **Phase 2 — Solutions visuals** (7 pages, per-industry library; kills duplicate + ~25 placeholders).
- **Phase 3 — Text-only page elevation** (8+ pages).
- **Phase 4 — Homepage flagship capstone.**

## 7. Reconciliation with existing GSD state (must resolve in milestone flow)
- Current milestone `v1.0` is `status: blocked` at 70% — Phase 5 hero-perf LCP gate still red
  (Phase 5.3 queued: lazy-import GSAP / renegotiate the 2,300ms LHCI gate vs CLAUDE.md §12 2,500ms floor).
- The **existing roadmap already contains "Phase 8 (Motion)" blocked on Phase 5 close.** This new
  milestone's Phase 0/motion work supersedes or absorbs that — the milestone flow must decide
  whether to (a) close/renegotiate Phase 5 first, (b) fold the old Phase 8 Motion into this
  milestone's Phase 0, and (c) version this as a new milestone (e.g. v1.1).
- Tier-3 product-visuals work just shipped (Jun 4) using the `parts.tsx` pattern in
  `product/visuals/` — this milestone extends that pattern, it does not replace it
  (see memory: tier3 visual pattern).

## 8. References
- Audit findings (this session)
- `.impeccable.md` (design context), `DESIGN.md` (token spec), `CLAUDE.md` (operating contract)
- `2026-06-04-product-visuals-accordion-design.md`, `2026-06-04-product-visuals-motion-design.md`
- `.planning/ROADMAP.md`, `.planning/STATE.md`, `.planning/MILESTONES.md`
