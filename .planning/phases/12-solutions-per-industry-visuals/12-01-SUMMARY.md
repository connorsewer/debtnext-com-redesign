---
phase: 12-solutions-per-industry-visuals
plan: 01
subsystem: ui
tags: [nextjs, react, playwright, typescript, archetypes, console, schematic, datastory]

# Dependency graph
requires:
  - phase: 10-foundation
    provides: ConsoleData/DataStoryData/SchematicData payload schemas, lazy archetype wrappers (archetypes.tsx), VisualSkeleton
  - phase: 11-platform-deep-dive-visuals
    provides: FeatureAccordion.visuals mechanism, archetype-map + distinctness-spec pattern (11-01), platform-visuals.spec.ts helper shapes
provides:
  - 12-ARCHETYPE-MAP.md (D-08 APPROVED) mapping all 25 instances with distinctness table
  - tests/responsive/solutions-visuals.spec.ts (cross-route distinctness gate, RED for 5 routes until Wave 2)
  - /solutions/utilities fully wired (Console hero + routing Schematic + config Console + reconciliation DataStory)
  - src/content/visuals/solutions-utilities.ts payload module pattern for Wave-2 industries
affects: [12-02, 12-03, 12-04, 12-05, 13-homepage-handoff]

# Tech tracking
tech-stack:
  added: []
  patterns: [per-industry payload module under src/content/visuals/, FeatureAccordion visuals prop overriding homepage registry fallback, min-h CLS reservation around ConsoleVisual hero in ProductVisualBand]

key-files:
  created:
    - .planning/phases/12-solutions-per-industry-visuals/12-ARCHETYPE-MAP.md
    - tests/responsive/solutions-visuals.spec.ts
    - src/content/visuals/solutions-utilities.ts
  modified:
    - src/app/solutions/utilities/page.tsx
    - src/content/solutions-utilities.ts

key-decisions:
  - "Hero CLS box locked at min-h-[34rem] (544px): KPI header + 4 rows + callout + 3 pills budget; all Wave-2 heroes must match this box"
  - "DataStory carriers: utilities/fintech/insurance/healthcare use the reporting item; financial-services and telecom use the issues item"
  - "industryUniqueStrings locked: utilities arrears+deposit, financial-services charge-off, telecom prepaid, fintech BNPL, insurance subrogation, healthcare self-pay"

patterns-established:
  - "Payload module per industry: src/content/visuals/solutions-<industry>.ts with satisfies-validated exports and [CLAIMS REVIEW]/[COI REVIEW] header"
  - "Page wiring shape: ProductVisualBand > min-h div > ConsoleVisual hero; FeatureAccordion visuals prop keyed by verified item ids"
  - "Do NOT rename accordion item ids (breaks #feat-{id}-button anchors + accordion_toggle analytics); the visuals prop overrides the homepage registry collision"

requirements-completed: [SOLVIS-02, SOLVIS-03, SOLVIS-04, SOLVIS-05]

# Metrics
duration: ~70min
completed: 2026-06-12
---

# Phase 12 Plan 01: Wave-0 gating artifacts + utilities proven end-to-end Summary

**D-08 archetype map (25 instances, approved) + cross-route distinctness Playwright spec + /solutions/utilities wired with Console hero, routing Schematic, config Console, and reconciliation DataStory, replacing the duplicate SolutionsIndustryCards widget on that page**

## Performance

- **Duration:** ~70 min
- **Started:** 2026-06-12T16:34:00Z (approx, worktree session start)
- **Completed:** 2026-06-12T17:43:40Z
- **Tasks:** 4/4 (Task 4 checkpoint approved via auto-chain + orchestrator review)
- **Files modified:** 5 (3 created, 2 modified)

## Accomplishments

