/**
 * lib/modes.ts
 * Interaction mode definitions — shared by App.tsx and Header.tsx.
 */

export type ModeKey = 'normal' | 'bg' | 'text' | 'color-picker';

export type ModeConfig = {
  label: string;
  icon: string;
  description: string;
};

export const MODES: Record<ModeKey, ModeConfig> = {
  normal: {
    label: 'Normal',
    icon: '👁',
    description: 'Click does nothing',
  },
  bg: {
    label: 'Background',
    icon: '🎨',
    description: 'Click a color to set the page background',
  },
  text: {
    label: 'Text Color',
    icon: '✍️',
    description: 'Click a color to set the title color',
  },
  'color-picker': {
    label: 'Copy Name',
    icon: '📋',
    description: 'Click a color to copy its Tailwind name',
  },
};

export const MODE_KEYS = Object.keys(MODES) as ModeKey[];
