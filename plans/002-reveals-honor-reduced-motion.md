# Plan 002: Make scroll-reveal visuals honor prefers-reduced-motion (fail open)

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving on. If
> anything in "STOP conditions" occurs, stop and report — do not improvise.
> When done, update this plan's status row in `plans/README.md`.
>
> **Drift check (run first)**: `git diff --stat 273ccf0..HEAD -- src/components/motion src/components/product/visuals src/components/sections/CompareMatrix.tsx src/components/sections/LeadershipTable.tsx src/components/sections/IntegrationTable.tsx`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code; on a mismatch, treat it as a
> STOP condition.

## Status

- **Priority**: P1
- **Effort**: S
- **Risk**: LOW
- **Depends on**: none
- **Category**: bug (accessibility)
- **Planned at**: commit `273ccf0`, 2026-06-13
- **Executed at**: 2026-07-01. Drift check confirmed `IssuesWorklist.tsx`,
  `OptimizationEngine.tsx`, `PlacementMatrix.tsx`, `ReportingDashboard.tsx`
  were deleted by the Phase 14 archetype-pages work and replaced with
  `IssuesFlagship.tsx`, `OptimizationFlagship.tsx`, `PlacementFlagship.tsx`,
  `ReportingFlagship.tsx` (plus new shared `parts.tsx`/`archetypes.tsx`). The
  4 replacement files were verified to have no raw scroll-reveal pattern at
  all (built on the already-reduced-motion-safe primitives in `parts.tsx`), so
  those 4 original findings (and the inline `OptimizationEngine.tsx` Step 3
  fix) are moot/already-resolved. The remaining 5 sites
  (`PlatformSystemMap.tsx`, `ComplianceStandards.tsx` x2, `CompareMatrix.tsx`
  x2, `LeadershipTable.tsx`, `IntegrationTable.tsx`) were unchanged and fixed
  as planned.

## Why this matters

The design contract is explicit: `DESIGN.md` §4.7 says scroll reveals must
"fail open under reduced motion" (end at the final visible state, never stuck at
`opacity:0`), and `.impeccable.md` principle 5 says "Reduced motion is honored
everywhere." The repo built the right tool for this — `RevealStagger` /
`RevealItem` in `src/components/motion/Reveal.tsx` branch on
`useReducedMotion()` and render `initial="show"` so content is visible
immediately.

But ~11 reveal sites bypass those wrappers and spread the raw `inViewProps`
object, which hardcodes `initial: "hidden"` (opacity 0) with **no reduced-motion
branch**. So reduced-motion users still get fade-up entrances on these product
visuals and data tables, and there is one place where a code comment falsely
claims the opposite (`CompareMatrix.tsx:43`). These visuals are reachable from
the homepage feature accordion and across `/platform`, `/compare`,
`/platform/integrations`, and the `/company` tables.

After this plan, all reveal sites resolve their `initial` state through a single
reduced-motion-aware helper, so reduced-motion users get the final visible state
with no motion — matching the documented contract and the existing
`RevealStagger` behavior.

## Current state

The safe primitive and the raw object live in the same file:

```tsx
// src/components/motion/Reveal.tsx
export const inViewProps = {
  initial: "hidden" as const,      // <-- opacity:0, no reduced-motion branch
  whileInView: "show" as const,
  viewport: { once: true, amount: 0.3 },
};

export function RevealStagger({ children, ...rest }: DivProps) {
  const reduce = useReducedMotion();
  if (reduce) {
    return <motion.div variants={staggerContainer} initial="show" animate="show" {...rest}>{children}</motion.div>;
  }
  return <motion.div variants={staggerContainer} {...inViewProps} {...rest}>{children}</motion.div>;
}
```

`RevealStagger`/`RevealItem` are already used safely in
`product/visuals/Console.tsx`, `DataStory.tsx`, and `Schematic.tsx` — but they
render a `motion.div`, so they can't wrap the `motion.tbody` table sites. A
shared **helper hook** fixes every case (div and tbody) with one change.

Raw `{...inViewProps}` sites to migrate (verified at planned-at SHA):

