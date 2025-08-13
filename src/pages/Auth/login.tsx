import React, { useState } from 'react';
import { Eye, EyeOff, Lock, Mail, Shield } from 'lucide-react';
import * as yup from 'yup';
import { signIn, type Session } from '../../services/authService';
import { theme } from '../../utils/constants';
import LOGO from "../../assets/images/home/logo.png";

interface FormData {
  email: string;
  password: string;
}

interface FormErrors {
  email?: string;
  password?: string;
}

const loginSchema = yup.object().shape({
  email: yup
    .string()
    .email('Please enter a valid email address')
    .required('Email is required'),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required')
});

interface LoginPageProps {
  onLoginSuccess?: (session: Session) => void;
  onForgotPassword?: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({
  onLoginSuccess,
  onForgotPassword,
}) => {
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loginError, setLoginError] = useState<string>('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear field error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    // Clear login error
    if (loginError) {
      setLoginError('');
    }
  };

  const validateForm = async (): Promise<boolean> => {
    try {
      await loginSchema.validate(formData, { abortEarly: false });
      setErrors({});
      return true;
    } catch (err) {
      const validationErrors: FormErrors = {};
      if (err instanceof yup.ValidationError) {
        err.inner.forEach(error => {
          if (error.path) {
            validationErrors[error.path as keyof FormErrors] = error.message;
          }
        });
      }
      setErrors(validationErrors);
      return false;
    }
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>): Promise<void> => {
    e.preventDefault();

    const isValid = await validateForm();
    if (!isValid) return;

    setIsLoading(true);
    setLoginError('');

    try {
      const result = await signIn({
        email: formData.email,
        password: formData.password
      });

      onLoginSuccess?.(result);

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed. Please try again.';
      setLoginError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = (): void => {
    onForgotPassword?.();
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
      style={{ backgroundColor: theme.background }}
    >
      <div className="max-w-md w-full space-y-8 bg-white rounded-2xl shadow-2xl p-8">
        {/* Header */}
        <div className="text-center">
          <img
            src={LOGO} // Replace with your actual logo path
            alt="Logo"
            className="mx-auto h-36 w-36 object-contain mb-4"
            onError={(e) => {
              // Fallback if logo fails to load
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
            }}
          />

          {/* Fallback logo if image fails */}
          <div
            className="mx-auto h-16 w-16 flex items-center justify-center rounded-full mb-6"
            style={{
              backgroundColor: theme.semiTransparent,
              border: `2px solid ${theme.primary}`,
              display: 'none'
            }}
            id="fallback-logo"
          >
            <Shield className="h-8 w-8" style={{ color: theme.secondary }} />
          </div>

          <h2 className="text-3xl font-bold mb-2 text-gray-800">
            Admin Portal
          </h2>
          <p className="text-base text-gray-600">
            Enter your credentials to access the dashboard
          </p>

          {/* Arabic greeting */}
          <div className="mt-4 p-3 rounded-lg bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200">
            <p className="text-lg font-semibold" style={{ color: theme.secondary }}>
              السلام عليكم
            </p>
            <p className="text-sm text-gray-600">
              Peace be upon you
            </p>
          </div>
        </div>

        {/* Login Form */}
        <div className="mt-8 space-y-6">
          <div className="space-y-4">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2 text-gray-700">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`appearance-none relative block w-full pl-10 pr-3 py-3 border-2 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200 bg-gray-50 text-gray-900 ${errors.email
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500/50'
                    : `border-gray-300 hover:border-gray-400 focus:border-yellow-500 focus:ring-yellow-500/50`
                    }`}
                  placeholder="Enter your email"
                  disabled={isLoading}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2 text-gray-700">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`appearance-none relative block w-full pl-10 pr-12 py-3 border-2 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200 bg-gray-50 text-gray-900 ${errors.password
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500/50'
                    : `border-gray-300 hover:border-gray-400 focus:border-yellow-500 focus:ring-yellow-500/50`
                    }`}
                  placeholder="Enter your password"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center hover:opacity-80 transition-opacity"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">{errors.password}</p>
              )}
            </div>
          </div>

          {/* Forgot Password Link */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-sm font-medium hover:underline transition-colors"
              style={{ color: theme.secondary }}
              disabled={isLoading}
            >
              Forgot your password?
            </button>
          </div>

          {/* Login Error */}
          {loginError && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
              <p className="text-sm text-red-500 text-center">{loginError}</p>
            </div>
          )}

          {/* Submit Button */}
          <div>
            <button
              type="button"
              disabled={isLoading}
              onClick={handleSubmit}
              className={`w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 ${isLoading
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:opacity-90 hover:scale-[1.02] transform'
                }`}
              style={{ backgroundColor: theme.secondary }}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Signing in...
                </div>
              ) : (
                <div className="flex items-center">
                  <Shield className="h-4 w-4 mr-2" />
                  Sign in to Dashboard
                </div>
              )}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            Protected by advanced security measures
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;