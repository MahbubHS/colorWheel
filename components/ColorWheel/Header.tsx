/**
 * Header.tsx — brand + title (always white) + shadcn Select.
 * React.memo: re-renders only when mode or onModeChange changes.
 */

import { memo } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { MODES, MODE_KEYS, type ModeKey } from '@/lib/modes';

type Props = {
  mode: ModeKey;
  onModeChange: (mode: ModeKey) => void;
};

const Header = memo(function Header({ mode, onModeChange }: Props) {
  return (
    <header className="relative z-10 flex shrink-0 items-center justify-between border-b border-white/[0.06] px-4 py-3 sm:px-6 sm:py-4 md:px-8">
      {/* Brand */}
      <div className="flex min-w-0 items-center gap-2 sm:gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/[0.09] bg-white/[0.06] text-lg sm:h-11 sm:w-11 sm:text-xl">
          🛞
        </div>
        <div className="min-w-0">
          {/* Title is always text-white — text color previewed in DemoText */}
          <h1 className="truncate text-base leading-tight font-extrabold tracking-tight text-white sm:text-lg md:text-xl">
            Tailwind Color Wheel
          </h1>
          <p className="mt-0.5 font-mono text-[9px] leading-none tracking-widest text-zinc-600 uppercase sm:text-[10px]">
            26 Colors · 11 Shades
          </p>
        </div>
      </div>

      {/* shadcn Select — default UI, position popper */}
      <Select value={mode} onValueChange={(v) => onModeChange(v as ModeKey)}>
        <SelectTrigger className="w-32 shrink-0 sm:w-40">
          <SelectValue placeholder="Mode" />
        </SelectTrigger>
        <SelectContent className="bg-black/10 [&_[data-state=checked]]:bg-white/10" position="popper" sideOffset={1}>
          {MODE_KEYS.map((key) => (
            <SelectItem key={key} value={key}>
              {MODES[key].icon} {MODES[key].label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </header>
  );
});

export default Header;
