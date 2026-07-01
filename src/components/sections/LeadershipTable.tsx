"use client";

import { motion } from "framer-motion";

import { SectionContainer } from "@/components/sections/SectionContainer";
import type { SectionSurface } from "@/components/sections/SectionContainer";
import {
  AnimatedNumber,
  fadeUpItem,
  staggerContainer,
  useInViewProps,
} from "@/components/product/motion";

export interface LeaderRow {
  name: string;
  role: string;
  years: number;
}

export interface LeadershipTableProps {
  eyebrow?: string;
  heading: string;
  body?: string;
  leaders: LeaderRow[];
  /** Label for the count column, e.g. "Years in recovery". */
  yearsLabel?: string;
  surface?: SectionSurface;
}

/**
 * Leadership roster with a tenure count-up. Reads as a credentials ledger,
 * not a card wall: a single quiet table, years ticking up on scroll-in.
 */
export function LeadershipTable({
  eyebrow,
  heading,
  body,
  leaders,
  yearsLabel = "Years in recovery",
  surface = "elevated-dark",
}: LeadershipTableProps) {
  const reveal = useInViewProps();
  return (
    <SectionContainer surface={surface}>
      <div className="max-w-2xl">
        {eyebrow ? (
          <p className="text-caption font-[480] uppercase tracking-wider text-[var(--text-tertiary)]">
            {eyebrow}
          </p>
        ) : null}
        <h2 className="mt-3 text-h2 font-[480] text-[var(--foreground)]">
          {heading}
        </h2>
        {body ? (
          <p className="mt-5 text-body-lg text-[var(--text-tertiary)]">{body}</p>
        ) : null}
      </div>

      <div className="mt-8 overflow-hidden rounded-[var(--radius-sm)] border border-[var(--border)] md:mt-10">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="bg-[var(--card-alt)]">
              <th
                scope="col"
                className="px-5 py-3.5 text-caption font-[480] uppercase tracking-wider text-[var(--text-tertiary)]"
              >
                Name
              </th>
              <th
                scope="col"
                className="hidden px-5 py-3.5 text-caption font-[480] uppercase tracking-wider text-[var(--text-tertiary)] sm:table-cell"
              >
                Role
              </th>
              <th
                scope="col"
                className="px-5 py-3.5 text-right text-caption font-[480] uppercase tracking-wider text-[var(--text-tertiary)]"
              >
                {yearsLabel}
              </th>
            </tr>
          </thead>
          <motion.tbody {...reveal} variants={staggerContainer}>
            {leaders.map((leader) => (
              <motion.tr
                key={leader.name}
                variants={fadeUpItem}
                className="border-t border-[var(--border)]"
              >
                <th
                  scope="row"
                  className="px-5 py-4 text-body-strong font-[480] text-[var(--foreground)]"
                >
                  {leader.name}
                  <span className="mt-0.5 block text-body-sm font-[400] text-[var(--text-tertiary)] sm:hidden">
                    {leader.role}
                  </span>
                </th>
                <td className="hidden px-5 py-4 text-body-sm text-[var(--text-tertiary)] sm:table-cell">
                  {leader.role}
                </td>
                <td
                  className="px-5 py-4 text-right text-body-strong font-[480] text-[var(--accent-text-dark)]"
                  style={{ fontVariantNumeric: "tabular-nums" }}
                >
                  <AnimatedNumber value={leader.years} />
                </td>
              </motion.tr>
            ))}
          </motion.tbody>
        </table>
      </div>
    </SectionContainer>
  );
}
