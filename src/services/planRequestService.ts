import axiosServices from '@/api/axios';

export interface PlanRequestItem {
  id: number;
  user_id: number | null;
  name: string;
  phone: string;
  content: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  admin_note?: string | null;
  created_at: string;
  updated_at: string;
  user_email?: string | null;
  user_username?: string | null;
  user_plan?: string | null;
}

export interface PlanRequestResponse {
  items: PlanRequestItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

const planRequestService = {
  async getPlanRequests(params: { page?: number; limit?: number; status?: string; search?: string }) {
    const response = await axiosServices.get<{ data: PlanRequestResponse }>('/api/v1/admin/plan-requests', {
      params
    });
    return response.data.data;
  },

  async updatePlanRequestStatus(id: number, data: { status: 'APPROVED' | 'REJECTED' | 'PENDING'; adminNote?: string }) {
    const response = await axiosServices.patch<{ data: PlanRequestItem }>(`/api/v1/admin/plan-requests/${id}`, data);
    return response.data.data;
  }
};

export default planRequestService;
