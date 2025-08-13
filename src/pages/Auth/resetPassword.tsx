import React, { useState } from 'react';
import { Eye, EyeOff, Lock, CheckCircle, ArrowLeft } from 'lucide-react';
import * as yup from 'yup';
import { theme } from '../../utils/constants';
import { resetPassword } from '../../services/authService';

interface FormData {
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  password?: string;
  confirmPassword?: string;
}

interface ResetPasswordPageProps {
  onBackToLogin?: () => void;
  token: string | null
}

// Validation schema
const resetPasswordSchema = yup.object().shape({
  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain uppercase, lowercase, and number')
    .required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Please confirm your password')
});

const ResetPasswordScreen: React.FC<ResetPasswordPageProps> = ({ onBackToLogin, token }) => {
  const [formData, setFormData] = useState<FormData>({
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isPasswordReset, setIsPasswordReset] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string>('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    if (submitError) {
      setSubmitError('');
    }
  };

  const validateForm = async (): Promise<boolean> => {
    try {
      await resetPasswordSchema.validate(formData, { abortEarly: false });
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
    setSubmitError('');

    try {
      await resetPassword({
        token: token || '',
        newPassword: formData.password
      });
      setIsPasswordReset(true);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to reset password';
      setSubmitError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = (): void => {
    onBackToLogin?.();
  };

  // Password strength indicator
  const getPasswordStrength = (password: string): { strength: number; label: string; color: string } => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z\d]/.test(password)) strength++;

    const strengthMap = [
      { label: 'Very Weak', color: 'bg-red-500' },
      { label: 'Weak', color: 'bg-orange-500' },
      { label: 'Fair', color: 'bg-yellow-500' },
      { label: 'Good', color: 'bg-blue-500' },
      { label: 'Strong', color: 'bg-green-500' }
    ];

    return {
      strength,
      label: strengthMap[strength - 1]?.label || 'Very Weak',
      color: strengthMap[strength - 1]?.color || 'bg-gray-300'
    };
  };

  const passwordStrength = getPasswordStrength(formData.password);

  if (isPasswordReset) {
    return (
      <div
        className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
        style={{ backgroundColor: theme.background }}
      >
        <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center">
            <div className="mx-auto h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>

            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              Password Reset Successfully
            </h2>

            <p className="text-gray-600 mb-8 leading-relaxed">
              Your password has been successfully reset. You can now log in with your new password.
            </p>

            <button
              onClick={handleBackToLogin}
              className="w-full flex justify-center items-center py-3 px-4 rounded-lg text-sm font-medium text-white transition-all duration-200 hover:opacity-90 hover:scale-[1.02] transform"
              style={{ backgroundColor: theme.secondary }}
            >
              Continue to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
      style={{ backgroundColor: theme.background }}
    >
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2 text-gray-800">
            Reset Password
          </h2>
          <p className="text-base text-gray-600">
            Enter your new password below
          </p>
        </div>

        {/* Form */}
        <div className="space-y-6">
          {/* New Password Field */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-2 text-gray-700">
              New Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleInputChange}
                className={`appearance-none relative block w-full pl-10 pr-12 py-3 border-2 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200 bg-gray-50 text-gray-900 ${errors.password
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500/50'
                  : `border-gray-300 hover:border-gray-400 focus:border-yellow-500 focus:ring-yellow-500/50`
                  }`}
                placeholder="Enter new password"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center hover:opacity-80 transition-opacity"
                onClick={() => setShowPassword(!showPassword)}
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

            {/* Password Strength Indicator */}
            {formData.password && (
              <div className="mt-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-600">Password Strength</span>
                  <span className="text-xs font-medium text-gray-700">{passwordStrength.label}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                    style={{ width: `${(passwordStrength.strength / 5) * 100}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>

          {/* Confirm Password Field */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2 text-gray-700">
              Confirm New Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className={`appearance-none relative block w-full pl-10 pr-12 py-3 border-2 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200 bg-gray-50 text-gray-900 ${errors.confirmPassword
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500/50'
                  : `border-gray-300 hover:border-gray-400 focus:border-yellow-500 focus:ring-yellow-500/50`
                  }`}
                placeholder="Confirm new password"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center hover:opacity-80 transition-opacity"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>
            )}
          </div>

          {/* Password Requirements */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm font-medium text-gray-700 mb-2">Password Requirements:</p>
            <ul className="text-xs text-gray-600 space-y-1">
              <li className={`flex items-center ${formData.password.length >= 8 ? 'text-green-600' : ''}`}>
                <span className="mr-2">{formData.password.length >= 8 ? '✓' : '•'}</span>
                At least 8 characters long
              </li>
              <li className={`flex items-center ${/[A-Z]/.test(formData.password) ? 'text-green-600' : ''}`}>
                <span className="mr-2">{/[A-Z]/.test(formData.password) ? '✓' : '•'}</span>
                One uppercase letter
              </li>
              <li className={`flex items-center ${/[a-z]/.test(formData.password) ? 'text-green-600' : ''}`}>
                <span className="mr-2">{/[a-z]/.test(formData.password) ? '✓' : '•'}</span>
                One lowercase letter
              </li>
              <li className={`flex items-center ${/\d/.test(formData.password) ? 'text-green-600' : ''}`}>
                <span className="mr-2">{/\d/.test(formData.password) ? '✓' : '•'}</span>
                One number
              </li>
            </ul>
          </div>

          {/* Submit Error */}
          {submitError && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
              <p className="text-sm text-red-500 text-center">{submitError}</p>
            </div>
          )}

          {/* Submit Button */}
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
                Resetting Password...
              </div>
            ) : (
              'Reset Password'
            )}
          </button>

          {/* Back to Login */}
          <button
            onClick={handleBackToLogin}
            className="w-full flex justify-center items-center py-2 px-4 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors duration-200"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordScreen;