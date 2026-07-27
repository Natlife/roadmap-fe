import { Navigate } from 'react-router-dom';
import { type ReactNode } from 'react';

import useAuth from '@/hooks/useAuth';
import type { UserRole } from '@/types';

// Restricts a route subtree to specific roles.
export default function RoleGuard({ roles, children }: { roles: UserRole[]; children: ReactNode }) {
  const { user } = useAuth();
  const userRole = user?.role ? (user.role.toUpperCase().includes('ADMIN') ? 'ADMIN' : 'USER') : null;
  if (!userRole || !roles.includes(userRole as UserRole)) {
    return <Navigate to="/403" replace />;
  }
  return <>{children}</>;
}
