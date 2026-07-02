# M5 Phase 9 — Definition-of-done walkthrough

This walks the CLAUDE.md §14 Definition-of-Done checklist for every route in the CLAUDE.md §9 route map (24 routes). It is a static-analysis + recorded-CI-evidence audit. No servers were run for this phase (sandbox `next dev`/`next start` hang, D-07); items that need a live render are marked as CI-gated or human-verify with the exact thing that would confirm them.

Audit branch: `phase-09-dod-walkthrough`, cut from `origin/phase-15-homepage-capstone` (final state: Phases 5-7, 10-15 + polish all merged). Generated 2026-07-02.

## Legend

- **Pass** — verified by static analysis or recorded CI evidence.
- **CI-gated** — the contract is wired and covered by a spec/gate that runs on CI against the Vercel preview; not run locally because the sandbox server hangs (D-07).
- **Human-verify** — needs Connor's eyeball on the production preview, or a named human's action (Andrew, Paul, Austin, Jeremiah).
- **Deferred** — intentionally out of scope for launch (analytics wiring, per Connor 2026-07-01).
- **Gap** — a real shortfall found by this audit; called out plainly.

## Cross-cutting evidence (applies to every route)

These contracts are enforced structurally or by an iterating spec, so they hold for all 24 routes rather than being re-proven per row.

- **One H1 / heading hierarchy.** Every non-home route renders its H1 through `PageHero` (`src/components/sections/PageHero.tsx:66`, single `<h1>`), used by 21 route components. The homepage renders its single `<h1>` in `HomepageHero.tsx:200`. No page component declares a second `<h1>`. One H1 per route is structural.
- **Primary CTA label.** "Request a demo" appears 48 times across `src/` and is the only conversion label. No competing CTA strings ("Talk to sales", "Get a quote", "Free trial", "Start free", "Download") are present. Secondary actions use "See how it works" / "Explore the platform" ghost/text treatments per CLAUDE.md §4.
- **Keyboard + axe.** `tests/a11y/axe-routes.spec.ts` iterates `VISUAL_ROUTES` (23 routes) and runs axe-core; `tests/a11y/demoform-aria.spec.ts` covers the demo form's ARIA. Runs on CI against the preview. Touch-target and reduced-motion nets (`tests/responsive/touch-targets.spec.ts`, `reduced-motion.spec.ts`, `reveal-fail-open.spec.ts`) also iterate `VISUAL_ROUTES`.
- **Responsive.** `tests/responsive/breakpoint-matrix.spec.ts` + `container-query-layouts.spec.ts` + `type-scale.spec.ts` + `touch-targets.spec.ts` exercise the 9 breakpoints in `tests/helpers/routes.ts` (320 → 1440 wide plus landscape). Page-specific responsive specs exist for the platform, solutions, handoff, hero, and Phase-14 elevated pages.
- **Analytics — Deferred (Connor, 2026-07-01).** This is a test site; Phase 6 (analytics wiring) is deferred. `src/lib/analytics.ts` `track()` no-ops safely: it returns early when `window` is undefined and otherwise only pushes to `window.dataLayer`. **Gap carried (P6-01):** no GTM container loader is injected in `src/app/layout.tsx`, so even after GA4/GTM IDs are provisioned, zero events reach GA4 until the loader is built. This is core ANALYTICS-01/02 scope, deferred by decision, not done.
- **COI / CLAIMS.** Cleared via Andrew Budish's 2026-06-12 complete sign-off. 134 `[COI REVIEW]` / `[CLAIMS REVIEW]` markers remain across 40 source files and **stay in source as the audit trail** — none were removed by this phase. The markers are non-blocking per the 2026-06 pre-clearance; they are not open gates.
- **LCP.** The LHCI Case C gate (`lighthouserc.json`, `throttlingMethod: devtools`, mobile 412x823, slow-4G + 4x CPU, 5 runs) enforces `/` LCP ≤ 2,300 ms (real H1 paint about 1,254 ms per STATE.md) and TBT ≤ 450 ms on `/`, TBT ≤ 300 ms on other collected routes, CLS ≤ 0.1 on the 4 platform deep-dive pages. **LHCI collects only 6 URLs** (`/`, `/platform/placement`, `/optimization`, `/issues`, `/reporting`, `/solutions/utilities`). The other 18 routes have **no per-route LHCI coverage**; they rely on the CLAUDE.md §12 budget being a shared-shell property plus the route-JS budget gate (`scripts/check-route-js-budget.sh`, ceiling 865,308 bytes). This is a coverage gap, noted per route below.
- **Visual review.** Pending Connor on the production preview. Per-route eyeball items are pulled from `13-UAT.md` (handoff/Console parity) and `14-VERIFICATION.md` (elevated text pages). Global items: hero finale Console crossfade, 4 handoff tabs cinematic parity, FeatureAccordion visuals, Phase-14 elevated pages, OG cards, Rich Results on `/` and `/demo`.

