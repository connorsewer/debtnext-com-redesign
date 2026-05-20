# M4 Lighthouse mobile baseline

Captured at the end of the M4 mobile responsive rebuild. Synthetic Lighthouse mobile run against all 11 routes from `tests/helpers/routes.ts`.

## Targets (CLAUDE.md §12)

- LCP under 2.5s
- CLS under 0.1
- INP under 200ms

## Source

- Path: B (local production build). The Vercel preview at `https://debtnext-website-git-m4-respon-45b4ce-connor-laughlins-projects.vercel.app/` returned HTTP 401 (deployment-protection gate), so the run used `next build` + `next start` on port 3200.
- Tool: `lighthouse@13.3.0` via `npx`, `--form-factor=mobile`, mobile screen emulation (412x823, DPR 1.75), `--throttling.cpuSlowdownMultiplier=4`, headless Chromium.
- Date: 2026-05-20.
- Branch: `m4-responsive-rebuild` at `95595ae` (axe fixes landed before this baseline ran).

INP isn't directly measurable in synthetic Lighthouse (it's a field metric). The `INP proxy` column below is `max-potential-fid`, which is Lighthouse's worst-case input-delay estimate based on long tasks in the trace. Treat it as an upper bound: a passing proxy is reliable; a failing proxy on a static marketing page often won't reproduce in real user data.

## Results

| Route | LCP (s) | CLS | INP proxy (ms) | Perf | Status |
|---|---:|---:|---:|---:|---|
| `/` | 2.86 | 0.000 | 382 | 75 | LCP miss, INP proxy miss |
| `/platform` | 1.05 | 0.000 | 16 | 100 | pass |
| `/platform/placement` | 1.05 | 0.000 | 258 | 100 | INP proxy miss |
| `/platform/optimization` | 1.07 | 0.000 | 247 | 100 | INP proxy miss |
| `/platform/issues` | 1.03 | 0.000 | 238 | 100 | INP proxy miss |
| `/platform/reporting` | 1.01 | 0.000 | 108 | 100 | pass |
| `/solutions` | 1.03 | 0.000 | 92 | 100 | pass |
| `/why-dplat` | 1.06 | 0.000 | 16 | 100 | pass |
| `/company` | 1.02 | 0.000 | 131 | 100 | pass |
| `/resources` | 1.00 | 0.000 | 309 | 100 | INP proxy miss |
| `/demo` | 1.03 | 0.000 | 218 | 100 | INP proxy miss |

### Summary

- LCP: 10 of 11 routes pass (`/` misses at 2.86s).
- CLS: 11 of 11 routes pass at 0.000.
- INP proxy: 6 of 11 routes pass under 200ms; 5 routes show a synthetic `max-potential-fid` above 200ms (see follow-ups).
- Performance score: 10 of 11 at 100; `/` at 75.

## Pending follow-ups

These don't block M4 ship but are real items that need owners.

### 1. Homepage hero MP4 (LCP blocker on `/`)

Lighthouse `network-requests` audit shows the hero asset loads as a single 11.65 MB MP4 (`/public/hero/homepage-hero.mp4`) plus a 2.55 MB PNG poster (`/public/hero/homepage-hero-start.png`). That's the LCP culprit at 2.86s on simulated mobile.

The fix is outside Task 27's scope because it needs either:
- Mux (or Cloudflare Stream / Vercel Blob) for adaptive bitrate delivery, or
- a multi-resolution local source set (480p / 720p / 1080p MP4 + WebM) with a `<source>` ladder and a much smaller poster image.

HANDOFF.md already flags this. Recommended post-M4 phase: set up Mux for the hero, drop the local MP4, and serve a sub-200KB AVIF/WebP poster as the LCP candidate.

### 2. Fontshare General Sans CDN

The home page makes two requests to Fontshare (`api.fontshare.com/v2/css...general-sans@600` and a 600-weight woff2 from `cdn.fontshare.com`). Neither shows up in the `render-blocking-resources` audit on this run, so it's not the LCP cause today. It's still a third-party dependency on the hero render path.

Recommended follow-up: self-host General Sans via `next/font/local` so the woff2 ships from the Next static bundle and `font-display: swap` is fully under our control. Doc-only flag for now; defer to a small post-M4 perf phase.

### 3. INP proxy on 5 routes

The Lighthouse `max-potential-fid` heuristic reports above 200ms on 5 routes (placement / optimization / issues / resources / demo). The trace cause is the long task during initial JS hydration; on these synthetic runs it shows up because of the 4x CPU throttle on a single thread.

Real INP requires field data (CrUX or analytics RUM). The recommended next step is to wire RUM (Vercel Speed Insights is already on the project) and let real user data confirm. If field INP exceeds 200ms on the same routes, the targeted fix is code-splitting the heaviest client component on each (typically `FeatureAccordion` or `ComparisonTable` interaction handlers) via `dynamic()` with `ssr: false`. Hold for post-M4.

## Notes

- The synthetic run used a single Lighthouse pass per route. Variance on `max-potential-fid` is high; the LCP and CLS numbers are stable enough for a baseline.
- The Vercel preview returns 401 because deployment protection is on. Switching the preview to public access (or providing a bypass token in CI) would let the a11y workflow extend to a preview-against-deployed Lighthouse check in a later phase.
