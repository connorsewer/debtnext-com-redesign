# Product Visuals — 5 Accordion Visuals + Wiring Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.
>
> **Depends on Plan A** (`2026-06-04-product-visuals-foundation.md`): the 7 primitives in `src/components/product/primitives/` and the product tokens must exist first. This plan imports them directly.
>
> **Environment note:** Run locally where `next dev` works. Keep `npm run dev` running and test with `PLAYWRIGHT_BASE_URL=http://localhost:3000 npx playwright test <file> --project=chromium`. (The plan author's sandbox could not start the Next server; this plan was not executed there.)

**Goal:** Fill the 5 homepage `FeatureAccordion` visual slots with real, animated product visuals composed from the Plan A primitives, content verbatim from `docs/multimodal-image-prompts.md`.

**Architecture:** Five composed visuals in `src/components/product/visuals/`, plus a small set of shared chart "parts" (bars, sparkline, area line, tags). An `AccordionVisual({ id })` switch maps accordion item ids to visuals. `FeatureAccordion`'s placeholder is replaced by dynamically-imported (`next/dynamic`) visuals, each wrapped in React `<Activity>` so only the active one animates. All metric values are placeholders flagged `[CLAIMS REVIEW]`; compliance/CFPB language flagged `[COI REVIEW]`.

**Tech Stack:** React 19.2 (ref-as-prop, `<Activity>`), Next 16 `next/dynamic`, framer-motion 12, Tailwind v4, Playwright + axe.

**Reference:** `docs/multimodal-image-prompts.md` §3/§4/§6/§7/§8 (verbatim content), the Plan A primitive APIs, `CLAUDE.md` §5 (voice), §6 (COI), §7 (claims).

---

## File Structure

| File | Responsibility |
|---|---|
| `src/components/product/visuals/parts.tsx` (create) | Shared chart parts: `SegmentedBar`, `ValueBar`, `Sparkline`, `AreaLine`, `Tag`, `TypeChip` |
| `src/components/product/visuals/PlacementMatrix.tsx` (create) | Visual for accordion `placement` (doc §6) |
| `src/components/product/visuals/OptimizationEngine.tsx` (create) | Visual for accordion `optimization` (doc §7) |
| `src/components/product/visuals/IssuesWorklist.tsx` (create) | Visual for accordion `issues` (doc §3) |
| `src/components/product/visuals/ReportingDashboard.tsx` (create) | Visual for accordion `reporting` (doc §4) |
| `src/components/product/visuals/ComplianceStandards.tsx` (create) | Visual for accordion `compliance` (doc §8) |
| `src/components/product/visuals/index.tsx` (create) | `AccordionVisual({ id })` dynamic switch |
| `src/components/sections/FeatureAccordion.tsx` (modify) | Replace placeholder with `<AccordionVisual>` + `<Activity>` |
| `docs/product-visuals-system.md`, `docs/asset-and-animation-guide.md`, `docs/midjourney-prompts.md`, `docs/multimodal-image-prompts.md` (create) | Land the 4 reference docs |
| `tests/product/visuals.spec.ts` (create) | Playwright: verbatim content per visual + axe on the homepage accordion |

**Claims handling:** Every numeric/label const block carries a top comment `// [CLAIMS REVIEW] placeholder values — Andrew sign-off required before production`. `IssuesWorklist` + `ComplianceStandards` also carry `// [COI REVIEW] CFPB / compliance language`.

---

## Task 1: Land the 4 reference docs

**Files:**
- Create: `docs/product-visuals-system.md`, `docs/asset-and-animation-guide.md`, `docs/midjourney-prompts.md`, `docs/multimodal-image-prompts.md`

- [ ] **Step 1: Copy the docs from the source zip into `docs/`**

The user has these in the starter zip (`debtnext-website/docs/`). Copy all four verbatim. No edits.

- [ ] **Step 2: Verify they exist and are non-empty**

Run: `ls -l docs/product-visuals-system.md docs/asset-and-animation-guide.md docs/midjourney-prompts.md docs/multimodal-image-prompts.md`
Expected: four files, each > 5 KB.

- [ ] **Step 3: Commit**

```bash
git add docs/product-visuals-system.md docs/asset-and-animation-guide.md docs/midjourney-prompts.md docs/multimodal-image-prompts.md
git commit -m "docs(product-visuals): land reference docs (system, assets, midjourney, multimodal)"
```

---

## Task 2: Shared chart parts

**Files:**
- Create: `src/components/product/visuals/parts.tsx`
- Modify: `src/app/dev/product-visuals/page.tsx` (add a `data-harness="parts"` section)
- Test: `tests/product/visuals.spec.ts`

- [ ] **Step 1: Write the failing test**

Create `tests/product/visuals.spec.ts`:
```ts
import { test, expect } from "@playwright/test";

test("chart parts render on the harness", async ({ page }) => {
  await page.goto("/dev/product-visuals");
  const parts = page.locator('[data-harness="parts"]');
  await expect(parts.getByText("45%")).toBeVisible(); // SegmentedBar label
  await expect(parts.locator("svg").first()).toBeVisible(); // Sparkline/AreaLine
});
```

- [ ] **Step 2: Run to verify it fails** — `PLAYWRIGHT_BASE_URL=http://localhost:3000 npx playwright test tests/product/visuals.spec.ts -g "chart parts" --project=chromium` → FAIL.

- [ ] **Step 3: Implement the parts**

```tsx
import * as React from "react";

import { cn } from "@/lib/utils";

const INDIGO_SHADES = ["#5266EB", "#4456C8", "#3949B5", "#2E3A93"];

/** Horizontal allocation bar split into graduated-indigo segments, with the
 *  percentage label rendered inside each segment. */
export const SegmentedBar = React.memo(function SegmentedBar({
  segments,
  className,
}: {
  segments: number[]; // percentages summing to ~100
  className?: string;
}) {
  return (
    <div
      className={cn("flex h-5 w-full overflow-hidden rounded-[5px]", className)}
      role="img"
      aria-label={`Allocation: ${segments.map((s) => `${s}%`).join(", ")}`}
    >
      {segments.map((pct, i) => (
        <div
          key={i}
          className="flex items-center justify-center text-[9.5px] font-[500] tabular-nums text-white/90"
          style={{ width: `${pct}%`, backgroundColor: INDIGO_SHADES[i % INDIGO_SHADES.length] }}
        >
          {pct}%
        </div>
      ))}
    </div>
  );
});

/** Single-value progress bar with a tone color. */
export const ValueBar = React.memo(function ValueBar({
  value,
  tone = "indigo",
  className,
}: {
  value: number; // 0-100
  tone?: "indigo" | "success" | "warning";
  className?: string;
}) {
  const color =
    tone === "success"
      ? "var(--status-success)"
      : tone === "warning"
        ? "var(--status-warning)"
        : "var(--primary)";
  return (
    <div className={cn("h-1.5 w-full rounded-full bg-white/8", className)} role="img" aria-label={`${value}%`}>
      <div className="h-full rounded-full" style={{ width: `${value}%`, backgroundColor: color }} />
    </div>
  );
});

/** N vertical bars; the last one is solid indigo. */
export const Sparkline = React.memo(function Sparkline({
  bars,
  className,
}: {
  bars: number[]; // 0-1 heights
  className?: string;
}) {
  return (
    <div className={cn("flex h-8 items-end gap-1", className)} aria-hidden="true">
      {bars.map((h, i) => (
        <div
          key={i}
          className="w-1.5 rounded-sm"
          style={{
            height: `${Math.max(8, h * 100)}%`,
            backgroundColor: i === bars.length - 1 ? "var(--primary)" : "rgba(255,255,255,0.18)",
          }}
        />
      ))}
    </div>
  );
});

/** Smooth indigo area-fill line chart with a glowing end dot. Static SVG. */
export const AreaLine = React.memo(function AreaLine({
  points,
  className,
}: {
  points: number[]; // 0-1 values, left to right
  className?: string;
}) {
  const w = 100;
  const h = 40;
  const step = points.length > 1 ? w / (points.length - 1) : w;
  const coords = points.map((p, i) => [Number((i * step).toFixed(1)), Number((h - p * h).toFixed(1))]);
  const line = coords.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x},${y}`).join(" ");
  const area = `${line} L${w},${h} L0,${h} Z`;
  const [ex, ey] = coords[coords.length - 1];
  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className={cn("h-12 w-full", className)} aria-hidden="true">
      <defs>
        <linearGradient id="al-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(82,102,235,0.35)" />
          <stop offset="100%" stopColor="rgba(82,102,235,0)" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#al-fill)" />
      <path d={line} fill="none" stroke="var(--primary)" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
      <circle cx={ex} cy={ey} r="2.2" fill="#fff" stroke="var(--primary)" strokeWidth="1.5" />
    </svg>
  );
});

