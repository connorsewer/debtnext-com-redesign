---
status: partial
phase: 14-text-only-page-elevation
source: [14-VERIFICATION.md]
started: 2026-07-01T21:30:00Z
updated: 2026-07-01T21:30:00Z
---

## Current Test

[awaiting human testing]

## Tests

### 1. Full Playwright suite green in CI against the Vercel preview
expected: All 295 tests pass (17 files), including the new `tests/responsive/14-page-elevation.spec.ts` (3 tests: /platform/integrations Schematic strings, /compare DataStory strings, /demo reveal-only + submit CTA — each on load AND under reduced motion) and `tests/a11y/demoform-aria.spec.ts` (4 tests: aria-invalid + aria-describedby on errored fields, absent when clean, honeypot unwired). Pre-existing specs stay green.
result: [pending]

### 2. LHCI budgets on the elevated routes
expected: LCP < 2.5s, CLS < 0.1, INP < 200ms on /compare, /platform/integrations, /demo; content-route TBT ≤ 300ms (a ~290ms run is runner noise per BL-07 — regression detector, not a hard fail).
result: [pending]

### 3. CLS resolved-height check on the two new archetypes (Vercel preview)
expected: On /platform/integrations and /compare, each archetype's resolved height ≤ its reserved skeleton box (default min-h-[20rem]) with no visible layout shift on load. Flagged unmeasured-in-sandbox by 14-03-SUMMARY.
result: [pending]

### 4. Visual/UX sign-off + /compare legal gate
expected: Connor: the /compare DataStory advances time-to-production without duplicating the CompareMatrix; the /platform/integrations Schematic reads as a system map consistent with PlatformSystemMap; /demo ambient never out-shouts the submit CTA; TSI/COI sections on /company + /about stay unobscured; archetype map no-lift calls look right (.planning/phases/14-text-only-page-elevation/14-ARCHETYPE-MAP.md). Andrew (+legal): the /compare comparative time-to-production claim clears the legal gate (punch-list #4) before merge; [CLAIMS REVIEW]/[COI REVIEW] tags flagged in the PR body.
result: [pending]

## Summary

total: 4
passed: 0
issues: 0
pending: 4
skipped: 0
blocked: 0

## Gaps
