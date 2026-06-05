"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { SectionContainer } from "@/components/sections/SectionContainer";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";

export interface PageHeroProps {
  eyebrow: string;
  h1: string;
  body: string;
  primaryCta: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  /** Centered editorial = atmospheric pages (Company, Resources, Demo).
   *  Default = split, intended for capability and feature pages. */
  variant?: "centered" | "split";
  /** Analytics location key */
  location: string;
  /** Optional media node for the split variant */
  media?: React.ReactNode;
}

/**
 * Page hero for non-homepage routes. DESIGN.md §7.2:
 *  - variant="centered": centered headline/body/CTA, no media (DESIGN §7.2 variant 1)
 *  - variant="split": copy left, media right (DESIGN §7.2 variant 2)
 *
 * The homepage uses src/components/sections/Hero.tsx for the video hero;
 * this component covers all other routes.
 */
export function PageHero({
  eyebrow,
  h1,
  body,
  primaryCta,
  secondaryCta,
  variant = "centered",
  location,
  media,
}: PageHeroProps) {
  const isCentered = variant === "centered";

  return (
    <SectionContainer
      surface="dark"
      ambient
      containerSize="page"
      // Extra top padding so the eyebrow + headline clear the fixed nav.
      // SiteHeader is h-14 / h-16 / h-18 (56 / 64 / 72px) by breakpoint;
      // this adds at least one header-height beyond SectionContainer's
      // default py-12 / py-20 / py-24 at each breakpoint.
      className="border-b border-[var(--border)] pt-[calc(var(--spacing)*22)] md:pt-[calc(var(--spacing)*32)] lg:pt-[calc(var(--spacing)*36)]"
    >
      <div
        className={cn(
          "grid items-center gap-12 lg:gap-16",
          isCentered ? "max-w-[var(--container-readable)] mx-auto text-center" : "lg:grid-cols-[1.05fr_1fr]"
        )}
      >
        <div className={cn(isCentered ? "" : "max-w-2xl")}>
          <p className="text-caption font-[480] uppercase tracking-wider text-[var(--text-tertiary)]">
            {eyebrow}
          </p>
          <h1 className="mt-5 text-display-lg font-[480] text-[var(--foreground)] md:mt-6">
            {h1}
          </h1>
          <p
            className={cn(
              "mt-6 text-body-lg text-[var(--text-tertiary)] md:mt-8",
              isCentered ? "mx-auto max-w-2xl" : "max-w-xl"
            )}
          >
            {body}
          </p>
          <div
            className={cn(
              "mt-8 flex flex-wrap items-center gap-5 md:mt-10",
              isCentered ? "justify-center" : ""
            )}
          >
            <Button
              asChild
              variant="primary"
              size="md"
              className="min-h-touch"
              onClick={() =>
                track({
                  event: "cta_primary_click",
                  location,
                  label: primaryCta.label,
                })
              }
            >
              <Link href={primaryCta.href}>{primaryCta.label}</Link>
            </Button>
            {secondaryCta ? (
              <Button
                asChild
                variant="ghost"
                size="text"
                onClick={() =>
                  track({
                    event: "cta_secondary_click",
                    location,
                    label: secondaryCta.label,
                  })
                }
              >
                <Link href={secondaryCta.href}>
                  {secondaryCta.label} <span aria-hidden="true">→</span>
                </Link>
              </Button>
            ) : null}
          </div>
        </div>

        {!isCentered && media ? (
          <div className="relative overflow-hidden rounded-[var(--radius-sm)] bg-[var(--card)] shadow-[var(--shadow-nav)] ring-1 ring-[var(--border)]">
            {media}
          </div>
        ) : null}
      </div>
    </SectionContainer>
  );
}
