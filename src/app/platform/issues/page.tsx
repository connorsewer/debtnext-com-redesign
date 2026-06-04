import type { Metadata } from "next";

import { ScrollDepthTracker } from "@/components/analytics/ScrollDepthTracker";
import { BenefitSplit } from "@/components/sections/BenefitSplit";
import { FeatureAccordion } from "@/components/sections/FeatureAccordion";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { PageHero } from "@/components/sections/PageHero";
import { ProcessStrip } from "@/components/sections/ProcessStrip";
import { ProseIntro } from "@/components/sections/ProseIntro";
import { LazyIssuesWorklist } from "@/components/product/visuals/lazy";
import {
  issuesAccordion,
  issuesBenefit,
  issuesFinalCta,
  issuesHero,
  issuesIntro,
  issuesMeta,
  issuesProcess,
} from "@/content/issues";

export const metadata: Metadata = {
  title: issuesMeta.title,
  description: issuesMeta.description,
  alternates: { canonical: issuesMeta.canonical },
};

export default function IssuesPage() {
  return (
    <>
      <ScrollDepthTracker />

      <PageHero
        eyebrow={issuesHero.eyebrow}
        h1={issuesHero.h1}
        body={issuesHero.body}
        primaryCta={issuesHero.primaryCta}
        secondaryCta={issuesHero.secondaryCta}
        variant="centered"
        location="issues_hero"
      />

      <ProseIntro heading={issuesIntro.heading} body={issuesIntro.body} />

      <ProcessStrip heading={issuesProcess.heading} steps={issuesProcess.steps} />

      <FeatureAccordion
        section="issues_accordion"
        heading={issuesAccordion.heading}
        items={issuesAccordion.items}
      />

      <BenefitSplit
        heading={issuesBenefit.heading}
        body={issuesBenefit.body}
        bullets={issuesBenefit.bullets}
        media={issuesBenefit.media}
        visual={<LazyIssuesWorklist />}
        surface="light"
      />

      <FinalCTA
        heading={issuesFinalCta.heading}
        body={issuesFinalCta.body}
        primaryCta={issuesFinalCta.primaryCta}
        location="issues_final_cta"
      />
    </>
  );
}
