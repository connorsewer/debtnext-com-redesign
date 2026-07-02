"use client";

import { motion } from "framer-motion";

import { SectionContainer } from "@/components/sections/SectionContainer";
import type { SectionSurface } from "@/components/sections/SectionContainer";
import { fadeUpItem, staggerContainer, useInViewProps } from "@/components/product/motion";
import { cn } from "@/lib/utils";

export interface ComparePlatform {
  /** Platform name; supports an optional parenthetical product line. */
  name: string;
  /** Small de-emphasized line under the name (e.g. product brands). */
  note?: string;
  builtFor: string;
  chosen: string;
  stops: string;
  /** dPlat row gets the accent highlight treatment. */
  isPrimary?: boolean;
}

export interface CompareMatrixProps {
  eyebrow?: string;
  heading: string;
  body?: string;
  platforms: ComparePlatform[];
  surface?: SectionSurface;
}

const COLS = [
  { key: "builtFor", label: "Built for" },
  { key: "chosen", label: "Where it's typically chosen" },
  { key: "stops", label: "Where it stops" },
] as const;

/**
 * Platforms-as-rows comparison matrix for /compare. Distinct from
 * ComparisonTable (capabilities × products): this one reads as a market map,
 * one platform per row, with the dPlat row carrying the accent highlight.
 *
 * Desktop: full table. Mobile (<768 container width): stacked cards.
 * Rows reveal with a staggered fade-up on first scroll-in; under
 * prefers-reduced-motion, `useInViewProps` resolves straight to the final
 * "show" state so rows render at opacity 1 with no animation (fail open).
 */
export function CompareMatrix({
  eyebrow,
  heading,
  body,
  platforms,
  surface = "dark",
}: CompareMatrixProps) {
  const reveal = useInViewProps();
  return (
    <SectionContainer surface={surface}>
      <div className="container-section">
        <div className="max-w-3xl">
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

        {/* Desktop / tablet: real table. Horizontal scroll on narrow tablet. */}
        <div className="mt-10 hidden overflow-x-auto @md/section:block @md/section:mt-14 @lg/section:overflow-visible">
          <table className="w-full border-collapse text-left align-top">
            <thead>
              <tr className="border-b border-[var(--border)]">
                <th
                  scope="col"
                  className="w-[17%] px-4 py-4 text-caption font-[480] uppercase tracking-wider text-[var(--text-tertiary)]"
                >
                  Platform
                </th>
                {COLS.map((col) => (
                  <th
                    key={col.key}
                    scope="col"
                    className="w-[27.6%] px-4 py-4 text-caption font-[480] uppercase tracking-wider text-[var(--text-tertiary)]"
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <motion.tbody {...reveal} variants={staggerContainer}>
              {platforms.map((p) => (
                <motion.tr
                  key={p.name}
                  variants={fadeUpItem}
                  className={cn(
                    "border-b border-[var(--border)] last:border-b-0",
                    p.isPrimary && "bg-[var(--card-alt)]"
                  )}
                >
                  <th scope="row" className="px-4 py-5 align-top">
                    <span
                      className={cn(
                        "text-body-strong font-[480]",
                        p.isPrimary
                          ? "text-[var(--accent-text-dark)]"
                          : "text-[var(--foreground)]"
                      )}
                    >
                      {p.name}
                    </span>
                    {p.note ? (
                      <span className="mt-1 block text-body-sm text-[var(--text-tertiary)]">
                        {p.note}
                      </span>
                    ) : null}
                  </th>
                  <td className="px-4 py-5 align-top text-body-sm text-[var(--text-tertiary)]">
                    {p.builtFor}
                  </td>
                  <td className="px-4 py-5 align-top text-body-sm text-[var(--text-tertiary)]">
                    {p.chosen}
                  </td>
                  <td className="px-4 py-5 align-top text-body-sm text-[var(--text-tertiary)]">
                    {p.stops}
                  </td>
                </motion.tr>
              ))}
            </motion.tbody>
          </table>
        </div>

        {/* Mobile: stacked cards, one platform each. */}
        <motion.ul
          {...reveal}
          variants={staggerContainer}
          className="mt-10 space-y-4 @md/section:hidden"
        >
          {platforms.map((p) => (
            <motion.li
              key={p.name}
              variants={fadeUpItem}
              className={cn(
                "rounded-[var(--radius-sm)] border p-5",
                p.isPrimary
                  ? "border-[var(--primary)]/40 bg-[var(--card-alt)]"
                  : "border-[var(--border)] bg-[var(--card)]"
              )}
            >
              <p
                className={cn(
                  "text-body-strong font-[480]",
                  p.isPrimary
                    ? "text-[var(--accent-text-dark)]"
                    : "text-[var(--foreground)]"
                )}
              >
                {p.name}
                {p.note ? (
                  <span className="ml-1 font-[400] text-[var(--text-tertiary)]">
                    {p.note}
                  </span>
                ) : null}
              </p>
              <dl className="mt-4 space-y-3">
                {COLS.map((col) => (
                  <div key={col.key}>
                    <dt className="text-caption font-[480] uppercase tracking-wider text-[var(--text-tertiary)]">
                      {col.label}
                    </dt>
                    <dd className="mt-1 text-body-sm text-[var(--foreground)]">
                      {p[col.key]}
                    </dd>
                  </div>
                ))}
              </dl>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </SectionContainer>
  );
}
