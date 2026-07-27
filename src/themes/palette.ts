import { createTheme, type PaletteMode, type PaletteOptions } from '@mui/material';
import type { PresetColor } from '@/config';
import getThemeColors from './theme';

// Builds a Dokploy-flavored palette for the given mode + accent preset.
export default function palette(mode: PaletteMode, presetColor: PresetColor) {
  const c = getThemeColors(presetColor, mode);
  const isDark = mode === 'dark';

  const paletteOptions: PaletteOptions = {
    mode,
    common: { black: '#000', white: '#fff' },
    primary: { ...c.primary },
    secondary: {
      lighter: c.grey[100],
      light: c.grey[400],
      main: c.grey[500],
      dark: c.grey[700],
      darker: c.grey[900],
      contrastText: '#fff',
      100: c.grey[100],
      200: c.grey[200],
      400: c.grey[400],
      600: c.grey[600],
      800: c.grey[800]
    } as PaletteOptions['secondary'],
    success: { ...c.success },
    warning: { ...c.warning },
    error: { ...c.error },
    info: { ...c.info },
    grey: c.grey,
    divider: isDark ? 'rgba(255, 255, 255, 0.10)' : c.grey[200],
    background: {
      default: isDark ? '#09090b' : c.grey[50],
      paper: isDark ? '#111113' : '#ffffff'
    },
    text: {
      primary: isDark ? '#fafafa' : c.grey[900],
      secondary: isDark ? c.grey[400] : c.grey[600],
      disabled: isDark ? c.grey[700] : c.grey[400]
    },
    action: {
      hover: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)',
      selected: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)'
    }
  };

  return createTheme({ palette: paletteOptions });
}
