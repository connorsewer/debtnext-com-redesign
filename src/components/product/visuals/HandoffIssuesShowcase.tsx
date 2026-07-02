"use client";

// Handoff issues showcase (homepage THE PLATFORM band, 2026-07-02 density rework).
// Replaces the flat <Console bare> render for the "issues" tab with a worklist
// slice of the approved SLA / Exception Queue.
//
// Composition: reuses the repo's atoms only (EyebrowLabel, MetricCell, StatPill,
// Tag/TypeChip, PulseDot, RevealStagger/RevealItem). Rows are SLA-proximity
// ordered (overdue first). The auto-handled row keeps its HONEST treatment: it is
// closed with no live SLA window ("Closed"), so its age bar reads success, not a
// breach. Every status is TEXT (Escalated / Investigating / Auto-handled) beside
// its color (Pitfall 8). Vendor names are the FIXED anonymized labels.
//
// A11y: bare role="img" root with aria-label={data.ariaSummary}; no focusable
// children. Fail-open entrance via RevealStagger.

import * as React from "react";

import { PulseDot, RevealItem, RevealStagger } from "@/components/motion";
import { EyebrowLabel, MetricCell, StatPill } from "@/components/product/primitives";
import { Tag, TypeChip } from "@/components/product/visuals/parts";
import type { ToneKey } from "@/components/product/visuals/parts";
import { handoffIssuesConsole } from "@/content/visuals";

const data = handoffIssuesConsole;

const AGE_TONE = {
  breach: "var(--status-breach)",
  warning: "var(--status-warning)",
  success: "var(--status-success)",
} as const;

export function HandoffIssuesShowcase() {
  const { header, showcase, pills } = data;
  const kpi = header.kpi!;
  return (
    <div
      role="img"
      aria-label={data.ariaSummary}
      className="flex flex-col gap-4 text-[var(--product-text)]"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <EyebrowLabel>Issues queue</EyebrowLabel>
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
        <span className="inline-flex items-center gap-1.5 rounded-full border border-[rgba(255,255,255,0.10)] bg-[rgba(255,255,255,0.04)] px-2.5 py-1 text-[10px] font-[500] uppercase tracking-[0.08em] text-[var(--product-text-2)]">
          <PulseDot tone="breach" size={6} />
          3 overdue
        </span>
      </div>

      <RevealStagger className="flex flex-col gap-2">
        {showcase.items.map((item) => (
          <RevealItem
            key={item.account}
            className="flex flex-col gap-2 rounded-[10px] border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)] px-3.5 py-3"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <TypeChip label={item.type} tone={item.typeTone as ToneKey} />
                <p className="mt-1.5 truncate text-[10.5px] text-[var(--product-text-3)]">
                  Account {item.account} · {item.vendor}
                </p>
              </div>
              {/* Status chip: TEXT carries the meaning, color reinforces */}
              <Tag
                label={item.status}
                tone={item.statusTone as ToneKey}
                className="shrink-0"
              />
            </div>

            {/* SLA age bar (label-paired with the SLA window text) */}
            <div className="flex items-center gap-3">
              <span
                className="h-1.5 flex-1 rounded-full bg-white/10"
                role="img"
                aria-label={`${item.type}: ${item.sla}`}
              >
                <span
                  className="block h-full rounded-full"
                  style={{
                    width: `${item.age}%`,
                    backgroundColor: AGE_TONE[item.ageTone],
                  }}
                />
              </span>
              <span
                className="w-[68px] shrink-0 text-right text-[10.5px] font-[500] tabular-nums"
                style={{ color: AGE_TONE[item.ageTone] }}
              >
                {item.sla}
              </span>
            </div>
          </RevealItem>
        ))}
      </RevealStagger>

      <div className="flex flex-wrap gap-2">
        {pills?.map((pill) => <StatPill key={pill.label} label={pill.label} />)}
        <StatPill label="Aging issues escalate on the rules you configure" tone="indigo" />
      </div>
    </div>
  );
}
