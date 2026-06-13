# Product visuals: design system and placement map

This document captures the four homepage and platform-page product visuals designed for DebtNext.com. Each one shares a visual language so the site reads as a single composed system, not a collection of one-off mockups.

## Where each visual lives

| Visual | Primary placement | Reused on | Status flags |
|---|---|---|---|
| Command Center (hero) | Homepage hero, right column next to H1 | None (this is the marquee) | `[CLAIMS REVIEW]` on portfolio metrics |
| Decision Engine v2 | Homepage decision engine deep-dive | `/platform/placement` hero, `/platform/optimization` hero (with active tab forked) | Approved direction, content review with Paul |
| Issues Worklist | Homepage feature accordion (Issues item) | `/platform/issues` hero | `[COI REVIEW]` on CFPB language, `[CLAIMS REVIEW]` on SLA metrics |
| Reporting Dashboard | Homepage feature accordion (Reporting item) | `/platform/reporting` hero | `[CLAIMS REVIEW]` on percentages and trends |
| Integration Network | Homepage integration ecosystem section | `/platform` overview | `[CLAIMS REVIEW]` on $1.5B throughput and integration counts |

## The shared visual language

Every visual on the site follows the same construction so they read as a system:

**Canvas treatment**
- Background: `#171721` with a radial indigo bloom (rgba(82,102,235,0.10 to 0.14)) anchored at one or two points
- A faint 56px grid pattern with a radial mask that fades to transparent at the edges
- 16px border radius, 26px to 28px padding

**Card treatment**
- Linear gradient from `rgba(255,255,255,0.028)` to `rgba(255,255,255,0.008)`
- 1px border at `rgba(255,255,255,0.07)`
- Inset top highlight: `box-shadow: 0 1px 0 rgba(255,255,255,0.05) inset`
- Ambient shadow: `0 20px to 28px 40px to 50px -16px to -20px rgba(0,0,0,0.5)`
- 14px border radius, 22-24px padding

**Typography**
- Eyebrow labels: 10.5px, uppercase, 0.12em letter-spacing, color `#9CB4E8`, prefixed with a glowing 4px indigo dot
- Titles: 17px / 500 weight / -0.02em tracking, color `#EDEDF3`
- Subtitles: 12px, color `#8A8A91`
- KPI labels: 10.5px uppercase, 0.08em tracking, color `#8A8A91`
- KPI values: 17-18px / 500 weight / -0.022em tracking, with unit suffixes at smaller size
- Body: 11-13px with `-0.003em to -0.005em` tracking depending on size
- All numbers use `tabular-nums` for stable layout

**Color usage**
- Primary action: `#5266EB`
- Primary action gradient: `linear-gradient(135deg, #5266EB, #3949B5)`
- Primary glow color: `rgba(82,102,235, 0.5 to 0.85)` depending on intensity
- Focus / live state: `#9CB4E8`
- Success / positive delta: `#5BCB89`
- Warning: `#FFB86C`
- Breach / negative delta: `#E27676`
- Special category: `#BB86FC` (used for SCRA)
- Primary text: `#EDEDF3`
- Secondary text: `#C8C8D0`
- Tertiary text: `#8A8A91`
- Disabled / muted: `#6B6B7B`

**Motion vocabulary**
- Status pulse: 2.4s ease-in-out, scale 0.85 to 1.15, opacity 0.45 to 1
- State transitions: 1.6s `cubic-bezier(0.2, 0.7, 0.2, 1)`
- Event badge cycle: 14-16s ease-in-out (long dwell, brief appearance)
- Number shift: color tints to `#9CB4E8` during transition, returns to default
- Dash flow on connection lines: 3s linear, stroke-dashoffset animation
- Hub glow pulse: 4s ease-in-out, scale 1 to 1.08

**Universal rules**
- Every animation respects `prefers-reduced-motion`
- All numeric displays use `tabular-nums`
- Live indicators sit in the top-right of cards in a pill format with pulsing dot
- Event badges float in the top-right corner of canvas, not card
- Live action verbs lead activity feed entries with bold treatment

## Claude Code build approach

These visuals exist as preview mocks. For production, each becomes a real React component. The patterns repeat enough that you can write one parent prompt for the system, then individual prompts for each component.

### System-level prompt (run once before any component work)

```
We're building product visuals for DebtNext.com using a shared design system.
Before writing any product visual component, read these three files:

1. CLAUDE.md (operating contract)
2. DESIGN.md (visual system)
3. docs/product-visuals-system.md (this file)

Then, build the foundation primitives at src/components/product/primitives/:

- ProductCanvas.tsx — outer dark canvas with radial bloom and grid pattern
- ProductCard.tsx — glass card with inset highlight and ambient shadow
- EyebrowLabel.tsx — uppercase eyebrow with glowing dot prefix
- LiveStatus.tsx — pulsing dot in indigo pill (LIVE / CONNECTED / etc.)
- EventBadge.tsx — floating event notification with cycle animation
- MetricCell.tsx — KPI cell with label, value (with unit suffix), and delta
- StatPill.tsx — small inline metric pill (used in footers)

All primitives must:
- Accept className and forwardRef
- Honor prefers-reduced-motion via Framer Motion's useReducedMotion
- Use the shared color tokens from DESIGN.md
- Pass axe-core with no violations
- Be memo-wrapped (they appear repeatedly across the site)

After primitives are built and reviewed, build the five product visuals as 
composed components: CommandCenterPreview, DecisionEnginePreview, 
IssuesWorklistPreview, ReportingDashboardPreview, IntegrationNetworkPreview. 
Each uses the primitives above plus its specific composition.
```

