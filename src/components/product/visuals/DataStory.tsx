"use client";

// Data-story archetype (FND-02). Renders a DataStoryData payload (10-04) by
// switching on chart.kind and composing the chart atoms from parts.tsx inside a
// ChartFrame (which carries the required text alternative). Zero baked product
// numbers: every value comes from `data`, the single [CLAIMS REVIEW]-auditable
// surface.
//
// The "cards" branch subsumes SolutionsIndustryCards: the per-industry widget
// that was duplicated across 7 solution pages is now one payload-fed branch, so
// the no-prop copy is impossible to construct.
//
// A11y: ChartFrame wraps the decorative SVG atoms in role="img" + aria-label fed
// by data.ariaSummary (Pitfall 8 / T-10-14). Reduced-motion fail-open is
// inherited from the chart atoms and the reveal barrel.

import * as React from "react";

import { LiveValue, RevealItem, RevealStagger } from "@/components/motion";
import { ChartFrame, ProductCanvas, ProductCard } from "@/components/product/primitives";
import { AreaLine, Sparkline, ValueBar } from "@/components/product/visuals/parts";
import type { DataStoryData } from "@/content/visuals";

type Chart = DataStoryData["chart"];

// ---------------------------------------------------------------------------
// Unit normalization (SOL-1..5). Payloads carry real, raw data in the units the
// caption states (account counts, exception volumes, match-rate percentages).
// The chart atoms keep their explicit, documented contracts: ValueBar wants a
// 0..100 CSS-percent fill, Sparkline/AreaLine want 0..1 points. DataStory is the
// single boundary that maps raw payload values onto those contracts, so the
// atoms stay honest and a future payload edit (e.g. swapping percentages for
// counts) cannot silently break the render.
//
// Bars scale to the SERIES MAX so a 98,240 vs 14,900 pair reads proportional and
// the largest value fills the track. Spark/area normalize to 0..1 against the
// series max, with a small non-zero floor so a legitimately flat-high series
// (insurance 96..99, utilities 96..99) still paints inside its track instead of
// collapsing to the baseline.
// ---------------------------------------------------------------------------

/** Scale bar values to the series max so the tallest fills its 0..100 track and
 *  the rest read proportional. Returns 0 for a degenerate all-zero series. */
function scaleBarsToMax(values: number[]): number[] {
  const max = Math.max(0, ...values);
  if (max <= 0) return values.map(() => 0);
  return values.map((v) => (Math.max(0, v) / max) * 100);
}

/** Normalize spark/area points to 0..1 against the series max, holding a small
 *  floor so a flat-high series stays visible above the baseline. */
function normalizePoints(points: number[]): number[] {
  const max = Math.max(0, ...points);
  if (max <= 0) return points.map(() => 0);
  const FLOOR = 0.12;
  return points.map((p) => FLOOR + (Math.max(0, p) / max) * (1 - FLOOR));
}

/** Bar series: a labeled value with a ValueBar fill, each value count-up. The
 *  visible number is the raw payload value; the bar fill is scaled to the series
 *  max so lengths read proportional. */
function BarSeries({ series }: { series: Extract<Chart, { kind: "bars" }>["series"] }) {
  const fills = scaleBarsToMax(series.map((item) => item.value));
  return (
    <RevealStagger className="flex flex-col gap-3">
      {series.map((item, i) => (
        <RevealItem key={`${item.label}-${i}`} className="flex flex-col gap-1.5">
          <div className="flex items-baseline justify-between gap-3">
            <span className="text-[12px] text-[var(--product-text-2)]">{item.label}</span>
            <span className="text-[13px] font-[500] tabular-nums text-[var(--product-text)]">
              <LiveValue value={item.value} />
            </span>
          </div>
          <ValueBar value={fills[i]} ariaValueLabel={item.label} tone={barTone(item.tone)} />
        </RevealItem>
      ))}
    </RevealStagger>
  );
}

function barTone(tone?: string): "indigo" | "success" | "warning" | undefined {
  // "neutral"/undefined fall back to ValueBar's default indigo tone.
  return tone === "success" || tone === "warning" || tone === "indigo" ? tone : undefined;
}

