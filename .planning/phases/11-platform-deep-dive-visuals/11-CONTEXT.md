# Phase 11: Platform deep-dive visuals - Context

**Gathered:** 2026-06-05
**Status:** Ready for planning

<domain>
## Phase Boundary

Replace every text-on-dark placeholder on the 4 platform deep-dive pages
(`/platform/placement`, `/platform/optimization`, `/platform/issues`,
`/platform/reporting`) with real archetype visuals fed real payloads, add one
constrained explorable flagship per page, and re-point the BenefitSplit live
visuals to archetype instances. This proves the Phase 10 archetype + payload
model end-to-end on lower-risk pages before the Phase 13 homepage handoff
depends on it.

**In scope:** ~18 accordion-item visuals across 4 pages, 4 explorable
flagships (the per-page BenefitSplit visual), refactor of the 5 bespoke visuals
into archetype + payload, 3 new payload modules (optimization / issues /
reporting; placement already exists).

**Out of scope (other phases):** solutions per-industry visuals (Phase 12),
homepage handoff re-point + `sections/mockups` retirement (Phase 13),
text-only page elevation (Phase 14), hero asset work (Phase 15). New nav items,
new CTAs, new pages — none.

</domain>

<decisions>
## Implementation Decisions

### Archetype mapping (PLATVIS-01)
- **D-01:** Match each accordion item to the archetype that fits its content
  meaning — routing/workflow items → Schematic, metric/console-screen items →
  Console, trend/proof items → Data-story. Not one-archetype-per-page.
- **D-02:** Every one of the ~18 accordion items renders a visually DISTINCT
  visual (its own payload, reads differently). No shared "family" templates, no
  repeats within or across pages. This directly serves the "no two visuals look
  alike" anti-templated goal that is M6's core credibility fix.
