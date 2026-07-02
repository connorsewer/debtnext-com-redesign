---
phase: 14-text-only-page-elevation
reviewed: 2026-07-01T00:00:00Z
depth: standard
files_reviewed: 12
files_reviewed_list:
  - DESIGN.md
  - src/app/compare/page.tsx
  - src/app/demo/page.tsx
  - src/app/platform/integrations/page.tsx
  - src/components/forms/DemoForm.tsx
  - src/components/ui/AttachedForm.tsx
  - src/content/compare.ts
  - src/content/visuals/compare.ts
  - src/content/visuals/index.ts
  - src/content/visuals/integrations.ts
  - tests/a11y/demoform-aria.spec.ts
  - tests/responsive/14-page-elevation.spec.ts
findings:
  critical: 0
  warning: 0
  info: 2
  total: 2
status: clean
---

# Phase 14: Code Review Report

**Reviewed:** 2026-07-01T00:00:00Z
**Depth:** standard
**Files Reviewed:** 12
**Status:** clean

## Summary

Reviewed the Phase 14 (text-only page elevation) diff `69ed004..HEAD`: two new archetype payloads (`/compare` DataStory, `/platform/integrations` Schematic), their page wiring, the P14-01 DemoForm aria-association edit, the P14-02 AttachedForm focus-ring alignment, the BL-01 copy reword, the DESIGN.md §8.3 input-focus note, and two new Playwright specs.

No issues at or above medium severity. The changes are correct, spec-compliant, and well-governed:

- **P14-01 aria wiring is correct.** `inputClasses(error, id)` emits `"aria-invalid": error ? true : undefined` and `"aria-describedby": error ? \`${id}-error\` : undefined`. Using `undefined` (not `false`/`""`) means an un-errored field carries neither attribute, which satisfies the negative assertions in `demoform-aria.spec.ts` (portfolioSize, honeypot). The matching `<p id="{id}-error" role="alert">` is rendered by `Field` only when `error` is truthy, so every `aria-describedby` target resolves. The honeypot `websiteUrl` input uses raw `register(...)` with no `inputClasses`, so it correctly stays unwired.
- **Payloads satisfy their schemas.** `compareTimeToProduction satisfies DataStoryData` (cards branch) and `integrationsSystemMap satisfies SchematicData` — every field the payloads set (`accent`, `tag`, `value`, `suffix`, `bar`, `sub`, node `kind`, edge `flow`) is consumed by `DataStory.tsx` / `Schematic.tsx`. `value: 0` renders "0 mo" via `LiveValue`; the decoupled `bar` (12 vs 100) carries the short-vs-long grayscale contrast per the payload's stated intent.
- **Spec distinctness strings resolve to visible DOM text**, not aria-label-only. `/compare` "time to production" / "already in production" appear in the rendered headline caption and annotation caption; `/platform/integrations` "system of record" / "recovery vendors" appear as visible `FlowNode` labels. Playwright `getByText(str, { exact: false })` matches case-insensitively, so the lowercase assertions match the sentence-case DOM text. Reduced-motion parity is asserted (`assertReducedMotionDataParity`), and `RevealSection`/`AmbientField`/`LiveValue` all land on final content under `prefers-reduced-motion`.
- **Color + copy governance holds.** dPlat uses `--chart-1`; the "typical build" uses `--chart-2` exactly as the UI-SPEC sanctions ("muted/`--chart-2` baseline for the typical or competitor side"). No accent tokens outside the allowed set. No em dashes; the only "digital journeys" hit is inside a comment noting the string is NOT used (BL-01 reword to "digital outreach flows" confirmed in `compare.ts:99`). `[CLAIMS REVIEW]` / `[COI REVIEW]` headers present on both payloads. No invented named clients; figures are real-shaped and anonymized.
- **Demo page ambient layer is safe.** `<AmbientField particleCount={5} bloom />` is `aria-hidden="true"`, seeded (default `seed=538`, deterministic `makeParticles`, no hydration mismatch), collapses to `bloomStatic` under reduced motion, and sits behind `z-10` content inside `relative isolate overflow-hidden`. `ambient={false}` on `SectionContainer` correctly opts out of the default field + CursorGlow pair, preventing double-stacking. No CTA competition.
- **AttachedForm ring change** reuses the already-shipped `focus:ring-3 focus:ring-[var(--focus)]/35` pattern (present in `DemoForm.tsx` and `HomepageHero.tsx`), now documented as intentional in DESIGN.md §8.3.
- **Security:** payloads are static strings rendered as text (no `dangerouslySetInnerHTML`, no `eval`), server-safe with no `"use client"`, no secrets. No XSS vectors.

The two Info items below are test-robustness nuances, not defects, and do not block merge.

## Info

### IN-01: `assertArchetypePresent` may latch onto a `CardBar` instead of the ChartFrame root

**File:** `tests/responsive/14-page-elevation.spec.ts:81-90`
**Issue:** The archetype locator `[role="img"]:not([aria-label=""])` selects `.first()`, then asserts a non-empty `aria-label`. Inside the `/compare` DataStory, each `CardBar` also renders `role="img" aria-label="{value}%"` (e.g. `aria-label="12%"`), which is non-empty. Depending on DOM order, `.first()` could resolve to a `CardBar` ("12%") rather than the intended `ChartFrame` region that carries the descriptive `ariaSummary`. The assertion still passes (a bar has a non-empty label), so the intended "real archetype with descriptive summary" guarantee is weaker than it reads. The argument-unique-string assertions still provide the real anti-copy-paste protection, so this is cosmetic.
**Fix:** Tighten the locator to the descriptive region, e.g. filter by a minimum label length or target the ChartFrame summary specifically:
```ts
const archetype = page.locator('[role="img"]').filter({
  has: page.locator(':scope'), // or assert label length > some threshold
});
// simplest: assert the descriptive summary node exists
await expect(
  page.locator('[role="img"][aria-label*="comparison" i], [role="img"][aria-label*="system map" i]').first(),
).toBeVisible();
```

### IN-02: Lowercase distinctness strings live only in the `ariaSummary`, which `getByText` cannot reach

**File:** `src/content/visuals/compare.ts:47,54,74` and `tests/responsive/14-page-elevation.spec.ts:65`
**Issue:** The exact-lowercase forms "time to production" and "already in production" appear verbatim only in the `ariaSummary` (an `aria-label`, invisible to `getByText`). They pass today solely because Playwright's default string matching is case-insensitive against the visible headline ("Time to production: dPlat is already running") and annotation caption ("dPlat is already in production..."). If a future edit switches these assertions to `{ exact: true }`, or the visible headline/annotation copy is reworded away from those substrings, the check would silently depend on case-insensitivity or break. This is a latent coupling, not a current failure.
**Fix:** No change required now. If hardening later, assert the visible strings in their actual sentence case (e.g. "Time to production", "already in production" as they appear in the caption/annotation) rather than relying on lowercase forms that only exist in the aria-label.

---

_Reviewed: 2026-07-01T00:00:00Z_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: standard_
