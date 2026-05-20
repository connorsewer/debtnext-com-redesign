---
version: "alpha"
name: "DebtNext.com Mercury-style DESIGN.md"
description: "A Mercury-faithful, dark-canvas-first fintech/SaaS marketing design system for rebuilding DebtNext.com with Mercury-like visual decisions, component behavior, layout rhythm, motion, and accessibility standards. This file intentionally excludes DebtNext- or TSI-specific visual branding decisions."

intent:
  primary: "Mirror Mercury's premium dark-canvas fintech aesthetic, then apply DebtNext content and product messaging inside that visual shell."
  non_goals:
    - "Do not use DebtNext/TSI visual-brand colors, typography, icon rules, logo rules, or square-corner brand geometry."
    - "Do not copy Mercury logos, proprietary imagery, exact copy, code, customer marks, or protected assets."
    - "Do not introduce local one-off colors, spacing values, typography values, or interaction styles outside this system."

colors:
  canvas: "#171721"
  canvas-black: "#000000"
  canvas-elevated: "#20212d"
  canvas-elevated-alt: "#1e1e2a"
  canvas-strong: "#323649"
  surface-light: "#FFFFFF"
  surface-muted: "#f4f4f5"
  border-light: "#e4e4e7"
  border-soft: "#EBEBEB"
  primary: "#5266EB"
  primary-hover: "#4354c8"
  primary-active: "#3442a6"
  focus: "#9CB4E8"
  text-dark: "#171721"
  text-default-light: "#EDEDF3"
  text-inverse: "#FFFFFF"
  text-subdued-light: "#C3C3CC"
  text-muted-light: "#a1a1aa"
  text-subdued-dark: "#535461"
  chart-1: "#5266EB"
  chart-2: "#323649"
  chart-3: "#10b981"
  chart-4: "#f59e0b"
  chart-5: "#06b6d4"
  destructive: "#ef4444"

typography:
  preferred-display:
    fontFamily: "Arcadia Display, Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif"
    notes: "Use Arcadia Display only when properly licensed and available. Otherwise use Inter as the open-source implementation fallback."
  preferred-body:
    fontFamily: "Arcadia, Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif"
    notes: "Use Arcadia only when properly licensed and available. Otherwise use Inter."
  display-xl:
    fontSize: "64px"
    fontWeight: "400"
    lineHeight: "70px"
    letterSpacing: "0.42px"
  display-lg:
    fontSize: "49px"
    fontWeight: "480"
    lineHeight: "54px"
    letterSpacing: "0px"
  h1:
    fontSize: "49px"
    fontWeight: "480"
    lineHeight: "54px"
    letterSpacing: "0px"
  h2:
    fontSize: "42px"
    fontWeight: "480"
    lineHeight: "48px"
    letterSpacing: "0px"
  h3:
    fontSize: "28px"
    fontWeight: "480"
    lineHeight: "34px"
    letterSpacing: "0px"
  h4:
    fontSize: "21px"
    fontWeight: "480"
    lineHeight: "25px"
    letterSpacing: "0px"
  body-lg:
    fontSize: "21px"
    fontWeight: "480"
    lineHeight: "25px"
    letterSpacing: "0px"
  body-md:
    fontSize: "16px"
    fontWeight: "400"
    lineHeight: "24px"
    letterSpacing: "0px"
  body-strong:
    fontSize: "16px"
    fontWeight: "420"
    lineHeight: "24px"
    letterSpacing: "0px"
  body-sm:
    fontSize: "14px"
    fontWeight: "420"
    lineHeight: "20px"
    letterSpacing: "0px"
  caption:
    fontSize: "12px"
    fontWeight: "480"
    lineHeight: "17px"
    letterSpacing: "0px"

spacing:
  base: "4px"
  1: "4px"
  2: "8px"
  3: "12px"
  4: "16px"
  5: "20px"
  6: "24px"
  8: "32px"
  10: "40px"
  12: "48px"
  16: "64px"
  18: "72px"
  20: "80px"
  24: "96px"

rounded:
  none: "0px"
  xs: "4px"
  sm: "8px"
  md: "32px"
  lg: "40px"
  xl: "999px"
  circle: "50%"

shadows:
  none: "none"
  nav: "rgba(86, 86, 118, 0.1) 0px 0px 6px 0px"
  card-light: "rgba(28, 28, 35, 0.02) 0px 10px 16px 0px, rgba(28, 28, 35, 0.04) 0px 6px 10px 0px, rgba(28, 28, 35, 0.09) 0px 0px 3px 0px"
  deep: "rgba(0, 0, 0, 0.05) 0px 0px 3px 0px, rgba(0, 0, 0, 0.05) 0px 8px 12px 0px, rgba(0, 0, 0, 0.05) 0px 12px 20px 0px"
  focus: "0 0 0 3px rgba(156, 180, 232, 0.35)"

motion:
  duration-instant: "150ms"
  duration-fast: "300ms"
  duration-normal: "500ms"
  easing-standard: "cubic-bezier(0.2, 0.7, 0.2, 1)"
  easing-in-out: "cubic-bezier(0.4, 0, 0.2, 1)"

breakpoints:
  mobile: "<640px"
  tablet: "640px-1023px"
  desktop: "1024px-1439px"
  wide: ">=1440px"

components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.text-inverse}"
    height: "40px"
    padding: "0 20px"
    rounded: "{rounded.lg}"
    typography: "{typography.body-strong}"
  button-secondary-dark:
    backgroundColor: "rgba(156, 180, 232, 0.2)"
    textColor: "{colors.text-default-light}"
    height: "32px"
    padding: "0 12px"
    rounded: "{rounded.md}"
    typography: "{typography.body-sm}"
  button-ghost-dark:
    backgroundColor: "transparent"
    textColor: "{colors.text-default-light}"
    height: "auto"
    padding: "0"
    rounded: "{rounded.xs}"
    typography: "{typography.body-strong}"
  field-dark-attached:
    backgroundColor: "transparent"
    textColor: "{colors.text-default-light}"
    height: "46px"
    padding: "0 0 0 20px"
    border: "1px solid {colors.text-default-light}"
    rounded: "32px 0 0 32px"
    typography: "{typography.body-strong}"
  card-dark:
    backgroundColor: "{colors.canvas-elevated}"
    textColor: "{colors.text-default-light}"
    padding: "32px"
    rounded: "{rounded.none}"
    shadow: "{shadows.none}"
  card-light:
    backgroundColor: "{colors.surface-light}"
    textColor: "{colors.text-dark}"
    padding: "32px"
    rounded: "{rounded.none}"
    border: "1px solid {colors.border-soft}"
    shadow: "{shadows.card-light}"
  nav-dark:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.text-default-light}"
    height: "72px"
    padding: "16px 32px"
    shadow: "{shadows.nav}"
---

# Mercury-style DESIGN.md for DebtNext.com

## 1. Context and goals

This DESIGN.md defines a single implementation-ready design standard for a DebtNext.com rebuild that mirrors Mercury's visual decisions: dark-canvas fintech atmosphere, restrained blue action color, generous spacing, pill-shaped controls, product-led hero composition, calm motion, and highly legible marketing-site structure.

