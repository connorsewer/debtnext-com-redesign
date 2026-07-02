---
phase: 14-text-only-page-elevation
plan: 02
subsystem: ui
tags: [accessibility, aria, forms, react-hook-form, focus-ring, design-system, playwright]

# Dependency graph
requires:
  - phase: 03-demo-form
    provides: DemoForm with Field/inputClasses and the per-field <p id="{id}-error" role="alert"> region
  - phase: 01-foundation
    provides: AttachedForm pill component and DESIGN.md §8.3 shadows.focus token
provides:
  - "DemoForm errored fields expose aria-invalid + aria-describedby pointing at the on-page error message (P14-01)"
  - "AttachedForm email input carries the §8.3 3px #9CB4E8 focus ring, matching DemoForm (P14-02)"
  - "DESIGN.md §8.3 documents the 3px input focus ring as the intentional, sanctioned input pattern"
  - "tests/a11y/demoform-aria.spec.ts asserting the P14-01 attributes and the honeypot guard"
affects: [phase-14 verifier, phase-15 homepage-hero, demo-form-a11y]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "inputClasses(error, id) returns className + aria-invalid + aria-describedby (undefined when no error) so all fields are fixed in one edit and the honeypot (which does not call inputClasses) is provably untouched"
    - "Input focus ring documented as an intentional §8.3 pattern distinct from the §8 2px offset outline for buttons/links/tabs"

key-files:
  created:
    - tests/a11y/demoform-aria.spec.ts
  modified:
    - src/components/forms/DemoForm.tsx
    - src/components/ui/AttachedForm.tsx
    - DESIGN.md

key-decisions:
  - "P14-02 resolved as document-not-normalize: the 3px #9CB4E8 input ring is on-spec per the shadows.focus token; normalizing to the general 2px outline would regress the AttachedForm pill aesthetic"
  - "Extended inputClasses rather than editing each field's JSX, so the honeypot (register-only) cannot receive aria wiring by construction"

patterns-established:
  - "Aria wiring flows through the shared inputClasses helper keyed to the field id, matching the existing {id}-error message id"

requirements-completed: [PAGEVIS-04]

# Metrics
duration: ~20min impl (52min wall, most of it eslint waits under sibling-agent contention)
completed: 2026-07-01
---

# Phase 14 Plan 02: Form a11y folded audit items (P14-01 + P14-02) Summary

**DemoForm errored fields now announce as invalid to screen readers via aria-invalid + aria-describedby, and the AttachedForm email input picks up the sanctioned §8.3 3px #9CB4E8 focus ring, now documented in DESIGN.md as intentional.**

## Performance

- **Duration:** ~20 min implementation (52 min wall clock; the extra time was repeated `npx eslint`/`tsc` runs blocking on a parallel worktree agent contending for the same node toolchain)
- **Started:** 2026-07-01T20:32:59Z
- **Completed:** 2026-07-01T21:25:01Z
- **Tasks:** 2
- **Files modified:** 4 (1 created, 3 modified)

## Accomplishments
- P14-01: `inputClasses` extended to `inputClasses(error: unknown, id: string)` returning `aria-invalid` + `aria-describedby="{id}-error"` (both `undefined` when there is no error), pointing at the already-rendered `<p id="{id}-error" role="alert">` in `Field`. Threaded the id through all real-field call sites.
- P14-01: new `tests/a11y/demoform-aria.spec.ts` (4 tests) asserting the aria wiring on errored fields, the honeypot's absence of aria attributes, and that an error-free optional field stays clean.
- P14-02: `AttachedForm` email input gained `focus:ring-3 focus:ring-[var(--focus)]/35`, matching the DemoForm inputs; all pill radius / border / `@sm/form:` classes left exact.
- P14-02: DESIGN.md §8.3 "Input states" documents the 3px `#9CB4E8` ring as the intentional input focus pattern, citing the `shadows.focus` token (`0 0 0 3px rgba(156, 180, 232, 0.35)`, line 133), distinct from the §8 2px offset outline for buttons/links/tabs. Landed in the same commit as the AttachedForm change (docs-in-sync rule).

## Exact inputClasses change

Signature changed from `function inputClasses(error: unknown)` to `function inputClasses(error: unknown, id: string)`. The returned object keeps the existing `className` (including the pre-existing `focus:ring-3 focus:ring-[var(--focus)]/35`, unchanged) and adds:

