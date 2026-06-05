"use client";

import * as React from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";

import { CursorGlow } from "@/components/motion/CursorGlow";
import { FramedDashboard } from "@/components/sections/mockups/FramedDashboard";
import { track } from "@/lib/analytics";
import { heroCinematic } from "@/content/homepage-hero";

// Desktop-only, non-reduced-motion owner of ALL GSAP. Loaded via next/dynamic
// with ssr:false so GSAP never enters the `/` eager client chunk; mobile and
// reduced-motion sessions never download it (HERO-04 LHCI lever).
const HeroCinematicController = dynamic(
  () =>
    import("./HeroCinematicController").then((m) => m.HeroCinematicController),
  { ssr: false }
);

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

  const [prefersReducedMotion, setPrefersReducedMotion] = React.useState(false);
  React.useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = () => setPrefersReducedMotion(mq.matches);
    handler();
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Cinematic runs on desktop, non-reduced-motion only. All GSAP wiring lives
  // in HeroCinematicController, mounted via next/dynamic below. When this gate
  // is false (mobile / reduced motion / SSR) the static start-frame + overlay
  // tree below renders on its own (this IS the fail-open render).
  const cinematicEnabled = !isMobile && !prefersReducedMotion;

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
      {cinematicEnabled && (
        <HeroCinematicController
          heroRefs={{
            section: sectionRef,
            sticky: stickyRef,
            video: videoRef,
            startFrame: startFrameRef,
            framedDash: framedDashRef,
            overlay: overlayRef,
          }}
        />
      )}
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
            preload
            fetchPriority="high"
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
            muted
            playsInline
            preload="auto"
            aria-hidden="true"
            style={{ opacity: 0 }}
            className="absolute inset-0 h-full w-full object-cover motion-reduce:hidden"
          >
            {/* Phase 05.2 follow-up: no `poster=` attribute. Layer 1
                <Image src={startFrame} preload fetchPriority="high">
                above already paints the start frame full-cover under the
                video. The video element starts at opacity 0 and GSAP
                fades it in only once scroll progresses, so a separate
                poster fetch shows nothing the underlying <Image> isn't
                already painting. Keeping `poster` here would re-fetch
                the AVIF on mobile during the SSR-to-hydration window
                (the `<video>` lives in the initial HTML before
                `isMobile` flips), wasting bandwidth that LCP needs. */}
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
          {/* Pointer-follow glow is a desktop affordance only; skip on mobile
              (touch has no cursor) so it never mounts on the `/` mobile path. */}
          {!isMobile && <CursorGlow />}
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
                className="h-[46px] min-w-0 flex-1 rounded-l-[var(--radius-md)] border border-white/40 bg-black/40 px-5 text-body-strong text-white placeholder:text-white/70 backdrop-blur-xl focus:border-[var(--primary)] focus:outline-none focus:ring-3 focus:ring-[var(--focus)]/35"
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
