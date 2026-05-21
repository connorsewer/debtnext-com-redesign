# Roadmap

Active milestone: **M5 — Launch readiness + motion pass**.

Phase numbering continues from M4 (which ended at Phase 4). M5 spans **Phase 5 through Phase 9**. Decimal phases (e.g., 5.1) are reserved for urgent insertions via `/gsd-insert-phase`.

Granularity: `standard` (5–8 phases per milestone). 21 active requirements across 5 categories map 1:1 to category-aligned phases. Each phase is a coherent, verifiable delivery boundary, not a horizontal layer.

## Phases

- [ ] **Phase 5: Hero performance** — Cut `/` LCP under 2.5s on 4G mobile so launch is unblocked
- [ ] **Phase 6: Analytics wiring** — GA4 + GTM dataLayer wired with graceful no-op until IDs land
- [ ] **Phase 7: SEO baseline** — Per-route OG images, JSON-LD on `/` and `/demo`, Twitter cards, canonicals
- [ ] **Phase 8: Motion pass** — Restrained Framer reveals + ProofBand counters across the 10 non-home routes
- [ ] **Phase 9: Definition-of-done walkthrough + launch readiness** — CLAUDE.md §14 walked per route, all `[COI REVIEW]` / `[CLAIMS REVIEW]` cleared, nav label decided

## Progress

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 5. Hero performance | 1/5 | In Progress|  |
| 6. Analytics wiring | 0/0 | Not started | — |
| 7. SEO baseline | 0/0 | Not started | — |
| 8. Motion pass | 0/0 | Not started | — |
| 9. Definition-of-done walkthrough + launch readiness | 0/0 | Not started | — |

## Phase Details

### Phase 5: Hero performance
**Goal**: Bring `/` under the 2.5s LCP target on 4G mobile so the homepage stops being the only route blocking launch.
**Depends on**: Nothing (first M5 phase; critical-path for everything else that touches `/`)
**Requirements**: HERO-01, HERO-02, HERO-03, HERO-04
**Success Criteria** (what must be TRUE):
  1. A user on a throttled 4G connection sees the homepage hero render in under 2.5s LCP on mobile
  2. The hero video plays cleanly on `/` at desktop and on mobile devices that opt out of reduced motion, without any single asset exceeding the per-variant byte budget appropriate for the viewport
  3. The DebtNext wordmark in nav chrome continues to render with the indigo `.dn-node` pulse, but General Sans 600 loads from the site's own origin instead of Fontshare's CDN
  4. A Playwright regression spec fails if a future change pushes `/` back over the 2.5s LCP line on the standard CI throttling profile
**Plans**: 5 plans
- [x] 05-01-PLAN.md — Wave 0 scaffolding: REQUIREMENTS.md HERO-01 amendment + encoder scripts + woff2 + fonts.ts + next.config.ts + lighthouserc.json + perf.yml + 3 Playwright spec stubs
- [x] 05-02-PLAN.md — Wave 1 HERO-01 wiring: build ladder binaries + extend heroCinematic.media.video to sources array + map 6 <source> children + activate source-ladder.spec.ts
- [x] 05-03-PLAN.md — Wave 1 HERO-02 self-host: remove Fontshare @import + wire generalSans in layout.tsx + Wordmark.tsx var(--font-general-sans) lead + activate wordmark-self-host.spec.ts
- [x] 05-04-PLAN.md — Wave 1 HERO-03 AVIF poster: migrate <Image priority> to preload + fetchPriority="high" + activate poster-avif-negotiation.spec.ts
- [ ] 05-05-PLAN.md — Wave 2 HERO-04 perf gate trip + ship: run lhci autorun locally, capture docs/m5-phase-5-lhci-run.md, flip HANDOFF.md / PROJECT.md / STATE.md / REQUIREMENTS.md to shipped
**Notes**: Critical-path for Phase 8 (Motion). MOTION-04 verifies the LCP budget holds after motion ships, which means Phase 5 must land first. Safe to run in parallel with Phase 6 (Analytics) and Phase 7 (SEO) since those don't touch hero assets. Inherits standing constraints: brand rules (CLAUDE.md §3), voice rules (§5), single primary CTA per band (§4), per-commit docs rule, GPG signing off + Co-Authored-By footer, all 164 Playwright specs stay green, WCAG 2.2 AA + axe-core CI, reduced motion gated.

### Phase 05.2: Swap hero poster to AVIF (INSERTED)

**Goal:** Replace the 2.55 MB raw PNG hero poster with a sub-200 KB AVIF so the SSR-rendered `<video poster>` stops blocking the mobile LCP gate.
**Requirements**: HERO-04 (gap closure carry-over from Phase 5; closed jointly with Phase 5.1 Plan 03 Task 1 LHCI re-verification)
**Depends on:** Phase 5, Phase 5.1 (Plans 01 + 02 sealed mobile-video-free and added regression nets)
**Plans:** 1/1 plans executed

