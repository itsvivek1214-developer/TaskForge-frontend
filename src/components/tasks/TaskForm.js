import React, { useState, useEffect } from 'react';
import { Wand2, AlertCircle } from 'lucide-react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Input from '../common/Input';
import Select from '../common/Select';
import Textarea from '../common/Textarea';
import { useTasks } from '../../context/TaskContext';
import { aiAPI } from '../../services/api';
import { calculateLocalPriority, getErrorMessage, PRIORITIES, STATUSES, STATUS_LABELS } from '../../utils/helpers';
import toast from 'react-hot-toast';
import styles from './TaskForm.module.css';

const PRIORITY_OPTIONS = PRIORITIES.map(p => ({ value: p, label: p.charAt(0) + p.slice(1).toLowerCase() }));
const STATUS_OPTIONS = STATUSES.map(s => ({ value: s, label: STATUS_LABELS[s] }));

const initialForm = {
  title: '',
  description: '',
  priority: 'LOW',
  status: 'TODO',
  deadline: '',
};

const TaskForm = ({ isOpen, onClose, task = null }) => {
  const { createTask, updateTask } = useTasks();
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState(null);

  const isEdit = !!task;

  useEffect(() => {
    if (isOpen) {
      if (task) {
        setForm({
          title: task.title || '',
          description: task.description || '',
          priority: task.priority || 'LOW',
          status: task.status || 'TODO',
          deadline: task.deadline ? task.deadline.slice(0, 16) : '',
        });
      } else {
        setForm(initialForm);
      }
      setErrors({});
      setAiSuggestion(null);
    }
  }, [isOpen, task]);

  // Auto-calculate priority from deadline
  useEffect(() => {
    if (!isEdit && form.deadline) {
      const suggested = calculateLocalPriority(form.deadline);
      setForm(prev => ({ ...prev, priority: suggested }));
    }
  }, [form.deadline, isEdit]);

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = 'Title is required';
    else if (form.title.trim().length > 200) e.title = 'Max 200 characters';
    if (form.description && form.description.length > 1000) e.description = 'Max 1000 characters';
    if (form.deadline) {
      const d = new Date(form.deadline);
      if (isNaN(d.getTime())) e.deadline = 'Invalid date';
      else if (!isEdit && d < new Date()) e.deadline = 'Deadline must be in the future';
    }
    setErrors(e);
    return !Object.keys(e).length;
  };

  const handleChange = (field) => (e) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handleAISuggest = async () => {
    if (!form.description && !form.title) {
      toast.error('Add a title or description first');
      return;
    }
    setAiLoading(true);
    try {
      const res = await aiAPI.suggest({ title: form.title, description: form.description });
      setAiSuggestion(res.data);
      toast.success('AI suggestion ready!');
    } catch {
      // Fallback to mock suggestion for demo
      setAiSuggestion({
        suggestedTitle: form.title ? `${form.title} — Optimized` : 'Untitled Task',
        summary: 'Based on your description, this task involves structured work that requires focused attention. Consider breaking it into smaller subtasks for better manageability.',
        recommendedDeadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
      });
    } finally {
      setAiLoading(false);
    }
  };

  const applySuggestion = () => {
    if (!aiSuggestion) return;
    setForm(prev => ({
      ...prev,
      title: aiSuggestion.suggestedTitle || prev.title,
      deadline: aiSuggestion.recommendedDeadline || prev.deadline,
    }));
    setAiSuggestion(null);
    toast.success('Suggestion applied!');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const payload = {
        ...form,
        title: form.title.trim(),
        description: form.description.trim(),
        deadline: form.deadline || null,
      };
      if (isEdit) {
        await updateTask(task.id, payload);
      } else {
        await createTask(payload);
      }
      onClose();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? 'Edit Task' : 'Create New Task'}
      size="md"
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={loading}>Cancel</Button>
          <Button type="submit" form="task-form" loading={loading}>
            {isEdit ? 'Save Changes' : 'Create Task'}
          </Button>
        </>
      }
    >
      <form id="task-form" onSubmit={handleSubmit} className={styles.form} noValidate>
        <Input
          label="Task Title *"
          placeholder="What needs to be done?"
          value={form.title}
          onChange={handleChange('title')}
          error={errors.title}
          autoFocus
        />

        <Textarea
          label="Description"
          placeholder="Describe the task in detail..."
          value={form.description}
          onChange={handleChange('description')}
          error={errors.description}
          rows={3}
          maxLength={1000}
          showCount
        />

        {/* AI Suggest Button */}
        <div className={styles.aiRow}>
          <Button
            type="button"
            variant="ai"
            size="sm"
            icon={<Wand2 size={14} />}
            loading={aiLoading}
            onClick={handleAISuggest}
          >
            AI Suggestions
          </Button>
          <span className={styles.aiHint}>Get title, summary & deadline from AI</span>
        </div>

        {/* AI Suggestion Card */}
        {aiSuggestion && (
          <div className={styles.suggestionCard}>
            <div className={styles.suggestionHeader}>
              <Wand2 size={14} />
              <span>AI Suggestion</span>
            </div>
            {aiSuggestion.suggestedTitle && (
              <div className={styles.suggestionItem}>
                <span className={styles.suggestionLabel}>Suggested title:</span>
                <span className={styles.suggestionValue}>{aiSuggestion.suggestedTitle}</span>
              </div>
            )}
            {aiSuggestion.summary && (
              <div className={styles.suggestionItem}>
                <span className={styles.suggestionLabel}>Summary:</span>
                <span className={styles.suggestionValue}>{aiSuggestion.summary}</span>
              </div>
            )}
            {aiSuggestion.recommendedDeadline && (
              <div className={styles.suggestionItem}>
                <span className={styles.suggestionLabel}>Recommended deadline:</span>
                <span className={styles.suggestionValue}>
                  {new Date(aiSuggestion.recommendedDeadline).toLocaleString()}
                </span>
              </div>
            )}
            <Button type="button" variant="secondary" size="sm" onClick={applySuggestion}>
              Apply Suggestion
            </Button>
          </div>
        )}

        <div className={styles.row}>
          <Select
            label="Priority"
            value={form.priority}
            onChange={handleChange('priority')}
            options={PRIORITY_OPTIONS}
            containerClass={styles.half}
          />
          <Select
            label="Status"
            value={form.status}
            onChange={handleChange('status')}
            options={STATUS_OPTIONS}
            containerClass={styles.half}
          />
        </div>

        <Input
          label="Deadline"
          type="datetime-local"
          value={form.deadline}
          onChange={handleChange('deadline')}
          error={errors.deadline}
          hint="Priority auto-adjusts based on deadline proximity"
        />
      </form>
    </Modal>
  );
};

export default TaskForm;
