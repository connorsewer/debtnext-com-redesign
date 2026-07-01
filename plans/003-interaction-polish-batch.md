# Plan 003: Interaction polish batch — affordance, grid fill, touch targets, off-screen loops

> **Executor instructions**: Follow step by step. Run every verification command
> and confirm the expected result before moving on. The four steps are
> independent; if one hits a STOP condition, you may still complete the others
> and report the blocked one. Update this plan's row in `plans/README.md` when
> done.
>
> **Drift check (run first)**: `git diff --stat 273ccf0..HEAD -- src/components/sections/CardGrid.tsx src/components/sections/IntegrationStrip.tsx src/components/sections/ProcessStrip.tsx src/components/site/SiteHeader.tsx src/components/product/visuals/PlatformSystemMap.tsx src/components/product/visuals/DecisionEnginePreview.tsx`
> On any mismatch with the "Current state" excerpts, treat as a STOP condition.

## Status

- **Priority**: P2
- **Effort**: S
- **Risk**: LOW
- **Depends on**: none
- **Category**: tech-debt (UI polish / a11y)
- **Planned at**: commit `273ccf0`, 2026-06-13

## Why this matters

Four small, independent, high-confidence defects that each erode the "calm,
precise" read the brand brief (`.impeccable.md`) calls for:

1. **Phantom click affordance.** Non-interactive cards lift and grow an indigo
   border on hover — the universal "I'm clickable" signal — but have nothing to
   click. A precise enterprise UI shouldn't promise actions it can't honor.
2. **Under-filled process grid.** `ProcessStrip` hardcodes a 5-column track, so
   3-step pages (`/platform/placement`, `/platform/optimization`) leave two
   empty border-colored cells — reads as an unfinished grid.
3. **Sub-44px nav dropdown rows.** Desktop nav dropdown items are ~40px tall,
   under the 44px floor in `DESIGN.md` §8.6/§9.3 (matters on hybrid-touch
   laptops).
4. **Perpetual off-screen animation loops.** Two product visuals run
   `setInterval` state cycles forever while mounted, re-rendering even when
   scrolled away or the tab is backgrounded — needless main-thread churn on a
   site that tracks INP.

## Current state

**(1) Hover affordance** — `src/components/motion/hover.module.css:14-19`:
```css
@media (hover: hover) {
  .hoverCard:hover { transform: translateY(-2px); border-color: rgba(82,102,235,0.25); box-shadow: ...; }
}
```
- `CardGrid.tsx:88-91` applies `hover.hoverCard` to every card `<li>`, but the
  card `link` is **optional** (`GridCard.link?`, used at `:114`). Cards without a
  link (homepage services, why-dplat differentiators, leadership, compare
  pillars) still lift.
- `IntegrationStrip.tsx:72-75` applies `hover.hoverCard` to every card, but
  `IntegrationCard` has **no link field at all** (only `title`, `body`, `icon`);
  the only link is a section-level ghost link below the grid (`:95`). These cards
  are never individually interactive.

**(2) ProcessStrip** — `src/components/sections/ProcessStrip.tsx:46`:
```
@md/section:grid-cols-3 @lg/section:grid-cols-5
```
`steps` is 3–5 long. The repo already has the dynamic-column pattern to copy —
`ProofBand.tsx:79-85`:
```tsx
className="... md:[grid-template-columns:repeat(var(--proof-cols),minmax(0,1fr))]"
style={{ ["--proof-cols" as string]: stats.length } as React.CSSProperties}
```

**(3) Dropdown rows** — `src/components/site/SiteHeader.tsx:155`:
```tsx
className="block rounded-[var(--radius-xs)] px-3 py-2 text-body-md text-[var(--text-tertiary)] hover:bg-[var(--accent)] ..."
```
`py-2` (16px) + ~24px line-height ≈ 40px, no `min-h-touch`. Compare the correct
pattern at `CardGrid.tsx:118` which uses `min-h-touch`.

**(4) Off-screen intervals** —
```tsx
// src/components/product/visuals/PlatformSystemMap.tsx:40-44
React.useEffect(() => {
  if (reduce) return;
  const id = setInterval(() => setActive((a) => (a + 1) % SPINE.length), 1400);
  return () => clearInterval(id);
}, [reduce]);
```
```tsx
// src/components/product/visuals/DecisionEnginePreview.tsx:41-45
React.useEffect(() => {
  if (reduce) return;
  const id = setInterval(() => setReallocated((r) => !r), 4000);
  return () => clearInterval(id);
}, [reduce]);
```
Both render inside `ProductCanvas`, which forwards a `ref` to its outer div
(`ProductCanvas.tsx:9,29` — `ref?: React.Ref<HTMLDivElement>`). `framer-motion`
exposes `useInView`, already a dependency.

## Commands you will need

| Purpose | Command | Expected |
|---|---|---|
| Typecheck | `npm run typecheck` | exit 0 |
| Lint | `npm run lint` | exit 0 |
| Build | `npm run build` | exit 0 |
| Touch-target spec | `npm run test:e2e -- tests/a11y` (or the touch-targets spec) | pass |

`next dev`/`start` hang here; build/tsc/Playwright run.

## Scope

**In scope**: `CardGrid.tsx`, `IntegrationStrip.tsx`, `ProcessStrip.tsx`,
`SiteHeader.tsx`, `PlatformSystemMap.tsx`, `DecisionEnginePreview.tsx`.

