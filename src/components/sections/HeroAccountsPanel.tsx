"use client";

import * as React from "react";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { heroAccountsPanel } from "@/content/homepage-hero";

/**
 * The DOM panel that fades in at the end of the scroll scrub and carries
 * visual continuity into the handoff section. Renders inside both:
 *  1. <HomepageHero>'s sticky wrapper, absolutely positioned, animated in
 *     during 90-100% scroll
 *  2. <HomepageHandoffSection>'s right column, in its final docked position
 *
 * The component itself is presentational — orchestration happens in the
 * parents. Forward the ref so GSAP can drive it.
 */
export const HeroAccountsPanel = React.forwardRef<HTMLDivElement, {
  className?: string;
  /** Hidden by default (opacity-0) when mounted in the sticky hero wrapper;
   *  shown by default when mounted in the docked handoff position. */
  initiallyHidden?: boolean;
}>(function HeroAccountsPanel({ className, initiallyHidden }, ref) {
  return (
    <div
      ref={ref}
      className={cn(
        "w-full max-w-[400px] rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--card)] shadow-[var(--shadow-deep)]",
        initiallyHidden && "opacity-0",
        className
      )}
      style={{ fontFeatureSettings: '"tnum"' }}
    >
      <div className="flex items-center gap-3 border-b border-[var(--border)] px-5 py-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-[var(--radius-xs)] bg-[var(--primary)] text-[var(--primary-foreground)]">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M2 8l3.5 3.5L14 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div className="flex-1">
          <p className="text-body-strong font-[480] text-[var(--foreground)] leading-none">
            {heroAccountsPanel.workspaceLabel}
          </p>
          <p className="mt-1 text-caption text-[var(--text-tertiary)]">
            {heroAccountsPanel.workspaceSubLabel}
          </p>
        </div>
      </div>

      <ul className="divide-y divide-[var(--border)]">
        {heroAccountsPanel.rows.map((row) => (
          <li key={row.label} className="flex items-center justify-between px-5 py-3.5">
            <div className="min-w-0 flex-1">
              <p className="truncate text-body-md text-[var(--foreground)]">
                {row.label}
              </p>
              <p className="mt-0.5 truncate text-body-sm text-[var(--text-tertiary)]">
                {row.detail}
              </p>
            </div>
            <p className="ml-4 shrink-0 text-body-sm text-[var(--text-tertiary)] tabular-nums">
              {row.metric}
            </p>
          </li>
        ))}
      </ul>

      <Link
        href={heroAccountsPanel.cta.href}
        className="flex items-center gap-2 border-t border-[var(--border)] px-5 py-4 text-body-md font-[480] text-[var(--text-tertiary)] hover:text-white focus-visible:outline-2 focus-visible:outline-[var(--focus)]"
      >
        <span
          aria-hidden="true"
          className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-[var(--text-tertiary)] text-caption"
        >
          +
        </span>
        {heroAccountsPanel.cta.label}
      </Link>
    </div>
  );
});
