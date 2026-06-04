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
  telecomChallenges,
  telecomFinalCta,
  telecomHero,
  telecomHowItRuns,
  telecomMeta,
  telecomProof,
  telecomRegulatory,
} from "@/content/solutions-telecom";

export const metadata: Metadata = {
  title: telecomMeta.title,
  description: telecomMeta.description,
  alternates: { canonical: telecomMeta.canonical },
};

export default function TelecomSolutionPage() {
  return (
    <>
      <ScrollDepthTracker />

      <PageHero
        eyebrow={telecomHero.eyebrow}
        h1={telecomHero.h1}
        body={telecomHero.body}
        primaryCta={telecomHero.primaryCta}
        secondaryCta={telecomHero.secondaryCta}
        variant="centered"
        location="telecom_hero"
      />

      <ProductVisualBand>
        <LazySolutionsIndustryCards />
      </ProductVisualBand>

      <RevealSection>
        <CardGrid
          eyebrow={telecomChallenges.eyebrow}
          heading={telecomChallenges.heading}
          cards={telecomChallenges.cards}
          columns={3}
          surface="elevated-dark"
        />
      </RevealSection>

      <RevealSection>
        <FeatureAccordion
          eyebrow={telecomHowItRuns.eyebrow}
          heading={telecomHowItRuns.heading}
          intro={telecomHowItRuns.intro}
          items={telecomHowItRuns.items}
          section="telecom_how_it_runs"
        />
      </RevealSection>

      <ProseSection
        eyebrow={telecomProof.eyebrow}
        heading={telecomProof.heading}
        paragraphs={telecomProof.paragraphs}
        surface="light"
      />

      <RevealSection>
        <BulletList
          eyebrow={telecomRegulatory.eyebrow}
          heading={telecomRegulatory.heading}
          bullets={telecomRegulatory.bullets}
          surface="elevated-dark"
        />
      </RevealSection>

      <FinalCTA
        heading={telecomFinalCta.heading}
        body={telecomFinalCta.body}
        primaryCta={telecomFinalCta.primaryCta}
        reassurance={telecomFinalCta.reassurance}
        location="telecom_final_cta"
      />
    </>
  );
}
