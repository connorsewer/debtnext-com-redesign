# Pitfalls Research

**Domain:** Premium animated + interactive product-visual system on a perf- and a11y-constrained Next.js 16 / React 19 marketing site (DebtNext M6)
**Researched:** 2026-06-04
**Confidence:** HIGH (grounded in this repo's actual motion/visual code, the documented M5 LCP/GSAP post-mortem, DESIGN.md §10/§12, and current Motion + web.dev INP guidance)

> Scope note: these are the mistakes specific to *adding many animated/interactive visuals to THIS system*, not generic web-animation advice. Every pitfall ties to a concrete file or constraint already in the repo and names the M6 phase (Phase 0 Foundation, Phase 1 Platform, Phase 2 Solutions, Phase 3 Text-pages, Phase 4 Homepage) that must own it. The carried-forward M5 lesson — a heavy hero asset **plus** GSAP on the mobile JS critical path blew the LCP gate (STATE.md, `docs/m5-phase-5-lhci-run.md`) — is woven through Pitfalls 1, 5, and 6.

---

## Critical Pitfalls

### Pitfall 1: Re-opening the M5 hero LCP gate by piling JS onto the mobile critical path

**What goes wrong:**
M5 is still blocked because the LHCI simulator projects the homepage mobile LCP over the 2,300ms gate, and the locked diagnosis is that the residual gap is the JS critical path + CPU graph — specifically GSAP + ScrollTrigger eagerly loaded on mobile (Phase 5.3 is queued to lazy-import GSAP behind `!isMobile && !prefersReducedMotion`). M6 adds a whole motion system (Framer Motion `whileInView`, CountUp, CursorGlow, AmbientField) plus dozens of client visuals. If any of this lands eagerly in the homepage or shared layout bundle, it re-inflates the exact CPU/parse cost M5 is fighting, and the gate that is *almost* closed re-opens — now with more code to claw back.

**Why it happens:**
Motion primitives feel "small" individually, but they are `"use client"` and pull Framer Motion into whatever bundle imports them. A single eager import in `layout.tsx`, `SiteHeader`, or `HomepageHero` poisons the critical path for every route. The team is mentally separating "M5 perf work" from "M6 visual work," but they share one JS budget on one homepage.

**How to avoid:**
- Treat the homepage mobile JS budget as a hard, shared resource between M5 and M6. Phase 0 establishes a per-route client-JS size budget (extend the existing `tests/hero` per-file budget guard pattern, which already gates MP4 sizes at 10/6/3 MB, to a JS-transfer budget on `/`).
- Land Phase 5.3 (lazy GSAP) **before or as part of** M6 Phase 0, not after. The spec's own §7 reconciliation flags this: decide whether to close/renegotiate Phase 5 first. Do not build new motion on top of an open hero gate.
- All M6 visuals stay behind `dynamic(..., { ssr: false })` like the existing `lazy.tsx` — never statically imported into a page or shared chrome.
- Motion primitives must be importable without dragging the whole library: prefer Motion's lighter primitives where the animation is simple (CSS transitions for hover/focus already done in `hover.module.css` — keep that, don't "upgrade" it to Framer).

**Warning signs:**
- LHCI Case C median LCP on `/` ticks back up after a visual lands.
- `next build` route-level "First Load JS" for `/` grows.
- A new `import { motion } from "framer-motion"` appears in a Server Component or in `layout.tsx`/`SiteHeader`.

**Phase to address:** Phase 0 (Foundation) sets the budget + lazy contract; Phase 4 (Homepage) is highest-risk and must re-run LHCI before merge. Coordinate with M5 Phase 5.3.

---

### Pitfall 2: `whileInView`/IntersectionObserver reveals that ship blank — content stuck at `opacity: 0`

