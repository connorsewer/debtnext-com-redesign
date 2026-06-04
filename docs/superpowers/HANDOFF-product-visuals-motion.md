# Handoff: build premium motion for the product visuals

**For a fresh session.** Everything you need is committed. Execute the plan inline.

## What's already done
- The 5 homepage product visuals (Placement, Optimization, Issues, Reporting, Compliance) are **built and live in production** (`debtnext-website.vercel.app`, "How it works" section). They render correctly but are mostly static.
- This task adds **calm choreographed entrance motion + quiet ambient life** to all 5.

## Read these first (in order)
1. `docs/superpowers/specs/2026-06-04-product-visuals-motion-design.md` — the approved design.
2. `docs/superpowers/plans/2026-06-04-product-visuals-motion.md` — the 9-task implementation plan with complete code.
3. `CLAUDE.md` §3/§5/§11/§12 (brand, voice, a11y, perf) and `DESIGN.md` motion notes.

## How to execute
- Inline, using `superpowers:executing-plans`. Work the 9 tasks in order; commit per task.
- **Branch:** `product-visuals` (this is what production `main` was fast-forwarded from). Stay on it; push to `main` only at the final deploy step.

## Critical environment reality (do not fight it)
- **The Next server does not run in this sandbox.** `next dev`, `next start`, and `next build` all hang and never bind a port. `tsc` is also very slow. Do NOT try to run/build/test locally.
- **Verification = Vercel deploy + Chrome MCP**, exactly as the plan's "Verification reality" section and Task 9 describe:
  - Push → poll the Vercel deployment with the Vercel MCP (`list_deployments` / `get_deployment` / `get_deployment_build_logs`).
  - **projectId** `prj_Q8Wbxa2ioco7n2MogdHnPpL0MmRP`, **teamId** `team_QQQGyy2SXClIUvYF2FVNSk0H`.
  - Pushing `product-visuals` → preview build. Pushing `product-visuals:main` → production (public URL, no auth).
  - Visually verify with the Chrome MCP (`list_connected_browsers` → `tabs_context_mcp` → `navigate`/`computer`) against the live URL.
- This is captured in memory: `project_next_server_hangs_in_sandbox`.

## Gotchas the plan already accounts for (don't relearn the hard way)
- `next/dynamic` options must be an **inline object literal** under Turbopack (not an extracted const).
- `FeatureAccordion` is shared by `/platform/*` pages — the product visuals are id-guarded (`isAccordionVisualId`); don't un-guard them.
- Keep `color-mix(...)` in inline `style`, not Tailwind arbitrary classes.
- All metric values are `[CLAIMS REVIEW]` placeholders; `[COI REVIEW]` on Issues/Compliance CFPB language. Don't change the copy/numbers.

## Definition of done
All 5 visuals choreograph in on scroll-into-view (bars grow, charts draw, numbers count, rows cascade), settle to the existing ambient pulses, and render final-state instantly under `prefers-reduced-motion`. Vercel production build READY, verified live via Chrome MCP.
