"use client";

import * as React from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { MobileNav } from "@/components/site/MobileNav";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import { primaryCta, primaryNav } from "@/content/nav";

/**
 * Top navigation. DESIGN.md §7.1:
 * - 72px height desktop, 64px tablet, 56px mobile
 * - Transparent over hero, solid (#171721) after scroll
 * - One filled primary CTA on the right
 * - Semantic <header> + <nav>; mobile drawer in MobileNav
 */
export function SiteHeader() {
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-30 w-full transition-colors duration-[var(--duration-fast)] ease-[var(--ease-standard)]",
        scrolled
          ? "bg-[var(--background)]/95 backdrop-blur supports-[backdrop-filter]:bg-[var(--background)]/70 shadow-[var(--shadow-nav)]"
          : "bg-transparent"
      )}
    >
      <div className="mx-auto flex h-14 max-w-[var(--container-page)] items-center justify-between px-4 md:h-16 md:px-6 lg:h-18 lg:px-8">
        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="text-[var(--text-h4)] font-[480] tracking-tight text-[var(--foreground)] focus-visible:outline-2 focus-visible:outline-[var(--focus)]"
            aria-label="dPlat home"
          >
            dPlat
          </Link>
        </div>

        <nav
          aria-label="Primary"
          className="hidden items-center gap-8 md:flex"
        >
          {primaryNav.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[var(--text-body-strong)] font-[420] text-[var(--text-tertiary)] transition-colors duration-[var(--duration-instant)] hover:text-white focus-visible:outline-2 focus-visible:outline-[var(--focus)]"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden md:block">
            <Button
              asChild
              variant="primary"
              size="md"
              onClick={() =>
                track({
                  event: "cta_primary_click",
                  location: "header",
                  label: primaryCta.label,
                })
              }
            >
              <Link href={primaryCta.href}>{primaryCta.label}</Link>
            </Button>
          </div>
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
