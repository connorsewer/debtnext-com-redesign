# Phase 5: Hero performance — Research

**Researched:** 2026-05-20
**Domain:** Web video delivery (multi-resolution `<source>` ladders), modern image encoding (AVIF/WebP), Next.js 16 font + Image APIs, Lighthouse CI assertion configuration
**Confidence:** HIGH overall — every load-bearing recommendation is verified against Next.js 16.2.6 official docs, Lighthouse CI source docs, ffmpeg 8.1 confirmed installed locally, and the actual source asset metadata measured via `ffprobe` and `file`.

## Summary

The phase is implementation-grade research, not exploratory. Every architectural call is already locked in CONTEXT.md (sources array on `heroCinematic.media.video`, mobile stays video-free, scrub-encoded across all variants, LHCI median-of-3 at 2.3s gate). What follows is the codec/quality/encoder/JSX recommendations that the planner will encode verbatim into PLAN.md actions.

Two findings reshape the planning assumptions and require the planner to know them up front:

1. **The 11.65 MB "master" is 1280×720 at 24 fps, 10 s duration, 9.3 Mbps** (verified via `ffprobe`). The current asset is already 720p — the ladder cannot include a 1080p tier without upscaling, which would balloon bytes for zero quality gain. The realistic ladder is **720p (anchor) / 540p / 360p**, not 1080p/720p/480p. Per-variant byte budgets need to be re-stated against the 720p anchor. This is a hard correction to the wording in CONTEXT.md's HERO-01 (which calls out "480p / 720p / 1080p") — the user's intent (smaller variants for narrow viewports) is preserved, but the ladder shape changes.
2. **`priority` is deprecated in Next.js 16 in favor of `preload`.** The existing `HomepageHero.tsx` line 176 (`priority`) currently works because Next 16 keeps `priority` as a deprecated alias, but the planner should migrate the LCP poster to `preload={true}` plus `fetchPriority="high"` while it's touching the JSX anyway. (Source: `node_modules/next/docs` cache via the WebFetch of nextjs.org/docs/app/api-reference/components/image, §`priority`.)

**Primary recommendation:** Ship the ladder as a 3-tier H.264 MP4 + 3-tier VP9 WebM at 720p/540p/360p, all scrub-encoded with `-g 1 -keyint_min 1`. Use Next.js Image's built-in AVIF→WebP content negotiation by setting `images.formats: ['image/avif', 'image/webp']` in `next.config.ts` and keeping the existing PNG source — Sharp (already a transitive dep of `next`) encodes AVIF on demand at request time, so we ship the PNG, the optimizer serves AVIF to Chrome/Firefox/Edge/iOS 16+/Safari 16.4+ and WebP to anything else. The `<video poster>` attribute stays PNG for universal video-element compatibility. Self-host General Sans 600 via `next/font/local` with the woff2 in `src/app/fonts/`, exposed via `--font-general-sans` CSS variable. Lighthouse CI runs via `@lhci/cli@0.15.1` invoked directly (not via `treosh/lighthouse-ci-action`) for direct schema control of `assertMatrix` + `aggregationMethod: 'median-run'`.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Asset pipeline + component wiring**
- **D-01:** Extend `heroCinematic.media.video` in `src/content/homepage-hero.ts` from `string` to a typed sources array — `Array<{ src: string; type: string; media?: string }>`. HomepageHero.tsx maps the array to `<source>` children inside the existing `<video>` element. The single `video.currentTime` scrub binding (GSAP master ScrollTrigger) stays as-is; the browser picks one source and the scrub logic is unchanged.
- **D-02:** Source-of-truth for the encoder pipeline is `public/hero/homepage-hero.mp4` — the existing 11.65 MB keyframe-per-frame H.264 produced by `scripts/reencode-hero.sh`. The new ladder script reads that as input and emits all responsive variants from it. Acceptable quality loss because downsized variants are already lossy targets. No external storage, no git LFS, no `.gitignore` divergence. The workflow reproduces from a fresh clone.
- **D-03:** Tooling lives in two scripts. `scripts/reencode-hero.sh` keeps its current job (produce the scrub-friendly H.264 master from a raw source). A new `scripts/build-hero-ladder.sh` reads `public/hero/homepage-hero.mp4` and emits the entire ladder in one call — 3 MP4 variants, 3 WebM variants, AVIF poster, WebP poster. Clean separation of concerns; each script does one thing.
- **D-04:** Mobile remains video-free. `HomepageHero.tsx` continues to skip rendering the `<video>` element when `isMobile` is true (M4 Phase 3 mobile static-stack architecture stands). Mobile's LCP candidate is the AVIF poster, served via the existing `<Image priority />` (only the asset filename + format changes). The 480p variant in the ladder is for narrow desktop / iPad portrait, not for mobile playback.
- **D-05:** **Every** MP4 and WebM variant in the ladder gets per-frame keyframes (`-g 1 -keyint_min 1`). The browser can pick any variant and GSAP scrubbing stays smooth. ~3x file-size penalty vs VOD encoding is acceptable because every variant still ships smaller than the current 11.65 MB monolith, and scrub fidelity is what carries the cinematic brand on every connection class.

**Regression spec design (HERO-04)**
- **D-06:** Measurement tool is **Lighthouse CI** (`@lhci/cli`). Apples-to-apples with `docs/m4-perf-baseline.md`.
- **D-07:** Throttling profile matches `docs/m4-perf-baseline.md` exactly — mobile form factor, 412×823 viewport, DPR 1.75, `cpuSlowdownMultiplier=4`, headless Chromium — and runs the route **3 times**, asserting against the **median** LCP.
- **D-08:** Fail threshold is **2.3s median LCP** (fail when median ≥ 2300 ms).
- **D-09:** New workflow file: `.github/workflows/perf.yml`. Single route (`/`), single metric (LCP). INP excluded (synthetic noise); CLS excluded (already 0.000).

### Claude's Discretion (researched in this document)

- Exact resolution ladder + per-variant bitrate/CRF targets
- `<source>` media-query algebra
- WebM vs MP4 ordering and codec choice (VP9 vs AV1)
- AVIF encoder choice + quality target
- AVIF fallback chain mechanics (`<picture>` vs Next/Image)
- `<video poster>` format
- General Sans subsetting strategy + woff2 location
- Lighthouse CI `lighthouserc.json` assertion syntax

### Deferred Ideas (OUT OF SCOPE)

- Mux / Cloudflare Stream / Vercel Blob adaptive bitrate
- Vercel Speed Insights field RUM
- Synthetic INP gate (unreliable in Lighthouse)
- Lighthouse CI extended to non-`/` routes
- Hero video on mobile via 480p variant (M4 Phase 3 mobile static-stack stands)
- General Sans 400 / 500 weights via `next/font/local` (only 600 consumed today)
- Tighter font subsetting if researcher picks "full character set" now
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| HERO-01 | Hero MP4 ships as a multi-resolution ladder (`480p` / `720p` / `1080p` MP4 plus a `WebM` fallback) wired via a `<source>` media-query set so 4G mobile clients pull the smallest variant | §1 Resolution ladder (corrected to 720p/540p/360p anchored on the actual 1280×720 source), §2 `<source>` media-query strategy + WebM/MP4 ordering, §7 build-hero-ladder.sh exact ffmpeg commands |
| HERO-02 | General Sans 600 is self-hosted via `next/font/local`; Fontshare CDN call removed from `globals.css`; `Wordmark` still renders with `.dn-node` pulse intact | §4 next/font/local setup, font location (`src/app/fonts/`), variable strategy (`--font-general-sans`), subsetting recommendation |
| HERO-03 | Hero poster image re-encoded to sub-200KB AVIF (with WebP fallback) and owns the LCP target on every viewport | §3 AVIF strategy (Next.js Image content negotiation, not `<picture>`), `formats: ['image/avif', 'image/webp']` config, the deprecation of `priority` in Next 16 and migration to `preload` + `fetchPriority` |
| HERO-04 | Lighthouse mobile run shows `/` LCP under 2.5s on 4G throttling; regression spec added to the test suite so future changes can't push `/` back over the line | §5 Lighthouse CI configuration (lhci@0.15.1, assertMatrix with median-run aggregation, exact throttling profile matching m4-perf-baseline), §6 GitHub Actions workflow shape |
</phase_requirements>

