# Plan 006: Make dense product visuals adapt to narrow containers

> **Executor instructions**: This plan has real layout judgment per visual — it
> is best run by a capable model with the ability to view rendered output at
> narrow widths (Playwright screenshots against a preview/production build), and
> its result should get a human visual review. Do Step 1 (the proof on one
> visual) and STOP for review before fanning out to the rest. Honor STOP
> conditions. Update `plans/README.md` when done.
>
> **Drift check (run first)**: `git diff --stat 273ccf0..HEAD -- src/components/product/visuals src/components/product/primitives/ProductCanvas.tsx`
> Several of these files are also touched by Plans 002 and 004; ideally run those
> first. On any excerpt mismatch, STOP.

## Status

- **Priority**: P2
- **Effort**: L (multi-day)
- **Risk**: MED
- **Depends on**: none (but soft-ordered AFTER 002 and 004 to avoid churn — see notes)
- **Category**: tech-debt (responsive)
- **Planned at**: commit `273ccf0`, 2026-06-13

## Why this matters

The product visuals are the proof in "product visuals explain, don't decorate"
(`.impeccable.md`). They render inside `ProductCanvas`, which establishes a CSS
`@container` (`ProductCanvas.tsx:32`) — but only 1 of ~10 visuals actually uses
container-query variants to adapt. The rest hardcode 3–5 column grids and dense
fixed-px tables. Inside the homepage feature accordion (single column below the
1024px container) and `ProductVisualBand` (`max-w-3xl`), the inner content box on
a 360px phone is roughly 280px wide after the `p-[26px]` padding. A 5-column
lifecycle spine, a 3×3 module grid, and 3–4-column data tables crush into ~50px
columns — labels and tabular figures collide or truncate. `DESIGN.md` §9 states
"Components use container queries to react to their container," and the visual
system opted out. This degrades every platform/solutions page that pairs copy
with a live visual (~10 pages) on mobile.

After this plan, each dense visual collapses its multi-column grids to stacked /
fewer-column layouts at small container widths, following the one visual that
already does it right.

## Current state

The exemplar — `ReportingDashboard.tsx:63` (the ONLY visual using `@`-queries):
```tsx
<motion.div className="mt-4 grid grid-cols-1 gap-3 @md:grid-cols-2" ...>
```
`ProductCanvas` is the query context:
```tsx
// src/components/product/primitives/ProductCanvas.tsx:32
"@container relative isolate h-full overflow-hidden rounded-[16px] bg-[var(--product-canvas)] p-[26px]"
```

Tailwind v4 container-query sizes (named): `@sm`≈384px, `@md`≈448px, `@lg`≈512px,
`@xl`≈576px, `@2xl`≈672px (container width, not viewport). The desktop render is
~700px container (→ `@2xl`+ region); mobile is ~280px (→ below `@sm`). So the
**default (no prefix) classes should be the mobile-collapsed layout**, and
`@sm`/`@md`/`@lg` progressively restore the wide layout.

Worklist — fixed/dense grids to make responsive (verified at planned-at SHA):

