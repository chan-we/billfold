import React from 'react';
import { Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

interface DeleteConfirmModalProps {
  title?: string;
  content?: string;
  onConfirm: () => Promise<void> | void;
  onCancel?: () => void;
}

export const showDeleteConfirm = ({
  title = '确认删除',
  content = '确定要删除这条记录吗？删除后无法恢复。',
  onConfirm,
  onCancel,
}: DeleteConfirmModalProps) => {
  Modal.confirm({
    title,
    icon: <ExclamationCircleOutlined />,
    content,
    okText: '删除',
    okType: 'danger',
    cancelText: '取消',
    onOk: onConfirm,
    onCancel,
  });
};
