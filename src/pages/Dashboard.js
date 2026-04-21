import React, { useEffect, useMemo, useState } from 'react';
import { CheckSquare, Clock, TrendingUp, AlertTriangle, Plus, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../components/layout/AppLayout';
import Header from '../components/layout/Header';
import Button from '../components/common/Button';
import TaskCard from '../components/tasks/TaskCard';
import TaskForm from '../components/tasks/TaskForm';
import { useTasks } from '../context/TaskContext';
import { useAuth } from '../context/AuthContext';
import Spinner from '../components/common/Spinner';
import { formatDeadline } from '../utils/helpers';
import styles from './Dashboard.module.css';

const StatCard = ({ icon: Icon, label, value, color, trend }) => (
  <div className={styles.statCard} style={{ '--accent': color }}>
    <div className={styles.statIcon}><Icon size={18} /></div>
    <div className={styles.statBody}>
      <p className={styles.statValue}>{value}</p>
      <p className={styles.statLabel}>{label}</p>
    </div>
    {trend && <span className={styles.statTrend}>{trend}</span>}
  </div>
);

const Dashboard = () => {
  const { tasks, loading, fetchTasks } = useTasks();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [createOpen, setCreateOpen] = useState(false);
  const [editTask, setEditTask] = useState(null);

  useEffect(() => { fetchTasks(); }, []);

  const stats = useMemo(() => {
    const total = tasks.length;
    const todo = tasks.filter(t => t.status === 'TODO').length;
    const inProgress = tasks.filter(t => t.status === 'IN_PROGRESS').length;
    const done = tasks.filter(t => t.status === 'DONE').length;
    const high = tasks.filter(t => t.priority === 'HIGH').length;
    const overdue = tasks.filter(t => t.deadline && formatDeadline(t.deadline)?.overdue && t.status !== 'DONE').length;
    const completionRate = total > 0 ? Math.round((done / total) * 100) : 0;
    return { total, todo, inProgress, done, high, overdue, completionRate };
  }, [tasks]);

  const recentTasks = useMemo(() =>
    [...tasks].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)).slice(0, 5),
    [tasks]
  );

  const urgentTasks = useMemo(() =>
    tasks.filter(t => t.priority === 'HIGH' && t.status !== 'DONE').slice(0, 3),
    [tasks]
  );

  return (
    <AppLayout>
      <Header
        title={`Good ${getGreeting()}, ${user?.name?.split(' ')[0] || 'there'} 👋`}
        subtitle="Here's your task overview"
        actions={
          <Button icon={<Plus size={15} />} onClick={() => setCreateOpen(true)}>
            New Task
          </Button>
        }
      />

      <div className={styles.page}>
        {/* Stats */}
        <section className={styles.statsGrid}>
          <StatCard icon={CheckSquare} label="Total Tasks" value={stats.total} color="var(--accent-primary)" />
          <StatCard icon={Clock} label="In Progress" value={stats.inProgress} color="var(--accent-amber)" />
          <StatCard icon={TrendingUp} label="Completed" value={stats.done} color="var(--accent-green)" trend={`${stats.completionRate}%`} />
          <StatCard icon={AlertTriangle} label="Overdue" value={stats.overdue} color="var(--accent-red)" />
        </section>

        {/* Progress bar */}
        {stats.total > 0 && (
          <section className={styles.progressSection}>
            <div className={styles.progressHeader}>
              <span className={styles.progressLabel}>Overall Completion</span>
              <span className={styles.progressValue}>{stats.completionRate}%</span>
            </div>
            <div className={styles.progressTrack}>
              <div
                className={styles.progressFill}
                style={{ width: `${stats.completionRate}%` }}
              />
            </div>
            <div className={styles.progressSplit}>
              <span style={{ color: 'var(--status-todo-text)' }}>{stats.todo} Todo</span>
              <span style={{ color: 'var(--status-progress-text)' }}>{stats.inProgress} In Progress</span>
              <span style={{ color: 'var(--status-done-text)' }}>{stats.done} Done</span>
            </div>
          </section>
        )}

        <div className={styles.columns}>
          {/* Recent Tasks */}
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Recent Tasks</h2>
              <Button variant="ghost" size="sm" iconRight={<ArrowRight size={14} />} onClick={() => navigate('/tasks')}>
                View All
              </Button>
            </div>
            {loading ? (
              <Spinner centered />
            ) : recentTasks.length === 0 ? (
              <div className={styles.emptyMsg}>
                <p>No tasks yet.</p>
                <Button size="sm" onClick={() => setCreateOpen(true)}>Create your first task</Button>
              </div>
            ) : (
              <div className={styles.taskList}>
                {recentTasks.map(t => (
                  <TaskCard key={t.id} task={t} onEdit={setEditTask} compact />
                ))}
              </div>
            )}
          </section>

          {/* Urgent Tasks */}
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>
                <AlertTriangle size={16} style={{ color: 'var(--accent-red)' }} />
                Urgent Tasks
              </h2>
            </div>
            {urgentTasks.length === 0 ? (
              <div className={styles.allClearCard}>
                <span className={styles.allClearEmoji}>✅</span>
                <p className={styles.allClearText}>No urgent tasks. Great work!</p>
              </div>
            ) : (
              <div className={styles.taskList}>
                {urgentTasks.map(t => (
                  <TaskCard key={t.id} task={t} onEdit={setEditTask} compact />
                ))}
              </div>
            )}

            {/* Priority breakdown */}
            <div className={styles.priorityBreakdown}>
              <p className={styles.breakdownTitle}>Priority Breakdown</p>
              {[
                { label: 'High', count: tasks.filter(t => t.priority === 'HIGH').length, color: 'var(--accent-red)' },
                { label: 'Medium', count: tasks.filter(t => t.priority === 'MEDIUM').length, color: 'var(--accent-amber)' },
                { label: 'Low', count: tasks.filter(t => t.priority === 'LOW').length, color: 'var(--accent-green)' },
              ].map(({ label, count, color }) => (
                <div key={label} className={styles.breakdownRow}>
                  <div className={styles.breakdownLabel}>
                    <div className={styles.breakdownDot} style={{ background: color }} />
                    <span>{label}</span>
                  </div>
                  <div className={styles.breakdownBar}>
                    <div
                      className={styles.breakdownFill}
                      style={{
                        width: stats.total > 0 ? `${(count / stats.total) * 100}%` : '0%',
                        background: color,
                        opacity: 0.7
                      }}
                    />
                  </div>
                  <span className={styles.breakdownCount}>{count}</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      <TaskForm isOpen={createOpen} onClose={() => setCreateOpen(false)} />
      <TaskForm isOpen={!!editTask} onClose={() => setEditTask(null)} task={editTask} />
    </AppLayout>
  );
};

const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return 'morning';
  if (h < 17) return 'afternoon';
  return 'evening';
};

export default Dashboard;
