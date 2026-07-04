import type { Metadata } from "next";
import Link from "next/link";

import { ScrollDepthTracker } from "@/components/analytics/ScrollDepthTracker";
import { ProseSection } from "@/components/sections/ProseSection";
import { SectionContainer } from "@/components/sections/SectionContainer";
import {
  cookieTable,
  cookiesChoices,
  cookiesContactCta,
  cookiesHero,
  cookiesIntro,
  cookiesMeta,
  cookiesStatus,
} from "@/content/cookies";

export const metadata: Metadata = {
  title: cookiesMeta.title,
  description: cookiesMeta.description,
  alternates: { canonical: cookiesMeta.canonical },
};

export default function CookiesPage() {
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
          {cookiesHero.eyebrow}
        </p>
        <h1 className="mt-5 text-display-lg font-[480] text-[var(--foreground)] md:mt-6">
          {cookiesHero.h1}
        </h1>
        <p className="mt-6 max-w-2xl text-body-lg text-[var(--text-tertiary)] md:mt-8">
          {cookiesHero.body}
        </p>
      </SectionContainer>

      <ProseSection
        eyebrow={cookiesIntro.eyebrow}
        heading={cookiesIntro.heading}
        paragraphs={cookiesIntro.paragraphs}
      />

      <SectionContainer surface="elevated-dark" containerSize="readable">
        <p className="text-caption font-[480] uppercase tracking-wider text-[var(--text-tertiary)]">
          Cookie categories
        </p>
        <h2 className="mt-3 text-h2 font-[480] text-[var(--foreground)]">
          What each cookie is for
        </h2>
        <div className="mt-6 overflow-x-auto">
          <table className="w-full border-collapse text-left text-body-md text-[var(--text-tertiary)]">
            <caption className="sr-only">{cookieTable.caption}</caption>
            <thead>
              <tr className="border-b border-[var(--border)]">
                {cookieTable.columns.map((col) => (
                  <th
                    key={col}
                    scope="col"
                    className="py-3 pr-6 align-top text-body-strong font-[480] text-[var(--foreground)]"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {cookieTable.rows.map((row) => (
                <tr
                  key={row.category}
                  className="border-b border-[var(--border)] last:border-0"
                >
                  <th
                    scope="row"
                    className="py-4 pr-6 align-top text-body-strong font-[480] text-[var(--foreground)]"
                  >
                    {row.category}
                  </th>
                  <td className="py-4 pr-6 align-top">{row.purpose}</td>
                  <td className="py-4 pr-6 align-top">{row.examples}</td>
                  <td className="py-4 align-top">{row.duration}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionContainer>

      <ProseSection
        eyebrow={cookiesChoices.eyebrow}
        heading={cookiesChoices.heading}
        paragraphs={cookiesChoices.paragraphs}
      />

      <ProseSection
        eyebrow={cookiesStatus.eyebrow}
        heading={cookiesStatus.heading}
        paragraphs={cookiesStatus.paragraphs}
        surface="elevated-dark"
      />

      <SectionContainer surface="dark" containerSize="readable">
        <Link
          href={cookiesContactCta.href}
          className="inline-flex min-h-touch items-center gap-1 text-body-strong font-[480] text-[var(--foreground)] underline-offset-4 hover:text-white hover:underline hover:decoration-[var(--primary)] focus-visible:outline-2 focus-visible:outline-[var(--focus)]"
        >
          {cookiesContactCta.label} <span aria-hidden="true">→</span>
        </Link>
      </SectionContainer>
    </>
  );
}
