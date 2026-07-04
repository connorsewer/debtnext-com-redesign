import type { Metadata } from "next";

import { buildMetadata } from "@/lib/seo/metadata";

import { ScrollDepthTracker } from "@/components/analytics/ScrollDepthTracker";
import { BulletList } from "@/components/sections/BulletList";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { PageHero } from "@/components/sections/PageHero";
import { ProseSection } from "@/components/sections/ProseSection";
import { RevealSection } from "@/components/sections/RevealSection";
import {
  careersFinalCta,
  careersHero,
  careersHow,
  careersMeta,
  careersOpenRoles,
  careersWork,
} from "@/content/company-careers";

export const metadata: Metadata = buildMetadata(careersMeta);

export default function CareersPage() {
  return (
    <>
      <ScrollDepthTracker />

      <PageHero
        eyebrow={careersHero.eyebrow}
        h1={careersHero.h1}
        body={careersHero.body}
        primaryCta={careersHero.primaryCta}
        secondaryCta={careersHero.secondaryCta}
        variant="centered"
        location="careers_hero"
      />

      <ProseSection
        eyebrow={careersWork.eyebrow}
        heading={careersWork.heading}
        paragraphs={careersWork.paragraphs}
      />

      <RevealSection>
        <BulletList
          eyebrow={careersHow.eyebrow}
          heading={careersHow.heading}
          bullets={careersHow.bullets}
          surface="elevated-dark"
        />
      </RevealSection>

      <ProseSection
        eyebrow={careersOpenRoles.eyebrow}
        heading={careersOpenRoles.heading}
        paragraphs={careersOpenRoles.paragraphs}
      />

      <FinalCTA
        heading={careersFinalCta.heading}
        body={careersFinalCta.body}
        primaryCta={careersFinalCta.primaryCta}
        location="careers_final_cta"
      />
    </>
  );
}
