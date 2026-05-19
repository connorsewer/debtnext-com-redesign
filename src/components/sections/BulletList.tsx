import { SectionContainer } from "@/components/sections/SectionContainer";
import type { SectionSurface } from "@/components/sections/SectionContainer";

export interface BulletListProps {
  eyebrow?: string;
  heading: string;
  body?: string;
  bullets: string[];
  surface?: SectionSurface;
}

/**
 * Section with a long-form bulleted reference list. Used for regulatory
 * and security framework references on /solutions and /company.
 *
 * Bullets are flat (not cards) because they read as a reference list,
 * not a feature comparison.
 */
export function BulletList({
  eyebrow,
  heading,
  body,
  bullets,
  surface = "elevated-dark",
}: BulletListProps) {
  return (
    <SectionContainer surface={surface}>
      <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
        <div className="max-w-md">
          {eyebrow ? (
            <p className="text-caption font-[480] uppercase tracking-wider text-[var(--text-tertiary)]">
              {eyebrow}
            </p>
          ) : null}
          <h2 className="mt-3 text-h2 font-[480] text-[var(--foreground)]">
            {heading}
          </h2>
          {body ? (
            <p className="mt-5 text-body-lg text-[var(--text-tertiary)]">
              {body}
            </p>
          ) : null}
        </div>

        <ul className="grid gap-3">
          {bullets.map((bullet) => (
            <li
              key={bullet}
              className="flex items-start gap-3 text-body-md text-[var(--foreground)]"
            >
              <span
                aria-hidden="true"
                className="mt-2 inline-block h-1 w-3 shrink-0 rounded-[var(--radius-xs)] bg-[var(--primary)]"
              />
              <span>{bullet}</span>
            </li>
          ))}
        </ul>
      </div>
    </SectionContainer>
  );
}
