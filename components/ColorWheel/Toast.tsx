/**
 * Toast.tsx
 * Fixed bottom-centre notification.
 * Uses forwardRef so App.tsx can pass a ref for GSAP exit animation.
 *
 * Props supplied by App.tsx:
 *   toast — ToastData | null  (null = hidden)
 *   ref   — forwarded to the wrapper div for GSAP targeting
 */

import { forwardRef } from 'react';

export type ToastData = {
  msg: string;
  icon: string;
  id: number;
};

type Props = {
  toast: ToastData | null;
};

const Toast = forwardRef<HTMLDivElement, Props>(function Toast({ toast }, ref) {
  if (!toast) return null;

  return (
    <div
      ref={ref}
      key={toast.id}
      className="pointer-events-none fixed bottom-5 z-[9000]"
      style={{ left: '50%', transform: 'translateX(-50%)' }}
      role="status"
      aria-live="polite"
    >
      <div
        className="flex items-center gap-2 rounded-2xl border border-zinc-700/50 shadow-2xl"
        style={{
          background: 'rgba(13,13,18,0.97)',
          backdropFilter: 'blur(22px)',
          padding: 'clamp(7px,0.9vw,11px) clamp(12px,1.5vw,18px)',
        }}
      >
        <span style={{ fontSize: 'clamp(11px,1.1vw,14px)' }}>{toast.icon}</span>
        <p
          className="font-medium whitespace-nowrap text-white"
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 'clamp(10px,1.05vw,13px)',
          }}
        >
          {toast.msg}
        </p>
      </div>
    </div>
  );
});

export default Toast;
