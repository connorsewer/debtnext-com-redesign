"use client";

import * as React from "react";
import Link from "next/link";

import {
  FramedDashboard,
  MockupForTab,
  mockupTitleForTab,
} from "@/components/sections/mockups";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import { heroHandoff, type PlatformTab } from "@/content/homepage-hero";

/**
 * Per-tab vertical scroll allocation (in viewport heights). Tightened from 0.75
 * to 0.58 (2026-07-02) so 4 tabs step through in ~2.3vh of pinned scroll instead
 * of 3vh — the band no longer feels slack while the active tab still settles for
 * long enough to read.
 */
export const VH_PER_TAB = 0.58;

type HomepageHandoffSectionProps = {
  sectionRef: React.RefObject<HTMLElement | null>;
  activeId: PlatformTab["id"];
  setActiveId: (id: PlatformTab["id"]) => void;
  /** True on desktop + non-reduced-motion (the pinned cinematic runs). */
  cinematicEnabled: boolean;
  /** True on ≤768px viewports or reduced motion (render the static stack). */
  staticStack: boolean;
};

/**
 * The section that catches the dashboard finale at the end of the hero pin.
 *
 * Structurally: a tall section with a sticky 100vh inner. The inner pins at
 * viewport top while the user scrolls through the 4 tabs — each tab gets
 * ~VH_PER_TAB of scroll, so the active tab updates automatically as the user
 * keeps scrolling past the hero. The scroll-to-tab math and the tab-progression
 * ScrollTrigger both read VH_PER_TAB, so they stay in lockstep. The GSAP wiring
 * lives in HeroCinematicController, mounted ONCE by the shared HomepageHeroHandoff
 * wrapper (not here).
 *
 * Desktop composition (2026-07-02 density rework): heading, dashboard frame, and
 * tabs are stacked as ONE centered unit that fills the viewport with intent —
 * heading directly above the frame, tabs + body + link directly beneath it — so
 * there are no dead vertical gaps between three loosely-anchored strata. The
 * frame grows to max-w-6xl since it is the hero artifact of the section.
 *
 * Mobile / reduced-motion render the honest static stacked layout (the fail-open
 * path that passed the audit) unchanged.
 */
