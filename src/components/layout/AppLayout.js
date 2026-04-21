import React from 'react';
import Sidebar from './Sidebar';
import styles from './AppLayout.module.css';

const AppLayout = ({ children }) => (
  <div className={styles.layout}>
    <Sidebar />
    <main className={styles.main}>{children}</main>
  </div>
);

export default AppLayout;
