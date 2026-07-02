# Phase 14: Text-only page elevation - Context

**Gathered:** 2026-06-13
**Status:** Ready for research/planning
**Mode:** `--auto` (recommended defaults selected; no interactive Q&A this run)
**Branch:** `phase-14-text-page-elevation` (off `main` @ `ab0ad77`; independent of the unmerged Phase 13 PR #12)

<domain>
## Phase Boundary

Bring the matured archetype + motion system to the **text-heavy pages that currently carry little or no visual treatment**, but only where a visual or motion lifts the page's argument. Restraint is the operative discipline: motion never out-shouts the single "Request a demo" CTA per band.

**In scope (the 9 target routes):**
- `/compare` (0 visual refs today) — comparative argument; live `[CLAIMS REVIEW]` + `[COI REVIEW]` governance surface
- `/why-dplat` (0)
- `/company` hub (0), `/company/about` (3), `/company/leadership` (5), `/company/careers` (3), `/company/contact` (3) — TSI section is a live `[COI REVIEW]` surface
- `/resources` (0)
- `/platform/integrations` (2)
- `/demo` (0)
- Folded audit items **P14-01** and **P14-02** (see D-05).

**NOT in scope:** the homepage hero (Phase 15), any homepage handoff/firewall files, new pages/routes, new nav items, new conversion actions, new design tokens, re-opening the homepage LCP budget, named clients/logos.
</domain>

<decisions>
## Implementation Decisions (recommended defaults — planner may refine per page)

### Scope & restraint
- **D-01 (lift over coverage):** Not every page needs a visual. Each target page gets a visual ONLY where it lifts the argument; pages where a visual would be decoration get motion-only (Reveal/Ambient) or nothing. Restraint beats blanket coverage. The researcher/planner makes the per-page call and justifies each as "lift, not decoration."
- **D-02 (reuse the on-main archetype library; build nothing new without a proven gap):** Compose from the existing `src/components/product/visuals/` archetypes (DataStory, Schematic, Console used sparingly) and motion primitives (Reveal, Ambient, Marquee, PartnerMap, the `dn-c2c` coast-to-coast map). ROADMAP guidance: "Mostly DataStory + Schematic + Reveal/Ambient." A NEW archetype component requires an explicit gap argument raised in planning (stop-list adjacent).
- **D-03 (CTA primacy):** One filled "Request a demo" CTA per band preserved; secondary actions stay ghost/text. No new or competing CTAs. Motion is additive and below the CTA in visual weight.

### Per-page starting hypotheses (planner confirms / overrides)
- **D-01a `/compare`:** a Schematic or DataStory that visualizes the comparative argument (e.g., capability matrix / time-to-production), NOT a decorative band. Comparative claims are `[CLAIMS REVIEW]` + need legal; competitor framing is `[COI REVIEW]`.
- **D-01b `/why-dplat`:** a supporting Schematic/DataStory or a Reveal/Ambient treatment on the existing argument bands.
- **D-01c `/platform/integrations`:** archetype consistent with the platform system (Schematic/network), no CTA competition.
- **D-01d `/demo`:** restrained Reveal/Ambient only; never compete with the form's submit CTA; pair with the P14-01/P14-02 form-a11y fixes.
- **D-01e `/company` set + `/resources`:** motion-where-it-lifts; the TSI ownership section on `/company`/`/about` stays a `[COI REVIEW]` surface and must not be visually obscured.

### Governance (live surfaces this phase)
- **D-04:** Any new caption/label is governed copy: voice rules (no em dashes, no banned phrases, sentence case, contractions, digits). `[CLAIMS REVIEW]` on any metric; `[COI REVIEW]` on any vendor/TSI framing. Real-shaped anonymized figures only; no invented clients/metrics/testimonials. Per the 2026-06 Andrew pre-clearance, tags inside `src/content/visuals/*.ts` are non-blocking for M6 visuals but stay for audit. The `/compare` comparative claims and `/company` TSI section are the two live governance surfaces; flag `[COI REVIEW]`/`[CLAIMS REVIEW]` in the PR.

### Folded audit items (in scope, raise in planning)
- **D-05a — P14-01 (a11y):** `DemoForm.tsx` (~369-378) — wire `aria-invalid` and `aria-describedby="{id}-error"` on fields with errors (the form-level error region is already correct).
- **D-05b — P14-02 (design/a11y):** Normalize form-input focus treatment (`DemoForm.tsx`, `HomepageHero.tsx`, `AttachedForm.tsx` use a 3px ring / border-color change instead of the spec's 2px `#9CB4E8` outline + 2px offset). EITHER normalize to the token outline OR document the input ring as an intentional pattern in DESIGN.md. Recommended default: document as intentional if normalizing regresses the attached-form pill aesthetic; planner decides. Note `HomepageHero.tsx` is Phase-13 firewall — if P14-02 must touch it, that change lands on `main`/its own track, NOT silently here; raise it.

### Gates (acceptance)
- **D-06:** Every elevated page keeps LCP < 2.5s, CLS < 0.1, INP < 200ms, passes axe-core (mobile-375 + desktop-1440), is added to the reduced-motion Playwright spec, and ALL existing Playwright specs stay green. Below-fold visuals lazy-load (`ssr:false` + skeleton matching the Phase 11/12 pattern). Content-route TBT ceiling is 300ms (regression detector; TBT is hydration-bound per AUDIT BL-07).
- **D-07 (sandbox):** `next dev`/`next start` hang here. Verify with `tsc --noEmit`, `eslint`, `next build`, `playwright test --list`; spec/axe/LHCI truth comes from CI on the PR.

### Stop-list (ask Connor, do not decide)
- Any new nav item, new conversion action, new color/type/spacing token, or a page not in the route map. A new archetype component (vs. composing existing ones).
</decisions>

<discretion>
## Claude's Discretion (planner/researcher decide)
- Exact archetype per page and the typed payload shape (consistent with the Phase 11/12 typed-payload pattern in `src/content/visuals/`).
- Which pages get visual vs. motion-only vs. nothing (the D-01 lift judgment).
- Whether P14-02 normalizes the focus ring or documents it as intentional.
- Lazy-skeleton box sizing to avoid CLS.
</discretion>
