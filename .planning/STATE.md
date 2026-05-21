---
gsd_state_version: 1.0
milestone: v1.0
milestone_name: milestone
status: blocked
last_updated: "2026-05-21T21:30:00Z"
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

Phase: 05.2 (swap-hero-poster-to-avif) — see PARTIAL note below. 3 commits shipped (1ee187b AVIF swap, 84f20dd drop `<video poster>`, 8920088 Inter `display: optional`). LHCI Case C median LCP dropped from 16,411 ms to 3,869 ms (4.2x improvement) but the 2,300 ms gate is still red by 1,569 ms.
Phase: 05.1 (hero-04-gap-closure-webm-encoder-re-tune-and-mobile-video-ga): STILL PAUSED. Plan 03 Task 1 EXECUTED with FAILED outcome (`docs/m5-phase-5-lhci-run.md` carries the writeup). Tasks 2 + 3 stay deferred until the gate closes.
Plan: 05.1 Plan 01 ✓, 05.1 Plan 02 ✓, 05.2 Plan 01 ✓ (PARTIAL outcome), 05.1 Plan 03 Task 1 EXECUTED (FAILED), Tasks 2 + 3 DEFERRED.

- **Phase:** Phase 5 (Hero performance): STILL PARTIAL. HERO-04 stays open. The dominant asset-level cause was closed (AVIF poster) but the LHCI simulator's gate is not closed by asset changes alone.
- **Plan progression:** Phase 5 plans 05-01..05-04 ✓ → 05-05 ✗ (absorbed by 5.1 per D-08) → Phase 5.1 Plans 01 ✓ (47cdc5b, 56fc69d), 02 ✓ (084de36, 10c562c, fc4712d), 03 Task 1 EXECUTED FAILED → Phase 5.2 Plan 01 ✓ (1ee187b, 84f20dd, 8920088) PARTIAL.
- **Status:** Three Phase 5.2 commits cut Case C simulated mobile LCP from 16,411 → 3,488 → 3,648 → 3,869 ms (each follow-up was within run-to-run noise of the prior; the AVIF was the dominant win). Observed unthrottled LCP on the same Vercel preview is 1,254 ms (well under spec); the 3,869 ms number is LHCI's simulated projection. Remaining structural levers (lazy-load GSAP, conditional General Sans preload, switch LHCI throttling method, or relax gate to CLAUDE.md §12 spec floor of 2,500 ms) are out of scope for Phase 5.2.
- **Root cause (closed):** SSR-rendered `<video poster="/hero/homepage-hero-start.png">` triggered a 2.55 MB raw PNG fetch on mobile before hydration removed the `<video>`. AVIF swap dropped this to 110 KB; subsequent poster removal eliminated the fetch entirely on mobile. Both ship.
- **Last activity:** 2026-05-21. Phase 5.2 partial-close commit landed `docs/m5-phase-5-lhci-run.md`, `05.2-SUMMARY.md`, `05.2-01-SUMMARY.md`, and these STATE/ROADMAP/HANDOFF updates. Plan 03 Task 1 is now formally EXECUTED (with FAILED outcome). Phases 5 + 5.1 + 5.2 stay open; D-08 close-out commit deferred to Phase 5.3 (or gate renegotiation).
- **Resume from:** Phase 5.3 is inserted and queued. Run `/gsd-discuss-phase 5.3` (confirm approach before planning) or `/gsd-plan-phase 5.3` (jump straight to plan if the recommended approach is locked) or `/gsd-execute-phase 5.3` (if the plan already exists). Per `docs/m5-phase-5-lhci-run.md` "Recommended next move", the recommended path is dynamic-importing GSAP + ScrollTrigger inside the `!isMobile && !prefersReducedMotion` branch of `HomepageHero.tsx`; alternatives on the table are conditional General Sans preload, switching LHCI throttling method, or relaxing the gate to the 2,500 ms CLAUDE.md §12 spec floor. Phase 8 (Motion) stays blocked on Phase 5 close, which D-08 fires after Phase 5.3 closes the gate.

## Roadmap Evolution

