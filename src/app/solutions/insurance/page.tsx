import type { Metadata } from "next";

import { ScrollDepthTracker } from "@/components/analytics/ScrollDepthTracker";
import { BulletList } from "@/components/sections/BulletList";
import { CardGrid } from "@/components/sections/CardGrid";
import { FeatureAccordion } from "@/components/sections/FeatureAccordion";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { PageHero } from "@/components/sections/PageHero";
import { ProseSection } from "@/components/sections/ProseSection";
import { RevealSection } from "@/components/sections/RevealSection";
import {
  insuranceChallenges,
  insuranceFinalCta,
  insuranceHero,
  insuranceHowItRuns,
  insuranceMeta,
  insuranceProof,
  insuranceRegulatory,
} from "@/content/solutions-insurance";

export const metadata: Metadata = {
  title: insuranceMeta.title,
  description: insuranceMeta.description,
  alternates: { canonical: insuranceMeta.canonical },
};

export default function InsuranceSolutionPage() {
  return (
    <>
      <ScrollDepthTracker />

      <PageHero
        eyebrow={insuranceHero.eyebrow}
        h1={insuranceHero.h1}
        body={insuranceHero.body}
        primaryCta={insuranceHero.primaryCta}
        secondaryCta={insuranceHero.secondaryCta}
        variant="centered"
        location="insurance_hero"
      />

      <RevealSection>
        <CardGrid
          eyebrow={insuranceChallenges.eyebrow}
          heading={insuranceChallenges.heading}
          cards={insuranceChallenges.cards}
          columns={3}
          surface="elevated-dark"
        />
      </RevealSection>

      <RevealSection>
        <FeatureAccordion
          eyebrow={insuranceHowItRuns.eyebrow}
          heading={insuranceHowItRuns.heading}
          intro={insuranceHowItRuns.intro}
          items={insuranceHowItRuns.items}
          section="insurance_how_it_runs"
        />
      </RevealSection>

      <ProseSection
        eyebrow={insuranceProof.eyebrow}
        heading={insuranceProof.heading}
        paragraphs={insuranceProof.paragraphs}
        surface="light"
      />

      <RevealSection>
        <BulletList
          eyebrow={insuranceRegulatory.eyebrow}
          heading={insuranceRegulatory.heading}
          bullets={insuranceRegulatory.bullets}
          surface="elevated-dark"
        />
      </RevealSection>

      <FinalCTA
        heading={insuranceFinalCta.heading}
        body={insuranceFinalCta.body}
        primaryCta={insuranceFinalCta.primaryCta}
        reassurance={insuranceFinalCta.reassurance}
        location="insurance_final_cta"
      />
    </>
  );
}
