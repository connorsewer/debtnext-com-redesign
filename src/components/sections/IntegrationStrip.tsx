import * as React from "react";

import { SectionContainer } from "@/components/sections/SectionContainer";
import type { SectionSurface } from "@/components/sections/SectionContainer";

export interface IntegrationCard {
  title: string;
  body: string;
  /** Inline SVG node, sized 24x24, currentColor */
  icon: React.ReactNode;
}

export interface IntegrationStripProps {
  eyebrow?: string;
  heading: string;
  body?: string;
  cards: IntegrationCard[];
  surface?: SectionSurface;
}

/**
 * 4 small icon cards for integration categories. DESIGN.md §7.6 stacked-proof
 * variant. Cards are flat dark surfaces with subtle borders.
 */
export function IntegrationStrip({
  eyebrow,
  heading,
  body,
  cards,
  surface = "dark",
}: IntegrationStripProps) {
  return (
    <SectionContainer surface={surface}>
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
          <p className="mt-5 text-body-lg text-[var(--text-tertiary)]">
            {body}
          </p>
        ) : null}
      </div>

      <ul className="mt-10 grid gap-4 sm:grid-cols-2 md:mt-14 lg:grid-cols-4">
        {cards.map((card) => (
          <li
            key={card.title}
            className="flex flex-col gap-4 rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--card)] p-6 transition-colors duration-[var(--duration-instant)] hover:border-[var(--focus)]"
          >
            <span
              aria-hidden="true"
              className="inline-flex h-10 w-10 items-center justify-center rounded-[var(--radius-xs)] bg-[var(--secondary)] text-[var(--foreground)]"
            >
              {card.icon}
            </span>
            <div>
              <h3 className="text-h4 font-[480] text-[var(--foreground)]">
                {card.title}
              </h3>
              <p className="mt-2 text-body-sm text-[var(--text-tertiary)]">
                {card.body}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </SectionContainer>
  );
}
