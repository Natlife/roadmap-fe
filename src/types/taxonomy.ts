export type TaxonomyKind = 'categories' | 'tags';

// A category (classifies topics) or a tag (attached to many topics/blogs).
// status: 1 = active, 0 = inactive. usageCount = number of topics linked.
export interface TaxonomyItem {
  id: string;
  title: string;
  description: string;
  status: number;
  usageCount: number;
}

export interface CreateTaxonomyPayload {
  title: string;
  description?: string;
  status?: number; // 1 | 0
}

export type UpdateTaxonomyPayload = Partial<CreateTaxonomyPayload>;

export interface TaxonomyListParams {
  search?: string;
  status?: 'active' | 'inactive' | 'all';
}

export const TAXONOMY_LABEL: Record<TaxonomyKind, { singular: string; plural: string }> = {
  categories: { singular: 'Category', plural: 'Categories' },
  tags: { singular: 'Tag', plural: 'Tags' }
};
