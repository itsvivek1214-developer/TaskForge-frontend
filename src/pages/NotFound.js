import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';
import styles from './NotFound.module.css';

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <div className={styles.page}>
      <div className={styles.bgGrid} />
      <div className={styles.content}>
        <div className={styles.code}>404</div>
        <h1 className={styles.title}>Page not found</h1>
        <p className={styles.desc}>The page you're looking for doesn't exist or has been moved.</p>
        <Button onClick={() => navigate('/dashboard')} size="lg">
          Back to Dashboard
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
