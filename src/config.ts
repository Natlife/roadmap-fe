// ==============================|| APP GLOBAL CONFIG ||============================== //

import { BrandColorTone } from '@/constants/themeColors';

export type ThemeMode = 'light' | 'dark';
export type MenuOrientation = 'vertical' | 'horizontal';
export type PresetColor = BrandColorTone | 'green' | 'blue' | 'orange';
export type FontFamily = `'Inter', sans-serif` | `'Public Sans', sans-serif`;

export interface AppConfig {
  /** default UI language */
  i18n: 'en' | 'vi';
  /** menu orientation */
  menuOrientation: MenuOrientation;
  /** collapse sidebar to icons only */
  miniDrawer: boolean;
  /** constrain content width */
  container: boolean;
  /** base font family */
  fontFamily: FontFamily;
  /** primary preset palette */
  presetColor: PresetColor;
  /** light | dark */
  mode: ThemeMode;
  /** global border radius (px) */
  themeDirection: 'ltr' | 'rtl';
  borderRadius: number;
}

export const APP_NAME = import.meta.env.VITE_APP_NAME || 'Học Mẹo Admin';
export const APP_VERSION = import.meta.env.VITE_APP_VERSION || '1.0.0';
export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001').replace(/\/+$/, '');
export const SUPPORT_EMAIL = import.meta.env.VITE_SUPPORT_EMAIL || 'hoanganhbvh@gmail.com';
export const APP_PACKAGE_ID = import.meta.env.VITE_APP_PACKAGE_ID || 'com.hocmeo.learning.app';
export const DEVELOPER_NAME = import.meta.env.VITE_DEVELOPER_NAME || 'Học Mẹo Platform Team';

export const APP_DEFAULT_PATH = '/dashboard';
export const HORIZONTAL_MAX_ITEM = 7;

// drawer sizing
export const DRAWER_WIDTH = 260;
export const MINI_DRAWER_WIDTH = 72;

// localStorage key that persists user theme preferences
export const CONFIG_STORAGE_KEY = 'roadmap-admin-config';
// session key holding the JWT access token
export const AUTH_STORAGE_KEY = 'roadmap-admin-token';

const config: AppConfig = {
  i18n: 'en',
  menuOrientation: 'vertical',
  miniDrawer: false,
  container: true,
  fontFamily: `'Inter', sans-serif`,
  presetColor: 'green',
  mode: 'dark',
  themeDirection: 'ltr',
  borderRadius: 8
};

export default config;
