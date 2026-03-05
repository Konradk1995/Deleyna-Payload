# Deleyna Design System

> Chrome-inspired, editorial aesthetic with metallic silver and copper accents, glassmorphism, and liquid-metal visual elements.

---

## Color Tokens (RGB)

### Core Palette

| Token | Light | Dark | Usage |
|---|---|---|---|
| `--background` | `255 255 255` | `10 10 10` | Page background |
| `--foreground` | `10 10 10` | `250 250 250` | Primary text |
| `--card` | `255 255 255` | `23 23 23` | Card surfaces |
| `--card-foreground` | `10 10 10` | `250 250 250` | Card text |
| `--primary` | `10 10 10` | `250 250 250` | Primary actions |
| `--primary-foreground` | `255 255 255` | `10 10 10` | Text on primary |
| `--secondary` | `245 245 245` | `38 38 38` | Secondary surfaces |
| `--secondary-foreground` | `10 10 10` | `250 250 250` | Text on secondary |
| `--muted` | `245 245 245` | `38 38 38` | Muted backgrounds |
| `--muted-foreground` | `115 115 115` | `163 163 163` | Subdued text |
| `--accent` | `196 149 106` | `196 149 106` | Accent (copper) |
| `--accent-foreground` | `255 255 255` | `10 10 10` | Text on accent |
| `--accent-hover` | `166 123 79` | `216 175 140` | Accent hover state |
| `--destructive` | `239 68 68` | `239 68 68` | Error/destructive |
| `--success` | `34 197 94` | `34 197 94` | Success states |
| `--border` | `229 229 229` | `51 51 51` | Borders |
| `--input` | `229 229 229` | `38 38 38` | Input borders |
| `--ring` | `196 149 106` | `196 149 106` | Focus rings |

### Chrome / Metallic Tokens

