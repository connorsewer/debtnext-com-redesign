import Link from "next/link";

import {
  FramedDashboard,
  MockupForTab,
  mockupTitleForTab,
} from "@/components/sections/mockups";
import { heroHandoff } from "@/content/homepage-hero";

/**
 * The section that catches the dashboard finale at the end of the hero pin.
 *
 * Server Component since the hero RSC split (2026-07-08). Both presentation
 * trees render on the server and CSS decides which one displays — there is no
 * client state left in this file:
 *
 *   - data-handoff-section="cinematic": the tall pinned desktop tree.
 *     `hidden md:motion-safe:block` — only displayed on ≥768px viewports with
 *     motion allowed. Ships with inline opacity:0 exactly like the old SSR
 *     output (GSAP fades it in at the hero handoff; the -mt-[100vh] pull-up
 *     would otherwise flash it over the hero pre-hydration).
 *   - data-handoff-section="static": the honest stacked fail-open tree that
 *     passed the audit. `md:motion-safe:hidden` — displays on mobile OR under
 *     reduced motion, fully visible with no JS at all.
 *
 * DOM ORDER MATTERS: the cinematic tree comes FIRST so the untouched
 * HeroCinematicController's `document.querySelector("[data-handoff-section]")`
 * keeps resolving the cinematic section. Both carry the bare attribute (with
 * distinguishing values) so reveal-fail-open's `closest("[data-handoff-section]")`
 * skip covers both trees.
 *
 * Structurally the cinematic tree is unchanged: a tall section with a sticky
 * 100vh inner. The inner pins at viewport top while the user scrolls through
 * the 4 tabs — each tab gets ~VH_PER_TAB of scroll. All interactivity moved to
 * HeroCinematicMount (the client leaf), which:
 *
 *   - sets `data-active-tab` on this section plus aria-selected/tabIndex on
 *     the tab buttons and `hidden` on the tabpanels as the GSAP controller
 *     reports scroll progress (active-pill styling below is pure
 *     `aria-selected:` CSS so no re-render is needed);
 *   - wires tab click + arrow-key handling on the tablist;
 *   - portals the active tab's FramedDashboard mockup into
 *     [data-handoff-mockup-slot] (keyed re-mount per tab, so each mockup's
 *     entrance animations replay exactly as before). The slot is empty in the
 *     server HTML — invisible anyway behind the section's opacity:0 — and the
 *     mobile/reduced-motion static tree below renders its own mockups
 *     server-side, so nothing user-visible depends on the portal.
 *
 * Desktop composition (2026-07-02 density rework): heading, dashboard frame,
 * and tabs are stacked as ONE centered unit that fills the viewport with
 * intent. The frame grows to max-w-6xl since it is the hero artifact of the
 * section.
 */
