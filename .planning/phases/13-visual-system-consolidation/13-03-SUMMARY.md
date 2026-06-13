---
phase: 13
plan: 03
subsystem: homepage-handoff-visual-consolidation
tags: [console-archetype, bare-render, fan-out, performance-tab, issues-tab, reporting-tab, label-paired-status, d-04, wave-2]
requires:
  - "Console bare render path (Plan 01)"
  - "Placement-tab proof (Plan 02) — the migration mechanism validated on the riskiest tab"
  - "ConsoleData schema + typed-payload pattern (src/content/visuals/)"
provides:
  - "handoffPerformanceConsole / handoffIssuesConsole / handoffReportingConsole typed payloads"
  - "All 4 MockupForTab arms rendering bare Console instances behind unchanged signatures (SYSVIS-01 all-4-tabs truth)"
affects:
  - "src/components/sections/mockups/index.tsx"
  - "src/content/visuals/ (3 new modules + barrel)"
tech-stack:
  added: []
  patterns:
    - "Label-paired status carried as row secondary TEXT (Pitfall 8) since Console.Rows wires only primary/secondary/bar/trailing to WorklistRow"
    - "Currency rendered via numeric trailing.value + prefix/suffix (ConsoleData trailing.value is number-typed)"
    - "D-04-compliant Console-with-KPIs for a time-series tab when the DataStory exception is not approved"
key-files:
  created:
    - "src/content/visuals/handoff-performance.ts"
    - "src/content/visuals/handoff-issues.ts"
    - "src/content/visuals/handoff-reporting.ts"
  modified:
    - "src/components/sections/mockups/index.tsx"
    - "src/content/visuals/index.ts"
decisions:
  - "Reporting archetype (Task 3 checkpoint:decision): console-kpis, the D-04-compliant path. A DataStory exception was NOT approved this run, so it was not taken. Per the defer-human-verify directive the reporting trend-story strength is logged for Connor's preview judgment; DataStory remains the documented fallback only with explicit approval."
  - "All grade/SLA/status severity is carried as TEXT in row `secondary` (and pills/trailing), not color: Console.Rows only forwards primary/secondary/bar/trailing to WorklistRow (not its lead/tag chips), so color-only severity is structurally impossible here (Pitfall 8 satisfied)."
  - "ConsoleData trailing.value is number-typed, so reporting currency renders as value 2.48 prefix $ suffix B and value 38.7 prefix $ suffix M (not a string)."
  - "Full Playwright execution of the 8-spec gate deferred to CI per the sandbox constraint (next dev/start hang); validated locally via --list (63 tests across 6 files) + next build + tsc + eslint + firewall byte-check per tab."
metrics:
  duration: "~25m"
  completed: 2026-06-13
  tasks: 5
  files: 5
---

# Phase 13 Plan 03: Fan-out to all 4 handoff tabs Summary

Performance, issues, and reporting tabs now render bare `Console` instances behind the unchanged `MockupForTab` signature, completing SYSVIS-01's "all 4 tabs render archetype instances." Each tab got its own typed payload (chart tokens only, claims/COI-flagged, no em dashes) and was gated individually; the firewall held the whole plan.

## What shipped

### Task 1 — Performance tab (commit c8e7d94)
- `handoff-performance.ts` (`satisfies ConsoleData`): header KPI "Liquidation, all pools" 14.7% (+1.3% vs prior 30d) + 4 vendor rows. Grade and delta ride in `secondary` as TEXT ("Grade A · +2.1 vs prior 30d"); liquidation % in `trailing`; bar `tone` ("success" for A/A-, "warning" for B/C) is a supporting cue only, never the carrier of severity. No sparkline (approximated per RESEARCH OQ2, no schema extension). Footer pills note the scoring scope.
- MockupForTab `case "performance"` repointed to `<Console bare data={handoffPerformanceConsole} />`.

### Task 2 — Issues tab (commit 8be8988)
- `handoff-issues.ts` (`satisfies ConsoleData`): header KPI "Open" 127, footer pills "Due today 12" + "Overdue 3", and 3 issue rows. SLA and status are label-paired TEXT inside each row's `secondary` ("Account 7715-009 · Best Resolution · Overdue 1h · Escalated"), never color-only (Pitfall 8). ariaSummary names each issue, its SLA, and its status.
- MockupForTab `case "issues"` repointed to `<Console bare data={handoffIssuesConsole} />`.

### Task 3 — Reporting archetype decision (DEFERRED resolution, user-authorized)
- The checkpoint:decision was resolved to **console-kpis** without stopping, per the run's defer-human-verify directive: D-04 locks a Console-archetype instance for all 4 tabs, and a scoped DataStory exception requires explicit user approval that was NOT granted this run. The D-04-compliant Console-with-KPIs path was implemented. DataStory was never silently substituted.

