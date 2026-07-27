export type GroupStatus = 'ACTIVE' | 'INACTIVE' | 'EXPIRED';

export interface GroupMember {
  id: string;
  fullName?: string;
  email?: string;
}

export interface Group {
  id: string;
  title: string;
  description: string;
  status: GroupStatus;
  expiredAt?: string | null;
  memberCount?: number;
  members?: GroupMember[];
}

export interface CreateGroupPayload {
  title: string;
  description?: string;
  expiredAt?: string | null;
}

export type UpdateGroupPayload = Partial<CreateGroupPayload>;
