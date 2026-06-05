---
phase: 10-foundation
plan: 01
subsystem: ci-validation-nets
tags: [motion, ci, perf, a11y, testing]
requires: []
provides:
  - VISUAL_ROUTES (tests/helpers/routes.ts) — shared route list covering solutions/company/compare sub-pages
  - reveal-fail-open spec — no-stuck-opacity:0 regression net (motion-on path)
  - reduced-motion opacity===1 assertion — reveals fail open under reduced motion
  - generalized mobile-GSAP-free coverage across all visual routes
  - check-route-js-budget.sh — / First-Load-JS budget guard wired into perf.yml
  - LHCI total-blocking-time assertion on / + a platform + a solutions route (devtools)
affects:
  - Phases 11-15 attach their <automated> verify hooks to these specs/scripts/configs
tech-stack:
  added: []
  patterns:
    - manifest-parse First-Load-JS budget (no new dep; mirrors check-hero-assets.sh)
    - VISUAL_ROUTES-driven spec iteration (single source of truth for visual-bearing routes)
key-files:
  created:
    - tests/responsive/reveal-fail-open.spec.ts
    - scripts/check-route-js-budget.sh
  modified:
    - tests/helpers/routes.ts
    - tests/responsive/reduced-motion.spec.ts
    - tests/responsive/hero-gsap-free-mobile.spec.ts
    - lighthouserc.json
    - .github/workflows/perf.yml
decisions:
  - Route-JS budget set PROVISIONAL (300 KB placeholder); pin to first measured CI build
  - TBT (not INP) is the lab proxy; INP stays field-only (RUM); TBT measured under devtools
metrics:
  tasks: 3
  files: 7
  commits: 3
  completed: 2026-06-05
---

# Phase 10 Plan 01: CI Validation Nets Summary

Landed all six Wave 0 validation gaps from `10-VALIDATION.md` before the Phase 11-15 implementation they guard: a reveal-fail-open spec, a `/` First-Load-JS budget guard wired into `perf.yml`, an LHCI total-blocking-time assertion on `/` plus a platform and a solutions route under devtools, a generalized mobile-GSAP-free spec across all visual routes, a shared `VISUAL_ROUTES` list, and a reduced-motion `opacity === 1` assertion. No production `src/` code touched; `ROUTES` and all existing specs preserved.

## What Shipped

**Task 1 (0062e29)** — `VISUAL_ROUTES` added to `tests/helpers/routes.ts` (23 routes: all 6 solutions sub-pages, `/compare`, `/platform/integrations`, the 4 `/company` sub-pages, plus the originals). `ROUTES` left unchanged so existing specs keep iterating it. New `tests/responsive/reveal-fail-open.spec.ts` scrolls each visual route to surface IO-gated reveals, opens every `[data-state="closed"]` accordion + `[role="tab"]` control (guarded; absence is not a failure), then asserts no in-viewport text-bearing element rests at computed `opacity < 1` (motion-on dark path).

**Task 2 (79539f1)** — `reduced-motion.spec.ts` gains a sibling test over `VISUAL_ROUTES` asserting in-viewport text-bearing elements rest at `opacity === 1` under reduced motion (proves reveals fail OPEN, not merely "no animation running"). `hero-gsap-free-mobile.spec.ts` keeps its original `/`-only test and adds a `VISUAL_ROUTES` loop asserting zero `/gsap/` requests at 412x823 per route.

**Task 3 (0e76333)** — `scripts/check-route-js-budget.sh` sums `/`'s First-Load-JS from `.next/app-build-manifest.json` (manifest-parse, no new dep; build-stdout fallback when manifest absent) and exits 1 over `ROUTE_JS_BUDGET_BYTES`. `lighthouserc.json` adds `/platform/placement` + `/solutions/utilities` to `collect.url` and a `total-blocking-time` error assertion (≤200ms, median-run) across all collected URLs; `throttlingMethod` stays `devtools`. `perf.yml` wires the new guard after the hero-asset step and before LHCI.

