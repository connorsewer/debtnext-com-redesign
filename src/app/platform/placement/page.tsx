import type { Metadata } from "next";

import { buildMetadata } from "@/lib/seo/metadata";

import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { ScrollDepthTracker } from "@/components/analytics/ScrollDepthTracker";
import { BenefitSplit } from "@/components/sections/BenefitSplit";
import { FeatureAccordion } from "@/components/sections/FeatureAccordion";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { PageHero } from "@/components/sections/PageHero";
import { ProcessStrip } from "@/components/sections/ProcessStrip";
import {
  ConsoleVisual,
  DataStoryVisual,
  SchematicVisual,
} from "@/components/product/visuals/archetypes";
import { LazyPlacementFlagship } from "@/components/product/visuals/lazy";
import {
  placementAccordion,
  placementBenefit,
  placementFinalCta,
  placementHero,
  placementMeta,
  placementProcess,
} from "@/content/placement";
import {
  placementBusinessRules,
  placementConsole,
  placementReconciliation,
  placementRecall,
  placementVendorPools,
} from "@/content/visuals";

export const metadata: Metadata = buildMetadata(placementMeta);

export default function PlacementPage() {
  return (
    <>
      <ScrollDepthTracker />

      <JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Platform", path: "/platform" }, { name: "Placement", path: "/platform/placement" }])} />

      <PageHero
        eyebrow={placementHero.eyebrow}
        h1={placementHero.h1}
        body={placementHero.body}
        primaryCta={placementHero.primaryCta}
        secondaryCta={placementHero.secondaryCta}
        variant="centered"
        location="placement_hero"
      />

      <ProcessStrip
        heading={placementProcess.heading}
        steps={placementProcess.steps}
      />

      <FeatureAccordion
        section="placement_accordion"
        eyebrow={placementAccordion.eyebrow}
        heading={placementAccordion.heading}
        items={placementAccordion.items}
        visuals={{
          "decision-engine": <ConsoleVisual data={placementConsole} />,
          "vendor-pools": <SchematicVisual data={placementVendorPools} />,
          recall: <SchematicVisual data={placementRecall} />,
          "business-rules": <ConsoleVisual data={placementBusinessRules} />,
          reconciliation: <DataStoryVisual data={placementReconciliation} />,
        }}
      />

      <BenefitSplit
        heading={placementBenefit.heading}
        body={placementBenefit.body}
        bullets={placementBenefit.bullets}
        visual={<LazyPlacementFlagship />}
        surface="light"
      />

      <FinalCTA
        heading={placementFinalCta.heading}
        body={placementFinalCta.body}
        primaryCta={placementFinalCta.primaryCta}
        location="placement_final_cta"
      />
    </>
  );
}
