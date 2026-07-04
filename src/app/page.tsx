import type { Metadata } from "next";

import { buildMetadata } from "@/lib/seo/metadata";

import { ScrollDepthTracker } from "@/components/analytics/ScrollDepthTracker";
import { JsonLd } from "@/components/seo/JsonLd";
import { IntegrationIcon } from "@/components/icons/IntegrationIcons";
import { BenefitSplit } from "@/components/sections/BenefitSplit";
import { FeatureAccordion } from "@/components/sections/FeatureAccordion";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { HomepageHeroHandoff } from "@/components/sections/HomepageHeroHandoff";
import { CardGrid } from "@/components/sections/CardGrid";
import { IntegrationStrip } from "@/components/sections/IntegrationStrip";
import { ProofBand } from "@/components/sections/ProofBand";
import { PartnerMap } from "@/components/sections/PartnerMap";
import { LazyDecisionEnginePreview } from "@/components/product/visuals/lazy";
import { ProseIntro } from "@/components/sections/ProseIntro";
import { StatMarquee } from "@/components/sections/StatMarquee";
import { TrustBand } from "@/components/sections/TrustBand";
import { annualActivity } from "@/content/stats";
import {
  homepageBenefitSplit,
  homepageFeatureAccordion,
  homepageFinalCta,
  homepageIntegration,
  homepageMeta,
  homepagePositioning,
  homepageProof,
  homepageService,
  homepageTrust,
} from "@/content/homepage";
import {
  organizationSchema,
  softwareApplicationSchema,
} from "@/lib/seo/schema";

export const metadata: Metadata = buildMetadata(homepageMeta);

export default function HomePage() {
  return (
    <>
      <JsonLd data={organizationSchema()} />
      <JsonLd data={softwareApplicationSchema()} />

      <ScrollDepthTracker />

      {/* Mercury-faithful cinematic hero + platform-handoff pair. A single
          shared client wrapper owns the one GSAP controller that drives both
          the hero pin and the handoff tab progression (desktop, non-reduced
          motion); mobile / reduced motion render static fail-open trees. */}
      <HomepageHeroHandoff />

      <TrustBand
        eyebrow={homepageTrust.eyebrow}
        industries={homepageTrust.industries}
      />

      <ProseIntro
        eyebrow={homepagePositioning.eyebrow}
        heading={homepagePositioning.heading}
        body={homepagePositioning.body}
      />

      <FeatureAccordion
        id="how-it-works"
        section="homepage_feature_accordion"
        eyebrow={homepageFeatureAccordion.eyebrow}
        heading={homepageFeatureAccordion.heading}
        intro={homepageFeatureAccordion.intro}
        items={[...homepageFeatureAccordion.items]}
      />

      <ProofBand
        eyebrow={homepageProof.eyebrow}
        stats={[...homepageProof.stats]}
        link={homepageProof.link}
        linkLocation="homepage_proof"
        surface="elevated-dark"
      />

      <StatMarquee
        eyebrow="Every year on dPlat"
        heading="What the platform handles in a year."
        items={annualActivity}
      />

      <PartnerMap
        eyebrow="Coast to coast"
        heading="A recovery network that spans the country."
        body="500+ agency and legal partners plus client portfolios, connected on one platform. Placements route to the right vendor wherever the account sits."
        caption="Representative of the agency and client network across the United States."
      />

      <BenefitSplit
        heading={homepageBenefitSplit.heading}
        body={homepageBenefitSplit.body}
        bullets={[...homepageBenefitSplit.bullets]}
        link={homepageBenefitSplit.link}
        linkLocation="homepage_decision_engine"
        visual={<LazyDecisionEnginePreview />}
        surface="light"
      />

      <IntegrationStrip
        heading={homepageIntegration.heading}
        body={homepageIntegration.body}
        cards={homepageIntegration.cards.map((card) => ({
          title: card.title,
          body: card.body,
          icon: <IntegrationIcon name={card.iconKey} />,
        }))}
        link={homepageIntegration.link}
      />

      <CardGrid
        eyebrow={homepageService.eyebrow}
        heading={homepageService.heading}
        body={homepageService.body}
        cards={[...homepageService.cards]}
        columns={3}
      />

      <FinalCTA
        heading={homepageFinalCta.heading}
        body={homepageFinalCta.body}
        primaryCta={homepageFinalCta.primaryCta}
        reassurance={homepageFinalCta.reassurance}
        location="homepage_final_cta"
      />
    </>
  );
}
