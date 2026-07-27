import type { TypographyVariantsOptions } from '@mui/material/styles';

// Inter-based type scale, compact like a developer console.
export default function typography(fontFamily: string): TypographyVariantsOptions {
  return {
    fontFamily,
    htmlFontSize: 16,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 600,
    h1: { fontWeight: 600, fontSize: '2.125rem', lineHeight: 1.21, letterSpacing: '-0.02em' },
    h2: { fontWeight: 600, fontSize: '1.75rem', lineHeight: 1.27, letterSpacing: '-0.02em' },
    h3: { fontWeight: 600, fontSize: '1.375rem', lineHeight: 1.33, letterSpacing: '-0.01em' },
    h4: { fontWeight: 600, fontSize: '1.125rem', lineHeight: 1.4 },
    h5: { fontWeight: 600, fontSize: '1rem', lineHeight: 1.5 },
    h6: { fontWeight: 500, fontSize: '0.875rem', lineHeight: 1.57 },
    subtitle1: { fontWeight: 500, fontSize: '0.875rem', lineHeight: 1.57 },
    subtitle2: { fontWeight: 500, fontSize: '0.75rem', lineHeight: 1.66 },
    body1: { fontSize: '0.875rem', lineHeight: 1.57 },
    body2: { fontSize: '0.8125rem', lineHeight: 1.66 },
    caption: { fontWeight: 400, fontSize: '0.75rem', lineHeight: 1.5 },
    overline: { fontWeight: 500, fontSize: '0.6875rem', letterSpacing: '0.06em', textTransform: 'uppercase' },
    button: { fontWeight: 500, fontSize: '0.8125rem', textTransform: 'none' },
    customInput: { fontSize: '0.875rem' }
  };
}
