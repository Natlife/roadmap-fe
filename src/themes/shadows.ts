import type { PaletteMode } from '@mui/material';

// Subtle, low-contrast elevation — matches the flat Dokploy look.
export default function customShadows(mode: PaletteMode) {
  const c = mode === 'dark' ? '0, 0, 0' : '24, 24, 27';
  return {
    z1: `0 1px 2px 0 rgba(${c}, ${mode === 'dark' ? 0.6 : 0.06})`,
    card: `0 1px 3px 0 rgba(${c}, ${mode === 'dark' ? 0.5 : 0.08})`,
    dropdown: `0 6px 24px -4px rgba(${c}, ${mode === 'dark' ? 0.7 : 0.16})`,
    dialog: `0 12px 40px -8px rgba(${c}, ${mode === 'dark' ? 0.8 : 0.2})`
  };
}

export type CustomShadows = ReturnType<typeof customShadows>;
