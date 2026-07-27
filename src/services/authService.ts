import axios, { unwrap } from '@/api/axios';
import { endpoints } from '@/api/endpoints';
import type { ApiEnvelope, AuthUser, LoginCredentials, LoginResponse } from '@/types';

function normalizeRole(role?: unknown): AuthUser['role'] {
  const r = String(role ?? '').toUpperCase();
  if (r.includes('ADMIN')) return 'ADMIN';
  return 'USER';
}

function toAuthUser(raw: LoginResponse | AuthUser): AuthUser {
  // /auth/login nests the user but keeps role/plan at the top level;
  // /auth/me returns a flat user. Normalize both to AuthUser.
  const anyRaw = raw as unknown as Record<string, unknown>;
  const nested = (anyRaw.user as AuthUser | undefined) ?? (raw as AuthUser);
  const rawRole = anyRaw.role ?? nested.role;
  return {
    id: String(nested.id),
    name: nested.name || nested.fullName,
    fullName: nested.fullName,
    email: nested.email,
    role: normalizeRole(rawRole),
    plan: (anyRaw.plan as AuthUser['plan']) ?? nested.plan ?? 'FREE',
    streakDays: nested.streakDays,
    completedStepsCount: nested.completedStepsCount,
    groupIds: nested.groupIds ?? []
  };
}

const authService = {
  async login(credentials: LoginCredentials): Promise<{ token: string; user: AuthUser }> {
    const res = await axios.post<ApiEnvelope<LoginResponse>>(endpoints.auth.login, {
      email: credentials.email,
      username: credentials.email,
      password: credentials.password
    });
    const data = unwrap(res);
    return { token: data.token, user: toAuthUser(data) };
  },

  async getProfile(): Promise<AuthUser> {
    const res = await axios.get<ApiEnvelope<AuthUser>>(endpoints.auth.me);
    return toAuthUser(unwrap(res));
  }
};

export default authService;
