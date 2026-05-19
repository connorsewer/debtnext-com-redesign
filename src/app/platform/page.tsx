import type { Metadata } from "next";

import { ScrollDepthTracker } from "@/components/analytics/ScrollDepthTracker";
import { BulletList } from "@/components/sections/BulletList";
import { CardGrid } from "@/components/sections/CardGrid";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { PageHero } from "@/components/sections/PageHero";
import { ProcessStrip } from "@/components/sections/ProcessStrip";
import {
  platformCapabilities,
  platformFinalCta,
  platformHero,
  platformIntegrations,
  platformMeta,
  platformProcess,
  platformSecurity,
} from "@/content/platform";

export const metadata: Metadata = {
  title: platformMeta.title,
  description: platformMeta.description,
  alternates: { canonical: platformMeta.canonical },
};

export default function PlatformPage() {
  return (
    <>
      <ScrollDepthTracker />

      <PageHero
        eyebrow={platformHero.eyebrow}
        h1={platformHero.h1}
        body={platformHero.body}
        primaryCta={platformHero.primaryCta}
        variant="centered"
        location="platform_hero"
      />

      <CardGrid
        heading={platformCapabilities.heading}
        body={platformCapabilities.body}
        cards={platformCapabilities.cards}
        columns={3}
      />

      <ProcessStrip
        heading={platformProcess.heading}
        steps={platformProcess.steps}
        surface="elevated-dark"
      />

      <CardGrid
        heading={platformIntegrations.heading}
        body={platformIntegrations.body}
        cards={platformIntegrations.cards}
        columns={4}
        surface="light"
      />

      <BulletList
        heading={platformSecurity.heading}
        body={platformSecurity.body}
        bullets={platformSecurity.bullets}
        surface="elevated-dark"
      />

      <FinalCTA
        heading={platformFinalCta.heading}
        body={platformFinalCta.body}
        primaryCta={platformFinalCta.primaryCta}
        location="platform_final_cta"
      />
    </>
  );
}
