import { BillType, CurrencyCode } from './bill';

export interface StatisticsQuery {
  startDate?: string;
  endDate?: string;
  currencyCode?: CurrencyCode;
}

export interface CategoryStatisticsQuery extends StatisticsQuery {
  billType: BillType;
}

export interface SummaryData {
  totalIncome: string;
  totalExpense: string;
  balance: string;
  currencyCode: CurrencyCode;
}

export interface CategoryData {
  category: string;
  amount: string;
  count: number;
  percentage: number;
}

export interface TrendData {
  date: string;
  income: string;
  expense: string;
}
