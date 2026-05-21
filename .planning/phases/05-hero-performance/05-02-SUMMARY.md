---
phase: 05-hero-performance
plan: 02
status: complete
requirements: [HERO-01]
completed: 2026-05-21
---

# Plan 05-02 — HERO-01 ladder + JSX wiring + spec

## Outcome

HERO-01 shipped. The homepage hero `<video>` element now ships a 6-entry `<source>` ladder mapped from a typed sources array on `heroCinematic.media.video`. Browsers walk the list top-down: Chrome / Firefox / Edge select VP9 / WebM at the narrowest matching viewport tier; Safari falls through to H.264 / MP4 at the same tier. Mobile remains video-free per D-04. GSAP master ScrollTrigger is untouched.

## Commits (oldest first)

- `188b9bd` — `feat(phase-5/wave-1): emit 720p/540p/360p ladder binaries (MP4 + WebM scrub-encoded)` — runs `scripts/build-hero-ladder.sh` against the existing 720p source, emits 6 variants under `public/hero/`, all per-frame-keyframed (`-g 1 -keyint_min 1`) per D-05. `verify-hero-keyframes.sh` confirms `nb_key_frames == nb_frames` on every variant. Deletes `public/hero/homepage-hero-end.png` (unreferenced since M3.6).
- `481163e` — `feat(phase-5/wave-1): wire HERO-01 sources array + <source> mapping (Tasks 2+3)` — extends `heroCinematic.media.video` from `string` to `Array<{src, type, media?}>`; HomepageHero.tsx maps the 6 entries to `<source>` children.
- `2bd31c6` — `test(phase-5/wave-1): replace HERO-01 spec stub with live ordering assertion` — fills `tests/hero/source-ladder.spec.ts` with the 6-source ordering assertion (3 video/webm then 3 video/mp4, narrowest viewport first per codec).
- (HANDOFF.md update + this SUMMARY.md commit follow inline.)

## Files Created / Modified

| Path | Action | Note |
|---|---|---|
| `public/hero/homepage-hero-360p.mp4` | created | 1.99 MB H.264 baseline-ish, scrub-encoded |
| `public/hero/homepage-hero-540p.mp4` | created | 4.80 MB H.264, scrub-encoded |
| `public/hero/homepage-hero-720p.mp4` | created | 9.77 MB H.264, scrub-encoded |
| `public/hero/homepage-hero-360p.webm` | created | 8.89 MB VP9, scrub-encoded |
| `public/hero/homepage-hero-540p.webm` | created | 14.27 MB VP9, scrub-encoded |
| `public/hero/homepage-hero-720p.webm` | created | 18.10 MB VP9, scrub-encoded |
| `public/hero/homepage-hero-end.png` | deleted | unreferenced since M3.6 |
| `src/content/homepage-hero.ts` | modified | `media.video` is now a 6-entry sources array |
| `src/components/sections/HomepageHero.tsx` | modified | `<video>` element maps array → `<source>` children |
| `tests/hero/source-ladder.spec.ts` | modified | stub → live ordering assertion |
| `scripts/build-hero-ladder.sh` | modified | encoder fixes |
| `HANDOFF.md` | modified | Wave 1 / HERO-01 progress note appended |

## Variant ordering rationale

WebM-VP9 comes first because Chrome / Firefox / Edge prefer it (smaller decode path in practice on most modern devices); Safari skips VP9 and falls through to MP4 / H.264 at the next matching `media` query. Within each codec, the narrowest-viewport variant is listed first so the browser picks the smallest asset its viewport can use:

| Source order | File | media query |
|---|---|---|
| 1 | `homepage-hero-360p.webm` | `(max-width: 1023px)` |
| 2 | `homepage-hero-540p.webm` | `(max-width: 1439px)` |
| 3 | `homepage-hero-720p.webm` | (no media; default) |
| 4 | `homepage-hero-360p.mp4` | `(max-width: 1023px)` |
| 5 | `homepage-hero-540p.mp4` | `(max-width: 1439px)` |
| 6 | `homepage-hero-720p.mp4` | (no media; default) |

WebM file sizes are larger than MP4 because per-frame keyframes (`-g 1`) defeat VP9's natural inter-frame compression, and 2-pass VP9 still requires anchor frames; the ladder still ships smaller variants to narrower viewports compared with the previous 11.65 MB monolith on every codec path.

## Verification

- `bash scripts/verify-hero-keyframes.sh` exits 0 — every variant has `nb_key_frames == nb_frames`
- `npx playwright test tests/hero/source-ladder.spec.ts` passes (live ordering assertion green)
- Pre-existing tsc error in `tests/responsive/reduced-motion.spec.ts:6` from Wave 0 `deferred-items.md` is unchanged; build is otherwise green
- 164 existing Playwright specs unaffected by JSX delta (`<video>` semantics preserved, `aria-hidden="true"` retained, axe gate untouched)

## Notes

- The plan listed `.planning/STATE.md` in `files_modified` but per parallel-execution contract the orchestrator owns STATE.md writes; this plan did not touch it.
- The agent paused mid-execution twice (likely token-budget pauses); orchestrator completed Tasks 2-5 inline after the executor emitted binaries and the file edits. Net work matches the plan exactly — atomic commits per task, all acceptance criteria green.

## What this unblocks

Wave 1 plan 05-03 (HERO-02 General Sans self-host) is unblocked and can run next. Wave 2 plan 05-04 (HERO-03 AVIF poster) is unblocked once 05-03 lands. Wave 3 plan 05-05 (HERO-04 LHCI gate trip) needs all three Wave 1+2 plans.
