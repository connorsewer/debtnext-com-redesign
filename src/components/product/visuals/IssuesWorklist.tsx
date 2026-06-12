"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";

import { EyebrowLabel } from "@/components/product/primitives/EyebrowLabel";
import { MetricCell } from "@/components/product/primitives/MetricCell";
import { ProductCanvas } from "@/components/product/primitives/ProductCanvas";
import { TypeChip, type ToneKey } from "@/components/product/visuals/parts";
import {
  fadeUpItem,
  inViewProps,
  staggerContainer,
} from "@/components/product/motion";
import { cn } from "@/lib/utils";

// [CLAIMS REVIEW] placeholder values — Andrew sign-off required.
// [COI REVIEW] CFPB / compliance language below.
const FILTERS = ["All 247", "Disputes 94", "Bankruptcy 52", "SCRA 18", "Compliance 31", "Deceased 12"];

const ISSUES = [
  { chip: "DISPUTE", chipTone: "success", id: "ISS-48291 · Acct ··· 8472", desc: "Consumer disputes balance after settlement, requests itemization", who: "Assigned to Partner A", timer: "4h 12m", status: "On time", statusTone: "success" },
  { chip: "BANKRUPTCY", chipTone: "breach", id: "ISS-48287 · Acct ··· 1294", desc: "Chapter 7 notice received from PACER feed, auto-recall pending", who: "Routing to recall", timer: "1h 38m", status: "Warning", statusTone: "warning" },
  { chip: "SCRA", chipTone: "special", id: "ISS-48284 · Acct ··· 9038", desc: "Active duty status confirmed, interest rate cap applied, agency notified", who: "Resolved by Engine", timer: "Auto", status: "Resolved", statusTone: "success" },
  { chip: "COMPLAINT", chipTone: "warning", id: "ISS-48276 · Acct ··· 5621", desc: "CFPB complaint received, response draft routed to compliance review", who: "Assigned to Compliance", timer: "14m", status: "Breaching", statusTone: "breach" },
  { chip: "DECEASED", chipTone: "success", id: "ISS-48268 · Acct ··· 2847", desc: "SSA death index match confirmed, treatment suspended, estate workflow", who: "Resolved by Engine", timer: "Auto", status: "Resolved", statusTone: "success" },
] as const;

const DOT: Record<string, string> = {
  success: "var(--status-success)",
  warning: "var(--status-warning)",
  breach: "var(--status-breach)",
};

export const IssuesWorklist = React.memo(function IssuesWorklist() {
  const reduce = useReducedMotion();
  return (
    <ProductCanvas className="text-[var(--product-text)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <EyebrowLabel>ISSUES MANAGEMENT</EyebrowLabel>
          <p className="mt-2 text-[17px] font-[500] tracking-[-0.02em]">Active worklist</p>
          <p className="text-[12px] text-[var(--product-text-3)]">
            Across portfolios · sorted by SLA proximity · auto-routed
          </p>
        </div>
        <span className="shrink-0 rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[10px] tabular-nums text-[var(--product-text-2)]">
          247 open · 38 escalated
        </span>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {FILTERS.map((f, i) => (
          <span
            key={f}
            className={cn(
              "rounded-full px-2.5 py-1 text-[10.5px]",
              i === 0
                ? "bg-[var(--primary)]/15 text-[var(--product-text)]"
                : "text-[var(--product-text-3)]",
            )}
          >
            {f}
          </span>
        ))}
      </div>

      <motion.div
        className="mt-3 flex flex-col divide-y divide-white/[0.06]"
        variants={staggerContainer}
        {...inViewProps}
      >
        {ISSUES.map((it) => {
          const breaching = it.status === "Breaching";
          const dotColor = DOT[it.statusTone];
          return (
            <motion.div key={it.id} variants={fadeUpItem} className="grid grid-cols-[auto_1fr_auto] items-center gap-3 py-2.5">
              <TypeChip label={it.chip} tone={it.chipTone as ToneKey} />
              <div className="min-w-0">
                <p className="font-mono text-[10.5px] text-[var(--product-text-2)]">{it.id}</p>
                <p className="truncate text-[11.5px]">{it.desc}</p>
                <p className="text-[10px] text-[var(--product-text-3)]">{it.who}</p>
              </div>
              <div className="flex items-center gap-1.5 justify-self-end">
                <motion.span
                  aria-hidden="true"
                  className="h-1.5 w-1.5 rounded-full"
                  style={{
                    backgroundColor: dotColor,
                    boxShadow: breaching ? `0 0 6px 1px ${dotColor}` : undefined,
                  }}
                  animate={breaching && !reduce ? { opacity: [0.45, 1, 0.45] } : undefined}
                  transition={
                    breaching && !reduce
                      ? { duration: 2.4, repeat: Infinity, ease: "easeInOut" }
                      : undefined
                  }
                />
                <span className="text-[11px] tabular-nums" style={{ color: dotColor }}>{it.timer}</span>
                <span className="text-[9.5px] uppercase tracking-[0.04em] text-[var(--product-text-3)]">
                  {it.status}
                </span>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      <div className="mt-4 grid grid-cols-3 gap-4">
        <MetricCell label="SLA ADHERENCE · 30D" value="97.4%" numericValue={97.4} numericDecimals={1} numericSuffix="%" delta="▲ 1.8pt" deltaTone="success" />
        <MetricCell label="AVG RESOLUTION" value="3.2h" delta="▼ 0.4h" deltaTone="success" />
        <MetricCell label="AUTO-RESOLVED" value="64%" numericValue={64} numericSuffix="%" delta="8,247 / 12,891" deltaTone="neutral" />
      </div>
    </ProductCanvas>
  );
});
