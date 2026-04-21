import React, { useEffect, useState } from 'react';
import { Plus, RefreshCw } from 'lucide-react';
import AppLayout from '../components/layout/AppLayout';
import Header from '../components/layout/Header';
import Button from '../components/common/Button';
import KanbanColumn from '../components/tasks/KanbanColumn';
import TaskForm from '../components/tasks/TaskForm';
import { useTasks } from '../context/TaskContext';
import { STATUSES, STATUS_LABELS } from '../utils/helpers';
import styles from './Kanban.module.css';

const Kanban = () => {
  const { tasks, loading, fetchTasks, getTasksByStatus } = useTasks();
  const [createOpen, setCreateOpen] = useState(false);
  const [editTask, setEditTask] = useState(null);

  useEffect(() => { fetchTasks(); }, []);

  const handleRefresh = () => fetchTasks();

  return (
    <AppLayout>
      <Header
        title="Kanban Board"
        subtitle="Drag tasks across columns to update their status"
        actions={
          <>
            <Button variant="ghost" size="sm" icon={<RefreshCw size={14} />} onClick={handleRefresh}>
              Refresh
            </Button>
            <Button icon={<Plus size={15} />} onClick={() => setCreateOpen(true)}>
              New Task
            </Button>
          </>
        }
      />

      <div className={styles.page}>
        {/* Legend */}
        <div className={styles.legend}>
          <span className={styles.legendLabel}>Workflow:</span>
          {STATUSES.map((s, i) => (
            <React.Fragment key={s}>
              <span className={styles.legendStep}>{STATUS_LABELS[s]}</span>
              {i < STATUSES.length - 1 && <span className={styles.legendArrow}>→</span>}
            </React.Fragment>
          ))}
          <span className={styles.legendNote}>· Use the "→ Move to" button on each card to advance</span>
        </div>

        {/* Board */}
        <div className={styles.board}>
          {STATUSES.map(status => (
            <KanbanColumn
              key={status}
              status={status}
              label={STATUS_LABELS[status]}
              tasks={getTasksByStatus(status)}
              onEdit={setEditTask}
              loading={loading}
            />
          ))}
        </div>
      </div>

      <TaskForm isOpen={createOpen} onClose={() => setCreateOpen(false)} />
      <TaskForm isOpen={!!editTask} onClose={() => setEditTask(null)} task={editTask} />
    </AppLayout>
  );
};

export default Kanban;