const TAG_TONE = {
  success: "var(--status-success)",
  warning: "var(--status-warning)",
  breach: "var(--status-breach)",
  special: "var(--status-special)",
  neutral: "var(--product-text-3)",
} as const;

/** Small colored category tag (HIGH/MID/LOW, On time, etc.). */
export const Tag = React.memo(function Tag({
  label,
  tone = "neutral",
  className,
}: {
  label: string;
  tone?: keyof typeof TAG_TONE;
  className?: string;
}) {
  return (
    <span
      className={cn("inline-flex items-center rounded-[5px] px-1.5 py-0.5 text-[9.5px] font-[600] uppercase tracking-[0.04em]", className)}
      style={{ color: TAG_TONE[tone], backgroundColor: `color-mix(in srgb, ${TAG_TONE[tone]} 16%, transparent)` }}
    >
      {label}
    </span>
  );
});

/** Issue/exception type chip (DISPUTE/BANKRUPTCY/SCRA/...). Same shape as Tag
 *  but always uppercase block with a left dot, used to lead a row. */
export const TypeChip = React.memo(function TypeChip({
  label,
  tone = "neutral",
}: {
  label: string;
  tone?: keyof typeof TAG_TONE;
}) {
  return (
    <span
      className="inline-flex items-center gap-1 rounded-[5px] px-1.5 py-0.5 text-[9.5px] font-[600] uppercase tracking-[0.04em]"
      style={{ color: TAG_TONE[tone], backgroundColor: `color-mix(in srgb, ${TAG_TONE[tone]} 16%, transparent)` }}
    >
      <span aria-hidden="true" className="h-1 w-1 rounded-full" style={{ backgroundColor: TAG_TONE[tone] }} />
      {label}
    </span>
  );
});
```

- [ ] **Step 4: Render on harness**

In the harness page add:
```tsx
import { SegmentedBar, ValueBar, Sparkline, AreaLine, Tag, TypeChip } from "@/components/product/visuals/parts";
// ...
<section data-harness="parts">
  <ProductCanvas>
    <div className="flex flex-col gap-4 text-[var(--product-text)]">
      <SegmentedBar segments={[45, 35, 20]} />
      <ValueBar value={98} tone="success" />
      <Sparkline bars={[0.3, 0.5, 0.4, 0.7, 0.6, 0.8, 1]} />
      <AreaLine points={[0.2, 0.35, 0.3, 0.5, 0.65, 0.8]} />
      <div className="flex gap-2">
        <Tag label="HIGH" tone="success" />
        <TypeChip label="SCRA" tone="special" />
      </div>
    </div>
  </ProductCanvas>
