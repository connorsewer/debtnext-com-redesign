import type { Metadata } from "next";

import { ScrollDepthTracker } from "@/components/analytics/ScrollDepthTracker";
import { CardGrid } from "@/components/sections/CardGrid";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { PageHero } from "@/components/sections/PageHero";
import { ProseSection } from "@/components/sections/ProseSection";
import {
  pricingDrivers,
  pricingFinalCta,
  pricingHero,
  pricingMeta,
  pricingNoTrial,
  pricingProposal,
} from "@/content/pricing";

export const metadata: Metadata = {
  title: pricingMeta.title,
  description: pricingMeta.description,
  alternates: { canonical: pricingMeta.canonical },
};

export default function PricingPage() {
  return (
    <>
      <ScrollDepthTracker />

      <PageHero
        eyebrow={pricingHero.eyebrow}
        h1={pricingHero.h1}
        body={pricingHero.body}
        primaryCta={pricingHero.primaryCta}
        variant="centered"
        location="pricing_hero"
      />

      <CardGrid
        heading={pricingDrivers.heading}
        body={pricingDrivers.body}
        cards={pricingDrivers.cards}
        columns={2}
        surface="elevated-dark"
      />

      <ProseSection
        heading={pricingProposal.heading}
        paragraphs={pricingProposal.paragraphs}
        surface="dark"
      />

      <ProseSection
        heading={pricingNoTrial.heading}
        paragraphs={pricingNoTrial.paragraphs}
        surface="elevated-dark"
      />

      <FinalCTA
        heading={pricingFinalCta.heading}
        body={pricingFinalCta.body}
        primaryCta={pricingFinalCta.primaryCta}
        reassurance={pricingFinalCta.reassurance}
        location="pricing_final_cta"
      />
    </>
  );
}
