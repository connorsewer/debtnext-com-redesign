import type { Metadata } from "next";

import { ScrollDepthTracker } from "@/components/analytics/ScrollDepthTracker";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { PageHero } from "@/components/sections/PageHero";
import { ProcessStrip } from "@/components/sections/ProcessStrip";
import { ProseIntro } from "@/components/sections/ProseIntro";
import { ProseSection } from "@/components/sections/ProseSection";
import {
  servicesFinalCta,
  servicesHero,
  servicesMeta,
  servicesMethodIntro,
  servicesOnshore,
  servicesPhases,
  servicesPlatformTeam,
  servicesPortfolioTeam,
} from "@/content/services";

export const metadata: Metadata = {
  title: servicesMeta.title,
  description: servicesMeta.description,
  alternates: { canonical: servicesMeta.canonical },
};

export default function ServicesPage() {
  return (
    <>
      <ScrollDepthTracker />

      <PageHero
        eyebrow={servicesHero.eyebrow}
        h1={servicesHero.h1}
        body={servicesHero.body}
        primaryCta={servicesHero.primaryCta}
        variant="centered"
        location="services_hero"
      />

      <ProseIntro
        eyebrow={servicesMethodIntro.eyebrow}
        heading={servicesMethodIntro.heading}
        body={servicesMethodIntro.body}
        surface="dark"
      />

      <ProcessStrip
        heading="The five phases."
        steps={servicesPhases.steps}
        surface="elevated-dark"
      />

      <ProseSection
        eyebrow={servicesPlatformTeam.eyebrow}
        heading={servicesPlatformTeam.heading}
        paragraphs={servicesPlatformTeam.paragraphs}
        surface="dark"
      />

      <ProseSection
        eyebrow={servicesPortfolioTeam.eyebrow}
        heading={servicesPortfolioTeam.heading}
        paragraphs={servicesPortfolioTeam.paragraphs}
        surface="elevated-dark"
      />

      <ProseSection
        eyebrow={servicesOnshore.eyebrow}
        heading={servicesOnshore.heading}
        paragraphs={servicesOnshore.paragraphs}
        surface="dark"
      />

      <FinalCTA
        heading={servicesFinalCta.heading}
        body={servicesFinalCta.body}
        primaryCta={servicesFinalCta.primaryCta}
        reassurance={servicesFinalCta.reassurance}
        location="services_final_cta"
      />
    </>
  );
}
