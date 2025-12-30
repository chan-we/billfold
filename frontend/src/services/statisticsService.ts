import api from './api';
import type { ApiResponse } from '@/types/api';
import type {
  SummaryData,
  CategoryData,
  TrendData,
  StatisticsQuery,
  CategoryStatisticsQuery,
} from '@/types/statistics';

export const statisticsService = {
  async getSummary(params: StatisticsQuery = {}): Promise<SummaryData[]> {
    const response = await api.get<ApiResponse<SummaryData[]>>('/statistics/summary', { params });
    return response.data.data;
  },

  async getCategoryStatistics(params: CategoryStatisticsQuery): Promise<CategoryData[]> {
    const response = await api.get<ApiResponse<CategoryData[]>>('/statistics/category', { params });
    return response.data.data;
  },

  async getTrendStatistics(params: StatisticsQuery = {}): Promise<TrendData[]> {
    const response = await api.get<ApiResponse<TrendData[]>>('/statistics/trend', { params });
    return response.data.data;
  },
};
