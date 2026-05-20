# M4 — Mobile responsive rebuild implementation plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convert debtnext.com from a desktop-first marketing rebuild into a coherent responsive system that ships calm, readable, and accessible experiences from iPhone SE through 1440px, with the Platform handoff section using a structurally different (calm static stack) architecture on phones.

**Architecture:** Tailwind v4 CSS-first + Next.js 16 App Router. Foundation tokens in `src/app/globals.css` (`@theme inline` block, semantic names like `--text-h1`, `--text-body-md`). Container queries replace viewport-based responsive primitives where the component nests. Platform handoff section gets a `useIsMobile()` matchMedia branch that bypasses GSAP entirely below 768px. QA via Playwright at 9 viewports + axe-core CI + touch-target audit + reduced-motion verification.

**Tech Stack:** Next.js 16.2.6 · React 19.2.4 · Tailwind v4 · TypeScript strict · Playwright 1.60 · @axe-core/playwright 4.11.3 · GSAP 3 (desktop-only on Platform handoff) · Framer Motion 12.

**Spec:** `docs/superpowers/specs/2026-05-20-mobile-responsive-rebuild-design.md` (approved 2026-05-20).

**Branch strategy:** all work on `m4-responsive-rebuild`. Each push deploys to a Vercel preview URL (not prod). Final task merges to `main` only after the acceptance criteria in §8 of the spec all pass.

**Per-commit docs rule:** every commit that ships a behavior change also updates the relevant section of DESIGN.md (`§9 Responsive system`) and/or HANDOFF.md. Stored as feedback memory `feedback-docs-in-sync`.

---

## File structure

**Created:**
- `playwright.config.ts` — Playwright config rooted at `tests/`.
- `tests/helpers/routes.ts` — exports the 11 route paths as a constant array.
- `tests/responsive/breakpoint-matrix.spec.ts` — visual smoke at 9 viewports × 11 routes.
- `tests/responsive/touch-targets.spec.ts` — touch-target floor audit at 375.
- `tests/responsive/reduced-motion.spec.ts` — no-animation verification.
- `tests/responsive/platform-mobile.spec.ts` — Platform handoff mobile branch contract.
- `tests/a11y/axe-routes.spec.ts` — axe-core checks at 375 and 1440 on every route.
- `.github/workflows/a11y.yml` — runs the axe-core + responsive specs on every PR.
- `docs/m4-responsive-qa.md` — pass/fail matrix, filled in as Phase 4 runs.
- `docs/m4-touch-target-audit.md` — touch-target audit output.
- `docs/m4-perf-baseline.md` — Lighthouse mobile numbers per route.
- `src/hooks/use-is-mobile.ts` — shared `useIsMobile()` hook.

**Modified:**
- `src/app/globals.css` — fluid type scale, container queries, touch-target tokens, safe-area, mobile section padding.
- `DESIGN.md` — new top-level §9 Responsive system.
- `HANDOFF.md` — M4 status across multiple commits.
- `src/components/site/SiteHeader.tsx` — safe-area-inset-top.
- `src/components/sections/FinalCTA.tsx` — safe-area-inset-bottom + touch-target.
- `src/components/forms/DemoForm.tsx` — safe-area + mobile spacing.
- `src/components/sections/SectionContainer.tsx` — mobile/tablet section padding tokens.
- `src/components/sections/FeatureAccordion.tsx` — mobile-stacked layout.
- `src/components/sections/BenefitSplit.tsx` — vertical-on-narrow override.
- `src/components/sections/ComparisonTable.tsx` — card-stack mobile fallback verification.
- `src/components/sections/ProcessStrip.tsx` — vertical timeline mobile.
- `src/components/ui/AttachedForm.tsx` — stacked-below-520 container query.
- `src/components/sections/CardGrid.tsx` — container queries replace viewport breakpoints.
- `src/components/sections/Hero.tsx`, `PageHero.tsx`, `TrustBand.tsx`, `ProofBand.tsx`, `IntegrationStrip.tsx` — fluid scale + reduced-motion sweep.
- `src/components/sections/HomepageHandoffSection.tsx` — mobile branch render via `useIsMobile()`.
- `src/components/sections/mockups/FramedDashboard.tsx` — mobile padding override.
- `src/components/sections/mockups/{Placement,VendorPerformance,Issues,Reporting}Mockup.tsx` — IntersectionObserver-driven entrance on mobile.
- `package.json` — `test:e2e`, `test:a11y` scripts.

---

## Phase 1 — Foundation

### Task 1: Branch + Playwright scaffold + test scripts

**Files:**
- Modify: `package.json` (scripts block)
- Create: `playwright.config.ts`
- Create: `tests/helpers/routes.ts`

- [ ] **Step 1: Create feature branch**

```bash
git checkout -b m4-responsive-rebuild
```

Expected: `Switched to a new branch 'm4-responsive-rebuild'`

- [ ] **Step 2: Add test scripts to package.json**

Modify `package.json` scripts block to add:

```json
"test:e2e": "playwright test",
"test:e2e:ui": "playwright test --ui",
"test:a11y": "playwright test tests/a11y"
```

- [ ] **Step 3: Create Playwright config**

Create `playwright.config.ts` with:

```ts
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3000",
    trace: "on-first-retry",
  },
  webServer: process.env.PLAYWRIGHT_BASE_URL
    ? undefined
    : {
        command: "npm run build && npm run start",
        url: "http://localhost:3000",
        reuseExistingServer: !process.env.CI,
        timeout: 180_000,
      },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
  ],
});
```

- [ ] **Step 4: Create routes helper**

Create `tests/helpers/routes.ts`:

```ts
export const ROUTES = [
  "/",
  "/platform",
  "/platform/placement",
  "/platform/optimization",
  "/platform/issues",
  "/platform/reporting",
  "/solutions",
  "/why-dplat",
  "/company",
  "/resources",
  "/demo",
] as const;

export const BREAKPOINTS = [
  { name: "iPhone SE", width: 320, height: 568 },
  { name: "iPhone 12 mini", width: 375, height: 812 },
  { name: "iPhone 14 Plus", width: 414, height: 896 },
  { name: "iPad portrait", width: 768, height: 1024 },
  { name: "iPad landscape", width: 1024, height: 768 },
  { name: "laptop", width: 1280, height: 800 },
  { name: "desktop", width: 1440, height: 900 },
  { name: "phone landscape", width: 812, height: 375 },
  { name: "tablet landscape", width: 1180, height: 820 },
] as const;
```

- [ ] **Step 5: Verify Playwright can boot**

```bash
npx playwright --version
```

Expected: `Version 1.60.0` (or matching `package.json`)

- [ ] **Step 6: Commit**

```bash
git add package.json playwright.config.ts tests/helpers/routes.ts
git commit -m "chore(m4): scaffold Playwright config + route + breakpoint helpers"
```

---

### Task 2: Fluid type scale

**Files:**
- Modify: `src/app/globals.css:196-229` (typography token block)
- Create test: `tests/responsive/type-scale.spec.ts`

The existing tokens use a mixed-unit clamp formula (`vw + rem` slope). We normalize to a clean Utopia anchor (360px → 1440px viewport) so the scale is consistent across every token and predictable for future additions.

- [ ] **Step 1: Write the failing test**

Create `tests/responsive/type-scale.spec.ts`:

