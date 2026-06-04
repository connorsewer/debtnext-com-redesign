import Link from "next/link";

import { SectionContainer } from "@/components/sections/SectionContainer";

/** A category label, optionally linked to its solution page. */
export type TrustBandItem = string | { label: string; href: string };

export interface TrustBandProps {
  eyebrow: string;
  industries: ReadonlyArray<TrustBandItem>;
}

/**
 * Compact industry-category strip. DESIGN.md §7.5: quiet density.
 * No logos for v1; category labels only per content/pages/homepage.md.
 *
 * Items that carry an href render as links into the matching /solutions
 * child page, brightening on hover/focus like the rest of the nav.
 */
export function TrustBand({ eyebrow, industries }: TrustBandProps) {
  return (
    <SectionContainer
      surface="dark"
      className="border-y border-[var(--border)] py-10 md:py-14 lg:py-16"
    >
      <p className="text-center text-[var(--text-caption)] font-[480] uppercase tracking-wider text-[var(--text-tertiary)]">
        {eyebrow}
      </p>
      <ul className="mt-8 flex flex-wrap items-center justify-center gap-x-10 gap-y-4 md:mt-10 md:gap-x-14">
        {industries.map((industry) => {
          const label = typeof industry === "string" ? industry : industry.label;
          const href = typeof industry === "string" ? undefined : industry.href;
          return (
            <li
              key={label}
              className="text-[var(--text-body-strong)] font-[420] text-[var(--text-tertiary)]"
            >
              {href ? (
                <Link
                  href={href}
                  className="inline-flex min-h-touch items-center transition-colors duration-[var(--duration-instant)] hover:text-white focus-visible:outline-2 focus-visible:outline-[var(--focus)]"
                >
                  {label}
                </Link>
              ) : (
                label
              )}
            </li>
          );
        })}
      </ul>
    </SectionContainer>
  );
}
