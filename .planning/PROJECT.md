# DebtNext.com Redesign

## What This Is

Production marketing website for DebtNext at debtnext.com, modeled on Mercury.com's dark-canvas-first fintech aesthetic. The site sells dPlat, a recovery management SaaS platform that connects credit originators (utilities, financial services, telecom, fintech) with their existing recovery vendor networks. DebtNext is a wholly-owned subsidiary of Transworld Systems Inc. (TSI); ownership is disclosed in the footer and on `/company`, but the site is dPlat-branded inside the Mercury visual system rather than co-branded with TSI.

## Core Value

Convert qualified enterprise buyers into demo requests. Every page, every CTA, every section exists to produce one outcome: a "Request a demo" submission from a VP-or-above buyer at a regulated credit originator.

## Current Milestone: M6 Premium visual + motion system

**Goal:** Fill every gap found in the 2026-06-04 visual-asset audit with a 3-archetype visual library (console / data story / schematic) and a 7-type motion vocabulary, lifting the whole site to a flagship premium feel within the brand's restraint. Design source: `docs/superpowers/specs/2026-06-04-premium-visual-motion-system-design.md`.

**Target feature categories:**

- Per-industry solutions visuals (replace the single duplicate widget across 7 pages with distinct, real-data visuals)
- Platform capability visuals (replace ~20 FeatureAccordion text placeholders with real product visuals)
- Solutions capability visuals (replace ~25 FeatureAccordion text placeholders)
- Premium motion + interactivity system (shared, reduced-motion-aware primitives for the 7-type vocabulary)
- Text-only page elevation (compare, why-dplat, company set, resources, integrations, demo)
- Visual system consolidation (merge `sections/mockups` + `product/visuals`; retire dead `dashboard-dark.png` fallbacks)
- Homepage / hero flagship capstone pass

**Phase numbering:** Continues from M5. M5 owns Phases 5–9 (with decimal insertions 5.1–5.3); **M6 starts at Phase 10.** M6's motion foundation supersedes M5's small "Phase 8 Motion pass."

**Also open (paused): M5 Launch readiness + motion pass.** M5 is in-flight, not shipped — blocked on the Phase 5 hero LCP gate (Phase 5.3 queued). Its resume context is preserved in STATE.md. M5 work (hero perf, analytics, SEO, DoD) and M6 work run as two concurrent open milestones per the 2026-06-04 sequencing decision ("premium now, M5 stays open").

## Requirements

### Validated

<!-- Shipped, deployed, and in production at https://debtnext-website.vercel.app. -->

- ✓ **11 v1 routes** shipped — `/`, `/platform`, `/platform/{placement,optimization,issues,reporting}`, `/solutions`, `/why-dplat`, `/company`, `/resources`, `/demo` — M1–M3
- ✓ **Section primitive library** (15+ components): `HomepageHero`, `HomepageHandoffSection`, `PageHero`, `FeatureAccordion`, `BenefitSplit`, `ProofBand`, `ProcessStrip`, `TrustBand`, `IntegrationStrip`, `CardGrid`, `ComparisonTable`, `BulletList`, `FinalCTA`, `SectionContainer`, `ProseIntro`, `FramedDashboard` + 4 tab mockups — M2/M3/M3.6
- ✓ **Mercury-faithful cinematic hero** with GSAP `pin:true` and seamless crossfade into the Platform handoff section — M3.5/M3.6
- ✓ **Scroll-driven Platform handoff** — 400vh sticky-pinned section with shared `FramedDashboard` bezel that morphs through Placement, Vendor performance, Issues, and Reporting tabs — M3.6
- ✓ **DebtNext wordmark** (General Sans 600 + indigo `.dn-node` pulse) replacing the dPlat text wordmark in nav chrome — M3.6
- ✓ **DemoForm** with React Hook Form + Zod, work-email domain blocklist, honeypot, `?email=` pre-fill, rate-limited `/api/demo` route, Zoho CRM webhook + Resend confirmation email — M3
- ✓ **Mobile responsive system** — fluid Utopia type scale 360→1440, container queries (`container-section`, `container-card`, `container-form`), 44px touch-target floor, `env(safe-area-inset-*)` applied, mobile/tablet/desktop section padding tokens — M4 Phase 1
- ✓ **Responsive primitive contract** — 9-row primitive responsive contract (DESIGN.md §9.7) governing FeatureAccordion, BenefitSplit, ComparisonTable, ProcessStrip, AttachedForm, CardGrid, plus audited Hero/PageHero/TrustBand/ProofBand/IntegrationStrip/FinalCTA — M4 Phase 2
- ✓ **Platform handoff mobile fork** — `(max-width: 767px)` branch renders a calm static stack (4 vertical mockup blocks with `useInView` gating) instead of the desktop pin cinematic — M4 Phase 3
- ✓ **A11y baseline** — WCAG 2.2 AA verified, axe-core in CI (`.github/workflows/a11y.yml`), keyboard navigable end-to-end, focus rings (`#9CB4E8`, 2px outline + 2px offset), reduced-motion honored across Framer + GSAP + CSS — M4 Phase 4
- ✓ **Test suite** — 164 Playwright specs green: 9 breakpoints × 11 routes matrix (99), axe-routes (22), type-scale, touch-targets (11), reduced-motion (11), platform-mobile (2), container-query-layouts (1) — M4 Phase 4
- ✓ **Lighthouse mobile baseline** — 10 of 11 routes pass LCP/CLS/INP targets; `/` misses LCP at 2.86s due to 11 MB hero MP4 (deferred to M5) — M4 Phase 4
- ✓ **Two new accent text tokens** — `--accent-text-dark` and `--accent-text-light` shipped to clear WCAG 2.2 AA contrast for eyebrows and inline links; `--primary` stays exclusive to filled CTA surfaces — M4 Phase 4
- ✓ **Brand and voice rules enforced** — 0 em dashes, 0 banned phrases across all 11 rendered routes — M2/M3 voice pass
- ✓ **Sitemap and robots** — `app/sitemap.ts` with all 11 routes, `app/robots.ts` allowing all + disallowing `/api/` and `/dev/`, per-route metadata — M3

