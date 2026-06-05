# Phase 10 — Skills briefing (folded in per standing note)

**Purpose:** Connor's standing note (`feedback_leverage_react_skills`) says to pull
`vercel-composition-patterns`, `vercel-react-best-practices`, and `frontend-design`
(plus the GSAP skills, since this is the motion foundation) into the spec + plan, and to
**flag where they override older repo instructions**. The orchestrator loaded the two
most load-bearing skills directly and distilled them below; the researcher/planner must
treat this as binding input and pull the rest via context7 (live docs) where noted.

**Authority order (unchanged):** `CLAUDE.md` and `DESIGN.md` win over any skill. Where a
skill conflicts with the repo's design tokens, voice rules, CTA rules, or perf/a11y floor,
the repo wins — but CALL OUT the conflict explicitly so Connor can adjudicate.

---

## A. Composition patterns (`vercel-composition-patterns`) — drives the archetype + payload API

Phase 10 builds 3 parametrized archetypes (Console / Data story / Schematic) + a 7-type
motion primitive vocabulary, each fed a typed payload. These rules are directly load-bearing:

1. **`architecture-avoid-boolean-props` (HIGH).** Do NOT build one mega-component with
   `mode`/`variant` booleans. The 3 archetypes are **explicit, separate variant components**
   (`<ConsoleVisual payload={...}/>`, `<DataStoryVisual .../>`, `<SchematicVisual .../>`),
   not `<Visual type="console" .../>`. A visual = "an archetype component + a typed payload."
   - **This OVERRIDES the existing repo anti-pattern** that Phase 10/12 is killing:
     `SolutionsIndustryCards` takes no props and renders the same widget on all 7 pages.
     The new system must make that class of duplicate impossible.

2. **`architecture-compound-components` (HIGH).** "Explorable visuals" (motion type 7:
   hover-to-inspect data points, toggle states inside a visual) should be compound
   components with shared context (`<Console><Console.Worklist/><Console.KPIs/></Console>`),
   NOT a flat component with `showKpis`/`interactive` booleans.

3. **`state-decouple-implementation` + `state-context-interface` (MEDIUM).** The payload is
   injected; the archetype is the only place that knows how to render it. Define a generic
   typed interface (state + actions + meta) so payloads are dependency-injected. This is how
   "every product number lives in a typed payload under `src/content/visuals/`, archetypes
   render with zero baked constants" (FND success criterion 3) becomes structural, not a
   convention people can violate.

4. **`patterns-explicit-variants` + `patterns-children-over-render-props` (MEDIUM).** Prefer
   children/slots over `renderHeader`-style render props for archetype composition.

5. **`react19-no-forwardref` (MEDIUM — project is React 19.2.4).** No `forwardRef`; pass `ref`
   as a normal prop. Use `use()` instead of `useContext()` for consuming archetype/motion
   context. Applies to every new primitive + archetype component.

---

## B. GSAP in React (`gsap-react`) — drives the motion primitives + engine-per-job rule

6. **Lazy + client-only + out of the eager chunk.** GSAP must never SSR and must never enter
   the `/` eager or shared JS chunk. The pattern is **dynamic `import("gsap")` inside an
   effect** (or `next/dynamic({ssr:false})` for a controller subcomponent) — exactly the
   pattern M5 Phase 5.3 just established in `src/components/sections/HeroCinematicController.tsx`.
   **Phase 10 generalizes that one-off into the reusable foundation.** Read that file as the
   reference implementation before designing the GSAP primitive.

7. **Cleanup is mandatory.** Use `useGSAP()` (scope + automatic revert + `contextSafe`) when
   GSAP is statically available; use `gsap.context()` + `ctx.revert()` in `useEffect` when a
   dynamic import is required for bundle size (the lazy case — which is the default here).
   `contextSafe`-wrap any animation created in an event handler.

8. **Engine-per-job rule (set ONCE in Phase 10, documented in DESIGN.md §4.7):**
   - **GSAP** → scroll-scrub / pin cinematics only. Lazy, desktop-only, client-only.
   - **Framer Motion** → entrances, reveals, `whileInView`, tab/route/section transitions.
   - **CSS** → hover, focus, ambient drift, the 7 component interaction states.
   Consumers must never hand-roll GSAP or Framer per page; they import a named primitive.

9. **Reduced-motion fails OPEN (FND success criterion 2).** Every primitive renders its final,
   fully-visible state under `prefers-reduced-motion`; content is NEVER stuck at `opacity:0`
   when a reveal doesn't fire. This is verified by a "no in-viewport node at opacity < 1"
   Playwright spec after scroll + tab/accordion open. Bake this into the primitive contract,
   not into each consumer.

---

## C. Pull via context7 (live docs — do not guess)

- **`vercel-react-best-practices`** — RSC-by-default, keep client JS off static marketing
  sections, route-level First-Load-JS budget on `/` (FND success criterion 4). Confirm the
  Next 16 mechanism for a per-route JS budget + how to assert it in CI.
- **`gsap-scrolltrigger`** — lazy `registerPlugin`, scrub/pin config, `invalidateOnRefresh`,
  `ScrollTrigger.refresh()` ordering (the hero↔handoff coupling pattern in 5.3).
- **`gsap-performance`** — bundle-size / lazy-load specifics; INP/TBT impact (the LHCI
  INP/TBT assertions on visual-heavy routes are a Phase 10 guardrail).
- **Next.js 16** — `next/dynamic`, bundle analysis, how to enforce a First-Load-JS ceiling.

## D. frontend-design skill

Read `~/.claude/plugins/marketplaces/anthropic-agent-skills/skills/frontend-design/SKILL.md`
for the general quality bar (anti-generic-AI aesthetics). Where it conflicts with `DESIGN.md`
or `.impeccable.md`, **DESIGN.md wins** — but flag the conflict.

---

## E. Cross-milestone constraint (hard)

Phase 10 co-lands with or after **M5 Phase 5.3 (lazy-GSAP)**. Do not re-open the `/` mobile
JS budget by piling eager Framer Motion / GSAP onto the homepage critical path. The motion
barrel migration (moving `AnimatedNumber`/variants out of `product/motion.tsx` without
breaking current consumers) must keep the homepage's eager chunk lean. See
`.planning/research/PITFALLS.md` (Pitfalls 1 + 6) and `docs/m5-phase-5-lhci-run.md`.
