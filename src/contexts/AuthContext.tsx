import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  getCurrentSession, 
  isAuthenticated as checkAuth, 
  signOut,
  initializeAuth,
  type Session,
  type Admin 
} from '../services/authService';

interface AuthContextType {
  isAuthenticated: boolean;
  session: Session | null;
  admin: Admin | null;
  login: (session: Session) => void;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Initialize auth on component mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        // Initialize auth service (sets up interceptors)
        initializeAuth();
        
        // Check for existing session
        const currentSession = getCurrentSession();
        if (currentSession) {
          setSession(currentSession);
        }
      } catch (error) {
        console.error('Failed to initialize auth:', error);
        // Clear any corrupted session data
        await signOut();
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = (newSession: Session) => {
    setSession(newSession);
  };

  const logout = async () => {
    try {
      await signOut();
      setSession(null);
      // Redirect to login page
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout failed:', error);
      // Force logout even if API call fails
      setSession(null);
      window.location.href = '/login';
    }
  };

  const value: AuthContextType = {
    isAuthenticated: checkAuth() && !!session,
    session,
    admin: session?.admin || null,
    login,
    logout,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// HOC for protecting components
export function withAuth<P extends object>(
  Component: React.ComponentType<P>
): React.FC<P> {
  return function AuthenticatedComponent(props: P) {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
        </div>
      );
    }

    if (!isAuthenticated) {
      window.location.href = '/login';
      return null;
    }

    return <Component {...props} />;
  };
}