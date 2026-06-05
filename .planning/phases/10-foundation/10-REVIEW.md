---
phase: 10-foundation
reviewed: 2026-06-05T00:00:00Z
depth: standard
files_reviewed: 41
files_reviewed_list:
  - .github/workflows/perf.yml
  - lighthouserc.json
  - scripts/check-route-js-budget.sh
  - src/app/page.tsx
  - src/app/platform/issues/page.tsx
  - src/app/platform/optimization/page.tsx
  - src/app/platform/placement/page.tsx
  - src/app/platform/reporting/page.tsx
  - src/app/solutions/page.tsx
  - src/components/motion/Explorable.tsx
  - src/components/motion/Hoverable.tsx
  - src/components/motion/LiveValue.tsx
  - src/components/motion/PulseDot.module.css
  - src/components/motion/PulseDot.tsx
  - src/components/motion/Reveal.tsx
  - src/components/motion/index.ts
  - src/components/motion/tokens.ts
  - src/components/motion/transitions.ts
  - src/components/product/motion.tsx
  - src/components/product/primitives/ChartFrame.tsx
  - src/components/product/primitives/FlowEdge.tsx
  - src/components/product/primitives/FlowNode.tsx
  - src/components/product/primitives/WorklistRow.tsx
  - src/components/product/primitives/index.ts
  - src/components/product/visuals/Console.tsx
  - src/components/product/visuals/DataStory.tsx
  - src/components/product/visuals/Schematic.tsx
  - src/components/product/visuals/archetypes.tsx
  - src/components/product/visuals/lazy.tsx
  - src/components/product/visuals/parts.tsx
  - src/components/sections/BenefitSplit.tsx
  - src/content/homepage.ts
  - src/content/issues.ts
  - src/content/optimization.ts
  - src/content/placement.ts
  - src/content/reporting.ts
  - src/content/solutions.ts
  - src/content/visuals/index.ts
  - src/content/visuals/placement.ts
  - src/content/visuals/types.ts
  - tests/helpers/routes.ts
  - tests/responsive/hero-gsap-free-mobile.spec.ts
  - tests/responsive/reduced-motion.spec.ts
  - tests/responsive/reveal-fail-open.spec.ts
findings:
  critical: 0
  warning: 4
  info: 5
  total: 9
status: issues_found
---

# Phase 10: Code Review Report

**Reviewed:** 2026-06-05T00:00:00Z
**Depth:** standard
**Files Reviewed:** 41
**Status:** issues_found

## Summary

Phase 10 establishes the product-visuals foundation: a 7-type motion barrel (`src/components/motion/`), reusable primitive atoms (`ChartFrame`, `FlowNode`, `FlowEdge`, `WorklistRow`), three payload-fed archetypes (`Console`, `DataStory`, `Schematic`), the typed visual-payload schema (`src/content/visuals/`), a perf gate (Lighthouse + route-JS-budget + GSAP-free-mobile tests), and the platform/solutions route assembly.

Code quality is high. The motion primitives implement the reduced-motion fail-open contract carefully and consistently (`Reveal`, `LiveValue`, `PulseDot`, `parts.tsx` all early-return or force the visible state). The compound-component pattern (React 19 `use()`, controlled/uncontrolled `Explorable`) is correct. Accessibility is handled deliberately throughout (label-paired status, `role="img"` + `aria-label` text alternatives, decorative `aria-hidden`).

No critical issues. The findings below are real correctness/maintainability concerns, led by a duplicate-SVG-`id` defect in the chart atom that the `DataStory` archetype depends on, which is an axe-core `duplicate-id` risk under the project's CI a11y floor. The remaining warnings cover an unguarded array assumption in `Schematic` layout, a `barTone` branch that can never return, and a budget guard that is wired but still non-blocking (provisional ceiling). Info items are dead-code / unused-export hygiene that will matter as Phases 11-15 build on this foundation.

## Warnings

### WR-01: Duplicate SVG gradient ids in `AreaLine` collide when a page renders more than one area chart

