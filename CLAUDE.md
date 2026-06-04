# CLAUDE.md — DebtNext.com Rebuild

You are building a production marketing website for DebtNext at debtnext.com. DebtNext is a recovery management software company, wholly owned by Transworld Systems Inc. (TSI). Its flagship product is dPlat, a SaaS platform that connects credit originators with their recovery vendor networks.

This file is your operating contract. Read it before every task. If anything here conflicts with another instruction in the repo, this file wins.

## 1. Source of truth

The visual design system is `DESIGN.md` at the repo root. Do not deviate from it. Do not introduce local colors, spacing values, typography choices, or interaction patterns outside what's defined there. If the spec is silent on something, raise it in chat before guessing.

The content is in `content/pages/*.md`. Treat it as approved copy. Do not rewrite, "improve," or paraphrase it without an explicit instruction.

The content map is `docs/content-map.md`. It tells you which pages exist, what each page's purpose is, and which content sources back which claims.

The persistent design brief is `.impeccable.md` at the repo root. It defines who the design is for, the 3-word brand personality, anti-references, and the 5 design principles that override default UI judgment. Read it before any design or copy work.

## 2. Tech stack

- Next.js 15 with App Router
- React 19
- TypeScript (strict mode)
- Tailwind CSS v4 with `@theme` blocks driven by `DESIGN.md` tokens
- shadcn/ui for accessible primitives (Accordion, Dialog, Tabs, Form)
- Framer Motion for restrained motion (accordion transitions, fade-ins only)
- MDX for page content via `@next/mdx`
- React Hook Form + Zod for the demo request form
- Resend or Postmark for transactional email; demo form posts to Zoho CRM via webhook
- Vercel for hosting and preview deployments

Do not add libraries beyond this list without flagging it.

## 3. Brand and visual rules

Read `DESIGN.md` sections 1, 2, and 3 before any UI work. The site is Mercury-style, dark-canvas-first, with one filled primary CTA per band.

Hard rules from the design spec:

- Primary action color: `#5266EB`. Never substitute.
- Primary dark canvas: `#171721`. The site opens dark.
- Primary text on dark: `#EDEDF3`.
- Body font: Inter (Arcadia only if properly licensed; assume Inter).
- Pill-shaped primary CTAs. Pill-shaped attached form on the hero.
- 72px to 96px section padding on desktop.
- No TSI brand visual elements anywhere. No TSI dark blue. No TSI bright blue. No Poppins. No square-corner brand geometry. No TSI logo lockups. The site is dPlat-branded inside the Mercury visual system.

## 4. The approved CTA

The single conversion action on this site is **"Request a demo"**. Use that exact label everywhere. One filled primary CTA per horizontal band. Secondary actions get ghost or text treatments with labels like "See how it works" or "Explore the platform."

Do not introduce competing CTAs ("Talk to sales," "Get a quote," "Start free trial," "Download whitepaper") without explicit approval.

## 5. Voice and copy rules

These are enforced. Run a self-check before committing any copy change.

**Banned punctuation**: no em dashes (`—`). Use commas, parentheses, semicolons, or new sentences.

**Banned construction**: never write "not X, it's Y" or any variant ("not just X but Y," "less X, more Y," "forget X, this is Y"). State the positive claim directly.

**Banned phrases (partial list)**: delve, harness, leverage, utilize, landscape, robust, game-changer, cutting-edge, pivotal, underscore, foster, tapestry, vibrant, meticulous, journey, embark, beacon, multifaceted, seamless, supercharge, unlock, future-proof, revolutionize, elevate, empower, "in today's," "it's important to note," "furthermore," "additionally," "moreover."

**Formatting**: sentence case for all headings. Contractions always. Numbers as digits. Short paragraphs (1 to 3 sentences). Vary paragraph length deliberately.

**Tone**: confident, calm, product-led. Concrete nouns. Specific verbs. Buyer-focused, not company-focused. If a sentence could appear on any B2B SaaS site, rewrite it.

## 6. TSI ownership disclosure (COI-sensitive)

DebtNext is wholly owned by Transworld Systems Inc. TSI also operates an accounts receivable management business that uses third-party collection agencies inside the dPlat recovery network. This is a real structural relationship. Marketing copy must not obscure it.

**Where TSI ownership appears**:
- Footer: "DebtNext is a Transworld Systems Inc. company." (small, persistent)
- Company page: explicit ownership section with link to TSI website
- Press / legal pages: full corporate disclosure

**Where TSI ownership does not appear**:
- Hero copy on the homepage
- Module / capability pages
- Solution / industry pages