Plans:
- [x] 05.2-01-PLAN.md: encode `public/hero/homepage-hero-start.avif` (112 KB libsvtav1 CRF 30), repoint `startFrame` in `src/content/homepage-hero.ts:55`, delete the 2.55 MB raw PNG, land `scripts/encode-hero-poster.sh` (regenerates AVIF from the 720p MP4 first frame, refuses to overwrite above 200 KB), refresh `scripts/check-hero-assets.sh` comment, add `/.lighthouseci/` to `.gitignore`, update HANDOFF/ROADMAP/STATE

### Phase 05.1: HERO-04 gap closure: WebM encoder re-tune and mobile video gate (INSERTED)

**Goal:** Close HERO-04 by dropping the structurally broken WebM ladder and tightening `<source media>` algebra so phones (<768px) fire zero video requests; absorb Phase 5 plan 05-05 closing tasks so Phase 5 + 5.1 ship together.
**Depends on:** Phase 5
**Requirements**: HERO-04 (gap closure); HERO-01..03 close via D-08
**Plans:** 2/3 plans executed

Plans:
- [x] 05.1-01-PLAN.md: strip WebM ladder (build script, verify script, 3 binary deletions) and tighten <source media> queries (3 MP4 entries with (min-width: 768px) bounds); update tests/hero/source-ladder.spec.ts to 3-source MP4-only
- [x] 05.1-02-PLAN.md: add tests/responsive/hero-mobile-video-free.spec.ts (412x823 network watcher per D-06) and scripts/check-hero-assets.sh (3 MP4 size budgets per D-07); wire into .github/workflows/perf.yml before the lhci step; also sealed the D-04 contract by bounding 720p <source> (Plan 01 carry-over)
- [ ] 05.1-03-PLAN.md: LHCI Case C re-run on Vercel preview (per D-08); docs/m5-phase-5-lhci-run.md writeup; visual walkthrough at 1440/1024/768/412; close-out commit flipping HERO-01..04 to Done in HANDOFF.md, PROJECT.md, STATE.md, REQUIREMENTS.md, ROADMAP.md

### Phase 6: Analytics wiring
**Goal**: Wire GA4 + GTM dataLayer so launch traffic produces measurable signal as soon as Jeremiah Benes provisions the IDs, with no failures when the IDs are still placeholders.
**Depends on**: Nothing (independent of Phase 5; safely parallel with Phase 5 and Phase 7)
**Requirements**: ANALYTICS-01, ANALYTICS-02, ANALYTICS-03
**Success Criteria** (what must be TRUE):
  1. When `NEXT_PUBLIC_GA4_ID` is set, every route navigation produces a GA4 page_view in real-time reporting
  2. When `NEXT_PUBLIC_GTM_ID` is set, `window.dataLayer` exists before any `track()` call fires and GTM Preview can attach to the container
  3. When either env var is unset, the site renders and behaves identically to today (no console errors, no failed network requests, `track()` continues to no-op gracefully)
  4. `.env.example` documents both env vars with owner notes; `HANDOFF.md` "Integrations" section records that Jeremiah Benes provisions the IDs
**Plans**: TBD
**Notes**: Live verification of CLAUDE.md §13 events in GTM Preview is deliberately deferred to a post-launch phase per REQUIREMENTS.md "Future". This phase ships the wiring only. Inherits standing constraints: brand rules (CLAUDE.md §3), voice rules (§5), single primary CTA per band (§4), per-commit docs rule, GPG signing off + Co-Authored-By footer, all 164 Playwright specs stay green, WCAG 2.2 AA + axe-core CI, reduced motion gated.

### Phase 7: SEO baseline
**Goal**: Ship the per-route SEO surface a launch site needs: shareable OG images, structured data on the two routes that warrant it (`/` and `/demo`), Twitter card metadata, and canonical URLs.
**Depends on**: Nothing (independent of Phase 5 and Phase 6; safely parallel with both)
**Requirements**: SEO-01, SEO-02, SEO-03, SEO-04, SEO-05, SEO-06
**Success Criteria** (what must be TRUE):
  1. A user sharing any v1 route on Slack, LinkedIn, or iMessage sees a route-specific dark-canvas OG card with the route title and dPlat wordmark
  2. A user sharing any v1 route on Twitter/X sees a `summary_large_image` card using the same per-route image
  3. Google's Rich Results Test recognizes `Organization` + `SoftwareApplication` JSON-LD on `/` and `ContactPage` JSON-LD on `/demo`, with no validation errors
  4. Every route resolves to a single canonical URL via `metadata.alternates.canonical`, verified by an integration spec that fails if a route's canonical drifts
**Plans**: TBD
**Notes**: TSI ownership disclosure rules (CLAUDE.md §6) constrain `Organization.sameAs`; Andrew Budish clears the TSI sameAs link before merge. Inherits standing constraints: brand rules (CLAUDE.md §3), voice rules (§5), single primary CTA per band (§4), per-commit docs rule, GPG signing off + Co-Authored-By footer, all 164 Playwright specs stay green, WCAG 2.2 AA + axe-core CI, reduced motion gated.
**UI hint**: yes

