"use client";

import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { track } from "@/lib/analytics";
import { homepageHero } from "@/content/homepage";

/**
 * Homepage hero — DESIGN.md §7.2 variant 2 (split: copy left, media right).
 *
 * - Eyebrow / H1 / body / primary pill CTA / ghost secondary link
 * - Media slot renders the homepage hero video with the poster image as
 *   the LCP-eligible fallback. The poster ALWAYS renders as <Image> with
 *   priority so it owns LCP regardless of video readyState. The video
 *   layers on top once playing, then fades the poster out via CSS.
 * - prefers-reduced-motion: reduce — only the poster renders. No video.
 * - 72-96px vertical padding desktop, 32-48px mobile per DESIGN.md §4.3.
 */
export function Hero() {
  const { eyebrow, h1, body, primaryCta, secondaryCta, media } = homepageHero;

  return (
    <section
      aria-labelledby="hero-heading"
      className="relative isolate overflow-hidden border-b border-[var(--border)] bg-[var(--background)]"
    >
      <div className="mx-auto grid max-w-[var(--container-page)] gap-12 px-4 py-12 md:gap-16 md:px-6 md:py-20 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:gap-20 lg:px-8 lg:py-24">
        {/* Copy column */}
        <div className="max-w-2xl">
          <p className="text-[var(--text-caption)] font-[480] uppercase tracking-wider text-[var(--text-tertiary)]">
            {eyebrow}
          </p>
          <h1
            id="hero-heading"
            className="mt-5 text-[length:var(--text-h1)] font-[480] leading-[var(--text-h1--line-height)] text-[var(--foreground)] md:mt-6"
          >
            {h1}
          </h1>
          <p className="mt-6 max-w-xl text-[length:var(--text-body-lg)] leading-[var(--text-body-lg--line-height)] text-[var(--text-tertiary)] md:mt-8">
            {body}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-5 md:mt-10">
            <Button
              asChild
              variant="primary"
              size="md"
              onClick={() =>
                track({
                  event: "cta_primary_click",
                  location: "homepage_hero",
                  label: primaryCta.label,
                })
              }
            >
              <Link href={primaryCta.href}>{primaryCta.label}</Link>
            </Button>
            <Button
              asChild
              variant="ghost"
              size="text"
              onClick={() =>
                track({
                  event: "cta_secondary_click",
                  location: "homepage_hero",
                  label: secondaryCta.label,
                })
              }
            >
              <Link href={secondaryCta.href}>
                {secondaryCta.label} <span aria-hidden="true">→</span>
              </Link>
            </Button>
          </div>
        </div>

        {/* Media column */}
        <HeroMedia
          videoSrc={media.video}
          posterSrc={media.poster}
          alt={media.alt}
        />
      </div>
    </section>
  );
}

function HeroMedia({
  videoSrc,
  posterSrc,
  alt,
}: {
  videoSrc: string;
  posterSrc: string;
  alt: string;
}) {
  return (
    <div className="relative aspect-[16/11] w-full overflow-hidden rounded-[var(--radius-sm)] bg-[var(--card)] shadow-[var(--shadow-nav)] ring-1 ring-[var(--border)]">
      {/* Poster owns LCP — always rendered, priority-loaded */}
      <Image
        src={posterSrc}
        alt={alt}
        fill
        sizes="(min-width: 1024px) 50vw, 100vw"
        priority
        className="object-cover"
        data-slot="hero-poster"
      />
      {/* Video layers on top when motion is allowed; hidden when not */}
      <video
        src={videoSrc}
        poster={posterSrc}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden="true"
        className="motion-reduce:hidden absolute inset-0 h-full w-full object-cover"
        data-slot="hero-video"
        onPlay={() =>
          // Fire video_play once per session
          typeof window !== "undefined" &&
          !sessionStorage.getItem("dn_hero_video_played") &&
          (sessionStorage.setItem("dn_hero_video_played", "1"),
          window.dataLayer?.push({
            event: "video_play",
            video_id: "homepage_hero",
          }))
        }
      />
    </div>
  );
}
