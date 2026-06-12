# Deferred items — Phase 05.3 (close-lhci-gate-via-lazy-gsap)

Out-of-scope discoveries logged during execution. NOT fixed by this plan.

## Pre-existing tsc error in tests/responsive/reduced-motion.spec.ts

- **Discovered during:** Plan 01, Task 1 verification (`npx tsc --noEmit`).
- **Error:** `tests/responsive/reduced-motion.spec.ts(6,3): error TS2353: Object literal may only specify known properties, and 'reducedMotion' does not exist in type 'Fixtures<...>'.`
- **Status:** Pre-existing. The file is unmodified by this plan (`git status` clean for it; last touched in commit b155b13 "M4: Mobile responsive rebuild"). The `reducedMotion` test fixture option was valid in an earlier `@playwright/test` typings version and the installed version no longer types it on the `test.use(...)` object literal.
- **Impact on this plan:** `npx tsc --noEmit` returns a non-zero exit solely because of this one error. NO error references HeroCinematicController.tsx, HomepageHero.tsx, or HomepageHandoffSection.tsx — the files this plan creates/modifies typecheck clean.
- **Decision:** Out of scope per the executor SCOPE BOUNDARY rule (only auto-fix issues directly caused by the current task's changes). Not fixed. Should be addressed in a separate Playwright-typings maintenance task.
- **RESOLVED (2026-06-12 audit):** the spec was rewritten to use page-level `emulateMedia`; `npx tsc --noEmit` exits 0. Closed by the FIX-09 audit pass.
