import React from 'react';
import { Card, Statistic, Row, Col } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import { CurrencySymbols } from '@/types/bill';
import type { SummaryData } from '@/types/statistics';
import styles from './StatisticsChart.module.css';

interface SummaryCardProps {
  data: SummaryData | null;
  loading?: boolean;
}

export const SummaryCard: React.FC<SummaryCardProps> = ({ data, loading = false }) => {
  if (!data) {
    return null;
  }

  const symbol = CurrencySymbols[data.currencyCode] || '¥';
  const balance = parseFloat(data.balance);

  return (
    <Card loading={loading} className={styles.summaryCard}>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={8}>
          <Statistic
            title="总收入"
            value={data.totalIncome}
            precision={2}
            prefix={symbol}
            valueStyle={{ color: '#52c41a' }}
            suffix={<ArrowUpOutlined />}
          />
        </Col>
        <Col xs={24} sm={8}>
          <Statistic
            title="总支出"
            value={data.totalExpense}
            precision={2}
            prefix={symbol}
            valueStyle={{ color: '#ff4d4f' }}
            suffix={<ArrowDownOutlined />}
          />
        </Col>
        <Col xs={24} sm={8}>
          <Statistic
            title="结余"
            value={data.balance}
            precision={2}
            prefix={symbol}
            valueStyle={{ color: balance >= 0 ? '#52c41a' : '#ff4d4f' }}
          />
        </Col>
      </Row>
    </Card>
  );
};
