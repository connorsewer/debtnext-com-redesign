"use client";

import * as React from "react";

/**
 * HeroCinematicController — the single owner of GSAP on the homepage.
 *
 * GSAP, ScrollTrigger, and @gsap/react's useGSAP are loaded ONLY via dynamic
 * import() inside this module's effect, and this module is itself mounted only
 * via next/dynamic({ ssr: false }) behind the parents' `!isMobile &&
 * !prefersReducedMotion` gate. As a result GSAP never enters the `/` eager
 * client chunk: mobile and reduced-motion sessions never download it, which is
 * the HERO-04 LHCI lever (see docs/m5-phase-5-lhci-run.md "Recommended next
 * move", option 1).
 *
 * The component renders null. It owns no DOM; the parent sections own all refs
 * and markup (including the static start-frame + overlay fallback), so if the
 * dynamic import rejects this controller simply returns and the parents keep
 * rendering their static tree (fail-open).
 *
 * Architecture (locked, CONTEXT.md option b, driven imperatively):
 *   - a next/dynamic ssr:false desktop-only subcomponent that owns all GSAP,
 *   - wired imperatively via ScrollTrigger.create + explicit trigger.kill()
 *     cleanup, so we do not depend on the useGSAP hook's scope contract across
 *     the dynamic boundary. useGSAP is still imported and passed to
 *     plugin registration only because GSAP's React integration expects it
 *     registered; the actual wiring is the imperative effect below.
 *
 * Plugin registration is idempotent. Both sections mount their own controller
 * instance (hero with heroRefs, handoff with handoff wiring); the repeat
 * call from the second instance is a harmless no-op. It does not
 * double-register and does not race.
 *
 * The hero scrub math (pin, scrub, ease windows, crossfades) and the handoff
 * tab-progression math (VH_PER_TAB / tabCount / Math.floor) are lifted VERBATIM
 * from HomepageHero.tsx and HomepageHandoffSection.tsx. No numeric coefficient,
 * easing window, selector, or scroll length is changed.
 */

type HeroRefs = {
  section: React.RefObject<HTMLElement | null>;
  sticky: React.RefObject<HTMLDivElement | null>;
  video: React.RefObject<HTMLVideoElement | null>;
  startFrame: React.RefObject<HTMLDivElement | null>;
  framedDash: React.RefObject<HTMLDivElement | null>;
  overlay: React.RefObject<HTMLDivElement | null>;
};

type HandoffWiring = {
  sectionRef: React.RefObject<HTMLElement | null>;
  tabCount: number;
  vhPerTab: number;
  onActiveTab: (idx: number) => void;
};

type HeroCinematicControllerProps = {
  heroRefs?: HeroRefs;
  handoff?: HandoffWiring;
};