- 2026-05-21: Phase 5.1 inserted after Phase 5 (URGENT). HERO-04 gap closure — WebM encoder re-tune + mobile video gate. Triggered by Phase 5 Plan 05 LHCI gate failing at Case C (representative-run `/` LCP 16,219 ms vs 2,300 ms gate). Two real defects: (A) D-04 violation, mobile downloads 8.88 MB WebM; (B) WebM ladder larger than MP4 ladder at every tier.
- 2026-05-21: Phase 05.1 Plan 01 shipped (47cdc5b, 56fc69d). Defect B fixed (WebM ladder removed; 41.26 MB of binaries purged from public/hero/). Defect A's structural half landed (bounded media queries on 360p/540p exclude <768px viewports). Plan 02 (regression nets: mobile-video-free Playwright spec + per-file size budget guard) is the next move.
- 2026-05-21: Phase 05.1 Plan 02 shipped (084de36, 10c562c, fc4712d). Regression nets landed: mobile-video-free Playwright spec at 412x823 (zero video requests asserted) and per-file MP4 size budget guard (10/6/3 MB) wired into CI before LHCI. The new spec caught a Plan 01 carry-over defect on first run — the 720p `<source>` had been left unbounded with a wrong-reading comment claiming the bounded predecessors would shield it; in reality the HTML source-selection algorithm picks any source with no media attribute at any viewport, so 412px was fetching the 720p MP4. Fixed by bounding 720p with media=(min-width: 1440px). D-04 mobile-video-free contract now structurally sealed. Total Playwright spec count: 170 (was 169). Plan 03 (LHCI Case C re-run + close-out) is the next move.
- 2026-05-21: Phase 5.2 inserted after Phase 5 (URGENT). Swap hero poster to AVIF. Triggered by Phase 05.1 Plan 03 LHCI Case C re-run failing with LCP 16,411 ms vs 2,300 ms gate. Root cause: SSR-rendered `<video poster="/hero/homepage-hero-start.png">` triggers a 2.55 MB PNG fetch before React's `!isMobile` gate removes the `<video>` after hydration; bypasses next/image's optimized 49 KB AVIF entirely. The poster string in `src/content/homepage-hero.ts:55` is the actual mobile LCP blocker. Phase 05.1 paused at Plan 03 Task 1 (frontmatter status: blocked); Plan 03 will resume against the post-5.2 preview, then Phases 5 + 5.1 + 5.2 close out together via the D-08 single-commit doc-sync.
- 2026-05-21: Phase 5.2 Plan 01 shipped. Raw PNG hero poster (2.55 MB) encoded to AVIF (112 KB at libsvtav1 CRF 30, ~23x reduction) and dropped at `public/hero/homepage-hero-start.avif`. `src/content/homepage-hero.ts:55` `startFrame` repointed; both `<Image>` (via `/_next/image` AVIF transcoding) and `<video poster>` (raw fetch) feed off the single static AVIF. The 2.55 MB PNG was deleted; `scripts/encode-hero-poster.sh` regenerates the AVIF from `homepage-hero-720p.mp4`'s first frame and refuses to overwrite above the HERO-03 200 KB budget enforced by `tests/hero/poster-avif-negotiation.spec.ts`. `scripts/check-hero-assets.sh` comment refreshed to drop the obsolete PNG-source note. `.lighthouseci/` added to `.gitignore`. One atomic commit. Phase 05.1 Plan 03 Task 1 is the next move: re-run LHCI Case C against the post-5.2 Vercel preview to verify the gate closes.
- 2026-05-21: Phase 5.2 partial-close. LHCI Case C re-run against the post-5.2 Vercel preview measured simulated median LCP 3,488 ms (down from 16,411 ms, a 4.7x improvement) but still over the 2,300 ms gate by 1,188 ms. Two follow-up commits chased post-AVIF diagnostic leads: 84f20dd dropped the redundant `<video poster>` attribute (visually neutral; the `<Image>` underneath always paints the same frame), and 8920088 switched Inter from `display: "swap"` to `display: "optional"` to prevent a font-swap LCP candidate. Neither moved the simulated number outside run-to-run noise (3,488 → 3,648 → 3,869 ms). The H1 LCP element paints at 1,254 ms unthrottled (real network reality); the 3,869 ms is LHCI's simulator projection of the resource graph + CPU graph. Phase 05.1 Plan 03 Task 1 is now EXECUTED with FAILED outcome and the writeup at `docs/m5-phase-5-lhci-run.md`. Tasks 2 + 3 (visual walkthrough + D-08 close-out commit) stay deferred. Phases 5 + 5.1 + 5.2 stay open. Routing the remaining work to Phase 5.3 (lazy-load GSAP, conditional General Sans preload, switch throttling method, or gate renegotiation).
- 2026-05-21: Phase 5.3 inserted after Phase 5.2 (URGENT). Close LHCI gate via lazy-loaded GSAP. Triggered by Phase 5.2 partial-close failing to close the 2,300 ms gate after asset-level changes were exhausted. Locked diagnosis (in `docs/m5-phase-5-lhci-run.md`): residual gap is the LHCI simulator's projection of the JS critical path + CPU graph; remaining structural levers are dynamic-importing GSAP behind the mobile gate (recommended), conditional General Sans preload, switching `throttlingMethod` from `simulate` to `devtools`, or relaxing the gate to the 2,500 ms CLAUDE.md §12 spec floor. Phase 5.3 will hold the D-08 close-out (HERO-01..04 to Done; Phases 5 + 5.1 + 5.2 + 5.3 ship together) once the gate closes. Phase 8 (Motion) stays blocked until then. Phase directory created (`.planning/phases/05.3-close-lhci-gate-via-lazy-gsap/`) with `.gitkeep` only; discuss/plan ceremony deferred to the resuming session.

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