### Component-level prompts

For each visual, the prompt follows the same template:

```
Build [COMPONENT NAME] at src/components/product/[ComponentName].tsx.

Reference: the visual in [chat URL or screenshot path].
Read: CLAUDE.md, DESIGN.md, docs/product-visuals-system.md.

# Composition

[Specific layout: outer canvas, card structure, content zones]

# Content

[All copy verbatim from the chat reference]
[All data values that appear in the visual]

# Animation behavior

[Specific animations with timings]
[Reduced-motion fallback for each]

# Props

interface [ComponentName]Props {
  [variant?: string]
  [interactive?: boolean]
  className?: string
}

# Acceptance criteria

- Renders at 320, 480, 768, 1024px container widths
- All numerics use tabular-nums
- Spring-eased value transitions where animation cycles state
- LCP impact under 5 points
- axe-core passes with no violations
- TypeScript strict, no any types
- Memo-wrapped if reused on a page
```

## What's still to design (in priority order)

These haven't been mocked yet but should be designed before the homepage hits content lock. Each is lower-stakes than the four above but still needs the same elevated treatment.

**Tier 1 (homepage and platform pages, must ship for M3)**

1. **Placement Management accordion visual** (homepage accordion item 1)
   Best approach: a forked Decision Engine view focused specifically on the placement matrix, showing tier-to-vendor allocation as a visual matrix.

2. **Optimization Engine accordion visual** (homepage accordion item 2)
   Best approach: forked Decision Engine with the "Optimization" tab active, showing the closed-pool performance comparison and the resulting allocation shift.

3. **Compliance & Audit accordion visual** (homepage accordion item 5)
   Best approach: a work standards configuration view with vendor compliance scores, showing exception conditions (deceased, bankruptcy, SCRA) surfacing automatically as a feed.

4. **Platform overview page hero** (`/platform` route)
   Best approach: a composed grid showing all 9 module cards as small previews, with one expanded to show structure. Like a system map.

**Tier 2 (supporting pages, M3 or M4)**

5. **Solutions page industry cards** (4 cards on `/solutions`)
   Best approach: 4 stylized industry-specific dashboard previews, each accented with a single subtle color shift away from pure indigo to differentiate (utilities, financial services, telecom, fintech).

6. **Why dPlat comparison table** (`/why-dplat`)
   Best approach: an interactive table with subtle motion as columns shift on hover, with dPlat's column accented in the indigo gradient.

7. **Differentiator cards** (3 cards on `/why-dplat`)
   Best approach: each card pairs with a small product visual (decision engine miniature, configuration screen miniature, integration network miniature).

**Tier 3 (atmospheric and content, M4 polish)**

8. **Homepage final CTA backdrop**
   Best approach: generated Midjourney atmospheric backdrop following the prompts in `docs/asset-and-animation-guide.md`.

9. **Company page hero backdrop**
   Best approach: generated atmospheric backdrop, less product, more architectural.

10. **Leadership headshots**
   Best approach: real studio photography (Gian to coordinate). No AI generation.

11. **Demo page composition**
    Best approach: split layout with form on left, three small product-visual thumbnails on right showing "what you'll see in the demo."

## Open questions before content lock

1. **Real dPlat screens**: should we go to Paul Goske and Frank Ellenberger to capture real (anonymized) screens that match these mockups? This is the single highest-impact authenticity move available. Hours of designer time can't replicate what 20 minutes with their actual UI provides.

2. **Customer logos**: the visuals use "Recovery partner A / B / C / D" placeholders. If we can get written consent from 3-5 customers to be named, the trust-band and proof sections become substantially more powerful.

3. **Performance claim review with Andrew**: every number in every visual needs Andrew's sign-off before any of these ships to production. Specifically: the $847.2M active inventory, 18.4% liquidation, 97.4% SLA adherence, $148.62 net-back, $1.5B throughput, and 60M+ accounts. These are all currently placeholder values. Andrew approves which can be referenced externally and with what framing.

4. **Animation budget**: the visuals carry significant motion (dash flow, pulses, state cycles, event badges, hub glow). Each is calm individually, but four of them on one page means the homepage hums. We should make a deliberate call about whether the homepage carries all four animated visuals or whether some pages get static treatments to manage the cumulative motion budget.

5. **Mobile treatment**: every visual needs a mobile composition. The 4-corner integration network in particular doesn't translate cleanly to a 375px viewport. Decisions needed: simpler 2-column layout, vertical stack with the hub at top, or a completely different mobile composition. This decision should happen before M2 build.

## What an agency would add next

If you wanted to keep ratcheting toward the absolute top tier, three things would land hardest:

1. **Real dPlat product screens** (anonymized). See open question 1.
2. **A custom monospace numeral cut** for the metrics. Inter is fine, but Söhne Mono or Berkeley Mono on the numerals specifically would be the move. Budget conversation, deferred per your call.
3. **Subtle ambient particle drift** in the canvas backgrounds. Three or four faint indigo points moving very slowly. Adds depth without parallax. Detailed in `docs/asset-and-animation-guide.md`.
