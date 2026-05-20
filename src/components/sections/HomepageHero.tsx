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
 * Outer section is 450vh, giving a pinned scrub range of ~350vh of
 * scroll. A single master ScrollTrigger drives everything via
 * onUpdate(progress 0→1):
 *
 *   p = 0       — start frame PNG owns the viewport; overlay + form visible
 *   p = 0→0.03  — video fades IN once the user starts scrolling
 *   p = 0→0.12  — overlay fades out + lifts -50px
 *   p = 0→1     — video scrubs frame-by-frame
 *   p = 0.6→0.8 — end-frame layer (cliffside + laptop) fades in
 *   p = 0.7→0.85— video fades out
 *   p = 0.82→0.92 — cliffside cinematic (start + end frame layers) fades out
 *   p = 0.85→0.93 — framed standalone dashboard fades in, centered on dark canvas
 *   p = 0.93→0.97 — HOLD on framed dashboard
 *   p = 0.97→1  — framed dashboard scales (1 → 0.55) and slides 28% right,
 *                 fades out at the very end so the handoff section's mockup
 *                 picks up at the same screen position without doubling
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
  const endFrameRef = React.useRef<HTMLDivElement | null>(null);
  const framedDashRef = React.useRef<HTMLDivElement | null>(null);
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
      const startFrame = startFrameRef.current;
      const endFrame = endFrameRef.current;
      const framedDash = framedDashRef.current;
      if (!video || !section || !overlay || !startFrame || !endFrame || !framedDash) return;

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
            const p = self.progress;

            video.currentTime = duration * p;

            // Overlay fades out + lifts
            const overlayOut = ease(0, 0.12, p);
            overlay.style.opacity = String(1 - overlayOut);
            overlay.style.transform = `translateY(${-50 * overlayOut}px)`;

            // Video fades in once scroll starts, fades out late
            const videoIn = ease(0.0, 0.03, p);
            const videoOut = ease(0.7, 0.85, p);
            video.style.opacity = String(videoIn * (1 - videoOut));

            // End-frame (cliffside + laptop view) fades in mid-scrub
            const endFrameIn = ease(0.6, 0.8, p);
            // Then both the cliffside layers fade out as the held framed
            // dashboard takes over
            const cliffOut = ease(0.82, 0.92, p);
            startFrame.style.opacity = String(1 - cliffOut);
            endFrame.style.opacity = String(endFrameIn * (1 - cliffOut));

            // Framed standalone dashboard: fade in late, hold, then
            // scale+slide+fade as the handoff into Platform begins.
            const dashIn = ease(0.85, 0.93, p);
            const dashHandoffP = ease(0.97, 1, p);
            const dashScale = 1 - 0.45 * dashHandoffP; // 1 → 0.55
            const dashTx = 28 * dashHandoffP;          // 0% → 28%
            // Fade the framed dashboard out at the very end so the
            // handoff section's per-tab mockup takes over cleanly.
            const dashOpacity = dashIn * (1 - dashHandoffP * 0.85);
            framedDash.style.opacity = String(dashOpacity);
            framedDash.style.transform = `translateX(${dashTx}%) scale(${dashScale})`;
            framedDash.style.transformOrigin = "center center";
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
      className="relative bg-[var(--background)] md:h-[450vh]"
    >
      <div
        ref={stickyRef}
        className="relative h-screen w-full overflow-hidden md:sticky md:top-0"
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

        {/* Layer 2: video — scrubbed by scroll progress. */}
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

        {/* Layer 3: end-frame (cliffside + laptop) — fades in mid-scrub
            to bridge from the video into the held-dashboard finale. */}
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

        {/* Single soft vignette — handles nav and disclaimer legibility
            without banding the middle of the image. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-b from-black/35 via-transparent to-black/40"
        />

        {/* Layer 4: framed standalone dashboard finale. Hidden by default;
            fades in late in the scrub, holds, then scales + slides right
            as the handoff begins. Sits over the cliffside layers (which
            are by then faded out) on the dark canvas. */}
        {!isMobile && (
          <div
            ref={framedDashRef}
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 flex items-center justify-center px-4 opacity-0 will-change-transform md:px-8 lg:px-12"
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
