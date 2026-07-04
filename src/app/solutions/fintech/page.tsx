import type { Metadata } from "next";

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
  fintechChallenges,
  fintechFaq,
  fintechFinalCta,
  fintechHero,
  fintechHowItRuns,
  fintechMeta,
  fintechProof,
  fintechRegulatory,
} from "@/content/solutions-fintech";
import {
  fintechConfig,
  fintechConsole,
  fintechConsolidation,
  fintechRouting,
} from "@/content/visuals/solutions-fintech";

export const metadata: Metadata = {
  title: fintechMeta.title,
  description: fintechMeta.description,
  alternates: { canonical: fintechMeta.canonical },
};

export default function FintechSolutionPage() {
  return (
    <>
      <ScrollDepthTracker />

      <PageHero
        eyebrow={fintechHero.eyebrow}
        h1={fintechHero.h1}
        body={fintechHero.body}
        primaryCta={fintechHero.primaryCta}
        secondaryCta={fintechHero.secondaryCta}
        variant="centered"
        location="fintech_hero"
      />

      <ProductVisualBand>
        {/* Reserve the resolved Console hero box so the lazy swap (20rem
            skeleton) does not shift layout (CLS guard, Pitfall 1). Authored to
            the locked min-h-[34rem] (544px) Wave-2 hero budget: KPI header + 4
            rows + callout + 3 pills. */}
        <div className="min-h-[34rem]">
          <ConsoleVisual data={fintechConsole} />
        </div>
      </ProductVisualBand>

      <RevealSection>
        <CardGrid
          eyebrow={fintechChallenges.eyebrow}
          heading={fintechChallenges.heading}
          cards={fintechChallenges.cards}
          columns={3}
          surface="elevated-dark"
        />
      </RevealSection>

      <RevealSection>
        <FeatureAccordion
          eyebrow={fintechHowItRuns.eyebrow}
          heading={fintechHowItRuns.heading}
          intro={fintechHowItRuns.intro}
          items={fintechHowItRuns.items}
          section="fintech_how_it_runs"
          visuals={{
            placement: <SchematicVisual data={fintechRouting} />,
            optimization: <ConsoleVisual data={fintechConfig} />,
            reporting: <DataStoryVisual data={fintechConsolidation} />,
          }}
        />
      </RevealSection>

      <ProseSection
        eyebrow={fintechProof.eyebrow}
        heading={fintechProof.heading}
        paragraphs={fintechProof.paragraphs}
        surface="light"
      />

      <RevealSection>
        <BulletList
          eyebrow={fintechRegulatory.eyebrow}
          heading={fintechRegulatory.heading}
          bullets={fintechRegulatory.bullets}
          surface="elevated-dark"
        />
      </RevealSection>

      <FAQSection
        heading={fintechFaq.heading}
        intro={fintechFaq.intro}
        items={fintechFaq.items}
        section="fintech_faq"
        surface="dark"
      />
      <JsonLd data={faqPageSchema(fintechFaq.items)} />

      <FinalCTA
        heading={fintechFinalCta.heading}
        body={fintechFinalCta.body}
        primaryCta={fintechFinalCta.primaryCta}
        reassurance={fintechFinalCta.reassurance}
        location="fintech_final_cta"
      />
    </>
  );
}
