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
  financialServicesChallenges,
  financialServicesFinalCta,
  financialServicesHero,
  financialServicesHowItRuns,
  financialServicesMeta,
  financialServicesProof,
  financialServicesRegulatory,
} from "@/content/solutions-financial-services";

export const metadata: Metadata = {
  title: financialServicesMeta.title,
  description: financialServicesMeta.description,
  alternates: { canonical: financialServicesMeta.canonical },
};

export default function FinancialServicesSolutionPage() {
  return (
    <>
      <ScrollDepthTracker />

      <PageHero
        eyebrow={financialServicesHero.eyebrow}
        h1={financialServicesHero.h1}
        body={financialServicesHero.body}
        primaryCta={financialServicesHero.primaryCta}
        secondaryCta={financialServicesHero.secondaryCta}
        variant="centered"
        location="financial_services_hero"
      />

      <RevealSection>
        <CardGrid
          eyebrow={financialServicesChallenges.eyebrow}
          heading={financialServicesChallenges.heading}
          cards={financialServicesChallenges.cards}
          columns={3}
          surface="elevated-dark"
        />
      </RevealSection>

      <RevealSection>
        <FeatureAccordion
          eyebrow={financialServicesHowItRuns.eyebrow}
          heading={financialServicesHowItRuns.heading}
          intro={financialServicesHowItRuns.intro}
          items={financialServicesHowItRuns.items}
          section="financial_services_how_it_runs"
        />
      </RevealSection>

      <ProseSection
        eyebrow={financialServicesProof.eyebrow}
        heading={financialServicesProof.heading}
        paragraphs={financialServicesProof.paragraphs}
        surface="light"
      />

      <RevealSection>
        <BulletList
          eyebrow={financialServicesRegulatory.eyebrow}
          heading={financialServicesRegulatory.heading}
          bullets={financialServicesRegulatory.bullets}
          surface="elevated-dark"
        />
      </RevealSection>

      <FinalCTA
        heading={financialServicesFinalCta.heading}
        body={financialServicesFinalCta.body}
        primaryCta={financialServicesFinalCta.primaryCta}
        reassurance={financialServicesFinalCta.reassurance}
        location="financial_services_final_cta"
      />
    </>
  );
}
