# M4 Touch-Target Audit

Generated 2026-05-20. Run via: `PLAYWRIGHT_BASE_URL=http://localhost:3100 npx playwright test tests/responsive/touch-targets.spec.ts`

Asserts every visible interactive element (`a`, `button`, `[role="button"]`, checkbox, radio) measures at least 44×44 CSS pixels at a 375×812 viewport. The 44px floor comes from CLAUDE.md §11 (WCAG 2.2 AA touch-target minimum) and Apple HIG.

## Status

**11 / 11 routes passing at HEAD.** Spec is green.

| Route | Result |
|---|---|
| `/` | ok |
| `/platform` | ok |
| `/platform/placement` | ok |
| `/platform/optimization` | ok |
| `/platform/issues` | ok |
| `/platform/reporting` | ok |
| `/solutions` | ok |
| `/why-dplat` | ok |
| `/company` | ok |
| `/resources` | ok |
| `/demo` | ok |

## What this guards against

Touch targets below 44×44 force precision tapping on phones and are the most common a11y regression when developers compose new layouts from inline `<Link>` elements or `size="text"` ghost buttons. The audit runs at 375 because that's the iPhone 12 mini / 13 mini width, the narrowest first-class iOS target. For the same element, a 44px floor at 375 holds at 320 since none of the touch utilities scale with viewport. Layout-level regressions at 320 are still possible and are covered by the breakpoint-matrix spec. Re-run this spec whenever a new interactive element ships to a public route, or when a shared component (`Button`, `CardGrid`, `SiteHeader`, `SiteFooter`) changes class names.

## Initial failures (pre-fix snapshot)

The first run flagged the same set of offenders across every route (the global header + footer chrome) plus a handful of route-specific inline CTAs:

### Header / footer chrome (all routes)

| Component | Element | Measured | Cause |
|---|---|---|---|
| `SiteHeader` | DebtNext wordmark link | 77×23 | Logo link sized only to text bounding box |
| `SiteFooter` | DebtNext wordmark link | 77×19 | Logo link sized only to text bounding box |
| `SiteFooter` | Column links (About, Blog, Privacy, etc.) | width × 19 | `<Link>` rendered as inline element, no min height |
| `SiteFooter` | LinkedIn icon link | 20×20 | Bare SVG inside link, no padded hit area |
| `layout.tsx` | Skip-to-main-content link | 1×1 | `sr-only` utility (w-1 h-1 + clip) measured as 1×1 even though the link grows to ~140×48 when focused |

### Design-system buttons

| Component | Element | Measured | Cause |
|---|---|---|---|
| `ui/button.tsx` (primary `md`) | "Request a demo" submit in `DemoForm`, Header CTA at md+ | 180×40 | DESIGN.md §8.1 specifies a 40px pill height; CLAUDE.md §11 requires 44px floor |
| `ui/button.tsx` (size `text`) | BenefitSplit ghost link "Explore placement management →" | 247×15 | Inline-styled to text leading only, no minimum height |

### Route-specific

| Route | Component | Element | Measured |
|---|---|---|---|
| `/platform` | `CardGrid` card footer link | "Explore placement →" etc. ×4 | 293×23 |
| `/company` | inline link on TSI ownership section | "Visit tsico.com →" | width × 23 |

## Fixes applied

All fixes use the Tailwind v4 `@utility` classes added in Task 1 (Phase 1 foundation): `min-h-touch`, `min-w-touch`, `min-size-touch`. These resolve to `min-height: var(--size-touch)` where `--size-touch: 44px`.

| File | Change | Justification |
|---|---|---|
| `src/components/ui/button.tsx` | Primary `md` size: added `min-h-touch` alongside `h-10`. | Preserves the design intent (40px pill) as a visual target while ensuring the rendered hit area is 44px. Width on every primary button already exceeds 44 because of `px-5` + label. |
| `src/components/ui/button.tsx` | Ghost `text` size: added `inline-flex min-h-touch items-center` alongside `h-auto`. | Secondary ghost CTAs ("Explore X →") now hit 44px tall without growing their visual text size. Both call sites (`PageHero`, `BenefitSplit`) already wrap them in their own block container, so the taller hit area doesn't shift layout. |
| `src/components/site/SiteHeader.tsx` | Wordmark link: added `inline-flex min-h-touch min-w-touch items-center`. | Logo link in the fixed header now occupies a full touch-sized hit area without changing wordmark visual size. |
| `src/components/site/SiteFooter.tsx` | Wordmark link: same pattern as header. | Same rationale. |
| `src/components/site/SiteFooter.tsx` | Footer column links: added `inline-flex min-h-touch min-w-touch items-center`. | Each link grows to 44×44. The column already uses `space-y-3` (12px gap), so the column gets taller on mobile but readability improves. Narrower labels ("Blog", "Terms") gain a 44×44 box without pushing siblings (they're in a flex column). |
| `src/components/site/SiteFooter.tsx` | LinkedIn icon link: added `inline-flex min-size-touch items-center justify-center`. | Centers the 20×20 SVG inside a 44×44 hit area. |
| `src/app/layout.tsx` | Skip link: removed `sr-only focus:not-sr-only` (kept `.skip-link`). | The `.skip-link` rule already uses `position: absolute` + `transform: translateY(-200%)` to hide the link off-screen until focused. The `sr-only` utility was redundant (it forced w-1 h-1 + clip, which made the audit measure 1×1). Without it, the link's bounding rect is the full visible-when-focused size (~140×48) but the translateY still keeps it off-screen for sighted users. Keyboard / screen-reader behavior is unchanged: focus un-translates it. |
| `src/components/sections/CardGrid.tsx` | Card footer link: added `min-h-touch` to the existing inline-flex. | Already inline-flex; this just adds the height floor. |
| `src/app/company/page.tsx` | TSI ownership inline link: added `min-h-touch` to the existing inline-flex. | Same pattern as CardGrid. |

## Design intent vs touch floor

DESIGN.md §8.1 specifies primary CTAs as 40px-tall pills. CLAUDE.md §11 requires a 44px touch-target minimum. These are in tension; we chose the a11y floor (CLAUDE.md wins by explicit precedence in the project rules). The visual change is small: primary buttons render 4px taller. The pill geometry, padding, and type scale are unchanged.

## Known deferred

None.
