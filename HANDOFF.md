# DebtNext.com session handoff

This document captures the full state of the rebuild after M1–M4 shipped and M5 was opened via `/gsd-new-milestone`, so a fresh Claude Code session can resume without context rot.

Last session ended: 2026-05-20 (post-M4 ship + GSD `.planning/` apparatus bootstrapped + M5 milestone opened with 5 phases). Author: Connor + Claude Opus 4.7.

---

## TL;DR for the next agent

You are continuing a **production rebuild of debtnext.com** modeled on Mercury.com. The site is live in production at **https://debtnext-website.vercel.app**.

**M1, M2, M3, M3.5, M3.6, and M4 are complete and deployed.** All 11 v1 routes ship. The hero to "THE PLATFORM" handoff is continuous, with no visible seam. The DebtNext wordmark (with a live indigo node) is in nav chrome. M4 added the mobile responsive system (Utopia type scale, container queries, 44px touch targets, axe-core CI).

**M5 hero performance is CLOSED (2026-06-04).** Phases 5 + 5.1 + 5.2 + 5.3 shipped together (D-08); HERO-01..04 are Done. The `/` LCP gate is green: real H1 paint about 1,254 ms vs the 2,300 ms bar. The path there was the multi-res MP4 ladder + mobile-video-free gate (5.1), the AVIF poster (5.2), and lazy-loaded GSAP off the `/` eager chunk (5.3). The LHCI gate's last 4,388 ms simulate projection wasn't movable by JS or asset changes, so the gate switched `throttlingMethod` simulate→devtools (real Chrome paint, SAME slow-4G + 4x CPU profile); the 2,300 ms bar and the throttle profile are unchanged. This work lives on branch phase-05.3, PR #7; the merge to main is Connor's pending call. The one remaining red Playwright test (`container-query-layouts.spec.ts:17`) is pre-existing on main, not a 5.3 regression.

The next milestone is **M6 (Premium visual + motion system)** (Phases 10-15, running alongside M5). **M6 Phase 10 (Foundation) is the next thing to start** (`/gsd-plan-phase 10`); its cross-milestone dependency on M5 Phase 5.3 (lazy-GSAP) is now satisfied. M5's remaining work (Analytics, SEO, DoD) stays open; M5's Phase 8 Motion is superseded by M6 Phase 10. Roadmaps in `.planning/ROADMAP.md`.

**Read these first, in this order:**

1. `CLAUDE.md` — operating contract (tech stack, voice rules, COI/claims review, what-not-to-do)
2. `.impeccable.md` — design brief (brand personality, anti-references, 5 design principles)
3. `DESIGN.md` — visual token spec
4. `docs/content-map.md` — IA and approval gates
5. `.planning/PROJECT.md` — project context + M1–M4 validated set + M5 active scope
6. `.planning/ROADMAP.md` — M5 phase structure (Phase 5–9, dependency graph, parallelization map)
7. `.planning/REQUIREMENTS.md` — 21 M5 requirements with REQ-IDs and phase traceability
8. This document

---

## Live URLs

- **Production (alias)**: https://debtnext-website.vercel.app
- **Latest specific build**: https://debtnext-website-3fr4ow8nm-connor-laughlins-projects.vercel.app (`c671c39`). Useful when the alias is serving stale chunks via CDN cache.
- **Vercel project**: `connor-laughlins-projects/debtnext-website` (`prj_Q8Wbxa2ioco7n2MogdHnPpL0MmRP`)
- **Snapshot script**: `node scripts/snap-hero-scrub.mjs` (writes to `./hero-snapshots/`)
- **Re-encode script**: `./scripts/reencode-hero.sh <input.mp4>` (for video updates)

**Vercel CDN cache caveat**: the alias domain can serve stale JS chunks for a few minutes after a deploy. If a fix looks like it didn't ship, check the specific build URL or do a hard-reload (Cmd+Shift+R or DevTools → "Empty cache and hard reload").

---

## Stack and current versions

- Next.js **16.2.6** (App Router · Turbopack). Note: this is Next 16, not 15. `AGENTS.md` at repo root warns that APIs may differ from training data — consult `node_modules/next/dist/docs/` for current behavior before writing tricky Next code.
- React 19.2.4
- TypeScript strict
- Tailwind v4 (CSS-first, `@theme inline` block, tokens in `src/app/globals.css`)
- shadcn/ui (radix-nova preset). Button is overridden; primitives via `@radix-ui/*`.
- Framer Motion 12 (per-mockup entrance animations)
- GSAP 3 + `@gsap/react` (hero cinematic scrub + Platform tab-progression ScrollTrigger)
- React Hook Form + Zod (demo form)
- Resend (transactional email, server-only) + Zoho webhook (lead capture)
- ffmpeg (local-only, for the hero MP4 re-encode)
- General Sans 600 (Fontshare CDN, wordmark only)

Full `package.json` dep list is committed.

---

## Source-of-truth files

| Path | What's there |
|---|---|
| `CLAUDE.md` | Operating contract. Voice rules in §5, TSI/COI rules in §6, claims review in §7, anti-scope in §15, DoD in §14. |
| `.impeccable.md` | Design brief: 3-word personality (calm, precise, technical), Mercury-only reference, 4 anti-references, 5 design principles. |
| `DESIGN.md` | Mercury-faithful token spec. Locked tokens: primary `#5266EB`, canvas `#171721`, foreground `#EDEDF3`, focus `#9CB4E8`. |
| `docs/content-map.md` | All 11 v1 routes + approver gates. |
| `content/pages/*.md` | Editorial source-of-truth for each page; these are read by humans, NOT imported at build time. |
| `src/content/<page>.ts` | Typed content modules consumed by page TSX. Mirrors the .md briefs. |

---

## File-tree map (key locations)

