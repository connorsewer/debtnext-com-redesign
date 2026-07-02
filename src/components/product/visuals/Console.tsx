"use client";

// Console archetype (FND-02). A compound component that renders a ConsoleData
// payload (10-04) by composing the motion barrel (10-02) and the primitives
// (10-03). Zero baked product numbers: every value comes from `data`, the single
// [CLAIMS REVIEW]-auditable surface. This is the keystone that makes the
// SolutionsIndustryCards no-prop duplicate impossible to construct (there is no
// component to copy, only a payload to author).
//
// React 19: context is consumed with `use()`, so no ref-forwarding wrapper is
// needed. The root provides the payload; the slots read it. A default flat render
// means `<Console data />` works without manual slotting, and the slots are
// exposed for explorable composition (skill A.2).
//
// A11y: the whole console is a meaningful image, so role="img" + aria-label fed by
// data.ariaSummary (Pitfall 8 / T-10-14). The live pulse is rendered via PulseDot
// from the barrel (A1), which collapses to a static dot under reduced motion.
// Reduced-motion fail-open is inherited from the barrel/primitives.

import * as React from "react";

import { PulseDot, RevealItem, RevealStagger } from "@/components/motion";
import {
  EyebrowLabel,
  LiveStatus,
  MetricCell,
  ProductCanvas,
  ProductCard,
  StatPill,
  WorklistRow,
} from "@/components/product/primitives";
import type { ConsoleData } from "@/content/visuals";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Context (React 19 use())
// ---------------------------------------------------------------------------

const ConsoleContext = React.createContext<ConsoleData | null>(null);

function useConsole(): ConsoleData {
  const data = React.use(ConsoleContext);
  if (!data) {
    throw new Error("Console slots must be rendered inside <Console data={...}>.");
  }
  return data;
}

// ---------------------------------------------------------------------------
// Slots
// ---------------------------------------------------------------------------

/** Header: eyebrow / title / subtitle, optional live status + pulse, optional KPI. */
function Header({ className }: { className?: string }) {
  const { header } = useConsole();
  const live = header.status?.live ?? false;
  return (
    <div className={cn("flex items-start justify-between gap-4", className)}>
      <div className="min-w-0">
        {header.eyebrow ? <EyebrowLabel>{header.eyebrow}</EyebrowLabel> : null}
        <p className="mt-2 text-[17px] font-[500] tracking-[-0.02em] text-[var(--product-text)]">
          {header.title}
        </p>
        {header.subtitle ? (
          <p className="text-[12px] text-[var(--product-text-3)]">{header.subtitle}</p>
        ) : null}
        {header.kpi ? (
          <MetricCell
            className="mt-3"
            label={header.kpi.caption}
            value=""
            numericValue={header.kpi.value}
            numericDecimals={header.kpi.decimals}
            numericSuffix={header.kpi.valueSuffix}
            delta={header.kpi.sub}
          />
        ) : null}
      </div>
      {header.status ? (
        // LiveStatus renders its own pulsing dot inside the pill when live, so a
        // standalone PulseDot beside it (SOL-9) read as a stray dot floating left
        // of the pill. The pill's internal dot is the single live indicator.
        <span className="flex shrink-0 items-center gap-2">
          <LiveStatus label={header.status.label} tone={live ? "live" : "success"} />
        </span>
      ) : null}
    </div>
  );
}

