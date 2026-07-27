import type { PaletteMode } from '@mui/material';
import type { PresetColor } from '@/config';
import { BRAND_COLOR_RAMPS, BrandColorTone } from '@/constants/themeColors';

export interface ColorRamp {
  lighter: string;
  light: string;
  main: string;
  dark: string;
  darker: string;
  contrastText: string;
}

const PRESETS: Record<string, Omit<ColorRamp, 'contrastText'>> = {
  [BrandColorTone.GREEN]: BRAND_COLOR_RAMPS[BrandColorTone.GREEN],
  [BrandColorTone.BLUE]: BRAND_COLOR_RAMPS[BrandColorTone.BLUE],
  [BrandColorTone.ORANGE]: BRAND_COLOR_RAMPS[BrandColorTone.ORANGE]
};

// Neutral zinc ramp (light -> dark) shared across modes.
const GREY = {
  0: '#ffffff',
  50: '#fafafa',
  100: '#f4f4f5',
  200: '#e4e4e7',
  300: '#d4d4d8',
  400: '#a1a1aa',
  500: '#71717a',
  600: '#52525b',
  700: '#3f3f46',
  800: '#27272a',
  900: '#18181b',
  950: '#09090b'
};

export interface ThemeColors {
  primary: ColorRamp;
  grey: typeof GREY;
  success: ColorRamp;
  warning: ColorRamp;
  error: ColorRamp;
  info: ColorRamp;
}

export default function getThemeColors(preset: PresetColor, _mode: PaletteMode): ThemeColors {
  const p = PRESETS[preset] ?? PRESETS[BrandColorTone.GREEN];
  return {
    primary: { ...p, contrastText: '#ffffff' },
    grey: GREY,
    success: { lighter: '#ebf7eb', light: '#79cd74', main: '#4EB748', dark: '#3a9635', darker: '#246b20', contrastText: '#fff' },
    warning: { lighter: '#feefe6', light: '#f79457', main: '#F37022', dark: '#c9520b', darker: '#8c3400', contrastText: '#fff' },
    error: { lighter: '#fee2e2', light: '#f87171', main: '#ef4444', dark: '#dc2626', darker: '#991b1b', contrastText: '#fff' },
    info: { lighter: '#e6effb', light: '#4278cb', main: '#124DA3', dark: '#0b377a', darker: '#05204d', contrastText: '#fff' }
  };
}
