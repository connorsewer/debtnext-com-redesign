---
phase: 13-visual-system-consolidation
reviewed: 2026-06-13T00:00:00Z
depth: standard
files_reviewed: 14
files_reviewed_list:
  - src/components/product/visuals/Console.tsx
  - src/components/product/visuals/index.tsx
  - src/components/product/visuals/lazy.tsx
  - src/components/sections/mockups/index.tsx
  - src/components/sections/FeatureAccordion.tsx
  - src/app/globals.css
  - src/content/visuals/handoff-issues.ts
  - src/content/visuals/handoff-performance.ts
  - src/content/visuals/handoff-placement.ts
  - src/content/visuals/handoff-reporting.ts
  - src/content/visuals/index.ts
  - tests/responsive/handoff-bezel-seam.spec.ts
  - tests/responsive/handoff-dashboard-static.spec.ts
  - tests/responsive/handoff-pin-anchored.spec.ts
findings:
  critical: 0
  warning: 1
  info: 3
  total: 4
status: issues_found
---

# Phase 13: Code Review Report

**Reviewed:** 2026-06-13
**Depth:** standard
**Files Reviewed:** 14
**Status:** issues_found

## Summary

Phase 13 consolidates the homepage visual system: the 4 handoff tabs were repointed
from bespoke mockups to bare `Console` archetype instances fed typed `ConsoleData`
payloads, the 4 bespoke mockup files and 4 retired archetype files were deleted, and
the homepage `FeatureAccordion` paired visuals were repointed to the interactive
Phase 11 flagships. The three just-landed CI fixes (conditional `role="img"` in
FeatureAccordion, the `--product-text-3` contrast bump, the Tailwind v4 `translate`
assertion) were also reviewed.

Overall the change is well-structured and the reasoning is documented in-code. Verified:

- **Contrast fix is correct.** `--product-text-3` `#8A8A91` measures 4.651:1 on the
  `#20212d` card surface (the old `#87878E` was 4.47:1, below the 4.5:1 AA floor). It
  also clears AA on the `#1B1B27` card (4.97) and `#171721` canvas (5.19). Good fix.
- **TypeScript compiles clean** (`tsc --noEmit` exits 0). All 4 handoff payloads
  `satisfies ConsoleData`. The `Console.bare` prop is additive and backward-compatible.
- **No dangling imports.** The 4 deleted mockups and 4 deleted archetypes
  (`PlacementMatrix`, `OptimizationEngine`, `IssuesWorklist`, `ReportingDashboard`)
  have zero live references; only doc/comment mentions remain.
- **Handoff accordion id contract holds.** Homepage accordion ids
  (placement/optimization/issues/reporting/compliance) match `ACCORDION_VISUAL_IDS`
  exactly; handoff tab ids (placement/performance/issues/reporting) are exhaustively
  switched in `MockupForTab` / `mockupTitleForTab`.
- **The Console `value=""` + `numericValue` Header→MetricCell mapping is sound** —
  MetricCell's `numericValue != null` branch bypasses the empty `value` string.

One real a11y issue surfaced (WR-01): the FeatureAccordion fix correctly stops
wrapping live visuals in `role="img"`, which is right for the 4 Console-backed
flagships (they self-label via `ariaSummary`), but the fifth homepage flagship,
`ComplianceStandards`, has no root-level accessible name of its own, so on the
homepage it now renders with no text alternative.

## Warnings

### WR-01: `compliance` homepage flagship loses its accessible name after the FeatureAccordion fix

**File:** `src/components/sections/FeatureAccordion.tsx:156-166` (interaction with
`src/components/product/visuals/ComplianceStandards.tsx:35`)

**Issue:** The CI fix replaced an unconditional `role="img" aria-label={item.visualLabel}`
wrapper with a conditional one that is applied ONLY to the static text placeholder, so
live visuals are expected to carry their own accessible name. That holds for 4 of the 5
homepage flagships, which render `Console` instances (each emits `role="img"` +
`aria-label={data.ariaSummary}`):

- placement → `PlacementFlagship` (renders `Console`)
- optimization → `OptimizationFlagship` (renders `Console`)
- issues → `IssuesFlagship` (renders `Console`)
- reporting → `ReportingFlagship` (renders `Console`)

