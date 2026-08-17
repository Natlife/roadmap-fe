import type { ReactNode } from 'react';

export type UserRole = 'ADMIN' | 'USER';
export type UserPlan = 'FREE' | 'PREMIUM' | 'GROUP';

export interface AuthUser {
  id: string;
  name: string;
  fullName: string;
  email: string;
  role: UserRole;
  plan: UserPlan;
  streakDays?: number;
  completedStepsCount?: number;
  groupIds?: string[];
}

// shape returned by POST /auth/login
export interface LoginResponse {
  token: string;
  userId: string | number;
  email: string;
  username: string;
  fullName: string;
  role: UserRole;
  plan: UserPlan;
  user: AuthUser;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthContextValue {
  isLoggedIn: boolean;
  isInitialized: boolean;
  user: AuthUser | null;
  login: (credentials: LoginCredentials) => Promise<AuthUser>;
  logout: () => void;
}

export interface AuthProviderProps {
  children: ReactNode;
}
