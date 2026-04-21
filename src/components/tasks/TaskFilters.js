import React from 'react';
import { Search, X } from 'lucide-react';
import Input from '../common/Input';
import Select from '../common/Select';
import Button from '../common/Button';
import { useTasks } from '../../context/TaskContext';
import { PRIORITIES, STATUSES, STATUS_LABELS } from '../../utils/helpers';
import styles from './TaskFilters.module.css';

const STATUS_OPTIONS = [{ value: '', label: 'All Statuses' }, ...STATUSES.map(s => ({ value: s, label: STATUS_LABELS[s] }))];
const PRIORITY_OPTIONS = [{ value: '', label: 'All Priorities' }, ...PRIORITIES.map(p => ({ value: p, label: p[0] + p.slice(1).toLowerCase() }))];

const TaskFilters = ({ onSearch }) => {
  const { filters, setFilters, fetchTasks } = useTasks();

  const hasActiveFilters = filters.status || filters.priority || filters.search;

  const handleChange = (field) => (e) => {
    const updated = { ...filters, [field]: e.target.value };
    setFilters(updated);
    if (field !== 'search') fetchTasks(updated);
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter') fetchTasks();
  };

  const clearFilters = () => {
    const reset = { status: '', priority: '', search: '' };
    setFilters(reset);
    fetchTasks(reset);
  };

  return (
    <div className={styles.wrapper}>
      <Input
        placeholder="Search tasks..."
        value={filters.search}
        onChange={handleChange('search')}
        onKeyDown={handleSearchKeyDown}
        icon={<Search size={15} />}
        containerClass={styles.searchInput}
      />
      <Select
        value={filters.status}
        onChange={handleChange('status')}
        options={STATUS_OPTIONS}
        containerClass={styles.select}
      />
      <Select
        value={filters.priority}
        onChange={handleChange('priority')}
        options={PRIORITY_OPTIONS}
        containerClass={styles.select}
      />
      {hasActiveFilters && (
        <Button variant="ghost" size="sm" icon={<X size={14} />} onClick={clearFilters}>
          Clear
        </Button>
      )}
    </div>
  );
};

export default TaskFilters;
