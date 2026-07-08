"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import dynamic from "next/dynamic";

import {
  FramedDashboard,
  MockupForTab,
  mockupTitleForTab,
} from "@/components/sections/mockups";
import { track } from "@/lib/analytics";
import { heroHandoff, VH_PER_TAB } from "@/content/homepage-hero";

// Desktop-only, non-reduced-motion owner of ALL GSAP. Loaded via next/dynamic
// with ssr:false so GSAP never enters the `/` eager client chunk; mobile and
// reduced-motion sessions never download it (HERO-04 LHCI lever).
const HeroCinematicController = dynamic(
  () =>
    import("./HeroCinematicController").then((m) => m.HeroCinematicController),
  { ssr: false }
);

/**
 * The homepage hero pair's ONLY eager client code (hero RSC split,
 * 2026-07-08). HomepageHero and HomepageHandoffSection are Server Components;
 * this leaf attaches behavior to their markup through `data-hero-*` /
 * `data-handoff-*` markers, the same parent-attach pattern as HeaderState.
 *
 * Mobile and reduced-motion sessions: the media-query gate stays false, this
 * component renders null and does nothing beyond two matchMedia listeners —
 * the static fail-open trees are already fully server-rendered.
 *
 * Desktop, motion-safe sessions get three things:
 *
 *   1. EXACTLY ONE HeroCinematicController (2026-07-02 mechanics fix),
 *      lazy-loaded, handed the hero DOM nodes and the handoff wiring. The
 *      controller is untouched by the RSC split and still owns the sacred
 *      ordering internally: hero pin FIRST, handoff trigger SECOND,
 *      ScrollTrigger.refresh() LAST.
 *   2. Tab UX for the handoff tablist (click + arrow keys). Active-tab state
 *      lives in the DOM: `data-active-tab` on the cinematic section,
 *      aria-selected/tabIndex on the tab buttons (pill styling is
 *      `aria-selected:` CSS), `hidden` on the tabpanels.
 *   3. The active tab's mockup, portaled into [data-handoff-mockup-slot] with
 *      a keyed re-mount per tab so each mockup's entrance animations replay on
 *      every switch, exactly like the pre-split client tree.
 *
 * Resize/motion-preference flips are live, mirroring the old wrapper's state:
 *   - desktop → mobile/reduced: the controller unmounts (its cleanup kills all
 *     triggers, reverting the pin spacer) and the GSAP-scrubbed inline styles
 *     are reset so the static trees render untouched.
 *   - mobile → desktop: the <video> has been in the DOM since load but matched
 *     zero bounded sources at phone width, and browsers do not re-run source
 *     selection on resize — so we call video.load() before mounting the
 *     controller, letting `loadedmetadata` fire and the pin wire up.
 */

type CinematicNodes = {
  section: HTMLElement | null;
  sticky: HTMLDivElement | null;
  video: HTMLVideoElement | null;
  startFrame: HTMLDivElement | null;
  framedDash: HTMLDivElement | null;
  overlay: HTMLDivElement | null;
  handoffSection: HTMLElement | null;
  mockupSlot: HTMLElement | null;
};

function queryCinematicNodes(): CinematicNodes {
  const q = <T extends HTMLElement>(sel: string) =>
    document.querySelector<T>(sel);
  return {
    section: q("[data-hero-section]"),
    sticky: q<HTMLDivElement>("[data-hero-sticky]"),
    video: q<HTMLVideoElement>("[data-hero-video]"),
    startFrame: q<HTMLDivElement>("[data-hero-start-frame]"),
    framedDash: q<HTMLDivElement>("[data-hero-framed-dashboard]"),
    overlay: q<HTMLDivElement>("[data-hero-overlay]"),
    handoffSection: q('[data-handoff-section="cinematic"]'),
    mockupSlot: q("[data-handoff-mockup-slot]"),
  };
}