DebtNext is the application target, not the visual source. The design source of truth is Mercury's website aesthetic and the supplied Mercury design notes. Treat this as a visual and interaction shell that can contain DebtNext content, product screenshots, diagrams, and calls to action without importing DebtNext or TSI visual branding.

### Design intent

Create a premium fintech/SaaS marketing experience that feels controlled, technical, spacious, atmospheric, and conversion-oriented while avoiding clutter, over-decoration, and local visual exceptions.

### Non-negotiable exclusions

The implementation must not use DebtNext or TSI design elements in this visual system. Specifically:

- Do not use DebtNext/TSI colors as design tokens.
- Do not use Poppins, Calibri, square-corner brand geometry, TSI logo rules, or TSI iconography as part of this visual system.
- Do not introduce brand-specific DebtNext visual motifs unless they are restyled to fit the Mercury-like system.
- Do not replace Mercury's indigo action system with a different corporate blue.
- Do not change the rounded pill control language into sharp enterprise cards or square buttons.
- Do not copy Mercury's proprietary assets, exact text, source code, logos, or customer marks.

### Experience goals

1. Make the page feel premium and composed before the user reads any copy.
2. Use a dark-first canvas to create contrast, trust, and product sophistication.
3. Use one dominant primary CTA per horizontal band.
4. Make product complexity feel simple through clear sections, accordions, product mockups, and controlled motion.
5. Use generous whitespace as a design feature, not unused space.
6. Keep all interactive states explicit, accessible, and testable.
7. Make the resulting site easy for an engineer or AI agent to build consistently from tokens.

## 2. Visual theme and atmosphere

The visual language is modern fintech minimalism. It should feel closer to an operating system for serious financial work than a generic B2B SaaS landing page.

The system is anchored by a deep violet-tinted near-black canvas (`#171721`), elevated charcoal surfaces (`#20212d` / `#1e1e2a`), off-white text (`#EDEDF3`), subdued lavender-grey secondary text (`#C3C3CC`), and a single bright indigo action color (`#5266EB`). Light surfaces appear only where they create contrast, product clarity, or long-form readability.

### Key characteristics

- Dark-canvas-first, not white-canvas-with-blue-accents.
- Premium fintech feel: calm, precise, spacious, and high-trust.
- Strong typographic hierarchy with low visual noise.
- One high-emphasis action color used with discipline.
- Rounded pills for primary actions and attached forms.
- Mostly flat dark surfaces; shadows appear primarily on light cards or floating panels.
- Product mockups, dashboards, and media panels should look integrated into the dark canvas.
- Motion should feel fluid and quiet: fades, slight directional movement, accordion transitions, and no bounce.

## 3. Core design principles

### 3.1 Dark canvas is the default

The root site experience should open in a dark canvas. Use `--background: #171721` and `--foreground: #EDEDF3` for the primary page shell. Light sections can be inserted for contrast, but they should not become the dominant identity.

### 3.2 Single-voltage CTA rule

Each hero, section band, card group, or nav row should contain no more than one filled primary CTA. Secondary actions should be ghost, text, muted, or outline treatments. This prevents multiple competing blue elements from flattening the hierarchy.

### 3.3 Spacing creates the premium feel

Use the spacing scale consistently. Do not crowd cards, product mockups, navigation groups, or text blocks. A section should feel intentionally open, with 72px to 96px vertical padding on desktop and 32px to 48px on mobile.

### 3.4 Product visuals should explain, not decorate

Dashboard mockups, workflow diagrams, data tiles, screenshots, and product UI visuals should support the adjacent copy. Avoid decorative visuals that do not clarify the product story.

### 3.5 Interactions should be subtle and complete

Every interactive element must define default, hover, focus-visible, active, disabled, loading, and error states. Hover states should use color depth, underline, opacity, or light movement. Do not use exaggerated scaling, bouncing, spinning, or parallax.

### 3.6 Token-first implementation

Design and build with semantic tokens. Component guidance must reference tokens rather than hard-coded local values. Raw hex values are permitted in token definitions only.

## 4. Design tokens and foundations

## 4.1 Color system

### Core palette

| Token | Value | Role |
|---|---:|---|
| `--background` | `#171721` | Primary dark canvas |
| `--foreground` | `#EDEDF3` | Primary text on dark canvas |
| `--card` | `#20212d` | Elevated dark cards and product panels |
| `--card-alt` | `#1e1e2a` | Alternative elevated dark surface |
| `--secondary` | `#323649` | Muted interactive and secondary dark surfaces |
| `--primary` | `#5266EB` | Primary action, selected states, charts, focus anchor |
| `--primary-hover` | `#4354c8` | Primary CTA hover |
| `--primary-active` | `#3442a6` | Primary CTA pressed/active |
| `--focus` | `#9CB4E8` | Focus rings and soft interactive highlights |
| `--muted-foreground` | `#a1a1aa` | Secondary dark-canvas text |
| `--text-tertiary` | `#C3C3CC` | Captions, metadata, disabled copy on dark |
| `--surface-light` | `#FFFFFF` | Light contrast sections and light cards |
| `--text-dark` | `#171721` | Primary text on light surfaces |
| `--text-subdued-dark` | `#535461` | Secondary text on light surfaces |
| `--border` | `#323649` | Dark-mode borders |
| `--border-light` | `#e4e4e7` | Light-mode borders and inputs |
| `--destructive` | `#ef4444` | Error/destructive state |

### Color role rules

- `--primary` must be reserved for primary CTAs, active states, selected tabs, meaningful highlights, focus anchors, and the most important chart series.
- `--focus` may be used for focus rings, soft hover overlays, and secondary highlights. It must not become the primary CTA fill.
- `--background` and `--card` must carry the dark-first identity.
- Light surfaces must be used intentionally for contrast or complex content, not as the default page background.
- Pure black can appear only where the source Mercury extraction used it for maximum contrast sections; the preferred root canvas is `#171721`.
- Body text on dark surfaces must use `#EDEDF3`, `#FFFFFF`, `#C3C3CC`, or `#a1a1aa` depending on hierarchy.
- Body text on light surfaces must use `#171721`, `#272735`, or `#535461`.
- All color pairings must pass WCAG 2.2 AA contrast requirements.

### Chart palette

Charts should feel integrated into the UI rather than like a separate analytics package.

| Token | Value | Use |
|---|---:|---|
| `--chart-1` | `#5266EB` | Primary data series |
| `--chart-2` | `#323649` | Baseline, muted comparison, grid-adjacent data |
| `--chart-3` | `#10b981` | Positive state or third series |
| `--chart-4` | `#f59e0b` | Warning, pending, fourth series |
| `--chart-5` | `#06b6d4` | Informational, fifth series |

Charts must use labels, tooltips, legends, or data tables. Do not rely on color alone.

## 4.2 Typography

The visual target is Mercury-like typography: proprietary Arcadia/Arcadia Display where licensed, with Inter as the implementation fallback. The supplied CSS imports Inter, so Inter is the practical default unless licensed Mercury-like typefaces are available.

### Font stacks

