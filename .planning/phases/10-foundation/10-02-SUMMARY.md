---
phase: 10-foundation
plan: 02
subsystem: motion
tags: [motion, framer, gsap, css, a11y, perf]
requires:
  - "M5 Phase 5.3 lazy-GSAP (HeroCinematicController is the single GSAP owner)"
provides:
  - "7-type motion vocabulary barrel at src/components/motion/index.ts"
  - "Zero-edit re-export shim at src/components/product/motion.tsx"
  - "Engine-per-job rule documented in DESIGN.md §4.7"
affects:
  - "All Phase 11-15 visuals import their motion primitives from @/components/motion"
  - "The 17 existing consumers of @/components/product/motion compile unchanged through the shim"
tech-stack:
  added: []
  patterns:
    - "React 19 compound component: createContext + use(), ref as a normal prop (no forwardRef)"
    - "Reduced-motion fail-open: every reveal/live primitive renders final visible state under prefers-reduced-motion"
    - "Engine-per-job: GSAP scroll-scrub/pin only, Framer entrances/transitions, CSS hover/focus/ambient/states"
key-files:
  created:
    - src/components/motion/tokens.ts
    - src/components/motion/Reveal.tsx
    - src/components/motion/LiveValue.tsx
    - src/components/motion/PulseDot.tsx
    - src/components/motion/PulseDot.module.css
    - src/components/motion/transitions.ts
    - src/components/motion/Explorable.tsx
    - src/components/motion/Hoverable.tsx
    - src/components/motion/index.ts
  modified:
    - src/components/product/motion.tsx
    - DESIGN.md
    - .impeccable.md
decisions:
  - "GSAP is never re-exported by the motion barrel; it stays the single dynamic-import owner in HeroCinematicController so / keeps its lean eager chunk"
  - "product/motion.tsx becomes a thin re-export shim (export * from the barrel), not a codemod; import-path cleanup is deferred to a later mechanical pass"
  - "Explorable ships as a compound-component shell only; the first real explorable flagship is Phase 11 (PLATVIS-02)"
metrics:
  duration: "~25 min"
  completed: 2026-06-05
  tasks: 3
  files: 12
---

# Phase 10 Plan 02: Motion Vocabulary Barrel Summary

The single motion barrel `src/components/motion/` now exposes the full 7-type motion vocabulary, the tokens/variants/AnimatedNumber from `product/motion.tsx` moved into it, the old file is a zero-edit re-export shim keeping all 17 consumers compiling, reduced-motion fail-open is baked into the reveal/live primitives, and the engine-per-job rule is documented in DESIGN.md §4.7.

## What shipped

- **7-type vocabulary barrel** (`src/components/motion/index.ts`): RevealStagger/RevealItem (type 1 scroll reveal), LiveValue/AnimatedNumber/NumberShift + PulseDot (type 2 live data), Hoverable + CursorGlow (type 3 hover/cursor), AmbientField re-export (type 4 ambient drift), hover.module.css 7-state contract (type 5 micro-interactions), crossfade (type 6 transitions), Explorable compound shell (type 7 explorable). The barrel never imports GSAP.
- **tokens.ts**: EASE_ENTRANCE, EASE_STATE, STAGGER, DUR_ITEM, DUR_BAR, DUR_COUNT, TINT, TEXT_DEFAULT moved verbatim. Pure constants, server-safe.
- **Reveal.tsx**: variants (staggerContainer/fadeUpItem/popItem) + inViewProps moved; RevealStagger/RevealItem are named wrappers that render the "show" state under reduced motion (fail open).
- **LiveValue.tsx**: AnimatedNumber (exported also as LiveValue) + NumberShift moved verbatim; the `if (reduce) { node.textContent = format(value); return; }` fail-open path preserved.
- **PulseDot.tsx + PulseDot.module.css**: new status dot, token-driven color (`var(--primary)`, `var(--status-*)`, never hex); static dot under reduced motion (component branch + CSS media query).
- **transitions.ts**: `crossfade()` variants for AnimatePresence; instant swap when `reduced: true`.
- **Explorable.tsx**: React 19 compound-component shell (createContext + `use()`, ref as a normal prop, no forwardRef). Toggles are real keyboard-operable `<button>`s with aria-expanded/aria-controls; panels render content immediately (values visible by default, not hover-gated).
- **Hoverable.tsx**: thin named wrapper over `hover.module.css` (card/button/arrow/underline variants).
- **Shim** (`src/components/product/motion.tsx`): body replaced with `export * from "@/components/motion"`; all 17 consumers compile unchanged.
- **Docs** (DESIGN.md §4.7 + .impeccable.md principle 5): engine-per-job rule (GSAP scroll-scrub/pin only, Framer entrances/transitions, CSS hover/focus/ambient/states), the import-a-named-primitive consumer rule, and the reduced-motion fail-open contract. Voice-clean (0 em dashes, 0 "not X it's Y", 0 banned phrases). Token table + existing Motion rules list preserved.

