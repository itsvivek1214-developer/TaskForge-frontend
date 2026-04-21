import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { TaskProvider } from './context/TaskContext';
import ProtectedRoute, { PublicRoute } from './components/auth/ProtectedRoute';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';
import Kanban from './pages/Kanban';
import AIAssistant from './pages/AIAssistant';
import NotFound from './pages/NotFound';

const App = () => (
  <BrowserRouter>
    <AuthProvider>
      <TaskProvider>
        <Routes>
          {/* Public */}
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

          {/* Protected */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/tasks"     element={<ProtectedRoute><Tasks /></ProtectedRoute>} />
          <Route path="/kanban"    element={<ProtectedRoute><Kanban /></ProtectedRoute>} />
          <Route path="/ai"        element={<ProtectedRoute><AIAssistant /></ProtectedRoute>} />

          {/* Redirects */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>

        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#18181f',
              color: '#f0f0f8',
              border: '1px solid #2a2a38',
              borderRadius: '10px',
              fontFamily: "'Cabinet Grotesk', sans-serif",
              fontSize: '14px',
              padding: '12px 16px',
            },
            success: {
              iconTheme: { primary: '#43e97b', secondary: '#18181f' },
            },
            error: {
              iconTheme: { primary: '#fc5c7d', secondary: '#18181f' },
            },
          }}
        />
      </TaskProvider>
    </AuthProvider>
  </BrowserRouter>
);

export default App;