export function HeroCinematicController({
  heroRefs,
  handoff,
}: HeroCinematicControllerProps) {
  React.useEffect(() => {
    let cancelled = false;
    const triggers: Array<{ kill: () => void }> = [];
    let cleanupListener: (() => void) | undefined;

    (async () => {
      let gsapMod, scrollTriggerMod, gsapReactMod;
      try {
        // Dynamic, desktop-only: await import("gsap") (and its plugins) so the
        // GSAP runtime never enters the `/` eager client chunk.
        gsapMod = await import("gsap");
        scrollTriggerMod = await import("gsap/ScrollTrigger");
        gsapReactMod = await import("@gsap/react");
      } catch {
        // Fail-open: if any chunk fails to load, the parents keep their
        // static start-frame + overlay fallback. Never throw, never blank.
        return;
      }
      if (cancelled) return;

      const gsap = gsapMod.default;
      const { ScrollTrigger } = scrollTriggerMod;
      const { useGSAP } = gsapReactMod;
      gsap.registerPlugin(ScrollTrigger, useGSAP); // idempotent; safe per-instance

      // ---- Hero master ScrollTrigger (verbatim from HomepageHero.tsx) ----
      if (heroRefs) {
        const video = heroRefs.video.current;
        const section = heroRefs.section.current;
        const sticky = heroRefs.sticky.current;
        const overlay = heroRefs.overlay.current;
        const startFrame = heroRefs.startFrame.current;
        const framedDash = heroRefs.framedDash.current;

        if (video && section && sticky && overlay && startFrame && framedDash) {
          const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
          const ease = (a: number, b: number, p: number) =>
            clamp01((p - a) / (b - a));

          const wire = () => {
            // Re-check live: if we deferred wire via `loadedmetadata`, isMobile
            // or prefers-reduced-motion may have flipped between mount and the
            // event firing. Bail before creating a ScrollTrigger that would
            // inject a .pin-spacer wrapping the sticky div on a layout that no
            // longer wants the cinematic.
            if (window.matchMedia("(max-width: 767px)").matches) return;
            if (
              window.matchMedia("(prefers-reduced-motion: reduce)").matches
            )
              return;

            const duration = video.duration || 1;

            const heroTrigger = ScrollTrigger.create({
              trigger: section,
              pin: sticky,
              pinSpacing: true,
              start: "top top",
              end: () => `+=${window.innerHeight * 2.6}`,
              scrub: 0.5,
              onUpdate: (self) => {
                const p = self.progress;

                video.currentTime = duration * p;

                // Overlay fades out + lifts
                const overlayOut = ease(0, 0.12, p);
                overlay.style.opacity = String(1 - overlayOut);
                overlay.style.transform = `translateY(${-50 * overlayOut}px)`;

                // Video fades in immediately, then fades out during the
                // direct crossfade into the framed dashboard.
                const videoIn = ease(0.0, 0.03, p);
                const videoOut = ease(0.7, 0.88, p);
                video.style.opacity = String(videoIn * (1 - videoOut));

                // Cliffside (start-frame) fades out beneath the crossfade.
                const cliffOut = ease(0.78, 0.88, p);
                startFrame.style.opacity = String(1 - cliffOut);

                // Framed dashboard fades in to cover by p=0.88, holds at full
                // size for the rest of the cinematic, then crossfades OUT in
                // place at the very end so the Platform section's matching
                // framed dashboard (sticky-pinned at the exact same viewport
                // position) seamlessly takes over. The dashboard never moves;
                // only its opacity changes.
                const dashIn = ease(0.7, 0.88, p);
                const dashCrossfadeOut = ease(0.95, 1.0, p);
                framedDash.style.opacity = String(dashIn * (1 - dashCrossfadeOut));

                // Platform section: invisible during the cinematic, crossfades
                // in during the same 5% window the hero's dashboard fades out.
                // At p=1.0 the hero's dashboard is gone and Platform's
                // dashboard is fully visible at the exact same viewport-y.
                const handoffEl = document.querySelector(
                  "[data-handoff-section]"
                ) as HTMLElement | null;
                if (handoffEl) {
                  const platformIn = ease(0.95, 1.0, p);
                  handoffEl.style.opacity = String(platformIn);
                }
              },
            });
            triggers.push(heroTrigger);
          };

          if (video.readyState >= 1) {
            wire();
          } else {
            const onLoadedMetadata = () => wire();
            video.addEventListener("loadedmetadata", onLoadedMetadata, {
              once: true,
            });
            cleanupListener = () =>
              video.removeEventListener("loadedmetadata", onLoadedMetadata);
          }
        }
      }

      // ---- Handoff tab-progression ScrollTrigger (verbatim from
      //      HomepageHandoffSection.tsx) ----
      if (handoff) {
        const { sectionRef, tabCount, vhPerTab, onActiveTab } = handoff;
        if (sectionRef.current) {
          const handoffTrigger = ScrollTrigger.create({
            trigger: sectionRef.current,
            start: "top top",
            end: () => `+=${window.innerHeight * vhPerTab * tabCount}`,
            // Recompute start/end on every refresh — important because the
            // hero's GSAP pin spacer (added in HomepageHero) shifts this
            // section's document position AFTER this trigger is created.
            // Without this, the trigger caches a stale start and fires
            // mid-cinematic, dragging activeId straight to "reporting".
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const idx = Math.min(
                tabCount - 1,
                Math.floor(self.progress * tabCount)
              );
              onActiveTab(idx);
            },
          });
          triggers.push(handoffTrigger);
        }
      }

      // Refresh once after the relevant trigger(s) exist so the handoff trigger
      // snapshots positions after the hero pin-spacer is in place (matches the
      // belt-and-suspenders refresh in the original sections).
      ScrollTrigger.refresh();
    })();

    return () => {
      cancelled = true;
      cleanupListener?.();
      triggers.forEach((t) => t.kill());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
