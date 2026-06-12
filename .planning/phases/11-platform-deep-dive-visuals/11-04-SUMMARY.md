---
phase: 11-platform-deep-dive-visuals
plan: 04
subsystem: platform-deep-dive-visuals
tags: [platform-visuals, archetypes, explorable, reporting, a11y, cls]
requires:
  - "11-01: locked archetype API, Explorable shell, FeatureAccordion.visuals, FlagshipSkeleton min-h-[44rem], reduced-motion data-parity assertion shape"
  - "11-03: latest reference flagship + page-wiring pattern (issues), ConsoleRow.align? additive field"
provides:
  - "/platform/reporting renders real archetype visuals on all 5 accordion items"
  - "reporting Explorable-composed flagship (per-metric inspect, D-05 parity)"
  - "5 typed, governed reporting payloads + flagship payload in the visuals barrel"
  - "platform-visuals spec covers all 4 platform deep-dive routes incl. reporting reduced-motion data-parity"
affects:
  - "src/content/visuals/index.ts (append-only)"
  - "src/components/product/visuals/lazy.tsx (append-only)"
  - "tests/responsive/platform-visuals.spec.ts (append-only)"
tech-stack:
  added: []
  patterns:
    - "Explorable-composed Console archetype fed a typed payload (mirrors PlacementFlagship / OptimizationFlagship / IssuesFlagship)"
    - "Dashboard metric cards preserved as Explorable toggles; each panel shows the headline figure as TEXT plus a decorative sparkline (Pitfall 8)"
    - "Lazy flagship reuses the 11-01-locked FlagshipSkeleton (min-h-[44rem]) for CLS-free chunk resolve"
key-files:
  created:
    - "src/content/visuals/reporting.ts"
    - "src/components/product/visuals/ReportingFlagship.tsx"
  modified:
    - "src/content/visuals/index.ts"
    - "src/components/product/visuals/lazy.tsx"
    - "src/app/platform/reporting/page.tsx"
    - "tests/responsive/platform-visuals.spec.ts"
decisions:
  - "Followed the authoritative 11-ARCHETYPE-MAP.md rows for reporting (inventory Console, vendor Data-story bars, cost Data-story area, sla Console, activity Data-story bars). The PLAN.md task action text suggested sla Data-story / activity Console, but the ARCHETYPE-MAP is the approved, locked mapping and the prompt named its reporting rows authoritative."
  - "The four ReportingDashboard cards (liquidation by tier, net-back, top vendors, SLA adherence) are preserved as Explorable toggles; liquidation-by-tier rides the Console rows and net-back / SLA ride the pills so all headline values render by default (D-05)."
  - "Spec flagshipValues use the console title + the net-back pill, both rendered by default via Console slots, so the existing reduced-motion data-parity assertion runs unchanged for reporting."
metrics:
  duration: "~14 min"
  completed: "2026-06-05"
  tasks: 3
  files: 6
  commits: 3
---

# Phase 11 Plan 04: /platform/reporting Deep-Dive Visuals Summary

Wired /platform/reporting end to end against the 11-01-locked pattern: 5 typed, governed accordion payloads rendered through `FeatureAccordion.visuals`, and the ReportingDashboard BenefitSplit refactored into an `Explorable`-composed Console archetype with per-metric inspect and reduced-motion data-parity.

## What shipped

- **5 reporting accordion payloads** (`src/content/visuals/reporting.ts`), one per approved archetype (11-ARCHETYPE-MAP.md):
  - `inventory` -> Console (open-inventory rows by treatment tier, aging bar, account-count trailing, portfolio liquidation-rate KPI)
  - `vendor` -> Data-story bars (per-vendor liquidation inside a primary pool, blended-rate annotation)
  - `cost` -> Data-story area (net-back per account trended across 8 periods, commission-modeling annotation)
  - `sla` -> Console (per-vendor adherence to the work standard, adherence bar, average-resolution trailing)
  - `activity` -> Data-story bars (activity-type volume: phones attempted, contacts, letters, settlements offered)
  - plus the **flagship Console payload** (liquidation-by-tier rows + net-back / SLA headline pills) and per-metric detail.
