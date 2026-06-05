---
phase: 10-foundation
plan: 05
subsystem: ui
tags: [react19, framer-motion, archetypes, payloads, compound-components, next-dynamic, a11y, perf]

# Dependency graph
requires:
  - phase: 10-02
    provides: motion barrel (RevealStagger/RevealItem, LiveValue, PulseDot) consumed by all three archetypes
  - phase: 10-03
    provides: product primitives (WorklistRow, ChartFrame, FlowNode, FlowEdge, ProductCanvas, MetricCell, StatPill, LiveStatus) composed by the archetypes
  - phase: 10-04
    provides: typed payloads (ConsoleData, DataStoryData, SchematicData) the archetypes render from
provides:
  - Console compound archetype rendering ConsoleData (React 19 use() context, zero baked numbers)
  - DataStory archetype rendering DataStoryData (area/spark/bars/cards; cards branch subsumes the SolutionsIndustryCards duplicate)
  - Schematic archetype rendering SchematicData (PROVISIONAL/A2, FlowNode/FlowEdge)
  - Public archetype API ConsoleVisual/DataStoryVisual/SchematicVisual (lazy ssr:false wrappers)
affects: [phase-11, phase-12, phase-13, phase-14, phase-15, solutions-visuals, platform-visuals]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Explicit variant components per archetype (ConsoleVisual/DataStoryVisual/SchematicVisual), not one polymorphic <Visual type=...>"
    - "Compound component via React 19 use() context (no forwardRef) with a default flat render plus exposed slots"
    - "Archetype renders entirely from a typed payload; zero baked product numbers (single [CLAIMS REVIEW] surface lives in the payload module)"
    - "Lazy ssr:false archetype wrappers with inline-literal next/dynamic options (Turbopack) keep archetypes off the / eager chunk"

key-files:
  created:
    - src/components/product/visuals/Console.tsx
    - src/components/product/visuals/DataStory.tsx
    - src/components/product/visuals/Schematic.tsx
    - src/components/product/visuals/archetypes.tsx
  modified:
    - .planning/phases/10-foundation/deferred-items.md

key-decisions:
  - "Console is a compound component with a default flat render: <Console data /> works standalone, and Console.Header/Callout/Rows/Pills are exposed for explorable composition (skill A.2)"
  - "DataStory.cards reproduces the SolutionsIndustryCards layout from payload data, retiring the no-prop duplicate; per-card arbitrary accent colors stay inline since the ValueBar tone palette is token-fixed"
  - "Schematic kept PROVISIONAL (A2) with an auto-laid column grid (source/engine/vendor/sink) and straight FlowEdges, to be hardened in Phase 11 against real how-it-works geometry"

patterns-established:
  - "Build any product visual by importing an archetype and passing a payload — there is no component to copy, only a payload to author"
  - "ariaSummary (required payload field) drives role=img + aria-label on every archetype; the live pulse uses PulseDot (static under reduced motion)"

requirements-completed: [FND-02]

# Metrics
duration: 18min
completed: 2026-06-05
---

# Phase 10 Plan 05: Parametrized visual archetypes Summary

**Three explicit variant archetypes (Console compound + DataStory + Schematic) that render entirely from typed payloads with zero baked numbers, exposed as lazy ssr:false `*Visual` wrappers that never enter the `/` eager chunk.**

## Performance

- **Duration:** 18 min
- **Started:** 2026-06-05T13:09:00Z
- **Completed:** 2026-06-05T13:27:28Z
- **Tasks:** 3
- **Files modified:** 5 (4 created, 1 modified)

## Accomplishments
- `Console` compound archetype: React 19 `use()` context (no forwardRef), default flat render plus `Console.Header/Callout/Rows/Pills` slots, every value from `ConsoleData`, live pulse via `PulseDot`, `role="img"` + `aria-label={data.ariaSummary}`.
- `DataStory` archetype: switches on `chart.kind` (area/spark/bars/cards); the `cards` branch subsumes the `SolutionsIndustryCards` duplicate by rendering the same layout from payload data, wrapped in `ChartFrame` for the text alternative.
- `Schematic` archetype (PROVISIONAL/A2): lays out `nodes` via `FlowNode` and `edges` via `FlowEdge` (flow via `strokeDashoffset`, static under reduced motion), `role="img"` text alternative from `ariaSummary`.
- `archetypes.tsx`: the public `ConsoleVisual` / `DataStoryVisual` / `SchematicVisual` API as lazy `ssr:false` wrappers with inline-literal `next/dynamic` options and a resolved-box `VisualSkeleton` (CLS-free swap).
- Zero baked product numbers and no GSAP import across all three archetypes.

## Task Commits

Each task was committed atomically:

1. **Task 1: Console compound archetype** - `65da0b8` (feat)
2. **Task 2: DataStory + Schematic archetypes** - `a6d3bdd` (feat)
3. **Task 3: Lazy ssr:false archetype wrappers** - `701c2eb` (feat)

## Files Created/Modified
- `src/components/product/visuals/Console.tsx` - Console compound archetype; React 19 `use()` context, slots + default flat render, renders `ConsoleData`.
- `src/components/product/visuals/DataStory.tsx` - Data-story archetype; switches on `chart.kind`, `cards` branch subsumes the industry-cards duplicate.
- `src/components/product/visuals/Schematic.tsx` - Schematic archetype (PROVISIONAL/A2); `FlowNode`/`FlowEdge` node graph from `SchematicData`.
- `src/components/product/visuals/archetypes.tsx` - Public `*Visual` lazy `ssr:false` wrappers (the Phase 11-15 import surface).
- `.planning/phases/10-foundation/deferred-items.md` - Logged the pre-existing `IssuesWorklist` unused-import eslint warning (out of scope).

## Decisions Made
- Console exposes both a default flat render and named slots so simple pages stay one-line while explorable layouts can re-slot (skill A.2).
- DataStory `cards` keeps arbitrary per-card accent colors inline (the shared `ValueBar` tone palette is token-fixed to indigo/success/warning); a small local `CardBar` applies the accent. This preserves the original `SolutionsIndustryCards` look while moving all numbers into the payload.
- Schematic left PROVISIONAL with an auto-computed column grid and node-center edge geometry; flagged for Phase 11 hardening against real geometry.

## Deviations from Plan

None - plan executed exactly as written. (Removed em dashes from two Console code comments to respect CLAUDE.md §5 voice rules; this is a voice-compliance edit within the planned task, not a scope change.)

## Issues Encountered
- The acceptance grep `forwardRef absent` initially matched a descriptive code comment ("no forwardRef"). Reworded the comment to say "no ref-forwarding wrapper" so the literal token is absent and the gate reads clean. No behavior change.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- The archetype + payload contract is complete: Phase 11-15 visuals are now "import an archetype, author a payload." No component duplication is constructible.
- `npx tsc --noEmit` exits 0; eslint is clean on all four new files (one pre-existing warning in `IssuesWorklist.tsx` is logged in deferred-items.md, not introduced here).
- Open follow-up: `Schematic` geometry is PROVISIONAL (A2) and should be hardened in Phase 11 against real "how it works" data before locking the `SchematicData` shape.

## Known Stubs
None. All three archetypes render from required payload fields; no hardcoded empty data flows to the UI, and no placeholder text is rendered.

## Self-Check: PASSED

All 4 created files exist on disk; all 3 task commits (`65da0b8`, `a6d3bdd`, `701c2eb`) exist in history. `npx tsc --noEmit` exits 0; eslint clean on all new files.

---
*Phase: 10-foundation*
*Completed: 2026-06-05*
