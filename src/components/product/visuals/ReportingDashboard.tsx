"use client";

import * as React from "react";
import { motion } from "framer-motion";

import { EyebrowLabel } from "@/components/product/primitives/EyebrowLabel";
import { ProductCanvas } from "@/components/product/primitives/ProductCanvas";
import { ProductCard } from "@/components/product/primitives/ProductCard";
import { StatPill } from "@/components/product/primitives/StatPill";
import { AreaLine, Sparkline, Tag, ValueBar } from "@/components/product/visuals/parts";
import {
  AnimatedNumber,
  fadeUpItem,
  inViewProps,
  staggerContainer,
} from "@/components/product/motion";
import { cn } from "@/lib/utils";

// [CLAIMS REVIEW] placeholder values — Andrew sign-off required.
const TIERS = [
  { label: "Pre-collect", value: 28.4 },
  { label: "Primary", value: 18.4 },
  { label: "Secondary", value: 11.2 },
  { label: "Tertiary", value: 6.4 },
];
const VENDORS = [
  { rank: "01", name: "Recovery partner A", sub: "Primary · 8,420 accounts", pct: "22.8%" },
  { rank: "02", name: "Recovery partner D", sub: "Pre-collect · 12,847 accounts", pct: "20.1%" },
  { rank: "03", name: "Recovery partner B", sub: "Primary · 6,290 accounts", pct: "18.6%" },
  { rank: "04", name: "Recovery partner C", sub: "Secondary · 4,108 accounts", pct: "14.2%" },
];
const RANGES = ["7D", "30D", "90D", "YTD"];

export const ReportingDashboard = React.memo(function ReportingDashboard() {
  return (
    <ProductCanvas bloom="dual" className="text-[var(--product-text)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <EyebrowLabel>REPORTING · EXECUTIVE VIEW</EyebrowLabel>
          <p className="mt-2 text-[17px] font-[500] tracking-[-0.02em]">Portfolio performance</p>
          <p className="text-[12px] text-[var(--product-text-3)]">
            All portfolios · refreshed 04:00 today · feeding Power BI
          </p>
        </div>
        <div className="flex shrink-0 gap-1">
          {RANGES.map((r) => (
            <span
              key={r}
              className={cn(
                "rounded-md px-2 py-1 text-[10.5px] tabular-nums",
                r === "30D"
                  ? "bg-[var(--primary)]/15 text-[var(--product-text)]"
                  : "text-[var(--product-text-3)]",
              )}
            >
              {r}
            </span>
          ))}
        </div>
      </div>

      <motion.div
        className="mt-4 grid grid-cols-1 gap-3 @md:grid-cols-2"
        variants={staggerContainer}
        {...inViewProps}
      >
        <motion.div variants={fadeUpItem}>
          <ProductCard>
            <div className="flex items-center justify-between">
              <p className="text-[12px] font-[500]">Liquidation by treatment tier</p>
              <Tag label="▲ 2.1pt" tone="success" />
            </div>
            <div className="mt-3 flex flex-col gap-2">
              {TIERS.map((t) => (
                <div key={t.label} className="grid grid-cols-[1fr_2fr_auto] items-center gap-2">
                  <span className="text-[11px] text-[var(--product-text-2)]">{t.label}</span>
                  <ValueBar value={Math.min(100, t.value * 3)} />
                  <span className="text-[11px] tabular-nums">{t.value}%</span>
                </div>
              ))}
            </div>
          </ProductCard>
        </motion.div>

        <motion.div variants={fadeUpItem}>
          <ProductCard>
            <div className="flex items-center justify-between">
              <p className="text-[12px] font-[500]">Net-back · 12 months</p>
              <Tag label="▲ $11.40" tone="success" />
            </div>
            <AreaLine className="mt-3" points={[0.2, 0.3, 0.28, 0.42, 0.5, 0.62, 0.7, 0.78, 0.74, 0.85, 0.9, 0.96]} />
            <div className="mt-1 flex justify-between text-[10px] text-[var(--product-text-3)]">
              <span>Jun &apos;25</span>
              <span>May &apos;26</span>
            </div>
          </ProductCard>
        </motion.div>

        <motion.div variants={fadeUpItem}>
          <ProductCard>
            <p className="text-[12px] font-[500]">Top vendors · liquidation</p>
            <div className="mt-3 flex flex-col gap-2">
              {VENDORS.map((v) => (
                <div key={v.rank} className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] tabular-nums text-[var(--product-text-3)]">{v.rank}</span>
                    <div>
                      <p className="text-[11.5px]">{v.name}</p>
                      <p className="text-[10px] text-[var(--product-text-3)]">{v.sub}</p>
                    </div>
                  </div>
                  <span className="text-[12px] tabular-nums">{v.pct}</span>
                </div>
              ))}
            </div>
          </ProductCard>
        </motion.div>

        <motion.div variants={fadeUpItem}>
          <ProductCard>
            <div className="flex items-center justify-between">
              <p className="text-[12px] font-[500]">SLA adherence · 30D</p>
              <Tag label="▲ 1.8pt" tone="success" />
            </div>
            <p className="mt-2 text-[28px] font-[500] tabular-nums">
              <AnimatedNumber value={97.4} decimals={1} suffix="%" />
            </p>
            <p className="text-[10.5px] text-[var(--product-text-3)]">Target 95.0% · exceeded</p>
            <Sparkline className="mt-2" bars={[0.5, 0.6, 0.55, 0.7, 0.8, 0.75, 1]} />
          </ProductCard>
        </motion.div>
      </motion.div>

      <div className="mt-4 flex flex-wrap gap-2">
        <StatPill label="Next refresh 04:00 tomorrow" />
        <StatPill label="Power BI feed active" tone="success" />
        <StatPill label="Live" tone="indigo" />
      </div>
    </ProductCanvas>
  );
});
