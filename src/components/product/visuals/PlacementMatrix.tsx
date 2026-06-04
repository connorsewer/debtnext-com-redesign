import * as React from "react";

import { EyebrowLabel } from "@/components/product/primitives/EyebrowLabel";
import { LiveStatus } from "@/components/product/primitives/LiveStatus";
import { ProductCanvas } from "@/components/product/primitives/ProductCanvas";
import { ProductCard } from "@/components/product/primitives/ProductCard";
import { StatPill } from "@/components/product/primitives/StatPill";
import { SegmentedBar } from "@/components/product/visuals/parts";

// [CLAIMS REVIEW] placeholder values — Andrew sign-off required before production.
const ROWS = [
  { tier: "Pre-collect", sub: "3 vendors · 30-day", segments: [40, 35, 25], accounts: "12,847" },
  { tier: "Primary", sub: "3 vendors · 60-day", segments: [45, 35, 20], accounts: "8,420" },
  { tier: "Secondary", sub: "2 vendors · 90-day", segments: [60, 40], accounts: "4,108" },
  { tier: "Tertiary", sub: "2 vendors · 120-day", segments: [55, 45], accounts: "2,290" },
] as const;

export const PlacementMatrix = React.memo(function PlacementMatrix() {
  return (
    <ProductCanvas className="text-[var(--product-text)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <EyebrowLabel>PLACEMENT MANAGEMENT</EyebrowLabel>
          <p className="mt-2 text-[17px] font-[500] tracking-[-0.02em]">Routing rules</p>
          <p className="text-[12px] text-[var(--product-text-3)]">
            National network · decision engine active · 14 rules live
          </p>
        </div>
        <LiveStatus label="LIVE" />
      </div>

      <ProductCard className="mt-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span
            aria-hidden="true"
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[7px] bg-[var(--primary)] text-white"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path
                d="M8 12V4M8 4l-3 3M8 4l3 3"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <div>
            <p className="text-[13px] font-[500]">1,847 accounts ready to route</p>
            <p className="text-[11px] text-[var(--product-text-3)]">
              Loaded from billing · evaluated against tier rules
            </p>
          </div>
        </div>
        <span className="shrink-0 rounded-full bg-[var(--primary)] px-3 py-1.5 text-[11px] font-[500] text-white">
          Routing now
        </span>
      </ProductCard>

      <div className="mt-4 grid grid-cols-[1.1fr_2fr_0.6fr] gap-x-4 gap-y-3">
        <span className="text-[10px] uppercase tracking-[0.08em] text-[var(--product-text-3)]">Treatment tier</span>
        <span className="text-[10px] uppercase tracking-[0.08em] text-[var(--product-text-3)]">Vendor allocation</span>
        <span className="text-right text-[10px] uppercase tracking-[0.08em] text-[var(--product-text-3)]">Accounts</span>
        {ROWS.map((r) => (
          <React.Fragment key={r.tier}>
            <div>
              <p className="text-[12.5px] font-[500]">{r.tier}</p>
              <p className="text-[10.5px] text-[var(--product-text-3)]">{r.sub}</p>
            </div>
            <SegmentedBar segments={[...r.segments]} className="self-center" />
            <span className="self-center text-right text-[12.5px] tabular-nums">{r.accounts}</span>
          </React.Fragment>
        ))}
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <StatPill label="Reconciliation 04:00 today" />
        <StatPill label="Recall windows configured" />
        <StatPill label="27 vendors active" tone="indigo" />
      </div>
    </ProductCanvas>
  );
});
