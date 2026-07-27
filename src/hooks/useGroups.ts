import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import groupService from '@/services/groupService';
import { queryKeys } from '@/api/queryKeys';
import type { CreateGroupPayload, UpdateGroupPayload } from '@/types';

export function useGroups() {
  return useQuery({ queryKey: queryKeys.groups.list(), queryFn: () => groupService.list() });
}

export function useGroup(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.groups.detail(id ?? ''),
    queryFn: () => groupService.get(id as string),
    enabled: Boolean(id)
  });
}

export function useCreateGroup() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateGroupPayload) => groupService.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.groups.all })
  });
}

export function useUpdateGroup() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateGroupPayload }) => groupService.update(id, payload),
    onSuccess: (_data, { id }) => {
      qc.invalidateQueries({ queryKey: queryKeys.groups.all });
      qc.invalidateQueries({ queryKey: queryKeys.groups.detail(id) });
    }
  });
}

export function useDeleteGroup() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => groupService.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.groups.all })
  });
}

export function useGroupMembers(groupId: string) {
  const qc = useQueryClient();
  const invalidate = () => {
    qc.invalidateQueries({ queryKey: queryKeys.groups.detail(groupId) });
    qc.invalidateQueries({ queryKey: queryKeys.groups.all });
  };
  const addMember = useMutation({
    mutationFn: (userId: string) => groupService.addMember(groupId, userId),
    onSuccess: invalidate
  });
  const removeMember = useMutation({
    mutationFn: (userId: string) => groupService.removeMember(groupId, userId),
    onSuccess: invalidate
  });
  return { addMember, removeMember };
}
