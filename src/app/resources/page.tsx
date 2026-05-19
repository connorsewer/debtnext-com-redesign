import type { Metadata } from "next";

import { ScrollDepthTracker } from "@/components/analytics/ScrollDepthTracker";
import { CardGrid } from "@/components/sections/CardGrid";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { PageHero } from "@/components/sections/PageHero";
import { SectionContainer } from "@/components/sections/SectionContainer";
import { AttachedForm } from "@/components/ui/AttachedForm";
import {
  resourcesCategories,
  resourcesFinalCta,
  resourcesHero,
  resourcesMeta,
  resourcesNewsletter,
} from "@/content/resources";

export const metadata: Metadata = {
  title: resourcesMeta.title,
  description: resourcesMeta.description,
  alternates: { canonical: resourcesMeta.canonical },
};

export default function ResourcesPage() {
  return (
    <>
      <ScrollDepthTracker />

      <PageHero
        eyebrow={resourcesHero.eyebrow}
        h1={resourcesHero.h1}
        body={resourcesHero.body}
        primaryCta={resourcesHero.primaryCta}
        variant="centered"
        location="resources_hero"
      />

      <CardGrid
        heading={resourcesCategories.heading}
        cards={resourcesCategories.cards}
        columns={3}
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
          <AttachedForm
            inputLabel={resourcesNewsletter.inputLabel}
            inputPlaceholder={resourcesNewsletter.inputPlaceholder}
            buttonLabel={resourcesNewsletter.buttonLabel}
          />
        </div>
        <p className="mt-4 text-center text-body-sm text-[var(--text-tertiary)]">
          One email a month. Unsubscribe anytime.
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
