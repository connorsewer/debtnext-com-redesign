---
phase: 05
plan: 04
subsystem: hero-performance
tags: [perf, next-image, avif, hero-03, wave-2]
requires:
  - next.config.ts images.formats AVIF/WebP (Plan 01 Wave 0)
  - tests/hero/poster-avif-negotiation.spec.ts stub (Plan 01 Wave 0)
provides:
  - HomepageHero LCP <Image> on Next 16 preload + fetchPriority="high" API
  - tests/hero/poster-avif-negotiation.spec.ts (live; 2 active tests)
affects:
  - HANDOFF.md (Wave 2 HERO-03 progress paragraph)
tech-stack:
  added: []
  patterns:
    - Next 16 <Image> preload + fetchPriority="high" (RESEARCH.md Pattern 2 + Pitfall 3)
    - Playwright Accept-header content negotiation assertion via setExtraHTTPHeaders
key-files:
  created:
    - .planning/phases/05-hero-performance/05-04-SUMMARY.md
  modified:
    - src/components/sections/HomepageHero.tsx
    - tests/hero/poster-avif-negotiation.spec.ts
    - HANDOFF.md
decisions:
  - "Removed `priority` and added BOTH `preload` and `fetchPriority=\"high\"` (not just one) per RESEARCH.md Pattern 2: preload replaces the deprecated alias, fetchPriority is the explicit standard HTML LCP hint Next 16 passes through."
  - "Second <Image> in HomepageHero.tsx (FramedDashboard finale, line 234) intentionally NOT migrated to preload: it sits behind the LCP in z-order and only crossfades in at scroll progress 0.88+. Marking it preload would inject a competing <link rel=\"preload\"> and contend for LCP."
  - "Spec assertion uses lowercase `fetchpriority` (HTML attribute) on getAttribute() even though the React prop is camelCase `fetchPriority`. Next 16 passes the JSX prop through to the rendered <img> HTML attribute (lowercase per the HTML spec)."
  - "Preload-link assertion uses `not.toHaveCount(0)` instead of `toHaveCount(1)` to tolerate multiple preloads (next/font emits one for woff2 from HERO-02, next/image may emit several for srcset)."
  - "STATE.md and ROADMAP.md NOT touched in this worktree per parallel-execution contract; the orchestrator owns those writes after wave-merge."
metrics:
  tasks_completed: 3
  commits: 3
  duration: "~25 minutes"
  files_created: 1
  files_modified: 3
  completed: "2026-05-21T16:15:36Z"
requirements_completed: [HERO-03]
---

# Phase 5 Plan 04: HERO-03 AVIF poster migration — Summary

Complete the LCP-side of the hero perf chain: migrate the homepage hero `<Image>` from the deprecated Next 16 `priority` prop to `preload` + `fetchPriority="high"`, and replace the HERO-03 Playwright spec stub with two live assertions that enforce AVIF content negotiation + the new LCP hint attributes. The `next.config.ts` AVIF/WebP `images.formats` config landed by Plan 01 Task 7 is now exercised end-to-end.

## What shipped

**HomepageHero.tsx 2-line JSX migration (Task 1):**