```css
--font-body: Inter, system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif;
--font-heading: Inter, system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif;
--font-display-preferred: "Arcadia Display", Inter, system-ui, sans-serif;
--font-body-preferred: "Arcadia", Inter, system-ui, sans-serif;
```

### Type scale

| Role | Size | Weight | Line height | Use |
|---|---:|---:|---:|---|
| Display XL | 64px | 400 | 70px | Large atmospheric hero headline |
| H1 | 49px | 480 | 54px | Standard page hero headline |
| H2 | 42px | 480 | 48px | Major section heading |
| H3 | 28px | 480 | 34px | Subsection heading, feature heading |
| H4 | 21px | 480 | 25px | Card heading, large body emphasis |
| Body large | 21px | 480 | 25px | Hero body, intro copy, testimonial lead-in |
| Body | 16px | 400 | 24px | Standard paragraph text |
| UI strong | 16px | 420 | 24px | Nav links, inputs, high-emphasis labels |
| Small UI | 14px | 420 | 20px | Secondary buttons, compact links, helper labels |
| Caption | 12px | 480 | 17px | Fine print, badges, metadata |

### Typography rules

- Headings should be confident and spacious, not overly tight.
- Do not use negative tracking as a default. Use normal or slightly positive spacing for large display text when the font allows it.
- Body text should not exceed 60-70 characters per line.
- Use weight changes sparingly: 400 for standard body, 420 for UI emphasis, 480 for display emphasis.
- Do not use all caps for long labels. All caps may be used only for short eyebrows or metadata.
- Avoid dense paragraph blocks. Break content into short paragraphs, feature lists, accordions, or comparison cards.

### Responsive type behavior

| Role | Desktop | Tablet | Mobile |
|---|---:|---:|---:|
| Display XL | 64px / 70px | 56px / 62px | 40px / 46px |
| H1 | 49px / 54px | 44px / 50px | 36px / 42px |
| H2 | 42px / 48px | 36px / 42px | 30px / 36px |
| H3 | 28px / 34px | 26px / 32px | 24px / 30px |
| Body large | 21px / 25px | 20px / 26px | 18px / 26px |
| Body | 16px / 24px | 16px / 24px | 16px / 24px |

## 4.3 Spacing and layout rhythm

Use a 4px base scale with a Mercury-like preference for large open section spacing.

| Token | Value | Use |
|---|---:|---|
| `--space-1` | 4px | Icon nudges, hairline gaps |
| `--space-2` | 8px | Tight inline spacing |
| `--space-3` | 12px | Form control gaps, compact groups |
| `--space-4` | 16px | Standard padding, nav spacing |
| `--space-5` | 20px | Button horizontal padding, form inset |
| `--space-6` | 24px | Component groups, card grid gaps |
| `--space-8` | 32px | Card padding, medium section gaps |
| `--space-10` | 40px | Major component separation |
| `--space-12` | 48px | Mobile section padding, split layouts |
| `--space-16` | 64px | Desktop subsection padding |
| `--space-18` | 72px | Hero spacing and large vertical rhythm |
| `--space-24` | 96px | Large desktop section padding |

### Spacing rules

- Desktop sections should use 72px-96px vertical padding.
- Mobile sections should use 32px-48px vertical padding.
- Cards should use 24px-32px internal padding.
- Component grids should use 24px gaps by default.
- Hero content should breathe: avoid placing headline, body, form, and product visual too tightly together.
- Do not use arbitrary values like 18px, 27px, 35px, or 52px unless a source component requires it and the value is promoted to a named token.

## 4.4 Grid and container

### Container widths

| Container | Max width | Use |
|---|---:|---|
| `container-page` | 1440px | Full site shell and wide compositions |
| `container-content` | 1200px | Standard marketing content |
| `container-readable` | 760px | Text-heavy content |
| `container-narrow` | 640px | Forms, focused CTAs, modal copy |

### Grid rules

- Use a 12-column grid on desktop with 16px gutters.
- Use a 2-column layout on tablet only where content naturally pairs with media.
- Use a single column on mobile.
- Hero and major media sections may bleed to the viewport edge when it supports the atmospheric composition.
- Product visuals may use `position: relative` and absolute decorative layers, but must remain responsive and accessible.

## 4.5 Radius and shape

Mercury's geometry contrasts soft, continuous controls with flat or sharp content surfaces.

| Token | Value | Use |
|---|---:|---|
| `--radius-none` | 0px | Full-width sections, most cards, large product containers |
| `--radius-xs` | 4px | Focus outlines, small links, minor UI parts |
| `--radius-sm` | 8px | Product mockup chrome, small panels, popovers |
| `--radius-md` | 32px | Secondary buttons, input shells, soft control groups |
| `--radius-lg` | 40px | Primary CTA pills |
| `--radius-xl` | 999px | Badges, avatars, fully pill-shaped controls |

### Shape rules

- Primary buttons must be pill-shaped.
- Attached form controls should use half-pill radii: input left side rounded, button right side rounded.
- Cards can be flat and square-edged when they live inside strong dark sections.
- Product mockups may use 8px radius to communicate software chrome.
- Avoid mixing many radii in one section.

## 4.6 Elevation and shadow

Mercury-like depth is subtle. Dark surfaces should rely primarily on tonal contrast, not drop shadows.

| Level | Treatment | Use |
|---|---|---|
| None | `box-shadow: none` | Dark cards, transparent containers, product bands |
| Subtle | `rgba(86, 86, 118, 0.1) 0px 0px 6px 0px` | Dark nav, sticky header, small floating dark surfaces |
| Medium | `rgba(28,28,35,.02) 0 10px 16px, rgba(28,28,35,.04) 0 6px 10px, rgba(28,28,35,.09) 0 0 3px` | Light cards, dropdowns, modals on light surfaces |
| Deep | `rgba(0,0,0,.05) 0 0 3px, rgba(0,0,0,.05) 0 8px 12px, rgba(0,0,0,.05) 0 12px 20px` | Prominent overlays, large floating panels |

### Elevation rules

- Do not use heavy shadows on the dark canvas.
- Use color contrast between `#171721`, `#20212d`, and `#323649` to create layers.
- Light cards may use the medium layered shadow.
- Hovering cards should not scale dramatically. A slight border change, shadow shift, or background shift is enough.

## 4.7 Motion

Motion should be calm, precise, and accessible.

| Token | Value | Use |
|---|---:|---|
| `--duration-instant` | 150ms | Focus, hover color shifts, link underlines |
| `--duration-fast` | 300ms | Accordions, small fades, panel reveals |
| `--duration-normal` | 500ms | Hero media fade-ins, section entry animations |
| `--ease-standard` | `cubic-bezier(0.2, 0.7, 0.2, 1)` | Default UI motion |
| `--ease-in-out` | `cubic-bezier(0.4, 0, 0.2, 1)` | Accordions and reversible motion |

### Motion rules

- Use fade and subtle vertical translation for entrances.
- Use `transition: color`, `background-color`, `border-color`, `opacity`, and `transform` sparingly.
- Do not use bounce, elastic, rotation, aggressive scale, or parallax.
- Honor `prefers-reduced-motion: reduce` by disabling non-essential motion and keeping state changes immediate.