| File:line | Current grid | Recommended responsive form |
|---|---|---|
| `PlatformSystemMap.tsx:67` | `grid grid-cols-5` (lifecycle spine) | keep 5 abreast only when wide; below `@sm` allow it to remain a single horizontal row but shrink — or wrap. Try `grid-cols-5` kept (it's compact: number dot + short word) but verify the labels ("Load"…"Report") don't clip at 280px; if they do, reduce label size at narrow `@` width or wrap to 2 rows. |
| `PlatformSystemMap.tsx:99` | `grid grid-cols-3` (3×3 modules) | `grid-cols-1 @sm:grid-cols-2 @lg:grid-cols-3` |
| `OptimizationEngine.tsx:49` | `grid-cols-[2fr_1fr_1fr]` (vendor table) | stack at narrow: `grid-cols-1 @sm:grid-cols-[2fr_1fr_1fr]` (or a label-over-value stack below `@sm`) |
| `ComplianceStandards.tsx:56` | `grid-cols-[1.4fr_2fr_auto_auto]` (4-col row) | the densest; below `@sm` drop to `grid-cols-[1fr_auto]` (name + value) and move the bar to its own row, restore 4-col at `@md` |
| `IssuesWorklist.tsx:109` | `grid grid-cols-3` (metric strip) | `grid-cols-1 @xs:grid-cols-3` or `grid-cols-1 @sm:grid-cols-3` |
| `IssuesWorklist.tsx:77` | `grid-cols-[auto_1fr_auto]` (worklist rows) | usually OK narrow (icon + title + value); verify, adjust only if it clips |
| `PlacementMatrix.tsx:70` | `grid-cols-[1.1fr_2fr_0.6fr]` | `grid-cols-1 @sm:grid-cols-[1.1fr_2fr_0.6fr]` |
| `DataStory.tsx:53` | `grid grid-cols-2` | `grid-cols-1 @sm:grid-cols-2` |
| `DecisionEnginePreview.tsx:130` | `grid grid-cols-2` | `grid-cols-1 @sm:grid-cols-2` |

The fixed-px **type** inside these visuals (`text-[10.5px]` etc.) is intentional
"software chrome" per `DESIGN.md` §4.1/§7.4 — do NOT overhaul it. This plan
collapses GRIDS (and selectively wraps the densest rows), not the type scale.

## Commands you will need

| Purpose | Command | Expected |
|---|---|---|
| Typecheck | `npm run typecheck` | exit 0 |
| Lint | `npm run lint` | exit 0 |
| Build | `npm run build` | exit 0 |
| Container-query spec | `npm run test:e2e -- tests/responsive/container-query-layouts.spec.ts` | pass |

`next dev`/`start` hang here; `next build` + Playwright run. Visual verification
at narrow width requires Playwright screenshots against a built/preview server.

## Scope

**In scope** (product visuals + their container):
`PlatformSystemMap.tsx`, `OptimizationEngine.tsx`, `ComplianceStandards.tsx`,
`IssuesWorklist.tsx`, `PlacementMatrix.tsx`, `DataStory.tsx`,
`DecisionEnginePreview.tsx`, and `ReportingDashboard.tsx` only if a row inside it
(`:75` `grid-cols-[1fr_2fr_auto]`) needs narrow help.

**Out of scope** (do NOT touch):
- `src/components/product/visuals/Console.tsx` — **active Phase 13 work**; the
  Phase 13 team owns its responsive behavior. If you believe Console needs this
  pass, STOP and report — do not edit it.
- The Phase 11 Flagship files (`*Flagship.tsx`) unless one shows the same crush;
  if so, add it with the same pattern and note it.
- Type sizes, colors, motion variants, copy, data payloads — layout grids only.
- `ProductCanvas.tsx` padding/structure (it already provides `@container`).

## Git workflow

- Branch: `advisor/006-responsive-visuals`
- One commit per visual, e.g. `fix(visuals): collapse PlatformSystemMap grids on narrow containers`.
- Do NOT push or open a PR unless instructed.

## Steps

### Step 1: Prove the pattern on PlatformSystemMap, then STOP for review

Make `PlatformSystemMap.tsx` responsive: apply the recommended forms for `:67`
(spine) and `:99` (3×3 modules). Render it at container widths ~280px, ~450px,
and ~700px (Playwright screenshot against a preview build, or have a human view
the homepage `/` feature accordion + `/platform` at 360px / tablet / desktop).
Confirm: no clipped labels, no <50px columns, the wide layout is unchanged at
desktop.

**Verify**: `npm run build` → 0; screenshots at the three widths look correct.
**Then STOP and report** with the screenshots so the layout approach is approved
before fanning out. (This prevents redoing 8 visuals with a rejected pattern.)

### Step 2: Apply the approved pattern to the remaining visuals

After Step 1 is approved, work through the worklist table, one visual per commit.
For each: apply the responsive grid, build, and screenshot at ~280px and desktop.
The densest (`ComplianceStandards.tsx:56`) likely needs row restructuring (bar on
its own line at narrow width), not just a column-count change — give it extra
care.

**Verify (per visual)**: `npm run build` → 0; narrow + desktop screenshots correct.

### Step 3: Full gate

**Verify**: `npm run typecheck` → 0; `npm run lint` → 0; `npm run build` → 0;
`npm run test:e2e -- tests/responsive/container-query-layouts.spec.ts` → pass.
If that spec asserts specific layouts, extend it to cover at least one newly
responsive visual at a narrow container width, modeled on its existing structure.

## Test plan

- Extend `tests/responsive/container-query-layouts.spec.ts` with an assertion
  that a representative visual (e.g. PlatformSystemMap module grid) is single- or
  two-column at a narrow container width and multi-column at a wide one. Model
  the new case on the spec's existing structure; don't rewrite it.
- Verification: that spec passes; LHCI/CLS gates unaffected (grid changes must not
  introduce layout shift — confirm no CLS regression in the LHCI run).

## Done criteria

ALL must hold:
- [ ] Each worklist visual collapses its dense grid(s) at narrow container widths and is unchanged at desktop
- [ ] No clipped labels / sub-50px columns at ~280px container (verified by screenshot)
- [ ] `Console.tsx` untouched
- [ ] Fixed-px type/colors/data/motion unchanged
- [ ] `npm run typecheck` / `lint` / `build` exit 0
- [ ] container-query spec passes (and covers ≥1 newly responsive visual)
- [ ] No CLS regression in LHCI
- [ ] No files outside scope modified (`git status`)
- [ ] `plans/README.md` row updated

## STOP conditions

Stop and report if:
- Step 1's pattern is not yet reviewed/approved — do not fan out to Steps 2.
- You cannot render the visuals at narrow widths in your environment (no preview/
  Playwright) — this plan needs visual verification; report that it can't be
  completed without it rather than shipping unverified responsive CSS.
- A visual's correct narrow-width behavior is genuinely ambiguous (e.g. the
  5-col spine) — report options with screenshots instead of guessing.
- Editing requires touching `Console.tsx` or a Phase 13 file.

## Maintenance notes

- New product visuals must be authored container-query-first (mobile-collapsed
  default, `@sm`/`@md`/`@lg` to expand), using `ReportingDashboard.tsx` as the
  reference.
- This plan overlaps files with Plan 002 (reveal wrappers) and Plan 004
  (icon-tile token). Land 002 and 004 first; this plan changes only grid
  classes, so merge conflicts should be trivial if it runs last.
- Reviewer should diff desktop screenshots before/after to confirm the wide
  layout is byte-identical, and eyeball the mobile homepage `/` and `/platform`.
