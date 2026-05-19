"use client";

import * as React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

import { HeroAccountsPanel } from "@/components/sections/HeroAccountsPanel";
import { track } from "@/lib/analytics";
import { heroCinematic } from "@/content/homepage-hero";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * Mercury-faithful cinematic hero. Pattern from the brief in
 * /Users/connorlaughlin/Downloads/mercury-hero-claude-code-brief.md:
 *
 *  - Outer section is 300vh tall — drives scroll progress
 *  - Inner wrapper is sticky top-0 h-screen — pinned to viewport while
 *    the outer section scrolls
 *  - Three z-stacked layers inside the wrapper:
 *      1. <video> scrubbed by scroll progress (currentTime ← progress)
 *      2. <Overlay> with headline / attached form / disclaimer — fades out 0-15%
 *      3. <HeroAccountsPanel> hidden until 90%, fades+scales in 90-100%
 *
 * Mobile (≤768px): scrubbing is disabled. The hero collapses to the static
 * start frame with overlay shown statically. The next section begins
 * normally underneath.
 *
 * Reduced motion: respected at the global @media level in globals.css.
 * useGSAP's `revertOnUpdate` and scope handle ScrollTrigger cleanup.
 */
export function HomepageHero() {
  const router = useRouter();
  const sectionRef = React.useRef<HTMLElement | null>(null);
  const stickyRef = React.useRef<HTMLDivElement | null>(null);
  const videoRef = React.useRef<HTMLVideoElement | null>(null);
  const endFrameRef = React.useRef<HTMLDivElement | null>(null);
  const overlayRef = React.useRef<HTMLDivElement | null>(null);
  const panelRef = React.useRef<HTMLDivElement | null>(null);
  const [email, setEmail] = React.useState("");

  // Disable scrub on small screens — currentTime binding is unreliable on
  // iOS Safari and locks up older Android. Detect once on mount.
  const [isMobile, setIsMobile] = React.useState(false);
  React.useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const handler = () => setIsMobile(mq.matches);
    handler();
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useGSAP(
    () => {
      if (isMobile) return;
      const video = videoRef.current;
      const section = sectionRef.current;
      const overlay = overlayRef.current;
      const panel = panelRef.current;
      const endFrame = endFrameRef.current;
      if (!video || !section || !overlay || !panel || !endFrame) return;

      const wire = () => {
        // 1. Scrub video frame-by-frame from 0 to its duration as the
        //    outer section scrolls from top-top to bottom-bottom.
        gsap.to(video, {
          currentTime: video.duration || 1,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.5, // 0.5s lerp smooths frame stepping
          },
        });

        // 2. Overlay (headline + form + disclaimer) fades out and rises
        //    during the first 15% of scroll.
        gsap.to(overlay, {
          opacity: 0,
          y: -50,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "15% top",
            scrub: 0.5,
          },
        });

        // 3. Handoff window (90%-100%):
        //    - Video fades out
        //    - End-frame image fades in beneath it (visual continuity
        //      since the video's last frame matches end-frame.png)
        //    - Accounts panel fades + scales in on top
        gsap.to(video, {
          opacity: 0,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "85% bottom",
            end: "bottom bottom",
            scrub: true,
          },
        });

        gsap.fromTo(
          endFrame,
          { opacity: 0 },
          {
            opacity: 1,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "80% bottom",
              end: "95% bottom",
              scrub: true,
            },
          }
        );

        gsap.fromTo(
          panel,
          { opacity: 0, scale: 0.95 },
          {
            opacity: 1,
            scale: 1,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "90% bottom",
              end: "bottom bottom",
              scrub: true,
            },
          }
        );
      };

      if (video.readyState >= 1) wire();
      else video.addEventListener("loadedmetadata", wire, { once: true });
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
      className="relative bg-[var(--background)] md:h-[300vh]"
    >
      <div
        ref={stickyRef}
        className="relative h-screen w-full overflow-hidden md:sticky md:top-0"
      >
        {/* Layer 1: video. Start-frame poster owns LCP. */}
        <Image
          src={heroCinematic.media.startFrame}
          alt=""
          fill
          sizes="100vw"
          priority
          aria-hidden="true"
          className="absolute inset-0 object-cover"
        />
        {!isMobile && (
          <video
            ref={videoRef}
            src={heroCinematic.media.video}
            poster={heroCinematic.media.startFrame}
            muted
            playsInline
            preload="auto"
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover motion-reduce:hidden"
          />
        )}

        {/* End-frame image. Hidden until 80% scroll, fades in to provide
            visual continuity behind the panel after the video fades out. */}
        {!isMobile && (
          <div
            ref={endFrameRef}
            aria-hidden="true"
            className="absolute inset-0 opacity-0"
          >
            <Image
              src={heroCinematic.media.endFrame}
              alt=""
              fill
              sizes="100vw"
              className="object-cover"
            />
          </div>
        )}

        {/* Dark vignette to anchor the overlay text */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60"
        />

        {/* Layer 2: overlay — headline, subhead, form, disclaimer */}
        <div
          ref={overlayRef}
          className="absolute inset-0 flex flex-col items-center justify-center px-4 md:px-6 lg:px-8"
        >
          <div className="mx-auto flex w-full max-w-[var(--container-content)] flex-col items-center text-center">
            <h1
              className="text-balance text-[clamp(2.75rem,8vw,7rem)] font-[500] leading-[0.95] tracking-[-0.02em] text-white"
              style={{ fontVariationSettings: '"wght" 500' }}
            >
              {heroCinematic.headline}
            </h1>
            <p className="mt-6 max-w-2xl text-body-lg text-white/80 md:mt-8">
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
                className="h-[46px] min-w-0 flex-1 rounded-l-[var(--radius-md)] border border-white/30 bg-white/5 px-5 text-body-strong text-white placeholder:text-white/60 backdrop-blur-xl focus:border-[var(--primary)] focus:outline-none"
              />
              <button
                type="submit"
                className="inline-flex h-[46px] items-center justify-center rounded-r-[var(--radius-md)] bg-[var(--primary)] px-5 text-body-strong font-[420] text-white transition-colors hover:bg-[var(--primary-hover)] active:bg-[var(--primary-active)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus)]"
              >
                {heroCinematic.attachedForm.buttonLabel}
              </button>
            </form>
          </div>

          {/* Bottom-pinned disclaimer pill (inside the hero section so it
              scrolls away with the rest of the overlay) */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 md:bottom-10">
            <p className="rounded-[var(--radius-xl)] border border-white/15 bg-black/40 px-5 py-2 text-body-sm text-white/80 backdrop-blur-xl">
              {heroCinematic.disclaimer}
            </p>
          </div>
        </div>

        {/* Layer 3: accounts panel — hidden until handoff */}
        {!isMobile && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-end px-4 md:px-12 lg:px-20">
            <HeroAccountsPanel
              ref={panelRef}
              initiallyHidden
              className="pointer-events-auto"
            />
          </div>
        )}
      </div>
    </section>
  );
}
