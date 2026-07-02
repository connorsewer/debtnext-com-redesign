"use client";

import * as React from "react";
import dynamic from "next/dynamic";

import { HomepageHero, type HeroRefs } from "./HomepageHero";
import { HomepageHandoffSection, VH_PER_TAB } from "./HomepageHandoffSection";
import { heroHandoff, type PlatformTab } from "@/content/homepage-hero";

// Desktop-only, non-reduced-motion owner of ALL GSAP. Loaded via next/dynamic
// with ssr:false so GSAP never enters the `/` eager client chunk; mobile and
// reduced-motion sessions never download it (HERO-04 LHCI lever).
const HeroCinematicController = dynamic(
  () =>
    import("./HeroCinematicController").then((m) => m.HeroCinematicController),
  { ssr: false }
);

/**
 * Shared client wrapper for the homepage hero + platform-handoff pair.
 *
 * Why this exists (2026-07-02 mechanics fix): the hero and the handoff each used
 * to mount their OWN HeroCinematicController instance, so the creation/refresh
 * order between the hero pin and the handoff tab-progression trigger was unowned.
 * The handoff trigger frequently cached a stale start (computed before the hero
 * pin's ~260vh spacer shifted the document) and jumped straight to the last tab.
 *
 * This wrapper owns the single source of truth for isMobile / reduced-motion,
 * holds the hero refs and the handoff section ref + active-tab state, and mounts
 * EXACTLY ONE controller with both `heroRefs` and `handoff`. The controller then
 * creates the hero pin first, the handoff trigger second, and refreshes last —
 * in one deterministic sequence.
 */
export function HomepageHeroHandoff() {
  const heroSectionRef = React.useRef<HTMLElement | null>(null);
  const stickyRef = React.useRef<HTMLDivElement | null>(null);
  const videoRef = React.useRef<HTMLVideoElement | null>(null);
  const startFrameRef = React.useRef<HTMLDivElement | null>(null);
  const framedDashRef = React.useRef<HTMLDivElement | null>(null);
  const overlayRef = React.useRef<HTMLDivElement | null>(null);
  const handoffSectionRef = React.useRef<HTMLElement | null>(null);

  const heroRefs: HeroRefs = React.useMemo(
    () => ({
      section: heroSectionRef,
      sticky: stickyRef,
      video: videoRef,
      startFrame: startFrameRef,
      framedDash: framedDashRef,
      overlay: overlayRef,
    }),
    []
  );

  const [isMobile, setIsMobile] = React.useState(false);
  React.useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const handler = () => setIsMobile(mq.matches);
    handler();
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const [prefersReducedMotion, setPrefersReducedMotion] = React.useState(false);
  React.useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = () => setPrefersReducedMotion(mq.matches);
    handler();
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const [activeId, setActiveId] = React.useState<PlatformTab["id"]>(
    heroHandoff.tabs[0].id
  );

  // Mirror ref so the controller's onActiveTab callback compares against the
  // latest value without re-creating the ScrollTrigger on every state change.
  const activeIdRef = React.useRef(activeId);
  React.useEffect(() => {
    activeIdRef.current = activeId;
  }, [activeId]);

  const onActiveTab = React.useCallback((idx: number) => {
    const id = heroHandoff.tabs[idx]?.id;
    if (id && id !== activeIdRef.current) {
      activeIdRef.current = id;
      setActiveId(id);
    }
  }, []);

  // Cinematic runs on desktop, non-reduced-motion only. When this gate is false
  // (mobile / reduced motion / SSR) both sections render their static fail-open
  // trees and the controller never mounts (so GSAP is never downloaded).
  const cinematicEnabled = !isMobile && !prefersReducedMotion;
  const staticStack = isMobile || prefersReducedMotion;

  return (
    <>
      {cinematicEnabled && (
        <HeroCinematicController
          heroRefs={heroRefs}
          handoff={{
            sectionRef: handoffSectionRef,
            tabCount: heroHandoff.tabs.length,
            vhPerTab: VH_PER_TAB,
            onActiveTab,
          }}
        />
      )}

      <HomepageHero refs={heroRefs} isMobile={isMobile} />

      <HomepageHandoffSection
        sectionRef={handoffSectionRef}
        activeId={activeId}
        setActiveId={setActiveId}
        cinematicEnabled={cinematicEnabled}
        staticStack={staticStack}
      />
    </>
  );
}
