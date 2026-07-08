import * as React from "react";
import Link from "next/link";

import { RevealGroup } from "@/components/sections/RevealGroup";
import { SectionContainer } from "@/components/sections/SectionContainer";
import type { SectionSurface } from "@/components/sections/SectionContainer";
import { cn } from "@/lib/utils";
import hover from "@/components/motion/hover.module.css";

export interface GridCard {
  title: string;
  body: string;
  /** Optional ghost-link below the card body (e.g. "Explore placement →") */
  link?: { label: string; href: string };
  /** Optional small caption above the title (e.g. "01 · Operations") */
  eyebrow?: string;
  /** Optional inline SVG icon */
  icon?: React.ReactNode;
}

export interface CardGridProps {
  eyebrow?: string;
  heading: string;
  body?: string;
  cards: GridCard[];
  /** Desktop column count. Mobile is always 1 col; tablet is min(2, columns). */
  columns?: 2 | 3 | 4;
  surface?: SectionSurface;
  id?: string;
}

/**
 * Flexible card grid. Used for /platform capability grid (9 cards, cols=3),
 * /solutions industries (4 cards, cols=2), /why-dplat differentiators (3
 * cards, cols=3), /company leadership (cols=3), /resources categories (3
 * cards, cols=3), and /platform/reporting "three layers" (cols=3).
 *
 * Cards are flat dark surfaces. Hover brightens the border per DESIGN.md §8.4.
 *
 * Server Component: the staggered scroll-reveal is the RevealGroup client
 * leaf + CSS (globals.css), so the card markup never hydrates and
 * framer-motion stays off the route. Fails open — SSR/no-JS render visible.
 */
export function CardGrid({
  eyebrow,
  heading,
  body,
  cards,
  columns = 3,
  surface = "dark",
  id,
}: CardGridProps) {
  const colClass = {
    2: "@sm/card:grid-cols-2",
    3: "@sm/card:grid-cols-2 @5xl/card:grid-cols-3",
    4: "@sm/card:grid-cols-2 @5xl/card:grid-cols-3 @7xl/card:grid-cols-4",
  }[columns];

  return (
    <SectionContainer surface={surface} id={id}>
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

      <div className="container-card mt-10 md:mt-14">
        <RevealGroup as="ul" className={cn("grid gap-4", colClass)}>
          {cards.map((card, i) => (
            <li
              key={card.title}
              style={{ "--reveal-i": i } as React.CSSProperties}
              className={cn(
                "flex flex-col gap-4 rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--card)] p-6 md:p-7",
                hover.hoverCard
              )}
            >
              {card.icon ? (
                <span
                  aria-hidden="true"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-[var(--radius-xs)] bg-[var(--secondary)] text-[var(--foreground)]"
                >
                  {card.icon}
                </span>
              ) : null}
              {card.eyebrow ? (
                <p className="text-caption font-[480] uppercase tracking-wider text-[var(--accent-text-dark)]">
                  {card.eyebrow}
                </p>
              ) : null}
              <div className="flex-1">
                <h3 className="text-h4 font-[480] text-[var(--foreground)]">
                  {card.title}
                </h3>
                <p className="mt-3 text-body-md text-[var(--text-tertiary)]">
                  {card.body}
                </p>
              </div>
              {card.link ? (
                <Link
                  href={card.link.href}
                  className={cn(
                    "inline-flex min-h-touch items-center gap-1 text-body-strong font-[480] text-[var(--foreground)] underline-offset-4 hover:text-white hover:underline hover:decoration-[var(--primary)] focus-visible:outline-2 focus-visible:outline-[var(--focus)]",
                    hover.hoverArrow
                  )}
                >
                  {card.link.label}{" "}
                  <span aria-hidden="true" className={hover.arrow}>
                    →
                  </span>
                </Link>
              ) : null}
            </li>
          ))}
        </RevealGroup>
      </div>
    </SectionContainer>
  );
}
