# Phase 5: Hero performance — Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in [05-CONTEXT.md](05-CONTEXT.md) — this log preserves the alternatives considered.

**Date:** 2026-05-20
**Phase:** 05-hero-performance
**Areas discussed:** Asset pipeline + component wiring, Regression spec design
**Areas declined (Claude's discretion / researcher):** Ladder shape + WebM strategy, AVIF poster + fallback chain

---

## Gray area selection

| Option | Description | Selected |
|--------|-------------|----------|
| Ladder shape + WebM strategy | Which resolutions, WebM ordering, viewport vs DPR vs Save-Data switching, bitrate targets | |
| AVIF poster + fallback chain | `<picture>` vs Next/Image, fallback chain mechanics, `<video poster>` format, encoder choice | |
| Asset pipeline + component wiring | Multi-source data shape, source storage, build scripts, mobile gating | ✓ |
| Regression spec design | Tool choice, throttling profile, fail threshold, CI integration scope | ✓ |

**Rationale (inferred):** User locked the structural/architectural calls (where things live, how the code is organized, what the CI gate looks like) and deferred the encoder-specific tuning (exact resolutions, AVIF mechanics) to the researcher. This is consistent with the founder-vs-builder split in `.planning/PROJECT.md` and the perf-phase nature of Phase 5 — the structural calls have downstream architecture impact, the encoder tuning is reversible.

---

## Asset pipeline + component wiring

### Q1: How should the multi-source video list flow into HomepageHero.tsx?

| Option | Description | Selected |
|--------|-------------|----------|
| Extend `heroCinematic.media.video` to a sources array | Change from `string` to `Array<{src, type, media?}>` in `src/content/homepage-hero.ts`; HomepageHero.tsx maps to `<source>` children. Smallest delta. GSAP scrub on `video.currentTime` unchanged. | ✓ |
| Inline `<source>` tags in HomepageHero.tsx | Hardcode resolution paths inside JSX; remove `media.video` from content module. | |
| New content module `src/content/hero-media.ts` | Move all hero media to dedicated module; future-proofs reuse. | |

**User's choice:** Extend `heroCinematic.media.video` to a sources array (Recommended)
**Notes:** Single-consumer asset (HomepageHero.tsx only); typed data layer is cheap. Researcher / planner encodes the typed shape `Array<{ src: string; type: string; media?: string }>` and inserts the media-query strings.

---

### Q2: Where does the encoder source file live?

| Option | Description | Selected |
|--------|-------------|----------|
| Re-encode from current 11 MB scrub MP4 in git | Treat `public/hero/homepage-hero.mp4` as source-of-truth. Acceptable quality loss because variants are lossy targets. Workflow reproduces from a fresh clone. | ✓ |
| Original outside repo, `.gitignore` + manual copy | Master lives in Connor's Downloads (like source-materials currently). Clean history; non-reproducible workflow. | |
| Git LFS for the master source | Push original to LFS; commit ladder outputs. Reproducible + binary versioning. Adds LFS dependency. | |

**User's choice:** Re-encode from current 11 MB scrub MP4 in git (Recommended)
**Notes:** Source survives clones; no external dependencies. Already in repo at commit 6c14e7b.

---

### Q3: How should the encode tooling be structured?

| Option | Description | Selected |
|--------|-------------|----------|
| New `scripts/build-hero-ladder.sh` alongside existing `reencode-hero.sh` | Keep `reencode-hero.sh` for the niche "per-frame keyframes for GSAP scrubbing" job. New script emits 3 MP4s, 3 WebMs, AVIF poster, WebP poster. Both committed. | ✓ |
| Extend `scripts/reencode-hero.sh` to emit everything | One script does both jobs. Shorter file list; script does two distinct things. | |
| Two new scripts, retire `reencode-hero.sh` | `build-hero-master.sh` + `build-hero-ladder.sh`. Most surgical; adds churn. | |

**User's choice:** New `scripts/build-hero-ladder.sh` alongside existing `reencode-hero.sh` (Recommended)
**Notes:** One script, one job. `reencode-hero.sh` stays as-is for future master-source updates.

---

### Q4: How does mobile behave under the new asset architecture?

| Option | Description | Selected |
|--------|-------------|----------|
| Mobile stays video-free; AVIF poster owns LCP | Preserve M4 decision: `<video>` skipped when `isMobile`. AVIF poster is the LCP candidate. 480p is for narrow desktop / iPad portrait. | ✓ |
| Render 480p MP4 on mobile too | Bring cinematic back to mobile via smallest variant. Conflicts with M4 Phase 3 static-stack. | |
| Render AVIF poster as static hero (no video element at all) | Explicit restatement of Recommended — `<video>` unmounted on mobile. | |

**User's choice:** Mobile stays video-free; AVIF poster owns LCP (Recommended)
**Notes:** M4 Phase 3 mobile static-stack architecture stands. No regression risk on mobile cinematic decision.

---

### Q5 (follow-up): Do all MP4 / WebM ladder variants get scrub-encoded?

| Option | Description | Selected |
|--------|-------------|----------|
| All variants scrub-encoded | Every MP4 + WebM gets `-g 1 -keyint_min 1`. Browser picks any variant and GSAP scrubbing stays smooth. ~3x size penalty vs VOD, but every variant still beats the current 11.65 MB monolith. | ✓ |
| Only 1080p scrub-encoded; 720p / 480p VOD-encoded | Save bytes on small variants. Desktop client on constrained network → stutter. | |
| Hidden 1080p scrub element + visible ladder for delivery | Decouple scrub fidelity from delivery size. Double video element; layout risk. | |

**User's choice:** All variants scrub-encoded (Recommended)
**Notes:** Cinematic brand on every connection class is load-bearing. Size hit acceptable.

---

## Regression spec design (HERO-04)

### Q1: What tool measures LCP for the regression spec?

| Option | Description | Selected |
|--------|-------------|----------|
| Lighthouse CI via `@lhci/cli` | Same tool as `docs/m4-perf-baseline.md`. ~30s/route. New `lighthouserc.json` + new GitHub Actions step. | ✓ |
| Playwright PerformanceObserver in `tests/perf/` | Fast (~5s); already in `test:e2e` pipeline. Harder to emulate Lighthouse throttling. | |
| Both: Playwright PO for in-PR + Lighthouse CI nightly | Belt-and-braces. Doubles maintenance surface. | |

**User's choice:** Lighthouse CI via `@lhci/cli` (Recommended)
**Notes:** Apples-to-apples with baseline doc. HERO-04 wording ("Lighthouse mobile run shows / LCP under 2.5s on 4G") names Lighthouse explicitly.

---

### Q2: What throttling profile does the spec use?

| Option | Description | Selected |
|--------|-------------|----------|
| Match m4-perf-baseline exactly + median of 3 runs | Mobile, 412×823, DPR 1.75, `cpuSlowdownMultiplier=4`, headless Chromium. 3 runs, take median. | ✓ |
| Lighthouse default mobile preset, single run | Whatever LH defaults to today. Drifts from baseline. | |
| Match baseline profile, single run | Same throttling, single pass. Faster CI; higher flake risk on 2.5s boundary. | |

**User's choice:** Match m4-perf-baseline exactly + median of 3 runs (Recommended)
**Notes:** Reproducibility against baseline is the whole point. Median absorbs single-pass variance.

---

### Q3: What's the fail threshold?

| Option | Description | Selected |
|--------|-------------|----------|
| 2.3s median LCP, fail if ≥ 2300ms | Perf budget with 200 ms headroom. Phase 8 (Motion) can land within headroom. | ✓ |
| 2.5s strict, fail if ≥ 2500ms | Direct CLAUDE.md §12 match. No headroom; flake risk on 2.51s. | |
| 2.5s strict + warn at 2.3s | Fails at contract; warns at headroom. Two outputs to monitor. | |

**User's choice:** 2.3s median LCP, fail if ≥ 2300ms (Recommended)
**Notes:** Two-stage signal — gate at 2.3s, public contract at 2.5s. Catches regression direction before contract breaches.

---

### Q4: What metrics + CI integration scope?

| Option | Description | Selected |
|--------|-------------|----------|
| New `.github/workflows/perf.yml`, `/` only, LCP only | Dedicated workflow file alongside `a11y.yml`. Tests only `/`. Asserts LCP only. INP unreliable in synthetic LH; CLS already 0.000 forever. | ✓ |
| Extend `a11y.yml` with perf job | One workflow file. Mixes concerns. | |
| All 4 web-vitals (LCP, CLS, INP, FCP) on `/` | Comprehensive. Every metric a flake surface. | |
| LCP + CLS only on `/` | Two stable metrics. CLS guard essentially free. | |

**User's choice:** New `.github/workflows/perf.yml`, `/` only, LCP only (Recommended)
**Notes:** Tight, single-purpose gate. Other metrics can be added later if regressions emerge.

---

## Claude's Discretion

User explicitly deferred the following gray areas to the researcher (carry into `05-RESEARCH.md`):

- **Ladder shape + WebM strategy** — exact resolutions in the ladder (480p / 720p / 1080p, or with 1440p / Save-Data variants), per-variant bitrate targets, WebM-first vs MP4-first `<source>` ordering, viewport vs DPR vs Save-Data switching algebra.
- **AVIF poster + fallback chain** — `<picture>` vs Next/Image with content negotiation, AVIF→WebP→PNG vs AVIF→WebP only, what format goes in `<video poster=>`, encoder choice (avifenc vs ffmpeg libaom-av1 vs sharp), quality / CRF tuning to land sub-200KB.

Researcher returns a recommended approach in `05-RESEARCH.md`; planner locks the exact values in `05-*-PLAN.md`.

## Deferred Ideas

- Mux / Cloudflare Stream / Vercel Blob adaptive bitrate (revisit in v2 if local ladder hits limits)
- Vercel Speed Insights field RUM (M6+)
- Synthetic INP gate (unreliable in Lighthouse; field RUM is the right answer)
- Lighthouse CI extended to non-`/` routes (not needed; other routes have huge LCP headroom)
- Hero video on mobile (M4 Phase 3 static-stack stands)
- General Sans 400 / 500 weights via `next/font/local` (only 600 consumed today)
- Tighter font subsetting if researcher picks "full character set" now

---

*Generated by `/gsd-discuss-phase 5` on 2026-05-20.*
