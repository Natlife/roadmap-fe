import type { UserPlan, UserRole } from './auth';

// Mirrors node-backend mapUser(): active is a boolean flag; there is no
// separate "deleted" state — soft-delete is modelled as active === false.
export interface User {
  id: string;
  email: string;
  username: string;
  fullName: string;
  plan: UserPlan;
  role: UserRole;
  active: boolean;
  groupIds: string[];
  streakDays?: number;
  completedStepsCount?: number;
}

// POST /admin/users — role is only honored at creation time by the backend.
export interface CreateUserPayload {
  email: string;
  username?: string;
  fullName: string;
  password: string;
  role: UserRole;
  plan: UserPlan;
}

// PUT /users/:id — backend (updateUserProfile) ONLY persists these three
// fields via COALESCE. email / username / role / password are ignored server-side.
export interface UpdateUserPayload {
  fullName?: string;
  plan?: UserPlan;
  active?: boolean;
  role?: UserRole;
  password?: string;
}
