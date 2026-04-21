import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, CheckSquare, Kanban, Brain,
  LogOut, ChevronLeft, ChevronRight, User, Settings, Bell
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { RoleBadge } from '../common/Badge';
import styles from './Sidebar.module.css';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/tasks',     icon: CheckSquare,     label: 'Tasks' },
  { to: '/kanban',    icon: Kanban,          label: 'Kanban Board' },
  { to: '/ai',        icon: Brain,           label: 'AI Assistant' },
];

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className={`${styles.sidebar} ${collapsed ? styles.collapsed : ''}`}>
      {/* Logo */}
      <div className={styles.logo}>
        <div className={styles.logoMark}>TF</div>
        {!collapsed && (
          <div className={styles.logoText}>
            <span className={styles.logoName}>TaskForge</span>
            <span className={styles.logoTagline}>AI-Powered</span>
          </div>
        )}
      </div>

      {/* Toggle */}
      <button
        className={styles.collapseBtn}
        onClick={() => setCollapsed(!collapsed)}
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      {/* Nav */}
      <nav className={styles.nav}>
        <p className={styles.navSection}>{!collapsed && 'Navigation'}</p>
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `${styles.navItem} ${isActive ? styles.active : ''}`
            }
            title={collapsed ? label : undefined}
          >
            <span className={styles.navIcon}><Icon size={18} /></span>
            {!collapsed && <span className={styles.navLabel}>{label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Bottom section */}
      <div className={styles.bottom}>
        <div className={styles.userCard}>
          <div className={styles.avatar}>
            {user?.name?.[0]?.toUpperCase() || <User size={16} />}
          </div>
          {!collapsed && (
            <div className={styles.userInfo}>
              <span className={styles.userName}>{user?.name || 'User'}</span>
              <RoleBadge role={user?.role || 'USER'} />
            </div>
          )}
        </div>

        <button
          className={styles.logoutBtn}
          onClick={handleLogout}
          title={collapsed ? 'Logout' : undefined}
        >
          <LogOut size={16} />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
