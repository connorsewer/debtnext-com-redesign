---
phase: 12-solutions-per-industry-visuals
plan: 04
subsystem: ui
tags: [nextjs, react, typescript, archetypes, console, schematic, datastory, healthcare]

# Dependency graph
requires:
  - phase: 12-solutions-per-industry-visuals
    plan: 01
    provides: 12-ARCHETYPE-MAP.md (D-08 approved), min-h-[34rem] hero box, FeatureAccordion visuals prop, solutions-visuals.spec.ts distinctness gate, payload module pattern
provides:
  - /solutions/healthcare fully wired (Console hero + routing Schematic + EBO/bad-debt config Console + reconciliation area DataStory)
  - src/content/visuals/solutions-healthcare.ts payload module
  - Completes the utilities/insurance/healthcare reconcile-daily cluster differentiation (spark / bars / area)
affects: [12-05, 13-homepage-handoff]

# Tech tracking
tech-stack:
  added: []
  patterns: [per-industry payload module under src/content/visuals/, FeatureAccordion visuals prop overriding homepage registry fallback, min-h CLS reservation around ConsoleVisual hero]

key-files:
  created:
    - src/content/visuals/solutions-healthcare.ts
  modified:
    - src/app/solutions/healthcare/page.tsx
    - src/content/solutions-healthcare.ts

key-decisions:
  - "Healthcare DataStory is an area chart (kind: area, 9 upward-trending points), the cluster differentiator vs utilities spark and insurance bars"
  - "Routing source node is EHR / clearinghouse (Epic/Cerner/patient accounting), distinct from utilities billing/CIS and insurance policy admin"
  - "Hero balances/counts (36,740 accounts, $48.9M) sit between utilities (small balances, high counts) and financial-services (large balances) per the relative-magnitude guardrail"

requirements-completed: [SOLVIS-02, SOLVIS-03, SOLVIS-04, SOLVIS-05]

# Metrics
duration: ~25min
completed: 2026-06-12
---

# Phase 12 Plan 04: Healthcare per-industry visuals Summary

**/solutions/healthcare wired with a Console hero (self-pay and balance-after-insurance rows, EBO vs bad-debt tracks), an EHR/clearinghouse routing Schematic, an EBO/bad-debt config Console, and a reconciliation area-chart DataStory, replacing LazySolutionsIndustryCards and completing the three-way reconcile-daily cluster differentiation (spark / bars / area).**

## Performance

- **Duration:** ~25 min
- **Completed:** 2026-06-12
- **Tasks:** 1/1
- **Files modified:** 3 (1 created, 2 modified)

## Accomplishments

- `src/content/visuals/solutions-healthcare.ts` exports four `satisfies`-validated payloads with a `[CLAIMS REVIEW]` + `[COI REVIEW]` header:
  - `healthcareConsole satisfies ConsoleData` — hero: self-pay and balance-after-insurance rows, EBO and bad-debt track pills, a statement-cycle placement-timing callout
  - `healthcareRouting satisfies SchematicData` — placement item: EHR / clearinghouse source -> routing engine -> EBO/bad-debt vendor pools -> recovered sink
  - `healthcareConfig satisfies ConsoleData` — optimization item: EBO vs bad-debt configured separately with independent cycles
  - `healthcareReconciliation satisfies DataStoryData` — reporting item (DataStory carrier, SOLVIS-04): `kind: "area"` chart of self-pay/balance-after-insurance recoveries with a 99.1% match-rate annotation
- `src/app/solutions/healthcare/page.tsx` repointed: ConsoleVisual hero inside `min-h-[34rem]` in ProductVisualBand; FeatureAccordion visuals prop keyed placement/optimization/reporting; `LazySolutionsIndustryCards` import and usage removed
- 3 `visualLabel` strings in `src/content/solutions-healthcare.ts` updated to describe the new archetypes

## Three-way cluster differentiation (for the verification plan)

The utilities/insurance/healthcare "reconcile daily" cluster is now fully differentiated:

| Industry | DataStory chart kind | Schematic source node | Hero row nouns |
|---|---|---|---|
| utilities | `spark` | Billing / CIS system | arrears, deposit |
| insurance | `bars` | policy admin | subrogation |
| healthcare | `area` | EHR / clearinghouse | self-pay, balance after insurance |

Healthcare payload export names for the spec: `healthcareConsole`, `healthcareRouting`, `healthcareConfig`, `healthcareReconciliation`. industryUniqueString `self-pay` present; no sibling industry's full unique set appears (cross-route copy-paste guard holds).

## Task Commits

1. **Task 1: Healthcare payloads + page repoint** - `5fc9864` (feat)

## Decisions Made

- Area chart authored with 9 upward-trending points (62 to 78) to read visibly different from utilities' flat-high spark and insurance's grouped bars
- Hero authored to the locked `min-h-[34rem]` Wave-2 family budget (KPI header + 4 rows + callout + 3 pills) so the lazy swap never shifts layout and all heroes read as one family
- COI framing kept agency-network-agnostic ("the provider's existing vendors"); patient-data framing is illustrative only, no real PHI or identifiers (§15)

## Deviations from Plan

None. Plan executed exactly as written.

## Issues Encountered

- `node_modules` is absent in this worktree (deps installed only in the parent checkout). Verification ran the parent's `tsc` and `eslint` binaries against the worktree files: `tsc --noEmit -p tsconfig.json` reports 0 errors project-wide; `eslint` on the 3 changed files exits 0. `next build` and the Playwright `solutions-visuals.spec.ts` defer to CI/preview per the sandbox constraint (next dev/start hang and are never run).

## Known Stubs

None. All four healthcare payloads are fully authored with real-shaped anonymized data and wired to live archetypes; no placeholder text, empty data sources, or TODOs.

## Self-Check: PASSED

- FOUND: src/content/visuals/solutions-healthcare.ts
- FOUND: commit 5fc9864
- VERIFIED: grep "self-pay", "satisfies SchematicData", "healthcareConsole" all pass (HEALTHCARE_OK)
- VERIFIED: `kind: "area"` present in reconciliation payload
- VERIFIED: 0 em dashes in changed files; 0 sibling-unique strings in payload
- VERIFIED: LazySolutionsIndustryCards count on page = 0
- VERIFIED: tsc 0 errors, eslint exit 0 (parent binaries)

---
*Phase: 12-solutions-per-industry-visuals*
*Completed: 2026-06-12*
