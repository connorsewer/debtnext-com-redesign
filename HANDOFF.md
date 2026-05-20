# DebtNext.com session handoff

This document captures the full state of the rebuild after the M1–M3.6 work so a fresh Claude Code session can resume without context rot.

Last session ended: 2026-05-20 (post-M3.6 — homepage refactor + scroll-driven tab progression + DebtNext wordmark). Author: Connor + Claude Opus 4.7.

---

## TL;DR for the next agent

You are continuing a **production rebuild of debtnext.com** modeled on Mercury.com. The site is live in production at **https://debtnext-website.vercel.app**.

**M1, M2, M3, M3.5, and M3.6 are complete and deployed.** All 11 v1 routes ship. The hero → "THE PLATFORM" handoff is now seamless: a single framed dashboard appears at the end of the cinematic, never moves, and morphs through Placement → Vendor performance → Issues and disputes → Reporting and compliance as the user scrolls. The DebtNext wordmark (with a live indigo node) has replaced the dPlat wordmark in nav chrome.

The next milestone is **M4** (responsive QA at 6 breakpoints, axe-core in CI, perf budget verification, GA4/GTM wiring, OG images per route, walk the CLAUDE.md §14 DoD per page).

**Read these first, in this order:**

1. `CLAUDE.md` — operating contract (tech stack, voice rules, COI/claims review, what-not-to-do)
2. `.impeccable.md` — design brief (brand personality, anti-references, 5 design principles)
3. `DESIGN.md` — visual token spec
4. `docs/content-map.md` — IA and approval gates
5. `/Users/connorlaughlin/.claude/plans/i-need-your-help-elegant-anchor.md` — the full M1→M4 plan
6. This document

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
│   ├── homepage-hero.mp4               re-encoded, 11 MB, per-frame keyframes
│   ├── homepage-hero-start.png         1536×1024 cinematic start frame (LCP)
│   └── homepage-hero-end.png           [LEGACY — no longer referenced; layer removed in M3.6]
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

## What's pending (M4)

Per the plan, M4 is the final polish pass. Hasn't started.

1. **Responsive QA** at 375, 414, 768, 1024, 1280, 1440. Particular attention: hero attached-form below 640px, FeatureAccordion stacking, ComparisonTable mobile fallback on `/why-dplat`, **the new Platform centered-stack layout on tablet + mobile** (only verified at 1373×779 and 1440×900 so far).
2. **axe-core in CI** — install `@axe-core/playwright` (already a devDep) and wire to GitHub Actions matrix per CLAUDE.md §11.
3. **Performance**: Lighthouse mobile per route. Targets: LCP < 2.5s, CLS < 0.1, INP < 200ms. The 11 MB re-encoded hero MP4 may need byte-budget work. Verify Next/Image is serving AVIF/WebP for `dashboard-dark.png` and the hero PNGs. The Fontshare CDN font (one weight, ~30 KB) is now a third-party request — consider downloading General Sans 600 and using `next/font/local` if it bottlenecks LCP.
4. **Analytics**: GA4/GTM IDs (placeholders in `.env.example`). Verify `cta_primary_click`, `cta_secondary_click`, `form_*`, `accordion_toggle` (also fired by Platform tab clicks via `track`), `scroll_depth`, `video_play` events fire in GTM Preview.
5. **SEO**: Per-route OG images via `app/<route>/opengraph-image.tsx` using `@vercel/og`. `Organization` + `SoftwareApplication` JSON-LD on `/`. `ContactPage` JSON-LD on `/demo`.
6. **DoD walkthrough**: `CLAUDE.md §14` checklist per page.

---

## Known open items / loose threads

These are not bugs — they're things flagged for follow-up.

### Visual / interaction

- **Mobile + tablet layout for Platform centered-stack** is untested. The absolute-positioned eyebrow/heading + tabs/body/link may not fit cleanly under 1024×680. The framed dashboard might overflow viewport sides since it's `max-w-5xl` (1024) — fine at lg+ but worth checking at md.
- **Brief moment of two dashboards visible during the crossfade** (`scrollY ≈ pinEnd-117 → pinEnd`). Hero's bezel and Platform's bezel are at the same position but Platform's rises 70px on the way to viewport center. Reads as a soft crossfade rather than a position jump but could be tuned tighter.
- **`homepage-hero-end.png`** in `public/hero/` is now unreferenced. Safe to delete, but kept for now in case we want it back.
- **Cinematic mp4 size** (11 MB). Not the LCP target, but worth optimizing for slower connections in M4.

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
- **Wordmark is "DebtNext" (company name)** in nav chrome. Product name "dPlat" stays in metadata, voice copy, and the "Why dPlat" nav link (until Connor decides otherwise).
- **General Sans SemiBold via Fontshare CDN.** One weight only. Move to `next/font/local` if perf becomes a concern.

---

## Recent commits (most recent first)

```
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
