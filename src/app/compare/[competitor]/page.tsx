import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ScrollDepthTracker } from "@/components/analytics/ScrollDepthTracker";
import { CardGrid } from "@/components/sections/CardGrid";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { PageHero } from "@/components/sections/PageHero";
import { ProseSection } from "@/components/sections/ProseSection";
import {
  competitorComparisons,
  getCompetitorComparison,
} from "@/content/compare-competitors";

type Params = { competitor: string };

export function generateStaticParams(): Params[] {
  return competitorComparisons.map((c) => ({ competitor: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { competitor } = await params;
  const data = getCompetitorComparison(competitor);
  if (!data) return {};
  return {
    title: data.meta.title,
    description: data.meta.description,
    alternates: { canonical: data.meta.canonical },
  };
}

export default async function CompetitorComparePage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { competitor } = await params;
  const data = getCompetitorComparison(competitor);
  if (!data) notFound();

  return (
    <>
      <ScrollDepthTracker />

      <PageHero
        eyebrow={data.hero.eyebrow}
        h1={data.hero.h1}
        body={data.hero.body}
        primaryCta={data.hero.primaryCta}
        variant="centered"
        location={`compare_${data.slug}_hero`}
      />

      <ProseSection
        heading={data.builtFor.heading}
        paragraphs={data.builtFor.paragraphs}
        surface="dark"
      />

      <ProseSection
        heading={data.stops.heading}
        paragraphs={data.stops.paragraphs}
        surface="elevated-dark"
      />

      <ProseSection
        heading={data.differs.heading}
        paragraphs={data.differs.paragraphs}
        surface="dark"
      />

      <CardGrid
        heading={data.chooseWhich.heading}
        cards={[
          {
            title: data.chooseWhich.chooseThem.title,
            body: data.chooseWhich.chooseThem.body,
          },
          {
            title: data.chooseWhich.chooseDplat.title,
            body: data.chooseWhich.chooseDplat.body,
          },
        ]}
        columns={2}
        surface="elevated-dark"
      />

      <FinalCTA
        heading={data.finalCta.heading}
        body={data.finalCta.body}
        primaryCta={data.finalCta.primaryCta}
        reassurance={data.finalCta.reassurance}
        location={`compare_${data.slug}_final_cta`}
      />
    </>
  );
}
