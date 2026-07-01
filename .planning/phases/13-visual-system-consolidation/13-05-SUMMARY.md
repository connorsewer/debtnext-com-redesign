---
phase: 13-visual-system-consolidation
plan: 05
subsystem: homepage-feature-accordion-visuals
tags: [SYSVIS-01, P13-01, dead-code-after-repoint, archetype-library, FeatureAccordion]
requires:
  - "Phase 11 *Flagship components (prop-less, Console-composed, self-feeding from src/content/visuals)"
provides:
  - "FeatureAccordion VISUALS registry repointed to Phase 11 Flagships for placement/optimization/issues/reporting"
  - "4 bespoke FeatureAccordion visuals removed (PlacementMatrix/OptimizationEngine/IssuesWorklist/ReportingDashboard)"
affects:
  - "src/components/product/visuals/index.tsx (the homepage FeatureAccordion visual registry)"
  - "src/components/product/visuals/lazy.tsx (4 dead Lazy* wrappers removed)"
tech-stack:
  added: []
  patterns:
    - "next/dynamic inline { ssr:false, loading } literal per registry entry (Turbopack static-analysis requirement)"
    - "deletion-by-substitution: repoint the live registry first, prove with an import guard, then delete the orphaned set"
key-files:
  created: []
  modified:
    - "src/components/product/visuals/index.tsx"
    - "src/components/product/visuals/lazy.tsx"
    - "HANDOFF.md"
  deleted:
    - "src/components/product/visuals/PlacementMatrix.tsx"
    - "src/components/product/visuals/OptimizationEngine.tsx"
    - "src/components/product/visuals/IssuesWorklist.tsx"
    - "src/components/product/visuals/ReportingDashboard.tsx"
decisions:
  - "Backed the 4 ids with the Phase 11 *Flagship components (Console + Explorable composition), not bare Console. Front B WANTS the canvas-in-a-box look (D-09 / RESEARCH Front B point 2); the Flagships are prop-less and self-feed their typed payloads, so the repoint was authoring-zero."
  - "Removed the 4 bespoke Lazy* wrappers from lazy.tsx as part of the deletion set (D-09 'Lazy* wrappers + components as a set'). They had zero consumers; leaving them would have left dangling import('./PlacementMatrix') statements after the component files were deleted."
  - "Kept ComplianceStandards.tsx and its registry entry untouched (5th id, not in the P13-01 four; no Flagship/Console twin exists)."
metrics:
  duration_min: 12
  tasks: 3
  files_changed: 7
  completed: 2026-06-13
---

# Phase 13 Plan 05: FeatureAccordion VISUALS Repoint + Bespoke-Visual Deletion (Front B / P13-01) Summary

Repointed the homepage `FeatureAccordion` `VISUALS` registry so `placement`/`optimization`/`issues`/`reporting` render their prop-less Phase 11 `*Flagship` Console-composed instances instead of the bespoke `PlacementMatrix`/`OptimizationEngine`/`IssuesWorklist`/`ReportingDashboard`, kept `ComplianceStandards`, then deleted the 4 bespoke components (plus their dead `Lazy*` wrappers) as a set after a passing import guard.

## What shipped

- **VISUALS registry repoint (`src/components/product/visuals/index.tsx`):** 4 of 5 ids now resolve to `./PlacementFlagship`, `./OptimizationFlagship`, `./IssuesFlagship`, `./ReportingFlagship` (each via the existing inline `{ ssr:false, loading: Fallback }` dynamic literal). `compliance` still imports `./ComplianceStandards`. Authoring-light: the Flagships were already built in Phase 11, are prop-less, and self-feed their typed payloads from `@/content/visuals`.
- **`reporting` key migration (the explicit P13-01 requirement):** `reporting:` now imports `./ReportingFlagship` (was `./ReportingDashboard`). Grep-verified at registry line 47/48.
- **Deleted as a set** (after the import guard passed): `PlacementMatrix.tsx`, `OptimizationEngine.tsx`, `IssuesWorklist.tsx`, `ReportingDashboard.tsx`, and their 4 dead `Lazy*` wrappers in `lazy.tsx`.
- **HANDOFF.md:** P13-01 closure note appended to the existing Phase 13 section.

