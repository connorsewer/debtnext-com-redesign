---
phase: 05
plan: 01
subsystem: hero-performance
tags: [scaffolding, perf, lhci, next-font-local, ffmpeg, ladder, wave-0]
requires: []
provides:
  - scripts/build-hero-ladder.sh
  - scripts/verify-hero-keyframes.sh
  - src/app/fonts.ts
  - src/app/fonts/GeneralSans-Semibold.woff2
  - next.config.ts AVIF/WebP images.formats
  - lighthouserc.json LHCI gate
  - .github/workflows/perf.yml CI workflow
  - tests/hero/source-ladder.spec.ts (stub)
  - tests/hero/wordmark-self-host.spec.ts (stub)
  - tests/hero/poster-avif-negotiation.spec.ts (stub)
affects:
  - .planning/REQUIREMENTS.md (HERO-01 wording corrected)
  - HANDOFF.md (Wave 0 progress + ladder shape + Decisions locked)
  - .planning/PROJECT.md (Key Decisions row flipped to "In flight")
  - package.json + package-lock.json (@lhci/cli@^0.15.1 dev dep)
tech-stack:
  added:
    - "@lhci/cli@^0.15.1"
  patterns:
    - next/font/local (Pitfall 5: src relative to declaring module)
    - LHCI median-run aggregation (Pitfall 6)
    - ffmpeg per-frame keyframes for scrub fidelity (D-05)
    - AVIF-first content negotiation via Sharp (Pattern 2)
key-files:
  created:
    - scripts/build-hero-ladder.sh
    - scripts/verify-hero-keyframes.sh
    - src/app/fonts.ts
    - src/app/fonts/GeneralSans-Semibold.woff2
    - lighthouserc.json
    - .github/workflows/perf.yml
    - tests/hero/source-ladder.spec.ts
    - tests/hero/wordmark-self-host.spec.ts
    - tests/hero/poster-avif-negotiation.spec.ts
    - .planning/phases/05-hero-performance/.woff2-sha256.txt
    - .planning/phases/05-hero-performance/deferred-items.md
  modified:
    - .planning/REQUIREMENTS.md
    - next.config.ts
    - HANDOFF.md
    - .planning/PROJECT.md
    - package.json
    - package-lock.json
decisions:
  - "Ladder shape 720p / 540p / 360p (not 480p / 720p / 1080p) because source asset is 1280×720 (ffprobe-verified); 720p is the anchor, no upscaling"
  - "Every ladder variant per-frame-keyframed (-g 1 -keyint_min 1) per D-05 to keep GSAP scrub smooth regardless of which variant the browser picks"
  - "LHCI gate at 2300ms median LCP on / only (D-08): 200ms headroom under CLAUDE.md §12's 2500ms public contract"
  - "@lhci/cli installed without an `lhci` npm script; CLI is invoked via npx --no-install lhci autorun per the perf.yml workflow"
  - "minimumCacheTTL: 2678400 (31 days) in next.config.ts: hero asset is stable, optimizer runs at most monthly per request"
  - "woff2 lives at src/app/fonts/, NOT public/fonts/ (Pitfall 5: next/font/local resolves src relative to declaring module)"
  - "Spec stubs use test.skip() with TODO comments naming the Wave 1 plan that fills them (Plans 02/03/04)"
metrics:
  tasks_completed: 12
  commits: 12
  duration: "~75 minutes"
  files_created: 11
  files_modified: 6
  completed: "2026-05-21T15:10:44Z"
---

# Phase 5 Plan 01: Hero performance Wave 0 scaffolding — Summary

Scaffolding for Phase 5 hero performance: encoder/audit scripts, self-hosted General Sans woff2, AVIF/WebP Next config, LHCI gate config + CI workflow, and three Playwright spec stubs. Unblocks Plans 02/03/04 to run in parallel.

## What shipped

**REQUIREMENTS.md correction (Task 1, BLOCKING):**
- HERO-01 wording amended from "480p / 720p / 1080p MP4 plus a WebM fallback" to "720p / 540p / 360p MP4 plus a VP9 WebM fallback at each tier". Source asset is 1280×720 (ffprobe-verified); 720p is the anchor with no upscaling. Mobile (≤767px) stays video-free per D-04.

