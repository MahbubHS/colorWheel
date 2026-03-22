/**
 * ColorCard.tsx — notification card, fixed top-right below header.
 * Shows both bg + text channels. Auto-close timer in App.tsx.
 * React.memo + forwardRef for GSAP targeting.
 */

import { forwardRef, memo } from 'react';
import { Button } from '@/components/ui/button';

export type CardData = {
  bgName: string | null;
  textName: string | null;
};

type Props = {
  card: CardData;
  onClose: () => void;
};

const ColorCard = memo(
  forwardRef<HTMLDivElement, Props>(function ColorCard({ card, onClose }, ref) {
    const hasBg = Boolean(card.bgName);
    const hasText = Boolean(card.textName);
    if (!hasBg && !hasText) return null;

    return (
      <div
        ref={ref}
        className="fixed top-[72px] right-3 z-50 w-64 sm:top-[76px] sm:right-5 sm:w-72"
      >
        <div className="overflow-hidden rounded-2xl border border-white/[0.12] bg-zinc-900/95 shadow-2xl backdrop-blur-xl">
          {/* Card header */}
          <div className="flex items-center justify-between border-b border-white/[0.08] px-3 py-2 sm:px-4 sm:py-2.5">
            <p className="font-mono text-[9px] tracking-widest text-white/50 uppercase sm:text-[10px]">
              Color Applied
            </p>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-5 w-5 text-zinc-500 hover:bg-white/10 hover:text-white sm:h-6 sm:w-6"
              aria-label="Dismiss"
            >
              ×
            </Button>
          </div>

          {/* Rows */}
          <div className="divide-y divide-white/[0.06]">
            {hasBg && (
              <div className="flex items-center gap-3 px-3 py-2.5 sm:px-4 sm:py-3">
                <div
                  className={`bg-${card.bgName} h-7 w-7 shrink-0 rounded-lg border border-white/20 transition-colors duration-500 sm:h-8 sm:w-8`}
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-mono text-[11px] font-semibold text-white sm:text-xs">
                    {card.bgName}
                  </p>
                  <p className="text-[10px] text-zinc-500 sm:text-[11px]">🎨 Background</p>
                </div>
              </div>
            )}

            {hasText && (
              <div className="flex items-center gap-3 px-3 py-2.5 sm:px-4 sm:py-3">
                <div
                  className={`bg-${card.textName} h-7 w-7 shrink-0 rounded-lg border border-white/20 transition-colors duration-500 sm:h-8 sm:w-8`}
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-mono text-[11px] font-semibold text-white sm:text-xs">
                    {card.textName}
                  </p>
                  <p className="text-[10px] text-zinc-500 sm:text-[11px]">✍️ Text Color</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }),
);

export default ColorCard;
