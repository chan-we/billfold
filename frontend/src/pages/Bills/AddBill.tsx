import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Typography } from 'antd';
import { BillForm } from '@/components/BillForm';
import { useResponsive } from '@/hooks/useResponsive';
import styles from './AddBill.module.css';

const { Title } = Typography;

export const AddBillPage: React.FC = () => {
  const navigate = useNavigate();
  const { isMobile } = useResponsive();

  const handleSuccess = () => {
    navigate('/bills');
  };

  const handleCancel = () => {
    navigate(-1);
  };

  if (isMobile) {
    return (
      <div className={styles.container}>
        <Title level={4} className={styles.title}>
          添加账单
        </Title>
        <BillForm onSuccess={handleSuccess} onCancel={handleCancel} />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Card title="添加账单" className={styles.card}>
        <BillForm onSuccess={handleSuccess} onCancel={handleCancel} />
      </Card>
    </div>
  );
};

export default AddBillPage;
