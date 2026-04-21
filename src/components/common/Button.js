import React from 'react';
import styles from './Button.module.css';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon,
  iconRight,
  fullWidth = false,
  onClick,
  type = 'button',
  className = '',
  ...props
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${styles.btn} ${styles[variant]} ${styles[size]} ${fullWidth ? styles.fullWidth : ''} ${loading ? styles.loading : ''} ${className}`}
      {...props}
    >
      {loading ? (
        <span className={styles.spinner} aria-hidden="true" />
      ) : icon ? (
        <span className={styles.iconLeft}>{icon}</span>
      ) : null}
      <span className={styles.label}>{children}</span>
      {iconRight && !loading && <span className={styles.iconRight}>{iconRight}</span>}
    </button>
  );
};

export default Button;
