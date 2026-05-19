import { SectionContainer } from "@/components/sections/SectionContainer";
import type { SectionSurface } from "@/components/sections/SectionContainer";

export interface ProseIntroProps {
  eyebrow?: string;
  heading: string;
  body: string;
  surface?: SectionSurface;
}

/**
 * A quiet "why it matters" intro block. Single column, readable width.
 * Used between hero and process strip on platform subpages where the
 * brief carries an explanatory paragraph (see /platform/optimization,
 * /platform/issues, /platform/reporting briefs).
 */
export function ProseIntro({
  eyebrow,
  heading,
  body,
  surface = "dark",
}: ProseIntroProps) {
  return (
    <SectionContainer surface={surface} containerSize="readable">
      {eyebrow ? (
        <p className="text-caption font-[480] uppercase tracking-wider text-[var(--text-tertiary)]">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="mt-3 text-h2 font-[480] text-[var(--foreground)]">
        {heading}
      </h2>
      <p className="mt-5 text-body-lg text-[var(--text-tertiary)]">{body}</p>
    </SectionContainer>
  );
}
