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

/** Bar series: a labeled value with a ValueBar fill, each value count-up. */
function BarSeries({ series }: { series: Extract<Chart, { kind: "bars" }>["series"] }) {
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
          <ValueBar value={item.value} tone={barTone(item.tone)} />
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
          <AreaLine points={chart.points} />
        ) : chart.kind === "spark" ? (
          <Sparkline bars={chart.bars} />
        ) : chart.kind === "bars" ? (
          <BarSeries series={chart.series} />
        ) : (
          <Cards cards={chart.cards} />
        )}
      </ChartFrame>
    </ProductCanvas>
  );
}
