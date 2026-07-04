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
import { ProseIntro } from "@/components/sections/ProseIntro";
import {
  ConsoleVisual,
  DataStoryVisual,
  SchematicVisual,
} from "@/components/product/visuals/archetypes";
import { LazyIssuesFlagship } from "@/components/product/visuals/lazy";
import {
  issuesAccordion,
  issuesBenefit,
  issuesFinalCta,
  issuesHero,
  issuesIntro,
  issuesMeta,
  issuesProcess,
} from "@/content/issues";
import {
  issuesAudit,
  issuesAutoHandling,
  issuesSla,
  issuesVendorPortal,
  issuesWorkflows,
} from "@/content/visuals";

export const metadata: Metadata = buildMetadata(issuesMeta);

export default function IssuesPage() {
  return (
    <>
      <ScrollDepthTracker />

      <JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Platform", path: "/platform" }, { name: "Issues", path: "/platform/issues" }])} />

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
        visuals={{
          "auto-handling": <ConsoleVisual data={issuesAutoHandling} />,
          workflows: <SchematicVisual data={issuesWorkflows} />,
          "vendor-portal": <ConsoleVisual data={issuesVendorPortal} />,
          sla: <ConsoleVisual data={issuesSla} />,
          audit: <DataStoryVisual data={issuesAudit} />,
        }}
      />

      <BenefitSplit
        heading={issuesBenefit.heading}
        body={issuesBenefit.body}
        bullets={issuesBenefit.bullets}
        visual={<LazyIssuesFlagship />}
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
