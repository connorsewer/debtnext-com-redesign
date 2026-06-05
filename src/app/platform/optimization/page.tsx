import type { Metadata } from "next";

import { ScrollDepthTracker } from "@/components/analytics/ScrollDepthTracker";
import { BenefitSplit } from "@/components/sections/BenefitSplit";
import { FeatureAccordion } from "@/components/sections/FeatureAccordion";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { PageHero } from "@/components/sections/PageHero";
import { ProcessStrip } from "@/components/sections/ProcessStrip";
import { ProseIntro } from "@/components/sections/ProseIntro";
import { LazyOptimizationEngine } from "@/components/product/visuals/lazy";
import {
  optimizationAccordion,
  optimizationBenefit,
  optimizationFinalCta,
  optimizationHero,
  optimizationIntro,
  optimizationMeta,
  optimizationProcess,
} from "@/content/optimization";

export const metadata: Metadata = {
  title: optimizationMeta.title,
  description: optimizationMeta.description,
  alternates: { canonical: optimizationMeta.canonical },
};

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
      />

      <BenefitSplit
        heading={optimizationBenefit.heading}
        body={optimizationBenefit.body}
        bullets={optimizationBenefit.bullets}
        visual={<LazyOptimizationEngine />}
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
