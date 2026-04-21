import React from 'react';
import { getPriorityMeta, getStatusMeta } from '../../utils/helpers';
import styles from './Badge.module.css';

export const PriorityBadge = ({ priority }) => {
  const meta = getPriorityMeta(priority);
  return (
    <span
      className={styles.badge}
      style={{
        background: meta.bg,
        borderColor: meta.border,
        color: meta.color,
      }}
    >
      <span className={styles.dot} style={{ background: meta.dot }} />
      {meta.label}
    </span>
  );
};

export const StatusBadge = ({ status }) => {
  const meta = getStatusMeta(status);
  return (
    <span
      className={styles.badge}
      style={{
        background: meta.bg,
        borderColor: meta.border,
        color: meta.text,
      }}
    >
      {meta.label}
    </span>
  );
};

export const RoleBadge = ({ role }) => (
  <span className={`${styles.badge} ${role === 'ADMIN' ? styles.admin : styles.user}`}>
    {role}
  </span>
);
