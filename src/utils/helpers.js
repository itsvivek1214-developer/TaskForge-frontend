import { formatDistanceToNow, isPast, differenceInHours, format } from 'date-fns';

export const formatDeadline = (deadline) => {
  if (!deadline) return null;
  const date = new Date(deadline);
  const overdue = isPast(date);
  const relative = formatDistanceToNow(date, { addSuffix: true });
  const formatted = format(date, 'MMM d, yyyy');
  return { date, overdue, relative, formatted };
};

export const getPriorityMeta = (priority) => {
  const map = {
    HIGH:   { label: 'High',   color: 'var(--priority-high-text)',   bg: 'var(--priority-high-bg)',   border: 'var(--priority-high-border)',   dot: '#fc5c7d' },
    MEDIUM: { label: 'Medium', color: 'var(--priority-medium-text)', bg: 'var(--priority-medium-bg)', border: 'var(--priority-medium-border)', dot: '#f7b731' },
    LOW:    { label: 'Low',    color: 'var(--priority-low-text)',    bg: 'var(--priority-low-bg)',    border: 'var(--priority-low-border)',    dot: '#43e97b' },
  };
  return map[priority] || map.LOW;
};

export const getStatusMeta = (status) => {
  const map = {
    TODO:        { label: 'To Do',       bg: 'var(--status-todo-bg)',     border: 'var(--status-todo-border)',     text: 'var(--status-todo-text)',     next: 'IN_PROGRESS' },
    IN_PROGRESS: { label: 'In Progress', bg: 'var(--status-progress-bg)', border: 'var(--status-progress-border)', text: 'var(--status-progress-text)', next: 'DONE'        },
    DONE:        { label: 'Done',        bg: 'var(--status-done-bg)',     border: 'var(--status-done-border)',     text: 'var(--status-done-text)',     next: null          },
  };
  return map[status] || map.TODO;
};

export const calculateLocalPriority = (deadline, description = '') => {
  if (!deadline) return 'LOW';
  const hours = differenceInHours(new Date(deadline), new Date());
  if (hours < 0) return 'HIGH';        // Overdue
  if (hours < 24) return 'HIGH';
  if (hours < 72) return 'MEDIUM';
  return 'LOW';
};

export const getErrorMessage = (error) => {
  return error?.response?.data?.message
    || error?.response?.data?.error
    || error?.message
    || 'Something went wrong';
};

export const debounce = (fn, delay) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};

export const STATUSES = ['TODO', 'IN_PROGRESS', 'DONE'];
export const PRIORITIES = ['LOW', 'MEDIUM', 'HIGH'];
export const STATUS_LABELS = { TODO: 'To Do', IN_PROGRESS: 'In Progress', DONE: 'Done' };
