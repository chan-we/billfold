import React from 'react';
import { Card, Tag, Button, Space, Spin } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Bill, BillType, getCategoryLabel, CurrencySymbols } from '@/types/bill';
import { formatCurrency } from '@/utils/currency';
import styles from './BillCard.module.css';

interface BillCardProps {
  bills: Bill[];
  loading?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
  onEdit?: (bill: Bill) => void;
  onDelete?: (bill: Bill) => void;
}

export const BillCard: React.FC<BillCardProps> = ({
  bills,
  loading = false,
  hasMore = false,
  onLoadMore,
  onEdit,
  onDelete,
}) => {
  if (loading && bills.length === 0) {
    return (
      <div className={styles.loading}>
        <Spin />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {bills.map((bill) => (
        <Card key={bill.id} className={styles.card} size="small">
          <div className={styles.header}>
            <div className={styles.left}>
              <Tag color={bill.billType === BillType.EXPENSE ? 'red' : 'green'}>
                {bill.billType === BillType.EXPENSE ? '支出' : '收入'}
              </Tag>
              <span className={styles.category}>{getCategoryLabel(bill.billCategory)}</span>
            </div>
            <span
              className={
                bill.billType === BillType.EXPENSE ? styles.expense : styles.income
              }
            >
              {bill.billType === BillType.EXPENSE ? '-' : '+'}
              {CurrencySymbols[bill.currencyCode]}{formatCurrency(bill.amount, bill.currencyCode)}
            </span>
          </div>
          <div className={styles.content}>
            <div className={styles.date}>{bill.date}</div>
            {bill.note && <div className={styles.note}>{bill.note}</div>}
          </div>
          <div className={styles.actions}>
            <Space>
              {onEdit && (
                <Button
                  type="text"
                  size="small"
                  icon={<EditOutlined />}
                  onClick={() => onEdit(bill)}
                >
                  编辑
                </Button>
              )}
              {onDelete && (
                <Button
                  type="text"
                  size="small"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => onDelete(bill)}
                >
                  删除
                </Button>
              )}
            </Space>
          </div>
        </Card>
      ))}

      {hasMore && (
        <div className={styles.loadMore}>
          <Button onClick={onLoadMore} loading={loading} block>
            加载更多
          </Button>
        </div>
      )}

      {loading && bills.length > 0 && (
        <div className={styles.loadingMore}>
          <Spin size="small" />
        </div>
      )}
    </div>
  );
};
