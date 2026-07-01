---
phase: 13
plan: 01
subsystem: homepage-handoff-visual-consolidation
tags: [console-archetype, bare-render, regression-specs, placement-payload, wave-0]
requires:
  - "Console archetype (Phase 11) proven on a Platform page"
  - "ConsoleData schema + typed-payload pattern (src/content/visuals/)"
  - "FramedDashboard bezel + MockupForTab facade (firewall, unchanged)"
provides:
  - "Console bare render path (bare?: boolean, default false) — no ProductCanvas card"
  - "handoffPlacementConsole typed payload (placement tab, chart tokens only)"
  - "3 cinematic regression specs (pin-anchored, bezel-seam, dashboard-static)"
affects:
  - "src/components/product/visuals/Console.tsx"
  - "src/content/visuals/ (new module + barrel)"
  - "tests/responsive/ (3 new specs)"
tech-stack:
  added: []
  patterns:
    - "Backward-compatible optional prop (bare) over exporting internal context"
    - "Typed ConsoleData payload mapped field-for-field from a bespoke mockup"
    - "playwright test --list as the sandbox-safe spec-validity gate"
key-files:
  created:
    - "src/content/visuals/handoff-placement.ts"
    - "tests/responsive/handoff-pin-anchored.spec.ts"
    - "tests/responsive/handoff-bezel-seam.spec.ts"
    - "tests/responsive/handoff-dashboard-static.spec.ts"
  modified:
    - "src/components/product/visuals/Console.tsx"
    - "src/content/visuals/index.ts"
decisions:
  - "bare path added inside Console.tsx (Open Question 3 / RESEARCH option b) over exporting ConsoleContext — one localized edit, all existing call sites byte-identical"
  - "Desktop dashboard-static spec advances the tab by scrolling VH_PER_TAB px (GSAP scroll-driven), not by clicking a tab button"
  - "Full Playwright execution of the 3 specs deferred to CI per the documented sandbox constraint (next dev/start hang); validated locally via --list + next build + tsc + eslint"
metrics:
  duration: "~25m"
  completed: 2026-06-13
  tasks: 3
  files: 6
---

# Phase 13 Plan 01: Wave 0 Foundation Summary

Backward-compatible `bare` render path on Console (kills the double-frame landmine), the placement-tab typed payload (DESIGN.md chart tokens only, zero hex), and the 3 missing cinematic regression specs that give D-06/D-07's gate teeth — all landed without repointing any tab.

## What shipped

### Task 1 — Console bare render path (commit 72af142)
- Added `bare?: boolean` to `ConsoleProps` (default `false`, documented).
- `ConsoleRoot` now computes the slot `body` once and branches: `bare=true` renders a plain `<div role="img" aria-label={data.ariaSummary}>` with the same flex-column className; `bare=false` keeps the existing `<ProductCanvas role="img" aria-label={data.ariaSummary}>` path byte-behavior-identical.
- The `aria-label` (text-alternative contract, Pitfall 8) is present on the root in both modes — verified by `grep -c "aria-label={data.ariaSummary}"` returning 2.
- No change to the `Console = Object.assign(...)` export, the slots, `useConsole`, or the (still-unexported) `ConsoleContext`. Every existing call site (Phase 11 Flagships, FeatureAccordion, solutions visuals) goes through the default framed path unchanged.

### Task 2 — placement-tab payload (commit 7aa2b06)
- `src/content/visuals/handoff-placement.ts` exports `handoffPlacementConsole satisfies ConsoleData`, mapped field-for-field from `PlacementMockup`:
  - `header.kpi` = Inbound batch / 120,418 / "accounts · $284.6M"; `header.status` = "Engine running", `live: true` (PulseDot).
  - 4 single-segment pool rows: Pre-collect 35% / 2 vendors, Primary 28% / 3 vendors, Secondary 18% / 2 vendors, Tertiary 12% / 4 vendors, each `bar.segments:[pct]` + `trailing:{value:pct, suffix:"%"}`.
