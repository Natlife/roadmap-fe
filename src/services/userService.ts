import axios, { unwrap, unwrapList } from '@/api/axios';
import { endpoints } from '@/api/endpoints';
import type {
  ApiEnvelope,
  CreateUserPayload,
  ListParams,
  Paginated,
  UpdateUserPayload,
  User,
  UserRole
} from '@/types';

// The deployed API keys role off an integer roleId (1 = ADMIN, 2 = USER),
// matching the roles seed. We send BOTH `role` (string) and `roleId` (int) so
// the request works whether the backend reads one or the other — Express simply
// ignores whichever field its handler doesn't use.
function roleToId(role?: UserRole): number {
  return role === 'ADMIN' ? 1 : 2;
}

function ensureUsername(username: string | undefined, email: string): string {
  const u = (username ?? '').trim();
  if (u.length >= 3) return u;
  const local = email.split('@')[0] || 'user';
  return local.length >= 3 ? local : `${local}_user`;
}

function normalizeUser(raw: Record<string, unknown>): User {
  return {
    id: String(raw.id),
    email: (raw.email as string) ?? '',
    username: (raw.username as string) ?? (raw.user_name as string) ?? '',
    fullName: (raw.fullName as string) ?? (raw.full_name as string) ?? '',
    plan: String(raw.plan ?? 'FREE').toUpperCase() as User['plan'],
    role: String(raw.role ?? raw.role_name ?? 'USER').toUpperCase().replace(/^ROLE_/, '') as User['role'],
    active: raw.active === undefined ? true : Boolean(raw.active),
    groupIds: (raw.groupIds as string[]) ?? [],
    streakDays: (raw.streakDays as number) ?? 0,
    completedStepsCount: (raw.completedStepsCount as number) ?? 0
  };
}

const userService = {
  async list(params: ListParams = {}): Promise<Paginated<User>> {
    // Server-side search / filter / sort / pagination. Undefined params are omitted.
    const query: Record<string, unknown> = {
      page: params.page ?? 1,
      pageSize: params.pageSize ?? 20
    };
    if (params.search) query.search = params.search;
    if (params.role) query.role = params.role;
    if (params.plan) query.plan = params.plan;
    if (params.status && params.status !== 'all') query.status = params.status;
    if (params.sortBy) query.sortBy = params.sortBy;
    if (params.sortOrder) query.sortOrder = params.sortOrder;

    const res = await axios.get<ApiEnvelope<Record<string, unknown>[]>>(endpoints.users.list, { params: query });
    const { items, meta } = unwrapList(res);
    return { items: items.map(normalizeUser), meta };
  },

  async get(id: string): Promise<User> {
    const res = await axios.get<ApiEnvelope<Record<string, unknown>>>(endpoints.users.detail(id));
    return normalizeUser(unwrap(res));
  },

  async create(payload: CreateUserPayload): Promise<User> {
    const body = {
      email: payload.email,
      username: ensureUsername(payload.username, payload.email),
      password: payload.password,
      fullName: payload.fullName,
      role: payload.role, // string form (local node-backend)
      roleId: roleToId(payload.role), // integer form (deployed backend)
      plan: payload.plan // ignored by backends without a plan field
    };
    const res = await axios.post<ApiEnvelope<Record<string, unknown>>>(endpoints.users.create, body);
    return normalizeUser(unwrap(res));
  },

  // Send both plan and roleId/active/booleans so it works across contracts.
  async update(id: string, payload: UpdateUserPayload): Promise<User> {
    const body: Record<string, unknown> = {};
    if (payload.fullName !== undefined) body.fullName = payload.fullName;
    if (payload.plan !== undefined) body.plan = payload.plan;
    if (payload.active !== undefined) body.active = payload.active; // boolean — accepted by tinyint & Boolean DTO
    if (payload.role !== undefined) {
      body.role = payload.role;
      body.roleId = roleToId(payload.role);
    }
    if (payload.password) body.password = payload.password;
    const res = await axios.put<ApiEnvelope<Record<string, unknown>>>(endpoints.users.detail(id), body);
    return normalizeUser(unwrap(res));
  },

  async softDelete(id: string): Promise<User> {
    return this.update(id, { active: false });
  },

  async reactivate(id: string): Promise<User> {
    return this.update(id, { active: true });
  },

  async hardDelete(id: string): Promise<void> {
    await axios.delete(endpoints.users.detail(id));
  }
};

export default userService;
