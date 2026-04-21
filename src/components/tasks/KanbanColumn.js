import React from 'react';
import TaskCard from './TaskCard';
import Spinner from '../common/Spinner';
import EmptyState from '../common/EmptyState';
import { ClipboardList } from 'lucide-react';
import styles from './KanbanColumn.module.css';

const KanbanColumn = ({ status, label, tasks, onEdit, loading }) => {
  const count = tasks.length;

  const colorMap = {
    TODO: 'var(--status-todo-text)',
    IN_PROGRESS: 'var(--status-progress-text)',
    DONE: 'var(--status-done-text)',
  };

  return (
    <div className={styles.column}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.dot} style={{ background: colorMap[status] }} />
          <h3 className={styles.title}>{label}</h3>
        </div>
        <span className={styles.count}>{count}</span>
      </div>

      {/* Cards */}
      <div className={styles.cards}>
        {loading ? (
          <Spinner centered />
        ) : tasks.length === 0 ? (
          <EmptyState
            icon={<ClipboardList size={20} />}
            title="No tasks"
            description={`No tasks in ${label}`}
          />
        ) : (
          tasks.map(task => (
            <TaskCard key={task.id} task={task} onEdit={onEdit} compact />
          ))
        )}
      </div>
    </div>
  );
};

export default KanbanColumn;
