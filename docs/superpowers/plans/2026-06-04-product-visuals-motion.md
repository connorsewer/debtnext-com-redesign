# Product Visuals Motion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give all 5 homepage product visuals a calm, choreographed entrance (bars grow, charts draw, numbers count, rows cascade) that plays on scroll-into-view and settles to quiet ambient pulses.

**Architecture:** A shared `src/components/product/motion.tsx` defines timing tokens, Framer Motion variants, and number helpers. The shared chart `parts.tsx` and the 5 visuals consume them. Entrance is triggered by Framer `whileInView` (`once: true`); reduced-motion renders final state.

**Tech Stack:** React 19, framer-motion 12 (`import { motion, useReducedMotion, useInView, animate } from "framer-motion"`), Tailwind v4.

**Spec:** `docs/superpowers/specs/2026-06-04-product-visuals-motion-design.md`. Read it first.

## Verification reality (read this)

The Next dev/prod server does NOT run in this sandbox (`next dev/start/build` hang; see the project memory). There is no local red/green loop. The gate for each task is:
1. Code is written exactly as specified, `git commit`.
2. After the foundation (Tasks 1-3) and again after the visuals (Tasks 4-8), `git push origin product-visuals`, then confirm the Vercel build reaches **READY** via the Vercel MCP (`list_deployments` / `get_deployment` / `get_deployment_build_logs`; projectId `prj_Q8Wbxa2ioco7n2MogdHnPpL0MmRP`, teamId `team_QQQGyy2SXClIUvYF2FVNSk0H`). Fix any build error and re-push before continuing.
3. Final task: deploy to production and walk each visual via the Chrome MCP on the live URL + a reduced-motion pass.

Do NOT attempt `npm run dev`/`build` locally to verify.

## File Structure

| File | Responsibility |
|---|---|
| `src/components/product/motion.tsx` (create) | Timing tokens, `staggerContainer`/`fadeUpItem` variants, `inViewProps`, `AnimatedNumber`, `NumberShift` |
| `src/components/product/visuals/parts.tsx` (modify) | `"use client"` + entrance motion on SegmentedBar/ValueBar/Sparkline/AreaLine |
| `src/components/product/primitives/MetricCell.tsx` (modify) | Optional numeric-animation path |
| `src/components/product/visuals/PlacementMatrix.tsx` (modify) | `"use client"` + choreography |
| `src/components/product/visuals/OptimizationEngine.tsx` (modify) | `"use client"` + choreography |
| `src/components/product/visuals/ReportingDashboard.tsx` (modify) | `"use client"` + choreography |
| `src/components/product/visuals/IssuesWorklist.tsx` (modify) | choreography (already client) |
| `src/components/product/visuals/ComplianceStandards.tsx` (modify) | choreography (already client) |

---

## Task 1: Shared motion layer (`motion.tsx`)

**Files:**
- Create: `src/components/product/motion.tsx`

- [ ] **Step 1: Create the file with the complete code below**

