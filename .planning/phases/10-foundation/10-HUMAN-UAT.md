---
status: partial
phase: 10-foundation
source: [10-VERIFICATION.md]
started: 2026-06-05
updated: 2026-06-05
---

## Current Test

[awaiting human testing — all items require a Vercel preview / green CI run; next build hangs in the local sandbox]

## Tests

### 1. Reveal fail-open runtime
expected: `reveal-fail-open.spec.ts` passes against a Vercel preview — no in-viewport node at `opacity < 1` across all 23 VISUAL_ROUTES after scroll and tab/accordion open.
result: [pending]

### 2. Reduced-motion runtime
expected: `reduced-motion.spec.ts` VISUAL_ROUTES loop passes — `opacity === 1` on revealed nodes under `prefers-reduced-motion` on all routes.
result: [pending]

### 3. Mobile GSAP-free runtime
expected: `hero-gsap-free-mobile.spec.ts` VISUAL_ROUTES loop passes — zero `/gsap/` network requests at 412x823 across all visual routes.
result: [pending]

### 4. Route-JS budget pinning
expected: first green CI build prints the real `/` First-Load-JS value; the PROVISIONAL 300 KB ceiling in `scripts/check-route-js-budget.sh` is replaced with measured value + ~10% headroom.
result: [pending]

### 5. LHCI TBT confirmation
expected: CI passes TBT ≤200ms on `/`, `/platform/placement`, `/solutions/utilities` under devtools throttling.
result: [pending]

## Summary

total: 5
passed: 0
issues: 0
pending: 5
skipped: 0
blocked: 0

## Gaps