```ts
import { test, expect } from "@playwright/test";

const cases = [
  { selector: "h1", token: "--text-h1", min: 36, max: 49 },
  { selector: "h2", token: "--text-h2", min: 30, max: 42 },
];

test.describe("fluid type scale anchors 360→1440", () => {
  for (const { selector, token, min, max } of cases) {
    test(`${token} hits min at 360px`, async ({ page }) => {
      await page.setViewportSize({ width: 360, height: 800 });
      await page.goto("/");
      const size = await page.locator(selector).first().evaluate(
        (el) => parseFloat(getComputedStyle(el).fontSize)
      );
      expect(size).toBeCloseTo(min, 0);
    });

    test(`${token} hits max at 1440px`, async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto("/");
      const size = await page.locator(selector).first().evaluate(
        (el) => parseFloat(getComputedStyle(el).fontSize)
      );
      expect(size).toBeCloseTo(max, 0);
    });
  }
});
```

- [ ] **Step 2: Run test to see it fail**

```bash
npm run test:e2e -- tests/responsive/type-scale.spec.ts
```

Expected: at least some tests fail (current `--text-h1` anchors are not the new 360→1440 system).

- [ ] **Step 3: Replace the typography token block in globals.css**

Replace lines 196–229 in `src/app/globals.css` with:

```css
  /* Type scale — DESIGN.md §9.1 (Utopia fluid, anchored 360→1440) */
  --text-display-xl: clamp(2.5rem, calc(2rem + 2.2222vw), 4rem);             /* 40 → 64 */
  --text-display-xl--line-height: 1.1;
  --text-display-xl--font-weight: 400;
  --text-display-lg: clamp(2.25rem, calc(1.9792rem + 1.2037vw), 3.0625rem);  /* 36 → 49 */
  --text-display-lg--line-height: 1.1;
  --text-display-lg--font-weight: 480;
  --text-h1: clamp(2.25rem, calc(1.9792rem + 1.2037vw), 3.0625rem);          /* 36 → 49 */
  --text-h1--line-height: 1.1;
  --text-h1--font-weight: 480;
  --text-h2: clamp(1.875rem, calc(1.625rem + 1.1111vw), 2.625rem);           /* 30 → 42 */
  --text-h2--line-height: 1.14;
  --text-h2--font-weight: 480;
  --text-h3: clamp(1.5rem, calc(1.4167rem + 0.3704vw), 1.75rem);             /* 24 → 28 */
  --text-h3--line-height: 1.21;
  --text-h3--font-weight: 480;
  --text-h4: clamp(1.125rem, calc(1.0625rem + 0.2778vw), 1.3125rem);         /* 18 → 21 */
  --text-h4--line-height: 1.19;
  --text-h4--font-weight: 480;
  --text-body-lg: clamp(1.125rem, calc(1.0625rem + 0.2778vw), 1.3125rem);    /* 18 → 21 */
  --text-body-lg--line-height: 1.42;
  --text-body-lg--font-weight: 400;
  --text-body-md: clamp(0.9375rem, calc(0.9167rem + 0.0926vw), 1rem);        /* 15 → 16 */
  --text-body-md--line-height: 1.5;
  --text-body-md--font-weight: 400;
  --text-body-strong: clamp(0.9375rem, calc(0.9167rem + 0.0926vw), 1rem);    /* 15 → 16 */
  --text-body-strong--line-height: 1.5;
  --text-body-strong--font-weight: 480;
  --text-body-sm: clamp(0.8125rem, calc(0.7917rem + 0.0926vw), 0.875rem);    /* 13 → 14 */
  --text-body-sm--line-height: 1.43;
  --text-body-sm--font-weight: 420;
  --text-caption: 0.75rem;                                                    /* 12 (static — too small to scale) */
  --text-caption--line-height: 1.42;
  --text-caption--font-weight: 480;
```

- [ ] **Step 4: Run test to see it pass**

```bash
npm run test:e2e -- tests/responsive/type-scale.spec.ts
```

Expected: all 4 tests pass.

- [ ] **Step 5: Commit (token + test)**

```bash
git add src/app/globals.css tests/responsive/type-scale.spec.ts
git commit -m "feat(m4): normalize type scale to Utopia 360→1440 anchors"
```

---

### Task 3: Tailwind v4 container queries enabled

**Files:**
- Modify: `src/app/globals.css` (add `@theme` extension for container utilities)

Tailwind v4 supports container queries via the `@container` directive and the `@<size>:` variant. Enable named-container utilities globally so primitives can declare `class="@container/section"` and downstream children use `@md/section:flex-row`.

- [ ] **Step 1: Add container utilities to globals.css**

Append after the `@theme inline` block (around line 273), before `@layer base`:

```css
@utility container-section {
  container-type: inline-size;
  container-name: section;
}
@utility container-card {
  container-type: inline-size;
  container-name: card;
}
@utility container-form {
  container-type: inline-size;
  container-name: form;
}
```

- [ ] **Step 2: Verify no regressions**

```bash
npm run typecheck && npm run build
```

Expected: both succeed.

- [ ] **Step 3: Commit**

```bash
git add src/app/globals.css
git commit -m "feat(m4): enable container queries via named utilities (section/card/form)"
```

---

### Task 4: Touch-target tokens

**Files:**
- Modify: `src/app/globals.css` (add tokens inside `@theme inline`)

- [ ] **Step 1: Add touch-target tokens**

Inside the `@theme inline` block in `src/app/globals.css`, after the spacing block (around line 234), add:

```css
  /* Touch targets — DESIGN.md §9.3 (iOS HIG 44px floor) */
  --size-touch: 2.75rem;        /* 44 */
  --size-touch-comfortable: 3rem; /* 48 (Material) */
```

- [ ] **Step 2: Add Tailwind utility shortcuts**

Append after the `@utility container-form` block from Task 3:

```css
@utility min-h-touch {
  min-height: var(--size-touch);
}
@utility min-w-touch {
  min-width: var(--size-touch);
}
@utility min-size-touch {
  min-height: var(--size-touch);
  min-width: var(--size-touch);
}
```

- [ ] **Step 3: Verify build**

```bash
npm run typecheck && npm run build
```

Expected: both succeed.

- [ ] **Step 4: Commit**

```bash
git add src/app/globals.css
git commit -m "feat(m4): add touch-target tokens and utilities (44px floor)"
```

---

### Task 5: Safe-area-insets on fixed surfaces

**Files:**
- Modify: `src/components/site/SiteHeader.tsx` (the inner row)
- Modify: `src/components/sections/FinalCTA.tsx`
- Modify: `src/components/forms/DemoForm.tsx` (submit row)

- [ ] **Step 1: Read SiteHeader to find the row container**

```bash
grep -n "max-w-\[var(--container-page)\]" src/components/site/SiteHeader.tsx
```

- [ ] **Step 2: Add safe-area padding to the SiteHeader row**

In `src/components/site/SiteHeader.tsx`, find the `<div className="mx-auto flex h-14 max-w-[var(--container-page)]..."` row (line ~53). Replace the className with one that adds `pt-[env(safe-area-inset-top)]` and a height adjust:

Find:
```tsx
<div className="mx-auto flex h-14 max-w-[var(--container-page)] items-center justify-between px-4 md:h-16 md:px-6 lg:h-18 lg:px-8">
```

Replace with:
```tsx
<div className="mx-auto flex h-14 max-w-[var(--container-page)] items-center justify-between px-4 [padding-top:env(safe-area-inset-top)] [padding-left:max(env(safe-area-inset-left),1rem)] [padding-right:max(env(safe-area-inset-right),1rem)] md:h-16 md:px-6 lg:h-18 lg:px-8">
```

- [ ] **Step 3: Read FinalCTA to locate the band**

```bash
grep -n "className" src/components/sections/FinalCTA.tsx | head -5
```

- [ ] **Step 4: Add bottom safe-area to FinalCTA**