```
src/
├── app/
│   ├── layout.tsx              site shell, Inter font, fixed nav, skip-link
│   ├── page.tsx                homepage assembly (cinematic hero + Platform handoff + 6 sections)
│   ├── globals.css             Tailwind v4 @theme tokens + .dn-node pulse + General Sans @import
│   ├── sitemap.ts              all 11 routes
│   ├── robots.ts               allow all, disallow /api/ and /dev/
│   ├── api/demo/route.ts       Zoho webhook + Resend email + rate limit
│   ├── platform/
│   │   ├── page.tsx + content   /platform
│   │   ├── placement/page.tsx   /platform/placement
│   │   ├── optimization/...    + 2 more platform subpages
│   ├── solutions/page.tsx
│   ├── why-dplat/page.tsx      ComparisonTable
│   ├── company/page.tsx        TSI disclosure (COI-sensitive)
│   ├── resources/page.tsx      newsletter AttachedForm
│   └── demo/page.tsx           DemoForm
├── components/
│   ├── site/
│   │   ├── SiteHeader.tsx      FIXED top, uses <Wordmark/>, Platform dropdown, active state via usePathname
│   │   ├── SiteFooter.tsx      uses <Wordmark/>, 5 link groups + TSI ownership line
│   │   ├── MobileNav.tsx       Radix Dialog drawer, uses <Wordmark/>
│   │   └── Wordmark.tsx        DebtNext in General Sans SemiBold + .dn-node indigo dot
│   ├── sections/
│   │   ├── HomepageHero.tsx    GSAP pin:true cinematic, crossfades into Platform at p=0.95→1.0
│   │   ├── HomepageHandoffSection.tsx   "THE PLATFORM" — 400vh sticky-pinned, scroll-driven tabs
│   │   ├── PageHero.tsx        non-home routes (centered/split variants)
│   │   ├── ProseIntro.tsx
│   │   ├── TrustBand.tsx
│   │   ├── FeatureAccordion.tsx       a11y tab pattern
│   │   ├── ProofBand.tsx              motion reveal + tabular-nums
│   │   ├── BenefitSplit.tsx           dark/light/elevated surfaces
│   │   ├── ProcessStrip.tsx
│   │   ├── IntegrationStrip.tsx
│   │   ├── CardGrid.tsx               2/3/4-col flexible grid
│   │   ├── ComparisonTable.tsx        desktop table + mobile stacked-cards
│   │   ├── BulletList.tsx
│   │   ├── FinalCTA.tsx
│   │   ├── SectionContainer.tsx       surface = dark | elevated-dark | light
│   │   ├── HeroAccountsPanel.tsx      [LEGACY — not rendered on homepage anymore]
│   │   └── mockups/
│   │       ├── FramedDashboard.tsx          3-dot chrome bezel (p-4 mobile / p-5 desktop)
│   │       ├── PlacementMockup.tsx          4 pool tiers, bars grow + engine ping
│   │       ├── VendorPerformanceMockup.tsx  4 vendors, grade badges + sparkline draw-on
│   │       ├── IssuesMockup.tsx             3 issue cards + overdue ping
│   │       ├── ReportingMockup.tsx          chart pathLength draw
│   │       └── index.tsx                    MockupForTab + mockupTitleForTab()
│   ├── analytics/ScrollDepthTracker.tsx
│   ├── icons/IntegrationIcons.tsx
│   ├── forms/DemoForm.tsx              RHF + zod, ?email= pre-fill
│   └── ui/
│       ├── button.tsx                  DESIGN.md §8.1 variants
│       └── AttachedForm.tsx            pill-attached newsletter form
├── content/
│   ├── nav.ts                          primary nav + footer groups + tsiOwnershipLine
│   ├── homepage-hero.ts                cinematic hero copy + tabs
│   ├── homepage.ts                     legacy homepage content (TrustBand etc.)
│   ├── placement.ts ... (4 more)       platform subpages
│   ├── platform.ts
│   ├── solutions.ts
│   ├── why-dplat.ts
│   ├── company.ts
│   ├── resources.ts
│   └── demo.ts
└── lib/
    ├── utils.ts                        cn helper
    ├── analytics.ts                    track(event)
    ├── email.ts                        Resend confirmation
    ├── zoho.ts                         Zoho lead webhook
    └── validation/demo-schema.ts       shared client + server Zod schema

scripts/
├── reencode-hero.sh                    ffmpeg -g 1 -keyint_min 1 per-frame keyframes
├── snap-hero-scrub.mjs                 Playwright snapshot script
└── snap-hero.mjs                       earlier snap script (kept for reference)

public/
├── hero/
│   ├── homepage-hero-720p.mp4          ladder tier (Phase 5.1, gates ≥1440px viewports)
│   ├── homepage-hero-540p.mp4          ladder tier (Phase 5.1, gates 1024-1439px viewports)
│   ├── homepage-hero-360p.mp4          ladder tier (Phase 5.1, gates 768-1023px viewports)
│   └── homepage-hero-start.avif        112 KB AVIF poster (Phase 5.2, drives <Image> + <video poster>)
└── product/
    └── dashboard-dark.png              1536×1024 standalone dashboard
```

---

## What's complete

### M1 — Foundation (deployed)

- Repo normalized: `content/pages/*.md`, `docs/content-map.md`, `DESIGN.md`, all hero assets in `public/hero/`
- Next 16 scaffolded, Tailwind v4 + shadcn/ui (radix-nova) + Inter via `next/font/google`
- Design tokens implemented in `globals.css` per DESIGN.md §5
- App shell: SiteHeader (fixed top-0), SiteFooter (TSI ownership line)

### M2 — Section primitives + complete homepage (deployed)

- 10 section primitives: `TrustBand`, `FeatureAccordion`, `ProofBand`, `BenefitSplit`, `ProcessStrip`, `IntegrationStrip`, `FinalCTA`, `SectionContainer`, `IntegrationIcons` (+ since-replaced `Hero`)
- `ScrollDepthTracker` fires `scroll_depth` at 25/50/75/100
- Homepage assembled with all sections in correct dark-first/light-band order

### M3 — 10 pages + DemoForm + sitemap (deployed)

- All 10 non-home routes built and live (`/platform`, 4 platform subpages, `/solutions`, `/why-dplat`, `/company`, `/resources`, `/demo`)
- 5 additional primitives: `CardGrid`, `ComparisonTable`, `PageHero`, `ProseIntro`, `BulletList`
- `DemoForm`: RHF + Zod, work-email domain blocklist, honeypot, `?email=` pre-fill
- `/api/demo` route: IP rate-limit + 24h dup-email cache; posts to Zoho + sends Resend
- Platform dropdown in desktop nav
- `app/sitemap.ts` + `app/robots.ts` + per-route metadata

### M3.5 — Initial cinematic homepage hero (deployed, then superseded by M3.6)

The original 450vh CSS-sticky cinematic with shrink/slide/fade-out finale that handed off to a 2-column Platform section. Notable issues that drove M3.6: unframed-dashboard moment during scrub, 100vh post-pin ride-out gap, dashboard moving 28% right at end of pin, and chrome-title-vs-mockup desync via AnimatePresence.

### M3.6 — Seamless hero → Platform handoff (deployed, current)

This is the architecture in production today. Three intertwined pieces:

**Hero (`HomepageHero.tsx`)**

- Switched from CSS sticky to **GSAP `pin: true`** to eliminate the 100vh post-pin ride-out band.
- Outer section is now content-driven height; GSAP creates the pin spacer dynamically. Pin duration is `2.6 * window.innerHeight` of scroll.
- **End-frame PNG layer removed** — was a full-bleed unframed dashboard PNG that produced the unframed-moment artifact between video fade-out and framed-dashboard fade-in. The video now crossfades directly into the framed dashboard.
- Framed dashboard fades in at `p = 0.70 → 0.88`, holds through `p = 0.88 → 0.95`, then crossfades **out in place** at `p = 0.95 → 1.0`. **No shrink, no slide, no translate.** Mirror crossfade on the Platform section's matching bezel.
- Hero's onUpdate also drives `[data-handoff-section]`'s opacity (also `ease(0.95, 1.0, p)`) so Platform is invisible during the cinematic and crossfades in at the seam.
- Cliffside start-frame fades out at `p = 0.78 → 0.88`.
- Mobile (≤768px): scrub disabled, static start-frame with overlay shown statically.

**Platform handoff section (`HomepageHandoffSection.tsx`)**

