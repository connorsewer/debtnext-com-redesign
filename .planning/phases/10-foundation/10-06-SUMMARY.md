---
phase: 10-foundation
plan: 06
subsystem: ui
tags: [cleanup, content, assets, benefit-split, dead-code]

# Dependency graph
requires:
  - phase: 10-foundation (plan 01)
    provides: CI validation nets the foundation phase relies on
provides:
  - 6 dead dashboard-dark.png BenefitSplit media fallbacks removed from content modules
  - BenefitSplit.media made optional (it is a fallback for the live visual)
  - clean grep surface for the asset (only the intentional hero use remains)
affects: [13-visual-system-consolidation, 15-homepage-flagship-capstone]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "BenefitSplit: live `visual` is primary; static `media` image is an optional fallback (visual ?? media)"

key-files:
  created: []
  modified:
    - src/content/reporting.ts
    - src/content/placement.ts
    - src/content/homepage.ts
    - src/content/solutions.ts
    - src/content/optimization.ts
    - src/content/issues.ts
    - src/components/sections/BenefitSplit.tsx
    - src/app/page.tsx
    - src/app/platform/reporting/page.tsx
    - src/app/platform/placement/page.tsx
    - src/app/platform/optimization/page.tsx
    - src/app/platform/issues/page.tsx
    - src/app/solutions/page.tsx

key-decisions:
  - "Made BenefitSplit.media optional and dropped the orphaned media= page props rather than leaving dangling required-prop references, so tsc stays green after removing the content blocks (deviation Rule 3)."

patterns-established:
  - "Dead-fallback removal is verified by the component's own render branch: BenefitSplit renders `visual ?? media`, and every consumer supplies a live visual, so the media branch is provably unreachable."

requirements-completed: [FND-05]

# Metrics
duration: ~12min
completed: 2026-06-05
---

# Phase 10 Plan 06: Dead dashboard-dark.png BenefitSplit fallback cleanup Summary

**Removed the 6 unreachable `dashboard-dark.png` BenefitSplit `media` fallbacks (every consumer supplies a live `visual=`), made `BenefitSplit.media` optional, and dropped the orphaned `media=` page props, leaving the asset referenced only by the intentional homepage hero.**

## Performance

- **Duration:** ~12 min
- **Completed:** 2026-06-05T13:12:29Z
- **Tasks:** 1
- **Files modified:** 13

## Accomplishments
- Removed all 6 dead `media: { src: "/product/dashboard-dark.png", ... }` blocks from the BenefitSplit content objects (reporting, placement, homepage, solutions, optimization, issues).
- Confirmed per-file (A4 safety gate) that each BenefitSplit supplies a live `visual=`, so the `media` Image branch never rendered.
- Made `BenefitSplit.media` optional and guarded its render, then removed the now-orphaned `media={...benefit.media}` props from all 6 page call-sites — required to keep `npx tsc --noEmit` green.
- Preserved the homepage hero use (`HomepageHero.tsx:187`) and the `public/product/dashboard-dark.png` file itself (deferred to Phase 15).

## Task Commits

1. **Task 1: Verify each BenefitSplit supplies a live visual, then remove the 6 dead media fallbacks** - `55de569` (chore)

## Files Created/Modified
- `src/content/reporting.ts` - removed dead `media` block from `reportingBenefit`
- `src/content/placement.ts` - removed dead `media` block from `placementBenefit`
- `src/content/homepage.ts` - removed dead `media` block from `homepageBenefitSplit`
- `src/content/solutions.ts` - removed dead `media` block from `solutionsCrossIndustry`
- `src/content/optimization.ts` - removed dead `media` block from `optimizationBenefit`
- `src/content/issues.ts` - removed dead `media` block from `issuesBenefit`
- `src/components/sections/BenefitSplit.tsx` - made `media` prop optional; guarded the `media` render branch (`visual ?? (media ? <Image/> : null)`)
- `src/app/page.tsx`, `src/app/platform/reporting/page.tsx`, `src/app/platform/placement/page.tsx`, `src/app/platform/optimization/page.tsx`, `src/app/platform/issues/page.tsx`, `src/app/solutions/page.tsx` - removed the orphaned `media={...benefit.media}` prop from each BenefitSplit call-site

## Per-file precondition results (A4 safety gate)

All 6 confirmed truly dead — each BenefitSplit supplies a live `visual=`, and `BenefitSplit` renders `visual ?? media`, so the `media` image branch is unreachable:

