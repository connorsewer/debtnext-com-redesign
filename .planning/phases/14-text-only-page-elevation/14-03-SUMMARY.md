---
phase: 14
plan: 03
subsystem: page-elevation-visuals
tags: [d-01-restraint, archetype-replication, schematic, datastory, wave-2, playwright-green-ready]
requires:
  - "14-01: 14-ARCHETYPE-MAP.md (approved lift/no-lift record) + 14-page-elevation.spec.ts (RED gate with the locked uniqueStrings)"
provides:
  - "src/content/visuals/integrations.ts: integrationsSystemMap (SchematicData) for /platform/integrations"
  - "src/content/visuals/compare.ts: compareTimeToProduction (DataStoryData, cards branch) for /compare"
  - "/platform/integrations + /compare wired with a real archetype in a ProductVisualBand; 14-page-elevation.spec.ts GREEN-ready for those routes"
affects:
  - "14-04 (motion-confirm pass): the /why-dplat no-lift call is executed here as zero page edits, per the approved map"
tech-stack:
  added: []
  patterns:
    - "Phase 11-12 archetype-replication: typed payload (satisfies) + lazy *Visual wrapper + ProductVisualBand slot"
    - "DataStory cards branch used for a two-item comparative contrast with per-card accent (chart-1 vs chart-2) so the argument survives grayscale via bar length"
key-files:
  created:
    - src/content/visuals/integrations.ts
    - src/content/visuals/compare.ts
  modified:
    - src/content/visuals/index.ts
    - src/app/platform/integrations/page.tsx
    - src/app/compare/page.tsx
    - src/content/compare.ts
decisions:
  - "/platform/integrations Schematic: source (system of record) -> engine (dPlat routing) -> vendor (recovery vendors, 538 partners) -> reconciliation sink, labeled flow edges; chart-1 on the dPlat engine"
  - "/compare DataStory uses the cards branch (not bars): the ValueBar tone palette is token-fixed to indigo/success/warning, but cards take an explicit per-card accent, so dPlat=chart-1 and typical-build=chart-2 (muted) is expressible and grayscale-survivable via bar length"
  - "/why-dplat executed as Reveal-only per the approved map: zero page edits, no double-wrapped RevealSection (Pitfall 3)"
metrics:
  duration: "~10 min"
  tasks: 3
  files: 6
completed: 2026-07-01
---

# Phase 14 Plan 03: Wave-2 archetype pages (/platform/integrations Schematic + /compare DataStory) Summary

**One-liner:** Wired the two D-01-approved archetypes — an `integrationsSystemMap` Schematic (system of record -> dPlat routing -> recovery vendors -> reconciliation) on /platform/integrations and a `compareTimeToProduction` DataStory (dPlat already-in-production vs a 6-9 month greenfield build, chart-1 vs muted chart-2) on /compare — each carrying the approved uniqueStrings verbatim in visible text, plus the BL-01 "digital journeys" reword, leaving 14-page-elevation.spec.ts GREEN-ready for both routes.

## Final archetype choice per page (as executed)

| Route | Call | Archetype / treatment | Export |
|---|---|---|---|
| `/platform/integrations` | LIFT | **Schematic** system/network map in a ProductVisualBand after the footprint ProofBand | `integrationsSystemMap` |
| `/compare` | LIFT | **DataStory** (cards branch, time-to-production contrast) in a ProductVisualBand after the CompareMatrix | `compareTimeToProduction` |
| `/why-dplat` | NO-LIFT | Reveal-only, no archetype, zero page edits (executed exactly per the approved map + 14-01 checkpoint) | none |

## Exact uniqueStrings shipped (matching the spec verbatim)

| Route | uniqueStrings (spec asserts) | Where they render as VISIBLE text (not just aria-label) |
|---|---|---|
| `/platform/integrations` | `system of record`, `recovery vendors` | Schematic FlowNode labels: "System of record" (source node) and "Recovery vendors" (vendor node). Also in the ariaSummary. `getByText` is case-insensitive, so the capitalized labels match. |
| `/compare` | `time to production`, `already in production` | DataStory headline "Time to production: dPlat is already running" + eyebrow "TIME TO PRODUCTION"; card tag "Already in production" + annotation "dPlat is already in production ...". All visible; case-insensitive match. |

Both sets are payload-only (absent from the IntegrationTable rows / CompareMatrix scope copy), so a decorative or copy-pasted payload fails the spec assertion.

## /why-dplat decision as executed

**Reveal-only, no new archetype, ZERO page edits.** The approved 14-ARCHETYPE-MAP.md and the 14-01 Task-3 checkpoint recorded that a proof DataStory on /why-dplat would repeat the already-animating ProofBand figures (decoration under the D-01 lift bar). Executed faithfully: `src/app/why-dplat/page.tsx` was not touched, no `src/content/visuals/why-dplat.ts` was created, and no self-animating section was double-wrapped in RevealSection (Pitfall 3). No distinctness strings, no spec row — its reduced-motion + fail-open coverage comes from the existing `reduced-motion.spec.ts` / `reveal-fail-open.spec.ts` nets iterating VISUAL_ROUTES.

## BL-01 confirmation

`src/content/compare.ts:99` (Symend `builtFor` cell) reworded from the banned "Behavioral-science driven digital journeys." to "Behavioral-science driven digital outreach flows." Verified: `grep -q "digital journeys" src/content/compare.ts` returns nothing. The new DataStory payload does not reuse the banned string.

## CLS / resolved min-h per new archetype slot

