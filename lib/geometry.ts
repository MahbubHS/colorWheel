/**
 * lib/geometry.ts
 *
 * Pre-computes every SVG path d-string once at module load.
 * Each ColorSegment stores twName (e.g. 'red-500') — used by
 * WheelSVG to build fill-red-500 / stroke-red-500 classes directly.
 */

import { COLOR_NAMES, SHADES, type ColorName, type Shade } from './colors';

export const CX = 250;
export const CY = 250;
export const OUTER_RADIUS = 250;
export const RING_STEP = 20;

export type CapSegment = {
  isCap: true;
  key: string;
  d: string;
};

export type ColorSegment = {
  isCap: false;
  key: string;
  d: string;
  colorName: ColorName;
  shade: Shade;
  /** e.g. 'red-500' — build fill-red-500, bg-red-500, text-red-500 from this */
  twName: string;
};

export type Segment = CapSegment | ColorSegment;

export const SEGMENTS: Segment[] = (() => {
  const out: Segment[] = [];
  let r = OUTER_RADIUS;

  for (let si = 0; si <= SHADES.length; si++) {
    const shade = SHADES[si];

    for (let ci = 0; ci < COLOR_NAMES.length; ci++) {
      const a1 = (ci * 2 * Math.PI) / COLOR_NAMES.length;
      const a2 = ((ci + 1) * 2 * Math.PI) / COLOR_NAMES.length;
      const x1 = CX + r * Math.cos(a1);
      const y1 = CY + r * Math.sin(a1);
      const x2 = CX + r * Math.cos(a2);
      const y2 = CY + r * Math.sin(a2);
      const d = `M ${CX} ${CY} L ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2} Z`;

      if (si === SHADES.length) {
        out.push({ isCap: true, key: `cap-${ci}`, d });
      } else {
        const colorName = COLOR_NAMES[ci];
        const twName = `${colorName}-${shade}`;
        out.push({
          isCap: false,
          key: twName,
          d,
          colorName,
          shade,
          twName,
        });
      }
    }

    r -= RING_STEP;
  }

  return out;
})();
