import type { Metadata } from "next";

import { ScrollDepthTracker } from "@/components/analytics/ScrollDepthTracker";
import { DemoForm } from "@/components/forms/DemoForm";
import { CardGrid } from "@/components/sections/CardGrid";
import { SectionContainer } from "@/components/sections/SectionContainer";
import {
  demoHero,
  demoMeta,
  demoReassurance,
  demoWhatToExpect,
} from "@/content/demo";

export const metadata: Metadata = {
  title: demoMeta.title,
  description: demoMeta.description,
  alternates: { canonical: demoMeta.canonical },
  robots: { index: true, follow: true },
};

export default function DemoPage() {
  return (
    <>
      <ScrollDepthTracker />

      <SectionContainer
        surface="dark"
        containerSize="page"
        className="border-b border-[var(--border)]"
      >
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-caption font-[480] uppercase tracking-wider text-[var(--text-tertiary)]">
            {demoHero.eyebrow}
          </p>
          <h1 className="mt-5 text-display-lg font-[480] text-[var(--foreground)] md:mt-6">
            {demoHero.h1}
          </h1>
          <p className="mt-6 text-body-lg text-[var(--text-tertiary)] md:mt-8">
            {demoHero.body}
          </p>
        </div>
      </SectionContainer>

      {/* Form + "What to expect" sidebar */}
      <SectionContainer surface="dark" containerSize="page">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
          <div>
            <DemoForm />
          </div>
          <aside
            aria-label="What to expect after submitting"
            className="rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--card)] p-8"
          >
            <h2 className="text-h4 font-[480] text-[var(--foreground)]">
              {demoWhatToExpect.heading}
            </h2>
            <ol className="mt-6 space-y-6">
              {demoWhatToExpect.steps.map((step, idx) => (
                <li key={step.title} className="flex gap-4">
                  <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--secondary)] text-caption font-[480] text-[var(--foreground)]">
                    {idx + 1}
                  </span>
                  <div>
                    <p className="text-body-strong font-[480] text-[var(--foreground)]">
                      {step.title}
                    </p>
                    <p className="mt-1 text-body-sm text-[var(--text-tertiary)]">
                      {step.body}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </aside>
        </div>
      </SectionContainer>

      <CardGrid
        heading={demoReassurance.heading}
        cards={demoReassurance.cards}
        columns={3}
        surface="elevated-dark"
      />
    </>
  );
}
