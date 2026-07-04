import type { Metadata } from "next";

import { buildMetadata } from "@/lib/seo/metadata";
import Link from "next/link";

import { ScrollDepthTracker } from "@/components/analytics/ScrollDepthTracker";
import { BulletList } from "@/components/sections/BulletList";
import { CardGrid } from "@/components/sections/CardGrid";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { PageHero } from "@/components/sections/PageHero";
import { ProofBand } from "@/components/sections/ProofBand";
import { SectionContainer } from "@/components/sections/SectionContainer";
import {
  companyFinalCta,
  companyFoundingStory,
  companyHero,
  companyLeadership,
  companyMeta,
  companySecurity,
  companyStats,
  companyTsi,
} from "@/content/company";

export const metadata: Metadata = buildMetadata(companyMeta);

export default function CompanyPage() {
  return (
    <>
      <ScrollDepthTracker />

      <PageHero
        eyebrow={companyHero.eyebrow}
        h1={companyHero.h1}
        body={companyHero.body}
        primaryCta={companyHero.primaryCta}
        variant="centered"
        location="company_hero"
      />

      {/* Founding story prose */}
      <SectionContainer surface="dark" containerSize="readable">
        <h2 className="text-h2 font-[480] text-[var(--foreground)]">
          {companyFoundingStory.heading}
        </h2>
        <div className="mt-5 space-y-5">
          {companyFoundingStory.paragraphs.map((p) => (
            <p key={p.slice(0, 40)} className="text-body-lg text-[var(--text-tertiary)]">
              {p}
            </p>
          ))}
        </div>
      </SectionContainer>

      {/* TSI ownership disclosure (COI-sensitive) */}
      <SectionContainer surface="elevated-dark" containerSize="readable">
        <p className="text-caption font-[480] uppercase tracking-wider text-[var(--text-tertiary)]">
          {companyTsi.eyebrow}
        </p>
        <h2 className="mt-3 text-h2 font-[480] text-[var(--foreground)]">
          {companyTsi.heading}
        </h2>
        <div className="mt-5 space-y-5">
          {companyTsi.paragraphs.map((p) => (
            <p key={p.slice(0, 40)} className="text-body-lg text-[var(--text-tertiary)]">
              {p}
            </p>
          ))}
        </div>
        <div className="mt-6">
          <Link
            href={companyTsi.link.href}
            className="inline-flex min-h-touch items-center gap-1 text-body-strong font-[480] text-[var(--foreground)] underline-offset-4 hover:text-white hover:underline hover:decoration-[var(--primary)] focus-visible:outline-2 focus-visible:outline-[var(--focus)]"
            target="_blank"
            rel="noopener noreferrer"
          >
            {companyTsi.link.label} <span aria-hidden="true">→</span>
          </Link>
        </div>
      </SectionContainer>

      <CardGrid
        heading={companyLeadership.heading}
        body={companyLeadership.body}
        cards={companyLeadership.cards}
        columns={3}
      />

      <ProofBand
        eyebrow={companyStats.eyebrow}
        stats={companyStats.stats}
        surface="light"
      />

      <BulletList
        heading={companySecurity.heading}
        body={companySecurity.body}
        bullets={companySecurity.bullets}
        surface="elevated-dark"
      />

      <FinalCTA
        heading={companyFinalCta.heading}
        body={companyFinalCta.body}
        primaryCta={companyFinalCta.primaryCta}
        location="company_final_cta"
      />
    </>
  );
}
