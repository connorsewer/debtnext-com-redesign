import * as React from "react";

import { EyebrowLabel } from "@/components/product/primitives/EyebrowLabel";
import { LiveStatus } from "@/components/product/primitives/LiveStatus";
import { ProductCanvas } from "@/components/product/primitives/ProductCanvas";
import { ProductCard } from "@/components/product/primitives/ProductCard";
import { StatPill } from "@/components/product/primitives/StatPill";
import { Tag, type ToneKey } from "@/components/product/visuals/parts";

// [CLAIMS REVIEW] placeholder values — Andrew sign-off required before production.
const VENDORS = [
  { name: "Recovery partner A", sub: "4,206 accounts placed", liq: "22.8%", band: "HIGH", bandTone: "success", shift: "42% → 47%", arrow: "▲", arrowTone: "success" },
  { name: "Recovery partner B", sub: "3,521 accounts placed", liq: "18.6%", band: "MID", bandTone: "warning", shift: "35% → 35%", arrow: "─", arrowTone: "neutral" },
  { name: "Recovery partner C", sub: "5,120 accounts placed", liq: "14.2%", band: "LOW", bandTone: "breach", shift: "23% → 18%", arrow: "▼", arrowTone: "breach" },
] as const;

const ARROW_COLOR: Record<string, string> = {
  success: "var(--status-success)",
  neutral: "var(--product-text-3)",
  breach: "var(--status-breach)",
};

export const OptimizationEngine = React.memo(function OptimizationEngine() {
  return (
    <ProductCanvas className="text-[var(--product-text)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <EyebrowLabel>OPTIMIZATION ENGINE</EyebrowLabel>
          <p className="mt-2 text-[17px] font-[500] tracking-[-0.02em]">Closed pool · Q4 primary</p>
          <p className="text-[12px] text-[var(--product-text-3)]">
            12,847 accounts · performance bands applied · reallocation queued
          </p>
        </div>
        <LiveStatus label="EVALUATED" tone="success" />
      </div>

      <div className="mt-4 grid grid-cols-[2fr_1fr_1fr] gap-x-4 gap-y-3">
        <span className="text-[10px] uppercase tracking-[0.08em] text-[var(--product-text-3)]">Vendor · closed pool</span>
        <span className="text-[10px] uppercase tracking-[0.08em] text-[var(--product-text-3)]">Liquidation</span>
        <span className="text-[10px] uppercase tracking-[0.08em] text-[var(--product-text-3)]">This cycle → next</span>
        {VENDORS.map((v) => (
          <React.Fragment key={v.name}>
            <div className="flex items-center gap-2">
              <span aria-hidden="true" className="h-5 w-5 shrink-0 rounded-[5px] bg-gradient-to-br from-[#5266EB] to-[#3949B5]" />
              <div>
                <p className="text-[12.5px] font-[500]">{v.name}</p>
                <p className="text-[10.5px] text-[var(--product-text-3)]">{v.sub}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 self-center">
              <span className="text-[13px] tabular-nums">{v.liq}</span>
              <Tag label={v.band} tone={v.bandTone as ToneKey} />
            </div>
            <div className="flex items-center gap-1.5 self-center text-[12.5px] tabular-nums">
              <span>{v.shift}</span>
              <span aria-hidden="true" style={{ color: ARROW_COLOR[v.arrowTone] }}>{v.arrow}</span>
            </div>
          </React.Fragment>
        ))}
      </div>

      <ProductCard
        className="mt-4"
        style={{
          borderColor: "color-mix(in srgb, var(--status-success) 30%, transparent)",
          backgroundColor: "color-mix(in srgb, var(--status-success) 8%, transparent)",
          backgroundImage: "none",
        }}
      >
        <p className="flex items-center gap-2 text-[12.5px] font-[500]">
          <span aria-hidden="true" style={{ color: "var(--status-success)" }}>★</span>
          Bonus triggered · Recovery partner A cleared 22% liquidation target
        </p>
        <p className="mt-1 text-[11px] text-[var(--product-text-3)]">
          Monthly bonus calculated automatically · applied to next settlement
        </p>
      </ProductCard>

      <div className="mt-5 flex flex-wrap gap-2">
        <StatPill label="Reallocation applies next placement run" />
        <StatPill label="Caps & floors enforced" tone="indigo" />
      </div>
    </ProductCanvas>
  );
});
