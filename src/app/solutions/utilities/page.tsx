import type { Metadata } from "next";

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
  utilitiesChallenges,
  utilitiesFinalCta,
  utilitiesHero,
  utilitiesHowItRuns,
  utilitiesMeta,
  utilitiesProof,
  utilitiesRegulatory,
} from "@/content/solutions-utilities";
import {
  utilitiesConfig,
  utilitiesConsole,
  utilitiesReconciliation,
  utilitiesRouting,
} from "@/content/visuals/solutions-utilities";

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
        {/* Reserve the resolved Console hero box so the lazy swap (20rem
            skeleton) does not shift layout (CLS guard, Pitfall 1). The utilities
            hero is authored to a fixed budget: KPI header + 4 rows + callout + 3
            pills resolves under min-h-[34rem] (544px). Wave-2 heroes match this
            box. */}
        <div className="min-h-[34rem]">
          <ConsoleVisual data={utilitiesConsole} />
        </div>
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
          visuals={{
            placement: <SchematicVisual data={utilitiesRouting} />,
            optimization: <ConsoleVisual data={utilitiesConfig} />,
            reporting: <DataStoryVisual data={utilitiesReconciliation} />,
          }}
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
