---
status: partial
phase: 12-solutions-per-industry-visuals
source: [12-VERIFICATION.md]
started: "2026-06-12T19:30:00Z"
updated: "2026-06-12T19:30:00Z"
---

## Current Test

[awaiting human/CI testing on the Phase 12 PR preview]

## Tests

### 1. Playwright solutions-visuals spec green on CI/preview
expected: tests/responsive/solutions-visuals.spec.ts passes on all 6 industry routes + hub (archetype presence, per-route industryUniqueStrings, cross-route distinctness, reduced-motion data parity, no stuck opacity).
result: [pending]

### 2. Accordion visuals render real archetypes (role="img")
expected: Opening each accordion item on each industry page shows role="img" with a non-empty industry-specific aria-label (not the old homepage registry fallback).
result: [pending]

### 3. No CLS on hero band load
expected: No layout shift on the Console hero band (min-h-[34rem] box) across all 6 pages; LHCI CLS < 0.1 on /solutions/utilities.
result: [pending]

### 4. Cross-page visual distinctness (Connor)
expected: Comparing all 6 industry pages, row nouns / chart kinds / Schematic source nodes visibly differ — especially utilities (spark, Billing/CIS) vs insurance (bars, policy admin) vs healthcare (area, EHR/clearinghouse).
result: [pending]

## Summary

total: 4
passed: 0
issues: 0
pending: 4
skipped: 0
blocked: 0

## Gaps

Advisory review findings (non-blocking, from 12-REVIEW.md): WR-01 type the FeatureAccordion visuals keys against content item ids; IN-01 ariaSummary min-length; IN-02 document case-insensitive uniqueness matching. WR-02 disproven (hub repoint confirmed at src/app/solutions/page.tsx:51).
