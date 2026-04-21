import React from 'react';
import { Brain, Zap, Wand2, Shield, Clock } from 'lucide-react';
import AppLayout from '../components/layout/AppLayout';
import Header from '../components/layout/Header';
import AIPanel from '../components/ai/AIPanel';
import styles from './AIAssistant.module.css';

const FeatureCard = ({ icon: Icon, title, description, color }) => (
  <div className={styles.featureCard} style={{ '--color': color }}>
    <div className={styles.featureIcon}><Icon size={18} /></div>
    <h4 className={styles.featureTitle}>{title}</h4>
    <p className={styles.featureDesc}>{description}</p>
  </div>
);

const AIAssistant = () => (
  <AppLayout>
    <Header
      title="AI Assistant"
      subtitle="Intelligent task prioritization and optimization"
    />
    <div className={styles.page}>
      <div className={styles.layout}>
        {/* Left: Panel */}
        <div className={styles.panelCol}>
          <AIPanel />
        </div>

        {/* Right: Info */}
        <div className={styles.infoCol}>
          <div className={styles.heroCard}>
            <div className={styles.heroIcon}>
              <Brain size={32} />
            </div>
            <h2 className={styles.heroTitle}>AI-Powered Intelligence</h2>
            <p className={styles.heroDesc}>
              TaskForge uses rule-based AI logic combined with smart heuristics to help you
              manage tasks more efficiently. The engine analyzes deadlines, complexity, and
              context to give you actionable recommendations.
            </p>
          </div>

          <div className={styles.features}>
            <FeatureCard
              icon={Zap}
              title="Smart Prioritization"
              description="Analyzes deadline proximity and task complexity to recommend HIGH, MEDIUM, or LOW priority automatically."
              color="var(--accent-amber)"
            />
            <FeatureCard
              icon={Wand2}
              title="Title Optimization"
              description="Suggests clearer, more actionable task titles that communicate intent and urgency."
              color="var(--accent-primary)"
            />
            <FeatureCard
              icon={Clock}
              title="Deadline Recommendations"
              description="Based on task scope and complexity, the AI recommends realistic deadline targets."
              color="var(--accent-cyan)"
            />
            <FeatureCard
              icon={Shield}
              title="Rule-Based Engine"
              description="Transparent decision logic: IF deadline < 24h → HIGH. No black-box surprises."
              color="var(--accent-green)"
            />
          </div>

          <div className={styles.ruleBox}>
            <p className={styles.ruleBoxTitle}>Priority Rules</p>
            <div className={styles.ruleList}>
              {[
                { cond: 'Deadline < 24 hours', result: 'HIGH', color: 'var(--accent-red)' },
                { cond: 'Deadline < 3 days', result: 'MEDIUM', color: 'var(--accent-amber)' },
                { cond: 'Deadline > 3 days', result: 'LOW', color: 'var(--accent-green)' },
                { cond: 'Task overdue', result: 'HIGH (urgent)', color: 'var(--accent-red)' },
              ].map(({ cond, result, color }) => (
                <div key={cond} className={styles.rule}>
                  <code className={styles.ruleCond}>IF {cond}</code>
                  <span className={styles.ruleThen}>→</span>
                  <span className={styles.ruleResult} style={{ color }}>{result}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
);

export default AIAssistant;
