"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";

import { EyebrowLabel } from "@/components/product/primitives/EyebrowLabel";
import { LiveStatus } from "@/components/product/primitives/LiveStatus";
import { ProductCanvas } from "@/components/product/primitives/ProductCanvas";
import { ProductCard } from "@/components/product/primitives/ProductCard";
import { StatPill } from "@/components/product/primitives/StatPill";
import {
  fadeUpItem,
  popItem,
  staggerContainer,
  useInViewProps,
} from "@/components/product/motion";
import { cn } from "@/lib/utils";

// Lifecycle spine — mirrors platformProcess (content/pages/platform.md).
const SPINE = ["Load", "Place", "Track", "Manage", "Report"] as const;

// 3x3 module grid — mirrors platformCapabilities (the nine modules).
// [CLAIMS REVIEW] placeholder metrics — Andrew sign-off required before production.
const MODULES = [
  { name: "Placement", metric: "1,847", unit: "routing now" },
  { name: "Optimization", metric: "3", unit: "pools evaluated" },
  { name: "Issues", metric: "247", unit: "open · 38 escalated" },
  { name: "Media", metric: "12,891", unit: "docs synced" },
  { name: "Reporting", metric: "04:00", unit: "Power BI feed" },
  { name: "Dashboards", metric: "14", unit: "portfolios live" },
  { name: "Compliance", metric: "97.4%", unit: "adherence · 30D" },
  { name: "Integrations", metric: "63", unit: "connections active" },
  { name: "Debt sales", metric: "Open", unit: "buyer portal" },
] as const;

export const PlatformSystemMap = React.memo(function PlatformSystemMap() {
  const reduce = useReducedMotion();
  const reveal = useInViewProps();
  const [active, setActive] = React.useState(0);

  React.useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setActive((a) => (a + 1) % SPINE.length), 1400);
    return () => clearInterval(id);
  }, [reduce]);

  return (
    <ProductCanvas className="text-[var(--product-text)]" bloom="dual">
      <div className="flex items-start justify-between gap-4">
        <div>
          <EyebrowLabel>THE PLATFORM</EyebrowLabel>
          <p className="mt-2 text-[17px] font-[500] tracking-[-0.02em]">
            One system, end to end
          </p>
          <p className="text-[12px] text-[var(--product-text-3)]">
            The recovery lifecycle on dPlat · nine modules, one platform
          </p>
        </div>
        <LiveStatus label="LIVE" />
      </div>

      {/* Lifecycle spine */}
      <div className="relative mt-5">
        <div
          aria-hidden="true"
          className="absolute left-0 right-0 top-[11px] h-px bg-[rgba(255,255,255,0.12)]"
        />
        <ol className="relative grid grid-cols-5">
          {SPINE.map((stage, i) => {
            const on = reduce || i <= active;
            return (
              <li key={stage} className="flex flex-col items-center gap-1.5">
                <span
                  aria-hidden="true"
                  className={cn(
                    "flex h-[22px] w-[22px] items-center justify-center rounded-full border text-[10px] font-[500] tabular-nums transition-colors duration-500",
                    on
                      ? "border-transparent bg-[var(--primary)] text-white shadow-[0_0_10px_2px_rgba(82,102,235,0.45)]"
                      : "border-[rgba(255,255,255,0.16)] bg-[var(--product-canvas)] text-[var(--product-text-3)]",
                  )}
                >
                  {i + 1}
                </span>
                <span
                  className={cn(
                    "text-[11px] font-[500] transition-colors duration-500",
                    on ? "text-[var(--product-text)]" : "text-[var(--product-text-3)]",
                  )}
                >
                  {stage}
                </span>
              </li>
            );
          })}
        </ol>
      </div>

      {/* 3x3 module grid */}
      <motion.div
        className="mt-5 grid grid-cols-3 gap-2.5"
        variants={staggerContainer}
        {...reveal}
      >
        {MODULES.map((m) => (
          <motion.div key={m.name} variants={fadeUpItem}>
            <ProductCard className="flex h-full flex-col gap-1.5 p-[13px]">
              <div className="flex items-center gap-2">
                <motion.span
                  variants={popItem}
                  aria-hidden="true"
                  className="h-[18px] w-[18px] shrink-0 rounded-[5px] bg-gradient-to-br from-[#5266EB] to-[#3949B5]"
                />
                <span className="text-[12px] font-[500] tracking-[-0.01em]">
                  {m.name}
                </span>
              </div>
              <p className="text-[15px] font-[500] leading-none tracking-[-0.022em] tabular-nums">
                {m.metric}
              </p>
              <p className="text-[10px] text-[var(--product-text-3)]">{m.unit}</p>
            </ProductCard>
          </motion.div>
        ))}
      </motion.div>

      <div className="mt-5 flex flex-wrap gap-2">
        <StatPill label="Daily reconciliation 04:00" />
        <StatPill label="Configurable to your portfolio" />
        <StatPill label="Built for credit originators" tone="indigo" />
      </div>
    </ProductCanvas>
  );
});
