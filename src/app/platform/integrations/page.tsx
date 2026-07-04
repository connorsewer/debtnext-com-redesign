import type { Metadata } from "next";

import { buildMetadata } from "@/lib/seo/metadata";

import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { ScrollDepthTracker } from "@/components/analytics/ScrollDepthTracker";
import { BulletList } from "@/components/sections/BulletList";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { IntegrationTable } from "@/components/sections/IntegrationTable";
import { LogoMarquee } from "@/components/sections/LogoMarquee";
import { PageHero } from "@/components/sections/PageHero";
import { ProductVisualBand } from "@/components/sections/ProductVisualBand";
import { ProofBand } from "@/components/sections/ProofBand";
import { ProseSection } from "@/components/sections/ProseSection";
import { SchematicVisual } from "@/components/product/visuals/archetypes";
import { integrationsSystemMap } from "@/content/visuals/integrations";
import {
  integrationsCis,
  integrationsErp,
  integrationsFinalCta,
  integrationsFootprint,
  integrationsHero,
  integrationsLogos,
  integrationsMeta,
  integrationsPatterns,
  integrationsProof,
  integrationsProprietary,
  integrationsRecovery,
  integrationsWhyMatters,
} from "@/content/integrations";

export const metadata: Metadata = buildMetadata(integrationsMeta);

export default function IntegrationsPage() {
  return (
    <>
      <ScrollDepthTracker />

      <JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Platform", path: "/platform" }, { name: "Integrations", path: "/platform/integrations" }])} />

      <PageHero
        eyebrow={integrationsHero.eyebrow}
        h1={integrationsHero.h1}
        body={integrationsHero.body}
        primaryCta={integrationsHero.primaryCta}
        variant="centered"
        location="integrations_hero"
      />

      <LogoMarquee
        eyebrow={integrationsLogos.eyebrow}
        logos={integrationsLogos.logos}
      />

      <ProofBand
        eyebrow={integrationsFootprint.eyebrow}
        heading={integrationsFootprint.heading}
        stats={integrationsFootprint.stats}
        notes={integrationsFootprint.notes}
        surface="elevated-dark"
      />

      <ProductVisualBand>
        <SchematicVisual data={integrationsSystemMap} />
      </ProductVisualBand>

      <IntegrationTable
        eyebrow={integrationsErp.eyebrow}
        heading={integrationsErp.heading}
        body={integrationsErp.body}
        rows={integrationsErp.rows}
        footnote={integrationsErp.footnote}
        caption="Enterprise and ERP integrations by platform and category"
      />

      <IntegrationTable
        eyebrow={integrationsCis.eyebrow}
        heading={integrationsCis.heading}
        body={integrationsCis.body}
        rows={integrationsCis.rows}
        caption="Customer service and billing platform integrations by platform and category"
        surface="elevated-dark"
      />

      <IntegrationTable
        eyebrow={integrationsProprietary.eyebrow}
        heading={integrationsProprietary.heading}
        body={integrationsProprietary.body}
        rows={integrationsProprietary.rows}
        caption="Proprietary and custom system integrations by category"
      />

      <IntegrationTable
        eyebrow={integrationsRecovery.eyebrow}
        heading={integrationsRecovery.heading}
        body={integrationsRecovery.body}
        rows={integrationsRecovery.rows}
        caption="Recovery and workflow platform integrations by platform and category"
        surface="elevated-dark"
      />

      <BulletList
        eyebrow={integrationsPatterns.eyebrow}
        heading={integrationsPatterns.heading}
        body={integrationsPatterns.body}
        bullets={integrationsPatterns.bullets}
        surface="dark"
      />

      <ProseSection
        eyebrow={integrationsWhyMatters.eyebrow}
        heading={integrationsWhyMatters.heading}
        paragraphs={integrationsWhyMatters.paragraphs}
      />

      <ProofBand
        eyebrow={integrationsProof.eyebrow}
        heading={integrationsProof.heading}
        stats={integrationsProof.stats}
        surface="elevated-dark"
      />

      <FinalCTA
        heading={integrationsFinalCta.heading}
        body={integrationsFinalCta.body}
        primaryCta={integrationsFinalCta.primaryCta}
        reassurance={integrationsFinalCta.reassurance}
        location="integrations_final_cta"
      />
    </>
  );
}