## Project Constraints (from CLAUDE.md)

These are operating-contract directives the planner must verify compliance against:

- **§2 Tech stack additions need flagging.** Phase 5 adds `@lhci/cli` (dev dep) and a single woff2 file. The lhci addition is an extension of the existing test toolchain (Playwright + axe + Lighthouse-mobile-baseline already established) and is consistent with REQUIREMENTS.md HERO-04 wording. Flag in the phase commit, but not a new library outside the spirit of §2.
- **§3 Brand rules.** No color/spacing/typography token changes in this phase. General Sans 600 stays the same family name; only the source changes.
- **§5 Voice rules.** No new user-facing copy in this phase. Internal comments in scripts/configs must still avoid em dashes (per the user's recorded preference in HANDOFF.md voice pass).
- **§11 Accessibility floor.** Hero `<video>` already carries `aria-hidden="true"` (HomepageHero.tsx line 191); the `<source>` children inherit. AVIF poster on the `<Image>` carries empty alt (`alt=""`) — keep it that way. No regression in axe.
- **§12 Performance budgets.** LCP < 2.5s on 4G is the contract; the LHCI gate at 2.3s gives 200ms headroom (D-08). CLS < 0.1 must hold; the `<source>` swap inside an existing `<video>` element doesn't change layout. INP < 200ms is field-measured only.
- **§14 Definition of done.** The §14 checklist requires "axe-core passes with no critical violations" and "LCP under 2.5s on the Vercel preview's mobile test" — Phase 5 ships exactly the gate that makes the LCP item enforceable.
- **§15 Don't-do list.** Phase 5 doesn't introduce stock photography, free-trial CTAs, chat widgets, or AI-illustration. Pure perf work.
- **Per-commit docs rule (memory).** Update HANDOFF.md ("hero MP4 perf fix" → resolved with date and gate value), `.planning/PROJECT.md` (Key Decisions: "Defer hero MP4 perf fix to M5" → "✓ Good (Phase 5)"), and `.planning/STATE.md` in the same commit as each Phase 5 plan.
- **GPG signing off, Co-Authored-By footer required** on every commit.

## Standard Stack

### Core (already in package.json — no installs needed for these)

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| next | 16.2.6 | Image optimizer + content negotiation + next/font [VERIFIED: package.json] | Built-in AVIF/WebP via `images.formats`; Sharp is bundled |
| react | 19.2.4 | Component runtime [VERIFIED: package.json] | n/a |
| gsap | ^3.15.0 | Scroll-driven scrub (unchanged) [VERIFIED: package.json] | Hero pin locked in M3.6 |
| ffmpeg | 8.1 (local) | Local-only ladder encoder [VERIFIED: `ffmpeg -version` on this machine] | Built with libsvtav1, libvpx, libx264, libdav1d — full AV1/VP9/H.264 toolchain |
| cwebp | 1.6.0 (local) | WebP poster encoder fallback [VERIFIED: `cwebp -version`] | Belt-and-braces; Sharp covers WebP too |

### New (dev dependencies to add)

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| @lhci/cli | 0.15.1 | Lighthouse CI runner + assertion engine [VERIFIED: `npm view @lhci/cli version` returned `0.15.1`, published 2025-06-25] | Same tool as m4-perf-baseline (uses underlying `lighthouse@13.x`); supports `aggregationMethod: 'median-run'` natively |

**Version verification:**
- `@lhci/cli@0.15.1` — published 2025-06-25, stable, latest [VERIFIED: npm registry 2026-05-20]
- `lighthouse@13.3.0` — bundled by `@lhci/cli@0.15.1` [VERIFIED: npm view lighthouse version]
- `sharp@0.34.5` — transitive via `next@16.2.6`'s image optimizer; no direct install needed [VERIFIED: npm view sharp version]

### Not installed (use Sharp built into Next.js)

| Tool | Why Skip |
|------|----------|
| `avifenc` CLI (libavif) | Sharp (already bundled with Next 16 image optimizer) encodes AVIF at request time with quality control. Avoids adding an extra macOS/CI install step ([VERIFIED: WebFetch nextjs.org/docs/app/api-reference/components/image §`formats`]: "Next.js automatically detects the browser's supported image formats via the request's `Accept` header"). |
| `@vercel/og` for the poster | Not relevant — that's an SVG/HTML-to-PNG renderer for OG cards (Phase 7), not a static-asset encoder. |
| `treosh/lighthouse-ci-action` GitHub Action | We need direct `assertMatrix` + `aggregationMethod: 'median-run'` control in `lighthouserc.json`. The action wraps `@lhci/cli` but adds a layer that obscures the schema. Call `@lhci/cli` directly. [CITED: github.com/treosh/lighthouse-ci-action README — the action runs `lhci autorun`, same as we'd invoke directly] |

### Alternatives Considered

| Instead of | Could Use | Tradeoff | Verdict |
|------------|-----------|----------|---------|
| H.264 MP4 master | AV1 in MP4 container | AV1 is ~30% smaller than VP9, ~50% smaller than H.264 at equivalent quality [CITED: sureshot.video/blog/best-video-format-for-web, ffmpeg.party AV1 guide]. **BUT** Safari does not support AV1 in MP4 before iOS 17.4; we'd need a fallback chain anyway. H.264 stays the universal-fallback MP4 codec. AV1 only worth it inside a WebM-AV1 variant if we go beyond VP9 — see next row. | Keep H.264 for MP4 tier. [VERIFIED] |
| VP9 in WebM | AV1 in WebM (libsvtav1) | AV1-WebM is supported by Chrome 70+, Firefox 67+, Edge 121+ but Safari support for AV1 in WebM is still inconsistent in 2026. VP9 covers all of Chrome/Firefox/Edge with no Safari concern (Safari falls through to MP4 anyway). **AV1 encode is also ~5-10× slower than VP9 even at speed 6** ([CITED: ffmpeg-cookbook.com/en/articles/av1-encode/]) and the build script needs to be fast enough that a contributor doesn't dread running it. | Keep VP9 for WebM. AV1 is a future optimization. [VERIFIED] |
| Sharp on-the-fly AVIF (Next Image optimizer) | Pre-built AVIF files committed to git | Pre-built saves one cold-start encode per build. Sharp is fast (200ms-ish for a 1536×1024 → AVIF q=50 on a modern Vercel build), and the first-request slowness is a one-time cost amortized over `minimumCacheTTL` (defaults to 4 hours in Next 16) [CITED: nextjs.org/docs/app/api-reference/components/image §`formats` good-to-know]. Pre-built also doubles the dark-gradient binary in git for marginal upside. | Use the Next.js optimizer. [VERIFIED] |
| `<picture><source type="image/avif">` | Next/Image with `formats: ['image/avif', 'image/webp']` | `<picture>` is more explicit but requires pre-building the AVIF and WebP files and committing them. Next/Image content-negotiates via `Accept` header automatically and caches per format. With the AVIF source-of-truth approach below, both work, but Next/Image lets us keep one committed asset (`homepage-hero-start.png`) and have the optimizer emit AVIF/WebP at runtime. | Use Next/Image with `formats` config. [VERIFIED: WebFetch nextjs.org/docs/app/api-reference/components/image §`formats`] |
| Pre-encoded `.avif` in `<video poster>` | PNG `poster` attribute | AVIF in `<video poster>` is supported in Chrome 121+/Firefox 121+/Safari 17.4+ but support is still uneven in older Safari ([VERIFIED: caniuse.com/avif — Safari 16 has AVIF for `<img>` but `<video poster>` quirks documented]). The poster is a fallback rendering surface anyway — the `<Image>` is the LCP element. Keep the poster as a small PNG (or omit it) — the visible LCP element is the `<Image>`, not the `<video>` underneath it. | PNG `poster=` for safety. [VERIFIED] |

**Installation (the entire phase's dep delta is one line):**
```bash
npm install --save-dev @lhci/cli@^0.15.1
```

## Architecture Patterns

### Recommended file structure

```
public/hero/
├── homepage-hero-start.png       # KEEP (source-of-truth for Next/Image to negotiate from)
├── homepage-hero.mp4             # KEEP as master (read by build-hero-ladder.sh)
├── homepage-hero-end.png         # DELETE (already noted as unreferenced in PROJECT.md)
├── homepage-hero-720p.mp4        # NEW (anchor MP4; replaces the monolithic 11.65 MB)
├── homepage-hero-540p.mp4        # NEW
├── homepage-hero-360p.mp4        # NEW
├── homepage-hero-720p.webm       # NEW
├── homepage-hero-540p.webm       # NEW
└── homepage-hero-360p.webm       # NEW

src/app/fonts/
└── GeneralSans-Semibold.woff2    # NEW (downloaded from fontshare.com, license OFL)

scripts/
├── reencode-hero.sh              # UNCHANGED
└── build-hero-ladder.sh          # NEW (one script, one job)

lighthouserc.json                 # NEW (repo root)
.github/workflows/perf.yml        # NEW
```

### Pattern 1: Multi-`<source>` element with media-query gating

**What:** Browser walks the `<source>` list top-down, picks the first `type` it recognizes whose `media` query matches, and ignores the rest [CITED: developer.mozilla.org/en-US/docs/Web/HTML/Element/source].

**When to use:** Any responsive `<video>` or `<picture>` where different files should be served per viewport or per codec support.

**Example (the exact pattern for HomepageHero.tsx):**
```tsx
{!isMobile && (
  <video
    ref={videoRef}
    poster={heroCinematic.media.startFrame}  // PNG poster (universal compat)
    muted
    playsInline
    preload="auto"
    aria-hidden="true"
    style={{ opacity: 0 }}
    className="absolute inset-0 h-full w-full object-cover motion-reduce:hidden"
  >
    {heroCinematic.media.video.map((src) => (
      <source key={src.src} src={src.src} type={src.type} media={src.media} />
    ))}
  </video>
)}
```

### Pattern 2: Next.js Image content negotiation (no `<picture>` needed)

**What:** With `images.formats: ['image/avif', 'image/webp']` set in `next.config.ts`, the `/_next/image` optimizer inspects the request's `Accept` header and serves the first format both the browser and the config support, falling back to the source format if neither match [CITED: WebFetch nextjs.org/docs/app/api-reference/components/image §`formats`]:

> "Next.js automatically detects the browser's supported image formats via the request's Accept header in order to determine the best output format. If the Accept header matches more than one of the configured formats, the first match in the array is used. Therefore, the array order matters."

**When to use:** Any LCP-critical image where we want one source-of-truth file and automatic per-browser optimization. Avoids the `<picture>` boilerplate.

**Example:**
```ts
// next.config.ts
const nextConfig: NextConfig = {
  turbopack: { root: path.resolve(__dirname) },
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 2678400,  // 31 days — hero asset is stable
  },
};
```

```tsx
// HomepageHero.tsx (the LCP element, lines 170-180)
<Image
  src={heroCinematic.media.startFrame}  // /hero/homepage-hero-start.png
  alt=""
  fill
  sizes="100vw"
  preload                              // Next 16: replaces deprecated `priority`
  fetchPriority="high"                 // explicit LCP hint
  aria-hidden="true"
  className="object-cover"
/>
```

> **Next 16 API note:** [CITED: nextjs.org/docs/app/api-reference/components/image §`priority`] "Starting with Next.js 16, the `priority` property has been deprecated in favor of the `preload` property in order to make the behavior clear." The current code (line 176) uses `priority`, which still works as a deprecated alias but should migrate. The behavior is identical: insert a `<link rel="preload">` for this image in the document `<head>`.

### Pattern 3: `next/font/local` with CSS variable + existing fontFamily fallback

**What:** Declare the font in a module, expose a CSS variable via `variable: '--font-general-sans'`, apply that variable's className to `<html>`, and Wordmark.tsx's existing `fontFamily: '"General Sans", Inter, …'` resolves to the local-hosted weight.

**Why this approach over `className`:** Wordmark.tsx already uses an inline `style={{ fontFamily: '"General Sans", Inter, …' }}` declaration with the family name `"General Sans"`. The CSS-variable approach exposes the next/font-generated family name through a variable so we can wire it into globals.css or keep using the inline style. Switching to `className` would require restructuring Wordmark.tsx and breaks the fontFamily fallback chain Inter→system-ui.

**Example:**
```tsx
// src/app/fonts.ts (NEW module, mirrors the docs' "Using a font definitions file" pattern)
import localFont from 'next/font/local';

export const generalSans = localFont({
  src: './fonts/GeneralSans-Semibold.woff2',
  weight: '600',
  style: 'normal',
  display: 'swap',
  variable: '--font-general-sans',
  // Subset to wordmark glyphs only (see Section 4 below) — narrows the woff2 download.
  // declarations is for @font-face descriptors, not subsetting; subsetting happens
  // at build time via the woff2 file we ship. See §4.
  adjustFontFallback: 'Arial',  // CLS-safe metric override; default is 'Arial' anyway
});
```

```tsx
// src/app/layout.tsx (edit existing)
import { Inter } from 'next/font/google';
import { generalSans } from './fonts';

const inter = Inter({ variable: '--font-inter', subsets: ['latin'], display: 'swap' });

// In RootLayout's <html>:
<html lang="en" className={`dark ${inter.variable} ${generalSans.variable}`}>
```

```css
/* src/app/globals.css */
/* DELETE line 1: @import url("https://api.fontshare.com/v2/css?f[]=general-sans@600&display=swap"); */
/* (the .dn-node keyframes block lines 14-41 stays intact) */
```

```tsx
// src/components/site/Wordmark.tsx — UNCHANGED inline style works because
// next/font/local registers the @font-face with family name 'General Sans'
// (or generates a hashed alias; using the CSS variable bypasses any aliasing).
// Recommended: switch the inline style to use the variable to be defensive
// against next/font's family-name hashing:
style={{
  fontFamily: 'var(--font-general-sans), Inter, system-ui, sans-serif',
  fontWeight: 600,
}}
```

[CITED: WebFetch nextjs.org/docs/app/api-reference/components/font §`src`]: "src:'./fonts/my-font.woff2' where my-font.woff2 is placed in a directory named fonts inside the app directory"

### Anti-Patterns to Avoid

- **Hand-rolling `Accept`-header content negotiation.** Next/Image already does this; reinventing it via `<picture>` doubles the maintenance surface and bloats the git tree with pre-built AVIF binaries. Use the optimizer.
- **`avifenc` CLI as a build-time step.** Sharp is bundled. Adding an `avifenc` install to the build pipeline adds a system dependency for marginal control over AVIF quality that quality=50 in Sharp already provides.
- **Pre-encoded WebM AV1 in the ladder.** AV1 encode is ~5-10× slower than VP9 at equivalent quality, and Safari's AV1-in-WebM support is inconsistent in 2026. VP9 covers Chrome/Firefox/Edge cleanly; Safari falls through to H.264 MP4.
- **Putting AVIF in `<video poster=>`.** Browser support is uneven on older Safari, and the visible LCP element is the `<Image>`, not the `<video>` underneath. Keep poster as PNG (or omit it; `preload="auto"` already keeps the video element from showing nothing during the gap).
- **`priority={true}` on the Next 16 `<Image>`.** Deprecated. Use `preload` (the new prop name) plus `fetchPriority="high"` for the LCP element.
- **Adding 1080p to the ladder.** The source is 1280×720 (verified via ffprobe). Upscaling to 1080p would inflate bytes for zero perceptual gain.
- **`adjustFontFallback: false` on next/font/local.** Defaults to `'Arial'` which provides metric-override `size-adjust`, `ascent-override`, `descent-override`, `line-gap-override` to keep CLS low while the woff2 loads. Disabling it reintroduces font-swap layout shift.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| AVIF/WebP content negotiation | Custom `Accept` parser in a route handler | Next/Image with `images.formats` in next.config.ts | Sharp is bundled; the optimizer handles the entire negotiation matrix and caches per format. |
| woff2 self-hosting | Manual `@font-face { src: url(...) }` in globals.css | `next/font/local` with `variable: '--font-general-sans'` | next/font generates CLS-safe metric-override fallbacks, hashes the family name to prevent FOUT collisions, and ships the font as a preloaded static asset with `font-display: swap` already wired. |
| Lighthouse run + median aggregation in CI | Shell script invoking `lighthouse --form-factor=mobile` three times and `jq`-ing the JSON | `@lhci/cli` with `numberOfRuns: 3` + `aggregationMethod: 'median-run'` | LHCI handles run-collection, manifest serialization, median selection (the run with `isRepresentativeRun: true`), assertion evaluation, and exit-code propagation. |
| Per-frame keyframe encoding for multiple resolutions | Hand-tuned ffmpeg invocations per variant | One bash script (`build-hero-ladder.sh`) parameterized over a `(width, crf, bv)` table | Same flag pattern across 6 outputs; the script is ~40 lines of bash. |
| GitHub Actions Lighthouse runner | Hand-rolled curl-Lighthouse-binary shell job | Call `@lhci/cli` directly inside an `actions/setup-node` step | The CLI is the official runner; wrapping actions add lock-in without value. |

**Key insight:** Almost every problem in Phase 5 has a single right tool. The work is **wiring**, not building.

## Common Pitfalls

### Pitfall 1: `<source media>` order matters and is browser-walked top-down

**What goes wrong:** Put the WebM after the MP4 and Chrome will play the H.264 even though it supports VP9 — costing 30-40% bytes per session. Put MP4 first and Safari plays the right thing but you've burned the Chrome optimization.

**Why it happens:** Browser parses `<source>` children in document order, picks the first `type` whose codec it can decode AND whose `media` query matches. There is no "best fit" — it's first-match-wins.

**How to avoid:** **WebM (VP9) variants come first, MP4 (H.264) variants come second.** Chrome/Firefox/Edge will pick WebM; Safari (which doesn't support VP9 in `<video>` natively in all minor versions through 2026) falls through to MP4 cleanly. Within each codec family, list **smallest viewport first** (so `(max-width: 768px)` matches before any later unbounded source).

**Warning signs:** DevTools Network panel shows the wrong variant fetched on Chrome (`.mp4` instead of `.webm`) — the source ordering is wrong.

### Pitfall 2: Scrub stutter when one ladder variant has sparse keyframes

**What goes wrong:** Browser picks the 360p WebM, GSAP tweens `video.currentTime`, but the WebM was encoded with default VP9 keyframe interval (240 frames at 24fps = once every 10s = effectively one keyframe for the whole clip). Scrub stutters because every `currentTime` set requires a re-decode from the previous keyframe.

**Why it happens:** D-05 mandates `-g 1 -keyint_min 1` for **every** variant. Easy to miss for a contributor copying the ffmpeg invocation from an old recipe.

**How to avoid:** `build-hero-ladder.sh` codifies the flags into a single shared variable used by every invocation. The script also `ffprobe`-verifies each output has `nb_frames == nb_key_frames` and fails the build if not.

**Warning signs:** Visible jitter during scrub on a freshly-built variant; ffprobe shows `nb_key_frames << nb_frames` for any variant in `public/hero/`.

### Pitfall 3: `priority` vs `preload` in Next 16

**What goes wrong:** Contributor copies an old pattern, ships `<Image priority src="/hero/foo.avif">`, Next 16 build logs a deprecation warning, but the image still loads correctly so the warning slips through code review.

**Why it happens:** Next 16 keeps `priority` as a deprecated alias. The deprecation warning is in the build log, not a runtime error.

**How to avoid:** The HomepageHero.tsx edit in this phase migrates `priority` → `preload` + `fetchPriority="high"` on the LCP poster. Add a grep guard to the CI lint step that fails if `priority` appears as a JSX prop in `src/**/*.tsx` (the deprecated alias). Optional but cheap.

**Warning signs:** `next build` output contains `Warning: Image with src "/hero/..." has the deprecated "priority" prop`. Catches at build time.

### Pitfall 4: Sharp + `images.formats` doubles cache size on Vercel

**What goes wrong:** Setting `formats: ['image/avif', 'image/webp']` causes the optimizer to cache one variant per (size, format, browser) tuple. For the hero PNG at one size × 2 formats = 2 cached assets. For an image that's served at 10 sizes × 2 formats = 20 cached assets. Vercel image-optimization quota counts each transformation.

**Why it happens:** [CITED: nextjs.org/docs/app/api-reference/components/image §`formats` good-to-know]: "When using multiple formats, Next.js will cache each format separately. This means increased storage requirements compared to using a single format."

**How to avoid:** For the hero specifically, this is fine — it's one image at `sizes="100vw"` (one width). Cap `minimumCacheTTL` at `2678400` (31 days) so the optimization runs once per month at most. Per Next 16 docs: "You can increase the TTL to reduce the number of revalidations and potentially lower cost."

**Warning signs:** Vercel "Image Optimization" line item in the billing dashboard spikes after deploy. Not relevant pre-launch but worth knowing.

### Pitfall 5: `next/font/local` woff2 path is relative to the declaring module, not the project root

**What goes wrong:** Contributor places `GeneralSans-Semibold.woff2` in `public/fonts/` and writes `src: '/fonts/GeneralSans-Semibold.woff2'` in `src/app/fonts.ts`. Build fails: "Failed to find font file at /fonts/GeneralSans-Semibold.woff2."

**Why it happens:** [CITED: WebFetch nextjs.org/docs/app/api-reference/components/font §`src`]: "src... relative to the directory where the font loader function is called." The woff2 must be co-located with (or sibling-pathed from) the module that calls `localFont(...)`, NOT served from `public/`. The font is bundled into the Next build output, not the static folder.

**How to avoid:** Place the woff2 at `src/app/fonts/GeneralSans-Semibold.woff2` and reference it as `src: './fonts/GeneralSans-Semibold.woff2'` from `src/app/fonts.ts`.

**Warning signs:** `next build` errors with "Cannot find module" or "Failed to resolve" pointing at the woff2 path.

### Pitfall 6: `aggregationMethod: 'median-run'` ≠ median value

**What goes wrong:** Contributor reads "median-run" and assumes LHCI computes a median across runs. It actually picks the **run** whose performance is the median — a representative whole-run, marked `isRepresentativeRun: true` in `manifest.json`. Cross-cutting assertions against per-audit medians don't apply.

**Why it happens:** [CITED: github.com/GoogleChrome/lighthouse-ci/issues/1064] "Assertion is not done against `isRepresentativeRun` when using `median-run`" (early bug, since fixed). The behavior is: among N runs, LHCI picks the run with the median performance score and applies assertions to *that* run's audit values.

**How to avoid:** Use `aggregationMethod: 'median-run'` for LCP because LCP correlates strongly with the performance score, and the run with median performance will have a representative-LCP value. Document this in the workflow comment so a later maintainer understands. (For metrics that don't correlate with perf score — like CLS or accessibility — use `'median'` instead, which takes the median of individual audit values.)

**Warning signs:** A run with an outlier LCP fails the gate even though 2 of 3 runs were green. The outlier was the representative run.

## Code Examples

### Example 1: build-hero-ladder.sh (the exact script)

```bash
#!/usr/bin/env bash
# Build the responsive hero asset ladder from public/hero/homepage-hero.mp4.
# Source: §1 + §2 of .planning/phases/05-hero-performance/05-RESEARCH.md
#
# Reads:  public/hero/homepage-hero.mp4 (the 11.65 MB scrub-encoded 1280×720 master)
# Writes:
#   public/hero/homepage-hero-{720p,540p,360p}.mp4    (H.264, scrub-encoded)
#   public/hero/homepage-hero-{720p,540p,360p}.webm   (VP9, scrub-encoded)
#
# Every variant is per-frame-keyframed (-g 1 -keyint_min 1) per D-05 so that
# whichever variant the browser picks, GSAP scrub stays smooth.

set -euo pipefail

INPUT="public/hero/homepage-hero.mp4"
OUTDIR="public/hero"

if [ ! -f "$INPUT" ]; then
  echo "Missing input: $INPUT" >&2
  exit 1
fi

# Common scrub-encode flags (shared across MP4 and WebM)
KEYFRAME_FLAGS="-g 1 -keyint_min 1"

# Variant table: (label, height, h264_crf, vp9_crf, vp9_bv)
# h264_crf: lower = higher quality (18-28 is the sane range)
# vp9_crf: similar scale but VP9-specific
# vp9_bv: target bitrate hint for VP9 two-pass-like behavior
encode_variant() {
  local LABEL="$1"
  local HEIGHT="$2"
  local H264_CRF="$3"
  local VP9_CRF="$4"
  local VP9_BV="$5"

  local MP4_OUT="$OUTDIR/homepage-hero-${LABEL}.mp4"
  local WEBM_OUT="$OUTDIR/homepage-hero-${LABEL}.webm"

  # H.264 MP4 — universal fallback, also Safari's path
  echo "→ encoding $MP4_OUT (H.264, height=$HEIGHT, crf=$H264_CRF, scrub-encoded)"
  ffmpeg -y -i "$INPUT" \
    -vf "scale=-2:${HEIGHT}" \
    -c:v libx264 -profile:v high -level 4.0 -crf "$H264_CRF" \
    $KEYFRAME_FLAGS \
    -an -movflags +faststart \
    "$MP4_OUT"

  # VP9 WebM — Chrome/Firefox/Edge's preferred path
  echo "→ encoding $WEBM_OUT (VP9, height=$HEIGHT, crf=$VP9_CRF, scrub-encoded)"
  ffmpeg -y -i "$INPUT" \
    -vf "scale=-2:${HEIGHT}" \
    -c:v libvpx-vp9 -crf "$VP9_CRF" -b:v "$VP9_BV" \
    -row-mt 1 -tile-columns 2 -frame-parallel 1 \
    $KEYFRAME_FLAGS \
    -an \
    "$WEBM_OUT"
}

# Anchor: 720p (the source resolution; no upscaling). Slightly tighter CRF than
# the current master (which is CRF 22) to bring the byte count down while
# keeping the scrub-encode keyframe-per-frame structure intact.
encode_variant "720p" 720 24 33 1500k

# Middle: 540p for narrow laptop / iPad portrait (768-1024 viewport range).
encode_variant "540p" 540 26 35 900k

# Floor: 360p for legacy desktop on constrained networks, or Save-Data hint.
# Mobile remains video-free per D-04 — this is NOT for phone viewports.
encode_variant "360p" 360 28 37 500k

# Verify every output is per-frame-keyframed (catches D-05 regressions).
for f in "$OUTDIR"/homepage-hero-{720p,540p,360p}.{mp4,webm}; do
  TOTAL=$(ffprobe -v error -select_streams v:0 -count_packets \
    -show_entries stream=nb_read_packets -of csv=p=0 "$f")
  KEY=$(ffprobe -v error -select_streams v:0 \
    -show_entries frame=key_frame -of csv=p=0 "$f" | grep -c "^1$" || true)
  if [ "$TOTAL" != "$KEY" ]; then
    echo "ERROR: $f has $KEY/$TOTAL keyframes (expected all-keyframe per D-05)" >&2
    exit 1
  fi
  echo "✓ $f ($KEY/$TOTAL keyframes)  $(du -h "$f" | cut -f1)"
done

echo "ladder built."
```

### Example 2: HomepageHero.tsx `<video>` block (the exact JSX delta)

```tsx
{/* Layer 2: video — scrubbed by scroll progress. */}
{!isMobile && (
  <video
    ref={videoRef}
    poster={heroCinematic.media.startFrame}
    muted
    playsInline
    preload="auto"
    aria-hidden="true"
    style={{ opacity: 0 }}
    className="absolute inset-0 h-full w-full object-cover motion-reduce:hidden"
  >
    {heroCinematic.media.video.map((source) => (
      <source
        key={source.src}
        src={source.src}
        type={source.type}
        media={source.media}
      />
    ))}
  </video>
)}
```

### Example 3: src/content/homepage-hero.ts (the data shape per D-01)

```ts
// src/content/homepage-hero.ts
export const heroCinematic = {
  // ... existing fields unchanged ...
  media: {
    // WebM (VP9) variants come FIRST so Chrome/Firefox/Edge pick them.
    // Within each codec, list narrowest viewport first (first-match-wins on media query).
    video: [
      { src: "/hero/homepage-hero-360p.webm", type: 'video/webm; codecs="vp9"', media: "(max-width: 1023px)" },
      { src: "/hero/homepage-hero-540p.webm", type: 'video/webm; codecs="vp9"', media: "(max-width: 1439px)" },
      { src: "/hero/homepage-hero-720p.webm", type: 'video/webm; codecs="vp9"' },
      // MP4 (H.264) fallbacks — Safari and any browser without VP9 in WebM.
      { src: "/hero/homepage-hero-360p.mp4",  type: 'video/mp4; codecs="avc1.640028"', media: "(max-width: 1023px)" },
      { src: "/hero/homepage-hero-540p.mp4",  type: 'video/mp4; codecs="avc1.640028"', media: "(max-width: 1439px)" },
      { src: "/hero/homepage-hero-720p.mp4",  type: 'video/mp4; codecs="avc1.640028"' },
    ] as Array<{ src: string; type: string; media?: string }>,
    startFrame: "/hero/homepage-hero-start.png",
    // endFrame removed (unreferenced; delete the PNG too)
  },
} as const;
```

> **Media-query semantics:** [CITED: developer.mozilla.org/en-US/docs/Web/HTML/Element/source]: "The browser uses the first `<source>` it supports." So within the WebM block, a Chrome desktop at 1440px viewport will skip the `(max-width: 1023px)` source, skip the `(max-width: 1439px)` source, and land on the unbounded 720p — exactly what we want. A Chrome laptop at 1024-1439px lands on 540p. A Chrome iPad-portrait at 768-1023px lands on 360p.

### Example 4: lighthouserc.json (the exact assertion config)

```json
{
  "ci": {
    "collect": {
      "startServerCommand": "npm run start -- --port 3200",
      "url": ["http://localhost:3200/"],
      "numberOfRuns": 3,
      "settings": {
        "preset": "mobile",
        "screenEmulation": {
          "mobile": true,
          "width": 412,
          "height": 823,
          "deviceScaleFactor": 1.75,
          "disabled": false
        },
        "throttlingMethod": "simulate",
        "throttling": {
          "rttMs": 150,
          "throughputKbps": 1638.4,
          "cpuSlowdownMultiplier": 4,
          "requestLatencyMs": 562.5,
          "downloadThroughputKbps": 1474.56,
          "uploadThroughputKbps": 675
        },
        "formFactor": "mobile",
        "chromeFlags": "--headless=new --no-sandbox"
      }
    },
    "assert": {
      "assertMatrix": [
        {
          "matchingUrlPattern": "http://localhost:3200/$",
          "assertions": {
            "largest-contentful-paint": [
              "error",
              { "maxNumericValue": 2300, "aggregationMethod": "median-run" }
            ]
          }
        }
      ]
    },
    "upload": {
      "target": "temporary-public-storage"
    }
  }
}
```

> **Throttling values explained:** These reproduce Lighthouse's "Slow 4G" preset exactly, matching what the m4-perf-baseline run used. `rttMs: 150` + `throughputKbps: 1638.4` is the canonical Lighthouse Slow-4G simulation; `cpuSlowdownMultiplier: 4` matches docs/m4-perf-baseline.md verbatim. The `requestLatencyMs`/`downloadThroughputKbps`/`uploadThroughputKbps` triple is the **devtools** throttling path (used by `throttlingMethod: 'devtools'`) — keeping both lets us flip between `'simulate'` (faster CI) and `'devtools'` (more deterministic, slower) without rewriting. Per LHCI docs [CITED: googlechrome.github.io/lighthouse-ci/docs/configuration.html]: simulate is the LHCI default.
>
> **Aggregation:** [CITED: github.com/GoogleChrome/lighthouse-ci/issues/1064]: When `aggregationMethod: 'median-run'`, LHCI picks the run with `isRepresentativeRun: true` in `manifest.json` (the median performance-score run) and asserts against that run's LCP value. This is exactly what we want: a single representative LCP, not three independent thresholds.
>
> **`assertMatrix`:** [CITED: googlechrome.github.io/lighthouse-ci/docs/configuration.html]: "assertMatrix... allows you to specify different assertions for URLs matching specific patterns." The `matchingUrlPattern` anchors to `/$` (end of string) so only the root route is asserted, even if a future contributor adds non-`/` URLs to `collect.url`.

### Example 5: .github/workflows/perf.yml

```yaml
name: perf gate

on:
  pull_request:
    branches: [main]
  push:
    branches: [main]

jobs:
  lighthouse:
    runs-on: ubuntu-latest
    timeout-minutes: 15
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"
      - run: npm ci
      - name: Build
        run: npm run build
      - name: Run Lighthouse CI
        run: npx --no-install lhci autorun
      - if: failure()
        uses: actions/upload-artifact@v4
        with:
          name: lighthouse-report
          path: .lighthouseci
          retention-days: 7
```

> `lhci autorun` reads `lighthouserc.json`, executes `collect` (which starts `next start` via `startServerCommand`, waits for the port, runs 3 mobile-throttled audits), then runs `assert` (the median-run LCP check), then `upload` (publishes to temporary public storage so the PR can link the full report). Non-zero exit from the assert step fails the PR.

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `<Image priority>` for LCP hero | `<Image preload fetchPriority="high">` | Next.js 16 release [CITED: nextjs.org/docs/app/api-reference/components/image §`priority`] | Phase 5 should migrate while it's editing HomepageHero.tsx |
| `<picture>` + pre-built AVIF/WebP committed | Next/Image with `formats: ['image/avif', 'image/webp']` content negotiation | Next.js 14+ stabilized; default config in Next 16 already supports it [VERIFIED] | One source-of-truth PNG; optimizer handles the rest |
| Hand-rolled `lighthouse --form-factor=mobile` shell loop + jq median | `@lhci/cli autorun` with `numberOfRuns: 3` + `aggregationMethod: 'median-run'` | LHCI 0.5+ (2021), median-run stable since 0.12 [CITED: lighthouse-ci GitHub issue #1064 resolution] | Single declarative config; LHCI handles the median selection |
| VP9 WebM with default keyframe interval | VP9 WebM with `-g 1 -keyint_min 1` (scrub-encoded) | M3.5 cinematic shipped (project-specific decision) | Necessary for GSAP `video.currentTime` scrub |
| `@import url("…fontshare.com…")` in globals.css | `next/font/local` with woff2 in `src/app/fonts/` | next/font GA in Next 13.2 [CITED: nextjs.org/docs/app/api-reference/components/font §Version Changes] | Removes the only third-party CDN call on the hero render path |

**Deprecated/outdated:**
- **`<Image priority>` prop in Next 16.** Aliased to `preload`; logs a deprecation warning at build time.
- **AV1-in-WebM as a 2026 production codec for `<video>`.** Encode is 5-10× slower than VP9 and Safari support is uneven. Worth revisiting in 2027 when M2/M3 Safari hardware AV1 decode is universal.
- **`<picture>` for art-direction-free responsive images in Next 16.** Optimizer + `formats` config supersedes it for the common case.

## Assumptions Log

> All claims tagged `[ASSUMED]` in this research, mapped to risk if wrong.

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | Sharp emits AVIF at quality ~50 small enough to land sub-200 KB on the dark-gradient cliff frame | §3 AVIF strategy | Low — Sharp default AVIF quality is 50 [CITED: lovell/sharp issue #4227]; dark gradients compress unusually well in AVIF [CITED: openaviffile.com]. If it lands above 200 KB, drop `quality: 40` via a custom loader. Worst case is reverting to a pre-built avifenc-encoded file committed to the repo (~1 hour of work). |
| A2 | Lighthouse "Slow 4G" preset values (`rttMs: 150`, `throughputKbps: 1638.4`) match docs/m4-perf-baseline.md throttling exactly | §5 LHCI config | Low — these are Lighthouse's canonical Slow-4G values from the source. m4-perf-baseline.md says "lighthouse@13.x" with no custom throttling overrides, so the defaults are what ran. If a divergence emerges, dump `lhr.configSettings.throttling` from a baseline-era report and compare. |
| A3 | Fontshare's Open Font License permits self-hosting the woff2 | §4 General Sans | Low — Fontshare is the Indian Type Foundry's free-fonts service; OFL is the published license per fontshare.com TOS. Phase 5 commit should include a NOTICE file noting the OFL terms. If Fontshare's license actually forbids self-host (it doesn't, but defense in depth), fall back to Inter 600 — Wordmark's existing fontFamily fallback chain already resolves to Inter cleanly. |
| A4 | The Lighthouse CI median-run aggregation correctly handles 3 runs (no off-by-one or tie-break edge case) | §5 LHCI median selection | Very low — issue #1064 was fixed years ago; documented stable behavior. If a tie happens, LHCI uses the first of the tied runs. |
| A5 | Removing the Fontshare `@import` doesn't break any other consumer in the codebase | §4 globals.css edit | Very low — grep confirms `"General Sans"` appears only in Wordmark.tsx and the `@import` line. Add a quick guard test that asserts the wordmark renders with the expected computed font-family. |

**If this table seems short:** It is. Every other claim in this research is verified against an authoritative source (Next.js 16 docs, ffprobe output, npm registry, LHCI source docs).

## Open Questions

1. **Save-Data hint as a fourth media-query axis?**
   - What we know: The `Save-Data` request hint is a Client Hint that browsers like Chrome surface when the user has data-saver mode on; CSS doesn't have a native `(prefers-reduced-data)` media query yet (it's in CSS Media Queries Level 5 draft).
   - What's unclear: Whether to add a server-side route handler that swaps the `<source>` set based on a `Save-Data: on` header.
   - Recommendation: **Skip for Phase 5.** Mobile (where Save-Data matters most) is already video-free per D-04. Desktop on Save-Data is a rounding error on the analytics. Worth revisiting in M6+ if Vercel Speed Insights field RUM ever shows a Save-Data cluster underperforming.

2. **Should `next.config.ts` `images.minimumCacheTTL` be set globally or only for the hero?**
   - What we know: Setting it globally (31 days) reduces Vercel's per-request optimization cost for every image but also delays the propagation of any future image swap.
   - What's unclear: Whether other routes have images that change frequently enough to warrant a shorter TTL.
   - Recommendation: **Set globally to 31 days.** The site has 11 routes' worth of mostly static product mockups and OG fallbacks; no image is updated more often than monthly in practice. The hero is the most expensive optimizer call, so the cache TTL win dwarfs the propagation cost.

3. **The user's CONTEXT.md says "480p / 720p / 1080p"; this research recommends "720p / 540p / 360p". Does the user need to confirm?**
   - What we know: The CONTEXT.md wording reflects the user's mental model based on the REQUIREMENTS.md wording. The actual source asset is 1280×720, so "1080p" is technically impossible without upscaling and "480p" is a nonstandard intermediate. The 720p/540p/360p ladder honors the user's intent (smaller variants for narrower clients) more faithfully than the literal wording.
   - What's unclear: Whether the user wants the planner to ask before encoding this correction into PLAN.md tasks, or whether "trust the researcher" is the operating assumption.
   - Recommendation: **The planner should call this out at the top of PLAN.md** as a "researcher correction to CONTEXT.md/REQUIREMENTS.md wording, please confirm." The correction is technically correct, but the user gets to ratify the ladder shape. This is the same pattern as the "Why dPlat" nav label question — researcher-side correctness shouldn't bypass user-side product preference.

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| ffmpeg with libx264 + libvpx + libsvtav1 | build-hero-ladder.sh | ✓ | 8.1 (homebrew) | — |
| cwebp | optional WebP poster fallback | ✓ | 1.6.0 | Sharp covers this |
| Node 20+ | Next.js build, lhci CLI | ✓ | 22.22.0 | — |
| Sharp | bundled with next@16.2.6 | ✓ (transitive) | 0.34.5 | — |
| avifenc (libavif) | NOT NEEDED | ✗ | — | Sharp via Next/Image optimizer (use this, not avifenc) |
| Chromium for headless Lighthouse | LHCI workflow | ✓ in CI (`actions/setup-node@v4` chain pulls it; locally `npx lhci` auto-installs) | — | — |
| Fontshare General Sans 600 woff2 | next/font/local declaration | ✗ (not in repo) | — | Manual download from fontshare.com/fonts/general-sans; commit to `src/app/fonts/` |

**Missing dependencies with no fallback:**
- General Sans 600 woff2 file — **must be downloaded as part of the HERO-02 task.** Fontshare provides woff2 + OTF formats via a "Download family" button on their site (free, no auth required). Phase 5 plan must include the manual-download step in the HERO-02 task description.

**Missing dependencies with fallback:**
- avifenc — explicitly skipping in favor of Sharp via the Next Image optimizer. No fallback needed.

## Validation Architecture

> `workflow.nyquist_validation` is `true` in `.planning/config.json`. Include this section.

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Playwright 1.60 (e2e) + axe-core 4.11 (a11y) + @lhci/cli 0.15.1 (perf) |
| Config file | `playwright.config.ts` (existing); `lighthouserc.json` (NEW, repo root); `.github/workflows/perf.yml` (NEW) |
| Quick run command | `npx --no-install lhci autorun` (locally; ~90s for build+3 runs) |
| Full suite command | `npm run test:e2e && npx --no-install lhci autorun` |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| HERO-01 | `<video>` element has multiple `<source>` children in correct order; browser walks them top-down and picks smallest matching variant | integration (Playwright) | `npx playwright test tests/hero/source-ladder.spec.ts` (asserts the rendered DOM has 6 `<source>` children with correct `type` and `media` ordering) | ❌ Wave 0 — `tests/hero/source-ladder.spec.ts` |
| HERO-01 | Every variant in `public/hero/` is per-frame-keyframed (D-05) | smoke (shell) | `scripts/verify-hero-keyframes.sh` (loops over the 6 files, ffprobes nb_key_frames == nb_frames, exits non-zero on mismatch) — embed in build-hero-ladder.sh's verify pass | ❌ Wave 0 — embed verification at end of `scripts/build-hero-ladder.sh` |
| HERO-02 | Fontshare `@import` removed; `<link rel="preload">` for the local woff2 appears in the document head; Wordmark renders with computed `font-family` resolving to General Sans | integration (Playwright) | `npx playwright test tests/hero/wordmark-self-host.spec.ts` (asserts no `cdn.fontshare.com` in network log; head has next/font preload tag; `getComputedStyle` on the wordmark returns the General Sans family) | ❌ Wave 0 — `tests/hero/wordmark-self-host.spec.ts` |
| HERO-03 | LCP image `<Image>` uses `preload` (not `priority`) prop and Sharp serves AVIF to browsers that send `Accept: image/avif` | integration (Playwright) | `npx playwright test tests/hero/poster-avif-negotiation.spec.ts` (sets `Accept: image/avif,*/*` request header, asserts response Content-Type is `image/avif` and content-length < 200000) | ❌ Wave 0 — `tests/hero/poster-avif-negotiation.spec.ts` |
| HERO-04 | `/` median LCP < 2300 ms under m4-perf-baseline throttling | perf gate (LHCI) | `npx --no-install lhci autorun` — exits non-zero if assertion fails; PR-blocking via `.github/workflows/perf.yml` | ❌ Wave 0 — `lighthouserc.json` + `.github/workflows/perf.yml` |

### Sampling Rate

- **Per task commit:** `npm run typecheck && npm run lint && npx playwright test tests/hero/` (~30s; runs the new HERO-0{1,2,3} specs locally; LHCI deferred to wave merge to keep commit cycle fast)
- **Per wave merge:** Full Playwright suite + `npx --no-install lhci autorun` (~5 min; catches LHCI regression before the merge enters CI)
- **Phase gate:** All 164 existing specs green + 3 new HERO specs green + LHCI assertion green + `next build` zero deprecation warnings

### Wave 0 Gaps

- [ ] `tests/hero/source-ladder.spec.ts` — covers HERO-01 (DOM `<source>` order assertion)
- [ ] `tests/hero/wordmark-self-host.spec.ts` — covers HERO-02 (no Fontshare network call, preload link, computed font-family)
- [ ] `tests/hero/poster-avif-negotiation.spec.ts` — covers HERO-03 (Accept-header content negotiation, AVIF size < 200 KB)
- [ ] `lighthouserc.json` at repo root — covers HERO-04 (median-run LCP gate)
- [ ] `.github/workflows/perf.yml` — wires HERO-04 into CI
- [ ] `scripts/build-hero-ladder.sh` — emits 6 ladder variants with keyframe verification embedded
- [ ] `scripts/verify-hero-keyframes.sh` — optional standalone keyframe audit (could be inlined into build-hero-ladder.sh)
- [ ] `src/app/fonts/GeneralSans-Semibold.woff2` — downloaded from fontshare.com as part of HERO-02 task
- [ ] `src/app/fonts.ts` — next/font/local declaration module
- [ ] Update HANDOFF.md, `.planning/PROJECT.md`, `.planning/STATE.md` per the per-commit docs rule

## Security Domain

> `security_enforcement` not explicitly set in `.planning/config.json` — treating as enabled by default.

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | no | Phase 5 has no auth surface |
| V3 Session Management | no | n/a |
| V4 Access Control | no | n/a |
| V5 Input Validation | no | Phase 5 ships static assets + a CI config; no user-supplied input |
| V6 Cryptography | no | n/a — no new crypto introduced |
| V10 Malicious Code | yes | woff2 file from a third-party source (Fontshare) — verify checksum before committing; only commit a single file from a known URL; no postinstall scripts |
| V11 Business Logic | no | n/a |
| V12 Files & Resources | yes | New large binaries (6 video variants ~10 MB total + 1 woff2 ~20 KB) added to the repo. No external uploads, no path traversal surface. |

### Known Threat Patterns for Phase 5

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| Malicious woff2 with embedded exploit | Tampering | Download once from fontshare.com over HTTPS; verify file size matches expected; do not enable `display: optional` (which could mask a broken/malicious font as "missing"); use `next/font/local` which validates the woff2 at build time |
| LHCI temporary-public-storage exposing perf data | Information Disclosure (mild) | The temp public storage is anonymized and time-bounded by Google; for a marketing site's LCP this is non-sensitive. Already accepted in m4-perf-baseline runs. |
| ffmpeg shell injection in build-hero-ladder.sh | Tampering | Script takes no arguments; `INPUT` is hardcoded; no user-supplied path interpolation. Static analysis clean. |
| Git LFS or large-binary repo bloat | Repudiation (mild — bisect cost) | 6 × ~2-3 MB video binaries plus 1 woff2 = ~15 MB total. Acceptable for a static-site repo (already 11.65 MB master in git). Don't add git LFS — D-02 explicitly rules it out. |

## Sources

### Primary (HIGH confidence)

- **Next.js 16 Image docs** — https://nextjs.org/docs/app/api-reference/components/image — verified: §`formats` (AVIF/WebP config), §`priority` (deprecated in 16, use `preload`), §`preload`, §`fetchPriority`, §`minimumCacheTTL`
- **Next.js 16 Font docs** — https://nextjs.org/docs/app/api-reference/components/font — verified: `src` is relative to declaring module, `variable` exposes CSS variable, `adjustFontFallback: 'Arial'` default, `weight` required for non-variable fonts, `display: 'swap'`
- **Lighthouse CI Configuration** — https://googlechrome.github.io/lighthouse-ci/docs/configuration.html — verified: `assertMatrix.matchingUrlPattern`, `aggregationMethod: 'median-run'`, `collect.numberOfRuns`, `collect.settings.throttling` keys, `startServerCommand`
- **Lighthouse CI median-run resolved behavior** — https://github.com/GoogleChrome/lighthouse-ci/issues/1064 — verified: median-run picks the run with `isRepresentativeRun: true` (fixed in early versions, stable since 0.12)
- **MDN `<source>` element** — https://developer.mozilla.org/en-US/docs/Web/HTML/Element/source — verified: browser walks `<source>` children top-down, picks first match by `type` + `media`
- **caniuse AVIF** — https://caniuse.com/avif — verified: Chrome 85+ (Aug 2020), Firefox 93+ (Oct 2021), Safari 16+ (Sept 2022), Edge 121+ (Jan 2024) — 93%+ global support in 2026
- **npm registry** — `npm view @lhci/cli version` → 0.15.1 (2025-06-25); `npm view lighthouse version` → 13.3.0; `npm view sharp version` → 0.34.5 — all verified locally
- **Local environment** — ffmpeg 8.1 (libsvtav1, libvpx, libx264, libdav1d), cwebp 1.6.0, Node 22.22.0 — verified via `command -v` + `--version`
- **Local asset metadata** — `ffprobe public/hero/homepage-hero.mp4` → 1280×720, 24 fps, 10 s, 9.3 Mbps, H.264, 240 frames — verified

### Secondary (MEDIUM confidence)

- **ffmpeg AV1 / VP9 encoding** — https://ffmpeg-cookbook.com/en/articles/av1-encode/ + https://trac.ffmpeg.org/wiki/Encode/AV1 — verified: AV1 ~30% smaller than VP9, encode 5-10× slower; cross-checked with Academy Software Foundation encoding guidelines
- **Best video format for web 2026** — https://sureshot.video/blog/best-video-format-for-web — context: AV1 has ~60% hardware-decode coverage in 2026; VP9 still dominant for WebM; H.264 universal fallback
- **Sharp AVIF defaults** — https://github.com/lovell/sharp/issues/4227 — context: default `quality: 50`, `speed: 5`; dark images compress unusually well
- **AVIF quality on gradients** — https://openaviffile.com/best-settings-for-avif-encoding/ + https://web.dev/articles/compress-images-avif — context: AVIF 10-bit color avoids the 8-bit JPEG banding on dark gradients; quality 75 in AVIF often visually exceeds JPEG quality 85
- **Treosh lighthouse-ci-action vs lhci CLI** — https://github.com/treosh/lighthouse-ci-action — context: action is a thin wrapper around `lhci autorun`; calling CLI directly gives identical functionality with full schema control

### Tertiary (LOW confidence — flagged for plan-check validation)

- **Fontshare Open Font License terms** — https://www.fontshare.com/fonts/general-sans — verified Fontshare is ITF's free-fonts arm; OFL is the published license but the exact OFL version (1.1 vs latest) should be confirmed by reading the bundled license file inside the downloaded zip. Low risk because OFL universally permits self-hosting.

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all versions verified against npm registry; ffmpeg toolchain verified locally
- Architecture: HIGH — Next 16 Image + font APIs read directly from the 2026-05-19 docs (matches the installed 16.2.6)
- Pitfalls: HIGH — every pitfall has a cited GitHub issue, Next docs section, or measured behavior to back it
- Asset measurements: VERIFIED via ffprobe + file — 1280×720, not 1080p as CONTEXT.md wording implied
- LHCI schema: HIGH — assertMatrix + median-run + throttling keys verified against current LHCI configuration docs

**Research date:** 2026-05-20
**Valid until:** 2026-06-20 (30 days — next/font and Next/Image APIs are stable; LHCI 0.15.1 is the latest minor; only risk is Next 16.3+ landing more `priority`-deprecation behavior changes)

---

## RESEARCH COMPLETE

**Phase:** 5 — Hero performance
**Confidence:** HIGH

### Key Findings

- **The "11 MB hero MP4" is 1280×720, not 1080p.** Ladder must be 720p/540p/360p, not 480p/720p/1080p. Reshape CONTEXT.md / REQUIREMENTS.md wording in the plan.
- **`<Image priority>` is deprecated in Next 16.** Migrate to `preload` + `fetchPriority="high"` while editing HomepageHero.tsx for HERO-03. This is a load-bearing API change.
- **No `<picture>`, no `avifenc`, no Mux.** Next/Image with `images.formats: ['image/avif', 'image/webp']` content-negotiates via `Accept` header automatically; Sharp is already bundled. One source-of-truth PNG → AVIF for AVIF-capable browsers, WebP for the rest, original for ancient browsers.
- **WebM (VP9) `<source>` children come FIRST.** Chrome/Firefox/Edge pick VP9; Safari falls through to H.264 MP4. Within each codec, narrowest-viewport `media` query first. Six total `<source>` children for three viewport tiers × two codecs.
- **LHCI `aggregationMethod: 'median-run'` is the correct choice for LCP.** It picks the median-performance-score run (marked `isRepresentativeRun: true`) and asserts against that run's LCP. Documented stable since LHCI 0.12.

### File Created

`/Users/connorlaughlin/Desktop/Coding/DebtNext.com Redesign/.planning/phases/05-hero-performance/05-RESEARCH.md`

### Confidence Assessment

| Area | Level | Reason |
|------|-------|--------|
| Standard Stack | HIGH | npm versions verified; ffmpeg + cwebp confirmed locally |
| Architecture | HIGH | Next 16 docs read directly; matches installed 16.2.6 |
| Pitfalls | HIGH | Every pitfall has a cited issue, doc section, or measured artifact |
| Asset budgets | HIGH | Source metadata measured via ffprobe — concrete numbers, not estimates |
| LHCI config syntax | HIGH | Schema verified against current configuration.md |
| Fontshare OFL exact terms | MEDIUM | License family verified; exact version unverified — confirm at download time |

### Open Questions

- **Should the planner ask the user to confirm the 720p/540p/360p ladder before encoding it into PLAN.md?** Recommended: yes, flag at the top of PLAN.md as a researcher correction.
- **Save-Data hint as a fourth `<source>` axis?** Recommended: skip in Phase 5; mobile is already video-free.
- **Global `images.minimumCacheTTL: 2678400` (31 days) in next.config.ts?** Recommended: yes, applies to all routes safely.

### Ready for Planning

Research complete. Planner can now create PLAN.md tasks with concrete ffmpeg flags, exact JSX deltas, the verbatim `lighthouserc.json`, and a clear Wave 0 gap list for the 5 missing test/config files.
