# DebtNext alpha-review feedback — incorporation plan

**Date:** 2026-06-04
**Source:** Alpha review call with the DebtNext team (Connor, Paul Goske, Andy Hannan, Frank Ellenberger, Ryan Mirabedini) plus the platform-activity stat sheet Andy circulated.
**Owner:** Connor

## Guiding principles

These frame every decision below. When a feedback item conflicts with them, the principle wins.

1. **Feedback is advisory, not gospel.** The team's notes are input weighed against `DESIGN.md`, `.impeccable.md`, and the voice rules in `CLAUDE.md` — not instructions to apply blindly. Where their phrasing breaks a rule (see "Voice conflicts"), keep the intent and fix the form.
2. **Ship-ready ASAP.** Sequence so the site can go live within days. Product visuals stay "concept representations," never framed as the live UI. A coordinated rebrand/hub-launch moment (targeted Dec 12) is a later option, not a blocker.
3. **Recovery OS is introduced, dPlat stays.** Foreground "the operating system for enterprise recovery management" as a *concept/positioning layer*. Do **not** remove "dPlat" anywhere yet. A full rename waits on Connor's branding work.
4. **Service + speed is a key supporting narrative, not the lead.** It should be more visible than today and present on the homepage in some capacity, but the product/platform story stays primary.
5. **Facts and figures get reconciled site-wide.** The new numbers replace the old everywhere they appear and get sprinkled contextually on relevant pages, in addition to the dedicated scale band and marquee.

## Canonical data (single source of truth)

**Headline scale trio** (replaces every `60M+` instance):
- **116.8M** accounts managed
- **10B+** transactions processed
- **538** agency & legal partners

**Annual platform activity** (the marquee set):
- 250,000+ consumer disputes managed
- 300,000+ active promise plans managed
- 80M+ agency interactions processed
- 2M+ legal/collection documents delivered
- 18M+ payment transactions processed
- $1.9B+ transactional dollars managed

**Deliberately not featured:** the ~1.87M media-documents-processed figure. The team wants to stay out of the media space; do not lead with it.

**Old values being retired:** `60M+ accounts`, `$1.5B+ in payments annually` (→ `$1.9B+ transactional dollars managed`). `Since 2003 / 20+ years` stays true and remains.

## Part A — Cross-cutting narrative

### A1. Recovery OS positioning (additive)
Introduce **"The operating system for enterprise recovery management"** as the category line in heroes and on the homepage. dPlat remains the product name throughout. No removals.

- **Voice conflict:** the team's "DebtNext is *not just* workflow software... *it's* the operating system" is the banned "not X, it's Y" construction (`CLAUDE.md` §5). State it positively instead: *"DebtNext is the operating system for enterprise recovery management. It runs placement, vendor performance, disputes, promises, media, and compliance in one system."*

### A2. New scale numbers, two tiers
- Headline trio (116.8M / 10B+ / 538) anchors the scale band.
- Annual-activity set runs as a scrolling marquee ("inundate them with facts and figures").

### A3. Service + speed (supporting, woven throughout)
- **Service/people/expertise** (Ryan): "land with software, grow with services." Onshore team, platform + portfolio management teams, named methodology, decades of recovery experience.
- **Speed/nimbleness** (Andy): "we move as fast as you need." AEP onboarded in 25 days (multi-tenant); "if you got sued and had to be off a platform in a month, we'd do it." Big-when-needed, small-and-nimble-when-needed.
- Surfaces on the homepage as a supporting band, expanded on Why dPlat, reflected in the compare timelines, and dramatized in a launch case study. Kept secondary to the platform story.

## Part B — Page-by-page change map