---

## Per-route walkthrough

Each row is one CLAUDE.md §14 checklist item. "Copy" = copy matches approved source. Cross-cutting rows (H1, CTA, keyboard/axe, responsive, analytics, COI/CLAIMS) reference the section above rather than repeating evidence.

### `/` — homepage (`content/pages/homepage.md` → `src/content/homepage.ts`, `homepage-hero.ts`)

| Item | Status | Evidence |
|---|---|---|
| Copy matches source | Pass | `src/content/homepage.ts` + `homepage-hero.ts` back the route; brief `content/pages/homepage.md` is the editorial source. |
| One H1 / hierarchy | Pass | `HomepageHero.tsx:200` single `<h1>`. |
| One primary CTA per band, "Request a demo" | Pass | See cross-cutting; homepage uses AttachedForm + FinalCTA. |
| Responsive | CI-gated | Full breakpoint matrix + hero mobile-video-free + finale-console specs. |
| Keyboard + axe | CI-gated | In `VISUAL_ROUTES`; axe + touch-targets + reduced-motion iterate it. |
| LCP < 2.5s | Pass (CI) | LHCI Case C hard gate on `/`: ≤ 2,300 ms devtools, real H1 ~1,254 ms; re-baselined on the Phase 15 PR green CI run. |
| Analytics | Deferred | See cross-cutting (P6-01 gap). |
| COI/CLAIMS | Cleared | Markers in `homepage.ts`, `homepage-hero.ts`, `stats.ts`; retained. |
| Visual review | Human-verify | Hero finale Console crossfade (`<Console bare data={handoffPlacementConsole}>` replaces retired `dashboard-dark.png`); 4 handoff tabs cinematic parity; FeatureAccordion paired visuals (13-UAT items 1-3). |

### `/platform` (`content/pages/platform.md` → `src/content/platform.ts`)

| Item | Status | Evidence |
|---|---|---|
| Copy matches source | Pass | `src/content/platform.ts`; brief `content/pages/platform.md`. |
| One H1 / hierarchy | Pass | `PageHero`. |
| CTA | Pass | Cross-cutting. |
| Responsive | CI-gated | `platform-mobile.spec.ts`, `platform-visuals.spec.ts`. |
| Keyboard + axe | CI-gated | In `VISUAL_ROUTES`. |
| LCP | Gap (no LHCI) | Not in the 6-URL LHCI list; relies on shared-shell budget + route-JS gate. |
| Analytics | Deferred | Cross-cutting. |
| COI/CLAIMS | Cleared | `platform.ts` markers (encryption detail at `platform.ts:151`) retained. |
| Visual review | Human-verify | Platform archetype visuals. |

### `/platform/placement` (`content/pages/placement.md`)

| Item | Status | Evidence |
|---|---|---|
| Copy | Pass | Brief `content/pages/placement.md`. |
| H1 | Pass | `PageHero`. |
| CTA | Pass | Cross-cutting. |
| Responsive | CI-gated | Platform specs + breakpoint matrix. |
| Keyboard + axe | CI-gated | `VISUAL_ROUTES`. |
| LCP | Pass (CI) | In LHCI 6-URL list; CLS ≤ 0.1 gate. |
| Analytics | Deferred | Cross-cutting. |
| COI/CLAIMS | Cleared | `visuals/placement.ts`, `placement-accordion.ts`. |
| Visual review | Human-verify | FeatureAccordion + Flagship explorable. |

### `/platform/optimization` (`content/pages/optimization.md`)

| Item | Status | Evidence |
|---|---|---|
| Copy | Pass | Brief. |
| H1 | Pass | `PageHero`. |
| CTA | Pass | Cross-cutting. |
| Responsive | CI-gated | Platform specs. |
| Keyboard + axe | CI-gated | `VISUAL_ROUTES`. |
| LCP | Pass (CI) | In LHCI list; CLS gate. |
| Analytics | Deferred | Cross-cutting. |
| COI/CLAIMS | Cleared | `visuals/optimization.ts`. |
| Visual review | Human-verify | Optimization archetype + Flagship. |

