"use client";

// Handoff performance showcase (homepage THE PLATFORM band, 2026-07-02 density
// rework). Replaces the flat <Console bare> render for the "performance" tab with
// a scorecard slice of the approved Vendor Performance Scorecard.
//
// Composition: reuses the repo's atoms only (EyebrowLabel, MetricCell, StatPill,
// Sparkline, ValueBar, RevealStagger/RevealItem, AnimatedNumber). Letter grades
// render as a chip whose TEXT carries the grade (A / A- / B / C); the tone color
// only reinforces it (Pitfall 8, color never alone). Vendor names are the FIXED
// anonymized labels (never renamed). Liquidation bars scale to the series max so
// lengths read proportional and honest.
//
// A11y: bare role="img" root with aria-label={data.ariaSummary}; no focusable
// children. Fail-open entrance via RevealStagger; sparklines are decorative
// (aria-hidden in parts.tsx) and the numbers carry the meaning as text.

import * as React from "react";

import { RevealItem, RevealStagger } from "@/components/motion";
import { AnimatedNumber } from "@/components/product/motion";
import { EyebrowLabel, MetricCell, StatPill } from "@/components/product/primitives";
import { Sparkline, ValueBar } from "@/components/product/visuals/parts";
import { handoffPerformanceConsole } from "@/content/visuals";

const data = handoffPerformanceConsole;

const GRADE_TONE = {
  success: "var(--status-success)",
  warning: "var(--status-warning)",
  breach: "var(--status-breach)",
} as const;

const DELTA_TONE = {
  success: "var(--status-success)",
  breach: "var(--status-breach)",
} as const;

/** Scale liquidation percentages to the series max so bar lengths read
 *  proportional (the strongest vendor fills its track). */
function scaleToMax(values: number[]): number[] {
  const max = Math.max(0, ...values);
  if (max <= 0) return values.map(() => 0);
  return values.map((v) => (Math.max(0, v) / max) * 100);
}

export function HandoffPerformanceShowcase() {
  const { header, showcase } = data;
  const kpi = header.kpi!;
  const fills = scaleToMax(showcase.vendors.map((v) => v.liquidation));
  return (
    <div
      role="img"
      aria-label={data.ariaSummary}
      className="flex flex-col gap-4 text-[var(--product-text)]"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <EyebrowLabel>Vendor scorecard</EyebrowLabel>
          <p className="mt-2 text-[17px] font-[500] tracking-[-0.02em]">
            {header.title}
          </p>
          <MetricCell
            className="mt-3"
            label={kpi.caption}
            value=""
            numericValue={kpi.value}
            numericDecimals={kpi.decimals}
            numericSuffix={kpi.valueSuffix}
            delta={kpi.sub}
            deltaTone="success"
          />
        </div>
      </div>

      <RevealStagger className="flex flex-col gap-2">
        <div className="grid grid-cols-[1.4fr_1.3fr_auto] items-center gap-x-4 text-[10px] uppercase tracking-[0.08em] text-[var(--product-text-3)]">
          <span>Vendor</span>
          <span>Liquidation · trend</span>
          <span className="text-right">ROI · grade</span>
        </div>
        {showcase.vendors.map((vendor, i) => (
          <RevealItem
            key={vendor.name}
            className="grid grid-cols-[1.4fr_1.3fr_auto] items-center gap-x-4 gap-y-1 border-t border-[rgba(255,255,255,0.05)] pt-2"
          >
            {/* Vendor name + delta (text-led) */}
            <div className="min-w-0">
              <p className="truncate text-[12.5px] font-[500]">{vendor.name}</p>
              <p
                className="truncate text-[10.5px] tabular-nums"
                style={{ color: DELTA_TONE[vendor.deltaTone] }}
              >
                {vendor.liquidationDelta}
              </p>
            </div>

            {/* Liquidation bar (proportional) + per-row sparkline + collections */}
            <div className="flex min-w-0 flex-col gap-1.5">
              <div className="flex items-center gap-2">
                <ValueBar
                  value={fills[i]}
                  tone={vendor.gradeTone === "breach" ? "warning" : vendor.gradeTone}
                  ariaValueLabel={`${vendor.name}: ${vendor.liquidation}% liquidation`}
                  className="flex-1"
                />
                <span className="w-10 shrink-0 text-right text-[11.5px] font-[500] tabular-nums">
                  <AnimatedNumber value={vendor.liquidation} decimals={1} suffix="%" />
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkline bars={[...vendor.trend]} className="h-4" />
                <span className="text-[10px] text-[var(--product-text-3)]">
                  {vendor.collections} collected
                </span>
              </div>
            </div>

            {/* ROI + letter-grade chip (text carries the grade) */}
            <div className="flex flex-col items-end gap-1">
              <span className="text-[11.5px] tabular-nums text-[var(--product-text-2)]">
                <AnimatedNumber value={vendor.roi} decimals={1} suffix="% ROI" />
              </span>
              <span
                className="inline-flex min-w-[26px] items-center justify-center rounded-[5px] px-1.5 py-0.5 text-[10px] font-[600] uppercase tracking-[0.04em]"
                style={{
                  color: GRADE_TONE[vendor.gradeTone],
                  backgroundColor: `color-mix(in srgb, ${GRADE_TONE[vendor.gradeTone]} 16%, transparent)`,
                }}
              >
                {vendor.grade}
              </span>
            </div>
          </RevealItem>
        ))}
      </RevealStagger>

      <div className="flex flex-wrap gap-2">
        <StatPill label={`${data.showcase.vendors.length} vendors scored`} />
        <StatPill label="Liquidation · trailing 30d" />
        <StatPill label="Grades update as pool performance shifts" tone="indigo" />
      </div>
    </div>
  );
}
