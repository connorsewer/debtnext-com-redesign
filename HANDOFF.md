# DebtNext.com session handoff

This document captures the full state of the rebuild after the M1-M3.5 work so a fresh Claude Code session can resume without context rot.

Last session ended: 2026-05-19 (M3.5.12). Author: Connor + Claude Opus 4.7.

---

## TL;DR for the next agent

You are continuing a **production rebuild of debtnext.com** modeled on Mercury.com. The site is live in production at **https://debtnext-website.vercel.app**.

**M1, M2, M3, and a substantial M3.5 cinematic-hero phase are complete and deployed.** All 11 v1 routes ship. The next milestone is **M4** (responsive QA at 6 breakpoints, axe-core in CI, perf budget verification, GA4/GTM wiring, OG images per route, walk the CLAUDE.md §14 DoD per page).

**Read these first, in this order:**

1. `CLAUDE.md` — operating contract (tech stack, voice rules, COI/claims review, what-not-to-do)
2. `.impeccable.md` — design brief (brand personality, anti-references, 5 design principles)
3. `DESIGN.md` — visual token spec
4. `docs/content-map.md` — IA and approval gates
5. `/Users/connorlaughlin/.claude/plans/i-need-your-help-elegant-anchor.md` — the full M1→M4 plan
6. This document

---

## Live URLs

- **Production**: https://debtnext-website.vercel.app
- **Vercel project**: `connor-laughlins-projects/debtnext-website` (`prj_Q8Wbxa2ioco7n2MogdHnPpL0MmRP`)
- **Snapshot script**: `node scripts/snap-hero-scrub.mjs` (writes to `./hero-snapshots/`)
- **Re-encode script**: `./scripts/reencode-hero.sh <input.mp4>` (for video updates)

---

## Stack and current versions

- Next.js **16.2.6** (App Router · Turbopack). Note: this is Next 16, not 15. `AGENTS.md` at repo root warns that APIs may differ from training data — consult `node_modules/next/dist/docs/` for current behavior before writing tricky Next code.
- React 19.2.4
- TypeScript strict
- Tailwind v4 (CSS-first, `@theme inline` block, tokens in `src/app/globals.css`)
- shadcn/ui (radix-nova preset). Button is overridden; primitives via `@radix-ui/*`.
- Framer Motion 12 (entrance choreography on mockups + ProofBand reveal)
- GSAP 3 + `@gsap/react` (the hero cinematic scrub)
- React Hook Form + Zod (demo form)
- Resend (transactional email, server-only) + Zoho webhook (lead capture)
- ffmpeg (local-only, for the hero MP4 re-encode)

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
│   ├── page.tsx                homepage assembly (cinematic hero + 7 sections)
│   ├── globals.css             Tailwind v4 @theme tokens (DESIGN.md §5)
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
│   │   ├── SiteHeader.tsx      FIXED top, Platform dropdown, active state via usePathname
│   │   ├── SiteFooter.tsx      5 link groups + TSI ownership line
│   │   └── MobileNav.tsx       Radix Dialog drawer, focus trap
│   ├── sections/
│   │   ├── HomepageHero.tsx    450vh cinematic, single master ScrollTrigger
│   │   ├── HomepageHandoffSection.tsx   "Everything you do for recovery"
│   │   ├── Hero.tsx            [DELETED] — replaced by HomepageHero
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
│   │       ├── FramedDashboard.tsx          3-dot chrome bezel
│   │       ├── PlacementMockup.tsx          bars grow + engine ping
│   │       ├── VendorPerformanceMockup.tsx  badges + sparkline draw-on
│   │       ├── IssuesMockup.tsx             queue cards + overdue pulse
│   │       ├── ReportingMockup.tsx          chart pathLength draw
│   │       └── index.tsx                    barrel + MockupForTab
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
│   ├── homepage-hero.mp4               re-encoded, 11 MB, per-frame keyframes
│   ├── homepage-hero-start.png         1536×1024 cinematic start frame
│   └── homepage-hero-end.png           1536×1024 dashboard end frame
└── product/
    └── dashboard-dark.png              1536×1024 standalone dashboard
