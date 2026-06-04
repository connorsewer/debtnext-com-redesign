# Midjourney prompt library: dPlat product imagery

## Read this first

Midjourney cannot create usable UI screenshots. It produces garbled text, broken alignment, and invented controls that collapse under any scrutiny. For a premium product site, AI-generated UI is the fastest way to look cheap. The actual dPlat product screens get built as React components (see `docs/product-visuals-system.md`) and captured at high resolution.

Midjourney's role is the imagery that surrounds the product: brand-motif forms, atmospheric backdrops, and editorial texture. Used this way, it elevates the site. Used for screenshots, it sinks it.

This library covers five categories where Midjourney genuinely helps, with production-ready prompts.

## The screenshot pipeline (no Midjourney)

For real dPlat product visuals:

1. Build the visual as a React component (the seven we designed are the starting set).
2. Render it on a Vercel preview or local dev server.
3. Capture at 2x or 3x device pixel ratio. Options:
   - Manual: browser dev tools device toolbar at 2x, screenshot
   - Automated: Playwright script with `deviceScaleFactor: 3`, screenshots every product component on every build
4. The captured PNGs become your product imagery. They drop into hero sections, feature cards, and the demo page.
5. If you want a "screen in an environment" shot, composite the real screenshot onto a Midjourney-generated device or scene (see Category D).

This pipeline gives you screenshots that are real, on-brand, and update automatically when the product changes.

## Category A: brand-motif forms (highest value)

Every premium fintech brand has a signature abstract form. Mercury uses translucent glass blobs. Stripe uses gradient ribbons. Linear uses gradient meshes. dPlat needs its own. These forms become hero accents, section dividers, and card backgrounds.

Test all four directions below, pick one, then commit to it across the entire site. Consistency of motif matters more than variety.

### Direction 1: crystalline data form

```
A single abstract crystalline form floating in dark void, faceted translucent
glass with deep indigo internal refraction, sharp geometric planes catching cool
blue light, suspended in near-black space, subsurface glow, premium product
render, octane render quality, dramatic single-source lighting from upper left,
deep shadows, no text, no UI, no people, centered with generous negative space,
ultra clean --ar 4:3 --style raw --v 6.1 --q 2 --stylize 250
```

Reads as: precision, structure, clarity. Best fit for a platform about bringing order to complexity.

### Direction 2: flowing data ribbon

```
Abstract flowing ribbon of liquid glass in deep indigo, twisting through dark
void, translucent with internal light, smooth organic curves suggesting movement
and routing, near-black background, soft volumetric glow, premium 3D render,
cinematic lighting, no text, no UI elements, no people, generous negative space
--ar 16:9 --style raw --v 6.1 --q 2 --stylize 250
```

Reads as: movement, routing, flow. Best fit for the placement and optimization story.

### Direction 3: layered glass planes

```
Stacked translucent glass planes floating in dark space, each plane tinted subtle
indigo, parallel layers suggesting depth and structure, edges catching cool light,
near-black void background, premium architectural render, soft shadows between
layers, minimal, no text, no people, generous negative space
--ar 1:1 --style raw --v 6.1 --q 2 --stylize 200
```

Reads as: layers, transparency, system architecture. Best fit for the platform overview story.

### Direction 4: network lattice

```
Delicate three-dimensional lattice of connected nodes and thin glowing lines,
deep indigo points at intersections, suspended in near-black void, suggesting a
network or data structure, subtle depth of field, premium render, restrained,
elegant, no text, no people, generous negative space
--ar 16:9 --style raw --v 6.1 --q 2 --stylize 200
```

Reads as: connection, network, ecosystem. Best fit for the integration story.

## Category B: atmospheric backdrops

These sit behind hero copy and CTA bands. They establish depth without competing with foreground content. (These extend the set in `docs/asset-and-animation-guide.md`.)

### Hero ambient field

```
Premium fintech atmospheric backdrop, deep violet-tinted near-black canvas, faint
volumetric light pooling in the upper right, subtle long-exposure light trails
reading as quiet motion, cinematic depth, very low noise, mostly empty frame with
breathing room, no people, no devices, no charts, no UI, no text, ultra-wide
--ar 21:9 --style raw --v 6.1 --q 2 --stylize 200
```

### CTA closing atmosphere

```
Minimalist fintech atmospheric backdrop, near-black dark violet canvas, single
luminous indigo accent point suggesting a quiet beacon, vast negative space,
sense of arrival and conclusion, cinematic restraint, no characters, no text,
no UI, no devices, horizontal openness --ar 21:6 --style raw --v 6.1 --q 2
--stylize 150
```

## Category C: blurred dashboard ambience (background only)

