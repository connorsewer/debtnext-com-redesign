# Milestones

History of shipped milestones for DebtNext.com Redesign. New entries are appended at the bottom as milestones complete.

---

## M1 — Foundation (shipped)

**Goal:** Stand up the Next.js + Tailwind + design-token foundation so subsequent milestones can build pages and primitives on top.

**Shipped:**

- Repo layout normalized: `content/pages/*.md` editorial briefs, `docs/content-map.md`, `DESIGN.md`, all hero assets in `public/hero/`
- Next.js 16 scaffold with App Router and Turbopack
- Tailwind v4 (`@theme inline` block in `src/app/globals.css`)
- shadcn/ui radix-nova preset; Button overridden with DESIGN.md §8.1 variants
- Inter via `next/font/google` (body type)
- Design tokens implemented per DESIGN.md §5 (canvas `#171721`, primary `#5266EB`, foreground `#EDEDF3`, focus `#9CB4E8`)
- App shell: `SiteHeader` (fixed top-0, transparent on hero, solid on scroll), `SiteFooter` with TSI ownership disclosure line
- Initial `Hero` primitive (since replaced by the M3.5/M3.6 cinematic architecture)

**Key commit:** `73e96f7 feat(m1): foundation — Next 16 + dark shell + Header/Footer + Hero`

---

## M2 — Section primitives + complete homepage (shipped)

**Goal:** Build the reusable section primitive library and assemble the homepage from those primitives.

**Shipped:**

- 10 section primitives: `TrustBand`, `FeatureAccordion`, `ProofBand`, `BenefitSplit`, `ProcessStrip`, `IntegrationStrip`, `FinalCTA`, `SectionContainer`, `IntegrationIcons`, plus the original `Hero`
- `ScrollDepthTracker` fires `scroll_depth` events at 25 / 50 / 75 / 100 via `track()`
- Homepage assembled in correct dark-first / light-band order
- Voice pass: 0 em dashes, 0 banned phrases in rendered HTML

**Key commit:** `4a218ed feat(m2): section primitives library + complete homepage`

---

## M3 — 10 page routes + DemoForm + sitemap (shipped)

**Goal:** Build out all non-home routes, ship the demo form with CRM integration, and stand up SEO baseline (sitemap + robots + per-route metadata).

**Shipped:**

- 10 non-home routes built and live: `/platform`, 4 platform subpages (`/placement`, `/optimization`, `/issues`, `/reporting`), `/solutions`, `/why-dplat`, `/company`, `/resources`, `/demo`
- 5 additional primitives: `CardGrid`, `ComparisonTable`, `PageHero`, `ProseIntro`, `BulletList`
- `DemoForm` with React Hook Form + Zod, work-email domain blocklist, honeypot, `?email=` URL pre-fill
- `/api/demo` route with IP rate-limit + 24h duplicate-email cache; posts to Zoho CRM webhook and sends Resend confirmation
- Platform dropdown in desktop nav
- `app/sitemap.ts` with all 11 routes
- `app/robots.ts` (allow all, disallow `/api/` and `/dev/`)
- Per-route metadata

**Key commit:** `5e98a34 feat(m3): all 10 page routes + DemoForm + Zoho/Resend + sitemap/robots`

**Audit pass:** Cross-referenced against `/ui-ux-pro-max` skill output. Applied P1 (skip link, `aria-current="page"` on active nav, `touch-manipulation` on buttons, `scroll-behavior: smooth`), P2 (drawer overflow, both color-schemes pinned to `#171721`, LinkedIn fill exception documented), and P3 (ProofBand `motion.li` with `useReducedMotion` + `font-variant-numeric: tabular-nums`). Key commit: `acaefec`.

---

## M3.5 — Initial cinematic hero (shipped, then superseded)

**Goal:** Replace the static M2 hero with a Mercury-faithful 450vh CSS-sticky cinematic that scrubs through start-frame, video, and finale.