**File:** `src/components/product/visuals/parts.tsx:160,164,171,190`
**Issue:** `AreaLine` hardcodes `<linearGradient id="al-fill">` and `<radialGradient id="al-glow">`, referenced via `fill="url(#al-fill)"` and `fill="url(#al-glow)"`. These ids are module-constant, so any page that renders two `AreaLine`s (directly, or via the `DataStory` `chart.kind === "area"` branch in `DataStory.tsx:141`) emits duplicate DOM ids. Duplicate ids are invalid HTML and trigger the axe-core `duplicate-id` rule, which CLAUDE.md §11 runs in CI on every PR. Functionally, `url(#id)` resolves to the first match, so a second chart can render with the wrong/absent gradient. The Phase 10 archetypes are explicitly built for reuse across Phases 11-15, so multiple charts per page is the expected case, not an edge case.
**Fix:** Make the ids instance-unique with `useId` and namespace the refs:
```tsx
export const AreaLine = React.memo(function AreaLine({ points, className }) {
  const uid = React.useId();
  const fillId = `al-fill-${uid}`;
  const glowId = `al-glow-${uid}`;
  // ...
  // <linearGradient id={fillId}> ... <path fill={`url(#${fillId})`} />
  // <radialGradient id={glowId}> ... <circle fill={`url(#${glowId})`} />
});
```

### WR-02: `Schematic` column layout assumes every node's `kind` maps to a known column, silently dropping unknown kinds into `source`

**File:** `src/components/product/visuals/Schematic.tsx:53-65,91-104`
**Issue:** Columns are built only from the fixed `order` array (`source`, `engine`, `vendor`, `sink`). `SchematicNode.kind` is optional (`types.ts:116`), and `(n.kind ?? "source")` coerces undefined to `source`. That part is intentional. But edge geometry depends on `pos.get(edge.from)`/`pos.get(edge.to)`; if a payload references a node id in an edge that does not exist in `data.nodes` (typo, or a node filtered out), `pos.get` returns `undefined` and the edge is silently dropped (`if (!from || !to) return null`). A schematic that quietly omits routing edges is a misleading product visual with no error surfaced. Since `SchematicData` is marked PROVISIONAL and hardens in Phase 11, an authoring-time guard now prevents silent data drift later.
**Fix:** Fail loudly in development when an edge references an unknown node id, so payload typos are caught at author time rather than rendering a wrong diagram:
```tsx
const from = pos.get(edge.from);
const to = pos.get(edge.to);
if (!from || !to) {
  if (process.env.NODE_ENV !== "production") {
    console.warn(`Schematic edge references unknown node id: ${edge.from} -> ${edge.to}`);
  }
  return null;
}
```

### WR-03: `Console` `barTone` has a dead final branch and drops the `neutral` tone silently

**File:** `src/components/product/visuals/Console.tsx:186-191`
**Issue:** `barTone` returns `tone` for `"success"`/`"warning"`, then `tone === "indigo" ? "indigo" : undefined`. The final ternary's true and false arms are equivalent type-narrowed values (`"indigo"` vs `undefined`), but the expression `tone === "indigo" ? "indigo" : undefined` is just `tone === "indigo" ? tone : undefined` — the literal re-write is dead/confusing. More importantly, `BarSpec.tone` includes `"neutral"` (`types.ts:29`), which this function maps to `undefined`, so a payload authored with `tone: "neutral"` silently renders as the default indigo `ValueBar` with no neutral treatment. The same pattern is duplicated in `DataStory.tsx:45-47` (`barTone`). A payload author setting `neutral` gets indigo with no warning.
**Fix:** Either support `neutral` end to end or document that `ValueBar` has no neutral tone and constrain the type. Minimal correctness fix (collapse the dead branch, make intent explicit):
```tsx
function barTone(tone) {
  return tone === "success" || tone === "warning" || tone === "indigo"
    ? tone
    : undefined; // "neutral"/undefined fall back to ValueBar's default indigo
}
```

### WR-04: Route-JS budget guard is wired but non-blocking — the provisional 300 KB ceiling can mask a real regression

**File:** `scripts/check-route-js-budget.sh:26-29` and `.github/workflows/perf.yml:24-25`
**Issue:** `ROUTE_JS_BUDGET_BYTES=307200` is documented as a deliberately loose placeholder (~300 KB) and the script itself prints `NOTE budget is PROVISIONAL`. As wired, the perf gate can pass even if `/` First-Load-JS grows well beyond the real post-5.3 baseline, because the ceiling is far above the actual number. Phase 10 adds the motion barrel + archetypes; a future eager import that pulls Framer or an archetype onto the `/` shared chunk could land under 300 KB and slip through, defeating the guard's purpose. This is a correctness gap in the gate, not a style issue: the guard's stated job (catch `/` JS regressions) is not actually enforced until the budget is pinned.
**Fix:** On the first green CI run, capture the measured `PASS / First-Load-JS: <N> bytes` value this script prints and pin `ROUTE_JS_BUDGET_BYTES` to `N * 1.1` (the ~10% headroom the header comment specifies), then record the number in the phase SUMMARY. Until pinned, treat the gate as informational and do not rely on it to catch a JS regression.

## Info

### IN-01: Schema (`ConsoleData`/`DataStoryData`/`SchematicData`), the lazy archetype registry, and the reference payload are authored but not yet consumed by any page

**File:** `src/content/visuals/placement.ts:34`, `src/components/product/visuals/archetypes.tsx:53-65`, `src/content/visuals/index.ts:20`
**Issue:** `placementConsole` is exported but referenced nowhere outside its own module + the barrel re-export. `ConsoleVisual`/`DataStoryVisual`/`SchematicVisual` (the lazy `ssr:false` wrappers in `archetypes.tsx`) have zero consumers — the platform pages still render the older `LazyPlacementMatrix`/`LazyIssuesWorklist`/etc. from `lazy.tsx`, not the new archetypes. This is expected for a foundation phase (the comments state the first flagship ships in Phase 11), so it is informational, not a defect. Flagging so the unused surface is tracked and removed/wired in Phase 11 rather than lingering as dead code.
**Fix:** No action this phase. In Phase 11, migrate at least one page (placement) to `ConsoleVisual data={placementConsole}` so the schema + archetype + payload path is exercised end to end, and retire the duplicated `lazy.tsx` visual or the `archetypes.tsx` wrapper, whichever loses.

### IN-02: Two near-identical `VisualSkeleton` components with different dimensions

**File:** `src/components/product/visuals/archetypes.tsx:25-32` and `src/components/product/visuals/lazy.tsx:8-15`
**Issue:** `archetypes.tsx` defines a `VisualSkeleton` with `min-h-[20rem]` and no pulse; `lazy.tsx` defines another `VisualSkeleton` with `min-h-[22rem]` + `animate-pulse`. Both claim to be the CLS-free resolved-box fallback. The mismatched min-heights mean the two lazy paths reserve different space, and a page mixing both (Phase 11+) will have inconsistent skeleton heights. Duplication also risks the two drifting further.
**Fix:** Extract one shared `VisualSkeleton` (single min-height, agreed pulse behavior) and import it in both registries.

### IN-03: `homepageTrust` is documented as legacy/superseded but still rendered on the homepage

**File:** `src/content/homepage.ts:19-38` and `src/app/page.tsx:49-52`
**Issue:** The comment above `homepageTrust` says the legacy split-hero content is "Superseded on the homepage by the cinematic HomepageHero ... safe to remove once nothing references it," yet `page.tsx` still renders `<TrustBand ... industries={homepageTrust.industries} />`. The comment is stale relative to the actual usage and could mislead a future editor into deleting a still-referenced export. (Separate from the [CLAIMS REVIEW] flag already in the comment.)
**Fix:** Update the comment to reflect that `homepageTrust.industries` is live in the `TrustBand`, or split the genuinely-dead headline/body copy out from the still-used `industries` list.

### IN-04: `Schematic` node columns use array index as React key

**File:** `src/components/product/visuals/Schematic.tsx:109` (`key={colIndex}`)
**Issue:** The outer column wrapper uses `key={colIndex}`. Columns are derived by filtering a fixed `order`, so the set is stable per render, which makes this low-risk today. But index keys on a list whose composition depends on payload data (`columns` is `.filter(col => col.length > 0)`) can mis-reconcile if a payload adds/removes a whole kind between renders. Inner nodes correctly key by `node.id`.
**Fix:** Key the column by its kind instead of index, e.g. derive the kind alongside the column (`order.filter(...).map(kind => ...)`) and use `key={kind}`.

### IN-05: Magic viewbox constants and PROVISIONAL geometry in `Schematic`

**File:** `src/components/product/visuals/Schematic.tsx:26-32`
**Issue:** `VIEW_W = 100` / `VIEW_H = 100` and the `centerY` spacing formula are PROVISIONAL (the file comment says so) and will be re-derived against real routing data in Phase 11. Not a bug now; recording so the placeholder geometry is not mistaken for final layout when Phase 11 hardens `SchematicData`.
**Fix:** No action this phase. Revisit when the real "how it works" data lands in Phase 11, per the file's own PROVISIONAL note.

---

_Reviewed: 2026-06-05T00:00:00Z_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: standard_