</section>
```

- [ ] **Step 5: Run to verify it passes** — `... -g "chart parts" ...` → PASS.

- [ ] **Step 6: Commit**

```bash
git add src/components/product/visuals/parts.tsx src/app/dev/product-visuals/page.tsx tests/product/visuals.spec.ts
git commit -m "feat(product-visuals): shared chart parts (bars, sparkline, area line, tags)"
```

---

## Task 3: PlacementMatrix visual (accordion `placement`, doc §6)

**Files:**
- Create: `src/components/product/visuals/PlacementMatrix.tsx`
- Modify: harness page
- Test: `tests/product/visuals.spec.ts`

- [ ] **Step 1: Write the failing test**

```ts
test("PlacementMatrix shows routing rules + tiers verbatim", async ({ page }) => {
  await page.goto("/dev/product-visuals");
  const v = page.locator('[data-harness="placement"]');
  await expect(v.getByText("Routing rules")).toBeVisible();
  await expect(v.getByText("1,847 accounts ready to route")).toBeVisible();
  await expect(v.getByText("Pre-collect")).toBeVisible();
  await expect(v.getByText("12,847")).toBeVisible();
  await expect(v.getByText("27 vendors active")).toBeVisible();
});
```

- [ ] **Step 2: Run to verify it fails** — `... -g "PlacementMatrix" ...` → FAIL.

- [ ] **Step 3: Implement** (content verbatim from `docs/multimodal-image-prompts.md` §6)

```tsx
import * as React from "react";

import { EyebrowLabel } from "@/components/product/primitives/EyebrowLabel";
import { LiveStatus } from "@/components/product/primitives/LiveStatus";
import { ProductCanvas } from "@/components/product/primitives/ProductCanvas";
import { ProductCard } from "@/components/product/primitives/ProductCard";
import { StatPill } from "@/components/product/primitives/StatPill";
import { SegmentedBar } from "@/components/product/visuals/parts";

// [CLAIMS REVIEW] placeholder values — Andrew sign-off required before production.
const ROWS = [
  { tier: "Pre-collect", sub: "3 vendors · 30-day", segments: [40, 35, 25], accounts: "12,847" },
  { tier: "Primary", sub: "3 vendors · 60-day", segments: [45, 35, 20], accounts: "8,420" },
  { tier: "Secondary", sub: "2 vendors · 90-day", segments: [60, 40], accounts: "4,108" },
  { tier: "Tertiary", sub: "2 vendors · 120-day", segments: [55, 45], accounts: "2,290" },
] as const;

export const PlacementMatrix = React.memo(function PlacementMatrix() {
  return (
    <ProductCanvas className="text-[var(--product-text)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <EyebrowLabel>PLACEMENT MANAGEMENT</EyebrowLabel>
          <p className="mt-2 text-[17px] font-[500] tracking-[-0.02em]">Routing rules</p>
          <p className="text-[12px] text-[var(--product-text-3)]">
            National network · decision engine active · 14 rules live
          </p>
        </div>
        <LiveStatus label="LIVE" />
      </div>

      <ProductCard className="mt-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span aria-hidden="true" className="flex h-7 w-7 items-center justify-center rounded-[7px] bg-[var(--primary)] text-white">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M8 12V4M8 4l-3 3M8 4l3 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </span>
          <div>
            <p className="text-[13px] font-[500]">1,847 accounts ready to route</p>
            <p className="text-[11px] text-[var(--product-text-3)]">Loaded from billing · evaluated against tier rules</p>
          </div>
        </div>
        <span className="rounded-full bg-[var(--primary)] px-3 py-1.5 text-[11px] font-[500] text-white">Routing now</span>
      </ProductCard>

      <div className="mt-4 grid grid-cols-[1.1fr_2fr_0.6fr] gap-x-4 gap-y-3 @container">
        <span className="text-[10px] uppercase tracking-[0.08em] text-[var(--product-text-3)]">Treatment tier</span>
        <span className="text-[10px] uppercase tracking-[0.08em] text-[var(--product-text-3)]">Vendor allocation</span>
        <span className="text-right text-[10px] uppercase tracking-[0.08em] text-[var(--product-text-3)]">Accounts</span>
        {ROWS.map((r) => (
          <React.Fragment key={r.tier}>
            <div>
              <p className="text-[12.5px] font-[500]">{r.tier}</p>
              <p className="text-[10.5px] text-[var(--product-text-3)]">{r.sub}</p>
            </div>
            <SegmentedBar segments={[...r.segments]} className="self-center" />
            <span className="self-center text-right text-[12.5px] tabular-nums">{r.accounts}</span>
          </React.Fragment>
        ))}
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <StatPill label="Reconciliation 04:00 today" />
        <StatPill label="Recall windows configured" />
        <StatPill label="27 vendors active" tone="indigo" />
      </div>
    </ProductCanvas>
  );
});
```
- [ ] **Step 4: Render on harness** — add `<section data-harness="placement"><PlacementMatrix /></section>`.

- [ ] **Step 5: Run to verify it passes** — `... -g "PlacementMatrix" ...` → PASS.

- [ ] **Step 6: Commit**

```bash
git add src/components/product/visuals/PlacementMatrix.tsx src/app/dev/product-visuals/page.tsx tests/product/visuals.spec.ts
git commit -m "feat(product-visuals): PlacementMatrix visual (doc §6)"
```

---

## Task 4: OptimizationEngine visual (accordion `optimization`, doc §7)

**Files:** Create `src/components/product/visuals/OptimizationEngine.tsx`; modify harness; test.

- [ ] **Step 1: Write the failing test**

```ts
test("OptimizationEngine shows closed-pool results verbatim", async ({ page }) => {
  await page.goto("/dev/product-visuals");
  const v = page.locator('[data-harness="optimization"]');
  await expect(v.getByText("Closed pool · Q4 primary")).toBeVisible();
  await expect(v.getByText("EVALUATED")).toBeVisible();
  await expect(v.getByText("42% → 47%")).toBeVisible();
  await expect(v.getByText(/Bonus triggered · Recovery partner A/)).toBeVisible();
});
```

- [ ] **Step 2: Run to verify it fails** — → FAIL.

- [ ] **Step 3: Implement** (verbatim from doc §7)

```tsx
import * as React from "react";

import { EyebrowLabel } from "@/components/product/primitives/EyebrowLabel";
import { LiveStatus } from "@/components/product/primitives/LiveStatus";
import { ProductCanvas } from "@/components/product/primitives/ProductCanvas";
import { ProductCard } from "@/components/product/primitives/ProductCard";
import { StatPill } from "@/components/product/primitives/StatPill";
import { Tag } from "@/components/product/visuals/parts";

