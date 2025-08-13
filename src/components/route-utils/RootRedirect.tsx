import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../ui/LoadingSpinner';

export const RootRedirect: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <LoadingSpinner />;
  }

  return isAuthenticated ?
    <Navigate to="/dashboard" replace /> :
    <Navigate to="/login" replace />;
};