import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface PrivateRouteProps {
  children: ReactNode;
  requiredRole?: 'admin' | 'user';
}

export function PrivateRoute({ children, requiredRole = 'user' }: PrivateRouteProps) {
  const { user, loading, checkPermission } = useAuth();
  const location = useLocation();

  // Show loading state while checking authentication
  if (loading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if user has required role
  if (!checkPermission(requiredRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Render children if authenticated and has permission
  return <>{children}</>;
}