/**
 * Clear every inline style the GSAP scrub may have written, so a
 * desktop → mobile/reduced flip mid-cinematic hands the static trees clean
 * markup (the old wrapper got this for free from React re-mounting).
 */
function resetCinematicInlineStyles(nodes: CinematicNodes) {
  if (nodes.overlay) {
    nodes.overlay.style.opacity = "";
    nodes.overlay.style.transform = "";
  }
  // Server markup ships these two at opacity 0; restore that, not "".
  if (nodes.video) nodes.video.style.opacity = "0";
  if (nodes.handoffSection) nodes.handoffSection.style.opacity = "0";
  // These fall back to their class-driven values ("" = remove inline).
  if (nodes.startFrame) nodes.startFrame.style.opacity = "";
  if (nodes.framedDash) nodes.framedDash.style.opacity = "";
}

/** Smooth-scroll to ~30% into a tab's scroll slice so the active tab settles
 *  immediately rather than at the boundary between two tabs. */
function scrollToTab(section: HTMLElement, idx: number) {
  const sectionTop = section.getBoundingClientRect().top + window.scrollY;
  const perTabPx = window.innerHeight * VH_PER_TAB;
  const targetScrollY = Math.round(sectionTop + (idx + 0.3) * perTabPx);
  const prefersReduced = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  window.scrollTo({
    top: targetScrollY,
    behavior: prefersReduced ? "instant" : "smooth",
  });
}

