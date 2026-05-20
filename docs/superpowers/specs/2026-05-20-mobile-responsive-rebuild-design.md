# M4 — Mobile responsive rebuild (design spec)

**Date:** 2026-05-20
**Status:** Approved (Connor, 2026-05-20)
**Predecessor:** M3.6 (seamless hero → Platform handoff + DebtNext wordmark, deployed)
**Scope:** Full responsive rebuild of debtnext.com — foundation tokens, section primitives, the Platform handoff mobile branch, and the QA + CI layer that proves it.

This spec is the contract that drives the implementation plan. Any deviation from it during implementation requires re-approval.

---

## 1. Why this scope

HANDOFF.md flags the new Platform centered-stack handoff as untested below 1024px. The wider site is desktop-first (48 `md:`, 31 `lg:`, 8 `sm:` prefixes across `src/`). M4 was originally framed as responsive QA at 6 breakpoints, but a QA-only pass would paper over the underlying issue: there is no responsive *system*. This spec builds one.

The site personality (`.impeccable.md`: calm, precise, technical) and the Mercury single-reference rule constrain what "mobile" should feel like. Mercury does not shrink its desktop cinematic onto a phone; it ships a structurally calmer mobile experience. We follow that pattern.

---

## 2. Locked design decisions

These were chosen during brainstorming (2026-05-20) and are non-negotiable in implementation:

| Decision | Chosen | Why |
|---|---|---|
| Strategic direction | Full responsive rebuild | Connor explicitly chose the largest scope. Foundation-first delivers a system, not patches. |
| Execution order | Foundation → primitives → pages → QA | Tokens drive consistency. Primitives compose. Pages compose primitives. QA proves. |
| Platform handoff on mobile | Calm static stack below 768px | Pinned 300vh GSAP on a phone is claustrophobic and the mockups become unreadable. Mercury ships a calm mobile too. |
| Hero on mobile | Stays as-is (static start-frame, no GSAP scrub) | Already deployed and aligned with the calm-mobile philosophy. |
| Layout primitive | Container queries over viewport breakpoints | "No breakpoint cliffs" requires components that react to *their container*, not the viewport. Tailwind v4 supports this natively. |
| Documentation cadence | In-commit, not follow-up | Stored as feedback memory `feedback-docs-in-sync`. Doc rot defeats the no-context-rot model the project depends on. |

---

## 3. Section 1 — Foundation layer

Six concrete additions to `src/app/globals.css` and a small extension to `DESIGN.md`. No breaking changes to existing components on this pass; everything that follows depends on these tokens being in place first.

### 3.1 Fluid type scale

Replace the static `--text-*` tokens with `clamp()`-based pairs anchored to **360px** (one notch below iPhone SE width) and **1440px** viewports. Ramp covers 12 / 14 / 16 / 18 / 20 / 24 / 32 / 40 / 56 / 72 / 88 px equivalents, each fluid.

The atmospheric hero `clamp(2.75rem, 8vw, 7rem)` (already shipped, locked in HANDOFF) becomes the template, not the exception. Line-height and tracking also become fluid where it matters (display sizes).

Implementation: Utopia-style two-anchor calc. Document the formula in DESIGN.md so future tokens follow the same pattern.

### 3.2 Tailwind v4 container queries

Enable `@container` in `globals.css` so component primitives (`BenefitSplit`, `CardGrid`, `FeatureAccordion`, future grids) react to their container width, not viewport. This is the unlock for "no breakpoint cliffs": a 3-col grid becomes 2-col when its parent narrows, regardless of viewport size, so nesting works correctly.

### 3.3 Touch-target tokens

- `--size-touch: 44px` (iOS HIG)
- `min-h-touch` / `min-w-touch` utility classes

Apply to every interactive element in nav, footer, dropdown items, mockup interactive elements, accordion triggers. Audit reveals that some current dropdown links are below 44px tall on mobile.

### 3.4 Safe-area-insets

Add `env(safe-area-inset-*)` padding to:

- Fixed `<SiteHeader>` (top inset — currently can collide with the dynamic island)
- `<FinalCTA>` and any sticky bottom CTAs (bottom inset)
- `<DemoForm>` submit row when keyboard-aware

Currently zero handling in the codebase.

### 3.5 Mobile section padding

DESIGN.md specifies 72–96px desktop section padding. Add:

- `--space-section-mobile: 48px`
- `--space-section-tablet: 56px`

Pipe through `SectionContainer`. Avoids the cramped-on-phone, sparse-on-desktop failure mode.

### 3.6 Reduced-motion audit

`prefers-reduced-motion` is honored in some places (`HomepageHandoffSection`, `ProofBand`) but not consistently. Sweep all GSAP, Framer Motion, and CSS transitions to ensure each has a quiet fallback. The `.dn-node` indigo wordmark pulse is already correctly suppressed under reduced motion.