- `src/components/product/visuals/PlatformSystemMap.tsx:101`
- `src/components/product/visuals/ReportingDashboard.tsx:65`
- `src/components/product/visuals/ComplianceStandards.tsx:53` and `:88`
- `src/components/product/visuals/OptimizationEngine.tsx:51`
- `src/components/product/visuals/IssuesWorklist.tsx:71`
- `src/components/product/visuals/PlacementMatrix.tsx:72`
- `src/components/sections/CompareMatrix.tsx:91` and `:135`
- `src/components/sections/LeadershipTable.tsx:82`
- `src/components/sections/IntegrationTable.tsx:95`

One inline raw site (not using `inViewProps`):
```tsx
// src/components/product/visuals/OptimizationEngine.tsx:81-86 (approx)
<motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} ... >
```

One false comment to correct:
```tsx
// src/components/sections/CompareMatrix.tsx:43
// ...claims entrances are "instant under prefers-reduced-motion
//    (handled inside the motion vocab)" — currently untrue for this file.
```

All these components are already `"use client"`, so calling a hook at the top of
the component is valid. The repo convention for reduced-motion in client
components is `const reduce = useReducedMotion()` (see
`CardGrid.tsx:52`, `ProcessStrip.tsx:31`, which already branch correctly and are
**not** in scope).

## Commands you will need

| Purpose | Command | Expected |
|---|---|---|
| Typecheck | `npm run typecheck` | exit 0 |
| Lint | `npm run lint` | exit 0 |
| Build | `npm run build` | exit 0 |
| Reduced-motion spec | `npm run test:e2e -- tests/responsive/reduced-motion.spec.ts` | pass (see note) |

Note: `next dev`/`next start` hang in this sandbox; `next build`, `tsc`, and
Playwright run. The Playwright config manages its own server. If the Playwright
run cannot start a server in your environment, rely on Steps 1–4's static gates
and report that the behavioral spec was not run.

## Scope

**In scope**:
- `src/components/motion/Reveal.tsx` (add the helper hook)
- `src/components/motion/index.ts` (export the helper, if it has an explicit export list)
- `src/components/product/visuals/PlatformSystemMap.tsx`
- `src/components/product/visuals/ReportingDashboard.tsx`
- `src/components/product/visuals/ComplianceStandards.tsx`
- `src/components/product/visuals/OptimizationEngine.tsx`
- `src/components/product/visuals/IssuesWorklist.tsx`
- `src/components/product/visuals/PlacementMatrix.tsx`
- `src/components/sections/CompareMatrix.tsx`
- `src/components/sections/LeadershipTable.tsx`
- `src/components/sections/IntegrationTable.tsx`

**Out of scope** (do NOT touch):
- `src/components/product/visuals/Console.tsx` — under active Phase 13 work AND
  already uses the safe `RevealStagger`/`RevealItem`. Leave it.
- `CardGrid.tsx`, `ProcessStrip.tsx`, `ProofBand.tsx` — already branch on
  `useReducedMotion()` inline; correct as-is.
- The `inViewProps` export itself — keep it (other code and the wrappers use it);
  you are adding a hook beside it, not removing it.
- Do NOT add a global `<MotionConfig reducedMotion="user">` — it does not fix the
  `initial="hidden"` fail-open and is out of scope for this plan.

## Git workflow

- Branch: `advisor/002-reduced-motion-reveals`
- Conventional commit, e.g.:
  `fix(motion): reveals fail open under prefers-reduced-motion`
- Do NOT push or open a PR unless instructed.

## Steps

### Step 1: Add a reduced-motion-aware helper hook to Reveal.tsx

In `src/components/motion/Reveal.tsx`, add (beside `inViewProps`):

```tsx
/**
 * Reduced-motion-aware reveal props. Use instead of spreading `inViewProps`
 * directly on a motion element: under prefers-reduced-motion it renders the
 * element at its final "show" state (fail open, never stuck at opacity:0).
 */
export function useInViewProps() {
  const reduce = useReducedMotion();
  return reduce
    ? { initial: "show" as const, animate: "show" as const }
    : inViewProps;
}
```

`useReducedMotion` is already imported in this file. If
`src/components/motion/index.ts` re-exports names explicitly, add
`useInViewProps` to it; if it uses `export * from "./Reveal"`, no change needed
(verify by reading the file).

**Verify**: `npm run typecheck` → exit 0.

### Step 2: Migrate every raw `{...inViewProps}` site

