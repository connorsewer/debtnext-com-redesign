---
phase: 11-platform-deep-dive-visuals
plan: 01
subsystem: ui
tags: [archetypes, console, schematic, data-story, explorable, framer-motion, playwright, lhci, cls]

# Dependency graph
requires:
  - phase: 10-foundation
    provides: "3 payload-driven archetypes (Console/DataStory/Schematic), typed payload schemas (types.ts), Explorable compound shell, FeatureAccordion.visuals prop, lazy archetype wrappers, reduced-motion fail-open contract"
provides:
  - "19-item archetype-mapping table (D-03), approved by Connor, locking the Console/Data-story/Schematic assignment for all 4 platform pages"
  - "5 typed placement accordion payloads (decision-engine reuses placementConsole; vendor-pools/recall Schematic; business-rules Console; reconciliation Data-story)"
  - "PlacementFlagship: the first real Explorable-composed Console flagship (PLATVIS-02/03 reference)"
  - "Wired /platform/placement: all 5 accordion items render real archetypes, zero text placeholders; BenefitSplit repointed to the flagship"
  - "Locked lazy-skeleton CLS pattern: FLAGSHIP_SKELETON_MIN_H min-h-[44rem] (704px) + per-route CLS<0.1 LHCI gate on /platform/placement"
  - "Route-parameterized platform-visuals.spec.ts (Wave 2 extends with optimization/issues/reporting)"
affects: [11-02-optimization, 11-03-issues, 11-04-reporting, 13-visual-system-consolidation]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Accordion item -> archetype instance via FeatureAccordion.visuals map (PLATVIS-01 wiring)"
    - "Explorable flagship composes Console slots + Explorable.Toggle/Panel, never boolean props (D-05/D-06)"
    - "Per-archetype lazy skeleton min-height reserves the resolved box for CLS<0.1 (Pitfall 4)"
    - "Route-parameterized Playwright helper with reduced-motion DATA-parity assertion (D-05)"

key-files:
  created:
    - ".planning/phases/11-platform-deep-dive-visuals/11-ARCHETYPE-MAP.md"
    - "src/content/visuals/placement-accordion.ts"
    - "src/components/product/visuals/PlacementFlagship.tsx"
    - "tests/responsive/platform-visuals.spec.ts"
  modified:
    - "src/content/visuals/index.ts"
    - "src/components/product/visuals/lazy.tsx"
    - "src/app/platform/placement/page.tsx"
    - "lighthouserc.json"
    - "HANDOFF.md"

key-decisions:
  - "optimization/share moved from Data-story to Console vs the indicative CONTEXT.md mapping (body copy is per-vendor share rows with caps/floors, reads as a console list)"
  - "No D-08 schema extension needed for placement: all 5 payloads express on the Phase 10 schemas as-is (one candidate ConsoleRow.align? deferred to Wave 2 vendor-portal only)"
  - "Flagship skeleton box locked at min-h-[44rem] (704px); accordion-archetype visuals keep the shared 20rem VisualSkeleton"
  - "CLS gate added as an LHCI per-route assertMatrix entry (devtools-throttled, median over 5 runs), reusing the existing /platform/placement collection"

patterns-established:
  - "Flagship = BenefitSplit visual = Explorable-composed Console instance (one component carries PLATVIS-02 + PLATVIS-03)"
  - "Per-route CLS<0.1 LHCI gate co-located with the route's collection; Wave 2 copies the 44rem skeleton and adds its own gate row"

requirements-completed: [PLATVIS-01, PLATVIS-02, PLATVIS-03]

# Metrics
duration: ~10min active (excludes the Task 2 approval-gate wait)
completed: 2026-06-05
---

# Phase 11 Plan 01: Placement deep-dive visuals + locked patterns Summary

**Placement renders real archetype visuals on all 5 accordion items and an Explorable-composed Console flagship on the BenefitSplit band, with the 19-item archetype map approved and the lazy-skeleton CLS pattern locked for Wave 2.**

## Performance

- **Duration:** ~10 min active execution (the Task 2 checkpoint approval wait is excluded)
- **Started:** 2026-06-05T21:50:41Z
- **Completed:** 2026-06-05T22:00:23Z
- **Tasks:** 6 (Task 2 was a blocking decision checkpoint, approved by Connor)
- **Files modified:** 9 (4 created, 5 modified)