**What goes wrong:**
The 2026-06-04 audit already hit this: real content (`ProcessStrip`, `CountUp`) was reported as "empty dark panels" in the headless full-page crawl because the Framer `whileInView`/CountUp reveals never fired in a headless screenshot. Current Motion removed the IntersectionObserver fallback for `whileInView` (verified — it now assumes IO is universally available). The deeper risk for M6: as reveals get applied to *more* sections, any element that (a) starts at `initial={{ opacity: 0 }}`, (b) never intersects (e.g. inside an `overflow:hidden` ancestor, a `display:none` tab panel, a 0-height collapsed container, or below a non-scrolling viewport), or (c) renders in a context where the observer's root never scrolls, stays invisible forever. For real users this surfaces as content that's present in the DOM, passes axe (it's "visible" to AT), but is painted at opacity 0 — a silent content-loss bug.

**Why it happens:**
- `initial={{ opacity: 0 }}` makes "no trigger" fail closed (blank) instead of failing open (visible). The repo's own `RevealSection` does this.
- Tab panels and accordions hide content; an IO inside a hidden panel reports never-intersecting until the panel is shown, and a one-shot observer (`use-in-view.ts` disconnects on first hit) can latch the wrong state.
- Headless capture, print stylesheets, and "open all / Cmd-F find on page" don't scroll, so reveals never run.

**How to avoid:**
- **Reduced-motion is the safety net and it must be exact:** `RevealSection` already returns `<>{children}</>` untouched under reduced motion (good — content is fully visible, never blank). Every new reveal primitive MUST follow that exact contract: under reduced motion, render final state with zero transform/opacity gating. The existing `tests/responsive/reduced-motion.spec.ts` should be extended to assert *computed opacity === 1* for revealed content on every new page, not just that animations are off.
- Add a Playwright "no stuck opacity:0" assertion: after scrolling each route to bottom (and after opening each tab/accordion), assert no in-viewport text node sits at computed `opacity < 1`. This directly catches the audit's false-positive class as a real regression net.
- Never put `whileInView`/`useInView` reveals on content inside an initially-hidden tab/accordion panel; trigger on panel-open instead, or render the panel content with no initial-hidden state.
- Set a generous `rootMargin`/`amount` and keep `once: true` so a brief intersection latches visible (repo already uses `-12%`/`-15%` margins — keep, don't tighten).

**Warning signs:**
- A Vercel-preview full-page screenshot or OG-image render shows blank bands.
- axe passes but a visual diff or manual scroll shows missing content.
- Content appears only after a scroll jiggle.

**Phase to address:** Phase 0 (the reveal primitive + its reduced-motion contract + the regression spec). Every later phase (1–4) inherits the spec and must pass it on its new pages.

---

### Pitfall 3: INP regression from many concurrent animations and proliferating pointer/hover handlers

**What goes wrong:**
Hover is not measured by INP directly (verified — INP ignores hover), but the work hover/`pointermove`/`onMouseMove` handlers do keeps the main thread busy, which inflates input delay for the *next real interaction* (the demo CTA click, accordion toggle, tab switch). M6's plan adds cursor-reactive glow, card lift, explorable visuals, ambient drift, and live-data motion across the whole site. The failure mode is death-by-a-thousand-cuts: 8 CursorGlow instances + 30 hover-lift cards + several rAF-driven counters all competing for frames, so the first click after the page settles paints late and INP creeps past 200ms — especially on the mid-tier mobile CPU the LHCI gate models.

**Why it happens:**
- The repo's `CursorGlow` is well-built (rAF-coalesced, `pointer: fine` gate, reduced-motion off, transform-only). But it attaches a `pointermove` listener per instance on its parent. Dropping it into "every dark band" (the recent tier-3 commit literally did "extend cursor glow to every dark band") multiplies always-on listeners.
- Live-data motion (number roll-ups, filling bars, pulsing dots) implemented with JS timers/rAF keeps the main thread waking even when idle.
- Explorable visuals add real click/keydown handlers that do layout-reading work synchronously.

**How to avoid:**
- **Cap concurrent always-on motion.** One ambient/cursor layer per *viewport*, not per band — gate CursorGlow/AmbientField so only the section currently in view animates (reuse `useInView` to mount/pause off-screen instances). DESIGN.md §10 restraint is the design rationale; this is the perf enforcement of it.
- Keep pointer handlers passive and rAF-coalesced (CursorGlow pattern is the reference) and prefer pure-CSS for hover-lift/focus-glow — `hover.module.css` already does this; do NOT reimplement hover in JS.
- For live-data motion, prefer CSS `@keyframes`/`@property` and `transform`/`opacity` (AmbientField already uses CSS keyframes with seeded static positions — good). Stop counters once they reach final value; never leave an infinite rAF loop running for a one-shot roll-up.
- Add INP to CI: extend LHCI assertions to include INP/Total Blocking Time on the visual-heavy routes (`/platform/*`, `/solutions/*`, `/`), not just LCP.

**Warning signs:**
- LHCI Total Blocking Time rises on visual-heavy routes; field/lab INP > 200ms.
- DevTools Performance shows many short scripting tasks during idle hover or steady-state.
- Multiple `pointermove`/`requestAnimationFrame` loops live at once in a perf trace.

**Phase to address:** Phase 0 (concurrency cap + viewport-gating helper + INP CI gate). Phase 1/2 (explorable + per-industry visuals) and Phase 4 (homepage density) verify against it.

---

### Pitfall 4: CLS from reveal entrances and lazy visuals that reserve no space

**What goes wrong:**
Reveal entrances that animate `y`/translate are fine for CLS (transforms don't shift layout), but two adjacent patterns do cause shift: (1) lazy `ssr:false` visuals that mount with no reserved height push following content down when their chunk resolves; (2) any reveal that animates `height`, `max-height`, `margin`, or that conditionally renders (mounts) content on intersection rather than animating already-present content. With ~45 accordion placeholders becoming real visuals across platform + solutions, each lazy mount is a CLS opportunity, and the budget is a strict 0.1.

**Why it happens:**
- `dynamic(..., { ssr: false })` renders nothing (or a wrongly-sized fallback) on the server, then the real component appears client-side at a different size.
- Animating `height: 0 → auto` or toggling `display` for reveals shifts everything below.
- Developers test on desktop where late shift is less perceptible; mobile (slower chunk load) shifts more.

**How to avoid:**
- Every lazy visual's `loading` skeleton must reserve the **same** box as the resolved visual. The repo's `VisualSkeleton` already sets `min-h-[22rem]` — make the reserved aspect/min-height per-archetype (Console vs Data-story vs Schematic have different intrinsic heights) so the skeleton matches, and assert it.
- Reveals animate only `transform`/`opacity` on already-rendered content (RevealSection does this). Never animate `height`/`margin`/`top`/`left`; never gate *mounting* on intersection for layout-affecting content.
- Accordion open/close uses `grid-template-rows` over `300ms` (DESIGN.md §8.5) — that's an animated layout property but it's intentional and bounded; keep it scoped to the accordion panel, never to whole sections.
- Add a CLS assertion per route in LHCI (already implied by the 0.1 budget; make it explicit on the new visual routes).

**Warning signs:**
- LHCI CLS > 0.1 on `/platform/*` or `/solutions/*`.
- Content "jumps" when a visual finishes loading on a throttled connection.
- Skeleton height differs visibly from the loaded visual.

**Phase to address:** Phase 0 (per-archetype skeleton sizing contract). Phase 1 + Phase 2 (where ~45 lazy visuals land) verify CLS per page.

---

### Pitfall 5: Animating layout properties instead of transform/opacity (jank + INP, not just CLS)

**What goes wrong:**
The spec guardrail (§5) says "animations use transform/opacity only," but the temptation is real for "explorable" visuals and data stories: animating a bar's `width`, a panel's `height`, `top`/`left` for moving nodes on a schematic, or `box-shadow`/`filter` on hover. These trigger layout/paint on every frame, run on the main thread, drop frames on mobile, and compound the INP problem from Pitfall 3. A filling-bar chart animating `width` from 0→72% is the single most likely offender given the "filling bars" item in the motion vocab.

**Why it happens:**
- `width`/`height` is the obvious way to make a bar "fill"; `transform: scaleX()` is the correct but less obvious way.
- Schematic "data traveling the edges" invites animating geometric position properties.
- `filter: blur()` and large `box-shadow` (the cursor glow, ambient bloom) are expensive to repaint if not isolated.

**How to avoid:**
- Filling bars: animate `transform: scaleX()` with `transform-origin: left` (and counter-scale label text if needed), never `width`.
- Moving schematic data: animate `transform: translate()` along a path, or use SVG `offset-path`/`stroke-dashoffset` (compositor/cheap) rather than `x`/`y` attributes in a rAF loop.
- Isolate expensive decorative layers with `will-change: transform` (sparingly), `contain: paint`, and keep blurs on their own compositor layer (AmbientField/CursorGlow already live in their own absolutely-positioned layers — good).
- Code-review rule + lint guard: flag any `animate`/`transition`/`@keyframes` touching `width|height|top|left|right|bottom|margin|padding|box-shadow|filter` inside `product/visuals/*` and `motion/*`. Add to the Phase 0 review checklist.

**Warning signs:**
- DevTools "Rendering > Paint flashing" lights up large areas during animation.
- Frame drops / jank scrubbing on mid-tier mobile.
- Performance trace shows Layout/Recalculate-Style during what should be a compositor-only animation.

**Phase to address:** Phase 0 (primitive library builds bars/nodes the right way once, so consumers can't get it wrong). Phase 1 (explorable flagships) is the main consumer to verify.

---

### Pitfall 6: Bundle bloat — GSAP *and* Framer Motion both on mobile, or duplicated across chunks

**What goes wrong:**
The site already ships two animation engines: GSAP 3 (hero cinematic + platform handoff ScrollTrigger) and Framer Motion 12 (entrances, accordions, reveals). The M5 lesson is that GSAP on the mobile critical path is the residual LCP blocker. M6 leans on Framer Motion heavily. The trap: (1) loading both engines on the same route when one would do; (2) using GSAP for something Framer/CSS already covers (or vice versa), so both engines end up in the same route's bundle; (3) `whileInView`/`motion` getting imported so widely that Framer is in the shared chunk on mobile, re-creating the GSAP problem with a second library.

**Why it happens:**
- Two engines exist, so contributors reach for whichever they know without checking what's already on the route.
- Framer's `motion` component is heavier than a CSS transition for trivial cases, but it's the familiar tool.
- Mobile forks (the platform handoff already has a static mobile fork) can accidentally still import the desktop engine even when the cinematic doesn't run.

**How to avoid:**
- **One engine per job, documented in Phase 0:** GSAP only for scroll-scrub/pin cinematics (desktop, lazy, behind `!isMobile && !prefersReducedMotion` per the queued 5.3 pattern). Framer for component entrances/reveals/accordions. CSS for hover/focus/micro-interactions and ambient/cursor (already the case). No third pattern.
- Mobile must not download GSAP at all on `/` (M5 Phase 5.3 enforces this via dynamic import; the existing `tests/hero` mobile-video-free spec is the template for a "mobile-GSAP-free" spec — add one).
- Keep Framer out of the shared/critical chunk: import `motion` only inside `ssr:false` lazy visuals or client leaf components, never in layout/header/Server Components.
- Phase 0 adds a route-level First-Load-JS budget assertion so a regression is caught at build, not in the field.

**Warning signs:**
- `next build` shows both `gsap` and `framer-motion` in the same route's First Load JS on a route that visually needs only one.
- Mobile network panel on `/` requests a GSAP chunk.
- First Load JS for any route grows materially after a motion change.

**Phase to address:** Phase 0 (engine-per-job rule + budgets + mobile-GSAP-free spec). Coordinate with M5 Phase 5.3. Phase 4 (homepage) re-verifies.

---

### Pitfall 7: Hover-only / cursor-only interactions that lock out keyboard and touch users

**What goes wrong:**
"Hover to inspect data points," "cursor-reactive glow," and "toggle states inside a visual" are core to the explorable archetype, but if the only way to reveal a data value or trigger a state is hovering with a fine pointer, then keyboard users and touch users get nothing — a WCAG 2.2 AA failure (1.4.13 Content on Hover/Focus, 2.1.1 Keyboard) and an axe-CI break. The site's whole audience is enterprise buyers evaluating seriously; a tooltip that only a mouse can open reads as broken on an iPad in a boardroom.

**Why it happens:**
- Data-viz tooltips are conventionally hover-driven; the keyboard/focus path is extra work and easy to skip.
- CursorGlow is correctly decorative (`aria-hidden`, `pointer:fine` only) — but contributors may copy that pattern for *meaningful* interactions, hiding real data behind fine-pointer-only handlers.
- Explorable toggles built as `<div onClick>` instead of `<button>` aren't focusable or operable by Enter/Space.

**How to avoid:**
- Any data point, tooltip, or toggle that conveys information must be reachable and operable by keyboard (focusable `<button>`/`<a>`, Enter/Space/Arrow per ARIA pattern) and must open on `focus` as well as `hover` (WCAG 1.4.13: dismissible, hoverable, persistent).
- Decorative-only effects (glow, drift) stay `aria-hidden` and gated to `pointer:fine` — that's correct and should stay decorative-only. Draw a hard line in Phase 0: decorative effects never carry information.
- Provide a non-hover affordance for data: visible value labels by default, with hover/focus adding detail — not hover *revealing* the only copy of the value.
- Extend axe-CI and add keyboard-walkthrough Playwright specs for each explorable visual (tab to it, activate, read state). The repo already runs axe at 375/1440 and has keyboard expectations in DESIGN.md §12.

**Warning signs:**
- A visual's data is invisible until mouseover.
- Tabbing through a page skips over an "interactive" visual entirely.
- axe flags interactive elements without accessible names/roles.

**Phase to address:** Phase 1 (platform explorable flagships) and Phase 2 (per-industry explorable visuals) are the consumers; Phase 0 sets the "interactive visual = real button + focus parity + keyboard spec" contract.

---

### Pitfall 8: Data-viz that relies on color alone or has no text alternative

**What goes wrong:**
DESIGN.md §4.1 is explicit: charts must use labels/tooltips/legends/tables and status colors must always pair with a label or icon (the product-visual tokens table repeats this). With ~45 new charts/consoles/schematics carrying real per-industry data, the easy failure is encoding meaning purely in `--chart-1`/`--status-breach`/`--status-success` color, or shipping a chart with no programmatic text equivalent. Screen-reader users get an `aria-hidden` decorative blob where a buyer-relevant data story should be. This is both a WCAG 1.4.1 (use of color) and 1.1.1 (non-text content) failure, and it undercuts the "explain, not decorate" principle (DESIGN.md §3.4).

**Why it happens:**
- Hand-built SVG/CSS visuals have no built-in accessibility layer (unlike a charting lib), so a11y is opt-in and gets skipped.
- The dark aesthetic pushes toward color-coded status dots without text.
- "It's just a marketing visual" reasoning leads to blanket `aria-hidden`, which hides real information.

**How to avoid:**
- Decide per visual: decorative → `aria-hidden="true"` and ensure the same information exists in adjacent copy/caption; meaningful → give it a text summary via `aria-describedby` or a visually-styled-but-real caption/data list (DESIGN.md §11 alt-text rules).
- Every status color carries a label or icon (the LiveStatus/StatPill/MetricCell primitives already exist — make label-pairing mandatory in their API so a color-only state is impossible to construct).
- Captions and data summaries are copy — they go through the voice rules (no em dashes, banned-phrase list) and any metric goes through `[CLAIMS REVIEW]`; any vendor/TSI-relationship framing goes through `[COI REVIEW]`. Do not let new visual captions sneak claims past governance.
- Add an axe-CI check and a manual "screen-reader can get the data story" item to per-page DoD.

**Warning signs:**
- A chart's meaning disappears in grayscale.
- A status is only a colored dot with no adjacent word/icon.
- A visual is `aria-hidden` but its data isn't stated anywhere else on the page.

**Phase to address:** Phase 0 (primitives enforce label-pairing; caption = governed copy). Phase 2 (per-industry data stories) is highest-volume. Phase 3 (text-page elevation) where captions multiply.

---

### Pitfall 9: Hydration mismatches from random/time-based visuals and `ssr:false` everywhere

**What goes wrong:**
Live-data motion and ambient drift invite `Math.random()` positions, `Date.now()`-seeded values, or "animate from a random start," which produce different server and client markup → React 19 hydration errors, console noise, and occasional visible flashes. The repo already learned this: `AmbientField` uses a *seeded deterministic PRNG* specifically "so server and client markup match and there is no hydration mismatch." The trap is new contributors not knowing that rule and reaching for `Math.random()` in the next visual.

**Why it happens:**
- Particles, jitter, "random" sparkles, and shuffled data feel naturally random.
- React 19 is stricter and noisier about mismatches than older versions.
- The escape hatch (`ssr: false`) is overused: making *everything* `ssr:false` avoids the error but ships a blank server HTML (worse LCP, worse no-JS fallback, more CLS — see Pitfalls 1 and 4).

**How to avoid:**
- Any "random" placement must use a seeded deterministic generator (copy the AmbientField PRNG pattern) so SSR and client agree. Document this as a Phase 0 rule.
- Reserve `ssr: false` for genuinely client-only, below-the-fold, interaction-heavy visuals (the current `lazy.tsx` usage is appropriate). Static data stories/schematics that can render on the server should, for LCP and resilience.
- Never read `window`/`matchMedia`/`Date.now()` during render; do it in `useEffect` (CursorGlow does this correctly).

**Warning signs:**
- "Hydration failed / text content did not match" in console on a route with a new visual.
- A visual flashes/repositions on first paint.
- A diff between server HTML (`view-source`) and rendered DOM for a visual that should be deterministic.

**Phase to address:** Phase 0 (deterministic-randomness rule + `ssr:false` decision criteria). All phases inherit.

---

### Pitfall 10: Reduced-motion handled inconsistently across CSS, Framer, and GSAP

**What goes wrong:**
The site honors `prefers-reduced-motion` in three places (global CSS block in `globals.css`, Framer `useReducedMotion`, GSAP media-query guard) and has a `reduced-motion.spec.ts`. M6 adds a 7-type motion vocabulary across dozens of components. The failure is partial coverage: one new primitive forgets the reduced-motion branch, so a reduced-motion user (often vestibular-sensitive) still gets ambient drift, a number roll-up, or a parallax-feeling reveal — a WCAG 2.3.3 / DESIGN.md §9.6 ("No exceptions") violation that the existing spec won't catch unless it's extended to the new routes/components.

**Why it happens:**
- Three different mechanisms means three different "did you remember?" checks per component.
- "Subtle" motion (ambient drift, slow bloom) feels exempt, but it isn't.
- The reduced-motion spec enumerates known components; new ones aren't auto-covered.

**How to avoid:**
- Centralize: the Phase 0 motion primitives handle reduced-motion *once* (the spec §4.1 explicitly wants this — "`prefers-reduced-motion` handled once"). Consumers import primitives; no ad-hoc Framer/GSAP/CSS animation in pages. This is the single highest-leverage prevention.
- Reduced-motion fallback = final/static state, fully visible, no transform (RevealSection and AmbientField's `bloomStatic` are the reference). Never "fail to blank" (ties to Pitfall 2).
- Extend `reduced-motion.spec.ts` to assert: on every M6 route, under reduced motion, (a) no element has a running animation/transition, (b) all reveal content is at computed opacity 1, (c) ambient/cursor layers are absent or static.
- Add reduced-motion to per-page DoD.

**Warning signs:**
- A new component animates with no `useReducedMotion`/media-query guard.
- `reduced-motion.spec.ts` still lists only pre-M6 components after M6 pages ship.
- Motion visible in macOS "Reduce motion" / emulated reduced-motion in DevTools.

**Phase to address:** Phase 0 (centralized handling + spec extension contract). Every phase 1–4 adds its routes to the spec.

---

## Technical Debt Patterns

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| `ssr: false` on *every* visual to dodge hydration/SSR effort | Fast, no mismatch debugging | Blank server HTML, worse LCP, CLS on mount, no-JS fallback gone (Pitfalls 1, 4, 9) | Only for genuinely client-only, below-fold, interactive visuals |
| Drop CursorGlow/AmbientField into "every dark band" | Uniform lux feel quickly | Always-on listeners + rAF loops everywhere → INP creep (Pitfall 3) | Never site-wide; one active layer per viewport, gated by in-view |
| Animate bar `width` / panel `height` because it's the obvious API | Works on a fast desktop | Layout/paint per frame, jank on mobile, INP (Pitfall 5) | Never for continuous animation; `transform`/`grid-rows` instead |
| Reach for whichever animation engine you know | No context-switching | Both GSAP + Framer in one route's bundle, mobile critical-path bloat (Pitfall 6) | Never; one engine per job per Phase 0 rule |
| `initial={{opacity:0}}` reveal with no reduced-motion/no-trigger fallback | Clean entrance code | Content ships blank in headless/hidden/no-scroll contexts (Pitfall 2) | Never without the RevealSection fail-open contract |
| Per-component reduced-motion handling | Ship a component in isolation fast | Inconsistent coverage, WCAG gaps as count grows (Pitfall 10) | Only until Phase 0 centralizes it; then forbidden |

## Integration Gotchas

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| Framer Motion 12 `whileInView` | Assuming an IO fallback exists / content stays hidden if it never intersects | IO is required (no fallback in current Motion); reduced-motion + fail-open initial state guarantee visibility |
| GSAP ScrollTrigger | Eager import on mobile (the live M5 blocker) | Lazy `import()` behind `!isMobile && !prefersReducedMotion`; mobile-GSAP-free spec |
| `next/dynamic ssr:false` (Turbopack) | Non-literal options object; mismatched skeleton size | Inline-literal option object per component (repo already does); per-archetype skeleton matches resolved size |
| `next/image` for raster visuals | Repeating the M5 hero mistake — large raster on critical path / no reserved box | AVIF/WebP, sized box to avoid CLS, lazy below fold (DESIGN.md §11; M5 §12) |
| axe-core CI | Running only on static routes; not re-running after tab/accordion/visual open | Run axe after interaction states too; keyboard-walk specs for explorable visuals |
| GA4/GTM analytics (M5 pending) | New `accordion_toggle`/interaction events fire on every animation frame | Debounce/throttle event firing; fire on settled interaction, not on motion |

## Performance Traps

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| Many concurrent rAF/pointermove loops | INP > 200ms, TBT rises, idle-time scripting in traces | One active ambient/cursor layer per viewport; CSS over JS; stop one-shot loops | When >2–3 always-on motion layers coexist on mid-tier mobile |
| Framer Motion in the shared/critical chunk | `/` First Load JS grows; mobile LCP regresses | Import `motion` only in lazy/leaf client components | As soon as one Server/layout file imports `motion` |
| Animating layout properties (`width`/`height`/`top`) | Paint flashing, frame drops on mobile | `transform`/`opacity`/`scaleX` only; primitives enforce it | Continuous animations on any non-flagship mobile device |
| Lazy visual with wrong-sized skeleton | CLS > 0.1 on throttled mobile | Per-archetype skeleton matches resolved box | ~45 lazy visuals across platform+solutions on slow networks |
| GSAP + Framer both shipped to mobile `/` | Re-opens the M5 LCP gate | One engine per job; mobile-GSAP-free spec; JS budget in CI | Immediately on the already-marginal homepage |

## Security Mistakes

| Mistake | Risk | Prevention |
|---------|------|------------|
| Real client data / account numbers in "realistic" console visuals | Exposes sensitive operational data; breaks CLAUDE.md §15 | Use anonymized, generic, qualified numbers; DESIGN.md §7.4 content rules; `[CLAIMS REVIEW]` on any metric |
| Visual captions asserting recovery/liquidation/cost metrics or naming clients | COI/claims violation, legal exposure | `[CLAIMS REVIEW]` + `[COI REVIEW]` flags on all new caption copy before merge; named approvers (Andrew Budish / Paul Goske) |
| Caption copy implying dPlat is structurally separate from TSI's ARM business | COI disclosure violation | Use only the §6 "language that's fine" phrasings; `[COI REVIEW]` |

## UX Pitfalls

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| Hover-only data reveal | Keyboard/touch/boardroom-iPad users get no data | Focus + hover parity; visible default labels (Pitfall 7) |
| Over-animation against the brand | "Calm, precise, technical" buyer feels sold-to; trust drops | Restraint per DESIGN.md §10; motion earns its place, subtle and few |
| Decorative motion competing with the single CTA per band | Dilutes the conversion focus | One voltage per band; motion never out-shouts the "Request a demo" CTA |
| Counters/bars that re-trigger on every scroll past | Distracting, feels janky | `once: true` (repo default); stop after first run |
| Status by color only on dark canvas | Colorblind/low-vision users miss state | Label/icon + color always (Pitfall 8) |

## "Looks Done But Isn't" Checklist

- [ ] **Reveal entrance:** Often missing the no-trigger/reduced-motion fail-open — verify computed `opacity === 1` after scroll AND under reduced motion AND in headless capture.
- [ ] **Lazy visual:** Often missing a correctly-sized skeleton — verify CLS < 0.1 on throttled mobile and skeleton box == resolved box.
- [ ] **Explorable visual:** Often missing keyboard operation + focus-revealed data — verify tab-to, Enter/Space/Arrow, and focus parity with hover.
- [ ] **Chart/console:** Often missing text alternative / label-paired status — verify screen reader gets the data story and grayscale still reads.
- [ ] **Cursor/ambient layer:** Often missing in-view gating — verify only the in-viewport instance animates and none run under reduced motion / on touch.
- [ ] **Homepage after a visual lands:** Often missing an LCP re-check — verify LHCI Case C still under gate and First Load JS didn't grow.
- [ ] **New caption copy:** Often missing governance — verify no em dashes/banned phrases, `[CLAIMS REVIEW]`/`[COI REVIEW]` cleared.
- [ ] **Reduced-motion spec:** Often missing the new route — verify the route is added to `reduced-motion.spec.ts` and passes.

## Recovery Strategies

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| Re-opened LCP gate (Pitfall 1/6) | HIGH | Bisect the offending import; move to lazy/`ssr:false`; lazy GSAP per 5.3; re-run LHCI; add JS budget guard so it can't recur |
| Content stuck at opacity:0 (Pitfall 2) | LOW–MEDIUM | Switch initial state to fail-open or trigger on panel-open; add the "no stuck opacity" Playwright assertion |
| INP regression (Pitfall 3) | MEDIUM | Gate ambient/cursor to in-view; convert JS hover to CSS; stop one-shot loops; re-trace |
| CLS from lazy mount (Pitfall 4) | LOW | Size the skeleton to the resolved box; re-measure |
| Layout-property animation (Pitfall 5) | LOW–MEDIUM | Rebuild the offending primitive on `transform`/`scaleX`; consumers inherit fix |
| Hover/color-only a11y (Pitfall 7/8) | MEDIUM | Add focusable controls + labels/text alt; add keyboard + axe specs |
| Hydration mismatch (Pitfall 9) | LOW | Replace `Math.random()` with seeded PRNG, or move to `useEffect`/`ssr:false` if truly client-only |

## Pitfall-to-Phase Mapping

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| 1. Re-opening hero LCP gate via JS on critical path | Phase 0 (budget + lazy contract) + coordinate M5 5.3; re-verify Phase 4 | LHCI Case C on `/` under gate; route First Load JS budget green |
| 2. `whileInView` reveals ship blank | Phase 0 (primitive + spec); Phases 1–4 add routes | "No stuck opacity:0" Playwright spec after scroll + tab-open; reduced-motion spec opacity==1 |
| 3. INP from concurrent animations/hover | Phase 0 (in-view gating + INP CI); Phases 1/2/4 verify | LHCI INP/TBT gate on `/platform/*`, `/solutions/*`, `/` |
| 4. CLS from reveals/lazy visuals | Phase 0 (per-archetype skeleton); Phases 1/2 verify | LHCI CLS < 0.1 per visual route; skeleton==resolved assertion |
| 5. Animating layout properties | Phase 0 (primitives build bars/nodes correctly); Phase 1 verify | Code-review/lint guard; no Layout in compositor-animation traces |
| 6. GSAP + Framer both on mobile / bundle bloat | Phase 0 (engine-per-job + mobile-GSAP-free spec) + M5 5.3; Phase 4 | `next build` route bundle inspection; mobile-GSAP-free Playwright spec |
| 7. Hover/cursor-only interactions | Phase 1 + Phase 2 (explorables); Phase 0 sets contract | Keyboard-walk Playwright specs; axe; focus-reveal parity |
| 8. Color-only / no-text-alt data-viz | Phase 0 (label-paired primitives); Phase 2/3 volume | axe + manual SR data-story check; grayscale read |
| 9. Hydration mismatch / `ssr:false` overuse | Phase 0 (deterministic-random rule); all phases | No hydration errors in console; server-vs-DOM diff for deterministic visuals |
| 10. Inconsistent reduced-motion handling | Phase 0 (centralized once); Phases 1–4 add routes | `reduced-motion.spec.ts` extended per route, all green |

## Sources

- This repo (HIGH): `src/components/motion/CursorGlow.tsx` (rAF + `pointer:fine` + reduced-motion pattern), `src/components/ambient/AmbientField.tsx` (seeded deterministic PRNG for hydration safety), `src/components/sections/RevealSection.tsx` + `src/hooks/use-in-view.ts` (reveal/IO patterns and the fail-open reduced-motion contract), `src/components/product/visuals/lazy.tsx` (`ssr:false` + skeleton), `src/app/globals.css` (reduced-motion blocks), `tests/responsive/reduced-motion.spec.ts`, `tests/hero/*` (per-file budget + mobile-video-free spec patterns).
- `.planning/STATE.md` + `docs/m5-phase-5-lhci-run.md` (HIGH): the M5 hero LCP post-mortem — heavy asset + GSAP on mobile critical path; lazy-GSAP recommended fix (Phase 5.3).
- `DESIGN.md` §3.4, §4.1 (chart/status color + label rules), §4.7 (motion tokens/rules), §9.6 (reduced motion, no exceptions), §10, §11, §12 (HIGH, authoritative).
- `docs/superpowers/specs/2026-06-04-premium-visual-motion-system-design.md` (HIGH): 7 motion types, archetype library, §5 guardrails, §7 M5 reconciliation, the headless `whileInView` false-positive finding.
- `CLAUDE.md` §11 (a11y floor), §12 (perf budgets), §13 (analytics events), §15 (no invented data) (HIGH).
- Motion (Framer Motion) docs — `whileInView`/`inView`/`useInView`, IO-required (no fallback) (MEDIUM, verified via WebSearch against motion.dev results): https://motion.dev/docs/inview , https://motion.dev/docs/react-use-in-view , https://motion.dev/docs/react-upgrade-guide
- web.dev INP guidance — hover not measured by INP but main-thread work delays the next interaction; rAF coalescing; TBT as lab proxy (MEDIUM, WebSearch-verified): https://web.dev/articles/inp , https://web.dev/articles/optimize-inp
- DebugBear requestAnimationFrame guidance (MEDIUM): https://www.debugbear.com/blog/requestanimationframe

---
*Pitfalls research for: premium animated + interactive product-visual system on a perf/a11y-constrained Next.js marketing site (DebtNext M6)*
*Researched: 2026-06-04*
