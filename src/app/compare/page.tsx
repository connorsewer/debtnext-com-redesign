import type { Metadata } from "next";

import { ScrollDepthTracker } from "@/components/analytics/ScrollDepthTracker";
import { BulletList } from "@/components/sections/BulletList";
import { CardGrid } from "@/components/sections/CardGrid";
import { CompareMatrix } from "@/components/sections/CompareMatrix";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { LeadershipTable } from "@/components/sections/LeadershipTable";
import { PageHero } from "@/components/sections/PageHero";
import { ProofBand } from "@/components/sections/ProofBand";
import { ProseIntro } from "@/components/sections/ProseIntro";
import { ProseSection } from "@/components/sections/ProseSection";
import {
  compareBestFit,
  compareDifferentiators,
  compareFinalCta,
  compareHero,
  compareLeadership,
  compareMarket,
  compareMatrix,
  compareMeta,
  comparePillars,
  compareProof,
  compareTeamIntro,
} from "@/content/compare";

export const metadata: Metadata = {
  title: compareMeta.title,
  description: compareMeta.description,
  alternates: { canonical: compareMeta.canonical },
};

export default function ComparePage() {
  return (
    <>
      <ScrollDepthTracker />

      <PageHero
        eyebrow={compareHero.eyebrow}
        h1={compareHero.h1}
        body={compareHero.body}
        primaryCta={compareHero.primaryCta}
        variant="centered"
        location="compare_hero"
      />

      <ProseSection
        eyebrow={compareMarket.eyebrow}
        heading={compareMarket.heading}
        paragraphs={compareMarket.paragraphs}
      />

      <CompareMatrix
        eyebrow={compareMatrix.eyebrow}
        heading={compareMatrix.heading}
        body={compareMatrix.body}
        platforms={compareMatrix.platforms}
      />

      <CardGrid
        heading={compareDifferentiators.heading}
        cards={compareDifferentiators.cards}
        columns={3}
        surface="elevated-dark"
      />

      <ProseIntro
        eyebrow={compareTeamIntro.eyebrow}
        heading={compareTeamIntro.heading}
        body={compareTeamIntro.body}
      />

      <LeadershipTable
        heading={compareLeadership.heading}
        body={compareLeadership.body}
        leaders={compareLeadership.leaders}
        surface="dark"
      />

      <CardGrid
        heading={comparePillars.heading}
        cards={comparePillars.cards}
        columns={3}
        surface="elevated-dark"
      />

      <BulletList
        eyebrow={compareBestFit.eyebrow}
        heading={compareBestFit.heading}
        body={compareBestFit.body}
        bullets={compareBestFit.bullets}
        surface="dark"
      />

      <ProofBand
        eyebrow={compareProof.eyebrow}
        heading={compareProof.heading}
        stats={compareProof.stats}
        surface="elevated-dark"
      />

      <FinalCTA
        heading={compareFinalCta.heading}
        body={compareFinalCta.body}
        primaryCta={compareFinalCta.primaryCta}
        reassurance={compareFinalCta.reassurance}
        location="compare_final_cta"
      />
    </>
  );
}