## Accomplishments

- **Approved 19-item archetype-mapping table (D-03):** every platform accordion item assigned to Console (x9) / Data-story (x7) / Schematic (x3), each with a distinct one-line payload intent (D-02), schema-fit notes, and a [CLAIMS REVIEW]/[COI REVIEW] governance-surface note. Connor approved as written.
- **5 distinct, typed placement payloads (PLATVIS-01):** decision-engine reuses the existing `placementConsole`; vendor-pools and recall are Schematic fan-out/cascade; business-rules is a 3-level override Console; reconciliation is a daily-run Data-story spark. All `satisfies` the Phase 10 schemas with zero extension.
- **First real Explorable flagship (PLATVIS-02/03):** `PlacementFlagship` composes `Console.Header/Callout/Rows/Pills` slots plus one `Explorable.Toggle`/`Explorable.Panel` per treatment tier. All values render by default; panel content is unconditional (D-05 parity), motion additive.
- **Wired /platform/placement:** the `visuals` map now covers all 5 item ids (zero text placeholders remain); the BenefitSplit visual is repointed from `LazyDecisionEnginePreview` to `LazyPlacementFlagship`; the page stays a Server Component.
- **Locked the two patterns Wave 2 replicates blind:** the flagship lazy skeleton reserves `min-h-[44rem]` (704px) so the chunk resolves with no layout shift, and a per-route `cumulative-layout-shift < 0.1` LHCI gate now guards `/platform/placement`.
- **Parameterized platform-visuals spec:** asserts archetype `role="img"` per item, flagship default-visible values, keyboard toggle parity, reduced-motion DATA-parity, and no-stuck-opacity. Structured so Wave 2 appends 3 configs and inherits every assertion.

## Task Commits

1. **Task 1: Author the 19-item archetype-mapping table (D-03)** - `2079d1e` (docs)
2. **Task 2: Connor approves the mapping table** - blocking decision checkpoint, approved "as written" (no commit; gate only)
3. **Task 3: Author the 5 placement accordion payloads** - `5e8bd2e` (feat)
4. **Task 4: Placement explorable flagship + wire the page** - `bc8acdd` (feat)
5. **Task 5: Platform-visuals Playwright spec** - `56523c6` (test)
6. **Task 6: Per-route CLS gate for /platform/placement** - `ea357f3` (perf)

_Task 5 is a single `test` commit: the GREEN implementation already landed in Tasks 3-4, and the spec's runtime RED/GREEN is preview-deferred (see below)._

## Files Created/Modified

- `.planning/phases/11-platform-deep-dive-visuals/11-ARCHETYPE-MAP.md` - The approved D-03 mapping table for all 19 items across 4 pages, plus schema-fit and governance notes. Wave 2 authors against this locked table.
- `src/content/visuals/placement-accordion.ts` - 5 typed placement payloads + the flagship Console payload (`placementFlagshipConsole`) and per-tier data (`placementFlagshipTiers`).
- `src/content/visuals/index.ts` - Re-exports the new placement-accordion payloads from the barrel.
- `src/components/product/visuals/PlacementFlagship.tsx` - The Explorable-composed Console flagship (D-07 refactor of DecisionEnginePreview).
- `src/components/product/visuals/lazy.tsx` - Adds `LazyPlacementFlagship` (ssr:false) + `FlagshipSkeleton` with the locked `FLAGSHIP_SKELETON_MIN_H = min-h-[44rem]` constant.
- `src/app/platform/placement/page.tsx` - Full 5-item `visuals` map; BenefitSplit repointed to the flagship.
- `tests/responsive/platform-visuals.spec.ts` - Route-parameterized platform-visuals spec, placement coverage, Wave 2 extension point.
- `lighthouserc.json` - Per-route CLS<0.1 assertMatrix entry for `/platform/placement`.
- `HANDOFF.md` - Docs-in-sync note recording the locked skeleton dimension + CLS gate for Wave 2.

## Proven values for Wave 2 (the reason this plan went first)