### Task 4 — Reporting tab (commit 5244681)
- `handoff-reporting.ts` (`satisfies ConsoleData`): header KPI "Net-back" 68.2% + Inventory ($2.48B) and Liquidation ($38.7M) rows. The dual-line 8-week trend (not a native Console feature) is approximated in words: each row's `secondary` states "up across 8 weeks" and the ariaSummary states the rising trend. Scheduling/source ("Scheduled · weekly", "Power BI · Snowflake") moved to footer pills.
- Currency uses numeric `trailing.value` + `prefix`/`suffix` (value 2.48 / $ / B; value 38.7 / $ / M) because `ConsoleData.trailing.value` is number-typed.
- MockupForTab `case "reporting"` repointed. **All 4 arms now render bare Console; the switch body contains zero bespoke mockup JSX.**

### Task 5 — Human-verify checkpoint (DEFERRED, user-authorized)
- Performance + reporting desktop cinematic parity NOT executed and NOT marked verified; recorded in the consolidated DEFERRED HUMAN-VERIFY list (DEFERRED-2). Code progress continued.

## Verification

- `npx tsc --noEmit` — clean after each tab.
- `npx eslint` — exit 0 on the facade + each new payload.
- `npx next build` — succeeds after each tab ("Compiled successfully").
- `git diff --exit-code -- HomepageHero.tsx HomepageHandoffSection.tsx FramedDashboard.tsx` — exit 0 after every tab (firewall + bezel byte-unchanged).
- Per-payload acceptance: each ends `} satisfies ConsoleData;`; zero 6-digit hex; CLAIMS + COI markers (count 2 each); no em dashes. Issues SLA/status strings present as text (Overdue/Escalated/Investigating/Auto-handled).
- All-4-arms acceptance: `grep` for `<PlacementMockup|<VendorPerformanceMockup|<IssuesMockup|<ReportingMockup` in the switch returns ZERO; `Console bare data=` count is 4.
- 8-spec regression set: `--list` enumerates 63 tests across 6 files; **full Playwright execution deferred to CI (PR #12)** per the documented sandbox constraint.

## Deviations from Plan

### User-authorized deviations

**1. [Deferred decision resolution] Task 3 reporting archetype resolved to console-kpis without stopping**
- **Authorized by:** the user this run (DataStory exception not approved; implement the D-04-compliant Console path).
- **Action:** implemented Console-with-KPIs, the front-loaded recommended option. Logged the trend-story-strength trade in DEFERRED-2 for Connor's preview judgment. DataStory exception remains the fallback only with explicit approval; it was never silently taken.

**2. [Deferred human-verify] Task 5 performance + reporting parity checkpoint not executed**
- **Authorized by:** the user this run ("implement all code, defer all human-verify").
- **Action:** recorded verbatim in DEFERRED-2 and continued.

### Auto-fixed Issues

**1. [Rule 1 - Bug] Reporting trailing.value typed as string would break `satisfies ConsoleData`**
- **Found during:** Task 4 authoring.
- **Issue:** First draft used `trailing: { value: "$2.48B" }`, but `ConsoleData.ConsoleRow.trailing.value` is `number`, not `string`.
- **Fix:** Split into numeric value + prefix/suffix/decimals (`{ value: 2.48, prefix: "$", suffix: "B", decimals: 2 }` and the $38.7M equivalent), which the WorklistRow trailing renderer composes back into "$2.48B" / "$38.7M".
- **Files modified:** src/content/visuals/handoff-reporting.ts
- **Commit:** 5244681

**2. [Rule 1 - Bug] Em dash in a performance payload doc comment tripped the no-em-dash contract**
- **Found during:** Task 1 verification.
- **Issue:** A doc comment used an em dash, which CLAUDE.md bans anywhere including comments.
- **Fix:** Reworded with a semicolon.
- **Files modified:** src/content/visuals/handoff-performance.ts
- **Commit:** c8e7d94

## Known Stubs

None. All three tabs render real-shaped (anonymized) data through the proven bare Console path. The reporting trend is represented in text rather than a polyline by D-04 design (not a stub); the trade is flagged for preview judgment in DEFERRED-2.

## DEFERRED HUMAN-VERIFY (this plan's entry)

- **DEFERRED-2 (13-03 Task 5, performance + issues + reporting tabs):** Connor verifies on the Vercel preview at desktop width (>= 1440px), cycling all 4 tabs across the hero -> Platform seam. Performance: each vendor's grade, liquidation %, and delta legible; the no-sparkline approximation still tells the scorecard story; severity conveyed by text not color. Issues: queue stats + 3 issue rows, SLA + status legible as text. Reporting: the Console-with-KPIs rendering tells the reporting truth. **Trend-story strength: Connor to judge on preview** (the dual-line 8-week trend is rendered as the text "up across 8 weeks" rather than a polyline). DataStory exception is the fallback if it reads weak (requires explicit approval; never taken without it). All tabs: bezel viewport-centered across the seam, dashboard static during crossfades, no double-frame.

## Self-Check: PASSED

- FOUND: src/content/visuals/handoff-performance.ts
- FOUND: src/content/visuals/handoff-issues.ts
- FOUND: src/content/visuals/handoff-reporting.ts
- FOUND: src/content/visuals/index.ts (3 new re-exports)
- FOUND: src/components/sections/mockups/index.tsx (all 4 arms Console)
- FOUND commit: c8e7d94 (Task 1, performance)
- FOUND commit: 8be8988 (Task 2, issues)
- FOUND commit: 5244681 (Task 4, reporting)
