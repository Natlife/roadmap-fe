import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import userService from '@/services/userService';
import { queryKeys } from '@/api/queryKeys';
import type { CreateUserPayload, ListParams, UpdateUserPayload } from '@/types';

export function useUsers(params: ListParams = {}) {
  return useQuery({
    queryKey: queryKeys.users.list(params),
    queryFn: () => userService.list(params),
    placeholderData: (prev) => prev
  });
}

export function useUser(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.users.detail(id ?? ''),
    queryFn: () => userService.get(id as string),
    enabled: Boolean(id)
  });
}

export function useCreateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateUserPayload) => userService.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.users.all })
  });
}

export function useUpdateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateUserPayload }) => userService.update(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.users.all })
  });
}

// Soft delete (deactivate) + restore. `active=false` is our "deleted" state.
export function useSetUserActive() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, active }: { id: string; active: boolean }) =>
      active ? userService.reactivate(id) : userService.softDelete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.users.all })
  });
}

// Permanent, irreversible delete (real DELETE endpoint). Use with care.
export function useHardDeleteUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => userService.hardDelete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.users.all })
  });
}
