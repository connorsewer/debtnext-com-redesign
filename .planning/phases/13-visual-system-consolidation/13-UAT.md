---
status: testing
phase: 13-visual-system-consolidation
source:
  - 13-01-SUMMARY.md
  - 13-02-SUMMARY.md
  - 13-03-SUMMARY.md
  - 13-04-SUMMARY.md
  - 13-05-SUMMARY.md
  - 13-VERIFICATION.md
started: 2026-06-13
updated: 2026-06-13
note: |
  Human preview checklist for Connor. The sandbox cannot run next dev/start, so
  every test below is verified on the Vercel preview for PR #12. Automated gates
  (axe a11y, LHCI perf, firewall byte-diff, tsc/eslint/build, goal-backward
  verification 12/12) are already green/PASS — see 13-VERIFICATION.md. What
  remains is the cinematic-feel and taste judgment that only a human at the
  preview can confirm.
---

## Current Test

number: 1
name: Handoff cinematic parity (desktop >=1440)
expected: |
  Scroll the homepage past the hero into the pinned handoff. The FramedDashboard
  stays viewport-centered across the hero->Platform seam; the bezel does not
  jump; as the 4 tabs advance (placement -> performance -> issues -> reporting)
  only the dashboard CONTENT crossfades, the frame itself does not move. Feel is
  identical to pre-Phase-13.
awaiting: user response

## Tests

### 1. Handoff cinematic parity (desktop >=1440)
expected: GSAP pin anchored; FramedDashboard bezel viewport-centered across the hero->Platform seam; dashboard frame static while the 4 tab contents crossfade. Identical to pre-Phase-13 behavior.
result: [pending]

### 2. Four handoff tabs render as Console at parity
expected: placement / performance / issues / reporting each render a bare Console dashboard inside the same bezel, with real-shaped data, correct chrome title per tab, and no off-brand colors. No blank/clipped tab.
result: [pending]

### 3. Reporting tab trend-story strength (taste call)
expected: The reporting tab (Console-with-KPIs) tells the liquidation-trend story convincingly. If it reads weak, the documented fallback is the DataStory exception (needs your approval; not taken this phase).
result: [pending]

### 4. FeatureAccordion live Flagship visuals
expected: The homepage capability accordion shows the live Phase 11 Flagship visual paired with each active item (placement/optimization/issues/reporting/compliance). The compliance visual is announced to screen readers with a name (a11y fix this run). Switching items crossfades the paired visual.
result: [pending]

### 5. Reduced-motion final state
expected: With prefers-reduced-motion on (OS setting), open accordion items and scroll the handoff: no in-viewport visual is stuck faded (opacity < 1); all content is readable at rest.
result: [pending]

### 6. Mobile handoff stacked layout
expected: On a phone-width preview, the handoff Console visuals stack and read cleanly; muted row text is legible against the card surface (contrast fix this run); no horizontal overflow.
result: [pending]

## Summary

total: 6
passed: 0
issues: 0
pending: 6
skipped: 0

## Gaps

[none — automated verification PASS 12/12; this list is human-preview only]