- Chart color comes from `tone` tokens only. The off-token gradient endpoints from `PlacementMockup` do not appear — zero hex literals in the module (D-10). Comment reworded so even the doc text carries no raw hex, keeping the `grep "#"` machine-check clean.
- `[CLAIMS REVIEW]` and `[COI REVIEW]` markers present; `ariaSummary` in governed voice (sentence case, digits, no em dashes, no banned phrases).
- Re-exported from `src/content/visuals/index.ts`.

### Task 3 — 3 cinematic regression specs (commit 27f3d62)
- `handoff-pin-anchored.spec.ts` — at 1440x900, section height > 2400 (400vh), and the `[data-handoff-section] > div.sticky` inner stays within 2px of viewport-top y across two scroll positions in the range.
- `handoff-bezel-seam.spec.ts` — hero `[data-hero-framed-dashboard]` and handoff `[data-handoff-mockup-frame]` share center-x within 2px (both `left-1/2 -translate-x-1/2`).
- `handoff-dashboard-static.spec.ts` — frame box x/y unchanged (≤1px) when the active tab advances; tab change driven by scrolling `VH_PER_TAB` (0.75) worth of pixels, since desktop tab state follows GSAP scroll progress not clicks (documented in-spec).
- All three target the verified selectors and assert against current main (placement still bespoke), so they are true regression guards for Plans 02/03.

## Verification

- `npx tsc --noEmit` — clean (full project).
- `npx eslint` — clean on all 6 changed files.
- `npx next build` — succeeds (all routes compiled).
- `npx playwright test --list` (with `PLAYWRIGHT_BASE_URL` set to skip the auto-started server) — all 3 specs parse and enumerate their tests (3 tests in 3 files).
- Console acceptance greps: `bare?: boolean` + `bare = false` destructure + conditional branch present; `aria-label={data.ariaSummary}` count = 2; `role="img"` on a plain div.
- Payload acceptance greps: ends with `} satisfies ConsoleData;`; `segments` count = 4; zero `#` hex; `CLAIMS REVIEW` + `COI REVIEW` present; no em dash; barrel re-export present.

**Full Playwright spec execution against a running app is deferred to CI per the documented sandbox constraint** (`next dev`/`next start` hang in this sandbox; the Playwright config auto-starts a Next server). Local validation used `--list` + `next build` + `tsc` + `eslint`, which is the agreed proxy. The 3 specs are written to pass on the unmigrated (bespoke-placement) state and validate on CI after the branch is pushed.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Payload doc comment tripped the no-hex machine check**
- **Found during:** Task 2 verification.
- **Issue:** The first draft documented the dropped off-token endpoints by quoting their hex literals in a comment, so `grep -n "#22c55e\|#"` matched the comment even though the payload data carried zero hex. The acceptance criterion is a literal string check (`grep "#"` returns zero).
- **Fix:** Reworded the comment to describe "the three off-token gradient endpoints" without quoting the hex strings. Intent (D-10: no off-token hex in the payload) and the machine check now both pass.
- **Files modified:** src/content/visuals/handoff-placement.ts
- **Commit:** 7aa2b06

No other deviations. No architectural changes (no Rule 4). No authentication gates. Firewall files (HomepageHero.tsx, HomepageHandoffSection.tsx, FramedDashboard.tsx) untouched; no MockupForTab case repointed (that is Plan 02).

## Known Stubs

None. The bare path is fully wired; the payload is real-shaped (anonymized) data; the specs assert real selectors. No placeholder/empty-data surfaces introduced.

## Self-Check: PASSED

- FOUND: src/components/product/visuals/Console.tsx (modified)
- FOUND: src/content/visuals/handoff-placement.ts
- FOUND: src/content/visuals/index.ts (modified, re-export present)
- FOUND: tests/responsive/handoff-pin-anchored.spec.ts
- FOUND: tests/responsive/handoff-bezel-seam.spec.ts
- FOUND: tests/responsive/handoff-dashboard-static.spec.ts
- FOUND commit: 72af142 (Task 1)
- FOUND commit: 7aa2b06 (Task 2)
- FOUND commit: 27f3d62 (Task 3)
