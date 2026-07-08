import * as React from "react";
import Link from "next/link";

import { RevealGroup } from "@/components/sections/RevealGroup";
import { SectionContainer } from "@/components/sections/SectionContainer";
import type { SectionSurface } from "@/components/sections/SectionContainer";
import { cn } from "@/lib/utils";
import hover from "@/components/motion/hover.module.css";

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
  /** Optional ghost link below the grid (e.g. "Explore all integrations"). */
  link?: { label: string; href: string };
}

/**
 * 4 small icon cards for integration categories. DESIGN.md §7.6 stacked-proof
 * variant. Cards are flat dark surfaces with subtle borders.
 *
 * Server Component: the staggered scroll-reveal is the RevealGroup client
 * leaf + CSS (globals.css). Fails open — SSR/no-JS render visible.
 */
export function IntegrationStrip({
  eyebrow,
  heading,
  body,
  cards,
  surface = "dark",
  link,
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

      <RevealGroup
        as="ul"
        className="mt-10 grid gap-4 sm:grid-cols-2 md:mt-14 lg:grid-cols-4"
        threshold={0.2}
      >
        {cards.map((card, i) => (
          <li
            key={card.title}
            style={{ "--reveal-i": i } as React.CSSProperties}
            className={cn(
              "flex flex-col gap-4 rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--card)] p-6",
              hover.hoverCard
            )}
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
      </RevealGroup>

      {link ? (
        <div className="mt-8">
          <Link
            href={link.href}
            className={cn(
              "inline-flex min-h-touch items-center gap-1 text-body-strong font-[480] text-[var(--foreground)] underline-offset-4 hover:text-white hover:underline hover:decoration-[var(--primary)] focus-visible:outline-2 focus-visible:outline-[var(--focus)]",
              hover.hoverArrow
            )}
          >
            {link.label}{" "}
            <span aria-hidden="true" className={hover.arrow}>
              →
            </span>
          </Link>
        </div>
      ) : null}
    </SectionContainer>
  );
}
