# Session handoff — 2026-07-04 (audit-backlog execution, updated)

Fresh session: read this + `.planning/CONTENT-SEO-GEO-AUDIT-2026-07-03.md` (the backlog) first. GitHub is authoritative; reconcile git/worktrees/gh before acting.

## Open PRs (never merge; Connor reviews)
- #34 fix/audit-severity-a — severity-A claim fixes (HITRUST/SOC2/roster). DONE.
- #35 feat/footer-legal-pages — 4 legal pages. DONE (built from prior session's worktree; [LEGAL][CLAIMS]).
- #36 fix/recovery-terminology — 7 "recovery" ambiguity fixes + CLAUDE.md §5 house rule + Title Case exception + .impeccable.md sync. DONE. New homepage H1: "Run your entire recovery vendor network from one platform."
- feat/seo-technical — PR B IN FLIGHT (agent running in MAIN TREE): per-route OG, titles/descriptions, breadcrumb/org/contact schema, robots AI allow-list, sitemap dates, llms.txt, not-found.tsx, footer Resources collapse. Merge order: #35 before this one (nav.ts conflict expected).

## Update (later 2026-07-04)
- #37 feat/seo-technical DONE (built clean). #38 feat/new-pages DONE (glossary, 5x /compare/[competitor], /pricing, /services; built clean). #39 feat/content-geo OPEN, PARTIAL — first agent finished areas 1, 2-partial (platform+compare FAQs), 3-partial, 5, 6-partial, 7 (contact channels wired), 9; a CONTINUATION agent is running in the MAIN TREE finishing: 6 industry FAQ bands, homepage stats-in-prose, de-clone utilities/insurance/healthcare, remaining final-CTAs, leadership.ts single-sourcing (resume note: session scratchpad PROGRESS.md).
- Mapping doc APPROVED; NO legacy figures ever; contact channels OK; implementation timeline = "6 to 9 months" per compare.ts.
- After #39: PR D = nav/sitemap wiring for new pages, lateral sibling cross-links, ~130 legacy 301s in next.config per mapping doc. Merge order: #35 → #37 → #36 → #39 → #38 → D.

## PR D — DONE (2026-07-04)
- **feat/wiring-redirects** (stacks everything; MERGE LAST). Built off feat/content-geo, then merged feat/seo-technical + feat/new-pages — both merged clean, NO conflicts (nav.ts/sitemap.ts already reconciled by the earlier merge order in the base branches).
- Delivered: sitemap entries for /resources/glossary, /pricing, /services + 5 /compare/<competitor> (competitors priority 0.6, others 0.7, lastModified 2026-07-04); footer links (Services + Pricing under Platform, Glossary under Resources — no new header nav items); lateral cross-links on all 4 capability pages + 6 solution pages + resources/services/why-dplat (via existing PageHero secondaryCta slot — no new render mechanism); legacy 301s in next.config.
- **Redirect counts:** 13 legacy pages + 11 category literals + 4 notable posts = 28 literal redirects; 4 pattern/wildcard routes (/blog/:slug*, /category/:slug*, /author/:slug*, and the /blog literal). The ~106 root-level WP posts collapse to /resources via their category-archive redirects (root /:slug wildcard was NOT used — it would shadow real routes; verified zero collisions).
- **Redirect deviations from mapping doc (cleared):** implementation-2-2-2 + professional-services-2 → /services (doc's interim /platform superseded now that /services ships); /privacy-policy → /company/about (no /privacy route built yet).
- **FINAL MERGE ORDER: #35 → #37 → #36 → #39 → #38 → D.** PR D's diff shrinks as the upstream PRs merge (it contains their commits until then).

## Remaining post-merge items
- **Consent banner / GA4 + GTM** at launch (in scope per footer/resources decisions; not built).
- **RSC re-architecture** — homepage mobile TBT is hydration-bound (~318ms); real fix is Server Component conversion, not JS-size cuts.
- **Blog + case-study buildout** — /resources is a v1 placeholder; the 106 legacy posts + case studies currently all collapse to /resources. Build distinct libraries, then split the collapsed footer Resources group and retarget post-specific redirects (SOC 2 posts may hold backlinks).
- **Retarget /privacy-policy redirect → /privacy** once the legal route ships (currently → /company/about).
- **Contact-point disclosure ruling** still open (org.ts asserts none; legacy publishes address/phone/fax/emails).

## Remaining plan
- PR C feat/content-geo (branch OFF fix/recovery-terminology, run in main tree AFTER PR B frees it): FAQ component + FAQPage schema (/platform, /compare, 6 industries; seed from legacy FAQs), definition blocks, stats-in-prose, de-clone utilities/insurance/healthcare, de-dup why-dplat/compare (services story → new implementation-and-services page), vary final-CTA template, careers CTA → "Get in touch" → /company/contact, single-source leadership+stats, tighten soft phrases (report §2 item 9-10), new pages: glossary, /compare/[competitor] (from compareMatrix ONLY — corpus has nothing on those competitors), /pricing (honest quote-based answer), implementation-and-services.
  GATE: Connor must review `.planning/LEGACY-SITE-MAPPING-2026-07-04.md` before PR C content ships (doc sent 2026-07-04; not yet approved).
- PR D: sitemap entries + nav/footer links for new pages, lateral sibling cross-links, 301 redirects in next.config for all ~130 legacy URLs per the mapping doc.

## Grounding docs
- `.planning/TSI-CORPUS-RECON-DIGEST-2026-07-04.md` — corpus facts, glossary file paths, canonical-numbers rulings (site stats.ts WINS), SoftwareApplication featureList.
- `.planning/LEGACY-SITE-MAPPING-2026-07-04.md` — legacy URL mapping, contact info (Copley OH address, 330.665.0400, sales/info/careers@debtnext.com), 16 verbatim FAQs, Boost=webinars→/resources playbooks.
- OPEN CONFLICT for Connor/Andrew: implementation timeline — legacy site "90-120 days" vs compare.ts "6 to 9 months".
- Contact page fix (org.ts + /company/contact real channels) goes in PR C/D after Connor rules on contact-point disclosure (open question in mapping doc).

## Environment (hard-won)
- NEVER next dev/start. `npm run build` TS phase OOM-kills (8GB machine): try once with NODE_OPTIONS=--max-old-space-size=6144, verify via .next/BUILD_ID, else CI is authoritative.
- Worktree checkouts take >5 min (background them); fresh worktrees lack node_modules. Main-tree sequential execution is the working pattern.
- Long git timeouts; never `git add -A` (untracked .planning files); `gh pr update-branch` not `gh run rerun`; agents: "do NOT spawn subagents".
- Duplicate-agent hazard: session restarts can resurrect pre-restart agents — before launching a replacement, check for a surviving twin (two footer agents collided today; PR #35 was created by one of them).