- 12-ARCHETYPE-MAP.md covers all 25 instances (6 Console heroes + 18 accordion items + 1 hub) with an explicit distinctness table; **approved at the D-08 gate** (distinctness verified strong on the reconcile-daily cluster and both accent-share pairs)
- solutions-visuals.spec.ts asserts per-route industry-unique payload strings, cross-route distinctness (a copy-pasted payload fails), reduced-motion data parity, and no-stuck-opacity for 6 industry routes + the hub
- /solutions/utilities is the proven end-to-end template: utilities Console hero (arrears, deposits, residential/commercial), Schematic on placement, Console on optimization, DataStory on reporting; LazySolutionsIndustryCards removed from the page

## Task Commits

Each task was committed atomically:

1. **Task 1: Author 12-ARCHETYPE-MAP.md (D-08 deliverable)** - `8cf607b` (docs)
2. **Task 2: Create solutions-visuals.spec.ts (RED at Wave 0)** - `e6a47fb` (test)
3. **Task 3: Author utilities payloads + repoint utilities/page.tsx** - `8d8b793` (feat)
4. **Task 4: D-08 checkpoint** - approved 2026-06-12 (auto-chain + orchestrator review); no code commit

_Note: Task 2 is the TDD RED step by design; GREEN for the utilities route lands with Task 3's wiring and is verified against the Vercel preview. The other 5 routes stay RED until Wave 2 (expected)._

## Wave-2 contract (MUST-READ for Plans 12-02/03/04)

### Approved per-page archetype + DataStory-carrier assignments

| Page | placement | optimization | issues | reporting | DataStory carrier | Accent |
|---|---|---|---|---|---|---|
| utilities | Schematic (Billing/CIS source) | Console (residential vs commercial) | — | DataStory spark (arrears/deposit reconciliation) | reporting | chart-5 |
| financial-services | Schematic (core banking source) | Console (settlement floors/plans) | Console exceptions (bankruptcy/deceased/disputes) | — | issues | chart-1 |
| telecom | Schematic (OSS/BSS source) | Console (short-cycle recall) | Console (prepaid vs postpaid) | — | issues | chart-3 |
| fintech | Schematic (ledger/origination API source) | Console (in-app config) | — | DataStory cards (network consolidation) | reporting | chart-5 |
| insurance | Schematic (policy-admin source) | Console (business vs consumer books) | — | DataStory bars (premium/subrogation) | reporting | chart-3 |
| healthcare | Schematic (EHR/clearinghouse source) | Console (EBO vs bad-debt) | — | DataStory area (self-pay/balance-after-insurance) | reporting | chart-4 |
| hub | — | — | — | DataStory cards (6 industry cards, per-card accents) | n/a | chart-1/3/4/5 |

Plus 6 Console heroes (one per industry, ProductVisualBand slot). Full intents in 12-ARCHETYPE-MAP.md (approved).

### Hero CLS box (Pitfall 1)

`min-h-[34rem]` (544px) wrapped around the ConsoleVisual hero inside ProductVisualBand. Budget: KPI header + 4 rows + callout + 3 pills. **All Wave-2 heroes must author to this same budget and reserve the same box** so the lazy swap (20rem skeleton) never shifts layout and all 6 heroes read as one family.

### Exact industryUniqueStrings (locked in spec + map)

| Route | industryUniqueStrings |
|---|---|
| /solutions/utilities | `arrears`, `deposit` |
| /solutions/financial-services | `charge-off` |
| /solutions/telecom | `prepaid` |
| /solutions/fintech | `BNPL` |
| /solutions/insurance | `subrogation` |
| /solutions/healthcare | `self-pay` |

Wave-2 payloads MUST contain their route's strings and MUST NOT contain a sibling's full set (the cross-route test fails a copy-paste). Hub card names asserted: Utilities, Financial services, Telecom, Fintech, Insurance, Healthcare.

## Files Created/Modified