| Page / file | Changes | Phase |
|---|---|---|
| **Homepage** (`homepage.ts`, `homepage-hero.ts`) | Scale trio + annual marquee; Recovery OS category line; a supporting service+speed band; keep liquidation placeholders; product visual stays a concept representation. | 0 (stats) / 1 (copy) / 2 (marquee, band) |
| **Why dPlat** (`why-dplat.ts`) | Remove the single-vendor-portal column from the options table; add the service/people/expertise section; add the nimble/speed narrative; correct years-in-recovery (team input, deferred). | 0 (column) / 1 (copy) / flag (years) |
| **Compare** (`compare.ts`) | Remove **C&R/Debt Manager** and **Finvi** rows (collections-focused; reframe Debt Manager as complementary, not a competitor); keep NeuAnalytics, Convoke, Symend, HighRadius; scrub their names from title/description/intro/prose; **add Imagine Cloud** (imagined.cloud — Ally uses it, appearing in RFPs); push competitor timelines out. | 0 (removals) / 1 (Imagine Cloud, timelines) |
| **Solutions** (`solutions.ts` + industry pages) | Broaden: add **Insurance** and **Healthcare/RCM** as plain verticals (no HIPAA gymnastics — we simply state DebtNext works for healthcare/RCM providers); add B2B/B2C "anyone managing receivables" framing modeled on TSI's industry-agnostic approach; add to nav. | 1 (copy) / 2 (new pages) |
| **Integrations** (`integrations.ts`) | Auto-scrolling logo marquee under the CTA; **add the "500+ collection partners integrated on the backend" call-out** (currently missing); credentializing logo-wall treatment. | 1 (copy) / 2 (marquee) |
| **Resources** (`resources.ts`) | Add an implementation/launch case study (AEP-style fast onboarding). Connor to supply developable content. | flag (content) / 2 (build) |
| **Leadership** (`company-leadership.ts`) | Correct years-in-recovery (team input). Jeremy already absent from content — no action. | flag (years) |

## Part C — New visual components

1. **US partner map** — ~700 animated pins, agencies one color / clients another, popping in. Homepage scale section and/or Why dPlat. Needs a data source (de-identified locations) and a `prefers-reduced-motion` fallback.
2. **Facts/figures marquee** — scrolling annual-activity numbers.
3. **Integrations logo marquee** — auto-scrolling partner logos under the CTA.

All three honor the accessibility floor (`CLAUDE.md` §11) and motion restraint (`DESIGN.md`).

## Part D — Sequencing

### Phase 0 — safe edits (this session)
Team-directed, low-risk, reversible:
1. Swap `60M+ accounts` → `116.8M+` and `$1.5B+ / in payments annually` → `$1.9B+ / transactional dollars managed` across: `homepage.ts`, `why-dplat.ts`, `compare.ts`, `integrations.ts`, `company.ts`, `company-about.ts`. Values only; no grid restructure.
2. `compare.ts`: remove C&R/Debt Manager and Finvi rows; scrub their names from title/description/intro/prose so the page stays coherent.
3. `why-dplat.ts`: remove the single-vendor-portal column (column entry + index-2 value in every row) and drop the phrase from the section body.

Explicitly **not** in Phase 0 (despite being mentioned): the time-to-production re-balancing (carries an existing `[CLAIMS REVIEW]`; handled in Phase 1 with Andrew), grid restructuring into the trio, and any naming/copy rewrites.

### Phase 1 — copy/strategy (planned, held for review)
Recovery OS concept line; service+speed copy; solutions broadening (Insurance, Healthcare/RCM, B2B/B2C); Imagine Cloud row (after research); annual-numbers copy; 500+ partners line; compare timeline re-balancing under `[CLAIMS REVIEW]`.

### Phase 2 — build
US partner map; facts/figures marquee; integrations logo marquee; new Insurance + Healthcare pages; implementation case study.

## Part E — Open items / flags (need the team)

- **Years-in-recovery** per leader — await real numbers; do not invent (`why-dplat.ts`, `company-leadership.ts`).
- **Case study content** — Connor to supply developable, de-identified material (AEP/fast-onboarding story).
- **Imagine Cloud** — product name + fair positioning. Source: https://imagined.cloud/ (cert error on automated fetch; research manually in Phase 1).
- **Recovery OS** — final naming commitment pending Connor's branding exercises. Until then, introduce the concept only; keep dPlat.
- **`[COI REVIEW]`** — any new solutions copy touching the dPlat↔recovery-vendor relationship.

## Voice conflicts to watch

- Banned "not X, it's Y" construction in the team's "DebtNext is not just... it's the operating system" framing (A1). Restate positively.
- No em dashes; sentence-case headings; digits for numbers; contractions. Apply to all new copy.