In `src/components/sections/FinalCTA.tsx`, find the outermost `<section>` or `<div>` wrapper className. Add `[padding-bottom:max(env(safe-area-inset-bottom),3rem)]` to the existing padding classes (replacing any conflicting `pb-*`).

Example transform — find:
```tsx
<section className="bg-[var(--background)] py-24">
```

Replace with:
```tsx
<section className="bg-[var(--background)] pt-24 [padding-bottom:max(env(safe-area-inset-bottom),6rem)]">
```

(Match the exact existing classes — only change is the bottom-padding rule.)

- [ ] **Step 5: Add safe-area to DemoForm submit row**

In `src/components/forms/DemoForm.tsx`, locate the submit row container and add the safe-area inset on the bottom. Find the submit button's wrapping `<div>` and add `[margin-bottom:env(safe-area-inset-bottom)]` (or merge into existing bottom margin).

- [ ] **Step 6: Verify build**

```bash
npm run typecheck && npm run build
```

Expected: both succeed.

- [ ] **Step 7: Commit**

```bash
git add src/components/site/SiteHeader.tsx src/components/sections/FinalCTA.tsx src/components/forms/DemoForm.tsx
git commit -m "feat(m4): apply env(safe-area-inset-*) to fixed nav, FinalCTA, DemoForm"
```

---

### Task 6: Mobile section padding tokens

**Files:**
- Modify: `src/app/globals.css` (spacing block, around line 231)
- Modify: `src/components/sections/SectionContainer.tsx`

- [ ] **Step 1: Add mobile/tablet section padding tokens**

In `src/app/globals.css`, find the spacing block (~line 231):

```css
  /* Spacing scale — DESIGN.md §4.3 */
  --spacing: 0.25rem; /* 4px base */
  --spacing-18: 4.5rem;  /* 72 */
  --spacing-24: 6rem;    /* 96 */
```

Replace with:

```css
  /* Spacing scale — DESIGN.md §4.3 + §9.5 */
  --spacing: 0.25rem; /* 4px base */
  --spacing-18: 4.5rem;  /* 72 */
  --spacing-24: 6rem;    /* 96 */
  --space-section-mobile: 3rem;   /* 48 */
  --space-section-tablet: 3.5rem; /* 56 */
  --space-section-desktop: 4.5rem; /* 72 */
```

- [ ] **Step 2: Read SectionContainer to find the padding application**

```bash
cat src/components/sections/SectionContainer.tsx
```

- [ ] **Step 3: Update SectionContainer padding**

Replace the vertical padding classes on the section wrapper with fluid tokens. Find the existing className (typically `py-18 md:py-24` or similar) and replace with:

```tsx
className={cn(
  // existing classes preserved...
  "py-[var(--space-section-mobile)] md:py-[var(--space-section-tablet)] lg:py-[var(--space-section-desktop)]",
  // existing surface variants...
)}
```

(Preserve any other existing classes; only swap the vertical-padding rule.)

- [ ] **Step 4: Verify build**

```bash
npm run typecheck && npm run build
```

- [ ] **Step 5: Commit**

```bash
git add src/app/globals.css src/components/sections/SectionContainer.tsx
git commit -m "feat(m4): add mobile/tablet section padding tokens and wire SectionContainer"
```

---

### Task 7: Reduced-motion audit sweep

**Files:**
- Modify: `src/components/sections/HomepageHero.tsx`
- Modify: any Framer Motion or GSAP usage that lacks `prefers-reduced-motion` guards.

- [ ] **Step 1: Find every GSAP/Framer usage**

```bash
grep -rn "gsap\|motion\.\|AnimatePresence\|useGSAP" src/components --include="*.tsx" | grep -v "useReducedMotion\|prefers-reduced-motion" | head -30
```

- [ ] **Step 2: For each unguarded usage, add reduced-motion respect**

For Framer Motion components (`motion.div`, `motion.li`, etc.), import `useReducedMotion`:

```tsx
import { motion, useReducedMotion } from "framer-motion";

const shouldReduce = useReducedMotion();
// then in the motion props:
initial={shouldReduce ? false : { opacity: 0, y: 8 }}
animate={shouldReduce ? false : { opacity: 1, y: 0 }}
transition={shouldReduce ? { duration: 0 } : { duration: 0.4 }}
```

For GSAP usages, wrap the `useGSAP` body with the existing `matchMedia` pattern:

```tsx
const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
if (prefersReduced) return;
```

- [ ] **Step 3: Verify build**

```bash
npm run typecheck && npm run build
```

- [ ] **Step 4: Commit**

```bash
git add src/components/sections/
git commit -m "feat(m4): honor prefers-reduced-motion on all GSAP/Framer animations"
```

---

### Task 8: Document foundation in DESIGN.md §9

**Files:**
- Modify: `DESIGN.md` (append a new top-level §9)
- Modify: `HANDOFF.md` (mark Phase 1 complete)

- [ ] **Step 1: Append §9 to DESIGN.md**

Append the following to the end of `DESIGN.md`:

```markdown
---

## 9. Responsive system

Anchored to 360px (one notch below iPhone SE) and 1440px viewports. Components use container queries to react to their container, not the viewport, so a primitive composes correctly when nested.

### 9.1 Fluid type scale (Utopia)

Formula: `clamp(min_rem, calc(intercept_rem + slope_vw), max_rem)` where `slope = (max_px - min_px) / 10.8` and `intercept_rem = (min_px - slope * 3.6) / 16`.

Anchors: 360px / 1440px viewport.

| Token | min → max (px) | clamp |
|---|---|---|
| --text-display-xl | 40 → 64 | clamp(2.5rem, calc(2rem + 2.2222vw), 4rem) |
| --text-display-lg | 36 → 49 | clamp(2.25rem, calc(1.9792rem + 1.2037vw), 3.0625rem) |
| --text-h1 | 36 → 49 | same as display-lg |
| --text-h2 | 30 → 42 | clamp(1.875rem, calc(1.625rem + 1.1111vw), 2.625rem) |
| --text-h3 | 24 → 28 | clamp(1.5rem, calc(1.4167rem + 0.3704vw), 1.75rem) |
| --text-h4 / --text-body-lg | 18 → 21 | clamp(1.125rem, calc(1.0625rem + 0.2778vw), 1.3125rem) |
| --text-body-md / --text-body-strong | 15 → 16 | clamp(0.9375rem, calc(0.9167rem + 0.0926vw), 1rem) |
| --text-body-sm | 13 → 14 | clamp(0.8125rem, calc(0.7917rem + 0.0926vw), 0.875rem) |
| --text-caption | 12 (static) | 0.75rem |

The atmospheric hero `clamp(2.75rem, 8vw, 7rem)` is a documented one-off escalation; do not extend that ramp to other tokens.

### 9.2 Container queries

Three named containers are available globally:

- `container-section` — top-level sections
- `container-card` — card grids and BenefitSplit
- `container-form` — AttachedForm and DemoForm

Children use Tailwind v4 variants: `@md/section:flex-row`, `@sm/card:grid-cols-2`, etc.

### 9.3 Touch targets

44px floor (iOS HIG). Apply via `min-h-touch min-w-touch` or `min-size-touch` on all `<a>` and `<button>` in interactive surfaces.

### 9.4 Safe-area-insets

Fixed nav uses `env(safe-area-inset-top)`. FinalCTA and bottom sticky CTAs use `env(safe-area-inset-bottom)`. DemoForm submit row honors `env(safe-area-inset-bottom)`.

### 9.5 Section padding

- `--space-section-mobile: 48px`
- `--space-section-tablet: 56px`
- `--space-section-desktop: 72px`

`SectionContainer` pipes these through automatically.

### 9.6 Reduced motion

Every GSAP/Framer/CSS transition has a quiet fallback under `prefers-reduced-motion: reduce`. No exceptions.

### 9.7 Primitive responsive contracts

(Filled in during Phase 2.)
```

