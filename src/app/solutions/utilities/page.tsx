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
  utilitiesChallenges,
  utilitiesFinalCta,
  utilitiesHero,
  utilitiesHowItRuns,
  utilitiesMeta,
  utilitiesProof,
  utilitiesRegulatory,
} from "@/content/solutions-utilities";

export const metadata: Metadata = {
  title: utilitiesMeta.title,
  description: utilitiesMeta.description,
  alternates: { canonical: utilitiesMeta.canonical },
};

export default function UtilitiesSolutionPage() {
  return (
    <>
      <ScrollDepthTracker />

      <PageHero
        eyebrow={utilitiesHero.eyebrow}
        h1={utilitiesHero.h1}
        body={utilitiesHero.body}
        primaryCta={utilitiesHero.primaryCta}
        secondaryCta={utilitiesHero.secondaryCta}
        variant="centered"
        location="utilities_hero"
      />

      <ProductVisualBand>
        <LazySolutionsIndustryCards />
      </ProductVisualBand>

      <RevealSection>
        <CardGrid
          eyebrow={utilitiesChallenges.eyebrow}
          heading={utilitiesChallenges.heading}
          cards={utilitiesChallenges.cards}
          columns={3}
          surface="elevated-dark"
        />
      </RevealSection>

      <RevealSection>
        <FeatureAccordion
          eyebrow={utilitiesHowItRuns.eyebrow}
          heading={utilitiesHowItRuns.heading}
          intro={utilitiesHowItRuns.intro}
          items={utilitiesHowItRuns.items}
          section="utilities_how_it_runs"
        />
      </RevealSection>

      <ProseSection
        eyebrow={utilitiesProof.eyebrow}
        heading={utilitiesProof.heading}
        paragraphs={utilitiesProof.paragraphs}
        surface="light"
      />

      <RevealSection>
        <BulletList
          eyebrow={utilitiesRegulatory.eyebrow}
          heading={utilitiesRegulatory.heading}
          bullets={utilitiesRegulatory.bullets}
          surface="elevated-dark"
        />
      </RevealSection>

      <FinalCTA
        heading={utilitiesFinalCta.heading}
        body={utilitiesFinalCta.body}
        primaryCta={utilitiesFinalCta.primaryCta}
        reassurance={utilitiesFinalCta.reassurance}
        location="utilities_final_cta"
      />
    </>
  );
}