## 5. CSS implementation baseline

The supplied CSS is a good implementation baseline because it maps Tailwind theme tokens to Mercury-like values and uses Inter as the buildable font fallback. Keep the token architecture, but treat the dark theme as the primary visual identity.

### Required CSS posture

- Root tokens must support light and dark modes.
- The marketing site should default to dark styling for the main hero and high-emphasis sections.
- `--primary` must remain `#5266EB`.
- Dark mode `--background` must remain `#171721`.
- Dark mode `--foreground` must remain `#EDEDF3`.
- Dark mode `--card` must remain in the `#20212d` family.
- Do not replace these values with DebtNext/TSI equivalents.

### Recommended CSS token block

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400&display=swap');

@import 'tailwindcss';

@plugin "tailwindcss-animate";

@custom-variant dark (&:is(.dark *));

body {
  margin: 0;
  padding: 0;
  display: flex;
  width: 100%;
  height: 100%;
  min-height: 100vh;
  box-sizing: border-box;
  overflow: auto;
  overscroll-behavior-x: none;
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-sidebar-ring: var(--sidebar-ring);
  --color-sidebar-border: var(--sidebar-border);
  --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
  --color-sidebar-accent: var(--sidebar-accent);
  --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
  --color-sidebar-primary: var(--sidebar-primary);
  --color-sidebar-foreground: var(--sidebar-foreground);
  --color-sidebar: var(--sidebar);
  --color-chart-5: var(--chart-5);
  --color-chart-4: var(--chart-4);
  --color-chart-3: var(--chart-3);
  --color-chart-2: var(--chart-2);
  --color-chart-1: var(--chart-1);
  --color-ring: var(--ring);
  --color-input: var(--input);
  --color-border: var(--border);
  --color-destructive: var(--destructive);
  --color-destructive-foreground: var(--destructive-foreground);
  --color-accent-foreground: var(--accent-foreground);
  --color-accent: var(--accent);
  --color-muted-foreground: var(--muted-foreground);
  --color-muted: var(--muted);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-secondary: var(--secondary);
  --color-primary-foreground: var(--primary-foreground);
  --color-primary: var(--primary);
  --color-popover-foreground: var(--popover-foreground);
  --color-popover: var(--popover);
  --color-card-foreground: var(--card-foreground);
  --color-card: var(--card);
  --font-body: var(--font-body);
  --font-heading: var(--font-heading);
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);
  --shadow-sm: var(--shadow-sm);
  --shadow: var(--shadow);
  --shadow-md: var(--shadow-md);
  --shadow-lg: var(--shadow-lg);
  --shadow-xl: var(--shadow-xl);
  --shadow-2xl: var(--shadow-2xl);
}

:root {
  --radius: 0.5rem;
  --shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
  --font-body: Inter;
  --font-heading: Inter;
  --card: #FFFFFF;
  --ring: #5266EB;
  --input: #e4e4e7;
  --muted: #f4f4f5;
  --accent: #f4f4f5;
  --border: #e4e4e7;
  --chart-1: #5266EB;
  --chart-2: #323649;
  --chart-3: #10b981;
  --chart-4: #f59e0b;
  --chart-5: #06b6d4;
  --popover: #FFFFFF;
  --primary: #5266EB;
  --sidebar: #f4f4f5;
  --secondary: #f4f4f5;
  --background: #FFFFFF;
  --foreground: #171721;
  --destructive: #ef4444;
  --sidebar-ring: #5266EB;
  --sidebar-accent: #e4e4e7;
  --sidebar-border: #e4e4e7;
  --card-foreground: #171721;
  --sidebar-primary: #5266EB;
  --muted-foreground: #71717a;
  --accent-foreground: #171721;
  --popover-foreground: #171721;
  --primary-foreground: #FFFFFF;
  --sidebar-foreground: #171721;
  --secondary-foreground: #171721;
  --destructive-foreground: #ffffff;
  --sidebar-accent-foreground: #171721;
  --sidebar-primary-foreground: #FFFFFF;
}

.dark {
  --card: #20212d;
  --ring: #5266EB;
  --input: #323649;
  --muted: #20212d;
  --accent: #323649;
  --border: #323649;
  --chart-1: #5266EB;
  --chart-2: #323649;
  --chart-3: #34d399;
  --chart-4: #fbbf24;
  --chart-5: #22d3ee;
  --popover: #20212d;
  --primary: #5266EB;
  --sidebar: #171721;
  --secondary: #323649;
  --background: #171721;
  --foreground: #EDEDF3;
  --destructive: #ef4444;
  --sidebar-ring: #5266EB;
  --sidebar-accent: #323649;
  --sidebar-border: #323649;
  --card-foreground: #EDEDF3;
  --sidebar-primary: #5266EB;
  --muted-foreground: #a1a1aa;
  --accent-foreground: #EDEDF3;
  --popover-foreground: #EDEDF3;
  --primary-foreground: #FFFFFF;
  --sidebar-foreground: #EDEDF3;
  --secondary-foreground: #EDEDF3;
  --destructive-foreground: #ffffff;
  --sidebar-accent-foreground: #EDEDF3;
  --sidebar-primary-foreground: #FFFFFF;
}

@layer base {
  * {
    @apply border-border outline-ring/50;
  }
  body {
    @apply bg-background text-foreground;
    font-family: var(--font-body);
  }
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    font-family: var(--font-heading);
  }
  html,
  body,
  #root {
    height: 100%;
    width: 100%;
    margin: 0;
    padding: 0;
    overscroll-behavior-x: none;
  }
}
```

## 6. Information architecture

The page architecture should mirror Mercury's linear marketing flow, but with DebtNext content inserted into equivalent positions.

### Global page flow

1. **Header navigation**: dark nav, logo area, primary links, secondary action, one primary CTA.
2. **Hero**: concise headline, short body copy, email/demo form or primary CTA, atmospheric/product media.
3. **Feature overview**: accordion-like core capability sections paired with product visuals.
4. **Social proof**: testimonial or logo/trust section with controlled density.
5. **Product benefit deep dives**: 2-4 feature sections explaining specific workflows.
6. **Dashboard/product proof**: large visual section showing product UI, reports, cards, or workflow states.
7. **Final CTA**: strong dark section, one dominant action, short conversion copy.
8. **Footer**: comprehensive grouped links, muted dark surface, compact legal text.

### Recommended DebtNext content mapping without changing visuals

| Mercury pattern | DebtNext content equivalent | Visual treatment |
|---|---|---|
| "Radically different banking" hero | A short, confident platform promise | Dark hero with large H1 and product media |
| Email capture + Open account | Demo request / Talk to expert | Attached pill form or single primary pill |
| Business banking modules | Platform capabilities | Accordion sections with dashboard visuals |
| Cards and payments benefits | Workflows, partners, reporting, compliance | Product-led feature cards |
| Founder testimonials | Client proof, operator quotes, outcomes | Dark testimonial cards or light contrast band |
| Apply online in 10 minutes | Request a guided walkthrough | Final dark CTA |

## 7. Section specifications

## 7.1 Header navigation

### Intent

Create immediate premium context without overloading the user. The nav should feel calm, dark, and software-native.

### Anatomy

- Left: logo/wordmark placeholder.
- Center: primary nav links, max 5 top-level items.
- Right: secondary text/ghost action and primary CTA.
- Mobile: menu button, logo, primary CTA optional depending on space.

### Visual rules

- Background: `#171721`.
- Height: 72px desktop, 64px tablet, 56px mobile.
- Padding: 16px 32px desktop, 16px 24px tablet, 12px 16px mobile.
- Text: `#EDEDF3` or `#C3C3CC`.
- Nav link hover: text shifts to `#FFFFFF`; optional underline in `#5266EB`.
- Active nav link: `#FFFFFF` text with subtle `#5266EB` indicator.
- Use exactly one filled primary CTA in the nav.