### Active

<!-- M5 scope. Will be formalized via /gsd-new-milestone after this bootstrap. -->

- [ ] Hero MP4 perf fix so `/` clears the 2.5s LCP target on 4G mobile
- [ ] Analytics wiring (GA4 + GTM dataLayer; CLAUDE.md §13 events verified in GTM Preview)
- [ ] SEO baseline (per-route OG images, `Organization` + `SoftwareApplication` JSON-LD on `/`, `ContactPage` JSON-LD on `/demo`)
- [ ] Definition-of-done walkthrough on every v1 route (CLAUDE.md §14 checklist)
- [ ] Restrained motion pass across all 11 routes (GSAP + Framer; respects `prefers-reduced-motion`)

### Out of Scope

<!-- Explicit boundaries. Includes reasoning to prevent re-adding. -->

- **v2 capability pages** (`/platform/oversight`, `/platform/media`, `/platform/integrations`, `/platform/debt-sales`, `/platform/legal-affidavit`) — deferred to v2 per docs/content-map.md; insufficient source material and stakeholder review bandwidth for v1
- **v2 industry pages** (`/solutions/utilities`, `/solutions/financial-services`, `/solutions/telecom`, `/solutions/fintech`) — same reasoning as v2 capability pages
- **v2 content hub** (`/resources/blog`, `/resources/case-studies`, `/resources/glossary`) — content engine and editorial plan not yet stood up
- **v2 company subpages** (`/company/leadership`, `/company/careers`, `/company/press`) — leadership bios and press list require TSI/legal coordination
- **Free trial or self-serve signup** — dPlat is an enterprise sale; the only conversion path is "Request a demo"
- **Chat widgets, exit-intent popups, scroll-triggered overlays** — explicitly banned per CLAUDE.md §15; conflicts with calm/precise/technical brand personality
- **Stock photography or generic AI-illustration in hero/feature sections** — fails the dark-fintech aesthetic test per `.impeccable.md`
- **Named client testimonials or logos** — require written client consent + Andrew Budish sign-off; v1 ProofBand uses industry categories instead
- **TSI brand visual elements** — no TSI dark blue, bright blue, Poppins, square-corner brand geometry, or TSI logo lockups anywhere; dPlat is branded inside the Mercury visual system, not the parent
- **Competing CTAs** ("Talk to sales," "Get a quote," "Download whitepaper") — one filled primary CTA per band, label is "Request a demo"
- **Carousels, parallax, bounce motion** — banned per DESIGN.md §10 and `.impeccable.md` design principle 4
- **Third-party live-chat or scheduling embeds** — not in v1 scope; would conflict with form-first lead capture
- **Cookies banner / GDPR / region gating** — defer until analytics ships in M5

