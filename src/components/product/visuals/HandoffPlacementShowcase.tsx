"use client";

// Handoff placement showcase (homepage THE PLATFORM band, 2026-07-02 density
// rework). Replaces the flat <Console bare> render for the "placement" tab with a
// denser routing-decision slice of the approved Executive Portfolio Overview.
//
// Composition: reuses the repo's atom/primitive vocabulary only (EyebrowLabel,
// MetricCell, LiveStatus, ValueBar, StatPill, RevealStagger/RevealItem,
// AnimatedNumber, PulseDot). No new chart/row system.
//
// A11y: the root is a bare role="img" with aria-label={data.ariaSummary}; it holds
// NO focusable/interactive children. Every color cue is paired with text (the pool
// share % renders as digits beside each bar; the held pool is labeled "Held /
// manual review"). Entrance is the fail-open RevealStagger (visible pre-hydration
// and under reduced motion); bars are the fail-open ValueBar atom.

import * as React from "react";

import { PulseDot, RevealItem, RevealStagger } from "@/components/motion";
import { AnimatedNumber } from "@/components/product/motion";
import {
  EyebrowLabel,
  LiveStatus,
  MetricCell,
  StatPill,
} from "@/components/product/primitives";
import { ValueBar } from "@/components/product/visuals/parts";
import { handoffPlacementConsole } from "@/content/visuals";

const data = handoffPlacementConsole;

export function HandoffPlacementShowcase() {
  const { header, showcase } = data;
  const kpi = header.kpi!;
  return (
    <div
      role="img"
      aria-label={data.ariaSummary}
      className="flex flex-col gap-4 text-[var(--product-text)]"
    >
      {/* Header: batch KPI + engine-running live pulse */}
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <EyebrowLabel>Placement</EyebrowLabel>
          <p className="mt-2 text-[17px] font-[500] tracking-[-0.02em]">
            {header.title}
          </p>
          <MetricCell
            className="mt-3"
            label={kpi.caption}
            value=""
            numericValue={kpi.value}
            delta={kpi.sub}
          />
        </div>
        <LiveStatus label={header.status!.label} tone="live" />
      </div>

      {/* Routing pools: honestly-proportional bars (35/28/18/12 + held 7 = 100) */}
      <RevealStagger className="flex flex-col gap-2.5">
        <div className="grid grid-cols-[1.4fr_1.5fr_auto] items-center gap-x-4 text-[10px] uppercase tracking-[0.08em] text-[var(--product-text-3)]">
          <span>Routing pool</span>
          <span>Share of batch</span>
          <span className="text-right">%</span>
        </div>
        {showcase.pools.map((pool) => (
          <RevealItem
            key={pool.name}
            className="grid grid-cols-[1.4fr_1.5fr_auto] items-center gap-x-4"
          >
            <div className="min-w-0">
              <p className="truncate text-[12.5px] font-[500]">{pool.name}</p>
              <p className="truncate text-[10.5px] text-[var(--product-text-3)]">
                {pool.vendors}
              </p>
            </div>
            <ValueBar
              value={pool.share}
              tone={pool.tone === "neutral" ? undefined : "indigo"}
              ariaValueLabel={`${pool.name}: ${pool.share}% of batch`}
              className={pool.tone === "neutral" ? "opacity-60" : undefined}
            />
            <span className="w-9 text-right text-[12.5px] font-[500] tabular-nums">
              <AnimatedNumber value={pool.share} suffix="%" />
            </span>
          </RevealItem>
        ))}
      </RevealStagger>

      {/* Live routing ticks: batch-progress hints under the pools */}
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 rounded-[12px] border border-[rgba(255,255,255,0.07)] bg-[rgba(255,255,255,0.02)] px-4 py-3">
        <span className="inline-flex items-center gap-2 text-[10.5px] font-[500] uppercase tracking-[0.08em] text-[var(--status-focus)]">
          <PulseDot tone="indigo" size={6} />
          Routing now
        </span>
        {showcase.ticks.map((tick) => (
          <span key={tick.label} className="flex items-baseline gap-1.5 text-[11px]">
            <span className="text-[var(--product-text-3)]">{tick.label}</span>
            <span className="font-[500] tabular-nums text-[var(--product-text)]">
              {tick.value}
            </span>
          </span>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        <StatPill label="Engine routes across your existing vendor network" tone="indigo" />
      </div>
    </div>
  );
}