### States

- Default: subdued link text, no underline.
- Hover: brighten text and show subtle underline or opacity shift.
- Focus-visible: 2px outline using `#9CB4E8`, 2px offset.
- Active/current: white text plus primary accent indicator.
- Disabled: `#707393` or equivalent subdued text; no pointer interactions.
- Mobile open: menu panel uses `#20212d` with grouped links and large touch targets.

### Accessibility

- Header must use semantic `header` and `nav` elements.
- Mobile menu button must expose `aria-expanded`, `aria-controls`, and an accessible label.
- Keyboard users must be able to tab through links in visible order.
- Focus must not be hidden by sticky nav clipping.

## 7.2 Hero section

### Intent

Introduce the product with a confident one-line promise, short explanation, a single conversion action, and an atmospheric product visual.

### Anatomy

- Eyebrow or small qualifier, optional.
- H1 headline.
- Short body copy, 1-2 sentences.
- Primary CTA or attached email/demo form.
- Secondary text link, optional.
- Hero media: product mockup, dashboard, abstract atmospheric image, or video still.

### Visual rules

- Background: `#171721` or `#000000` only for maximum contrast moments.
- Text: H1 in `#EDEDF3` or `#FFFFFF`; body in `#C3C3CC`.
- Primary CTA: `#5266EB` fill, white text, pill radius.
- Hero should use 72px-96px vertical padding desktop.
- Product media can bleed to edges or sit inside a tonal elevated surface.
- Hero visual must not overpower the H1.
- Avoid dense feature lists in the hero.

### Recommended layout variants

1. **Centered editorial hero**: headline/body/form centered, product visual below.
2. **Split product hero**: left copy, right product mockup, atmospheric background.
3. **Full-bleed media hero**: dark overlay with copy layered above background media.

### States and behavior

- Hero media should fade in gently over 300ms-500ms.
- Form submission should show loading, success, and error states in place.
- On mobile, stack copy above media and keep CTA visible without crowding.

### Acceptance criteria

- Exactly one H1 appears on the page.
- Primary CTA is visible above the fold on desktop and mobile.
- If a form exists, every input has a programmatic label.
- Any media with meaning has alt text or an accessible description.
- Decorative media uses empty alt text or `aria-hidden="true"`.

## 7.3 Feature overview accordion

### Intent

Make a complex product feel simple by revealing one capability at a time while keeping the visual field focused.

### Anatomy

- Section eyebrow, optional.
- H2 section title.
- Accordion item list with 3-5 capabilities.
- Active item panel with description, CTA/link, and paired visual.
- Product media area that updates with active item.

### Visual rules

- Section background may be dark or light depending on surrounding rhythm.
- Active item uses `#5266EB` indicator or brighter text.
- Inactive items use subdued text.
- Dividers use `#323649` on dark or `#e4e4e7` on light.
- Transitions should animate grid row or height smoothly over 300ms.

### Interaction behavior

- Click/tap toggles accordion item.
- Enter/Space toggles focused item.
- Arrow keys may move between accordion headers if implemented as a composite widget.
- Only one item should be open at a time unless content requires comparison.
- Active item should remain open until another item is selected.

### States

- Default: inactive item title visible, body collapsed.
- Hover: title brightens, optional subtle background shift.
- Focus-visible: outline or inset ring using `#9CB4E8`.
- Active/open: title bright, body visible, visual updated.
- Disabled: subdued title, no expansion.
- Loading visual: skeleton or muted placeholder.
- Error visual: plain-language error with retry if media fails.

## 7.4 Product media and dashboard mockups

### Intent

Use product visuals to make capabilities tangible, not decorative.

### Visual rules

- Product surfaces should use `#20212d`, `#1e1e2a`, and `#323649` with `#EDEDF3` text.
- Charts should use `#5266EB` as the primary series.
- UI chrome can use 8px radius; primary controls within mockups can use pill radii.
- Shadows should be minimal on dark canvas.
- Screenshots should be cropped intentionally and optimized for responsive display.

### Content rules

- Use realistic but anonymized data.
- Do not expose real client names, personal data, account numbers, or sensitive operational details.
- Use labels that a buyer can understand at a glance.
- Prefer high-level visual structure over tiny unreadable tables.

### Responsive behavior

- Desktop: product visual may sit beside copy or span full width.
- Tablet: maintain aspect ratio and reduce surrounding padding.
- Mobile: stack below copy; allow horizontal scroll only for intentional product table demos.

## 7.5 Social proof section

### Intent

Create trust without clutter or a logo wall that feels generic.

### Anatomy

- H2 or short trust statement.
- Testimonial quote or client/operator proof point.
- Person/company attribution if available.
- Optional portrait, brand-safe illustration, or company category label.
- Optional metrics row.

### Visual rules

- Use a quiet section. Avoid competing with the hero.
- Testimonial cards on dark should use `#20212d` and subdued borders.
- Testimonial cards on light should use white surface, subtle border, and medium layered shadow.
- Quotes should be large enough to feel editorial, not like body copy.

### Accessibility

- Carousels, if used, must be pauseable and keyboard-operable.
- Do not auto-advance testimonials unless motion can be paused and reduced-motion preferences are honored.
- Quotes must be real or clearly marked as placeholders during development.

## 7.6 Benefit deep-dive sections

### Intent

Translate product capabilities into practical outcomes through one concept per section.

### Anatomy

- H2 benefit headline.
- 1-2 sentence explanation.
- Product visual, diagram, or proof module.
- Short list of supporting features.
- One CTA or text link.

### Visual rules

- Alternate rhythm: dark -> light -> dark or dark -> elevated dark -> light.
- Keep each section visually distinct but token-consistent.
- Use product visuals as anchors rather than large decorative illustrations.
- Use one CTA hierarchy per band.

### Recommended patterns

- **Split feature**: text left, media right.
- **Stacked proof**: copy above three compact data/product cards.
- **Accordion + visual**: capability list paired with dynamic mockup.
- **Process strip**: 3-5 steps with thin dividers and subtle blue active state.

## 7.7 Final CTA

### Intent

End with a confident, low-friction conversion moment.

### Anatomy

- H2 headline.
- Short body copy.
- Primary CTA.
- Optional secondary link.
- Optional short reassurance text.

### Visual rules

