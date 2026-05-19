# DebtNext.com — v1 marketing site

Production rebuild of debtnext.com using a Mercury-style dark-canvas aesthetic. Built to surface dPlat, DebtNext's recovery management software platform.

## What's in this starter

| File | Purpose |
|---|---|
| `CLAUDE.md` | Operating contract for Claude Code. Read this first every session. |
| `DESIGN.md` | (Place at root) Visual design system. The Mercury-style spec from the source materials. |
| `docs/content-map.md` | Page-by-page index: routes, content sources, approvers, status flags. |
| `content/pages/*.md` | Approved copy for each v1 page. MDX-ready. |

## What still needs to land in the repo before first run

1. `DESIGN.md` (copy from source materials into the project root).
2. `source-materials/dPlat_Solution_Overview_v04232026.pptx`.
3. `source-materials/DebtNext_entries.xlsx`.
4. `.env.local` with: `NEXT_PUBLIC_GA4_ID`, `ZOHO_WEBHOOK_URL`, `RESEND_API_KEY`.
5. Logo and wordmark assets (Gian to provide; dPlat brand mark, not the TSI mark).

## Initial bootstrap (Claude Code session 1)

```bash
# In an empty directory:
# 1. Drop this starter in
# 2. Add DESIGN.md and source-materials/ from your local files
# 3. Tell Claude Code:
"Read CLAUDE.md, then DESIGN.md, then docs/content-map.md.
Initialize a Next.js 15 + TypeScript + Tailwind v4 + shadcn/ui project
following the tech stack defined in CLAUDE.md section 2. Set up tokens
from DESIGN.md section 5. Do not write page content yet. Stop after
the foundation milestone (tokens, app shell, header, footer, base
typography) and let me review the Vercel preview."
```

## Build phases

| Phase | Scope | Stop and review with |
|---|---|---|
| M1: Foundation | Tokens, app shell, header, footer, type system | Connor (visual review on Vercel preview) |
| M2: Hero + structure | Homepage hero, feature accordion, all section primitives | Connor + Gian |
| M3: Content + proof | All pages from content/pages/ wired up, demo form integrated | Connor + Andrew Budish + Paul Goske |
| M4: Polish | Responsive, a11y, performance, analytics, SEO | Connor + final stakeholder review |

## Approval gates before public launch

- COI-flagged content reviewed by Andrew Budish, Joe Laughlin, Michael Orefice
- Performance claims reviewed by Andrew Budish
- Product accuracy reviewed by Paul Goske, Rob Novosel, Frank Ellenberger
- Demo form fields and Zoho integration validated by Sarah Sanchez-Anderson and Austin Johnson

See `docs/content-map.md` for the per-page approval requirements.
