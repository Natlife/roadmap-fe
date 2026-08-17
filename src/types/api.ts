// ==============================|| API ENVELOPE TYPES ||============================== //
// Mirrors backend utils/baseResponse.js: { code, message, data, timestamp, meta? }

export const SUCCESS_CODE = 1000;

export interface ApiEnvelope<T> {
  code: number;
  message: string;
  data: T;
  timestamp: string;
  meta?: PaginationMeta;
}

export interface PaginationMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface Paginated<T> {
  items: T[];
  meta: PaginationMeta;
}

export type UserSortField = 'id' | 'code' | 'fullName' | 'email' | 'username' | 'plan' | 'role' | 'active' | 'createdAt';

export interface ListParams {
  page?: number;
  pageSize?: number;
  search?: string;
  role?: 'ADMIN' | 'USER';
  plan?: 'FREE' | 'PREMIUM' | 'GROUP';
  status?: 'active' | 'inactive' | 'all';
  sortBy?: UserSortField;
  sortOrder?: 'asc' | 'desc';
}
