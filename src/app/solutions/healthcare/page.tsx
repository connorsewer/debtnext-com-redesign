import type { Metadata } from "next";

import { buildMetadata } from "@/lib/seo/metadata";

import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/seo/schema";
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
  healthcareChallenges,
  healthcareFinalCta,
  healthcareHero,
  healthcareHowItRuns,
  healthcareMeta,
  healthcareProof,
  healthcareRegulatory,
} from "@/content/solutions-healthcare";
import {
  healthcareConfig,
  healthcareConsole,
  healthcareReconciliation,
  healthcareRouting,
} from "@/content/visuals/solutions-healthcare";

export const metadata: Metadata = buildMetadata(healthcareMeta);

export default function HealthcareSolutionPage() {
  return (
    <>
      <ScrollDepthTracker />

      <JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Solutions", path: "/solutions" }, { name: "Healthcare", path: "/solutions/healthcare" }])} />

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
        {/* Reserve the resolved Console hero box so the lazy swap does not shift
            layout (CLS guard, Pitfall 1). Authored to the Wave-2 family budget:
            KPI header + 4 rows + callout + 3 pills resolves under
            min-h-[34rem] (544px), matching utilities/insurance per 12-01. */}
        <div className="min-h-[34rem]">
          <ConsoleVisual data={healthcareConsole} />
        </div>
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
          visuals={{
            placement: <SchematicVisual data={healthcareRouting} />,
            optimization: <ConsoleVisual data={healthcareConfig} />,
            reporting: <DataStoryVisual data={healthcareReconciliation} />,
          }}
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
