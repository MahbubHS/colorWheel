/**
 * Backdrop.tsx — atmospheric glow layers. Pure presentational, no props.
 * React.memo prevents any re-render (this component never changes).
 */
import { memo } from 'react';

const Backdrop = memo(function Backdrop() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0" aria-hidden="true">
      {/* Radial centre glow */}
      <div className="absolute top-1/2 left-1/2 h-[70vmax] w-[70vmax] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/[0.007] blur-[120px]" />
      {/* Top vignette */}
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-white/[0.02] to-transparent" />
      {/* Bottom vignette */}
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/40 to-transparent" />
      {/* Top hairline border */}
      <div className="absolute inset-x-0 top-0 h-px bg-white/[0.06]" />
    </div>
  );
});

export default Backdrop;
