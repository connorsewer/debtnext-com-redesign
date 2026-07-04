import type { Metadata } from "next";

import { buildMetadata } from "@/lib/seo/metadata";

import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { ScrollDepthTracker } from "@/components/analytics/ScrollDepthTracker";
import { BulletList } from "@/components/sections/BulletList";
import { CardGrid } from "@/components/sections/CardGrid";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { PageHero } from "@/components/sections/PageHero";
import { ProseSection } from "@/components/sections/ProseSection";
import { RevealSection } from "@/components/sections/RevealSection";
import {
  leadershipApproach,
  leadershipFinalCta,
  leadershipHero,
  leadershipHow,
  leadershipMeta,
  leadershipTeam,
} from "@/content/company-leadership";

export const metadata: Metadata = buildMetadata(leadershipMeta);

export default function LeadershipPage() {
  return (
    <>
      <ScrollDepthTracker />

      <JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Company", path: "/company" }, { name: "Leadership", path: "/company/leadership" }])} />

      <PageHero
        eyebrow={leadershipHero.eyebrow}
        h1={leadershipHero.h1}
        body={leadershipHero.body}
        primaryCta={leadershipHero.primaryCta}
        secondaryCta={leadershipHero.secondaryCta}
        variant="centered"
        location="leadership_hero"
      />

      <ProseSection
        eyebrow={leadershipApproach.eyebrow}
        heading={leadershipApproach.heading}
        paragraphs={leadershipApproach.paragraphs}
      />

      <RevealSection>
        <CardGrid
          eyebrow={leadershipTeam.eyebrow}
          heading={leadershipTeam.heading}
          cards={leadershipTeam.cards}
          columns={3}
          surface="elevated-dark"
        />
      </RevealSection>

      <RevealSection>
        <BulletList
          eyebrow={leadershipHow.eyebrow}
          heading={leadershipHow.heading}
          bullets={leadershipHow.bullets}
          surface="dark"
        />
      </RevealSection>

      <FinalCTA
        heading={leadershipFinalCta.heading}
        body={leadershipFinalCta.body}
        primaryCta={leadershipFinalCta.primaryCta}
        reassurance={leadershipFinalCta.reassurance}
        location="leadership_final_cta"
      />
    </>
  );
}
