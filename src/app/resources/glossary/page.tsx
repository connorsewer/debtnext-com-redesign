import type { Metadata } from "next";
import Link from "next/link";

import { ScrollDepthTracker } from "@/components/analytics/ScrollDepthTracker";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { PageHero } from "@/components/sections/PageHero";
import { SectionContainer } from "@/components/sections/SectionContainer";
import {
  glossaryFinalCta,
  glossaryHero,
  glossaryMeta,
  glossaryTerms,
} from "@/content/glossary";

export const metadata: Metadata = {
  title: glossaryMeta.title,
  description: glossaryMeta.description,
  alternates: { canonical: glossaryMeta.canonical },
};

export default function GlossaryPage() {
  return (
    <>
      <ScrollDepthTracker />

      <PageHero
        eyebrow={glossaryHero.eyebrow}
        h1={glossaryHero.h1}
        body={glossaryHero.body}
        primaryCta={glossaryHero.primaryCta}
        variant="centered"
        location="glossary_hero"
      />

      <SectionContainer surface="dark" containerSize="readable">
        {/* Anchored jump list */}
        <nav aria-label="Glossary terms" className="mb-16">
          <ul className="flex flex-wrap gap-x-4 gap-y-2 text-body-sm text-[var(--text-tertiary)]">
            {glossaryTerms.map((t) => (
              <li key={t.slug}>
                <a
                  href={`#${t.slug}`}
                  className="underline-offset-4 hover:text-[var(--foreground)] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus)]"
                >
                  {t.term}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <dl className="space-y-14">
          {glossaryTerms.map((t) => (
            <div key={t.slug} id={t.slug} className="scroll-mt-28">
              <dt className="text-h4 font-[480] text-[var(--foreground)]">
                {t.term}
              </dt>
              <dd className="mt-3 text-body-md text-[var(--text-tertiary)]">
                <p>{t.definition}</p>
                {t.link ? (
                  <p className="mt-3">
                    <Link
                      href={t.link.href}
                      className="inline-flex min-h-touch items-center text-body-strong font-[480] text-[var(--foreground)] underline-offset-4 hover:text-white hover:underline hover:decoration-[var(--primary)] focus-visible:outline-2 focus-visible:outline-[var(--focus)]"
                    >
                      {t.link.label}
                    </Link>
                  </p>
                ) : null}
              </dd>
            </div>
          ))}
        </dl>
      </SectionContainer>

      <FinalCTA
        heading={glossaryFinalCta.heading}
        body={glossaryFinalCta.body}
        primaryCta={glossaryFinalCta.primaryCta}
        reassurance={glossaryFinalCta.reassurance}
        location="glossary_final_cta"
      />
    </>
  );
}
