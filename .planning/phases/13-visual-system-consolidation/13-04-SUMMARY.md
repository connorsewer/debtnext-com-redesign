---
phase: 13
plan: 04
subsystem: homepage-handoff-visual-consolidation
tags: [cleanup, deletion-by-substitution, token-sweep, dead-asset-confirm, facade-slim, wave-3, sysvis-01, sysvis-02, p13-02]
requires:
  - "All 4 handoff tabs rendering bare Console instances (Plan 03)"
  - "Inlined title strings replacing the deleted bespoke files' exports"
provides:
  - "sections/mockups/ slimmed to index.tsx + FramedDashboard.tsx (D-05)"
  - "Zero off-token gradient hex in src/ (P13-02)"
  - "Confirmed single retained .png (hero finale, Phase 15) (SYSVIS-02)"
  - "HANDOFF.md Phase 13 consolidation record"
affects:
  - "src/components/sections/mockups/index.tsx"
  - "src/components/sections/mockups/{PlacementMockup,VendorPerformanceMockup,IssuesMockup,ReportingMockup}.tsx (deleted)"
  - "HANDOFF.md"
tech-stack:
  added: []
  patterns:
    - "Deletion-by-substitution: remove bespoke components only after the archetype replacement is proven live"
    - "Chrome-title consts inlined in the facade once their source files are retired (signatures byte-identical)"
key-files:
  created: []
  modified:
    - "src/components/sections/mockups/index.tsx"
    - "HANDOFF.md"
  deleted:
    - "src/components/sections/mockups/PlacementMockup.tsx"
    - "src/components/sections/mockups/VendorPerformanceMockup.tsx"
    - "src/components/sections/mockups/IssuesMockup.tsx"
    - "src/components/sections/mockups/ReportingMockup.tsx"
decisions:
  - "The 4 chrome-title strings were inlined as module-local consts in index.tsx; mockupTitleForTab body is unchanged so the public signature stays byte-identical (D-03)."
  - "PlacementMockup's deletion is what eliminates the off-token gradient hex (P13-02) — no replacement carries it; the payloads use tone tokens only."
  - "Hero finale dashboard-dark.png is confirmed and documented as Phase 15's (HOMEVIS-01), NOT deleted (deleting/editing the hero would violate the D-01 firewall)."
  - "LHCI Case C on / is CI-only (sandbox cannot run a live server); Console instances stay eager (matching today's bespoke mockups, no lazy wrapper added), so no new CLS/skeleton surface. Gate delegated to CI (PR #12)."
metrics:
  duration: "~15m"
  completed: 2026-06-13
  tasks: 3
  files: 6
---

# Phase 13 Plan 04: Retire mockups + close P13-02 / SYSVIS-02 Summary

The bespoke handoff mockups are gone. With all 4 tabs rendering through Console (Plan 03), the 4 per-tab mockup files were deleted, the facade slimmed to its stable exports, the off-token gradient hex eliminated, the single retained hero PNG confirmed and documented as Phase 15's, and the phase verification gate run green with the firewall byte-identical for the whole phase.

## What shipped

### Task 1 — Retire the 4 bespoke mockups + slim the facade (commit c5dbea4)
- Inlined the 4 chrome-title consts directly in `src/components/sections/mockups/index.tsx` (`placementMockupTitle` etc.); they no longer come from the deleted files. `mockupTitleForTab`'s body is unchanged.
- Removed every bespoke import and re-export. Kept `export { FramedDashboard } from "./FramedDashboard"`, the `Console` import, and the `handoff-*` payload imports added in Plans 02-03.
- `git rm` deleted `PlacementMockup`, `VendorPerformanceMockup`, `IssuesMockup`, `ReportingMockup`. `sections/mockups/` now holds exactly `FramedDashboard.tsx` + `index.tsx` (D-05; the directory does not fully disappear because the firewall imports both by path).
- Clean `.next` rebuild to clear stale chunks. Confirmed nothing else in `src/` imported the deleted files (only inert history comments in payload modules mention the names).

