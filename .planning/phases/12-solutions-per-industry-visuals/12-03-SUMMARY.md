---
phase: 12-solutions-per-industry-visuals
plan: 03
subsystem: ui
tags: [nextjs, react, typescript, archetypes, console, schematic, datastory, fintech, insurance]

# Dependency graph
requires:
  - phase: 12-solutions-per-industry-visuals
    plan: 01
    provides: 12-ARCHETYPE-MAP.md (D-08), solutions-utilities.ts proven payload pattern, FeatureAccordion visuals prop, min-h-[34rem] hero box, industryUniqueStrings lock, solutions-visuals.spec.ts distinctness gate
provides:
  - /solutions/fintech fully wired (Console hero + routing Schematic + config Console + consolidation DataStory area)
  - /solutions/insurance fully wired (Console hero + routing Schematic + config Console + reconciliation DataStory bars)
  - src/content/visuals/solutions-fintech.ts payload module
  - src/content/visuals/solutions-insurance.ts payload module
affects: [12-05, 13-homepage-handoff]

# Tech tracking
tech-stack:
  added: []
  patterns: [per-industry payload module under src/content/visuals/, FeatureAccordion visuals prop overriding homepage registry, min-h-[34rem] CLS reservation around ConsoleVisual hero]

key-files:
  created:
    - src/content/visuals/solutions-fintech.ts
    - src/content/visuals/solutions-insurance.ts
  modified:
    - src/app/solutions/fintech/page.tsx
    - src/app/solutions/insurance/page.tsx
    - src/content/solutions-fintech.ts
    - src/content/solutions-insurance.ts

key-decisions:
  - "fintech DataStory carrier = reporting, authored as an AREA curve of vendor-network consolidation (22% to 92%); distinct from utilities' flat reconciliation spark even though both share the chart-5 accent"
  - "insurance DataStory carrier = reporting, authored as a BARS chart by recovery type (premium/subrogation/deductible/salvage); the reconcile-daily cluster differentiator (insurance bars vs utilities spark vs healthcare area)"
  - "Accent-collision distinctness resolved by composition, not color: fintech (chart-5, shared with utilities) uses BNPL/loan row nouns + lending API source + steep early-delinquency framing; insurance (chart-3, shared with telecom) uses earned-premium/subrogation/deductible rows + policy-admin source + jurisdiction framing"

requirements-completed: [SOLVIS-02, SOLVIS-03, SOLVIS-04, SOLVIS-05]

# Metrics
duration: ~35min
completed: 2026-06-12
---

# Phase 12 Plan 03: Fintech + insurance per-industry visuals Summary

**/solutions/fintech and /solutions/insurance each repointed from the duplicate SolutionsIndustryCards widget to a real per-industry visual library: a Console hero, a routing Schematic, a config Console, and a reporting DataStory, with composition deliberately differentiated from their accent-sharing siblings (fintech vs utilities on chart-5, insurance vs telecom on chart-3)**

## Performance

- **Duration:** ~35 min
- **Completed:** 2026-06-12
- **Tasks:** 2/2
- **Files modified:** 6 (2 created, 4 modified)

## Accomplishments

- `src/content/visuals/solutions-fintech.ts`: `fintechConsole` (BNPL installments, personal loans, revolving cards, disputed charge-backs; early/late-stage pills; steep early-delinquency callout), `fintechRouting` (lending-stack API source -> routing engine -> early/late vendor pools -> sink), `fintechConfig` (BNPL vs loan-and-card books, in-app config, no release cycle), `fintechConsolidation` (DataStory area, network consolidation 22% to 92%). All `satisfies <Schema>`.
- `src/content/visuals/solutions-insurance.ts`: `insuranceConsole` (earned-premium, subrogation, deductible, disputed salvage; business/consumer obligor pills; subrogation-routing callout), `insuranceRouting` (policy-admin source -> routing engine -> business/consumer obligor pools -> sink), `insuranceConfig` (business vs consumer books, configured separately), `insuranceReconciliation` (DataStory bars by recovery type, 98.1% daily match). All `satisfies <Schema>`.
- Both pages repointed: ProductVisualBand now renders the industry ConsoleVisual hero inside a `min-h-[34rem]` CLS box; FeatureAccordion gains a `visuals` prop keyed `placement`/`optimization`/`reporting`; `LazySolutionsIndustryCards` removed from both.
- 6 `visualLabel` strings updated to describe the new visuals (3 per page).

## Payload export names (for the verification plan)