- Line 176: `priority` → `preload` (Next 16 API rename per RESEARCH.md Pitfall 3; behavior identical, injects `<link rel="preload" as="image">` into `<head>`).
- New line 177: `fetchPriority="high"` (explicit standard-HTML LCP hint passed through by Next 16's `<Image>`).
- The diff is exactly two lines (one deletion, two insertions) inside the `<div ref={startFrameRef}>` cliffside wrapper. The surrounding GSAP `useGSAP` block (lines 56-145), the `<video>` element with its 6 `<source>` children from HERO-01 (lines 189-209), the soft-vignette overlay, the FramedDashboard finale, the headline / subhead / attached form / disclaimer overlay are all untouched.
- The second `<Image>` (`/product/dashboard-dark.png` inside the FramedDashboard finale, lines 234-241) is intentionally left without `preload` because it crossfades in at scroll progress 0.70-0.88 — it is NOT the LCP and must not contend for the preload hint.

**Live HERO-03 spec (Task 2):**

`tests/hero/poster-avif-negotiation.spec.ts` rewritten from `test.skip()` body to a two-test, five-assertion spec under one `test.describe("HERO-03: hero poster AVIF negotiation", ...)` block:

- **Test 1 — AVIF served on `Accept: image/avif` and content-length < 200 KB.** Sets `Accept: image/avif,image/webp,image/png,*/*` via `page.setExtraHTTPHeaders` BEFORE navigation. Waits for the `/_next/image` response whose URL contains `homepage-hero-start`. Asserts `response.status() < 400`, `content-type` contains `image/avif`, and `response.body().byteLength < 200_000` (the HERO-03 byte budget).
- **Test 2 — hero `<Image>` rendered `<img>` has `fetchpriority="high"`.** Locates the first `<img>` inside `section[data-slot=homepage-hero]` (the LCP startFrameRef poster). Asserts `getAttribute("fetchpriority") === "high"` (lowercase HTML attribute). Belt-and-braces assertion: `<head>` contains at least one `<link rel="preload" as="image">` via `not.toHaveCount(0)`.
- Both pass in 12.3s locally (Playwright auto-starts `next build && next start`).

**HANDOFF.md HERO-03 paragraph (Task 3):**

- New paragraph appended to the M5 section directly after the existing HERO-02 paragraph: "Phase 5 Wave 2 progress, HERO-03 shipped (2026-05-21, plan 05-04)..." Records the JSX migration, measured AVIF sizes (see table below), the spec going from skip to active, and zero `priority` deprecation warnings on a clean build.
- STATE.md and ROADMAP.md NOT touched in this worktree per parallel-execution contract.

## Measured AVIF sizes (live optimizer)

Direct curl against `next start` with `Accept: image/avif,image/webp,image/png,*/*`:

| Width | AVIF size | vs 200 KB budget | Source PNG (2,550,075 B) reduction |
|-------|----------:|-----------------:|----:|
| 640w  | 36,382 B  | 18% | 70x smaller |
| 1080w | 88,554 B  | 44% | 29x smaller |
| 1920w | 150,193 B | 75% | 17x smaller |
| 3840w | 150,193 B | 75% | 17x smaller (Sharp caps at native 1920px source width) |

The largest cached transformation (150,193 B at 1920w) lands comfortably under the 200 KB budget. Sharp's default quality (75 in the request URL; Sharp internally maps to AVIF quality 50) was sufficient on the dark gradient cliff frame; no quality tuning needed. The 200 KB threshold gives ~25% headroom for future content changes.

## Commits (oldest first)

| Hash | Subject |
|------|---------|
| `c3e1cd2` | feat(phase-5/hero-03): migrate hero LCP \<Image> to preload + fetchPriority |
| `5d8d1fc` | test(phase-5/hero-03): replace HERO-03 spec stub with live AVIF assertions |
| `ebf9aa5` | docs(phase-5/hero-03): HANDOFF M5 section records HERO-03 shipped |

Each commit is atomic; per-commit docs rule honored at the wave level (HANDOFF.md updates in Task 3 ride with the code in Task 1 + spec in Task 2 within the same plan execution).

## Verification results

| Check | Result | Notes |
|-------|--------|-------|
| `grep -c "^[[:space:]]*priority$" src/components/sections/HomepageHero.tsx` | `0` | Deprecated prop removed. |
| `grep -c "preload$" src/components/sections/HomepageHero.tsx` | `1` | New prop added. |
| `grep -c "fetchPriority=\"high\"" src/components/sections/HomepageHero.tsx` | `1` | New attribute added. |
| `grep -c "test.skip" tests/hero/poster-avif-negotiation.spec.ts` | `0` | Stub fully replaced. |
| `grep -c "test(" tests/hero/poster-avif-negotiation.spec.ts` | `2` | Two active tests. |
| `npx tsc --noEmit` | exit 1 | Only the pre-existing `tests/responsive/reduced-motion.spec.ts:6` `TS2353 reducedMotion` error from `.planning/phases/05-hero-performance/deferred-items.md` remains. Not introduced by Plan 04. |
| `rm -rf .next && npm run build` | exit 0 | Clean build green; 17 routes generated. |
| `grep -ic "priority.*deprecat\|deprecat.*priority" /tmp/build.log` | `0` | Zero `priority` deprecation warnings. |
| `grep -ic "deprecat" /tmp/build.log` | `0` | Zero generic deprecation warnings either. |
| `npx playwright test tests/hero/poster-avif-negotiation.spec.ts` | `2 passed` | New spec green in 12.3s. |
| `npx playwright test` (full suite) | `169 passed` | All 164 pre-existing + 3 Wave 0/1 + 2 new HERO-03. Zero regressions, zero skips remaining. |

## Spec delta

| Before | After |
|--------|-------|
| 167 passed, 1 skipped (HERO-03 stub) | 169 passed, 0 skipped |

Net: **+2 active specs, -1 skipped**. All three HERO-0{1,2,3} contracts are now CI-enforced.

## Deviations from plan

### Auto-fixed Issues

**1. [CLAUDE.md §5 compliance] Replaced em dash with comma in new HANDOFF.md paragraph**

- **Found during:** Task 3 voice-rules self-check.
- **Issue:** Initial draft of the new paragraph opened with `Phase 5 Wave 2 progress — HERO-03 shipped` (em dash between "progress" and "HERO-03"). The existing HERO-01 and HERO-02 paragraphs in HANDOFF.md use the same em-dash construction, and the file's footer explicitly notes em dashes are tolerated in this internal handoff document. But CLAUDE.md §5 is unambiguous ("Banned punctuation: no em dashes"), and the Plan 01 SUMMARY records the same auto-fix being applied to REQUIREMENTS.md.
- **Fix:** Substituted a comma. Final wording: `Phase 5 Wave 2 progress, HERO-03 shipped (2026-05-21, plan 05-04)`. Reads cleanly; rule respected.
- **Commit:** Fix applied before the Task 3 commit (`ebf9aa5`); no separate fix commit needed.

### Deferred Issues (out of scope per scope-boundary rules)

The pre-existing tsc error in `tests/responsive/reduced-motion.spec.ts:6` from Wave 0 `deferred-items.md` remains. Plan 04 did not touch that file.

## Threat surface scan

No NEW security-relevant surface introduced. Threat register from the plan:

- **T-V10-01** (woff2 tampering): out of scope this plan; mitigated in Plan 01 Wave 0.
- **T-V12-01** (repo bisect cost from ladder binaries): out of scope; Plan 02 owns video binaries.
- **T-INFO-01** (LHCI temp-public-storage): out of scope; Plan 05 owns LHCI.
- **T-TAMP-01** (build-hero-ladder.sh): out of scope; this plan does not invoke encoder scripts.
- **T-NEW-01** (Vercel image-optimization cache): informational only; for the hero specifically, 1 source × 1 width (`sizes="100vw"`) × 2 formats = 2 cached transformations per resolution tier the browser requests. The 31-day `minimumCacheTTL` set in Plan 01 Task 7 bounds the cost. No mitigation work required.

No threat flags raised.

## Manual verification (deferred to Plan 05 pre-ship walkthrough)

Per `05-VALIDATION.md` Manual-Only Verifications row 3: visual diff of the rendered AVIF in Preview/Photoshop vs the source PNG to confirm no banding or posterization on the dark gradient cliff frame. The Playwright spec already covers the structural assertions (content-type, byte budget, fetchpriority attribute, preload link). Manual eyeballing belongs to Plan 05's `/gsd-verify-work` walkthrough.

## What this unblocks

Wave 2 is now complete. **All three Wave 1+2 wiring plans (02 ladder, 03 fonts, 04 AVIF poster) have shipped.** Plan 05 (HERO-04 LHCI gate trip + DOD docs flip) is now fully unblocked: the LCP-owning poster is AVIF + preload + fetchPriority, the wordmark woff2 is self-hosted, and the video ladder is in place. Plan 05 can trip the 2300ms LCP gate against a hot build.

## Self-Check: PASSED

All 3 claimed commits (`c3e1cd2`, `5d8d1fc`, `ebf9aa5`) verified in `git log --oneline --all`. All 3 claimed modified files verified on disk:

- `src/components/sections/HomepageHero.tsx` — `preload` + `fetchPriority="high"` present, no bare `priority` line
- `tests/hero/poster-avif-negotiation.spec.ts` — 2 active `test(` blocks, 0 `test.skip`, all required assertion strings present
- `HANDOFF.md` — new "Phase 5 Wave 2 progress, HERO-03 shipped" paragraph at line 284, zero em dashes in that paragraph

Working tree clean (`git status` reports no uncommitted changes after Task 3 commit).
