import type { Metadata } from "next";

import { ScrollDepthTracker } from "@/components/analytics/ScrollDepthTracker";
import { BulletList } from "@/components/sections/BulletList";
import { CardGrid } from "@/components/sections/CardGrid";
import { FeatureAccordion } from "@/components/sections/FeatureAccordion";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { PageHero } from "@/components/sections/PageHero";
import { ProductVisualBand } from "@/components/sections/ProductVisualBand";
import { LazySolutionsIndustryCards } from "@/components/product/visuals/lazy";
import { ProseSection } from "@/components/sections/ProseSection";
import { RevealSection } from "@/components/sections/RevealSection";
import {
  healthcareChallenges,
  healthcareFinalCta,
  healthcareHero,
  healthcareHowItRuns,
  healthcareMeta,
  healthcareProof,
  healthcareRegulatory,
} from "@/content/solutions-healthcare";

export const metadata: Metadata = {
  title: healthcareMeta.title,
  description: healthcareMeta.description,
  alternates: { canonical: healthcareMeta.canonical },
};

export default function HealthcareSolutionPage() {
  return (
    <>
      <ScrollDepthTracker />

      <PageHero
        eyebrow={healthcareHero.eyebrow}
        h1={healthcareHero.h1}
        body={healthcareHero.body}
        primaryCta={healthcareHero.primaryCta}
        secondaryCta={healthcareHero.secondaryCta}
        variant="centered"
        location="healthcare_hero"
      />

      <ProductVisualBand>
        <LazySolutionsIndustryCards />
      </ProductVisualBand>

      <RevealSection>
        <CardGrid
          eyebrow={healthcareChallenges.eyebrow}
          heading={healthcareChallenges.heading}
          cards={healthcareChallenges.cards}
          columns={3}
          surface="elevated-dark"
        />
      </RevealSection>

      <RevealSection>
        <FeatureAccordion
          eyebrow={healthcareHowItRuns.eyebrow}
          heading={healthcareHowItRuns.heading}
          intro={healthcareHowItRuns.intro}
          items={healthcareHowItRuns.items}
          section="healthcare_how_it_runs"
        />
      </RevealSection>

      <ProseSection
        eyebrow={healthcareProof.eyebrow}
        heading={healthcareProof.heading}
        paragraphs={healthcareProof.paragraphs}
        surface="light"
      />

      <RevealSection>
        <BulletList
          eyebrow={healthcareRegulatory.eyebrow}
          heading={healthcareRegulatory.heading}
          bullets={healthcareRegulatory.bullets}
          surface="elevated-dark"
        />
      </RevealSection>

      <FinalCTA
        heading={healthcareFinalCta.heading}
        body={healthcareFinalCta.body}
        primaryCta={healthcareFinalCta.primaryCta}
        reassurance={healthcareFinalCta.reassurance}
        location="healthcare_final_cta"
      />
    </>
  );
}