## Verification (code-level, sandbox-safe)

- `grep` acceptance for the registry: 4 Flagships imported; zero bespoke imports remaining in the registry; `reporting:` → `./ReportingFlagship`; `compliance:` → `./ComplianceStandards`. PASS.
- **Pre-delete import guard** (`grep -rn "PlacementMatrix\|OptimizationEngine\|IssuesWorklist\|ReportingDashboard" src/`): after filtering comments/docstrings/self-declarations, ZERO live references. The only live reference outside the deleted files was the 4 `Lazy*` wrappers in `lazy.tsx`, which had zero consumers and were removed in the same commit. PASS.
- `npx tsc --noEmit`: clean (both after repoint and after deletion).
- `npx eslint` on `index.tsx` + `lazy.tsx`: clean.
- `npx next build` (clean `.next`): succeeds; `/` prerenders. Run both after the repoint and after the deletion.
- Homepage accordion specs discoverable via `npx playwright test ... --list` (57 tests across `reveal-fail-open.spec.ts` + `reduced-motion.spec.ts`, `/` covered). Full execution deferred to CI per sandbox constraints (`next dev`/`start` hang; `playwright test` auto-starts a server).
- Firewall byte-check: `git diff --exit-code -- src/components/sections/HomepageHero.tsx src/components/sections/HomepageHandoffSection.tsx` → exit 0 (untouched).

## DEFERRED HUMAN-VERIFY

Per the user's "implement all code, defer all human-verify" directive this run, Task 2's `checkpoint:human-verify` was NOT halted on and NOT auto-marked verified. The deletion was made safe by the code-level import guard (zero live references). The following remains for Connor's end-of-phase Vercel preview review:

- **Homepage FeatureAccordion visual parity (desktop):** open each accordion item — Placement Management, Optimization Engine, Issues Management, Reporting and Dashboards, and the compliance item. Confirm every item shows a real, correct archetype visual (the Phase 11 Flagship for the first four; the unchanged `ComplianceStandards` visual for the fifth). No blank box, no wrong visual, no double-frame.
- **Reduced-motion safety:** open an item with reduced motion on; confirm the visual's content is visible at opacity 1 (the Flagships render values in the DOM by default via Console slots + Explorable panels, so they should fail open).

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Removed 4 dead `Lazy*` wrappers from `lazy.tsx`**
- **Found during:** Task 3 (pre-delete import guard)
- **Issue:** The import guard surfaced `LazyPlacementMatrix`/`LazyOptimizationEngine`/`LazyIssuesWorklist`/`LazyReportingDashboard` in `src/components/product/visuals/lazy.tsx` — real `dynamic(() => import("./PlacementMatrix")...)` wrappers. Deleting the 4 component files without removing these wrappers would have left dangling imports and broken the build.
- **Fix:** Removed the 4 dead wrappers (confirmed zero consumers via `grep -rn "Lazy{Name}" src/`). The plan's D-09 explicitly scopes deletion as "the four `Lazy*` wrappers + components as a set," so this is in-scope, not a surprise. The Flagship `Lazy*` wrappers and `LazyDecisionEnginePreview`/`LazyPlatformSystemMap` (consumed by platform pages) were left intact. `VisualSkeleton` stays (still used by the two retained wrappers).
- **Files modified:** `src/components/product/visuals/lazy.tsx`
- **Commit:** 11bd019

## Notes

- No new security surface (presentational registry repoint + dead-code deletion). No threat flags.
- No stubs introduced.
- Untracked `plans/` directory observed in `git status` during Task 3 — out of this plan's scope; left untouched (not staged, not committed).
- The remaining `grep` matches for the deleted names in `src/content/visuals/*.ts`, `WorklistRow.tsx`, and the `*Flagship.tsx` docstrings are historical provenance comments only — not live code. Left as-is (accurate history of where each payload's data originated).

## Self-Check: PASSED

- 4 bespoke component files confirmed deleted (PlacementMatrix/OptimizationEngine/IssuesWorklist/ReportingDashboard).
- ComplianceStandards + 4 Flagship files confirmed present.
- Commits 19adbec (repoint) and 11bd019 (deletion + HANDOFF) confirmed in git log.
- 13-05-SUMMARY.md confirmed on disk.
