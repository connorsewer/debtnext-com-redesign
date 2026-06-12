---
status: partial
phase: 11-platform-deep-dive-visuals
source: [11-VERIFICATION.md]
started: "2026-06-06T15:39:20Z"
updated: "2026-06-06T15:39:20Z"
---

## Current Test

[awaiting human testing on a Vercel preview / phase PR CI run]

## Tests

### 1. Visual + parity + distinctness review
expected: On the Vercel preview, all 4 platform deep-dive pages (/platform/placement, /platform/optimization, /platform/issues, /platform/reporting) show a real archetype visual on every accordion item (zero "Visual" text placeholders). Each page's flagship is operable by mouse, keyboard, and touch. All values are visible before any hover/interaction. Under prefers-reduced-motion the same data renders with no motion (D-05 parity). No two visuals read alike (D-02 distinctness).
result: [pending]

### 2. LHCI perf gate (4 platform routes)
expected: CI/preview LHCI run (devtools throttling, median of 5) holds LCP < 2.5s, CLS < 0.1, and TBT <= 240ms on each of /platform/placement, /platform/optimization, /platform/issues, /platform/reporting. Record the per-route numbers in 11-PERF-A11Y-EVIDENCE.md.
result: [pending]

### 3. Playwright suite against preview
expected: With PLAYWRIGHT_BASE_URL set to the Vercel preview, `npx playwright test` passes platform-visuals.spec.ts, reveal-fail-open.spec.ts, reduced-motion.spec.ts, hero-gsap-free-mobile.spec.ts, and platform-mobile.spec.ts. (container-query-layouts.spec.ts:17 is a known pre-existing main failure, non-regression.)
result: [pending]

### 4. axe-core a11y on 4 platform routes
expected: The a11y.yml CI step (axe-core over the 4 platform routes) reports zero critical violations.
result: [pending]

## Summary

total: 4
passed: 0
issues: 0
pending: 4
skipped: 0
blocked: 0

## Gaps