- Background should be dark canvas or elevated dark surface.
- Use one filled primary CTA only.
- Copy should be short and direct.
- Avoid long forms at the bottom unless the site goal requires it.

### States

- Button loading state must prevent duplicate submissions.
- Success state should confirm the next step.
- Error state should explain what happened and how to recover.

## 7.8 Footer

### Intent

Provide comprehensive navigation without breaking the premium tone.

### Anatomy

- Logo/wordmark placeholder.
- Grouped footer links.
- Legal links.
- Copyright.
- Optional newsletter/demo CTA, but not if it competes with the final CTA.

### Visual rules

- Background: `#171721` or `#000000`.
- Text: `#C3C3CC`; hover text `#FFFFFF`.
- Footer link groups should use tight but readable spacing.
- Footer must be visually quieter than the hero.

## 8. Component-level rules

## 8.1 Buttons

### Primary button

Use for the single dominant action in a nav row, hero, CTA band, form, or high-priority card.

```css
.button-primary {
  min-height: 40px;
  padding: 0 20px;
  border-radius: 40px;
  background: #5266EB;
  color: #FFFFFF;
  font-size: 16px;
  line-height: 16px;
  font-weight: 420;
  border: 0;
}
```

#### States

- Default: `#5266EB` fill, white text.
- Hover: `#4354c8` fill; optional `translateY(-1px)` only on pointer devices.
- Focus-visible: `outline: 2px solid #9CB4E8; outline-offset: 2px`.
- Active: `#3442a6` fill; optional `translateY(1px)`.
- Disabled: `rgba(82,102,235,.4)` fill and `rgba(255,255,255,.6)` text; no pointer events.
- Loading: preserve width, show spinner or progress label, set `aria-busy="true"`.
- Error: do not encode error only in the button. Show an adjacent error message.

### Secondary dark button

Use for secondary actions on dark surfaces.

```css
.button-secondary-dark {
  min-height: 32px;
  padding: 0 12px;
  border-radius: 32px;
  background: rgba(156, 180, 232, 0.2);
  color: #EDEDF3;
  font-size: 14px;
  line-height: 14px;
  font-weight: 420;
  border: 0;
}
```

#### States

- Default: soft blue overlay.
- Hover: `rgba(156,180,232,.35)` and white text.
- Focus-visible: 2px `#9CB4E8` outline with 2px offset.
- Active: darker overlay or slight pressed position.
- Disabled: 40% opacity.

### Ghost button / text action

Use when a second action must exist near a primary CTA.

- Background: transparent.
- Text: `#EDEDF3` on dark, `#171721` on light.
- Hover: underline with `#5266EB` and brighten text.
- Focus-visible: outline or underline plus focus ring.
- Must not visually compete with a filled primary CTA.

## 8.2 Links

### Inline link on dark

- Color: `#EDEDF3` or `#FFFFFF` depending on hierarchy.
- Decoration: none by default; underline on hover.
- Hover underline color: `#5266EB`.
- Focus-visible: 2px `#9CB4E8` outline or high-contrast underline/ring.

### Inline link on light

- Color: `#171721` for standard links or `#5266EB` for high emphasis.
- Hover: `#5266EB` and underline.
- Focus-visible: 2px `#5266EB` outline with offset.

### Link rules

- Link text must describe the destination or action.
- Avoid vague links like "Learn more" when multiple links appear in a list. Use "Explore workflows" or "View reporting features" style labels.
- Links must have a visible hover and focus state.

## 8.3 Forms and inputs

### Attached email/demo form

This is the Mercury-like hero conversion pattern: a rounded input attached to a compact action button.

```css
.form-attached {
  display: flex;
  align-items: stretch;
  gap: 0;
}

.form-attached input {
  min-height: 46px;
  flex: 1;
  padding: 0 0 0 20px;
  border-radius: 32px 0 0 32px;
  border: 1px solid #EDEDF3;
  background: transparent;
  color: #EDEDF3;
  font-size: 16px;
  font-weight: 420;
}

.form-attached button {
  min-width: 46px;
  min-height: 46px;
  border-radius: 0 32px 32px 0;
  background: #5266EB;
  color: #FFFFFF;
}
```

### Input states

- Default: transparent background, visible border.
- Hover: border shifts to `#9CB4E8`.
- Focus-visible: border `#5266EB`; focus ring or background tint `rgba(82,102,235,.05)`.
- Active/filled: preserve text contrast and border clarity.
- Disabled: lower opacity, no pointer events, clear disabled cursor.
- Loading: show inline spinner or submit button loading state.
- Error: border `#ef4444`; adjacent message with `role="alert"` or connected `aria-describedby`.

### Form accessibility

- Every input must have a visible or programmatic label.
- Placeholder text must not be the only label.
- Error messages must be programmatically associated with inputs.
- Submit buttons must prevent duplicate submissions while loading.
- Minimum touch target must be 44px by 44px.

## 8.4 Cards

### Dark card

Use for product modules, feature groups, and dark-surface content blocks.

- Background: `#20212d` or `#1e1e2a`.
- Text: `#EDEDF3` primary, `#C3C3CC` secondary.
- Padding: 32px desktop, 24px tablet/mobile.
- Radius: 0px for large content cards; 8px for product chrome or compact floating panels.
- Shadow: none by default.
- Border: optional 1px `#323649`.

### Light card

Use sparingly for contrast sections or long-form readability.

- Background: `#FFFFFF`.
- Text: `#171721` primary, `#535461` secondary.
- Padding: 32px.
- Radius: 0px unless the component is a floating UI panel.
- Border: 1px `#EBEBEB`.
- Shadow: medium layered light-card shadow.

### Card states

- Default: stable surface, no excessive ornamentation.
- Hover: border brightens or shadow increases slightly.
- Focus-visible: focus ring if the whole card is interactive.
- Active: subtle pressed state.
- Disabled: opacity reduction and no pointer behavior.
- Loading: skeleton state using card surface tones.
- Error: inline message and retry action if content fails.

## 8.5 Accordions

### Anatomy

- Accordion root.
- Header button.
- Title.
- Optional short preview.
- Content panel.
- Optional media binding.

### Rules

- Header must be a button, not a div.
- `aria-expanded` must reflect state.
- `aria-controls` must reference the content panel.
- Content panel must be reachable by assistive technologies when expanded.
- Animation should use `grid-template-rows`, height, or opacity over 300ms.
- Reduced-motion users should receive immediate open/close.

## 8.6 Navigation menus

### Desktop behavior

- Hover may reveal dropdowns only if they are also keyboard accessible.
- Dropdowns should use `#20212d` on dark nav or white if the page is in a light band.
- Dropdown panels should not exceed 2 columns unless content requires it.
- Delay hover close slightly to prevent accidental dismissal.

### Mobile behavior

- Mobile nav opens as a panel or drawer.
- Links must be at least 44px tall.
- Focus should move into the menu when opened and return to the trigger when closed.
- Escape key should close the menu.

## 8.7 Badges and chips

- Use 999px radius.
- Keep text short.
- Background on dark: `rgba(156,180,232,.2)`.
- Text on dark: `#EDEDF3` or `#FFFFFF`.
- Active badge may use `#5266EB`, but avoid placing multiple primary-filled badges near a primary CTA.

