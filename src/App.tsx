import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import LoginForm from './components/auth/LoginForm';
import Dashboard from './pages/Dashboard';
import Documents from './pages/Documents';
import Schedule from './pages/Schedule';
import Sales from './pages/Sales';
import Users from './pages/admin/Users';
import { useAuthStore } from './stores/authStore';

const ProtectedRoute = ({ children, requireAdmin = false }: { children: React.ReactNode, requireAdmin?: boolean }) => {
  const { user, userRole, loading } = useAuthStore();
  
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/login" />;
  }

  if (requireAdmin && !userRole?.isAdmin) {
    return <Navigate to="/" />;
  }
  
  return <>{children}</>;
};

function App() {
  const { userRole } = useAuthStore();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="documents" element={<Documents />} />
          <Route path="schedule" element={<Schedule />} />
          <Route path="sales" element={<Sales />} />
          {userRole?.isAdmin && (
            <Route 
              path="users" 
              element={
                <ProtectedRoute requireAdmin>
                  <Users />
                </ProtectedRoute>
              } 
            />
          )}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;