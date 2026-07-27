/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_APP_NAME: string;
  readonly VITE_APP_VERSION: string;
  readonly VITE_APP_BASE_NAME: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module 'simplebar-react';

