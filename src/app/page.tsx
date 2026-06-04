import type { Metadata } from "next";

import { ScrollDepthTracker } from "@/components/analytics/ScrollDepthTracker";
import { IntegrationIcon } from "@/components/icons/IntegrationIcons";
import { BenefitSplit } from "@/components/sections/BenefitSplit";
import { FeatureAccordion } from "@/components/sections/FeatureAccordion";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { HomepageHandoffSection } from "@/components/sections/HomepageHandoffSection";
import { HomepageHero } from "@/components/sections/HomepageHero";
import { IntegrationStrip } from "@/components/sections/IntegrationStrip";
import { ProofBand } from "@/components/sections/ProofBand";
import { TrustBand } from "@/components/sections/TrustBand";
import {
  homepageBenefitSplit,
  homepageFeatureAccordion,
  homepageFinalCta,
  homepageIntegration,
  homepageMeta,
  homepageProof,
  homepageTrust,
} from "@/content/homepage";

export const metadata: Metadata = {
  title: homepageMeta.title,
  description: homepageMeta.description,
  alternates: { canonical: homepageMeta.canonical },
};

export default function HomePage() {
  return (
    <>
      <ScrollDepthTracker />

      {/* Mercury-faithful cinematic hero. 300vh scroll-scrubbed sequence
          on desktop; static start-frame fallback on ≤768px. */}
      <HomepageHero />

      {/* The accounts panel docks here after the scrub completes. */}
      <HomepageHandoffSection />

      <TrustBand
        eyebrow={homepageTrust.eyebrow}
        industries={homepageTrust.industries}
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

      <BenefitSplit
        heading={homepageBenefitSplit.heading}
        body={homepageBenefitSplit.body}
        bullets={[...homepageBenefitSplit.bullets]}
        link={homepageBenefitSplit.link}
        linkLocation="homepage_decision_engine"
        media={homepageBenefitSplit.media}
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
