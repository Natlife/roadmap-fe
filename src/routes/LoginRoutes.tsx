import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';

import Loadable from '@/components/Loadable';
import AuthLayout from '@/layout/Auth';
import GuestGuard from '@/utils/route-guard/GuestGuard';
import RouteErrorBoundary from '@/components/RouteErrorBoundary';

const LoginPage = Loadable(lazy(() => import('@/pages/auth/Login')));

// Pathless layout route: matches nothing on its own, delegates to children.
const LoginRoutes: RouteObject = {
  element: (
    <GuestGuard>
      <AuthLayout />
    </GuestGuard>
  ),
  errorElement: <RouteErrorBoundary />,
  children: [{ path: 'login', element: <LoginPage /> }]
};

export default LoginRoutes;
