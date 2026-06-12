---
description: Drive the remaining DebtNext build one phase at a time (plan → execute → verify → review), pausing at phase boundaries for Connor's review
argument-hint: [phase number, e.g. 12 — omit to auto-pick the next phase]
---

# /finish-build — one-phase build cycle

You are the build orchestrator for the DebtNext.com redesign. Each invocation of this command completes EXACTLY ONE phase end to end, then stops at the phase boundary for Connor's review. Never chain into the next phase automatically.

## Step 0 — Orient

1. Read `.planning/STATE.md` and `.planning/ROADMAP.md` to establish current position.
2. Read `.planning/AUDIT-2026-06-12.md` if it exists. Any open `fix-now` or `fold-into-phase-N` items assigned to the phase you're about to run become part of that phase's scope (raise them during planning, do not silently skip them).
3. If `$ARGUMENTS` names a phase, run that phase. Otherwise pick the next phase from this default order, skipping completed ones:

   **12 → 13 → 14 → 6 → 7 → 15 → 9**

   Sequencing constraints (do not violate):
   - Phase 13 requires Phase 11 complete (it is).
   - Phase 15 is genuinely last among M6 phases and double-gated on Phases 10–14 plus the M5 hero LCP gate staying green. Never run it before 12, 13, and 14 are done.
   - Phase 9 (DoD walkthrough + launch readiness) is the absolute last phase, after everything else including 15.
   - Phases 6 (analytics) and 7 (SEO) are independent and can be pulled earlier if Connor asks.
   - Phase 8 is SUPERSEDED by Phase 10. Never plan or execute it.

## Step 1 — Run the GSD cycle for the chosen phase

Run these skills in order, letting each complete before the next. The project's `.planning/config.json` already enables research, plan-check, verifier, and code review; do not bypass them.

1. `/gsd-discuss-phase <N> --auto` (skip if the phase already has CONTEXT/discussion artifacts)
2. `/gsd-plan-phase <N>`
3. `/gsd-execute-phase <N>`
4. `/gsd-code-review` then `/gsd-code-review-fix` if findings exist

Subagent model: **Opus** for all spawned agents (per global config). Announce each subagent spawn briefly.

## Step 2 — Phase-boundary close-out

After the cycle completes:

1. Confirm docs are in sync (STATE.md, ROADMAP.md, HANDOFF.md updated in the same commits as the code per the docs-in-sync rule). Re-check STATE.md frontmatter: gsd-tools clobbers the milestone label to `v1.0/milestone`; restore it to the correct milestone (M5/M6) if drifted.
2. Run the verification gates that work locally: `npx tsc --noEmit`, `npx eslint`, and the Playwright suite against a build/preview where feasible. NEVER run `next dev`/`next start` locally (they hang in this sandbox); use `next build` and Vercel previews instead.
3. Produce a phase-boundary report for Connor containing:
   - What shipped (plain English, one paragraph)
   - Test/gate status (Playwright count green/red, LHCI status, known pre-existing failures called out as such)
   - Human-verify items added this phase (UAT files under `.planning/phases/<phase>/`)
   - The updated launch punch list (human gates: Connor visual review, Andrew Budish COI/CLAIMS clearance, env var IDs from Jeremiah Benes / Austin Johnson, PR merge decisions)
4. **STOP.** Tell Connor the phase is complete and awaiting his review on the Vercel preview. Suggest the next phase but do not start it.

## Hard rules (never violate)

- Never merge to `main` or open a PR without Connor's explicit go-ahead.
- Never remove `[COI REVIEW]` / `[CLAIMS REVIEW]` markers; only Andrew Budish's clearance does that (the 2026-06 pre-clearance for M6 visual payloads makes them non-blocking, but the markers stay for audit).
- Never invent client names, metrics, or testimonials. Real-shaped anonymized figures only, per the pre-clearance.
- All CLAUDE.md rules apply in full (single "Request a demo" CTA, voice rules, DESIGN.md tokens only, WCAG 2.2 AA).
- If a decision arises from the CLAUDE.md §16 stop-list (new nav item, new conversion action, new color/type/spacing, page not in the route map), STOP and ask Connor instead of deciding.
- Commits: conventional format, `git -c commit.gpgsign=false commit`, Co-Authored-By footer per repo convention.
