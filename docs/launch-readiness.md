# Launch readiness — DebtNext.com

Prepared 2026-07-02 for leadership review. Plain summary of where the site stands and what it needs before it goes live to real traffic.

## What the site is

A new marketing website for DebtNext at debtnext.com. It's built to do one job: turn qualified enterprise buyers into demo requests. Every page drives to a single action, "Request a demo." The site is dark, product-led, and branded around dPlat inside a Mercury-style visual system. It covers 24 pages: the homepage, the platform and its four capability pages, seven industry solutions pages, a comparison page, a "why dPlat" page, the company set (about, leadership, careers, contact), resources, and the demo request page.

The build is functionally complete. The remaining work is human sign-off and a short list of live-environment settings, not new code.

## Build and QA evidence

We check quality automatically on every code change, so the site's core contracts don't drift.

- **Automated browser tests.** 24 Playwright test files cover accessibility, responsive layout at 9 screen sizes (320px phone up to 1440px desktop), the hero, the platform and solutions visuals, reduced-motion behavior, and SEO metadata. Several tests loop over all 23 visual routes, so a single test file checks many pages at once.
- **Accessibility.** axe-core (an industry accessibility scanner) runs against all 23 visual routes on every change, plus a dedicated check on the demo form's error handling. The target is WCAG 2.2 AA, and the automated scans are clean.
- **Performance gate.** Lighthouse runs on a throttled mobile profile (slow 4G, 4x slower CPU) and hard-fails the build if the homepage's largest content paint goes over 2,300 milliseconds. The real measured paint of the homepage headline is about 1,254 milliseconds, comfortably inside the bar. This gate covers 6 representative pages today.
- **Page-weight budget.** A build gate caps the homepage's first-load JavaScript at 865,308 bytes. The current measured value is 797,844 bytes, inside the ceiling with headroom.
- **Voice and brand.** Copy follows the enforced voice rules (sentence case, no em dashes, contractions, banned-phrase list). CTA discipline, brand color rules, and the no-TSI-visuals prohibitions are clean.

The performance and SEO tests run on the Vercel preview during continuous integration rather than locally, because the local sandbox can't run the Next.js server. That's a tooling limitation, not a quality gap; the same tests run automatically on every pull request.

## Intentionally deferred

- **Analytics wiring.** Per Connor's 2026-07-01 call, this is a test site, so analytics is deferred. The event helper (`track()`) is safe: it does nothing when analytics isn't configured, so it can't break anything. Two things are still needed before analytics works: the GTM container loader has to be added to the site, and the GA4 and GTM IDs have to be provisioned. Until both happen, no events reach Google Analytics. This is a known, planned gap (Phase 6), not a defect.

## Open human gates

These need a person to act. No automated step can clear them.

| # | Gate | Owner | What it blocks |
|---|---|---|---|
| 1 | COI/CLAIMS review markers stay in the source as an audit trail; the underlying copy is cleared via Andrew Budish's 2026-06-12 complete pre-clearance | Andrew Budish (done) | Nothing — non-blocking, retained for audit |
| 2 | Verify leadership titles, tenures, and roles on `/company/leadership` | Paul Goske | Leadership page accuracy |
| 3 | Set `ZOHO_WEBHOOK_URL` in Vercel — the demo form silently drops leads until it's set | Austin Johnson | Lead capture on `/demo` |
| 4 | Set `RESEND_API_KEY` in Vercel — confirmation emails are skipped until it's set | Connor | Demo confirmation email |
| 5 | Provision GA4 and GTM IDs — only useful after the analytics loader is built (deferred with Phase 6) | Jeremiah Benes | Analytics |
| 6 | Restore `source-materials/` (the solution deck and RFP library) — the directory is absent, so claims have nothing to trace against | Connor | Claims traceability audit trail |
| 7 | Decide the "Why dPlat" nav label (keep it, or rename to "Why DebtNext") | Connor | Nav label; current label ships unless changed |
| 8 | Named clients or logos still require written client consent before use | Andrew Budish | Any named-client copy |
| 9 | Connor's visual pass on the production preview | Connor | Final visual sign-off |

Connor's visual pass (gate 9) covers: the hero finale Console crossfade, the four handoff tabs' cinematic parity, the FeatureAccordion paired visuals, the Phase-14 elevated text pages, the Open Graph share cards (the `/opengraph-image` URLs), and Google's Rich Results Test on `/` and `/demo`.

## Recommendation

The site is code-complete and its automated quality gates are green. It's ready for Connor's visual pass on the production preview.

Two gates are launch-blocking for real traffic and should be closed first: `ZOHO_WEBHOOK_URL` in Vercel (gate 3), because without it every submitted demo request is lost, and the leadership accuracy check (gate 2), because named-person detail carries reputational risk. The rest can follow: `RESEND_API_KEY` degrades gracefully (the lead is still captured, only the confirmation email is skipped), analytics is deferred by decision, and the nav label and source-materials items are housekeeping.

Suggested order: Connor's visual pass and the Zoho webhook first, then the leadership verification, then the remaining settings and decisions.
