# Plan 004: Token-fidelity batch — icon-tile gradient, nav underline, attached-form radius, hero weight

> **Executor instructions**: Follow step by step; the four steps are
> independent. Run every verification command. Honor STOP conditions. Update
> this plan's row in `plans/README.md` when done. Per the repo rule (memory:
> "docs stay in sync with code"), the DESIGN.md edit in Step 4 ships in the
> **same commit** as the hero code change it describes.
>
> **Drift check (run first)**: `git diff --stat 273ccf0..HEAD -- src/app/globals.css src/components/motion/hover.module.css src/components/ui/AttachedForm.tsx src/components/sections/HomepageHero.tsx src/components/product/visuals/PlatformSystemMap.tsx src/components/product/visuals/ComplianceStandards.tsx src/components/product/visuals/OptimizationEngine.tsx src/components/product/visuals/DecisionEnginePreview.tsx DESIGN.md`
> On any mismatch with "Current state", STOP.

## Status

- **Priority**: P2
- **Effort**: S
- **Risk**: LOW
- **Depends on**: none
- **Category**: tech-debt (design-system fidelity)
- **Planned at**: commit `273ccf0`, 2026-06-13

## Why this matters

The design system is token-driven and `CLAUDE.md` §3/§16 forbid local color and
type values outside `DESIGN.md`. Four small drifts have crept in that each
weaken that contract:

1. An off-token hex `#3949B5` is hardcoded as a gradient endpoint, copy-pasted
   across four product visuals.
2. The nav/link hover underline renders in the lavender focus color
   (`#9CB4E8`), but `DESIGN.md` §8.2 specifies the indigo `#5266EB`.
3. The `AttachedForm` component uses 999px pill radii, but `DESIGN.md` §8.3
   specifies the 32px (`--radius-md`) half-pill — the hero's attached form
   already follows the spec, so the two diverge.
4. The cinematic hero H1 uses `font-[500]`, a weight `DESIGN.md` §4.2 does not
   sanction (it lists only 400 / 420 / 480). Meanwhile the product-visual system
   uses `font-[500]` pervasively as its UI weight with no documented exception.

After this plan: the gradient endpoint is a token, the underline matches spec,
the attached-form radius language is consistent, the hero conforms to a
sanctioned weight, and the product-visual `500` convention is recorded in
DESIGN.md so it's a documented exception rather than ~60 silent violations.

## Current state

**(1) Off-token gradient** — identical tile in four files:
```tsx
// PlatformSystemMap.tsx:110 (this one is a motion.span with variants={popItem})
className="h-[18px] w-[18px] shrink-0 rounded-[5px] bg-gradient-to-br from-[#5266EB] to-[#3949B5]"
// ComplianceStandards.tsx:58, OptimizationEngine.tsx:59, DecisionEnginePreview.tsx:94
className="h-5 w-5 shrink-0 rounded-[5px] bg-gradient-to-br from-[#5266EB] to-[#3949B5]"
```
`#5266EB` is `--primary`. `#3949B5` is not a token but already appears in
`product/visuals/parts.tsx:9` `INDIGO_SHADES` (the backlog item BL-03 will
tokenize that file separately — out of scope here). The product-visual token
block in `globals.css:220-233` is theme-independent (defined once in `:root`,
not re-declared in `.dark`):
```css
/* ---- Product-visual tokens (always dark; theme-independent) ---- */
--status-success: #5BCB89;
...
--product-text-muted: #6B6B7B;
```

**(2) Nav underline** — `src/components/motion/hover.module.css:48-49`:
```css
.hoverUnderline {
  background-image: linear-gradient(#9cb4e8, #9cb4e8);   /* = --focus */
```
`DESIGN.md` §8.2 "Inline link on dark → Hover underline color: `#5266EB`." Applied
to nav links via `SiteHeader.tsx:94` (`hover.hoverUnderline`).

