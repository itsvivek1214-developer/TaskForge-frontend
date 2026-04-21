import React, { createContext, useContext, useState, useCallback } from 'react';
import { tasksAPI } from '../services/api';
import toast from 'react-hot-toast';

const TaskContext = createContext(null);

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ page: 0, size: 20, total: 0 });
  const [filters, setFilters] = useState({ status: '', priority: '', search: '' });

  const fetchTasks = useCallback(async (params = {}) => {
    setLoading(true);
    try {
      const res = await tasksAPI.getAll({ ...filters, ...params });
      const data = res.data;
      // Support both paginated and plain array responses
      if (Array.isArray(data)) {
        setTasks(data);
        setPagination(prev => ({ ...prev, total: data.length }));
      } else {
        setTasks(data.content || []);
        setPagination({
          page: data.number || 0,
          size: data.size || 20,
          total: data.totalElements || 0,
        });
      }
    } catch (err) {
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const createTask = useCallback(async (data) => {
    const res = await tasksAPI.create(data);
    setTasks(prev => [res.data, ...prev]);
    toast.success('Task created!');
    return res.data;
  }, []);

  const updateTask = useCallback(async (id, data) => {
    const res = await tasksAPI.update(id, data);
    setTasks(prev => prev.map(t => t.id === id ? res.data : t));
    toast.success('Task updated!');
    return res.data;
  }, []);

  const deleteTask = useCallback(async (id) => {
    await tasksAPI.delete(id);
    setTasks(prev => prev.filter(t => t.id !== id));
    toast.success('Task deleted');
  }, []);

  const updateStatus = useCallback(async (id, status) => {
    const res = await tasksAPI.updateStatus(id, status);
    setTasks(prev => prev.map(t => t.id === id ? res.data : t));
    toast.success(`Moved to ${status.replace('_', ' ')}`);
    return res.data;
  }, []);

  const getTasksByStatus = useCallback((status) => {
    return tasks.filter(t => t.status === status);
  }, [tasks]);

  return (
    <TaskContext.Provider value={{
      tasks, loading, pagination, filters,
      setFilters, fetchTasks, createTask, updateTask,
      deleteTask, updateStatus, getTasksByStatus,
    }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => {
  const ctx = useContext(TaskContext);
  if (!ctx) throw new Error('useTasks must be used within TaskProvider');
  return ctx;
};
