/**
 * WheelSVG.tsx
 *
 * The SVG is ALWAYS absolutely positioned inside its flex container.
 * The container (`relative flex-1 min-h-0 min-w-0`) claims its share
 * of the flex layout. The absolute inner layer fills it completely.
 * The SVG wrapper uses `aspect-square max-h-full max-w-full` — it
 * automatically becomes the largest square that fits the container,
 * on every screen size, with zero JavaScript measurement needed.
 *
 * Layout flow:
 *   flex container → relative flex-1 min-h-0 min-w-0
 *     absolute inset-0  (decoupled from siblings — SVG NEVER moves)
 *       flex items-center justify-center p-3 sm:p-4 lg:p-6
 *         div aspect-square max-h-full max-w-full  ← the square bound
 *           svg w-full h-full viewBox="0 0 500 500"
 *
 * GSAP:  1. Entrance — spin-in from -12° on mount
 *        2. Ring     — ambient pulse (infinite yoyo)
 *        3. Click    — segment opacity flash
 *
 * React.memo prevents re-renders when only unrelated App state changes.
 */

import { useEffect, useRef, useCallback, memo } from 'react';
import { gsap } from 'gsap';
import { SEGMENTS, type ColorSegment } from '@/lib/geometry';

type Props = {
  bgFillClass: string;
  onSegClick: (e: React.MouseEvent<SVGPathElement>, seg: ColorSegment) => void;
};

const WheelSVG = memo(function WheelSVG({ bgFillClass, onSegClick }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  // ── GSAP: entrance ──────────────────────────────────────────
  useEffect(() => {
    if (!wrapRef.current) return;
    gsap.from(wrapRef.current, {
      rotation: -12,
      scale: 0.86,
      opacity: 0,
      duration: 0.95,
      ease: 'back.out(1.6)',
      transformOrigin: 'center center',
    });
  }, []);

  // ── GSAP: ambient ring breathe ───────────────────────────────
  useEffect(() => {
    if (!ringRef.current) return;
    const tween = gsap.to(ringRef.current, {
      scale: 1.022,
      opacity: 0.3,
      duration: 2.2,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true,
      transformOrigin: 'center center',
    });
    return () => {
      tween.kill();
    };
  }, []);

  // ── GSAP: per-segment click pulse ────────────────────────────
  const pulseSegment = useCallback((el: SVGPathElement) => {
    gsap
      .timeline()
      .to(el, { attr: { opacity: 0.38 }, duration: 0.07, ease: 'power2.in' })
      .to(el, { attr: { opacity: 1 }, duration: 0.22, ease: 'power2.out' });
  }, []);

  const handlePathClick = useCallback(
    (e: React.MouseEvent<SVGPathElement>, seg: ColorSegment) => {
      pulseSegment(e.currentTarget);
      onSegClick(e, seg);
    },
    [pulseSegment, onSegClick],
  );

  return (
    /*
     * flex-1 min-h-0 min-w-0 — claims the available flex space
     * without overflowing its parent container in either axis.
     * relative — establishes a positioning context for the inner absolute layer.
     */
    <section className="relative min-h-0 min-w-0 flex-1" aria-label="Color wheel">
      {/*
       * absolute inset-0 — fills the flex cell completely.
       * The SVG's visual position is fully decoupled from siblings.
       * p-3/p-4/p-6 — breathing room that scales with screen size.
       * absolute inset-0 flex items-center justify-center p-1 sm:p-2 lg:p-3 -translate-y-4 sm:-translate-y-6 lg:-translate-y-8
       */}
      <div className="absolute inset-0 flex items-center justify-center p-1 sm:p-2 lg:p-3 -translate-y-4 sm:-translate-y-6 lg:-translate-y-8">
        {/* Ambient ring — GSAP breathe target */}
        <div
          ref={ringRef}
          className="pointer-events-none absolute aspect-square w-[108%] max-w-full rounded-full border border-white/[0.1] opacity-[0.15]"
        />

        {/*
         * aspect-square max-h-full max-w-full
         * Makes the SVG wrapper the largest square that fits the container.
         * Works on every screen size without any JS measurement.
         * GSAP entrance target.
         */}
        <div ref={wrapRef} className="aspect-square max-h-full max-w-full">
          <svg
            viewBox="0 0 500 500"
            className="h-full w-full drop-shadow-[0_0_50px_rgba(255,255,255,0.02)] drop-shadow-[0_8px_40px_rgba(0,0,0,0.75)] outline-none"
          >
            {/*
             * Render order is critical — both path types originate from SVG
             * center (CX, CY) so later-rendered paths paint on top.
             * SEGMENTS is already ordered: color rings (si 0–10) then caps (si 11).
             * We map over SEGMENTS once to preserve that order so cap paths
             * always render last and appear on top of color segments.
             */}
            {SEGMENTS.map((seg) =>
              seg.isCap ? (
                /*
                 * CENTER CAP — fill and stroke both track bgFillClass.
                 * bgFillClass.replace('fill-','stroke-') derives the matching
                 * stroke class so both change together on background mode pick.
                 * stroke-1 sets stroke-width:1 (Tailwind SVG utility).
                 */
                <path
                  key={seg.key}
                  d={seg.d}
                  className={`stroke-1 transition-colors duration-700 ${bgFillClass} ${bgFillClass.replace('fill-', 'stroke-')} `}
                />
              ) : (
                /*
                 * COLOUR SEGMENT — fill from Tailwind palette, black stroke separator.
                 * Memoized separately via colorPaths to avoid re-building on bgFillClass change.
                 * We inline the click handler here so memoization below stays clean.
                 */
                <path
                  key={seg.key}
                  d={seg.d}
                  className={`fill-${seg.twName} cursor-pointer stroke-black/20 stroke-[0.2]`}
                  onClick={(e) => handlePathClick(e, seg)}
                  role="button"
                  aria-label={seg.twName}
                />
              ),
            )}
          </svg>
        </div>
      </div>
    </section>
  );
});

export default WheelSVG;
