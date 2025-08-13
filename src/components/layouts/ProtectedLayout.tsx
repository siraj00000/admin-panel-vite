import React from 'react';
import { AuthGuard } from '../route-guards';
import AdminLayout from '../layout/AdminLayout';

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

export const ProtectedLayout: React.FC<ProtectedLayoutProps> = ({ children }) => {
  return (
    <AuthGuard>
      <AdminLayout>
        {children}
      </AdminLayout>
    </AuthGuard>
  );
};