## Context

### Tech stack (live, current versions per HANDOFF.md)

- **Next.js 16.2.6** (App Router, Turbopack) — note: Next 16, not 15. APIs may differ from training data; consult `node_modules/next/dist/docs/` before writing tricky Next code
- **React 19.2.4** + TypeScript strict
- **Tailwind v4** (CSS-first, `@theme inline` block, tokens live in `src/app/globals.css`)
- **shadcn/ui** (radix-nova preset) — Button overridden; primitives via `@radix-ui/*`
- **Framer Motion 12** — per-mockup entrance animations, accordion transitions, motion reveals
- **GSAP 3** + `@gsap/react` — hero cinematic scrub and Platform tab-progression ScrollTrigger; gsap-skills pack auto-loaded at `.claude/skills/`
- **Inter** via `next/font/google` (body), **General Sans 600** via Fontshare CDN (wordmark only; Arcadia preferred if licensed in future)
- **React Hook Form** + **Zod** — `DemoForm`, shared client + server validation schema
- **Resend** (transactional confirmation email, server-only) + **Zoho CRM webhook** (lead capture via `/api/demo`)
- **MDX** via `@next/mdx` — page briefs live in `content/pages/*.md`, typed content modules in `src/content/<page>.ts`
- **Playwright** — 164-spec test suite covering responsive, a11y, touch targets, reduced motion, container queries
- **axe-core** in CI at 375px and 1440px breakpoints
- **Vercel** — auto-deploys from `main` to `https://debtnext-website.vercel.app`; project `connor-laughlins-projects/debtnext-website` (`prj_Q8Wbxa2ioco7n2MogdHnPpL0MmRP`)

### Audience and brand

Primary buyers are SVP/VP of Recovery, Director of Operations, Chief Risk Officer, or VP of Credit at major US utilities, Fortune 100 financial institutions, telecom carriers, fintech lenders, and publicly traded debt purchasers. They evaluate during Q4 RFP cycles, vendor consolidation initiatives, or regulatory-driven legacy replacements. They want confidence the platform is serious, calm that they are not being sold to, and trust that disclosures are accurate.

Brand personality: **calm, precise, technical**. Sole visual reference: mercury.com. Four anti-references: TSI corporate sites, consumer fintech (Cash App, Robinhood, Chime), generic B2B SaaS templates (Linear/Vercel pastiche), and legacy enterprise collections software (FICO, TrueAccord legacy UIs).

### COI and claims governance

DebtNext is wholly owned by TSI, which also runs an ARM business that uses third-party collection agencies inside the dPlat recovery network. Marketing copy must not obscure this. Specific approver gates:

- **Andrew Budish** — compliance language, regulatory claims, named-client usage, TSI disclosure language, COI-sensitive copy
- **Joe Laughlin** — corporate framing, TSI relationship positioning
- **Michael Orefice** — high-level brand alignment with TSI GTM
- **Paul Goske** — product accuracy on every platform page
- **Rob Novosel, Frank Ellenberger** — technical depth, integration claims
- **Sarah Sanchez-Anderson** — demo form fields, lead qualifier alignment
- **Austin Johnson** — Zoho CRM integration, form-to-pipeline flow
- **Jeremiah Benes** — DNS, GA4/GTM setup, technical SEO

Any copy touching the dPlat-to-vendor-network relationship needs `[COI REVIEW]` flagged in the PR. Any performance metric or comparative claim needs `[CLAIMS REVIEW]`. Open `[COI REVIEW]` flags exist on `/company` TSI section, `/why-dplat` "connected to full network" framing, `/platform/issues` regulatory-exposure framing, and `/solutions` "regulatory infrastructure" claims. Open `[CLAIMS REVIEW]` flags exist on the 60M+ accounts, $1.5B+ payments, comparison-table time-to-production ranges, leadership tenures, and encryption details.

### Source-of-truth files

