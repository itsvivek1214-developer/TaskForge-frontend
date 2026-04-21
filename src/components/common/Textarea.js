import React, { forwardRef } from 'react';
import styles from './Textarea.module.css';

const Textarea = forwardRef(({
  label,
  error,
  hint,
  containerClass = '',
  className = '',
  rows = 4,
  maxLength,
  showCount = false,
  value = '',
  ...props
}, ref) => {
  return (
    <div className={`${styles.container} ${containerClass}`}>
      {(label || (showCount && maxLength)) && (
        <div className={styles.labelRow}>
          {label && <label className={styles.label}>{label}</label>}
          {showCount && maxLength && (
            <span className={styles.count}>{value.length}/{maxLength}</span>
          )}
        </div>
      )}
      <textarea
        ref={ref}
        rows={rows}
        maxLength={maxLength}
        value={value}
        className={`${styles.textarea} ${error ? styles.hasError : ''} ${className}`}
        {...props}
      />
      {error && <p className={styles.error}>{error}</p>}
      {hint && !error && <p className={styles.hint}>{hint}</p>}
    </div>
  );
});

Textarea.displayName = 'Textarea';
export default Textarea;
