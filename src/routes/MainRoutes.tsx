import { lazy } from 'react';
import { Navigate, type RouteObject } from 'react-router-dom';

import Loadable from '@/components/Loadable';
import DashboardLayout from '@/layout/Dashboard';
import AuthGuard from '@/utils/route-guard/AuthGuard';
import RoleGuard from '@/utils/route-guard/RoleGuard';
import RouteErrorBoundary from '@/components/RouteErrorBoundary';

const Dashboard = Loadable(lazy(() => import('@/pages/dashboard')));
const Analytics = Loadable(lazy(() => import('@/pages/dashboard/Analytics')));
const UsersPage = Loadable(lazy(() => import('@/pages/admin/users')));
const GroupsPage = Loadable(lazy(() => import('@/pages/admin/groups')));
const GroupDetailPage = Loadable(lazy(() => import('@/pages/admin/groups/GroupDetail')));
const TaxonomyPage = Loadable(lazy(() => import('@/pages/admin/taxonomy')));
const ContentTopics = Loadable(lazy(() => import('@/pages/admin/content')));
const TopicDetail = Loadable(lazy(() => import('@/pages/admin/content/TopicDetail')));
const BlogDetail = Loadable(lazy(() => import('@/pages/admin/content/BlogDetail')));
const StepEditor = Loadable(lazy(() => import('@/pages/admin/content/StepEditor')));
const PlanRequestsPage = Loadable(lazy(() => import('@/pages/admin/plan-requests/PlanRequestManagement')));
const SettingsPage = Loadable(lazy(() => import('@/pages/settings')));

const MainRoutes: RouteObject = {
  path: '/',
  element: (
    <AuthGuard>
      <DashboardLayout />
    </AuthGuard>
  ),
  errorElement: <RouteErrorBoundary />,
  children: [
    { index: true, element: <Navigate to="/dashboard" replace /> },
    { path: 'dashboard', element: <Dashboard /> },
    { path: 'analytics', element: <Analytics /> },
    { path: 'admin', element: <Navigate to="/admin/users" replace /> },
    { path: 'admin/plan-requests', element: <RoleGuard roles={['ADMIN']}><PlanRequestsPage /></RoleGuard> },
    { path: 'admin/users', element: <RoleGuard roles={['ADMIN']}><UsersPage /></RoleGuard> },
    { path: 'admin/groups', element: <RoleGuard roles={['ADMIN']}><GroupsPage /></RoleGuard> },
    { path: 'admin/groups/:groupId', element: <RoleGuard roles={['ADMIN']}><GroupDetailPage /></RoleGuard> },
    { path: 'admin/taxonomy', element: <RoleGuard roles={['ADMIN']}><TaxonomyPage /></RoleGuard> },
    { path: 'admin/content', element: <RoleGuard roles={['ADMIN']}><ContentTopics /></RoleGuard> },
    { path: 'admin/content/topics/:topicId', element: <RoleGuard roles={['ADMIN']}><TopicDetail /></RoleGuard> },
    { path: 'admin/content/topics/:topicId/blogs/:blogId', element: <RoleGuard roles={['ADMIN']}><BlogDetail /></RoleGuard> },
    { path: 'admin/content/steps/:stepId', element: <RoleGuard roles={['ADMIN']}><StepEditor /></RoleGuard> },
    { path: 'settings', element: <SettingsPage /> }
  ]
};

export default MainRoutes;