### 3.7 Docs bundled with this section

- DESIGN.md gets a new top-level section (likely §9) titled **"Responsive system"** documenting: the fluid scale formula and values, the container-query breakpoints, the touch-target floor, safe-area handling, and mobile section padding.
- HANDOFF.md M4 status moves from "pending" to "in progress" and gets a checklist with foundation tokens line-itemized.

---

## 4. Section 2 — Section primitives, responsive contracts

Each primitive in `src/components/sections/` gets a defined responsive contract. Ten components need real structural changes; the rest just get a verification pass.

| Primitive | Desktop behavior | Narrow-container behavior | Notes |
|---|---|---|---|
| `FeatureAccordion` | Text-left / visual-right | Single column. Accordion items first; paired visual renders *below* the active item. | Container-query driven, not viewport. Triggers ≥44px. |
| `BenefitSplit` | Reversible text/media split | Below ~640px container, force vertical (text → media). Reverse prop ignored. | Reverse loses meaning on a phone. |
| `ComparisonTable` | Desktop table | Card stack: each row's label paired with each column's value. Sticky first column on tablet (768–1023). | HANDOFF flags fallback as untested. |
| `ProcessStrip` | 3–5 step horizontal strip | Vertical timeline. Thin left rule, number bubbles. Subtle indigo active state preserved. | |
| `AttachedForm` | Mercury-style pill input+button | Below ~520px container, stacked input top / full-width button below. Pill radius preserved on each. | |
| `CardGrid` | 2/3/4-col flexible | Same look, but via `@container (min-width: …)` not viewport. | Enables nesting. |
| `TrustBand` / `ProofBand` / `IntegrationStrip` | Logo / proof rows | Wrap cleanly without crushing logos. Per-slot `min-width`. Horizontal scroll-snap fallback if a row truly can't fit. | Honor reduced motion on the existing reveals. |
| `Hero` / `PageHero` | Split-layout with attached form | Stacks at narrow widths. Attached form follows the rule above. Fluid clamp scale on eyebrow/H1/body. | |
| `FinalCTA` | Dark band, one filled CTA | CTA ≥44px tall, full-width below 375px, `env(safe-area-inset-bottom)` padding. | |
| `SectionContainer` | 72–96px vertical padding | Uses new mobile/tablet padding tokens. | Single source of vertical rhythm. |

### 4.1 Docs bundled with this section

- DESIGN.md §9 expands with a "Primitive responsive contracts" subsection — one row per primitive, with container-width threshold and behavior.

---

## 5. Section 3 — Platform handoff mobile branch

The only section in the codebase that needs a structurally different mobile architecture, not just adapted styling.

### 5.1 Gate

`useEffect` + `matchMedia("(max-width: 767px)")` in `HomepageHandoffSection.tsx`, same pattern the cinematic hero already uses. Branch the render between the existing 400vh pinned layout and a new stacked layout.

### 5.2 Mobile layout (below 768px)

Replaces the 400vh sticky pin with a normal-flow stacked section:

- Outer wrapper: `py-[var(--space-section-mobile)]`, full viewport width, normal document flow.
- One section heading + eyebrow at the top: `THE PLATFORM` / `Four moments that move a recovery program forward.`
- Then for each of the 4 tabs (Placement, Vendor performance, Issues and disputes, Reporting and compliance), render a vertical block:
  - Eyebrow (tab name, indigo accent)
  - H3 tab heading
  - 2–3 sentence body
  - `<FramedDashboard>` bezel containing `<MockupForTab id={tabId} />`, full container width, intrinsic aspect
  - Tap-through link "Explore [tab name] →" to the matching `/platform/<sub>` route
- No tab pills (redundant when content stacks), no scroll-driven progression, no shared sticky bezel.

### 5.3 GSAP cleanup on mobile

The existing `useGSAP` body bails early when `isMobile === true`. `gsap.context()` cleanup ensures no leaked `ScrollTrigger`s when crossing the boundary (devtools resize edge case). Same defensive pattern the hero uses.

### 5.4 Mockup mount animations

Desktop reuses each mockup's mount-time motion (bars grow, sparkline draws, etc.). On mobile, wire those to `IntersectionObserver` so each mockup animates when it scrolls into view, not all at once on initial page render. Honor `prefers-reduced-motion` (skip entrance animations entirely under that media query).

### 5.5 Hero coordination

Hero's GSAP `onUpdate` is already gated by `if (isMobile) return`, so the `[data-handoff-section]` opacity crossfade trigger never runs on mobile. Platform handoff becomes a normal page section below the static hero. No cleanup work needed on the hero side.

### 5.6 Mockup widths

