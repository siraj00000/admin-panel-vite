import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Login } from '../../pages';
import type { Session } from '../../services/authService';

export const LoginPageWrapper: React.FC = () => {
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLoginSuccess = (session: Session) => {
        login(session);
        navigate('/dashboard');
    };

    const handleForgotPassword = () => {
        navigate('/forgot-password');
    };

    return (
        <Login
            onLoginSuccess={handleLoginSuccess}
            onForgotPassword={handleForgotPassword}
        />
    );
};
