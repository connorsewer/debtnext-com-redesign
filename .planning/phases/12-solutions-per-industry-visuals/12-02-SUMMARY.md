---
phase: 12-solutions-per-industry-visuals
plan: 02
subsystem: ui
tags: [nextjs, react, typescript, archetypes, console, schematic, datastory]

# Dependency graph
requires:
  - phase: 12-solutions-per-industry-visuals
    plan: 01
    provides: 12-ARCHETYPE-MAP.md (D-08 approved), min-h-[34rem] hero box, industryUniqueStrings lock, DataStory-carrier assignments, src/content/visuals/solutions-utilities.ts payload pattern
provides:
  - /solutions/financial-services fully wired (charge-off Console hero + core-banking routing Schematic + bankruptcy/deceased/dispute DataStory + settlement Console)
  - /solutions/telecom fully wired (prepaid/postpaid Console hero + OSS/BSS routing Schematic + short-cycle recall Console + prepaid-vs-postpaid DataStory)
  - src/content/visuals/solutions-financial-services.ts + src/content/visuals/solutions-telecom.ts payload modules
affects: [12-05-hub, 13-homepage-handoff]

# Tech tracking
tech-stack:
  added: []
  patterns: [per-industry payload module reused verbatim from 12-01 utilities shape, FeatureAccordion visuals prop keyed by verified item ids, min-h-[34rem] CLS reservation around ConsoleVisual hero]

key-files:
  created:
    - src/content/visuals/solutions-financial-services.ts
    - src/content/visuals/solutions-telecom.ts
  modified:
    - src/app/solutions/financial-services/page.tsx
    - src/app/solutions/telecom/page.tsx
    - src/content/solutions-financial-services.ts
    - src/content/solutions-telecom.ts

key-decisions:
  - "issues item renders DataStoryData (not Console) on both pages: the plan's interface + acceptance criteria specify `satisfies DataStoryData` for the issues carrier and DataStoryVisual in the wiring; followed the plan over the map's 'Console (DataStory carrier)' label, which describes intent not schema"
  - "financial-services hero uses $ balance trailing cells (prefix/suffix M) for larger-balance/lower-count guardrail; telecom uses count trailing cells for high-count short-cycle guardrail"
  - "telecom routing source OSS/BSS and pool structure (high-volume + device pools) kept visibly distinct from financial-services core-banking + agency/law-firm pools"

requirements-completed: [SOLVIS-02, SOLVIS-03, SOLVIS-04, SOLVIS-05]

# Metrics
duration: ~35min
completed: 2026-06-12
---

# Phase 12 Plan 02: Financial-services + telecom per-industry visuals Summary

**financial-services and telecom each get a per-industry Console hero, a routing Schematic, and three distinct accordion archetypes authored from the D-08 map, replacing the duplicate SolutionsIndustryCards widget on both pages; the issues item carries the DataStory on both (neither page has a reporting item)**

## Payload export names (for the verification plan)

| Module | Hero (Console) | placement (Schematic) | optimization (Console) | issues (DataStory) |
|---|---|---|---|---|
| `solutions-financial-services.ts` | `financialServicesConsole` | `financialServicesRouting` | `financialServicesSettlement` | `financialServicesExceptions` |
| `solutions-telecom.ts` | `telecomConsole` | `telecomRouting` | `telecomRecall` | `telecomPrepaidPostpaid` |

All eight payloads use `satisfies <Schema>` (no type annotations). Both modules carry the `[CLAIMS REVIEW]` + `[COI REVIEW]` header.

## Distinctness notes

- **industryUniqueStrings present:** `charge-off` on financial-services hero+routing+settlement; `prepaid` on telecom hero+routing+issues. Verified by grep.
- **Routing source nodes differ:** financial-services = "Core banking / loan servicing"; telecom = "OSS / BSS billing"; utilities = "Billing / CIS system" (12-01). `grep "core banking"` returns 0 in the telecom module.
- **Relative-magnitude guardrail:** financial-services runs larger balances / lower counts ($204.8M across 31,480 accounts, $-suffixed M trailing cells); telecom runs high counts / shorter cycle (214,680 accounts, count trailing cells). Telecom counts exceed the insurance counts the map reserves for that chart-3 sibling.
- **Pool-structure distinctness:** financial-services splits agency vs law-firm; telecom splits high-volume vs device-receivable pools.
- **Accent tokens:** financial-services chart-1 (unique); telecom chart-3 (shared with insurance, separated by volume/cycle per the map's Distinctness check).
- **Exception subject:** financial-services issues DataStory = bankruptcy/deceased/dispute/documentation; telecom issues DataStory = prepaid vs postpaid treatment split. No overlap.

## Task Commits

1. **Task 1: Financial-services payloads + page repoint** - `6bffa11` (feat)
2. **Task 2: Telecom payloads + page repoint** - `a460aa8` (feat)

## Verification run

- `tsc --noEmit -p tsconfig.json` (parent checkout binary against worktree tsconfig): **exit 0, 0 errors project-wide** after each task.
- `eslint` on all 6 changed files: **exit 0** after each task.
- `grep` gates: `FS_OK` and `TELECOM_OK` both printed; `LazySolutionsIndustryCards` returns 0 in both pages; em dashes return 0 across all 6 files.
- `next build` / `next dev` not run: worktree has no `node_modules` (deps live in the parent checkout only; Turbopack cannot resolve from the worktree, and next dev/start hang in this sandbox). tsc + eslint resolve via the parent's `.bin`. Build + the solutions-visuals.spec.ts distinctness/archetype/reduced-motion gate defer to CI/preview, where they run against PLAYWRIGHT_BASE_URL.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Worktree working tree missing plan-12 + utilities artifacts after soft reset**
- **Found during:** worktree_branch_check
- **Issue:** ACTUAL_BASE was `12bd147` (6 commits behind the required `c6a22af`); after `git reset --soft c6a22af`, the plan-12 planning files and `src/content/visuals/solutions-utilities.ts` showed as staged deletions because the prior HEAD predated them, so they were absent on disk.
- **Fix:** `git checkout HEAD -- <phase dir + utilities files>` restored the working tree to match the now-correct HEAD; unstaged the inherited STATE.md/ROADMAP.md/11-HUMAN-UAT.md leftovers (orchestrator-owned, left untouched).
- **Files modified:** none authored; branch pointer + working-tree restore only.
- **Verification:** plan + utilities artifacts present on disk; `git status` shows only the 3 inherited orchestrator-owned modifications, never staged.

No other deviations. The map's "Console (DataStory carrier)" label for the issues item was resolved to DataStoryData per the plan's binding interface + acceptance criteria (recorded as a decision, not a deviation).

## Known Stubs

None. All eight payloads are fully authored with real-shaped data and wired to live archetypes; no placeholder text, empty data sources, or TODOs. The remaining 3 industry routes (fintech, insurance, healthcare) and the hub stay on their current widget until their own Wave-2 plans, tracked by the RED solutions-visuals.spec.ts (per phase design).

## User Setup Required

None.

## Self-Check: PASSED

- FOUND: src/content/visuals/solutions-financial-services.ts
- FOUND: src/content/visuals/solutions-telecom.ts
- FOUND: commit 6bffa11
- FOUND: commit a460aa8

---
*Phase: 12-solutions-per-industry-visuals*
*Completed: 2026-06-12*
