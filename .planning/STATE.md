# STATE.md

## Project Reference

See: `.planning/PROJECT.md` (updated 2026-05-20)

**Core value:** Convert qualified enterprise buyers into demo requests. The single conversion action is "Request a demo".
**Current focus:** M5 — Launch readiness + motion pass. Roadmap drafted, 5 phases ready.

## Current Position

- **Phase:** Not started (M5 has 5 phases ready to discuss/plan: Phase 5 Hero perf → Phase 6 Analytics → Phase 7 SEO → Phase 8 Motion → Phase 9 DoD walkthrough)
- **Plan:** —
- **Status:** Roadmap drafted. Phase 5 (Hero performance) is critical-path and next.
- **Last activity:** 2026-05-20 — M5 roadmap created. 21/21 M5 requirements mapped across Phases 5–9. Phases 5, 6, 7 are mutually independent and safely parallel; Phase 8 waits on Phase 5; Phase 9 waits on all four prior phases.

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
- All 164 existing Playwright specs must stay green; new behavior gets new specs
- Perf budget: LCP < 2.5s on 4G, CLS < 0.1, INP < 200ms (CLAUDE.md §12)
- A11y floor: WCAG 2.2 AA, axe-core CI on every PR (CLAUDE.md §11)
- Reduced motion gated everywhere (DESIGN.md §10)

---
*Last updated: 2026-05-20 by GSD roadmapper. M5 roadmap drafted; next step is `/gsd-plan-phase 5` (Hero performance, critical-path).*
