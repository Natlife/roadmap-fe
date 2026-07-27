import axios, { unwrap } from '@/api/axios';
import { endpoints } from '@/api/endpoints';
import type { ApiEnvelope, CreateGroupPayload, Group, UpdateGroupPayload } from '@/types';

function normalizeMembers(raw: unknown): Group['members'] {
  if (!Array.isArray(raw)) return [];
  return raw.map((m) => {
    if (m && typeof m === 'object') {
      const o = m as Record<string, unknown>;
      return { id: String(o.id ?? o.user_id ?? o.userId), fullName: o.fullName as string, email: o.email as string };
    }
    return { id: String(m) };
  });
}

function parseGroupStatus(status: unknown): Group['status'] {
  if (status === 2 || status === '2' || String(status).toUpperCase() === 'EXPIRED') {
    return 'EXPIRED';
  }
  if (status === 0 || status === '0' || String(status).toUpperCase() === 'INACTIVE') {
    return 'INACTIVE';
  }
  return 'ACTIVE';
}

// backend rows use snake_case (expired_at) — normalize to the Group type.
function toGroup(raw: Record<string, unknown>): Group {
  return {
    id: String(raw.id),
    title: (raw.title as string) ?? (raw.name as string) ?? '',
    description: (raw.description as string) ?? '',
    status: parseGroupStatus(raw.status),
    expiredAt: (raw.expiredAt as string) ?? (raw.expired_at as string) ?? null,
    memberCount:
      (raw.memberCount as number) ?? (Array.isArray(raw.members) ? (raw.members as unknown[]).length : undefined),
    members: normalizeMembers(raw.members)
  };
}

const groupService = {
  async list(): Promise<Group[]> {
    const res = await axios.get<ApiEnvelope<Record<string, unknown>[]>>(endpoints.groups.list);
    return (unwrap(res) ?? []).map(toGroup);
  },

  async get(id: string): Promise<Group> {
    const res = await axios.get<ApiEnvelope<Record<string, unknown>>>(endpoints.groups.detail(id));
    return toGroup(unwrap(res));
  },

  async create(payload: CreateGroupPayload): Promise<Group> {
    const res = await axios.post<ApiEnvelope<Record<string, unknown>>>(endpoints.groups.create, payload);
    return toGroup(unwrap(res));
  },

  async update(id: string, payload: UpdateGroupPayload): Promise<Group> {
    const res = await axios.put<ApiEnvelope<Record<string, unknown>>>(endpoints.groups.detail(id), payload);
    return toGroup(unwrap(res));
  },

  async remove(id: string): Promise<void> {
    await axios.delete(endpoints.groups.detail(id));
  },

  async addMember(groupId: string, userId: string): Promise<void> {
    await axios.post(endpoints.groups.member(groupId, userId));
  },

  async removeMember(groupId: string, userId: string): Promise<void> {
    await axios.delete(endpoints.groups.member(groupId, userId));
  }
};

export default groupService;
