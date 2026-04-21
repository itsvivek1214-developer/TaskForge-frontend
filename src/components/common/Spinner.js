import React from 'react';
import styles from './Spinner.module.css';

const Spinner = ({ size = 'md', centered = false }) => (
  <div className={`${styles.wrapper} ${centered ? styles.centered : ''}`}>
    <div className={`${styles.spinner} ${styles[size]}`} />
  </div>
);

export const PageLoader = () => (
  <div className={styles.page}>
    <div className={styles.logoMark}>TF</div>
    <div className={styles.spinnerLg} />
    <p className={styles.loadingText}>Loading TaskForge...</p>
  </div>
);

export default Spinner;
