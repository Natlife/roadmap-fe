import axios, { unwrap } from '@/api/axios';
import { endpoints } from '@/api/endpoints';
import type {
  ApiEnvelope,
  CreateTaxonomyPayload,
  TaxonomyItem,
  TaxonomyKind,
  TaxonomyListParams,
  UpdateTaxonomyPayload
} from '@/types';

function normalize(raw: Record<string, unknown>): TaxonomyItem {
  return {
    id: String(raw.id),
    title: (raw.title as string) ?? '',
    description: (raw.description as string) ?? '',
    status: Number(raw.status ?? 1),
    usageCount: Number(raw.usageCount ?? 0)
  };
}

const taxonomyService = {
  async list(kind: TaxonomyKind, params: TaxonomyListParams = {}): Promise<TaxonomyItem[]> {
    const query: Record<string, unknown> = {};
    if (params.search) query.search = params.search;
    if (params.status && params.status !== 'all') query.status = params.status;
    const res = await axios.get<ApiEnvelope<Record<string, unknown>[]>>(endpoints.taxonomy.base(kind), { params: query });
    return (unwrap(res) ?? []).map(normalize);
  },

  async create(kind: TaxonomyKind, payload: CreateTaxonomyPayload): Promise<TaxonomyItem> {
    const res = await axios.post<ApiEnvelope<Record<string, unknown>>>(endpoints.taxonomy.base(kind), payload);
    return normalize(unwrap(res));
  },

  async update(kind: TaxonomyKind, id: string, payload: UpdateTaxonomyPayload): Promise<TaxonomyItem> {
    const res = await axios.put<ApiEnvelope<Record<string, unknown>>>(endpoints.taxonomy.detail(kind, id), payload);
    return normalize(unwrap(res));
  },

  async remove(kind: TaxonomyKind, id: string, opts: { force?: boolean } = {}): Promise<void> {
    await axios.delete(endpoints.taxonomy.detail(kind, id), { params: opts.force ? { force: 'true' } : {} });
  }
};

export default taxonomyService;