### `/platform/issues` (`content/pages/issues.md`)

| Item | Status | Evidence |
|---|---|---|
| Copy | Pass | Brief. |
| H1 | Pass | `PageHero`. |
| CTA | Pass | Cross-cutting. |
| Responsive | CI-gated | Platform specs. |
| Keyboard + axe | CI-gated | `VISUAL_ROUTES`; FIX-01 restored the IssuesWorklist status label at all widths. |
| LCP | Pass (CI) | In LHCI list; CLS gate. |
| Analytics | Deferred | Cross-cutting. |
| COI/CLAIMS | Cleared | `issues.ts`, `visuals/issues.ts` markers retained (this page carried a blocking COI flag pre-clearance). |
| Visual review | Human-verify | Worklist archetype. |

### `/platform/reporting` (`content/pages/reporting.md`)

| Item | Status | Evidence |
|---|---|---|
| Copy | Pass | Brief. |
| H1 | Pass | `PageHero`. |
| CTA | Pass | Cross-cutting. |
| Responsive | CI-gated | Platform specs. |
| Keyboard + axe | CI-gated | `VISUAL_ROUTES`. |
| LCP | Pass (CI) | In LHCI list; CLS gate. |
| Analytics | Deferred | Cross-cutting. |
| COI/CLAIMS | Cleared | `visuals/reporting.ts`, `handoff-reporting.ts`. |
| Visual review | Human-verify | Reporting dashboard archetype. |

### `/platform/integrations` (`src/content/integrations.ts`, authored from `.docx`)

| Item | Status | Evidence |
|---|---|---|
| Copy | Pass (deck-authored) | Authored directly from `DebtNext_Integrations_Page_Copy.docx`; no `content/pages/*.md` brief by design. |
| H1 | Pass | `PageHero`. |
| CTA | Pass | Cross-cutting. |
| Responsive | CI-gated | `14-page-elevation.spec.ts` covers `/platform/integrations` + breakpoint matrix. |
| Keyboard + axe | CI-gated | `VISUAL_ROUTES`; `PartnerMap.tsx` markers present. |
| LCP | Gap (no LHCI) | Not in LHCI 6-URL list. |
| Analytics | Deferred | Cross-cutting. |
| COI/CLAIMS | Cleared | `integrations.ts`, `visuals/integrations.ts`, `PartnerMap.tsx:46` (partner count) retained. |
| Visual review | Human-verify | Phase-14 elevation archetype; PartnerMap. |

### `/solutions` (`content/pages/solutions.md`)

| Item | Status | Evidence |
|---|---|---|
| Copy | Pass | Brief. |
| H1 | Pass | `PageHero`. |
| CTA | Pass | Cross-cutting. |
| Responsive | CI-gated | `solutions-visuals.spec.ts` + matrix. |
| Keyboard + axe | CI-gated | `VISUAL_ROUTES`. |
| LCP | Gap (no LHCI) | Hub route not in LHCI list (only `/solutions/utilities` is). |
| Analytics | Deferred | Cross-cutting. |
| COI/CLAIMS | Cleared | `solutions.ts`, `visuals/solutions-hub.ts` (page carried a blocking COI flag pre-clearance). |
| Visual review | Human-verify | Solutions hub visuals. |

### `/solutions/utilities` (`src/content/solutions-utilities.ts`, `.docx`)

| Item | Status | Evidence |
|---|---|---|
| Copy | Pass (deck-authored) | `DebtNext_Solutions_Pages_Copy.docx`. |
| H1 | Pass | `PageHero`. |
| CTA | Pass | Cross-cutting. |
| Responsive | CI-gated | `solutions-visuals.spec.ts`. |
| Keyboard + axe | CI-gated | `VISUAL_ROUTES`. |
| LCP | Pass (CI) | In LHCI 6-URL list (TBT ≤ 300 ms). |
| Analytics | Deferred | Cross-cutting. |
| COI/CLAIMS | Cleared | `visuals/solutions-utilities.ts`. |
| Visual review | Human-verify | Console + Schematic + Data-story per-industry. |

### `/solutions/financial-services` (`.docx`)

