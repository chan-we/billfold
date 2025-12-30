import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Typography, Button, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { BillList } from '@/components/BillList';
import { BillCard } from '@/components/BillCard';
import { BillFilter } from '@/components/BillFilter';
import { EmptyState } from '@/components/common/EmptyState';
import { showDeleteConfirm } from '@/components/common/DeleteConfirmModal';
import { useResponsive } from '@/hooks/useResponsive';
import { billService } from '@/services/billService';
import type { Bill, BillQueryParams } from '@/types/bill';
import styles from './Bills.module.css';

const { Title } = Typography;

export const BillsPage: React.FC = () => {
  const navigate = useNavigate();
  const { isMobile } = useResponsive();
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 20,
    total: 0,
  });
  const [filters, setFilters] = useState<BillQueryParams>({});

  const fetchBills = useCallback(async (params: BillQueryParams = {}) => {
    setLoading(true);
    try {
      const result = await billService.getBills({
        ...filters,
        ...params,
        page: params.page || pagination.current,
        pageSize: params.pageSize || pagination.pageSize,
      });
      setBills(result.items);
      setPagination({
        current: result.page,
        pageSize: result.pageSize,
        total: result.total,
      });
    } catch (error) {
      message.error('加载账单列表失败');
    } finally {
      setLoading(false);
    }
  }, [filters, pagination.current, pagination.pageSize]);

  useEffect(() => {
    fetchBills({ page: 1 });
  }, [filters]);

  const handleFilter = (params: BillQueryParams) => {
    setFilters(params);
    setPagination((prev) => ({ ...prev, current: 1 }));
  };

  const handlePageChange = (page: number, pageSize: number) => {
    fetchBills({ page, pageSize });
  };

  const handleLoadMore = () => {
    fetchBills({ page: pagination.current + 1 });
  };

  const handleAdd = () => {
    navigate('/bills/add');
  };

  const handleEdit = (bill: Bill) => {
    navigate(`/bills/${bill.id}/edit`);
  };

  const handleDelete = (bill: Bill) => {
    showDeleteConfirm({
      title: '确认删除账单',
      content: '确定要删除这条账单记录吗？删除后无法恢复。',
      onConfirm: async () => {
        try {
          await billService.deleteBill(bill.id);
          message.success('删除成功');
          fetchBills({ page: pagination.current });
        } catch (error) {
          message.error('删除失败');
        }
      },
    });
  };

  const hasMore = pagination.current * pagination.pageSize < pagination.total;

  if (isMobile) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <Title level={4} className={styles.title}>
            账单列表
          </Title>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            新增
          </Button>
        </div>

        <BillFilter onFilter={handleFilter} loading={loading} />

        {bills.length === 0 && !loading ? (
          <EmptyState
            description="暂无账单记录"
            showAction
            actionText="添加账单"
            onAction={handleAdd}
          />
        ) : (
          <BillCard
            bills={bills}
            loading={loading}
            hasMore={hasMore}
            onLoadMore={handleLoadMore}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Card
        title="账单列表"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            新增账单
          </Button>
        }
        className={styles.card}
      >
        <BillFilter onFilter={handleFilter} loading={loading} />

        {bills.length === 0 && !loading ? (
          <EmptyState
            description="暂无账单记录"
            showAction
            actionText="添加账单"
            onAction={handleAdd}
          />
        ) : (
          <BillList
            bills={bills}
            loading={loading}
            pagination={pagination}
            onPageChange={handlePageChange}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </Card>
    </div>
  );
};

export default BillsPage;
