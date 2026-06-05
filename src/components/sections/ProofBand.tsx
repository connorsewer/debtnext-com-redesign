"use client";

import * as React from "react";
import Link from "next/link";

import { RevealOnView, revealIndex } from "@/components/motion/css-reveal";
import { Button } from "@/components/ui/button";
import { CountUp } from "@/components/sections/CountUp";
import { SectionContainer } from "@/components/sections/SectionContainer";
import type { SectionSurface } from "@/components/sections/SectionContainer";
import { track } from "@/lib/analytics";

export interface ProofStat {
  number: string;
  label: string;
  /** Optional small caption beneath the label */
  caption?: string;
  /** When set, the figure counts up to this value on scroll-in, formatted
   *  with the prefix/suffix/decimals below. Falls back to the `number`
   *  string when omitted. */
  value?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
}

export interface ProofBandProps {
  eyebrow?: string;
  /** Optional centered heading above the stat row. */
  heading?: string;
  stats: ProofStat[];
  surface?: SectionSurface;
  /** Optional explanatory paragraphs rendered in a readable column below the stats. */
  notes?: string[];
  /** Optional centered ghost link below the stats. */
  link?: { label: string; href: string };
  /** Analytics location key for the link. */
  linkLocation?: string;
}

/**
 * Three (or more) stat cards. DESIGN.md §7.5: quiet trust without a logo wall.
 * Numbers render at H2 size with tabular figures so digits don't reflow.
 *
 * Each card fades and rises subtly on first intersection; the sequence
 * staggers per MD motion guidance. Respects prefers-reduced-motion via the
 * CSS `.dn-reveal` rule (FND-06 framer-free reveal), which forces the rested,
 * fully-visible state in that case.
 */
export function ProofBand({
  eyebrow,
  heading,
  stats,
  surface = "dark",
  notes,
  link,
  linkLocation = "proof_band",
}: ProofBandProps) {
  return (
    <SectionContainer surface={surface}>
      {eyebrow ? (
        <p className="text-center text-[var(--text-caption)] font-[480] uppercase tracking-wider text-[var(--text-tertiary)]">
          {eyebrow}
        </p>
      ) : null}
      {heading ? (
        <h2 className="mt-3 text-center text-h2 font-[480] text-[var(--foreground)]">
          {heading}
        </h2>
      ) : null}
      <RevealOnView
        as="ul"
        margin="-10% 0px"
        className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 md:mt-12 md:[grid-template-columns:repeat(var(--proof-cols),minmax(0,1fr))]"
        style={
          {
            ["--proof-cols" as string]: stats.length,
          } as React.CSSProperties
        }
      >
        {stats.map((stat, idx) => (
          <li
            key={stat.number}
            className="dn-reveal border-t border-[var(--border)] pt-8"
            style={revealIndex(idx)}
          >
            <p
              className="text-h2 font-[480] text-[var(--foreground)]"
              style={{ fontVariantNumeric: "tabular-nums" }}
            >
              {stat.value != null ? (
                <CountUp
                  to={stat.value}
                  prefix={stat.prefix}
                  suffix={stat.suffix}
                  decimals={stat.decimals}
                />
              ) : (
                stat.number
              )}
            </p>
            <p className="mt-3 text-body-strong text-[var(--foreground)]">
              {stat.label}
            </p>
            {stat.caption ? (
              <p className="mt-2 text-body-sm text-[var(--text-tertiary)]">
                {stat.caption}
              </p>
            ) : null}
          </li>
        ))}
      </RevealOnView>
      {notes && notes.length ? (
        <div className="mx-auto mt-10 max-w-2xl space-y-4 text-left text-body-md text-[var(--text-tertiary)] [text-wrap:pretty]">
          {notes.map((note) => (
            <p key={note}>{note}</p>
          ))}
        </div>
      ) : null}
      {link ? (
        <div className="mt-10 flex justify-center">
          <Button
            asChild
            variant="ghost"
            size="text"
            onClick={() =>
              track({
                event: "cta_secondary_click",
                location: linkLocation,
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
    </SectionContainer>
  );
}
