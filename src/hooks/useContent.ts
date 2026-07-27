import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import contentService from '@/services/contentService';
import { queryKeys } from '@/api/queryKeys';
import type { CreateBlogPayload, CreateStepPayload, CreateTopicPayload, StepBlock } from '@/types';

export function useTopics() {
  return useQuery({ queryKey: queryKeys.content.topics, queryFn: () => contentService.listTopics() });
}
export function useTopic(id: string | undefined) {
  return useQuery({ queryKey: queryKeys.content.topic(id ?? ''), queryFn: () => contentService.getTopic(id as string), enabled: Boolean(id) });
}
export function useStep(id: string | undefined) {
  return useQuery({ queryKey: queryKeys.content.step(id ?? ''), queryFn: () => contentService.getStep(id as string), enabled: Boolean(id) });
}

export function useSaveStepBlocks(stepId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (blocks: StepBlock[]) => contentService.saveStepBlocks(stepId, blocks),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.content.step(stepId) })
  });
}

// --- topic ---
export function useCreateTopic() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (p: CreateTopicPayload) => contentService.createTopic(p), onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.content.topics }) });
}
export function useUpdateTopic() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<CreateTopicPayload> }) => contentService.updateTopic(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.content.topics })
  });
}
export function useDeleteTopic() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (id: string) => contentService.deleteTopic(id), onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.content.topics }) });
}

// --- blog (lesson) ---
export function useCreateBlog(topicId: string) {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (p: CreateBlogPayload) => contentService.createBlog(p), onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.content.topic(topicId) }) });
}
export function useUpdateBlog(topicId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<CreateBlogPayload> }) => contentService.updateBlog(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.content.topic(topicId) })
  });
}
export function useDeleteBlog(topicId: string) {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (id: string) => contentService.deleteBlog(id), onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.content.topic(topicId) }) });
}

// --- step ---
export function useCreateStep(topicId: string) {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (p: CreateStepPayload) => contentService.createStep(p), onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.content.topic(topicId) }) });
}
export function useDeleteStep(topicId: string) {
  const qc = useQueryClient();
  return useMutation({ mutationFn: (id: string) => contentService.deleteStep(id), onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.content.topic(topicId) }) });
}
