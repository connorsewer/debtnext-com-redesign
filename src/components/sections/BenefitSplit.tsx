"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { SectionContainer } from "@/components/sections/SectionContainer";
import type { SectionSurface } from "@/components/sections/SectionContainer";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";

export interface BenefitSplitProps {
  eyebrow?: string;
  heading: string;
  body: string;
  bullets?: string[];
  /** Optional ghost-link CTA below the bullets */
  link?: { label: string; href: string };
  /** Optional analytics location key for the link */
  linkLocation?: string;
  media: {
    src: string;
    alt: string;
    width: number;
    height: number;
  };
  /** Optional live product visual rendered in place of the static media image
   *  (e.g. a lazy-loaded DecisionEnginePreview). Falls back to `media` when
   *  not provided. */
  visual?: React.ReactNode;
  surface?: SectionSurface;
  /** Swap copy + media columns */
  mediaPosition?: "left" | "right";
  id?: string;
}

/**
 * Text + media split. DESIGN.md §7.6 split-feature variant.
 * Supports dark / elevated-dark / light surface contrast bands.
 */
export function BenefitSplit({
  eyebrow,
  heading,
  body,
  bullets,
  link,
  linkLocation,
  media,
  visual,
  surface = "dark",
  mediaPosition = "right",
  id,
}: BenefitSplitProps) {
  return (
    <SectionContainer surface={surface} id={id}>
      <div
        className={cn(
          "grid items-center gap-12 @md/section:gap-16",
          "@md/section:grid-cols-2"
        )}
      >
        <div
          className={cn(
            "max-w-xl",
            mediaPosition === "left" ? "@md/section:order-2" : ""
          )}
        >
          {eyebrow ? (
            <p className="text-caption font-[480] uppercase tracking-wider text-[var(--text-tertiary)]">
              {eyebrow}
            </p>
          ) : null}
          <h2 className="mt-3 text-h2 font-[480] text-[var(--foreground)]">
            {heading}
          </h2>
          <p className="mt-5 text-body-lg text-[var(--text-tertiary)]">
            {body}
          </p>
          {bullets && bullets.length ? (
            <ul className="mt-8 space-y-3">
              {bullets.map((bullet) => (
                <li
                  key={bullet}
                  className="flex items-start gap-3 text-body-md text-[var(--foreground)]"
                >
                  <span
                    aria-hidden="true"
                    className="mt-2 inline-block h-1 w-3 shrink-0 rounded-[var(--radius-xs)] bg-[var(--primary)]"
                  />
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          ) : null}
          {link ? (
            <div className="mt-8">
              <Button
                asChild
                variant="ghost"
                size="text"
                onClick={() =>
                  track({
                    event: "cta_secondary_click",
                    location: linkLocation ?? "benefit_split",
                    label: link.label,
                  })
                }
              >
                <Link href={link.href}>
                  {link.label} <span aria-hidden="true">→</span>
                </Link>
              </Button>
            </div>
          ) : null}
        </div>

        <div
          className={cn(
            "relative overflow-hidden rounded-[var(--radius-sm)] bg-[var(--card)] shadow-[var(--shadow-nav)] ring-1 ring-[var(--border)]",
            mediaPosition === "left" ? "@md/section:order-1" : ""
          )}
        >
          {visual ?? (
            <Image
              src={media.src}
              alt={media.alt}
              width={media.width}
              height={media.height}
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="h-auto w-full object-cover"
            />
          )}
        </div>
      </div>
    </SectionContainer>
  );
}
