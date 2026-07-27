import { createContext, useMemo, type ReactNode } from 'react';

import useLocalStorage from '@/hooks/useLocalStorage';
import defaultConfig, {
  CONFIG_STORAGE_KEY,
  type AppConfig,
  type FontFamily,
  type MenuOrientation,
  type PresetColor,
  type ThemeMode
} from '@/config';

export interface ConfigContextValue extends AppConfig {
  onChangeMode: (mode: ThemeMode) => void;
  onToggleMode: () => void;
  onChangeMenuOrientation: (orientation: MenuOrientation) => void;
  onChangeMiniDrawer: (mini: boolean) => void;
  onChangeContainer: (container: boolean) => void;
  onChangeFontFamily: (font: FontFamily) => void;
  onChangePresetColor: (color: PresetColor) => void;
  onChangeLocalization: (lang: AppConfig['i18n']) => void;
  onReset: () => void;
}

const initialState: ConfigContextValue = {
  ...defaultConfig,
  onChangeMode: () => {},
  onToggleMode: () => {},
  onChangeMenuOrientation: () => {},
  onChangeMiniDrawer: () => {},
  onChangeContainer: () => {},
  onChangeFontFamily: () => {},
  onChangePresetColor: () => {},
  onChangeLocalization: () => {},
  onReset: () => {}
};

const ConfigContext = createContext<ConfigContextValue>(initialState);

export function ConfigProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useLocalStorage<AppConfig>(CONFIG_STORAGE_KEY, defaultConfig);

  const value = useMemo<ConfigContextValue>(
    () => ({
      ...config,
      onChangeMode: (mode) => setConfig((prev) => ({ ...prev, mode })),
      onToggleMode: () => setConfig((prev) => ({ ...prev, mode: prev.mode === 'dark' ? 'light' : 'dark' })),
      onChangeMenuOrientation: (menuOrientation) => setConfig((prev) => ({ ...prev, menuOrientation })),
      onChangeMiniDrawer: (miniDrawer) => setConfig((prev) => ({ ...prev, miniDrawer })),
      onChangeContainer: (container) => setConfig((prev) => ({ ...prev, container })),
      onChangeFontFamily: (fontFamily) => setConfig((prev) => ({ ...prev, fontFamily })),
      onChangePresetColor: (presetColor) => setConfig((prev) => ({ ...prev, presetColor })),
      onChangeLocalization: (i18n) => setConfig((prev) => ({ ...prev, i18n })),
      onReset: () => setConfig(defaultConfig)
    }),
    [config, setConfig]
  );

  return <ConfigContext.Provider value={value}>{children}</ConfigContext.Provider>;
}

export default ConfigContext;
