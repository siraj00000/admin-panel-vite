import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../ui/LoadingSpinner';

interface AuthGuardProps {
    children: React.ReactElement;
    redirectTo?: string;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({
    children,
    redirectTo = '/login'
}) => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return <LoadingSpinner />;
    }

    return isAuthenticated ? children : <Navigate to={redirectTo} replace />;
};
