# Asset and animation guide: DebtNext.com

A reference for image generation, product visual creation, and animation library decisions for the dPlat marketing site rebuild.

## Part 1: Asset strategy

The site needs assets in three categories. Each gets a different production approach.

### Category A: Build, don't generate

These are product visuals. Build them as real React components, screenshot for documentation, embed live where possible.

**What goes here**:

- Hero dashboard mockup (homepage, platform overview)
- Placement matrix visual (placement page)
- Issue worklist (issues page)
- Dashboard gallery (reporting page)
- Vendor performance comparison (optimization page)
- Comparison table (why-dplat page)
- All "screenshot inside a card" moments

**Why**: AI-generated UI looks AI-generated. It's the most reliable way to mark a site as untrustworthy. Real Recharts + shadcn components with realistic anonymized data look like an actual product because they are an actual product. They also serve dual duty (the real platform team can reference them, the site can update when the actual product updates).

**Tooling**: shadcn/ui for chrome, Recharts for data viz, Lucide React for icons (already in stack from `CLAUDE.md` section 2). Build inside the site repo as `src/components/product/` mockups.

**Realistic anonymized data**: invent client codes like "Client A," "Client B," portfolio segments like "Pre-collect," "Primary," "Secondary," and metrics that look plausible without claiming specific outcomes. Andrew should review any numbers that appear on screen even in mockups.

### Category B: Design (human work)

These need a designer, not a generator.

**Logo and wordmark**:
- Current dPlat wordmark needs evaluation against the Mercury-style system
- The TSI Primary White lockup does not belong on this site
- Gian's task: develop a dPlat-only wordmark, monochromatic, sized for the dark canvas
- Constraint: must look at home next to Mercury, Linear, Stripe, Vercel, not next to a typical B2B SaaS logo
- Deliverables: SVG horizontal lockup, SVG mark only, favicon at 32px and 16px

**Leadership headshots**:
- Six leadership cards on the company page (Paul, Frank, Eric, Jeremy, Marc, Andrew)
- Photography direction: studio portraits, neutral dark or mid-gray backgrounds, no smiling-at-camera energy, no corporate "arms crossed" pose
- Reference: how Stripe, Mercury, and Linear photograph their leadership pages
- If new photos aren't possible, the alternative is no photos. Plain text cards beat bad headshots.

**Product UI screenshot capture**:
- If Paul, Rob, or Frank can give us read access to a sanitized dPlat tenant, we capture real screens
- Anonymize: replace any client names, account numbers, dollar values with neutral placeholders before publishing
- This is the gold standard for the product mockup sections

### Category C: Generate (sparingly)

The only assets worth generating are atmospheric backgrounds for hero and CTA sections. Nothing else.

**What goes here**:

- Homepage hero atmospheric backdrop (behind copy + product mockup)
- Final CTA section atmospheric backdrop
- Company page hero atmospheric backdrop
- Industry page atmospheric headers (if we decide to add them in v2)

**Tooling recommendation**: Midjourney v6.1 or Imagen 4 Pro for output quality. ChatGPT's image generation produces predictable SaaS slop in this aesthetic. Test renders, pick the one strongest, refine.

## Part 2: Image generation prompts

Each prompt below is structured for Midjourney v6.1 syntax. For Imagen/DALL-E, drop the trailing parameters and convert to natural language.

### Prompt 1: Homepage hero atmospheric background

```
Abstract atmospheric background for premium fintech software marketing site, 
deep violet-tinted near-black canvas (#171721), faint indigo geometric structure 
suggesting data flow or network topology, soft volumetric light pooling in one 
upper-left quadrant, subtle long-exposure light trails reading as motion without 
being literal, cinematic depth, low noise, restrained, premium, calm, 
no people, no devices, no charts, no UI elements, no logos, no text, 
ultra-wide composition with negative space center-right for overlay copy 
--ar 21:9 --style raw --v 6.1 --q 2 --stylize 200
```

**Use**: Behind the hero on `/`. Copy overlays on top. Should not compete with the product mockup that sits to the right.

**Iteration notes**: If results trend too busy, add `minimalist composition, breathing room, mostly empty frame` to the prompt. If they trend too flat, add `subtle depth, atmospheric perspective, distant geometric forms`.

### Prompt 2: Final CTA section background