```tsx
"use client";

import * as React from "react";
import {
  animate,
  useInView,
  useReducedMotion,
  type Variants,
} from "framer-motion";

// ---- Timing + easing tokens (docs/product-visuals-system.md motion vocab) ----
export const EASE_ENTRANCE = [0.16, 1, 0.3, 1] as const; // calm ease-out
export const EASE_STATE = [0.2, 0.7, 0.2, 1] as const; // state / number shift
export const STAGGER = 0.06;
export const DUR_ITEM = 0.5;
export const DUR_BAR = 0.8;
export const DUR_COUNT = 1.0;
export const TINT = "#9CB4E8"; // --status-focus, number-shift tint
export const TEXT_DEFAULT = "#EDEDF3"; // --product-text

// ---- Entrance variants ----
export const staggerContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: STAGGER, delayChildren: 0.05 } },
};

export const fadeUpItem: Variants = {
  hidden: { opacity: 0, y: 8 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: DUR_ITEM, ease: EASE_ENTRANCE },
  },
};

export const popItem: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.35, ease: EASE_ENTRANCE },
  },
};

/** Spread onto a motion stagger container to trigger on scroll-into-view. */
export const inViewProps = {
  initial: "hidden" as const,
  whileInView: "show" as const,
  viewport: { once: true, amount: 0.3 },
};

/** Count a number up from 0 when it scrolls into view. tabular-nums keeps
 *  width stable. Reduced motion renders the final value immediately. */
export function AnimatedNumber({
  value,
  prefix = "",
  suffix = "",
  decimals = 0,
  className,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const ref = React.useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });

  const format = React.useCallback(
    (n: number) =>
      `${prefix}${n.toLocaleString("en-US", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}${suffix}`,
    [prefix, suffix, decimals],
  );

  React.useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (reduce) {
      node.textContent = format(value);
      return;
    }
    if (!inView) {
      node.textContent = format(0);
      return;
    }
    const controls = animate(0, value, {
      duration: DUR_COUNT,
      ease: EASE_ENTRANCE,
      onUpdate: (v) => {
        node.textContent = format(v);
      },
    });
    return () => controls.stop();
  }, [value, reduce, inView, format]);

  return (
    <span
      ref={ref}
      className={className}
      style={{ fontVariantNumeric: "tabular-nums" }}
    >
      {format(reduce ? value : 0)}
    </span>
  );
}
```

- [ ] **Step 2: Add `NumberShift` to the same file (append before the final newline)**

```tsx
import { motion } from "framer-motion";

/** For composite/formatted values that read awkwardly counting up
 *  ($847.2M, "42% → 47%"). Renders the static string but tints from the
 *  focus color to the default text color on entrance. */
export function NumberShift({
  children,
  color = TEXT_DEFAULT,
  className,
}: {
  children: React.ReactNode;
  color?: string;
  className?: string;
}) {
  const reduce = useReducedMotion();
  if (reduce) return <span className={className}>{children}</span>;
  return (
    <motion.span
      className={className}
      initial={{ color: TINT }}
      whileInView={{ color }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{ duration: DUR_COUNT, ease: EASE_STATE }}
    >
      {children}
    </motion.span>
  );
}
```
(Move the `import { motion } from "framer-motion";` up next to the other framer import; one import line `import { animate, motion, useInView, useReducedMotion, type Variants } from "framer-motion";`.)

- [ ] **Step 3: Commit**

```bash
git add src/components/product/motion.tsxx
git commit -m "feat(product-visuals): shared motion layer (tokens, variants, AnimatedNumber, NumberShift)"
```

---

## Task 2: Animate the shared chart parts (`parts.tsx`)

**Files:**
- Modify: `src/components/product/visuals/parts.tsx`

- [ ] **Step 1: Add `"use client"` and imports at the very top**

```tsx
"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";

import { cn } from "@/lib/utils";
import { DUR_BAR, EASE_ENTRANCE } from "@/components/product/motion";
```
(Replace the existing top imports; keep `INDIGO_SHADES` and everything else.)

- [ ] **Step 2: Replace `SegmentedBar` with a left-to-right clip-path wipe (labels stay crisp)**

```tsx
export const SegmentedBar = React.memo(function SegmentedBar({
  segments,
  className,
}: {
  segments: number[];
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={cn("flex h-5 w-full overflow-hidden rounded-[5px]", className)}
      role="img"
      aria-label={`Allocation: ${segments.map((s) => `${s}%`).join(", ")}`}
      initial={reduce ? false : { clipPath: "inset(0 100% 0 0)" }}
      whileInView={{ clipPath: "inset(0 0% 0 0)" }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{ duration: DUR_BAR, ease: EASE_ENTRANCE }}
    >
      {segments.map((pct, i) => (
        <div
          key={i}
          className="flex items-center justify-center text-[9.5px] font-[500] tabular-nums text-white/90"
          style={{
            width: `${pct}%`,
            backgroundColor: INDIGO_SHADES[i % INDIGO_SHADES.length],
          }}
        >
          {pct}%
        </div>
      ))}
    </motion.div>
  );
});
```

- [ ] **Step 3: Replace `ValueBar` so the fill grows via `scaleX`**

```tsx
export const ValueBar = React.memo(function ValueBar({
  value,
  tone = "indigo",
  className,
}: {
  value: number;
  tone?: "indigo" | "success" | "warning";
  className?: string;
}) {
  const reduce = useReducedMotion();
  const color =
    tone === "success"
      ? "var(--status-success)"
      : tone === "warning"
        ? "var(--status-warning)"
        : "var(--primary)";
  return (
    <div
      className={cn("h-1.5 w-full rounded-full bg-white/10", className)}
      role="img"
      aria-label={`${value}%`}
    >
      <motion.div
        className="h-full origin-left rounded-full"
        style={{ width: `${value}%`, backgroundColor: color }}
        initial={reduce ? false : { scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: DUR_BAR, ease: EASE_ENTRANCE }}
      />
    </div>
  );
});
```

- [ ] **Step 4: Replace `Sparkline` so bars rise via `scaleY` (staggered)**

```tsx
export const Sparkline = React.memo(function Sparkline({
  bars,
  className,
}: {
  bars: number[];
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <div className={cn("flex h-8 items-end gap-1", className)} aria-hidden="true">
      {bars.map((h, i) => (
        <motion.div
          key={i}
          className="w-1.5 origin-bottom rounded-sm"
          style={{
            height: `${Math.max(8, h * 100)}%`,
            backgroundColor:
              i === bars.length - 1 ? "var(--primary)" : "rgba(255,255,255,0.18)",
          }}
          initial={reduce ? false : { scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.45, ease: EASE_ENTRANCE, delay: i * 0.05 }}
        />
      ))}
    </div>
  );
});
```

- [ ] **Step 5: Replace `AreaLine` so the line draws (`pathLength`), fill fades, end dot glows**

```tsx
export const AreaLine = React.memo(function AreaLine({
  points,
  className,
}: {
  points: number[];
  className?: string;
}) {
  const reduce = useReducedMotion();
  const w = 100;
  const h = 40;
  const step = points.length > 1 ? w / (points.length - 1) : w;
  const coords = points.map((p, i) => [
    Number((i * step).toFixed(1)),
    Number((h - p * h).toFixed(1)),
  ]);
  const line = coords
    .map(([x, y], i) => `${i === 0 ? "M" : "L"}${x},${y}`)
    .join(" ");
  const area = `${line} L${w},${h} L0,${h} Z`;
  const last = coords[coords.length - 1] ?? [w, h];
  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      preserveAspectRatio="none"
      className={cn("h-12 w-full", className)}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="al-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(82,102,235,0.35)" />
          <stop offset="100%" stopColor="rgba(82,102,235,0)" />
        </linearGradient>
      </defs>
      <motion.path
        d={area}
        fill="url(#al-fill)"
        initial={reduce ? false : { opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: DUR_BAR, ease: EASE_ENTRANCE, delay: 0.2 }}
      />
      <motion.path
        d={line}
        fill="none"
        stroke="var(--primary)"
        strokeWidth="1.5"
        vectorEffect="non-scaling-stroke"
        initial={reduce ? false : { pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: DUR_BAR, ease: EASE_ENTRANCE }}
      />
      <motion.circle
        cx={last[0]}
        cy={last[1]}
        r="2.2"
        fill="#fff"
        stroke="var(--primary)"
        strokeWidth="1.5"
        initial={reduce ? false : { scale: 0, opacity: 0 }}
        whileInView={
          reduce ? undefined : { scale: [0, 1, 1], opacity: 1 }
        }
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: DUR_BAR, ease: EASE_ENTRANCE }}
        style={{ transformOrigin: `${last[0]}px ${last[1]}px` }}
      />
    </svg>
  );
});
```
(Note: this keeps the same prop signatures as before; only internals change. The previous static `Tag`/`TypeChip`/`tintBg`/`ToneKey` exports stay unchanged.)

- [ ] **Step 6: Commit**

```bash
git add src/components/product/visuals/parts.tsx
git commit -m "feat(product-visuals): entrance motion on chart parts (bar grow, chart draw, sparkline rise)"
```

---

## Task 3: MetricCell numeric path

**Files:**
- Modify: `src/components/product/primitives/MetricCell.tsx`

- [ ] **Step 1: Add `"use client"` + import, and an optional numeric prop**

At the top of `MetricCell.tsx`, add `"use client";` as the first line, then add the import:
```tsx
import { AnimatedNumber } from "@/components/product/motion";
```
Extend `MetricCellProps` with three optional fields (keep all existing fields):
```tsx
  /** When set, the value animates by counting up to `numericValue`,
   *  formatted with these options. Falls back to the static `value` string. */
  numericValue?: number;
  numericDecimals?: number;
  numericSuffix?: string;
```

- [ ] **Step 2: Render the animated value when `numericValue` is provided**

Replace the value `<span>` block so it conditionally renders `AnimatedNumber`:
```tsx
      <span className="text-[18px] font-[500] leading-none tracking-[-0.022em] tabular-nums text-[var(--product-text)]">
        {numericValue != null ? (
          <AnimatedNumber
            value={numericValue}
            decimals={numericDecimals ?? 0}
            suffix={numericSuffix ?? ""}
          />
        ) : (
          value
        )}
        {unit ? (
          <span className="ml-0.5 text-[12px] text-[var(--product-text-2)]">
            {unit}
          </span>
        ) : null}
      </span>
```
Destructure the new props in the function signature alongside the existing ones.

- [ ] **Step 3: Commit**

```bash
git add src/components/product/primitives/MetricCell.tsx
git commit -m "feat(product-visuals): MetricCell optional count-up numeric path"
```

- [ ] **Step 4: Push foundation + verify Vercel build**

```bash
git push origin product-visuals
```
Then via Vercel MCP `list_deployments` (projectId `prj_Q8Wbxa2ioco7n2MogdHnPpL0MmRP`, teamId `team_QQQGyy2SXClIUvYF2FVNSk0H`), wait for the new deployment to reach `state: "READY"`. If `ERROR`, read `get_deployment_build_logs`, fix, re-push. Expected: READY (foundation compiles even though no visual consumes it yet).

---

## Task 4: PlacementMatrix choreography

**Files:**
- Modify: `src/components/product/visuals/PlacementMatrix.tsx`

- [ ] **Step 1: Make it a client component + import motion helpers**

Add `"use client";` as the first line. Add imports:
```tsx
import { motion } from "framer-motion";

import {
  AnimatedNumber,
  fadeUpItem,
  inViewProps,
  staggerContainer,
} from "@/components/product/motion";
```

- [ ] **Step 2: Wrap the tier-rows grid in a stagger container and make each row a `fadeUpItem`**

Change the matrix grid wrapper to a `motion.div` with `variants={staggerContainer}` and `{...inViewProps}`. Each tier row's outer element becomes `<motion.div variants={fadeUpItem}>`. Because the grid currently uses a `React.Fragment` per row with three grid cells, restructure each row to a single `motion.div` that itself is a 3-column subgrid, OR keep the fragment and wrap the whole grid as the stagger parent with each of the three cells per row sharing one `fadeUpItem` by grouping. Simplest: wrap each row's three cells in one `motion.div` with `className="contents"` won't animate; instead give the grid `variants={staggerContainer}` and convert the **row label cell** to `motion.div variants={fadeUpItem}` and leave bar + count as static children of the same row (they reveal with their own part/number animation). Concretely:

```tsx
<motion.div
  className="mt-4 grid grid-cols-[1.1fr_2fr_0.6fr] gap-x-4 gap-y-3"
  variants={staggerContainer}
  {...inViewProps}
>
  <span className="text-[10px] uppercase tracking-[0.08em] text-[var(--product-text-3)]">Treatment tier</span>
  <span className="text-[10px] uppercase tracking-[0.08em] text-[var(--product-text-3)]">Vendor allocation</span>
  <span className="text-right text-[10px] uppercase tracking-[0.08em] text-[var(--product-text-3)]">Accounts</span>
  {ROWS.map((r) => (
    <React.Fragment key={r.tier}>
      <motion.div variants={fadeUpItem}>
        <p className="text-[12.5px] font-[500]">{r.tier}</p>
        <p className="text-[10.5px] text-[var(--product-text-3)]">{r.sub}</p>
      </motion.div>
      <SegmentedBar segments={[...r.segments]} className="self-center" />
      <span className="self-center text-right text-[12.5px] tabular-nums">
        <AnimatedNumber value={Number(r.accounts.replace(/,/g, ""))} />
      </span>
    </React.Fragment>
  ))}
</motion.div>
```
`SegmentedBar` already animates (Task 2). The account string `"12,847"` becomes `AnimatedNumber value={12847}` (parse by stripping commas; `toLocaleString` re-inserts them).

- [ ] **Step 3: Commit**

```bash
git add src/components/product/visuals/PlacementMatrix.tsx
git commit -m "feat(product-visuals): PlacementMatrix entrance choreography"
```

---

## Task 5: OptimizationEngine choreography

**Files:**
- Modify: `src/components/product/visuals/OptimizationEngine.tsx`

- [ ] **Step 1: Client + imports**

Add `"use client";` first line. Imports:
```tsx
import { motion } from "framer-motion";

import {
  AnimatedNumber,
  fadeUpItem,
  inViewProps,
  NumberShift,
  popItem,
  staggerContainer,
} from "@/components/product/motion";
```

- [ ] **Step 2: Stagger the vendor rows; count liquidation %, pop band tags, number-shift the allocation shift**

Wrap the vendor-rows grid as `motion.div variants={staggerContainer} {...inViewProps}`. For each vendor row, wrap the vendor name/sub cell in `motion.div variants={fadeUpItem}`. Convert:
- Liquidation `{v.liq}` (e.g. `"22.8%"`) → `<AnimatedNumber value={parseFloat(v.liq)} decimals={1} suffix="%" />`
- Band `<Tag ... />` → wrap in `<motion.span variants={popItem} className="inline-flex"><Tag label={v.band} tone={v.bandTone as ToneKey} /></motion.span>`
- Allocation shift `{v.shift}` (e.g. `"42% → 47%"`) → `<NumberShift>{v.shift}</NumberShift>`

The green bonus `ProductCard` callout: wrap it in `<motion.div variants={fadeUpItem} {...}>` so it fades up last (it is outside the rows grid, so give it its own `initial/whileInView`):
```tsx
<motion.div
  initial={{ opacity: 0, y: 12 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, amount: 0.4 }}
  transition={{ duration: 0.5, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
>
  <ProductCard className="mt-4" style={{ ... }}>
    ... existing callout content ...
  </ProductCard>
</motion.div>
```

- [ ] **Step 3: Commit**

```bash
git add src/components/product/visuals/OptimizationEngine.tsx
git commit -m "feat(product-visuals): OptimizationEngine entrance choreography"
```

---

## Task 6: IssuesWorklist choreography

**Files:**
- Modify: `src/components/product/visuals/IssuesWorklist.tsx` (already `"use client"`)

- [ ] **Step 1: Import motion helpers**

```tsx
import {
  AnimatedNumber,
  fadeUpItem,
  inViewProps,
  staggerContainer,
} from "@/components/product/motion";
```
(`motion` and `useReducedMotion` are already imported.)

- [ ] **Step 2: Cascade the 5 issue rows**

Wrap the issue-rows container (`<div className="mt-3 flex flex-col divide-y divide-white/[0.06]">`) as `motion.div variants={staggerContainer} {...inViewProps}`, and make each issue row's outer `<div ... className="grid grid-cols-[auto_1fr_auto] ...">` a `motion.div variants={fadeUpItem}`. Keep the existing breaching-dot pulse exactly as is (it is independent of the entrance).

- [ ] **Step 3: Count the 3 metric tiles**

Convert the three `<MetricCell .../>` at the bottom to use the numeric path:
```tsx
<MetricCell label="SLA ADHERENCE · 30D" value="97.4%" numericValue={97.4} numericDecimals={1} numericSuffix="%" delta="▲ 1.8pt" deltaTone="success" />
<MetricCell label="AVG RESOLUTION" value="3.2h" delta="▼ 0.4h" deltaTone="success" />
<MetricCell label="AUTO-RESOLVED" value="64%" numericValue={64} numericSuffix="%" delta="8,247 / 12,891" deltaTone="neutral" />
```
(Leave `3.2h` static — the `h` suffix mid-format reads fine without a count.)

- [ ] **Step 4: Commit**

```bash
git add src/components/product/visuals/IssuesWorklist.tsx
git commit -m "feat(product-visuals): IssuesWorklist entrance choreography"
```

---

## Task 7: ReportingDashboard choreography

**Files:**
- Modify: `src/components/product/visuals/ReportingDashboard.tsx`

- [ ] **Step 1: Client + imports**

Add `"use client";` first line. Imports:
```tsx
import { motion } from "framer-motion";

import {
  AnimatedNumber,
  fadeUpItem,
  inViewProps,
  staggerContainer,
} from "@/components/product/motion";
```

- [ ] **Step 2: Stagger the 4 panels**

Wrap the 2x2 panel grid (`<div className="mt-4 grid grid-cols-1 gap-3 @md:grid-cols-2">`) as `motion.div variants={staggerContainer} {...inViewProps}`, and wrap each of the 4 `<ProductCard>` panels in `<motion.div variants={fadeUpItem}>`. The tier `ValueBar`s, the `AreaLine`, and the `Sparkline` inside already animate (Task 2).

- [ ] **Step 3: Count the SLA hero number**

In panel 4, change `<p className="mt-2 text-[28px] ...">97.4%</p>` to:
```tsx
<p className="mt-2 text-[28px] font-[500] tabular-nums">
  <AnimatedNumber value={97.4} decimals={1} suffix="%" />
</p>
```

- [ ] **Step 4: Commit**

```bash
git add src/components/product/visuals/ReportingDashboard.tsx
git commit -m "feat(product-visuals): ReportingDashboard entrance choreography"
```

---

## Task 8: ComplianceStandards choreography

**Files:**
- Modify: `src/components/product/visuals/ComplianceStandards.tsx` (already `"use client"`)

- [ ] **Step 1: Import motion helpers**

```tsx
import {
  AnimatedNumber,
  fadeUpItem,
  inViewProps,
  popItem,
  staggerContainer,
} from "@/components/product/motion";
```
(`motion` + `useReducedMotion` already imported.)

- [ ] **Step 2: Adherence rows — stagger, count %, pop status tags**

Wrap the adherence-rows container (`<div className="mt-2 flex flex-col gap-2.5">`) as `motion.div variants={staggerContainer} {...inViewProps}`; each vendor row outer `<div className="grid grid-cols-[1.4fr_2fr_auto_auto] ...">` becomes `motion.div variants={fadeUpItem}`. The `<ValueBar>` already animates. Convert `{v.value}%` to `<AnimatedNumber value={v.value} decimals={1} suffix="%" />`. Wrap the status `<Tag>` in `<motion.span variants={popItem} className="inline-flex"><Tag .../></motion.span>`.

- [ ] **Step 3: Cascade the exceptions feed**

Wrap the exceptions container (`<div className="mt-2 flex flex-col divide-y divide-white/[0.06]">`) as `motion.div variants={staggerContainer} {...inViewProps}`; each exception row `<div className="flex items-center justify-between gap-3 py-2">` becomes `motion.div variants={fadeUpItem}`. Keep the live feed-dot pulse as is.

- [ ] **Step 4: Commit**

```bash
git add src/components/product/visuals/ComplianceStandards.tsx
git commit -m "feat(product-visuals): ComplianceStandards entrance choreography"
```

---

## Task 9: Deploy + verify on Vercel

**Files:** none (verification)

- [ ] **Step 1: Push and verify the build**

```bash
git push origin product-visuals
```
Via Vercel MCP, wait for the `product-visuals` preview to reach `READY`. If `ERROR`, read build logs, fix, re-push. (Common motion pitfalls: a stray `motion.*` element with a non-animatable prop, or a missing import.)

- [ ] **Step 2: Promote to production**

```bash
git push origin product-visuals:main
```
Wait for the `target: "production"` deployment of the new SHA to reach `READY`.

- [ ] **Step 3: Walk each visual via the Chrome MCP on `https://debtnext-website.vercel.app/`**

Scroll to (or anchor `#how-it-works`) the "How it works" section. For each of the 5 accordion items, click it and confirm: rows cascade in, bars grow / chart draws / sparkline rises, numbers count up (clean numerics) or tint-resolve (composites), and the ambient pulses (LIVE dot, breaching SLA dot, compliance feed dot) keep pulsing after settle. Cache-bust with a `?v=` query if a stale build is served.

- [ ] **Step 4: Reduced-motion pass**

In the browser, emulate `prefers-reduced-motion: reduce` (DevTools Rendering tab, or a Chrome MCP `javascript_tool` / emulation). Reload and confirm each visual renders at its **final** state instantly: bars full, chart drawn, numbers at target, no entrance, pulses stilled.

- [ ] **Step 5: Final commit (docs sync, if any)**

If anything in `DESIGN.md` motion notes needs updating to reflect the shipped choreography, update it and commit per the docs-in-sync rule. Otherwise no-op.

---

## Self-Review (completed by plan author)

- **Spec coverage:** §3 motion model + trigger → `inViewProps` (Task 1) applied in Tasks 4-8. §4 timing tokens → Task 1 `motion.tsx`. §5 parts animation → Task 2 (all four). §6 numbers → `AnimatedNumber`/`NumberShift` (Task 1) used in Tasks 4-8 with the count-vs-shift split matching the spec (clean numerics count; `$847.2M`/`42% → 47%` shift). §7 per-visual choreography → Tasks 4-8, one per visual, matching the table. §8 perf/a11y → transforms + `pathLength` only, `useReducedMotion` in every motion component, `inView` count gating. §9 files → exactly the 8 files. §10 verify → Task 9 (deploy + Chrome MCP + reduced-motion).
- **Placeholder scan:** No TBD/TODO. Every code step shows the actual code. Verification steps name exact MCP tools + IDs.
- **Type consistency:** `AnimatedNumber({value, prefix?, suffix?, decimals?})`, `NumberShift({children, color?})`, variant names `staggerContainer`/`fadeUpItem`/`popItem`, `inViewProps`, and MetricCell's `numericValue`/`numericDecimals`/`numericSuffix` are used identically across all tasks. Tokens `DUR_BAR`/`EASE_ENTRANCE` imported where used.
- **Note for executor:** `$847.2M`, `$148.62`, and `42% → 47%` are not in the homepage visuals' current data (the hero Command Center spec has them); within these 5 visuals the only composite needing `NumberShift` is OptimizationEngine's `42% → 47%` shift (Task 5). Everything else is a clean numeric (count-up) or stays static.
