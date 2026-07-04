import type { Metadata } from "next";

import { buildMetadata } from "@/lib/seo/metadata";

import { ScrollDepthTracker } from "@/components/analytics/ScrollDepthTracker";
import { CardGrid } from "@/components/sections/CardGrid";
import { ComparisonTable } from "@/components/sections/ComparisonTable";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { PageHero } from "@/components/sections/PageHero";
import { ProofBand } from "@/components/sections/ProofBand";
import {
  whyDplatComparison,
  whyDplatDifferentiators,
  whyDplatFinalCta,
  whyDplatHero,
  whyDplatMeta,
  whyDplatProof,
} from "@/content/why-dplat";

export const metadata: Metadata = buildMetadata(whyDplatMeta);

export default function WhyDplatPage() {
  return (
    <>
      <ScrollDepthTracker />

      <PageHero
        eyebrow={whyDplatHero.eyebrow}
        h1={whyDplatHero.h1}
        body={whyDplatHero.body}
        primaryCta={whyDplatHero.primaryCta}
        secondaryCta={whyDplatHero.secondaryCta}
        variant="centered"
        location="why_dplat_hero"
      />

      <CardGrid
        heading={whyDplatDifferentiators.heading}
        cards={whyDplatDifferentiators.cards}
        columns={3}
      />

      <ComparisonTable
        heading={whyDplatComparison.heading}
        body={whyDplatComparison.body}
        columns={whyDplatComparison.columns}
        rows={whyDplatComparison.rows}
        surface="light"
      />

      <ProofBand
        eyebrow={whyDplatProof.eyebrow}
        stats={whyDplatProof.stats}
        surface="dark"
      />

      <FinalCTA
        heading={whyDplatFinalCta.heading}
        body={whyDplatFinalCta.body}
        primaryCta={whyDplatFinalCta.primaryCta}
        location="why_dplat_final_cta"
      />
    </>
  );
}
