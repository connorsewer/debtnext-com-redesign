# Phase 10 — Deferred / out-of-scope items

Items discovered during execution that are NOT caused by the current plan's
changes. Tracked here, not fixed inline (scope-boundary rule).

## Pre-existing tsc error (carried from Phase 5.3)

- **File:** `tests/responsive/reduced-motion.spec.ts:6`
- **Error:** `TS2353: Object literal may only specify known properties, and 'reducedMotion' does not exist in type 'Fixtures<...>'`
- **Status:** Pre-existing on the plan base commit `22f49631` (reproduced via `git show 22f49631:tests/responsive/reduced-motion.spec.ts`). Not introduced by plan 10-02; same item logged in Phase 5.3 (STATE.md, 2026-06-05). Out of scope for the motion barrel migration.
