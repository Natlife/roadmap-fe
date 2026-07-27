import { useMemo, type ReactNode } from 'react';
import { CssBaseline, StyledEngineProvider } from '@mui/material';
import { ThemeProvider, createTheme, type Theme } from '@mui/material/styles';

import useConfig from '@/hooks/useConfig';
import palette from './palette';
import typographyBuilder from './typography';
import customShadows from './shadows';
import componentsOverride from './overrides';

// ==============================|| THEME CUSTOMIZATION WRAPPER ||============================== //

export default function ThemeCustomization({ children }: { children: ReactNode }) {
  const { mode, presetColor, fontFamily, borderRadius, themeDirection } = useConfig();

  const theme = useMemo<Theme>(() => {
    const base = palette(mode, presetColor);

    const built = createTheme({
      palette: base.palette,
      direction: themeDirection,
      shape: { borderRadius },
      spacing: 8,
      typography: typographyBuilder(fontFamily),
      customShadows: customShadows(mode),
      breakpoints: { values: { xs: 0, sm: 640, md: 768, lg: 1024, xl: 1280 } }
    });

    built.components = componentsOverride(built) as any;
    return built;
  }, [mode, presetColor, fontFamily, borderRadius, themeDirection]);

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <CssBaseline enableColorScheme />
        {children}
      </ThemeProvider>
    </StyledEngineProvider>
  );
}
