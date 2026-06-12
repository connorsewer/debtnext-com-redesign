"use client";

// Reporting explorable flagship (PLATVIS-02 + PLATVIS-03, D-06/D-07).
//
// Refactors ReportingDashboard into an Explorable-composed Console-archetype
// instance fed the typed `reportingFlagshipConsole` payload. The console renders
// the liquidation-by-tier rows by default via Console.Header / Console.Rows /
// Console.Pills slots (no boolean props); the pills carry the net-back and SLA
// headline metrics so they are present on load. The four ReportingDashboard cards
// are preserved as Explorable toggles: liquidation by tier, net-back · 12 months,
// top vendors · liquidation, and SLA adherence · 30D. Each toggle reveals that
// metric's headline figure, delta, and a sparkline trend in an Explorable.Panel.
//
// D-05 parity contract (Phase 10 locked, mirrored from IssuesFlagship):
//   - Every headline value (liquidation-by-tier rates, net-back, SLA adherence)
//     is in the DOM by default via the Console slots, never hover-gated.
//   - Each metric's headline figure renders as TEXT inside its panel (Pitfall 8),
//     not chart-only, so the value survives reduced motion and is never read from
//     a decorative sparkline alone.
//   - Toggles are the real <button>s from Explorable.Toggle (keyboard Enter/Space
//     + focus-visible ring inherited from the shell); pointer and keyboard users
//     reach the same panels.
//   - Panel content (each metric's detail) is rendered immediately for every
//     metric, not conditionally mounted. The active toggle only highlights one
//     panel via data-active; the values are present under reduced motion because
//     nothing is hidden behind motion (no opacity:0 / display:none on the values).

import * as React from "react";

import { Explorable } from "@/components/motion/Explorable";
import { StatPill } from "@/components/product/primitives";
import { Console } from "@/components/product/visuals/Console";
import { Sparkline } from "@/components/product/visuals/parts";
import { reportingFlagshipConsole, reportingFlagshipMetrics } from "@/content/visuals";
import type { ReportingFlagshipMetric } from "@/content/visuals";
import { cn } from "@/lib/utils";

/** Delta-tone token map (DESIGN.md status palette). The text label carries the
 *  delta meaning; color is a reinforcement only (Pitfall 8). */
const DELTA_TONE: Record<ReportingFlagshipMetric["deltaTone"], string> = {
  success: "var(--status-success)",
  indigo: "var(--status-focus)",
};

/** One dashboard metric's detail: headline figure (text), delta label, a
 *  sparkline trend, and a one-line explanation. Values render in the DOM
 *  unconditionally (D-05); data-active (driven by Explorable) only adds a
 *  highlight ring, and the sparkline is decorative (aria-hidden in parts.tsx). */
function MetricDetail({ metric }: { metric: ReportingFlagshipMetric }) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-[11px] uppercase tracking-[0.08em] text-[var(--product-text-3)]">
        {metric.label}
      </p>
      <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1.5">
        <span className="text-[18px] font-[500] tabular-nums tracking-[-0.02em] text-[var(--product-text)]">
          {metric.headline}
        </span>
        <span
          className="text-[12px] font-[500]"
          style={{ color: DELTA_TONE[metric.deltaTone] }}
        >
          {metric.delta}
        </span>
      </div>
      <Sparkline className="mt-1" bars={[...metric.trend]} />
      <p className="text-[11px] text-[var(--product-text-3)]">{metric.detail}</p>
    </div>
  );
}

/**
 * Reporting executive flagship. The Console renders the liquidation-by-tier rows
 * and the net-back / SLA headline metrics by default; the Explorable toggles let a
 * user inspect each of the four dashboard metrics in detail. Composes Console +
 * Explorable slots, never boolean props.
 */
export function ReportingFlagship() {
  return (
    <Explorable
      label="Reporting executive view, inspect a portfolio metric's detail and trend"
      defaultActive={reportingFlagshipMetrics[0]?.id ?? null}
      className="flex flex-col gap-4"
    >
      <Console data={reportingFlagshipConsole}>
        <Console.Header />
        <Console.Rows />
        <Console.Pills />
      </Console>

      <div className="flex flex-col gap-3 rounded-[14px] bg-[var(--product-canvas)] p-4 ring-1 ring-[var(--border)]">
        <p className="text-[10.5px] font-[500] uppercase tracking-[0.1em] text-[var(--status-focus)]">
          Inspect a metric
        </p>
        <div className="flex flex-wrap gap-2">
          {reportingFlagshipMetrics.map((metric) => (
            <Explorable.Toggle
              key={metric.id}
              id={metric.id}
              className="group flex min-h-touch items-center"
            >
              <span
                className={cn(
                  "rounded-full px-3 py-1.5 text-[11px] font-[500] ring-1 transition-colors",
                  "text-[var(--product-text-2)] ring-[var(--border)] group-hover:text-[var(--product-text)]",
                  "group-aria-expanded:bg-[var(--primary)] group-aria-expanded:text-white group-aria-expanded:ring-[var(--primary)]",
                )}
              >
                {metric.label}
              </span>
            </Explorable.Toggle>
          ))}
        </div>
        {reportingFlagshipMetrics.map((metric) => (
          <Explorable.Panel
            key={metric.id}
            id={metric.id}
            className={cn(
              "rounded-[10px] p-3 transition-shadow",
              "data-[active]:ring-1 data-[active]:ring-[var(--primary)]",
            )}
          >
            <MetricDetail metric={metric} />
          </Explorable.Panel>
        ))}
        <StatPill label="Drill into any metric, then feed the same data to your BI environment" tone="indigo" />
      </div>
    </Explorable>
  );
}
