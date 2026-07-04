import type { Metadata } from "next";
import Link from "next/link";

import { ScrollDepthTracker } from "@/components/analytics/ScrollDepthTracker";
import { ProseSection } from "@/components/sections/ProseSection";
import { SectionContainer } from "@/components/sections/SectionContainer";
import {
  accessibilityContactCta,
  accessibilityHero,
  accessibilityMeta,
  accessibilitySections,
} from "@/content/accessibility";

export const metadata: Metadata = {
  title: accessibilityMeta.title,
  description: accessibilityMeta.description,
  alternates: { canonical: accessibilityMeta.canonical },
};

export default function AccessibilityPage() {
  return (
    <>
      <ScrollDepthTracker />

      <SectionContainer
        surface="dark"
        ambient
        containerSize="readable"
        className="border-b border-[var(--border)] pt-[calc(var(--spacing)*22)] md:pt-[calc(var(--spacing)*32)] lg:pt-[calc(var(--spacing)*36)]"
      >
        <p className="text-caption font-[480] uppercase tracking-wider text-[var(--text-tertiary)]">
          {accessibilityHero.eyebrow}
        </p>
        <h1 className="mt-5 text-display-lg font-[480] text-[var(--foreground)] md:mt-6">
          {accessibilityHero.h1}
        </h1>
        <p className="mt-6 max-w-2xl text-body-lg text-[var(--text-tertiary)] md:mt-8">
          {accessibilityHero.body}
        </p>
      </SectionContainer>

      {accessibilitySections.map((section) => (
        <ProseSection
          key={section.heading}
          eyebrow={section.eyebrow}
          heading={section.heading}
          paragraphs={section.paragraphs}
        />
      ))}

      <SectionContainer surface="elevated-dark" containerSize="readable">
        <Link
          href={accessibilityContactCta.href}
          className="inline-flex min-h-touch items-center gap-1 text-body-strong font-[480] text-[var(--foreground)] underline-offset-4 hover:text-white hover:underline hover:decoration-[var(--primary)] focus-visible:outline-2 focus-visible:outline-[var(--focus)]"
        >
          {accessibilityContactCta.label} <span aria-hidden="true">→</span>
        </Link>
      </SectionContainer>
    </>
  );
}