- `CLAUDE.md` — operating contract (sections: tech stack §2, brand rules §3, CTA policy §4, voice rules §5, TSI/COI §6, claims review §7, content sources §8, routing §9, components §10, a11y §11, perf §12, analytics §13, DoD §14, what-not-to-do §15, when-stuck §16)
- `DESIGN.md` — Mercury-faithful token spec. §4.1 color tokens (canvas `#171721`, primary `#5266EB`, foreground `#EDEDF3`, focus `#9CB4E8`, plus M4 `--accent-text-dark` / `--accent-text-light`); §9 responsive system; §11 imagery rules
- `.impeccable.md` — persistent design brief: audience, 3-word personality (calm, precise, technical), Mercury-only reference, 4 anti-references, 5 design principles (dark canvas first, one voltage per band, whitespace as load-bearing, product visuals explain not decorate, state is explicit and tested)
- `docs/content-map.md` — IA, route purposes, content sources, approver gates per page
- `docs/m4-perf-baseline.md` — Lighthouse mobile run after M4 ship; `/` LCP 2.86s vs 2.5s target due to 11 MB hero MP4
- `HANDOFF.md` — current state and post-M4 follow-ups; updated per commit when implementation lands
- `content/pages/*.md` — editorial source-of-truth briefs (read by humans, not imported at build time)
- `src/content/<page>.ts` — typed content modules consumed by page TSX

### Known open items carrying into M5+

- Mobile/tablet layout for Platform centered-stack may have edge cases under 1024×680 (untested at md sizes)
- Brief crossfade overlap between hero bezel and Platform bezel could be tuned tighter
- `homepage-hero-end.png` is now unreferenced; safe to delete
- "Why dPlat" nav label still says "dPlat" (product name) even though wordmark is "DebtNext" (company name) — Connor undecided
- Source materials (`dPlat_Solution_Overview_v04232026.pptx`, `DebtNext_entries.xlsx`) live in Connor's Downloads, not yet relocated to `source-materials/` in repo
- Env vars pending owners: `ZOHO_WEBHOOK_URL` (Austin Johnson), `RESEND_API_KEY` (Connor), `NEXT_PUBLIC_GA4_ID` + `NEXT_PUBLIC_GTM_ID` (Jeremiah Benes)

## Constraints

