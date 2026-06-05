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

- [ ] **SYSVIS-01** — `src/components/sections/mockups/` is merged into the archetype library; the homepage handoff renders Console-archetype instances behind unchanged `MockupForTab`/`mockupTitleForTab` signatures, with the GSAP pin + `FramedDashboard` bezel behavior unchanged (no handoff regression)
- [ ] **SYSVIS-02** — The 6 dead `dashboard-dark.png` BenefitSplit `media` fallbacks are removed; the hero's use of the asset is resolved (kept intentionally or replaced with a Console instance)

### Text-only page elevation (PAGEVIS)

- [ ] **PAGEVIS-01** — `/compare` gains archetype visual(s) + motion where they lift the page (not decoration)
- [ ] **PAGEVIS-02** — `/why-dplat` gains a supporting visual / motion treatment
- [ ] **PAGEVIS-03** — The `/company` set (`/company`, `/about`, `/leadership`, `/careers`, `/contact`) and `/resources` gain visuals / motion where they lift
- [ ] **PAGEVIS-04** — `/platform/integrations` and `/demo` are elevated with archetype visuals / motion consistent with the system

### Homepage flagship capstone (HOMEVIS)

- [ ] **HOMEVIS-01** — The homepage receives the matured-system capstone pass; it is sequenced after the M5 hero LCP fix and re-runs LHCI Case C as a hard merge gate (never lands before the M5 perf gate is closed or renegotiated)

## In-flight (M5 — paused)

### Hero performance (HERO)

- [ ] **HERO-01** — Hero MP4 ships as a multi-resolution ladder (`720p` / `540p` / `360p` MP4 plus a VP9 `WebM` fallback at each tier) wired via a `<source>` media-query set so narrow-viewport / iPad-portrait clients pull the smallest variant. Mobile (≤767px) remains video-free per D-04. Source asset is 1280×720 (verified via ffprobe); 720p is the anchor, no upscaling.
- [ ] **HERO-02** — General Sans 600 is self-hosted via `next/font/local`; Fontshare CDN call removed from `globals.css`; `Wordmark` still renders with `.dn-node` pulse intact
- [ ] **HERO-03** — Hero poster image re-encoded to sub-200KB AVIF (with WebP fallback) and owns the LCP target on every viewport
- [ ] **HERO-04** — Lighthouse mobile run shows `/` LCP under 2.5s on 4G throttling; regression spec added to the test suite so future changes can't push `/` back over the line

### Analytics (ANALYTICS)

- [ ] **ANALYTICS-01** — GA4 script wired via `NEXT_PUBLIC_GA4_ID`; page-view tracking fires automatically on every route
- [ ] **ANALYTICS-02** — GTM container wired via `NEXT_PUBLIC_GTM_ID`; `window.dataLayer` initialized before `track()` calls fire
- [ ] **ANALYTICS-03** — `.env.example` documents both env vars; `HANDOFF.md` "Integrations" section notes Jeremiah Benes provisions the IDs; `src/lib/analytics.ts` `track()` continues to no-op gracefully if IDs are unset

### SEO baseline (SEO)

- [ ] **SEO-01** — Per-route `opengraph-image.tsx` via `@vercel/og` for all 11 v1 routes; consistent dark-canvas treatment with route title + dPlat wordmark
- [ ] **SEO-02** — `Organization` JSON-LD on `/` (legal name DebtNext, URL, sameAs links to TSI per Andrew's clearance)
- [ ] **SEO-03** — `SoftwareApplication` JSON-LD on `/` describing dPlat (applicationCategory: BusinessApplication, operatingSystem: Web, offers: enterprise quote)
- [ ] **SEO-04** — `ContactPage` JSON-LD on `/demo` with contactType + areaServed
- [ ] **SEO-05** — Twitter card metadata (`twitter:card` summary_large_image, `twitter:image` per route reuses OG image) across all 11 routes
- [ ] **SEO-06** — Canonical URLs per route via `metadata.alternates.canonical`; verified by an integration spec

### Definition-of-done walkthrough (DOD)

- [ ] **DOD-01** — CLAUDE.md §14 checklist walked and signed off on every v1 route (11 routes); checklist evidence committed to `docs/m5-dod-walkthrough.md`
- [ ] **DOD-02** — Open `[COI REVIEW]` flags cleared by Andrew Budish on `/company`, `/why-dplat`, `/platform/issues`, `/solutions`
- [ ] **DOD-03** — Open `[CLAIMS REVIEW]` flags cleared on the 60M+ accounts, $1.5B+ annual payments, comparison-table time-to-production ranges, leadership tenures, and encryption claims
- [ ] **DOD-04** — "Why dPlat" nav label decision applied (rename to "Why DebtNext" or keep "Why dPlat"; Connor's call) and propagated through `src/content/nav.ts`, sitemap, breadcrumbs

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
| HERO-01 | Phase 5 | — | Open |
| HERO-02 | Phase 5 | — | Open |
| HERO-03 | Phase 5 | — | Open |
| HERO-04 | Phase 5 | — | Open |
| ANALYTICS-01 | Phase 6 | — | Open |
| ANALYTICS-02 | Phase 6 | — | Open |
| ANALYTICS-03 | Phase 6 | — | Open |
| SEO-01 | Phase 7 | — | Open |
| SEO-02 | Phase 7 | — | Open |
| SEO-03 | Phase 7 | — | Open |
| SEO-04 | Phase 7 | — | Open |
| SEO-05 | Phase 7 | — | Open |
| SEO-06 | Phase 7 | — | Open |
| DOD-01 | Phase 9 | — | Open |
| DOD-02 | Phase 9 | — | Open |
| DOD-03 | Phase 9 | — | Open |
| DOD-04 | Phase 9 | — | Open |
| MOTION-01 | Phase 8 | — | Open |
| MOTION-02 | Phase 8 | — | Open |
| MOTION-03 | Phase 8 | — | Open |
| MOTION-04 | Phase 8 | — | Open |

---
*Last updated: 2026-06-04 — M6 (Premium visual + motion system) requirements added: 21 across 6 categories (FND, PLATVIS, SOLVIS, SYSVIS, PAGEVIS, HOMEVIS). M5's 21 requirements remain open/in-flight. M6 phases continue from Phase 10; traceability filled by the M6 roadmapper.*