- [ ] **Step 2: Update HANDOFF.md M4 section**

In `HANDOFF.md`, find the M4 status paragraph (around line 246) and append after the existing status text:

```markdown

**Phase 1 (foundation) complete (2026-05-20):** fluid type scale normalized to Utopia 360→1440; container queries enabled (`container-section`, `container-card`, `container-form`); touch-target tokens + utilities added; `env(safe-area-inset-*)` applied to SiteHeader, FinalCTA, DemoForm; mobile/tablet section padding tokens shipped; reduced-motion audit complete. DESIGN.md §9 documents the foundation.
```

- [ ] **Step 3: Commit**

```bash
git add DESIGN.md HANDOFF.md
git commit -m "docs(m4): document Phase 1 foundation in DESIGN.md §9 + HANDOFF.md"
```

- [ ] **Step 4: Push branch to trigger Vercel preview**

```bash
git push -u origin m4-responsive-rebuild
```

Expected: branch created on origin; Vercel preview URL appears in the GitHub PR view.

---

## Phase 2 — Primitive responsive contracts

Each primitive task follows the same shape: (1) verify current behavior, (2) make the change, (3) typecheck + build, (4) commit with DESIGN.md §9.7 row added. Skip the test scaffolding for each primitive — the breakpoint matrix in Phase 4 covers visual verification across all of them simultaneously.

### Task 9: FeatureAccordion mobile stack

**Files:** `src/components/sections/FeatureAccordion.tsx`, `DESIGN.md`

- [ ] **Step 1: Wrap the FeatureAccordion root with the section container**

In `src/components/sections/FeatureAccordion.tsx`, find the outer wrapper (typically `<div className="grid grid-cols-1 lg:grid-cols-2 gap-12">`). Replace with:

```tsx
<div className="container-section grid grid-cols-1 gap-8 @lg/section:grid-cols-2 @lg/section:gap-12">
```

- [ ] **Step 2: Move the visual pane below the active item on narrow containers**

Find the visual-pane container (typically `<div className="hidden lg:block">` or similar). Replace with:

```tsx
<div className="order-2 @lg/section:order-none">
```

And on the accordion items container, ensure it has `order-1 @lg/section:order-none`.

- [ ] **Step 3: Ensure trigger buttons hit 44px**

Find the `<button>` or `<AccordionTrigger>` inside each item. Add `min-h-touch` to the className.

- [ ] **Step 4: Add §9.7 row to DESIGN.md**

In `DESIGN.md` §9.7, add:

```markdown
| `FeatureAccordion` | Single column below 1024px container width. Visual pane renders below the active item, not beside. Triggers ≥44px. |
```

- [ ] **Step 5: Verify and commit**

```bash
npm run typecheck && npm run build
git add src/components/sections/FeatureAccordion.tsx DESIGN.md
git commit -m "feat(m4): FeatureAccordion stacks below 1024px container width"
```

---

### Task 10: BenefitSplit vertical-on-narrow

**Files:** `src/components/sections/BenefitSplit.tsx`, `DESIGN.md`

- [ ] **Step 1: Add container-section to root**

In `src/components/sections/BenefitSplit.tsx`, find the outermost `<div>` or `<section>`. Add `container-section` to its className.

- [ ] **Step 2: Switch grid to container-query variant**

Find the inner grid (typically `<div className="grid gap-8 md:grid-cols-2">`). Replace with:

```tsx
<div className="grid gap-8 @md/section:grid-cols-2">
```

- [ ] **Step 3: Force vertical at narrow widths regardless of reverse prop**

Find the order-reverse logic (if `reverse` prop). Wrap it so reverse only applies above narrow widths:

```tsx
// existing:
<div className={cn("...", reverse && "md:[grid-template-areas:'media_text']")}>
// becomes:
<div className={cn("...", reverse && "@md/section:[grid-template-areas:'media_text']")}>
```

(If the codebase uses simple flex `flex-row-reverse` instead, change `md:flex-row-reverse` to `@md/section:flex-row-reverse`.)

- [ ] **Step 4: Add §9.7 row**

```markdown
| `BenefitSplit` | Vertical (text → media) below 768px container width. Reverse prop ignored on narrow. |
```

- [ ] **Step 5: Verify and commit**

```bash
npm run typecheck && npm run build
git add src/components/sections/BenefitSplit.tsx DESIGN.md
git commit -m "feat(m4): BenefitSplit forces vertical stack below 768px container"
```

---

### Task 11: ComparisonTable card-stack mobile verification

**Files:** `src/components/sections/ComparisonTable.tsx`, `DESIGN.md`

The HANDOFF notes a "desktop table + mobile stacked-cards" fallback already exists. Verify and refine.

- [ ] **Step 1: Read current implementation**

```bash
cat src/components/sections/ComparisonTable.tsx
```

- [ ] **Step 2: Confirm card stack pairs each cell with its row label**

For each card the label (row header) and value pair should be visible. If labels are missing, add `<dt>` / `<dd>` pairs in the mobile fallback so screen readers and visual users both get context.

- [ ] **Step 3: Add sticky-first-column on tablet (768–1023)**

Wrap the table in a horizontally-scrollable wrapper at tablet sizes, with the first column sticky:

```tsx
<div className="hidden @md/section:block @lg/section:overflow-visible @md/section:overflow-x-auto">
  <table>
    <thead>...</thead>
    <tbody>
      <tr>
        <th className="@md/section:sticky @md/section:left-0 @md/section:bg-[var(--background)]">{label}</th>
        ...
      </tr>
    </tbody>
  </table>
</div>
```

- [ ] **Step 4: Add §9.7 row**

```markdown
| `ComparisonTable` | Desktop table at ≥1024px container. Sticky-first-column horizontal scroll at 768–1023. Card stack with paired label/value below 768. |
```

- [ ] **Step 5: Verify and commit**

```bash
npm run typecheck && npm run build
git add src/components/sections/ComparisonTable.tsx DESIGN.md
git commit -m "feat(m4): ComparisonTable mobile cards pair label+value; tablet sticky first column"
```

---

### Task 12: ProcessStrip vertical timeline mobile

**Files:** `src/components/sections/ProcessStrip.tsx`, `DESIGN.md`

- [ ] **Step 1: Read current implementation**

```bash
cat src/components/sections/ProcessStrip.tsx
```

- [ ] **Step 2: Convert horizontal strip to container-query vertical**

The horizontal layout (`flex` + dividers between steps) becomes a vertical timeline at narrow widths. Wrap each step in a list item; the divider becomes a left rule.

Find the outer steps container and replace with:

```tsx
<ol className="container-section relative flex flex-col gap-8 @md/section:flex-row @md/section:items-start @md/section:gap-0">
  {steps.map((step, i) => (
    <li
      key={step.id}
      className="relative flex gap-4 @md/section:flex-1 @md/section:flex-col @md/section:gap-3 @md/section:pl-0 @md/section:pt-0 pl-6 [&:not(:last-child)]:pb-8 [&:not(:last-child)]:border-l [&:not(:last-child)]:border-[var(--border)]"
    >
      <span className="absolute left-0 top-0 -translate-x-1/2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-[var(--card)] text-[var(--text-caption)] @md/section:relative @md/section:left-auto @md/section:translate-x-0">
        {i + 1}
      </span>
      <div>
        <h3 className="text-[var(--text-h4)]">{step.title}</h3>
        <p className="text-[var(--text-body-md)]">{step.body}</p>
      </div>
    </li>
  ))}
</ol>
```

