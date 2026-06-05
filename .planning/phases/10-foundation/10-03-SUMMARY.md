---
phase: 10-foundation
plan: 03
subsystem: ui
tags: [motion, primitives, charts, a11y, svg, framer-motion]

# Dependency graph
requires:
  - phase: 10-foundation (10-01)
    provides: CI guardrails + mobile-GSAP-free spec that guard any future lazy/desktop-only flow engine
provides:
  - WorklistRow console-row atom (generalizes the inline PlacementMatrix/IssuesWorklist grid row)
  - ChartFrame data-story container with caption/annotation slots + required ariaSummary wiring
  - FlowNode provisional schematic node atom (kind-driven tone, role=img/aria-hidden)
  - FlowEdge provisional schematic edge atom (strokeDashoffset flow, reduced-motion static fallback)
  - Updated primitives barrel exporting all four new atoms
affects: [10-05 archetypes, 11 platform deep-dive visuals, 12 solutions per-industry visuals]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Atom-level enforcement of Pitfall 5 (compositor-only animation) and Pitfall 8 (label-paired status) so archetype consumers cannot violate them"
    - "Bars/charts/count-up delegated to existing parts.tsx + motion barrel, never re-implemented"
    - "PROVISIONAL (A2) header convention for medium-confidence schematic atoms pending Phase 11 hardening"

key-files:
  created:
    - src/components/product/primitives/WorklistRow.tsx
    - src/components/product/primitives/ChartFrame.tsx
    - src/components/product/primitives/FlowNode.tsx
    - src/components/product/primitives/FlowEdge.tsx
  modified:
    - src/components/product/primitives/index.ts

key-decisions:
  - "Trailing count delegates to AnimatedNumber (the barrel's count-up); the plan's 'LiveValue' refers to this existing export, not a new one"
  - "FlowEdge animates strokeDashoffset (not pathLength) for a repeating travelling-dash; the AreaLine pathLength model is the compositor-safe precedent"
  - "ChartFrame's role=img sits on a wrapper div around the (aria-hidden) chart SVG, giving the decorative chart a single text alternative"
  - "FlowNode/FlowEdge default to decorative (aria-hidden); a label promotes them to role=img"

patterns-established:
  - "Status-by-API: WorklistRow lead/tag and FlowNode/FlowEdge labels carry text with their tone, making a color-only state impossible to construct"
  - "Tokens-only atoms: var(--primary)/var(--status-*)/var(--product-text*) and color-mix tints; no hex literals in the new atoms"

requirements-completed: [FND-04]

# Metrics
duration: ~20min
completed: 2026-06-05
---

# Phase 10 Plan 03: Extended primitive atoms (Console + Data-story + Schematic) Summary

**Four new token-driven, compositor-only-animated, label-paired atoms (WorklistRow, ChartFrame, FlowNode, FlowEdge) extend parts.tsx so the Phase 10-05 archetypes compose atoms with zero per-page styling.**

## Performance

- **Duration:** ~20 min
- **Completed:** 2026-06-05T13:11:52Z
- **Tasks:** 2
- **Files created:** 4
- **Files modified:** 1

## Accomplishments

- `WorklistRow` generalizes the inline `grid-cols-[1.1fr_2fr_0.6fr]` row from PlacementMatrix into a reusable console-row atom. It delegates the middle bar to `SegmentedBar` (multi-segment, clipPath) or `ValueBar` (single, scaleX) by segment count, delegates the trailing count to the motion barrel's `AnimatedNumber`, and pairs every status with a label via `Tag`/`TypeChip`.
- `ChartFrame` wraps a chart atom (AreaLine/Sparkline/bars) with a caption slot, an optional `{value, caption}` annotation, and a **required** `ariaSummary` that drives `role="img"` + `aria-label` on the chart region, giving the otherwise `aria-hidden` SVG a text alternative.
- `FlowNode` + `FlowEdge` provide provisional schematic atoms: a kind-toned node group and an SVG `<path>` edge whose `flow` overlay animates `strokeDashoffset` (compositor-safe) and falls back to a static path under reduced motion. Neither imports GSAP.
- The primitives barrel now exports all four new atoms alongside the existing set.

## Task Commits

1. **Task 1: WorklistRow + ChartFrame atoms** - `4b0890b` (feat)
2. **Task 2: FlowNode + FlowEdge provisional atoms + primitives index** - `3b35c89` (feat)

## Files Created/Modified

- `src/components/product/primitives/WorklistRow.tsx` - Console row atom; delegates bars to parts.tsx and count to AnimatedNumber; label-paired status.
- `src/components/product/primitives/ChartFrame.tsx` - Data-story chart container; caption + annotation slots; required ariaSummary -> role=img + aria-label.
- `src/components/product/primitives/FlowNode.tsx` - Provisional schematic node group; kind-driven tone; role=img / aria-hidden.
- `src/components/product/primitives/FlowEdge.tsx` - Provisional schematic edge; strokeDashoffset flow overlay; reduced-motion static fallback; no GSAP.
- `src/components/product/primitives/index.ts` - Exports the four new atoms.

## Decisions Made

- The plan's reference to a "LiveValue" count-up resolves to the existing `AnimatedNumber` export in `src/components/product/motion.tsx`; WorklistRow's trailing count delegates to it rather than re-implementing a counter.
- FlowEdge uses `strokeDashoffset` (repeating travelling dash) over a one-shot `pathLength` draw; both are compositor-safe, but a continuous dash reads as "data flowing" for a schematic, matching the §6 intent. The base edge always renders; the animated dash is an overlay so reduced-motion simply omits the overlay.
- FlowNode/FlowEdge are decorative (`aria-hidden`) by default and only become meaningful (`role="img"` + `aria-label`) when given a label/sub, keeping diagram scaffolding out of the a11y tree.

## Deviations from Plan

None - plan executed exactly as written. All acceptance grep guards passed (no width/height/top animation, no hardcoded hex in the new atoms, ariaSummary + role=img present, PROVISIONAL markers referencing Phase 11, no GSAP import, all four atoms exported).

## Issues Encountered

- **Worktree base reset side effect:** the mandated `git reset --soft 22f4963` (to correct the worktree base off d09f095) staged the diff of other agents' later commits as deletions. The first Task 1 commit accidentally captured those reverts. Resolved by `git reset --soft HEAD~1` + unstaging, then committing only the explicit plan files. Both task commits contain exclusively this plan's files (verified via `git show --stat`); no unrelated files were touched.

## Verification

- `npx tsc --noEmit`: zero errors in the five plan files. (One pre-existing, out-of-scope error remains in `tests/responsive/reduced-motion.spec.ts`, already logged in the phase deferred-items.md per STATE.md; not introduced here.)
- `npx eslint src/components/product/primitives/`: exit 0.
- All Task 1 and Task 2 grep acceptance guards pass.

## Next Phase Readiness

- The four atoms are ready for the Phase 10-05 archetype layer (Console / Data-story / Schematic) to compose.
- FlowNode/FlowEdge are explicitly PROVISIONAL (A2): harden their shape in Phase 11 against `PlatformSystemMap.tsx` + real "how it works" data before locking the API.
- Runtime a11y (axe-core) and visual verification land when Phase 11/12 consumers render these atoms on real routes; no route consumes them yet.

## Self-Check: PASSED

- All 5 plan files present on disk (4 created atoms + updated index).
- Both task commits (`4b0890b`, `3b35c89`) present in git history.

---
*Phase: 10-foundation*
*Completed: 2026-06-05*
