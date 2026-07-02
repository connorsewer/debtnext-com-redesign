# Plan 005: Extract one <Eyebrow> primitive and replace the hand-rolled eyebrow markup

> **Executor instructions**: Follow step by step. This is a mechanical refactor
> across many files — work file-by-file, run the build after each small batch,
> and confirm the grep gates. Honor STOP conditions. Update this plan's row in
> `plans/README.md` when done.
>
> **Drift check (run first)**: `git diff --stat 273ccf0..HEAD -- src/components/sections src/components/site src/app`
> Many files are in scope; if a file's eyebrow markup no longer matches the
> pattern below, handle that file individually and note it. A wholesale
> structural change to these files is a STOP condition.

## Status

- **Priority**: P2
- **Effort**: M
- **Risk**: LOW-MED
- **Depends on**: `plans/001-fix-bare-text-size-token-utilities.md` (must land first)
- **Category**: tech-debt
- **Planned at**: commit `273ccf0`, 2026-06-13

## Why this matters

The marketing "eyebrow" label (the small uppercase kicker above section
headings) is hand-rolled with the same Tailwind class string in ~40 places
across 24 files. There is no shared primitive, the string has drifted into
multiple spellings, and three of those copies were the broken
`text-[var(--text-caption)]` size variant fixed in Plan 001. Any future change
to eyebrow type, spacing, or color today means editing two-dozen files in
lockstep — and the drift already produced bugs. One small primitive collapses
that to a single source of truth.

This plan must run **after** Plan 001, so the three formerly-broken eyebrow sites
are already on the correct `text-caption` utility before they're codemodded.

## Current state

Two tone variants of the same string:

```tsx
// muted (most common) — text-tertiary
<p className="text-caption font-[480] uppercase tracking-wider text-[var(--text-tertiary)]">{eyebrow}</p>

// accent — accent-text-dark
<p className="text-caption font-[480] uppercase tracking-wider text-[var(--accent-text-dark)]">{eyebrow}</p>
```

Carried on mostly `<p>` (31×), a few `<span>` (3×: e.g. `ProcessStrip.tsx:65`),
one `<dt>` (`CaseStudyBand.tsx`), one `<h2>` (`SiteFooter.tsx:35`), and table
headers `<th>` in `CompareMatrix.tsx` / `ComparisonTable.tsx` that add layout
classes like `px-4 py-4 @lg/section:static`. Some sites prefix layout/margin
classes (e.g. `text-center`, `mt-3`).

Files in scope (24 — the `mockups/**` files are deliberately EXCLUDED, see Scope):

`src/components/sections/`: `CardGrid.tsx` (2), `IntegrationStrip.tsx` (1),
`StatMarquee.tsx` (1), `PageHero.tsx` (1), `LeadershipTable.tsx` (4),
`ProseSection.tsx` (1), `ProseIntro.tsx` (1), `LogoMarquee.tsx` (1),
`ProofBand.tsx` (1), `HomepageHandoffSection.tsx` (2), `BulletList.tsx` (1),
`IntegrationTable.tsx` (4), `CaseStudyBand.tsx` (3), `CompareMatrix.tsx` (4),
`BenefitSplit.tsx` (1), `TrustBand.tsx` (1), `ComparisonTable.tsx` (2),
`FeatureAccordion.tsx` (2), `PartnerMap.tsx` (1), `ProcessStrip.tsx` (2);
`src/components/site/SiteFooter.tsx` (1); `src/app/demo/page.tsx` (1),
`src/app/company/page.tsx` (1), `src/app/company/about/page.tsx` (1).

Existing exemplar for a polymorphic className-passthrough primitive in this repo:
`src/components/sections/SectionContainer.tsx` (takes `as`, `className`, spreads
`...rest`). Match that style.

## Commands you will need

| Purpose | Command | Expected |
|---|---|---|
| Typecheck | `npm run typecheck` | exit 0 |
| Lint | `npm run lint` | exit 0 |
| Build | `npm run build` | exit 0 |
| a11y | `npm run test:e2e -- tests/a11y` | pass |

## Scope

**In scope**: the 24 files listed above, plus the new file
`src/components/sections/Eyebrow.tsx`.

**Out of scope** (do NOT touch):
- `src/components/sections/mockups/**` (`FramedDashboard.tsx`, `ReportingMockup.tsx`,
  `VendorPerformanceMockup.tsx`, `PlacementMockup.tsx`, `IssuesMockup.tsx`) —
  these are owned by the in-flight Phase 13 consolidation and four are being
  deleted. Leave their eyebrow markup alone; Phase 13 handles them.
- `src/components/product/primitives/EyebrowLabel.tsx` — that is the **product-
  visual** eyebrow (different size/letter-spacing/color, `--status-focus`); it is
  a separate system. Do not merge it into this primitive.
- Any non-eyebrow use of `text-tertiary`/`accent-text-dark` (body copy, links).

## Git workflow

- Branch: `advisor/005-eyebrow-primitive`
- Conventional commits; suggested: `refactor(ui): extract <Eyebrow> primitive` for
  the primitive, then `refactor(ui): adopt <Eyebrow> across sections` for the
  codemod (or commit per logical batch).
- Do NOT push or open a PR unless instructed.

## Steps

### Step 1: Create the Eyebrow primitive

Create `src/components/sections/Eyebrow.tsx`:

