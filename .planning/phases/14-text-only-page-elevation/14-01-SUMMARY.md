---
phase: 14
plan: 01
subsystem: planning-gate + e2e-spec
tags: [d-01-restraint, archetype-map, playwright, tdd-red, wave-0]
requires: []
provides:
  - "14-ARCHETYPE-MAP.md: approved per-route lift/no-lift decision record for all 9 target routes (the D-01 gate for 14-03/14-04)"
  - "tests/responsive/14-page-elevation.spec.ts: RED Wave-0 per-route argument-unique-string + reduced-motion-parity gate"
affects:
  - "14-03 (archetype pages: /compare DataStory + /platform/integrations Schematic, payloads must contain the uniqueStrings verbatim)"
  - "14-04 (motion-confirm pass relies on the recorded no-lift calls)"
tech-stack:
  added: []
  patterns:
    - "Phase 12 D-08 map-gate pattern reused for the Phase 14 D-01 lift/no-lift record"
    - "solutions-visuals.spec.ts port: per-route config + role=img presence + uniqueStrings on load AND under reducedMotion + assertNoStuckOpacity with the iterations === Infinity idle-guard"
key-files:
  created:
    - .planning/phases/14-text-only-page-elevation/14-ARCHETYPE-MAP.md
    - tests/responsive/14-page-elevation.spec.ts
  modified: []
decisions:
  - "/compare gets a DataStory (time-to-production contrast), NOT a Schematic: the strongest non-duplicative lift vs the scope-only CompareMatrix (RESEARCH Open Question 1)"
  - "/platform/integrations gets a Schematic (system-of-record -> dPlat -> vendor pool -> reconciliation sink) in ProductVisualBand"
  - "/why-dplat is Reveal-only (NO archetype): a proof DataStory would duplicate the already-animating ProofBand figures, failing the D-01 lift bar"
  - "/demo is Ambient/Reveal only (D-01d, submit CTA never competed with); /company set + /resources are deliberate no-lift"
  - "Accent binding: chart-1/3/4/5 only; /compare reserves chart-1 for dPlat and chart-2 (muted) for the typical-build baseline so the argument survives grayscale"
metrics:
  duration: "~45 min"
  tasks: 3
  files: 2
completed: 2026-07-01
---

# Phase 14 Plan 01: Wave-0 gating artifacts (archetype map + RED spec) Summary

**One-liner:** D-01 lift/no-lift map approved for all 9 routes (2 archetypes: /compare DataStory + /platform/integrations Schematic; 7 deliberate no-lifts) plus the RED 14-page-elevation.spec.ts asserting payload-only argument strings on load and under reduced motion.

## Approved per-page lift/no-lift calls (the record 14-03 and 14-04 build against)

| Route | Call | Archetype / treatment |
|---|---|---|
| `/compare` | LIFT | **DataStory** (time-to-production contrast, ProductVisualBand; dPlat on chart-1, typical-build baseline on muted chart-2) |
| `/platform/integrations` | LIFT | **Schematic** (system map: SAP/Oracle ERP + billing/CIS sources -> dPlat routing engine -> collection agencies / law firms / recovery vendors pool -> reconciliation sink, ProductVisualBand) |
| `/why-dplat` | NO-LIFT | Reveal-only; a proof DataStory would repeat the ProofBand figures (decision recorded, accepted at checkpoint) |
| `/demo` | NO-LIFT | Ambient/Reveal only; nothing competes with the form submit CTA (D-01d); pairs with P14-01/P14-02 in 14-02 |
| `/company` (hub) | NO-LIFT | Reveal-only or nothing; TSI/COI section stays unobscured |
| `/company/about` | NO-LIFT | Reveal-only (already present); no double-wrapping |
| `/company/leadership` | NO-LIFT | Reveal-only (already present, x2) |
| `/company/careers` | NO-LIFT | Reveal-only (already present) |
| `/company/contact` | NO-LIFT | Reveal-only (already present) |
| `/resources` | NO-LIFT | Reveal-only; a card DataStory would repeat card copy |

## Exact uniqueStrings per archetype route (14-03 payloads MUST contain these verbatim)

| Route | uniqueStrings |
|---|---|
| `/platform/integrations` | `system of record`, `recovery vendors` |
| `/compare` | `time to production`, `already in production` |

