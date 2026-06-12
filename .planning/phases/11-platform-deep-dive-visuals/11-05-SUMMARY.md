---
phase: 11-platform-deep-dive-visuals
plan: 05
subsystem: ci-perf-a11y
tags: [lhci, cls, axe, playwright, verification-gate, defer-to-ci]

# Dependency graph
requires:
  - phase: 11-platform-deep-dive-visuals
    plan: 01
    provides: "Per-route CLS<0.1 LHCI gate for /platform/placement; FlagshipSkeleton min-h-[44rem] CLS pattern; route-parameterized platform-visuals.spec.ts"
  - phase: 11-platform-deep-dive-visuals
    plan: 04
    provides: "All 4 platform deep-dive routes wired with real archetype visuals + Explorable flagships; platform-visuals.spec.ts covers all 4 routes"
  - phase: 10-foundation
    provides: "lighthouserc.json devtools-throttled collection + TBT assertMatrix; axe-routes.spec.ts over ROUTES; a11y.yml + perf.yml CI workflows; reveal-fail-open / reduced-motion / hero-gsap-free-mobile specs over VISUAL_ROUTES"
provides:
  - "Per-route CLS<0.1 LHCI gate extended to all 4 platform deep-dive routes (optimization/issues/reporting added alongside placement)"
  - "lighthouserc.json collects all 4 platform routes (collect.url) so LCP/CLS/TBT are measured per-route in CI"
  - "11-PERF-A11Y-EVIDENCE.md: the recording surface for the per-route LHCI + Playwright + axe + D-02/D-05 results, marked DEFERRED-TO-CI"
affects: [13-visual-system-consolidation]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Per-route CLS<0.1 assertMatrix entry co-located with each platform route's collection (mirrors the 11-01 placement gate)"
    - "Live perf/a11y verification recorded as DEFERRED-TO-CI in an evidence doc rather than run in the hanging sandbox (Phase 10 human-UAT-pending-CI precedent)"

key-files:
  created:
    - ".planning/phases/11-platform-deep-dive-visuals/11-PERF-A11Y-EVIDENCE.md"
  modified:
    - "lighthouserc.json"
    - "HANDOFF.md"

key-decisions:
  - "DEFER TO CI (Connor, 2026-06-06): the gate ships and enforces; the live per-route LCP/CLS/TBT, the 5 Playwright specs, axe-core, and the D-02/D-05 visual review are recorded from the phase PR's CI run / Vercel preview, not fabricated in the hanging sandbox"
  - "Per-route gate mirrors placement exactly (CLS<0.1 only); LCP<2.5s recorded as a measured CI value rather than added as a new hard ceiling, matching the 11-01 placement gate shape and the plan's no-pre-widening Task 1 acceptance criteria"
  - "Inherited TBT ceilings (450ms /, 240ms elsewhere) and throttlingMethod: devtools left unchanged; no ceiling loosened"

requirements-completed: [PLATVIS-01, PLATVIS-02, PLATVIS-03]

# Metrics
duration: ~30min (incl. checkpoint round-trip + defer-to-CI completion)
completed: 2026-06-06
tasks: 2
files: 3
commits: 3
---

# Phase 11 Plan 05: Platform Perf + A11y Verification Gate Summary

**The per-route CLS<0.1 LHCI gate now covers all 4 platform deep-dive routes and the evidence doc records the full perf + a11y verification surface as DEFERRED-TO-CI; Phase 11 Success Criterion 4 is structurally satisfied (the gate exists and will block the phase PR), with the numeric confirmation CI-driven.**

## Performance