export function HomepageHandoffSection({
  sectionRef,
  activeId,
  setActiveId,
  cinematicEnabled,
  staticStack,
}: HomepageHandoffSectionProps) {
  const tabCount = heroHandoff.tabs.length;
  const active =
    heroHandoff.tabs.find((t) => t.id === activeId) ?? heroHandoff.tabs[0];

  /** Smooth-scroll to the middle of a tab's scroll slice when clicked. */
  function scrollToTab(tabId: PlatformTab["id"]) {
    const section = sectionRef.current;
    if (!section) return;
    const idx = heroHandoff.tabs.findIndex((t) => t.id === tabId);
    if (idx < 0) return;
    const sectionTop = section.getBoundingClientRect().top + window.scrollY;
    const perTabPx = window.innerHeight * VH_PER_TAB;
    // Aim for ~30% into the tab's slice so the active tab settles immediately
    // rather than at the boundary between two tabs.
    const targetScrollY = Math.round(sectionTop + (idx + 0.3) * perTabPx);
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    window.scrollTo({
      top: targetScrollY,
      behavior: prefersReduced ? "instant" : "smooth",
    });
  }

  const handleTabActivate = (tab: PlatformTab) => {
    if (tab.id !== activeId) {
      setActiveId(tab.id);
      track({
        event: "accordion_toggle",
        section: "homepage_platform_tabs",
        item: tab.label,
      });
    }
    scrollToTab(tab.id);
  };

  // Reduced-motion desktop takes the same static stacked layout as mobile: the
  // tall scroll-scrub region only makes sense when the GSAP cinematic drives it,
  // so without motion we render the honest, fully-visible fallback.
  if (staticStack) {
    return (
      <section
        ref={sectionRef}
        data-handoff-section
        className="container-section bg-[var(--background)] py-[var(--space-section-mobile)]"
      >
        <div className="mx-auto max-w-[var(--container-page)] px-4">
          <p className="text-caption font-[480] uppercase tracking-wider text-[var(--accent-text-dark)]">
            {heroHandoff.eyebrow}
          </p>
          <h2 className="mt-2 text-h2 text-[var(--foreground)]">
            {heroHandoff.heading}
          </h2>

          <div className="mt-10 flex flex-col gap-16">
            {heroHandoff.tabs.map((tab) => (
              <div key={tab.id} className="flex flex-col gap-4">
                <h3 className="text-h3 text-[var(--foreground)]">
                  {tab.label}
                </h3>
                <p className="text-body-md text-[var(--text-tertiary)]">
                  {tab.body}
                </p>
                <FramedDashboard title={mockupTitleForTab(tab.id)}>
                  <MockupForTab id={tab.id} />
                </FramedDashboard>
              </div>
            ))}
          </div>

          <div className="mt-12">
            <Link
              href={heroHandoff.link.href}
              className="min-h-touch inline-flex items-center gap-1 text-body-strong text-[var(--accent-text-dark)]"
            >
              {heroHandoff.link.label} <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      data-handoff-section
      // Start invisible ONLY when the cinematic will run (GSAP fades this in as
      // the hero hands off). Fail open: full opacity when the cinematic is off.
      style={cinematicEnabled ? { opacity: 0 } : undefined}
      // Height = pin length. VH_PER_TAB (0.58) * 4 tabs of scroll drive the tab
      // progression; the extra 100vh absorbs the negative top margin that pulls
      // this section up onto the hero's pin release. 0.58*4 + 1 = 3.32.
      className="relative -mt-[100vh] h-[332vh] bg-[var(--background)]"
    >
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <div className="mx-auto flex w-full max-w-[var(--container-page)] flex-col items-center px-4 pt-[72px] md:px-6 lg:px-8">
          {/* Eyebrow + heading, directly above the frame. */}
          <div className="w-full max-w-4xl text-center">
            <p className="text-caption font-[480] uppercase tracking-wider text-[var(--text-tertiary)]">
              {heroHandoff.eyebrow}
            </p>
            <h2 className="mt-2 text-h3 font-[480] leading-tight text-[var(--foreground)]">
              {heroHandoff.heading}
            </h2>
          </div>

          {/* Framed dashboard. Center-anchored so it never moves as the inner
              content crossfades between tabs of differing heights, and so it
              shares the hero finale's horizontal center at the seam. */}
          <div
            data-handoff-mockup-frame
            className="mt-6 w-full md:mt-8"
          >
            <div className="mx-auto w-full max-w-6xl">
              <FramedDashboard title={mockupTitleForTab(activeId)}>
                {/* key={activeId} forces a clean re-mount, so the chrome title
                    and inner content always change in sync. Each mockup's own
                    internal motion-entrance animations replay on every mount. */}
                <MockupForTab key={activeId} id={activeId} />
              </FramedDashboard>
            </div>
          </div>

          {/* Tabs + body + link, directly beneath the frame. */}
          <div className="mt-6 w-full text-center md:mt-8">
            <div
              role="tablist"
              aria-label="dPlat capability surfaces"
              aria-orientation="horizontal"
              className="mx-auto flex flex-wrap justify-center gap-2"
            >
              {heroHandoff.tabs.map((tab, idx) => {
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
                    onClick={() => handleTabActivate(tab)}
                    onKeyDown={(e) => {
                      if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
                      e.preventDefault();
                      const current = heroHandoff.tabs.findIndex(
                        (t) => t.id === activeId
                      );
                      const next =
                        e.key === "ArrowRight"
                          ? (current + 1) % tabCount
                          : (current - 1 + tabCount) % tabCount;
                      const target = heroHandoff.tabs[next];
                      handleTabActivate(target);
                      document
                        .getElementById(`platform-tab-${target.id}`)
                        ?.focus();
                    }}
                    className={cn(
                      "relative inline-flex min-h-[44px] items-center overflow-hidden rounded-[var(--radius-xl)] border px-4 py-2 text-body-sm font-[480] transition-colors duration-[var(--duration-instant)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus)]",
                      isActive
                        ? "border-[var(--primary)] bg-[var(--primary)]/15 text-[var(--foreground)]"
                        : "border-[var(--border)] bg-transparent text-[var(--text-tertiary)] hover:border-[var(--text-tertiary)] hover:text-white"
                    )}
                  >
                    {tab.label}
                    {/* Per-tab progress affordance: a thin underline on the
                        active pill so users read the scroll as stepping through
                        an ordered sequence rather than a jump. Purely decorative;
                        the aria-selected state carries the real meaning. */}
                    {isActive && (
                      <span
                        aria-hidden="true"
                        className="pointer-events-none absolute bottom-0 left-0 h-[2px] bg-[var(--primary)]"
                        style={{ width: `${((idx + 1) / tabCount) * 100}%` }}
                      />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="mx-auto mt-4 max-w-2xl">
              <p
                key={activeId}
                id={`platform-panel-${active.id}`}
                role="tabpanel"
                aria-labelledby={`platform-tab-${active.id}`}
                className="text-body-sm text-[var(--text-tertiary)]"
              >
                {active.body}
              </p>
            </div>

            <div className="mt-4">
              <Link
                href={heroHandoff.link.href}
                className="min-h-touch inline-flex items-center gap-1 text-body-strong font-[480] text-[var(--foreground)] underline-offset-4 hover:text-white hover:underline hover:decoration-[var(--primary)] focus-visible:outline-2 focus-visible:outline-[var(--focus)]"
              >
                {heroHandoff.link.label} <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