// [CLAIMS REVIEW] placeholder values — Andrew sign-off required before production.
const VENDORS = [
  { name: "Recovery partner A", sub: "4,206 accounts placed", liq: "22.8%", band: "HIGH", bandTone: "success", shift: "42% → 47%", arrow: "▲", arrowTone: "success" },
  { name: "Recovery partner B", sub: "3,521 accounts placed", liq: "18.6%", band: "MID", bandTone: "warning", shift: "35% → 35%", arrow: "─", arrowTone: "neutral" },
  { name: "Recovery partner C", sub: "5,120 accounts placed", liq: "14.2%", band: "LOW", bandTone: "breach", shift: "23% → 18%", arrow: "▼", arrowTone: "breach" },
] as const;

const ARROW_COLOR = { success: "var(--status-success)", neutral: "var(--product-text-3)", breach: "var(--status-breach)" } as const;

export const OptimizationEngine = React.memo(function OptimizationEngine() {
  return (
    <ProductCanvas className="text-[var(--product-text)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <EyebrowLabel>OPTIMIZATION ENGINE</EyebrowLabel>
          <p className="mt-2 text-[17px] font-[500] tracking-[-0.02em]">Closed pool · Q4 primary</p>
          <p className="text-[12px] text-[var(--product-text-3)]">12,847 accounts · performance bands applied · reallocation queued</p>
        </div>
        <LiveStatus label="EVALUATED" tone="success" />
      </div>

      <div className="mt-4 grid grid-cols-[2fr_1fr_1fr] gap-x-4 gap-y-3">
        <span className="text-[10px] uppercase tracking-[0.08em] text-[var(--product-text-3)]">Vendor · closed pool</span>
        <span className="text-[10px] uppercase tracking-[0.08em] text-[var(--product-text-3)]">Liquidation</span>
        <span className="text-[10px] uppercase tracking-[0.08em] text-[var(--product-text-3)]">This cycle → next</span>
        {VENDORS.map((v) => (
          <React.Fragment key={v.name}>
            <div className="flex items-center gap-2">
              <span aria-hidden="true" className="h-5 w-5 rounded-[5px] bg-gradient-to-br from-[#5266EB] to-[#3949B5]" />
              <div>
                <p className="text-[12.5px] font-[500]">{v.name}</p>
                <p className="text-[10.5px] text-[var(--product-text-3)]">{v.sub}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 self-center">
              <span className="text-[13px] tabular-nums">{v.liq}</span>
              <Tag label={v.band} tone={v.bandTone as "success" | "warning" | "breach"} />
            </div>
            <div className="flex items-center gap-1.5 self-center text-[12.5px] tabular-nums">
              <span>{v.shift}</span>
              <span aria-hidden="true" style={{ color: ARROW_COLOR[v.arrowTone as keyof typeof ARROW_COLOR] }}>{v.arrow}</span>
            </div>
          </React.Fragment>
        ))}
      </div>

      <ProductCard className="mt-4 border-[color-mix(in_srgb,var(--status-success)_30%,transparent)]" style={{ backgroundColor: "color-mix(in srgb, var(--status-success) 8%, transparent)" }}>
        <p className="flex items-center gap-2 text-[12.5px] font-[500]">
          <span aria-hidden="true" style={{ color: "var(--status-success)" }}>★</span>
          Bonus triggered · Recovery partner A cleared 22% liquidation target
        </p>
        <p className="mt-1 text-[11px] text-[var(--product-text-3)]">Monthly bonus calculated automatically · applied to next settlement</p>
      </ProductCard>

      <div className="mt-5 flex flex-wrap gap-2">
        <StatPill label="Reallocation applies next placement run" />
        <StatPill label="Caps & floors enforced" tone="indigo" />
      </div>
    </ProductCanvas>
  );
});
```

- [ ] **Step 4: Render on harness** — `<section data-harness="optimization"><OptimizationEngine /></section>`.
- [ ] **Step 5: Run to verify it passes** — → PASS.
- [ ] **Step 6: Commit** — `feat(product-visuals): OptimizationEngine visual (doc §7)`

---

## Task 5: IssuesWorklist visual (accordion `issues`, doc §3)

**Files:** Create `src/components/product/visuals/IssuesWorklist.tsx`; modify harness; test.

- [ ] **Step 1: Write the failing test**

```ts
test("IssuesWorklist shows worklist rows + SLA verbatim", async ({ page }) => {
  await page.goto("/dev/product-visuals");
  const v = page.locator('[data-harness="issues"]');
  await expect(v.getByText("Active worklist")).toBeVisible();
  await expect(v.getByText("247 open · 38 escalated")).toBeVisible();
  await expect(v.getByText("ISS-48291 · Acct ··· 8472")).toBeVisible();
  await expect(v.getByText("Breaching")).toBeVisible();
  await expect(v.getByText("97.4%")).toBeVisible();
});
```

- [ ] **Step 2: Run to verify it fails** — → FAIL.

- [ ] **Step 3: Implement** (verbatim from doc §3; `// [CLAIMS REVIEW]` + `// [COI REVIEW]` CFPB language)