export function HomepageHandoffSection() {
  const tabCount = heroHandoff.tabs.length;
  const firstTab = heroHandoff.tabs[0];

  return (
    <>
      {/* ---------------------------------------------------------------- */}
      {/* Desktop cinematic tree (pinned, GSAP-driven). MUST stay first in  */}
      {/* the DOM — see the querySelector contract in the doc block above.  */}
      {/* ---------------------------------------------------------------- */}
      <section
        data-handoff-section="cinematic"
        data-active-tab={firstTab.id}
        // Start invisible: GSAP fades this in as the hero hands off. Matches
        // the pre-split SSR output; mobile/reduced-motion sessions never
        // display this tree at all (the static one below is theirs).
        style={{ opacity: 0 }}
        // Height = pin length. VH_PER_TAB (0.58) * 4 tabs of scroll drive the
        // tab progression; the extra 100vh absorbs the negative top margin
        // that pulls this section up onto the hero's pin release.
        // 0.58*4 + 1 = 3.32.
        className="relative -mt-[100vh] hidden h-[332vh] bg-[var(--background)] md:motion-safe:block"
      >
        <div className="sticky top-0 flex h-screen items-center overflow-hidden">
          <div className="mx-auto flex w-full max-w-[var(--container-page)] flex-col items-center px-4 pt-[72px] md:px-6 lg:px-8">
            {/* Eyebrow + heading, directly above the frame. */}
            <div className="w-full max-w-4xl text-center">
              <p className="text-caption font-[480] uppercase tracking-wider text-[var(--text-tertiary)]">
                {heroHandoff.eyebrow}
              </p>
              <h2 className="mt-2 text-h3 font-[480] leading-tight text-[var(--foreground)]">
                {heroHandoff.heading}
              </h2>
            </div>

            {/* Framed dashboard. Center-anchored so it never moves as the
                inner content crossfades between tabs of differing heights, and
                so it shares the hero finale's horizontal center at the seam.
                The inner slot is the portal target for HeroCinematicMount's
                keyed FramedDashboard/MockupForTab render. */}
            <div data-handoff-mockup-frame className="mt-6 w-full md:mt-8">
              <div
                data-handoff-mockup-slot
                className="mx-auto w-full max-w-6xl"
              />
            </div>

            {/* Tabs + body + link, directly beneath the frame. */}
            <div className="mt-6 w-full text-center md:mt-8">
              <div
                role="tablist"
                aria-label="dPlat capability surfaces"
                aria-orientation="horizontal"
                className="mx-auto flex flex-wrap justify-center gap-2"
              >
                {heroHandoff.tabs.map((tab, idx) => (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    id={`platform-tab-${tab.id}`}
                    aria-selected={tab.id === firstTab.id}
                    aria-controls={`platform-panel-${tab.id}`}
                    tabIndex={tab.id === firstTab.id ? 0 : -1}
                    // Active styling is attribute-driven (aria-selected), so
                    // HeroCinematicMount can flip tabs with plain DOM writes.
                    className="group relative inline-flex min-h-[44px] items-center overflow-hidden rounded-[var(--radius-xl)] border border-[var(--border)] bg-transparent px-4 py-2 text-body-sm font-[480] text-[var(--text-tertiary)] transition-colors duration-[var(--duration-instant)] aria-selected:border-[var(--primary)] aria-selected:bg-[var(--primary)]/15 aria-selected:text-[var(--foreground)] aria-[selected=false]:hover:border-[var(--text-tertiary)] aria-[selected=false]:hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus)]"
                  >
                    {tab.label}
                    {/* Per-tab progress affordance: a thin underline on the
                        active pill so users read the scroll as stepping through
                        an ordered sequence rather than a jump. Purely
                        decorative; the aria-selected state carries the real
                        meaning. Rendered in every tab (width is per-index) and
                        shown only on the selected one. */}
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute bottom-0 left-0 hidden h-[2px] bg-[var(--primary)] group-aria-selected:block"
                      style={{ width: `${((idx + 1) / tabCount) * 100}%` }}
                    />
                  </button>
                ))}
              </div>

              <div className="mx-auto mt-4 max-w-2xl">
                {/* All four panels render server-side (every tab's
                    aria-controls now resolves); HeroCinematicMount toggles
                    `hidden` as the active tab changes. */}
                {heroHandoff.tabs.map((tab) => (
                  <p
                    key={tab.id}
                    id={`platform-panel-${tab.id}`}
                    role="tabpanel"
                    aria-labelledby={`platform-tab-${tab.id}`}
                    hidden={tab.id !== firstTab.id}
                    className="text-body-sm text-[var(--text-tertiary)]"
                  >
                    {tab.body}
                  </p>
                ))}
              </div>

              <div className="mt-4">
                <Link
                  href={heroHandoff.link.href}
                  className="min-h-touch inline-flex items-center gap-1 text-body-strong font-[480] text-[var(--foreground)] underline-offset-4 hover:text-white hover:underline hover:decoration-[var(--primary)] focus-visible:outline-2 focus-visible:outline-[var(--focus)]"
                >
                  {heroHandoff.link.label} <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Static fail-open tree: mobile and reduced-motion (any width).     */}
      {/* Fully visible server markup — works with zero JS.                 */}
      {/* ---------------------------------------------------------------- */}
      <section
        data-handoff-section="static"
        className="container-section bg-[var(--background)] py-[var(--space-section-mobile)] md:motion-safe:hidden"
      >
        <div className="mx-auto max-w-[var(--container-page)] px-4">
          <p className="text-caption font-[480] uppercase tracking-wider text-[var(--accent-text-dark)]">
            {heroHandoff.eyebrow}
          </p>
          <h2 className="mt-2 text-h2 text-[var(--foreground)]">
            {heroHandoff.heading}
          </h2>

          <div className="mt-10 flex flex-col gap-16">
            {heroHandoff.tabs.map((tab) => (
              <div key={tab.id} className="flex flex-col gap-4">
                <h3 className="text-h3 text-[var(--foreground)]">
                  {tab.label}
                </h3>
                <p className="text-body-md text-[var(--text-tertiary)]">
                  {tab.body}
                </p>
                <FramedDashboard title={mockupTitleForTab(tab.id)}>
                  <MockupForTab id={tab.id} />
                </FramedDashboard>
              </div>
            ))}
          </div>

          <div className="mt-12">
            <Link
              href={heroHandoff.link.href}
              className="min-h-touch inline-flex items-center gap-1 text-body-strong text-[var(--accent-text-dark)]"
            >
              {heroHandoff.link.label} <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