**Encoder + audit scripts (Tasks 3-4):**
- `scripts/build-hero-ladder.sh` (executable, 73 lines): reads `public/hero/homepage-hero.mp4` and emits 6 variants (720p/540p/360p × {MP4 H.264, WebM VP9}) with per-frame keyframes. Embedded ffprobe loop verifies `nb_key_frames == nb_frames` before exit. Hardcoded INPUT path; no user args (T-TAMP-01).
- `scripts/verify-hero-keyframes.sh` (executable, 39 lines): standalone audit for the 6 ladder variants. Exits 1 with diagnostic when any is missing or under-keyframed. Pre-Plan-02 exits 1 with 6 MISSING lines (expected state).

**Font self-hosting (Tasks 5-6):**
- `src/app/fonts/GeneralSans-Semibold.woff2` downloaded from Fontshare CDN over HTTPS. 23,092 bytes. Identified by `file(1)` as "Web Open Font Format (Version 2), TrueType".
  - **sha256:** `94a2a0e1ef59728eb65498ed7fe26e5af7e2858a3a4a278a89ac1f83a0544945`
  - Recorded to `.planning/phases/05-hero-performance/.woff2-sha256.txt` per T-V10-01.
- `src/app/fonts.ts` exports `generalSans` via `next/font/local` with weight 600, display swap, `variable: "--font-general-sans"`, and `adjustFontFallback: "Arial"`. Located at `src/app/fonts/` (NOT `public/fonts/`) per Pitfall 5.

**Next.js image config (Task 7):**
- `next.config.ts` declares `images.formats: ["image/avif", "image/webp"]` (AVIF first per Sharp content-negotiation order) and `minimumCacheTTL: 2678400` (31 days). `npm run build` exits 0 on the new config.

**LHCI gate (Tasks 8-9):**
- `lighthouserc.json` at repo root: 3-run median LCP gate on `/` only, throttling matched to `docs/m4-perf-baseline.md` exactly (412×823 viewport, deviceScaleFactor 1.75, cpuSlowdownMultiplier 4, simulate throttling). Single assertion: `largest-contentful-paint maxNumericValue 2300 aggregationMethod median-run`. upload.target `temporary-public-storage` (T-INFO-01 accepted).
- `.github/workflows/perf.yml`: runs on every PR + push to main. Steps: checkout, setup-node 20, npm ci, npm run build, `npx --no-install lhci autorun`. Uploads `.lighthouseci` artifact on failure. Direct CLI invocation (not `treosh/lighthouse-ci-action`) so the lighthouserc.json schema stays canonical.

**Playwright spec stubs (Task 10):**
- `tests/hero/source-ladder.spec.ts` — HERO-01 contract; filled by Plan 02
- `tests/hero/wordmark-self-host.spec.ts` — HERO-02 contract; filled by Plan 03
- `tests/hero/poster-avif-negotiation.spec.ts` — HERO-03 contract; filled by Plan 04
Each uses `test.skip()` with TODO comments embedding the exact assertion contract. `npx playwright test tests/hero/` exits 0 with 3 skipped.

**Dep install (Task 2):**
- `@lhci/cli@^0.15.1` added to devDependencies. `npx --no-install lhci --version` prints `0.15.1`. No `lhci` npm script added; CLI is invoked via `npx --no-install lhci autorun` from `perf.yml`.

**Per-commit docs (Task 12):**
- HANDOFF.md: Phase 5 phase-map row corrected to 720p/540p/360p; new "Phase 5 Wave 0 progress (2026-05-21)" paragraph; new "Decisions locked" bullet recording the ladder shape, LHCI gate threshold, and woff2 self-host posture.
- `.planning/PROJECT.md` Key Decisions row "Defer hero MP4 perf fix to M5" flipped from "Pending (M5 scope)" to "In flight (Phase 5 Wave 0 scaffolding shipped 2026-05-21)".
- `.planning/STATE.md` intentionally NOT updated in this worktree per orchestrator parallel-execution contract; the orchestrator owns STATE.md writes after the wave merges back.

## Verification results (Task 11)

