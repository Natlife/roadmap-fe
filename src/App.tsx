import { RouterProvider } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { SnackbarProvider } from 'notistack';

import router from '@/routes';
import queryClient from '@/api/queryClient';
import ThemeCustomization from '@/themes';
import { ConfigProvider } from '@/contexts/ConfigContext';
import { AuthProvider } from '@/contexts/JWTContext';
import ErrorBoundary from '@/components/ErrorBoundary';

// ==============================|| APP ROOT — provider stack ||============================== //
// Note: router hooks (useLocation, etc.) only work INSIDE <RouterProvider>, so
// nothing here may call them. Route-level UI lives in the route tree.

export default function App() {
  return (
    <ErrorBoundary>
      <ConfigProvider>
        <ThemeCustomization>
          <QueryClientProvider client={queryClient}>
            <SnackbarProvider maxSnack={3} autoHideDuration={3000} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
              <AuthProvider>
                <RouterProvider router={router} />
              </AuthProvider>
            </SnackbarProvider>
            {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
          </QueryClientProvider>
        </ThemeCustomization>
      </ConfigProvider>
    </ErrorBoundary>
  );
}
