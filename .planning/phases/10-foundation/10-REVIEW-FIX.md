---
phase: 10-foundation
fixed_at: 2026-06-05T00:00:00Z
review_path: .planning/phases/10-foundation/10-REVIEW.md
iteration: 1
findings_in_scope: 4
fixed: 3
skipped: 1
status: partial
---

# Phase 10: Code Review Fix Report

**Fixed at:** 2026-06-05T00:00:00Z
**Source review:** .planning/phases/10-foundation/10-REVIEW.md
**Iteration:** 1

**Summary:**
- Findings in scope: 4 (WR-01, WR-02, WR-03, WR-04)
- Fixed: 3
- Skipped: 1

## Fixed Issues

### WR-01: Duplicate SVG gradient ids in `AreaLine` collide when a page renders more than one area chart

**Files modified:** `src/components/product/visuals/parts.tsx`
**Commit:** 90947b6
**Applied fix:** Added `React.useId()` in `AreaLine` and derived `fillId`/`glowId` from it. The `<linearGradient>` and `<radialGradient>` ids and their `fill={url(#...)}` references now use the instance-unique ids, so two area charts on one page no longer emit duplicate DOM ids (clears the axe-core `duplicate-id` risk and the `url(#id)` first-match resolution bug). Verified via Tier 1 re-read and project-wide `tsc --noEmit` (no errors in the file).

### WR-02: `Schematic` silently drops edges that reference an unknown node id

**Files modified:** `src/components/product/visuals/Schematic.tsx`
**Commit:** 1242f04
**Applied fix:** Replaced the bare `if (!from || !to) return null;` early return with a development-only `console.warn` that names the offending `edge.from -> edge.to` before returning null. Production behavior is unchanged (guarded by `process.env.NODE_ENV !== "production"`); payload typos now surface at author time. Verified via Tier 1 re-read and `tsc --noEmit` (no errors in the file).

### WR-03: `Console` / `DataStory` `barTone` has a dead final branch and drops `neutral` silently

**Files modified:** `src/components/product/visuals/Console.tsx`, `src/components/product/visuals/DataStory.tsx`
**Commit:** dd4e8ee
**Applied fix:** Collapsed the dead `tone === "indigo" ? "indigo" : undefined` ternary in both `barTone` implementations to a single condition (`tone === "success" || tone === "warning" || tone === "indigo" ? tone : undefined`) and added a comment documenting that `neutral`/undefined fall back to `ValueBar`'s default indigo tone. Behavior is identical to the prior code (both forms map `neutral`/undefined to `undefined`); this is the minimal correctness-and-intent fix from the review, not a behavior change, so no separate human verification is required. Verified via Tier 1 re-read and `tsc --noEmit` (no errors in either file).

## Skipped Issues

### WR-04: Route-JS budget guard is wired but non-blocking (provisional 300 KB ceiling)

**File:** `scripts/check-route-js-budget.sh:26-29`, `.github/workflows/perf.yml:24-25`
**Reason:** Deferred to a human action. The fix requires capturing the measured `First-Load-JS` value from the first green CI run and pinning `ROUTE_JS_BUDGET_BYTES` to that value times 1.1. `next build` does not bind/complete in this sandbox, so the real baseline cannot be measured here. Inventing a number would defeat the guard's purpose. Action for the developer: after the first green CI build, read the `PASS / First-Load-JS: <N> bytes` line the script prints, set `ROUTE_JS_BUDGET_BYTES` to `N * 1.1`, and record the pinned number in the phase SUMMARY. Until then the gate stays informational.
**Original issue:** The provisional ~300 KB ceiling sits far above the real post-5.3 baseline, so a `/` First-Load-JS regression (e.g. an eager Framer/archetype import on the shared chunk) could land under 300 KB and slip through, leaving the guard's stated job unenforced.

---

_Fixed: 2026-06-05T00:00:00Z_
_Fixer: Claude (gsd-code-fixer)_
_Iteration: 1_