## Tasks

| Task | Name | Commit | Files |
| ---- | ---- | ------ | ----- |
| 1 | Create barrel modules + index | eece69b | tokens.ts, Reveal.tsx, LiveValue.tsx, PulseDot.tsx, PulseDot.module.css, transitions.ts, Explorable.tsx, Hoverable.tsx, index.ts |
| 2 | Convert product/motion.tsx to re-export shim | 0edb81c | src/components/product/motion.tsx |
| 3 | Document engine-per-job in DESIGN.md §4.7 + .impeccable.md | a2bc635 | DESIGN.md, .impeccable.md |

## Verification

- `npx tsc --noEmit`: clean for all plan files. One pre-existing, out-of-scope error remains in `tests/responsive/reduced-motion.spec.ts:6` (reproduced on the plan base commit `22f49631`; carried from Phase 5.3; logged in `deferred-items.md`).
- `npx eslint src/`: 0 errors. One pre-existing warning (`IssuesWorklist.tsx` unused `AnimatedNumber` import, present on base, out of scope).
- Grep acceptance: barrel exports RevealStagger/LiveValue/PulseDot/AmbientField/CursorGlow/Explorable/crossfade (all reachable); 0 `forwardRef`; 0 `import.*gsap` in the barrel; LiveValue `if (reduce)` present; PulseDot branches on `useReducedMotion()`; no hardcoded hex in PulseDot.
- Consumer count: 17 files still import `@/components/product/motion`, none changed (the shim's own header comment is excluded from the count).
- `grep -n "engine-per-job" DESIGN.md` matches inside §4.7; the plan's verify command (`grep engine-per-job && ! em-dash near it`) exits 0.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Restored 10-01 deliverables wrongly staged by the worktree base reset**
- **Found during:** Task 1 commit
- **Issue:** The worktree was created from a stale base; the `git reset --soft 22f49631` (per the worktree-branch-check) staged the diff between the worktree's old HEAD and the correct base. The first Task 1 commit accidentally captured deletions of three 10-01 files (`10-01-SUMMARY.md`, `scripts/check-route-js-budget.sh`, `tests/responsive/reveal-fail-open.spec.ts`) plus reverts of five other 10-01-era files to their pre-10-01 versions.
- **Fix:** `git checkout 22f49631 -- <the 8 affected files>` to restore base state, then `git commit --amend` so the Task 1 commit contains only the 9 new motion files. Confirmed final `git diff --name-status 22f49631 HEAD` lists only this plan's intended files.
- **Files modified:** none beyond restoring base content (no 10-01 deliverable was lost)
- **Commit:** eece69b (amended)

### Notes (not deviations)

- The `forwardRef` acceptance grep required zero matches. The original Explorable header comment contained the literal word `forwardRef` while explaining the React 19 no-forwardRef rule; the comment was reworded so the grep is strictly green without weakening the rule.

## Known Stubs

**Explorable.tsx is an intentional shell, by plan design.** It ships the compound-component contract (root + Toggle + Panel with shared `use()` context, keyboard-operable buttons, values visible by default) with no flagship payload. The plan explicitly scopes the first real explorable to Phase 11 (PLATVIS-02). This is documented in the file header. Not a blocker for the plan goal (the goal is the contract every Phase 11-15 visual imports from).

## Self-Check: PASSED

- FOUND: src/components/motion/tokens.ts, Reveal.tsx, LiveValue.tsx, PulseDot.tsx, PulseDot.module.css, transitions.ts, Explorable.tsx, Hoverable.tsx, index.ts
- FOUND: src/components/product/motion.tsx (shim), DESIGN.md, .impeccable.md modified
- FOUND commits: eece69b, 0edb81c, a2bc635