This is the one case where "dashboard-like" Midjourney output works: when it's so out of focus that the garbled text is invisible. Use only as a heavily-blurred background behind text, never as a focal element.

```
Extreme close-up of an out-of-focus data dashboard, soft bokeh, deep indigo and
dark tones, indistinct glowing interface elements completely blurred beyond
recognition, near-black background, very shallow depth of field, abstract,
atmospheric, no legible text, no sharp edges, pure background texture
--ar 16:9 --style raw --v 6.1 --q 2 --stylize 150
```

After generating, apply an additional gaussian blur in post and drop opacity to 30 to 50 percent behind your text. If any UI element is recognizable, blur it more.

## Category D: device-in-scene (for compositing real screenshots)

Note: the pure Mercury aesthetic floats clean UI in space and rarely uses device shots. Use these only if you want a moodier "product in the world" treatment on, say, the company page or a campaign landing page. The screen is generated blank so you composite a real screenshot onto it afterward.

### Floating laptop, blank screen

```
A single ultra-thin laptop floating in a dark minimalist void, screen completely
black and blank, soft rim lighting along the edges, deep shadows, premium product
photography, near-black background, subtle indigo ambient glow, three-quarter
angle, no text, no screen content, no people, generous negative space
--ar 16:9 --style raw --v 6.1 --q 2 --stylize 200
```

### Monitor on desk, dusk, blank screen

```
A high-end monitor on a minimal desk in a dark room at dusk, screen completely
black and blank, moody atmospheric lighting, deep blue hour tones through an
unseen window, premium interior photography, shallow depth of field, no text, no
screen content, no people, restrained and sophisticated
--ar 16:9 --style raw --v 6.1 --q 2 --stylize 250
```

Composite workflow: mask the blank screen region in Figma or Photoshop, drop in the real captured dPlat screenshot, add a subtle screen reflection and glow to sell the integration.

## Category E: editorial and conceptual (blog, resources, about)

For the content engine and company pages, where literal product imagery doesn't fit.

### Recovery operations concept

```
Abstract conceptual image representing order emerging from financial complexity,
dark sophisticated palette with deep indigo accents, flowing forms resolving into
clean structured geometry, premium editorial illustration, cinematic depth, no
text, no people, no literal money, no charts, no graphs
--ar 3:2 --style raw --v 6.1 --q 2 --stylize 250
```

### Compliance and trust concept

```
Abstract architectural form suggesting permanence and structural integrity, dark
fintech palette, clean geometric lines with subtle indigo highlights, sense of
solidity and trust, premium editorial render, cinematic stillness, no buildings
literal, no people, no text --ar 3:2 --style raw --v 6.1 --q 2 --stylize 200
```

## Technique notes

**Lock the series style with --sref.** Once you generate a hero brand-motif image you love, grab its URL and append `--sref [url]` to every subsequent prompt. This forces Midjourney to hold a consistent look across the whole series. Without it, ten prompts give you ten different aesthetics.

**Use --style raw.** It strips Midjourney's default "illustrated" tendency and produces cleaner, more photographic, more premium output. Drop it only if a prompt comes out too sterile.

**Tune --stylize per category.** Lower values (150) keep output literal and restrained, which suits atmospheric backdrops. Higher values (250) give Midjourney more artistic latitude, which suits the brand-motif forms.

**Aspect ratios map to placement.**
- 21:9 and 21:6 for full-bleed hero and CTA backdrops
- 16:9 for standard section media
- 4:3 and 1:1 for card-contained brand-motif accents
- 3:2 for editorial and content thumbnails

**Generate in batches, then refine.** Run each prompt 2 to 3 times, pick the strongest result, upscale it, then use "vary subtle" to get options. Don't settle for the first grid.

**Universal negatives.** If output drifts wrong, append:
```
--no people, faces, hands, office furniture, laptops with content, smartphones,
city skylines, stock photo, gradient mesh, glassmorphism cliche, neon, cyberpunk,
holographic, futuristic HUD, dashboards, charts, graphs, text, logos, watermarks
```

## What to generate first

1. Run all four brand-motif directions (Category A). Pick one. This is the most important decision because it becomes the site's signature visual element.
2. Once chosen, grab the winning image's URL and use it as `--sref` for everything else.
3. Generate the two atmospheric backdrops (Category B) for the hero and CTA bands.
4. Hold Categories C, D, and E until the content pages are scoped. They serve specific pages that aren't built yet.

## Review gate

Every generated image still goes through the same review as any other asset:
- Does it fit the dark Mercury aesthetic, or does it read as generic AI art?
- Does it compete with foreground content, or support it?
- Gian reviews for brand fit before anything ships.

Generated imagery that doesn't clearly elevate the page gets cut. A clean dark gradient beats a mediocre render every time.