| Token | Light | Dark | Usage |
|---|---|---|---|
| `--chrome-start` | `220 220 220` | `240 240 240` | Gradient start |
| `--chrome-mid` | `160 160 160` | `200 200 200` | Gradient mid |
| `--chrome-end` | `100 100 100` | `160 160 160` | Gradient end |
| `--copper` | `196 149 106` | `196 149 106` | Copper accent (#C4956A) |
| `--copper-glow` | `216 175 140` | `216 175 140` | Copper glow effect |

### Talent Card Palette

| Token | Light | Dark | Usage |
|---|---|---|---|
| `--talent-sage` | `197 212 168` | `145 165 120` | Green-sage cards |
| `--talent-peach` | `232 168 109` | `200 130 85` | Peach/warm cards |
| `--talent-cream` | `232 220 200` | `200 185 155` | Cream cards |

All colors use RGB format with Tailwind's `<alpha-value>` syntax:
```
rgb(var(--border) / <alpha-value>)
```

---

## Typography

### Font Families (Fontshare, self-hosted WOFF2)

| Token | Font | Weights | Fallback | Usage |
|---|---|---|---|---|
| `--font-sans` | **Satoshi** | 400, 500, 700 | system-ui, sans-serif | Body text, UI elements |
| `--font-display` | **Zodiak** | 400, 700 | Georgia, serif | Headings, titles, numbers |

Loaded via `next/font/local` in `FrontendRootDocument.tsx` with `display: 'swap'`.

Font files: `src/app/(frontend)/fonts/*.woff2` (~120KB total)

### Tailwind Classes

| Class | Definition |
|---|---|
| `font-sans` | `var(--font-sans), system-ui, sans-serif` |
| `font-display` | `var(--font-display), Georgia, serif` |

### CSS Utility Classes

| Class | Properties |
|---|---|
| `.font-display` | `font-family: var(--font-display)` |
| `.font-display-tight` | `font-family: var(--font-display); letter-spacing: -0.02em` |
| `.headline-sexy` | `font-family: var(--font-display); letter-spacing: -0.025em; font-weight: 700; line-height: 1.05` |

### Heading Sizes

| Level | Classes | Typical Size |
|---|---|---|
| Page Hero H1 | `text-5xl md:text-7xl font-display font-bold` | 48px -> 72px |
| Section H2 | `text-3xl md:text-5xl font-display font-bold` | 30px -> 48px |
| Card H3 | `text-2xl md:text-3xl font-display font-semibold` | 24px -> 30px |
| Subtitle | `text-xl text-muted-foreground` | 20px |
| Labels | `text-sm font-medium tracking-widest uppercase` | 14px, spaced |
| Body | `text-sm text-muted-foreground leading-relaxed` | 14px |

---

## Border Radius

| Token | Value |
|---|---|
| `--radius` | `1rem` (16px) |
| `lg` | `var(--radius)` = 16px |
| `md` | `calc(var(--radius) - 2px)` = 14px |
| `sm` | `calc(var(--radius) - 4px)` = 12px |

### Common Usage

| Element | Class |
|---|---|
| Cards & panels | `rounded-3xl` (24px) |
| Buttons (pill) | `rounded-full` |
| Inner cards / inputs | `rounded-2xl` (16px) / `rounded-xl` (12px) |
| Nav cards | `rounded-[1.2rem]` |
| Badges / pills | `rounded-full` |

---

## Button Variants (CVA)

### Variants

| Variant | Description |
|---|---|
| `primary` | `bg-primary text-primary-foreground` |
| `secondary` | `bg-secondary text-secondary-foreground` |
| `accent` | `bg-accent text-accent-foreground` |
| `outline` | `border border-border/70 bg-background/85 backdrop-blur-sm` |
| `ghost` | `bg-transparent hover:bg-accent/10` |
| `muted` | `bg-muted text-muted-foreground` |
| `destructive` | `bg-destructive text-destructive-foreground` |
| `link` | `text-primary underline-offset-4 hover:underline` |
| `copper` | `bg-copper text-background rounded-full` |
| `primary-pill` | `bg-foreground text-background rounded-full` |
| `secondary-glass` | `glass-morphism rounded-full` |
| `nav-cta` | `bg-foreground text-background text-sm uppercase tracking-wide` |

All buttons use `rounded-full` by default.

### Sizes

| Size | Height |
|---|---|
| `xs` | `h-8 px-4` |
| `sm` | `h-10 px-5` |
| `default` | `h-11 px-6` |
| `lg` | `h-12 px-8` |
| `icon` | `h-10 w-10` |

**Important:** No `default` appearance variant exists. Use `primary` instead.

---

## Glass Morphism

```css
.glass-morphism {
  /* Light */
  border: 1px solid rgb(var(--border) / 0.5);
  background: rgb(var(--card) / 0.7);
  backdrop-filter: blur(20px);
}
.dark .glass-morphism {
  background: rgb(var(--card) / 0.5);
}
```

Used for: Cards, navbar (scrolled), modals, badges, form containers

---

## Chrome / Metallic Effects

| Class | Effect |
|---|---|
| `.chrome-gradient` | Multi-stop 135deg gradient using chrome tokens |
| `.chrome-text` | Gradient background clipped to text (metallic effect with copper midpoint) |
| `.chrome-shimmer` | Animated background-position sweep (3s infinite) |
| `.text-gradient-copper` | Copper gradient text |
| `.overline-copper` | Small uppercase tracking label in copper |

---

## Animations

### Motion (Framer Motion) - used in 7 components

Standard reveal preset:
```tsx
initial={{ opacity: 0, y: 30 }}
whileInView={{ opacity: 1, y: 0 }}
viewport={{ once: true, margin: "-80px" }}
transition={{ duration: 0.6, ease: [0.25, 0.4, 0.25, 1] }}
```

### CSS Keyframes

| Animation | Duration | Usage |
|---|---|---|
| `blob-float` | 8s ease-in-out infinite | Background blob drift |
| `shimmer` | 3s ease-in-out infinite | Chrome shimmer effect |
| `reveal-up` | 0.8s ease-out forwards | Element entry |
| `accordion-down/up` | 0.2s ease-out | Radix accordion |

---

## Layout & Spacing

### Container
- max-width: `1400px` (content paths configured in tailwind.config.ts)
- padding: `1rem` (sm: `1.5rem`, lg: `2rem`)
- centered: `margin: 0 auto`

### Section Spacing (via `.section-padding`)
Standard sections use consistent vertical padding defined in globals.css.

### Section Backgrounds
- Default: transparent (`bg-background`)
- Alternating: `bg-muted/30`
- CTA: `bg-gradient-to-br from-copper/10 to-accent/10` + border

---

## Card Patterns

### Glass Card
```tsx
className="p-8 md:p-10 rounded-3xl glass-morphism hover:bg-foreground/5 transition-all duration-500"
```

### Icon Container
```tsx
className="w-16 h-16 rounded-2xl bg-gradient-to-br from-copper/20 to-accent/20 flex items-center justify-center"
```

### CTA Block
```tsx
className="max-w-3xl mx-auto text-center p-12 md:p-16 rounded-3xl bg-gradient-to-br from-copper/10 to-accent/10 border border-border/50"
```

---

## Breakpoints

| Prefix | Width |
|---|---|
| `sm` | 640px |
| `md` | 768px |
| `lg` | 1024px |
| `xl` | 1280px |
| `2xl` | 1400px |

---

## Key Dependencies

| Package | Version | Purpose |
|---|---|---|
| `motion` | 12.x | Page & element animations (Framer Motion) |
| `lucide-react` | 0.562.x | Icon library |
| `embla-carousel-react` | 8.x | Talent/image carousels |
| `class-variance-authority` | 0.7.x | Component variants (buttons) |
| `@radix-ui/*` | latest | Accessible primitives (checkbox, select, label) |
| `tailwindcss` | 4.x | Utility-first CSS |
| `next-intl` | 4.x | DE/EN internationalization |
| `react-hook-form` | 7.x | Form handling |

---

## Design Principles

1. **Chrome Aesthetic**: Metallic gradients for text, subtle shimmer, liquid-metal feel
2. **Glassmorphism**: Frosted glass cards with blur, semi-transparent borders
3. **Warm Copper Accents**: `rgb(196 149 106)` (#C4956A) as the signature accent
4. **Editorial Spacing**: Generous whitespace, sections breathe
5. **Dark-first**: Designed for dark mode, fully functional in light
6. **Pill Buttons**: All interactive CTAs use `rounded-full`
7. **Token-based**: Everything references CSS variables / Tailwind tokens
8. **Fontshare Typography**: Satoshi (body) + Zodiak (display), self-hosted WOFF2
