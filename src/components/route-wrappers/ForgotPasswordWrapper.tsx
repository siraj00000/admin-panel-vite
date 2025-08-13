import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ForgotPassword } from '../../pages';

export const ForgotPasswordWrapper: React.FC = () => {
    const navigate = useNavigate();

    const handleBackToLogin = () => {
        navigate('/login');
    };

    const handleTokenSent = (token: string) => {
        navigate(`/reset-password?token=${token}`);
    };

    return (
        <ForgotPassword
            onBackToLogin={handleBackToLogin}
            onSentSuccess={handleTokenSent}
        />
    );
};