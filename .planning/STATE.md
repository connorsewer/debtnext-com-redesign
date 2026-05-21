---
gsd_state_version: 1.0
milestone: v1.0
milestone_name: milestone
status: in_progress
last_updated: "2026-05-21T20:30:00Z"
last_activity: 2026-05-21
progress:
  total_phases: 6
  completed_phases: 0
  total_plans: 9
  completed_plans: 7
  percent: 70
---

# STATE.md

## Project Reference

See: `.planning/PROJECT.md` (updated 2026-05-20)

**Core value:** Convert qualified enterprise buyers into demo requests. The single conversion action is "Request a demo".
**Current focus:** Phase 05.1 — hero-04-gap-closure-webm-encoder-re-tune-and-mobile-video-ga

## Current Position

Phase: 05.2 (swap-hero-poster-to-avif) — Plan 01 ✓ shipped; LHCI re-verification owned by Phase 05.1 Plan 03 Task 1.
Phase: 05.1 (hero-04-gap-closure-webm-encoder-re-tune-and-mobile-video-ga) — STILL PAUSED at Plan 03 Task 1; resumes against post-5.2 Vercel preview to confirm the 2,300 ms LCP gate closes.
Plan: 05.1 Plan 01 ✓, 05.1 Plan 02 ✓, 05.2 Plan 01 ✓, 05.1 Plan 03 incomplete.

- **Phase:** Phase 5 (Hero performance) — STILL PARTIAL. Phase 5.1 closed the WebM ladder and put regression nets in place, but did NOT close HERO-04. Phase 5.2 (AVIF poster swap) inserted to close the remaining gap.
- **Plan progression:** Phase 5 plans 05-01..05-04 ✓ → 05-05 ✗ (parked; absorbed by 5.1 per D-08) → Phase 5.1 Plans 01 ✓ (47cdc5b, 56fc69d), 02 ✓ (084de36, 10c562c, fc4712d), 03 ✗ stopped at Task 1.
- **Status:** Phase 5.1 Plan 03 Task 1 ran LHCI Case C against Vercel preview `https://debtnext-website-l8jzto8ss-connor-laughlins-projects.vercel.app/` (3 runs at 412x823, simulate throttling, cpuSlowdownMultiplier 4, x-vercel-protection-bypass header). Result: median LCP 16,411 ms vs 2,300 ms gate (failed). Per-run LCP 16,411 / 16,365 / 15,479 ms. Per Plan 03 Task 1 pitfalls, STOPPED and surfaced — did not write a passing doc against a failing run.
- **Root cause:** Lighthouse network waterfall identified the LCP element as the H1 ("Recovery operations, unified."), blocked by a 2.55 MB raw PNG fetch (`/hero/homepage-hero-start.png`) triggered by the `<video poster={...}>` attribute at HomepageHero.tsx:193. SSR ships the `<video>` element with the PNG poster URL, so browser starts the 2.55 MB fetch BEFORE the `!isMobile` React gate removes the element post-hydration. At 1.6 Mbps throttled bandwidth that PNG takes ~13s to download, blocking the H1 paint. This is exactly the A5 risk recorded in 05.1-CONTEXT.md and called out in Plan 03 Task 1's pitfalls section.
- **Last activity:** 2026-05-21 — Plan 05.1-03 Task 1 stopped at LHCI failure. Phase 5.1 paused. Plans 01 + 02 stand as shipped (mobile-zero-video invariant + regression nets are real wins). Routing to Phase 5.2 for AVIF poster swap.
- **Resume from:** `/gsd-insert-phase 5.2` (AVIF poster swap to close HERO-04 LCP gate). After 5.2 ships, re-run `/gsd-execute-phase 05.1` — phase-plan-index will still see Plan 03 incomplete and resume Task 1 (re-run LHCI on the post-5.2 Vercel preview), then continue to Task 2 (visual walkthrough) and Task 3 (close-out commit flipping HERO-01..04 to Done; both phases ship together).

## Roadmap Evolution

