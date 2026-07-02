# Plan 001: Restore font-size on nav, footer, mobile nav, and hero/newsletter forms

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md`.
>
> **Drift check (run first)**: `git diff --stat 273ccf0..HEAD -- src/components/site src/components/ui/AttachedForm.tsx src/components/sections/TrustBand.tsx src/components/sections/ProofBand.tsx`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: S
- **Risk**: LOW
- **Depends on**: none
- **Category**: bug
- **Planned at**: commit `273ccf0`, 2026-06-13

## Why this matters

This codebase uses Tailwind CSS v4. In Tailwind v4 an arbitrary value written as
`text-[var(--something)]` is **type-ambiguous** — the `text-` namespace covers
both `font-size` and `color`, and a bare CSS variable gives the compiler no way
to know which one is meant. Tailwind resolves the ambiguity toward a **color**
utility, emitting `color: var(--text-h4)`. Since `--text-h4` resolves to a
`clamp(...)` length (not a color), the declaration is invalid and the browser
drops it. **The intended font-size never applies.**

The result is silently wrong type sizing on the site's most-visible chrome:
footer eyebrows render at the inherited body size (~16px) instead of 12px
caption, footer links/legal at ~16px instead of 13–14px, the two wordmarks and
mobile-nav links at ~16px instead of the 18–21px h4, and the line-heights that
ride along with each token are lost. The repo already knows the fix: `button.tsx`
uses the disambiguated `text-[length:var(--text-body-strong)]` form, with a code
comment explaining exactly this hazard (`src/components/ui/button.tsx:34`).

After this plan, those 15 sites use the project's first-class type utilities
(`text-h4`, `text-body-strong`, `text-body-sm`, `text-caption`), which apply the
correct font-size, line-height, and weight from the design tokens.

## Current state

The project's Tailwind v4 theme (`src/app/globals.css`, `@theme inline` block)
registers the type scale as `--text-*` keys, e.g.:

```css
--text-h4: clamp(1.125rem, calc(1.0625rem + 0.2778vw), 1.3125rem);  /* 18 → 21 */
--text-h4--line-height: 1.19;
--text-h4--font-weight: 480;
--text-caption: 0.75rem;                /* 12 */
--text-body-sm: clamp(0.8125rem, ...);  /* 13 → 14 */
--text-body-strong: clamp(0.9375rem, ...);
```

Because these are registered as theme keys, Tailwind v4 **auto-generates
first-class utilities** `text-h4`, `text-caption`, `text-body-sm`,
`text-body-strong` (etc.) that emit the matching `font-size` (+ line-height +
weight). The rest of the codebase already uses these heavily and correctly
(e.g. `CardGrid.tsx:63` uses `text-caption font-[480] ...`). The bug is confined
to the 15 sites that wrote the **size** token as a bare arbitrary value.

The proof the bare form is wrong, already in the repo:

```tsx
// src/components/ui/button.tsx:34-35
// The `length:` data type hint disambiguates this from a color
// utility for tailwind-merge, so the variant's text color is kept.
md: "h-10 min-h-touch px-5 text-[length:var(--text-body-strong)] font-[480] leading-none",
```

The 15 affected sites (each: replace ONLY the `text-[var(--text-…)]` size token,
keep every other class on the line unchanged):

| File:line | Current size token | Replace with |
|---|---|---|
| `src/components/site/SiteHeader.tsx:74` | `text-[var(--text-h4)]` | `text-h4` |
| `src/components/site/SiteHeader.tsx:91` | `text-[var(--text-body-strong)]` | `text-body-strong` |
| `src/components/site/SiteFooter.tsx:23` | `text-[var(--text-h4)]` | `text-h4` |
| `src/components/site/SiteFooter.tsx:28` | `text-[var(--text-body-sm)]` | `text-body-sm` |
| `src/components/site/SiteFooter.tsx:35` | `text-[var(--text-caption)]` | `text-caption` |
| `src/components/site/SiteFooter.tsx:43` | `text-[var(--text-body-sm)]` | `text-body-sm` |
| `src/components/site/SiteFooter.tsx:55` | `text-[var(--text-body-sm)]` | `text-body-sm` |
| `src/components/site/SiteFooter.tsx:58` | `text-[var(--text-body-sm)]` | `text-body-sm` |
| `src/components/site/MobileNav.tsx:68` | `text-[var(--text-h4)]` | `text-h4` |
| `src/components/site/MobileNav.tsx:109` | `text-[var(--text-h4)]` | `text-h4` |
| `src/components/ui/AttachedForm.tsx:55` | `text-[var(--text-body-strong)]` | `text-body-strong` |
| `src/components/ui/AttachedForm.tsx:60` | `text-[var(--text-body-strong)]` | `text-body-strong` |
| `src/components/sections/TrustBand.tsx:26` | `text-[var(--text-caption)]` | `text-caption` |
| `src/components/sections/TrustBand.tsx:36` | `text-[var(--text-body-strong)]` | `text-body-strong` |
| `src/components/sections/ProofBand.tsx:70` | `text-[var(--text-caption)]` | `text-caption` |

Important per-line note for `AttachedForm.tsx:55` — the line currently has BOTH
`text-[var(--text-body-strong)]` (the broken size) AND `text-[var(--foreground)]`
(a valid color). After the fix the line reads `... text-body-strong ... text-[var(--foreground)] ...`:
a size utility plus a color utility, which is correct. Do not remove the
`text-[var(--foreground)]` color.

## Commands you will need

| Purpose | Command | Expected on success |
|---|---|---|
| Typecheck | `npm run typecheck` | exit 0, no errors |
| Lint | `npm run lint` | exit 0 |
| Build (compiles Tailwind) | `npm run build` | exit 0, build completes |
| a11y specs | `npm run test:a11y` | all pass |

Notes from recon: `next dev` / `next start` hang in this sandbox, but
`next build`, `tsc --noEmit`, and Playwright all run locally — use them. Do not
rely on a running dev server.

## Scope

**In scope** (modify only these):
- `src/components/site/SiteHeader.tsx`
- `src/components/site/SiteFooter.tsx`
- `src/components/site/MobileNav.tsx`
- `src/components/ui/AttachedForm.tsx`
- `src/components/sections/TrustBand.tsx`
- `src/components/sections/ProofBand.tsx`

**Out of scope** (do NOT touch):
- Any `text-[var(--text-tertiary)]`, `text-[var(--foreground)]`,
  `text-[var(--muted-foreground)]`, `text-[var(--accent-text-dark)]` etc. —
  these are **color** tokens used correctly as colors. Only the SIZE tokens
  (`--text-h4`, `--text-body-strong`, `--text-body-sm`, `--text-caption`,
  `--text-h1..3`, `--text-display-*`, `--text-body-lg/md`) are in scope.
- `src/components/ui/button.tsx` — already correct (uses `length:`).
- `src/app/globals.css` — the token definitions are correct; do not change them.
- `src/components/sections/HomepageHero.tsx` — its form already uses the
  first-class `text-body-strong` utility (correct); leave it.

## Git workflow

- Branch: `advisor/001-fix-text-size-tokens`
- Repo uses Conventional Commits (e.g. `fix(12): ...`). Suggested message:
  `fix(ui): apply font-size on nav/footer/forms via first-class type utilities`
- Do NOT push or open a PR unless the operator instructed it.

## Steps

### Step 1: Replace the 15 bare size-token utilities

Edit each of the 15 sites in the table above, replacing only the size-token
class with its first-class equivalent and leaving all other classes intact.

**Verify**: run this grep — it must return **zero** matches:
```
grep -rEn 'text-\[var\(--text-(h[1-4]|display-(xl|lg)|body-(lg|md|strong|sm)|caption)\)\]' src/ | grep -v 'length:'
```
→ no output.

### Step 2: Typecheck and lint

**Verify**: `npm run typecheck` → exit 0; `npm run lint` → exit 0.

### Step 3: Build to confirm Tailwind compiles the utilities

**Verify**: `npm run build` → exit 0, build completes with no CSS/compile errors.

### Step 4: Optional stronger gate — confirm computed font-size (only if a preview URL is available)

If (and only if) you can run the app against a preview/production URL with
Playwright (do not start a dev server), assert that a footer eyebrow's computed
`font-size` is 12px (caption) and a footer link is ~13–14px, not the ~16px body
size. If no preview URL is available, skip this step; Steps 1–3 are sufficient.

## Test plan

No new unit tests — this is a className correctness fix and the codebase has no
component-render test layer for marketing sections. Regression protection comes
from:
- The grep in Step 1 (no bare size tokens remain).
- The existing a11y specs: `npm run test:a11y` must still pass (these iterate the
  visual routes and would surface a broken render).

**Verification**: `npm run test:a11y` → all pass.

## Done criteria

ALL must hold:
- [ ] `grep -rEn 'text-\[var\(--text-(h[1-4]|display-(xl|lg)|body-(lg|md|strong|sm)|caption)\)\]' src/ | grep -v 'length:'` → no matches
- [ ] `npm run typecheck` exits 0
- [ ] `npm run lint` exits 0
- [ ] `npm run build` exits 0
- [ ] `npm run test:a11y` passes
- [ ] No files outside the in-scope list are modified (`git status`)
- [ ] `plans/README.md` status row updated

## STOP conditions

Stop and report back (do not improvise) if:
- The drift check shows any in-scope file changed and an excerpt no longer
  matches the live code.
- After Step 1 the grep still returns matches you cannot account for (a new
  site, or a size token you're unsure about) — report the list rather than
  guessing.
- `npm run build` fails on a CSS/unknown-utility error for any of `text-h4`,
  `text-body-strong`, `text-body-sm`, `text-caption` — this would mean the
  utility is not generated as assumed; report it instead of inventing a
  workaround.

## Maintenance notes

- Root cause is a Tailwind v4 footgun: prefer the first-class `text-h4` /
  `text-caption` utilities everywhere; only use `text-[length:var(--text-…)]`
  if an arbitrary form is truly required. Never write a size token as a bare
  `text-[var(--text-…)]`.
- A reviewer should confirm no color was accidentally dropped on
  `AttachedForm.tsx:55` (it must keep `text-[var(--foreground)]`).
- Plan 005 (eyebrow primitive) will later consolidate three of these eyebrow
  sites; landing 001 first means 005 codemods already-correct markup.
