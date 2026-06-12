# Phase 11: Platform Deep-Dive Visuals Perf + A11y Verification Evidence

**Plan:** 11-05 (perf + a11y verification gate)
**Status:** GATE CONFIGURED + ENFORCED; live measurement DEFERRED-TO-CI (Connor's decision, 2026-06-06)
**Branch:** phase-11 deep-dive-visuals (worktree)
**Created:** 2026-06-05

This document records the verification gate configuration for the 4 platform
deep-dive routes after the archetype visuals from 11-01..11-04 landed, and the
per-route results that must be captured on a Vercel preview / CI run. Numbers are
left as DEFERRED-TO-CI slots (value cells marked `_ci_`) to be filled from the
preview/CI run; they are not fabricated locally because `next start` / LHCI hang
in this sandbox (project memory), so the live collection runs in CI / against the
preview only.

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

## Decision: DEFER TO CI (Connor, 2026-06-06)

The gate is configured and enforced in `lighthouserc.json` (per-route CLS, TBT,
collection of all 4 routes) and `a11y.yml` (axe-core over `ROUTES`). The live
per-route numbers, the 5 Playwright specs, axe-core on the 4 routes, and the
D-02 / D-05 visual review cannot be gathered in this sandbox (`next dev` /
`next start` and the LHCI collection hang locally), so they are recorded from the
phase PR's CI run and Vercel preview. This mirrors the Phase 10 precedent, where
the perf + a11y runtime checks were tracked as human-UAT pending CI (see
`.planning/phases/10-foundation/10-VERIFICATION.md`, "Human Verification
Required", items 1 to 5, all confirmed green once the PR ran).

The result tables below stay structured with status DEFERRED-TO-CI; the person
recording the PR run fills the value cells from the CI / preview output.

## How to gather the evidence (Task 2, on a Vercel preview / CI)

Deploy a Vercel preview from the phase branch (or read the phase PR's CI run),
then:

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

## Results, per-route (DEFERRED-TO-CI)

Status legend: **DEFERRED-TO-CI** = the gate is in place and enforced; the value
is to be recorded from the phase PR's CI run / Vercel preview. No number is
fabricated locally.

How to record: trigger the phase PR (or re-run the `perf` + `a11y` workflows).
LHCI numbers come from the `perf.yml` LHCI step (devtools throttling, median of
5) at the temporary-public-storage report URL it prints. Playwright + axe numbers
come from `a11y.yml` (`npm run build` then `npm run test:e2e`), or run the suite
against a deployed preview with
`PLAYWRIGHT_BASE_URL=<preview-url> npx playwright test`.

### LHCI (devtools throttling, mobile, median of 5)

| Route | LCP (ms) | LCP < 2500 | CLS | CLS < 0.1 | TBT (ms) | TBT <= 240 | Status |
|-------|----------|------------|-----|-----------|----------|------------|--------|
| `/platform/placement` | _ci_ | _ci_ | _ci_ | _ci_ | _ci_ | _ci_ | DEFERRED-TO-CI |
| `/platform/optimization` | _ci_ | _ci_ | _ci_ | _ci_ | _ci_ | _ci_ | DEFERRED-TO-CI |
| `/platform/issues` | _ci_ | _ci_ | _ci_ | _ci_ | _ci_ | _ci_ | DEFERRED-TO-CI |
| `/platform/reporting` | _ci_ | _ci_ | _ci_ | _ci_ | _ci_ | _ci_ | DEFERRED-TO-CI |

### Playwright suite (CI build, or preview via PLAYWRIGHT_BASE_URL)

| Spec | Routes covered | Pass count | Status |
|------|----------------|-----------|--------|
| `platform-visuals.spec.ts` | all 4 platform routes | _ci_ | DEFERRED-TO-CI |
| `reveal-fail-open.spec.ts` | VISUAL_ROUTES | _ci_ | DEFERRED-TO-CI |
| `reduced-motion.spec.ts` | VISUAL_ROUTES | _ci_ | DEFERRED-TO-CI |
| `hero-gsap-free-mobile.spec.ts` | VISUAL_ROUTES @ 412x823 | _ci_ | DEFERRED-TO-CI |
| `platform-mobile.spec.ts` | homepage handoff contract | _ci_ | DEFERRED-TO-CI |

Known pre-existing main failure to note as a non-regression:
`container-query-layouts.spec.ts:17`.

### axe-core (no critical violations)

| Route | Critical violations | Status |
|-------|---------------------|--------|
| `/platform/placement` | _ci_ | DEFERRED-TO-CI |
| `/platform/optimization` | _ci_ | DEFERRED-TO-CI |
| `/platform/issues` | _ci_ | DEFERRED-TO-CI |
| `/platform/reporting` | _ci_ | DEFERRED-TO-CI |

### Visual + parity + distinctness review (D-02 / D-05)

Recorded by Connor on the Vercel preview when the phase PR deploys.

| Check | Result |
|-------|--------|
| Every accordion item shows a real archetype visual (no text placeholder) | DEFERRED-TO-CI (preview review) |
| Flagship operable by mouse / keyboard / touch on all 4 routes | DEFERRED-TO-CI (preview review) |
| All values visible before hover | DEFERRED-TO-CI (preview review) |
| No two visuals across the 4 pages read alike (D-02) | DEFERRED-TO-CI (preview review) |
| Reduced-motion: same data visible, no motion (D-05 parity) | DEFERRED-TO-CI (preview review) |

## Governance surfacing (D-10, for the PR description)

- `[CLAIMS REVIEW]`: each numeric payload block across the 4 routes carries the
  tag (placement, optimization, issues, reporting accordion + flagship payloads).
- `[COI REVIEW]`: every vendor-network / cross-vendor caption carries the tag;
  all framing stays agency-network-agnostic (CLAUDE.md §6). Andrew's standing
  D-10 clearance covers the framing; tags kept for audit, non-blocking this phase.
- No client names or logos (CLAUDE.md §15). No em dashes in any changed file.

## Sign-off (tracked pending CI/human-verify, per the defer-to-CI decision)

- [ ] LHCI green on all 4 platform routes (LCP < 2.5s, CLS < 0.1, TBT <= 240ms): DEFERRED-TO-CI
- [ ] Full Playwright suite green (no new failures vs main): DEFERRED-TO-CI
- [ ] axe-core: no critical violations on the 4 platform routes: DEFERRED-TO-CI
- [ ] Visual + parity + distinctness review passes (D-02 / D-05): DEFERRED-TO-CI (Connor, preview)
- [ ] Connor: "approved" on the preview: DEFERRED-TO-CI

**Sandbox note:** the live LHCI collection, the Playwright build/run, and the
axe-core run are DEFERRED-TO-CI because `next dev` / `next start` and the LHCI
collection hang in this sandbox; `tsc --noEmit` and `eslint` run clean locally
and gate the config change. The gate itself ships now and will block the phase
PR; the numeric confirmation is CI-driven. This doc is the recording surface for
the CI / preview numbers and Connor's sign-off. Precedent: Phase 10 tracked the
same five runtime checks as human-UAT pending CI and they came back green on the
PR run.