| File | Content object | Page call-site | Live visual supplied | Verdict |
|------|----------------|----------------|----------------------|---------|
| src/content/reporting.ts | reportingBenefit | src/app/platform/reporting/page.tsx | `<LazyReportingDashboard />` | dead — removed |
| src/content/placement.ts | placementBenefit | src/app/platform/placement/page.tsx | `<LazyDecisionEnginePreview />` | dead — removed |
| src/content/homepage.ts | homepageBenefitSplit | src/app/page.tsx | `<LazyDecisionEnginePreview />` | dead — removed |
| src/content/solutions.ts | solutionsCrossIndustry | src/app/solutions/page.tsx | `<LazySolutionsIndustryCards />` | dead — removed |
| src/content/optimization.ts | optimizationBenefit | src/app/platform/optimization/page.tsx | `<LazyOptimizationEngine />` | dead — removed |
| src/content/issues.ts | issuesBenefit | src/app/platform/issues/page.tsx | `<LazyIssuesWorklist />` | dead — removed |

**No A4 exceptions.** All 6 were confirmed dead and removed; no `media` block was retained.

## Verification

- `npx tsc --noEmit` exits 0.
- `npx eslint src/content/` clean; eslint also clean on the modified `BenefitSplit.tsx` and 6 page files.
- `grep -rn "dashboard-dark.png" src/content/` returns no matches (all 6 fallbacks gone).
- `grep -rn "dashboard-dark.png" src/components/sections/HomepageHero.tsx` still matches (hero use intact).
- `ls public/product/dashboard-dark.png` still exists (PNG not deleted).
- No `.media}` props remain on any BenefitSplit in `src/app/`.
- No test references the removed PNG path or any removed fallback alt text, so existing render/responsive specs are unaffected (the `benefit-split-media` testid container is untouched).

## Decisions Made
- **Made `BenefitSplit.media` optional and removed the page `media=` props.** The plan's `files_modified` listed only the 6 content modules, but `media` was a *required* prop and each page passed `media={...benefit.media}`. Removing only the content blocks would have left `tsc` failing on undefined required-prop references. Making the prop optional (it is purely a fallback for `visual`) and dropping the now-orphaned props is the minimal change that satisfies the plan's `npx tsc --noEmit` gate and genuinely kills the vestigial references (the plan objective). Tracked below as a Rule 3 deviation.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Made `BenefitSplit.media` optional and removed orphaned `media=` page props**
- **Found during:** Task 1
- **Issue:** `BenefitSplitProps.media` was a required prop, and all 6 pages passed `media={...benefit.media}`. Removing the `media` block from the content objects alone left `reportingBenefit.media` (etc.) as `undefined` against a required prop, so `npx tsc --noEmit` would fail — blocking the plan's own verification gate.
- **Fix:** Made `media` optional on `BenefitSplitProps`, guarded its render branch (`visual ?? (media ? <Image/> : null)`), and removed the now-orphaned `media={...benefit.media}` prop from the 6 BenefitSplit call-sites. Safe because no BenefitSplit anywhere renders without a live `visual` (verified by grep: zero `media=` props lack a sibling `visual=`).
- **Files modified:** src/components/sections/BenefitSplit.tsx, src/app/page.tsx, src/app/platform/reporting/page.tsx, src/app/platform/placement/page.tsx, src/app/platform/optimization/page.tsx, src/app/platform/issues/page.tsx, src/app/solutions/page.tsx
- **Verification:** `npx tsc --noEmit` exits 0; eslint clean on all modified files.
- **Committed in:** 55de569 (Task 1 commit)

---

**Total deviations:** 1 auto-fixed (1 blocking)
**Impact on plan:** Necessary to satisfy the plan's own `tsc` gate and to genuinely remove the vestigial references (the stated objective). No scope creep — the change is confined to the dead-fallback surface and is structurally safe (no BenefitSplit relies on `media`).

## Issues Encountered
None.

## Threat Surface
No new security-relevant surface introduced. T-10-07 (blank section) mitigated by the per-file live-`visual` precondition check plus tsc and unchanged render specs. T-10-08 (asset tampering) mitigated: the PNG and the hero use are confirmed intact.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Phase 13 (visual-system consolidation) and any future grep for `dashboard-dark.png` now return only the intentional `HomepageHero.tsx` use.
- The PNG file and the hero reference remain for Phase 15 (homepage flagship capstone) to resolve.

## Self-Check: PASSED

All claimed files exist (6 content modules + BenefitSplit.tsx + SUMMARY.md) and the Task 1 commit `55de569` is present in history.

---
*Phase: 10-foundation*
*Completed: 2026-06-05*
