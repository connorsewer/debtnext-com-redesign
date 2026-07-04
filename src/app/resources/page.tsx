import type { Metadata } from "next";

import { buildMetadata } from "@/lib/seo/metadata";

import { ScrollDepthTracker } from "@/components/analytics/ScrollDepthTracker";
import { CardGrid } from "@/components/sections/CardGrid";
import { CaseStudyBand } from "@/components/sections/CaseStudyBand";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { NewsletterSignup } from "@/components/sections/NewsletterSignup";
import { PageHero } from "@/components/sections/PageHero";
import { SectionContainer } from "@/components/sections/SectionContainer";
import {
  resourcesCaseStudies,
  resourcesCategories,
  resourcesFinalCta,
  resourcesHero,
  resourcesMeta,
  resourcesNewsletter,
} from "@/content/resources";

export const metadata: Metadata = buildMetadata(resourcesMeta);

export default function ResourcesPage() {
  return (
    <>
      <ScrollDepthTracker />

      <PageHero
        eyebrow={resourcesHero.eyebrow}
        h1={resourcesHero.h1}
        body={resourcesHero.body}
        primaryCta={resourcesHero.primaryCta}
        secondaryCta={resourcesHero.secondaryCta}
        variant="centered"
        location="resources_hero"
      />

      <CardGrid
        heading={resourcesCategories.heading}
        cards={resourcesCategories.cards}
        columns={3}
      />

      <CaseStudyBand
        eyebrow={resourcesCaseStudies.eyebrow}
        heading={resourcesCaseStudies.heading}
        body={resourcesCaseStudies.body}
        studies={resourcesCaseStudies.studies}
        disclaimer={resourcesCaseStudies.disclaimer}
        surface="elevated-dark"
      />

      <SectionContainer surface="light" containerSize="readable">
        <div className="text-center">
          <h2 className="text-h2 font-[480] text-[var(--foreground)]">
            {resourcesNewsletter.heading}
          </h2>
          <p className="mt-5 text-body-lg text-[var(--text-tertiary)]">
            {resourcesNewsletter.body}
          </p>
        </div>
        <div className="mt-8 flex justify-center">
          <NewsletterSignup
            inputLabel={resourcesNewsletter.inputLabel}
            inputPlaceholder={resourcesNewsletter.inputPlaceholder}
            buttonLabel={resourcesNewsletter.buttonLabel}
          />
        </div>
        <p className="mt-4 text-center text-body-sm text-[var(--text-tertiary)]">
          The digest isn&apos;t live yet. This takes you to request a demo,
          so a real person follows up in the meantime.
        </p>
      </SectionContainer>

      <FinalCTA
        heading={resourcesFinalCta.heading}
        body={resourcesFinalCta.body}
        primaryCta={resourcesFinalCta.primaryCta}
        location="resources_final_cta"
      />
    </>
  );
}
