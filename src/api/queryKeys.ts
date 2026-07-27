import type { ListParams } from '@/types';

// Centralized react-query keys — avoids stringly-typed cache invalidation.
export const queryKeys = {
  users: {
    all: ['users'] as const,
    list: (params: ListParams) => ['users', 'list', params] as const,
    detail: (id: string) => ['users', 'detail', id] as const
  },
  groups: {
    all: ['groups'] as const,
    list: () => ['groups', 'list'] as const,
    detail: (id: string) => ['groups', 'detail', id] as const
  },
  auth: {
    me: ['auth', 'me'] as const
  },
  taxonomy: {
    all: (kind: string) => ['taxonomy', kind] as const,
    list: (kind: string, params: unknown) => ['taxonomy', kind, 'list', params] as const
  },
  content: {
    topics: ['content', 'topics'] as const,
    topic: (id: string) => ['content', 'topic', id] as const,
    step: (id: string) => ['content', 'step', id] as const
  }
};
