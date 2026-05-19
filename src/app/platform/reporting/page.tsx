import type { Metadata } from "next";

import { ScrollDepthTracker } from "@/components/analytics/ScrollDepthTracker";
import { BenefitSplit } from "@/components/sections/BenefitSplit";
import { CardGrid } from "@/components/sections/CardGrid";
import { FeatureAccordion } from "@/components/sections/FeatureAccordion";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { PageHero } from "@/components/sections/PageHero";
import { ProseIntro } from "@/components/sections/ProseIntro";
import {
  reportingAccordion,
  reportingBenefit,
  reportingFinalCta,
  reportingHero,
  reportingIntro,
  reportingLayers,
  reportingMeta,
} from "@/content/reporting";

export const metadata: Metadata = {
  title: reportingMeta.title,
  description: reportingMeta.description,
  alternates: { canonical: reportingMeta.canonical },
};

export default function ReportingPage() {
  return (
    <>
      <ScrollDepthTracker />

      <PageHero
        eyebrow={reportingHero.eyebrow}
        h1={reportingHero.h1}
        body={reportingHero.body}
        primaryCta={reportingHero.primaryCta}
        secondaryCta={reportingHero.secondaryCta}
        variant="centered"
        location="reporting_hero"
      />

      <ProseIntro heading={reportingIntro.heading} body={reportingIntro.body} />

      <CardGrid
        heading={reportingLayers.heading}
        cards={reportingLayers.cards}
        columns={3}
        surface="elevated-dark"
      />

      <FeatureAccordion
        section="reporting_accordion"
        heading={reportingAccordion.heading}
        items={reportingAccordion.items}
      />

      <BenefitSplit
        heading={reportingBenefit.heading}
        body={reportingBenefit.body}
        bullets={reportingBenefit.bullets}
        media={reportingBenefit.media}
        surface="light"
      />

      <FinalCTA
        heading={reportingFinalCta.heading}
        body={reportingFinalCta.body}
        primaryCta={reportingFinalCta.primaryCta}
        location="reporting_final_cta"
      />
    </>
  );
}