- **Duration:** ~30 min wall (Task 1 config + commit, checkpoint round-trip, defer-to-CI completion)
- **Completed:** 2026-06-06
- **Tasks:** 2 (Task 1 auto; Task 2 was a blocking human-verify checkpoint, resolved by Connor's defer-to-CI decision)
- **Files modified:** 3 (1 created, 2 modified)
- **Commits:** 3

## Accomplishments

- **Extended the per-route CLS gate to all 4 platform routes (Task 1):** `lighthouserc.json` `collect.url` now includes `/platform/optimization`, `/platform/issues`, and `/platform/reporting` alongside the already-collected `/platform/placement` (plus `/` and `/solutions/utilities`). Each of the 4 platform routes carries its own `cumulative-layout-shift` `maxNumericValue: 0.1` assertMatrix entry (median over 5 devtools-throttled runs), mirroring the 11-01 placement gate. The inherited TBT ceilings (450ms on `/`, 240ms on every other route) and `throttlingMethod: devtools` were left intact and not loosened. The optimization gate that 11-02 flagged as "still to be added" is now in place.
- **Recorded the verification surface (Task 2):** `11-PERF-A11Y-EVIDENCE.md` captures what the gate enforces and the structured per-route slots for the LHCI numbers, the 5 Playwright specs (`platform-visuals`, `reveal-fail-open`, `reduced-motion`, `hero-gsap-free-mobile`, `platform-mobile`), axe-core on the 4 routes, and the D-02/D-05 visual review. Each slot is marked DEFERRED-TO-CI with a "how to record" note pointing at the `perf.yml` / `a11y.yml` workflows and the `PLAYWRIGHT_BASE_URL=<preview>` command. No numbers are fabricated.
- **HANDOFF kept in sync:** a Phase 11-05 note records the gate extension and the deferred measurement, closing the loop on the 11-02 "still to be added" flag.

## Task Commits

1. **Task 1: Extend LHCI to all 4 platform routes** - `cc53a11` (perf): `lighthouserc.json` + `HANDOFF.md`
2. **Task 2 (config artifact): Add the perf + a11y evidence doc** - `1515c86` (docs): `11-PERF-A11Y-EVIDENCE.md` created with the gate config + pending-measurement structure
3. **Task 2 (defer-to-CI completion): Mark the evidence slots DEFERRED-TO-CI + this SUMMARY** - committed in the final atomic commit below

_Task 2 was a `checkpoint:human-verify` (gate="blocking"). The live LHCI / Playwright / axe collection cannot run in this sandbox (`next start` and the LHCI collection hang, per project memory), so the checkpoint resolved via Connor's explicit defer-to-CI decision rather than an in-sandbox run._

## Files Created/Modified

- `lighthouserc.json` - 3 platform routes added to `collect.url`; 3 new per-route `cumulative-layout-shift < 0.1` assertMatrix entries (optimization/issues/reporting) mirroring placement; TBT + throttling unchanged. Valid JSON.
- `.planning/phases/11-platform-deep-dive-visuals/11-PERF-A11Y-EVIDENCE.md` - The recording surface: gate config, the defer-to-CI decision, "how to record" notes, and DEFERRED-TO-CI result tables for LHCI / Playwright / axe / visual review.
- `HANDOFF.md` - Phase 11-05 docs-in-sync note recording the gate extension and the deferred measurement.

## Success Criterion 4 status

Phase 11 Success Criterion 4 ("LHCI holds the perf budget and all existing Playwright specs stay green after the visuals land") is **structurally satisfied**: the per-route CLS gate exists for all 4 platform routes, LHCI collects all 4 so LCP/CLS/TBT are measured per-route, axe-core runs over `ROUTES` (which includes all 4) in `a11y.yml`, and the 5 Playwright specs cover the routes. The gate will block the phase PR on any regression. The numeric confirmation (per-route LCP/CLS/TBT, spec pass counts, axe violations, Connor's D-02/D-05 visual review) is a tracked **pending CI/human-verify** item recorded in `11-PERF-A11Y-EVIDENCE.md`, following the Phase 10 precedent where the same five runtime checks were tracked as human-UAT pending CI and confirmed green on the PR run.

## Decisions Made

- **DEFER TO CI (Connor, 2026-06-06):** live numbers cannot be gathered in this sandbox; they are measured by the phase PR's CI run / Vercel preview. The evidence doc is the recording surface; no numbers fabricated.
- **Per-route gate mirrors placement (CLS<0.1 only):** LCP<2.5s (CLAUDE.md §12 content-route floor) is recorded as a measured CI value rather than added as a new hard assertMatrix ceiling, matching the 11-01 placement gate shape and the plan's Task 1 acceptance criteria (which check only for the 4 routes in collect.url, TBT + throttling intact, valid JSON, and explicitly say not to pre-widen ceilings).
- **No ceiling loosened:** TBT (450ms /, 240ms elsewhere) and devtools throttling left exactly as inherited from Phase 10.

## Deviations from Plan

None affecting scope. The plan's Task 2 is a blocking human-verify checkpoint; under the sandbox constraint the live run is impossible locally, so it resolved via Connor's defer-to-CI decision (which the plan and the executor prompt both anticipated as the human-action/human-verify path). The worktree base was reset at start from `6281c7a` (a pre-Phase-11 commit) to the planned base `36d3fea` (Wave 1 + Wave 2 complete) so the phase 11 plan + context + the placement gate were present; this is branch-setup hygiene, not a code deviation.

## Governance

- `[CLAIMS REVIEW]` / `[COI REVIEW]`: this plan adds no copy and no numeric payloads; it only extends the CI gate and records evidence. The D-10 governance surfacing for the 4 routes' payloads (authored in 11-01..11-04) is recapped in the evidence doc for the PR description.
- No client names or logos. No em dashes in any changed file. Sentence-case headings, digits, contractions per CLAUDE.md §5.

## Known Stubs

None. This plan is a CI-config + evidence-doc plan; no UI or data surface. The DEFERRED-TO-CI slots are not stubs (they are tracked pending-measurement records under an explicit defer decision), and they do not block the phase goal (the gate is live and enforcing).

## Verification

- `node -e "JSON.parse(...)"` on `lighthouserc.json` exits 0 (valid JSON).
- All 4 platform routes present in `collect.url` and each has a per-route CLS<0.1 assertMatrix entry; TBT + `throttlingMethod: devtools` intact (grep-confirmed).
- 0 em dashes across `lighthouserc.json`, the evidence doc, and the HANDOFF additions.
- DEFERRED-TO-CI: per-route LHCI LCP/CLS/TBT, the 5 Playwright specs, axe-core on the 4 routes, and Connor's D-02/D-05 visual review run on the phase PR's CI / Vercel preview and are recorded in `11-PERF-A11Y-EVIDENCE.md`.

## Self-Check: PASSED

- FOUND: `.planning/phases/11-platform-deep-dive-visuals/11-PERF-A11Y-EVIDENCE.md`
- FOUND: `lighthouserc.json` modification (4 routes collected, per-route CLS entries)
- FOUND commit `cc53a11` (Task 1), `1515c86` (evidence doc); final atomic commit carries the evidence-doc update + this SUMMARY.
- Valid JSON; TBT + throttling intact; 0 em dashes across all changed files and this SUMMARY.

---
*Phase: 11-platform-deep-dive-visuals*
*Completed: 2026-06-06*
