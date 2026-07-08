import Image from "next/image";

import { CursorGlow } from "@/components/motion/CursorGlow";
import { heroCinematic } from "@/content/homepage-hero";

/**
 * Cinematic homepage hero with a real dashboard-screenshot finale.
 *
 * Server Component since the hero RSC split (2026-07-08): this file renders
 * the full hero markup once, on the server, for every session. All client
 * behavior lives elsewhere:
 *
 *   - HeroCinematicMount (thin client leaf, mounted by HomepageHeroHandoff)
 *     gates on desktop + motion-safe, lazy-loads HeroCinematicController, and
 *     hands it these DOM nodes via the `data-hero-*` markers below.
 *   - The email form is a native GET form to /demo (works pre-hydration and
 *     with JS disabled); its analytics fire through the root ClickTracker's
 *     delegated listener via `data-track-*` on the submit button. Implicit
 *     submission (Enter in the input) fires a click on the default submit
 *     button, so keyboard submits are tracked too.
 *   - CursorGlow stays the overlay's own client leaf, as elsewhere on the site.
 *
 * Pinned via GSAP for ~260vh of scroll on desktop. A single master
 * ScrollTrigger (HeroCinematicController) drives the cinematic via
 * onUpdate(progress 0→1):
 *
 *   p = 0        — start-frame PNG owns the viewport; overlay + form visible
 *   p = 0→0.03   — video fades IN once the user starts scrolling
 *   p = 0→0.12   — overlay fades out + lifts -50px
 *   p = 0→1      — video scrubs frame-by-frame through the cinematic zoom
 *   p = 0.55→0.74 — video fades OUT while the real dashboard screenshot fades IN
 *                   (early crossfade buries the video's garbled AI frames)
 *   p = 0.64→0.74 — start-frame (cliffside) fades out underneath
 *   p ≥ 0.74      — dashboard screenshot fully visible, held at center, full
 *                   size, full opacity for the rest of the pin and through the
 *                   handoff into the Platform section
 *
 * Mobile (≤767px) and reduced motion: the desktop-only layers (video, finale)
 * are CSS-hidden (`max-md:hidden`), the controller never loads, and the
 * static start-frame + overlay render as the fail-open tree. The video's
 * <source media> queries are all bounded to (min-width: 768px), so phones
 * start zero video downloads even though the element is in the DOM (D-04).
 */
export function HomepageHero() {
  return (
    <section
      data-hero-section
      data-slot="homepage-hero"
      className="relative bg-[var(--background)]"
    >
      <div
        data-hero-sticky
        className="relative h-screen w-full overflow-hidden bg-[var(--background)]"
      >
        {/* Layer 1: start-frame PNG. LCP target; wrapped so we can fade
            the cliffside out as the dashboard finale takes over. */}
        <div data-hero-start-frame className="absolute inset-0">
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

        {/* Layer 2: video — scrubbed by scroll progress on desktop. <source>
            children mapped from the multi-resolution ladder (HERO-01). Browser
            walks them top-down; every media query is bounded to
            (min-width: 768px) so phones match zero sources and download
            nothing (D-04), which is why the element can safely stay in the
            server markup. `max-md:hidden` keeps it out of the mobile paint. */}
        <video
          data-hero-video
          muted
          playsInline
          preload="auto"
          aria-hidden="true"
          style={{ opacity: 0 }}
          className="absolute inset-0 h-full w-full object-cover max-md:hidden motion-reduce:hidden"
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

        {/* Single soft vignette — handles nav and disclaimer legibility
            without banding the middle of the image. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-b from-black/35 via-transparent to-black/40"
        />

        {/* Layer 3: real dashboard screenshot finale. Crossfades in from the
            video directly. Once visible, holds at full size and full opacity —
            the screenshot never moves, and the Platform section's matching
            framed dashboard picks up at the same screen position. This is the
            approved DebtNext "Executive Portfolio Overview" export; it ships
            its own dark product chrome, so it renders WITHOUT the FramedDashboard
            bezel (the bezel is for the DOM Console mockups only). Desktop-only
            layer: `max-md:hidden` also keeps the lazy next/image fetch off
            phones (display:none defers a loading=lazy image). */}
        <div
          data-hero-framed-dashboard
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 flex items-center justify-center px-4 opacity-0 max-md:hidden md:px-8 lg:px-12"
        >
          <div className="w-full max-w-6xl overflow-hidden rounded-[var(--radius-md)] border border-[var(--border)] shadow-[var(--shadow-deep)]">
            <Image
              src="/hero/dashboard-finale.png"
              alt="dPlat executive portfolio overview dashboard showing total inventory, weekly liquidation and payments, SLA compliance, an inventory and payments trend chart, a portfolio mix donut, a vendor performance scorecard, and an SLA exception queue."
              width={1536}
              height={1024}
              sizes="(min-width: 1280px) 1152px, 100vw"
              className="h-auto w-full"
            />
          </div>
        </div>

        {/* Overlay — headline, subhead, form, disclaimer. */}
        <div
          data-hero-overlay
          className="absolute inset-0 flex flex-col items-center justify-center px-4 md:px-6 lg:px-8"
        >
          <CursorGlow />
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
              action="/demo"
              method="get"
              className="mt-8 flex w-full max-w-md items-stretch md:mt-10"
            >
              <label htmlFor="hero-email" className="sr-only">
                {heroCinematic.attachedForm.label}
              </label>
              <input
                id="hero-email"
                name="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder={heroCinematic.attachedForm.placeholder}
                className="h-[46px] min-w-0 flex-1 rounded-l-[var(--radius-md)] border border-white/40 bg-black/40 px-5 text-body-strong text-white placeholder:text-white/70 backdrop-blur-xl focus:border-[var(--primary)] focus:outline-none focus:ring-3 focus:ring-[var(--focus)]/35"
              />
              <button
                type="submit"
                data-track-event="cta_primary_click"
                data-track-location="homepage_hero_form"
                data-track-label={heroCinematic.attachedForm.buttonLabel}
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
