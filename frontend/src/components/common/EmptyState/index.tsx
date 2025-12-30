import React from 'react';
import { Empty, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import styles from './EmptyState.module.css';

interface EmptyStateProps {
  description?: string;
  showAction?: boolean;
  actionText?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  description = '暂无数据',
  showAction = false,
  actionText = '新增',
  onAction,
}) => {
  return (
    <div className={styles.container}>
      <Empty description={description}>
        {showAction && onAction && (
          <Button type="primary" icon={<PlusOutlined />} onClick={onAction}>
            {actionText}
          </Button>
        )}
      </Empty>
    </div>
  );
};