Current `FramedDashboard` is `max-w-5xl` (1024px). On mobile, the bezel becomes `w-full` with internal `p-3` (down from `p-4`). Each mockup's internals (tier bars, vendor rows, issue cards, chart) keep `text-xs` / `text-sm` and `space-y-2`. The trimmed Placement (4 tiers) and Vendor (4 rows) variants from M3.6 already work; Issues and Reporting need verification at 375.

### 5.7 Docs bundled with this section

- HANDOFF.md gets a new "Platform handoff — mobile architecture" subsection under the M3.6 section (or a new M4 section once that work begins).
- HANDOFF "Decisions locked" list gets one new line: **"Platform handoff section uses a structurally different mobile architecture below 768px (calm static stack, no pin, no GSAP)."**

---

## 6. Section 4 — QA + testing matrix

The rebuild only counts if we can prove it works.

### 6.1 Breakpoint matrix

Manual visual QA at **320, 375, 414, 768, 1024, 1280, 1440** plus **landscape phone (812×375)** and **landscape tablet (1180×820)**. Nine viewports total. Done via Playwright `browser_resize` against each of the 11 routes.

Output: `docs/m4-responsive-qa.md` — pass/fail matrix per (route, breakpoint), filled in as work progresses.

### 6.2 axe-core in CI

Wire `@axe-core/playwright` (already a devDep per HANDOFF.md) into a new GitHub Actions workflow `.github/workflows/a11y.yml`. Runs against every route at 375 and 1440. Fails the PR on any critical or serious violation. Per CLAUDE.md §11.

### 6.3 Touch-target audit

Playwright script walks every route at 375, queries all `<a>` and `<button>` elements, asserts `getBoundingClientRect()` height + width ≥ 44px. Output: `docs/m4-touch-target-audit.md`. Anything failing gets fixed.

### 6.4 Reduced-motion verification

Set `prefers-reduced-motion: reduce` in Playwright context, snapshot each route, confirm no animations run (no GSAP scrub, no Framer reveals, no `.dn-node` pulse).

### 6.5 Lighthouse mobile

Per route, on the Vercel preview, capture LCP / CLS / INP. Targets per CLAUDE.md §12:

- LCP < 2.5s
- CLS < 0.1
- INP < 200ms

Output: `docs/m4-perf-baseline.md`. Anything failing gets a targeted fix. Likely culprits: 11 MB re-encoded hero MP4 (mentioned in HANDOFF M4 pending), Fontshare CDN call for General Sans 600.

### 6.6 Visual regression spot-check

Playwright screenshots at each breakpoint × each route, written to `qa-snapshots/` (gitignored — working artifact, not committed). Spot-check for layout breaks that wouldn't surface otherwise.

### 6.7 Docs bundled with this section

- `docs/m4-responsive-qa.md` — pass/fail matrix, updated as fixes land.
- `docs/m4-touch-target-audit.md` — touch-target results.
- `docs/m4-perf-baseline.md` — Lighthouse baseline and post-fix results.
- HANDOFF.md M4 section moves from "pending" through "in progress" to "deployed" as each phase lands.

---

## 7. Out of scope (explicit)

To prevent scope creep during implementation:

- **No copy changes.** Per CLAUDE.md §5, copy is approved. Mobile rebuild does not rewrite content.
- **No new routes.** The 11 v1 routes are it. v2 capability pages (`/platform/oversight`, etc.) remain v2.
- **No new analytics events.** GA4/GTM wiring is its own M4 work item, separate from this responsive rebuild.
- **No new CTAs.** "Request a demo" is the locked CTA per CLAUDE.md §4.
- **No design token color changes.** `#5266EB`, `#171721`, `#EDEDF3`, `#9CB4E8` are locked.
- **No COI/claims content edits.** Approver-gated content stays as-is.

If a primitive's mobile contract surfaces a copy or content question, it gets flagged in PR description, not silently changed.

---

## 8. Acceptance criteria

This work is done when:

1. All 11 routes pass visual QA at all 9 breakpoints. `docs/m4-responsive-qa.md` shows green across the board.
2. axe-core CI runs on every PR and currently passes against `main` at 375 and 1440.
3. Touch-target audit at 375 shows zero failures.
4. Reduced-motion verification confirms no animation under that media query.
5. Lighthouse mobile hits the CLAUDE.md §12 targets on every route.
6. The Platform handoff section renders as a calm static stack below 768px, with no GSAP-related console warnings on any breakpoint.
7. DESIGN.md §9 "Responsive system" exists and accurately reflects shipped tokens.
8. HANDOFF.md M4 section reflects shipped state.
9. CLAUDE.md §14 DoD checklist passes for every route on the Vercel preview.

---

## 9. Open questions

None at spec time. Brainstorming closed all three strategic forks (overall scope, Platform handoff mobile, execution order). The implementation plan (next step) will surface tactical questions as they arise — none are blocking spec approval.

---

End of spec. Next step per the brainstorming protocol: spec self-review, then user review, then `writing-plans` to produce the phased implementation plan.
