import { SectionContainer } from "@/components/sections/SectionContainer";
import type { SectionSurface } from "@/components/sections/SectionContainer";

export interface ProseSectionProps {
  eyebrow?: string;
  heading: string;
  /** One or more paragraphs rendered as discrete <p> blocks. */
  paragraphs: string[];
  surface?: SectionSurface;
  containerSize?: "content" | "readable" | "narrow";
}

/**
 * Calm multi-paragraph editorial block. The still counterpart to the
 * animated tables: where ProseIntro carries a single paragraph, this carries
 * a short argument (market context, why-it-matters) across a few paragraphs.
 */
export function ProseSection({
  eyebrow,
  heading,
  paragraphs,
  surface = "dark",
  containerSize = "readable",
}: ProseSectionProps) {
  return (
    <SectionContainer surface={surface} containerSize={containerSize}>
      {eyebrow ? (
        <p className="text-caption font-[480] uppercase tracking-wider text-[var(--text-tertiary)]">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="mt-3 text-h2 font-[480] text-[var(--foreground)]">
        {heading}
      </h2>
      <div className="mt-5 space-y-4 text-body-lg text-[var(--text-tertiary)] [text-wrap:pretty]">
        {paragraphs.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </div>
    </SectionContainer>
  );
}
