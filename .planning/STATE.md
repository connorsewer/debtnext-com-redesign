---
gsd_state_version: 1.0
milestone: v1.0
milestone_name: milestone
status: executing
last_updated: "2026-05-21T20:00:00Z"
last_activity: 2026-05-21
progress:
  total_phases: 6
  completed_phases: 0
  total_plans: 8
  completed_plans: 6
  percent: 63
---

# STATE.md

## Project Reference

See: `.planning/PROJECT.md` (updated 2026-05-20)

**Core value:** Convert qualified enterprise buyers into demo requests. The single conversion action is "Request a demo".
**Current focus:** Phase 05.1 — hero-04-gap-closure-webm-encoder-re-tune-and-mobile-video-ga

## Current Position

Phase: 05.1 (hero-04-gap-closure-webm-encoder-re-tune-and-mobile-video-ga) — EXECUTING
Plan: 3 of 3 (next)

- **Phase:** Phase 5 (Hero performance) — PARTIAL. Plans 01-04 shipped; Plan 05 HERO-04 LHCI gate FAILED. Gap closure required before Phase 5 closes.
- **Plan:** 05-01 (Wave 0) ✓ → {05-02, 05-03} (Wave 1) ✓ → 05-04 (Wave 2) ✓ → 05-05 (Wave 3) ✗ gate failed at Task 1.
- **Status:** Executing Phase 05.1 — Plan 01 ✓ (47cdc5b, 56fc69d), Plan 02 ✓ (084de36, 10c562c, fc4712d). Next: Plan 03 (LHCI Case C re-run + close-out).
- **Last activity:** 2026-05-21 — Plan 05.1-02 shipped: new tests/responsive/hero-mobile-video-free.spec.ts (412x823 network watcher, zero video requests asserted), new scripts/check-hero-assets.sh (3 MP4 size budgets, 10/6/3 MB; AVIF/PNG intentionally excluded per RESEARCH §F), .github/workflows/perf.yml runs the budget guard before LHCI. The new mobile spec caught a Plan 01 carry-over defect (720p `<source>` left unbounded; HTML source-selection algorithm picks it at 412px) — sealed by bounding 720p with media=(min-width: 1440px). Total Playwright spec count now 170 (was 169).
- **Resume from:** `/gsd-execute-plan 05.1 03` (LHCI Case C re-run on Vercel preview; docs/m5-phase-5-lhci-run.md writeup; visual walkthrough at 1440/1024/768/412; close-out commit flipping HERO-01..04 to Done).

## Roadmap Evolution

- 2026-05-21: Phase 5.1 inserted after Phase 5 (URGENT). HERO-04 gap closure — WebM encoder re-tune + mobile video gate. Triggered by Phase 5 Plan 05 LHCI gate failing at Case C (representative-run `/` LCP 16,219 ms vs 2,300 ms gate). Two real defects: (A) D-04 violation, mobile downloads 8.88 MB WebM; (B) WebM ladder larger than MP4 ladder at every tier.
- 2026-05-21: Phase 05.1 Plan 01 shipped (47cdc5b, 56fc69d). Defect B fixed (WebM ladder removed; 41.26 MB of binaries purged from public/hero/). Defect A's structural half landed (bounded media queries on 360p/540p exclude <768px viewports). Plan 02 (regression nets: mobile-video-free Playwright spec + per-file size budget guard) is the next move.
- 2026-05-21: Phase 05.1 Plan 02 shipped (084de36, 10c562c, fc4712d). Regression nets landed: mobile-video-free Playwright spec at 412x823 (zero video requests asserted) and per-file MP4 size budget guard (10/6/3 MB) wired into CI before LHCI. The new spec caught a Plan 01 carry-over defect on first run — the 720p `<source>` had been left unbounded with a wrong-reading comment claiming the bounded predecessors would shield it; in reality the HTML source-selection algorithm picks any source with no media attribute at any viewport, so 412px was fetching the 720p MP4. Fixed by bounding 720p with media=(min-width: 1440px). D-04 mobile-video-free contract now structurally sealed. Total Playwright spec count: 170 (was 169). Plan 03 (LHCI Case C re-run + close-out) is the next move.

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
*Last updated: 2026-05-21 by `/gsd-execute-plan 05.1 02`. Plan 02 of Phase 05.1 shipped: tests/responsive/hero-mobile-video-free.spec.ts (412x823 network-watcher, zero video requests asserted) + scripts/check-hero-assets.sh (3 MP4 size budgets, 10/6/3 MB, AVIF/PNG excluded per RESEARCH §F) + .github/workflows/perf.yml budget step before LHCI. Plan 01 carry-over defect (720p `<source>` unbounded → fetched at 412x823) sealed by adding media=(min-width: 1440px). Total Playwright spec count now 170 (was 169 + 1 new). Stopped at Plan 03 boundary; Plan 03 is the LHCI Case C re-run + close-out commit flipping HERO-01..04 to Done.*
