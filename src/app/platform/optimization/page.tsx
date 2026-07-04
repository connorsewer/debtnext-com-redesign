import type { Metadata } from "next";

import { buildMetadata } from "@/lib/seo/metadata";

import { ScrollDepthTracker } from "@/components/analytics/ScrollDepthTracker";
import { BenefitSplit } from "@/components/sections/BenefitSplit";
import { FeatureAccordion } from "@/components/sections/FeatureAccordion";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { PageHero } from "@/components/sections/PageHero";
import { ProcessStrip } from "@/components/sections/ProcessStrip";
import { ProseIntro } from "@/components/sections/ProseIntro";
import {
  ConsoleVisual,
  DataStoryVisual,
} from "@/components/product/visuals/archetypes";
import { LazyOptimizationFlagship } from "@/components/product/visuals/lazy";
import {
  optimizationAccordion,
  optimizationBenefit,
  optimizationFinalCta,
  optimizationHero,
  optimizationIntro,
  optimizationMeta,
  optimizationProcess,
} from "@/content/optimization";
import {
  optimizationBands,
  optimizationBonus,
  optimizationHistory,
  optimizationShare,
} from "@/content/visuals";

export const metadata: Metadata = buildMetadata(optimizationMeta);

export default function OptimizationPage() {
  return (
    <>
      <ScrollDepthTracker />

      <PageHero
        eyebrow={optimizationHero.eyebrow}
        h1={optimizationHero.h1}
        body={optimizationHero.body}
        primaryCta={optimizationHero.primaryCta}
        secondaryCta={optimizationHero.secondaryCta}
        variant="centered"
        location="optimization_hero"
      />

      <ProseIntro
        heading={optimizationIntro.heading}
        body={optimizationIntro.body}
      />

      <ProcessStrip
        heading={optimizationProcess.heading}
        steps={optimizationProcess.steps}
      />

      <FeatureAccordion
        section="optimization_accordion"
        heading={optimizationAccordion.heading}
        items={optimizationAccordion.items}
        visuals={{
          bands: <DataStoryVisual data={optimizationBands} />,
          share: <ConsoleVisual data={optimizationShare} />,
          bonus: <ConsoleVisual data={optimizationBonus} />,
          history: <DataStoryVisual data={optimizationHistory} />,
        }}
      />

      <BenefitSplit
        heading={optimizationBenefit.heading}
        body={optimizationBenefit.body}
        bullets={optimizationBenefit.bullets}
        visual={<LazyOptimizationFlagship />}
        surface="light"
      />

      <FinalCTA
        heading={optimizationFinalCta.heading}
        body={optimizationFinalCta.body}
        primaryCta={optimizationFinalCta.primaryCta}
        location="optimization_final_cta"
      />
    </>
  );
}
