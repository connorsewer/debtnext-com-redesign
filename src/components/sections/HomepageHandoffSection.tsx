import Link from "next/link";

import { HeroAccountsPanel } from "@/components/sections/HeroAccountsPanel";
import { SectionContainer } from "@/components/sections/SectionContainer";
import { cn } from "@/lib/utils";
import { heroHandoff } from "@/content/homepage-hero";

/**
 * The "section 2" that catches the accounts panel after the hero scrub.
 * Left column: eyebrow / heading / tab list (visual only) / "See how it
 * works" link. Right column: the docked HeroAccountsPanel in its final
 * position.
 *
 * The panel here is a separate instance from the one inside HomepageHero
 * (different mounted DOM nodes). The Mercury pattern is to keep them
 * visually continuous, not literally the same element — the swap is
 * orchestrated by HomepageHero's scroll progress fading its own panel in
 * just before this section comes into view.
 */
export function HomepageHandoffSection() {
  return (
    <SectionContainer
      surface="dark"
      containerSize="page"
      className="border-b border-[var(--border)]"
    >
      <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
        <div>
          <p className="text-caption font-[480] uppercase tracking-wider text-[var(--text-tertiary)]">
            {heroHandoff.eyebrow}
          </p>
          <h2 className="mt-3 text-h1 font-[480] text-[var(--foreground)]">
            {heroHandoff.heading}
          </h2>

          <ul
            role="tablist"
            aria-label="dPlat capability surfaces"
            className="mt-8 flex flex-col divide-y divide-[var(--border)] border-y border-[var(--border)]"
          >
            {heroHandoff.tabs.map((tab) => (
              <li
                key={tab.label}
                role="tab"
                aria-selected={tab.active}
                className={cn(
                  "flex items-center gap-3 py-4 text-body-lg font-[480]",
                  tab.active
                    ? "text-[var(--foreground)]"
                    : "text-[var(--text-tertiary)]"
                )}
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    "inline-block h-1 w-3 rounded-[var(--radius-xs)]",
                    tab.active ? "bg-[var(--primary)]" : "bg-transparent"
                  )}
                />
                {tab.label}
              </li>
            ))}
          </ul>

          <div className="mt-8">
            <Link
              href={heroHandoff.link.href}
              className="inline-flex items-center gap-1 text-body-strong font-[480] text-[var(--foreground)] underline-offset-4 hover:text-white hover:underline hover:decoration-[var(--primary)] focus-visible:outline-2 focus-visible:outline-[var(--focus)]"
            >
              {heroHandoff.link.label} <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>

        {/* Match the hero's panel width so the swap is visually continuous
            at the moment the sticky un-pins. The hero panel is max-w-[400px]
            and right-aligned via the sticky wrapper's flex justify-end. */}
        <div className="flex justify-end lg:justify-self-end">
          <div className="w-full max-w-[400px]">
            <HeroAccountsPanel />
          </div>
        </div>
      </div>
    </SectionContainer>
  );
}