export function HeroCinematicMount() {
  const [enabled, setEnabled] = React.useState(false);
  const [nodes, setNodes] = React.useState<CinematicNodes | null>(null);
  const [activeIdx, setActiveIdx] = React.useState(0);

  // Mirror ref so the controller's onActiveTab callback (called on every
  // ScrollTrigger tick) compares against the latest value without re-creating
  // anything — same dedupe the old wrapper kept in activeIdRef.
  const activeIdxRef = React.useRef(0);
  const wasEnabledRef = React.useRef(false);
  // Mirror of `nodes` so the disable path can reset inline styles from the
  // effect body (state updaters must stay pure — StrictMode double-invokes
  // them).
  const nodesRef = React.useRef<CinematicNodes | null>(null);

  // Cinematic runs on desktop, non-reduced-motion only, tracked live so a
  // resize or a motion-preference change flips the whole apparatus on/off
  // just like the old wrapper's isMobile / prefersReducedMotion state.
  React.useEffect(() => {
    const mqMobile = window.matchMedia("(max-width: 767px)");
    const mqReduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setEnabled(!mqMobile.matches && !mqReduced.matches);
    update();
    mqMobile.addEventListener("change", update);
    mqReduced.addEventListener("change", update);
    return () => {
      mqMobile.removeEventListener("change", update);
      mqReduced.removeEventListener("change", update);
    };
  }, []);

  // Gather the server-rendered DOM nodes when the gate opens; clean the GSAP
  // inline styles when it closes. The controller only renders once `nodes` is
  // set, so its own effect always finds populated refs.
  React.useEffect(() => {
    if (!enabled) {
      if (nodesRef.current && wasEnabledRef.current) {
        resetCinematicInlineStyles(nodesRef.current);
      }
      nodesRef.current = null;
      setNodes(null);
      return;
    }
    wasEnabledRef.current = true;
    const found = queryCinematicNodes();
    // Mobile → desktop resize: source selection ran at phone width and matched
    // nothing; re-run it so loadedmetadata can fire and the controller can
    // wire the pin. NETWORK_NO_SOURCE (3) never occurs on a first desktop
    // load, so this is inert there.
    if (
      found.video &&
      found.video.networkState === HTMLMediaElement.NETWORK_NO_SOURCE
    ) {
      found.video.load();
    }
    nodesRef.current = found;
    setNodes(found);
  }, [enabled]);

  // Active-tab writes are plain DOM: attribute on the section (styling +
  // scroll-probe hook), aria-selected/tabIndex on the tabs, hidden on the
  // panels, plus React state for the portaled mockup's keyed re-mount.
  const applyActiveTab = React.useCallback((idx: number) => {
    const tab = heroHandoff.tabs[idx];
    if (!tab || idx === activeIdxRef.current) return;
    activeIdxRef.current = idx;
    setActiveIdx(idx);
    const section = document.querySelector<HTMLElement>(
      '[data-handoff-section="cinematic"]'
    );
    if (!section) return;
    section.setAttribute("data-active-tab", tab.id);
    section
      .querySelectorAll<HTMLElement>('[role="tab"]')
      .forEach((btn, i) => {
        btn.setAttribute("aria-selected", String(i === idx));
        btn.tabIndex = i === idx ? 0 : -1;
      });
    section
      .querySelectorAll<HTMLElement>('[role="tabpanel"]')
      .forEach((panel, i) => {
        panel.hidden = i !== idx;
      });
  }, []);

  // Tab UX: delegated click + arrow-key handling on the tablist. Desktop-only
  // by construction (the tablist lives in the CSS-hidden cinematic tree
  // otherwise, and this effect is gated on `enabled`).
  React.useEffect(() => {
    if (!enabled || !nodes?.handoffSection) return;
    const section = nodes.handoffSection;
    const tablist = section.querySelector<HTMLElement>('[role="tablist"]');
    if (!tablist) return;
    const tabButtons = Array.from(
      tablist.querySelectorAll<HTMLElement>('[role="tab"]')
    );

    const activate = (idx: number, focus = false) => {
      const tab = heroHandoff.tabs[idx];
      if (!tab) return;
      if (idx !== activeIdxRef.current) {
        applyActiveTab(idx);
        track({
          event: "accordion_toggle",
          section: "homepage_platform_tabs",
          item: tab.label,
        });
      }
      scrollToTab(section, idx);
      if (focus) tabButtons[idx]?.focus();
    };

    const onClick = (e: MouseEvent) => {
      const target = e.target instanceof Element ? e.target : null;
      const btn = target?.closest<HTMLElement>('[role="tab"]');
      if (!btn || !tablist.contains(btn)) return;
      activate(tabButtons.indexOf(btn));
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
      const target = e.target instanceof Element ? e.target : null;
      if (!target?.closest('[role="tab"]')) return;
      e.preventDefault();
      const count = heroHandoff.tabs.length;
      const current = activeIdxRef.current;
      const next =
        e.key === "ArrowRight"
          ? (current + 1) % count
          : (current - 1 + count) % count;
      activate(next, true);
    };

    tablist.addEventListener("click", onClick);
    tablist.addEventListener("keydown", onKeyDown);
    return () => {
      tablist.removeEventListener("click", onClick);
      tablist.removeEventListener("keydown", onKeyDown);
    };
  }, [enabled, nodes, applyActiveTab]);

  if (!enabled || !nodes) return null;

  const activeTab = heroHandoff.tabs[activeIdx] ?? heroHandoff.tabs[0];

  return (
    <>
      <HeroCinematicController
        heroRefs={{
          section: { current: nodes.section },
          sticky: { current: nodes.sticky },
          video: { current: nodes.video },
          startFrame: { current: nodes.startFrame },
          framedDash: { current: nodes.framedDash },
          overlay: { current: nodes.overlay },
        }}
        handoff={{
          sectionRef: { current: nodes.handoffSection },
          tabCount: heroHandoff.tabs.length,
          vhPerTab: VH_PER_TAB,
          onActiveTab: applyActiveTab,
        }}
      />
      {nodes.mockupSlot
        ? createPortal(
            <FramedDashboard title={mockupTitleForTab(activeTab.id)}>
              {/* key={id} forces a clean re-mount, so the chrome title and
                  inner content always change in sync and each mockup's
                  entrance animations replay on every switch. */}
              <MockupForTab key={activeTab.id} id={activeTab.id} />
            </FramedDashboard>,
            nodes.mockupSlot
          )
        : null}
    </>
  );
}
