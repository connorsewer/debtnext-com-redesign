# Phase 11: Platform Deep-Dive Visuals Perf + A11y Verification Evidence

**Plan:** 11-05 (perf + a11y verification gate)
**Status:** GATE CONFIGURED; measurement DEFERRED-TO-PREVIEW/CI (awaiting Connor sign-off)
**Branch:** phase-11 deep-dive-visuals (worktree)
**Created:** 2026-06-05

This document records the verification gate configuration for the 4 platform
deep-dive routes after the archetype visuals from 11-01..11-04 landed, and the
per-route results that must be captured on a Vercel preview / CI run. Numbers are
left as `PENDING` slots to be filled from the preview/CI run; they are not
fabricated locally because `next start` / LHCI hang in this sandbox (project
memory), so the live collection runs in CI / against the preview only.

## What was built across 11-01..11-04 (the payload under test)

19 accordion archetype visuals + 4 Explorable-composed flagships across the 4
platform deep-dive pages, all fed typed real-shaped payloads:

| Route | Accordion archetypes | Flagship (BenefitSplit) |
|-------|----------------------|-------------------------|
| `/platform/placement` | 5 items (decision-engine Console, vendor-pools / recall Schematic, business-rules Console, reconciliation Data-story) | `PlacementFlagship` (Explorable Console) |
| `/platform/optimization` | 4 items (bands / history Data-story, share / bonus Console) | `OptimizationFlagship` (Explorable Console) |
| `/platform/issues` | 5 items (per 11-ARCHETYPE-MAP) | `IssuesFlagship` (Explorable Console) |
| `/platform/reporting` | 5 items (inventory / sla Console, vendor / cost / activity Data-story) | `ReportingFlagship` (Explorable Console) |

All flagships reuse the 11-01-locked `FlagshipSkeleton` (`min-h-[44rem]` = 704px)
so the lazy chunk resolves with no layout shift.

## Gate configuration (this plan, Task 1)

`lighthouserc.json` now collects all 4 platform deep-dive routes and asserts a
per-route CLS ceiling on each, mirroring the 11-01 placement gate:

- **collect.url** adds `/platform/optimization`, `/platform/issues`,
  `/platform/reporting` alongside the already-collected `/platform/placement`
  (plus `/` and `/solutions/utilities`).
- **Per-route CLS gate:** each of the 4 platform routes has an `assertMatrix`
  entry asserting `cumulative-layout-shift` `maxNumericValue: 0.1`,
  `aggregationMethod: median-run` (median over 5 runs).
- **Inherited, unchanged (not loosened):** `total-blocking-time` ceilings of
  450ms on `/` and 240ms on every other route; `throttlingMethod: devtools`;
  mobile screen emulation at 412x823, deviceScaleFactor 1.75, 4x CPU slowdown,
  slow-4G throttle.

LCP under 2.5s (CLAUDE.md §12 content-route floor) is recorded as a measured
value below rather than as a new hard assertMatrix ceiling, matching the
placement gate shape (CLS-only per route) and the plan's Task 1 acceptance
criteria (do not pre-widen or add ceilings preemptively).

## How to gather the evidence (Task 2, on a Vercel preview / CI)

Deploy a Vercel preview from the phase branch, then:

1. **LHCI** (CI / preview, devtools throttling, median of 5): confirm each of the
   4 platform routes holds LCP < 2.5s, CLS < 0.1, total-blocking-time <= 240ms.
   Record per-route numbers in the table below.
2. **Playwright** against the preview via `PLAYWRIGHT_BASE_URL`:
   `npx playwright test`, confirm `platform-visuals`, `reveal-fail-open`,
   `reduced-motion`, `hero-gsap-free-mobile`, and `platform-mobile` all pass.
   Record pass counts; note the known pre-existing main failure
   (`container-query-layouts.spec.ts:17`) as a non-regression, not a new break.
3. **axe-core** on the 4 platform routes (the `tests/a11y/axe-routes.spec.ts`
   spec runs over `ROUTES`, which includes all 4 platform pages; CI runs it via
   `a11y.yml` -> `npm run test:e2e`). Confirm no critical violations.
