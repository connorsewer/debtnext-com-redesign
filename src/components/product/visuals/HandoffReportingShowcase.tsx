"use client";

// Handoff reporting showcase (homepage THE PLATFORM band, 2026-07-02 density
// rework). Replaces the flat <Console bare> render for the "reporting" tab with an
// executive slice of the approved Portfolio Overview: a KPI tile row, a dual
// 8-week trend, and SLA-adherence bars with a label-paired REVIEW outlier.
//
// Composition: reuses the repo's atoms only (EyebrowLabel, MetricCell, StatPill,
// AreaLine, ValueBar, ChartFrame, RevealStagger/RevealItem, AnimatedNumber). The
// dual trend layers two AreaLine atoms (inventory + liquidation) inside one
// ChartFrame; a text legend pairs each series with its name (color never alone).
// The adherence outlier is labeled "Review" as text.
//
// A11y: bare role="img" root with aria-label={data.ariaSummary}; no focusable
// children. The stacked chart region carries its own aria via ChartFrame; the
// AreaLine SVGs are aria-hidden decoration. Fail-open entrance via RevealStagger.

import * as React from "react";

import { RevealItem, RevealStagger } from "@/components/motion";
import { AnimatedNumber } from "@/components/product/motion";
import { ChartFrame, EyebrowLabel, StatPill } from "@/components/product/primitives";
import { AreaLine, ValueBar } from "@/components/product/visuals/parts";
import { handoffReportingConsole } from "@/content/visuals";

const data = handoffReportingConsole;

const DELTA_TONE = {
  success: "var(--status-success)",
  breach: "var(--status-breach)",
} as const;

export function HandoffReportingShowcase() {
  const { header, showcase } = data;
  return (
    <div
      role="img"
      aria-label={data.ariaSummary}
      className="flex flex-col gap-4 text-[var(--product-text)]"
    >
      <div className="min-w-0">
        <EyebrowLabel>Reporting</EyebrowLabel>
        <p className="mt-2 text-[17px] font-[500] tracking-[-0.02em]">
          {header.title}
        </p>
      </div>

      {/* Executive KPI row */}
      <RevealStagger className="grid grid-cols-3 gap-3">
        {showcase.kpis.map((kpi) => (
          <RevealItem
            key={kpi.caption}
            className="flex flex-col gap-1 rounded-[12px] border border-[rgba(255,255,255,0.07)] bg-[rgba(255,255,255,0.02)] px-3.5 py-3"
          >
            <span className="text-[10.5px] font-[500] uppercase tracking-[0.08em] text-[var(--product-text-3)]">
              {kpi.caption}
            </span>
            <span className="text-[18px] font-[500] leading-none tracking-[-0.022em] tabular-nums text-[var(--product-text)]">
              <AnimatedNumber
                value={kpi.value}
                prefix={kpi.prefix ?? ""}
                suffix={kpi.suffix ?? ""}
                decimals={kpi.decimals ?? 0}
              />
            </span>
            <span
              className="text-[11px] tabular-nums"
              style={{ color: DELTA_TONE[kpi.deltaTone] }}
            >
              {kpi.delta}
            </span>
          </RevealItem>
        ))}
      </RevealStagger>

      {/* Dual 8-week trend: two layered AreaLines + a text legend */}
      <ChartFrame
        ariaSummary="Inventory and liquidation both rise across 8 weeks. Inventory climbs from the low 70s to the series peak; liquidation climbs from the low 40s to the mid 80s."
        caption="Inventory and liquidation · 8 weeks"
      >
        <div className="relative h-28">
          <AreaLine points={[...showcase.trend.inventory]} className="absolute inset-0 h-full" />
          <AreaLine
            points={[...showcase.trend.liquidation]}
            className="absolute inset-0 h-full opacity-70 mix-blend-screen"
          />
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[10.5px]">
          <span className="flex items-center gap-1.5 text-[var(--product-text-2)]">
            <span aria-hidden="true" className="h-2 w-2 rounded-full bg-[var(--primary)]" />
            Inventory
          </span>
          <span className="flex items-center gap-1.5 text-[var(--product-text-2)]">
            <span
              aria-hidden="true"
              className="h-2 w-2 rounded-full border border-[var(--primary)] bg-[color-mix(in_srgb,var(--primary)_40%,transparent)]"
            />
            Liquidation
          </span>
          <span className="text-[var(--product-text-3)]">
            {showcase.trend.weeks[0]} to {showcase.trend.weeks[showcase.trend.weeks.length - 1]}
          </span>
        </div>
      </ChartFrame>

      {/* SLA adherence bars with a label-paired REVIEW outlier */}
      <RevealStagger className="flex flex-col gap-2">
        <div className="text-[10px] uppercase tracking-[0.08em] text-[var(--product-text-3)]">
          SLA adherence by pool
        </div>
        {showcase.adherence.map((pool) => (
          <RevealItem
            key={pool.label}
            className="grid grid-cols-[1fr_1.4fr_auto] items-center gap-x-4"
          >
            <span className="truncate text-[12px] text-[var(--product-text-2)]">
              {pool.label}
            </span>
            <ValueBar
              value={pool.value}
              tone={pool.tone}
              ariaValueLabel={`${pool.label}: ${pool.value}% SLA adherence`}
            />
            <span className="flex items-center gap-2 justify-self-end">
              {pool.note ? (
                <span
                  className="rounded-[5px] px-1.5 py-0.5 text-[9.5px] font-[600] uppercase tracking-[0.04em]"
                  style={{
                    color: "var(--status-warning)",
                    backgroundColor: "color-mix(in srgb, var(--status-warning) 16%, transparent)",
                  }}
                >
                  {pool.note}
                </span>
              ) : null}
              <span className="w-12 text-right text-[12px] font-[500] tabular-nums">
                <AnimatedNumber value={pool.value} decimals={1} suffix="%" />
              </span>
            </span>
          </RevealItem>
        ))}
      </RevealStagger>

      <div className="flex flex-wrap gap-2">
        <StatPill label="Scheduled · weekly" />
        <StatPill label="Power BI · Snowflake" />
        <StatPill label="Same data feeds your BI environment" tone="indigo" />
      </div>
    </div>
  );
}
