import type { Metadata } from "next";
import Link from "next/link";

import { ScrollDepthTracker } from "@/components/analytics/ScrollDepthTracker";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { PageHero } from "@/components/sections/PageHero";
import { ProofBand } from "@/components/sections/ProofBand";
import { ProseSection } from "@/components/sections/ProseSection";
import { RevealSection } from "@/components/sections/RevealSection";
import { SectionContainer } from "@/components/sections/SectionContainer";
import {
  aboutFinalCta,
  aboutFocus,
  aboutHero,
  aboutMeta,
  aboutOrigin,
  aboutOwnership,
  aboutStats,
} from "@/content/company-about";

export const metadata: Metadata = {
  title: aboutMeta.title,
  description: aboutMeta.description,
  alternates: { canonical: aboutMeta.canonical },
};

export default function AboutPage() {
  return (
    <>
      <ScrollDepthTracker />

      <PageHero
        eyebrow={aboutHero.eyebrow}
        h1={aboutHero.h1}
        body={aboutHero.body}
        primaryCta={aboutHero.primaryCta}
        secondaryCta={aboutHero.secondaryCta}
        variant="centered"
        location="about_hero"
      />

      <ProseSection
        eyebrow={aboutOrigin.eyebrow}
        heading={aboutOrigin.heading}
        paragraphs={aboutOrigin.paragraphs}
      />

      <ProseSection
        eyebrow={aboutFocus.eyebrow}
        heading={aboutFocus.heading}
        paragraphs={aboutFocus.paragraphs}
        surface="elevated-dark"
      />

      {/* TSI ownership disclosure (COI-sensitive). Mirrors the approved
          /company parent framing; do not alter the vendor-network language
          without routing through the COI gate. */}
      <RevealSection>
        <SectionContainer surface="dark" containerSize="content">
          <div className="max-w-2xl">
            <p className="text-caption font-[480] uppercase tracking-wider text-[var(--text-tertiary)]">
              {aboutOwnership.eyebrow}
            </p>
            <h2 className="mt-3 text-h2 font-[480] text-[var(--foreground)]">
              {aboutOwnership.heading}
            </h2>
            <p className="mt-5 text-body-lg text-[var(--text-tertiary)] [text-wrap:pretty]">
              {aboutOwnership.intro}
            </p>
          </div>

          <ul className="mt-10 grid gap-4 md:grid-cols-2">
            {aboutOwnership.cards.map((card) => (
              <li
                key={card.title}
                className="rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--card)] p-6 md:p-7"
              >
                <h3 className="text-h4 font-[480] text-[var(--foreground)]">
                  {card.title}
                </h3>
                <p className="mt-3 text-body-md text-[var(--text-tertiary)]">
                  {card.body}
                </p>
              </li>
            ))}
          </ul>

          <div className="mt-8">
            <Link
              href={aboutOwnership.link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-touch items-center gap-1 text-body-strong font-[480] text-[var(--foreground)] underline-offset-4 hover:text-white hover:underline hover:decoration-[var(--primary)] focus-visible:outline-2 focus-visible:outline-[var(--focus)]"
            >
              {aboutOwnership.link.label} <span aria-hidden="true">→</span>
            </Link>
          </div>
        </SectionContainer>
      </RevealSection>

      <ProofBand
        eyebrow={aboutStats.eyebrow}
        heading={aboutStats.heading}
        stats={aboutStats.stats}
        surface="light"
      />

      <FinalCTA
        heading={aboutFinalCta.heading}
        body={aboutFinalCta.body}
        primaryCta={aboutFinalCta.primaryCta}
        reassurance={aboutFinalCta.reassurance}
        location="about_final_cta"
      />
    </>
  );
}