**(3) Attached-form radius** — `src/components/ui/AttachedForm.tsx:55,60` use
`rounded-[var(--radius-xl)]` (999px) on input and submit. `DESIGN.md` §8.3 spec:
```css
.form-attached input  { border-radius: 32px 0 0 32px; }   /* radius-md left */
.form-attached button { border-radius: 0 32px 32px 0; }   /* radius-md right */
```
The hero form already matches (`HomepageHero.tsx:236,240`:
`rounded-l-[var(--radius-md)]` / `rounded-r-[var(--radius-md)]`). NOTE:
`AttachedForm` is **currently unused in production** (its docstring: "remains for
the email-capture hero variant if we use it on any v2 page") — so this is a
low-impact consistency fix that prevents a wrong surface when v2 uses it.

**(4) Hero weight** — `src/components/sections/HomepageHero.tsx:206-210`:
```tsx
className="text-balance text-[clamp(2.75rem,8vw,7rem)] font-[500] leading-[0.95] tracking-[-0.02em] text-white"
style={{ fontVariationSettings: '"wght" 500', textShadow: "..." }}
```
`DESIGN.md` §4.2: "Use weight changes sparingly: 400 for standard body, 420 for
UI emphasis, 480 for display emphasis." `480` is the heaviest sanctioned weight.
DESIGN.md §4.2 also already documents a scoped exception (General Sans 600 for the
wordmark) — that note is the format to mirror for the product-visual `500`.

## Commands you will need

| Purpose | Command | Expected |
|---|---|---|
| Typecheck | `npm run typecheck` | exit 0 |
| Lint | `npm run lint` | exit 0 |
| Build | `npm run build` | exit 0 |

`next dev`/`start` hang here; build/tsc/Playwright run.

## Scope

**In scope**: `src/app/globals.css`, `src/components/motion/hover.module.css`,
`src/components/ui/AttachedForm.tsx`, `src/components/sections/HomepageHero.tsx`,
`PlatformSystemMap.tsx`, `ComplianceStandards.tsx`, `OptimizationEngine.tsx`,
`DecisionEnginePreview.tsx`, `DESIGN.md`.

**Out of scope**:
- `product/visuals/parts.tsx` `INDIGO_SHADES` — that's backlog item BL-03; do not
  touch it here (but Step 1's new token is the one BL-03 should later reuse).
- The ~60 `font-[500]` sites in `src/components/product/**` — do NOT change them;
  Step 4 *documents* them, it does not edit them.
- `button.tsx` primary pill radius (40px) — a different component; leave it.
- `Console.tsx` — active Phase 13 work.

## Git workflow

- Branch: `advisor/004-token-fidelity`
- Conventional commits; keep the DESIGN.md edit in the same commit as the hero
  change (Step 4). Example: `fix(visuals): tokenize indigo gradient endpoint`.
- Do NOT push or open a PR unless instructed.

## Steps

### Step 1: Tokenize the icon-tile gradient endpoint

- In `globals.css`, inside the product-visual token block (`:root`, near
  `--product-text-muted`), add:
  ```css
  --primary-deep: #3949B5; /* indigo gradient endpoint for product-visual tiles */
  ```
- In the four files, replace `from-[#5266EB] to-[#3949B5]` with
  `from-[var(--primary)] to-[var(--primary-deep)]`. For `PlatformSystemMap.tsx:110`
  keep it a `motion.span` with `variants={popItem}` — change only the gradient
  classes. The other three are plain `<span>`; change only the gradient classes.

**Verify**: `grep -rn '#3949B5\|#3949b5' src/components/product/visuals/` → only
`parts.tsx:9` remains (the out-of-scope BL-03 site). `npm run build` → exit 0.

### Step 2: Set the nav/link hover underline to the spec color

In `hover.module.css:49`, change the underline gradient from
`linear-gradient(#9cb4e8, #9cb4e8)` to `linear-gradient(var(--primary), var(--primary))`
(CSS modules can read global custom properties). This both removes the hardcoded
hex and conforms to `DESIGN.md` §8.2.

**Verify**: `grep -n '#9cb4e8' src/components/motion/hover.module.css` → no
matches. `npm run build` → 0. (This is a visible change: nav-link hover underline
becomes indigo. It matches the written spec; see maintenance notes.)

### Step 3: Align AttachedForm radius to §8.3 (low priority — component unused)

In `AttachedForm.tsx`, change the input (`:55`) and submit (`:60`) radii from
`--radius-xl` to `--radius-md` everywhere they appear on those two elements
(including the `@sm/form:` variants), so the attached-form radius language
matches the §8.3 32px spec and the hero. Do not restructure the container layout
or change anything else.

**Verify**: `grep -n 'radius-xl' src/components/ui/AttachedForm.tsx` → no matches
on the input/button (the outer `@sm/form:rounded-[var(--radius-xl)]` container
pill MAY remain — that is the container, not the input/button; if you're unsure
whether to change the container too, leave it and note it). `npm run build` → 0.

### Step 4: Conform hero H1 weight + document the product-visual 500 convention

- In `HomepageHero.tsx:206-210`, change `font-[500]` → `font-[480]` and
  `fontVariationSettings: '"wght" 500'` → `'"wght" 480'`.
- In `DESIGN.md` §4.2, directly after the existing "Wordmark exception
  (sanctioned)" paragraph, add a parallel sanctioned-exception note, e.g.:
  > **Product-visual weight exception (sanctioned):** the self-contained
  > product-visual chrome in `src/components/product/**` uses Inter 500 (medium)
  > as its UI weight for dashboard labels and figures. This is a scoped
  > exception to the 400/420/480 marketing scale, consistent with §4.1/§7.4
  > treating product visuals as a separate miniature dashboard system. Weight
  > 500 is approved for `src/components/product/**` only; all marketing surfaces
  > use 400/420/480.

**Verify**: `grep -rn 'font-\[500\]' src/components/sections/` → no matches (the
hero was the only marketing-surface 500). `grep -rn 'font-\[500\]' src/components/product/ | wc -l` → still ~60 (unchanged, now documented). `npm run build` → 0.

## Test plan

- No new unit tests (className/token changes; no render-test layer).
- Existing `npm run test:e2e -- tests/a11y` and the LHCI gates must still pass.
- Verification: `npm run build` → 0; `npm run typecheck` → 0; `npm run lint` → 0.

## Done criteria

ALL must hold:
- [ ] `--primary-deep` token defined; no `#3949B5` outside `parts.tsx`
- [ ] no `#9cb4e8` literal in `hover.module.css`
- [ ] AttachedForm input/button use `--radius-md`
- [ ] hero H1 weight is 480 (class + fontVariationSettings); no `font-[500]` in `src/components/sections/`
- [ ] DESIGN.md §4.2 records the product-visual 500 exception
- [ ] `npm run typecheck` / `lint` / `build` exit 0
- [ ] No files outside scope modified (`git status`)
- [ ] `plans/README.md` row updated

## STOP conditions

Stop and report if:
- Any drift-check excerpt no longer matches live code.
- CSS modules in this project cannot resolve `var(--primary)` (Step 2 build
  fails) — report; do not reintroduce a hex.
- You're unsure whether changing the hero weight degrades the hero look — it is
  a deliberate, reversible, spec-grounded choice; proceed to 480 and note it in
  your report so a human can eyeball it.

## Maintenance notes

- **Two changes are visible and worth a human eyeball on the preview:** the
  nav-link hover underline color (Step 2, lavender → indigo) and the hero H1
  weight (Step 4, 500 → 480). Both conform the code to the written DESIGN.md
  spec. If Connor prefers the previous look, the reversal is one line each — and
  in that case the *spec* should be updated to match (don't leave code and spec
  disagreeing).
- The `--primary-deep` token is the value BL-03 should adopt when it tokenizes
  `parts.tsx` `INDIGO_SHADES`.
- Follow-up deferred (hygiene, no visual change): the inline `rgba(82,102,235,…)`
  primary literals in `hover.module.css`, `CursorGlow.module.css`, and
  `AmbientField.module.css` could be tokenized via an `--primary-rgb` channel
  token. Not done here to keep this batch low-risk.