```

---

## What's complete

### M1 — Foundation (deployed)

- Repo normalized: `content/pages/*.md`, `docs/content-map.md`, `DESIGN.md`, all hero assets in `public/hero/`
- Next 16 scaffolded, Tailwind v4 + shadcn/ui (radix-nova) + Inter via `next/font/google`
- Design tokens implemented in `globals.css` per DESIGN.md §5 (colors, type scale with clamp, spacing, radii, shadows, motion)
- `.dark` default theme via `<html class="dark">`; `.theme-light` opt-in wrapper for light contrast bands
- App shell: SiteHeader (now **fixed top-0** with Platform dropdown), SiteFooter (TSI ownership line)
- Initial homepage hero split layout (later **replaced** by the cinematic hero in M3.5)

### M2 — Section primitives + complete homepage (deployed)

- 10 section primitives: `Hero` (replaced), `TrustBand`, `FeatureAccordion`, `ProofBand`, `BenefitSplit`, `ProcessStrip`, `IntegrationStrip`, `FinalCTA`, `SectionContainer`, `IntegrationIcons`
- `ScrollDepthTracker` fires `scroll_depth` at 25/50/75/100
- Homepage assembled with all sections in correct dark-first/light-band order

### Audit pass (deployed)

Cross-referenced against `/ui-ux-pro-max` skill output. Applied:

- P1: skip link, `aria-current="page"` on active nav, `touch-manipulation` on buttons, `scroll-behavior: smooth`
- P2: drawer overflow, both color-schemes pinned to `#171721`, LinkedIn fill exception documented in `.impeccable.md`
- P3: ProofBand `motion.li` with `useReducedMotion` + `font-variant-numeric: tabular-nums`

### M3 — 10 pages + DemoForm + sitemap (deployed)

- All 10 non-home routes built and live (`/platform`, 4 platform subpages, `/solutions`, `/why-dplat`, `/company`, `/resources`, `/demo`)
- 5 additional primitives added: `CardGrid`, `ComparisonTable` (with mobile stacked fallback), `PageHero` (centered + split variants), `ProseIntro`, `BulletList`
- `DemoForm`: RHF + Zod, work-email domain blocklist, honeypot, `?email=` pre-fill from hero attached form
- `/api/demo` route: IP rate-limit + 24h dup-email cache; posts to Zoho webhook + sends Resend confirmation. Both gracefully degrade to `ok` when env vars are missing (no prod keys yet).
- Platform dropdown in desktop nav (`role="menu"`, no-JS hover/focus-within)
- `app/sitemap.ts` (all 11 routes) + `app/robots.ts` + per-route metadata

### M3.5 — Cinematic homepage hero (deployed, iterated 12 times)

- Mercury-faithful pattern: 450vh outer + sticky inner + GSAP single master ScrollTrigger driving `onUpdate(progress 0-1)`
- Re-encoded MP4 with per-frame keyframes (`ffmpeg -g 1 -keyint_min 1`) so `currentTime` binding scrubs smoothly
- Hero finale: cliffside cinematic → framed standalone `dashboard-dark.png` in a `FramedDashboard` bezel, centered on dark canvas, held for ~4% of scrub, then scales 1→0.55 + slides 28% right + fades out so the Platform section's per-tab mockup picks up cleanly
- 4 hand-built CSS/SVG mockups per Platform tab (`PlacementMockup`, `VendorPerformanceMockup`, `IssuesMockup`, `ReportingMockup`) wrapped in `FramedDashboard`. Each has Framer Motion entrance animations + ambient CSS animations. `AnimatePresence` in `HomepageHandoffSection` re-mounts on tab switch so entrances replay.
- Interactive Platform tabs: real `<button role="tab">` with `aria-selected`, ArrowUp/Down keyboard navigation, focus management, tab-specific body copy
- Mobile (≤768px): scrub disabled, static start-frame with overlay shown statically
- Navbar: `fixed top-0`, transparent until scrollY > 80, solid `#171721` after

---

## What's pending (M4)

Per the plan, M4 is the final polish pass. Hasn't started.

1. **Responsive QA** at 375, 414, 768, 1024, 1280, 1440. Particular attention: hero attached-form below 640px, FeatureAccordion stacking, ComparisonTable mobile fallback on `/why-dplat`.
2. **axe-core in CI** — install `@axe-core/playwright` (already a devDep) and wire to GitHub Actions matrix per CLAUDE.md §11.
3. **Performance**: Lighthouse mobile per route. Targets: LCP < 2.5s, CLS < 0.1, INP < 200ms. The 11 MB re-encoded hero MP4 may need byte-budget work. Convert `dashboard-dark.png` and the hero PNGs to AVIF/WebP via `next/image` (already on `next/image` — Vercel transcodes — but verify served sizes).
4. **Analytics**: GA4/GTM IDs (currently env-var placeholders in `.env.example`). Verify `cta_primary_click`, `cta_secondary_click`, `form_*`, `accordion_toggle`, `scroll_depth`, `video_play` events fire in GTM Preview.
5. **SEO**: Per-route OG images via `app/<route>/opengraph-image.tsx` using `@vercel/og`. `Organization` + `SoftwareApplication` JSON-LD on `/`. `ContactPage` JSON-LD on `/demo`.
6. **DoD walkthrough**: `CLAUDE.md §14` checklist per page.

---

## Known open items / loose threads

These are not bugs — they're things flagged for follow-up.

### Visual / interaction

- **Hero transition wonkiness**: Connor noted the transition between video → framed dashboard isn't fully smooth yet. Needs more iteration on the cliffside-out / framed-in timing (currently `82-92%` for cliffside fade-out and `85-93%` for dashboard fade-in — overlap is 3 percentage points). Possibly add an intermediate state (dashboard alone first, then framed) or smooth the timing curves.
- **Position-match in handoff**: the hero's framed dashboard ends near the right column of the Platform section but isn't pixel-aligned. Brief calls for 3-5 visual iterations at desktop. Connor was on mobile when reviewing; a desktop pass is owed.

### Content (require approver signoff before launch)

- **`[COI REVIEW]` flags** preserved as comments in content modules. Andrew Budish + Joe Laughlin + Michael Orefice must clear:
  - `/company` TSI ownership section
  - `/why-dplat` "connected to the full network" framing
  - `/platform/issues` regulatory-exposure framing
  - `/solutions` "regulatory infrastructure" claims
- **`[CLAIMS REVIEW]` flags** on metrics: 60M+ accounts, $1.5B+ in payments, comparison-table time-to-production ranges, leadership tenures, encryption details.
- **Customer logos**: per `docs/content-map.md:178`, deferred to v2 unless written consent + Andrew signoff before launch.
- **Press / TSI news linking**: open question per `docs/content-map.md:177`.

### Integrations (require Connor + team)

- **`ZOHO_WEBHOOK_URL`** — Austin Johnson owns. API gracefully no-ops without it.
- **`RESEND_API_KEY`** — Connor to provision; `DEMO_FROM_EMAIL` defaults to `demo@debtnext.com`.
- **`NEXT_PUBLIC_GA4_ID`** and **`NEXT_PUBLIC_GTM_ID`** — Jeremiah Benes owns analytics setup.
- **Logo / wordmark assets** — Gian to supply. Currently a text fallback "dPlat" everywhere.

### Source-material gaps

`CLAUDE.md §8` references `source-materials/dPlat_Solution_Overview_v04232026.pptx` and `source-materials/DebtNext_entries.xlsx` for product-accuracy claims. These files are in Connor's Downloads but were not relocated to `source-materials/` in the repo. Pre-M3 verification work would benefit from having them on disk.

---

## How to resume

```bash
cd "/Users/connorlaughlin/Desktop/Coding/DebtNext.com Redesign"

# Verify state
git log --oneline -5
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

If picking up M4: start with responsive QA (devtools at 375/414/768/1024/1280/1440). Walk every route. Then axe-core CI (Playwright is already installed). Then perf audit on each route. Then OG images. Then DoD per-page walkthrough.

If picking up hero polish: open the live site at desktop, scroll slowly through the hero, identify the exact scroll % where it feels off, and tune the threshold numbers in `src/components/sections/HomepageHero.tsx` lines ~90-110 (the `ease()` ranges).

---

## Decisions locked

- **Next 16** (not 15). Build is stable on it.
- **shadcn radix-nova preset** (the init default).
- **Hero typography** uses `--text-display-xl` (atmospheric scale via clamp, ~44-112px) — deliberate one-off escalation beyond DESIGN.md's standard scale for the cinematic only.
- **Brand personality**: calm, precise, technical.
- **Single reference**: Mercury.com only. No secondary visual references.
- **Anti-references**: TSI corporate · Consumer fintech · Generic B2B SaaS templates · Legacy enterprise collections software.
- **Vercel deploys** target the public alias `debtnext-website.vercel.app` (not preview-token URLs, since stakeholders need auth-free access during review).

---

## Recent commits (last 16)

```
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
da6553e fix(hero): use --text-h1 token on the H1, not --text-display-lg
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

Last voice pass (post-M3.5.12): 0 em dashes, 0 banned phrases in rendered HTML across all 11 routes.

---

End of handoff.
