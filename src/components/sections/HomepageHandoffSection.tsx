"use client";

import * as React from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";

import { SectionContainer } from "@/components/sections/SectionContainer";
import { MockupForTab } from "@/components/sections/mockups";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import { heroHandoff, type PlatformTab } from "@/content/homepage-hero";

/**
 * The "section 2" that catches the dashboard at the end of the hero scrub.
 *
 * Left column: 4 interactive tabs. Click or arrow-key navigates; the
 * active tab determines the right-column mockup, body copy, and the
 * caption pill on the mockup's window chrome.
 *
 * Right column: a hand-built CSS/SVG mockup per tab (no shared dashboard
 * PNG). Each mockup is its own focused widget — placement allocations,
 * vendor scorecard, issues queue, reporting trend — wrapped in the
 * shared FramedDashboard bezel for visual consistency.
 *
 * Transition between mockups cross-fades with a small vertical lift so
 * the swap reads as deliberate, not as content snapping in/out.
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

        {/* Right column: tab-specific mockup. AnimatePresence remounts the
            active mockup on each tab switch so its internal entrance
            animations (bars growing, sparklines drawing, etc.) replay
            every time the user activates a tab. */}
        <div className="relative" data-handoff-mockup-frame>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={activeId}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: [0.2, 0.7, 0.2, 1] }}
              className="w-full"
            >
              <MockupForTab id={activeId} />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </SectionContainer>
  );
}
