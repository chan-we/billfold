import React, { useEffect, useState } from 'react';
import {
  Form,
  Input,
  Button,
  Select,
  DatePicker,
  Radio,
  InputNumber,
  message,
  Spin,
} from 'antd';
import dayjs from 'dayjs';
import { BillType, CurrencyCode } from '@/types/bill';
import type { CreateBillRequest, BillTypeOption, Bill } from '@/types/bill';
import { billService } from '@/services/billService';
import styles from './BillForm.module.css';

interface BillFormProps {
  initialValues?: Partial<Bill>;
  onSuccess?: (bill: Bill) => void;
  onCancel?: () => void;
  isEdit?: boolean;
}

export const BillForm: React.FC<BillFormProps> = ({
  initialValues,
  onSuccess,
  onCancel,
  isEdit = false,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [billTypes, setBillTypes] = useState<{
    expense: BillTypeOption[];
    income: BillTypeOption[];
  }>({ expense: [], income: [] });
  const [currencies, setCurrencies] = useState<{ code: string; name: string; symbol: string }[]>([]);
  const [currentBillType, setCurrentBillType] = useState<BillType>(
    initialValues?.billType || BillType.EXPENSE
  );

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [typesData, currenciesData] = await Promise.all([
          billService.getBillTypes(),
          billService.getCurrencies(),
        ]);
        setBillTypes(typesData);
        setCurrencies(currenciesData);
      } catch (error) {
        message.error('加载数据失败');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        ...initialValues,
        date: initialValues.date ? dayjs(initialValues.date) : undefined,
      });
      setCurrentBillType(initialValues.billType || BillType.EXPENSE);
    }
  }, [initialValues, form]);

  const handleBillTypeChange = (type: BillType) => {
    setCurrentBillType(type);
    form.setFieldValue('billCategory', undefined);
  };

  const handleSubmit = async (values: Record<string, unknown>) => {
    setSubmitting(true);
    try {
      const data: CreateBillRequest = {
        amount: String(values.amount),
        date: (values.date as dayjs.Dayjs).format('YYYY-MM-DD'),
        billType: values.billType as BillType,
        billCategory: values.billCategory as string,
        currencyCode: values.currencyCode as CurrencyCode,
        note: values.note as string | undefined,
      };

      let result: Bill;
      if (isEdit && initialValues?.id) {
        result = await billService.updateBill(initialValues.id, data);
        message.success('账单修改成功');
      } else {
        result = await billService.createBill(data);
        message.success('账单添加成功');
        form.resetFields();
      }
      onSuccess?.(result);
    } catch (error) {
      message.error(error instanceof Error ? error.message : '操作失败');
    } finally {
      setSubmitting(false);
    }
  };

  const categoryOptions =
    currentBillType === BillType.EXPENSE ? billTypes.expense : billTypes.income;

  if (loading) {
    return (
      <div className={styles.loading}>
        <Spin />
      </div>
    );
  }

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      initialValues={{
        billType: BillType.EXPENSE,
        currencyCode: CurrencyCode.CNY,
        date: dayjs(),
      }}
      className={styles.form}
    >
      <Form.Item
        name="billType"
        label="账单类型"
        rules={[{ required: true, message: '请选择账单类型' }]}
      >
        <Radio.Group
          onChange={(e) => handleBillTypeChange(e.target.value)}
          buttonStyle="solid"
        >
          <Radio.Button value={BillType.EXPENSE}>支出</Radio.Button>
          <Radio.Button value={BillType.INCOME}>收入</Radio.Button>
        </Radio.Group>
      </Form.Item>

      <Form.Item
        name="amount"
        label="金额"
        rules={[
          { required: true, message: '请填写金额' },
          {
            validator: (_, value) => {
              if (value && value <= 0) {
                return Promise.reject('金额必须大于0');
              }
              return Promise.resolve();
            },
          },
        ]}
      >
        <InputNumber
          placeholder="请输入金额"
          precision={2}
          min={0.01}
          style={{ width: '100%' }}
          prefix={currencies.find((c) => c.code === form.getFieldValue('currencyCode'))?.symbol || '¥'}
        />
      </Form.Item>

      <Form.Item
        name="billCategory"
        label="类别"
        rules={[{ required: true, message: '请选择类别' }]}
      >
        <Select placeholder="请选择类别">
          {categoryOptions.map((option) => (
            <Select.Option key={option.value} value={option.value}>
              {option.label}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        name="date"
        label="日期"
        rules={[{ required: true, message: '请选择日期' }]}
      >
        <DatePicker style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item
        name="currencyCode"
        label="货币"
        rules={[{ required: true, message: '请选择货币' }]}
      >
        <Select placeholder="请选择货币">
          {currencies.map((currency) => (
            <Select.Option key={currency.code} value={currency.code}>
              {currency.symbol} {currency.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item name="note" label="备注">
        <Input.TextArea
          placeholder="请输入备注（可选）"
          maxLength={500}
          showCount
          rows={3}
        />
      </Form.Item>

      <Form.Item className={styles.actions}>
        {onCancel && (
          <Button onClick={onCancel} style={{ marginRight: 8 }}>
            取消
          </Button>
        )}
        <Button type="primary" htmlType="submit" loading={submitting}>
          {isEdit ? '保存修改' : '添加账单'}
        </Button>
      </Form.Item>
    </Form>
  );
};
