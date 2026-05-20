"use client";

import { motion, useReducedMotion } from "framer-motion";

export const placementMockupTitle = "Placement run · 12:04 PM";

const pools = [
  { tier: "Pre-collect", pct: 35, vendors: 2, bar: "from-[var(--primary)] to-[var(--primary-hover)]" },
  { tier: "Primary", pct: 28, vendors: 3, bar: "from-[var(--chart-3)] to-[#22c55e]" },
  { tier: "Secondary", pct: 18, vendors: 2, bar: "from-[var(--chart-4)] to-[#d97706]" },
  { tier: "Tertiary", pct: 12, vendors: 4, bar: "from-[var(--chart-5)] to-[#0891b2]" },
];

/**
 * Placement and routing mockup with entrance animations:
 * - Header strip fades in from above
 * - Allocation bars grow from 0% → target width with stagger
 * - "Engine running" indicator dot has an always-running pulse
 */
export function PlacementMockup() {
  const shouldReduce = useReducedMotion();
  return (
    <>
      <motion.div
        className="flex items-center justify-between border-b border-[var(--border)] pb-4"
        initial={shouldReduce ? false : { opacity: 0, y: -6 }}
        animate={shouldReduce ? false : { opacity: 1, y: 0 }}
        transition={shouldReduce ? { duration: 0 } : { duration: 0.35, ease: [0.2, 0.7, 0.2, 1] }}
      >
        <div>
          <p className="text-caption font-[480] uppercase tracking-wider text-[var(--text-tertiary)]">
            Inbound batch
          </p>
          <p
            className="mt-1 text-h3 font-[480] text-[var(--foreground)]"
            style={{ fontVariantNumeric: "tabular-nums" }}
          >
            120,418
          </p>
          <p className="text-body-sm text-[var(--text-tertiary)]">
            accounts · $284.6M
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-[var(--radius-xl)] border border-[var(--chart-3)]/30 bg-[var(--chart-3)]/10 px-3 py-1.5">
          <span className="relative h-2 w-2">
            <span className="absolute inset-0 rounded-full bg-[var(--chart-3)]" />
            <span className="absolute inset-0 animate-ping rounded-full bg-[var(--chart-3)]/60" />
          </span>
          <span className="text-body-sm font-[480] text-[var(--foreground)]">
            Engine running
          </span>
        </div>
      </motion.div>

      <ul className="mt-4 space-y-2.5">
        {pools.map((pool, i) => (
          <li key={pool.tier} className="flex items-center gap-4">
            <motion.div
              className="w-28 shrink-0"
              initial={shouldReduce ? false : { opacity: 0, x: -8 }}
              animate={shouldReduce ? false : { opacity: 1, x: 0 }}
              transition={shouldReduce ? { duration: 0 } : { duration: 0.3, delay: 0.1 + i * 0.06 }}
            >
              <p className="text-body-strong font-[480] text-[var(--foreground)]">
                {pool.tier}
              </p>
              <p className="text-body-sm text-[var(--text-tertiary)]">
                {pool.vendors} vendor{pool.vendors === 1 ? "" : "s"}
              </p>
            </motion.div>
            <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-[var(--secondary)]">
              <motion.div
                className={`absolute inset-y-0 left-0 rounded-full bg-gradient-to-r ${pool.bar}`}
                initial={shouldReduce ? { width: `${pool.pct * 2.4}%` } : { width: 0 }}
                animate={{ width: `${pool.pct * 2.4}%` }}
                transition={
                  shouldReduce
                    ? { duration: 0 }
                    : {
                        duration: 0.7,
                        delay: 0.15 + i * 0.08,
                        ease: [0.2, 0.7, 0.2, 1],
                      }
                }
              />
            </div>
            <motion.span
              className="w-10 shrink-0 text-right text-body-strong font-[480] text-[var(--foreground)]"
              style={{ fontVariantNumeric: "tabular-nums" }}
              initial={shouldReduce ? false : { opacity: 0 }}
              animate={shouldReduce ? false : { opacity: 1 }}
              transition={shouldReduce ? { duration: 0 } : { duration: 0.3, delay: 0.5 + i * 0.08 }}
            >
              {pool.pct}%
            </motion.span>
          </li>
        ))}
      </ul>

    </>
  );
}