- [ ] **Step 3: Add §9.7 row**

```markdown
| `ProcessStrip` | Horizontal numbered strip at ≥768px container. Vertical timeline with left rule + number bubbles below. |
```

- [ ] **Step 4: Verify and commit**

```bash
npm run typecheck && npm run build
git add src/components/sections/ProcessStrip.tsx DESIGN.md
git commit -m "feat(m4): ProcessStrip becomes vertical timeline below 768px container"
```

---

### Task 13: AttachedForm stacked-below-520

**Files:** `src/components/ui/AttachedForm.tsx`, `DESIGN.md`

- [ ] **Step 1: Read current implementation**

```bash
cat src/components/ui/AttachedForm.tsx
```

- [ ] **Step 2: Wrap in container-form and add stacked variant**

Find the form root. Add `container-form` class. Then use container-query variants for the layout:

```tsx
<form
  className="container-form flex w-full flex-col gap-2 @sm/form:flex-row @sm/form:gap-0 @sm/form:rounded-[var(--radius-xl)] @sm/form:bg-[var(--card)] @sm/form:p-1"
>
  <input
    className="min-h-touch w-full rounded-[var(--radius-xl)] bg-[var(--card)] px-5 @sm/form:flex-1 @sm/form:bg-transparent @sm/form:px-4"
    ...
  />
  <button
    className="min-h-touch w-full rounded-[var(--radius-xl)] bg-[var(--primary)] px-5 @sm/form:w-auto"
    ...
  >
    {label}
  </button>
</form>
```

The breakpoint `@sm/form` is 384px in Tailwind v4 defaults; if a different threshold is required, define a named breakpoint via `--breakpoint-*`.

- [ ] **Step 3: Add §9.7 row**

```markdown
| `AttachedForm` | Pill-attached input+button at ≥384px container. Stacked input top / full-width button below at narrower. Each surface keeps pill radius. |
```

- [ ] **Step 4: Verify and commit**

```bash
npm run typecheck && npm run build
git add src/components/ui/AttachedForm.tsx DESIGN.md
git commit -m "feat(m4): AttachedForm stacks input+button below 384px container"
```

---

### Task 14: CardGrid container queries

**Files:** `src/components/sections/CardGrid.tsx`, `DESIGN.md`

- [ ] **Step 1: Read current implementation**

```bash
cat src/components/sections/CardGrid.tsx
```

- [ ] **Step 2: Replace viewport breakpoints with container-card**

Find the grid wrapper (typically `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3`) and add `container-card` to the parent, then switch to `@`-prefixed variants:

```tsx
<div className="container-card">
  <div className="grid grid-cols-1 gap-6 @sm/card:grid-cols-2 @lg/card:grid-cols-3">
    {/* cards */}
  </div>
</div>
```

For 4-column variants: `@xl/card:grid-cols-4`.

- [ ] **Step 3: Add §9.7 row**

```markdown
| `CardGrid` | 1 column below 384px container, 2 at 384, 3 at 1024, 4 at 1280. Driven by container width, not viewport — nests correctly. |
```

- [ ] **Step 4: Verify and commit**

```bash
npm run typecheck && npm run build
git add src/components/sections/CardGrid.tsx DESIGN.md
git commit -m "feat(m4): CardGrid switches viewport breakpoints to container queries"
```

---

### Task 15: Remaining primitives sweep

**Files:** `src/components/sections/Hero.tsx`, `PageHero.tsx`, `TrustBand.tsx`, `ProofBand.tsx`, `IntegrationStrip.tsx`, `FinalCTA.tsx`, `DESIGN.md`

These primitives need lighter touches: confirm fluid type tokens render correctly, verify reduced-motion guards, add `min-h-touch` to any CTA-style buttons, add `container-section` to roots so they compose correctly when nested.

- [ ] **Step 1: Audit each file for hard-coded font-sizes or pixel breakpoints**

```bash
grep -nE "text-\[|font-size:|@media|md:text-|lg:text-" src/components/sections/Hero.tsx src/components/sections/PageHero.tsx src/components/sections/TrustBand.tsx src/components/sections/ProofBand.tsx src/components/sections/IntegrationStrip.tsx src/components/sections/FinalCTA.tsx
```

- [ ] **Step 2: For each hit, swap hard-coded sizes to the fluid token equivalent**

Replace patterns like `text-4xl md:text-5xl` with `text-[var(--text-h1)]`. Replace `text-base md:text-lg` with `text-[var(--text-body-lg)]`. The fluid tokens handle the scaling.

- [ ] **Step 3: Add `min-h-touch` to all `<button>` and link-as-button elements**

For each `<Button>` or `<a>` styled as a CTA, ensure the className includes `min-h-touch`. shadcn `Button` should already meet this; verify on links and custom buttons.

- [ ] **Step 4: Add §9.7 rows**

```markdown
| `Hero` / `PageHero` | Stacked at narrow container widths. Eyebrow/H1/body use fluid clamp tokens. AttachedForm follows its own rule. |
| `TrustBand` / `ProofBand` / `IntegrationStrip` | Logos wrap cleanly; per-slot `min-width` prevents crushing. Reduced-motion respects reveal animations. |
| `FinalCTA` | Single primary CTA, ≥44px tall, full-width below 375px viewport. `env(safe-area-inset-bottom)` padding. |
```

- [ ] **Step 5: Verify and commit**

```bash
npm run typecheck && npm run build
git add src/components/sections/Hero.tsx src/components/sections/PageHero.tsx src/components/sections/TrustBand.tsx src/components/sections/ProofBand.tsx src/components/sections/IntegrationStrip.tsx src/components/sections/FinalCTA.tsx DESIGN.md
git commit -m "feat(m4): primitive sweep — fluid tokens, touch targets, container roots"
```

---

### Task 16: Phase 2 commit checkpoint

- [ ] **Step 1: Update HANDOFF.md M4 status**

In `HANDOFF.md`, append to the M4 status block:

```markdown

**Phase 2 (primitives) complete (2026-05-20):** FeatureAccordion / BenefitSplit / ComparisonTable / ProcessStrip / AttachedForm / CardGrid converted to container queries. Hero / PageHero / TrustBand / ProofBand / IntegrationStrip / FinalCTA swept for fluid tokens and touch targets. DESIGN.md §9.7 holds the contract table.
```

- [ ] **Step 2: Push for preview deploy**

```bash
git add HANDOFF.md
git commit -m "docs(m4): mark Phase 2 primitives complete in HANDOFF.md"
git push
```

---

## Phase 3 — Platform handoff mobile branch

### Task 17: Shared useIsMobile hook

**Files:** `src/hooks/use-is-mobile.ts` (create)

- [ ] **Step 1: Create the hook**

Create `src/hooks/use-is-mobile.ts`:

```ts
"use client";

import * as React from "react";

/**
 * Matches the cinematic hero's mobile gate. Components that need to swap
 * out GSAP-driven layouts on phones should use this hook to render a
 * structurally simpler tree.
 */
export function useIsMobile(query: string = "(max-width: 767px)"): boolean {
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const mq = window.matchMedia(query);
    const handler = () => setIsMobile(mq.matches);
    handler();
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [query]);

  return isMobile;
}
```

- [ ] **Step 2: Commit**

```bash
git add src/hooks/use-is-mobile.ts
git commit -m "feat(m4): add useIsMobile shared hook"
```

---

### Task 18: HomepageHandoffSection mobile render branch

**Files:** `src/components/sections/HomepageHandoffSection.tsx`, `src/components/sections/mockups/FramedDashboard.tsx`