/** Cards grid: the SolutionsIndustryCards layout, now fed entirely by payload. */
function Cards({ cards }: { cards: Extract<Chart, { kind: "cards" }>["cards"] }) {
  return (
    <RevealStagger className="grid grid-cols-2 gap-3">
      {cards.map((card, i) => (
        <RevealItem key={`${card.name}-${i}`}>
          <ProductCard className="flex h-full flex-col gap-3 p-[15px]">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span
                  aria-hidden="true"
                  className="h-[18px] w-[18px] shrink-0 rounded-[5px]"
                  style={{
                    background: `linear-gradient(135deg, ${card.accent}, color-mix(in srgb, ${card.accent} 55%, var(--product-canvas)))`,
                    boxShadow: `0 0 10px 1px color-mix(in srgb, ${card.accent} 45%, transparent)`,
                  }}
                />
                <span className="text-[13px] font-[500] tracking-[-0.01em] text-[var(--product-text)]">
                  {card.name}
                </span>
              </div>
              <span
                className="rounded-[5px] px-1.5 py-0.5 text-[9.5px] font-[600] uppercase tracking-[0.04em]"
                style={{
                  color: card.accent,
                  backgroundColor: `color-mix(in srgb, ${card.accent} 16%, transparent)`,
                }}
              >
                {card.tag}
              </span>
            </div>

            <div className="flex items-end justify-between gap-2">
              <span className="text-[10.5px] font-[500] uppercase tracking-[0.08em] text-[var(--product-text-3)]">
                {card.sub}
              </span>
              <span className="text-[20px] font-[500] leading-none tracking-[-0.022em] tabular-nums text-[var(--product-text)]">
                <LiveValue value={card.value} decimals={card.decimals ?? 0} suffix={card.suffix ?? ""} />
              </span>
            </div>

            <CardBar value={card.bar} accent={card.accent} />
          </ProductCard>
        </RevealItem>
      ))}
    </RevealStagger>
  );
}

/** Accent-tinted fill bar for a card. The ValueBar tone palette is token-fixed,
 *  so the per-card accent (an arbitrary brand color) is applied inline here. */
function CardBar({ value, accent }: { value: number; accent: string }) {
  return (
    <div
      className="h-1.5 w-full rounded-full bg-white/10"
      role="img"
      aria-label={`${value}%`}
    >
      <div
        className="h-full origin-left rounded-full"
        style={{ width: `${value}%`, backgroundColor: accent }}
      />
    </div>
  );
}

export interface DataStoryProps {
  data: DataStoryData;
  className?: string;
}

/**
 * Data-story archetype. `<DataStory data={...} />` renders the chart variant the
 * payload selects, wrapped in a ChartFrame whose caption is the headline, whose
 * optional annotation teaches the takeaway, and whose ariaSummary is the text
 * alternative for the decorative chart SVG.
 */
export function DataStory({ data, className }: DataStoryProps) {
  const { chart } = data;
  return (
    <ProductCanvas className={`text-[var(--product-text)] ${className ?? ""}`} bloom="dual">
      {data.eyebrow ? (
        <p className="mb-3 text-[10.5px] font-[500] uppercase tracking-[0.12em] text-[var(--status-focus)]">
          {data.eyebrow}
        </p>
      ) : null}
      <ChartFrame
        ariaSummary={data.ariaSummary}
        caption={data.headline}
        annotation={data.annotation}
      >
        {chart.kind === "area" ? (
          // PLT-7: single-chart cards sat in a tall accordion panel with the
          // chart pinned to a short default height, leaving most of the card
          // empty. Give the sole chart more vertical room so it reads as a
          // full data story, not a stat strip. No new data invented.
          <AreaLine points={normalizePoints(chart.points)} className="h-28" />
        ) : chart.kind === "spark" ? (
          <Sparkline bars={normalizePoints(chart.bars)} className="h-24" />
        ) : chart.kind === "bars" ? (
          <BarSeries series={chart.series} />
        ) : (
          <Cards cards={chart.cards} />
        )}
      </ChartFrame>
    </ProductCanvas>
  );
}
