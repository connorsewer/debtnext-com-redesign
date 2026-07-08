import Link from "next/link";

import { Button } from "@/components/ui/button";
import { SectionContainer } from "@/components/sections/SectionContainer";

export interface FinalCTAProps {
  heading: string;
  body?: string;
  primaryCta: { label: string; href: string };
  reassurance?: string;
  /** Analytics location identifier; defaults to "final_cta" */
  location?: string;
}

/**
 * Final CTA band. DESIGN.md §7.7: dark canvas, one filled primary CTA,
 * short reassurance line, no competing actions.
 *
 * Server Component: CTA analytics fire via data-track-* attributes picked up
 * by the layout-level ClickTracker, so no per-section client code ships.
 */
export function FinalCTA({
  heading,
  body,
  primaryCta,
  reassurance,
  location = "final_cta",
}: FinalCTAProps) {
  return (
    <SectionContainer
      surface="dark"
      ambient
      containerSize="readable"
      className="[padding-bottom:max(env(safe-area-inset-bottom),6rem)]"
    >
      <div className="flex flex-col items-center text-center">
        <h2 className="text-h2 font-[480] text-[var(--foreground)]">
          {heading}
        </h2>
        {body ? (
          <p className="mt-5 max-w-xl text-body-lg text-[var(--text-tertiary)]">
            {body}
          </p>
        ) : null}
        <div className="mt-8 flex flex-col items-center gap-3">
          <Button
            asChild
            variant="primary"
            size="md"
            className="min-h-touch"
            data-track-event="cta_primary_click"
            data-track-location={location}
            data-track-label={primaryCta.label}
          >
            <Link href={primaryCta.href}>{primaryCta.label}</Link>
          </Button>
          {reassurance ? (
            <p className="text-body-sm text-[var(--text-tertiary)]">
              {reassurance}
            </p>
          ) : null}
        </div>
      </div>
    </SectionContainer>
  );
}