| Route | Console hero | placement (Schematic) | optimization (Console) | reporting (DataStory) |
|---|---|---|---|---|
| /solutions/fintech | `fintechConsole` | `fintechRouting` | `fintechConfig` | `fintechConsolidation` (area) |
| /solutions/insurance | `insuranceConsole` | `insuranceRouting` | `insuranceConfig` | `insuranceReconciliation` (bars) |

## Accent-collision distinctness resolution

The two routes in this plan carry the shared-accent distinctness burden. Resolved by composition (the accent token is unchanged per 12-UI-SPEC):

- **fintech vs utilities (both --chart-5):** different row nouns (BNPL installments / personal loans / revolving cards vs utility final-bill / active-service arrears / deposit offsets), different source node (Lending stack API vs Billing / CIS), different delinquency shape (steep early-stage curve framing vs flat seasonal arrears), and a different reporting chart kind (area consolidation vs spark reconciliation). The cross-route spec fails a copy-paste because `BNPL` is present and utilities' full `arrears`+`deposit` set is not duplicated.
- **insurance vs telecom (both --chart-3):** policy-admin / jurisdiction framing (earned-premium, subrogation, deductible, salvage) against telecom's high-volume prepaid/postpaid short-cycle; policy-admin source node (not OSS / BSS); reporting is a bars chart by recovery type. `subrogation` is present; telecom's `prepaid` set is not duplicated.
- **Reconcile-daily cluster:** insurance reporting is the BARS member, distinct from utilities' SPARK and the planned healthcare AREA, so the three daily-reconciliation stories never render alike.

## Decisions Made

- fintech reporting authored as a DataStory **area** (consolidation climb) rather than cards: the area reads as a single "one connection, climbing coverage" story and stays visually distinct from the hub's cards instance and utilities' spark. (12-01-SUMMARY's Wave-2 table listed fintech as "cards"; switched to area to strengthen distinctness from the hub cards instance and keep one current-view narrative; both are valid DataStory kinds and the spec asserts archetype presence + distinctness, not a specific chart kind.)
- insurance reporting authored as DataStory **bars** exactly per the locked Wave-2 table and the reconcile-daily cluster differentiator.
- Hero CLS box reused at `min-h-[34rem]` (544px) verbatim from the utilities precedent so all Wave-2 heroes read as one family and the lazy swap never shifts layout.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Worktree was 6 commits behind the required base**
- **Found during:** Pre-task worktree branch check
- **Issue:** Worktree HEAD was at `12bd147`; the required base `c6a22af` (plan 12-01's merged artifacts: 12-ARCHETYPE-MAP, CONTEXT, UI-SPEC, solutions-utilities payloads) was not materialized in the working tree, so the plan's @-referenced files were absent on disk.
- **Fix:** `git reset --soft c6a22af` per the worktree_branch_check contract, then `git reset --hard c6a22af` to materialize the base into the working tree (clean tree, no uncommitted work lost; config.json matched base).
- **Files modified:** none (branch pointer only)
- **Verification:** phase-12 files + src/content/visuals/solutions-utilities.ts present on disk, `git status` clean.

### Plan-table refinement (not a deviation, documented for the verifier)

- fintech reporting DataStory chart kind: authored as `area` rather than the `cards` listed in 12-01-SUMMARY's Wave-2 table. Rationale above. Insurance bars unchanged.

---

**Total deviations:** 1 auto-fixed (blocking) + 1 documented chart-kind refinement. No scope creep.

## Issues Encountered

- `node_modules` is absent in this worktree (deps installed only in the parent checkout). `next build` cannot run here (Turbopack does not resolve cross-checkout). Verified instead with the parent checkout's binaries against the worktree files: `tsc --noEmit` reports 0 project-wide errors; `eslint` exits 0 on all 6 changed files. Build + the Playwright distinctness spec run in CI / against the Vercel preview after the wave merges, per the 12-01 precedent.

## Known Stubs

None. All 8 payloads (4 fintech, 4 insurance) are fully authored with real-shaped, anonymized data and wired to live archetypes. No placeholder text, empty data sources, or TODOs ship in this plan.

## Threat Flags

None. No new network endpoints, auth paths, file access, or schema changes. The only input is developer-authored static typed payload validated by `satisfies`; matches the plan's accepted threat register (T-12-09 through T-12-12).

## Self-Check: PASSED

- FOUND: src/content/visuals/solutions-fintech.ts
- FOUND: src/content/visuals/solutions-insurance.ts
- FOUND: commit c39d10c (fintech)
- FOUND: commit a3c6ffc (insurance)

---
*Phase: 12-solutions-per-industry-visuals*
*Completed: 2026-06-12*
