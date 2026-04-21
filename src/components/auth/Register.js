import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from '../common/Button';
import Input from '../common/Input';
import { getErrorMessage } from '../../utils/helpers';
import toast from 'react-hot-toast';
import styles from './Auth.module.css';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    else if (form.name.trim().length < 2) e.name = 'Name must be at least 2 characters';
    if (!form.email) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email';
    if (!form.password) e.password = 'Password is required';
    else if (form.password.length < 6) e.password = 'At least 6 characters required';
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match';
    setErrors(e);
    return !Object.keys(e).length;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await register({ name: form.name, email: form.email, password: form.password });
      toast.success('Account created! Please sign in.');
      navigate('/login');
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
          <h2 className={styles.formTitle}>Create account</h2>
          <p className={styles.formSub}>Start managing tasks intelligently</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form} noValidate>
          <Input
            label="Full Name"
            type="text"
            placeholder="Your name"
            value={form.name}
            onChange={handleChange('name')}
            error={errors.name}
            icon={<User size={16} />}
            autoComplete="name"
          />
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
            placeholder="Min. 6 characters"
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
            autoComplete="new-password"
          />
          <Input
            label="Confirm Password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Repeat your password"
            value={form.confirmPassword}
            onChange={handleChange('confirmPassword')}
            error={errors.confirmPassword}
            icon={<Lock size={16} />}
            autoComplete="new-password"
          />

          <Button type="submit" fullWidth loading={loading} size="lg">
            Create Account
          </Button>
        </form>

        <p className={styles.footer}>
          Already have an account?{' '}
          <Link to="/login" className={styles.link}>Sign in →</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
