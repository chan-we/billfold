import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { UnorderedListOutlined, PieChartOutlined, PlusCircleOutlined } from '@ant-design/icons';
import styles from './BottomNav.module.css';

interface NavItem {
  key: string;
  path: string;
  icon: React.ReactNode;
  label: string;
}

const navItems: NavItem[] = [
  {
    key: 'bills',
    path: '/bills',
    icon: <UnorderedListOutlined />,
    label: '账单',
  },
  {
    key: 'add',
    path: '/bills/add',
    icon: <PlusCircleOutlined />,
    label: '记账',
  },
  {
    key: 'statistics',
    path: '/statistics',
    icon: <PieChartOutlined />,
    label: '统计',
  },
];

export const BottomNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleClick = (path: string) => {
    navigate(path);
  };

  const isActive = (item: NavItem) => {
    if (item.key === 'bills') {
      return location.pathname === '/bills' || location.pathname.match(/^\/bills\/\d+\/edit$/);
    }
    return location.pathname === item.path;
  };

  return (
    <nav className={styles.nav}>
      {navItems.map((item) => (
        <button
          key={item.key}
          className={`${styles.item} ${isActive(item) ? styles.active : ''}`}
          onClick={() => handleClick(item.path)}
        >
          <span className={styles.icon}>{item.icon}</span>
          <span className={styles.label}>{item.label}</span>
        </button>
      ))}
    </nav>
  );
};
