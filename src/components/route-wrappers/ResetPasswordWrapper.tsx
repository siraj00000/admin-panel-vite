import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ResetPassword } from '../../pages';

export const ResetPasswordWrapper: React.FC = () => {
  const navigate = useNavigate();

  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get('token');

  const handleBackToLogin = () => {
    navigate('/login');
  };

  return (
    <ResetPassword
      token={token || null}
      onBackToLogin={handleBackToLogin}
    />
  );
};