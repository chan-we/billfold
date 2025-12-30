import React, { useState, useEffect, useCallback } from 'react';
import { Card, Typography, DatePicker, Select, Row, Col, Space, message } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { SummaryCard, CategoryPieChart, TrendLineChart } from '@/components/StatisticsChart';
import { useResponsive } from '@/hooks/useResponsive';
import { statisticsService } from '@/services/statisticsService';
import { billService } from '@/services/billService';
import { BillType, CurrencyCode } from '@/types/bill';
import type { SummaryData, CategoryData, TrendData } from '@/types/statistics';
import type { CurrencyOption } from '@/types/bill';
import styles from './Statistics.module.css';

const { Title } = Typography;
const { RangePicker } = DatePicker;

export const StatisticsPage: React.FC = () => {
  const { isMobile } = useResponsive();
  const [loading, setLoading] = useState(false);
  const [summaryData, setSummaryData] = useState<SummaryData[]>([]);
  const [expenseCategoryData, setExpenseCategoryData] = useState<CategoryData[]>([]);
  const [incomeCategoryData, setIncomeCategoryData] = useState<CategoryData[]>([]);
  const [trendData, setTrendData] = useState<TrendData[]>([]);
  const [currencies, setCurrencies] = useState<CurrencyOption[]>([]);
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyCode>(CurrencyCode.CNY);
  const [dateRange, setDateRange] = useState<[Dayjs, Dayjs] | null>(() => {
    const now = dayjs();
    return [now.startOf('month'), now.endOf('month')];
  });

  useEffect(() => {
    const loadCurrencies = async () => {
      try {
        const data = await billService.getCurrencies();
        setCurrencies(data);
      } catch (error) {
        console.error('Failed to load currencies:', error);
      }
    };
    loadCurrencies();
  }, []);

  const fetchStatistics = useCallback(async () => {
    setLoading(true);
    try {
      const query = {
        startDate: dateRange?.[0]?.format('YYYY-MM-DD'),
        endDate: dateRange?.[1]?.format('YYYY-MM-DD'),
        currencyCode: selectedCurrency,
      };

      const [summary, expenseCategory, incomeCategory, trend] = await Promise.all([
        statisticsService.getSummary(query),
        statisticsService.getCategoryStatistics({ ...query, billType: BillType.EXPENSE }),
        statisticsService.getCategoryStatistics({ ...query, billType: BillType.INCOME }),
        statisticsService.getTrendStatistics(query),
      ]);

      setSummaryData(summary);
      setExpenseCategoryData(expenseCategory);
      setIncomeCategoryData(incomeCategory);
      setTrendData(trend);
    } catch (error) {
      message.error('加载统计数据失败');
    } finally {
      setLoading(false);
    }
  }, [dateRange, selectedCurrency]);

  useEffect(() => {
    fetchStatistics();
  }, [fetchStatistics]);

  const handleDateRangeChange = (dates: [Dayjs | null, Dayjs | null] | null) => {
    if (dates && dates[0] && dates[1]) {
      setDateRange([dates[0], dates[1]]);
    } else {
      setDateRange(null);
    }
  };

  const currentSummary = summaryData.find((s) => s.currencyCode === selectedCurrency) || null;

  const filterSection = (
    <div className={styles.filters}>
      <Space wrap>
        <RangePicker
          value={dateRange}
          onChange={handleDateRangeChange}
          style={{ width: isMobile ? '100%' : 240 }}
        />
        <Select
          value={selectedCurrency}
          onChange={setSelectedCurrency}
          style={{ width: 120 }}
        >
          {currencies.map((currency) => (
            <Select.Option key={currency.code} value={currency.code}>
              {currency.symbol} {currency.name}
            </Select.Option>
          ))}
        </Select>
      </Space>
    </div>
  );

  if (isMobile) {
    return (
      <div className={styles.container}>
        <Title level={4} className={styles.title}>
          统计报表
        </Title>
        {filterSection}
        <SummaryCard data={currentSummary} loading={loading} />
        <CategoryPieChart
          title="支出分类"
          data={expenseCategoryData}
          loading={loading}
          color="#ff4d4f"
        />
        <CategoryPieChart
          title="收入分类"
          data={incomeCategoryData}
          loading={loading}
          color="#52c41a"
        />
        <TrendLineChart data={trendData} loading={loading} />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Card
        title="统计报表"
        extra={filterSection}
        className={styles.card}
      >
        <SummaryCard data={currentSummary} loading={loading} />
        <Row gutter={16}>
          <Col xs={24} lg={12}>
            <CategoryPieChart
              title="支出分类"
              data={expenseCategoryData}
              loading={loading}
              color="#ff4d4f"
            />
          </Col>
          <Col xs={24} lg={12}>
            <CategoryPieChart
              title="收入分类"
              data={incomeCategoryData}
              loading={loading}
              color="#52c41a"
            />
          </Col>
        </Row>
        <TrendLineChart data={trendData} loading={loading} />
      </Card>
    </div>
  );
};

export default StatisticsPage;