- `.planning/phases/12-solutions-per-industry-visuals/12-ARCHETYPE-MAP.md` - D-08 approval artifact, 25-instance map + distinctness table
- `tests/responsive/solutions-visuals.spec.ts` - distinctness + archetype-presence + reduced-motion parity gate (runs vs PLAYWRIGHT_BASE_URL preview)
- `src/content/visuals/solutions-utilities.ts` - utilitiesConsole/Routing/Config/Reconciliation payloads, satisfies-validated, [CLAIMS REVIEW]/[COI REVIEW] header
- `src/app/solutions/utilities/page.tsx` - Console hero in ProductVisualBand (min-h-[34rem]), visuals prop on FeatureAccordion, LazySolutionsIndustryCards removed
- `src/content/solutions-utilities.ts` - 3 visualLabel strings updated to describe the new visuals

## Decisions Made

- Hero box `min-h-[34rem]` chosen over the FLAGSHIP_SKELETON_MIN_H (44rem) precedent: the solutions hero is a single Console (no Explorable shell), so 544px fits the authored budget without dead space
- Em dashes removed from the payload module's doc comments (CLAUDE.md §5 applied to the whole file, not just rendered strings)
- Spec's cross-route test lowercases the body text for substring matching so `BNPL` matches regardless of rendered case

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Worktree branch was 6 commits behind the required base**
- **Found during:** Pre-task worktree branch check
- **Issue:** Worktree HEAD was at `12bd147` (merge of PR #10); the phase-12 planning files (12-01-PLAN.md, CONTEXT, UI-SPEC) live in `565009a`, so the plan was unexecutable from the stale base
- **Fix:** `git reset --hard 565009ae` per the worktree_branch_check contract (clean tree, no work lost)
- **Files modified:** none (branch pointer only)
- **Verification:** phase-12 files present on disk, `git status` clean

**2. [Rule 1 - Bug] Em dashes in payload module doc comments**
- **Found during:** Task 3 verification (§5 self-check)
- **Issue:** 4 em dashes in the module header comment violated the CLAUDE.md §5 banned-punctuation rule
- **Fix:** Replaced with colons
- **Files modified:** src/content/visuals/solutions-utilities.ts
- **Verification:** `grep -c "—"` returns 0
- **Committed in:** 8d8b793 (Task 3 commit)

---

**Total deviations:** 2 auto-fixed (1 blocking, 1 bug)
**Impact on plan:** Both necessary for executability/compliance. No scope creep.

## Issues Encountered

- `next build` cannot run in this worktree: `node_modules/next` is absent (deps installed only in the parent repo; tsc/eslint resolve via the parent's modules, Turbopack does not). Build verification defers to CI/preview, where the Playwright spec also runs. Not a code defect; tsc is clean project-wide and eslint exits 0 on all changed files.

## Known Stubs

None. All four utilities payloads are fully authored with real-shaped data and wired to live archetypes; no placeholder text, empty data sources, or TODOs ship in this plan. The 5 remaining industry routes intentionally keep their current state until Wave 2 (tracked by the RED spec, per plan design).

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- D-08 gate cleared: Wave 2 (12-02/03/04, the other 5 industries) is unblocked and authors against the locked map
- Wave-2 plans must: match the `min-h-[34rem]` hero box, import payloads directly from their own `src/content/visuals/solutions-<industry>.ts` module (file-disjoint for parallel execution), include their locked industryUniqueStrings, and never rename accordion item ids
- The hub overview (DataStory cards, 6 cards) and the SolutionsIndustryCards deletion (only after all 7 consumers are repointed) remain for the wave that owns 12-05/the hub

## Self-Check: PASSED

- FOUND: .planning/phases/12-solutions-per-industry-visuals/12-ARCHETYPE-MAP.md
- FOUND: tests/responsive/solutions-visuals.spec.ts
- FOUND: src/content/visuals/solutions-utilities.ts
- FOUND: commit 8cf607b
- FOUND: commit e6a47fb
- FOUND: commit 8d8b793

---
*Phase: 12-solutions-per-industry-visuals*
*Completed: 2026-06-12*
