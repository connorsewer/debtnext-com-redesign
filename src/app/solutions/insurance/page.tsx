import type { Metadata } from "next";

import { buildMetadata } from "@/lib/seo/metadata";

import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { ScrollDepthTracker } from "@/components/analytics/ScrollDepthTracker";
import { BulletList } from "@/components/sections/BulletList";
import { CardGrid } from "@/components/sections/CardGrid";
import { FAQSection } from "@/components/sections/FAQSection";
import { FeatureAccordion } from "@/components/sections/FeatureAccordion";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { PageHero } from "@/components/sections/PageHero";
import { ProductVisualBand } from "@/components/sections/ProductVisualBand";
import {
  ConsoleVisual,
  DataStoryVisual,
  SchematicVisual,
} from "@/components/product/visuals/archetypes";
import { ProseSection } from "@/components/sections/ProseSection";
import { RevealSection } from "@/components/sections/RevealSection";
import { faqPageSchema } from "@/lib/seo/schema";
import {
  insuranceChallenges,
  insuranceFaq,
  insuranceFinalCta,
  insuranceHero,
  insuranceHowItRuns,
  insuranceMeta,
  insuranceProof,
  insuranceRegulatory,
} from "@/content/solutions-insurance";
import {
  insuranceConfig,
  insuranceConsole,
  insuranceReconciliation,
  insuranceRouting,
} from "@/content/visuals/solutions-insurance";

export const metadata: Metadata = buildMetadata(insuranceMeta);

export default function InsuranceSolutionPage() {
  return (
    <>
      <ScrollDepthTracker />

      <JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Solutions", path: "/solutions" }, { name: "Insurance", path: "/solutions/insurance" }])} />

      <PageHero
        eyebrow={insuranceHero.eyebrow}
        h1={insuranceHero.h1}
        body={insuranceHero.body}
        primaryCta={insuranceHero.primaryCta}
        secondaryCta={insuranceHero.secondaryCta}
        variant="centered"
        location="insurance_hero"
      />

      <ProductVisualBand>
        {/* Reserve the resolved Console hero box so the lazy swap (20rem
            skeleton) does not shift layout (CLS guard, Pitfall 1). Authored to
            the locked min-h-[34rem] (544px) Wave-2 hero budget: KPI header + 4
            rows + callout + 3 pills. */}
        <div className="min-h-[34rem]">
          <ConsoleVisual data={insuranceConsole} />
        </div>
      </ProductVisualBand>

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
          visuals={{
            placement: <SchematicVisual data={insuranceRouting} />,
            optimization: <ConsoleVisual data={insuranceConfig} />,
            reporting: <DataStoryVisual data={insuranceReconciliation} />,
          }}
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

      <FAQSection
        heading={insuranceFaq.heading}
        intro={insuranceFaq.intro}
        items={insuranceFaq.items}
        section="insurance_faq"
        surface="dark"
      />
      <JsonLd data={faqPageSchema(insuranceFaq.items)} />

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
