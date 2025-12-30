import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, IsNull } from 'typeorm';
import { Bill } from '../bill/entities/bill.entity';
import { BillType } from '../shared/enums/bill-type.enum';
import { CurrencyCode } from '../shared/enums/currency.enum';

export interface StatisticsQuery {
  startDate?: string;
  endDate?: string;
  currencyCode?: CurrencyCode;
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

@Injectable()
export class StatisticsService {
  constructor(
    @InjectRepository(Bill)
    private readonly billRepository: Repository<Bill>,
  ) {}

  async getSummary(userId: number, query: StatisticsQuery = {}): Promise<SummaryData[]> {
    const { startDate, endDate, currencyCode } = query;

    const queryBuilder = this.billRepository
      .createQueryBuilder('bill')
      .select('bill.currencyCode', 'currencyCode')
      .addSelect('bill.billType', 'billType')
      .addSelect('SUM(bill.amount)', 'total')
      .where('bill.userId = :userId', { userId })
      .andWhere('bill.deletedAt IS NULL')
      .groupBy('bill.currencyCode')
      .addGroupBy('bill.billType');

    if (startDate) {
      queryBuilder.andWhere('bill.date >= :startDate', { startDate });
    }
    if (endDate) {
      queryBuilder.andWhere('bill.date <= :endDate', { endDate });
    }
    if (currencyCode) {
      queryBuilder.andWhere('bill.currencyCode = :currencyCode', { currencyCode });
    }

    const results = await queryBuilder.getRawMany();

    // Group by currency
    const currencyMap = new Map<CurrencyCode, { income: number; expense: number }>();

    for (const row of results) {
      const currency = row.currencyCode as CurrencyCode;
      if (!currencyMap.has(currency)) {
        currencyMap.set(currency, { income: 0, expense: 0 });
      }
      const data = currencyMap.get(currency)!;
      if (row.billType === BillType.INCOME) {
        data.income = parseFloat(row.total) || 0;
      } else {
        data.expense = parseFloat(row.total) || 0;
      }
    }

    const summaries: SummaryData[] = [];
    for (const [currency, data] of currencyMap) {
      summaries.push({
        totalIncome: data.income.toFixed(2),
        totalExpense: data.expense.toFixed(2),
        balance: (data.income - data.expense).toFixed(2),
        currencyCode: currency,
      });
    }

    return summaries;
  }

  async getCategoryStatistics(
    userId: number,
    billType: BillType,
    query: StatisticsQuery = {},
  ): Promise<CategoryData[]> {
    const { startDate, endDate, currencyCode } = query;

    const queryBuilder = this.billRepository
      .createQueryBuilder('bill')
      .select('bill.billCategory', 'category')
      .addSelect('SUM(bill.amount)', 'amount')
      .addSelect('COUNT(*)', 'count')
      .where('bill.userId = :userId', { userId })
      .andWhere('bill.billType = :billType', { billType })
      .andWhere('bill.deletedAt IS NULL')
      .groupBy('bill.billCategory')
      .orderBy('amount', 'DESC');

    if (startDate) {
      queryBuilder.andWhere('bill.date >= :startDate', { startDate });
    }
    if (endDate) {
      queryBuilder.andWhere('bill.date <= :endDate', { endDate });
    }
    if (currencyCode) {
      queryBuilder.andWhere('bill.currencyCode = :currencyCode', { currencyCode });
    }

    const results = await queryBuilder.getRawMany();

    // Calculate total for percentage
    const total = results.reduce((sum, row) => sum + parseFloat(row.amount), 0);

    return results.map((row) => ({
      category: row.category,
      amount: parseFloat(row.amount).toFixed(2),
      count: parseInt(row.count, 10),
      percentage: total > 0 ? Math.round((parseFloat(row.amount) / total) * 100) : 0,
    }));
  }

  async getTrendStatistics(
    userId: number,
    query: StatisticsQuery = {},
  ): Promise<TrendData[]> {
    const { startDate, endDate, currencyCode } = query;

    const queryBuilder = this.billRepository
      .createQueryBuilder('bill')
      .select('bill.date', 'date')
      .addSelect('bill.billType', 'billType')
      .addSelect('SUM(bill.amount)', 'total')
      .where('bill.userId = :userId', { userId })
      .andWhere('bill.deletedAt IS NULL')
      .groupBy('bill.date')
      .addGroupBy('bill.billType')
      .orderBy('bill.date', 'ASC');

    if (startDate) {
      queryBuilder.andWhere('bill.date >= :startDate', { startDate });
    }
    if (endDate) {
      queryBuilder.andWhere('bill.date <= :endDate', { endDate });
    }
    if (currencyCode) {
      queryBuilder.andWhere('bill.currencyCode = :currencyCode', { currencyCode });
    }

    const results = await queryBuilder.getRawMany();

    // Group by date
    const dateMap = new Map<string, { income: number; expense: number }>();

    for (const row of results) {
      const date = row.date;
      if (!dateMap.has(date)) {
        dateMap.set(date, { income: 0, expense: 0 });
      }
      const data = dateMap.get(date)!;
      if (row.billType === BillType.INCOME) {
        data.income = parseFloat(row.total) || 0;
      } else {
        data.expense = parseFloat(row.total) || 0;
      }
    }

    const trends: TrendData[] = [];
    for (const [date, data] of dateMap) {
      trends.push({
        date,
        income: data.income.toFixed(2),
        expense: data.expense.toFixed(2),
      });
    }

    // Sort by date
    trends.sort((a, b) => a.date.localeCompare(b.date));

    return trends;
  }
}