- 2026-05-21: Phase 5.1 inserted after Phase 5 (URGENT). HERO-04 gap closure — WebM encoder re-tune + mobile video gate. Triggered by Phase 5 Plan 05 LHCI gate failing at Case C (representative-run `/` LCP 16,219 ms vs 2,300 ms gate). Two real defects: (A) D-04 violation, mobile downloads 8.88 MB WebM; (B) WebM ladder larger than MP4 ladder at every tier.
- 2026-05-21: Phase 05.1 Plan 01 shipped (47cdc5b, 56fc69d). Defect B fixed (WebM ladder removed; 41.26 MB of binaries purged from public/hero/). Defect A's structural half landed (bounded media queries on 360p/540p exclude <768px viewports). Plan 02 (regression nets: mobile-video-free Playwright spec + per-file size budget guard) is the next move.
- 2026-05-21: Phase 05.1 Plan 02 shipped (084de36, 10c562c, fc4712d). Regression nets landed: mobile-video-free Playwright spec at 412x823 (zero video requests asserted) and per-file MP4 size budget guard (10/6/3 MB) wired into CI before LHCI. The new spec caught a Plan 01 carry-over defect on first run — the 720p `<source>` had been left unbounded with a wrong-reading comment claiming the bounded predecessors would shield it; in reality the HTML source-selection algorithm picks any source with no media attribute at any viewport, so 412px was fetching the 720p MP4. Fixed by bounding 720p with media=(min-width: 1440px). D-04 mobile-video-free contract now structurally sealed. Total Playwright spec count: 170 (was 169). Plan 03 (LHCI Case C re-run + close-out) is the next move.
- 2026-05-21: Phase 5.2 inserted after Phase 5 (URGENT). Swap hero poster to AVIF. Triggered by Phase 05.1 Plan 03 LHCI Case C re-run failing with LCP 16,411 ms vs 2,300 ms gate. Root cause: SSR-rendered `<video poster="/hero/homepage-hero-start.png">` triggers a 2.55 MB PNG fetch before React's `!isMobile` gate removes the `<video>` after hydration; bypasses next/image's optimized 49 KB AVIF entirely. The poster string in `src/content/homepage-hero.ts:55` is the actual mobile LCP blocker. Phase 05.1 paused at Plan 03 Task 1 (frontmatter status: blocked); Plan 03 will resume against the post-5.2 preview, then Phases 5 + 5.1 + 5.2 close out together via the D-08 single-commit doc-sync.
- 2026-05-21: Phase 5.2 Plan 01 shipped. Raw PNG hero poster (2.55 MB) encoded to AVIF (112 KB at libsvtav1 CRF 30, ~23x reduction) and dropped at `public/hero/homepage-hero-start.avif`. `src/content/homepage-hero.ts:55` `startFrame` repointed; both `<Image>` (via `/_next/image` AVIF transcoding) and `<video poster>` (raw fetch) feed off the single static AVIF. The 2.55 MB PNG was deleted; `scripts/encode-hero-poster.sh` regenerates the AVIF from `homepage-hero-720p.mp4`'s first frame and refuses to overwrite above the HERO-03 200 KB budget enforced by `tests/hero/poster-avif-negotiation.spec.ts`. `scripts/check-hero-assets.sh` comment refreshed to drop the obsolete PNG-source note. `.lighthouseci/` added to `.gitignore`. One atomic commit. Phase 05.1 Plan 03 Task 1 is the next move: re-run LHCI Case C against the post-5.2 Vercel preview to verify the gate closes.

## Accumulated Context

### What lives where now (post-bootstrap)

| Artifact | Path | Source |
|---|---|---|
| Project context | `.planning/PROJECT.md` | This bootstrap |
| Milestone history | `.planning/MILESTONES.md` | This bootstrap (M1–M4) |
| Requirements (M5 active) | `.planning/REQUIREMENTS.md` | M5 scoping + roadmap traceability |
| Roadmap (M5) | `.planning/ROADMAP.md` | M5 roadmap (Phases 5–9) |
| GSD config | `.planning/config.json` | This bootstrap |
| Operating contract | `CLAUDE.md` | Pre-existing, authoritative |
| Visual design system | `DESIGN.md` | Pre-existing, authoritative |
| Design brief | `.impeccable.md` | Pre-existing, authoritative |
| Content / IA map | `docs/content-map.md` | Pre-existing, authoritative |
| Live state handoff | `HANDOFF.md` | Pre-existing; updated per commit |
| M4 perf baseline | `docs/m4-perf-baseline.md` | Pre-existing |