| Item | Status | Evidence |
|---|---|---|
| Copy | Pass (deck-authored) | `DebtNext_Solutions_Pages_Copy.docx`. |
| H1 | Pass | `PageHero`. |
| CTA | Pass | Cross-cutting. |
| Responsive | CI-gated | `solutions-visuals.spec.ts`. |
| Keyboard + axe | CI-gated | `VISUAL_ROUTES`. |
| LCP | Gap (no LHCI) | Not in LHCI list. |
| Analytics | Deferred | Cross-cutting. |
| COI/CLAIMS | Cleared | `visuals/solutions-financial-services.ts`. |
| Visual review | Human-verify | Per-industry visuals. |

### `/solutions/telecom` (`.docx`)

| Item | Status | Evidence |
|---|---|---|
| Copy | Pass (deck-authored) | `.docx`. |
| H1 | Pass | `PageHero`. |
| CTA | Pass | Cross-cutting. |
| Responsive | CI-gated | `solutions-visuals.spec.ts`. |
| Keyboard + axe | CI-gated | `VISUAL_ROUTES`. |
| LCP | Gap (no LHCI) | Not in LHCI list. |
| Analytics | Deferred | Cross-cutting. |
| COI/CLAIMS | Cleared | `visuals/solutions-telecom.ts`. |
| Visual review | Human-verify | Per-industry visuals. |

### `/solutions/fintech` (`.docx`)

| Item | Status | Evidence |
|---|---|---|
| Copy | Pass (deck-authored) | `.docx`. |
| H1 | Pass | `PageHero`. |
| CTA | Pass | Cross-cutting. |
| Responsive | CI-gated | `solutions-visuals.spec.ts`. |
| Keyboard + axe | CI-gated | `VISUAL_ROUTES`. |
| LCP | Gap (no LHCI) | Not in LHCI list. |
| Analytics | Deferred | Cross-cutting. |
| COI/CLAIMS | Cleared | `visuals/solutions-fintech.ts`. |
| Visual review | Human-verify | Per-industry visuals. |

### `/solutions/insurance` (`src/content/solutions-insurance.ts`, alpha-review plan)

| Item | Status | Evidence |
|---|---|---|
| Copy | Pass (deck-authored) | Added from 2026-06-04 alpha-review plan. |
| H1 | Pass | `PageHero`. |
| CTA | Pass | Cross-cutting. |
| Responsive | CI-gated | `solutions-visuals.spec.ts`. |
| Keyboard + axe | CI-gated | `VISUAL_ROUTES`. |
| LCP | Gap (no LHCI) | Not in LHCI list. |
| Analytics | Deferred | Cross-cutting. |
| COI/CLAIMS | Cleared | `visuals/solutions-insurance.ts`. |
| Visual review | Human-verify | Per-industry visuals. |

### `/solutions/healthcare` (`src/content/solutions-healthcare.ts`, alpha-review plan)

| Item | Status | Evidence |
|---|---|---|
| Copy | Pass (deck-authored) | Added from 2026-06-04 alpha-review plan. |
| H1 | Pass | `PageHero`. |
| CTA | Pass | Cross-cutting. |
| Responsive | CI-gated | `solutions-visuals.spec.ts`. |
| Keyboard + axe | CI-gated | `VISUAL_ROUTES`. |
| LCP | Gap (no LHCI) | Not in LHCI list. |
| Analytics | Deferred | Cross-cutting. |
| COI/CLAIMS | Cleared | `visuals/solutions-healthcare.ts`; HIPAA-adjacent copy carries a CLAIMS marker, retained. |
| Visual review | Human-verify | Per-industry visuals. |

### `/why-dplat` (`content/pages/why-dplat.md`)

| Item | Status | Evidence |
|---|---|---|
| Copy | Pass | Brief. |
| H1 | Pass | `PageHero`. |
| CTA | Pass | Cross-cutting. |
| Responsive | CI-gated | `14-page-elevation.spec.ts` (elevated) + matrix. |
| Keyboard + axe | CI-gated | `VISUAL_ROUTES`. |
| LCP | Gap (no LHCI) | Not in LHCI list. |
| Analytics | Deferred | Cross-cutting. |
| COI/CLAIMS | Cleared | `why-dplat.ts` (page carried a blocking COI flag + time-to-production CLAIMS range pre-clearance). |
| Visual review | Human-verify | PAGEVIS-02 supporting visual. |
| **Nav label** | **Human-verify (DOD-04)** | "Why dPlat" vs "Why DebtNext" is Connor's open call; current label ships unless changed. Would propagate through `src/content/nav.ts`, sitemap, breadcrumbs. |

### `/compare` (`src/content/compare.ts`, `.docx`)

