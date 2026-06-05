"use client";

import * as React from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

import { ProductCanvas } from "@/components/product/primitives/ProductCanvas";
import { ProductCard } from "@/components/product/primitives/ProductCard";
import {
  AnimatedNumber,
  DUR_BAR,
  EASE_ENTRANCE,
  fadeUpItem,
  inViewProps,
  staggerContainer,
} from "@/components/product/motion";

// Accent colors are fixed per industry (Prompt 1 spec).
// [CLAIMS REVIEW] placeholder metrics — Andrew sign-off required before production.
const INDUSTRIES = [
  {
    name: "Utilities",
    accent: "#4AA8C9",
    tag: "Regulated",
    liq: 16.2,
    bar: 62,
    second: "84,200 accounts in treatment",
  },
  {
    name: "Financial services",
    accent: "#5266EB",
    tag: "Bank · card",
    liq: 21.4,
    bar: 78,
    second: "$138.40 net-back per account",
  },
  {
    name: "Telecom",
    accent: "#8472F0",
    tag: "Subscriber",
    liq: 18.9,
    bar: 70,
    second: "$42.1M recovered · 30D",
  },
  {
    name: "Fintech",
    accent: "#3D9DE0",
    tag: "Digital lending",
    liq: 24.6,
    bar: 88,
    second: "3.2 day average cycle time",
  },
] as const;

/** Accent-tinted progress bar that fills on scroll-into-view. */
function AccentBar({ value, accent }: { value: number; accent: string }) {
  const reduce = useReducedMotion();
  const ref = React.useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const shown = reduce || inView;
  return (
    <div
      ref={ref}
      className="h-1.5 w-full rounded-full bg-white/10"
      role="img"
      aria-label={`${value}%`}
    >
      <motion.div
        className="h-full origin-left rounded-full"
        style={{ width: `${value}%`, backgroundColor: accent }}
        initial={reduce ? false : { scaleX: 0 }}
        animate={{ scaleX: shown ? 1 : 0 }}
        transition={{ duration: DUR_BAR, ease: EASE_ENTRANCE }}
      />
    </div>
  );
}

export const SolutionsIndustryCards = React.memo(function SolutionsIndustryCards() {
  return (
    <ProductCanvas className="text-[var(--product-text)]" bloom="dual">
      <motion.div
        className="grid grid-cols-2 gap-3"
        variants={staggerContainer}
        {...inViewProps}
      >
        {INDUSTRIES.map((ind) => (
          <motion.div key={ind.name} variants={fadeUpItem}>
            <ProductCard className="flex h-full flex-col gap-3 p-[15px]">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span
                    aria-hidden="true"
                    className="h-[18px] w-[18px] shrink-0 rounded-[5px]"
                    style={{
                      background: `linear-gradient(135deg, ${ind.accent}, color-mix(in srgb, ${ind.accent} 55%, #171721))`,
                      boxShadow: `0 0 10px 1px color-mix(in srgb, ${ind.accent} 45%, transparent)`,
                    }}
                  />
                  <span className="text-[13px] font-[500] tracking-[-0.01em]">
                    {ind.name}
                  </span>
                </div>
                <span
                  className="rounded-[5px] px-1.5 py-0.5 text-[9.5px] font-[600] uppercase tracking-[0.04em]"
                  style={{
                    color: ind.accent,
                    backgroundColor: `color-mix(in srgb, ${ind.accent} 16%, transparent)`,
                  }}
                >
                  {ind.tag}
                </span>
              </div>

              <div className="flex items-end justify-between gap-2">
                <span className="text-[10.5px] font-[500] uppercase tracking-[0.08em] text-[var(--product-text-3)]">
                  Liquidation · 30D
                </span>
                <span className="text-[20px] font-[500] leading-none tracking-[-0.022em] tabular-nums">
                  <AnimatedNumber value={ind.liq} decimals={1} suffix="%" />
                </span>
              </div>

              <AccentBar value={ind.bar} accent={ind.accent} />

              <p className="text-[10.5px] tabular-nums text-[var(--product-text-3)]">
                {ind.second}
              </p>
            </ProductCard>
          </motion.div>
        ))}
      </motion.div>
    </ProductCanvas>
  );
});