- **Reporting Explorable flagship** (`ReportingFlagship.tsx`): one `Explorable.Toggle`/`Explorable.Panel` per dashboard metric (the four preserved ReportingDashboard cards); the liquidation-by-tier rows and the net-back / SLA pills render by default; each panel shows its headline figure as TEXT plus a decorative sparkline trend (never chart-only, Pitfall 8); toggles are real keyboard-operable `<button>`s from the shell.
- **Lazy + page wiring**: `LazyReportingFlagship` added to `lazy.tsx` reusing the 11-01-locked `FlagshipSkeleton` (`min-h-[44rem]` = 704px) so the chunk resolves with no layout shift; `/platform/reporting` now passes a `visuals` map covering all 5 ids and the BenefitSplit swaps `LazyReportingDashboard` -> `LazyReportingFlagship`. Page stays a Server Component. `ReportingDashboard.tsx` retained (no longer imported here) for the Phase 13 audit.
- **Spec coverage**: appended the `/platform/reporting` config to `PLATFORM_VISUAL_PAGES`; it inherits the archetype `role="img"` check, default-visible flagship values, keyboard-toggle parity, no-stuck-opacity, and reduced-motion data-parity assertions. All 4 platform deep-dive routes are now covered.

## Shared files: appended, not rewritten

`index.ts`, `lazy.tsx`, and `platform-visuals.spec.ts` already carried placement + optimization + issues. This plan appended the reporting entries following the exact established pattern; no prior wiring was changed. `types.ts` was not touched (the existing schemas, including `ConsoleRow.align?` from 11-03, express every reporting payload as-is).

## Deviations from Plan

**1. [Rule 3 - Mapping reconciliation] Followed the ARCHETYPE-MAP, not the PLAN task-action text, for sla and activity archetypes.**
- **Found during:** Task 1
- **Issue:** The PLAN.md Task 1/2 action text read "sla -> Data-story" and "activity -> Console", but the approved, locked 11-ARCHETYPE-MAP.md (and the executor prompt, which named the reporting rows authoritative) maps `sla -> Console` and `activity -> Data-story (bars)`.
- **Fix:** Authored `reportingSla` as Console (vendor-adherence rows) and `reportingActivity` as Data-story bars, matching the approved table; the page `visuals` map wires `sla: <ConsoleVisual>` and `activity: <DataStoryVisual>` accordingly.
- **Files modified:** src/content/visuals/reporting.ts, src/app/platform/reporting/page.tsx
- **Commit:** 571c74c, ccde84b

No other deviations.

## Governance

- `[CLAIMS REVIEW]`: 8 comments (>= one per numeric payload block) across all 5 payloads + flagship console + flagship metrics.
- `[COI REVIEW]`: comments on every vendor-network / cross-vendor caption (inventory tiers, vendor comparison, cost commission modeling, SLA adherence, activity rollup, flagship vendor ranking). Andrew's D-10 clearance covers the framing; tags kept for audit, non-blocking this phase. All framing stays agency-network-agnostic (CLAUDE.md §6).
- No client names or logos (CLAUDE.md §15). No em dashes in any changed file. Sentence-case, digits, contractions per CLAUDE.md §5.

## Distinctness (D-02)

- **reporting `sla` vs issues `sla`:** reporting is vendor ADHERENCE to the work standard (98% / 95% / 89%) with an average-resolution trailing value (2.1d / 2.8d / 4.3d); issues is an open-issue SLA-TIMER worklist (ISS ids, hours-left, escalation). Different numbers, different row meaning, different intent.
- **reporting `vendor` bars vs optimization `bands` bars:** reporting compares a different vendor set in a primary pool (21.3 / 18.9 / 16.4 / 13.7, blended 17.6%); optimization sorts its own vendor set into configured high/mid/low bands (24.6 / 19.1 / 15.8 / 11.3). No shared numbers or shape.
- Each reporting payload reads on its own data shape (tier inventory, vendor bars, net-back area, adherence rows, activity bars) and is distinct from every placement / optimization / issues payload.

## Verification

- `npx tsc --noEmit` exits 0.
- `npx eslint` clean on all 6 changed files.
- DEFERRED-TO-PREVIEW: `platform-visuals.spec.ts`, `reveal-fail-open.spec.ts`, `reduced-motion.spec.ts` run against a Vercel preview via `PLAYWRIGHT_BASE_URL` (next dev/start hang in this sandbox; the spec is preview-driven by design). Confirm the reporting route passes, including the reduced-motion data-parity assertion on the console title and net-back pill.

## Known Stubs

None. Every accordion item and the flagship render real typed payloads; zero text-on-dark placeholders remain.

## Self-Check: PASSED

- FOUND: src/content/visuals/reporting.ts
- FOUND: src/components/product/visuals/ReportingFlagship.tsx
- FOUND commit 571c74c (Task 1), ccde84b (Task 2), fa37745 (Task 3)
- tsc 0, eslint 0, no em dashes; all 5 accordion ids + flagship swap + 4-route spec coverage verified by grep
