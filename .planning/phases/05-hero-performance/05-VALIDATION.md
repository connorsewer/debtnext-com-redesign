---
phase: 5
slug: hero-performance
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-05-21
---

# Phase 5 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution. Populated from `05-RESEARCH.md` §"Validation Architecture".

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Playwright 1.60 (e2e) + axe-core 4.11 (a11y) + @lhci/cli 0.15.1 (perf) |
| **Config file** | `playwright.config.ts` (existing) · `lighthouserc.json` (NEW, repo root) · `.github/workflows/perf.yml` (NEW) |
| **Quick run command** | `npx playwright test tests/hero/` (~10s; runs new HERO specs only) |
| **Full suite command** | `npm run test:e2e && npx --no-install lhci autorun` (~5 min; all 164 existing + 3 new + LHCI median-run gate) |
| **Estimated runtime** | ~90s for `lhci autorun` locally (build + 3 LH runs); per-task quick run ~10s |

---

## Sampling Rate

- **After every task commit:** `npm run typecheck && npm run lint && npx playwright test tests/hero/` (~30s)
- **After every plan wave:** `npm run test:e2e && npx --no-install lhci autorun` (~5 min — catches LHCI regression before CI sees it)
- **Before `/gsd-verify-work`:** Full suite must be green AND `next build` exits 0 with zero `priority` deprecation warnings
- **Max feedback latency:** 30 seconds per task commit

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| TBD-01 | TBD | 0 | HERO-01 | — | Ladder rename (REQUIREMENTS.md HERO-01 amended to 720p/540p/360p) | docs | `grep -q "720p / 540p / 360p" .planning/REQUIREMENTS.md` | ❌ W0 — REQUIREMENTS.md edit | ⬜ pending |
| TBD-02 | TBD | 0 | HERO-01 | — | `scripts/build-hero-ladder.sh` emits 6 ladder variants + verifies per-frame keyframes | smoke (shell) | `bash scripts/build-hero-ladder.sh && bash scripts/verify-hero-keyframes.sh` | ❌ W0 — `scripts/build-hero-ladder.sh` | ⬜ pending |
| TBD-03 | TBD | 1 | HERO-01 | — | `<video>` has 6 `<source>` children in correct order (VP9 first, MP4 fallback, narrow-viewport media first within each codec) | integration (Playwright) | `npx playwright test tests/hero/source-ladder.spec.ts` | ❌ W0 — `tests/hero/source-ladder.spec.ts` | ⬜ pending |
| TBD-04 | TBD | 0 | HERO-02 | T-V10-01 | Fontshare woff2 downloaded, checksum verified, committed to `src/app/fonts/` | smoke (shell) | `test -f src/app/fonts/GeneralSans-Semibold.woff2 && shasum -a 256 src/app/fonts/GeneralSans-Semibold.woff2` | ❌ W0 — `src/app/fonts/GeneralSans-Semibold.woff2` | ⬜ pending |
| TBD-05 | TBD | 1 | HERO-02 | — | Fontshare `@import` removed from `globals.css` L1; `next/font/local` declaration in `src/app/fonts.ts`; Wordmark renders without external font request | integration (Playwright) | `npx playwright test tests/hero/wordmark-self-host.spec.ts` (network log assertion + computed-style assertion) | ❌ W0 — `tests/hero/wordmark-self-host.spec.ts` | ⬜ pending |
| TBD-06 | TBD | 0 | HERO-03 | — | `next.config.ts` declares `images.formats: ['image/avif', 'image/webp']` | docs/config | `grep -q "image/avif" next.config.ts` | ❌ W0 — `next.config.ts` edit | ⬜ pending |
| TBD-07 | TBD | 1 | HERO-03 | — | HomepageHero `<Image>` migrated from `priority` to `preload + fetchPriority="high"`; AVIF served when Accept includes `image/avif`; response under 200 KB | integration (Playwright) | `npx playwright test tests/hero/poster-avif-negotiation.spec.ts` | ❌ W0 — `tests/hero/poster-avif-negotiation.spec.ts` | ⬜ pending |
| TBD-08 | TBD | 0 | HERO-04 | — | `lighthouserc.json` at repo root with m4-perf-baseline throttling + `aggregationMethod: 'median-run'` + `maxNumericValue: 2300` for `largest-contentful-paint` on `/` | docs/config | `grep -q "median-run" lighthouserc.json && grep -q "maxNumericValue\\\": 2300" lighthouserc.json` | ❌ W0 — `lighthouserc.json` | ⬜ pending |
| TBD-09 | TBD | 1 | HERO-04 | — | `.github/workflows/perf.yml` runs lhci against `next start`; PR-blocking | smoke (CI) | LHCI run on `/` returns exit 0; CI workflow file syntax-valid (`actionlint .github/workflows/perf.yml`) | ❌ W0 — `.github/workflows/perf.yml` | ⬜ pending |
| TBD-10 | TBD | 1 | HERO-04 | — | `/` median LCP < 2300 ms under matched throttling (median-of-3) | perf gate (LHCI) | `npx --no-install lhci autorun` exits 0 with assertion green | ❌ W0 — depends on TBD-08 + TBD-09 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