```tsx
"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";

import { EyebrowLabel } from "@/components/product/primitives/EyebrowLabel";
import { MetricCell } from "@/components/product/primitives/MetricCell";
import { ProductCanvas } from "@/components/product/primitives/ProductCanvas";
import { TypeChip } from "@/components/product/visuals/parts";
import { cn } from "@/lib/utils";

// [CLAIMS REVIEW] placeholder values — Andrew sign-off required.
// [COI REVIEW] CFPB / compliance language below.
const FILTERS = ["All 247", "Disputes 94", "Bankruptcy 52", "SCRA 18", "Compliance 31", "Deceased 12"] as const;

const ISSUES = [
  { chip: "DISPUTE", chipTone: "success", id: "ISS-48291 · Acct ··· 8472", desc: "Consumer disputes balance after settlement, requests itemization", who: "Assigned to Partner A", timer: "4h 12m", status: "On time", statusTone: "success" },
  { chip: "BANKRUPTCY", chipTone: "breach", id: "ISS-48287 · Acct ··· 1294", desc: "Chapter 7 notice received from PACER feed, auto-recall pending", who: "Routing to recall", timer: "1h 38m", status: "Warning", statusTone: "warning" },
  { chip: "SCRA", chipTone: "special", id: "ISS-48284 · Acct ··· 9038", desc: "Active duty status confirmed, interest rate cap applied, agency notified", who: "Resolved by Engine", timer: "Auto", status: "Resolved", statusTone: "success" },
  { chip: "COMPLAINT", chipTone: "warning", id: "ISS-48276 · Acct ··· 5621", desc: "CFPB complaint received, response draft routed to compliance review", who: "Assigned to Compliance", timer: "14m", status: "Breaching", statusTone: "breach" },
  { chip: "DECEASED", chipTone: "success", id: "ISS-48268 · Acct ··· 2847", desc: "SSA death index match confirmed, treatment suspended, estate workflow", who: "Resolved by Engine", timer: "Auto", status: "Resolved", statusTone: "success" },
] as const;

const DOT = { success: "var(--status-success)", warning: "var(--status-warning)", breach: "var(--status-breach)" } as const;

export const IssuesWorklist = React.memo(function IssuesWorklist() {
  const reduce = useReducedMotion();
  return (
    <ProductCanvas className="text-[var(--product-text)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <EyebrowLabel>ISSUES MANAGEMENT</EyebrowLabel>
          <p className="mt-2 text-[17px] font-[500] tracking-[-0.02em]">Active worklist</p>
          <p className="text-[12px] text-[var(--product-text-3)]">Across portfolios · sorted by SLA proximity · auto-routed</p>
        </div>
        <span className="rounded-full border border-white/10 bg-white/4 px-2.5 py-1 text-[10px] tabular-nums text-[var(--product-text-2)]">247 open · 38 escalated</span>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {FILTERS.map((f, i) => (
          <span key={f} className={cn("rounded-full px-2.5 py-1 text-[10.5px]", i === 0 ? "bg-[var(--primary)]/15 text-[var(--product-text)]" : "text-[var(--product-text-3)]")}>{f}</span>
        ))}
      </div>

      <div className="mt-3 flex flex-col divide-y divide-white/6">
        {ISSUES.map((it) => {
          const breaching = it.status === "Breaching";
          return (
            <div key={it.id} className="grid grid-cols-[auto_1fr_auto] items-center gap-3 py-2.5">
              <TypeChip label={it.chip} tone={it.chipTone as "success" | "breach" | "special" | "warning"} />
              <div className="min-w-0">
                <p className="font-mono text-[10.5px] text-[var(--product-text-2)]">{it.id}</p>
                <p className="truncate text-[11.5px]">{it.desc}</p>
                <p className="text-[10px] text-[var(--product-text-3)]">{it.who}</p>
              </div>
              <div className="flex items-center gap-1.5 justify-self-end">
                <motion.span
                  aria-hidden="true"
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: DOT[it.statusTone as keyof typeof DOT], boxShadow: breaching ? `0 0 6px 1px ${DOT.breach}` : undefined }}
                  animate={breaching && !reduce ? { opacity: [0.45, 1, 0.45] } : undefined}
                  transition={breaching && !reduce ? { duration: 2.4, repeat: Infinity, ease: "easeInOut" } : undefined}
                />
                <span className="text-[11px] tabular-nums" style={{ color: DOT[it.statusTone as keyof typeof DOT] }}>{it.timer}</span>
                <span className="text-[9.5px] uppercase tracking-[0.04em] text-[var(--product-text-3)]">{it.status}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 grid grid-cols-3 gap-4">
        <MetricCell label="SLA ADHERENCE · 30D" value="97.4%" delta="▲ 1.8pt" deltaTone="success" />
        <MetricCell label="AVG RESOLUTION TIME" value="3.2h" delta="▼ 0.4h vs prior" deltaTone="success" />
        <MetricCell label="AUTO-RESOLVED · 30D" value="64%" delta="8,247 of 12,891" deltaTone="neutral" />
      </div>
    </ProductCanvas>
  );
});
```

- [ ] **Step 4: Render on harness** — `<section data-harness="issues"><IssuesWorklist /></section>`.
- [ ] **Step 5: Run to verify it passes** — → PASS.
- [ ] **Step 6: Commit** — `feat(product-visuals): IssuesWorklist visual (doc §3) [COI REVIEW][CLAIMS REVIEW]`

---

## Task 6: ReportingDashboard visual (accordion `reporting`, doc §4)

**Files:** Create `src/components/product/visuals/ReportingDashboard.tsx`; modify harness; test.

- [ ] **Step 1: Write the failing test**

```ts
test("ReportingDashboard shows 2x2 panels verbatim", async ({ page }) => {
  await page.goto("/dev/product-visuals");
  const v = page.locator('[data-harness="reporting"]');
  await expect(v.getByText("Portfolio performance")).toBeVisible();
  await expect(v.getByText("Liquidation by treatment tier")).toBeVisible();
  await expect(v.getByText("01 Recovery partner A")).toBeVisible();
  await expect(v.getByText("Target 95.0% · exceeded")).toBeVisible();
});
```

- [ ] **Step 2: Run to verify it fails** — → FAIL.

- [ ] **Step 3: Implement** (verbatim from doc §4)