| Item | Status | Evidence |
|---|---|---|
| Copy | Pass (deck-authored) | `DebtNext_Comparison_Page_Copy.docx`; BL-01 "digital journeys" reworded (confirmed absent). |
| H1 | Pass | `PageHero`. |
| CTA | Pass | Cross-cutting. |
| Responsive | CI-gated | `14-page-elevation.spec.ts` covers `/compare`. |
| Keyboard + axe | CI-gated | `VISUAL_ROUTES`. |
| LCP | Gap (no LHCI) | Not in LHCI list. |
| Analytics | Deferred | Cross-cutting. |
| COI/CLAIMS | Cleared | `compare.ts`, `visuals/compare.ts` (comparative claims + time-to-production ranges). Comparative claims also flagged for legal in the audit; non-blocking per pre-clearance, retained. |
| Visual review | Human-verify | DataStory comparative visual (PAGEVIS-01). |

### `/company` (`content/pages/company.md`)

| Item | Status | Evidence |
|---|---|---|
| Copy | Pass | Brief. |
| H1 | Pass | `PageHero`. |
| CTA | Pass | Cross-cutting. |
| Responsive | CI-gated | Matrix + `14-page-elevation` (company set elevated). |
| Keyboard + axe | CI-gated | In `VISUAL_ROUTES` (line 35). |
| LCP | Gap (no LHCI) | Not in LHCI list. |
| Analytics | Deferred | Cross-cutting. |
| COI/CLAIMS | Cleared | `company.ts` (TSI ownership section, encryption detail `company.ts:107`); page carried a blocking COI flag pre-clearance. |
| Visual review | Human-verify | Company visuals; TSI ownership section + link. |

### `/company/about` (`src/content/company-about.ts`, `.docx`)

| Item | Status | Evidence |
|---|---|---|
| Copy | Pass (deck-authored) | `DebtNext_Company_Pages_Copy.docx`. |
| H1 | Pass | `PageHero`. |
| CTA | Pass | Cross-cutting. |
| Responsive | CI-gated | Matrix. |
| Keyboard + axe | CI-gated | In `VISUAL_ROUTES` (line 36). |
| LCP | Gap (no LHCI) | Not in LHCI list. |
| Analytics | Deferred | Cross-cutting. |
| COI/CLAIMS | Cleared | `company-about.ts`. |
| Visual review | Human-verify | Elevated company page. |

### `/company/leadership` (`src/content/company-leadership.ts`, `.docx`)

| Item | Status | Evidence |
|---|---|---|
| Copy | Pass (deck-authored) | `DebtNext_Company_Pages_Copy.docx`. |
| H1 | Pass | `PageHero`. |
| CTA | Pass | Cross-cutting. |
| Responsive | CI-gated | Matrix. |
| Keyboard + axe | CI-gated | In `VISUAL_ROUTES` (line 37). |
| LCP | Gap (no LHCI) | Not in LHCI list. |
| Analytics | Deferred | Cross-cutting. |
| COI/CLAIMS | Cleared | `company-leadership.ts` (leadership tenures CLAIMS marker) retained. |
| **Titles/tenures** | **Human-verify** | Leadership titles/tenures/roles verification pending Paul Goske (gate 2). Named-person accuracy is not codebase-checkable. |
| Visual review | Human-verify | Elevated leadership page. |

### `/company/careers` (`src/content/company-careers.ts`, `.docx`)

| Item | Status | Evidence |
|---|---|---|
| Copy | Pass (deck-authored) | `.docx`. |
| H1 | Pass | `PageHero`. |
| CTA | Pass | Cross-cutting. |
| Responsive | CI-gated | Matrix. |
| Keyboard + axe | CI-gated | In `VISUAL_ROUTES` (line 38). |
| LCP | Gap (no LHCI) | Not in LHCI list. |
| Analytics | Deferred | Cross-cutting. |
| COI/CLAIMS | Cleared | No blocking markers specific to careers. |
| Visual review | Human-verify | Elevated careers page. |

### `/company/contact` (`src/content/company-contact.ts`, `.docx`)

| Item | Status | Evidence |
|---|---|---|
| Copy | Pass (deck-authored) | `.docx`. |
| H1 | Pass | `PageHero`. |
| CTA | Pass | Cross-cutting. |
| Responsive | CI-gated | Matrix. |
| Keyboard + axe | CI-gated | In `VISUAL_ROUTES` (line 39). |
| LCP | Gap (no LHCI) | Not in LHCI list. |
| Analytics | Deferred | Cross-cutting. |
| COI/CLAIMS | Cleared | No blocking markers specific to contact. |
| Visual review | Human-verify | Elevated contact page. |

