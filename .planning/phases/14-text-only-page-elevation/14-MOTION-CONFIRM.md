# Phase 14 motion-confirm record (PAGEVIS-03 reveal-coverage evidence)

**Authored:** 2026-07-01 (Plan 14-04, Task 2)
**Requirement closed:** PAGEVIS-03 — the `/company` set + `/resources` reveal coverage, closed **by confirmation, not omission**.
**Decision basis:** D-01 (a no-lift call is a deliberate recorded decision, not an omission), D-01e (`/company` set + `/resources` motion-where-it-lifts; TSI/COI section stays unobscured), D-03 (CTA primacy). Governed by the approved `14-ARCHETYPE-MAP.md` (the seven no-lift routes are recorded there; this doc is the per-route verification behind those calls).

This artifact records, per route, that the reveal coverage PAGEVIS-03 requires already exists (which section components animate, under which motion primitive) and that each no-lift call is deliberate. The operative discipline is D-01 restraint: most target pages correctly get **nothing new** because they already animate and a figure would be decoration.

## Ambient / motion substrate (verified this session)

Two independent motion layers cover these routes; PAGEVIS-03 is satisfied by both together:

1. **Section-level entrance motion** — `CardGrid`, `ProofBand`, `BulletList`, and `LeadershipTable` self-animate (fade-and-rise stagger) via `framer-motion` + the `@/components/product/motion` `staggerContainer` / `fadeUpItem` variants, each guarded by `useReducedMotion` (fail-open to final state). Verified by grep: `motion.ul` / `motion.li` / `motion.tbody` + `useReducedMotion` present in each.
2. **Ambient atmosphere** — `SectionContainer` auto-injects an `AmbientField` (particleCount 5, seeded, aria-hidden) + `CursorGlow` behind every dark / elevated-dark band by default (`showAmbient = surface !== "light"`), lifting content into a `relative z-10` layer. So every dark band on these routes already carries restrained ambient motion, reduced-motion-safe (static bloom), with no page-level wiring required.

`CaseStudyBand` is the one static band (no `framer-motion` import; verified). On `/resources` it still rides the SectionContainer ambient substrate and sits between two self-animating bands. The approved `14-ARCHETYPE-MAP.md` recorded **"nothing new"** for `/resources` (a resource-card DataStory would repeat the card copy, decoration risk), so no `RevealSection` wrap is added; this is recorded here as the deliberate no-lift call, not an omission.

## Reveal-coverage verification

| Route | Section components (self-animate via product/motion?) | Ambient substrate (SectionContainer default)? | Page-level `RevealSection`? | Decision | Rationale |
|---|---|---|---|---|---|
| `/company` (hub) | `CardGrid` ✅, `ProofBand` ✅, `BulletList` ✅ (all self-animate) | ✅ dark/elevated bands carry ambient | None (not needed) | **No-lift / Reveal-only (already present)** | Hub sections already animate; the TSI ownership band (`surface="elevated-dark"`) must stay unobscured (D-01e, §6). A page-level wrap or archetype would be decoration against a live COI surface. No code edit. |
| `/company/about` | prose + TSI/COI block | ✅ | `RevealSection` ×1 wraps the TSI/COI ownership block | **No new visual** | TSI ownership already wrapped in `RevealSection` (verified: import + `<RevealSection>` at the ownership block). The reveal is fail-open under reduced motion, so the disclosure is never hidden. Do not double-wrap (Pitfall 3). |
| `/company/leadership` | `LeadershipTable` ✅ (self-animates) | ✅ | `RevealSection` ×2 | **No new visual** | Reveal ×2 + `LeadershipTable` stagger already present; confirmed coverage, no archetype. |
| `/company/careers` | prose sections | ✅ | `RevealSection` ×1 | **No new visual** | `RevealSection` ×1 already present; confirmed, no archetype. |
| `/company/contact` | prose + form | ✅ | `RevealSection` ×1 | **No new visual** | `RevealSection` ×1 already present; confirmed, no archetype. |
| `/resources` | `CardGrid` ✅ (self-animates); `CaseStudyBand` ⛔ (static, no framer) | ✅ dark/elevated bands carry ambient | None (not needed) | **No-lift / Reveal-only (already present)** | `CardGrid` self-animates; `CaseStudyBand` is static but rides the ambient substrate and sits between animating bands. Approved map recorded "nothing new" (a resource-card DataStory repeats card copy, decoration risk). No `RevealSection` added. Recorded as a deliberate no-lift; if a future phase wants entrance motion on `CaseStudyBand` it is a single non-self-animating block that could take one `RevealSection` wrap without a Pitfall-3 conflict. |

**Result:** all 6 routes carry restrained motion today (section-level entrance and/or ambient substrate). Zero new archetypes and zero new `RevealSection` wraps were required; PAGEVIS-03 is closed by verified confirmation.

## TSI / COI non-obstruction check

The TSI ownership disclosure is **not** visually buried or reframed by any motion or visual (§6, D-01e):

- **`/company` hub:** the TSI ownership section is a plain `SectionContainer surface="elevated-dark"` with the eyebrow, heading, ownership paragraphs, and the outbound TSI link. No archetype, no overlay, no heavy motion sits on it. The default ambient field is a low-opacity aria-hidden layer behind `relative z-10` content; it does not obscure or recolor the disclosure copy or the link. No archetype was added to the hub precisely to keep this surface clean.
- **`/company/about`:** the ownership block is wrapped in `RevealSection`, which is fade-and-rise on entrance and **fail-open** under `prefers-reduced-motion` (returns children at final state). The disclosure is always fully legible; nothing hides it.
- **No new copy** was authored on any `/company` page in this plan, so the ownership language is unchanged.

## Pitfall-3 guard (no double-wrapped self-animating section)

No already-self-animating section (`CardGrid`, `ProofBand`, `BulletList`, `LeadershipTable`) was wrapped in a `RevealSection` by this plan. This plan added **zero** `RevealSection` wraps to `src/app/company/page.tsx` or `src/app/resources/page.tsx` (both files unchanged). The existing `RevealSection` uses on `/company/about`, `/leadership`, `/careers`, `/contact` wrap prose / TSI blocks, not self-animating section components. No stacked reveals introduced.

## Code-edit summary

- `src/app/company/page.tsx`: **unchanged** (approved map: no-lift, and the file already carries section-level + ambient motion).
- `src/app/resources/page.tsx`: **unchanged** (approved map: nothing new).
- Only artifact authored: this file (`14-MOTION-CONFIRM.md`).

The `files_modified` frontmatter for this plan lists `company/page.tsx` and `resources/page.tsx` only in case the approved map had called for a page-level Reveal-only wrap. The map recorded "nothing new" for both, so no edit was made — recorded here per the plan's Task 2 instruction.