### M5 phase map (drafted in roadmap)

| Phase | Goal (one line) | REQ-IDs | Depends on |
|---|---|---|---|
| 5 — Hero performance | Cut `/` LCP under 2.5s on 4G | HERO-01, HERO-02, HERO-03, HERO-04 | Nothing |
| 6 — Analytics wiring | GA4 + GTM wired with graceful no-op | ANALYTICS-01, ANALYTICS-02, ANALYTICS-03 | Nothing (parallel with 5, 7) |
| 7 — SEO baseline | OG images, JSON-LD, Twitter cards, canonicals | SEO-01..06 | Nothing (parallel with 5, 6) |
| 8 — Motion pass | Fades + counters on 10 non-home routes | MOTION-01, MOTION-02, MOTION-03, MOTION-04 | Phase 5 (LCP budget) |
| 9 — DoD walkthrough + launch readiness | §14 walked per route, COI/CLAIMS cleared | DOD-01, DOD-02, DOD-03, DOD-04 | Phases 5, 6, 7, 8 |

Coverage: 21/21 M5 requirements mapped. No orphans.

### Open items inherited (carrying into M5+)

- Mobile/tablet edges on Platform centered-stack at md sizes
- Crossfade overlap between hero bezel and Platform bezel could be tighter
- `homepage-hero-end.png` unreferenced and safe to delete
- "Why dPlat" nav label question (Phase 9 DOD-04 applies the decision)
- Source materials (`dPlat_Solution_Overview_v04232026.pptx`, `DebtNext_entries.xlsx`) not yet in repo's `source-materials/`
- Env vars pending: `ZOHO_WEBHOOK_URL` (Austin Johnson), `RESEND_API_KEY` (Connor), `NEXT_PUBLIC_GA4_ID` + `NEXT_PUBLIC_GTM_ID` (Jeremiah Benes — Phase 6 wires the consumers, Jeremiah provisions the IDs)
- Open `[COI REVIEW]` flags on `/company`, `/why-dplat`, `/platform/issues`, `/solutions` (Phase 9 DOD-02 clears)
- Open `[CLAIMS REVIEW]` flags on 60M+ accounts, $1.5B+ payments, comparison-table ranges, leadership tenures, encryption details (Phase 9 DOD-03 clears)

### Cadence reminders

- Two-stage review per task (spec compliance + code quality)
- Per-commit docs rule: update `HANDOFF.md` / `DESIGN.md` / `.impeccable.md` / `.planning/PROJECT.md` in the SAME commit as the code they describe
- Verify doc structure (`grep -n "^## " HANDOFF.md`) before editing existing sections
- GPG signing off: every commit uses `git -c commit.gpgsign=false commit ...`
- Co-Authored-By footer required: `Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>`
- All 170 existing Playwright specs must stay green; new behavior gets new specs
- Perf budget: LCP < 2.5s on 4G, CLS < 0.1, INP < 200ms (CLAUDE.md §12)
- A11y floor: WCAG 2.2 AA, axe-core CI on every PR (CLAUDE.md §11)
- Reduced motion gated everywhere (DESIGN.md §10)

---
*Last updated: 2026-05-21 by `/gsd-execute-phase 05.1`. Phase 05.1 paused at Plan 03 Task 1 after LHCI Case C re-run on the Vercel preview measured median LCP 16,411 ms (gate 2,300 ms). Per-run 16,411 / 16,365 / 15,479. Root cause: the SSR-rendered `<video poster="/hero/homepage-hero-start.png">` triggers a 2.55 MB raw PNG download on mobile before the `!isMobile` React gate removes the element post-hydration. At 1.6 Mbps throttled bandwidth the PNG alone takes ~13s, blocking H1 paint. This is the A5 risk documented in 05.1-CONTEXT.md and called out in Plan 03 Task 1's pitfalls. WebM ladder removal (Plan 01) and regression nets (Plan 02) are real but insufficient to close HERO-04 on their own. Routing to Phase 5.2 (AVIF poster swap) for the gap. Plan 03 stays incomplete and resumes after 5.2 closes the gate.*
