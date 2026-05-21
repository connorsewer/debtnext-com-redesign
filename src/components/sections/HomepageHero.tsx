"use client";

import * as React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

import { FramedDashboard } from "@/components/sections/mockups/FramedDashboard";
import { track } from "@/lib/analytics";
import { heroCinematic } from "@/content/homepage-hero";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * Cinematic homepage hero with a held framed-dashboard finale.
 *
 * Pinned via GSAP for ~260vh of scroll. After the pin releases, the
 * Platform section starts immediately with no ride-out gap. A single
 * master ScrollTrigger drives the cinematic via onUpdate(progress 0→1):
 *
 *   p = 0       — start-frame PNG owns the viewport; overlay + form visible
 *   p = 0→0.03  — video fades IN once the user starts scrolling
 *   p = 0→0.12  — overlay fades out + lifts -50px
 *   p = 0→1     — video scrubs frame-by-frame through the cinematic zoom
 *   p = 0.70→0.88 — video fades OUT while framed dashboard fades IN
 *                  (direct crossfade; no intermediate unframed end-frame)
 *   p = 0.78→0.88 — start-frame (cliffside) fades out underneath
 *   p ≥ 0.88     — framed dashboard fully visible, held at center,
 *                  full size, full opacity for the rest of the pin and
 *                  through the handoff into the Platform section
 *
 * Mobile (≤768px): scrubbing is disabled. Static start-frame with overlay
 * shown statically. Next section begins below.
 */
