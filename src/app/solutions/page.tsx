import type { Metadata } from "next";

import { ScrollDepthTracker } from "@/components/analytics/ScrollDepthTracker";
import { BenefitSplit } from "@/components/sections/BenefitSplit";
import { BulletList } from "@/components/sections/BulletList";
import { CardGrid } from "@/components/sections/CardGrid";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { PageHero } from "@/components/sections/PageHero";
import { LazySolutionsIndustryCards } from "@/components/product/visuals/lazy";
import {
  solutionsCompliance,
  solutionsCrossIndustry,
  solutionsFinalCta,
  solutionsHero,
  solutionsIndustries,
  solutionsMeta,
} from "@/content/solutions";

export const metadata: Metadata = {
  title: solutionsMeta.title,
  description: solutionsMeta.description,
  alternates: { canonical: solutionsMeta.canonical },
};

export default function SolutionsPage() {
  return (
    <>
      <ScrollDepthTracker />

      <PageHero
        eyebrow={solutionsHero.eyebrow}
        h1={solutionsHero.h1}
        body={solutionsHero.body}
        primaryCta={solutionsHero.primaryCta}
        variant="centered"
        location="solutions_hero"
      />

      <CardGrid
        heading={solutionsIndustries.heading}
        body={solutionsIndustries.body}
        cards={solutionsIndustries.cards}
        columns={2}
      />

      <BenefitSplit
        heading={solutionsCrossIndustry.heading}
        body={solutionsCrossIndustry.body}
        bullets={solutionsCrossIndustry.bullets}
        visual={<LazySolutionsIndustryCards />}
        surface="light"
      />

      <BulletList
        heading={solutionsCompliance.heading}
        body={solutionsCompliance.body}
        bullets={solutionsCompliance.bullets}
        surface="elevated-dark"
      />

      <FinalCTA
        heading={solutionsFinalCta.heading}
        body={solutionsFinalCta.body}
        primaryCta={solutionsFinalCta.primaryCta}
        location="solutions_final_cta"
      />
    </>
  );
}
