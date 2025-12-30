import React from 'react';
import { useResponsive } from '@/hooks/useResponsive';
import { Sidebar } from '../Sidebar';
import { BottomNav } from '../BottomNav';
import styles from './Layout.module.css';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isMobile } = useResponsive();

  if (isMobile) {
    return (
      <div className={`${styles.layout} ${styles.mobile}`}>
        <main className={styles.main}>{children}</main>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className={`${styles.layout} ${styles.desktop}`}>
      <Sidebar />
      <main className={styles.main}>{children}</main>
    </div>
  );
};
