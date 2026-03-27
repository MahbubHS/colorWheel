# 🛞 Tailwind Color Wheel

An interactive SVG color wheel that visualizes the complete **Tailwind CSS v4.2 default palette** — all 26 color families × 11 shades = **286 colors** — with four interaction modes, live preview, and full cross-device responsiveness.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Interaction Modes](#interaction-modes)
- [Design Decisions](#design-decisions)
- [Color System](#color-system)
- [Responsive Layout](#responsive-layout)
- [Performance](#performance)
- [Tooling](#tooling)
- [Scripts](#scripts)
- [Contributing](#contributing)

---

## Overview

The Tailwind Color Wheel renders all 26 Tailwind v4.2 color families as concentric ring segments in an SVG wheel. Each ring represents one shade level (50 → 950). Clicking any segment performs an action depending on the active mode — changing the page background, previewing text color on a live demo strip, or copying the Tailwind utility class name to the clipboard.

---

## Features

| Feature | Description |
|---|---|
| **286-color SVG wheel** | All 26 Tailwind v4.2 color families × 11 shades rendered as interactive SVG path segments |
| **4 interaction modes** | Normal, Background, Text Color, Copy Name — switched via a shadcn Select dropdown |
| **Live text preview** | A demo strip appears in `bg` and `text` modes showing real typography in the chosen color |
| **Color notification card** | Fixed top-right card shows both applied background and text color simultaneously; auto-closes after 4 s with a GSAP slide-out |
| **Toast notifications** | Sonner-powered toasts confirm every action with mode-aware messaging |
| **GSAP animations** | Entrance spin, ambient ring pulse, per-segment click flash, card slide-in/out |
| **Fully responsive** | Single-column on mobile/tablet, two-column on desktop (≥ lg) — SVG never shifts position |
| **OKLCH color system** | Uses Tailwind v4 CSS custom properties (`--color-red-500`) in OKLCH color space natively |
| **Zero JS color conversion** | All colors are expressed as Tailwind utility classes; no hex map, no `tailwindcss/colors` import |
| **Cross-device height fix** | `html, body, #root { height: 100% }` chain ensures correct layout on all mobile browsers |

---

## Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Framework | React | 19.x |
| Language | TypeScript | 5.9.x |
| Bundler | Vite | 8.x |
| Styling | Tailwind CSS | 4.2.x |
| Tailwind Vite plugin | @tailwindcss/vite | 4.2.x |
| UI components | shadcn/ui | 4.x |
| Primitives | Radix UI | 1.4.x |
| Animation | GSAP | 3.14.x |
| Toast | Sonner | 2.x |
| Font | Geist Variable | 5.x |
| Linting | ESLint (v9 flat config) + typescript-eslint | 9.x / 8.x |
| Formatting | Prettier + prettier-plugin-tailwindcss | 3.x |

---

## Architecture

```
main.tsx
  └── ThemeProvider (next-themes — required by shadcn Toaster)
        └── App.tsx                     ← Central hub: ALL state + ALL handlers
              │
              ├── lib/colors.ts         COLOR_NAMES, SHADES, DEFAULT_BG_CLASS
              ├── lib/geometry.ts       SEGMENTS — pre-computed SVG path d-strings
              └── lib/modes.ts          MODES, ModeKey type
              │
              ├── <Backdrop />          Fixed atmospheric glow (no props, memo)
              ├── <Header />            Brand + shadcn Select mode picker (memo)
              │
              ├── Content area (flex-col → flex-row on lg+)
              │     ├── <WheelSVG />   SVG wheel, GSAP animations (memo)
              │     └── <aside>        Desktop-only DemoText panel
              │           └── <DemoText />
              │
              └── Fixed overlays (outside shell, z-indexed)
                    ├── <DemoText />   Mobile fixed-bottom overlay (<lg only)
                    ├── <ColorCard />  Notification card top-right (forwardRef)
                    └── <Toaster />    Sonner toast container
```

### State ownership

All application state lives exclusively in `App.tsx`. Components are purely presentational — they receive props and emit events upward. No component manages its own color or mode state.

| State | Type | Purpose |
|---|---|---|
| `mode` | `ModeKey` | Active interaction mode |
| `bgClass` | `string` | Tailwind `bg-*` class for shell background |
| `bgFillClass` | `string` | Tailwind `fill-*` class for SVG center cap |
| `textClass` | `string` | Tailwind `text-*` class for DemoText |
| `prevBgName` | `string \| null` | Last applied background name (for combined toast) |
| `prevTextName` | `string \| null` | Last applied text name (for combined toast) |
| `card` | `CardData` | `{ bgName, textName }` — both channels |
| `cardVisible` | `boolean` | Mounts/unmounts ColorCard |

---

## Project Structure

```
.
├── components/
│   ├── ColorWheel/
│   │   ├── Backdrop.tsx      Atmospheric glow layers — no props, React.memo
│   │   ├── ColorCard.tsx     Notification card (forwardRef + React.memo)
│   │   ├── DemoText.tsx      Live color preview strip — React.memo
│   │   ├── Header.tsx        Top bar: brand + shadcn Select — React.memo
│   │   └── WheelSVG.tsx      SVG wheel + all GSAP animations — React.memo
│   └── ui/
│       ├── button.tsx        shadcn Button
│       ├── select.tsx        shadcn Select
│       └── sonner.tsx        shadcn Toaster
│
├── lib/
│   ├── colors.ts             26 COLOR_NAMES, 11 SHADES, class helpers
│   ├── geometry.ts           SEGMENTS — pre-computed at module load
│   ├── modes.ts              MODES config, ModeKey type
│   └── utils.ts              shadcn cn() utility
│
├── src/
│   ├── App.tsx               Central hub — all state, all handlers
│   ├── index.css             Tailwind import, @source inline() safelists,
│   │                         @theme variables, shadcn theme tokens
│   └── main.tsx              Entry point — ThemeProvider + App
│
├── public/
│   ├── favicon.svg
│   └── icons.svg
│
├── .prettierrc               Prettier config with tailwindcss plugin
├── .prettierignore
├── components.json           shadcn configuration
├── eslint.config.js          ESLint v9 flat config
├── tsconfig.json             Root TS config (references app + node)
├── tsconfig.app.json         App compiler options + @ path alias
├── tsconfig.node.json        Node/Vite compiler options
└── vite.config.ts            Vite + React + Tailwind plugins, @ alias
```

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 20
- **npm** ≥ 10

### Installation

```bash
# 1. Clone or extract the project
cd color-wheel

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Production build

```bash
npm run build
npm run preview
```

The build output goes to `dist/`. Source maps are included (`sourcemap: true` in `vite.config.ts`).

---

## Interaction Modes

Select a mode from the dropdown in the top-right of the header, then click any color segment on the wheel.

| Mode | Icon | Action on click |
|---|---|---|
| **Normal** | 👁 | No action — inspect the wheel freely |
| **Background** | 🎨 | Sets the page background to the clicked color |
| **Text Color** | ✍️ | Sets the text preview color in the DemoText strip |
| **Copy Name** | 📋 | Copies the Tailwind utility name (e.g. `red-500`) to clipboard |

### Toast behavior

- **First selection** — toast shows just the color name: `🎨 red-500`
- **Both channels set** — toast shows both: `🎨 BG: red-500  ·  Text: sky-300`

### Color card

- Appears top-right below the header when a color is applied in `bg` or `text` mode
- Shows both the background channel and text channel simultaneously (each with a color swatch)
- Auto-dismisses after **4 seconds** with a GSAP slide-out animation
- Can be manually dismissed with the × button

---

## Design Decisions

### Why `@source inline()` instead of a safelist config

Tailwind v4 removed the `safelist` config option. The official replacement is `@source inline()` with brace expansion in the CSS file. Since all color class names are built dynamically at runtime (e.g. `` `fill-${twName}` ``), the Tailwind scanner cannot detect them in source files. `@source inline()` forces generation of every permutation at build time.

```css
/* src/index.css */
@source inline("fill-{red,orange,...,mist}-{50,100,...,950}");
@source inline("stroke-{red,orange,...,mist}-{50,100,...,950}");
@source inline("bg-{red,orange,...,mist}-{50,100,...,950}");
@source inline("text-{red,orange,...,mist}-{50,100,...,950}");
```

### Why Tailwind utility classes instead of CSS variables or hex

Tailwind v4 exposes every color as a CSS custom property in OKLCH (e.g. `--color-red-500: oklch(63.7% 0.237 25.331)`). A previous iteration used `var(--color-red-500)` in inline styles. This was replaced because:

1. Tailwind utility classes are the **official intended API** — `fill-red-500`, `bg-red-500`, `text-red-500`
2. `transition-colors` on a Tailwind class animates correctly; `transition` on an inline `background-color` style does not integrate with Tailwind's generated transitions
3. Purging is predictable — `@source inline()` is the documented safelist mechanism

### Why `height: 100%` on `html, body, #root` instead of `h-screen` or `h-svh`

`h-screen` (100vh) includes the browser chrome on mobile — the content shifts when the address bar hides/shows. `h-svh` (100svh) fixes this but is not supported on older Android WebView and some mobile browsers, causing the shell to collapse to zero height.

The correct cross-browser solution is to propagate height through the DOM chain:

```css
html, body, #root { height: 100%; overflow: hidden; }
```

Then the App shell uses `h-full`, which resolves reliably on every browser and device.

### Why the SVG uses `aspect-square max-h-full max-w-full`

The SVG wrapper is the largest square that fits its container. This works on every screen size with zero JavaScript measurement. The wheel is decoupled from layout shifts via `absolute inset-0` on the inner container, so adding or removing DemoText, ColorCard, or toast notifications never causes the SVG to move.

### SVG path render order

All paths originate from the center point `(250, 250)`. Because SVG paints later elements on top, color segments must render **before** cap paths. `SEGMENTS` is ordered with color rings first (indices 0–10) and center cap last (index 11), so a single `SEGMENTS.map()` preserves the correct visual layering without any filtering or reordering.

---

## Color System

### Palette as of Tailwind CSS v4.2

26 color families, each with 11 shades (50, 100, 200 … 950):

```
red · orange · amber · yellow · lime · green · emerald · teal
cyan · sky · blue · indigo · violet · purple · fuchsia · pink · rose
slate · gray · zinc · neutral · stone
mauve · olive · taupe · mist   ← added in v4.2
```

### Center cap behavior

The 26 innermost path segments (center cap) use `fill-*` and `stroke-*` classes that are both derived from `bgFillClass`:

```tsx
className={`
  transition-colors duration-700 stroke-1
  ${bgFillClass}
  ${bgFillClass.replace('fill-', 'stroke-')}
`}
```

When Background mode is active and a color is clicked, `bgFillClass` updates to e.g. `fill-red-500`, and the derived stroke becomes `stroke-red-500`. Both transition simultaneously with Tailwind's `transition-colors duration-700`.

---

## Responsive Layout

| Breakpoint | Layout | DemoText |
|---|---|---|
| `< lg` (mobile, tablet) | Single column — SVG fills content area | Fixed bottom overlay (`fixed inset-x-3 bottom-4`) |
| `≥ lg` (desktop) | Two columns — SVG left, DemoText right panel (`w-80 xl:w-96`) | Right panel sidebar (normal flow) |

The SVG column always uses `relative flex-1 min-h-0 min-w-0` with `absolute inset-0` inside, ensuring:
- The SVG claims its share of the flex layout
- The visual position is **completely decoupled** from sibling elements
- No JavaScript resize observers or measurement needed

---

## Performance

| Optimization | Implementation |
|---|---|
| `React.memo` | All 5 components wrapped — prevents re-renders from App state changes that don't affect the component |
| Pre-computed geometry | `SEGMENTS` is computed once at module load (not per render) — 312 path d-strings calculated at startup |
| GSAP GPU compositing | Entrance animation uses `rotation` and `scale` — composited on GPU, no layout reflow |
| Vite pre-bundling | `react` and `react-dom` explicitly listed in `optimizeDeps.include` for faster cold starts |
| CSS custom properties | Tailwind v4 color transitions use CSS vars — no JavaScript involved in color interpolation |
| File watcher | `usePolling: true` with `interval: 100` in `vite.config.ts` prevents `ENOSPC` errors in large monorepos |

---

## Tooling

### ESLint (`eslint.config.js`)

ESLint v9 flat config with:
- `@eslint/js` recommended rules
- `typescript-eslint` strict type checking
- `eslint-plugin-react-hooks` — enforces rules of hooks and exhaustive deps
- `eslint-plugin-react-refresh` — warns on non-refresh-safe component exports
- `eslint-plugin-prettier` — surfaces Prettier formatting violations as ESLint errors
- `eslint-config-prettier` — disables ESLint rules that conflict with Prettier

### Prettier (`.prettierrc`)

```json
{
  "semi": false,
  "singleQuote": true,
  "trailingComma": "all",
  "printWidth": 80,
  "plugins": ["prettier-plugin-tailwindcss"],
  "tailwindStylesheet": "./src/index.css"
}
```

`prettier-plugin-tailwindcss` automatically sorts Tailwind classes in the canonical order defined by the official Tailwind stylesheet.

### Path alias

`@` resolves to the **project root** (not `src/`) because shadcn places `components/` and `lib/` at the root. Configured in both `vite.config.ts` and `tsconfig.app.json`:

```ts
// vite.config.ts
alias: { '@': path.resolve(__dirname, '.') }

// tsconfig.app.json
"paths": { "@/*": ["./*"] }
```

---

## Scripts

```bash
# Start development server (hot reload)
npm run dev

# Production build (TypeScript check + Vite bundle)
npm run build

# Preview production build locally
npm run preview

# Run ESLint
npm run lint

# Run ESLint and auto-fix issues
npm run lint:fix

# Format all files with Prettier
npm run format

# Check formatting without writing (CI-safe)
npm run format:check

# TypeScript type check without emitting files
npm run type-check
```

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Make changes — run `npm run lint` and `npm run format:check` before committing
4. Commit using conventional commits: `git commit -m "feat: add color export"`
5. Push and open a pull request

### Code conventions

- All color values must use Tailwind utility classes — no inline `style={{ color: ... }}`, no hex strings, no `var(--color-*)` in JS
- Dynamic classes must be safelisted in `src/index.css` via `@source inline()`
- All components should be wrapped in `React.memo`
- Business logic belongs in `App.tsx` — components are purely presentational
- New color families added to Tailwind must be added to `COLOR_NAMES` in `lib/colors.ts` and to the `@source inline()` lists in `src/index.css`

---

## License

Private project. All rights reserved.
