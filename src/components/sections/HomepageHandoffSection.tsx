"use client";

import * as React from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

import {
  FramedDashboard,
  MockupForTab,
  mockupTitleForTab,
} from "@/components/sections/mockups";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import { heroHandoff, type PlatformTab } from "@/content/homepage-hero";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/** Per-tab vertical scroll allocation (in viewport heights). */
const VH_PER_TAB = 0.75;

/**
 * The section that catches the framed dashboard at the end of the hero pin.
 *
 * Structurally: a 400vh-tall section with a sticky 100vh inner. The inner
 * pins at viewport top while the user scrolls through the 4 tabs — each
 * tab gets ~75vh of scroll, so the active tab updates automatically as
 * the user keeps scrolling past the hero. Click/keyboard interaction
 * smooth-scrolls to the matching scroll position (or instant-scrolls
 * under prefers-reduced-motion). Eyebrow + heading and tabs + body + link
 * are absolute-positioned above and below the centered dashboard. The
 * negative top margin pulls the section up by 100vh so its top aligns
 * with the hero's pin release — at that moment the dashboard is at the
 * exact same viewport-y (50vh) as the hero's framed dashboard.
 *
 * Initial opacity is 0; the hero's ScrollTrigger sets the opacity as it
 * approaches its pin release so Platform stays invisible during the
 * cinematic and transfers visibility cleanly at the seam.
 */
export function HomepageHandoffSection() {
  const sectionRef = React.useRef<HTMLElement | null>(null);
  const tabCount = heroHandoff.tabs.length;
  const [activeId, setActiveId] = React.useState<PlatformTab["id"]>(
    heroHandoff.tabs[0].id
  );
  const active =
    heroHandoff.tabs.find((t) => t.id === activeId) ?? heroHandoff.tabs[0];

  /** Scroll-driven tab progression. */
  useGSAP(
    () => {
      if (!sectionRef.current) return;
      const trigger = ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: () => `+=${window.innerHeight * VH_PER_TAB * tabCount}`,
        onUpdate: (self) => {
          const idx = Math.min(
            tabCount - 1,
            Math.floor(self.progress * tabCount)
          );
          const target = heroHandoff.tabs[idx];
          if (target && target.id !== activeIdRef.current) {
            activeIdRef.current = target.id;
            setActiveId(target.id);
          }
        },
      });
      return () => trigger.kill();
    },
    { scope: sectionRef }
  );

  // Mirror ref so the GSAP onUpdate closure can compare against the latest
  // value without re-creating the ScrollTrigger on every state change.
  const activeIdRef = React.useRef(activeId);
  React.useEffect(() => {
    activeIdRef.current = activeId;
  }, [activeId]);

  /** Smooth-scroll to the middle of a tab's scroll slice when clicked. */
  function scrollToTab(tabId: PlatformTab["id"]) {
    const section = sectionRef.current;
    if (!section) return;
    const idx = heroHandoff.tabs.findIndex((t) => t.id === tabId);
    if (idx < 0) return;
    const sectionTop = section.getBoundingClientRect().top + window.scrollY;
    const perTabPx = window.innerHeight * VH_PER_TAB;
    // Aim for ~30% into the tab's slice so the active tab settles
    // immediately rather than at the boundary between two tabs.
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

  return (
    <section
      ref={sectionRef}
      data-handoff-section
      style={{ opacity: 0 }}
      className="relative -mt-[100vh] h-[400vh] bg-[var(--background)]"
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        <div className="relative mx-auto h-full max-w-[var(--container-page)] px-4 md:px-6 lg:px-8">
          {/* Eyebrow + heading, anchored in the top portion of the viewport
              with enough offset to clear the fixed site header. */}
          <div className="absolute left-1/2 top-[88px] w-full max-w-4xl -translate-x-1/2 px-4 text-center md:top-[96px]">
            <p className="text-caption font-[480] uppercase tracking-wider text-[var(--text-tertiary)]">
              {heroHandoff.eyebrow}
            </p>
            <h2 className="mt-2 text-h3 font-[480] leading-tight text-[var(--foreground)]">
              {heroHandoff.heading}
            </h2>
          </div>

          {/* Framed dashboard pinned at viewport center. Matches the hero's
              framed dashboard position exactly (50% horizontal, 50% vertical
              via the centering transform). */}
          <div
            data-handoff-mockup-frame
            className="absolute left-1/2 top-1/2 w-full -translate-x-1/2 -translate-y-1/2 px-4 md:px-8 lg:px-12"
          >
            <div className="mx-auto w-full max-w-5xl">
              <FramedDashboard title={mockupTitleForTab(activeId)}>
                {/* key={activeId} forces a clean re-mount, so the chrome
                    title and inner content always change in sync. Each
                    mockup's own internal motion-entrance animations replay
                    on every mount. */}
                <MockupForTab key={activeId} id={activeId} />
              </FramedDashboard>
            </div>
          </div>

          {/* Tabs + body + link, anchored in the bottom portion of the viewport. */}
          <div className="absolute bottom-[3vh] left-1/2 w-full -translate-x-1/2 px-4 text-center md:bottom-[3.5vh]">
            <div
              role="tablist"
              aria-label="dPlat capability surfaces"
              aria-orientation="horizontal"
              className="mx-auto flex flex-wrap justify-center gap-2"
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
                    onClick={() => handleTabActivate(tab)}
                    onKeyDown={(e) => {
                      if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
                      e.preventDefault();
                      const idx = heroHandoff.tabs.findIndex(
                        (t) => t.id === activeId
                      );
                      const next =
                        e.key === "ArrowRight"
                          ? (idx + 1) % tabCount
                          : (idx - 1 + tabCount) % tabCount;
                      const target = heroHandoff.tabs[next];
                      handleTabActivate(target);
                      document
                        .getElementById(`platform-tab-${target.id}`)
                        ?.focus();
                    }}
                    className={cn(
                      "inline-flex min-h-[40px] items-center rounded-[var(--radius-xl)] border px-4 py-2 text-body-sm font-[480] transition-colors duration-[var(--duration-instant)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus)]",
                      isActive
                        ? "border-[var(--primary)] bg-[var(--primary)]/15 text-[var(--foreground)]"
                        : "border-[var(--border)] bg-transparent text-[var(--text-tertiary)] hover:border-[var(--text-tertiary)] hover:text-white"
                    )}
                  >
                    {tab.label}
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
                className="inline-flex items-center gap-1 text-body-strong font-[480] text-[var(--foreground)] underline-offset-4 hover:text-white hover:underline hover:decoration-[var(--primary)] focus-visible:outline-2 focus-visible:outline-[var(--focus)]"
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
