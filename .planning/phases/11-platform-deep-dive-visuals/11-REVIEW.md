---
phase: 11-platform-deep-dive-visuals
reviewed: 2026-06-06T00:00:00Z
depth: standard
files_reviewed: 17
files_reviewed_list:
  - lighthouserc.json
  - src/app/platform/issues/page.tsx
  - src/app/platform/optimization/page.tsx
  - src/app/platform/placement/page.tsx
  - src/app/platform/reporting/page.tsx
  - src/components/product/visuals/IssuesFlagship.tsx
  - src/components/product/visuals/OptimizationFlagship.tsx
  - src/components/product/visuals/PlacementFlagship.tsx
  - src/components/product/visuals/ReportingFlagship.tsx
  - src/components/product/visuals/lazy.tsx
  - src/content/visuals/index.ts
  - src/content/visuals/issues.ts
  - src/content/visuals/optimization.ts
  - src/content/visuals/placement-accordion.ts
  - src/content/visuals/reporting.ts
  - src/content/visuals/types.ts
  - tests/responsive/platform-visuals.spec.ts
findings:
  critical: 0
  warning: 3
  info: 4
  total: 7
status: issues_found
---

# Phase 11: Code Review Report

**Reviewed:** 2026-06-06
**Depth:** standard
**Files Reviewed:** 17
**Status:** issues_found

## Summary

Reviewed all four platform deep-dive page routes, their flagship visual components, the visual content payload modules, the lazy registry, the shared type model, and the Playwright test suite. The architecture is solid: typed payloads satisfy their schemas, the D-05 reduced-motion data-parity contract is consistently honored across all four flagships, status values carry text labels (Pitfall 8), and all `ariaSummary` fields are populated. No critical bugs or security issues.

Three warnings need attention before merge. The most substantive is a display inconsistency in the optimization bonus payload where the rendered trailing value lacks the dollar-sign currency indicator that the `ariaSummary` text promises. The second is a DESIGN.md token violation: three hardcoded hex colors appear in the `optimizationHistory` content module where CSS variable references belong. The third is a Playwright anti-pattern (`waitForTimeout`) that can make the opacity assertion flaky.

Four informational items cover dead code in the lazy registry, a structural inconsistency across page routes, a Lighthouse coverage gap, and a borderline copy concern.

---

## Warnings

### WR-01: Bonus payout amounts display without currency sign

**File:** `src/content/visuals/optimization.ts:132,136,143`

**Issue:** The three bonus-payout rows in `optimizationBonus` use `suffix: ""` with a bare numeric `value`. The rendered cell will display `18400`, `9250`, and `0` with no currency indicator. The `ariaSummary` at line 151 correctly reads "$18,400" and "$9,250", creating a mismatch: the accessible text summary promises dollar amounts but the visual cell shows raw numbers. A screen reader user following the summary and a sighted user reading the cell receive inconsistent information.

```ts
// Current (optimization.ts lines 132, 136)
trailing: { value: 18400, suffix: "", animate: "count" },
trailing: { value: 9250,  suffix: "", animate: "count" },

// Fix: prefix the suffix or update to a formatted string approach.
// If ConsoleRow.trailing renders as `${value}${suffix}`, use:
trailing: { value: 18400, suffix: "", animate: "count" },
// and update the ConsoleRow renderer to accept an optional `prefix` field, OR
// encode the value as a pre-formatted string in a separate label field.
//
// Simplest fix that stays within the current schema: add a `prefix` field to
// ConsoleRow.trailing in types.ts, then:
trailing: { value: 18400, prefix: "$", suffix: "", animate: "count" },
```

If adding a `prefix` field to `ConsoleRow.trailing` in `types.ts` is out of scope for this phase, the minimum viable fix is to confirm whether the `Console` renderer already applies locale formatting with a currency prefix. If it does not, document the gap in the payload comment and track the rendering fix.

---

### WR-02: Hardcoded hex colors in `optimizationHistory` content module violate DESIGN.md token rule

**File:** `src/content/visuals/optimization.ts:169,173,178,182`

**Issue:** The `optimizationHistory` card data embeds raw hex strings for the `accent` field:

```ts
{ name: "Recovery partner A", accent: "#5266EB", ... },
{ name: "Recovery partner C", accent: "#E0A33E", ... },
{ name: "Recovery partner B", accent: "#4C8DFF", ... },
{ name: "Recovery partner D", accent: "#E0A33E", ... },
```

`#5266EB` is the project primary (matches DESIGN.md), but `#E0A33E` and `#4C8DFF` are not defined as CSS custom properties in the design token system. CLAUDE.md §3 prohibits introducing colors outside DESIGN.md. `#E0A33E` (amber/warning-adjacent) and `#4C8DFF` (a lighter indigo) have no corresponding `--status-*` or `--chart-*` token established in the spec.

**Fix:** Map accent values to CSS variable references or token aliases defined in DESIGN.md. For example:

```ts
// Replace raw hex with token references or a defined accent alias:
{ name: "Recovery partner A", accent: "var(--primary)",        ... },
{ name: "Recovery partner C", accent: "var(--status-warning)", ... },
{ name: "Recovery partner B", accent: "var(--status-focus)",   ... },
{ name: "Recovery partner D", accent: "var(--status-warning)", ... },
```