- [ ] **Step 1: Import useIsMobile and add early-return mobile render**

In `src/components/sections/HomepageHandoffSection.tsx`, at the top of the component body (after existing state hooks), add:

```tsx
import { useIsMobile } from "@/hooks/use-is-mobile";

// inside the component:
const isMobile = useIsMobile();
```

- [ ] **Step 2: Wrap useGSAP body with mobile guard**

Find the existing `useGSAP(() => { ... })` block. Inside the callback, add at the very top:

```tsx
useGSAP(
  () => {
    if (isMobile) return;
    const prefersReduced = window.matchMedia(...).matches;
    if (prefersReduced) return;
    // existing GSAP setup...
  },
  { dependencies: [isMobile], scope: rootRef }
);
```

(Ensure `isMobile` is in the deps array so the hook re-runs when crossing the breakpoint via devtools resize.)

- [ ] **Step 3: Add mobile render branch at the top of the JSX**

Just before the existing `<section>` JSX, add:

```tsx
if (isMobile) {
  return (
    <section
      ref={rootRef}
      data-handoff-section
      className="container-section bg-[var(--background)] py-[var(--space-section-mobile)]"
    >
      <div className="mx-auto max-w-[var(--container-page)] px-4">
        <p className="text-[var(--text-caption)] uppercase tracking-wider text-[var(--primary)]">
          {heroHandoff.eyebrow}
        </p>
        <h2 className="mt-2 text-[var(--text-h2)] text-[var(--foreground)]">
          {heroHandoff.heading}
        </h2>

        <div className="mt-10 flex flex-col gap-16">
          {heroHandoff.tabs.map((tab) => (
            <div key={tab.id} className="flex flex-col gap-4">
              <p className="text-[var(--text-caption)] uppercase tracking-wider text-[var(--primary)]">
                {tab.eyebrow}
              </p>
              <h3 className="text-[var(--text-h3)] text-[var(--foreground)]">
                {tab.heading}
              </h3>
              <p className="text-[var(--text-body-md)] text-[var(--text-tertiary)]">
                {tab.body}
              </p>
              <FramedDashboard>
                <MockupForTab id={tab.id} />
              </FramedDashboard>
              <Link
                href={tab.linkHref}
                className="min-h-touch inline-flex items-center gap-1 text-[var(--text-body-strong)] text-[var(--primary)]"
              >
                {tab.linkLabel} <span aria-hidden="true">→</span>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

(Match the exact prop names from `heroHandoff` — verify by checking `src/content/homepage-hero.ts` for the actual shape.)

- [ ] **Step 4: Verify both desktop and mobile render in the dev server**

```bash
npm run dev
```

Open http://localhost:3000 in two browser windows: one at 1440×900, one at 375×812. The desktop window should show the pinned 300vh cinematic; the mobile window should show the calm stacked section.

- [ ] **Step 5: Commit**

```bash
git add src/components/sections/HomepageHandoffSection.tsx
git commit -m "feat(m4): Platform handoff renders calm static stack below 768px"
```

---

### Task 19: Mockup IntersectionObserver entrance

**Files:** `src/components/sections/mockups/PlacementMockup.tsx`, `VendorPerformanceMockup.tsx`, `IssuesMockup.tsx`, `ReportingMockup.tsx`

Each mockup currently animates on mount (Framer Motion entrance). On mobile the stacked render mounts all four at once; we want them to animate as they scroll into view.

- [ ] **Step 1: Create a shared in-view hook**

Create `src/hooks/use-in-view.ts`:

```ts
"use client";

import * as React from "react";

export function useInView<T extends HTMLElement>(
  rootMargin: string = "0px 0px -15% 0px"
): [React.RefObject<T>, boolean] {
  const ref = React.useRef<T>(null);
  const [inView, setInView] = React.useState(false);

  React.useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin, threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [rootMargin]);

  return [ref, inView];
}
```

- [ ] **Step 2: Wire each mockup's entrance to in-view**

In each of `PlacementMockup.tsx`, `VendorPerformanceMockup.tsx`, `IssuesMockup.tsx`, `ReportingMockup.tsx`:

Find the existing Framer Motion entrance trigger (typically `initial`/`animate` on the root motion element). Replace the always-on trigger with the in-view ref:

```tsx
import { useInView } from "@/hooks/use-in-view";

const [ref, inView] = useInView<HTMLDivElement>();
const shouldReduce = useReducedMotion();

return (
  <motion.div
    ref={ref}
    initial={shouldReduce ? false : { opacity: 0, y: 8 }}
    animate={shouldReduce || inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
    transition={shouldReduce ? { duration: 0 } : { duration: 0.5 }}
  >
    {/* existing mockup content */}
  </motion.div>
);
```

- [ ] **Step 3: Verify mockups still animate on desktop**

Run dev server, scroll through the desktop Platform handoff, confirm each tab's mockup still animates on mount as before. (The desktop branch re-mounts via `key={activeId}`, so each tab change triggers the animation — IntersectionObserver fires immediately because the mockup is already in the viewport.)

- [ ] **Step 4: Verify mockups stagger-animate on mobile scroll**

At 375 viewport in dev server, scroll through the Platform section. Each mockup animates as it crosses the threshold.

- [ ] **Step 5: Commit**

```bash
git add src/hooks/use-in-view.ts src/components/sections/mockups/
git commit -m "feat(m4): mockups animate on intersection so mobile stack staggers naturally"
```

---

### Task 20: FramedDashboard mobile padding

**Files:** `src/components/sections/mockups/FramedDashboard.tsx`

- [ ] **Step 1: Read current implementation**

```bash
cat src/components/sections/mockups/FramedDashboard.tsx
```

- [ ] **Step 2: Adjust padding to be tighter on mobile**

Find the inner content `<div className="p-4 md:p-5">` (per HANDOFF.md). Replace with:

```tsx
<div className="p-3 @sm/section:p-4 @md/section:p-5">
```

Add `container-section` to the bezel root if not already present, so the `@` queries resolve.

- [ ] **Step 3: Verify and commit**

```bash
npm run typecheck && npm run build
git add src/components/sections/mockups/FramedDashboard.tsx
git commit -m "feat(m4): tighter FramedDashboard padding below 384px container"
```

---

### Task 21: HANDOFF.md Phase 3 doc update

- [ ] **Step 1: Append Phase 3 status to HANDOFF.md**

In `HANDOFF.md` M4 status block, append:

```markdown

**Phase 3 (Platform handoff mobile) complete (2026-05-20):** `useIsMobile()` shared hook drives a structurally different render below 768px (calm static stack, no GSAP pin). Mockups animate on `IntersectionObserver` so the stack staggers as the user scrolls.
```

- [ ] **Step 2: Add Decisions-locked line**

In `HANDOFF.md` "Decisions locked" section, append:

```markdown
- **Platform handoff section uses a structurally different mobile architecture below 768px** (calm static stack, no pin, no GSAP). Same content, normal-flow scroll.
```

- [ ] **Step 3: Commit and push**

```bash
git add HANDOFF.md
git commit -m "docs(m4): mark Phase 3 Platform handoff mobile complete"
git push
```

---

## Phase 4 — QA + CI

### Task 22: Breakpoint matrix spec

**Files:** `tests/responsive/breakpoint-matrix.spec.ts`, `docs/m4-responsive-qa.md`

- [ ] **Step 1: Write the matrix spec**

Create `tests/responsive/breakpoint-matrix.spec.ts`:

```ts
import { test, expect } from "@playwright/test";
import { ROUTES, BREAKPOINTS } from "../helpers/routes";

for (const route of ROUTES) {
  for (const bp of BREAKPOINTS) {
    test(`${route} renders without overflow at ${bp.name} (${bp.width}×${bp.height})`, async ({ page }) => {
      await page.setViewportSize({ width: bp.width, height: bp.height });
      await page.goto(route);
      await page.waitForLoadState("networkidle");

      // No horizontal overflow on <body>
      const overflow = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
      });
      expect(overflow, `${route} @ ${bp.name} has horizontal overflow`).toBe(false);

      // Skip-link is visible on focus
      await page.keyboard.press("Tab");
      const skipFocused = await page.evaluate(() => {
        const active = document.activeElement;
        return active?.textContent?.toLowerCase().includes("skip") ?? false;
      });
      expect(skipFocused).toBe(true);

      // No console errors
      const errors: string[] = [];
      page.on("pageerror", (err) => errors.push(err.message));
      page.on("console", (msg) => {
        if (msg.type() === "error") errors.push(msg.text());
      });
      expect(errors).toEqual([]);
    });
  }
}
```

- [ ] **Step 2: Run the matrix**

```bash
npm run test:e2e -- tests/responsive/breakpoint-matrix.spec.ts
```

Expected: 99 tests (11 routes × 9 breakpoints). Some may fail — log them.

- [ ] **Step 3: Create the QA tracking doc**

Create `docs/m4-responsive-qa.md` with a markdown table: rows = routes, columns = breakpoints, cells = pass/fail status. Fill in from the Playwright output.

- [ ] **Step 4: Fix failures**

For each failing (route, breakpoint), inspect the failure (overflow / console error / skip-link broken) and apply targeted fix. Re-run the matrix until green.

- [ ] **Step 5: Commit**

```bash
git add tests/responsive/breakpoint-matrix.spec.ts docs/m4-responsive-qa.md
git commit -m "test(m4): breakpoint matrix spec + tracking doc — all routes at 9 viewports"
```

---

### Task 23: Touch-target audit spec

**Files:** `tests/responsive/touch-targets.spec.ts`, `docs/m4-touch-target-audit.md`

- [ ] **Step 1: Write the audit spec**

Create `tests/responsive/touch-targets.spec.ts`:

```ts
import { test, expect } from "@playwright/test";
import { ROUTES } from "../helpers/routes";

