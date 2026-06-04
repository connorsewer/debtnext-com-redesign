# Multimodal image model prompt library: dPlat

This library assumes a state-of-the-art multimodal image model that renders text and UI accurately and photorealistically. The prompting method here is different from the Midjourney library (`docs/midjourney-prompts.md`). Use this one when working with a text-capable model.

## The method in one line

Write a build spec, not a scene. Quote every text string. State every number. Describe every layout zone spatially. Give every color a hex value. The longer and more structured the prompt, the better the result.

## Why this works

Text-capable models render the text you provide and invent the text you omit. Invented text is where wrong numbers and nonsense labels appear. So you quote everything that must be correct. You also describe layout explicitly, because "a dashboard with some metrics" gives the model latitude to guess, while "a row of exactly four metric cells reading X, Y, Z, W" does not.

## The strongest technique: reference anchoring

These models accept input images. This beats any text prompt for UI work.

1. **Component screenshot to photorealistic finish.** Build the React component (even rough), screenshot it, feed it in, ask the model to render a pixel-perfect photorealistic version with specific finishing refinements, instructing it to keep all text and numbers exactly as shown. The model finishes what you built instead of inventing it.

2. **Brand board to lock palette and type.** Feed one image containing your hex swatches and type specimens. The model holds them across a series.

3. **Approved image to lock series style.** Once you generate a hero you love, feed it as a style reference on every later generation. This is the reliable equivalent of Midjourney's `--sref`.

## The refinement loop

Do not one-shot. Iterate conversationally:

```
[initial spec or reference image]
"Move the SLA column to the right edge, right-align values, make the breaching
 timer red (#E27676) with a glowing dot."
"Halve the eyebrow label size. Third metric delta should be green not gray."
[locked]
```

## Shared design tokens (paste into any prompt)

```
Background: near-black #171721 with a faint indigo radial glow and subtle grid texture
Card surface: dark glass, gradient around #1B1B27, 1px low-opacity light border,
  soft inset top highlight, deep ambient shadow, 14px rounded corners
Primary accent: #5266EB (gradient to #3949B5)
Live / focus accent: #9CB4E8
Positive / success: #5BCB89
Warning: #FFB86C
Breach / negative: #E27676
Special (SCRA): #BB86FC
Text primary: #EDEDF3   secondary: #C8C8D0   tertiary: #87878E   muted: #6B6B7B
Type: Inter or clean geometric sans-serif, tight heading letter-spacing, tabular numerals
Always: no browser chrome, no cursor, no people, no photographs, no logos beyond
  specified wordmarks, no invented UI elements, pixel-sharp legible text,
  photorealistic screen-capture quality
```

## Product visual spec-prompts

Each prompt below is complete. Open with the frame, paste the shared tokens, then the layout. Stated aspect ratio is a starting point.

### 1. Command center (homepage hero)

```
A photorealistic high-resolution screenshot of a premium financial software
dashboard as a single floating card. [shared tokens]

Layout top to bottom:
- Uppercase eyebrow in #9CB4E8 "PORTFOLIO OVERVIEW" with a small glowing indigo dot.
- Header row. Left: white title "All clients", gray subline "Last 30 days · 27
  vendors reconciled · 14 portfolios active". Right: pill with glowing dot, text "LIVE".
- Four metric cells, each with tiny gray uppercase label, large white value, small
  green delta:
  "ACTIVE INVENTORY" / "$847.2M" / "▲ $12.4M vs prior"
  "IN TREATMENT" / "142,837" / "▲ 8,402 accounts"
  "LIQUIDATION · 30D" / "18.4%" / "▲ 2.1pt vs prior"
  "NET-BACK · AVG" / "$124.62" / "▲ $3.84 vs prior"
- Chart panel. Inner header "30-day liquidation trend" left, "Latest 18.4%" right
  in indigo. Smooth indigo area-fill line chart trending gently upward, gradient
  fill fading down, glowing dot with white center at the right end.
- Activity section. Header "Recent activity" left, "View all 142" right in indigo.
  Three rows with small indigo square icons, text, gray timestamp:
  "Placement run · 1,847 accounts · partner network · tier Primary" / "2 min ago"
  "Reconciled · Recovery partner A · $342K processed · 8,420 accounts" / "11 min ago"
  "Pool closed · Q4 primary inventory · optimization queued" / "38 min ago"
- Floating in the top-right of the background (outside the card): glass pill with
  glowing dot "147 placements · last hour".
16:10.
```

### 2. Decision engine (placement deep-dive)

