import Link from "next/link";

import { footerGroups, tsiOwnershipLine } from "@/content/nav";

/**
 * Site footer. DESIGN.md §7.8:
 * - Quieter than hero, dark background
 * - Grouped links, tight readable spacing
 * - TSI ownership disclosure on the bottom row (CLAUDE.md §6)
 * - LinkedIn is the only social icon for v1
 */
export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-[var(--border)] bg-[var(--background)] text-[var(--text-tertiary)]">
      <div className="mx-auto max-w-[var(--container-page)] px-4 py-16 md:px-6 md:py-20 lg:px-8 lg:py-24">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-3 lg:grid-cols-6">
          <div className="col-span-2 md:col-span-3 lg:col-span-1">
            <Link
              href="/"
              className="text-[var(--text-h4)] font-[480] tracking-tight text-[var(--foreground)] focus-visible:outline-2 focus-visible:outline-[var(--focus)]"
              aria-label="dPlat home"
            >
              dPlat
            </Link>
            <p className="mt-4 max-w-xs text-[var(--text-body-sm)] leading-5">
              Recovery management software for credit originators. Built since 2003.
            </p>
          </div>

          {footerGroups.map((group) => (
            <div key={group.title}>
              <h2 className="text-[var(--text-caption)] font-[480] uppercase tracking-wider text-[var(--text-tertiary)]">
                {group.title}
              </h2>
              <ul className="mt-4 space-y-3">
                {group.links.map((link) => (
                  <li key={`${group.title}-${link.label}`}>
                    <Link
                      href={link.href}
                      className="text-[var(--text-body-sm)] text-[var(--text-tertiary)] hover:text-white focus-visible:outline-2 focus-visible:outline-[var(--focus)]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-[var(--border)] pt-8 md:flex-row md:items-center md:justify-between">
          <p className="text-[var(--text-body-sm)]">{tsiOwnershipLine}</p>

          <div className="flex items-center gap-6">
            <p className="text-[var(--text-body-sm)]">
              &copy; {year} DebtNext, LLC. All rights reserved.
            </p>
            <Link
              href="https://www.linkedin.com/company/debtnext"
              aria-label="DebtNext on LinkedIn"
              className="text-[var(--text-tertiary)] hover:text-white focus-visible:outline-2 focus-visible:outline-[var(--focus)]"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
