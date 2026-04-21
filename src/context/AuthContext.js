import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('taskforge_token');
    const storedUser = localStorage.getItem('taskforge_user');
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (credentials) => {
    const res = await authAPI.login(credentials);
    const { token: jwt, user: userData } = res.data;
    localStorage.setItem('taskforge_token', jwt);
    localStorage.setItem('taskforge_user', JSON.stringify(userData));
    setToken(jwt);
    setUser(userData);
    return userData;
  }, []);

  const register = useCallback(async (data) => {
    const res = await authAPI.register(data);
    return res.data;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('taskforge_token');
    localStorage.removeItem('taskforge_user');
    setToken(null);
    setUser(null);
    toast.success('Logged out successfully');
  }, []);

  const isAdmin = user?.role === 'ADMIN';

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, isAdmin, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