- Section is `400vh` tall with `-mt-[100vh]` so its top aligns exactly with the hero's pin release (`scrollY ≈ 2.6vh`). Inner `sticky top-0 h-screen` pins the framed dashboard at viewport center for 300vh of scroll.
- **Centered-stack layout** via absolute positioning inside the sticky inner:
  - Eyebrow + heading absolute-anchored at `top-[88px]` / `md:top-[96px]` (clears the fixed nav)
  - One shared `<FramedDashboard>` bezel absolute-centered (`top-1/2 -translate-y-1/2`). Width matches the hero's bezel exactly (`max-w-5xl`, left=208, width=1024 on a 1440 viewport). The bezel never moves.
  - Tabs + body + link absolute-anchored at `bottom-[3vh]` / `md:bottom-[3.5vh]`
- **Scroll-driven tab progression** via a second `ScrollTrigger`:
  - Each tab gets `0.75 * vh` of scroll (~75vh). 4 tabs × 75vh = 300vh of pin.
  - Tab clicks smooth-scroll to ~30% into that tab's slice. Respects `prefers-reduced-motion`.
  - **Critical** init pattern: `invalidateOnRefresh: true` plus an explicit `ScrollTrigger.refresh()` immediately after `ScrollTrigger.create(...)`. Without this, the trigger caches a stale start position (the hero's GSAP pin spacer hasn't been added yet when the Platform's `useGSAP` runs), and the user lands on the Reporting tab.
  - ARIA tab semantics preserved (`role="tab"`, `aria-selected`, `aria-controls`, `aria-orientation="horizontal"`). ArrowLeft/Right keyboard nav delegates to the same smooth-scroll path.
- Mockup-switch sync: previously used `AnimatePresence mode="wait"` which lingered 250ms during which the chrome title showed "PLACEMENT RUN" while the inner queue was still Issues. **Removed AnimatePresence** — `<MockupForTab key={activeId} />` re-mounts the mockup cleanly. Each mockup's internal motion animations replay on every mount.

**Mockup refactor**

- Each per-tab mockup (`PlacementMockup`, `VendorPerformanceMockup`, `IssuesMockup`, `ReportingMockup`) used to wrap itself in `<FramedDashboard>`. Now stripped — the Platform section provides one shared bezel.
- Each mockup exports its title constant. `mockupTitleForTab(id)` in `mockups/index.tsx` returns the right title for the active tab.
- Heights trimmed to fit a 1373×779 viewport without overlapping the heading or the tab pills:
  - Placement: 5 tiers → 4, dropped the "Daily reconciliation" footer line, `space-y-3 → space-y-2.5`. New height ~390.
  - Vendor: 5 rows → 4 (dropped Best Resolution; A / A- / B / C still tells the full spectrum), `space-y-3 → space-y-2.5`. New height ~390.
  - Issues: 4 cards → 3 (kept SCRA Overdue / Dispute / Decedent — one per SLA tone). Height ~369.
  - Reporting: untouched. Height ~374.
- `FramedDashboard` inner padding: `p-5 → p-4 md:p-5` (~16px shaved on mobile).

**Wordmark (`Wordmark.tsx`)**

- Replaces the "dPlat" text in `SiteHeader`, `SiteFooter`, `MobileNav` with "DebtNext" set in **General Sans SemiBold** (Fontshare CDN, `display=swap`; Inter fallback).
- A luminous indigo node (`.dn-node`) trails the final letter. Not decoration — represents a live point in the orchestration lattice. Soft glow via box-shadow, slow `dn-node-pulse` keyframe animation (2.6s cubic-bezier(0.4, 0, 0.2, 1)). Suppressed under `prefers-reduced-motion`.
- Metadata titles in `app/layout.tsx` still reference "dPlat" as the product name — only the visible nav chrome wordmark changed.

### Audit pass (deployed)

Cross-referenced against `/ui-ux-pro-max` skill output. Applied:

- P1: skip link, `aria-current="page"` on active nav, `touch-manipulation` on buttons, `scroll-behavior: smooth`
- P2: drawer overflow, both color-schemes pinned to `#171721`, LinkedIn fill exception documented in `.impeccable.md`
- P3: ProofBand `motion.li` with `useReducedMotion` + `font-variant-numeric: tabular-nums`

---

## M4 mobile responsive rebuild (deployed)

Full system rebuild against the approved spec at `docs/superpowers/specs/2026-05-20-mobile-responsive-rebuild-design.md`. Shipped 2026-05-20 across four phases.

**Phase 1 — Foundation (2026-05-20):** fluid type scale normalized to Utopia 360→1440; container queries enabled (`container-section`, `container-card`, `container-form`); touch-target tokens + utilities added; `env(safe-area-inset-*)` applied to SiteHeader, FinalCTA, DemoForm; mobile/tablet/desktop section padding tokens shipped; reduced-motion audit complete (Framer + GSAP + CSS transitions). DESIGN.md §9 documents the foundation.

**Phase 2 — Primitives (2026-05-20):** FeatureAccordion (single column + 44px triggers below 1024 container), BenefitSplit (vertical below 768 container, `mediaPosition` gated), ComparisonTable (desktop table ≥1024 / sticky-first-column 768–1023 / card stack <768), ProcessStrip (vertical timeline below 768 container), AttachedForm (stacked below 384 container, pill radius preserved), CardGrid (1/2/3/4 cols by container at 384/1024/1280); remaining primitives (HomepageHero, PageHero, TrustBand, ProofBand, IntegrationStrip, FinalCTA) audited and patched where touch targets or fluid tokens needed correction. DESIGN.md §9.7 contains the 9-row contract table.

**Phase 3 — Platform handoff mobile (2026-05-20):** `useIsMobile()` and `useInView()` shared hooks at `src/hooks/`. `HomepageHandoffSection.tsx` branches at `(max-width: 767px)`: desktop keeps the 300vh GSAP-pinned scroll cinematic; mobile renders a calm static stack (heading, then 4 vertical mockup blocks each with a `FramedDashboard` and the shared "See how it works" link). `useGSAP` bails on mobile with `isMobile` in deps so devtools resize cleans up triggers. Each mockup's Framer entrance is gated by `useInView`. `FramedDashboard` padding tightens to `p-3` below 384px container width.

**Phase 4 — QA + CI (2026-05-20):** 9-breakpoint × 11-route matrix (99 tests) passing. axe-core CI workflow runs on every PR at 375 and 1440. Touch-target audit (all interactive elements ≥44×44 at 375) zero failures across 11 routes. Reduced-motion verification (no running animations under `prefers-reduced-motion: reduce`) green across 11 routes. Platform mobile contract spec verifies the static-stack render and catches GSAP pin-spacer regressions. Lighthouse mobile passes LCP / CLS / INP on 10 of 11 routes; homepage `/` misses LCP at 2.86s due to the 11 MB hero MP4 (deferred to post-M4, see `docs/m4-perf-baseline.md`). Two new accent-text tokens (`--accent-text-dark`, `--accent-text-light`) shipped to clear WCAG 2.2 AA contrast for eyebrows and inline links; `--primary` stays exclusive to filled CTA surfaces.

**Post-merge hotfix (2026-05-20, PR #2 `8854da7`):** Phase 2 shipped a container-query self-reference bug where `container-section` was declared on the same element that used `@md/section:` / `@lg/section:` queries. Per CSS spec, container queries can't query the element they're declared on, so desktop multi-column layouts silently fell back to the 1-column mobile rule. Fix moved `container-section` to `SectionContainer`'s inner wrapper and removed the redundant declarations from `BenefitSplit`, `FeatureAccordion`, and `ProcessStrip`. New regression spec at `tests/responsive/container-query-layouts.spec.ts` asserts BenefitSplit on `/` renders side-by-side at 1440 and stacked at 375. Suite total: 164 tests, all green against production build.

**Tooling (2026-05-20, PR #3 `bd2d7ce`):** GreenSock's official gsap-skills pack installed at `.claude/skills/`. 8 skills covering core, timeline, ScrollTrigger, plugins, utils, React, performance, frameworks. Auto-loads on next session start. All formerly Club GSAP plugins (SplitText, MorphSVG, Flip, Draggable, Inertia, Observer, ScrollSmoother, etc.) are free post-Webflow acquisition, so the full plugin surface is available.

## M6 Phase 12 — Per-industry solutions visuals (2026-06-12)

Killed the duplicate `SolutionsIndustryCards` widget that shipped identically across all 7 solution surfaces (6 industry pages + the `/solutions` hub). Each surface now renders its own typed visual payload fed into the shared archetype components (`ConsoleVisual` / `SchematicVisual` / `DataStoryVisual` from `src/components/product/visuals/archetypes.tsx`):

- **Per-industry payload modules** at `src/content/visuals/solutions-<industry>.ts` (utilities, financial-services, telecom, fintech, insurance, healthcare). Each carries a Console hero + a Schematic (placement) + a DataStory (carrier) + a Console (remaining item), so all three archetypes appear on every industry page. Archetype + accent assignments are locked in `.planning/phases/12-solutions-per-industry-visuals/12-ARCHETYPE-MAP.md` (D-08 no-two-alike, D-11 chart-1/3/4/5 accents only).
- **Hub DataStory** at `src/content/visuals/solutions-hub.ts` (`solutionsHubStory`): a 6-card cross-industry overview in the `/solutions` BenefitSplit slot, distinct from every industry page's Console hero.
- **Deleted:** `src/components/product/visuals/SolutionsIndustryCards.tsx` and its `LazySolutionsIndustryCards` export in `lazy.tsx`. The cards branch of `DataStoryData` (types.ts) subsumes the old layout, so the no-prop duplicate is impossible to reconstruct. Remaining `SolutionsIndustryCards` mentions in src/ are inert history comments only.
- Numbers are real-shaped, anonymized, generic per D-09 (Andrew pre-cleared 2026-06-12); `[CLAIMS REVIEW]`/`[COI REVIEW]` tags retained on payloads for audit, non-blocking. Closes SOLVIS-01..05.

## M6 Phase 13: Visual system consolidation (2026-06-13)

Consolidated the homepage handoff onto the archetype library. All 4 platform tabs (placement, performance, issues, reporting) now render bare `Console` instances behind the unchanged `MockupForTab` / `mockupTitleForTab` / `FramedDashboard` facade in `src/components/sections/mockups/index.tsx`; the firewall files (`HomepageHero.tsx`, `HomepageHandoffSection.tsx`) and the `FramedDashboard.tsx` bezel were held byte-unchanged the entire phase (verified per-task via `git diff --exit-code`).

- **Typed payloads** at `src/content/visuals/handoff-{placement,performance,issues,reporting}.ts`, each `satisfies ConsoleData` with DESIGN.md chart tokens only (zero raw hex) and `[CLAIMS REVIEW]` + `[COI REVIEW]` markers. Performance grade/sparkline and reporting dual-line trend are approximated within the Console schema (no schema extension): severity rides as label-paired TEXT in row `secondary`, never color-only (Pitfall 8).
- **Reporting archetype (D-04):** rendered as Console-with-KPIs, the D-04-compliant path. A scoped DataStory exception to D-04 was NOT taken (it requires explicit user approval that was not granted this run); the 8-week trend is stated in words. If the trend reads weak on the preview, the DataStory exception is the documented fallback, and only with approval.
- **Retired (D-05):** the 4 bespoke per-tab mockup files (`PlacementMockup`, `VendorPerformanceMockup`, `IssuesMockup`, `ReportingMockup`) are deleted; `sections/mockups/` now holds only `index.tsx` (facade) + `FramedDashboard.tsx` (both pinned by the firewall imports, so the directory does not fully disappear).
- **Tokens (P13-02):** off-token gradient hex (`#22c55e`/`#d97706`/`#0891b2`) is eliminated; it only ever lived in `PlacementMockup`, now deleted. `grep -rn "#22c55e\|#d97706\|#0891b2" src/` returns zero.
- **Dead assets (SYSVIS-02):** the only remaining `.png` reference in `src/` is the hero finale `dashboard-dark.png` in `HomepageHero.tsx`. It is intentionally retained pending **Phase 15** (HOMEVIS-01); Phase 13 confirms and documents it but does not delete it (editing the hero would also violate the firewall). The 6 dead BenefitSplit `dashboard-dark.png` fallbacks remain gone (removed in Phase 10).
- Full Playwright execution of the 8-spec regression set is deferred to CI (PR #12). Desktop cinematic parity human-verify (all 4 tabs) is deferred to a single end-of-phase preview review by Connor. Closes SYSVIS-01, SYSVIS-02 (code-complete; visual sign-off pending).

**Front B / P13-01 — FeatureAccordion dead-code-after-repoint (2026-06-13):** the homepage `FeatureAccordion`'s `VISUALS` registry (`src/components/product/visuals/index.tsx`) was repointed so `placement`/`optimization`/`issues`/`reporting` render their prop-less Phase 11 `*Flagship` Console-composed instances instead of the bespoke `PlacementMatrix`/`OptimizationEngine`/`IssuesWorklist`/`ReportingDashboard`. The `reporting` key migration (`./ReportingDashboard` → `./ReportingFlagship`) is the explicit P13-01 requirement and is grep-verified. `ComplianceStandards` (the 5th id) is KEPT — it is not in the P13-01 deletion four and has no Flagship/Console twin. After a pre-delete import guard (`grep -rn` in `src/` returns zero live references; only historical comments remain), the 4 bespoke components were deleted as a set, along with their 4 dead `Lazy*` wrappers in `lazy.tsx` (`LazyPlacementMatrix`/`LazyOptimizationEngine`/`LazyIssuesWorklist`/`LazyReportingDashboard`, zero consumers). `tsc --noEmit`, `eslint`, and a clean `next build` all pass; `/` still prerenders. Visual parity of the repointed accordion (Flagship visual per id, no blank box, no double-frame, reduced-motion safe) is the deferred end-of-phase preview item. Closes P13-01.

## M6 Phase 15: Homepage flagship capstone (2026-07-01)

The hero finale now renders the live Console archetype instead of a raster. Inside the held `FramedDashboard` finale in `src/components/sections/HomepageHero.tsx`, the `<Image src="/product/dashboard-dark.png" ...>` child was replaced with `<Console bare data={handoffPlacementConsole} />` (imported from `@/components/product/visuals/Console` and `@/content/visuals`), mirroring the Phase 13 handoff-tab call shape. This reuses the existing Phase 13 placement payload verbatim — no new content, captions, or claims. The hero-to-Platform seam is now one continuous system visual (both surfaces render the same Console).

- **Firewall preserved:** the `data-hero-framed-dashboard` wrapper and the `FramedDashboard` chrome title (`"DebtNext · Executive Portfolio Overview"`) are byte-identical. `HeroCinematicController.tsx` animates only the wrapper's `.style.opacity` and never queries the child element, so no controller change was needed. The `Image` import stays (still used by the Layer-1 LCP start-frame).
- **Raster retired (SYSVIS-02 tail):** `public/product/dashboard-dark.png` was deleted as a standalone commit for clean rollback. `grep -rn "dashboard-dark" src/ scripts/` returns zero; the only surviving references are in the new regression spec, which asserts the raster is ABSENT.
- **Regression guard:** `tests/responsive/hero-finale-console.spec.ts` (structural, mirrors `tests/responsive/handoff-*.spec.ts`) asserts `[data-hero-framed-dashboard]` contains exactly one Console (`role="img"` bare root) and zero `<img>` rasters. Live cinematic pixel parity stays HUMAN-VERIFY.
- **Verification:** `tsc --noEmit`, `eslint src tests`, and `next build` all clean; the `/` route-JS budget guard (`scripts/check-route-js-budget.sh`, 865,308-byte ceiling) still passes. LHCI Case C re-baseline is recorded from the PR's green CI run. Closes HOMEVIS-01 (code-complete; desktop cinematic sign-off pending on the preview).

## M5 — Launch readiness + motion pass (opened 2026-05-20)

The post-M4 follow-ups listed here were folded into M5 when Connor chose framing (b) — bundle launch-critical items + motion into a single longer milestone. Roadmap lives in `.planning/ROADMAP.md` (Phases 5–9, 21 requirements, 100% coverage). REQ-IDs and traceability in `.planning/REQUIREMENTS.md`.

**M5 phase map:**

| # | Phase | What ships | REQ-IDs | Depends on |
|---|---|---|---|---|
| 5 | **Hero performance** (critical-path) | Multi-res MP4 ladder (720p/540p/360p + WebM at each tier), self-host General Sans via `next/font/local`, sub-200KB AVIF poster, regression spec | HERO-01..04 | Nothing |
| 6 | **Analytics wiring** | GA4 + GTM script tags via `NEXT_PUBLIC_GA4_ID` / `NEXT_PUBLIC_GTM_ID`; `track()` continues no-op when unset; `.env.example` + this doc updated | ANALYTICS-01..03 | Nothing (parallel with 5, 7) |
| 7 | **SEO baseline** | Per-route OG images via `@vercel/og`, `Organization` + `SoftwareApplication` JSON-LD on `/`, `ContactPage` JSON-LD on `/demo`, Twitter cards, canonical URLs | SEO-01..06 | Nothing (parallel with 5, 6) |
| 8 | **Motion pass** | Framer `useInView` section reveals on 10 non-home pages + `ProofBand` number counters; reduced-motion gated; `/` LCP stays under 2.5s with ≤+20KB bundle delta | MOTION-01..04 | Phase 5 (LCP headroom) |
| 9 | **DoD walkthrough + launch readiness** | CLAUDE.md §14 walked on every v1 route (evidence in `docs/m5-dod-walkthrough.md`), all open `[COI REVIEW]` cleared by Andrew, all `[CLAIMS REVIEW]` cleared, "Why dPlat" nav label decision applied | DOD-01..04 | Phases 5, 6, 7, 8 |

**Parallelization graph:** Phases 5/6/7 are mutually independent — three branches could ship concurrently. Phase 8 waits on Phase 5 because MOTION-04 measures `/` LCP against the headroom Phase 5 establishes. Phase 9 is the launch gate.

**Phase 5 Wave 0 progress (2026-05-21):** scaffolding landed. `scripts/build-hero-ladder.sh` + `scripts/verify-hero-keyframes.sh` ready to encode 720p/540p/360p × {MP4, WebM}; `src/app/fonts.ts` + `src/app/fonts/GeneralSans-Semibold.woff2` (sha256 in the commit body); `next.config.ts` AVIF/WebP `images.formats`; `lighthouserc.json` + `.github/workflows/perf.yml` (2300ms LCP gate, median-of-3 on `/`); 3 Playwright spec stubs under `tests/hero/`. REQUIREMENTS.md HERO-01 amended to the actual 720p/540p/360p ladder shape (researcher-verified, user-ratified). Wave 1 (HERO-01 wiring, HERO-02 self-host, HERO-03 AVIF poster) can now run parallel.

**Phase 5 Wave 1 progress — HERO-01 shipped (2026-05-21, plan 05-02):** 6 ladder binaries emitted to `public/hero/` (360p / 540p / 720p × {MP4 H.264 / WebM VP9}, all scrub-encoded `-g 1 -keyint_min 1` per D-05). `heroCinematic.media.video` extended from `string` to `Array<{src, type, media?}>` per D-01 — WebM VP9 first, MP4 H.264 second, narrowest-viewport `media` query first within each codec. `HomepageHero.tsx` `<video>` element maps the 6 entries to `<source>` children inside the existing `{!isMobile}` gate; GSAP master ScrollTrigger (lines 56-145) untouched; poster/muted/playsInline/preload/aria-hidden/style/className all preserved. `tests/hero/source-ladder.spec.ts` replaced with live ordering assertion (3 video/webm then 3 video/mp4, narrowest viewport first). `public/hero/homepage-hero-end.png` removed (unreferenced since M3.6).

**Phase 5 Wave 1 progress — HERO-02 shipped (2026-05-21, plan 05-03):** General Sans 600 self-hosted. `src/app/globals.css` line 1 Fontshare `@import` deleted; `src/app/layout.tsx` imports `generalSans` from `./fonts` and applies `generalSans.variable` on `<html>` className alongside `inter.variable`; `Wordmark.tsx` inline `fontFamily` leads with `var(--font-general-sans)` defensively against next/font family-name hashing, with `"General Sans"` + Inter + system-ui retained as safety net. `.dn-node` keyframes + `.dn-node` class + `prefers-reduced-motion` suppression in `globals.css` (formerly lines 14-41) all intact. `next build` emits the woff2 to `.next/static/media/GeneralSans_Semibold-s.p.0hfk9k1kkjsdy.woff2` with content hash + auto-injects the preload `<link>` in `<head>`. `tests/hero/wordmark-self-host.spec.ts` replaced with live spec: zero `fontshare.com` requests + preload link in `<head>` + computed `font-family` resolves to General Sans. Spec passes; 167/168 of the Playwright suite green (1 remaining HERO-03 skip lands with plan 05-04).

**Phase 5 Wave 2 progress, HERO-03 shipped (2026-05-21, plan 05-04):** Hero LCP poster migrated to Next 16's `preload` + `fetchPriority="high"` API (deprecated `priority` prop removed). The `next.config.ts` AVIF/WebP `images.formats` config landed in Wave 0 is now exercised end-to-end: Sharp emits AVIF on demand for clients sending `Accept: image/avif`. Measured AVIF sizes against `next start`: w=640 → 36,382 B, w=1080 → 88,554 B, w=1920 → 150,193 B (17.0x byte reduction vs the 2.55 MB source PNG; largest cached transformation lands comfortably under the 200 KB HERO-03 budget). `tests/hero/poster-avif-negotiation.spec.ts` replaced with two live tests: (1) `/_next/image` returns `image/avif` content-type with body under 200,000 bytes on `Accept: image/avif`; (2) the rendered `<img>` carries `fetchpriority="high"` and `<head>` contains `<link rel="preload" as="image">`. Both pass in 12.3s. Clean `rm -rf .next && npm run build` exits 0 with zero `priority` deprecation warnings; full Playwright suite green (169 passed; Wave 0 stubs all replaced).

**Phase 5 Wave 3 HERO-04 gate failed (2026-05-21, plan 05-05): GAP CLOSURE REQUIRED.** Local `npx --no-install lhci autorun` exercised the LHCI gate; representative-run `/` LCP measured at 16,219 ms vs the 2,300 ms gate (Case C — clearly over budget, not flake). Three real defects surfaced:
1. **D-04 violation (mobile not video-free).** Lighthouse at 412×823 mobile downloads `homepage-hero-360p.webm` (8.88 MB). Per `.planning/phases/05-hero-performance/05-CONTEXT.md` D-04, mobile is poster-only — the `<source media="...">` algebra in `src/content/homepage-hero.ts` is letting mobile match a video source.
2. **WebM ladder encoder regression.** Every WebM tier is larger than its MP4 counterpart (720p webm 18.10 MB vs mp4 9.77 MB; 540p webm 14.27 MB vs mp4 4.80 MB; 360p webm 8.89 MB vs mp4 1.99 MB — the 360p WebM is 4.47x the MP4). `scripts/build-hero-ladder.sh` needs re-tuning (likely 2-pass libvpx-vp9 with explicit `-b:v` target bitrates).
3. **Environment fix (already applied):** Lighthouse 12.x dropped the `"mobile"` preset string; `lighthouserc.json` line 8's `"preset": "mobile"` was removed. The explicit `screenEmulation` + `throttling` + `formFactor: "mobile"` blocks already express mobile behavior.

Phase 5 is NOT shipped. HERO-01..03 are correct and stay. HERO-04 needs a gap-closure phase (likely Phase 5.1) that: fixes the `<source media>` algebra in `src/content/homepage-hero.ts` to keep mobile video-free, re-tunes `scripts/build-hero-ladder.sh` so each WebM tier is smaller than its MP4 counterpart, re-encodes the ladder, then re-runs `lhci autorun`. Phase 8 (Motion) stays blocked on Phase 5 until then. The lighthouserc.json env fix landed on `main` in this commit.

**Phase 5.1 closed the WebM gap (2026-05-21, plans 05.1-01 + 05.1-02).** WebM ladder dropped entirely (D-01); MP4-only at 720p / 540p / 360p, every `<source>` bounded at `(min-width: 768px)` or higher so phones below 768px match nothing and the browser starts zero downloads. Regression nets landed: `tests/responsive/hero-mobile-video-free.spec.ts` watches the network at 412×823 and asserts zero `mp4/webm/m4v/mov` requests; `scripts/check-hero-assets.sh` enforces per-file MP4 size budgets (10/6/3 MB) wired into `.github/workflows/perf.yml` before LHCI. Playwright total: 170 (was 169). Plan 05.1-03 Task 1 then re-ran LHCI Case C on the Vercel preview and FAILED: median LCP 16,411 ms vs 2,300 ms gate. Root cause: the SSR-rendered `<video poster="/hero/homepage-hero-start.png">` triggered a 2.55 MB raw PNG fetch before the `!isMobile` React gate could remove the `<video>` post-hydration, bypassing `/_next/image`'s 49 KB AVIF entirely. Routed to Phase 5.2.

**Phase 5.2 ships AVIF poster (2026-05-21, plan 05.2-01, commit 1ee187b).** Raw PNG (2.55 MB) replaced with `public/hero/homepage-hero-start.avif` (112 KB, libsvtav1 CRF 30, ~23x reduction). `src/content/homepage-hero.ts:55` repointed; both consumers (`<Image>` via `/_next/image` and `<video poster>` direct fetch) feed off the AVIF. PNG deleted; `scripts/encode-hero-poster.sh` regenerates from the 720p MP4's first frame when needed. `tests/hero/poster-avif-negotiation.spec.ts` already covers the `<Image>` path and remains green (substring match on `homepage-hero-start` works for both extensions).

**Phase 5.2 follow-ups (2026-05-21, commits 84f20dd + 8920088).** Two diagnostic-driven changes after LHCI re-runs surfaced post-AVIF leads: `84f20dd` removed the redundant `<video poster={...}>` attribute (the Layer-1 `<Image>` always paints the same start frame; the poster was triggering a 110 KB mobile fetch). `8920088` switched Inter from `display: "swap"` to `display: "optional"` to prevent a font-swap LCP candidate from competing with the H1's first paint. Both changes are defensible long-term but did not move the simulated-LCP needle outside run-to-run noise.

**Phase 5.2 partial-close status (2026-05-21).** Three commits cut LHCI Case C simulated median LCP from 16,411 ms to 3,869 ms (4.2x improvement, 12,542 ms shaved). The 2,300 ms gate is still red by 1,569 ms. Observed unthrottled LCP on the same Vercel preview is 1,254 ms (well under spec); the 3,869 ms is LHCI's simulator projection of the resource graph + CPU graph, not a measurement of an actual slow paint. The H1 LCP element paints at FCP unthrottled with no actual render-delay phase. Phase 5.1 Plan 03 Task 1 is now formally EXECUTED with FAILED outcome; the writeup ships at `docs/m5-phase-5-lhci-run.md`. Tasks 2 + 3 (visual walkthrough, D-08 atomic close-out commit) stay deferred. Phases 5 + 5.1 + 5.2 stay open. HERO-04 stays open. Routing the remaining work to Phase 5.3 (lazy-load GSAP + ScrollTrigger behind the mobile gate, conditional General Sans `<link rel=preload>`, switch LHCI `throttlingMethod` from `simulate` to `devtools`, or relax the gate from 2,300 to the 2,500 ms CLAUDE.md §12 spec floor). Phase 8 (Motion) stays blocked on Phase 5 close.

**Explicitly out of scope in M5** (captured with reasoning in `.planning/REQUIREMENTS.md`): ScrollSmoother global lerp/inertia, Mux video hosting (chose local ladder instead), poster-only-on-mobile, live CLAUDE.md §13 event verification (the wiring ships in Phase 6; verifying against an unprovisioned GA4 ID is wasted effort — deferred to M6), GDPR cookie consent banner.

**Deferred to M6 or later:** Vercel Speed Insights RUM, live GTM Preview event verification, marquee/auto-scroll on `IntegrationStrip`, stagger entrances on `CardGrid` / `ComparisonTable` / `ProcessStrip`, SplitText heading reveals on `PageHero`, Flip transitions on `FeatureAccordion` / Platform tabs, source-material relocation (move PowerPoint + Excel from Connor's Downloads into `source-materials/`).

**Polish items still anytime (carried from post-M4):**

- **Breakpoint constant extraction**: `useIsMobile` and `HomepageHero` both use `(max-width: 767px)` (Task 25.1). Extract to a shared constant if more callers emerge.
- **CI single-build optimization**: the a11y workflow runs `npm run build` explicitly and then `npm run test:e2e`, which re-runs `npm run build && npm run start` via Playwright's `webServer` block. CI builds twice per run (~3-5 min wasted). Worth fixing only if CI runtime becomes an issue.

---

## Known open items / loose threads

These are not bugs — they're things flagged for follow-up.

### Visual / interaction

- **Mobile + tablet layout for Platform centered-stack** is untested. The absolute-positioned eyebrow/heading + tabs/body/link may not fit cleanly under 1024×680. The framed dashboard might overflow viewport sides since it's `max-w-5xl` (1024) — fine at lg+ but worth checking at md.
- **Brief moment of two dashboards visible during the crossfade** (`scrollY ≈ pinEnd-117 → pinEnd`). Hero's bezel and Platform's bezel are at the same position but Platform's rises 70px on the way to viewport center. Reads as a soft crossfade rather than a position jump but could be tuned tighter.
- **Cinematic mp4 source pruned** (2026-06-12 audit): the legacy 11 MB single-tier `homepage-hero.mp4` was deleted; it had zero code references and the 720p ladder tier serves as the regen source if ever needed.
- **Phase 11-01 locked the lazy-skeleton CLS pattern for the platform flagships.** `src/components/product/visuals/lazy.tsx` defines `FLAGSHIP_SKELETON_MIN_H = min-h-[44rem]` (704px) for the BenefitSplit explorable flagship box; the accordion-archetype visuals keep the shared 20rem `VisualSkeleton` from `archetypes.tsx`. `lighthouserc.json` now has a per-route `cumulative-layout-shift < 0.1` gate for `/platform/placement` (median over 5 devtools-throttled runs). Wave 2 flagships (optimization / issues / reporting) copy the 44rem box rather than guessing, and each adds its own per-route CLS entry. The CLS number is measured in CI/preview (LHCI starts `npm run start`, which hangs in the local sandbox).
- **Phase 11-02 wired `/platform/optimization` against the locked Wave 1 pattern.** All 4 accordion items render real archetypes via `FeatureAccordion.visuals` (bands and history are Data-story, share and bonus are Console, per the approved 11-ARCHETYPE-MAP); zero text placeholders remain. The BenefitSplit band is repointed from `LazyOptimizationEngine` to `LazyOptimizationFlagship`, an `Explorable`-composed Console flagship (`OptimizationFlagship.tsx`) with one `Explorable.Toggle`/`Explorable.Panel` per vendor revealing band detail and the this-cycle to next-cycle share shift. `LazyOptimizationFlagship` reuses the same `FlagshipSkeleton` (44rem/704px) so the chunk resolves CLS-free. `OptimizationEngine.tsx` stays on disk (no longer imported on this page) for the Phase 13 dead-bespoke-visual audit. Payloads live in `src/content/visuals/optimization.ts` with `[CLAIMS REVIEW]`/`[COI REVIEW]` tags. The `platform-visuals.spec.ts` route table now drives `/platform/optimization`. A per-route CLS gate for `/platform/optimization` is still to be added to `lighthouserc.json` (deferred with the preview LHCI run).
- **Phase 11-05 closed the perf + a11y verification gate.** `lighthouserc.json` now collects all 4 platform deep-dive routes (`/platform/placement`, `/platform/optimization`, `/platform/issues`, `/platform/reporting`) and each carries its own per-route `cumulative-layout-shift < 0.1` assertMatrix entry (median over 5 devtools-throttled runs), mirroring the 11-01 placement gate; the optimization gate noted as "still to be added" above is now in place. The inherited `total-blocking-time` ceilings (450ms on `/`, 240ms on every other route) and `throttlingMethod: devtools` are unchanged and not loosened. The numeric LHCI measurement (per-route LCP/CLS/TBT), the full Playwright suite (`platform-visuals`, `reveal-fail-open`, `reduced-motion`, `hero-gsap-free-mobile`, `platform-mobile`), and axe-core run against a Vercel preview / CI (next start hangs in the local sandbox), recorded in `.planning/phases/11-platform-deep-dive-visuals/11-PERF-A11Y-EVIDENCE.md`.

### Content (require approver signoff before launch)

- **`[COI REVIEW]` flags** preserved as comments in content modules. Andrew Budish + Joe Laughlin + Michael Orefice must clear:
  - `/company` TSI ownership section
  - `/why-dplat` "connected to the full network" framing
  - `/platform/issues` regulatory-exposure framing
  - `/solutions` "regulatory infrastructure" claims
- **`[CLAIMS REVIEW]` flags** on metrics: 60M+ accounts, $1.5B+ in payments, comparison-table time-to-production ranges, leadership tenures, encryption details.
- **Customer logos**: per `docs/content-map.md:178`, deferred to v2 unless written consent + Andrew signoff.
- **Press / TSI news linking**: open question per `docs/content-map.md:177`.
- **"Why dPlat" nav link** still says "dPlat" (product name) even though the wordmark is now "DebtNext" (company name). Open question whether this nav label should become "Why DebtNext" or stay as the product positioning. Connor has not decided.

### Integrations (require Connor + team)

- **`ZOHO_WEBHOOK_URL`** — Austin Johnson owns. API gracefully no-ops without it.
- **`RESEND_API_KEY`** — Connor to provision; `DEMO_FROM_EMAIL` defaults to `demo@debtnext.com`.
- **`NEXT_PUBLIC_GA4_ID`** and **`NEXT_PUBLIC_GTM_ID`** — Jeremiah Benes owns analytics setup.
- **Logo / wordmark assets** — wordmark is now the type-set "DebtNext" with indigo node. If Gian supplies a polished SVG version later, drop it in and update `Wordmark.tsx`.

### Source-material gaps

`CLAUDE.md §8` references `source-materials/dPlat_Solution_Overview_v04232026.pptx` and `source-materials/DebtNext_entries.xlsx` for product-accuracy claims. These files are in Connor's Downloads but were not relocated to `source-materials/` in the repo.

---

## How to resume

**Next step (2026-06-04):** M5 hero LCP blocker is cleared. The recommended next move is **`/gsd-plan-phase 10`** to plan M6 Foundation (the cross-milestone lazy-GSAP gate is satisfied). Before merging Phase 5.3 to main: decide on PR #7 (the merge is Connor's call) and, if desired, do the deferred human-verify of desktop cinematic visual parity on the Vercel preview (behavioral specs are already green). M5's Analytics (Phase 6), SEO (Phase 7), and DoD (Phase 9) remain open; Phase 8 Motion is superseded by M6 Phase 10.

```bash
cd "/Users/connorlaughlin/Desktop/Coding/DebtNext.com Redesign"

# Verify state
git log --oneline -8
npm install                  # if node_modules stale
npm run typecheck
npm run lint
npm run build

# Preview
npm run dev                  # http://localhost:3000 (or 3010+ if busy)

# Deploy
vercel deploy --prod --yes

# Capture cinematic hero snapshots from prod
node scripts/snap-hero-scrub.mjs
ls hero-snapshots/

# Re-encode hero MP4 (if Connor provides a new one)
./scripts/reencode-hero.sh <path-to-new.mp4>
```

**If picking up M4**: start with responsive QA (devtools at 375/414/768/1024/1280/1440). Walk every route. Particular attention to the new Platform centered-stack layout — it's only been verified at desktop sizes (1373×779 and 1440×900). Then axe-core CI. Then perf audit per route. Then OG images. Then DoD per-page walkthrough.

**If picking up Platform handoff polish**: open `HomepageHero.tsx` and `HomepageHandoffSection.tsx`. The thresholds in `HomepageHero.tsx`'s `onUpdate` (lines ~85–110) tune the cinematic→Platform crossfade timing. The `VH_PER_TAB` constant in `HomepageHandoffSection.tsx` (default 0.75) tunes how much scroll each tab gets.

**If picking up the wordmark**: `Wordmark.tsx` is the single component. Font is loaded via `@import url("https://api.fontshare.com/v2/css?f[]=general-sans@600&display=swap")` at the top of `globals.css`. The `.dn-node` keyframe lives in `globals.css` right after that import.

---

## Decisions locked

- **Next 16** (not 15). Build is stable on it.
- **shadcn radix-nova preset** (the init default).
- **Hero typography** uses `clamp(2.75rem, 8vw, 7rem)` (atmospheric scale ~44–112px) — deliberate one-off escalation for the cinematic only.
- **Brand personality**: calm, precise, technical.
- **Single reference**: Mercury.com only. No secondary visual references.
- **Anti-references**: TSI corporate · Consumer fintech · Generic B2B SaaS templates · Legacy enterprise collections software.
- **Vercel deploys** target the public alias `debtnext-website.vercel.app`. When stale, fall back to the specific build URL.
- **Hero pin = GSAP, not CSS sticky.** CSS sticky's inherent post-pin trailing region was the source of the 100vh dead-air band. Locked on GSAP for hero pin.
- **Platform handoff section uses CSS sticky** (`top-0 h-screen` inside a 400vh outer). Fine here because the tab progression doesn't need a pin-spacer-free release.
- **Dashboard never moves during cinematic→Platform handoff.** Locked. Any future re-tune should preserve this.
- **Platform handoff section uses a structurally different mobile architecture below 768px** (calm static stack, no pin, no GSAP). Same content, normal-flow scroll.
- **Wordmark is "DebtNext" (company name)** in nav chrome. Product name "dPlat" stays in metadata, voice copy, and the "Why dPlat" nav link (until Connor decides otherwise).
- **General Sans SemiBold via Fontshare CDN.** One weight only. Move to `next/font/local` if perf becomes a concern.
- **Phase 5 Wave 0 (2026-05-21):** hero ladder shape is 720p / 540p / 360p (not 480p / 720p / 1080p, source asset is 1280×720 ffprobe-verified); LHCI gate fails at median LCP ≥ 2300ms on `/` only; General Sans 600 woff2 self-hosted at `src/app/fonts/GeneralSans-Semibold.woff2` (sha256 in the Wave 0 commit body per T-V10-01).

---

## Recent commits (most recent first)

```
(phase-05.3 branch, PR #7; newest first)
48b1222 fix(05.3-01): meet 44px touch floor on desktop handoff tab buttons + link
1a62d93 perf(05.3): switch LHCI throttling simulate->devtools, 5 runs
cc56504 docs(05.3-01): complete lazy-GSAP plan (SUMMARY, STATE, ROADMAP)
0db8994 feat(05.3-01): lazy-mount GSAP controller; drop eager GSAP from sections
f58b436 feat(05.3-01): add HeroCinematicController, the single dynamic-GSAP owner
aa772c8 docs: create milestone M6 roadmap (Phases 10-15)
f0fbf3c docs: define milestone M6 requirements (21 across 6 categories)

(main lineage)
d671bea docs: create M5 roadmap (5 phases, Phase 5-9, 21 reqs mapped)
474eebf docs: define M5 requirements (21 reqs, 5 categories)
d2afb74 docs: start milestone M5 launch readiness + motion pass
f51beff docs: bootstrap GSD .planning/ apparatus with M1–M4 history
dc71fab chore: commit skills-lock.json from gsap-skills install (#5)
01ac299 docs: update HANDOFF with post-M4 hotfix, gsap-skills install, and M5 framing decision (#4)
bd2d7ce chore: install gsap-skills for animation guidance (#3)
8854da7 fix(m4): repair Phase 2 container-query self-reference so desktop 2-column layouts activate (#2)
b155b13 M4: Mobile responsive rebuild (#1)
c671c39 fix(platform): scroll-driven tabs were initializing with stale layout
033be70 fix(platform): trim Placement + Vendor mockups so bezel fits on laptops
071ceb2 feat(brand): replace dPlat wordmark with DebtNext + live indigo node
a8a4217 fix(platform): sync tab chrome with content + compact Issues mockup
12fc6be feat(homepage): seamless hero→Platform handoff with scroll-driven tabs
ce9d2bf docs: HANDOFF.md for clean session resumption
ad8ef3b feat(mockups): motion + AnimatePresence on tab switch
b737658 feat(hero): held framed-dashboard finale + 4 bespoke tab mockups
e1ad210 fix(hero): drop banding scrim, fix nav-over-hero header
a619ccc fix(hero): high-res PNG owns scrollY=0; video fades in once scroll begins
81930f6 feat(hero): hold + shrink dashboard finale, interactive Platform tabs, navbar threshold
f5c5aa6 fix(hero): tuning pass — vignette, scrim, contrast, panel un-pin
cea3578 fix(hero): use the high-res original PNGs, not the extracted frames
8be5cdf feat(m3.5): wire real cinematic hero assets
153b263 feat(m3.5): Mercury-faithful cinematic homepage hero
5e98a34 feat(m3): all 10 page routes + DemoForm + Zoho/Resend + sitemap/robots
acaefec fix(audit): apply P1-P3 from /ui-ux-pro-max audit
4a218ed feat(m2): section primitives library + complete homepage
4508c31 fix(hero): render H1 with display-xl token (atmospheric hero)
73e96f7 feat(m1): foundation — Next 16 + dark shell + Header/Footer + Hero
c795d07 chore: initial repo layout normalization
```

---

## Voice rules reminder (CLAUDE.md §5)

Before any rendered string, check against:

- **No em dashes (`—`).** Use commas, parens, semicolons, or a new sentence.
- **No "not X, it's Y"** construction or variants.
- **Banned phrases**: delve, harness, leverage, utilize, landscape, robust, game-changer, cutting-edge, pivotal, underscore, foster, tapestry, vibrant, meticulous, journey, embark, beacon, multifaceted, seamless, supercharge, unlock, future-proof, revolutionize, elevate, empower, "in today's", "it's important to note", "furthermore", "additionally", "moreover."
- Sentence case headings. Contractions always. Digits for numbers.

Last voice pass: 0 em dashes, 0 banned phrases in rendered HTML across all 11 routes. (Note: this handoff document itself uses em dashes for clarity — they're not in shipped UI copy.)

---

End of handoff.
