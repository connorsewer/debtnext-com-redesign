---
status: fixing
trigger: "Fix the 5 CI test failures on PR #12 (phase-13-visual-system-consolidation) — flawed test assertions + flaky reveal timing, not app regressions."
created: 2026-06-13T00:00:00Z
updated: 2026-06-13T00:00:00Z
---

## Current Focus

hypothesis: All 5 are test-side defects (firewall byte-equality proves app behavior unchanged).
test: Fix specs to assert true D-07 intent + robustly settle GSAP/reveal timing.
expecting: tsc/eslint/build clean; CI green on re-run.
next_action: edit the 3 spec files, validate, commit.

## Symptoms

expected: CI green on PR #12.
actual: 285 passed, 5 failed (run 27465269479).
errors: |
  - handoff-pin-anchored:51 expect |midY|<=2 got 948 (varies: 1466 earlier)
  - handoff-dashboard-static:62 expect |after.y-before.y|<=1 got 488 (x passed)
  - solutions-visuals:205 "text stuck below opacity:1 after interaction": offender DIV opacity 0; non-deterministic page set (fintech+telecom this run, utilities+fintech earlier)
reproduction: CI Playwright run on 1440 desktop (cinematic on).
started: phase-13 visual-system-consolidation specs (2 authored blind in sandbox).

## Eliminated

- hypothesis: real homepage regression in pin/frame
  evidence: git diff ab0ad77 HEAD on HomepageHero.tsx + HomepageHandoffSection.tsx is EMPTY (byte-identical). Console.tsx diff is purely additive (bare branch new; default framed path logically unchanged).
  timestamp: 2026-06-13

## Evidence

- checked: firewall diffs
  found: Hero/Handoff empty; Console additive-only
  implication: no app regression; all 5 are test defects
- checked: pin spec measurement
  found: measures midY right after networkidle + waitForTimeout(250); section is opacity:0 until GSAP fades in and GSAP rewrites scroll geometry AFTER networkidle. Received varied 948/1466 = layout not settled.
  implication: spec must wait for GSAP init (section opacity>0) before measuring
- checked: dashboard-static spec
  found: asserts TOP y stable across a tab ADVANCE; frame is center-anchored (-translate-y-1/2) so different tab content heights legitimately move the TOP edge. x passed (centered horizontally). got 488.
  implication: wrong assertion. True D-07 intent = CENTER stays fixed. Assert rect.y+height/2 stable, not rect.y.
- checked: solutions assertNoStuckOpacity
  found: offender DIV at opacity 0; getAnimations() wait returns early when a Framer whileInView reveal is parked at hidden (no running animation) -> false pass-through then sample at 0. Flaky page set = reveal-into-view timing.
  implication: surface in-view reveals (scroll) + poll until opacity stabilizes, mirroring reduced-motion.spec settle idiom

## Resolution

root_cause: |
  F1 pin: measures sticky y before GSAP settles the cinematic layout.
  F2 static: asserts top-edge y (moves legitimately on center-anchored frame) instead of center y.
  F3-5 opacity: getAnimations wait doesn't cover not-yet-triggered Framer whileInView reveals; needs scroll-to-surface + opacity-stabilize poll.
fix: |
  F1: gate measurement on section computed-opacity>0.99 (GSAP fade-in done) + 250ms ScrollTrigger settle.
  F2: assert frame CENTER (rect.x+w/2, rect.y+h/2) stable instead of top-edge rect.y.
  F3-5: scroll bottom->top to surface whileInView reveals, then getAnimations-finished + 500ms stabilize before sampling opacity.
verification: tsc clean, eslint clean, playwright --list enumerates all 10 tests. CI re-run pending (orchestrator pushes).
files_changed:
  - tests/responsive/handoff-pin-anchored.spec.ts
  - tests/responsive/handoff-dashboard-static.spec.ts
  - tests/responsive/solutions-visuals.spec.ts
