import React from 'react';
import Modal from './Modal';
import Button from './Button';
import { AlertTriangle } from 'lucide-react';
import styles from './ConfirmDialog.module.css';

const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'danger',
  loading = false,
}) => (
  <Modal
    isOpen={isOpen}
    onClose={onClose}
    title=""
    size="sm"
    footer={
      <>
        <Button variant="ghost" onClick={onClose} disabled={loading}>{cancelLabel}</Button>
        <Button variant={variant} onClick={onConfirm} loading={loading}>{confirmLabel}</Button>
      </>
    }
  >
    <div className={styles.body}>
      <div className={`${styles.iconWrap} ${styles[variant]}`}>
        <AlertTriangle size={24} />
      </div>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.message}>{message}</p>
    </div>
  </Modal>
);

export default ConfirmDialog;
