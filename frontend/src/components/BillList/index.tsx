import React from 'react';
import { Table, Tag, Button, Space, Tooltip } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import { Bill, BillType, getCategoryLabel, CurrencySymbols } from '@/types/bill';
import { formatCurrency } from '@/utils/currency';
import styles from './BillList.module.css';

interface BillListProps {
  bills: Bill[];
  loading?: boolean;
  pagination: {
    current: number;
    pageSize: number;
    total: number;
  };
  onPageChange: (page: number, pageSize: number) => void;
  onEdit?: (bill: Bill) => void;
  onDelete?: (bill: Bill) => void;
}

export const BillList: React.FC<BillListProps> = ({
  bills,
  loading = false,
  pagination,
  onPageChange,
  onEdit,
  onDelete,
}) => {
  const columns: ColumnsType<Bill> = [
    {
      title: '日期',
      dataIndex: 'date',
      key: 'date',
      width: 120,
      sorter: (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    },
    {
      title: '类型',
      dataIndex: 'billType',
      key: 'billType',
      width: 80,
      render: (type: BillType) => (
        <Tag color={type === BillType.EXPENSE ? 'red' : 'green'}>
          {type === BillType.EXPENSE ? '支出' : '收入'}
        </Tag>
      ),
    },
    {
      title: '类别',
      dataIndex: 'billCategory',
      key: 'billCategory',
      width: 100,
      render: (category: string) => getCategoryLabel(category),
    },
    {
      title: '金额',
      dataIndex: 'amount',
      key: 'amount',
      width: 150,
      align: 'right',
      render: (amount: string, record: Bill) => (
        <span className={record.billType === BillType.EXPENSE ? styles.expense : styles.income}>
          {record.billType === BillType.EXPENSE ? '-' : '+'}
          {CurrencySymbols[record.currencyCode]}{formatCurrency(amount)}
        </span>
      ),
    },
    {
      title: '货币',
      dataIndex: 'currencyCode',
      key: 'currencyCode',
      width: 80,
    },
    {
      title: '备注',
      dataIndex: 'note',
      key: 'note',
      ellipsis: true,
      render: (note: string | null) => note || '-',
    },
    {
      title: '操作',
      key: 'actions',
      width: 120,
      fixed: 'right',
      render: (_: unknown, record: Bill) => (
        <Space size="small">
          {onEdit && (
            <Tooltip title="编辑">
              <Button
                type="text"
                size="small"
                icon={<EditOutlined />}
                onClick={() => onEdit(record)}
              />
            </Tooltip>
          )}
          {onDelete && (
            <Tooltip title="删除">
              <Button
                type="text"
                size="small"
                danger
                icon={<DeleteOutlined />}
                onClick={() => onDelete(record)}
              />
            </Tooltip>
          )}
        </Space>
      ),
    },
  ];

  const handleTableChange = (paginationConfig: TablePaginationConfig) => {
    onPageChange(paginationConfig.current || 1, paginationConfig.pageSize || 20);
  };

  return (
    <Table<Bill>
      columns={columns}
      dataSource={bills}
      rowKey="id"
      loading={loading}
      pagination={{
        current: pagination.current,
        pageSize: pagination.pageSize,
        total: pagination.total,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total) => `共 ${total} 条`,
        pageSizeOptions: ['10', '20', '50', '100'],
      }}
      onChange={handleTableChange}
      scroll={{ x: 800 }}
      className={styles.table}
    />
  );
};
