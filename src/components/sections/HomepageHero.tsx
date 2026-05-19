"use client";

import * as React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

import { track } from "@/lib/analytics";
import { heroCinematic } from "@/content/homepage-hero";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * Mercury-faithful cinematic hero with a "hold + transform-to-right" finale.
 *
 * Outer section is 400vh, giving a pinned scrub range of ~300vh (3 viewport
 * heights of scroll). A single master ScrollTrigger drives every animation
 * via onUpdate(progress 0→1) so percentages map directly to the pinned range:
 *
 *   p = 0       — start frame, headline + form + disclaimer visible
 *   p = 0→0.12  — overlay fades out and rises ~50px
 *   p = 0→1     — video scrubs frame-by-frame
 *   p = 0.6→0.8 — end-frame image fades in beneath the video
 *   p = 0.7→0.88— video fades out, leaving the dashboard at full viewport
 *   p = 0.88→0.95 — HOLD (dashboard at full-bleed, no further animation)
 *   p = 0.95→1  — dashboard scales to ~0.45 and translates right, landing
 *                 in the right column of the handoff section that follows
 *
 * Mobile (≤768px): scrubbing is disabled. Static start-frame with overlay
 * shown statically. The next section begins below it.
 *
 * Reduced motion: respected at the global @media level in globals.css.
 */
export function HomepageHero() {
  const router = useRouter();
  const sectionRef = React.useRef<HTMLElement | null>(null);
  const stickyRef = React.useRef<HTMLDivElement | null>(null);
  const videoRef = React.useRef<HTMLVideoElement | null>(null);
  const endFrameRef = React.useRef<HTMLDivElement | null>(null);
  const overlayRef = React.useRef<HTMLDivElement | null>(null);
  const [email, setEmail] = React.useState("");

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
      const endFrame = endFrameRef.current;
      if (!video || !section || !overlay || !endFrame) return;

      const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
      const ease = (a: number, b: number, p: number) => clamp01((p - a) / (b - a));

      const wire = () => {
        const duration = video.duration || 1;

        ScrollTrigger.create({
          trigger: section,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.5,
          onUpdate: (self) => {
            const p = self.progress; // 0 → 1 over the pinned scrub range

            // Video scrubs the entire range
            video.currentTime = duration * p;

            // Overlay fades out + lifts 0 → 12%
            const overlayOut = ease(0, 0.12, p);
            overlay.style.opacity = String(1 - overlayOut);
            overlay.style.transform = `translateY(${-50 * overlayOut}px)`;

            // Video fades IN once the user starts scrolling (0 → 3%) so
            // at rest the high-res start-frame PNG owns the viewport.
            // The video's first frame is lower resolution (1280×720) and
            // would otherwise cover the 1536×1024 PNG.
            const videoIn = ease(0.0, 0.03, p);
            // End-frame fades in 60 → 80% (behind the video for continuity)
            const endFrameIn = ease(0.6, 0.8, p);
            // Video fades out 70 → 88%
            const videoOut = ease(0.7, 0.88, p);
            // Dashboard shrink + slide right 95 → 100% (after a 7-point hold)
            const shrinkP = ease(0.95, 1, p);
            const scale = 1 - 0.55 * shrinkP; // 1 → 0.45
            const tx = 28 * shrinkP;          // 0% → 28% of width

            endFrame.style.opacity = String(endFrameIn);
            endFrame.style.transform = `translateX(${tx}%) scale(${scale})`;
            endFrame.style.transformOrigin = "center center";
            // Combine the fade-in and the late fade-out into one opacity
            video.style.opacity = String(videoIn * (1 - videoOut));
          },
        });
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
      className="relative bg-[var(--background)] md:h-[400vh]"
    >
      <div
        ref={stickyRef}
        className="relative h-screen w-full overflow-hidden md:sticky md:top-0"
      >
        {/* Layer 1: start frame Image — LCP target, always visible. */}
        <Image
          src={heroCinematic.media.startFrame}
          alt=""
          fill
          sizes="100vw"
          priority
          aria-hidden="true"
          className="absolute inset-0 object-cover"
        />

        {/* Video — scrubbed by scroll progress. Starts at opacity 0 so the
            high-res start-frame PNG is what fills the viewport at rest;
            video fades in across the first 3% of scroll. */}
        {!isMobile && (
          <video
            ref={videoRef}
            src={heroCinematic.media.video}
            poster={heroCinematic.media.startFrame}
            muted
            playsInline
            preload="auto"
            aria-hidden="true"
            style={{ opacity: 0 }}
            className="absolute inset-0 h-full w-full object-cover motion-reduce:hidden"
          />
        )}

        {/* End-frame layer. Wraps the dashboard image so we can scale +
            translate the entire wrapper via transform during the finale.
            Hidden by default — fades in 60-80% scrub, transforms 95-100%. */}
        {!isMobile && (
          <div
            ref={endFrameRef}
            aria-hidden="true"
            className="absolute inset-0 opacity-0 will-change-transform"
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

        {/* Toned global vignette. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40"
        />

        {/* Localized radial scrim behind the text block. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-1/4 bottom-1/4"
          style={{
            background:
              "radial-gradient(ellipse 60% 80% at 50% 50%, rgba(0,0,0,0.55), rgba(0,0,0,0.25) 60%, transparent 100%)",
          }}
        />

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
