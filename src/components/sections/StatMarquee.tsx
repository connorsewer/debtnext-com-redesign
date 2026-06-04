import * as React from "react";

import { Marquee } from "@/components/sections/Marquee";
import type { Stat } from "@/content/stats";
import { cn } from "@/lib/utils";

export interface StatMarqueeProps {
  eyebrow?: string;
  heading?: string;
  items: Stat[];
  durationSeconds?: number;
  className?: string;
}

/**
 * Full-bleed scrolling stat band. The heading sits in the page container; the
 * marquee runs edge to edge so the numbers feel continuous. Used on the
 * homepage for the annual-activity figures ("inundate them with facts").
 */
export function StatMarquee({
  eyebrow,
  heading,
  items,
  durationSeconds = 50,
  className,
}: StatMarqueeProps) {
  return (
    <section
      className={cn(
        "bg-[var(--background)] py-[var(--space-section-mobile)] text-[var(--foreground)] md:py-[var(--space-section-tablet)] lg:py-[var(--space-section-desktop)]",
        className
      )}
    >
      {eyebrow || heading ? (
        <div className="mx-auto mb-10 max-w-[var(--container-content)] px-4 md:mb-14 md:px-6 lg:px-8">
          {eyebrow ? (
            <p className="text-caption font-[480] uppercase tracking-wider text-[var(--text-tertiary)]">
              {eyebrow}
            </p>
          ) : null}
          {heading ? (
            <h2 className="mt-3 max-w-3xl text-h2 font-[480] text-[var(--foreground)]">
              {heading}
            </h2>
          ) : null}
        </div>
      ) : null}

      <Marquee
        durationSeconds={durationSeconds}
        ariaLabel="Annual platform activity"
      >
        {items.map((stat) => (
          <div
            key={stat.label}
            className="mx-3 flex items-baseline gap-3 whitespace-nowrap rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--card)] px-6 py-4"
          >
            <span className="text-h4 font-[480] tabular-nums text-[var(--foreground)]">
              {stat.number}
            </span>
            <span className="text-body-sm text-[var(--text-tertiary)]">
              {stat.label}
            </span>
          </div>
        ))}
      </Marquee>
    </section>
  );
}
