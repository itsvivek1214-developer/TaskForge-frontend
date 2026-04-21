import React, { useState } from 'react';
import { Calendar, Edit2, Trash2, ChevronRight, Clock } from 'lucide-react';
import { PriorityBadge, StatusBadge } from '../common/Badge';
import { formatDeadline, getStatusMeta } from '../../utils/helpers';
import { useTasks } from '../../context/TaskContext';
import ConfirmDialog from '../common/ConfirmDialog';
import { getErrorMessage } from '../../utils/helpers';
import toast from 'react-hot-toast';
import styles from './TaskCard.module.css';

const TaskCard = ({ task, onEdit, compact = false }) => {
  const { deleteTask, updateStatus } = useTasks();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const deadline = task.deadline ? formatDeadline(task.deadline) : null;
  const statusMeta = getStatusMeta(task.status);
  const nextStatus = statusMeta.next;

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteTask(task.id);
      setDeleteOpen(false);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setDeleting(false);
    }
  };

  const handleAdvance = async (e) => {
    e.stopPropagation();
    if (!nextStatus) return;
    try {
      await updateStatus(task.id, nextStatus);
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <>
      <div className={`${styles.card} ${compact ? styles.compact : ''}`}>
        {/* Priority stripe */}
        <div
          className={styles.stripe}
          style={{ background: task.priority === 'HIGH' ? 'var(--accent-red)' : task.priority === 'MEDIUM' ? 'var(--accent-amber)' : 'var(--accent-green)' }}
        />

        <div className={styles.body}>
          <div className={styles.top}>
            <h3 className={styles.title} title={task.title}>{task.title}</h3>
            <div className={styles.actions}>
              <button className={styles.actionBtn} onClick={() => onEdit(task)} title="Edit">
                <Edit2 size={13} />
              </button>
              <button
                className={`${styles.actionBtn} ${styles.deleteBtn}`}
                onClick={() => setDeleteOpen(true)}
                title="Delete"
              >
                <Trash2 size={13} />
              </button>
            </div>
          </div>

          {task.description && !compact && (
            <p className={styles.description}>{task.description}</p>
          )}

          <div className={styles.meta}>
            <PriorityBadge priority={task.priority} />
            <StatusBadge status={task.status} />
          </div>

          <div className={styles.footer}>
            {deadline && (
              <div className={`${styles.deadline} ${deadline.overdue ? styles.overdue : ''}`}>
                {deadline.overdue ? <Clock size={11} /> : <Calendar size={11} />}
                <span>{deadline.overdue ? 'Overdue · ' : ''}{deadline.relative}</span>
              </div>
            )}
            {nextStatus && (
              <button className={styles.advanceBtn} onClick={handleAdvance} title={`Move to ${nextStatus.replace('_', ' ')}`}>
                <span>→ {getStatusMeta(nextStatus).label}</span>
                <ChevronRight size={11} />
              </button>
            )}
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Delete Task"
        message={`Are you sure you want to delete "${task.title}"? This cannot be undone.`}
        confirmLabel="Delete"
        loading={deleting}
      />
    </>
  );
};

export default TaskCard;
