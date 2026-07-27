import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import taxonomyService from '@/services/taxonomyService';
import { queryKeys } from '@/api/queryKeys';
import type { CreateTaxonomyPayload, TaxonomyKind, TaxonomyListParams, UpdateTaxonomyPayload } from '@/types';

export function useTaxonomyList(kind: TaxonomyKind, params: TaxonomyListParams = {}) {
  return useQuery({
    queryKey: queryKeys.taxonomy.list(kind, params),
    queryFn: () => taxonomyService.list(kind, params),
    placeholderData: (prev) => prev
  });
}

export function useCreateTaxonomy(kind: TaxonomyKind) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateTaxonomyPayload) => taxonomyService.create(kind, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.taxonomy.all(kind) })
  });
}

export function useUpdateTaxonomy(kind: TaxonomyKind) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateTaxonomyPayload }) => taxonomyService.update(kind, id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.taxonomy.all(kind) })
  });
}

export function useDeleteTaxonomy(kind: TaxonomyKind) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, force }: { id: string; force?: boolean }) => taxonomyService.remove(kind, id, { force }),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.taxonomy.all(kind) })
  });
}
