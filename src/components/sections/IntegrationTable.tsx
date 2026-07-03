"use client";

import { motion } from "framer-motion";

import { SectionContainer } from "@/components/sections/SectionContainer";
import type { SectionSurface } from "@/components/sections/SectionContainer";
import {
  fadeUpItem,
  staggerContainer,
  useInViewProps,
} from "@/components/product/motion";

export interface IntegrationRow {
  platform: string;
  category: string;
}

export interface IntegrationTableProps {
  eyebrow?: string;
  heading: string;
  /** One or more lead paragraphs above the table. */
  body?: string | string[];
  rows: IntegrationRow[];
  /** Optional paragraph rendered beneath the table. */
  footnote?: string;
  /** Accessible name for the table. */
  caption: string;
  surface?: SectionSurface;
}

/**
 * A live integration ledger: platform and category. Used four times on
 * /platform/integrations (ERP, CIS, proprietary, recovery).
 *
 * Category collapses into a sub-line under the platform name below the `sm`
 * breakpoint so the table never crowds on phones.
 */
export function IntegrationTable({
  eyebrow,
  heading,
  body,
  rows,
  footnote,
  caption,
  surface = "dark",
}: IntegrationTableProps) {
  const paragraphs = body ? (Array.isArray(body) ? body : [body]) : [];
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
        {paragraphs.map((p) => (
          <p key={p} className="mt-5 text-body-lg text-[var(--text-tertiary)]">
            {p}
          </p>
        ))}
      </div>

      <div className="mt-8 overflow-hidden rounded-[var(--radius-sm)] border border-[var(--border)] md:mt-10">
        <table className="w-full border-collapse text-left">
          <caption className="sr-only">{caption}</caption>
          <thead>
            <tr className="bg-[var(--card-alt)]">
              <th
                scope="col"
                className="px-5 py-3.5 text-caption font-[480] uppercase tracking-wider text-[var(--text-tertiary)]"
              >
                Platform
              </th>
              <th
                scope="col"
                className="hidden px-5 py-3.5 text-caption font-[480] uppercase tracking-wider text-[var(--text-tertiary)] sm:table-cell"
              >
                Category
              </th>
            </tr>
          </thead>
          <motion.tbody {...reveal} variants={staggerContainer}>
            {rows.map((row) => (
              <motion.tr
                key={row.platform}
                variants={fadeUpItem}
                className="border-t border-[var(--border)] transition-colors duration-[var(--duration-instant)] hover:bg-[var(--card-alt)]"
              >
                <th
                  scope="row"
                  className="px-5 py-4 text-body-strong font-[480] text-[var(--foreground)]"
                >
                  {row.platform}
                  <span className="mt-0.5 block text-body-sm font-[400] text-[var(--text-tertiary)] sm:hidden">
                    {row.category}
                  </span>
                </th>
                <td className="hidden px-5 py-4 text-body-sm text-[var(--text-tertiary)] sm:table-cell">
                  {row.category}
                </td>
              </motion.tr>
            ))}
          </motion.tbody>
        </table>
      </div>

      {footnote ? (
        <p className="mt-6 max-w-2xl text-body-md text-[var(--text-tertiary)]">
          {footnote}
        </p>
      ) : null}
    </SectionContainer>
  );
}