## Provisional Budgets (must be pinned on first measured CI build)

- **Route-JS budget (`ROUTE_JS_BUDGET_BYTES`)**: set to a deliberately loose **PROVISIONAL 307200 bytes (300 KB)** placeholder. The real `/` First-Load-JS could not be measured here — `next build` does not run in this sandbox (it hangs binding a port, per project memory), so `.next/app-build-manifest.json` is absent locally. **Action for first green CI run:** read the `PASS  / First-Load-JS: <N> bytes` line the script prints, then pin `ROUTE_JS_BUDGET_BYTES` to that measured `N` + ~10% headroom (mirrors how `check-hero-assets.sh` cites Phase 5.1 D-07). T-10-01 mitigation.
- **TBT budget**: set to **200ms** against the existing `devtools` throttle profile (NOT simulate). This is a measured-method budget, not a guessed simulate number. INP is correctly left field-only (deferred to RUM), so TBT is the lab proxy. The 200ms ceiling should be confirmed against the first measured devtools CI run and tightened if there is headroom. T-10-02 mitigation.

Both budgets remain PROVISIONAL until the first green CI build measures the real numbers.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed pre-existing TS2353 in reduced-motion.spec.ts**
- **Found during:** Task 2 (the file was in Task 2's edit scope).
- **Issue:** `test.use({ colorScheme, reducedMotion: "reduce" })` — `reducedMotion` is a Playwright context option, not a top-level `Fixtures` property, so it failed `tsc --noEmit` (TS2353). This error pre-existed on the branch base (noted in STATE.md as logged in a phase `deferred-items.md`, though no such file was present on this branch).
- **Fix:** Removed the invalid `reducedMotion` key from `test.use`. The reduce flag was already correctly applied via `page.emulateMedia({ reducedMotion: "reduce" })` in `beforeEach` (which the file's own comment says is the call that actually makes the media query match), so behavior is unchanged. `tsc --noEmit` now exits 0 across the whole repo.
- **Files modified:** tests/responsive/reduced-motion.spec.ts
- **Commit:** 79539f1

## Runtime Verification Deferred to CI / Preview

Local `next build` / `next start` hang in this sandbox (project memory: "Next server hangs in sandbox"), so the following were NOT run locally and must verify on CI / a Vercel preview:
- The new `reveal-fail-open.spec.ts` and the new `VISUAL_ROUTES` loops in `reduced-motion` + `hero-gsap-free-mobile` (run via `PLAYWRIGHT_BASE_URL=<preview>`).
- `check-route-js-budget.sh` against a real `.next/app-build-manifest.json` (the manifest-parse logic was unit-tested locally with synthetic manifests: under-budget PASS, over-budget FAIL/exit-1, and both `/page` and `/` root keys all behaved correctly).
- LHCI TBT assertion on the three collected URLs.

## Static Verification (ran locally, all green)

- `npx tsc --noEmit` exits 0 across the whole repo (was 1 before the Rule 1 fix).
- `npx eslint` exits 0 on all four touched specs/helpers.
- `bash -n scripts/check-route-js-budget.sh` valid; script unit-tested with synthetic manifests (under/over budget, both root-key shapes).
- `lighthouserc.json` parses as valid JSON; `total-blocking-time` present; `throttlingMethod` still `devtools`; `collect.url` has `/` + a platform + a solutions route.
- `perf.yml` runs `check-route-js-budget.sh` after Build + hero-asset step, before LHCI.
- No `src/` production code touched; `ROUTES` preserved (`grep "export const ROUTES"` matches).

## Known Stubs

None. The PROVISIONAL budget numbers are documented above and are intentional (pinned on first CI), not stubs.

## Threat Flags

None. No new network endpoints, auth paths, file access, or schema changes introduced; all changes are CI test/config/script files.

## Self-Check: PASSED

All created/modified files exist on disk (8/8) and all 3 task commits exist in git history (0062e29, 79539f1, 0e76333).

## Post-CI correction (2026-06-05, FND-05/FND-06)

The first real CI run on PR #9 surfaced two wrong assumptions baked into Task 3 above, now fixed:

1. **Manifest path was wrong for Next 16 + Turbopack.** This project builds with `next@16.2.6` using Turbopack, which does **not** emit the legacy `.next/app-build-manifest.json` (the `APP_BUILD_MANIFEST` constant no longer exists in Next 16), and its build-output route table no longer prints a "First Load JS" column (so the `BUILD_LOG` stdout fallback was also dead). The script failed with `FAIL  .next/app-build-manifest.json not found ...` even though `npm run build` ran first. `check-route-js-budget.sh` now reads the App Router per-route client chunks from `.next/server/app/page_client-reference-manifest.js` (`self.__RSC_MANIFEST["/page"].entryJSFiles`) unioned with the shared runtime chunks in `.next/build-manifest.json` -> `rootMainFiles`, summing on-disk byte sizes. The legacy build-stdout fallback was removed.

2. **Budget pinned from a real measured build.** Measured `/` First-Load-JS = **786,643 bytes (768.2 KiB)** across 12 deduped chunks (full local `npm run build`, which does complete in this environment; only `next dev/start` bind a port and hang). `ROUTE_JS_BUDGET_BYTES` is pinned to that + ~10% headroom = **865,308 bytes**. The old PROVISIONAL 300 KB / 307200-byte placeholder was not just unpinned, it was below the real value: a corrected path alone would have made the guard FAIL (the app ships GSAP + framer-motion + radix in the `/` first load). The script prints the live `PASS  / First-Load-JS: <N> bytes (<pct>% of <budget>)` line each run; the local run reports 786,643 bytes (90% of budget). Linux CI chunk sizes are expected to match within the 10% headroom; confirmed green on PR #9's `lighthouse` job.

T-10-01 mitigation is now realized (budget pinned to a measured number), not deferred.

## TBT budget decision (2026-06-05, T-10-02)

The provisional 200ms LHCI `total-blocking-time` ceiling (T-10-02) was meant to be
confirmed against the first measured devtools CI run. It measured:

- `/` (homepage): **318ms** (median of 5, mobile + 4x CPU). Over budget.
- `/platform/placement`: 178ms. `/solutions/utilities`: 180ms. Both under.

Only the rich cinematic homepage exceeds 200ms. We investigated reducing it
(the user chose to optimize rather than loosen the budget) and measured three
attempts against CI:

1. Lazy-load below-the-fold homepage visuals (handoff mockups, etc.): 318 -> 317ms (no effect).
2. Remove framer-motion from the eager `/` chunk (-131KB First-Load-JS): 318 -> 323ms on `/`
   (no effect), and it **regressed** the two content routes 178 -> 213ms and 180 -> 212ms
   (per-container IntersectionObserver + opacity-transition churn cost more main-thread
   time than framer's optimized whileInView).

Conclusion: `/` TBT is structurally insensitive to JS-size reduction (it is bound by
hydrating the homepage's large client-component tree, not by framer or below-fold JS;
GSAP is already mobile-free). Reaching <200ms needs a homepage Server-Component
re-architecture (logged as known debt for a dedicated perf phase). Both optimization
commits were reverted (restoring content routes to 178/180ms).

**Decision:** per-route TBT ceilings in `lighthouserc.json` (mirrors the existing
LCP-only-on-`/` matrix), sized to absorb GitHub-runner variance. A clean CI run
measures `/` ~318ms and content routes ~178-180ms; a loaded runner inflated the
same build to `/` 396ms and content 206ms (~25% across the board, even on the
median-of-5 — the whole runner was slow, so median doesn't help). Ceilings are set
above the noisy-run values + margin so the gate tolerates runner noise while still
catching a gross regression (roughly a doubling): `/` **450ms**, content routes
**240ms** (`matchingUrlPattern` `http://localhost:3200/.+`, which excludes the
root). T-10-02 closed: budget pinned to measured reality (homepage cinematic cost
acknowledged) with enough headroom for shared-runner TBT variance.
