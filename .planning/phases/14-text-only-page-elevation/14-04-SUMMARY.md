---
phase: 14-text-only-page-elevation
plan: 04
subsystem: ui
tags: [ambient-field, framer-motion, reduced-motion, reveal-section, restraint, coi]

# Dependency graph
requires:
  - phase: 14-text-only-page-elevation (plan 14-01)
    provides: approved 14-ARCHETYPE-MAP.md (the no-lift calls this plan makes auditable) + gating spec wiring
provides:
  - Restrained AmbientField on the /demo hero band (single deliberate field, ambient={false} on the SectionContainer default)
  - 14-MOTION-CONFIRM.md — per-route reveal-coverage verification + recorded no-lift decisions for the /company set + /resources (PAGEVIS-03 evidence)
  - TSI/COI non-obstruction check + Pitfall-3 guard on the record
affects: [15-homepage-hero, gsd-verify-work, phase-14 PR assembly]

# Tech tracking
tech-stack:
  added: []
  patterns: ["Explicit single AmbientField with SectionContainer ambient={false} when a hero needs a deliberately-authored field (avoids double-stacking with the container's default ambient+CursorGlow)", "No-lift decisions recorded per route in a MOTION-CONFIRM evidence doc, closed by confirmation not omission"]

key-files:
  created:
    - .planning/phases/14-text-only-page-elevation/14-MOTION-CONFIRM.md
  modified:
    - src/app/demo/page.tsx

key-decisions:
  - "Set ambient={false} on the /demo hero SectionContainer and authored ONE explicit AmbientField instead of adding a second field on top of the container's auto-injected ambient+CursorGlow pair (Pitfall 5 / T-14-14 restraint)"
  - "Zero code edits to company/page.tsx and resources/page.tsx: the approved map recorded nothing-new for both; recorded in 14-MOTION-CONFIRM.md as deliberate no-lift"
  - "CaseStudyBand recorded honestly as static (no framer self-animation) but left unwrapped per the approved map; flagged as a clean single-wrap candidate for a future phase"

patterns-established:
  - "MOTION-CONFIRM evidence doc: per-route table (section components / ambient substrate / page-level RevealSection / decision / rationale) so restraint is auditable"

requirements-completed: [PAGEVIS-03, PAGEVIS-04]

# Metrics
duration: ~25min
completed: 2026-07-01
---

# Phase 14 Plan 04: Restraint pass (demo Ambient + motion-confirm evidence) Summary

**Single restrained AmbientField behind the /demo hero (reduced-motion static bloom, never above the submit CTA) plus 14-MOTION-CONFIRM.md closing PAGEVIS-03 by verified confirmation of existing reveal coverage across the /company set + /resources**

## Performance

- **Duration:** ~25 min
- **Completed:** 2026-07-01
- **Tasks:** 3/3 (2 auto + 1 blocking human-verify gate, approved)
- **Files modified:** 2 (1 created, 1 modified)

## Accomplishments

- **/demo Ambient (PAGEVIS-04, demo half):** one deliberately-authored `AmbientField` (particleCount 5, bloom, seeded, aria-hidden) behind the hero band content in a `relative z-10` wrapper. Form band + CardGrid band untouched; no archetype (D-01d); submit CTA remains the single filled CTA in its band (D-03).
- **PAGEVIS-03 closed by confirmation:** `14-MOTION-CONFIRM.md` records, per route (/company hub, /about, /leadership, /careers, /contact, /resources), which components self-animate (CardGrid/ProofBand/BulletList/LeadershipTable via product/motion, verified by grep), the SectionContainer ambient substrate, existing RevealSection counts (about ×1 wrapping the TSI/COI block, leadership ×2, careers ×1, contact ×1), and an explicit Decision + Rationale for each no-lift call.
- **TSI/COI non-obstruction (D-01e/§6):** confirmed on the record — the ownership disclosure on /company and /company/about is never buried or reframed by motion; the about-page reveal is fail-open under reduced motion; no new copy authored.
- **Pitfall-3 guard:** zero double-wrapped self-animating sections; zero RevealSection wraps added (company/page.tsx and resources/page.tsx unchanged, as the approved map called for).

## Task Commits

Each task was committed atomically:

1. **Task 1: Restrained AmbientField on /demo hero band** - `a060e0e` (feat)
2. **Task 2: 14-MOTION-CONFIRM.md reveal-coverage evidence** - `b333450` (docs)
3. **Task 3: Phase verification gate** - approved (auto-approved per the active --auto chain; CI/preview items carried to the phase-boundary HUMAN-UAT list)

## Files Created/Modified

- `src/app/demo/page.tsx` - Hero band now hosts a single explicit AmbientField (`ambient={false}` on the SectionContainer, `relative isolate overflow-hidden` on the band, content in `relative z-10`)
- `.planning/phases/14-text-only-page-elevation/14-MOTION-CONFIRM.md` - PAGEVIS-03 evidence: per-route reveal-coverage table, ambient-substrate note, TSI/COI non-obstruction check, Pitfall-3 guard, code-edit summary

## Decisions Made

