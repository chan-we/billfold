import React, { useState, useEffect } from 'react';
import { Form, Select, DatePicker, Button, Space } from 'antd';
import { SearchOutlined, ClearOutlined } from '@ant-design/icons';
import type { Dayjs } from 'dayjs';
import { BillType, CurrencyCode } from '@/types/bill';
import type { BillTypeOption, CurrencyOption, BillQueryParams } from '@/types/bill';
import { billService } from '@/services/billService';
import { useResponsive } from '@/hooks/useResponsive';
import styles from './BillFilter.module.css';

const { RangePicker } = DatePicker;

interface BillFilterProps {
  onFilter: (params: BillQueryParams) => void;
  loading?: boolean;
}

export const BillFilter: React.FC<BillFilterProps> = ({ onFilter, loading = false }) => {
  const [form] = Form.useForm();
  const { isMobile } = useResponsive();
  const [billTypes, setBillTypes] = useState<{
    expense: BillTypeOption[];
    income: BillTypeOption[];
  }>({ expense: [], income: [] });
  const [currencies, setCurrencies] = useState<CurrencyOption[]>([]);
  const [currentBillType, setCurrentBillType] = useState<BillType | undefined>();

  useEffect(() => {
    const loadOptions = async () => {
      try {
        const [typesData, currenciesData] = await Promise.all([
          billService.getBillTypes(),
          billService.getCurrencies(),
        ]);
        setBillTypes(typesData);
        setCurrencies(currenciesData);
      } catch (error) {
        console.error('Failed to load filter options:', error);
      }
    };
    loadOptions();
  }, []);

  const handleFinish = (values: Record<string, unknown>) => {
    const params: BillQueryParams = {};

    if (values.dateRange) {
      const [start, end] = values.dateRange as [Dayjs, Dayjs];
      params.startDate = start.format('YYYY-MM-DD');
      params.endDate = end.format('YYYY-MM-DD');
    }

    if (values.billType) {
      params.billType = values.billType as BillType;
    }

    if (values.billCategory) {
      params.billCategory = values.billCategory as string;
    }

    if (values.currencyCode) {
      params.currencyCode = values.currencyCode as CurrencyCode;
    }

    onFilter(params);
  };

  const handleReset = () => {
    form.resetFields();
    setCurrentBillType(undefined);
    onFilter({});
  };

  const handleBillTypeChange = (value: BillType | undefined) => {
    setCurrentBillType(value);
    form.setFieldValue('billCategory', undefined);
  };

  const categoryOptions = currentBillType === BillType.EXPENSE
    ? billTypes.expense
    : currentBillType === BillType.INCOME
      ? billTypes.income
      : [];

  return (
    <Form
      form={form}
      layout={isMobile ? 'vertical' : 'inline'}
      onFinish={handleFinish}
      className={styles.form}
    >
      <Form.Item name="dateRange" label="日期范围">
        <RangePicker
          style={{ width: isMobile ? '100%' : 240 }}
          placeholder={['开始日期', '结束日期']}
        />
      </Form.Item>

      <Form.Item name="billType" label="类型">
        <Select
          placeholder="全部类型"
          allowClear
          style={{ width: isMobile ? '100%' : 120 }}
          onChange={handleBillTypeChange}
        >
          <Select.Option value={BillType.EXPENSE}>支出</Select.Option>
          <Select.Option value={BillType.INCOME}>收入</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item name="billCategory" label="类别">
        <Select
          placeholder="全部类别"
          allowClear
          disabled={!currentBillType}
          style={{ width: isMobile ? '100%' : 150 }}
        >
          {categoryOptions.map((option) => (
            <Select.Option key={option.value} value={option.value}>
              {option.label}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item name="currencyCode" label="货币">
        <Select
          placeholder="全部货币"
          allowClear
          style={{ width: isMobile ? '100%' : 120 }}
        >
          {currencies.map((currency) => (
            <Select.Option key={currency.code} value={currency.code}>
              {currency.symbol} {currency.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item className={styles.actions}>
        <Space>
          <Button
            type="primary"
            htmlType="submit"
            icon={<SearchOutlined />}
            loading={loading}
          >
            搜索
          </Button>
          <Button icon={<ClearOutlined />} onClick={handleReset}>
            重置
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};