For each file in the list above: at the top of the component, add
`const reveal = useInViewProps();` (import `useInViewProps` from the same place
the file currently imports `inViewProps` — for product visuals that is
`@/components/product/motion`, which re-exports the motion barrel; confirm the
name resolves through that shim, and if not, import from `@/components/motion`).
Then replace each `{...inViewProps}` with `{...reveal}`.

For files with two usages (`ComplianceStandards.tsx`, `CompareMatrix.tsx`), one
`const reveal = useInViewProps();` at the top serves both spreads.

**Verify**: this grep returns **only** `Reveal.tsx` (the definition), no consumer:
```
grep -rn '{\.\.\.inViewProps}' src/components
```
→ single match in `src/components/motion/Reveal.tsx`.

### Step 3: Fix the one inline raw site in OptimizationEngine

At `OptimizationEngine.tsx` (~line 81), the inline
`initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}` must honor
reduced motion. Add `const reduce = useReducedMotion();` at the top (import it
from `framer-motion` if not already imported) and gate the initial:
```tsx
initial={reduce ? false : { opacity: 0, y: 12 }}
whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
```

**Verify**: `npm run typecheck` → exit 0; `npm run lint` → exit 0.

### Step 4: Correct the false comment in CompareMatrix

Update the comment at `CompareMatrix.tsx:43` so it accurately describes the new
behavior (the file now resolves `initial` through `useInViewProps`, which is
reduced-motion-aware). Make the comment true; do not leave a claim the code
doesn't back.

**Verify**: `npm run build` → exit 0.

### Step 5: Behavioral gate (if Playwright runs in your environment)

**Verify**: `npm run test:e2e -- tests/responsive/reduced-motion.spec.ts` → pass.
If the harness cannot start a server, skip and note it; Steps 1–4 stand.

## Test plan

- The behavioral contract is covered by the existing
  `tests/responsive/reduced-motion.spec.ts`. If, after reading it, you find it
  does not assert visibility (opacity 1 / no transform) on the migrated visuals
  under an emulated `prefers-reduced-motion: reduce`, add one assertion for a
  representative migrated visual (e.g. the reporting dashboard grid) following
  the existing spec's structure. Do not rewrite the spec.
- Verification: `npm run test:e2e -- tests/responsive/reduced-motion.spec.ts` →
  all pass.

## Done criteria

ALL must hold:
- [ ] `grep -rn '{\.\.\.inViewProps}' src/components` → only `Reveal.tsx`
- [ ] `useInViewProps` exists in `Reveal.tsx` and is reachable from the migrated files
- [ ] `OptimizationEngine.tsx` inline reveal is reduced-motion guarded
- [ ] `CompareMatrix.tsx:43` comment is accurate
- [ ] `npm run typecheck` exits 0
- [ ] `npm run lint` exits 0
- [ ] `npm run build` exits 0
- [ ] reduced-motion Playwright spec passes (or noted as un-runnable)
- [ ] No files outside the in-scope list modified (`git status`)
- [ ] `plans/README.md` status row updated

## STOP conditions

Stop and report if:
- The drift check shows an in-scope file changed and an excerpt no longer
  matches — especially `OptimizationEngine.tsx` or `ReportingDashboard.tsx`,
  whose reveal structure could shift.
- `useInViewProps` cannot be imported in a product visual through
  `@/components/product/motion` and you're unsure of the correct import path —
  report rather than guessing (the shim is `src/components/product/motion.tsx`,
  which does `export * from "@/components/motion"`).
- A migrated visual renders blank/invisible in the reduced-motion spec — that
  means the helper's `animate="show"` isn't taking; report it.

## Maintenance notes

- New scroll reveals should use `RevealStagger`/`RevealItem` (for `motion.div`)
  or `useInViewProps()` (for other elements like `motion.tbody`). Spreading raw
  `inViewProps` reintroduces this bug — consider an ESLint `no-restricted-syntax`
  rule against `{...inViewProps}` outside `Reveal.tsx` as a follow-up.
- This plan fixes the **reduced-motion** fail-open contract. A separate,
  larger concern remains for non-reduced-motion users: `whileInView` reveals SSR
  with inline `opacity:0`, so a fully failed hydration could strand content. That
  is inherent to the reveal pattern and is explicitly deferred — flag it if the
  project later sees hydration failures in the field.
- Reviewer should confirm no visual behaved differently for normal-motion users
  (the non-reduced path is byte-equivalent to the old `inViewProps` spread).
