import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loading from '../components/common/Loading/LoadingSkeleton';

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading type="spinner" size="large" tip="Đang kiểm tra quyền truy cập..." />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    // Redirect to login page with return url
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    // Redirect to unauthorized page or home
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute; 