import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from '../common/Button';
import Input from '../common/Input';
import { getErrorMessage } from '../../utils/helpers';
import toast from 'react-hot-toast';
import styles from './Auth.module.css';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.email) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email address';
    if (!form.password) e.password = 'Password is required';
    setErrors(e);
    return !Object.keys(e).length;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await login(form);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field) => (e) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  return (
    <div className={styles.page}>
      <div className={styles.bgGrid} />
      <div className={styles.bgGlow} />

      <div className={styles.card}>
        <div className={styles.logoWrap}>
          <div className={styles.logoMark}>TF</div>
          <div>
            <h1 className={styles.logoName}>TaskForge</h1>
            <p className={styles.logoSub}>AI-Powered Task Management</p>
          </div>
        </div>

        <div className={styles.formHeader}>
          <h2 className={styles.formTitle}>Welcome back</h2>
          <p className={styles.formSub}>Sign in to your workspace</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form} noValidate>
          <Input
            label="Email Address"
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={handleChange('email')}
            error={errors.email}
            icon={<Mail size={16} />}
            autoComplete="email"
          />
          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter your password"
            value={form.password}
            onChange={handleChange('password')}
            error={errors.password}
            icon={<Lock size={16} />}
            iconRight={
              <button
                type="button"
                onClick={() => setShowPassword(s => !s)}
                className={styles.eyeBtn}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            }
            autoComplete="current-password"
          />

          <Button type="submit" fullWidth loading={loading} size="lg">
            Sign In
          </Button>
        </form>

        <div className={styles.divider}><span>Demo credentials</span></div>
        <div className={styles.demoCard}>
          <code className={styles.demoCode}>
            <span>user@demo.com</span>
            <span className={styles.slash}>/</span>
            <span>password123</span>
          </code>
        </div>

        <p className={styles.footer}>
          Don't have an account?{' '}
          <Link to="/register" className={styles.link}>Create one →</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