**Shipped:**

- Mercury-faithful cinematic hero with shrink/slide/fade-out finale
- Real cinematic assets wired (`/public/hero/homepage-hero.mp4`, `homepage-hero-start.png`)
- 4 bespoke tab mockups (Placement, Vendor performance, Issues, Reporting)
- AnimatePresence on tab switch with motion entrances
- Atmospheric hero typography (`clamp(2.75rem, 8vw, 7rem)`, 44–112px scale)

**Why superseded by M3.6:** Issues that drove the next pass — unframed-dashboard moment during scrub, 100vh post-pin ride-out gap, dashboard moving 28% right at end of pin, chrome-title-vs-mockup desync via AnimatePresence.

**Key commits:** `153b263 feat(m3.5): Mercury-faithful cinematic homepage hero`, `8be5cdf feat(m3.5): wire real cinematic hero assets`

---

## M3.6 — Seamless hero → Platform handoff (shipped, current architecture)

**Goal:** Eliminate the M3.5 seam artifacts and deliver a single framed dashboard that morphs through Placement → Vendor performance → Issues → Reporting as the user scrolls through the cinematic and into the Platform section.

**Shipped:**

- **Hero refactor (`HomepageHero.tsx`):** switched from CSS sticky to GSAP `pin:true`. End-frame PNG layer removed; video crossfades directly into the framed dashboard. Framed dashboard fades in at `p = 0.70 → 0.88`, holds through `p = 0.88 → 0.95`, crossfades out in place at `p = 0.95 → 1.0` (no shrink, no slide). Hero's `onUpdate` drives `[data-handoff-section]` opacity so Platform is invisible during cinematic and crossfades in at the seam.
- **Platform handoff (`HomepageHandoffSection.tsx`):** 400vh tall with `-mt-[100vh]` to align with hero's pin release. Inner `sticky top-0 h-screen` pins the framed dashboard at viewport center for 300vh. Centered-stack absolute layout with eyebrow + heading top-anchored, shared `<FramedDashboard>` absolute-centered, tabs + body + link bottom-anchored. Scroll-driven tab progression via second `ScrollTrigger` with `0.75 * vh` per tab. ARIA tab semantics preserved. `invalidateOnRefresh: true` + explicit `ScrollTrigger.refresh()` to handle hero's GSAP pin spacer timing.
- **Mockup refactor:** stripped per-mockup `<FramedDashboard>` wrappers (Platform now provides one shared bezel). Each mockup exports its title constant. Heights trimmed to fit 1373×779 viewport.
- **DebtNext wordmark (`Wordmark.tsx`):** replaced "dPlat" text wordmark in nav chrome with "DebtNext" set in General Sans SemiBold (Fontshare CDN) plus a luminous indigo `.dn-node` pulse. Suppressed under `prefers-reduced-motion`.

**Decisions locked in M3.6:**

- Hero pin uses GSAP, not CSS sticky
- Platform handoff uses CSS sticky inside 400vh outer
- Dashboard never moves during cinematic → Platform handoff
- Wordmark is "DebtNext" (company) in nav chrome; "dPlat" (product) remains in metadata and copy

**Key commits:** `12fc6be feat(homepage): seamless hero→Platform handoff with scroll-driven tabs`, `c671c39 fix(platform): scroll-driven tabs were initializing with stale layout`, `071ceb2 feat(brand): replace dPlat wordmark with DebtNext + live indigo node`

---

## M4 — Mobile responsive rebuild (shipped 2026-05-20)

**Goal:** Take the site from desktop-first to mobile-first with a system-level rebuild against the spec at `docs/superpowers/specs/2026-05-20-mobile-responsive-rebuild-design.md`.

**Shipped in 4 phases:**