But the fifth, `compliance` → `ComplianceStandards`, renders a bare `ProductCanvas`
`<div>` with **no `role` and no `aria-label`** at its root, and its inner content is
largely `aria-hidden` decoration plus loose text fragments. Before Phase 13, the
accordion wrapper supplied `role="img" aria-label="..."` to every paired visual, so
this visual had a name; the new code removes it without the component supplying a
replacement. axe stays green because an unlabeled non-`img` `<div>` is not a violation,
just an unnamed region, so CI did not catch it. Net effect: the homepage "compliance"
capability visual is announced to AT as unstructured decorative text with no overall
description, while the other four read as a single labeled image.

**Fix:** Give `ComplianceStandards` a root text alternative so it self-labels like the
Console flagships. Forward `role`/`aria-label` through its `ProductCanvas` root (which
already spreads `{...props}`):

```tsx
// ComplianceStandards.tsx
export const ComplianceStandards = React.memo(function ComplianceStandards() {
  const reduce = useReducedMotion();
  return (
    <ProductCanvas
      role="img"
      aria-label="Compliance and work standards console. Three recovery partners are scored for adherence: partner A 98.2% compliant, partner B 96.8% compliant, partner C 91.4% under review. Regulated-status exceptions are auto-handled: a deceased match suspends treatment, a bankruptcy filing auto-recalls the account, and confirmed active-duty applies an SCRA rate cap."
      className="text-[var(--product-text)]"
    >
```

(Author the summary as governed copy under the existing `[CLAIMS REVIEW]`/`[COI REVIEW]`
tags already in that file.) This restores parity with the four Console flagships without
re-introducing the nested-interactive risk the CI fix was solving.

## Info

### IN-01: Handoff KPI directional deltas render in neutral color only

**File:** `src/content/visuals/handoff-performance.ts:41` (and `handoff-reporting.ts:43`,
via `Console.tsx:67-76` → `MetricCell` `delta`)

**Issue:** Header KPI `sub` strings carry directional meaning ("+1.3% vs prior 30d") but
`Console.Header` passes them to `MetricCell` `delta` with the default `deltaTone="neutral"`,
so the "+" / "-" is shown in muted gray rather than success/breach color. This is an
intentional design choice (the payload docstrings cite Pitfall 8: the words carry meaning,
color never alone), so it is correct as-is. Flagging only so the muted rendering of a
"+1.3%" headline is a known, deliberate trade and not mistaken later for a wiring bug.

**Fix:** None required. If a future pass wants the colored delta, `ConsoleHeader.kpi`
would need an optional `subTone` field threaded into `MetricCell`'s `deltaTone`; do not
add it without a design decision.

### IN-02: `FeatureAccordionItem.visualLabel` doc comments are now stale for the homepage

**File:** `src/components/sections/FeatureAccordion.tsx:16-19, 36-45`

**Issue:** The interface and component docblocks still describe `visualLabel` as the
"caption rendered over the visual placeholder for M2 / Replace with real media slot in M3"
and say "Visuals for M2 are dark placeholder surfaces... Real product screenshots arrive
in M3." After Phase 13 the homepage ids render live flagships and `visualLabel` is the
fallback-only label (still correct for non-homepage reuse). The comments understate that
the live-visual path is now the homepage default.

**Fix:** Update the docblock to note that homepage capability ids render live flagships
via the `AccordionVisual` registry and `visualLabel` is the placeholder/fallback label
for pages that do not supply a live visual. Documentation-only.

### IN-03: `AccordionVisual` registry and `lazy.tsx` duplicate the four flagship `dynamic()` imports

**File:** `src/components/product/visuals/index.tsx:34-55` and
`src/components/product/visuals/lazy.tsx:50-83`

**Issue:** `PlacementFlagship`, `OptimizationFlagship`, `IssuesFlagship`, and
`ReportingFlagship` are each wrapped in `dynamic(() => import(...))` twice: once in the
accordion `VISUALS` map (with `Fallback`, `min-h-[20rem]`) and once as the `Lazy*Flagship`
exports in `lazy.tsx` (with `FlagshipSkeleton`, `min-h-[44rem]`). The skeletons differ on
purpose (accordion grows to content height; BenefitSplit reserves a fixed CLS box), and
the in-code comments explain the Turbopack inline-literal constraint, so this is a
justified, not accidental, duplication. Flagging only as a maintenance note: a future
flagship rename must be updated in both registries or one path silently 404s its chunk.

**Fix:** None required for this phase. If the pair drifts often, consider a shared
`createFlagshipDynamic(importer, skeleton)` helper, but only if it can still satisfy
Turbopack's inline-literal static analysis (the comments suggest it currently cannot, so
leave as-is unless proven otherwise).

---

_Reviewed: 2026-06-13_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: standard_