### Phase 8: Motion pass
**Goal**: Bring restrained, reduced-motion-gated entrance motion to the 10 non-home routes (section reveals + ProofBand number counters) without breaking the LCP budget that Phase 5 just secured.
**Depends on**: Phase 5 (MOTION-04 verifies `/` LCP stays under 2.5s after motion ships; Phase 5 establishes the LCP headroom the perf-regression check measures against)
**Requirements**: MOTION-01, MOTION-02, MOTION-03, MOTION-04
**Success Criteria** (what must be TRUE):
  1. A user scrolling any non-home route sees each section fade-and-rise into place once on first view, with a consistent timing token and a single direction (rise only)
  2. A user landing on a page that contains `ProofBand` sees the stat numbers animate up from 0 to the displayed value with `tabular-nums` preserved (no width jitter)
  3. A user with `prefers-reduced-motion: reduce` set sees every reveal and counter land on its final state immediately, with no motion playing; the reduced-motion Playwright spec extends to cover this and stays green
  4. The post-motion Lighthouse run keeps `/` LCP under 2.5s and the homepage client bundle size grows by no more than +20 KB gzipped versus the Phase 5 baseline
**Plans**: TBD
**Notes**: Carousels, parallax, marquees, SplitText reveals, Flip transitions, and ScrollSmoother are explicitly out of scope per REQUIREMENTS.md and DESIGN.md §10. This phase ships only fades + counters. Mobile gating discipline from M4 Phase 3 carries forward: reveal entrances should not re-trigger GSAP work on mobile devices that bail out of the desktop pin cinematic. Inherits standing constraints: brand rules (CLAUDE.md §3), voice rules (§5), single primary CTA per band (§4), per-commit docs rule, GPG signing off + Co-Authored-By footer, all 164 Playwright specs stay green, WCAG 2.2 AA + axe-core CI, reduced motion gated.
**UI hint**: yes

### Phase 9: Definition-of-done walkthrough + launch readiness
**Goal**: Walk the CLAUDE.md §14 Definition-of-Done checklist on every v1 route, clear every open `[COI REVIEW]` and `[CLAIMS REVIEW]` flag with the right approver, apply the "Why dPlat" nav label decision, and commit the walkthrough evidence so launch can be approved.
**Depends on**: Phase 5, Phase 6, Phase 7, Phase 8 (validates everything that shipped in M5; must come last)
**Requirements**: DOD-01, DOD-02, DOD-03, DOD-04
**Success Criteria** (what must be TRUE):
  1. A reviewer reading `docs/m5-dod-walkthrough.md` sees the CLAUDE.md §14 checklist walked and signed off for every one of the 11 v1 routes, with evidence (Lighthouse run, axe pass, keyboard pass, analytics check, visual review note) per route
  2. Every open `[COI REVIEW]` comment on `/company`, `/why-dplat`, `/platform/issues`, and `/solutions` has been cleared by Andrew Budish and the marker removed from the source
  3. Every open `[CLAIMS REVIEW]` comment (60M+ accounts, $1.5B+ payments, comparison-table time-to-production ranges, leadership tenures, encryption details) has been cleared with documented source-backing and the marker removed
  4. The "Why dPlat" nav label decision is applied consistently across `src/content/nav.ts`, the route file, the breadcrumb, the sitemap, and any cross-link, with no stale references to the prior label anywhere in the codebase
**Plans**: TBD
**Notes**: This is the launch gate. Inherits standing constraints: brand rules (CLAUDE.md §3), voice rules (§5), single primary CTA per band (§4), per-commit docs rule, GPG signing off + Co-Authored-By footer, all 164 Playwright specs stay green, WCAG 2.2 AA + axe-core CI, reduced motion gated.

## Parallelization map

Per `.planning/config.json` `parallelization=true`. Phases 5, 6, and 7 are mutually independent and can run in parallel. Phase 8 must wait for Phase 5. Phase 9 must wait for all four prior phases.

```
Phase 5 (HERO)  ─┐
                 ├─→ Phase 8 (MOTION) ─┐
Phase 6 (ANALYTICS) ──────────────────┼─→ Phase 9 (DOD walkthrough)
Phase 7 (SEO) ────────────────────────┘
```

## Coverage

All 21 active M5 requirements map to exactly one phase. No orphans, no duplicates. Traceability table in `.planning/REQUIREMENTS.md` is the source of truth.

| Category | Requirements | Phase |
|---|---|---|
| HERO | HERO-01, HERO-02, HERO-03, HERO-04 | Phase 5 |
| ANALYTICS | ANALYTICS-01, ANALYTICS-02, ANALYTICS-03 | Phase 6 |
| SEO | SEO-01, SEO-02, SEO-03, SEO-04, SEO-05, SEO-06 | Phase 7 |
| MOTION | MOTION-01, MOTION-02, MOTION-03, MOTION-04 | Phase 8 |
| DOD | DOD-01, DOD-02, DOD-03, DOD-04 | Phase 9 |

Coverage: 21/21 ✓

---
*Last updated: 2026-05-20 by GSD roadmapper. M5 spans Phase 5 through Phase 9. Next step: `/gsd-plan-phase 5` to plan Hero performance (critical-path).*
