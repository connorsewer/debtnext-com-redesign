# Requirements

Active milestone: **M6 — Premium visual + motion system**. M5 (Launch readiness) remains open/in-flight below ("premium now, M5 stays open" sequencing decision, 2026-06-04).

REQ-IDs are stable across the project. Categories continue from M5's scoping. Items prefixed `[ ]` are open; `[x]` flips when shipped + verified. M6's FND-* motion work supersedes M5's MOTION-01..04 (the small fades+counters pass).

## Active (M6)

Source design: `docs/superpowers/specs/2026-06-04-premium-visual-motion-system-design.md`. Research: `.planning/research/`.

### Foundation: motion + archetype library (FND)

- [ ] **FND-01** — A shared motion primitive barrel (`src/components/motion/`) exposes the full 7-type vocabulary (scroll-reveal, live-data, hover/cursor, ambient drift, micro-interactions, tab/section/route transition, explorable) so pages never hand-roll Framer/GSAP; each primitive is reduced-motion-aware and fails OPEN (content is never stuck at `opacity:0` when a reveal doesn't fire)
- [ ] **FND-02** — Three parametrized visual archetypes (Console, Data story, Schematic) exist as components that render from a typed data payload, with no hardcoded per-page numbers
- [ ] **FND-03** — A typed per-context visual payload model (dedicated content location, `[CLAIMS REVIEW]`-auditable) drives every archetype instance, so a visual = archetype + payload
- [ ] **FND-04** — Shared product primitives (chart atoms, flow nodes, worklist rows, bars, status) extend the existing `parts.tsx` set under one stroke weight, type scale, and color logic
- [ ] **FND-05** — CI guardrails land: route-level First-Load-JS budget, INP/TBT in LHCI, a "no stuck opacity:0" reveal spec, and a mobile-GSAP-free spec; all existing Playwright specs stay green
- [ ] **FND-06** — No eager motion code enters the homepage/shared JS chunk; foundation co-lands with (or after) M5 Phase 5.3 lazy-GSAP so the `/` LCP budget is not re-opened

### Platform capability visuals (PLATVIS)

- [ ] **PLATVIS-01** — Every FeatureAccordion item on the 4 platform deep-dive pages (`/platform/placement`, `/optimization`, `/issues`, `/reporting`) renders a real archetype visual; zero text-on-dark placeholders remain
- [ ] **PLATVIS-02** — Each platform deep-dive page has one constrained explorable flagship visual (hover-to-inspect / toggle state) that is fully keyboard-accessible and reduced-motion-safe
- [ ] **PLATVIS-03** — The BenefitSplit live visuals on platform pages are archetype instances fed real payloads (not the shared static image)

### Solutions visuals, per-industry (SOLVIS)

- [ ] **SOLVIS-01** — The duplicate `SolutionsIndustryCards` widget is gone; each of the 6 industries renders its own data, so no two solutions pages show an identical visual
- [ ] **SOLVIS-02** — Each industry sub-page has a Console hero visual using that industry's real-shaped account types and numbers
- [ ] **SOLVIS-03** — Each industry sub-page has a Schematic visual ("how dPlat routes <industry> accounts")
- [ ] **SOLVIS-04** — Each industry sub-page has a Data-story proof visual telling that industry's recovery truth
- [ ] **SOLVIS-05** — Solutions FeatureAccordion placeholders are replaced with archetype visuals across all 6 industry sub-pages

### Visual system consolidation + cleanup (SYSVIS)

- [x] **SYSVIS-01** — `src/components/sections/mockups/` is merged into the archetype library; the homepage handoff renders Console-archetype instances behind unchanged `MockupForTab`/`mockupTitleForTab` signatures, with the GSAP pin + `FramedDashboard` bezel behavior unchanged (no handoff regression)
- [ ] **SYSVIS-02** — The 6 dead `dashboard-dark.png` BenefitSplit `media` fallbacks are removed; the hero's use of the asset is resolved (kept intentionally or replaced with a Console instance)

### Text-only page elevation (PAGEVIS)

- [ ] **PAGEVIS-01** — `/compare` gains archetype visual(s) + motion where they lift the page (not decoration)
- [ ] **PAGEVIS-02** — `/why-dplat` gains a supporting visual / motion treatment
- [ ] **PAGEVIS-03** — The `/company` set (`/company`, `/about`, `/leadership`, `/careers`, `/contact`) and `/resources` gain visuals / motion where they lift
- [ ] **PAGEVIS-04** — `/platform/integrations` and `/demo` are elevated with archetype visuals / motion consistent with the system

### Homepage flagship capstone (HOMEVIS)

- [x] **HOMEVIS-01** — The homepage receives the matured-system capstone pass; it is sequenced after the M5 hero LCP fix and re-runs LHCI Case C as a hard merge gate (never lands before the M5 perf gate is closed or renegotiated). Done (Phase 15, 2026-07-01): the hero finale renders `<Console bare data={handoffPlacementConsole} />` in place of the retired `dashboard-dark.png` raster; LHCI Case C re-baseline is recorded from the PR's green CI run.

## In-flight (M5 — paused)

### Hero performance (HERO)

- [x] **HERO-01** — Hero MP4 ships as a multi-resolution ladder (`720p` / `540p` / `360p` MP4 plus a VP9 `WebM` fallback at each tier) wired via a `<source>` media-query set so narrow-viewport / iPad-portrait clients pull the smallest variant. Mobile (≤767px) remains video-free per D-04. Source asset is 1280×720 (verified via ffprobe); 720p is the anchor, no upscaling.
- [x] **HERO-02** — General Sans 600 is self-hosted via `next/font/local`; Fontshare CDN call removed from `globals.css`; `Wordmark` still renders with `.dn-node` pulse intact
- [x] **HERO-03** — Hero poster image re-encoded to sub-200KB AVIF (with WebP fallback) and owns the LCP target on every viewport
- [x] **HERO-04** — Lighthouse mobile run shows `/` LCP under 2.5s on 4G throttling; regression spec added to the test suite so future changes can't push `/` back over the line. **Closed 2026-06-04 (Phase 5.3).** Both clauses met: (1) the LHCI Case C LCP gate is green under `throttlingMethod: devtools` (real H1 paint about 1,254 ms vs the unchanged 2,300 ms bar), and (2) the regression spec `tests/responsive/hero-gsap-free-mobile.spec.ts` exists and passes (plus the standing mobile-video-free + poster-AVIF + source-ladder nets). The lazy-GSAP refactor (commits f58b436, 0db8994) removed GSAP from the `/` eager chunk; the gate closed once the measurement switched from the conservative simulate projection (which floored at 4,388 ms) to real devtools paint (commit 1a62d93). The bar and throttle profile are unchanged; only the measurement method changed.

### Analytics (ANALYTICS)

- [ ] **ANALYTICS-01** — GA4 script wired via `NEXT_PUBLIC_GA4_ID`; page-view tracking fires automatically on every route
- [ ] **ANALYTICS-02** — GTM container wired via `NEXT_PUBLIC_GTM_ID`; `window.dataLayer` initialized before `track()` calls fire
- [ ] **ANALYTICS-03** — `.env.example` documents both env vars; `HANDOFF.md` "Integrations" section notes Jeremiah Benes provisions the IDs; `src/lib/analytics.ts` `track()` continues to no-op gracefully if IDs are unset

### SEO baseline (SEO)

- [x] **SEO-01** — Per-route `opengraph-image.tsx` via `next/og` for all 24 v1 routes (scope expanded from 11 per Phase 7 D2: every route dir with a `page.tsx`); consistent dark-canvas treatment with route title + dPlat wordmark. Shared renderer `src/lib/og/template.tsx`.
- [x] **SEO-02** — `Organization` JSON-LD on `/` (legal name DebtNext, LLC, URL, sameAs to TSI + LinkedIn per Andrew's clearance, foundingDate 2003, parentOrganization TSI). `src/lib/seo/schema.ts` `organizationSchema()`.
- [x] **SEO-03** — `SoftwareApplication` JSON-LD on `/` describing dPlat (applicationCategory: BusinessApplication, operatingSystem: Web, quote-based offer, no invented price/rating).
- [x] **SEO-04** — `ContactPage` JSON-LD on `/demo` with contactType "Sales" + areaServed US/CA (no invented phone/email).
- [x] **SEO-05** — Twitter card metadata (`twitter:card` summary_large_image on the root layout; `twitter:image` reuses the per-route OG image) across all 24 routes.
- [x] **SEO-06** — Canonical URLs per route via `metadata.alternates.canonical` (already wired; production-origin hardcoded in content `*Meta.canonical`); verified by `tests/seo/canonical.spec.ts` (D1: exactly one canonical per route, production origin regardless of test base URL).

### Definition-of-done walkthrough (DOD)

- [x] **DOD-01** — CLAUDE.md §14 checklist walked on every route in the §9 route map (24 routes, scope expanded from the original 11); checklist evidence committed to `docs/m5-dod-walkthrough.md`. **Done (Phase 9, 2026-07-02).** No copy-voice, CTA, brand, H1, or heading failures found. Gaps recorded: LHCI covers 6 of 24 routes; P6-01 GTM loader absent (analytics deferred); `/demo` lead capture fails open until `ZOHO_WEBHOOK_URL` set; DOD-04 label undecided.
- [x] **DOD-02** — Open `[COI REVIEW]` flags on `/company`, `/why-dplat`, `/platform/issues`, `/solutions`. **Done via pre-clearance (Andrew Budish, 2026-06-12 complete sign-off).** The markers STAY in source as the audit trail (134 COI/CLAIMS markers across 40 files, non-blocking); they were not removed.
- [x] **DOD-03** — Open `[CLAIMS REVIEW]` flags on 60M+ accounts, $1.5B+ annual payments, comparison-table time-to-production ranges, leadership tenures, encryption claims. **Done via pre-clearance (Andrew Budish + figures pre-clearance, 2026-06).** Markers retained for audit. Comparative-claim legal review and named-client consent remain standing human gates (not code items).
- [ ] **DOD-04** — "Why dPlat" nav label decision applied (rename to "Why DebtNext" or keep "Why dPlat"; Connor's call) and propagated through `src/content/nav.ts`, sitemap, breadcrumbs. **Pending Connor** — current "Why dPlat" label ships unless changed.

### Motion pass (MOTION)

- [ ] **MOTION-01** — Framer `useInView` fade-and-rise reveal applied to every section on the 10 non-home pages; consistent timing token, single direction (rise only), gated by reduced-motion
- [ ] **MOTION-02** — Number counters animate up on `ProofBand` stats (tabular-nums preserved, lands on the displayed value when reduced-motion is on)
- [ ] **MOTION-03** — All M5 motion is gated by `prefers-reduced-motion: reduce`; reduced-motion Playwright spec extended to cover the new behavior
- [ ] **MOTION-04** — Perf regression check: `/` LCP stays under 2.5s after MOTION-01 + MOTION-02 ship; bundle-size delta on `/` does not exceed +20KB gzipped

## Future (deferred to M6 or later)

Captured during M5 scoping as deliberately deferred:

- Vercel Speed Insights RUM (real-user INP/LCP data); revisit after launch traffic exists
- CLAUDE.md §13 event verification in GTM Preview for `cta_primary_click`, `cta_secondary_click`, `form_start`, `form_submit`, `form_error`, `accordion_toggle`, `scroll_depth`, `video_play`; bumped to a post-launch phase that runs against live GTM containers
- Marquee/auto-scroll on `IntegrationStrip` logos (mid-risk motion)
- Stagger entrances on `CardGrid` / `ComparisonTable` / `ProcessStrip` rows
- SplitText heading reveals on `PageHero` across non-home routes
- Flip transitions on `FeatureAccordion` and Platform tab switches
- Source-material relocation: move `dPlat_Solution_Overview_v04232026.pptx` and `DebtNext_entries.xlsx` from Connor's Downloads to `source-materials/` in-repo

## Out of Scope (M5)

Explicitly excluded during M5 scoping with reasoning:

- **ScrollSmoother global lerp/inertia** — heaviest GSAP plugin perf cost, conflicts with `/` LCP budget, and a hard call when reduced-motion is on. If we ever want it, scope as its own milestone with a measured perf budget.
- **Mux adaptive bitrate hosting for the hero** — chose local multi-resolution ladder instead. Mux is the better long-term solution; if the local ladder hits its limits, revisit in v2.
- **Poster-only-on-mobile (hide hero video below md)** — chose full ladder approach to keep the cinematic on every device. The brand cinematic is too load-bearing to lose on mobile.
- **Live CLAUDE.md §13 event verification in M5** — deferred to a separate post-wire phase (likely M6). Wiring without verifying is acceptable risk because `track()` already no-ops gracefully; verifying against an unprovisioned GA4 ID is wasted effort.
- **GDPR / cookie consent banner** — wait until live traffic and analytics ship first; banner before traffic is theatre.

## Traceability

| REQ-ID | Phase | Plan | Status |
|--------|-------|------|--------|
| HERO-01 | Phase 5 | 05-02 | Done |
| HERO-02 | Phase 5 | 05-03 | Done |
| HERO-03 | Phase 5 | 05-04 | Done |
| HERO-04 | Phase 5 / 5.1 / 5.2 / 5.3 | 05.3-02 | Done |
| ANALYTICS-01 | Phase 6 | — | Open |
| ANALYTICS-02 | Phase 6 | — | Open |
| ANALYTICS-03 | Phase 6 | — | Open |
| SEO-01 | Phase 7 | 07 | Done |
| SEO-02 | Phase 7 | 07 | Done |
| SEO-03 | Phase 7 | 07 | Done |
| SEO-04 | Phase 7 | 07 | Done |
| SEO-05 | Phase 7 | 07 | Done |
| SEO-06 | Phase 7 | 07 | Done |
| DOD-01 | Phase 9 | 09 | Done |
| DOD-02 | Phase 9 | 09 | Done (pre-clearance; markers retained) |
| DOD-03 | Phase 9 | 09 | Done (pre-clearance; markers retained) |
| DOD-04 | Phase 9 | 09 | Pending Connor (label decision) |
| MOTION-01 | Phase 8 | — | Open |
| MOTION-02 | Phase 8 | — | Open |
| MOTION-03 | Phase 8 | — | Open |
| MOTION-04 | Phase 8 | — | Open |
| FND-01 | Phase 10 | — | Open |
| FND-02 | Phase 10 | — | Open |
| FND-03 | Phase 10 | — | Open |
| FND-04 | Phase 10 | — | Open |
| FND-05 | Phase 10 | — | Open |
| FND-06 | Phase 10 | — | Open |
| PLATVIS-01 | Phase 11 | — | Open |
| PLATVIS-02 | Phase 11 | — | Open |
| PLATVIS-03 | Phase 11 | — | Open |
| SOLVIS-01 | Phase 12 | — | Open |
| SOLVIS-02 | Phase 12 | — | Open |
| SOLVIS-03 | Phase 12 | — | Open |
| SOLVIS-04 | Phase 12 | — | Open |
| SOLVIS-05 | Phase 12 | — | Open |
| SYSVIS-01 | Phase 13 | — | Open |
| SYSVIS-02 | Phase 13 | — | Open |
| PAGEVIS-01 | Phase 14 | — | Open |
| PAGEVIS-02 | Phase 14 | — | Open |
| PAGEVIS-03 | Phase 14 | — | Open |
| PAGEVIS-04 | Phase 14 | — | Open |
| HOMEVIS-01 | Phase 15 | — | Done |

---
*Last updated: 2026-06-04. Phase 5.3 D-08 close-out: HERO-01..04 flipped to Done. The HERO-04 LHCI Case C gate is green (lazy-GSAP plus a simulate-to-devtools measurement change; the 2,300 ms bar is unchanged). Phases 5 + 5.1 + 5.2 + 5.3 closed together. M5's remaining 17 requirements (ANALYTICS, SEO, MOTION, DOD) stay open/in-flight; M5's MOTION-01..04 are superseded by M6's FND-* work. M6 coverage 21/21; M5 coverage 21/21.*
*Prior: 2026-06-04. M6 roadmap created. Traceability filled: 21 M6 requirements mapped 1:1 to Phases 10-15 (FND→10, PLATVIS→11, SOLVIS→12, SYSVIS→13, PAGEVIS→14, HOMEVIS→15).*