- **Tech stack**: Next.js 16 + React 19 + TypeScript strict + Tailwind v4 + shadcn/ui — pinned per HANDOFF.md "Decisions locked" and CLAUDE.md §2. No additions without flagging in chat.
- **Hosting**: Vercel auto-deploy from `main` to `debtnext-website.vercel.app` — main is always shippable; PRs preview, then squash-merge.
- **Performance**: LCP < 2.5s on 4G, CLS < 0.1, INP < 200ms (CLAUDE.md §12). Hero poster image owns LCP, hero video layers on top. Server Components by default, client only where state required.
- **A11y**: WCAG 2.2 AA floor (CLAUDE.md §11), keyboard navigable end-to-end, 44×44px touch targets, `prefers-reduced-motion` honored everywhere, focus rings `#9CB4E8` 2px outline + 2px offset, axe-core CI on every PR.
- **Brand and visual**: DESIGN.md is the single source of truth for color, spacing, typography. No local colors, sizes, or spacing outside what's tokenized. No TSI brand visual elements anywhere.
- **CTA policy**: Single conversion action across the site is "Request a demo". One filled primary CTA per horizontal band. Secondary actions are ghost or text. No competing CTAs without explicit approval.
- **Voice**: No em dashes in rendered UI copy. No "not X, it's Y" construction. Banned phrase list in CLAUDE.md §5 strictly enforced. Sentence case headings. Contractions always. Digits for numbers. Short paragraphs.
- **Compliance and disclosure**: TSI ownership appears only in the footer and on `/company`. Not in hero copy, not in capability or solution pages. `[COI REVIEW]` and `[CLAIMS REVIEW]` flags must be cleared by named approvers before merge.
- **Cadence**: Two-stage review per task (spec compliance + code quality). Per-commit docs rule: update `HANDOFF.md` / `DESIGN.md` / `.impeccable.md` in the SAME commit as the code they describe. Verify doc structure (`grep -n "^## " HANDOFF.md`) before editing existing docs.
- **Git**: GPG signing off for this project's commits (`git -c commit.gpgsign=false`). Co-Authored-By footer required on every commit: `Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>`.
- **Reduced motion**: All motion gated by `prefers-reduced-motion: reduce` — Framer Motion uses `useReducedMotion`, GSAP guards `useGSAP` with a media query, CSS uses the global block in `globals.css`.
- **One H1 per page**, semantic landmarks (`header`, `nav`, `main`, `footer`), 100% test coverage on responsive primitives before merging changes that touch them.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Mercury.com as sole visual reference | Prevents reference dilution. Brand personality (calm, precise, technical) maps cleanly to Mercury's dark-canvas fintech aesthetic. | ✓ Good (post-M3.6 the cinematic hero + Platform handoff land squarely in the reference) |
| Next.js 16 (not 15) | Build is stable on 16; M1 scaffolded on 16. APIs may differ from training data, so consult `node_modules/next/dist/docs/` for tricky code. | ✓ Good |
| Hero pin via GSAP, not CSS sticky | CSS sticky's post-pin trailing region was the source of a 100vh dead-air band between hero and Platform. GSAP `pin:true` eliminates the band by dynamically creating the pin spacer. | ✓ Good (locked in M3.6) |
| Platform handoff uses CSS sticky inside a 400vh outer | Tab progression does not need a pin-spacer-free release, so CSS sticky is sufficient and lighter than GSAP. | ✓ Good |
| Dashboard never moves during cinematic→Platform handoff | Movement during crossfade caused visual confusion. Locked: the framed dashboard stays at viewport center across the seam. | ✓ Good (any retune must preserve) |
| Wordmark = "DebtNext" (company) in nav chrome, "dPlat" (product) in metadata and body copy | Resolves the company-vs-product naming tension while keeping the product name discoverable. Indigo `.dn-node` pulse signals "live system" without leaning on a custom logo. | ⚠️ Revisit ("Why dPlat" nav link still says product name; Connor undecided) |
| One filled primary CTA per band, label is "Request a demo" | One conversion action, no internal competition. Enterprise sale rules out free-trial CTAs. | ✓ Good |
| Mobile uses static-stack architecture for Platform handoff, not the desktop pin cinematic | Mobile devices choke on 400vh pinned scroll cinematics. Static stack delivers the same content via normal-flow scroll with `useInView` Framer entrance per mockup. | ✓ Good (M4 Phase 3) |
| TSI ownership appears only in footer + `/company`, not in hero or feature pages | Honors the structural relationship without obscuring it. Andrew Budish owns disclosure language. | ✓ Good |
| Container queries (`@md/section:`, `@lg/section:`) gated by `container-section` on `SectionContainer` inner wrapper, NOT on primitive itself | Per CSS spec, a container can't query the element it's declared on. The PR #2 hotfix (`8854da7`) fixed a Phase 2 regression where primitives silently fell back to 1-column at desktop. | ✓ Good (regression covered by `tests/responsive/container-query-layouts.spec.ts`) |
| Two new accent text tokens (`--accent-text-dark`, `--accent-text-light`) for eyebrows and inline links | `--primary` `#5266EB` fails WCAG 2.2 AA contrast for body-weight text on light surfaces. Splitting accent into surface-specific tokens preserves `--primary`'s role as the filled CTA color. | ✓ Good (M4 Phase 4) |
| GPG signing off + explicit Co-Authored-By footer required | Connor's local GPG signing fails in this repo's commit environment. Explicit Co-Authored-By keeps attribution auditable. | ✓ Good (locked, applied per-commit) |
| Per-commit docs rule: HANDOFF.md/DESIGN.md/.impeccable.md updated in the same commit as the code | Prevents doc rot. Drift between code and docs is the #1 source of bad agent assumptions. | ✓ Good (saved as feedback memory) |
| Defer hero MP4 perf fix to M5 | Phase 4 of M4 was already overloaded. The 11 MB hero MP4 lands `/` at 2.86s LCP (vs 2.5s target). Mux or a multi-resolution local source ladder is the right fix and warrants its own phase. | — In flight (Phase 5 Wave 0 scaffolding shipped 2026-05-21) |
| GSD .planning/ bootstrapped retroactively after M1–M4 shipped | M1–M4 ran outside GSD. The brand/voice/COI constraints in CLAUDE.md were already authoritative. Bootstrap captures shipped state as Validated, then opens M5 via /gsd-new-milestone. | — Pending (this commit) |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-06-06 — Phase 11 (Platform deep-dive visuals) complete: all 4 platform pages (placement/optimization/issues/reporting) render real archetype visuals on all 19 accordion slots (zero text placeholders), each with one Explorable-composed flagship fed typed payloads. Archetype + payload model proven end-to-end before the homepage handoff depends on it. PLATVIS-01..03 structurally verified (11/12 must-haves); runtime perf/a11y confirmation deferred to CI (11-HUMAN-UAT.md). Previously: 2026-06-04 — M6 opened alongside the still-open M5; phases continue from Phase 10.*
