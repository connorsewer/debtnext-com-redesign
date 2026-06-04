# Product Visuals Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the 7 reusable product-visual primitives + their design tokens, validated in isolation on a dev harness route, as the canonical foundation for the 5 homepage FeatureAccordion visuals (Plan B).

**Architecture:** A new `src/components/product/` library. Primitives are dark-canvas, always-dark (independent of the site's light/dark theme), driven by product-specific CSS tokens added to `globals.css`. Motion lives only in `LiveStatus` and `EventBadge` and is `useReducedMotion`-gated. Per React 19.2: `ref` is a regular prop (no `forwardRef`); every primitive is `React.memo`-wrapped. A noindexed `/dev/product-visuals` route renders every primitive in isolation so Playwright can assert each one and Connor can review them.

**Tech Stack:** Next.js 16 (App Router), React 19.2, Tailwind v4 (`var(--token)` arbitrary classes, matching existing code), framer-motion 12 (`import { motion, useReducedMotion } from "framer-motion"`), Playwright + `@axe-core/playwright`.

**Reference docs (read before starting):** `CLAUDE.md` §3/§5/§11/§12, `DESIGN.md`, `docs/superpowers/specs/2026-06-04-product-visuals-accordion-design.md`, and the verbatim visual content in `docs/multimodal-image-prompts.md` (Plan B consumes it; primitives here are content-agnostic).

---

## File Structure

| File | Responsibility |
|---|---|
| `src/app/globals.css` (modify) | Add product status + surface + text tokens |
| `DESIGN.md` (modify) | Document the new product-visual token group |
| `src/components/product/primitives/EyebrowLabel.tsx` (create) | Uppercase eyebrow + glowing indigo dot |
| `src/components/product/primitives/ProductCanvas.tsx` (create) | Dark canvas: bloom + masked grid + `@container` |
| `src/components/product/primitives/ProductCard.tsx` (create) | Glass card: gradient + inset highlight + ambient shadow |
| `src/components/product/primitives/MetricCell.tsx` (create) | KPI label + value(+unit) + colored delta |
| `src/components/product/primitives/StatPill.tsx` (create) | Small inline footer metric pill |
| `src/components/product/primitives/LiveStatus.tsx` (create) | Pulsing-dot status pill (client) |
| `src/components/product/primitives/EventBadge.tsx` (create) | Floating canvas notification, long-dwell cycle (client) |
| `src/components/product/primitives/index.ts` (create) | Re-exports (harness/tests import direct paths, not this barrel) |
| `src/app/dev/product-visuals/page.tsx` (create) | Noindexed isolation harness for all primitives |
| `tests/product/primitives.spec.ts` (create) | Playwright: content, tabular-nums, reduced-motion, axe |

**Tokens added (constant across themes — product visuals are always dark):**
```
--status-success: #5BCB89;   --status-warning: #FFB86C;
--status-breach:  #E27676;   --status-special: #BB86FC;   /* SCRA */
--status-focus:   #9CB4E8;
--product-canvas: #171721;   --product-card:   #1B1B27;
--product-text:   #EDEDF3;   --product-text-2: #C8C8D0;
--product-text-3: #87878E;   --product-text-muted: #6B6B7B;
```
Existing tokens reused: `--primary` (#5266EB), `--primary-foreground`.

**Test loop:** keep `npm run dev` running; run specs fast against it with
`PLAYWRIGHT_BASE_URL=http://localhost:3000 npx playwright test tests/product/primitives.spec.ts --project=chromium`.

---

## Task 1: Add product-visual design tokens

**Files:**
- Modify: `src/app/globals.css` (the `:root` block near line 47, and add a dedicated comment group)
- Modify: `DESIGN.md` (append a "Product-visual tokens" subsection)
- Test: `tests/product/primitives.spec.ts`

- [ ] **Step 1: Write the failing test**

Create `tests/product/primitives.spec.ts`:
```ts
import { test, expect } from "@playwright/test";

test.describe("product-visual tokens", () => {
  test("status + product surface tokens resolve on :root", async ({ page }) => {
    await page.goto("/dev/product-visuals");
    const tokens = await page.evaluate(() => {
      const s = getComputedStyle(document.documentElement);
      return {
        success: s.getPropertyValue("--status-success").trim(),
        breach: s.getPropertyValue("--status-breach").trim(),
        special: s.getPropertyValue("--status-special").trim(),
        canvas: s.getPropertyValue("--product-canvas").trim(),
        text: s.getPropertyValue("--product-text").trim(),
      };
    });
    expect(tokens.success.toLowerCase()).toBe("#5bcb89");
    expect(tokens.breach.toLowerCase()).toBe("#e27676");
    expect(tokens.special.toLowerCase()).toBe("#bb86fc");
    expect(tokens.canvas.toLowerCase()).toBe("#171721");
    expect(tokens.text.toLowerCase()).toBe("#ededf3");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `PLAYWRIGHT_BASE_URL=http://localhost:3000 npx playwright test tests/product/primitives.spec.ts -g "status \+ product" --project=chromium`
Expected: FAIL — route `/dev/product-visuals` 404s (page not created yet) and/or tokens empty.

- [ ] **Step 3: Add the tokens**

In `src/app/globals.css`, inside the `:root { ... }` block (the light-theme root near line 47), add before its closing brace:
```css
  /* ---- Product-visual tokens (always dark; theme-independent) ---- */
  --status-success: #5BCB89;
  --status-warning: #FFB86C;
  --status-breach: #E27676;
  --status-special: #BB86FC; /* SCRA */
  --status-focus: #9CB4E8;
  --product-canvas: #171721;
  --product-card: #1B1B27;
  --product-text: #EDEDF3;
  --product-text-2: #C8C8D0;
  --product-text-3: #87878E;
  --product-text-muted: #6B6B7B;
```
These live in `:root` (not `.dark`) on purpose: product visuals render their own dark surface regardless of page theme, so the values are constant.

- [ ] **Step 4: Document in DESIGN.md**

Append to `DESIGN.md` a subsection titled `### Product-visual tokens` listing the 11 tokens above with their hex values and this note: "Used only by `src/components/product/` visuals. Always dark, theme-independent. Status colors: success/warning/breach/special(SCRA). `--status-focus` mirrors `--focus`."

- [ ] **Step 5: Run test to verify it passes (after Task 2 creates the route, re-run)**

Note: this test also needs the harness route from Task 2. Run it green at the end of Task 2. For now confirm the CSS compiles: `npm run build` (or observe `next dev` recompiles with no error).
Expected: no CSS/build error.

- [ ] **Step 6: Commit**

```bash
git add src/app/globals.css DESIGN.md tests/product/primitives.spec.ts
git commit -m "feat(product-visuals): add product-visual design tokens + doc"
```

---

## Task 2: Dev harness route scaffold

**Files:**
- Create: `src/app/dev/product-visuals/page.tsx`

- [ ] **Step 1: Create the noindexed harness page**

```tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Product visuals — dev harness",
  robots: { index: false, follow: false },
};

/**
 * Dev-only isolation harness for src/components/product primitives + visuals.
 * Noindexed. Remove (or env-gate) before production launch — tracked in the
 * product-visuals spec §2 deferred list.
 *
 * Each primitive is rendered inside a labelled <section data-harness="..."> so
 * Playwright can scope assertions. Sections are filled in as primitives land.
 */
export default function ProductVisualsHarness() {
  return (
    <main className="min-h-screen bg-[var(--product-canvas)] px-6 py-16">
      <h1 className="mb-10 text-2xl font-medium text-[var(--product-text)]">
        Product visuals — dev harness
      </h1>
      <div className="mx-auto flex max-w-5xl flex-col gap-16">
        {/* Primitive sections are added by Tasks 3–9. */}
      </div>
    </main>
  );
}
```

- [ ] **Step 2: Verify it renders**

With `npm run dev` running, run:
`PLAYWRIGHT_BASE_URL=http://localhost:3000 npx playwright test tests/product/primitives.spec.ts -g "status \+ product" --project=chromium`
Expected: PASS (route now resolves, tokens present). The Task 1 test is now green.

- [ ] **Step 3: Commit**

```bash
git add src/app/dev/product-visuals/page.tsx
git commit -m "feat(product-visuals): add noindexed dev harness route"
```

---

## Task 3: EyebrowLabel primitive

**Files:**
- Create: `src/components/product/primitives/EyebrowLabel.tsx`
- Modify: `src/app/dev/product-visuals/page.tsx`
- Test: `tests/product/primitives.spec.ts`

- [ ] **Step 1: Write the failing test**

Append to `tests/product/primitives.spec.ts`:
```ts
test("EyebrowLabel renders text + a decorative dot", async ({ page }) => {
  await page.goto("/dev/product-visuals");
  const eyebrow = page.locator('[data-harness="eyebrow"] >> text=PORTFOLIO OVERVIEW');
  await expect(eyebrow).toBeVisible();
  // uppercase + indigo focus color
  const color = await page
    .locator('[data-harness="eyebrow"] p')
    .first()
    .evaluate((el) => getComputedStyle(el).textTransform);
  expect(color).toBe("uppercase");
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `PLAYWRIGHT_BASE_URL=http://localhost:3000 npx playwright test tests/product/primitives.spec.ts -g "EyebrowLabel" --project=chromium`
Expected: FAIL — `[data-harness="eyebrow"]` not found.

- [ ] **Step 3: Implement EyebrowLabel**

```tsx
import * as React from "react";

import { cn } from "@/lib/utils";

export interface EyebrowLabelProps
  extends React.HTMLAttributes<HTMLParagraphElement> {
  ref?: React.Ref<HTMLParagraphElement>;
}

/** Uppercase eyebrow with a glowing 4px indigo dot prefix. Static. */
export const EyebrowLabel = React.memo(function EyebrowLabel({
  className,
  children,
  ref,
  ...props
}: EyebrowLabelProps) {
  return (
    <p
      ref={ref}
      className={cn(
        "flex items-center gap-2 text-[10.5px] font-[500] uppercase tracking-[0.12em] text-[var(--status-focus)]",
        className,
      )}
      {...props}
    >
      <span
        aria-hidden="true"
        className="inline-block h-1 w-1 rounded-full bg-[var(--primary)] shadow-[0_0_6px_2px_rgba(82,102,235,0.7)]"
      />
      {children}
    </p>
  );
});
```

- [ ] **Step 4: Render it on the harness**

In `src/app/dev/product-visuals/page.tsx`, import and add a section inside the flex column:
```tsx
import { EyebrowLabel } from "@/components/product/primitives/EyebrowLabel";
// ...
<section data-harness="eyebrow">
  <EyebrowLabel>PORTFOLIO OVERVIEW</EyebrowLabel>
</section>
```

- [ ] **Step 5: Run to verify it passes**

Run: `PLAYWRIGHT_BASE_URL=http://localhost:3000 npx playwright test tests/product/primitives.spec.ts -g "EyebrowLabel" --project=chromium`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add src/components/product/primitives/EyebrowLabel.tsx src/app/dev/product-visuals/page.tsx tests/product/primitives.spec.ts
git commit -m "feat(product-visuals): add EyebrowLabel primitive"
```

---

## Task 4: ProductCanvas primitive

**Files:**
- Create: `src/components/product/primitives/ProductCanvas.tsx`
- Modify: `src/app/dev/product-visuals/page.tsx`
- Test: `tests/product/primitives.spec.ts`

- [ ] **Step 1: Write the failing test**

```ts
test("ProductCanvas paints the dark canvas + establishes a container", async ({ page }) => {
  await page.goto("/dev/product-visuals");
  const canvas = page.locator('[data-harness="canvas"] > div').first();
  const bg = await canvas.evaluate((el) => getComputedStyle(el).backgroundColor);
  // #171721 -> rgb(23, 23, 33)
  expect(bg).toBe("rgb(23, 23, 33)");
  const containerType = await canvas.evaluate((el) => getComputedStyle(el).containerType);
  expect(containerType).toBe("inline-size");
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `... -g "ProductCanvas" ...`
Expected: FAIL — locator not found.

- [ ] **Step 3: Implement ProductCanvas**

```tsx
import * as React from "react";

import { cn } from "@/lib/utils";

export interface ProductCanvasProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Number of radial indigo blooms anchored on the canvas. */
  bloom?: "single" | "dual";
  ref?: React.Ref<HTMLDivElement>;
}

const BLOOM = {
  single:
    "radial-gradient(60% 55% at 25% 12%, rgba(82,102,235,0.14), transparent 70%)",
  dual:
    "radial-gradient(58% 50% at 18% 12%, rgba(82,102,235,0.14), transparent 70%), radial-gradient(55% 45% at 86% 92%, rgba(82,102,235,0.10), transparent 70%)",
} as const;

/** Outer dark canvas: radial indigo bloom + edge-faded 56px grid. Static. */
export const ProductCanvas = React.memo(function ProductCanvas({
  bloom = "single",
  className,
  children,
  style,
  ref,
  ...props
}: ProductCanvasProps) {
  return (
    <div
      ref={ref}
      className={cn(
        "@container relative isolate overflow-hidden rounded-[16px] bg-[var(--product-canvas)] p-[26px]",
        className,
      )}
      style={{ backgroundImage: BLOOM[bloom], ...style }}
      {...props}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage: "radial-gradient(circle at 50% 38%, black, transparent 82%)",
          WebkitMaskImage:
            "radial-gradient(circle at 50% 38%, black, transparent 82%)",
        }}
      />
      {children}
    </div>
  );
});
```

- [ ] **Step 4: Render on harness**

```tsx
import { ProductCanvas } from "@/components/product/primitives/ProductCanvas";
// ...
<section data-harness="canvas">
  <ProductCanvas className="h-48" />
</section>
```

- [ ] **Step 5: Run to verify it passes**

Run: `... -g "ProductCanvas" ...`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add src/components/product/primitives/ProductCanvas.tsx src/app/dev/product-visuals/page.tsx tests/product/primitives.spec.ts
git commit -m "feat(product-visuals): add ProductCanvas primitive"
```

---

## Task 5: ProductCard primitive

**Files:**
- Create: `src/components/product/primitives/ProductCard.tsx`
- Modify: `src/app/dev/product-visuals/page.tsx`
- Test: `tests/product/primitives.spec.ts`

- [ ] **Step 1: Write the failing test**

```ts
test("ProductCard renders a bordered glass surface", async ({ page }) => {
  await page.goto("/dev/product-visuals");
  const card = page.locator('[data-harness="card"] > div').first();
  await expect(card).toBeVisible();
  const radius = await card.evaluate((el) => getComputedStyle(el).borderTopLeftRadius);
  expect(radius).toBe("14px");
});
```

- [ ] **Step 2: Run to verify it fails** — `... -g "ProductCard" ...` → FAIL.

- [ ] **Step 3: Implement ProductCard**

```tsx
import * as React from "react";

import { cn } from "@/lib/utils";

export interface ProductCardProps
  extends React.HTMLAttributes<HTMLDivElement> {
  ref?: React.Ref<HTMLDivElement>;
}

/** Glass card: subtle gradient fill, 1px light border, inset top highlight,
 *  deep ambient shadow. Static. */
export const ProductCard = React.memo(function ProductCard({
  className,
  children,
  style,
  ref,
  ...props
}: ProductCardProps) {
  return (
    <div
      ref={ref}
      className={cn(
        "rounded-[14px] border border-[rgba(255,255,255,0.07)] p-[22px] shadow-[0_24px_44px_-18px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.05)]",
        className,
      )}
      style={{
        backgroundImage:
          "linear-gradient(180deg, rgba(255,255,255,0.028), rgba(255,255,255,0.008))",
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
});
```

- [ ] **Step 4: Render on harness**

```tsx
import { ProductCard } from "@/components/product/primitives/ProductCard";
// inside a ProductCanvas so the glass reads correctly:
<section data-harness="card">
  <ProductCanvas>
    <ProductCard>
      <p className="text-[var(--product-text)]">Card body</p>
    </ProductCard>
  </ProductCanvas>
</section>
```

- [ ] **Step 5: Run to verify it passes** — `... -g "ProductCard" ...` → PASS.

- [ ] **Step 6: Commit**

```bash
git add src/components/product/primitives/ProductCard.tsx src/app/dev/product-visuals/page.tsx tests/product/primitives.spec.ts
git commit -m "feat(product-visuals): add ProductCard primitive"
```

---

## Task 6: MetricCell primitive

**Files:**
- Create: `src/components/product/primitives/MetricCell.tsx`
- Modify: `src/app/dev/product-visuals/page.tsx`
- Test: `tests/product/primitives.spec.ts`

- [ ] **Step 1: Write the failing test**

```ts
test("MetricCell renders label, value, unit, delta with tabular-nums", async ({ page }) => {
  await page.goto("/dev/product-visuals");
  const cell = page.locator('[data-harness="metric"]');
  await expect(cell.getByText("ACTIVE INVENTORY")).toBeVisible();
  await expect(cell.getByText("$847.2M")).toBeVisible();
  await expect(cell.getByText("▲ $12.4M vs prior")).toBeVisible();
  const variant = await cell
    .locator("text=$847.2M")
    .evaluate((el) => getComputedStyle(el).fontVariantNumeric);
  expect(variant).toContain("tabular-nums");
});
```

- [ ] **Step 2: Run to verify it fails** — `... -g "MetricCell" ...` → FAIL.

- [ ] **Step 3: Implement MetricCell**

```tsx
import * as React from "react";

import { cn } from "@/lib/utils";

const DELTA_TONE = {
  success: "var(--status-success)",
  breach: "var(--status-breach)",
  neutral: "var(--product-text-3)",
} as const;

export interface MetricCellProps {
  label: string;
  value: string;
  /** Optional unit rendered smaller after the value (e.g. "%", "M"). */
  unit?: string;
  delta?: string;
  deltaTone?: keyof typeof DELTA_TONE;
  className?: string;
  ref?: React.Ref<HTMLDivElement>;
}

/** KPI cell: label, value (with optional unit suffix), colored delta. Static. */
export const MetricCell = React.memo(function MetricCell({
  label,
  value,
  unit,
  delta,
  deltaTone = "neutral",
  className,
  ref,
}: MetricCellProps) {
  return (
    <div ref={ref} className={cn("flex flex-col gap-1", className)}>
      <span className="text-[10.5px] font-[500] uppercase tracking-[0.08em] text-[var(--product-text-3)]">
        {label}
      </span>
      <span className="text-[18px] font-[500] leading-none tracking-[-0.022em] tabular-nums text-[var(--product-text)]">
        {value}
        {unit ? (
          <span className="ml-0.5 text-[12px] text-[var(--product-text-2)]">
            {unit}
          </span>
        ) : null}
      </span>
      {delta ? (
        <span
          className="text-[11px] tabular-nums"
          style={{ color: DELTA_TONE[deltaTone] }}
        >
          {delta}
        </span>
      ) : null}
    </div>
  );
});
```

- [ ] **Step 4: Render on harness**

```tsx
import { MetricCell } from "@/components/product/primitives/MetricCell";
<section data-harness="metric">
  <ProductCanvas>
    <MetricCell label="ACTIVE INVENTORY" value="$847.2M" delta="▲ $12.4M vs prior" deltaTone="success" />
  </ProductCanvas>
</section>
```

- [ ] **Step 5: Run to verify it passes** — `... -g "MetricCell" ...` → PASS.

- [ ] **Step 6: Commit**

```bash
git add src/components/product/primitives/MetricCell.tsx src/app/dev/product-visuals/page.tsx tests/product/primitives.spec.ts
git commit -m "feat(product-visuals): add MetricCell primitive"
```

---

## Task 7: StatPill primitive

**Files:**
- Create: `src/components/product/primitives/StatPill.tsx`
- Modify: `src/app/dev/product-visuals/page.tsx`
- Test: `tests/product/primitives.spec.ts`

- [ ] **Step 1: Write the failing test**

```ts
test("StatPill renders label with tone color", async ({ page }) => {
  await page.goto("/dev/product-visuals");
  const pill = page.locator('[data-harness="statpill"]').getByText("Engine v4.2");
  await expect(pill).toBeVisible();
});
```

- [ ] **Step 2: Run to verify it fails** — `... -g "StatPill" ...` → FAIL.

- [ ] **Step 3: Implement StatPill**

```tsx
import * as React from "react";

import { cn } from "@/lib/utils";

const TONE = {
  neutral: "var(--product-text-3)",
  indigo: "var(--status-focus)",
  success: "var(--status-success)",
} as const;

export interface StatPillProps {
  label: string;
  tone?: keyof typeof TONE;
  className?: string;
  ref?: React.Ref<HTMLSpanElement>;
}

/** Small inline metric pill used in visual footers. Static. */
export const StatPill = React.memo(function StatPill({
  label,
  tone = "neutral",
  className,
  ref,
}: StatPillProps) {
  return (
    <span
      ref={ref}
      className={cn(
        "inline-flex items-center rounded-full border border-[rgba(255,255,255,0.08)] px-2.5 py-1 text-[11px] tabular-nums",
        className,
      )}
      style={{ color: TONE[tone] }}
    >
      {label}
    </span>
  );
});
```

- [ ] **Step 4: Render on harness**

```tsx
import { StatPill } from "@/components/product/primitives/StatPill";
<section data-harness="statpill">
  <ProductCanvas>
    <div className="flex gap-2">
      <StatPill label="Last sync 04:00" />
      <StatPill label="All vendors current" tone="success" />
      <StatPill label="Engine v4.2" tone="indigo" />
    </div>
  </ProductCanvas>
</section>
```

- [ ] **Step 5: Run to verify it passes** — `... -g "StatPill" ...` → PASS.

- [ ] **Step 6: Commit**

```bash
git add src/components/product/primitives/StatPill.tsx src/app/dev/product-visuals/page.tsx tests/product/primitives.spec.ts
git commit -m "feat(product-visuals): add StatPill primitive"
```

---

## Task 8: LiveStatus primitive (client, motion)

**Files:**
- Create: `src/components/product/primitives/LiveStatus.tsx`
- Modify: `src/app/dev/product-visuals/page.tsx`
- Test: `tests/product/primitives.spec.ts`

- [ ] **Step 1: Write the failing test**

```ts
test("LiveStatus renders label + pulsing dot", async ({ page }) => {
  await page.goto("/dev/product-visuals");
  await expect(page.locator('[data-harness="livestatus"]').getByText("LIVE")).toBeVisible();
});

test("LiveStatus stills its dot under reduced motion", async ({ browser }) => {
  const ctx = await browser.newContext({ reducedMotion: "reduce" });
  const page = await ctx.newPage();
  await page.goto("/dev/product-visuals");
  await expect(page.locator('[data-harness="livestatus"]').getByText("LIVE")).toBeVisible();
  await ctx.close();
});
```

- [ ] **Step 2: Run to verify it fails** — `... -g "LiveStatus" ...` → FAIL.

- [ ] **Step 3: Implement LiveStatus**

```tsx
"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";

import { cn } from "@/lib/utils";

const TONE = {
  live: "var(--status-focus)",
  success: "var(--status-success)",
} as const;

export interface LiveStatusProps {
  label: string;
  tone?: keyof typeof TONE;
  className?: string;
  ref?: React.Ref<HTMLSpanElement>;
}

/** Pulsing-dot status pill (LIVE / EVALUATED / AUDITED). Pulse honors
 *  prefers-reduced-motion. */
export const LiveStatus = React.memo(function LiveStatus({
  label,
  tone = "live",
  className,
  ref,
}: LiveStatusProps) {
  const reduce = useReducedMotion();
  const color = TONE[tone];
  return (
    <span
      ref={ref}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-[rgba(255,255,255,0.10)] bg-[rgba(255,255,255,0.04)] px-2.5 py-1 text-[10px] font-[500] uppercase tracking-[0.08em] text-[var(--product-text-2)]",
        className,
      )}
    >
      <motion.span
        aria-hidden="true"
        className="inline-block h-1.5 w-1.5 rounded-full"
        style={{ backgroundColor: color, boxShadow: `0 0 6px 1px ${color}` }}
        animate={reduce ? undefined : { opacity: [0.45, 1, 0.45], scale: [0.85, 1.15, 0.85] }}
        transition={
          reduce ? undefined : { duration: 2.4, repeat: Infinity, ease: "easeInOut" }
        }
      />
      {label}
    </span>
  );
});
```

- [ ] **Step 4: Render on harness**

```tsx
import { LiveStatus } from "@/components/product/primitives/LiveStatus";
<section data-harness="livestatus">
  <ProductCanvas>
    <div className="flex gap-2">
      <LiveStatus label="LIVE" />
      <LiveStatus label="AUDITED" tone="success" />
    </div>
  </ProductCanvas>
</section>
```

- [ ] **Step 5: Run to verify it passes** — `... -g "LiveStatus" ...` → PASS (both tests).

- [ ] **Step 6: Commit**

```bash
git add src/components/product/primitives/LiveStatus.tsx src/app/dev/product-visuals/page.tsx tests/product/primitives.spec.ts
git commit -m "feat(product-visuals): add LiveStatus primitive"
```

---

## Task 9: EventBadge primitive (client, cycle)

**Files:**
- Create: `src/components/product/primitives/EventBadge.tsx`
- Modify: `src/app/dev/product-visuals/page.tsx`
- Test: `tests/product/primitives.spec.ts`

- [ ] **Step 1: Write the failing test**

```ts
test("EventBadge renders its label and is visible under reduced motion", async ({ browser }) => {
  const ctx = await browser.newContext({ reducedMotion: "reduce" });
  const page = await ctx.newPage();
  await page.goto("/dev/product-visuals");
  // Under reduced motion the badge renders statically visible (no cycle).
  await expect(
    page.locator('[data-harness="eventbadge"]').getByText("147 placements · last hour"),
  ).toBeVisible();
  await ctx.close();
});
```

- [ ] **Step 2: Run to verify it fails** — `... -g "EventBadge" ...` → FAIL.

- [ ] **Step 3: Implement EventBadge**

```tsx
"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";

import { cn } from "@/lib/utils";

export interface EventBadgeProps {
  label: string;
  className?: string;
  ref?: React.Ref<HTMLDivElement>;
}

/** Floating event notification, anchored top-right of the *canvas*. Long-dwell
 *  cycle (mostly hidden, brief appearance). Under reduced motion it renders
 *  statically visible. */
export const EventBadge = React.memo(function EventBadge({
  label,
  className,
  ref,
}: EventBadgeProps) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      ref={ref}
      className={cn(
        "absolute right-4 top-4 z-10 inline-flex items-center gap-1.5 rounded-full border border-[rgba(255,255,255,0.10)] bg-[rgba(27,27,39,0.85)] px-2.5 py-1 text-[10.5px] tabular-nums text-[var(--product-text-2)] backdrop-blur-md",
        className,
      )}
      initial={reduce ? false : { opacity: 0, y: -6 }}
      animate={
        reduce
          ? { opacity: 1, y: 0 }
          : { opacity: [0, 0, 1, 1, 0], y: [-6, -6, 0, 0, -6] }
      }
      transition={
        reduce
          ? undefined
          : { duration: 15, times: [0, 0.5, 0.58, 0.92, 1], repeat: Infinity, ease: "easeInOut" }
      }
    >
      <span
        aria-hidden="true"
        className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--status-focus)] shadow-[0_0_6px_1px_var(--status-focus)]"
      />
      {label}
    </motion.div>
  );
});
```

- [ ] **Step 4: Render on harness**

```tsx
import { EventBadge } from "@/components/product/primitives/EventBadge";
<section data-harness="eventbadge">
  <ProductCanvas className="min-h-32">
    <EventBadge label="147 placements · last hour" />
  </ProductCanvas>
</section>
```

- [ ] **Step 5: Run to verify it passes** — `... -g "EventBadge" ...` → PASS.

- [ ] **Step 6: Commit**

```bash
git add src/components/product/primitives/EventBadge.tsx src/app/dev/product-visuals/page.tsx tests/product/primitives.spec.ts
git commit -m "feat(product-visuals): add EventBadge primitive"
```

---

## Task 10: Barrel index + full-suite green (responsive + axe)

**Files:**
- Create: `src/components/product/primitives/index.ts`
- Test: `tests/product/primitives.spec.ts`

- [ ] **Step 1: Create the barrel (for ergonomic app imports; tests/harness keep direct imports per `bundle-barrel-imports`)**

```ts
export { EyebrowLabel } from "./EyebrowLabel";
export { ProductCanvas } from "./ProductCanvas";
export { ProductCard } from "./ProductCard";
export { MetricCell } from "./MetricCell";
export { StatPill } from "./StatPill";
export { LiveStatus } from "./LiveStatus";
export { EventBadge } from "./EventBadge";
```

- [ ] **Step 2: Write the axe + responsive test**

Append:
```ts
import AxeBuilder from "@axe-core/playwright";

for (const width of [320, 480, 768, 1024]) {
  test(`harness has no axe violations and no overflow at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/dev/product-visuals");
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(0);
  });
}
```
(Match the `AxeBuilder` import/usage style already in `tests/a11y/axe-routes.spec.ts` — adjust if that file imports differently.)

- [ ] **Step 3: Run to verify it fails (if any), then fix**

Run: `PLAYWRIGHT_BASE_URL=http://localhost:3000 npx playwright test tests/product/primitives.spec.ts --project=chromium`
Expected: any axe/overflow failures are fixed inline (e.g., add `text-` color tokens for contrast). Re-run to green.

- [ ] **Step 4: Typecheck, lint, full e2e**

Run:
```bash
npm run typecheck
npm run lint
npx playwright test --project=chromium
```
Expected: typecheck clean, lint clean, all specs (existing 170 + new product specs) pass.

- [ ] **Step 5: Commit**

```bash
git add src/components/product/primitives/index.ts tests/product/primitives.spec.ts
git commit -m "feat(product-visuals): primitives barrel + responsive/axe coverage"
```

---

## Self-Review (completed by plan author)

- **Spec coverage:** Spec §4 file layout → Tasks 3–10 (primitives) + index. Spec §5 primitive contracts → one task each (Tasks 3–9), all 7 covered with exact props. Spec §6 tokens → Task 1 + DESIGN.md. Spec §4a React patterns → ref-as-prop (every primitive), `React.memo` (every primitive), explicit `bloom`/`tone` enums not booleans, no inline components, ternary rendering, motion gated. Spec §12 testing → Tasks 1–10 Playwright + Task 10 axe/responsive. Visuals (spec §3/§7) + accordion wiring (§8) + docs landing (§11) are **Plan B**, intentionally out of this plan.
- **Placeholder scan:** No TBD/TODO; every code step shows complete code; every test step shows the command + expected result.
- **Type consistency:** `bloom` enum keys `single|dual`; delta tone `success|breach|neutral`; LiveStatus tone `live|success`; StatPill tone `neutral|indigo|success`. Token names match Task 1 exactly (`--status-*`, `--product-*`). `ref` typed as a prop on every primitive.
- **Note for executor:** Confirm `--primary` resolves to `#5266EB` in `globals.css` (used by EyebrowLabel dot + glows). If the project's `AxeBuilder` import in `tests/a11y/axe-routes.spec.ts` differs, mirror that file's import style in Task 10.
