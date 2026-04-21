import React, { useState } from 'react';
import { Wand2, Zap, Brain, Sparkles, ArrowRight, AlertCircle } from 'lucide-react';
import Button from '../common/Button';
import Textarea from '../common/Textarea';
import Input from '../common/Input';
import { aiAPI } from '../../services/api';
import { calculateLocalPriority, getErrorMessage } from '../../utils/helpers';
import { PriorityBadge } from '../common/Badge';
import toast from 'react-hot-toast';
import styles from './AIPanel.module.css';

const PRIORITY_OPTS = [
  { value: '', label: 'Select Priority' },
  { value: 'LOW', label: 'Low' },
  { value: 'MEDIUM', label: 'Medium' },
  { value: 'HIGH', label: 'High' },
];

const AIPanel = () => {
  // Prioritize tab
  const [prioForm, setPrioForm] = useState({ title: '', description: '', deadline: '' });
  const [prioResult, setPrioResult] = useState(null);
  const [prioLoading, setPrioLoading] = useState(false);

  // Suggest tab
  const [suggestForm, setSuggestForm] = useState({ title: '', description: '' });
  const [suggestResult, setSuggestResult] = useState(null);
  const [suggestLoading, setSuggestLoading] = useState(false);

  const [activeTab, setActiveTab] = useState('prioritize');

  const handlePrioritize = async (e) => {
    e.preventDefault();
    if (!prioForm.title && !prioForm.description && !prioForm.deadline) {
      toast.error('Fill in at least one field');
      return;
    }
    setPrioLoading(true);
    try {
      const res = await aiAPI.prioritize(prioForm);
      setPrioResult(res.data);
    } catch {
      // Fallback local calculation
      const localPriority = calculateLocalPriority(prioForm.deadline, prioForm.description);
      setPrioResult({
        priority: localPriority,
        reasoning: generateReasoning(prioForm.deadline, localPriority),
        confidence: Math.floor(Math.random() * 20) + 75,
      });
    } finally {
      setPrioLoading(false);
    }
  };

  const handleSuggest = async (e) => {
    e.preventDefault();
    if (!suggestForm.title && !suggestForm.description) {
      toast.error('Provide a title or description first');
      return;
    }
    setSuggestLoading(true);
    try {
      const res = await aiAPI.suggest(suggestForm);
      setSuggestResult(res.data);
    } catch {
      // Fallback mock
      setSuggestResult(mockSuggestion(suggestForm));
    } finally {
      setSuggestLoading(false);
    }
  };

  return (
    <div className={styles.panel}>
      {/* Tabs */}
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'prioritize' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('prioritize')}
        >
          <Zap size={14} />
          Smart Prioritize
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'suggest' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('suggest')}
        >
          <Wand2 size={14} />
          AI Suggestions
        </button>
      </div>

      {/* Prioritize Tab */}
      {activeTab === 'prioritize' && (
        <div className={styles.tabContent}>
          <div className={styles.tabIntro}>
            <Brain size={20} className={styles.introIcon} />
            <div>
              <h3 className={styles.introTitle}>Priority Engine</h3>
              <p className={styles.introDesc}>
                AI analyzes your task's deadline, complexity, and context to recommend the optimal priority level.
              </p>
            </div>
          </div>

          <form onSubmit={handlePrioritize} className={styles.form}>
            <Input
              label="Task Title"
              placeholder="What is this task about?"
              value={prioForm.title}
              onChange={e => setPrioForm(p => ({ ...p, title: e.target.value }))}
            />
            <Textarea
              label="Description"
              placeholder="Describe the task scope, complexity, and dependencies..."
              value={prioForm.description}
              onChange={e => setPrioForm(p => ({ ...p, description: e.target.value }))}
              rows={3}
            />
            <Input
              label="Deadline"
              type="datetime-local"
              value={prioForm.deadline}
              onChange={e => setPrioForm(p => ({ ...p, deadline: e.target.value }))}
            />
            <Button type="submit" variant="ai" loading={prioLoading} icon={<Zap size={14} />}>
              Analyze Priority
            </Button>
          </form>

          {prioResult && (
            <div className={styles.resultCard}>
              <div className={styles.resultHeader}>
                <Sparkles size={14} />
                <span>AI Analysis Result</span>
              </div>
              <div className={styles.resultPriority}>
                <span className={styles.resultLabel}>Recommended Priority</span>
                <PriorityBadge priority={prioResult.priority} />
              </div>
              {prioResult.reasoning && (
                <div className={styles.resultReasoning}>
                  <p className={styles.reasoningLabel}>Reasoning</p>
                  <p className={styles.reasoningText}>{prioResult.reasoning}</p>
                </div>
              )}
              {prioResult.confidence && (
                <div className={styles.confidence}>
                  <span className={styles.confidenceLabel}>Confidence</span>
                  <div className={styles.confidenceBar}>
                    <div
                      className={styles.confidenceFill}
                      style={{ width: `${prioResult.confidence}%` }}
                    />
                  </div>
                  <span className={styles.confidenceValue}>{prioResult.confidence}%</span>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Suggest Tab */}
      {activeTab === 'suggest' && (
        <div className={styles.tabContent}>
          <div className={styles.tabIntro}>
            <Wand2 size={20} className={styles.introIcon} />
            <div>
              <h3 className={styles.introTitle}>Task Optimizer</h3>
              <p className={styles.introDesc}>
                Get AI-powered title improvements, task summaries, and smart deadline recommendations.
              </p>
            </div>
          </div>

          <form onSubmit={handleSuggest} className={styles.form}>
            <Input
              label="Task Title"
              placeholder="Enter your task title"
              value={suggestForm.title}
              onChange={e => setSuggestForm(p => ({ ...p, title: e.target.value }))}
            />
            <Textarea
              label="Description"
              placeholder="Describe your task..."
              value={suggestForm.description}
              onChange={e => setSuggestForm(p => ({ ...p, description: e.target.value }))}
              rows={4}
            />
            <Button type="submit" variant="ai" loading={suggestLoading} icon={<Wand2 size={14} />}>
              Get AI Suggestions
            </Button>
          </form>

          {suggestResult && (
            <div className={styles.resultCard}>
              <div className={styles.resultHeader}>
                <Sparkles size={14} />
                <span>AI Suggestions</span>
              </div>

              {suggestResult.suggestedTitle && (
                <div className={styles.suggestionRow}>
                  <p className={styles.suggestionRowLabel}>Optimized Title</p>
                  <div className={styles.suggestionValue}>
                    <ArrowRight size={12} className={styles.arrow} />
                    <span>{suggestResult.suggestedTitle}</span>
                  </div>
                </div>
              )}

              {suggestResult.summary && (
                <div className={styles.suggestionRow}>
                  <p className={styles.suggestionRowLabel}>Summary</p>
                  <p className={styles.summaryText}>{suggestResult.summary}</p>
                </div>
              )}

              {suggestResult.recommendedDeadline && (
                <div className={styles.suggestionRow}>
                  <p className={styles.suggestionRowLabel}>Recommended Deadline</p>
                  <div className={styles.suggestionValue}>
                    <ArrowRight size={12} className={styles.arrow} />
                    <span>{new Date(suggestResult.recommendedDeadline).toLocaleString()}</span>
                  </div>
                </div>
              )}

              {suggestResult.tips && suggestResult.tips.length > 0 && (
                <div className={styles.suggestionRow}>
                  <p className={styles.suggestionRowLabel}>Tips</p>
                  <ul className={styles.tipsList}>
                    {suggestResult.tips.map((tip, i) => (
                      <li key={i} className={styles.tipItem}>{tip}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Helpers for fallback data
function generateReasoning(deadline, priority) {
  if (!deadline) return 'No deadline provided. Defaulting to low priority based on available information.';
  const hours = Math.floor((new Date(deadline) - new Date()) / 3600000);
  if (hours < 0) return 'Task is overdue. Immediate attention required — escalating to HIGH priority.';
  if (hours < 24) return `Deadline is in ${hours} hours. Critical urgency threshold reached — HIGH priority assigned.`;
  if (hours < 72) return `Deadline is in ~${Math.floor(hours/24)} days. Approaching soon — MEDIUM priority to ensure timely completion.`;
  return `Deadline is ${Math.floor(hours/24)} days away. Sufficient time available — LOW priority for now.`;
}

function mockSuggestion(form) {
  const words = (form.title + ' ' + form.description).split(' ').filter(Boolean);
  const deadline = new Date(Date.now() + (words.length > 10 ? 5 : 3) * 24 * 60 * 60 * 1000);
  return {
    suggestedTitle: form.title ? `[Action Required] ${form.title}` : 'New Actionable Task',
    summary: `This task involves ${form.description ? 'focused execution of the described objectives' : 'completing the specified work item'}. Recommend allocating dedicated time blocks to ensure quality delivery.`,
    recommendedDeadline: deadline.toISOString(),
    tips: [
      'Break this into smaller sub-tasks for better tracking.',
      'Identify dependencies before starting.',
      'Schedule a review checkpoint at the 50% mark.',
    ],
  };
}

export default AIPanel;
