import Link from "next/link";

import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/sections/PageHero";
import { SectionContainer } from "@/components/sections/SectionContainer";

const DESTINATIONS = [
  { label: "Home", href: "/" },
  { label: "Platform", href: "/platform" },
  { label: "Solutions", href: "/solutions" },
] as const;

export default function NotFound() {
  return (
    <>
      <PageHero
        eyebrow="404"
        h1="That page isn't here."
        body="The link may be old, or the page may have moved. Here's where to pick back up."
        primaryCta={{ label: "Request a demo", href: "/demo" }}
        variant="centered"
        location="not_found_hero"
      />

      <SectionContainer surface="elevated-dark">
        <nav
          aria-label="Popular pages"
          className="mx-auto flex max-w-[var(--container-readable)] flex-wrap items-center justify-center gap-5"
        >
          {DESTINATIONS.map((dest) => (
            <Button key={dest.href} asChild variant="ghost" size="text">
              <Link href={dest.href}>
                {dest.label} <span aria-hidden="true">→</span>
              </Link>
            </Button>
          ))}
        </nav>
      </SectionContainer>
    </>
  );
}
