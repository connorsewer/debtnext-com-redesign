# Phase 5: Hero performance — Context

**Gathered:** 2026-05-20
**Status:** Ready for planning

<domain>
## Phase Boundary

Cut `/` LCP under the 2.5s target on 4G mobile so the homepage stops being the only v1 route blocking launch. Four concrete deliverables:

1. **HERO-01** — Multi-resolution local MP4 ladder (480p / 720p / 1080p MP4 + WebM fallback) wired via a `<source>` media-query set on the hero `<video>` element.
2. **HERO-02** — General Sans 600 self-hosted via `next/font/local`; remove the Fontshare CDN `@import` from `src/app/globals.css`; preserve the `Wordmark` + `.dn-node` pulse.
3. **HERO-03** — Hero poster re-encoded to sub-200KB AVIF (with WebP fallback) and owns the LCP target on every viewport.
4. **HERO-04** — Lighthouse mobile run shows `/` LCP under 2.5s on 4G throttling; a Playwright/Lighthouse regression spec fails if a future change pushes `/` back over the line.

Out of scope (locked by REQUIREMENTS.md / PROJECT.md, not re-discussed):
- Mux / Cloudflare Stream / Vercel Blob adaptive bitrate hosting
- Poster-only-on-mobile (hide hero video below md)
- ScrollSmoother / any new GSAP plugin
- Live GA4/GTM event verification (that's Phase 6 / a post-launch phase)
- Field RUM via Vercel Speed Insights (deferred)
- Mobile cinematic playback (M4 Phase 3 mobile static-stack stands)

</domain>

<decisions>
## Implementation Decisions

### Asset pipeline + component wiring

- **D-01:** Extend `heroCinematic.media.video` in `src/content/homepage-hero.ts` from `string` to a typed sources array — `Array<{ src: string; type: string; media?: string }>`. HomepageHero.tsx maps the array to `<source>` children inside the existing `<video>` element. The single `video.currentTime` scrub binding (GSAP master ScrollTrigger) stays as-is; the browser picks one source and the scrub logic is unchanged.
- **D-02:** Source-of-truth for the encoder pipeline is `public/hero/homepage-hero.mp4` — the existing 11.65 MB keyframe-per-frame H.264 produced by `scripts/reencode-hero.sh`. The new ladder script reads that as input and emits all responsive variants from it. Acceptable quality loss because downsized variants are already lossy targets. No external storage, no git LFS, no `.gitignore` divergence. The workflow reproduces from a fresh clone.
- **D-03:** Tooling lives in two scripts. `scripts/reencode-hero.sh` keeps its current job (produce the scrub-friendly H.264 master from a raw source). A new `scripts/build-hero-ladder.sh` reads `public/hero/homepage-hero.mp4` and emits the entire ladder in one call — 3 MP4 variants, 3 WebM variants, AVIF poster, WebP poster. Clean separation of concerns; each script does one thing.
- **D-04:** Mobile remains video-free. `HomepageHero.tsx` continues to skip rendering the `<video>` element when `isMobile` is true (M4 Phase 3 mobile static-stack architecture stands). Mobile's LCP candidate is the AVIF poster, served via the existing `<Image priority />` (only the asset filename + format changes). The 480p variant in the ladder is for narrow desktop / iPad portrait, not for mobile playback.
- **D-05:** **Every** MP4 and WebM variant in the ladder gets per-frame keyframes (`-g 1 -keyint_min 1`). The browser can pick any variant and GSAP scrubbing stays smooth. ~3x file-size penalty vs VOD encoding is acceptable because every variant still ships smaller than the current 11.65 MB monolith, and scrub fidelity is what carries the cinematic brand on every connection class.

### Regression spec design (HERO-04)

- **D-06:** Measurement tool is **Lighthouse CI** (`@lhci/cli`). Apples-to-apples with `docs/m4-perf-baseline.md` (which used `lighthouse@13.x` mobile). New `lighthouserc.json` config at repo root + new GitHub Actions workflow. Playwright PerformanceObserver and Vercel Speed Insights RUM are explicitly NOT used for the gate (PO can't faithfully reproduce LH throttling; RUM is field-only and post-launch).
- **D-07:** Throttling profile matches `docs/m4-perf-baseline.md` exactly — mobile form factor, 412×823 viewport, DPR 1.75, `cpuSlowdownMultiplier=4`, headless Chromium — and runs the route **3 times**, asserting against the **median** LCP. Reproducibility against the baseline is the whole point; three runs absorb the single-pass variance that the baseline doc warns about.
- **D-08:** Fail threshold is **2.3s median LCP** (fail when median ≥ 2300 ms). The 2.5s in CLAUDE.md §12 is the public contract; the 2.3s gate gives 200 ms headroom so a borderline regression fails the gate before it breaches the contract. Phase 8 (Motion) can land within the headroom without breaking the gate, but any regression direction is caught.
- **D-09:** New workflow file: `.github/workflows/perf.yml`. Single route (`/`), single metric (LCP). INP is excluded — synthetic Lighthouse `max-potential-fid` is noisy per m4-perf-baseline §3. CLS is excluded — already 0.000 across all 11 routes and unlikely to regress from a video swap. Tight, single-purpose gate. Other metrics can be added later if real regressions emerge.

### Claude's Discretion (deferred to researcher / planner)

- **Exact resolution ladder** — Specifically 480p / 720p / 1080p, or do we add a 1440p tier for ultrawide desktops, or a 360p Save-Data variant? Per-variant bitrate / CRF targets. Researcher picks values that keep each variant under a reasonable per-tier byte budget while preserving cinematic legibility.
- **`<source>` media query semantics** — Viewport-based (`(max-width: 768px)`) vs DPR-aware vs `Save-Data` request hint. Researcher picks the breakpoint algebra; planner encodes the exact `<source media="...">` strings.
- **WebM source ordering** — Whether WebM (VP9 / AV1) `<source>` tags come before or after MP4. Chrome / Firefox / Edge can prefer WebM; Safari needs MP4. Researcher picks based on current browser-support matrix.
- **AVIF encoder + quality target** — `avifenc` vs `ffmpeg` libaom-av1 vs `sharp` (Node-side) for the AVIF poster. Quality / CRF tuned to land sub-200KB while staying visually indistinguishable from the current PNG. Researcher proposes; planner locks the encoder flags.
- **AVIF fallback chain mechanics** — Whether the poster ships as `<picture><source type="image/avif">...<img></picture>` vs Next/Image with the AVIF in `public/` and Sharp's content-negotiation, or both formats committed in `public/` and `<Image>` referencing the AVIF directly. Researcher picks based on Next 16's `<Image>` AVIF behavior + LCP discovery (`priority`, `fetchPriority="high"`).
- **`<video poster=>` attribute** — Whether the AVIF goes in the `poster` attribute (relies on browser AVIF support in `<video poster>`, which is broadly good in 2025+) or stays as a PNG/WebP for safest broad support while the visible `<Image>` LCP element owns the AVIF. Researcher decides; this is a small but real compatibility call.
- **Font subsetting for General Sans** — Whether `next/font/local` subsets the woff2 to just the glyphs the wordmark uses ("DebtNext" letters: D, e, b, t, N, x) or ships the full character set. Subset is smaller but coupled to wordmark string; full set is robust to future copy changes. Researcher recommends; planner locks.
- **Number of `next/font/local` weights** — Currently only General Sans 600 is loaded. Stay at 600 only, or include 400/500 for future use? Default: 600 only (current consumption), revisit when copy needs warrant.
- **Lighthouse CI assertion config syntax** — `lighthouserc.json` schema specifics. Researcher pulls current `@lhci/cli` docs; planner writes the exact assertions block.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Operating contract + brand
- `CLAUDE.md` §3 (brand and visual rules — primary `#5266EB`, dark canvas `#171721`)
- `CLAUDE.md` §5 (voice rules — no em dashes, no banned phrases, sentence case)
- `CLAUDE.md` §12 (performance targets — LCP < 2.5s on 4G, CLS < 0.1, INP < 200ms)
- `CLAUDE.md` §14 (Definition-of-Done checklist)
- `.impeccable.md` (calm, precise, technical; Mercury sole reference; 5 design principles)
- `DESIGN.md` §10 (motion principles; reduced-motion gating)

### Phase context
- `.planning/PROJECT.md` Key Decisions (hero pin via GSAP locked M3.6, mobile static-stack M4 Phase 3, hero MP4 perf deferred to M5)
- `.planning/ROADMAP.md` Phase 5 section (goal, depends on, success criteria, notes)
- `.planning/REQUIREMENTS.md` Active (M5) > Hero performance section (HERO-01..04) + Out of Scope subsection
- `.planning/STATE.md` (current position, M5 phase map, open items)
- `docs/m4-perf-baseline.md` (Lighthouse baseline — `/` LCP 2.86s, 11.65 MB MP4 + 2.55 MB PNG, mobile 412×823 DPR 1.75, `cpuSlowdownMultiplier=4`)
- `HANDOFF.md` (TL;DR section, file-tree map, decisions locked block)

### Source code (read before modifying)
- `src/components/sections/HomepageHero.tsx` — GSAP pin:true cinematic; owns `<video>`, `<Image>` poster, framed dashboard finale, attached form. Lines 56–145 contain the master ScrollTrigger; do not perturb the `wire()` flow or pin spacer.
- `src/content/homepage-hero.ts` — `heroCinematic.media` data shape (video, startFrame, endFrame). D-01 extends `.video` from string → sources array here.
- `src/components/site/Wordmark.tsx` — General Sans 600 consumer + `.dn-node` element.
- `src/app/globals.css` line 1 — Fontshare `@import` to remove for HERO-02; `.dn-node` keyframes + reduced-motion suppression block must stay intact.
- `scripts/reencode-hero.sh` — existing scrub-encode tooling (the master produced by this script becomes input to the new build-hero-ladder.sh).

### Test infrastructure
- `tests/helpers/routes.ts` — canonical 11-route list (perf.yml only exercises `/`)
- `tests/responsive/reduced-motion.spec.ts` — pattern for `prefers-reduced-motion` gating + emulateMedia
- `tests/a11y/axe-routes.spec.ts` — pattern for per-route iteration
- `.github/workflows/a11y.yml` — pattern for new `.github/workflows/perf.yml` (build, start `next start`, run gate, fail on assertion)

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable assets
- `<Image priority sizes="100vw" />` pattern in `HomepageHero.tsx` lines 170–180 — the LCP-owning element. Only the `src` filename + format changes for HERO-03; the `priority` flag and `sizes` attribute stay.
- `next/font/google` import for Inter (in `src/app/layout.tsx`) — same pattern that `next/font/local` for General Sans will follow.
- `useGSAP` + `ScrollTrigger.create` pattern in `HomepageHero.tsx` lines 56–145 — already gates on `isMobile` + `prefers-reduced-motion`. Multi-source `<source>` children don't change this logic; the browser-picked source still exposes `video.duration` and `video.currentTime`.
- `scripts/reencode-hero.sh` — ffmpeg flag pattern for scrub-friendly encoding (`-c:v libx264 -profile:v high -level 4.0 -crf 22 -g 1 -keyint_min 1 -an -movflags +faststart`). New ladder script uses the same scrub-friendly flag set per variant.

### Established patterns
- Per-commit docs rule (saved as user feedback memory) — every code change in Phase 5 ships with HANDOFF.md / `.planning/PROJECT.md` updates in the same commit.
- GPG signing off + Co-Authored-By footer required on every commit (`git -c commit.gpgsign=false commit ...`).
- WCAG 2.2 AA + axe-core CI on every PR — Phase 5 changes can't break the axe gate. `aria-hidden="true"` already set on the hero `<video>` and `<Image>`.
- Reduced motion CSS sweep in `src/app/globals.css` is global and collapses animation-duration to 0.01ms — no per-spec opt-out needed.
- Playwright spec pattern: `for (const route of ROUTES) test(\`${route}: ...\`)` — perf.yml gate is a single-route spec, doesn't loop.

### Integration points
- `src/content/homepage-hero.ts` is consumed only by `src/components/sections/HomepageHero.tsx`. No other consumers; the data-shape change in D-01 has a single touch point.
- `src/app/globals.css` is the only file loading Fontshare. Removing the line 1 `@import` and adding a `next/font/local` declaration in `src/app/layout.tsx` (or a new `src/app/fonts.ts` module) covers HERO-02. Wordmark.tsx already uses the `"General Sans"` family name; only the source changes.
- `.github/workflows/a11y.yml` is the template for the new `perf.yml` — both run `next build && next start` on a port, then run an assertion tool against it.

</code_context>

<specifics>
## Specific Ideas

- `docs/m4-perf-baseline.md` defines the exact LH config (`--form-factor=mobile`, 412×823, DPR 1.75, `cpuSlowdownMultiplier=4`, headless Chromium). The Phase 5 regression spec must reproduce these exactly for direct comparison.
- The current PNG poster is `public/hero/homepage-hero-start.png` at 2,550,075 bytes (2.55 MB). Target for HERO-03 is sub-200 KB AVIF — a 12.75× reduction. Even at AVIF quality 50 this is well within reach for the dark gradient cliff frame.
- The current scrub-encoded MP4 is `public/hero/homepage-hero.mp4` at 11,650,311 bytes (11.65 MB). Realistic ladder targets (scrub-encoded): 480p ~3 MB, 720p ~6 MB, 1080p ~12 MB (slight reduction from current 11.65 MB possible via tighter CRF). Mobile + narrow-desktop clients pull 3 MB instead of 11.65 MB — the headline win.
- `public/hero/homepage-hero-end.png` is unreferenced (already noted in PROJECT.md "Known open items"). Safe to delete in the same commit that lands HERO-01 cleanup. Out of scope to add to deferred.
- Phase 8 (Motion) depends on this phase's LCP headroom — MOTION-04 verifies `/` stays under 2.5s after motion ships. The 2.3s gate (D-08) is exactly the headroom contract Phase 8 measures against.

</specifics>

<deferred>
## Deferred Ideas

- **Mux / Cloudflare Stream / Vercel Blob adaptive bitrate** — out of scope per REQUIREMENTS.md M5. If the local ladder hits its limits in production, revisit in v2.
- **Vercel Speed Insights field RUM** — deferred per REQUIREMENTS.md "Future (M6+)". Phase 5 ships the synthetic Lighthouse gate; field data confirmation happens after launch when real traffic exists.
- **`/` regression spec coverage for INP** — synthetic INP via `max-potential-fid` is unreliable per m4-perf-baseline §3. Field INP via RUM is the right answer; lives in the same M6+ phase as Speed Insights.
- **Lighthouse CI gate extended to the other 10 routes** — not in M5 scope. The 10 non-`/` routes already pass LCP at 1.00–1.07s with massive headroom. If a route drifts close to the gate post-launch, extend the gate then.
- **Hero video on mobile via 480p variant** — explicitly rejected (D-04). M4 Phase 3 mobile static-stack architecture is correct for mobile cinematic perf and stays put. If a future product call wants mobile cinematic back, it's a new milestone.
- **General Sans 400 / 500 weights via `next/font/local`** — only 600 is consumed today (Wordmark). Adding lighter weights now ships unused bytes. Revisit when a copy surface needs another weight.
- **Font subsetting to wordmark glyphs only** — researcher recommends the subset strategy. If they pick "full character set" now, a tighter subset is a future micro-optimization. Tracked here so it isn't lost.

</deferred>

---

*Phase: 05-hero-performance*
*Context gathered: 2026-05-20*
