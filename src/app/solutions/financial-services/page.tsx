import type { Metadata } from "next";

import { buildMetadata } from "@/lib/seo/metadata";

import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { ScrollDepthTracker } from "@/components/analytics/ScrollDepthTracker";
import { JsonLd } from "@/components/seo/JsonLd";
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
  financialServicesChallenges,
  financialServicesFaq,
  financialServicesFinalCta,
  financialServicesHero,
  financialServicesHowItRuns,
  financialServicesMeta,
  financialServicesProof,
  financialServicesRegulatory,
} from "@/content/solutions-financial-services";
import {
  financialServicesConsole,
  financialServicesExceptions,
  financialServicesRouting,
  financialServicesSettlement,
} from "@/content/visuals/solutions-financial-services";

export const metadata: Metadata = buildMetadata(financialServicesMeta);

export default function FinancialServicesSolutionPage() {
  return (
    <>
      <ScrollDepthTracker />

      <JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Solutions", path: "/solutions" }, { name: "Financial services", path: "/solutions/financial-services" }])} />

      <PageHero
        eyebrow={financialServicesHero.eyebrow}
        h1={financialServicesHero.h1}
        body={financialServicesHero.body}
        primaryCta={financialServicesHero.primaryCta}
        secondaryCta={financialServicesHero.secondaryCta}
        variant="centered"
        location="financial_services_hero"
      />

      <ProductVisualBand>
        {/* Reserve the resolved Console hero box so the lazy swap (20rem
            skeleton) does not shift layout (CLS guard, Pitfall 1). Authored to
            the Wave-2 hero budget locked in 12-01-SUMMARY: KPI header + 4 rows +
            callout + 3 pills resolves under min-h-[34rem] (544px). */}
        <div className="min-h-[34rem]">
          <ConsoleVisual data={financialServicesConsole} />
        </div>
      </ProductVisualBand>

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
          visuals={{
            placement: <SchematicVisual data={financialServicesRouting} />,
            issues: <DataStoryVisual data={financialServicesExceptions} />,
            optimization: <ConsoleVisual data={financialServicesSettlement} />,
          }}
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

      <FAQSection
        heading={financialServicesFaq.heading}
        intro={financialServicesFaq.intro}
        items={financialServicesFaq.items}
        section="financial_services_faq"
        surface="dark"
      />
      <JsonLd data={faqPageSchema(financialServicesFaq.items)} />

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
