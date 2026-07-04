import type { Metadata } from "next";

import { buildMetadata } from "@/lib/seo/metadata";

import { ScrollDepthTracker } from "@/components/analytics/ScrollDepthTracker";
import { CardGrid } from "@/components/sections/CardGrid";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { PageHero } from "@/components/sections/PageHero";
import { ProseSection } from "@/components/sections/ProseSection";
import { RevealSection } from "@/components/sections/RevealSection";
import {
  contactChannels,
  contactFinalCta,
  contactHero,
  contactLocation,
  contactMeta,
} from "@/content/company-contact";

export const metadata: Metadata = buildMetadata(contactMeta);

export default function ContactPage() {
  return (
    <>
      <ScrollDepthTracker />

      <PageHero
        eyebrow={contactHero.eyebrow}
        h1={contactHero.h1}
        body={contactHero.body}
        primaryCta={contactHero.primaryCta}
        variant="centered"
        location="contact_hero"
      />

      <RevealSection>
        <CardGrid
          eyebrow={contactChannels.eyebrow}
          heading={contactChannels.heading}
          cards={contactChannels.cards}
          columns={3}
        />
      </RevealSection>

      <ProseSection
        eyebrow={contactLocation.eyebrow}
        heading={contactLocation.heading}
        paragraphs={contactLocation.paragraphs}
        surface="elevated-dark"
      />

      <FinalCTA
        heading={contactFinalCta.heading}
        body={contactFinalCta.body}
        primaryCta={contactFinalCta.primaryCta}
        reassurance={contactFinalCta.reassurance}
        location="contact_final_cta"
      />
    </>
  );
}