## 8.8 Tables and dense data

Mercury-like marketing pages should avoid dense tables unless they are product proof. If needed:

- Use dark elevated surfaces with subtle row dividers.
- Keep row height at least 44px.
- Use sticky headers only if the table scrolls.
- Provide sorting states and keyboard-accessible controls.
- On mobile, convert dense tables into stacked cards or horizontal scroll with clear affordance.

## 9. Responsive system

Anchored to 360px (one notch below iPhone SE) and 1440px viewports. Components use container queries to react to their container, not the viewport, so a primitive composes correctly when nested.

### 9.1 Fluid type scale (Utopia)

Formula: `clamp(min_rem, calc(intercept_rem + slope_vw), max_rem)` where `slope = (max_px - min_px) / 10.8` and `intercept_rem = (min_px - slope * 3.6) / 16`.

Anchors: 360px / 1440px viewport.

| Token | min → max (px) | clamp |
|---|---|---|
| --text-display-xl | 40 → 64 | clamp(2.5rem, calc(2rem + 2.2222vw), 4rem) |
| --text-display-lg | 36 → 49 | clamp(2.25rem, calc(1.9792rem + 1.2037vw), 3.0625rem) |
| --text-h1 | 36 → 49 | same as display-lg |
| --text-h2 | 30 → 42 | clamp(1.875rem, calc(1.625rem + 1.1111vw), 2.625rem) |
| --text-h3 | 24 → 28 | clamp(1.5rem, calc(1.4167rem + 0.3704vw), 1.75rem) |
| --text-h4 / --text-body-lg | 18 → 21 | clamp(1.125rem, calc(1.0625rem + 0.2778vw), 1.3125rem) |
| --text-body-md / --text-body-strong | 15 → 16 | clamp(0.9375rem, calc(0.9167rem + 0.0926vw), 1rem) |
| --text-body-sm | 13 → 14 | clamp(0.8125rem, calc(0.7917rem + 0.0926vw), 0.875rem) |
| --text-caption | 12 (static) | 0.75rem |

The atmospheric hero `clamp(2.75rem, 8vw, 7rem)` is a documented one-off escalation; do not extend that ramp to other tokens.

### 9.2 Container queries

Three named containers are available globally:

- `container-section` — top-level sections
- `container-card` — card grids and BenefitSplit
- `container-form` — AttachedForm and DemoForm

Children use Tailwind v4 variants: `@md/section:flex-row`, `@sm/card:grid-cols-2`, etc.

### 9.3 Touch targets

44px floor (iOS HIG). Apply via `min-h-touch min-w-touch` or `min-size-touch` on all `<a>` and `<button>` in interactive surfaces.

### 9.4 Safe-area-insets

Fixed nav uses `env(safe-area-inset-top)`. FinalCTA and bottom sticky CTAs use `env(safe-area-inset-bottom)`. DemoForm submit row honors `env(safe-area-inset-bottom)`.

### 9.5 Section padding

- `--space-section-mobile: 48px`
- `--space-section-tablet: 56px`
- `--space-section-desktop: 72px`

`SectionContainer` pipes these through automatically.

### 9.6 Reduced motion

Every GSAP/Framer/CSS transition has a quiet fallback under `prefers-reduced-motion: reduce`. No exceptions.

### 9.7 Primitive responsive contracts

| Primitive | Behavior |
|---|---|
| `FeatureAccordion` | Single column below 1024px container width. Visual pane renders as `order-2` (below the accordion list) at narrow widths; side-by-side `[1fr_1.1fr]` grid at ≥1024px container width. Triggers ≥44px (`min-h-touch`). |
| `BenefitSplit` | Vertical (text → media) below 768px container width. `reverse` prop ignored at narrow widths; takes effect at `@md/section` and above. |

## 10. Content and tone standards

The content may be DebtNext-specific, but the tone should fit the Mercury-like visual shell: concise, confident, calm, and product-led.

### Tone attributes

- Clear, direct, and high-trust.
- Product-specific without dense jargon.
- Benefit-led but not hype-heavy.
- Short sentences and concrete nouns.
- Confident claims supported by product proof, customer proof, or measurable evidence.

### Copy rules

- Use sentence case for headlines and UI labels.
- Keep hero headline short enough to scan in one breath.
- Avoid generic B2B phrases like "unlock your potential," "seamless solutions," or "transform your business" unless made specific.
- Prefer concrete action labels: "Request a demo," "Explore the platform," "See how it works," "Talk to an expert."
- Use one primary CTA label consistently across a page.
- Do not use exclamation points as a default tone device.
- Do not overload sections with bullets; 3-5 bullets maximum per component.

### Example copy patterns

These are structural examples, not final required copy.

| Pattern | Example |
|---|---|
| Hero headline | "Recovery operations, unified." |
| Hero body | "Coordinate partners, workflows, reporting, and compliance activity from a single operating layer." |
| Primary CTA | "Request a demo" |
| Secondary CTA | "Explore the platform" |
| Feature heading | "See every portfolio in motion" |
| Benefit copy | "Track placements, performance, exceptions, and outcomes without stitching together disconnected reports." |
| Final CTA | "Build a clearer recovery operation." |

## 11. Imagery and media

### Visual direction

Use atmospheric, premium, restrained imagery and product visuals. Mercury's design often uses dark cinematic tone, spacious layouts, and product interface moments that feel embedded in the environment.

### Rules

- Prefer product mockups, dashboard panels, workflow diagrams, abstract atmospheric imagery, and subtle gradient washes.
- Do not use generic stock-office photography as a primary hero device.
- Do not use cartoon illustrations unless they are heavily restrained and match the dark fintech feel.
- Do not use warm consumer gradients, playful patterns, or bright multi-color brand collages.
- Keep imagery cool, crisp, and low-noise.
- Use responsive images with multiple source sizes.
- Lazy-load non-critical media.
- Critical hero media should be optimized and preloaded only when it materially improves LCP.

### Alt text

- Meaningful product screenshots need descriptive alt text.
- Decorative atmospheric images should use empty alt text.
- Charts and diagrams need text summaries near the visual or in `aria-describedby`.

## 12. Accessibility requirements

Target WCAG 2.2 AA.

### Global requirements

- All interactive controls must be keyboard-operable.
- All interactive controls must have visible focus states.
- Text contrast must meet 4.5:1 for normal text and 3:1 for large text/UI components.
- Touch targets must be at least 44px by 44px.
- Form controls must have labels and error descriptions.
- Motion must respect `prefers-reduced-motion`.
- Navigation must be semantic and screen-reader friendly.
- Headings must follow a logical hierarchy.
- Do not rely on color alone to communicate state.

### Testable acceptance criteria

- A keyboard-only user can complete the primary conversion flow from landing page to form submission.
- Focus order matches visual reading order.
- No focus indicator is clipped, hidden, or removed.
- All form errors are announced or programmatically connected to the field.
- All images have appropriate alt text treatment.
- Accordions expose correct expanded/collapsed state.
- Mobile nav can open, close, and navigate by keyboard and screen reader.
- Reduced-motion mode disables non-essential entrance animations.
- Automated accessibility checks show no critical violations.