```
"aria-invalid": error ? true : undefined,
"aria-describedby": error ? `${id}-error` : undefined,
```

## Fields threaded

All 8 real fields were switched to the two-arg form with the id string matching each element's existing `id=` attribute:
`firstName`, `lastName`, `workEmail`, `company`, `jobTitle` (5 inputs), `industry`, `portfolioSize` (2 selects), `whatToSee` (1 textarea).

Note: the plan text referred to "9 fields" in a couple of places, but the DemoForm interface list and the actual call sites enumerate exactly 8 real fields (5 inputs + 2 selects + 1 textarea). All 8 are threaded; `grep` confirms no call site still uses the one-arg form.

## Honeypot + firewall confirmation
- **Honeypot untouched:** the `websiteUrl` input still uses `{...register("websiteUrl")}` only, with no `inputClasses`, no `aria-invalid`, and no `aria-describedby`. Verified by grep (`HONEYPOT_CLEAN`) and asserted in the spec.
- **HomepageHero.tsx untouched:** `git diff --name-only 69ed004..HEAD` lists only DemoForm.tsx, AttachedForm.tsx, DESIGN.md, and the new spec. The firewall file is not in the diff (`FIREWALL_CLEAN`).

## Task Commits

1. **Task 1: P14-01 aria wiring + spec** - `59d3b0a` (feat)
2. **Task 2: P14-02 AttachedForm ring + DESIGN.md note** - `c9eccb6` (feat)

_Task 1 combined the RED spec and GREEN implementation in one commit: the sandbox cannot run `next dev`/`next start` (D-07), so the RED/GREEN separation could not be enforced by a live server run; the spec was authored first, then the implementation._

## Files Created/Modified
- `tests/a11y/demoform-aria.spec.ts` - Playwright a11y spec: errored fields expose aria-invalid + aria-describedby, honeypot has neither, error-free field stays clean
- `src/components/forms/DemoForm.tsx` - `inputClasses(error, id)` returns aria attributes; 8 call sites threaded with their id
- `src/components/ui/AttachedForm.tsx` - email input gains the §8.3 3px --focus ring
- `DESIGN.md` - §8.3 note documenting the input focus ring as intentional, citing shadows.focus

## Decisions Made
- P14-02 was resolved as document-not-normalize (per UI-SPEC + RESEARCH): the ring is on-spec for inputs via the `shadows.focus` token, and normalizing to the general 2px outline would regress the AttachedForm pill look.
- Extended the shared `inputClasses` helper instead of editing each field's JSX, which both minimizes the edit and structurally guarantees the honeypot cannot receive aria wiring.

## Deviations from Plan
None - plan executed exactly as written. (The "9 fields" wording in the plan is a miscount, not a scope change; there are 8 real fields and all are threaded. No code or behavior differs from the plan's intent.)

## Issues Encountered
- `npx eslint` and `npx tsc` runs were very slow and repeatedly auto-backgrounded because a sibling worktree agent was contending for the same node/eslint toolchain. Resolved by waiting on the specific process to exit and reading its output file. Final results: `tsc --noEmit` reports 0 errors project-wide; `eslint` exits 0 on all three touched files.
- `.eslintcache` was generated by the `--cache` verification runs; removed before each commit so it was never staged.
- macOS has no `timeout` binary (one verification attempt hit `command not found: timeout`, exit 127); re-ran without it.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- P14-01 and P14-02 are landed and independent; they gate nothing else in the phase and ran in Wave 1 parallel with the map plan (14-01).
- CI on the PR provides the live-server truth (D-07): `demoform-aria.spec.ts` should pass against the preview and `axe-routes.spec.ts` should stay green on `/demo`.
- HomepageHero.tsx remains a Phase-13/15 firewall file, untouched here.

## Self-Check: PASSED
- `tests/a11y/demoform-aria.spec.ts` — FOUND
- `src/components/forms/DemoForm.tsx` aria-describedby — FOUND
- `src/components/ui/AttachedForm.tsx` focus ring — FOUND
- DESIGN.md shadows.focus note — FOUND
- Commit `59d3b0a` — FOUND
- Commit `c9eccb6` — FOUND
- HomepageHero.tsx in diff — NOT PRESENT (correct; firewall clean)

---
*Phase: 14-text-only-page-elevation*
*Completed: 2026-07-01*
