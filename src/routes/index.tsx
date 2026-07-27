import { lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom';

import Loadable from '@/components/Loadable';
import MainRoutes from './MainRoutes';
import LoginRoutes from './LoginRoutes';
import RouteErrorBoundary from '@/components/RouteErrorBoundary';

const Error404 = Loadable(lazy(() => import('@/pages/maintenance/Error404')));
const Error403 = Loadable(lazy(() => import('@/pages/maintenance/Error403')));

const router = createBrowserRouter(
  [
    MainRoutes,
    LoginRoutes,
    { path: '/403', element: <Error403 />, errorElement: <RouteErrorBoundary /> },
    { path: '*', element: <Error404 /> }
  ],
  { basename: import.meta.env.VITE_APP_BASE_NAME || '/' }
);

export default router;
