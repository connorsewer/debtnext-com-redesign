import * as React from "react";

import {
  SectionContainer,
  type SectionSurface,
} from "@/components/sections/SectionContainer";

export interface ProductVisualBandProps {
  /** The live product visual (typically a lazy-loaded component). */
  children: React.ReactNode;
  surface?: SectionSurface;
  /** Constrains the framed visual; matches BenefitSplit's media column. */
  maxWidthClass?: string;
  id?: string;
}

/**
 * Standalone framed product-visual band for pages that have no media column to
 * swap into (e.g. /platform, the industry pages). Reuses BenefitSplit's media
 * framing (card surface, ring, elevation) so the visual reads consistently.
 */
export function ProductVisualBand({
  children,
  surface = "dark",
  maxWidthClass = "max-w-3xl",
  id,
}: ProductVisualBandProps) {
  return (
    <SectionContainer surface={surface} id={id}>
      <div
        className={`mx-auto ${maxWidthClass} overflow-hidden rounded-[var(--radius-sm)] bg-[var(--card)] shadow-[var(--shadow-nav)] ring-1 ring-[var(--border)]`}
      >
        {children}
      </div>
    </SectionContainer>
  );
}