```tsx
import * as React from "react";

import { EyebrowLabel } from "@/components/product/primitives/EyebrowLabel";
import { ProductCanvas } from "@/components/product/primitives/ProductCanvas";
import { ProductCard } from "@/components/product/primitives/ProductCard";
import { StatPill } from "@/components/product/primitives/StatPill";
import { AreaLine, Sparkline, Tag, ValueBar } from "@/components/product/visuals/parts";
import { cn } from "@/lib/utils";

// [CLAIMS REVIEW] placeholder values — Andrew sign-off required.
const TIERS = [
  { label: "Pre-collect", value: 28.4 },
  { label: "Primary", value: 18.4 },
  { label: "Secondary", value: 11.2 },
  { label: "Tertiary", value: 6.4 },
] as const;
const VENDORS = [
  { rank: "01", name: "Recovery partner A", sub: "Primary · 8,420 accounts", pct: "22.8%" },
  { rank: "02", name: "Recovery partner D", sub: "Pre-collect · 12,847 accounts", pct: "20.1%" },
  { rank: "03", name: "Recovery partner B", sub: "Primary · 6,290 accounts", pct: "18.6%" },
  { rank: "04", name: "Recovery partner C", sub: "Secondary · 4,108 accounts", pct: "14.2%" },
] as const;
const RANGES = ["7D", "30D", "90D", "YTD"] as const;

export const ReportingDashboard = React.memo(function ReportingDashboard() {
  return (
    <ProductCanvas bloom="dual" className="text-[var(--product-text)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <EyebrowLabel>REPORTING · EXECUTIVE VIEW</EyebrowLabel>
          <p className="mt-2 text-[17px] font-[500] tracking-[-0.02em]">Portfolio performance</p>
          <p className="text-[12px] text-[var(--product-text-3)]">All portfolios · refreshed 04:00 today · feeding Power BI</p>
        </div>
        <div className="flex gap-1">
          {RANGES.map((r) => (
            <span key={r} className={cn("rounded-md px-2 py-1 text-[10.5px] tabular-nums", r === "30D" ? "bg-[var(--primary)]/15 text-[var(--product-text)]" : "text-[var(--product-text-3)]")}>{r}</span>
          ))}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 @md:grid-cols-2">
        <ProductCard>
          <div className="flex items-center justify-between"><p className="text-[12px] font-[500]">Liquidation by treatment tier</p><Tag label="▲ 2.1pt" tone="success" /></div>
          <div className="mt-3 flex flex-col gap-2">
            {TIERS.map((t) => (
              <div key={t.label} className="grid grid-cols-[1fr_2fr_auto] items-center gap-2">
                <span className="text-[11px] text-[var(--product-text-2)]">{t.label}</span>
                <ValueBar value={t.value * 3} />
                <span className="text-[11px] tabular-nums">{t.value}%</span>
              </div>
            ))}
          </div>
        </ProductCard>

        <ProductCard>
          <div className="flex items-center justify-between"><p className="text-[12px] font-[500]">Net-back · 12 months</p><Tag label="▲ $11.40" tone="success" /></div>
          <AreaLine className="mt-3" points={[0.2, 0.3, 0.28, 0.42, 0.5, 0.62, 0.7, 0.78, 0.74, 0.85, 0.9, 0.96]} />
          <div className="mt-1 flex justify-between text-[10px] text-[var(--product-text-3)]"><span>Jun &apos;25</span><span>May &apos;26</span></div>
        </ProductCard>

        <ProductCard>
          <p className="text-[12px] font-[500]">Top vendors · liquidation</p>
          <div className="mt-3 flex flex-col gap-2">
            {VENDORS.map((v) => (
              <div key={v.rank} className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] tabular-nums text-[var(--product-text-3)]">{v.rank}</span>
                  <div><p className="text-[11.5px]">{v.name}</p><p className="text-[10px] text-[var(--product-text-3)]">{v.sub}</p></div>
                </div>
                <span className="text-[12px] tabular-nums">{v.pct}</span>
              </div>
            ))}
          </div>
        </ProductCard>

        <ProductCard>
          <div className="flex items-center justify-between"><p className="text-[12px] font-[500]">SLA adherence · 30D</p><Tag label="▲ 1.8pt" tone="success" /></div>
          <p className="mt-2 text-[28px] font-[500] tabular-nums">97.4%</p>
          <p className="text-[10.5px] text-[var(--product-text-3)]">Target 95.0% · exceeded</p>
          <Sparkline className="mt-2" bars={[0.5, 0.6, 0.55, 0.7, 0.8, 0.75, 1]} />
        </ProductCard>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <StatPill label="Next refresh 04:00 tomorrow" />
        <StatPill label="Power BI feed active" tone="success" />
        <StatPill label="Live" tone="indigo" />
      </div>
    </ProductCanvas>
  );
});
```

- [ ] **Step 4: Render on harness** — `<section data-harness="reporting"><ReportingDashboard /></section>`.
- [ ] **Step 5: Run to verify it passes** — → PASS.
- [ ] **Step 6: Commit** — `feat(product-visuals): ReportingDashboard visual (doc §4)`

---

## Task 7: ComplianceStandards visual (accordion `compliance`, doc §8)

**Files:** Create `src/components/product/visuals/ComplianceStandards.tsx`; modify harness; test.

- [ ] **Step 1: Write the failing test**

```ts
test("ComplianceStandards shows adherence + exceptions verbatim", async ({ page }) => {
  await page.goto("/dev/product-visuals");
  const v = page.locator('[data-harness="compliance"]');
  await expect(v.getByText("Vendor adherence")).toBeVisible();
  await expect(v.getByText("AUDITED")).toBeVisible();
  await expect(v.getByText("98.2%")).toBeVisible();
  await expect(v.getByText(/SSA death index match/)).toBeVisible();
  await expect(v.getByText("Every action logged")).toBeVisible();
});
```

- [ ] **Step 2: Run to verify it fails** — → FAIL.

- [ ] **Step 3: Implement** (verbatim from doc §8; `// [CLAIMS REVIEW]` + `// [COI REVIEW]`)

