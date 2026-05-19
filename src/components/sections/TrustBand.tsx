import { SectionContainer } from "@/components/sections/SectionContainer";

export interface TrustBandProps {
  eyebrow: string;
  industries: string[];
}

/**
 * Compact industry-category strip. DESIGN.md §7.5: quiet density.
 * No logos for v1; category labels only per content/pages/homepage.md.
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
        {industries.map((industry) => (
          <li
            key={industry}
            className="text-[var(--text-body-strong)] font-[420] text-[var(--text-tertiary)]"
          >
            {industry}
          </li>
        ))}
      </ul>
    </SectionContainer>
  );
}