**Language to avoid (until Andrew Budish clears it)**:
- "Independent of any collection network"
- "Vendor-neutral by ownership"
- "We have no recovery operations of our own"
- Any claim that positions dPlat as structurally separate from TSI's ARM business

**Language that's fine**:
- "dPlat works with any collection agency, law firm, or recovery vendor in your network"
- "Configurable to your existing vendor ecosystem"
- "Agency-network-agnostic by design"

Any new copy that touches the relationship between dPlat and recovery vendors needs `[COI REVIEW]` flagged in the PR description. Andrew Budish reviews it before merge.

## 7. Compliance and claims review

All performance metrics, regulatory references, and security claims need source backing. Where a claim appears in copy, it should be traceable to either:

- The dPlat solution overview deck (`/source-materials/dPlat_Solution_Overview_v04232026.pptx`)
- The RFP answer library (`/source-materials/DebtNext_entries.xlsx`)
- A documented client outcome with Andrew's approval

Flag any of the following for legal review with `[CLAIMS REVIEW]` in the PR:

- Recovery rate or liquidation rate claims
- Cost reduction percentages
- Specific named clients or logos (do not use named clients without written client consent and Andrew's sign-off)
- Compliance certifications and regulatory claims (FDCPA, Reg F, TCPA, HIPAA, PCI DSS, SOC 2, etc.)
- Comparative claims against competitors

## 8. Content sources and how to use them

Reference materials in `/source-materials/`:

- `dPlat_Solution_Overview_v04232026.pptx`: 14-slide internal deck covering executive overview, 10 capability modules, and the affidavit process. The IA of the deck maps roughly 1:1 to the product/platform pages.
- `DebtNext_entries.xlsx`: 197 RFP Q&A entries with operational detail, compliance language, and capability descriptions. Replace any `[ClientName]` placeholder before using.
- `DESIGN.md`: visual design system.

When pulling from RFP entries:
1. Strip `[ClientName]` placeholders.
2. Compress to marketing voice (RFP voice is too formal and too long).
3. Verify any performance claim is generic ("clients have achieved double-digit increases") rather than specific to one client.
4. Apply the voice rules in section 5.

## 9. Routing and page structure

The site is intentionally compact for v1. Pages live as MDX in `content/pages/`. Route map:

| Route | File |
|---|---|
| `/` | `content/pages/homepage.md` |
| `/platform` | `content/pages/platform.md` |
| `/platform/placement` | `content/pages/placement.md` |
| `/platform/optimization` | `content/pages/optimization.md` |
| `/platform/issues` | `content/pages/issues.md` |
| `/platform/reporting` | `content/pages/reporting.md` |
| `/platform/integrations` | `src/content/integrations.ts` (source copy: `DebtNext_Integrations_Page_Copy.docx`) |
| `/solutions` | `content/pages/solutions.md` |
| `/solutions/utilities` | `src/content/solutions-utilities.ts` (source copy: `DebtNext_Solutions_Pages_Copy.docx`) |
| `/solutions/financial-services` | `src/content/solutions-financial-services.ts` (source copy: `DebtNext_Solutions_Pages_Copy.docx`) |
| `/solutions/telecom` | `src/content/solutions-telecom.ts` (source copy: `DebtNext_Solutions_Pages_Copy.docx`) |
| `/solutions/fintech` | `src/content/solutions-fintech.ts` (source copy: `DebtNext_Solutions_Pages_Copy.docx`) |
| `/solutions/insurance` | `src/content/solutions-insurance.ts` (added from 2026-06-04 alpha-review plan) |
| `/solutions/healthcare` | `src/content/solutions-healthcare.ts` (added from 2026-06-04 alpha-review plan) |
| `/why-dplat` | `content/pages/why-dplat.md` |
| `/compare` | `src/content/compare.ts` (source copy: `DebtNext_Comparison_Page_Copy.docx`) |
| `/company` | `content/pages/company.md` |
| `/company/about` | `src/content/company-about.ts` (source copy: `DebtNext_Company_Pages_Copy.docx`) |
| `/company/leadership` | `src/content/company-leadership.ts` (source copy: `DebtNext_Company_Pages_Copy.docx`) |
| `/company/careers` | `src/content/company-careers.ts` (source copy: `DebtNext_Company_Pages_Copy.docx`) |
| `/company/contact` | `src/content/company-contact.ts` (source copy: `DebtNext_Company_Pages_Copy.docx`) |
| `/resources` | `content/pages/resources.md` |
| `/demo` | `content/pages/demo.md` |

Page content is authored as typed modules in `src/content/*.ts` (consumed by
the route components in `src/app/`). The `content/pages/*.md` briefs remain the
editorial source for the original v1 routes; `/compare`,
`/platform/integrations`, the `/solutions/<industry>` pages, and the
`/company/<page>` pages were authored directly from their approved `.docx`
copy decks.

Additional capability pages (`/platform/oversight`, `/platform/media`, `/platform/debt-sales`, `/platform/legal-affidavit`) get built in v2.

## 10. Component library

Build these in `src/components/sections/` and reuse aggressively. Do not create one-off section variants.

- `Hero` (split layout with copy left, product visual right; centered editorial variant for non-home pages)
- `FeatureAccordion` (3 to 5 items, paired product visual on active item)
- `BenefitSplit` (text left, media right; reversible)
- `ProofBand` (logos or quoted testimonials with attribution)
- `ProcessStrip` (3 to 5 steps, thin dividers, subtle blue active state)
- `FinalCTA` (dark band, one primary action, short reassurance line)
- `Header` (sticky, transparent on hero, solid on scroll)
- `Footer` (grouped links, TSI ownership disclosure line, legal links)
- `AttachedForm` (the Mercury-style pill-attached email + button for hero)
- `DemoForm` (full form with React Hook Form + Zod, posts to Zoho)

Each component must implement all 7 states from the design spec: default, hover, focus-visible, active, disabled, loading, error.

## 11. Accessibility floor

WCAG 2.2 AA is the minimum. Specifics:

- Keyboard navigable end to end
- Visible focus indicators using `#9CB4E8`, 2px outline, 2px offset
- 44px minimum touch targets
- Respect `prefers-reduced-motion`
- One H1 per page
- Semantic landmarks (`header`, `nav`, `main`, `footer`)
- All form fields have programmatic labels
- All decorative images use empty alt text; meaningful product visuals get descriptive alt

Run `axe-core` in CI on every PR.

## 12. Performance targets

- LCP under 2.5s on 4G
- CLS under 0.1
- INP under 200ms
- Hero media: WebP or AVIF, served via Next/Image with priority
- Below-fold images lazy-loaded
- No client-side JS for static marketing sections; use Server Components by default
- Use `import dynamic` for heavy interactive widgets only

## 13. Analytics events

Wire these in `src/lib/analytics.ts` and fire via GTM dataLayer:

- `cta_primary_click` (location, label)
- `cta_secondary_click` (location, label)
- `form_start` (form_id)
- `form_submit` (form_id)
- `form_error` (form_id, field, error_type)
- `accordion_toggle` (section, item)
- `scroll_depth` (25, 50, 75, 100)
- `video_play` (video_id)

GA4 measurement ID and Zoho webhook URL live in `.env.local`.

## 14. Definition of done for a page

Before marking a page complete:

- [ ] Copy in `content/pages/` matches what ships
- [ ] One H1, semantic heading hierarchy
- [ ] One primary CTA per band, label "Request a demo"
- [ ] Mobile, tablet, desktop layouts verified at the design spec's breakpoints
- [ ] Keyboard navigation works end to end
- [ ] axe-core passes with no critical violations
- [ ] LCP under 2.5s on the Vercel preview's mobile test
- [ ] Analytics events fire correctly
- [ ] Any `[COI REVIEW]` or `[CLAIMS REVIEW]` flags resolved
- [ ] Visual review by Connor on the Vercel preview URL

## 15. What not to do

- Do not invent client names, testimonials, metrics, or case studies.
- Do not write copy that promises specific recovery rates, liquidation lifts, or financial outcomes for a prospective client. Generic ranges with appropriate qualifiers only.
- Do not introduce stock photography of office scenes or generic business imagery in the hero or feature sections.
- Do not add a "free trial" or "sign up free" CTA. dPlat is an enterprise sale.
- Do not add chat widgets, exit-intent popups, or scroll-triggered overlays.
- Do not use AI-generated marketing illustrations unless they pass the dark-fintech aesthetic test in the design spec.

## 16. When stuck

If a task requires a decision the spec doesn't cover, stop and ask in the chat. Examples that should always trigger a stop:

- Adding a new top-level nav item
- Adding a new conversion action beyond "Request a demo"
- Naming a specific client in copy
- Citing a specific performance metric not already in the source materials
- Introducing a new color, type size, or spacing value
- Building a page that's not in the route map above

The default behavior is to ask, not assume.