```tsx
"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";

import { EyebrowLabel } from "@/components/product/primitives/EyebrowLabel";
import { LiveStatus } from "@/components/product/primitives/LiveStatus";
import { ProductCanvas } from "@/components/product/primitives/ProductCanvas";
import { StatPill } from "@/components/product/primitives/StatPill";
import { Tag, TypeChip, ValueBar } from "@/components/product/visuals/parts";

// [CLAIMS REVIEW] placeholder values — Andrew sign-off required.
// [COI REVIEW] compliance / regulated-status language below.
const VENDORS = [
  { name: "Recovery partner A", value: 98.2, tone: "success", status: "Compliant", statusTone: "success" },
  { name: "Recovery partner B", value: 96.8, tone: "success", status: "Compliant", statusTone: "success" },
  { name: "Recovery partner C", value: 91.4, tone: "warning", status: "Review", statusTone: "warning" },
] as const;
const EXCEPTIONS = [
  { chip: "DECEASED", chipTone: "success", desc: "SSA death index match · acct ··· 2847", action: "Treatment suspended" },
  { chip: "BANKRUPTCY", chipTone: "breach", desc: "PACER chapter 7 filing · acct ··· 1294", action: "Auto-recalled" },
  { chip: "SCRA", chipTone: "special", desc: "Active duty confirmed · acct ··· 9038", action: "Rate cap applied" },
] as const;

export const ComplianceStandards = React.memo(function ComplianceStandards() {
  const reduce = useReducedMotion();
  return (
    <ProductCanvas className="text-[var(--product-text)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <EyebrowLabel>COMPLIANCE &amp; WORK STANDARDS</EyebrowLabel>
          <p className="mt-2 text-[17px] font-[500] tracking-[-0.02em]">Vendor adherence</p>
          <p className="text-[12px] text-[var(--product-text-3)]">Measured against your work standards · audited continuously</p>
        </div>
        <LiveStatus label="AUDITED" tone="success" />
      </div>

      <p className="mt-4 text-[10px] uppercase tracking-[0.08em] text-[var(--product-text-3)]">Work standard adherence · 30 days</p>
      <div className="mt-2 flex flex-col gap-2.5">
        {VENDORS.map((v) => (
          <div key={v.name} className="grid grid-cols-[1.4fr_2fr_auto_auto] items-center gap-3">
            <div className="flex items-center gap-2">
              <span aria-hidden="true" className="h-5 w-5 rounded-[5px] bg-gradient-to-br from-[#5266EB] to-[#3949B5]" />
              <span className="text-[12px]">{v.name}</span>
            </div>
            <ValueBar value={v.value} tone={v.tone as "success" | "warning"} />
            <span className="text-[12px] tabular-nums">{v.value}%</span>
            <Tag label={v.status} tone={v.statusTone as "success" | "warning"} />
          </div>
        ))}
      </div>

      <div className="mt-5 flex items-center justify-between">
        <p className="flex items-center gap-2 text-[11px] uppercase tracking-[0.08em] text-[var(--product-text-3)]">
          <motion.span
            aria-hidden="true"
            className="h-1.5 w-1.5 rounded-full bg-[var(--primary)]"
            style={{ boxShadow: "0 0 6px 1px var(--primary)" }}
            animate={reduce ? undefined : { opacity: [0.45, 1, 0.45] }}
            transition={reduce ? undefined : { duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          />
          Auto-surfaced exceptions · live
        </p>
        <span className="text-[11px] tabular-nums text-[var(--product-text-3)]">1,284 today</span>
      </div>
      <div className="mt-2 flex flex-col divide-y divide-white/6">
        {EXCEPTIONS.map((e) => (
          <div key={e.desc} className="flex items-center justify-between gap-3 py-2">
            <div className="flex items-center gap-2">
              <TypeChip label={e.chip} tone={e.chipTone as "success" | "breach" | "special"} />
              <span className="text-[11.5px]">{e.desc}</span>
            </div>
            <span className="text-[11px]" style={{ color: "var(--status-success)" }}>{e.action}</span>
          </div>
        ))}
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <StatPill label="Audit trail complete" tone="success" />
        <StatPill label="Exportable for review" />
        <StatPill label="Every action logged" tone="indigo" />
      </div>
    </ProductCanvas>
  );
});
```

- [ ] **Step 4: Render on harness** — `<section data-harness="compliance"><ComplianceStandards /></section>`.
- [ ] **Step 5: Run to verify it passes** — → PASS.
- [ ] **Step 6: Commit** — `feat(product-visuals): ComplianceStandards visual (doc §8) [COI REVIEW][CLAIMS REVIEW]`

---

## Task 8: AccordionVisual switch + dynamic imports

**Files:**
- Create: `src/components/product/visuals/index.tsx`
- Test: `tests/product/visuals.spec.ts`

- [ ] **Step 1: Write the failing test**

```ts
test("AccordionVisual maps each id to the right visual on the harness", async ({ page }) => {
  await page.goto("/dev/product-visuals");
  const sw = page.locator('[data-harness="switch"]');
  await expect(sw.getByText("Routing rules")).toBeVisible();          // placement
  await expect(sw.getByText("Closed pool · Q4 primary")).toBeVisible(); // optimization
});
```

- [ ] **Step 2: Run to verify it fails** — → FAIL.

- [ ] **Step 3: Implement the dynamic switch**

```tsx
"use client";

import * as React from "react";
import dynamic from "next/dynamic";

export type AccordionVisualId =
  | "placement"
  | "optimization"
  | "issues"
  | "reporting"
  | "compliance";

const Fallback = () => (
  <div className="h-full min-h-[20rem] w-full rounded-[16px] bg-[var(--product-canvas)]" aria-hidden="true" />
);
const opts = { ssr: false, loading: Fallback } as const;

const VISUALS: Record<AccordionVisualId, React.ComponentType> = {
  placement: dynamic(() => import("./PlacementMatrix").then((m) => m.PlacementMatrix), opts),
  optimization: dynamic(() => import("./OptimizationEngine").then((m) => m.OptimizationEngine), opts),
  issues: dynamic(() => import("./IssuesWorklist").then((m) => m.IssuesWorklist), opts),
  reporting: dynamic(() => import("./ReportingDashboard").then((m) => m.ReportingDashboard), opts),
  compliance: dynamic(() => import("./ComplianceStandards").then((m) => m.ComplianceStandards), opts),
};

export function AccordionVisual({ id }: { id: AccordionVisualId }) {
  const Cmp = VISUALS[id];
  return <Cmp />;
}
```

- [ ] **Step 4: Render all five on harness under one switch section**

```tsx
import { AccordionVisual, type AccordionVisualId } from "@/components/product/visuals";
const IDS: AccordionVisualId[] = ["placement", "optimization", "issues", "reporting", "compliance"];
// ...
<section data-harness="switch" className="flex flex-col gap-8">
  {IDS.map((id) => (<AccordionVisual key={id} id={id} />))}
</section>
```

- [ ] **Step 5: Run to verify it passes** — → PASS.

- [ ] **Step 6: Commit** — `feat(product-visuals): AccordionVisual dynamic switch`