4. **Visual review** of each platform route on the preview: every accordion item
   shows a real archetype visual (no "Visual" text placeholder); the BenefitSplit
   flagship is operable by mouse, keyboard (Tab + Enter/Space/Arrow), and touch;
   all values are visible before any hover; no two visuals across the 4 pages read
   alike (D-02). Toggle `prefers-reduced-motion` and confirm the same data is
   visible with no motion (D-05 parity).

## Results, per-route (PENDING preview/CI run)

### LHCI (devtools throttling, mobile, median of 5)

| Route | LCP (ms) | LCP < 2500 | CLS | CLS < 0.1 | TBT (ms) | TBT <= 240 |
|-------|----------|------------|-----|-----------|----------|------------|
| `/platform/placement` | PENDING | PENDING | PENDING | PENDING | PENDING | PENDING |
| `/platform/optimization` | PENDING | PENDING | PENDING | PENDING | PENDING | PENDING |
| `/platform/issues` | PENDING | PENDING | PENDING | PENDING | PENDING | PENDING |
| `/platform/reporting` | PENDING | PENDING | PENDING | PENDING | PENDING | PENDING |

### Playwright suite (against preview)

| Spec | Routes covered | Pass count | Status |
|------|----------------|-----------|--------|
| `platform-visuals.spec.ts` | all 4 platform routes | PENDING | PENDING |
| `reveal-fail-open.spec.ts` | VISUAL_ROUTES | PENDING | PENDING |
| `reduced-motion.spec.ts` | VISUAL_ROUTES | PENDING | PENDING |
| `hero-gsap-free-mobile.spec.ts` | VISUAL_ROUTES @ 412x823 | PENDING | PENDING |
| `platform-mobile.spec.ts` | homepage handoff contract | PENDING | PENDING |

Known pre-existing main failure to note as a non-regression:
`container-query-layouts.spec.ts:17`.

### axe-core (no critical violations)

| Route | Critical violations | Status |
|-------|---------------------|--------|
| `/platform/placement` | PENDING | PENDING |
| `/platform/optimization` | PENDING | PENDING |
| `/platform/issues` | PENDING | PENDING |
| `/platform/reporting` | PENDING | PENDING |

### Visual + parity + distinctness review (D-02 / D-05)

| Check | Result |
|-------|--------|
| Every accordion item shows a real archetype visual (no text placeholder) | PENDING |
| Flagship operable by mouse / keyboard / touch on all 4 routes | PENDING |
| All values visible before hover | PENDING |
| No two visuals across the 4 pages read alike (D-02) | PENDING |
| Reduced-motion: same data visible, no motion (D-05 parity) | PENDING |

## Governance surfacing (D-10, for the PR description)

- `[CLAIMS REVIEW]`: each numeric payload block across the 4 routes carries the
  tag (placement, optimization, issues, reporting accordion + flagship payloads).
- `[COI REVIEW]`: every vendor-network / cross-vendor caption carries the tag;
  all framing stays agency-network-agnostic (CLAUDE.md §6). Andrew's standing
  D-10 clearance covers the framing; tags kept for audit, non-blocking this phase.
- No client names or logos (CLAUDE.md §15). No em dashes in any changed file.

## Sign-off

- [ ] LHCI green on all 4 platform routes (LCP < 2.5s, CLS < 0.1, TBT <= 240ms)
- [ ] Full Playwright suite green against the preview (no new failures vs main)
- [ ] axe-core: no critical violations on the 4 platform routes
- [ ] Visual + parity + distinctness review passes (D-02 / D-05)
- [ ] Connor: "approved"

**Sandbox note:** the live LHCI collection, the Playwright-against-preview run,
and the axe-core run are DEFERRED-TO-PREVIEW/CI because `next dev` / `next start`
hang in this sandbox; `tsc --noEmit` and `eslint` run clean locally and gate the
config change. This doc is the recording surface for the preview/CI numbers and
Connor's sign-off.