**Out of scope**:
- `hover.module.css` — the `.hoverCard` class itself is correct; only its
  *application* changes. Do not edit the CSS.
- The reveal/motion variants on these cards (Plan 002 territory) — leave
  `staggerContainer`/`fadeUpItem` usage untouched here.
- `Console.tsx` — active Phase 13 work; not in this plan.

## Git workflow

- Branch: `advisor/003-interaction-polish`
- Conventional commits; one per fix is fine, e.g.
  `fix(ui): only lift cards that are interactive`,
  `fix(nav): meet 44px touch floor on dropdown items`.
- Do NOT push or open a PR unless instructed.

## Steps

### Step 1: Gate the hover lift to interactive cards

- `CardGrid.tsx:88-91`: change the className so `hover.hoverCard` is applied only
  when the card has a link:
  ```tsx
  className={cn(
    "flex flex-col gap-4 rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--card)] p-6 md:p-7",
    card.link && hover.hoverCard
  )}
  ```
- `IntegrationStrip.tsx:72-75`: remove `hover.hoverCard` from the card `<li>`
  entirely (these cards are never interactive). The `cn(...)` then has a single
  string argument — keep `cn` or inline the string, your choice; do not change
  any other class. The section-level ghost link's `hover.hoverArrow` (`:101`)
  stays.

**Verify**: `npm run build` → exit 0. `grep -n 'hoverCard' src/components/sections/IntegrationStrip.tsx` → no matches.

### Step 2: Drive ProcessStrip columns from step count

In `ProcessStrip.tsx`, mirror the ProofBand pattern. Replace the fixed
`@md/section:grid-cols-3 @lg/section:grid-cols-5` with a step-count-driven track
(cap at 5 so a 5-step strip is unchanged), e.g. set a `--step-cols` CSS variable
from `Math.min(steps.length, 5)` and use
`@md/section:[grid-template-columns:repeat(var(--step-cols),minmax(0,1fr))]`.
Keep the gap/border/rounded/overflow classes. The `motion.ol` already takes a
`style`; add the CSS var there as `React.CSSProperties` (see ProofBand:81-85 for
the exact cast pattern).

**Verify**: `npm run typecheck` → 0; `npm run build` → 0. Steps render N columns
for N steps (3 for placement/optimization, 5 for platform/issues) with no empty
cells. (Confirm visually if a preview URL is available; otherwise the build gate
plus the column-count logic suffices.)

### Step 3: Meet the 44px floor on dropdown items

`SiteHeader.tsx:155`: add `min-h-touch flex items-center` to the dropdown
menu-item `Link` className (keep `block`? — replace `block` with `flex` so
`items-center` applies; `min-h-touch` is defined in globals.css). Result rows are
≥44px.

**Verify**: `npm run build` → 0; `npm run test:e2e -- tests/a11y` (touch-target
spec) → pass. If the Playwright harness can't run, confirm the class is present
and report.

### Step 4: Pause the interval loops when off-screen

In both `PlatformSystemMap.tsx` and `DecisionEnginePreview.tsx`:
- Add a ref and attach it to the rendered `<ProductCanvas ref={canvasRef} ...>`
  (ProductCanvas forwards refs).
- `import { useInView } from "framer-motion"` (or add to the existing
  framer-motion import).
- `const inView = useInView(canvasRef, { amount: 0.2 });`
- Gate the effect: run the interval only while `inView` and not `reduce`; add
  `inView` to the dependency array so it starts/stops as the visual enters and
  leaves the viewport:
  ```tsx
  React.useEffect(() => {
    if (reduce || !inView) return;
    const id = setInterval(...);
    return () => clearInterval(id);
  }, [reduce, inView]);
  ```

**Verify**: `npm run typecheck` → 0; `npm run lint` → 0; `npm run build` → 0.

## Test plan

- No new unit tests (no render-test layer for these components).
- Existing a11y/touch-target specs in `tests/a11y` must still pass and now cover
  the dropdown fix (Step 3).
- Verification: `npm run test:e2e -- tests/a11y` → pass; `npm run build` → 0.

## Done criteria

ALL must hold:
- [ ] `CardGrid` lift applies only when `card.link` is present
- [ ] `IntegrationStrip` cards no longer use `hover.hoverCard`
- [ ] `ProcessStrip` renders exactly `steps.length` (≤5) columns, no empty cells
- [ ] `SiteHeader` dropdown items are ≥44px (have `min-h-touch`)
- [ ] Both interval effects gate on `inView`
- [ ] `npm run typecheck` / `lint` / `build` all exit 0
- [ ] `npm run test:e2e -- tests/a11y` passes (or noted un-runnable)
- [ ] No files outside scope modified (`git status`)
- [ ] `plans/README.md` row updated

## STOP conditions

Stop and report if:
- Any drift-check excerpt no longer matches live code.
- `useInView` is not exported by the installed `framer-motion` version (check
  `node_modules/framer-motion` types) — report instead of substituting an
  IntersectionObserver by hand.
- The touch-target spec fails on a route other than the nav dropdown (means a
  pre-existing issue outside this plan's scope).

## Maintenance notes

- Convention to carry forward: apply `hover.hoverCard` only to cards that are
  themselves a click target. If a card later gains a whole-card link, re-add the
  lift.
- If `ProcessStrip` ever needs >5 steps, revisit the cap in Step 2.
- The `useInView` gating pattern (Step 4) is the right template for any future
  always-animating product visual.
