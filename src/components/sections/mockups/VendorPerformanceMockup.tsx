"use client";

import { motion } from "framer-motion";

export const vendorPerformanceMockupTitle = "Vendor scorecard · YTD";

const vendors = [
  { name: "ABC Recovery", grade: "A", liq: 18.7, delta: "+2.1", trend: [4, 6, 5, 8, 9, 11, 13, 15], gradeColor: "var(--chart-3)" },
  { name: "Global Collect", grade: "A-", liq: 16.3, delta: "+0.8", trend: [6, 7, 7, 9, 8, 10, 11, 12], gradeColor: "var(--chart-3)" },
  { name: "Best Resolution", grade: "B+", liq: 15.2, delta: "+0.3", trend: [10, 9, 11, 10, 12, 11, 12, 13], gradeColor: "var(--chart-4)" },
  { name: "Summit Recovery", grade: "B", liq: 13.5, delta: "-0.4", trend: [12, 13, 14, 11, 12, 10, 11, 10], gradeColor: "var(--chart-4)" },
  { name: "GDW Recovery", grade: "C", liq: 9.6, delta: "-1.7", trend: [11, 10, 11, 9, 9, 8, 7, 6], gradeColor: "var(--destructive)" },
];

/**
 * Vendor performance with motion:
 * - Header liquidation number fades in
 * - Each vendor row staggers in from below
 * - Grade badges pop with a small scale
 * - Sparklines draw left → right via pathLength
 */
export function VendorPerformanceMockup() {
  return (
    <>
      <motion.div
        className="flex items-baseline justify-between border-b border-[var(--border)] pb-3"
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <div>
          <p className="text-caption font-[480] uppercase tracking-wider text-[var(--text-tertiary)]">
            Liquidation, all pools
          </p>
          <p
            className="mt-1 text-h3 font-[480] text-[var(--foreground)]"
            style={{ fontVariantNumeric: "tabular-nums" }}
          >
            14.7%
          </p>
        </div>
        <p className="text-body-sm text-[var(--chart-3)]">+1.3% vs prior 30d</p>
      </motion.div>

      <ul className="mt-4 space-y-3">
        {vendors.map((v, i) => (
          <motion.li
            key={v.name}
            className="flex items-center gap-4"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.08 + i * 0.08 }}
          >
            <motion.span
              className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-caption font-[480] text-[var(--card)]"
              style={{ backgroundColor: v.gradeColor }}
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                duration: 0.4,
                delay: 0.12 + i * 0.08,
                ease: [0.2, 0.7, 0.2, 1],
              }}
            >
              {v.grade}
            </motion.span>
            <div className="min-w-0 flex-1">
              <p className="text-body-strong font-[480] text-[var(--foreground)]">
                {v.name}
              </p>
              <p
                className="text-body-sm text-[var(--text-tertiary)]"
                style={{ fontVariantNumeric: "tabular-nums" }}
              >
                {v.liq}% liquidation
                <span
                  className={
                    v.delta.startsWith("+")
                      ? "ml-2 text-[var(--chart-3)]"
                      : "ml-2 text-[var(--destructive)]"
                  }
                >
                  {v.delta}
                </span>
              </p>
            </div>
            <svg
              width="72"
              height="22"
              viewBox="0 0 72 22"
              fill="none"
              aria-hidden="true"
              className="shrink-0"
            >
              <motion.polyline
                points={v.trend
                  .map(
                    (y, idx) => `${(idx / (v.trend.length - 1)) * 72},${22 - (y / 16) * 18}`
                  )
                  .join(" ")}
                stroke={v.gradeColor}
                strokeWidth="1.5"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{
                  duration: 0.8,
                  delay: 0.2 + i * 0.08,
                  ease: "easeOut",
                }}
              />
            </svg>
          </motion.li>
        ))}
      </ul>
    </>
  );
}