### Task 2 — Token sweep + dead-PNG confirm + HANDOFF (commit faa1881)
- **P13-02:** `grep -rn "#22c55e\|#d97706\|#0891b2" src/` returns ZERO. The only home of those literals (`PlacementMockup`) was deleted in Task 1; the payloads use tone tokens.
- **SYSVIS-02:** `grep -rn "\.png" src/` returns exactly one line, `HomepageHero.tsx` `dashboard-dark.png` (the hero finale, aria-hidden, decorative). Confirmed; intentionally retained pending Phase 15 (HOMEVIS-01). Not deleted (editing the hero would violate the firewall). The 6 dead BenefitSplit fallbacks remain gone (Phase 10).
- **HANDOFF.md:** added a Phase 13 consolidation entry recording the 4-tab Console migration behind the unchanged facade, the firewall hold, the 4 deleted files, the eliminated hex, the retained hero PNG note (Phase 15), and the reporting Console-with-KPIs decision (DataStory exception not taken). Authored em-dash-free.

### Task 3 — Phase verification gate (no file changes)
- `npx tsc --noEmit` clean; `npx eslint .` (repo-wide) exit 0.
- Firewall `git diff --exit-code` exits 0, AND byte-identical vs the pre-phase base `ab0ad77` for `HomepageHero.tsx`, `HomepageHandoffSection.tsx`, `FramedDashboard.tsx` — the firewall held the entire phase.
- Full Playwright suite enumerates server-free: 291 tests across 18 files parse.
- Clean `next build` succeeds.
- LHCI Case C on `/` deferred to CI (PR #12) per the sandbox constraint; no new CLS surface (Console instances stay eager, matching today).

## Verification

- Directory: `ls src/components/sections/mockups/` = `FramedDashboard.tsx index.tsx` (PASS).
- No bespoke refs in the facade; 4 title strings inlined (count 4); no other importer of the deleted files (PASS).
- `grep -rn "#22c55e\|#d97706\|#0891b2" src/` = 0 (PASS); `grep -rn "\.png" src/` = 1, in HomepageHero.tsx (PASS).
- HANDOFF.md contains "sections/mockups", "dashboard-dark.png", and "Phase 15" (PASS).
- `tsc --noEmit` + `eslint .` clean; firewall byte-unchanged (current + vs phase base); `next build` succeeds.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Em dash in the new HANDOFF Phase 13 section heading**
- **Found during:** Task 2 verification.
- **Issue:** The new section heading used an em dash (`## M6 Phase 13 — ...`), matching the doc's pre-existing heading style but violating the run's no-em-dash guardrail for authored content.
- **Fix:** Changed the em dash to a colon in the heading I authored. Pre-existing em dashes elsewhere in HANDOFF (not mine) were left untouched.
- **Files modified:** HANDOFF.md
- **Commit:** faa1881

No other deviations. No architectural changes (no Rule 4). No authentication gates.

### Out-of-scope note (not fixed)
- An untracked `plans/` directory appeared in the working tree during this plan, unrelated to Phase 13 (not created by these tasks). Left untouched; not committed. Logged here rather than acted on.

## Known Stubs

None. The handoff renders real-shaped (anonymized) data through Console for all 4 tabs; the bespoke files are deleted, not stubbed.

## DEFERRED HUMAN-VERIFY (this plan's entry)

- No new human-verify checkpoint in this plan. The phase's deferred items are DEFERRED-1 (13-02 placement) and DEFERRED-2 (13-03 performance/issues/reporting, incl. the reporting trend-story-strength judgment). Both are carried to the consolidated list for the single end-of-phase preview review by Connor.

## Self-Check: PASSED

- FOUND: src/components/sections/mockups/index.tsx (slimmed, titles inlined)
- FOUND: HANDOFF.md (Phase 13 entry present)
- CONFIRMED DELETED: PlacementMockup.tsx, VendorPerformanceMockup.tsx, IssuesMockup.tsx, ReportingMockup.tsx
- FOUND commit: c5dbea4 (Task 1)
- FOUND commit: faa1881 (Task 2)