If the `DataStoryData` cards type (types.ts line 101) accepts only a `string` for `accent`, this change is drop-in. If the `SolutionsIndustryCards` renderer that consumes `kind: "cards"` passes `accent` directly into a `style` attribute, verify the CSS variable strings resolve correctly in that context.

---

### WR-03: `waitForTimeout` in `assertNoStuckOpacity` is a Playwright anti-pattern

**File:** `tests/responsive/platform-visuals.spec.ts:189`

**Issue:** `await page.waitForTimeout(300)` is used to let animations settle before the opacity sweep. `waitForTimeout` is a fixed-delay sleep — it is deprecated in Playwright's current recommendations and documented as inherently flaky: on a slow CI runner the animations may not have finished in 300 ms, and on a fast runner 300 ms is wasted wall time. The Playwright docs recommend event-based waiting instead.

**Fix:** Replace the fixed sleep with a network/animation-idle guard. The page already calls `waitForLoadState("networkidle")` upstream in `assertPlatformVisuals`, so the simplest change is to also wait for CSS animations to complete before the sweep:

```ts
// Replace:
await page.waitForTimeout(300);

// With: wait until no CSS animations are running in the viewport.
await page.waitForFunction(() => {
  const animated = document.getAnimating?.();
  // Fallback: check that no element inside [data-flagship] has a running animation.
  const els = document.querySelectorAll('[class*="animate-"]');
  return Array.from(els).every(
    (el) => getComputedStyle(el).animationPlayState !== "running"
  );
});
```

Alternatively, if the `animate-pulse` skeletons are the concern, scope the wait to a condition that the skeleton is no longer visible (i.e., the lazy chunk has resolved).

---

## Info

### IN-01: Seven superseded lazy wrappers remain in `lazy.tsx` (dead exports)

**File:** `src/components/product/visuals/lazy.tsx:37-70`

**Issue:** `LazyDecisionEnginePreview`, `LazyPlatformSystemMap`, `LazySolutionsIndustryCards`, `LazyPlacementMatrix`, `LazyOptimizationEngine`, `LazyIssuesWorklist`, and `LazyReportingDashboard` are still exported from `lazy.tsx`. These components were superseded by the new flagship exports (`LazyPlacementFlagship`, `LazyOptimizationFlagship`, `LazyIssuesFlagship`, `LazyReportingFlagship`) added in this phase. If none of the superseded names are imported by any page route (the four reviewed page files import only the new flagship names), these seven exports are dead code.

**Fix:** Verify that no other page or component imports the superseded names (`grep -r "LazyDecisionEnginePreview\|LazyPlacementMatrix\|LazyOptimizationEngine\|LazyIssuesWorklist\|LazyReportingDashboard" src/`). If unused, remove them. If any are still imported by non-reviewed files (e.g., the `/platform` parent page or the homepage), keep them but add a `@deprecated` JSDoc comment pointing to the replacement.

---

### IN-02: `/platform/placement` page omits `ProseIntro`; other three pages include it

**File:** `src/app/platform/placement/page.tsx` (no ProseIntro import or usage)

**Issue:** The issues, optimization, and reporting pages all include a `ProseIntro` section between the hero and the `ProcessStrip`/`FeatureAccordion`. The placement page goes directly from `PageHero` to `ProcessStrip`. This may be intentional (placement has no approved prose intro copy), but it creates a structural inconsistency across the four sibling routes that could look like a missing section at the content authoring step.

**Fix:** Confirm with the content spec whether `placementIntro` copy exists or is out of scope for v1. If it is intentionally absent, add a comment to `placement/page.tsx` noting the omission is deliberate so future reviewers don't treat it as a bug.

---

### IN-03: `solutions/utilities` collected in Lighthouse CI but has no assertion

**File:** `lighthouserc.json:12`

**Issue:** The `url` array includes `http://localhost:3200/solutions/utilities`, but the `assertMatrix` contains no matching pattern for that URL. Lighthouse CI will collect runs against utilities but will not enforce any assertion (no TBT ceiling, no CLS gate). The result is silently passing even if the page regresses on those metrics.

**Fix:** Either add an assertion block for `/solutions/utilities` (at minimum a TBT gate matching the content-route ceiling of 240 ms already applied to `/.+`), or remove the URL from the collect list if reporting coverage for this route is unintentional. The `.+` wildcard in the existing TBT assertion should already cover it — verify whether the `assertMatrix` wildcard pattern fires before the more-specific patterns or only on unmatched URLs. If the wildcard does cover utilities, this item can be closed as a documentation concern only.

---

### IN-04: `"No email reconciliation"` pill copy is a feature-absence statement

**File:** `src/content/visuals/issues.ts:149`

**Issue:** The second pill in `issuesVendorPortal` reads `"No email reconciliation"`. CLAUDE.md §5 bans the "not X, it's Y" construction and requires stating the positive claim directly. While the pill is not literally "not X, it's Y", it leads with a negation ("No") rather than a positive capability statement, which is inconsistent with the voice rules' spirit.

**Fix:** Reframe as a positive statement describing what the thread provides. For example:

```ts
// Current:
{ label: "No email reconciliation" },

// Suggested:
{ label: "All collaboration stays in the platform thread" },
// or:
{ label: "Shared thread replaces email back-and-forth" },
```

---

_Reviewed: 2026-06-06_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: standard_
