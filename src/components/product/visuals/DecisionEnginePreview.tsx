"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";

import { EyebrowLabel } from "@/components/product/primitives/EyebrowLabel";
import { EventBadge } from "@/components/product/primitives/EventBadge";
import { LiveStatus } from "@/components/product/primitives/LiveStatus";
import { ProductCanvas } from "@/components/product/primitives/ProductCanvas";
import { ProductCard } from "@/components/product/primitives/ProductCard";
import { StatPill } from "@/components/product/primitives/StatPill";
import { Sparkline } from "@/components/product/visuals/parts";
import { AnimatedNumber, EASE_STATE } from "@/components/product/motion";
import { cn } from "@/lib/utils";

// [CLAIMS REVIEW] placeholder values — Andrew sign-off required before production.
const VENDORS = [
  { name: "Recovery partner A", from: 45, to: 47, delta: "+2", deltaTone: "success" },
  { name: "Recovery partner B", from: 35, to: 35, delta: "+0", deltaTone: "neutral" },
  { name: "Recovery partner C", from: 20, to: 18, delta: "-2", deltaTone: "breach" },
] as const;

const TABS = ["Placement rules", "Optimization", "Audit log"] as const;

// Sparkline expects 0–1 fractions; last bar renders solid indigo.
const SPARK = [0.38, 0.52, 0.46, 0.6, 0.55, 0.68, 0.64, 0.74];

const DELTA_COLOR: Record<string, string> = {
  success: "var(--status-success)",
  neutral: "var(--product-text-3)",
  breach: "var(--status-breach)",
};

/** Flagship product visual: the placement decision engine. Vendor allocations
 *  cycle to demonstrate a reallocation after a pool closes. Reduced-motion
 *  users see a static, settled (pre-reallocation) state. */
export const DecisionEnginePreview = React.memo(function DecisionEnginePreview() {
  const reduce = useReducedMotion();
  const [reallocated, setReallocated] = React.useState(false);

  React.useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setReallocated((r) => !r), 4000);
    return () => clearInterval(id);
  }, [reduce]);

  return (
    <ProductCanvas className="text-[var(--product-text)]" bloom="dual">
      <div className="flex items-start justify-between gap-4">
        <EyebrowLabel>DECISION ENGINE</EyebrowLabel>
        <LiveStatus label="LIVE" />
      </div>

      <div className="mt-3 flex items-center gap-5 border-b border-[rgba(255,255,255,0.08)]">
        {TABS.map((t, i) => (
          <span
            key={t}
            className={cn(
              "relative pb-2 text-[12px]",
              i === 0
                ? "font-[500] text-[var(--product-text)]"
                : "text-[var(--product-text-3)]",
            )}
          >
            {t}
            {i === 0 && (
              <span
                aria-hidden="true"
                className="absolute inset-x-0 -bottom-px h-[2px] rounded-full bg-[var(--primary)]"
              />
            )}
          </span>
        ))}
      </div>

      <div className="mt-4 flex items-start justify-between gap-4">
        <div>
          <p className="text-[15px] font-[500] tracking-[-0.02em]">
            Treatment tier · Primary
          </p>
          <p className="text-[12px] text-[var(--product-text-3)]">
            Vendor pool: National network · 1,847 active
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-3">
        {VENDORS.map((v) => {
          const pct = reduce ? v.from : reallocated ? v.to : v.from;
          return (
            <div key={v.name} className="flex items-center gap-3">
              <span
                aria-hidden="true"
                className="h-5 w-5 shrink-0 rounded-[5px] bg-gradient-to-br from-[#5266EB] to-[#3949B5]"
              />
              <span className="w-[124px] shrink-0 text-[12.5px] font-[500]">
                {v.name}
              </span>
              <div
                className="relative h-1.5 flex-1 rounded-full bg-white/10"
                role="img"
                aria-label={`${v.name}: ${pct}%`}
              >
                <motion.div
                  className="absolute inset-y-0 left-0 rounded-full bg-[var(--primary)]"
                  initial={false}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.8, ease: EASE_STATE }}
                >
                  <span
                    aria-hidden="true"
                    className="absolute right-0 top-1/2 h-2 w-2 -translate-y-1/2 translate-x-1/2 rounded-full bg-[var(--primary)] shadow-[0_0_6px_2px_rgba(82,102,235,0.7)]"
                  />
                </motion.div>
              </div>
              <span className="w-9 shrink-0 text-right text-[12.5px] tabular-nums">
                {pct}%
              </span>
              <span
                className="w-6 shrink-0 text-right text-[11px] font-[500] tabular-nums"
                style={{ color: DELTA_COLOR[v.deltaTone] }}
              >
                {v.delta}
              </span>
            </div>
          );
        })}
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <ProductCard className="p-[14px]">
          <p className="text-[10.5px] font-[500] uppercase tracking-[0.08em] text-[var(--product-text-3)]">
            Closed pool liquidation
          </p>
          <p className="mt-1 text-[18px] font-[500] leading-none tracking-[-0.022em] tabular-nums">
            <AnimatedNumber value={17.4} decimals={1} suffix="%" />
          </p>
          <Sparkline bars={SPARK} className="mt-2" />
        </ProductCard>
        <ProductCard className="p-[14px]">
          <p className="text-[10.5px] font-[500] uppercase tracking-[0.08em] text-[var(--product-text-3)]">
            Net-back per account
          </p>
          <p className="mt-1 text-[18px] font-[500] leading-none tracking-[-0.022em] tabular-nums">
            <AnimatedNumber value={148.62} decimals={2} prefix="$" />
          </p>
          <p
            className="mt-2 text-[11px] tabular-nums"
            style={{ color: "var(--status-success)" }}
          >
            ▲ $4.18 vs prior pool
          </p>
        </ProductCard>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <StatPill label="Last reconciliation 04:00 today" />
        <StatPill label="All vendors current" tone="success" />
        <StatPill label="Engine v4.2" tone="indigo" />
      </div>

      <EventBadge label="Pool closed · Reallocating" />
    </ProductCanvas>
  );
});