```
Premium fintech atmospheric backdrop, near-black dark violet canvas (#171721), 
single luminous accent in deep indigo (#5266EB) suggesting a quiet beacon or 
data point, vast negative space, sense of conclusion or arrival, restrained 
minimalism, cinematic, no characters, no text, no UI, no devices, no logos, 
centered composition with horizontal openness 
--ar 21:6 --style raw --v 6.1 --q 2 --stylize 150
```

**Use**: Final CTA band on every page. The "ready to see it" closing moment. Should feel like a quiet exhale, not a finale crescendo.

### Prompt 3: Company page hero backdrop

```
Atmospheric architectural backdrop, dark fintech aesthetic, structural lines 
suggesting infrastructure or quiet permanence, near-black (#171721) canvas 
with subtle gradient depth, no buildings shown literally, no offices, no skylines, 
abstract geometric environment, faint indigo highlights, cinematic stillness, 
no people, no text 
--ar 16:9 --style raw --v 6.1 --q 2 --stylize 150
```

**Use**: Behind the company page hero. Conveys "we've been doing this for 20 years" without literal time imagery.

### Prompt 4: Industry page atmospheric headers (v2)

Four variants, one per industry. Same structure, different atmospheric anchors.

**Utilities**:
```
Abstract atmospheric backdrop for utility industry fintech software, near-black 
canvas, faint geometric grid suggesting infrastructure or distribution network, 
restrained indigo accents, no power lines literal, no buildings, no people, 
cinematic minimalism --ar 16:9 --style raw --v 6.1 --q 2
```

**Financial services**:
```
Premium fintech atmospheric backdrop, near-black canvas with deep depth, 
abstract architectural verticality suggesting institutional weight, restrained 
indigo accent points, no skylines literal, no money imagery, no people, 
cinematic stillness --ar 16:9 --style raw --v 6.1 --q 2
```

**Telecom**:
```
Abstract atmospheric backdrop, near-black fintech canvas, faint network topology 
suggesting connectivity, distant signal-like indigo points, no antennas literal, 
no devices, no people, cinematic minimalism --ar 16:9 --style raw --v 6.1 --q 2
```

**Fintech**:
```
Premium atmospheric backdrop, near-black canvas, abstract flowing geometry 
suggesting movement and modern infrastructure, restrained indigo highlights, 
no devices, no app screens, no people, cinematic --ar 16:9 --style raw --v 6.1 --q 2
```

### Universal negative prompts

Append to any of the above if results trend wrong:

```
--no people, faces, smiling, hands, office furniture, laptops, smartphones, 
city skylines, stock photo, gradient mesh, glassmorphism, neon, cyberpunk, 
holographic, futuristic UI, dashboards, charts, graphs, text, logos, watermarks
```

### What not to generate

Do not generate, for any reason:

- Product dashboard mockups (build them)
- Workflow diagrams (build them as SVG or use Excalidraw)
- Iconography (Lucide React covers the entire site)
- Customer logos (we don't have permission to use any yet)
- People in business attire (use real headshots or no headshots)
- Office scenes, conference rooms, handshakes, anything that screams "stock photo"
- 3D rendered isometric illustrations (this is the most-flagged AI tell in 2025)

## Part 3: Workflow diagrams

The site has several process strips and lifecycle visualizations:

- Homepage feature accordion (5 items)
- Placement page how-it-works (3 steps)
- Issues page lifecycle (5 steps)
- Optimization page mechanism (3 steps)
- Platform page flow (5 steps)

**Approach**: build as React components using semantic HTML, not images. Each step is a card or row with an icon (Lucide), a number, a title, and body copy. Connect with thin dividers per the DESIGN.md.

**For more complex flows** (e.g., the dPlat integration ecosystem showing how data flows between client systems, dPlat, and vendor network):

Option A: Use Excalidraw MCP (already in your stack) to draft the diagram, then have Gian recreate as a clean SVG in the Mercury aesthetic.

Option B: Build directly as SVG inside the site, animated with Framer Motion or Anime.js (covered below).

Option B is the right answer for hero-positioned diagrams where the user is meant to study them. Option A is fine for documentation pages.

## Part 4: Animation library decision framework

The DESIGN.md is explicit: calm fades, slight directional movement, accordion transitions, no bounce, no parallax, no exaggerated scaling. Plan the animation stack against that, not against what's possible.

### Recommended stack

| Library | Use case | Status |
|---|---|---|
| Framer Motion | 95% of UI animation in React | Install first |
| GSAP + ScrollTrigger | Scroll-driven sequencing if Framer Motion isn't enough | Install when needed |
| React Three Fiber (Three.js wrapper) | Atmospheric 3D in hero/CTA bands | Install only if 3D background ships |
| Anime.js | SVG path drawing for workflow diagrams | Install if diagrams need animation |
| Framer Motion 3D | Skip | Less performant than React Three Fiber for the same job |
| React Spring | Skip | Framer Motion handles physics-feeling animation fine for this aesthetic |
| Babylon.js | Skip | Built for games and WebXR, not marketing sites |

### When to reach for each

**Framer Motion** is the default. Use it for:

- Hero copy fade-in on page load
- Section reveals on scroll (`whileInView` + small `y` offset)
- Feature accordion expand and collapse (animate `grid-template-rows` or `height: auto`)
- Card hover states (subtle border or opacity shift)
- Mobile menu drawer slide-in
- Page transitions
- Form state changes (loading spinner, success message swap)
- Number counters on the proof band (use `motion.span` with `animate` and an `onUpdate` callback)

**GSAP + ScrollTrigger** when you need:

- Pinned scroll sections (a section stays visible while content cycles through it)
- Horizontal scroll within a vertical page
- Complex sequenced timelines (multiple elements animating in choreographed order with overlapping timings)
- SVG path drawing (animating `stroke-dashoffset` to draw a diagram)
- Scroll progress driving animation playhead position

For the DebtNext site specifically, GSAP becomes worth it only if you want the platform overview page to have a "scroll through the platform" pinned section where the dashboard mockup updates as the user scrolls past each module. That's a real Mercury pattern (their "business banking" section does something like this). Otherwise, Framer Motion is enough.

**React Three Fiber (Three.js)** when you need:

- Hero atmospheric background as live 3D (slow-moving particle field, abstract geometry)
- Final CTA atmospheric layer
- Anywhere you'd otherwise use a generated image but want subtle motion baked in

Performance caveat: 3D backgrounds chew through battery on mobile. If you ship one, the mobile experience should swap to a static image. The DESIGN.md's reduced-motion preference also needs to disable the WebGL canvas entirely.

**Anime.js** for SVG-specific work:

- Logo entrance animation (one-time, on first load)
- Workflow diagram path drawing (when GSAP is overkill)
- Icon morphs (menu hamburger to X, accordion chevron rotation)

Anime.js is lighter than GSAP and feels right for the kind of restrained SVG work the Mercury aesthetic calls for.

### When to skip everything and use CSS

For simple state transitions (hover color shifts, focus ring appearance, button press states), CSS transitions are faster, cheaper, and more accessible than any JS library. Reach for animation libraries only when CSS can't express the motion.

## Part 5: Claude Code prompts for animation work

These are paste-ready prompts. Each one assumes Claude Code has already read CLAUDE.md and DESIGN.md.

### Prompt set 1: Framer Motion foundation

**Initial install and setup**:

```
Install framer-motion and add motion to the hero section on the homepage.

Requirements:
- Read DESIGN.md section "Motion" before writing any code
- Hero H1, body, and CTA fade in on initial load with staggered timing 
  (H1 first, then body, then CTA, ~120ms between each)
- Total animation duration under 800ms
- Each element starts at opacity 0 and translateY 12px, ends at opacity 1 
  and translateY 0
- Easing: use the easing-standard token from DESIGN.md (cubic-bezier(0.2, 0.7, 0.2, 1))
- Hero media (right column) fades in last with a slightly longer duration (~500ms)
- Wrap the entire hero animation in a check for prefers-reduced-motion; 
  if reduced motion is set, render content statically with no transition
- Acceptance: open the homepage with reduced motion off, animation plays. 
  Toggle reduced motion on at the OS level, refresh, content appears 
  immediately with no animation.
```

**Section reveal on scroll**:

```
Add scroll-triggered fade-in to all section components below the hero.

Requirements:
- Use Framer Motion's whileInView with `viewport={{ once: true, margin: "-80px" }}`
- Sections animate in when their top edge is 80px past the viewport bottom
- Animation: opacity 0 to 1, translateY 16px to 0
- Duration: 500ms with easing-standard
- Once-only (no re-animation when scrolling back up)
- Respect prefers-reduced-motion
- Apply to: trust band, feature accordion, proof band, benefit deep-dive, 
  integration ecosystem strip, final CTA

Do not apply this to individual elements within a section. Only to section 
wrappers. We want quiet section-level reveals, not animation theater.
```

**Feature accordion**:

```
Build the FeatureAccordion component for the homepage and platform/* pages.

Requirements:
- Use shadcn/ui's Accordion as the base
- Override the default Radix transition with Framer Motion AnimatePresence 
  + motion.div animating height and opacity
- Animate grid-template-rows from 0fr to 1fr (modern smooth height animation) 
  with 300ms duration, easing-in-out
- The paired product visual on the right updates with the active item: 
  AnimatePresence + opacity crossfade (300ms)
- Only one item open at a time
- Accessibility: aria-expanded reflects state, aria-controls links header to panel
- Active item title brightens to #FFFFFF, inactive items use #C3C3CC
- Active item gets a left-edge indicator in #5266EB, 2px wide
- Keyboard: Enter/Space toggles, arrow keys navigate between headers
- Respect prefers-reduced-motion: instant open/close, no fade
```

### Prompt set 2: GSAP for scroll storytelling

Use this only if you decide the platform page needs a pinned scroll experience.

```
Install gsap and @gsap/react. Build a pinned scroll-storytelling section 
for the /platform page that walks through the five modules.

Requirements:
- Read DESIGN.md before writing code
- Use GSAP's ScrollTrigger plugin (registered client-side only)
- The section stays pinned for ~500vh of scroll
- Five module panels cycle on the right side as the user scrolls
- Left side: persistent module list with active item highlighted in #5266EB
- Active panel transitions: opacity 0 to 1, translateY 20px to 0, 400ms
- Outgoing panel: opacity 1 to 0, 200ms
- Snap to each panel as the user scrolls (use ScrollTrigger's snap option 
  with proximity)
- Accessibility:
  - Section must work without scroll (provide keyboard navigation that 
    cycles through panels)
  - Respect prefers-reduced-motion: replace the pinned scroll with a 
    standard vertical layout, no pinning, no snapping
  - Each panel must be keyboard-reachable when the section is unpinned
- Performance: lazy-load the GSAP bundle (dynamic import on the page that 
  uses it). Do not include in the global bundle.
- Mobile: disable the pinned scroll entirely. Render as a vertical stack 
  of panels with standard scroll behavior.

Acceptance criteria:
- Desktop with reduced motion off: pinned scroll works, snaps to each panel
- Desktop with reduced motion on: standard vertical layout, no pinning
- Mobile: standard vertical layout regardless of reduced motion preference
- Lighthouse performance score does not drop below 90 on the /platform page
```

### Prompt set 3: React Three Fiber for hero atmosphere

Use only if the static atmospheric image isn't enough.

```
Install three, @react-three/fiber, and @react-three/drei. Add a subtle 
WebGL atmospheric background to the homepage hero.

Requirements:
- Read DESIGN.md sections on motion and accessibility before writing code
- The 3D layer sits behind the hero copy and product mockup
- Visual: slow-drifting particle field or subtle abstract geometry, 
  near-black canvas, faint indigo accent points
- Camera does not move (no parallax, no scroll-driven rotation)
- Particles or geometry drift at <0.1 units per second; the motion should 
  be barely perceptible
- Render at 60fps on a mid-tier laptop; degrade to 30fps target on mobile
- Set pixel ratio to Math.min(window.devicePixelRatio, 2) to control fill rate

Performance and accessibility:
- Lazy-load the 3D component with next/dynamic and ssr: false
- Show a static fallback image (the generated atmospheric backdrop) for:
  - Mobile devices (use a media query, not user agent sniffing)
  - prefers-reduced-motion: reduce
  - Devices reporting hardware concurrency < 4
  - The first 1.5 seconds after page load (load fast, hydrate the canvas after)
- Pause the animation loop when the canvas is not in the viewport 
  (use IntersectionObserver)
- The Canvas should be aria-hidden="true" (it's decorative)

Acceptance criteria:
- Hero LCP under 2.5s on Vercel preview mobile test
- Reduced motion users see only the static fallback image
- The 3D layer never blocks interaction with the hero CTA or form
- Memory usage stays under 100MB after 60 seconds of canvas runtime
```

### Prompt set 4: Anime.js for SVG diagram animation

Use this for the platform overview workflow diagram.

```
Install animejs. Animate the workflow diagram on the /platform page 
(the five-step "How your portfolio flows through dPlat" strip).

Requirements:
- The diagram is an inline SVG with five connected nodes and four connecting lines
- On viewport entry, animate each node in sequence: scale 0.8 to 1, opacity 
  0 to 1, 300ms per node, 150ms stagger
- Connecting lines draw between nodes after each node appears: animate 
  stroke-dashoffset from the line's length to 0, 400ms per line
- After all nodes and lines are visible, the active step indicator (an indigo 
  pulse on the leftmost node) starts a gentle 2-second cycle: subtle opacity 
  pulse, no scale change
- Use IntersectionObserver to trigger the sequence (once only)
- Respect prefers-reduced-motion: render the diagram fully visible 
  immediately, no animation
- All five nodes and four lines must be keyboard-focusable for screen 
  readers regardless of animation state

Acceptance criteria:
- The sequence reads as a "diagram drawing itself" not as "elements popping in"
- Total sequence duration under 3 seconds
- Reduced motion users see the static fully-drawn diagram
- No layout shift during the animation
```

### Prompt set 5: Number counter for proof band

```
Add an animated number counter to the proof band on the homepage and 
/why-dplat page.

Requirements:
- Use Framer Motion's motion.span with animate prop
- Trigger on viewport entry (whileInView, once: true)
- Animate from 0 to the target number over 1.5 seconds
- Use easing-standard from DESIGN.md
- Format with thousand separators (e.g., "60M+", "$1.5B+")
- The "+" suffix should appear at the end of the count, not animate with it
- Respect prefers-reduced-motion: render the final value immediately

Target values:
- "60M+ accounts managed": animate from 0 to 60, append "M+ accounts managed"
- "$1.5B+ in payments annually": animate from 0 to 1.5, prepend "$", append "B+ in payments annually"
- "Since 2003 / 20+ years in production": do not animate (year is not a count)

Status flag: this content carries [CLAIMS REVIEW]. Andrew has not signed off 
on these numbers for external use. Implement the component but use placeholder 
values (60, 1.5) until approval lands. Do not display the actual numbers in 
production until status flag clears.
```

## Part 6: Performance and accessibility budget

Every animation added to this site must fit inside these limits.

**Performance**:
- Initial JS bundle (after gzip): under 90KB for any animation library code shipped on every page
- Framer Motion: included on every page (it's the primary library)
- GSAP, Three.js, Anime.js: dynamic-imported on pages that use them, never in the global bundle
- LCP target stays at 2.5s mobile, 1.5s desktop
- INP stays under 200ms

**Accessibility**:
- Every animation respects prefers-reduced-motion. No exceptions.
- Reduced motion does not mean "shorter animation." It means "no animation, content appears in final state immediately."
- Focus states never depend on animation. A keyboard user must see focus indicators instantly.
- Hover states on touch devices must have a click/tap equivalent. No hover-only content.
- Auto-playing motion must be pauseable. No exception.

**Decision framework before adding any animation**:

1. Does the content communicate the same thing without animation? If yes, the animation is decorative. Decorative animation should be the lightest possible (CSS or Framer Motion fades only).
2. Does the animation help a user understand a transition (state change, page load, scroll position)? If yes, the animation is functional. Functional animation gets more budget.
3. Does the animation make the page feel slower than the static version? If yes, cut it.

## Part 7: Implementation order

The animation work fits into the M2 and M4 milestones from `docs/content-map.md`. Don't try to do it during M1.

**M2 (foundation has Framer Motion)**:
- Hero load animation
- Section reveal on scroll
- Feature accordion transitions
- Card hover states
- Mobile menu drawer

**M4 (polish)**:
- Number counter (if Andrew approves the numbers)
- Workflow diagram drawing animation (if you decide it's worth it)
- Optional: GSAP pinned scroll on /platform (defer to v1.5 if it adds time)
- Optional: React Three Fiber hero background (defer to v1.5 unless static atmospheric image doesn't land the aesthetic)

**Deferred to v1.5 or later**:
- 3D backgrounds anywhere
- Pinned scroll storytelling
- Logo entrance animation
- Page transitions

The site ships without these. Add them after the v1 site is live and you have real engagement data to justify the work.
