/**
 * DemoText.tsx
 *
 * Live color preview — shown in two contexts:
 *
 *   Mobile/Tablet (<lg):
 *     Fixed bottom overlay (position: fixed), outside layout flow.
 *     The SVG never moves because this element is not in the flex tree.
 *     Parent: App.tsx (fixed inset-x-3 bottom-4 z-30)
 *
 *   Desktop (lg+):
 *     Normal flow inside the right panel sidebar.
 *     Parent: <aside> in App.tsx content area.
 *
 * No `visible` prop — mounting is controlled by the parent.
 * textClass is ALWAYS applied. Mode only changes the label text.
 *
 * React.memo: re-renders only when textClass or mode changes.
 */

import { memo } from 'react';
import type { ModeKey } from '@/lib/modes';

type Props = {
  textClass: string;
  mode: ModeKey;
};

const DemoText = memo(function DemoText({ textClass, mode }: Props) {
  const isTextMode = mode === 'text';

  return (
    <div className="w-full rounded-2xl border border-white/[0.08] bg-white/[0.03] px-6 py-4 backdrop-blur-sm">
      {/* Mode label */}
      <p className="mb-3 text-center font-mono text-[9px] tracking-widest text-white/35 uppercase">
        {isTextMode ? '✍️ text color preview' : '🎨 background preview'}
      </p>

      {/* Large heading */}
      <p
        className={`text-center text-2xl leading-tight font-extrabold tracking-tight transition-colors duration-500 sm:text-3xl lg:text-4xl xl:text-5xl ${textClass} `}
      >
        The quick
        <br className="hidden lg:block" /> brown fox
      </p>

      {/* Body sample */}
      <p
        className={`mt-3 text-center text-sm leading-relaxed opacity-70 transition-colors duration-500 ${textClass} `}
      >
        Tailwind CSS v4 · 26 colors · 11 shades
      </p>

      {/* Alphabet sample — desktop only */}
      <p
        className={`mt-3 hidden text-center font-mono text-xs tracking-widest opacity-40 transition-colors duration-500 lg:block ${textClass} `}
      >
        Aa Bb Cc Dd Ee 0123456789
      </p>
    </div>
  );
});

export default DemoText;