---

## Task 9: Wire visuals into FeatureAccordion

**Files:**
- Modify: `src/components/sections/FeatureAccordion.tsx` (replace placeholder block, lines ~131-153)
- Test: `tests/product/visuals.spec.ts`

- [ ] **Step 1: Write the failing test** (against the real homepage)

```ts
test("homepage accordion renders the real placement visual by default", async ({ page }) => {
  await page.goto("/");
  await page.locator("#how-it-works").scrollIntoViewIfNeeded();
  await expect(page.locator("#how-it-works").getByText("Routing rules")).toBeVisible();
  // switching to Compliance shows that visual
  await page.getByRole("button", { name: "Compliance and Audit" }).click();
  await expect(page.locator("#how-it-works").getByText("Vendor adherence")).toBeVisible();
});
```

- [ ] **Step 2: Run to verify it fails** — → FAIL (placeholder still shows "Visual /").

- [ ] **Step 3: Replace the placeholder block**

In `FeatureAccordion.tsx`, replace the inner placeholder `<div>` (the block rendering `Visual` + `{item.visualLabel}`, currently lines ~141-150) with the real visual wrapped in `<Activity>`. Add imports at top:
```tsx
import { Activity } from "react";
import { AccordionVisual, type AccordionVisualId } from "@/components/product/visuals";
```
Replace the mapped cross-fade children so each item renders:
```tsx
{items.map((item) => (
  <div
    key={item.id}
    aria-hidden={activeId !== item.id}
    className={cn(
      "absolute inset-0 transition-opacity duration-[var(--duration-fast)] ease-[var(--ease-in-out)]",
      activeId === item.id ? "opacity-100" : "opacity-0",
    )}
  >
    <Activity mode={activeId === item.id ? "visible" : "hidden"}>
      <AccordionVisual id={item.id as AccordionVisualId} />
    </Activity>
  </div>
))}
```
Notes:
- The visual fills the slot (no inner `p-8`); the slot keeps its `bg-[var(--card)] ring-1 ring-[var(--border)] rounded-[var(--radius-sm)] overflow-hidden` frame.
- If `Activity` is not exported by the installed React build, import as `import { unstable_Activity as Activity } from "react"`. If neither exists, fall back to rendering `{activeId === item.id ? <AccordionVisual id={...} /> : null}` (render-active-only) and note it in the commit body.
- Keep `FeatureAccordionItem.visualLabel` in the type/content (used as the harness/alt label and for any future fallback). Do not edit `content/`.

- [ ] **Step 4: Run to verify it passes** — → PASS.

- [ ] **Step 5: Mobile check**

The accordion stacks on mobile and the visual slot is `min-h-[14rem]`. Bump the mobile min-height so the dense visuals fit: change the slot's mobile `min-h-[14rem]` to `min-h-[22rem]` (keep `@lg/section:min-h-[28rem]`). Verify at 375px the active visual is not clipped (`overflow-hidden` is fine; content should fit). Re-run the homepage test at 375px.

- [ ] **Step 6: Commit** — `feat(product-visuals): wire visuals into FeatureAccordion via Activity`

---

## Task 10: Full suite green + final review

**Files:** `tests/product/visuals.spec.ts`

- [ ] **Step 1: Add axe + responsive coverage for the homepage accordion**

```ts
import AxeBuilder from "@axe-core/playwright";

for (const width of [375, 768, 1024, 1440]) {
  test(`homepage how-it-works: no critical axe + no overflow @ ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto("/");
    await page.locator("#how-it-works").scrollIntoViewIfNeeded();
    const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag22aa"]).analyze();
    const critical = results.violations.filter((v) => v.impact === "critical" || v.impact === "serious");
    expect(critical, JSON.stringify(critical.map((v) => v.id))).toEqual([]);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(0);
  });
}
```

- [ ] **Step 2: Fix any axe/overflow failures inline**, then re-run to green.

- [ ] **Step 3: Full gate**

```bash
npm run typecheck
npm run lint
npx playwright test --project=chromium
```
Expected: typecheck clean, lint clean, all specs (existing 170 + product specs) pass.

- [ ] **Step 4: Reduced-motion gate**

Confirm `tests/responsive/reduced-motion.spec.ts` still passes and add (if not covered) a check that the issues breaching-dot + compliance feed-dot are stilled under `reducedMotion: "reduce"`.

- [ ] **Step 5: Commit + final review**

```bash
git add tests/product/visuals.spec.ts
git commit -m "test(product-visuals): homepage accordion axe + responsive coverage"
```
Then dispatch a final code-reviewer over the whole `product-visuals` branch (base = the commit before Plan A) and address findings.

---

## Self-Review (completed by plan author)

- **Spec coverage:** Spec §3 content table → Tasks 3–7 (each visual, verbatim, ids match `placement/optimization/issues/reporting/compliance`). Spec §4 file layout → parts + 5 visuals + index + FeatureAccordion. Spec §7 compositions → Tasks 3–7. Spec §8 integration (Activity + dynamic + edge-to-edge + visualLabel kept) → Tasks 8–9. Spec §9 responsive/mobile-min-height → Task 9 Step 5 + Task 10. Spec §11 docs landing → Task 1. Spec §3 claims/COI flags → in every data const + commit messages.
- **Placeholder scan:** One intentional inline-SVG note (PlacementMatrix queue icon, Task 3 Step 3) — flagged for the implementer, not a silent gap. No TBD/TODO. Every numeric/string is the verbatim doc value.
- **Type consistency:** `AccordionVisualId` union matches the 5 accordion item ids and the `VISUALS` record keys and the FeatureAccordion cast. Primitive prop names (`label/value/unit/delta/deltaTone`, `tone`, `bloom`) match Plan A exactly. `Tag`/`TypeChip` tone unions (`success/warning/breach/special/neutral`) are consistent across visuals.
- **Notes for executor:** (1) Verify the `Activity` export name in the installed React 19.2.4 build; fall back as documented. (2) `color-mix` is supported in all current evergreen browsers; if the project's browserslist excludes it, swap to pre-mixed rgba.
