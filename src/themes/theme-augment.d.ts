import '@mui/material/styles';

// Extend MUI palette colors with the extra ramp stops used by the theme.
declare module '@mui/material/styles' {
  interface PaletteColor {
    lighter?: string;
    darker?: string;
    100?: string;
    200?: string;
    400?: string;
    600?: string;
    800?: string;
  }
  interface SimplePaletteColorOptions {
    lighter?: string;
    darker?: string;
    100?: string;
    200?: string;
    400?: string;
    600?: string;
    800?: string;
  }
  interface Color {
    0?: string;
    950?: string;
  }

  interface TypographyVariants {
    customInput: import('react').CSSProperties;
  }
  interface TypographyVariantsOptions {
    customInput?: import('react').CSSProperties;
  }
}

declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    customInput: true;
  }
}

import type { CustomShadows } from './shadows';

declare module '@mui/material/styles' {
  interface Theme {
    customShadows: CustomShadows;
  }
  interface ThemeOptions {
    customShadows?: CustomShadows;
  }
}