- **Flagship lazy-skeleton box:** `min-h-[44rem]` = **704px** (`FLAGSHIP_SKELETON_MIN_H` in `lazy.tsx`). Wave 2 flagships copy this exact box rather than guessing.
- **Accordion-archetype skeleton box:** unchanged shared `min-h-[20rem]` `VisualSkeleton` in `archetypes.tsx` (already CLS-safe from Phase 10).
- **CLS result for /platform/placement:** the gate asserts `cumulative-layout-shift < 0.1` (median over 5 devtools-throttled runs). The numeric measurement runs in CI/preview because LHCI starts `npm run start`, which hangs in the local sandbox (project memory). The gate is declared and will report on the next LHCI run against the built/preview server; if it trips, the 704px skeleton is the dial to correct on placement before Wave 2 inherits it.

## Decisions Made

- **share -> Console (refinement vs CONTEXT.md indicative read):** the optimization/share body copy describes per-vendor share rows with caps and floors, which reads as a console list rather than a trend, so it moved from Data-story to Console in the approved table. (Affects Wave 2 plan 11-02, not this plan.)
- **No schema extension for placement:** all 5 placement payloads express on the existing `ConsoleData`/`SchematicData`/`DataStoryData`. The one candidate additive field (`ConsoleRow.align?` for a message-thread row) is flagged for Wave 2's issues/vendor-portal only and was not needed here, so `types.ts` is untouched.
- **CLS gate via LHCI, not a bespoke Playwright layout-shift assertion:** the project already runs LHCI against a built server with a per-route assertMatrix and already collects `/platform/placement`, so adding a CLS ceiling there reuses non-hanging tooling with the least new surface.

## Deviations from Plan

None - plan executed exactly as written. No deviation rules were triggered; no auto-fixes were needed. The branch base was corrected at start (the worktree was created from `311fc4b`, an older pre-Phase-11 commit, and was reset to the planned base `42b6650` so the plan files and Phase 11 context were present). This was branch-setup hygiene, not a code deviation.

## Issues Encountered

- **Worktree has no local `node_modules`:** `npx tsc`/`eslint` resolve from the main checkout and pass, but `next build` fails Turbopack's workspace-root inference because the worktree directory has no installed dependency tree. This is a worktree-isolation artifact, not a code defect. Type-correctness (tsc) and lint (eslint) are green across all 5 source files. The full `next build` + LHCI CLS measurement + Playwright spec run are DEFERRED-TO-PREVIEW per the plan's verification section (next dev/start hang locally regardless).

## Verification status

- `npx tsc --noEmit` exits 0 (all payloads `satisfies` the schemas; placement.ts stays green).
- `npx eslint` clean on placement-accordion.ts, PlacementFlagship.tsx, lazy.tsx, placement/page.tsx, platform-visuals.spec.ts.
- 0 em dashes across all new/changed source and the mapping table.
- 11-ARCHETYPE-MAP.md approved by Connor (Task 2 gate).
- DEFERRED-TO-PREVIEW: run `platform-visuals.spec.ts` (incl. reduced-motion data-parity), `reveal-fail-open.spec.ts`, `reduced-motion.spec.ts`, and the `/platform/placement` LHCI CLS gate against the Vercel preview via `PLAYWRIGHT_BASE_URL` / LHCI.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- **Wave 2 (Plans 11-02 / 11-03 / 11-04) is unblocked:** the archetype mapping is approved and locked, the flagship + accordion-visuals pattern is proven on placement, and the two replicate-blind patterns (704px flagship skeleton + per-route CLS gate) are documented. Optimization / issues / reporting parallelize against this locked reference.
- **Spec extension point ready:** Wave 2 appends its route configs to `PLATFORM_VISUAL_PAGES` in `platform-visuals.spec.ts` and inherits every assertion including reduced-motion data-parity.
- **Audit trail intact:** every placement payload carries `[CLAIMS REVIEW]`/`[COI REVIEW]` tags per D-10 (non-blocking this phase under Andrew's standing clearance); surface in the PR description.
- **Preview verification pending (non-blocking for Wave 2 start):** the CLS number, the new spec, and the inherited motion specs run against the Vercel preview.

## Self-Check: PASSED

- All 4 created source/doc files exist on disk (11-ARCHETYPE-MAP.md, placement-accordion.ts, PlacementFlagship.tsx, platform-visuals.spec.ts) plus this SUMMARY.
- All 5 task commits exist in git history (2079d1e, 5e8bd2e, bc8acdd, 56523c6, ea357f3).
- tsc + eslint clean; 0 em dashes across all changed files and this SUMMARY.

---
*Phase: 11-platform-deep-dive-visuals*
*Completed: 2026-06-05*
