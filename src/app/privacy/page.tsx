import type { Metadata } from "next";
import Link from "next/link";

import { ScrollDepthTracker } from "@/components/analytics/ScrollDepthTracker";
import { ProseSection } from "@/components/sections/ProseSection";
import { SectionContainer } from "@/components/sections/SectionContainer";
import {
  privacyBody,
  privacyContactCta,
  privacyHero,
  privacyMeta,
  privacyTsiLink,
} from "@/content/privacy";

export const metadata: Metadata = {
  title: privacyMeta.title,
  description: privacyMeta.description,
  alternates: { canonical: privacyMeta.canonical },
};

export default function PrivacyPage() {
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
          {privacyHero.eyebrow}
        </p>
        <h1 className="mt-5 text-display-lg font-[480] text-[var(--foreground)] md:mt-6">
          {privacyHero.h1}
        </h1>
        <p className="mt-6 max-w-2xl text-body-lg text-[var(--text-tertiary)] md:mt-8">
          {privacyHero.body}
        </p>
      </SectionContainer>

      <ProseSection
        eyebrow={privacyBody.eyebrow}
        heading={privacyBody.heading}
        paragraphs={privacyBody.paragraphs}
      />

      <SectionContainer surface="elevated-dark" containerSize="readable">
        <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
          <Link
            href={privacyTsiLink.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-touch items-center gap-1 text-body-strong font-[480] text-[var(--foreground)] underline-offset-4 hover:text-white hover:underline hover:decoration-[var(--primary)] focus-visible:outline-2 focus-visible:outline-[var(--focus)]"
          >
            {privacyTsiLink.label} <span aria-hidden="true">→</span>
          </Link>
          <Link
            href={privacyContactCta.href}
            className="inline-flex min-h-touch items-center gap-1 text-body-strong font-[480] text-[var(--foreground)] underline-offset-4 hover:text-white hover:underline hover:decoration-[var(--primary)] focus-visible:outline-2 focus-visible:outline-[var(--focus)]"
          >
            {privacyContactCta.label} <span aria-hidden="true">→</span>
          </Link>
        </div>
      </SectionContainer>
    </>
  );
}