```tsx
import * as React from "react";
import { cn } from "@/lib/utils";

type EyebrowTone = "muted" | "accent";

export interface EyebrowProps extends React.HTMLAttributes<HTMLElement> {
  /** Color tone. "muted" = --text-tertiary (default); "accent" = --accent-text-dark. */
  tone?: EyebrowTone;
  /** Element to render. Default "p". Use "span"/"th"/"dt" to match the host markup. */
  as?: "p" | "span" | "th" | "dt" | "h2" | "div";
}

const TONE: Record<EyebrowTone, string> = {
  muted: "text-[var(--text-tertiary)]",
  accent: "text-[var(--accent-text-dark)]",
};

/** Section eyebrow kicker. Single source of truth for the uppercase caption
 *  label above headings (DESIGN.md type scale, caption). */
export function Eyebrow({ tone = "muted", as = "p", className, ...rest }: EyebrowProps) {
  const Tag = as as React.ElementType;
  return (
    <Tag
      className={cn("text-caption font-[480] uppercase tracking-wider", TONE[tone], className)}
      {...rest}
    />
  );
}
```

**Verify**: `npm run typecheck` → exit 0.

### Step 2: Codemod the simple `<p>` sites (muted and accent)

For each in-scope file, replace the hand-rolled eyebrow `<p>` with `<Eyebrow>`:
- muted: `<p className="text-caption font-[480] uppercase tracking-wider text-[var(--text-tertiary)]">X</p>`
  → `<Eyebrow>X</Eyebrow>`
- accent: `...text-[var(--accent-text-dark)]...` → `<Eyebrow tone="accent">X</Eyebrow>`
- If the original `<p>` had EXTRA classes (e.g. `text-center`, `mt-3`), preserve
  them via `className`: `<Eyebrow className="text-center">X</Eyebrow>`.
- Add `import { Eyebrow } from "@/components/sections/Eyebrow";` to each file.

Do this file-by-file. After every ~5 files: `npm run build` → exit 0.

### Step 3: Handle the non-`<p>` sites explicitly

- `<span>` sites (e.g. `ProcessStrip.tsx:65`): `<Eyebrow as="span" tone="accent">…</Eyebrow>`
  (preserve original tone — ProcessStrip's step label is accent).
- `<dt>` site (`CaseStudyBand.tsx`): `<Eyebrow as="dt" className="…orig layout…">…</Eyebrow>`.
- `<h2>` site (`SiteFooter.tsx:35`): keep it an `<h2>` for heading semantics —
  `<Eyebrow as="h2">…</Eyebrow>`.
- `<th>` sites (`CompareMatrix.tsx`, `ComparisonTable.tsx`): these carry layout
  classes (`px-4 py-4`, `@lg/section:*`, width utilities). Use
  `<Eyebrow as="th" className="…all the original non-eyebrow classes…">…</Eyebrow>`,
  moving ONLY the eyebrow string (`text-caption font-[480] uppercase tracking-wider
  text-[var(--text-tertiary)]`) into the primitive and leaving every layout class
  in `className`.

**Verify after Step 3**: `npm run typecheck` → 0; `npm run build` → 0.

### Step 4: Confirm no hand-rolled eyebrow strings remain (outside the primitive and mockups)

**Verify**: this grep returns matches ONLY in `Eyebrow.tsx` and in
`src/components/sections/mockups/**`:
```
grep -rEn '(text-caption|text-\[var\(--text-caption\)\]) font-\[480\] uppercase tracking-wider' src/
```
Every other former site should now read `<Eyebrow …>`.

## Test plan

- No new unit tests (presentational primitive; no render-test layer). Behavior is
  byte-equivalent CSS, so existing a11y/visual specs are the regression net.
- `npm run test:e2e -- tests/a11y` → pass (heading semantics preserved: the
  `SiteFooter` eyebrow stays an `<h2>`; table headers stay `<th>`).

## Done criteria

ALL must hold:
- [ ] `src/components/sections/Eyebrow.tsx` exists with `tone` + `as` + className passthrough
- [ ] grep in Step 4 returns only `Eyebrow.tsx` + `mockups/**`
- [ ] every in-scope file imports and uses `<Eyebrow>`; tones preserved (accent stays accent)
- [ ] heading/semantic elements unchanged (`<h2>` footer eyebrow, `<th>`/`<dt>` preserved via `as`)
- [ ] `npm run typecheck` / `lint` / `build` exit 0
- [ ] `npm run test:e2e -- tests/a11y` passes
- [ ] No files outside scope modified — **especially no `mockups/**` edits** (`git status`)
- [ ] `plans/README.md` row updated

## STOP conditions

Stop and report if:
- Plan 001 has not landed (the three formerly-broken eyebrow sites still read
  `text-[var(--text-caption)]`) — run 001 first.
- A site's eyebrow has a tone or element you can't map to `muted`/`accent` +
  `as` — report it rather than inventing a new tone.
- The grep in Step 4 still finds matches outside `Eyebrow.tsx`/`mockups/**` you
  can't resolve.
- You find yourself needing to edit a `mockups/**` file — STOP; that's Phase 13's.

## Maintenance notes

- New sections must use `<Eyebrow>`; never hand-roll the class string again.
  Consider an ESLint `no-restricted-syntax` rule on the literal as a follow-up.
- When Phase 13 finishes consolidating `mockups/**`, the survivors
  (`index.tsx`, `FramedDashboard.tsx`) can adopt `<Eyebrow>` in a later sweep.
- Reviewer should confirm the `<th>`/`<h2>`/`<dt>` semantics are preserved (the
  refactor must not turn a heading or table header into a `<p>`).
