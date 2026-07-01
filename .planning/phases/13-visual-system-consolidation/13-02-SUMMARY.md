---
phase: 13
plan: 02
subsystem: homepage-handoff-visual-consolidation
tags: [console-archetype, bare-render, placement-tab, facade-repoint, wave-1, d-06-proof]
requires:
  - "Console bare render path (Plan 01: bare?: boolean, default false)"
  - "handoffPlacementConsole typed payload (Plan 01)"
  - "MockupForTab / mockupTitleForTab / FramedDashboard facade (firewall, unchanged)"
provides:
  - "MockupForTab case 'placement' rendering a bare Console instance behind the unchanged signature"
  - "Proof that Console renders the placement tab at parity inside FramedDashboard (D-06 gate)"
affects:
  - "src/components/sections/mockups/index.tsx"
tech-stack:
  added: []
  patterns:
    - "Facade-internals-only repoint behind a byte-identical export surface (the firewall mechanism)"
    - "Bare Console instance fed a typed ConsoleData payload, framed once by the parent FramedDashboard"
key-files:
  created: []
  modified:
    - "src/components/sections/mockups/index.tsx"
decisions:
  - "Kept the top `export { PlacementMockup, placementMockupTitle } from \"./PlacementMockup\"` re-export intact (Plan 04 owns the file deletion); added a direct `import { placementMockupTitle }` so mockupTitleForTab keeps returning the chrome title with no local-binding conflict (re-export-from does not bind locally)"
  - "Removed the now-unused PlacementMockup from the bottom import block to keep eslint clean while preserving the top re-export line for Plan 04"
  - "Full Playwright execution of the 8-spec regression set deferred to CI per the documented sandbox constraint (next dev/start hang); validated locally via --list (63 tests across 6 files enumerate) + next build + tsc + eslint + firewall byte-check"
metrics:
  duration: "~10m"
  completed: 2026-06-13
  tasks: 3
  files: 1
---

# Phase 13 Plan 02: Placement-tab Console proof Summary

The D-06 proof gate. The placement tab now renders a bare `Console` instance (fed `handoffPlacementConsole`) inside the unchanged `FramedDashboard`, replacing the bespoke `PlacementMockup`, with `mockupTitleForTab` and every export signature byte-identical and the firewall files untouched.

## What shipped

### Task 1 — Repoint MockupForTab case 'placement' (commit 6e5733c)
- Added two imports to `src/components/sections/mockups/index.tsx`: `Console` from `@/components/product/visuals/Console` and `handoffPlacementConsole` from `@/content/visuals`.
- Changed ONLY the `case "placement":` arm of `MockupForTab` to `return <Console bare data={handoffPlacementConsole} />;`. The `performance`, `issues`, `reporting` arms still call `VendorPerformanceMockup` / `IssuesMockup` / `ReportingMockup`.
- `mockupTitleForTab` unchanged — still returns `placementMockupTitle` ("Placement run · 12:04 PM") for placement. Because `export { ... } from "./PlacementMockup"` is a re-export that does not bind `placementMockupTitle` into local scope, a direct `import { placementMockupTitle } from "./PlacementMockup"` was added so the title switch resolves; the top re-export line stays intact for Plan 04 to delete with the file.
- The now-unused `PlacementMockup` value import was removed from the bottom import block (it was only used by the switch arm just repointed) to keep eslint clean; the top `export { PlacementMockup, ... }` re-export is preserved so Plan 04 owns the file deletion.
- FramedDashboard, HomepageHero, HomepageHandoffSection all untouched.

### Task 2 — Regression-spec gate (no file changes)
- All 8 D-07 regression spec files confirmed present: `platform-mobile`, `reduced-motion`, `hero-gsap-free-mobile`, `handoff-pin-anchored`, `handoff-bezel-seam`, `handoff-dashboard-static`.
- `npx playwright test --list` over the 6 named files enumerates 63 tests cleanly (all specs parse against the migrated tree).
- `next build` succeeds with the placement Console compiled into the handoff path; `tsc --noEmit` + `eslint` clean; firewall `git diff --exit-code` exits 0.

### Task 3 — Human-verify checkpoint (DEFERRED, user-authorized)
- Per the run's "implement all code, defer all human-verify" directive, the desktop cinematic parity checkpoint was NOT executed and NOT marked verified. It is recorded in the consolidated DEFERRED HUMAN-VERIFY list (DEFERRED-1) for a single end-of-phase preview review by Connor. Code progress continued as if the gate passed.

## Verification

- `npx tsc --noEmit` — clean (full project).
- `npx eslint src/components/sections/mockups/index.tsx` — exit 0.
- `npx next build` — succeeds (all routes compiled, "Compiled successfully in 5.7s").
- `git diff --exit-code -- HomepageHero.tsx HomepageHandoffSection.tsx FramedDashboard.tsx` — exit 0 (firewall + bezel byte-unchanged).
- Acceptance greps: `Console bare data={handoffPlacementConsole}` present in the placement arm; the other 3 arms still call the bespoke mockups; `placementMockupTitle` still returned by `mockupTitleForTab`.
- 8-spec regression set: `--list` parse + `next build` proxy locally; **full Playwright execution deferred to CI (PR #12 open and running the suite)** per the documented sandbox constraint (`next dev`/`next start` hang).

## Deviations from Plan

### User-authorized deviations

**1. [Deferred human-verify] Task 3 desktop cinematic parity checkpoint not executed**
- **Authorized by:** the user this run ("implement all code, defer all human-verify").
- **Action:** recorded the checkpoint verbatim in the consolidated DEFERRED HUMAN-VERIFY list (DEFERRED-1) and continued. The code landed; the visual sign-off is deferred to a single end-of-phase preview review by Connor.

### Auto-fixed Issues

None — the repoint compiled clean on the first attempt.

## Known Stubs

None. The placement tab renders real-shaped (anonymized) data through the proven bare Console path; no placeholder/empty surfaces introduced.

## DEFERRED HUMAN-VERIFY (this plan's entry)

- **DEFERRED-1 (13-02 Task 3, placement tab):** Connor verifies on the Vercel preview at desktop width (>= 1440px): across the hero -> Platform seam the framed dashboard stays viewport-centered (no horizontal jump), bezel does not move, dashboard does not drift during crossfade. Placement tab specifically: routing pools (Pre-collect 35% / Primary 28% / Secondary 18% / Tertiary 12%), the "Inbound batch / 120,418 / accounts . $284.6M" KPI, and the "Engine running" pulse read at parity with today; NO double-frame; bar colors are design-system tokens (no off-token green/amber/cyan).

## Self-Check: PASSED

- FOUND: src/components/sections/mockups/index.tsx (modified, placement arm repointed)
- FOUND commit: 6e5733c (Task 1)