### `/resources` (`content/pages/resources.md`)

| Item | Status | Evidence |
|---|---|---|
| Copy | Pass | Brief. |
| H1 | Pass | `PageHero`. |
| CTA | Pass | Cross-cutting. |
| Responsive | CI-gated | `14-page-elevation` + matrix. |
| Keyboard + axe | CI-gated | In `VISUAL_ROUTES` (line 40). |
| LCP | Gap (no LHCI) | Not in LHCI list. |
| Analytics | Deferred | Cross-cutting. |
| COI/CLAIMS | Cleared | `resources.ts` markers retained. |
| Visual review | Human-verify | PAGEVIS-03 resources visuals. |

### `/demo` (`content/pages/demo.md` → `src/content/demo.ts` + `DemoForm`)

| Item | Status | Evidence |
|---|---|---|
| Copy | Pass | Brief `content/pages/demo.md`. |
| H1 | Pass | `PageHero`. |
| CTA | Pass | The demo form IS the conversion; submit label consistent with "Request a demo". |
| Responsive | CI-gated | `14-page-elevation.spec.ts` covers `/demo` + matrix. |
| Keyboard + axe | CI-gated | `VISUAL_ROUTES` + dedicated `demoform-aria.spec.ts`; P14-01 wired `aria-invalid` + `aria-describedby` on errored fields. |
| LCP | Gap (no LHCI) | Not in LHCI list. |
| Analytics | Deferred | Form events (`form_start`/`form_submit`/`form_error`) call `track()` which no-ops; not reaching GA4 until P6-01 loader exists. |
| COI/CLAIMS | Cleared | `demo.ts`; `ContactPage` JSON-LD (`schema.ts`) markers retained. |
| **Form delivery** | **Human-verify (gate)** | `ZOHO_WEBHOOK_URL` not set in Vercel: the form fail-opens silently and drops leads until Austin Johnson provisions it. `RESEND_API_KEY` unset: confirmation email skipped until Connor provisions it. |
| Visual review | Human-verify | Elevated demo page; Rich Results Test on `/demo` (ContactPage JSON-LD). |

---

## DoD failures and gaps (the important part)

1. **LHCI route coverage is 6 of 24.** Only `/`, `/platform/{placement,optimization,issues,reporting}`, and `/solutions/utilities` have a per-route Lighthouse gate. The other 18 routes (all `/company/*`, all remaining `/solutions/*`, `/platform`, `/platform/integrations`, `/why-dplat`, `/compare`, `/resources`, `/demo`) have **no LCP/CLS/TBT gate**. They inherit the shared shell's budget and are bounded by the route-JS-size gate, but §14's "LCP under 2.5s on the Vercel preview's mobile test" is not directly enforced for them. Not a regression; a standing coverage limit. Recommend adding representative routes (one `/company/*`, `/compare`, `/demo`) to the LHCI URL list post-launch.

2. **P6-01 — no GTM loader (analytics dead-ends by decision).** `src/lib/analytics.ts` pushes to `window.dataLayer`, but nothing injects the GTM `<Script>` in `src/app/layout.tsx`. Every `track()` call (CTAs, form, accordion, scroll, video) is a safe no-op that reaches nothing. Analytics is **Deferred** per Connor 2026-07-01, so this is expected, not a bug — but it means "Analytics events fire correctly" is unmet on all 24 routes and must not be marked done. Fixing it is Phase 6 scope (build the loader, then Jeremiah provisions IDs).

3. **`/demo` lead capture fails open silently.** With `ZOHO_WEBHOOK_URL` unset, a real submitted lead is dropped with no error surfaced to the user. This is a launch-blocking operational gate (Austin Johnson), not a code defect — the fail-open is intentional — but it must be closed before any real traffic hits `/demo`.

4. **DOD-04 nav label undecided.** "Why dPlat" ships as-is unless Connor changes it. Not a defect; an open product decision.

5. **Human-only accuracy gates not codebase-checkable.** Leadership titles/tenures (Paul Goske) and named-client/logo consent (Andrew) cannot be verified by static analysis. Called out, not closed.

No copy-voice, CTA-discipline, brand-prohibition, H1, or heading-hierarchy failures were found. Those contracts hold across all 24 routes.
