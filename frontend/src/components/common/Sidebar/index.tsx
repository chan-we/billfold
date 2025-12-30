import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu } from 'antd';
import { UnorderedListOutlined, PlusCircleOutlined, PieChartOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import styles from './Sidebar.module.css';

type MenuItem = Required<MenuProps>['items'][number];

const items: MenuItem[] = [
  {
    key: '/bills',
    icon: <UnorderedListOutlined />,
    label: '账单列表',
  },
  {
    key: '/bills/add',
    icon: <PlusCircleOutlined />,
    label: '新增账单',
  },
  {
    key: '/statistics',
    icon: <PieChartOutlined />,
    label: '统计报表',
  },
];

export const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleClick: MenuProps['onClick'] = (e) => {
    navigate(e.key);
  };

  const getSelectedKeys = () => {
    if (location.pathname.match(/^\/bills\/\d+\/edit$/)) {
      return ['/bills'];
    }
    return [location.pathname];
  };

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <h1 className={styles.title}>记账本</h1>
      </div>
      <Menu
        mode="inline"
        selectedKeys={getSelectedKeys()}
        onClick={handleClick}
        items={items}
        className={styles.menu}
      />
    </aside>
  );
};
