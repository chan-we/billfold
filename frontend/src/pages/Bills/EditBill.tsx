import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, Typography, Spin, message } from 'antd';
import { BillForm } from '@/components/BillForm';
import { useResponsive } from '@/hooks/useResponsive';
import { billService } from '@/services/billService';
import type { Bill } from '@/types/bill';
import styles from './EditBill.module.css';

const { Title } = Typography;

export const EditBillPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { isMobile } = useResponsive();
  const [bill, setBill] = useState<Bill | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBill = async () => {
      if (!id) {
        message.error('账单ID无效');
        navigate('/bills');
        return;
      }

      try {
        const data = await billService.getBillById(Number(id));
        setBill(data);
      } catch (error) {
        message.error('加载账单失败');
        navigate('/bills');
      } finally {
        setLoading(false);
      }
    };

    loadBill();
  }, [id, navigate]);

  const handleSuccess = () => {
    navigate('/bills');
  };

  const handleCancel = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <Spin size="large" />
      </div>
    );
  }

  if (!bill) {
    return null;
  }

  if (isMobile) {
    return (
      <div className={styles.container}>
        <Title level={4} className={styles.title}>
          编辑账单
        </Title>
        <BillForm
          initialValues={bill}
          onSuccess={handleSuccess}
          onCancel={handleCancel}
          isEdit
        />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Card title="编辑账单" className={styles.card}>
        <BillForm
          initialValues={bill}
          onSuccess={handleSuccess}
          onCancel={handleCancel}
          isEdit
        />
      </Card>
    </div>
  );
};

export default EditBillPage;
