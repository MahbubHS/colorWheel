/**
 * App.tsx — central hub, all state + all handlers.
 *
 * Layout (responsive):
 *
 *   Mobile/Tablet (<lg) — single column:
 *     ┌──────────────────────┐
 *     │       Header         │
 *     ├──────────────────────┤
 *     │   SVG wheel          │  ← flex-1, SVG absolutely centered
 *     │   (absolute inset-0) │     NEVER moves regardless of siblings
 *     └──────────────────────┘
 *     [DemoText fixed bottom overlay — outside flow, no layout shift]
 *
 *   Desktop (lg+) — two columns:
 *     ┌────────────────────────────────────┐
 *     │              Header                │
 *     ├─────────────────────┬──────────────┤
 *     │  SVG wheel          │  DemoText    │
 *     │  (absolute inset-0) │  right panel │
 *     │                     │  (flex col)  │
 *     └─────────────────────┴──────────────┘
 *
 * The SVG is ALWAYS absolute inside its container.
 * DemoText on mobile uses `fixed` so it never shifts the wheel.
 * DemoText on desktop lives in a right-panel sidebar (normal flow).
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { gsap } from 'gsap';
import { toast } from 'sonner';
import { Toaster } from '@/components/ui/sonner';
import { DEFAULT_BG_CLASS, DEFAULT_FILL_CLASS } from '@/lib/colors';
import { MODES, type ModeKey } from '@/lib/modes';
import { type ColorSegment } from '@/lib/geometry';
import Backdrop from '@/components/ColorWheel/Backdrop';
import Header from '@/components/ColorWheel/Header';
import WheelSVG from '@/components/ColorWheel/WheelSVG';
import DemoText from '@/components/ColorWheel/DemoText';
import ColorCard, { type CardData } from '@/components/ColorWheel/ColorCard';

const AUTO_CLOSE_MS = 4000;

export default function App() {
  // ── State ──────────────────────────────────────────────────────
  const [mode, setMode] = useState<ModeKey>('normal');
  const [bgClass, setBgClass] = useState<string>(DEFAULT_BG_CLASS);
  const [bgFillClass, setBgFillClass] = useState<string>(DEFAULT_FILL_CLASS);
  const [textClass, setTextClass] = useState<string>('text-white');
  const [prevBgName, setPrevBgName] = useState<string | null>(null);
  const [prevTextName, setPrevTextName] = useState<string | null>(null);
  const [card, setCard] = useState<CardData>({ bgName: null, textName: null });
  const [cardVisible, setCardVisible] = useState(false);

  const cardRef = useRef<HTMLDivElement>(null);
  const cardTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showDemo = mode === 'bg' || mode === 'text';

  // ── Card GSAP — slides in from the right ──────────────────────
  useEffect(() => {
    if (cardVisible && cardRef.current) {
      gsap.fromTo(
        cardRef.current,
        { x: 56, opacity: 0, scale: 0.94 },
        { x: 0, opacity: 1, scale: 1, duration: 0.4, ease: 'back.out(1.5)' },
      );
    }
  }, [cardVisible, card]);

  // ── Card auto-close ────────────────────────────────────────────
  const scheduleCardClose = useCallback(() => {
    if (cardTimerRef.current) clearTimeout(cardTimerRef.current);
    cardTimerRef.current = setTimeout(() => {
      if (cardRef.current) {
        gsap.to(cardRef.current, {
          x: 56,
          opacity: 0,
          scale: 0.94,
          duration: 0.28,
          ease: 'power2.in',
          onComplete: () => setCardVisible(false),
        });
      } else {
        setCardVisible(false);
      }
    }, AUTO_CLOSE_MS);
  }, []);

  const dismissCard = useCallback(() => {
    if (cardTimerRef.current) clearTimeout(cardTimerRef.current);
    if (cardRef.current) {
      gsap.to(cardRef.current, {
        x: 56,
        opacity: 0,
        scale: 0.94,
        duration: 0.22,
        ease: 'power2.in',
        onComplete: () => setCardVisible(false),
      });
    } else {
      setCardVisible(false);
    }
  }, []);

  const updateCard = useCallback(
    (patch: Partial<CardData>) => {
      setCard((prev) => ({ ...prev, ...patch }));
      setCardVisible(true);
      scheduleCardClose();
    },
    [scheduleCardClose],
  );

  // ── Handlers ───────────────────────────────────────────────────
  const handleModeChange = useCallback((newMode: ModeKey) => {
    setMode(newMode);
    toast(`${MODES[newMode].icon} Mode → ${MODES[newMode].label}`);
  }, []);

  const handleSegClick = useCallback(
    (_e: React.MouseEvent<SVGPathElement>, seg: ColorSegment) => {
      if (mode === 'normal') return;
      const { twName } = seg;

      if (mode === 'color-picker') {
        navigator.clipboard
          .writeText(twName)
          .then(() => toast(`📋 ${twName}`))
          .catch(() => toast('⚠️ Clipboard blocked'));
        return;
      }

      if (mode === 'bg') {
        setBgClass(`bg-${twName}`);
        setBgFillClass(`fill-${twName}`);
        setPrevBgName(twName);
        toast(prevTextName ? `🎨 BG: ${twName}  ·  Text: ${prevTextName}` : `🎨 ${twName}`);
        updateCard({ bgName: twName });
      }

      if (mode === 'text') {
        setTextClass(`text-${twName}`);
        setPrevTextName(twName);
        toast(prevBgName ? `✍️ BG: ${prevBgName}  ·  Text: ${twName}` : `✍️ ${twName}`);
        updateCard({ textName: twName });
      }
    },
    [mode, prevBgName, prevTextName, updateCard],
  );

  // ── Render ─────────────────────────────────────────────────────
  return (
    <>
      {/*
       * Shell — full viewport, flex column.
       * bgClass transitions via Tailwind transition-colors.
       */}
      <div
        className={`flex h-svh w-screen flex-col overflow-hidden font-sora transition-colors duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] select-none ${bgClass} `}
      >
        <Backdrop />

        {/* ── Header ──────────────────────────────────────── */}
        <Header mode={mode} onModeChange={handleModeChange} />

        {/*
         * Content area — flex-1 below header.
         *
         * Mobile/Tablet: single column — WheelSVG fills everything.
         * Desktop (lg+): two columns — wheel left, demo-panel right.
         *
         * The WheelSVG component always uses absolute inset-0 inside
         * its container so the SVG position is fully decoupled from
         * any sibling elements that come and go.
         */}
        <div className="relative flex min-h-0 flex-1 flex-col lg:flex-row">
          {/* ── Wheel — fills its flex cell absolutely ──────── */}
          <WheelSVG bgFillClass={bgFillClass} onSegClick={handleSegClick} />

          {/*
           * Desktop right panel — DemoText in normal flow.
           * Only visible on lg+ when bg or text mode is active.
           * The panel uses a fixed width so it never resizes the SVG column.
           */}
          {showDemo && (
            <aside className="hidden w-80 shrink-0 flex-col items-center justify-center gap-6 border-l border-white/[0.06] p-6 lg:flex xl:w-96">
              <DemoText textClass={textClass} mode={mode} />
            </aside>
          )}
        </div>
      </div>

      {/*
       * Mobile DemoText overlay — fixed bottom, outside the shell div
       * so it NEVER affects the layout of the SVG column.
       * Visible only on <lg when bg or text mode is active.
       */}
      {showDemo && (
        <div className="fixed inset-x-3 bottom-4 z-30 lg:hidden">
          <DemoText textClass={textClass} mode={mode} />
        </div>
      )}

      {/*
       * ColorCard — fixed notification, top-right below header.
       * Outside the shell so overflow:hidden never clips it.
       */}
      {cardVisible && <ColorCard ref={cardRef} card={card} onClose={dismissCard} />}

      <Toaster position="bottom-center" />
    </>
  );
}
