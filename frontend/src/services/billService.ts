import api from './api';
import type { ApiResponse, PaginatedData } from '@/types/api';
import type {
  Bill,
  CreateBillRequest,
  UpdateBillRequest,
  BillQueryParams,
  BillTypeOption,
  CurrencyOption,
} from '@/types/bill';

export const billService = {
  async createBill(data: CreateBillRequest): Promise<Bill> {
    const response = await api.post<ApiResponse<Bill>>('/bills', data);
    return response.data.data;
  },

  async getBills(params: BillQueryParams = {}): Promise<PaginatedData<Bill>> {
    const response = await api.get<ApiResponse<PaginatedData<Bill>>>('/bills', { params });
    return response.data.data;
  },

  async getBillById(id: number): Promise<Bill> {
    const response = await api.get<ApiResponse<Bill>>(`/bills/${id}`);
    return response.data.data;
  },

  async updateBill(id: number, data: UpdateBillRequest): Promise<Bill> {
    const response = await api.put<ApiResponse<Bill>>(`/bills/${id}`, data);
    return response.data.data;
  },

  async deleteBill(id: number): Promise<void> {
    await api.delete(`/bills/${id}`);
  },

  async getBillTypes(): Promise<{ expense: BillTypeOption[]; income: BillTypeOption[] }> {
    const response = await api.get<ApiResponse<{ expense: BillTypeOption[]; income: BillTypeOption[] }>>('/bills/types');
    return response.data.data;
  },

  async getCurrencies(): Promise<CurrencyOption[]> {
    const response = await api.get<ApiResponse<CurrencyOption[]>>('/bills/currencies');
    return response.data.data;
  },
};