- **ambient={false} + one explicit field on the /demo hero:** SectionContainer auto-injects AmbientField + CursorGlow on every dark band by default. The plan intent (a restrained, deliberate hero ambient) is delivered as exactly one field, not two stacked layers.
- **No page-level RevealSection wraps:** the approved 14-ARCHETYPE-MAP.md recorded "nothing new" for /company hub and /resources; both files are byte-identical to base.
- **CaseStudyBand honesty note:** it does NOT self-animate (no framer import, verified). Recorded as-is in the confirm doc rather than claiming coverage it lacks; it rides the ambient substrate and sits between animating bands, and the no-archetype call stands per the map.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug prevention] Avoided double-stacked ambient on the /demo hero**
- **Found during:** Task 1 (AmbientField placement)
- **Issue:** The plan's interfaces block assumed the hero SectionContainer was a bare Ambient host. In reality `SectionContainer` auto-injects `AmbientField` + `CursorGlow` behind every dark/elevated-dark band (`showAmbient = surface !== "light"`), with content already lifted to `relative z-10`. Following the plan literally would have rendered TWO ambient fields plus a glow on the hero — a restraint/perf regression (T-14-14, Pitfall 5).
- **Fix:** Set `ambient={false}` on the hero SectionContainer and authored one explicit `AmbientField particleCount={5} bloom` as the deliberate hero field, carrying the container's `relative isolate overflow-hidden` classes onto the band.
- **Files modified:** src/app/demo/page.tsx
- **Verification:** `npx tsc --noEmit` clean, `npx eslint src/app/demo/page.tsx` exit 0, plan's Task 1 grep verify passes (import + usage + `relative z-10`)
- **Committed in:** `a060e0e` (Task 1 commit)
- **Coordinator status:** deviation reviewed and accepted at the Task 3 gate.

**2. [Rule 2 - Accuracy of evidence] CaseStudyBand recorded as static, not self-animating**
- **Found during:** Task 2 (reveal-coverage verification)
- **Issue:** The plan's context stated /resources section components (including CaseStudyBand) "already self-animate via product/motion". Grep verified CaseStudyBand has NO framer/product-motion import; only CardGrid animates on that page.
- **Fix:** The confirm doc records the true state (CardGrid animates; CaseStudyBand static but riding the ambient substrate) and keeps the approved map's nothing-new call, noting CaseStudyBand as a clean future single-wrap candidate. No code change (the map governs).
- **Files modified:** .planning/phases/14-text-only-page-elevation/14-MOTION-CONFIRM.md
- **Verification:** grep of CaseStudyBand.tsx (no motion imports); Task 2 automated verify passes
- **Committed in:** `b333450` (Task 2 commit)

---

**Total deviations:** 2 auto-fixed (1 bug-prevention, 1 evidence-accuracy)
**Impact on plan:** Both preserve the plan's intent (restraint, auditable truth). No scope creep; company/resources pages untouched.

## Issues Encountered

- Worktree base mismatch at start: branch was at `ab0ad77` instead of the expected Wave-1 base `f0189db` (which is a descendant). Reset the worktree to `f0189db` (clean tree confirmed) before executing.

## Deferred to CI / preview (phase-boundary HUMAN-UAT list)

The Task 3 gate was auto-approved per the active --auto chain; these verification items carry to CI on the PR + the Vercel preview for Connor:

1. Full Playwright suite green: `14-page-elevation.spec.ts`, `demoform-aria.spec.ts`, `reduced-motion.spec.ts` + `reveal-fail-open.spec.ts` (all 9 targets via VISUAL_ROUTES; /demo iterated, verified locally via `--list`: 57 tests parse, /demo ×3), `axe-routes.spec.ts` + `touch-targets.spec.ts` (23 routes), all pre-existing specs.
2. LHCI on representative routes: LCP < 2.5s, CLS < 0.1, INP < 200ms, content-route TBT ≤ 300ms (~290ms runs are runner noise per BL-07).
3. Preview visual checks: archetype resolved heights ≤ skeleton boxes (no CLS jump); /demo Ambient restrained, never out-shouting the form submit CTA; /compare visual not duplicating CompareMatrix; TSI/COI sections unobscured.
4. Governance: `[CLAIMS REVIEW]` + `[COI REVIEW]` flagged in the PR body; /compare comparative claims routed to the legal gate (punch-list #4) before merge.

## Known Stubs

None — no placeholder data, empty-value props, or unwired components introduced.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- PAGEVIS-03 closed by confirmation (evidence artifact on disk); PAGEVIS-04's /demo half done (the archetype half lands via 14-03 in this wave).
- Phase 14 can proceed to /gsd-verify-work once the wave's sibling plans (14-03) merge and the CI/preview items above are green on the PR.

## Self-Check: PASSED

- FOUND: .planning/phases/14-text-only-page-elevation/14-MOTION-CONFIRM.md
- FOUND: src/app/demo/page.tsx (modified)
- FOUND: commit a060e0e (Task 1)
- FOUND: commit b333450 (Task 2)
- CONFIRMED: company/page.tsx + resources/page.tsx unchanged

---
*Phase: 14-text-only-page-elevation*
*Completed: 2026-07-01*
