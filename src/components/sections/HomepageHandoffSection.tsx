"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";

import { SectionContainer } from "@/components/sections/SectionContainer";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import {
  heroCinematic,
  heroHandoff,
  type PlatformTab,
} from "@/content/homepage-hero";

/**
 * The "section 2" that catches the dashboard at the end of the hero scrub.
 *
 * Left column: 4 interactive tabs — Placement and routing / Vendor
 * performance / Issues and disputes / Reporting and compliance. Each tab,
 * when activated, swaps the right-column copy and the small caption that
 * sits over the dashboard.
 *
 * Right column: the dashboard image at the same size and position the
 * hero's end-frame settles into when it finishes its shrink-and-slide
 * animation. The user shouldn't perceive a swap at the section boundary.
 */
export function HomepageHandoffSection() {
  const [activeId, setActiveId] = React.useState<PlatformTab["id"]>(
    heroHandoff.tabs[0].id
  );
  const active =
    heroHandoff.tabs.find((t) => t.id === activeId) ?? heroHandoff.tabs[0];

  return (
    <SectionContainer
      surface="dark"
      containerSize="page"
      className="border-b border-[var(--border)]"
    >
      <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
        {/* Left column: eyebrow / heading / tabs / link */}
        <div>
          <p className="text-caption font-[480] uppercase tracking-wider text-[var(--text-tertiary)]">
            {heroHandoff.eyebrow}
          </p>
          <h2 className="mt-3 text-h1 font-[480] text-[var(--foreground)]">
            {heroHandoff.heading}
          </h2>

          <div
            role="tablist"
            aria-label="dPlat capability surfaces"
            aria-orientation="vertical"
            className="mt-8 flex flex-col border-y border-[var(--border)]"
          >
            {heroHandoff.tabs.map((tab) => {
              const isActive = tab.id === activeId;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  id={`platform-tab-${tab.id}`}
                  aria-selected={isActive}
                  aria-controls={`platform-panel-${tab.id}`}
                  tabIndex={isActive ? 0 : -1}
                  onClick={() => {
                    if (tab.id !== activeId) {
                      setActiveId(tab.id);
                      track({
                        event: "accordion_toggle",
                        section: "homepage_platform_tabs",
                        item: tab.label,
                      });
                    }
                  }}
                  onKeyDown={(e) => {
                    // Arrow-key navigation per WAI-ARIA tablist guidance.
                    if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
                    e.preventDefault();
                    const idx = heroHandoff.tabs.findIndex(
                      (t) => t.id === activeId
                    );
                    const next =
                      e.key === "ArrowDown"
                        ? (idx + 1) % heroHandoff.tabs.length
                        : (idx - 1 + heroHandoff.tabs.length) %
                          heroHandoff.tabs.length;
                    const target = heroHandoff.tabs[next];
                    setActiveId(target.id);
                    document
                      .getElementById(`platform-tab-${target.id}`)
                      ?.focus();
                  }}
                  className={cn(
                    "group/tab flex items-center gap-3 border-b border-[var(--border)] py-4 text-left text-body-lg font-[480] transition-colors duration-[var(--duration-instant)] last:border-b-0 focus-visible:outline-2 focus-visible:outline-[var(--focus)]",
                    isActive
                      ? "text-[var(--foreground)]"
                      : "text-[var(--text-tertiary)] hover:text-white"
                  )}
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      "inline-block h-1 w-3 shrink-0 rounded-[var(--radius-xs)] transition-colors duration-[var(--duration-instant)]",
                      isActive ? "bg-[var(--primary)]" : "bg-transparent"
                    )}
                  />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Active tab body — short description, swaps with selection */}
          <div
            id={`platform-panel-${active.id}`}
            role="tabpanel"
            aria-labelledby={`platform-tab-${active.id}`}
            className="mt-6 max-w-xl text-body-md text-[var(--text-tertiary)]"
          >
            {active.body}
          </div>

          <div className="mt-8">
            <Link
              href={heroHandoff.link.href}
              className="inline-flex items-center gap-1 text-body-strong font-[480] text-[var(--foreground)] underline-offset-4 hover:text-white hover:underline hover:decoration-[var(--primary)] focus-visible:outline-2 focus-visible:outline-[var(--focus)]"
            >
              {heroHandoff.link.label} <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>

        {/* Right column: dashboard. Anchored to the position the hero's
            end-frame finishes its shrink animation at, so the un-pin
            transition reads as continuous rather than a swap. */}
        <div className="relative">
          <div className="overflow-hidden rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--card)] shadow-[var(--shadow-deep)]">
            <Image
              src={heroCinematic.media.endFrame}
              alt={`dPlat dashboard, ${active.label} view`}
              width={1536}
              height={1024}
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="h-auto w-full"
              priority={false}
            />
          </div>
          {/* Per-tab caption overlay — quietly labels what the user is
              looking at without redrawing the dashboard per tab. Real
              per-tab dashboard variants land in M4 content work. */}
          <div className="pointer-events-none absolute left-4 top-4 rounded-[var(--radius-xs)] bg-black/60 px-3 py-1.5 text-caption font-[480] uppercase tracking-wider text-white backdrop-blur-xl">
            {active.label}
          </div>
        </div>
      </div>
    </SectionContainer>
  );
}