- **D-03:** The planner MUST produce the full per-item archetype-mapping table
  (item id → archetype → one-line payload intent) and get Connor's approval
  BEFORE payload authoring begins. ~18 distinct payloads is a large authoring
  and [CLAIMS REVIEW] surface; the mapping is the cheapest place to course-
  correct. Indicative starting read (planner refines from body copy):
  - placement (5): decision-engine → Console (exists), vendor-pools → Schematic,
    recall → Schematic, business-rules → Console, reconciliation → Data-story
  - optimization (4): bands → Data-story, share → Data-story, bonus → Console,
    history → Data-story
  - issues (5): auto-handling → Console, workflows → Schematic, vendor-portal →
    Console, sla → Console, audit → Data-story
  - reporting (5): inventory → Console, vendor → Console, cost → Data-story,
    sla → Data-story, activity → Console
  (Indicative only — final table is the planner's deliverable for approval.)

### Explorable flagship (PLATVIS-02)
- **D-04:** The explorable flagship on each page is the existing large
  BenefitSplit live visual (PlacementMatrix / OptimizationEngine /
  IssuesWorklist / ReportingDashboard). One clear flagship per page, on the
  light band, separate from the accordion. No new standalone "explore" band; no
  promoting an accordion-panel widget (avoids the accordion-open focus-
  management complexity, Pitfall 7).
- **D-05:** Interaction model is chosen per-page to fit each flagship's content
  (some toggle-state, some hover-to-inspect). HARD CONSTRAINT: any hover-based
  flagship MUST also ship a tap + keyboard-activation equivalent — hover is
  never the only path. This upholds the Phase 10 locked parity contract (touch +
  keyboard + reduced-motion see the same data; values visible by default, never
  hover-gated). Flagships compose the `Explorable` shell
  (`Explorable.Toggle` / `Explorable.Panel`), not boolean props.
- **D-06:** The flagship being the BenefitSplit visual means the BenefitSplit
  visual is simultaneously the PLATVIS-02 flagship AND the PLATVIS-03 archetype-
  instance target on each page — one component carries both contracts. Plan
  them together per page, not as separate work items.

### Reuse vs rebuild (PLATVIS-03)
- **D-07:** Refactor each of the 5 bespoke visuals (PlacementMatrix,
  OptimizationEngine, IssuesWorklist, ReportingDashboard, DecisionEnginePreview)
  into an archetype instance fed a typed payload, keeping the rendered result as
  close as the archetype can express. Goal: collapse toward ONE visual library,
  which de-risks the Phase 13 handoff re-point. Not "convert only some" (leaves
  a mixed contract); not "plain generic renders" (loses polish).
  - Note: PlacementMatrix was already validated against `ConsoleData` in Phase
    10 (10-04) — it is the proven reference, not net-new work.
- **D-08:** When an archetype genuinely cannot express a bespoke detail, the
  default is to EXTEND the Phase 10 payload schema
  (`ConsoleData`/`DataStoryData`/`SchematicData` in
  `src/content/visuals/types.ts`) so the archetype gets richer for all
  consumers. Schema extensions: keep existing payload validation green, apply
  the per-commit docs-in-sync rule (types.ts is the documented single source),
  and prefer additive optional fields over breaking changes. Keeping a visual
  bespoke is a last-resort exception that must be logged for Phase 13, not a
  silent drop.

### Data realism & governance (cross-cutting)
- **D-09:** Payload numbers are REAL-SHAPED and anonymized — plausible
  magnitudes and ratios that read like a real dPlat console, zero client
  identifiers, generic and qualified. This is also the point of doing platform
  before the homepage handoff: battle-test the schemas against realistic data.
- **D-10:** **Andrew Budish has pre-cleared** (relayed by Connor in this
  discussion) the use of real-shaped, compelling, realistic anonymized
  marketing figures for this phase, AND cleared the vendor/TSI framing
  ("whatever we need to do"). Therefore for Phase 11:
  - Keep `[CLAIMS REVIEW]` comments on every payload number and `[COI REVIEW]`
    on any vendor/TSI-framing caption, FOR AUDIT TRACEABILITY (the payload model
    documents this home).
  - These tags are NOT merge-blockers for Phase 11 — Andrew's standing clearance
    covers them. Surface them in the PR description per CLAUDE.md §6–7 so the
    audit trail is intact, then proceed.
  - BOUNDARY: this clearance covers anonymized/generic FIGURES and framing only.
    It does NOT waive the separate hard rule that naming a specific client or
    using a client logo requires written client consent + Andrew's sign-off
    (CLAUDE.md §7, §15). Do not invent client names or use real client logos.

### Claude's Discretion
- Lazy-skeleton dimensions per archetype to match the resolved box (Pitfall 4 —
  CLS), payload file organization under `src/content/visuals/`, exact node/edge
  layouts and chart variants, motion timing within the locked vocabulary, and
  the per-page toggle-vs-hover choice (within D-05's parity constraint).

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Phase scope & requirements
- `.planning/ROADMAP.md` §"Phase 11: Platform deep-dive visuals" — goal,
  success criteria, dependencies, Notes (Pitfalls 4/7/8 callouts)
- `.planning/REQUIREMENTS.md` — PLATVIS-01, PLATVIS-02, PLATVIS-03
- `.planning/phases/10-foundation/10-VERIFICATION.md` — what the keystone
  actually delivered (archetypes, payloads, Explorable, primitives)

### Archetype + payload model (Phase 10 — the foundation this phase consumes)
- `src/content/visuals/types.ts` — `ConsoleData` / `DataStoryData` /
  `SchematicData` schemas; the [CLAIMS REVIEW]/[COI REVIEW] governance header.
  This is the single source extended under D-08.
- `src/content/visuals/placement.ts` — the one existing payload; the authoring
  reference for the 3 new payload modules.
- `src/content/visuals/index.ts` — payload export surface
- `src/components/product/visuals/Console.tsx` — compound Console archetype
- `src/components/product/visuals/DataStory.tsx` — Data-story archetype
- `src/components/product/visuals/Schematic.tsx` — Schematic archetype
- `src/components/product/visuals/archetypes.tsx` — lazy archetype wrappers
  (`ConsoleVisual` / `DataStoryVisual` / `SchematicVisual`)
- `src/components/product/visuals/lazy.tsx` — lazy bespoke-visual wrappers
  currently used by the platform pages
- `src/components/motion/Explorable.tsx` — the explorable shell + a11y/reduced-
  motion contract the flagships compose (PLATVIS-02)
- `src/components/product/primitives/index.ts` — WorklistRow, ChartFrame,
  FlowNode, FlowEdge, MetricCell, StatPill, LiveStatus, etc.

### Pages, sections & current visuals to refactor
- `src/app/platform/{placement,optimization,issues,reporting}/page.tsx`
- `src/content/{placement,optimization,issues,reporting}.ts` — accordion item
  ids + copy that drive D-01 mapping
- `src/components/sections/FeatureAccordion.tsx` — the `visuals` prop keyed by
  item id is the wiring point for PLATVIS-01; current text placeholder lives at
  lines ~159-172
- `src/components/sections/BenefitSplit.tsx` — flagship host
- Bespoke visuals to refactor (D-07): `PlacementMatrix.tsx`,
  `DecisionEnginePreview.tsx`, `OptimizationEngine.tsx`, `IssuesWorklist.tsx`,
  `ReportingDashboard.tsx` (all in `src/components/product/visuals/`)

### Standing contracts
- `DESIGN.md` §4.7 (motion / engine-per-job), §7.3 + §8.5 (accordion a11y),
  §10 (reduced motion) — tokens-only, motion vocabulary, reduced-motion gating
- `.impeccable.md` — design brief / principles (docs-in-sync per commit)
- `CLAUDE.md` §3 (brand), §5 (voice), §6 (COI), §7 (claims), §11 (a11y floor),
  §12 (perf targets)

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- **3 archetypes already built and payload-driven** — Console (compound),
  DataStory, Schematic. Lazy wrappers in `archetypes.tsx`. This phase authors
  payloads + wires them; it does not build new archetype engines.
- **`Explorable` compound shell exists** (contract only) — flagships are its
  first real consumers; toggle/panel + keyboard/reduced-motion contract is
  pre-wired.
- **7-type motion vocabulary + primitives** (WorklistRow, ChartFrame, FlowNode,
  FlowEdge, MetricCell, StatPill, LiveStatus) — compositor pieces for archetype
  internals and any schema extensions.
- **PlacementMatrix already validates against `ConsoleData`** — the proven
  refactor reference for D-07.
- **`FeatureAccordion.visuals` prop** — keyed by item id, already takes
  precedence over the placeholder; the exact PLATVIS-01 injection point. Only
  `placement` passes it today (1 of 5 items).

### Established Patterns
- Pages are Server Components importing typed content + lazy visual wrappers;
  visuals are client+lazy via `dynamic`. Keep this — no eager motion/JS into
  shared chunks.
- Every product number lives in a typed payload (zero baked constants) — Phase
  10 locked; this phase obeys it for all 3 new payload modules.
- Reduced-motion fail-open + values-visible-by-default — locked; every new
  flagship/visual inherits it (Playwright "no stuck opacity:0" spec guards it).

### Integration Points
- PLATVIS-01: pass `visuals={{ <itemId>: <LazyArchetypeInstance> }}` to each
  `FeatureAccordion` (4 pages).
- PLATVIS-02: wrap/replace each page's BenefitSplit visual with an
  `Explorable`-composed archetype instance.
- PLATVIS-03: the same BenefitSplit visual refactor (one component, two
  contracts per D-06).
- New payloads land in `src/content/visuals/{optimization,issues,reporting}.ts`
  exported via `index.ts`.

</code_context>

<specifics>
## Specific Ideas

- "No two visuals look alike" is the explicit success bar (D-02) — it is the
  clearest fix for the "templated" tell M6 exists to kill.
- Andrew's figure + COI clearance (D-10) is a verbal/relayed standing approval
  for this phase; keep the audit tags even though they don't block merge.
- The flagship interaction can differ per page (D-05) but must never depend on
  hover alone.

</specifics>

<deferred>
## Deferred Ideas

- A dedicated standalone "explore the engine" flagship band per page — rejected
  for Phase 11 (extra band + CTA bookkeeping); could revisit if BenefitSplit-as-
  flagship feels cramped.
- Making accordion-panel visuals themselves interactive — deferred (Pitfall 7
  focus complexity); flagship stays on the BenefitSplit band.
- Solutions per-industry visuals, homepage handoff re-point, `sections/mockups`
  retirement — owned by Phases 12 / 13 respectively, not this phase.

</deferred>

---

*Phase: 11-platform-deep-dive-visuals*
*Context gathered: 2026-06-05*
