"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";

import { SectionContainer } from "@/components/sections/SectionContainer";
import type { SectionSurface } from "@/components/sections/SectionContainer";

export interface ProofStat {
  number: string;
  label: string;
  /** Optional small caption beneath the label */
  caption?: string;
}

export interface ProofBandProps {
  eyebrow?: string;
  stats: ProofStat[];
  surface?: SectionSurface;
}

/**
 * Three (or more) stat cards. DESIGN.md §7.5: quiet trust without a logo wall.
 * Numbers render at H2 size with tabular figures so digits don't reflow.
 *
 * Each card fades and rises subtly on first intersection; the sequence
 * staggers per MD motion guidance. Respects prefers-reduced-motion via
 * useReducedMotion — animation collapses to instant in that case.
 */
export function ProofBand({ eyebrow, stats, surface = "dark" }: ProofBandProps) {
  const reduceMotion = useReducedMotion();
  const enter = reduceMotion
    ? { initial: false, animate: undefined }
    : {
        initial: { opacity: 0, y: 16 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: "-10% 0px" },
      };

  return (
    <SectionContainer surface={surface}>
      {eyebrow ? (
        <p className="text-center text-[var(--text-caption)] font-[480] uppercase tracking-wider text-[var(--text-tertiary)]">
          {eyebrow}
        </p>
      ) : null}
      <ul
        className="mt-10 grid gap-8 md:mt-12"
        style={{
          gridTemplateColumns: `repeat(${stats.length}, minmax(0, 1fr))`,
        }}
      >
        {stats.map((stat, idx) => (
          <motion.li
            key={stat.number}
            {...enter}
            transition={{
              duration: 0.4,
              ease: [0.2, 0.7, 0.2, 1],
              delay: reduceMotion ? 0 : idx * 0.08,
            }}
            className="border-t border-[var(--border)] pt-8"
          >
            <p
              className="text-h2 font-[480] text-[var(--foreground)]"
              style={{ fontVariantNumeric: "tabular-nums" }}
            >
              {stat.number}
            </p>
            <p className="mt-3 text-body-strong text-[var(--foreground)]">
              {stat.label}
            </p>
            {stat.caption ? (
              <p className="mt-2 text-body-sm text-[var(--text-tertiary)]">
                {stat.caption}
              </p>
            ) : null}
          </motion.li>
        ))}
      </ul>
    </SectionContainer>
  );
}
