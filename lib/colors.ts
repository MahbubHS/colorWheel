/**
 * lib/colors.ts
 *
 * All 26 Tailwind v4.2 color families.
 * Color state is stored as Tailwind utility class suffixes (e.g. 'red-500')
 * so components build classes like: fill-red-500 / bg-red-500 / text-red-500
 *
 * @source inline() in index.css forces Tailwind to generate all
 * permutations at build time even though classes are built dynamically.
 */

export const COLOR_NAMES = [
  'red',
  'orange',
  'amber',
  'yellow',
  'lime',
  'green',
  'emerald',
  'teal',
  'cyan',
  'sky',
  'blue',
  'indigo',
  'violet',
  'purple',
  'fuchsia',
  'pink',
  'rose',
  'slate',
  'gray',
  'zinc',
  'neutral',
  'stone',
  'mauve',
  'olive',
  'taupe',
  'mist',
] as const;

export type ColorName = (typeof COLOR_NAMES)[number];

export const SHADES = [950, 900, 800, 700, 600, 500, 400, 300, 200, 100, 50] as const;

export type Shade = (typeof SHADES)[number];

/** Default background Tailwind class — bg-gray-950 */
export const DEFAULT_BG_CLASS = 'bg-gray-950';

/** Default fill Tailwind class — for SVG center cap */
export const DEFAULT_FILL_CLASS = 'fill-gray-950';