## 13. SEO and technical implementation

### Metadata

- Use one H1 per page.
- Title tags should be specific and under roughly 60 characters when possible.
- Meta descriptions should be descriptive and conversion-aware.
- Open Graph metadata must be provided for key pages.
- Use canonical URLs.
- Use structured data only when content supports it.

### Performance

- Target excellent Core Web Vitals.
- Avoid massive unoptimized hero videos.
- Use responsive image sizes.
- Lazy-load below-fold imagery.
- Keep animation lightweight.
- Avoid excessive client-side JavaScript for static marketing content.

### Analytics and conversion events

Track interactions without changing the design system:

- Primary CTA clicks.
- Secondary CTA clicks.
- Form starts.
- Form submissions.
- Form errors.
- Accordion interactions.
- Video/media plays.
- Scroll depth.
- Demo/contact page transitions.

## 14. Anti-patterns and prohibited implementations

### Visual anti-patterns

- Replacing `#5266EB` with another brand blue.
- Replacing the dark canvas with a predominantly white enterprise layout.
- Using square corporate buttons instead of Mercury-like pills.
- Using many primary-filled buttons in the same section.
- Adding gradients, colors, icon styles, or type systems from DebtNext/TSI branding.
- Using dense text blocks without visual hierarchy.
- Overusing shadows on dark surfaces.
- Using playful icons, emoji, or decorative shapes that break the premium fintech tone.
- Adding arbitrary spacing values outside the scale.
- Mixing too many radii in one component group.

### Interaction anti-patterns

- Hiding focus outlines.
- Making hover-only menus inaccessible to keyboard users.
- Auto-playing motion that cannot be paused or reduced.
- Using color alone for validation errors or chart meaning.
- Scaling cards dramatically on hover.
- Triggering layout shift when accordions open.

### Content anti-patterns

- Generic claims without proof.
- Overlong hero headlines.
- Multiple competing CTAs.
- Vague button labels.
- Dense compliance/product jargon in above-the-fold copy.
- Testimonials without attribution or placeholder disclosure.

## 15. Migration notes from the previous draft

The previous draft merged DebtNext/TSI design choices with Mercury-like structure. This version intentionally removes those visual decisions.

### Removed

- TSI dark blue, bright blue, green, orange, and tint palette.
- Poppins/Calibri typography guidance.
- TSI square-corner brand geometry.
- TSI iconography and illustration rules.
- TSI marketing-site rhythm and white/tint/dark section sequence.
- TSI-specific brand voice constraints.

### Preserved

- DebtNext as the content and product target.
- The need for a single comprehensive DESIGN.md file.
- Implementation-readiness, accessibility requirements, component states, responsive rules, and QA gates.

### Replaced with Mercury-like equivalents

- Dark canvas: `#171721`.
- Primary action: `#5266EB`.
- Dark elevated panels: `#20212d`, `#1e1e2a`, `#323649`.
- Light contrast surfaces: `#FFFFFF`, `#f4f4f5`.
- Type: Arcadia-like hierarchy with Inter fallback.
- Shape: pill CTAs, 32px input/control radii, subtle UI chrome.
- Motion: calm fades and accordion transitions.

## 16. Build order

1. **Token setup**: Add CSS variables, Tailwind theme mapping, dark mode, typography, spacing, radii, shadows, and motion tokens.
2. **Global shell**: Build page container, dark body, header nav, footer, and base layout grid.
3. **Hero**: Implement H1, body copy, primary CTA/form, and responsive media.
4. **Feature accordion**: Build accessible accordion with paired product visual state.
5. **Product media system**: Create reusable dashboard/mockup card components.
6. **Benefit sections**: Build split sections and proof cards.
7. **Social proof**: Add testimonial/proof pattern with accessible carousel only if necessary.
8. **Final CTA**: Build a dark conversion band with one primary action.
9. **Responsive pass**: Tune mobile stacking, text scale, touch targets, and product media behavior.
10. **Accessibility pass**: Keyboard, screen reader, contrast, labels, focus, reduced motion.
11. **Performance pass**: Optimize images, remove unused JS, test Core Web Vitals.
12. **Content pass**: Replace placeholder copy with DebtNext-specific copy while preserving visual rules.

## 17. QA checklist

### Foundation QA

- [ ] No DebtNext/TSI visual tokens are present in the color, typography, iconography, or radius system.
- [ ] `#5266EB` is the primary action color.
- [ ] `#171721` is the primary dark canvas.
- [ ] `#EDEDF3` is the primary dark-canvas text color.
- [ ] Inter is configured as the practical fallback font.
- [ ] Spacing uses the defined 4px scale.
- [ ] Pill-shaped CTAs are used consistently.

### Component QA

- [ ] Buttons include default, hover, focus-visible, active, disabled, loading, and error-adjacent behavior.
- [ ] Inputs include labels, focus state, error state, disabled state, and loading/submission state.
- [ ] Accordions use semantic buttons and correct ARIA state.
- [ ] Cards do not use excessive shadows on dark backgrounds.
- [ ] Links are descriptive and have hover/focus states.
- [ ] Navigation is keyboard-accessible on desktop and mobile.

### Page QA

- [ ] The page has exactly one H1.
- [ ] The hero has one dominant CTA.
- [ ] Each major section has one primary purpose.
- [ ] No section contains competing primary buttons.
- [ ] Product visuals remain legible and responsive.
- [ ] Footer links are grouped and accessible.

### Accessibility QA

- [ ] Keyboard-only users can complete the main conversion path.
- [ ] Focus order matches visual order.
- [ ] Focus indicators are visible and not clipped.
- [ ] All text meets WCAG 2.2 AA contrast.
- [ ] All touch targets are at least 44px by 44px.
- [ ] Reduced-motion preferences are honored.
- [ ] Images and diagrams have correct alt text or descriptions.
- [ ] Form errors are programmatically associated with fields.

### Performance QA

- [ ] Hero media is optimized and does not harm LCP.
- [ ] Below-fold images are lazy-loaded.
- [ ] No unnecessary client-side JS is shipped for static sections.
- [ ] CSS tokens are centralized and not duplicated locally.
- [ ] No layout shift occurs when accordions, menus, or media load.

## 18. Agent implementation prompt

Use this prompt when asking an AI coding agent to generate the site from this DESIGN.md:

```text
Build a Mercury-style marketing website for DebtNext.com using the attached DESIGN.md as the design source of truth. Preserve Mercury-like visual choices: dark canvas #171721, primary action #5266EB, off-white text #EDEDF3, elevated dark cards #20212d/#1e1e2a, soft pill CTAs, attached rounded forms, generous whitespace, subtle motion, and one filled primary CTA per horizontal band. Do not use DebtNext/TSI brand visual elements, colors, typography, square-corner button rules, or iconography. Use Inter as the implementation font fallback. Use semantic HTML, accessible keyboard interactions, responsive layouts, and explicit states for every interactive component. Replace placeholder content with DebtNext product messaging only after the visual system is implemented.
```
