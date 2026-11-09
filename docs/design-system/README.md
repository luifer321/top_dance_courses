# Design system

Dark, elegant, purple. Dark mode is the default and only theme; light is used only for
occasional surfaces (`.surface-light`).

Live reference (development only): http://localhost:3000/es/design-system/ and
`/en/design-system/`. The page is excluded from production builds unless
`NEXT_PUBLIC_ENABLE_DESIGN_SYSTEM=true`.

## Official palette

Defined once, unchanged, at the top of `apps/web/src/app/globals.css`, mirrored in
`apps/web/src/design-system/tokens.ts` and `apps/mobile/src/theme/tokens.ts` (tests on
both sides fail if any value drifts).

| Token | Value | Token | Value |
| --- | --- | --- | --- |
| `--purple-darkest` | `#0f0a1a` | `--gray-100` | `#f0edf5` |
| `--purple-dark` | `#1a1128` | `--gray-200` | `#d4cfe0` |
| `--purple-mid` | `#2d1b4e` | `--gray-300` | `#a89fba` |
| `--purple-brand` | `#6b3fa0` | `--gray-400` | `#7a7190` |
| `--purple-light` | `#8b5fcf` | `--dark-bg` | `#0a0612` |
| `--purple-bright` | `#a87de8` | `--dark-card` | `#15101f` |
| `--purple-glow` | `#c4a1f0` | `--dark-card-hover` | `#1e1530` |
| `--white` | `#ffffff` | | |

## Semantic tokens (shadcn/ui)

Components use semantic tokens, never raw palette values, so surfaces can be re-themed.

| Semantic | Maps to |
| --- | --- |
| `background` / `foreground` | `dark-bg` / `gray-100` |
| `card` / `card-foreground` / `card-hover` | `dark-card` / `gray-100` / `dark-card-hover` |
| `popover` | `purple-dark` |
| `primary` / `primary-foreground` | `purple-brand` / `white` |
| `secondary` / `secondary-foreground` | `purple-mid` / `gray-100` |
| `muted` / `muted-foreground` | `purple-dark` / `gray-300` |
| `accent` / `accent-foreground` | `dark-card-hover` / `purple-glow` |
| `border`, `input` | `purple-light` at 22% / 30% |
| `ring` | `purple-light` |
| `destructive`, `success`, `warning`, `info` | `#f87171`, `#4ade80`, `#fbbf24`, `purple-bright` |

Status colors are not part of the brand palette; they were added for feedback states and
tuned for dark surfaces.

### Tailwind v4

Configuration is CSS-first (no `tailwind.config.js`). The `@theme inline` block resets
Tailwind's default palette (`--color-*: initial`) so only brand and semantic colors exist:
`bg-background`, `text-muted-foreground`, `bg-purple-brand`, `border-border`, etc.

Utilities: `bg-brand-gradient`, `bg-surface-gradient`, `text-brand-gradient`,
`shadow-glow`, `shadow-glow-sm`. Radius scale is based on `--radius: 0.75rem`.

## Typography

- Body: **Manrope** (`--font-body`, `font-sans`).
- Headings: **Playfair Display** (`--font-display`, `font-heading`), white.
- Self-hosted through `next/font` (works with static export). Mobile currently uses
  the system font with the same scale (`typography` in the mobile tokens).

## Contrast (WCAG 2.x)

Measured ratios for the main pairings:

| Pair | Ratio | Result |
| --- | --- | --- |
| `gray-100` on `dark-bg` (body text) | 17.3:1 | AAA |
| `gray-100` on `dark-card` | 16.1:1 | AAA |
| `gray-300` on `dark-card` (muted text) | 7.4:1 | AAA |
| `white` on `purple-brand` (primary button) | 7.4:1 | AAA |
| `purple-glow` on `dark-card-hover` (accent) | 8.1:1 | AAA |
| `purple-bright` on `dark-card` (info) | 6.0:1 | AA |
| `destructive` / `success` / `warning` on `dark-card` | 6.7 / 10.7 / 11.2:1 | AA+ |
| `purple-light` on `dark-bg` (focus ring) | 4.4:1 | ≥ 3:1 for UI |
| `gray-400` on `dark-bg` | 4.4:1 | **Below AA for body text** — decorative / large text only |

## Rules

- Use semantic tokens; reach for palette tokens only for brand moments (gradients).
- Keep glow and gradients restrained: primary CTAs and hero areas only.
- Every interactive element has a visible focus ring (`ring`).
- All text comes from translation keys, including `aria-label`s.
- Web components: shadcn/ui in `apps/web/src/components/ui` (Radix primitives). Mobile
  has its own React Native primitives in `apps/mobile/src/components/ui.tsx`.
