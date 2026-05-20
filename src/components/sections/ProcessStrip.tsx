import { SectionContainer } from "@/components/sections/SectionContainer";
import type { SectionSurface } from "@/components/sections/SectionContainer";

export interface ProcessStep {
  title: string;
  body: string;
}

export interface ProcessStripProps {
  eyebrow?: string;
  heading: string;
  steps: ProcessStep[];
  surface?: SectionSurface;
}

/**
 * 3-5 numbered steps with thin dividers and a subtle blue active state.
 * Pattern from DESIGN.md §7.6 process strip variant.
 */
export function ProcessStrip({
  eyebrow,
  heading,
  steps,
  surface = "dark",
}: ProcessStripProps) {
  return (
    <SectionContainer surface={surface}>
      <div className="max-w-3xl">
        {eyebrow ? (
          <p className="text-caption font-[480] uppercase tracking-wider text-[var(--text-tertiary)]">
            {eyebrow}
          </p>
        ) : null}
        <h2 className="mt-3 text-h2 font-[480] text-[var(--foreground)]">
          {heading}
        </h2>
      </div>

      <ol className="mt-10 flex flex-col gap-0 md:mt-14 @md/section:grid @md/section:gap-px @md/section:overflow-hidden @md/section:rounded-[var(--radius-sm)] @md/section:bg-[var(--border)] @md/section:grid-cols-3 @lg/section:grid-cols-5">
        {steps.map((step, idx) => (
          <li
            key={step.title}
            className="group/step relative flex gap-4 pl-6 [&:not(:last-child)]:pb-8 [&:not(:last-child)]:border-l [&:not(:last-child)]:border-[var(--border)] @md/section:flex @md/section:flex-col @md/section:gap-3 @md/section:bg-[var(--background)] @md/section:p-6 @md/section:pl-6 @md/section:pb-6 @md/section:border-l-0 @lg/section:p-8 @lg/section:pl-8 @lg/section:pb-8"
          >
            <span
              aria-hidden="true"
              className="absolute left-0 top-0 inline-flex h-6 w-6 -translate-x-1/2 items-center justify-center rounded-full bg-[var(--card)] text-caption font-[480] text-[var(--text-tertiary)] @md/section:hidden"
            >
              {idx + 1}
            </span>
            <div className="flex flex-col gap-3">
              <span className="text-caption font-[480] uppercase tracking-wider text-[var(--accent-text-dark)]">
                Step {String(idx + 1).padStart(2, "0")}
              </span>
              <h3 className="text-h4 font-[480] text-[var(--foreground)]">
                {step.title}
              </h3>
              <p className="text-body-sm text-[var(--text-tertiary)]">
                {step.body}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </SectionContainer>
  );
}
