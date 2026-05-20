"use client";

import { motion } from "framer-motion";

import { FramedDashboard } from "./FramedDashboard";

const inventory = [62, 60, 64, 63, 66, 68, 71, 73];
const liquidation = [22, 24, 23, 27, 28, 30, 33, 35];
const labels = ["W1", "W2", "W3", "W4", "W5", "W6", "W7", "W8"];
const w = 320;
const h = 110;
const padX = 10;
const innerW = w - padX * 2;
const maxInv = Math.max(...inventory);
const minInv = Math.min(...inventory);
const maxLiq = Math.max(...liquidation);
const minLiq = Math.min(...liquidation);
const ptInv = (v: number, i: number) => {
  const x = padX + (innerW * i) / (inventory.length - 1);
  const y = h - 10 - ((v - minInv) / (maxInv - minInv)) * (h - 30);
  return `${x},${y}`;
};
const ptLiq = (v: number, i: number) => {
  const x = padX + (innerW * i) / (liquidation.length - 1);
  const y = h - 10 - ((v - minLiq) / (maxLiq - minLiq)) * (h - 30);
  return `${x},${y}`;
};

/**
 * Reporting trend with motion:
 * - Summary tiles fade in with stagger
 * - Both polylines draw left → right via pathLength
 * - Net-back number has a soft glow pulse via CSS
 * - The "scheduled · weekly" indicator stays static (no need for noise)
 */
export function ReportingMockup() {
  return (
    <FramedDashboard title="Liquidation trend · 8 weeks">
      <div className="grid grid-cols-3 gap-3 border-b border-[var(--border)] pb-4">
        {[
          { label: "Inventory", value: "$2.48B", tone: "fg" },
          { label: "Liquidation", value: "$38.7M", tone: "fg" },
          { label: "Net-back", value: "68.2%", tone: "ok" },
        ].map((tile, i) => (
          <motion.div
            key={tile.label}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: i * 0.08 }}
          >
            <p className="text-caption font-[480] uppercase tracking-wider text-[var(--text-tertiary)]">
              {tile.label}
            </p>
            <p
              className={
                "mt-1 text-h3 font-[480] " +
                (tile.tone === "ok"
                  ? "text-[var(--chart-3)]"
                  : "text-[var(--foreground)]")
              }
              style={{ fontVariantNumeric: "tabular-nums" }}
            >
              {tile.value}
            </p>
          </motion.div>
        ))}
      </div>

      <div className="mt-4">
        <div className="mb-2 flex items-center gap-4 text-body-sm text-[var(--text-tertiary)]">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-[var(--chart-3)]" />
            Inventory
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-[var(--primary)]" />
            Liquidation
          </span>
        </div>
        <svg
          viewBox={`0 0 ${w} ${h}`}
          className="h-28 w-full"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          {[0.25, 0.5, 0.75].map((f) => (
            <line
              key={f}
              x1={padX}
              x2={w - padX}
              y1={h - 10 - (h - 30) * f}
              y2={h - 10 - (h - 30) * f}
              stroke="var(--border)"
              strokeWidth="0.5"
            />
          ))}
          <motion.polyline
            points={inventory.map(ptInv).join(" ")}
            stroke="var(--chart-3)"
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.1, delay: 0.25, ease: "easeOut" }}
          />
          <motion.polyline
            points={liquidation.map(ptLiq).join(" ")}
            stroke="var(--primary)"
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.1, delay: 0.45, ease: "easeOut" }}
          />
        </svg>
        <div className="mt-1 flex justify-between text-caption text-[var(--text-tertiary)]">
          {labels.map((l) => (
            <span key={l}>{l}</span>
          ))}
        </div>
      </div>

      <motion.div
        className="mt-4 flex items-center justify-between border-t border-[var(--border)] pt-3 text-body-sm text-[var(--text-tertiary)]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 1.2 }}
      >
        <span>Scheduled · weekly</span>
        <span className="text-[var(--foreground)]">Power BI · Snowflake</span>
      </motion.div>
    </FramedDashboard>
  );
}
