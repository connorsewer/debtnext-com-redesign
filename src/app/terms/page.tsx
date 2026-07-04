import type { Metadata } from "next";
import Link from "next/link";

import { ScrollDepthTracker } from "@/components/analytics/ScrollDepthTracker";
import { ProseSection } from "@/components/sections/ProseSection";
import { SectionContainer } from "@/components/sections/SectionContainer";
import {
  termsBody,
  termsContactCta,
  termsHero,
  termsMeta,
  termsTsiLink,
} from "@/content/terms";

export const metadata: Metadata = {
  title: termsMeta.title,
  description: termsMeta.description,
  alternates: { canonical: termsMeta.canonical },
};

export default function TermsPage() {
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
          {termsHero.eyebrow}
        </p>
        <h1 className="mt-5 text-display-lg font-[480] text-[var(--foreground)] md:mt-6">
          {termsHero.h1}
        </h1>
        <p className="mt-6 max-w-2xl text-body-lg text-[var(--text-tertiary)] md:mt-8">
          {termsHero.body}
        </p>
      </SectionContainer>

      <ProseSection
        eyebrow={termsBody.eyebrow}
        heading={termsBody.heading}
        paragraphs={termsBody.paragraphs}
      />

      <SectionContainer surface="elevated-dark" containerSize="readable">
        <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
          <Link
            href={termsTsiLink.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-touch items-center gap-1 text-body-strong font-[480] text-[var(--foreground)] underline-offset-4 hover:text-white hover:underline hover:decoration-[var(--primary)] focus-visible:outline-2 focus-visible:outline-[var(--focus)]"
          >
            {termsTsiLink.label} <span aria-hidden="true">→</span>
          </Link>
          <Link
            href={termsContactCta.href}
            className="inline-flex min-h-touch items-center gap-1 text-body-strong font-[480] text-[var(--foreground)] underline-offset-4 hover:text-white hover:underline hover:decoration-[var(--primary)] focus-visible:outline-2 focus-visible:outline-[var(--focus)]"
          >
            {termsContactCta.label} <span aria-hidden="true">→</span>
          </Link>
        </div>
      </SectionContainer>
    </>
  );
}
