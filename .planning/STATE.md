# STATE.md

## Project Reference

See: `.planning/PROJECT.md` (updated 2026-05-20)

**Core value:** Convert qualified enterprise buyers into demo requests. The single conversion action is "Request a demo".
**Current focus:** M5 — Launch readiness + motion pass. Defining requirements.

## Current Position

- **Phase:** Not started (defining M5 requirements)
- **Plan:** —
- **Status:** Defining requirements for M5
- **Last activity:** 2026-05-20 — Milestone M5 started (option b: bundle launch-critical + motion)

## Accumulated Context

### What lives where now (post-bootstrap)

| Artifact | Path | Source |
|---|---|---|
| Project context | `.planning/PROJECT.md` | This bootstrap |
| Milestone history | `.planning/MILESTONES.md` | This bootstrap (M1–M4) |
| GSD config | `.planning/config.json` | This bootstrap |
| Operating contract | `CLAUDE.md` | Pre-existing, authoritative |
| Visual design system | `DESIGN.md` | Pre-existing, authoritative |
| Design brief | `.impeccable.md` | Pre-existing, authoritative |
| Content / IA map | `docs/content-map.md` | Pre-existing, authoritative |
| Live state handoff | `HANDOFF.md` | Pre-existing; updated per commit |
| M4 perf baseline | `docs/m4-perf-baseline.md` | Pre-existing |

### M5 scope (pending formal opening via `/gsd-new-milestone`)

Per Connor's decision today (option b: bundle launch-critical + motion):

1. Hero MP4 perf fix (currently 11 MB, `/` LCP 2.86s vs 2.5s target)
2. Analytics wiring (CLAUDE.md §13 events via GTM dataLayer; `src/lib/analytics.ts` already has `track()`)
3. SEO baseline (per-route OG images, JSON-LD on `/` and `/demo`)
4. Definition-of-done walkthrough on every v1 route (CLAUDE.md §14)
5. Motion pass across all 11 routes (Framer + GSAP, respects `prefers-reduced-motion`, gsap-skills installed)

### Open items inherited (carrying into M5+)

- Mobile/tablet edges on Platform centered-stack at md sizes
- Crossfade overlap between hero bezel and Platform bezel could be tighter
- `homepage-hero-end.png` unreferenced and safe to delete
- "Why dPlat" nav label question (Connor undecided whether it becomes "Why DebtNext")
- Source materials (`dPlat_Solution_Overview_v04232026.pptx`, `DebtNext_entries.xlsx`) not yet in repo's `source-materials/`
- Env vars pending: `ZOHO_WEBHOOK_URL` (Austin Johnson), `RESEND_API_KEY` (Connor), `NEXT_PUBLIC_GA4_ID` + `NEXT_PUBLIC_GTM_ID` (Jeremiah Benes)
- Open `[COI REVIEW]` flags on `/company`, `/why-dplat`, `/platform/issues`, `/solutions`
- Open `[CLAIMS REVIEW]` flags on 60M+ accounts, $1.5B+ payments, comparison-table ranges, leadership tenures, encryption details

### Cadence reminders

- Two-stage review per task (spec compliance + code quality)
- Per-commit docs rule: update `HANDOFF.md` / `DESIGN.md` / `.impeccable.md` / `.planning/PROJECT.md` in the SAME commit as the code they describe
- Verify doc structure (`grep -n "^## " HANDOFF.md`) before editing existing sections
- GPG signing off: every commit uses `git -c commit.gpgsign=false commit ...`
- Co-Authored-By footer required: `Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>`

---
*Last updated: 2026-05-20 by GSD bootstrap. Reset at M5 opening.*
