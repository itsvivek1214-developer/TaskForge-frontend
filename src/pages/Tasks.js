import React, { useEffect, useState } from 'react';
import { Plus, LayoutGrid, List, CheckSquare } from 'lucide-react';
import AppLayout from '../components/layout/AppLayout';
import Header from '../components/layout/Header';
import Button from '../components/common/Button';
import TaskCard from '../components/tasks/TaskCard';
import TaskFilters from '../components/tasks/TaskFilters';
import TaskForm from '../components/tasks/TaskForm';
import TaskDetail from '../components/tasks/TaskDetail';
import EmptyState from '../components/common/EmptyState';
import Spinner from '../components/common/Spinner';
import { useTasks } from '../context/TaskContext';
import styles from './Tasks.module.css';

const Tasks = () => {
  const { tasks, loading, fetchTasks, pagination } = useTasks();
  const [createOpen, setCreateOpen] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [viewTask, setViewTask] = useState(null);
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'grid'

  useEffect(() => { fetchTasks(); }, []);

  const handleEdit = (task) => setEditTask(task);
  const handleView = (task) => setViewTask(task);

  return (
    <AppLayout>
      <Header
        title="Tasks"
        subtitle={`${pagination.total || tasks.length} tasks total`}
        actions={
          <Button icon={<Plus size={15} />} onClick={() => setCreateOpen(true)}>
            New Task
          </Button>
        }
      />

      <div className={styles.page}>
        {/* Toolbar */}
        <div className={styles.toolbar}>
          <TaskFilters />
          <div className={styles.viewToggle}>
            <button
              className={`${styles.viewBtn} ${viewMode === 'list' ? styles.activeView : ''}`}
              onClick={() => setViewMode('list')}
              title="List view"
            >
              <List size={15} />
            </button>
            <button
              className={`${styles.viewBtn} ${viewMode === 'grid' ? styles.activeView : ''}`}
              onClick={() => setViewMode('grid')}
              title="Grid view"
            >
              <LayoutGrid size={15} />
            </button>
          </div>
        </div>

        {/* Task List */}
        {loading ? (
          <Spinner centered />
        ) : tasks.length === 0 ? (
          <EmptyState
            icon={<CheckSquare size={24} />}
            title="No tasks found"
            description="Create your first task or try adjusting your filters."
            action={
              <Button icon={<Plus size={14} />} onClick={() => setCreateOpen(true)}>
                Create Task
              </Button>
            }
          />
        ) : (
          <div className={`${styles.taskGrid} ${viewMode === 'grid' ? styles.gridMode : styles.listMode}`}>
            {tasks.map(task => (
              <div key={task.id} onClick={() => handleView(task)} className={styles.cardWrapper}>
                <TaskCard task={task} onEdit={(t) => { handleEdit(t); }} compact={viewMode === 'grid'} />
              </div>
            ))}
          </div>
        )}

        {/* Pagination info */}
        {pagination.total > 0 && (
          <div className={styles.paginationInfo}>
            <span className={styles.pageInfo}>
              Showing {tasks.length} of {pagination.total} tasks
            </span>
          </div>
        )}
      </div>

      <TaskForm isOpen={createOpen} onClose={() => setCreateOpen(false)} />
      <TaskForm isOpen={!!editTask} onClose={() => setEditTask(null)} task={editTask} />
      <TaskDetail
        task={viewTask}
        isOpen={!!viewTask}
        onClose={() => setViewTask(null)}
        onEdit={(t) => { setViewTask(null); setEditTask(t); }}
      />
    </AppLayout>
  );
};

export default Tasks;