const CALLOUT_ICON: Record<NonNullable<ConsoleData["callout"]>["icon"] & string, React.ReactNode> = {
  route: (
    <path
      d="M8 12V4M8 4l-3 3M8 4l3 3"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  alert: (
    <path
      d="M8 5v4M8 11h.01"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  check: (
    <path
      d="M4 8.5l2.5 2.5L12 5.5"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
};

/** Callout: highlighted action card with icon, title/sub, and an action pill. */
function Callout({ className }: { className?: string }) {
  const { callout } = useConsole();
  if (!callout) return null;
  const icon = callout.icon ? CALLOUT_ICON[callout.icon] : CALLOUT_ICON.route;
  return (
    <ProductCard className={cn("flex items-center justify-between gap-4", className)}>
      <div className="flex items-center gap-3">
        <span
          aria-hidden="true"
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[7px] bg-[var(--primary)] text-white"
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            {icon}
          </svg>
        </span>
        <div className="min-w-0">
          <p className="text-[13px] font-[500] text-[var(--product-text)]">{callout.title}</p>
          {callout.sub ? (
            <p className="text-[11px] text-[var(--product-text-3)]">{callout.sub}</p>
          ) : null}
        </div>
      </div>
      {callout.action ? (
        // SOL-10: a filled-indigo pill here echoed the primary "Request a demo"
        // CTA in the same band. Downgraded to a tonal treatment (indigo text on a
        // tinted indigo fill, with a live pulse) so nothing inside the product
        // mock out-shouts the one filled CTA per band.
        <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-[color-mix(in_srgb,var(--primary)_35%,transparent)] bg-[color-mix(in_srgb,var(--primary)_16%,transparent)] px-3 py-1.5 text-[11px] font-[500] text-[var(--primary)]">
          <PulseDot tone="indigo" size={6} />
          {callout.action}
        </span>
      ) : null}
    </ProductCard>
  );
}

/** Rows: optional column header labels + the WorklistRow list, staggered in. */
function Rows({ className }: { className?: string }) {
  const { columns, rows } = useConsole();
  return (
    <RevealStagger className={cn("flex flex-col gap-3", className)}>
      {columns ? (
        <div className="grid grid-cols-[1.5fr_1.6fr_0.7fr] gap-x-4 text-[10px] uppercase tracking-[0.08em] text-[var(--product-text-3)]">
          <span>{columns.primary}</span>
          <span>{columns.bar}</span>
          <span className="text-right">{columns.trailing}</span>
        </div>
      ) : null}
      {rows.map((row, i) => (
        <RevealItem key={`${row.primary}-${i}`}>
          <WorklistRow
            primary={row.primary}
            secondary={row.secondary}
            bar={row.bar ? { segments: row.bar.segments, tone: barTone(row.bar.tone) } : undefined}
            trailing={
              row.trailing
                ? {
                    value: row.trailing.value,
                    prefix: row.trailing.prefix,
                    suffix: row.trailing.suffix,
                    decimals: row.trailing.decimals,
                    animate: row.trailing.animate === "count" ? "count" : "none",
                  }
                : undefined
            }
          />
        </RevealItem>
      ))}
    </RevealStagger>
  );
}

/** WorklistRow's ValueBar tone only covers indigo/success/warning. */
function barTone(
  tone: NonNullable<ConsoleData["rows"][number]["bar"]>["tone"],
): "indigo" | "success" | "warning" | undefined {
  // "neutral"/undefined fall back to ValueBar's default indigo tone.
  return tone === "success" || tone === "warning" || tone === "indigo" ? tone : undefined;
}

/** Pills: the StatPill footer row. */
function Pills({ className }: { className?: string }) {
  const { pills } = useConsole();
  if (!pills?.length) return null;
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {pills.map((pill, i) => (
        <StatPill key={`${pill.label}-${i}`} label={pill.label} tone={pill.tone} />
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Root (compound component)
// ---------------------------------------------------------------------------

export interface ConsoleProps {
  data: ConsoleData;
  /** Custom slot composition. When omitted, a default flat render is used. */
  children?: React.ReactNode;
  className?: string;
  /**
   * When true, render the slots in a plain div instead of a ProductCanvas card
   * (parent supplies the frame, e.g. FramedDashboard). Default false keeps every
   * existing call site byte-identical.
   */
  bare?: boolean;
}

/**
 * Console compound archetype. `<Console data={...} />` renders the default flat
 * layout (Header → Callout → Rows → Pills). Pass children to compose the slots
 * yourself for explorable layouts (skill A.2):
 *
 *   <Console data={payload}>
 *     <Console.Header />
 *     <Console.Rows />
 *   </Console>
 */
function ConsoleRoot({ data, children, className, bare = false }: ConsoleProps) {
  const body = children ?? (
    <>
      <Header />
      <Callout />
      <Rows />
      <Pills />
    </>
  );

  // bare: the parent supplies the single frame (e.g. FramedDashboard), so the
  // slots render in a plain div with no ProductCanvas card, padding box, rounded
  // corners, or radial bloom — avoiding the double-frame inside FramedDashboard.
  // The aria-label (data.ariaSummary) moves onto this bare root so the role="img"
  // text-alternative contract (Pitfall 8) holds in both modes.
  if (bare) {
    return (
      <ConsoleContext value={data}>
        <div
          role="img"
          aria-label={data.ariaSummary}
          className={cn("flex flex-col gap-4 text-[var(--product-text)]", className)}
        >
          {body}
        </div>
      </ConsoleContext>
    );
  }

  return (
    <ConsoleContext value={data}>
      <ProductCanvas
        role="img"
        aria-label={data.ariaSummary}
        className={cn("flex flex-col gap-4 text-[var(--product-text)]", className)}
      >
        {body}
      </ProductCanvas>
    </ConsoleContext>
  );
}

export const Console = Object.assign(ConsoleRoot, {
  Header,
  Callout,
  Rows,
  Pills,
});
