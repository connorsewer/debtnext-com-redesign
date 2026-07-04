import type { Metadata } from "next";

import { buildMetadata } from "@/lib/seo/metadata";

import { ScrollDepthTracker } from "@/components/analytics/ScrollDepthTracker";
import { BulletList } from "@/components/sections/BulletList";
import { CardGrid } from "@/components/sections/CardGrid";
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
import {
  telecomChallenges,
  telecomFinalCta,
  telecomHero,
  telecomHowItRuns,
  telecomMeta,
  telecomProof,
  telecomRegulatory,
} from "@/content/solutions-telecom";
import {
  telecomConsole,
  telecomPrepaidPostpaid,
  telecomRecall,
  telecomRouting,
} from "@/content/visuals/solutions-telecom";

export const metadata: Metadata = buildMetadata(telecomMeta);

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
        {/* Reserve the resolved Console hero box so the lazy swap (20rem
            skeleton) does not shift layout (CLS guard, Pitfall 1). Authored to
            the Wave-2 hero budget locked in 12-01-SUMMARY: KPI header + 4 rows +
            callout + 3 pills resolves under min-h-[34rem] (544px). */}
        <div className="min-h-[34rem]">
          <ConsoleVisual data={telecomConsole} />
        </div>
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
          visuals={{
            placement: <SchematicVisual data={telecomRouting} />,
            optimization: <ConsoleVisual data={telecomRecall} />,
            issues: <DataStoryVisual data={telecomPrepaidPostpaid} />,
          }}
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