```
A photorealistic screenshot of a placement-rules configuration card. [shared tokens]

Layout:
- Eyebrow "DECISION ENGINE" with glowing dot.
- Tab strip: "Placement rules" (active, with indigo underline), "Optimization",
  "Audit log".
- Header. Title "Treatment tier · Primary", subline "Vendor pool: National network
  · 1,847 active". Right: "LIVE" pill with glowing dot.
- Three vendor rows, each with a small indigo gradient chip, a name, a thin
  indigo allocation bar with a glowing dot at its end, a right-aligned percentage,
  and a small colored delta:
  "Recovery partner A" / bar 45% / "45%" / green "+2"
  "Recovery partner B" / bar 35% / "35%" / gray "+0"
  "Recovery partner C" / bar 20% / "20%" / red "-2"
- Two metric tiles: "Closed pool liquidation" "17.4%" with an 8-bar sparkline,
  rightmost bar solid indigo; "Net-back per account" "$148.62" with green
  "▲ $4.18 vs prior pool".
- Footer: "Last reconciliation 04:00 today", green "All vendors current", indigo
  "Engine v4.2".
- Floating top-right glass pill: "Pool closed · Reallocating".
4:3.
```

### 3. Issues worklist

```
A photorealistic screenshot of an issue-management worklist. [shared tokens]

Layout:
- Eyebrow "ISSUES MANAGEMENT".
- Header. Title "Active worklist", subline "Across portfolios · sorted by SLA
  proximity · auto-routed". Right: pill "247 open · 38 escalated".
- Filter pill row: "All 247" (active), "Disputes 94", "Bankruptcy 52", "SCRA 18",
  "Compliance 31", "Deceased 12".
- Five issue rows. Each: a colored type chip, a monospace issue ID and masked
  account, a description, an assignment, and a right-aligned SLA timer with a
  colored dot and a small uppercase status:
  green chip "DISPUTE" / "ISS-48291 · Acct ··· 8472" / "Consumer disputes balance
    after settlement, requests itemization" / "Assigned to Partner A" / green
    "4h 12m" "On time"
  red chip "BANKRUPTCY" / "ISS-48287 · Acct ··· 1294" / "Chapter 7 notice received
    from PACER feed, auto-recall pending" / "Routing to recall" / amber "1h 38m"
    "Warning"
  purple chip "SCRA" / "ISS-48284 · Acct ··· 9038" / "Active duty status confirmed,
    interest rate cap applied, agency notified" / "Resolved by Engine" / green
    "Auto" "Resolved"
  amber chip "COMPLAINT" / "ISS-48276 · Acct ··· 5621" / "CFPB complaint received,
    response draft routed to compliance review" / "Assigned to Compliance" / red
    glowing "14m" "Breaching"
  green chip "DECEASED" / "ISS-48268 · Acct ··· 2847" / "SSA death index match
    confirmed, treatment suspended, estate workflow" / "Resolved by Engine" /
    green "Auto" "Resolved"
- Three metric tiles: "SLA adherence · 30D" "97.4%" green "▲ 1.8pt"; "Avg
  resolution time" "3.2h" green "▼ 0.4h vs prior"; "Auto-resolved · 30D" "64%"
  gray "8,247 of 12,891".
16:10.
```

### 4. Reporting dashboard

```
A photorealistic screenshot of an executive reporting dashboard. [shared tokens]

Layout:
- Eyebrow "REPORTING · EXECUTIVE VIEW".
- Header. Title "Portfolio performance", subline "All portfolios · refreshed 04:00
  today · feeding Power BI". Right: range tabs "7D", "30D" (active), "90D", "YTD".
- A 2x2 grid of panels:
  Panel 1 "Liquidation by treatment tier" with green "▲ 2.1pt", four labeled
    horizontal bars: "Pre-collect" "28.4%", "Primary" "18.4%", "Secondary"
    "11.2%", "Tertiary" "6.4%".
  Panel 2 "Net-back · 12 months" with green "▲ $11.40", a smooth indigo area-fill
    line chart rising left to right, glowing end dot, x-axis labels "Jun '25" and
    "May '26".
  Panel 3 "Top vendors · liquidation", ranked rows: "01 Recovery partner A /
    Primary · 8,420 accounts / 22.8%", "02 Recovery partner D / Pre-collect ·
    12,847 accounts / 20.1%", "03 Recovery partner B / Primary · 6,290 accounts /
    18.6%", "04 Recovery partner C / Secondary · 4,108 accounts / 14.2%".
  Panel 4 "SLA adherence · 30D" with green "▲ 1.8pt", a large "97.4%", subline
    "Target 95.0% · exceeded", and a 7-bar sparkline with the last bar solid indigo.
- Footer: "Next refresh 04:00 tomorrow", "Power BI feed active" (active in green),
  indigo "Live" with glowing dot.
16:10.
```

### 5. Integration network

```
A photorealistic rendering of a network architecture diagram. [shared tokens]

- Centered glowing circular hub of concentric rings with a solid indigo gradient
  inner circle carrying the white lowercase wordmark "dPlat", surrounded by a soft halo.
- Four glass corner cards, each with an indigo square chip, a title, three gray
  bulleted lines, and a footer with an indigo count and green "live":
  Top-left "Billing systems": "Origination platforms", "ERP integrations",
    "Real-time API & SFTP", "22 active · live"
  Top-right "Recovery vendors": "Collection agencies", "Law firms · debt buyers",
    "Specialty vendors", "27 active · live"
  Bottom-left "Data services": "Bankruptcy & decedent", "Credit bureau
    enrichment", "Skip-tracing services", "8 active · live"
  Bottom-right "BI platforms": "Data warehouse feeds", "Major BI environments",
    "Custom export schemas", "6 active · live"
- Four delicate indigo dotted curved lines from the hub to each card.
- Footer: "Reconciliations today 214,847", "Last sync 04:00", indigo "$1.5B+
  annual throughput".
16:10.
```

