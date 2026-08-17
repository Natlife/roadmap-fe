import { lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom';

import Loadable from '@/components/Loadable';
import MainRoutes from './MainRoutes';
import LoginRoutes from './LoginRoutes';
import RouteErrorBoundary from '@/components/RouteErrorBoundary';

const Error404 = Loadable(lazy(() => import('@/pages/maintenance/Error404')));
const Error403 = Loadable(lazy(() => import('@/pages/maintenance/Error403')));
const PrivacyPolicy = Loadable(lazy(() => import('@/pages/auth/PrivacyPolicy')));
const DeleteAccount = Loadable(lazy(() => import('@/pages/auth/DeleteAccount')));

const router = createBrowserRouter(
  [
    MainRoutes,
    LoginRoutes,
    { path: '/privacy', element: <PrivacyPolicy />, errorElement: <RouteErrorBoundary /> },
    { path: '/chinh-sach-bao-mat', element: <PrivacyPolicy />, errorElement: <RouteErrorBoundary /> },
    { path: '/delete-account', element: <DeleteAccount />, errorElement: <RouteErrorBoundary /> },
    { path: '/xoa-tai-khoan', element: <DeleteAccount />, errorElement: <RouteErrorBoundary /> },
    { path: '/403', element: <Error403 />, errorElement: <RouteErrorBoundary /> },
    { path: '*', element: <Error404 /> }
  ],
  { basename: import.meta.env.VITE_APP_BASE_NAME || '/' }
);

export default router;
