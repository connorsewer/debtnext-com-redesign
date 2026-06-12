# Phase 5 — Deferred items

Out-of-scope issues discovered during Plan 01 execution. NOT fixed here per
scope boundary rules.

## Pre-existing TypeScript error in tests/responsive/reduced-motion.spec.ts

- **File:** `tests/responsive/reduced-motion.spec.ts:6`
- **Error:** `TS2353: Object literal may only specify known properties, and 'reducedMotion' does not exist in type 'Fixtures<{}, {}, PlaywrightTestArgs & PlaywrightTestOptions, PlaywrightWorkerArgs & PlaywrightWorkerOptions>'.`
- **Discovered:** Plan 01 Task 6 (`npx tsc --noEmit`).
- **Cause:** Pre-existing. Verified by stashing the Plan 01 Task 6 work and re-running tsc, which still fails with the same error. Not introduced by Phase 5 Wave 0 changes.
- **Scope:** Out of scope for Plan 01. Likely a Playwright `@playwright/test` 1.60 type-shape change that the spec was authored against an earlier version.
- **Recommendation:** Tracked here so it isn't lost. A future M5 phase or a maintenance pass should fix the `reducedMotion` fixture wiring in the spec.
- **RESOLVED (2026-06-12 audit):** the spec was rewritten to use page-level `emulateMedia` instead of the `test.use()` fixture; `npx tsc --noEmit` exits 0. Closed by the FIX-09 audit pass.