export function HomepageHero() {
  const router = useRouter();
  const sectionRef = React.useRef<HTMLElement | null>(null);
  const stickyRef = React.useRef<HTMLDivElement | null>(null);
  const videoRef = React.useRef<HTMLVideoElement | null>(null);
  const startFrameRef = React.useRef<HTMLDivElement | null>(null);
  const framedDashRef = React.useRef<HTMLDivElement | null>(null);
  const overlayRef = React.useRef<HTMLDivElement | null>(null);
  const [email, setEmail] = React.useState("");

  const [isMobile, setIsMobile] = React.useState(false);
  React.useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const handler = () => setIsMobile(mq.matches);
    handler();
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useGSAP(
    () => {
      // Early bail when React state has settled mobile. The synchronous wire()
      // path relies on this; the deferred (loadedmetadata) path also re-checks
      // matchMedia live inside wire() to catch the state-flip race.
      if (isMobile) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const video = videoRef.current;
      const section = sectionRef.current;
      const sticky = stickyRef.current;
      const overlay = overlayRef.current;
      const startFrame = startFrameRef.current;
      const framedDash = framedDashRef.current;
      if (!video || !section || !sticky || !overlay || !startFrame || !framedDash) return;

      const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
      const ease = (a: number, b: number, p: number) => clamp01((p - a) / (b - a));

      const wire = () => {
        // Re-check live: if we deferred wire via `loadedmetadata`, isMobile or
        // prefers-reduced-motion may have flipped between useGSAP setup and the
        // event firing. Bail before creating a ScrollTrigger that would inject
        // a .pin-spacer wrapping the sticky div on a layout that no longer
        // wants the cinematic.
        if (window.matchMedia("(max-width: 767px)").matches) return;
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

        const duration = video.duration || 1;

        ScrollTrigger.create({
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
            const dashIn = ease(0.70, 0.88, p);
            const dashCrossfadeOut = ease(0.95, 1.0, p);
            framedDash.style.opacity = String(dashIn * (1 - dashCrossfadeOut));

            // Platform section: invisible during the cinematic, crossfades
            // in during the same 5% window the hero's dashboard fades out.
            // At p=1.0 the hero's dashboard is gone and Platform's
            // dashboard is fully visible at the exact same viewport-y.
            const handoff = document.querySelector(
              "[data-handoff-section]"
            ) as HTMLElement | null;
            if (handoff) {
              const platformIn = ease(0.95, 1.0, p);
              handoff.style.opacity = String(platformIn);
            }
          },
        });
      };

      if (video.readyState >= 1) {
        wire();
      } else {
        video.addEventListener("loadedmetadata", wire, { once: true });
        return () => video.removeEventListener("loadedmetadata", wire);
      }
    },
    { scope: sectionRef, dependencies: [isMobile] }
  );

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    track({
      event: "cta_primary_click",
      location: "homepage_hero_form",
      label: heroCinematic.attachedForm.buttonLabel,
    });
    const qs = email ? `?email=${encodeURIComponent(email)}` : "";
    router.push(`/demo${qs}`);
  }

  return (
    <section
      ref={sectionRef}
      data-slot="homepage-hero"
      className="relative bg-[var(--background)]"
    >
      <div
        ref={stickyRef}
        className="relative h-screen w-full overflow-hidden bg-[var(--background)]"
      >
        {/* Layer 1: start-frame PNG. LCP target; wrapped so we can fade
            the cliffside out as the framed-dashboard finale takes over. */}
        <div ref={startFrameRef} className="absolute inset-0">
          <Image
            src={heroCinematic.media.startFrame}
            alt=""
            fill
            sizes="100vw"
            priority
            aria-hidden="true"
            className="object-cover"
          />
        </div>

        {/* Layer 2: video — scrubbed by scroll progress. <source> children mapped
            from the multi-resolution ladder (HERO-01). Browser walks them
            top-down: WebM-VP9 first for Chrome/Firefox/Edge, MP4-H.264 fallback
            for Safari; within each codec, narrowest-viewport `media` query first
            so iPad-portrait (≤1023px) gets 360p and narrow-laptop (≤1439px) gets
            540p. GSAP scrub binding below is unchanged: video.duration and
            video.currentTime work identically with mapped sources. */}
        {!isMobile && (
          <video
            ref={videoRef}
            poster={heroCinematic.media.startFrame}
            muted
            playsInline
            preload="auto"
            aria-hidden="true"
            style={{ opacity: 0 }}
            className="absolute inset-0 h-full w-full object-cover motion-reduce:hidden"
          >
            {heroCinematic.media.video.map((source) => (
              <source
                key={source.src}
                src={source.src}
                type={source.type}
                media={source.media}
              />
            ))}
          </video>
        )}

        {/* Single soft vignette — handles nav and disclaimer legibility
            without banding the middle of the image. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-b from-black/35 via-transparent to-black/40"
        />

        {/* Layer 3: framed dashboard finale. Crossfades in from the video
            directly (no intermediate unframed end-frame). Once visible,
            holds at full size and full opacity — the dashboard never moves,
            and the Platform section's matching framed dashboard picks up
            at the same screen position. */}
        {!isMobile && (
          <div
            ref={framedDashRef}
            data-hero-framed-dashboard
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 flex items-center justify-center px-4 opacity-0 md:px-8 lg:px-12"
          >
            <FramedDashboard
              title="DebtNext · Executive Portfolio Overview"
              className="w-full max-w-5xl"
            >
              <Image
                src="/product/dashboard-dark.png"
                alt=""
                width={1536}
                height={1024}
                sizes="(min-width: 1024px) 80vw, 100vw"
                className="block h-auto w-full"
              />
            </FramedDashboard>
          </div>
        )}

        {/* Overlay — headline, subhead, form, disclaimer. */}
        <div
          ref={overlayRef}
          className="absolute inset-0 flex flex-col items-center justify-center px-4 md:px-6 lg:px-8"
        >
          <div className="mx-auto flex w-full max-w-[var(--container-content)] flex-col items-center text-center">
            <h1
              className="text-balance text-[clamp(2.75rem,8vw,7rem)] font-[500] leading-[0.95] tracking-[-0.02em] text-white"
              style={{
                fontVariationSettings: '"wght" 500',
                textShadow: "0 2px 30px rgba(0,0,0,0.5)",
              }}
            >
              {heroCinematic.headline}
            </h1>
            <p
              className="mt-6 max-w-2xl text-body-lg text-white/90 md:mt-8"
              style={{ textShadow: "0 1px 16px rgba(0,0,0,0.6)" }}
            >
              {heroCinematic.subhead}
            </p>

            <form
              onSubmit={handleSubmit}
              className="mt-8 flex w-full max-w-md items-stretch md:mt-10"
            >
              <label htmlFor="hero-email" className="sr-only">
                {heroCinematic.attachedForm.label}
              </label>
              <input
                id="hero-email"
                type="email"
                inputMode="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={heroCinematic.attachedForm.placeholder}
                className="h-[46px] min-w-0 flex-1 rounded-l-[var(--radius-md)] border border-white/40 bg-black/40 px-5 text-body-strong text-white placeholder:text-white/70 backdrop-blur-xl focus:border-[var(--primary)] focus:outline-none"
              />
              <button
                type="submit"
                className="inline-flex h-[46px] items-center justify-center rounded-r-[var(--radius-md)] bg-[var(--primary)] px-5 text-body-strong font-[420] text-white transition-colors hover:bg-[var(--primary-hover)] active:bg-[var(--primary-active)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus)]"
              >
                {heroCinematic.attachedForm.buttonLabel}
              </button>
            </form>
          </div>

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 md:bottom-10">
            <p className="rounded-[var(--radius-xl)] border border-white/25 bg-black/60 px-5 py-2 text-body-sm text-white/90 backdrop-blur-xl">
              {heroCinematic.disclaimer}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