test.describe("touch-target floor at 375", () => {
  for (const route of ROUTES) {
    test(`${route}: every interactive element is ≥44×44`, async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 812 });
      await page.goto(route);
      await page.waitForLoadState("networkidle");

      const fails = await page.evaluate(() => {
        const targets = Array.from(
          document.querySelectorAll<HTMLElement>(
            'a, button, [role="button"], input[type="checkbox"], input[type="radio"]'
          )
        );
        return targets
          .filter((el) => {
            const r = el.getBoundingClientRect();
            // skip hidden elements
            if (r.width === 0 || r.height === 0) return false;
            // 44px floor
            return r.height < 44 || r.width < 44;
          })
          .map((el) => ({
            tag: el.tagName,
            text: el.textContent?.trim().slice(0, 60) ?? "",
            size: `${Math.round(el.getBoundingClientRect().width)}×${Math.round(el.getBoundingClientRect().height)}`,
          }));
      });

      expect(fails, `Undersized targets on ${route}: ${JSON.stringify(fails, null, 2)}`).toEqual([]);
    });
  }
});
```

- [ ] **Step 2: Run the audit**

```bash
npm run test:e2e -- tests/responsive/touch-targets.spec.ts
```

- [ ] **Step 3: Create tracking doc**

Create `docs/m4-touch-target-audit.md` listing any failing elements with route + element + measured size. Use it to checklist fixes.

- [ ] **Step 4: Fix failures**

For each undersized target, add `min-h-touch min-w-touch` (or `min-size-touch`) to its className. Re-run until green.

- [ ] **Step 5: Commit**

```bash
git add tests/responsive/touch-targets.spec.ts docs/m4-touch-target-audit.md
git commit -m "test(m4): touch-target audit spec — every interactive element ≥44px at 375"
```

---

### Task 24: Reduced-motion verification spec

**Files:** `tests/responsive/reduced-motion.spec.ts`

- [ ] **Step 1: Write the spec**

Create `tests/responsive/reduced-motion.spec.ts`:

```ts
import { test, expect } from "@playwright/test";
import { ROUTES } from "../helpers/routes";

test.use({
  colorScheme: "dark",
  reducedMotion: "reduce",
});

for (const route of ROUTES) {
  test(`${route}: no running animations under prefers-reduced-motion`, async ({ page }) => {
    await page.goto(route);
    await page.waitForLoadState("networkidle");

    const animating = await page.evaluate(() => {
      // Any element with a currently-running CSS animation or transition
      const all = Array.from(document.querySelectorAll<HTMLElement>("*"));
      return all
        .filter((el) => {
          const animations = el.getAnimations?.() ?? [];
          return animations.some(
            (a) => a.playState === "running" && a.effect?.getTiming().duration !== 0
          );
        })
        .slice(0, 5)
        .map((el) => ({
          tag: el.tagName,
          className: el.className.toString().slice(0, 80),
        }));
    });

    expect(animating, `Animations still running: ${JSON.stringify(animating, null, 2)}`).toEqual([]);
  });
}
```

- [ ] **Step 2: Run and fix any leaks**

```bash
npm run test:e2e -- tests/responsive/reduced-motion.spec.ts
```

For each animation that still runs (the `.dn-node` indigo pulse is the likely culprit if its `@media (prefers-reduced-motion)` block is missing), add the guard to its CSS keyframe or component.

- [ ] **Step 3: Commit**

```bash
git add tests/responsive/reduced-motion.spec.ts src/app/globals.css
git commit -m "test(m4): reduced-motion verification — no animations under reduce media query"
```

---

### Task 25: Platform mobile branch contract spec

**Files:** `tests/responsive/platform-mobile.spec.ts`

- [ ] **Step 1: Write the spec**

Create `tests/responsive/platform-mobile.spec.ts`:

```ts
import { test, expect } from "@playwright/test";

test.describe("Platform handoff mobile contract", () => {
  test("renders 4 stacked mockups, no GSAP pin at 375", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // The mobile branch should NOT have a pinned 400vh outer
    const sectionHeight = await page
      .locator("[data-handoff-section]")
      .evaluate((el) => el.getBoundingClientRect().height);
    // Sanity: a normal-flow stacked section should be tall but not absurdly so.
    // 4 mockups stacked ≈ 2000-3500px. Reject anything > 5000px (pin spacer artifact).
    expect(sectionHeight).toBeLessThan(5000);

    // The 4 mockup titles should all be findable in the DOM
    const titles = await page.locator("h3").allTextContents();
    expect(titles.join(" ")).toContain("Placement");
    expect(titles.join(" ")).toContain("Vendor");
    expect(titles.join(" ")).toContain("Issues");
    expect(titles.join(" ")).toContain("Reporting");

    // No ScrollTrigger spacers present in the DOM
    const triggerSpacers = await page.locator(".pin-spacer").count();
    expect(triggerSpacers).toBe(0);
  });

  test("desktop still pins at 1440", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    // At desktop, the handoff section uses CSS sticky inside a 400vh outer.
    const sectionHeight = await page
      .locator("[data-handoff-section]")
      .evaluate((el) => el.getBoundingClientRect().height);
    expect(sectionHeight).toBeGreaterThan(2400); // 400vh-ish
  });
});
```

- [ ] **Step 2: Run and verify**

```bash
npm run test:e2e -- tests/responsive/platform-mobile.spec.ts
```

Expected: both tests pass.

- [ ] **Step 3: Commit**

```bash
git add tests/responsive/platform-mobile.spec.ts
git commit -m "test(m4): Platform handoff mobile contract — calm stack below 768px"
```

---

### Task 26: axe-core CI workflow

**Files:** `tests/a11y/axe-routes.spec.ts`, `.github/workflows/a11y.yml`

- [ ] **Step 1: Write the axe-core spec**

Create `tests/a11y/axe-routes.spec.ts`:

```ts
import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { ROUTES } from "../helpers/routes";