**Note:** Task IDs are placeholders — planner assigns real IDs as it splits Phase 5 into N plans. Each row above maps to a verification beat that MUST appear in some plan's task list.

---

## Wave 0 Requirements

Wave 0 lands the artifacts that downstream tasks depend on (test files, configs, build scripts). All MUST exist before Wave 1 tasks can pass their acceptance criteria.

- [ ] `scripts/build-hero-ladder.sh` — emits 6 ladder variants from `public/hero/homepage-hero.mp4` (720p/540p/360p × MP4 + WebM), all per-frame-keyframed, with verification pass embedded at the end
- [ ] `scripts/verify-hero-keyframes.sh` — standalone audit (loops over the 6 variant files; `ffprobe` confirms `nb_key_frames == nb_frames`; exits non-zero on mismatch). May be inlined into `build-hero-ladder.sh`.
- [ ] `src/app/fonts/GeneralSans-Semibold.woff2` — downloaded from fontshare.com (single woff2, General Sans 600 weight only)
- [ ] `src/app/fonts.ts` — `next/font/local` declaration exporting `generalSans` with `variable: '--font-general-sans'`
- [ ] `lighthouserc.json` (repo root) — collect/assert config matching m4-perf-baseline throttling profile
- [ ] `.github/workflows/perf.yml` — runs build → start → wait-on → lhci autorun → fail-on-assertion-violation
- [ ] `tests/hero/source-ladder.spec.ts` — DOM assertion for 6 `<source>` children with correct `type` + `media` ordering
- [ ] `tests/hero/wordmark-self-host.spec.ts` — no Fontshare network call, head has next/font preload link, computed font-family resolves to General Sans
- [ ] `tests/hero/poster-avif-negotiation.spec.ts` — sets `Accept: image/avif,*/*` header, asserts response is AVIF, content-length < 200000
- [ ] Per-commit docs rule: HANDOFF.md / `.planning/PROJECT.md` / `.planning/STATE.md` updated in the SAME commit as the code they describe

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Hero cinematic scrubs smoothly on desktop at every viewport tier (720p / 540p / 360p variant selection) | HERO-01 | Scrub fidelity is a subjective visual judgment; Playwright can assert `<source>` order but can't measure smoothness | (1) `npm run dev`. (2) Open `/` at 1440px, 1024px, 768px viewports (DevTools device toolbar). (3) Scroll slowly through the cinematic; confirm no stutter at any variant. (4) Verify Network tab shows the expected variant per viewport. |
| Wordmark renders identically before/after Fontshare → next/font/local swap | HERO-02 | Visual diff is a human eyeball job until we have a screenshot-diff suite | (1) Capture pre-swap screenshot of `/` nav at 1440px desktop. (2) Apply HERO-02 changes. (3) Capture post-swap. (4) Diff in Preview/Photoshop; confirm letter shapes + `.dn-node` pulse position identical. |
| AVIF poster visually matches the current PNG (no banding, no posterization on the dark gradient) | HERO-03 | AVIF quality tuning is iterative until it lands sub-200KB AND looks indistinguishable from the source PNG | (1) `bash scripts/build-hero-ladder.sh`. (2) Open `public/hero/homepage-hero-start.avif` in Preview. (3) Side-by-side with original PNG. (4) If banding visible, raise AVIF quality and re-run. |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references (9 W0 items above)
- [ ] No watch-mode flags (LHCI is single-shot, Playwright is `--reporter=line` per existing config)
- [ ] Feedback latency < 30s per task commit
- [ ] `nyquist_compliant: true` set in frontmatter (flip on plan-check approval)

**Approval:** pending (planner fills task IDs; checker verifies sampling continuity; orchestrator flips `nyquist_compliant: true` on PASS)