Both archetypes render inside `ProductVisualBand` (no height floor) through the lazy `*Visual` wrapper, whose `VisualSkeleton` reserves `min-h-[20rem]` (320px). Neither the Schematic (a 4-node single-row-per-column diagram) nor the 2-card DataStory is a flagship-scale visual, so **no explicit min-h override was added** — the default `min-h-[20rem]` skeleton is the reserved box, matching the utilities-page precedent that wires the same Schematic/DataStory archetypes into ProductVisualBand without a min-h wrapper.

- `/platform/integrations` Schematic slot: reserved box = default `min-h-[20rem]` (no override).
- `/compare` DataStory (cards) slot: reserved box = default `min-h-[20rem]` (no override).

**Preview verification still required (Pitfall 1):** the resolved heights must be confirmed <= the 20rem reserved box on the Vercel preview. If either resolves taller than 20rem, add a `min-h` wrapper on the band child per the FLAGSHIP_SKELETON_MIN_H (`min-h-[44rem]`) precedent and record the new value. This could not be measured in-sandbox (next dev/start hang).

## Governance surface carried in the payloads

- Both payload modules carry `[CLAIMS REVIEW]` + `[COI REVIEW]` header blocks (non-blocking per Andrew 2026-06-12, retained for audit). Flag both in the PR body.
- `src/content/visuals/compare.ts` additionally notes the **legal gate** (14-03 punch-list #4) required for comparative-claim copy before merge — the dPlat time-to-production-vs-greenfield contrast is a comparative claim.
- All vendor framing stays agency-network-agnostic ("routes across the originator's existing recovery vendors"); no independence claim, no dPlat-separate-from-TSI-ARM positioning (CLAUDE.md §6). No named clients, no client logos. Figures are real-shaped and anonymized (60+ integrations, 16 platform types, 538 partners, in continuous production since 2003, 6-9 month greenfield runway).

## Task commits

| Task | Name | Commit |
|---|---|---|
| 1 | Author + wire the /platform/integrations Schematic | `785ceaa` |
| 2 | Author + wire the /compare DataStory + BL-01 fix + /why-dplat no-lift | `7f1e161` |
| 3 | Reconcile 14-page-elevation.spec.ts (RED -> GREEN-ready) | no commit — see below |

**Task 3 is a no-op reconciliation (correctly no code change).** The Wave-0 spec (`450f230`, authored in 14-01) already lists `/platform/integrations` and `/compare` with the exact uniqueStrings Tasks 1-2 shipped, keeps `assertReducedMotionDataParity` + `assertNoStuckOpacity` with the `iterations === Infinity` idle-guard unweakened, and correctly omits `/why-dplat` from the archetype config (it appears only in an explanatory comment). Cross-check confirmed every spec uniqueString is present in the corresponding payload module. No spec edit was needed to flip it GREEN-ready; the map was the source of truth and the payloads were authored to it verbatim. No map-note update was required (no nouns changed from the approved draft).

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Worktree base correction before any task work**
- **Found during:** worktree branch check (first action)
- **Issue:** The worktree HEAD was at `ab0ad77` (a main-era merge), one commit behind the instructed base `f0189db` (Wave-1-complete), so the Wave-1 planning outputs this plan depends on were not on HEAD. `f0189db` was a fast-forward descendant of HEAD.
- **Fix:** `git reset --hard f0189db4372d870d761155522c660a9e01f59f7d` per the worktree-branch-check instruction. Tree was already clean (no local changes to preserve).
- **Files modified:** none (branch pointer only)
- **Commit:** n/a

Otherwise: plan executed exactly as written. Task 3 legitimately needed no code change (the 14-01 spec already matched the shipped payloads), which is the plan's intended reconciliation outcome, not a deviation.

## Known Stubs

None. Both payloads are fully authored with real-shaped figures and wired into live page slots; no empty/placeholder data flows to either archetype.

## Threat Flags

None. This plan ships two static TypeScript payload modules and three page/barrel edits: no new network endpoints, auth paths, file-access patterns, or schema changes at any trust boundary. Matches the plan's threat model (T-14-09..13; the comparative-claim legal gate for /compare is carried in the payload header per T-14-09).

## Verification results

- `npx tsc --noEmit`: exit 0, project-wide, after both tasks (the `satisfies SchematicData` / `satisfies DataStoryData` excess-property proofs pass; page imports type-check).
- `npx eslint` on all changed files (`integrations.ts`, `compare.ts`, `index.ts`, both `page.tsx`, `src/content/compare.ts`): exit 0.
- Task 1 automated verify: `INTEG_OK` (satisfies SchematicData, ariaSummary, integrationsSystemMap + SchematicVisual on the page, no em dashes).
- Task 2 automated verify: `COMPARE_OK` (ariaSummary, satisfies DataStoryData, compareTimeToProduction wired, "digital journeys" gone, no em dashes).
- Task 3 automated verify: `SPEC_GUARDS_OK` + `SPEC_TSC_CLEAN`; every spec uniqueString cross-matched to its payload module.
- `npx playwright test tests/responsive/14-page-elevation.spec.ts --list`: 3 tests discovered (/platform/integrations, /compare, /demo).
- No em dashes in either new payload; `·` used as the separator throughout.
- **Not runnable in-sandbox:** `next build` (timed out at 6m40s; the sandbox next hang extends to build) and the spec run against a live preview (`PLAYWRIGHT_BASE_URL` unset; next dev/start hang per project memory). Both must run in CI / against the Vercel preview: the 14-page-elevation.spec.ts /platform/integrations + /compare rows should pass GREEN there, and CLS resolved-height verification happens on the preview.

## Self-Check: PASSED

- FOUND: src/content/visuals/integrations.ts
- FOUND: src/content/visuals/compare.ts
- FOUND: commit 785ceaa (Task 1)
- FOUND: commit 7f1e161 (Task 2)
- tsc --noEmit: exit 0
- eslint on all changed files: exit 0