const VIEWPORTS = [
  { name: "mobile-375", width: 375, height: 812 },
  { name: "desktop-1440", width: 1440, height: 900 },
];

for (const vp of VIEWPORTS) {
  for (const route of ROUTES) {
    test(`axe ${route} @ ${vp.name}`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto(route);
      await page.waitForLoadState("networkidle");

      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag22aa"])
        .analyze();

      const critical = results.violations.filter(
        (v) => v.impact === "critical" || v.impact === "serious"
      );
      expect(
        critical,
        `Critical/serious axe violations on ${route} @ ${vp.name}:\n${critical
          .map((v) => `  ${v.id}: ${v.description}`)
          .join("\n")}`
      ).toEqual([]);
    });
  }
}
```

- [ ] **Step 2: Create the GitHub Actions workflow**

Create `.github/workflows/a11y.yml`:

```yaml
name: a11y + responsive

on:
  pull_request:
    branches: [main]
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    timeout-minutes: 20
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"
      - run: npm ci
      - name: Install Playwright browsers
        run: npx playwright install --with-deps chromium
      - name: Build
        run: npm run build
      - name: Run Playwright suites
        run: npm run test:e2e
      - if: failure()
        uses: actions/upload-artifact@v4
        with:
          name: playwright-report
          path: playwright-report
          retention-days: 7
```

- [ ] **Step 3: Run the axe suite locally**

```bash
npm run test:e2e -- tests/a11y/axe-routes.spec.ts
```

- [ ] **Step 4: Fix any critical/serious violations**

For each violation, apply the targeted fix. Common culprits at this stage: contrast on hover states, missing form labels, landmark roles.

- [ ] **Step 5: Commit**

```bash
git add tests/a11y/axe-routes.spec.ts .github/workflows/a11y.yml
git commit -m "test(m4): axe-core CI on every PR — WCAG 2.2 AA at 375 and 1440"
```

---

### Task 27: Lighthouse mobile baseline

**Files:** `docs/m4-perf-baseline.md`

- [ ] **Step 1: Push branch for fresh preview deploy**

```bash
git push
```

Wait ~2 min, capture the preview URL from Vercel (or `vercel ls`).

- [ ] **Step 2: Run Lighthouse mobile against each route on the preview URL**

For each of the 11 routes, run:

```bash
npx lighthouse "https://<preview-url>.vercel.app/<route>" \
  --preset=mobile \
  --quiet \
  --chrome-flags="--headless=new" \
  --output=json \
  --output-path=./lh-<route>.json
```

(Or use the Vercel Speed Insights dashboard if available.)

- [ ] **Step 3: Create the baseline doc**

Create `docs/m4-perf-baseline.md` with a table: rows = routes, columns = LCP / CLS / INP / Performance score. Fill in values from each Lighthouse run.

Targets per CLAUDE.md §12:
- LCP < 2.5s
- CLS < 0.1
- INP < 200ms

- [ ] **Step 4: Fix anything failing the targets**

Likely culprits per HANDOFF.md M4 pending notes:
- 11 MB hero MP4 — consider hosting on Mux or splitting into multiple resolutions with `<source media="...">`.
- Fontshare CDN call — download General Sans 600, host via `next/font/local`.

- [ ] **Step 5: Commit the baseline + any perf fixes**

```bash
git add docs/m4-perf-baseline.md src/
git commit -m "perf(m4): Lighthouse mobile baseline + targeted fixes for LCP/CLS/INP"
```

---

### Task 28: Final HANDOFF update + merge

**Files:** `HANDOFF.md`

- [ ] **Step 1: Update HANDOFF.md M4 section to "complete"**

Replace the M4 status block with:

```markdown
## What's complete (M4)

**Phase 1 — Foundation (2026-05-20):** fluid type scale (Utopia 360→1440), Tailwind v4 container queries, 44px touch-target tokens, `env(safe-area-inset-*)` on fixed surfaces, mobile/tablet section padding, reduced-motion audit. Documented in DESIGN.md §9.

**Phase 2 — Primitives (2026-05-20):** 10 components converted from viewport breakpoints to container queries with explicit responsive contracts (DESIGN.md §9.7).

**Phase 3 — Platform handoff mobile (2026-05-20):** `useIsMobile()` gates a structurally different render below 768px (calm static stack, no pin, no GSAP). Mockups animate via `IntersectionObserver`.

**Phase 4 — QA + CI (2026-05-20):** 9-breakpoint × 11-route matrix (99 tests) passing. axe-core CI runs on every PR at 375 and 1440. Touch-target audit zero failures. Reduced-motion verification green. Lighthouse mobile hits LCP <2.5 / CLS <0.1 / INP <200 on every route.
```

(Move the corresponding entries out of "What's pending.")

- [ ] **Step 2: Commit and push**

```bash
git add HANDOFF.md
git commit -m "docs(m4): mark M4 mobile responsive rebuild complete"
git push
```

- [ ] **Step 3: Open PR from `m4-responsive-rebuild` to `main`**

```bash
gh pr create --title "M4: Mobile responsive rebuild" --body "$(cat <<'EOF'
## Summary

Full mobile/responsive rebuild per the approved design spec at `docs/superpowers/specs/2026-05-20-mobile-responsive-rebuild-design.md`.

- Foundation: fluid type scale (Utopia 360→1440), Tailwind v4 container queries, 44px touch targets, safe-area-insets, mobile section padding, reduced-motion audit.
- Primitives: 10 components converted to container-query-driven responsive contracts.
- Platform handoff: structurally different mobile branch — calm static stack below 768px, no GSAP pin.
- QA: 99-test breakpoint matrix, axe-core CI, touch-target audit, reduced-motion verification, Lighthouse baseline.

See DESIGN.md §9 for the contract; HANDOFF.md for status.

## Test plan
- [ ] CI a11y workflow passes (axe-core + responsive matrix)
- [ ] Visual review on Vercel preview at 375 / 768 / 1440
- [ ] Manual smoke on iPhone via DevTools
- [ ] `npm run test:e2e` clean locally

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

- [ ] **Step 4: Verify CI green, then merge**

After CI passes:

```bash
gh pr merge --squash --delete-branch
```

The squashed commit triggers a production deploy to `debtnext-website.vercel.app`.

---

## Acceptance criteria (from spec §8)

Before declaring done, verify each:

- [ ] All 11 routes pass visual QA at all 9 breakpoints (`docs/m4-responsive-qa.md` shows green across the board)
- [ ] axe-core CI runs on every PR and currently passes against `main` at 375 and 1440
- [ ] Touch-target audit at 375 shows zero failures
- [ ] Reduced-motion verification confirms no animation under that media query
- [ ] Lighthouse mobile hits the CLAUDE.md §12 targets on every route
- [ ] Platform handoff section renders as a calm static stack below 768px, no GSAP console warnings on any breakpoint
- [ ] DESIGN.md §9 "Responsive system" exists and accurately reflects shipped tokens
- [ ] HANDOFF.md M4 section reflects shipped state
- [ ] CLAUDE.md §14 DoD checklist passes for every route on the Vercel preview

---

End of plan.