### 6. Placement matrix

```
A photorealistic screenshot of a placement routing matrix. [shared tokens]

- Eyebrow "PLACEMENT MANAGEMENT". Title "Routing rules", subline "National network
  · decision engine active · 14 rules live". Right "LIVE" pill.
- A highlighted queue strip: indigo icon, "1,847 accounts ready to route", subline
  "Loaded from billing · evaluated against tier rules", and an indigo button
  "Routing now".
- Matrix with column headers "Treatment tier", "Vendor allocation", "Accounts".
  Four rows, each a tier label with a small subline, a segmented horizontal
  allocation bar (segments in graduated indigo shades with percentage labels
  inside), and a right-aligned account count:
  "Pre-collect" "3 vendors · 30-day" / segments 40% 35% 25% / "12,847"
  "Primary" "3 vendors · 60-day" / segments 45% 35% 20% / "8,420"
  "Secondary" "2 vendors · 90-day" / segments 60% 40% / "4,108"
  "Tertiary" "2 vendors · 120-day" / segments 55% 45% / "2,290"
- Footer: "Reconciliation 04:00 today", "Recall windows configured", indigo
  "27 vendors active".
16:10.
```

### 7. Optimization engine

```
A photorealistic screenshot of an optimization results view. [shared tokens]

- Eyebrow "OPTIMIZATION ENGINE". Title "Closed pool · Q4 primary", subline "12,847
  accounts · performance bands applied · reallocation queued". Right green pill
  "EVALUATED".
- Column headers "Vendor · closed pool", "Liquidation", "This cycle → next".
  Three rows, each with an indigo chip and vendor name plus a small subline, a
  liquidation percentage with a colored band tag, and a "from → to" allocation
  shift with a colored arrow result:
  "Recovery partner A" "4,206 accounts placed" / "22.8%" green tag "HIGH" /
    "42% → 47%" green ▲
  "Recovery partner B" "3,521 accounts placed" / "18.6%" amber tag "MID" /
    "35% → 35%" gray ─
  "Recovery partner C" "5,120 accounts placed" / "14.2%" red tag "LOW" /
    "23% → 18%" red ▼
- A green callout box with a star icon: "Bonus triggered · Recovery partner A
  cleared 22% liquidation target", subline "Monthly bonus calculated automatically
  · applied to next settlement".
- Footer: "Reallocation applies next placement run", indigo "Caps & floors enforced".
4:3.
```

### 8. Compliance and work standards

```
A photorealistic screenshot of a vendor compliance view. [shared tokens]

- Eyebrow "COMPLIANCE & WORK STANDARDS". Title "Vendor adherence", subline
  "Measured against your work standards · audited continuously". Right green pill
  "AUDITED".
- Section label "Work standard adherence · 30 days". Three vendor rows, each with
  an indigo chip and name, a thin adherence bar (green for high, amber for the
  lower one), a percentage, and a status pill:
  "Recovery partner A" / bar 98% / "98.2%" / green "Compliant"
  "Recovery partner B" / bar 96% / "96.8%" / green "Compliant"
  "Recovery partner C" / bar 91% / "91.4%" / amber "Review"
- A live feed section. Header "Auto-surfaced exceptions · live" with a pulsing
  indigo dot, right "1,284 today". Three exception rows, each a colored type chip,
  a description with a masked account, and a green action label:
  green "DECEASED" / "SSA death index match · acct ··· 2847" / "Treatment suspended"
  red "BANKRUPTCY" / "PACER chapter 7 filing · acct ··· 1294" / "Auto-recalled"
  purple "SCRA" / "Active duty confirmed · acct ··· 9038" / "Rate cap applied"
- Footer: "Audit trail complete" (green), "Exportable for review", indigo "Every
  action logged".
16:10.
```

## Brand-motif and atmospheric prompts

A text-capable model handles these the same way Midjourney does, since they carry no text. Drop the Midjourney parameters and state the aspect ratio in words. The four motif directions and the atmospheric backdrops from `docs/midjourney-prompts.md` all carry over verbatim, minus the trailing flags. Pick one motif, then use reference anchoring (technique 3 above) to hold it across the series.

## Production workflow with a text-capable model

1. Build each product visual as a React component (the eight above exist as preview specs).
2. Screenshot the component, even rough.
3. Feed the screenshot to the model with finishing instructions, holding all text and numbers exactly.
4. Review against the design tokens. Refine conversationally until pixel-correct.
5. Use the result for static placements: OG images, slides, emails, social tiles, campaign pages.
6. Keep the animated React component for the live marketing site, where motion and auto-updating matter.

## Review gate

Same as every asset. Andrew clears all numbers before anything with metrics ships. Paul confirms the UI structure matches real dPlat. Gian reviews for brand fit. A generated image that does not clearly beat the coded component does not ship.
