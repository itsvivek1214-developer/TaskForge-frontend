import React, { forwardRef } from 'react';
import styles from './Input.module.css';

const Input = forwardRef(({
  label,
  error,
  hint,
  icon,
  iconRight,
  type = 'text',
  className = '',
  containerClass = '',
  ...props
}, ref) => {
  return (
    <div className={`${styles.container} ${containerClass}`}>
      {label && <label className={styles.label}>{label}</label>}
      <div className={`${styles.inputWrapper} ${error ? styles.hasError : ''}`}>
        {icon && <span className={styles.iconLeft}>{icon}</span>}
        <input
          ref={ref}
          type={type}
          className={`${styles.input} ${icon ? styles.withIconLeft : ''} ${iconRight ? styles.withIconRight : ''} ${className}`}
          {...props}
        />
        {iconRight && <span className={styles.iconRight}>{iconRight}</span>}
      </div>
      {error && <p className={styles.error}>{error}</p>}
      {hint && !error && <p className={styles.hint}>{hint}</p>}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