Both sets are payload-only: absent from the page's existing table/prose copy, so a decorative or copy-pasted payload fails the spec. `/why-dplat` has no strings (no archetype). `/demo` is `revealOnly: true` with a submit-CTA-present assertion and no uniqueStrings.

## The /why-dplat decision

**Reveal-only, no new archetype.** The `CardGrid` / `ComparisonTable` / `ProofBand` bands already animate via the legacy `product/motion` barrel; a proof DataStory would duplicate the ProofBand stat row, which is decoration under the D-01 lift bar. Accepted at the Task 3 checkpoint. This keeps the phase's archetype work to exactly 2 instances, matching the UI-SPEC's "concentrates on /compare + /platform/integrations" statement.

## Task commits

| Task | Name | Commit |
|---|---|---|
| 1 | Author 14-ARCHETYPE-MAP.md (D-01 lift/no-lift record, all 9 routes) | `593f83f` |
| 2 | Create 14-page-elevation.spec.ts (RED Wave-0 argument-unique gate) | `450f230` |
| 3 | D-01 lift-map approval checkpoint | approved 2026-07-01 (auto-approved per the active --auto chain; Connor reviews at the phase boundary; map status line updated in this commit) |

## Verification results

- Task 1 automated verify: `MAP_OK` (file exists; "Per-route distinctness strings", "lift/no-lift", integrations, compare all present)
- Task 2 automated verify: `SPEC_OK` (uniqueStrings, `iterations === Infinity`, /platform/integrations, /compare, revealOnly all present)
- `npx tsc --noEmit`: exit 0, zero errors project-wide (none attributable to the new spec)
- `npx eslint tests/responsive/14-page-elevation.spec.ts`: clean
- `npx playwright test --list`: 3 tests discovered (/platform/integrations, /compare, /demo)
- Spec is RED against the preview by design (archetype pages not wired until 14-03), the correct Wave-0 state
- No Explorable-toggle assertion; no /company-set or /resources rows (covered by the existing VISUAL_ROUTES nets in reduced-motion.spec.ts / reveal-fail-open.spec.ts)

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Worktree base correction before any task work**
- **Found during:** worktree branch check (first action)
- **Issue:** The worktree branch was created from `ab0ad77` (main-era base) instead of the instructed base `69ed004`, so the phase-14 planning artifacts (14-01-PLAN.md, CONTEXT, UI-SPEC, RESEARCH) were absent from the working tree.
- **Fix:** `git reset --soft 69ed004` per the worktree-branch-check instruction, then `git checkout HEAD -- .planning/` to materialize the planning files (soft reset alone moves only the branch pointer). Untracked files untouched.
- **Files modified:** none (branch pointer + working-tree restore only)
- **Commit:** n/a (no content change)

Otherwise: plan executed exactly as written.

## Known Stubs

`tests/responsive/14-page-elevation.spec.ts` is intentionally RED at Wave 0: the `/compare` and `/platform/integrations` archetype assertions fail against the preview until plan 14-03 wires the pages. This is the plan's specified TDD RED state, not an unresolved stub; plan 14-03 turns it GREEN.

## Threat Flags

None. This plan ships one planning artifact and one static TypeScript test file: no new network endpoints, auth paths, file-access patterns, or schema changes. Matches the plan's threat model (all dispositions "accept").

## Governance carried forward to 14-03

- `/compare` DataStory copy is a comparative claim: `[CLAIMS REVIEW]` + `[COI REVIEW]` tags plus the **legal gate** (punch-list #4) before merge of comparative-claim copy.
- AUDIT BL-01: `compare.ts:99` contains "digital journeys" (banned) in the Symend cell; fix in-line if /compare copy is touched in 14-03.
- Every new payload module gets `[CLAIMS REVIEW]` / `[COI REVIEW]` header tags (non-blocking per Andrew 2026-06-12, retained for audit); flag both in the PR body.

## Self-Check: PASSED

- FOUND: .planning/phases/14-text-only-page-elevation/14-ARCHETYPE-MAP.md
- FOUND: tests/responsive/14-page-elevation.spec.ts
- FOUND: commit 593f83f (Task 1)
- FOUND: commit 450f230 (Task 2)
- eslint tests/responsive/14-page-elevation.spec.ts: exit 0, no findings
- tsc --noEmit: exit 0, zero errors
