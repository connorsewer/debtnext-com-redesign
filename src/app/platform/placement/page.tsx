import type { Metadata } from "next";

import { ScrollDepthTracker } from "@/components/analytics/ScrollDepthTracker";
import { BenefitSplit } from "@/components/sections/BenefitSplit";
import { FeatureAccordion } from "@/components/sections/FeatureAccordion";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { PageHero } from "@/components/sections/PageHero";
import { ProcessStrip } from "@/components/sections/ProcessStrip";
import {
  placementAccordion,
  placementBenefit,
  placementFinalCta,
  placementHero,
  placementMeta,
  placementProcess,
} from "@/content/placement";

export const metadata: Metadata = {
  title: placementMeta.title,
  description: placementMeta.description,
  alternates: { canonical: placementMeta.canonical },
};

export default function PlacementPage() {
  return (
    <>
      <ScrollDepthTracker />

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
      />

      <BenefitSplit
        heading={placementBenefit.heading}
        body={placementBenefit.body}
        bullets={placementBenefit.bullets}
        media={placementBenefit.media}
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
