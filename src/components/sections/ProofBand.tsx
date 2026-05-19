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
 * Numbers render at H2 size, captions at body-md.
 */
export function ProofBand({ eyebrow, stats, surface = "dark" }: ProofBandProps) {
  return (
    <SectionContainer surface={surface}>
      {eyebrow ? (
        <p className="text-center text-[var(--text-caption)] font-[480] uppercase tracking-wider text-[var(--text-tertiary)]">
          {eyebrow}
        </p>
      ) : null}
      <ul
        className={`grid gap-8 md:grid-cols-${stats.length} mt-10 md:mt-12`}
        style={{
          gridTemplateColumns: `repeat(${stats.length}, minmax(0, 1fr))`,
        }}
      >
        {stats.map((stat) => (
          <li
            key={stat.number}
            className="border-t border-[var(--border)] pt-8"
          >
            <p className="text-h2 font-[480] text-[var(--foreground)]">
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
          </li>
        ))}
      </ul>
    </SectionContainer>
  );
}
