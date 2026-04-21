import React, { forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';
import styles from './Select.module.css';

const Select = forwardRef(({
  label,
  error,
  hint,
  options = [],
  placeholder,
  containerClass = '',
  className = '',
  ...props
}, ref) => {
  return (
    <div className={`${styles.container} ${containerClass}`}>
      {label && <label className={styles.label}>{label}</label>}
      <div className={`${styles.wrapper} ${error ? styles.hasError : ''}`}>
        <select
          ref={ref}
          className={`${styles.select} ${className}`}
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown size={14} className={styles.chevron} />
      </div>
      {error && <p className={styles.error}>{error}</p>}
      {hint && !error && <p className={styles.hint}>{hint}</p>}
    </div>
  );
});

Select.displayName = 'Select';
export default Select;
