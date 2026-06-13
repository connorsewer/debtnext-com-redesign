---
phase: 12-solutions-per-industry-visuals
plan: 05
subsystem: solutions-visuals
tags: [datastory, hub, deletion, phase-gate]
requires: [12-01, 12-02, 12-03, 12-04]
provides:
  - solutionsHubStory (6-card cross-industry DataStory payload)
  - SolutionsIndustryCards widget deleted (SOLVIS-01 closed)
affects: [/solutions hub, product visuals lazy registry]
tech-stack:
  added: []
  patterns: [typed payload + archetype component, satisfies DataStoryData]
key-files:
  created:
    - src/content/visuals/solutions-hub.ts
  modified:
    - src/app/solutions/page.tsx
    - src/components/product/visuals/lazy.tsx
    - tests/responsive/reduced-motion.spec.ts
    - HANDOFF.md
  deleted:
    - src/components/product/visuals/SolutionsIndustryCards.tsx
decisions:
  - Hub card accents use the per-industry token strings from 12-ARCHETYPE-MAP.md (D-11); insurance card uses "Recovery · 30D" label vs the others' "Liquidation · 30D" for in-grid variety
metrics:
  duration: ~25 min
  completed: 2026-06-12
---

# Phase 12 Plan 05: Hub DataStory + widget deletion + phase gate Summary

6-card cross-industry DataStory on the /solutions hub replaces the last LazySolutionsIndustryCards consumer; the duplicate widget and its lazy export are deleted, closing SOLVIS-01.

## What was built

**Task 1 (commit cb35b53):**
- `src/content/visuals/solutions-hub.ts`: `solutionsHubStory satisfies DataStoryData`, cards branch with 6 cards (utilities, financial services, telecom, fintech, insurance, healthcare). Accents are token strings per the archetype map hub row: chart-5 / chart-1 / chart-3 / chart-5 / chart-3 / chart-4. Header carries [CLAIMS REVIEW] + [COI REVIEW]. Figures real-shaped, anonymized, generic per D-09 (Andrew pre-cleared 2026-06-12). Annotation: "6 portfolios · One decision engine, one reporting surface, your existing vendors in every market." Full governed ariaSummary. No em dashes; `·` separators.
- `src/app/solutions/page.tsx`: LazySolutionsIndustryCards import replaced with `DataStoryVisual` (archetypes) + `solutionsHubStory`; BenefitSplit visual prop repointed (D-03).
- Deleted `src/components/product/visuals/SolutionsIndustryCards.tsx` (contained the 3 invented hexes, P12-02) and removed the `LazySolutionsIndustryCards` export block from `lazy.tsx`.
- `tests/responsive/reduced-motion.spec.ts:90` comment updated ("ssr:false solutions Console visuals"), no behavior change.
- HANDOFF.md synced in the same commit (docs-in-sync rule): Phase 12 section documenting per-industry payload modules, hub DataStory, widget deletion.

## Verification evidence (Task 2 phase gate)

| Check | Result |
|---|---|
| SOLVIS-01 zero live references | `grep -rn "SolutionsIndustryCards" src/ \| grep -vE "// \|/\*\|\* " \| wc -l` → **live_refs=0** (SOLVIS01_OK). 11 remaining hits are all inert history comments (payload module headers, types.ts cards-branch note, Console.tsx/DataStory.tsx history) |
| `tsc --noEmit` (parent checkout binary) | **Clean** — zero errors output (run post-Task-1 against the full worktree) |
| `eslint` on changed files (solutions-hub.ts, page.tsx, lazy.tsx, reduced-motion.spec.ts) | **Exit 0** |
| lighthouserc.json solutions routes | `/solutions/utilities` is the **only** solutions route (line 11) — D-13 honored, none added |
| Task 1 verify command | `test ! -f SolutionsIndustryCards.tsx && grep solutionsHubStory page.tsx && grep "satisfies DataStoryData" solutions-hub.ts` → **HUB_OK** |
| Em-dash voice check on solutions-hub.ts | **No em dashes** |
| `next build` | **Deferred to CI**: Turbopack panics in this sandbox worktree (node_modules symlink "points out of the filesystem root"); per sandbox constraints and the 12-02/03/04 precedent, build verification runs in CI on push |
| solutions-visuals.spec.ts (7 surfaces) + axe + touch + reduced-motion | **Deferred to CI/preview** (PLAYWRIGHT_BASE_URL against Vercel preview; sandbox cannot run next dev/start) |
| LHCI /solutions/utilities (LCP < 2.5s, CLS < 0.1, TBT <= 300ms) | **Deferred to CI** (perf.yml); BL-07 noise tolerance noted (~290ms TBT is runner noise, hydration-bound) |

## Deviations from plan

**1. [Rule 3 - Blocking] `next build` not runnable in this sandbox worktree**
- **Found during:** Task 2
- **Issue:** Worktree has no node_modules; a symlink to the parent checkout's node_modules makes Turbopack panic ("Symlink [project]/node_modules is invalid, it points out of the filesystem root"); a hardlink clone was too slow under the sandbox.
- **Fix:** Build verification deferred to CI on push (same posture the 12-02/03/04 executors took). tsc + eslint ran clean locally via parent binaries, which covers the type/lint surface.
- **Files modified:** none

No other deviations; tasks executed as written.

## Phase close-out

All 5 SOLVIS requirements are implementation-complete pending CI/preview confirmation and Connor's checkpoint approval:

- **SOLVIS-01** (kill the duplicate): widget + lazy export deleted, zero live references — **verified locally**
- **SOLVIS-02** (per-industry Console heroes): plans 12-01..12-04 — shipped
- **SOLVIS-03** (placement Schematics): plans 12-01..12-04 — shipped
- **SOLVIS-04** (DataStory carrier per page): plans 12-01..12-04 + hub story this plan — shipped
- **SOLVIS-05** (distinct Console accordion items): plans 12-01..12-04 — shipped

## Task 3 checkpoint (human-verify, auto-chain active)

Auto-advance chain is ACTIVE; per the orchestrator contract this blocking visual review is **auto-approved** at the executor level and the final cross-page distinctness sign-off rolls up to the orchestrator/Connor on the Vercel preview:

1. Open all 6 industry pages side by side; confirm no two share a visual (arrears/deposits vs charge-off vs prepaid/postpaid vs BNPL vs subrogation vs self-pay).
2. Utilities/insurance/healthcare reconciliation cluster: spark vs bars vs area; billing-CIS vs policy-admin vs EHR schematics.
3. /solutions hub overview reads distinct from every industry page.
4. No CLS on load; single "Request a demo" CTA per band untouched.

## Known stubs

None. All payloads are fully wired typed data; no placeholder text, no empty-value props.

## Threat flags

None — no new endpoints, auth paths, or trust-boundary surface. Deletion-heavy change; T-12-17..20 dispositions (all accept) unchanged.

## Commits

- cb35b53 feat(12-05): hub cross-industry DataStory; delete SolutionsIndustryCards

## Self-Check: PASSED
