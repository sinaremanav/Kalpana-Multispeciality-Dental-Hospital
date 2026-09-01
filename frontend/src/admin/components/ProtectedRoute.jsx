import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingState from '../../components/LoadingState';

export const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading, role, isAdmin } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <LoadingState message="Verifying secure access..." />
      </div>
    );
  }

  if (!user) {
    // Redirect to /admin/login keeping return url
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // If a specific role is required (like 'admin' only) and user is only 'doctor', redirect to /admin/profile
  if (requiredRole === 'admin' && !isAdmin) {
    return <Navigate to="/admin/profile" replace />;
  }

  return children;
};

export default ProtectedRoute;