**Phase 1 — Foundation:** fluid Utopia type scale 360→1440 normalized; container queries enabled (`container-section`, `container-card`, `container-form`); touch-target tokens + utilities added; `env(safe-area-inset-*)` applied to `SiteHeader`, `FinalCTA`, `DemoForm`; mobile/tablet/desktop section padding tokens shipped; reduced-motion audit complete across Framer + GSAP + CSS. DESIGN.md §9 documents the foundation.

**Phase 2 — Primitives:** 9-row responsive contract (DESIGN.md §9.7) defining behavior for FeatureAccordion (single column + 44px triggers below 1024 container), BenefitSplit (vertical below 768 container, `mediaPosition` gated), ComparisonTable (desktop table ≥1024 / sticky-first-column 768–1023 / card stack <768), ProcessStrip (vertical timeline below 768 container), AttachedForm (stacked below 384 container, pill radius preserved), CardGrid (1/2/3/4 cols by container at 384/1024/1280). Remaining primitives (HomepageHero, PageHero, TrustBand, ProofBand, IntegrationStrip, FinalCTA) audited and patched where touch targets or fluid tokens needed correction.

**Phase 3 — Platform handoff mobile:** `useIsMobile()` and `useInView()` shared hooks at `src/hooks/`. `HomepageHandoffSection.tsx` branches at `(max-width: 767px)`. Desktop keeps the 300vh GSAP-pinned scroll cinematic. Mobile renders a calm static stack: heading, then 4 vertical mockup blocks each with `FramedDashboard` and a shared "See how it works" link. `useGSAP` bails on mobile with `isMobile` in deps. Each mockup's Framer entrance gated by `useInView`. `FramedDashboard` padding tightens to `p-3` below 384px container width.

**Phase 4 — QA + CI:** 9-breakpoint × 11-route matrix (99 tests) passing. axe-core CI workflow runs on every PR at 375 and 1440. Touch-target audit (all interactive elements ≥44×44 at 375) zero failures across 11 routes. Reduced-motion verification green across 11 routes. Platform mobile contract spec verifies static-stack render. Lighthouse mobile passes LCP/CLS/INP on 10 of 11 routes; homepage `/` misses LCP at 2.86s due to the 11 MB hero MP4 (deferred to M5). Two new accent-text tokens (`--accent-text-dark`, `--accent-text-light`) shipped to clear WCAG 2.2 AA contrast for eyebrows and inline links; `--primary` stays exclusive to filled CTA surfaces.

**Hotfix (PR #2 `8854da7`):** Phase 2 shipped a container-query self-reference bug where `container-section` was declared on the same element using `@md/section:` / `@lg/section:` queries. Per CSS spec, container queries can't query the element they're declared on, so desktop multi-column layouts silently fell back to the 1-column mobile rule. Fix moved `container-section` to `SectionContainer`'s inner wrapper and removed redundant declarations from `BenefitSplit`, `FeatureAccordion`, and `ProcessStrip`. New regression spec at `tests/responsive/container-query-layouts.spec.ts`.

**Tooling (PR #3 `bd2d7ce`):** GreenSock's official gsap-skills pack installed at `.claude/skills/`. 8 skills covering core, timeline, ScrollTrigger, plugins, utils, React, performance, frameworks. All formerly Club GSAP plugins (SplitText, MorphSVG, Flip, Draggable, Inertia, Observer, ScrollSmoother) are free post-Webflow acquisition.

**Test suite total: 164 specs, all green** against production build.

**Key commits:** `b155b13 M4: Mobile responsive rebuild (#1)`, `8854da7 fix(m4): repair Phase 2 container-query self-reference (#2)`, `bd2d7ce chore: install gsap-skills for animation guidance (#3)`, `01ac299 docs: update HANDOFF with post-M4 hotfix (#4)`, `dc71fab chore: commit skills-lock.json from gsap-skills install (#5)`

---

*Last updated: 2026-05-20 after GSD `.planning/` bootstrap captured M1–M4 retroactively. M5 will be opened via `/gsd-new-milestone` immediately following this bootstrap commit.*
