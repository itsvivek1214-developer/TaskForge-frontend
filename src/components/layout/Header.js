import React from 'react';
import { Bell, Search } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import styles from './Header.module.css';

const Header = ({ title, subtitle, actions }) => {
  const { user } = useAuth();

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <h1 className={styles.title}>{title}</h1>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      </div>
      <div className={styles.right}>
        {actions && <div className={styles.actions}>{actions}</div>}
        <div className={styles.notifBtn}>
          <Bell size={16} />
          <span className={styles.notifDot} />
        </div>
        <div className={styles.userChip}>
          <div className={styles.avatar}>{user?.name?.[0]?.toUpperCase() || 'U'}</div>
          <span className={styles.userName}>{user?.name?.split(' ')[0] || 'User'}</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
