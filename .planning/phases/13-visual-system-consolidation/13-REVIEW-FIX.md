---
phase: 13-visual-system-consolidation
source_review: 13-REVIEW.md
fixed: 2026-06-13
resolved:
  warning: 1
  info: 1
accepted:
  info: 2
status: resolved
---

# Phase 13: Code Review Fix Report

Resolutions for the findings in [13-REVIEW.md](13-REVIEW.md). Fixes applied
manually (single warning + one trivial info), not via the gsd-code-fixer agent.

## Resolved

### WR-01 — `compliance` flagship lost its accessible name (FIXED)

The CI nested-interactive fix made `FeatureAccordion` stop wrapping live visuals
in `role="img"`, on the contract that each live visual self-labels. Four of the
five homepage flagships render `Console` (which emits `role="img"` +
`aria-label={data.ariaSummary}`), but `compliance` → `ComplianceStandards`
rendered a bare `ProductCanvas` `<div>` with no root role/label, so it became an
unnamed region. axe stayed green (an unlabeled non-`img` div is not a violation),
so CI did not catch it.

**Fix:** `ComplianceStandards` now forwards `role="img"` + an `aria-label` through
its `ProductCanvas` root (which already spreads `{...props}`). The summary is
built from the component's real `VENDORS` / `EXCEPTIONS` values (no invented
numbers) and carries the existing `[CLAIMS REVIEW]`/`[COI REVIEW]` framing. No
nested-interactive risk: `ComplianceStandards` has no focusable descendants
(no Explorable toggles), unlike the other four flagships.
File: `src/components/product/visuals/ComplianceStandards.tsx`.

### IN-02 — stale M2/M3 docblock comments in FeatureAccordion (FIXED)

The `visualLabel` JSDoc and the component docblock still described the M2
placeholder / "real screenshots arrive in M3" era. Updated both to describe the
current visual-resolution priority (explicit `visuals[id]` → AccordionVisual
flagship registry → static text placeholder) and the self-labeling contract.
File: `src/components/sections/FeatureAccordion.tsx` (comment-only).

## Accepted (no change)

- **IN-01** — Handoff KPI directional deltas render in neutral color only.
  Deliberate per the visual system; severity is carried as text, not color
  (color-only severity is structurally impossible in `Console.Rows`). Left as-is.
- **IN-03** — Flagship `dynamic()` imports double-registered across
  `index.tsx` and `lazy.tsx`. Justified: the two registries serve different call
  sites (homepage accordion registry vs. page-level lazy wrappers). No action.

## Verification

`tsc --noEmit` exit 0, `eslint` clean, `next build` ✓ Compiled successfully.
Pushed to PR #12 for CI (a11y + responsive, perf gate).