| Check | Result | Notes |
|------|--------|-------|
| `npm run typecheck` | exit 1 | Pre-existing error in `tests/responsive/reduced-motion.spec.ts:6` (TS2353 on `reducedMotion` fixture). NOT introduced by Plan 01; logged in `deferred-items.md`. |
| `npm run lint` | exit 1 | Pre-existing react-hooks/immutability error in `src/components/sections/HomepageHandoffSection.tsx:92`. Plan 01 stub warnings already cleaned up in commit `019c881`. |
| `npm run build` | exit 0 | Build green on new next.config.ts. The expected `priority` deprecation warning from HomepageHero.tsx (Plan 04 fixes this) is present and accepted. |
| `npx playwright test` | exit 0 | **164 passed, 3 skipped** (the 3 new stubs skip cleanly). |
| `bash scripts/verify-hero-keyframes.sh` | exit 1 | Expected: 6 MISSING lines (ladder binaries don't exist yet; Plan 02 Task 1 builds them). |
| `npx --no-install lhci --version` | exit 0 | Prints `0.15.1`. |

## Deviations from plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Removed unused `{ page }` arg from two stub specs**
- **Found during:** Task 11 lint verification
- **Issue:** ESLint `@typescript-eslint/no-unused-vars` flagged `page` in the two stubs that have empty `test.skip()` bodies (HERO-02 wordmark-self-host, HERO-03 poster-avif-negotiation)
- **Fix:** Replaced `async ({ page }) =>` with `async () =>` in both files. The HERO-01 stub kept the `{ page }` destructure because its body references `page.goto`
- **Files modified:** `tests/hero/wordmark-self-host.spec.ts`, `tests/hero/poster-avif-negotiation.spec.ts`
- **Commit:** `019c881`

**2. [CLAUDE.md §5 compliance] Replaced em dash in REQUIREMENTS.md HERO-01 amendment**
- **Found during:** Task 1
- **Issue:** The plan's literal replacement text for HERO-01 contained an em dash ("ffprobe-verified — no upscaling"). CLAUDE.md §5 bans em dashes site-wide; the rule applies to repo docs as much as marketing copy.
- **Fix:** Substituted a comma. Final wording: "Source asset is 1280×720 (verified via ffprobe); 720p is the anchor, no upscaling." All Task 1 grep acceptance criteria still pass (none of them depend on the em dash).
- **Commit:** `e62cd4e`

### Deferred Issues (out of scope per scope-boundary rules)

**1. Pre-existing TypeScript error in `tests/responsive/reduced-motion.spec.ts:6`**
- `TS2353: Object literal may only specify known properties, and 'reducedMotion' does not exist in type 'Fixtures<...>'`
- Verified pre-existing by stashing Plan 01 changes and re-running `npx tsc --noEmit` — same error.
- Likely a Playwright type-shape mismatch (spec authored against an earlier `@playwright/test` version).
- Logged in `.planning/phases/05-hero-performance/deferred-items.md` for future maintenance pass.

**2. Pre-existing lint error in `src/components/sections/HomepageHandoffSection.tsx:92`**
- `react-hooks/immutability: 'activeIdRef' cannot be modified`
- Unrelated to Phase 5 scope; will be addressed in a future phase or maintenance pass.

## Threat surface scan

No NEW security-relevant surface introduced beyond what the plan's `<threat_model>` already enumerates. Mitigations:
- **T-V10-01** (woff2 tampering): mitigated. Downloaded over HTTPS, identified by `file(1)`, size verified > 10000 bytes, sha256 recorded in commit body and audit trail file.
- **T-TAMP-01** (build-hero-ladder.sh injection): mitigated. Script accepts no user args; INPUT path hardcoded.
- **T-V12-01** (repo bisect cost from ladder binaries): accepted; binaries land in Plan 02, not this wave.
- **T-INFO-01** (LHCI temp-public-storage): accepted; marketing-site perf data is non-sensitive.

## Wave 1 unblock confirmation

The following Wave 1 plans can now run **in parallel** against the fixed Wave 0 foundation:

- `05-02-PLAN.md` — HERO-01 wiring (runs `scripts/build-hero-ladder.sh`, edits `HomepageHero.tsx` + `homepage-hero.ts`, fills `tests/hero/source-ladder.spec.ts`)
- `05-03-PLAN.md` — HERO-02 self-host (imports `generalSans` from `src/app/fonts.ts`, removes Fontshare `@import` from `globals.css`, fills `tests/hero/wordmark-self-host.spec.ts`)
- `05-04-PLAN.md` — HERO-03 AVIF poster (migrates `<Image priority>` to `preload + fetchPriority="high"`, fills `tests/hero/poster-avif-negotiation.spec.ts`)

`05-05-PLAN.md` — perf gate trip — waits on all three Wave 1 plans.

## Self-Check: PASSED

All 11 claimed files verified present on disk. All 12 claimed commit hashes (e62cd4e, 394049a, a361297, a5b6794, 1a75c5f, a242b5c, 755e687, 90c36fc, 5215be9, 9f8cd41, 019c881, 09f31af) verified in `git log`. Working tree clean.
