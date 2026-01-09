import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ProtectedRoute({ children, requireRole }) {
  const { user, loading } = useAuth();

  console.log('ProtectedRoute check:', { user, loading, requireRole });

  if (loading) {
    console.log('Still loading, showing loading screen');
    return <div className="container"><div className="loading">Loading...</div></div>;
  }

  if (!user) {
    console.log('No user found, redirecting to /login');
    return <Navigate to="/login" replace />;
  }

  if (requireRole && user.role !== requireRole) {
    console.log(`Role mismatch: required=${requireRole}, actual=${user.role}`);
    if (user.role === 'professor') {
      console.log('Redirecting professor to /professor');
      return <Navigate to="/professor" replace />;
    }
    console.log('Redirecting student to /dashboard');
    return <Navigate to="/dashboard" replace />;
  }

  console.log('ProtectedRoute passed, rendering children');
  return children;
}

export default ProtectedRoute;
