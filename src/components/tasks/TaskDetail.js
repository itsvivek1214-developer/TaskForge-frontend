import React from 'react';
import { Calendar, Clock, User, Tag, Activity } from 'lucide-react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { PriorityBadge, StatusBadge } from '../common/Badge';
import { formatDeadline, getStatusMeta } from '../../utils/helpers';
import { useTasks } from '../../context/TaskContext';
import { format } from 'date-fns';
import styles from './TaskDetail.module.css';

const TaskDetail = ({ task, isOpen, onClose, onEdit }) => {
  const { updateStatus } = useTasks();
  if (!task) return null;

  const deadline = task.deadline ? formatDeadline(task.deadline) : null;
  const statusMeta = getStatusMeta(task.status);

  const handleAdvance = async () => {
    if (!statusMeta.next) return;
    await updateStatus(task.id, statusMeta.next);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Task Details"
      size="md"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>Close</Button>
          <Button variant="secondary" onClick={() => { onClose(); onEdit(task); }}>Edit</Button>
          {statusMeta.next && (
            <Button variant="primary" onClick={handleAdvance}>
              → Move to {getStatusMeta(statusMeta.next).label}
            </Button>
          )}
        </>
      }
    >
      <div className={styles.container}>
        <h2 className={styles.title}>{task.title}</h2>

        <div className={styles.badges}>
          <PriorityBadge priority={task.priority} />
          <StatusBadge status={task.status} />
        </div>

        {task.description && (
          <div className={styles.section}>
            <p className={styles.sectionLabel}>Description</p>
            <p className={styles.description}>{task.description}</p>
          </div>
        )}

        <div className={styles.grid}>
          {deadline && (
            <div className={styles.metaItem}>
              <div className={styles.metaIcon}>
                {deadline.overdue ? <Clock size={14} /> : <Calendar size={14} />}
              </div>
              <div>
                <p className={styles.metaLabel}>Deadline</p>
                <p className={`${styles.metaValue} ${deadline.overdue ? styles.overdue : ''}`}>
                  {deadline.formatted}
                  <span className={styles.relative}> ({deadline.relative})</span>
                </p>
              </div>
            </div>
          )}

          {task.createdAt && (
            <div className={styles.metaItem}>
              <div className={styles.metaIcon}><Activity size={14} /></div>
              <div>
                <p className={styles.metaLabel}>Created</p>
                <p className={styles.metaValue}>
                  {format(new Date(task.createdAt), 'MMM d, yyyy HH:mm')}
                </p>
              </div>
            </div>
          )}

          {task.updatedAt && (
            <div className={styles.metaItem}>
              <div className={styles.metaIcon}><Activity size={14} /></div>
              <div>
                <p className={styles.metaLabel}>Last Updated</p>
                <p className={styles.metaValue}>
                  {format(new Date(task.updatedAt), 'MMM d, yyyy HH:mm')}
                </p>
              </div>
            </div>
          )}

          {task.userId && (
            <div className={styles.metaItem}>
              <div className={styles.metaIcon}><User size={14} /></div>
              <div>
                <p className={styles.metaLabel}>Assigned To</p>
                <p className={styles.metaValue}>User #{task.userId}</p>
              </div>
            </div>
          )}
        </div>

        {/* Workflow progress */}
        <div className={styles.section}>
          <p className={styles.sectionLabel}>Workflow Progress</p>
          <div className={styles.workflow}>
            {['TODO', 'IN_PROGRESS', 'DONE'].map((s, i) => {
              const statuses = ['TODO', 'IN_PROGRESS', 'DONE'];
              const current = statuses.indexOf(task.status);
              const pos = statuses.indexOf(s);
              const done = pos < current;
              const active = pos === current;
              return (
                <React.Fragment key={s}>
                  <div className={`${styles.workflowStep} ${active ? styles.active : ''} ${done ? styles.done : ''}`}>
                    <div className={styles.stepDot}>{done ? '✓' : i + 1}</div>
                    <span className={styles.stepLabel}>{getStatusMeta(s).label}</span>
                  </div>
                  {i < 2 && <div className={`${styles.stepLine} ${done ? styles.doneLine : ''}`} />}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default TaskDetail;
