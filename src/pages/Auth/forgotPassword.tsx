import React, { useState } from 'react';
import { ArrowLeft, Mail } from 'lucide-react';
import * as yup from 'yup';
import { theme } from '../../utils/constants';
import { forgotPassword } from '../../services/authService';

interface FormData {
  email: string;
}

interface FormErrors {
  email?: string;
}

interface ForgotPasswordPageProps {
  onBackToLogin?: () => void;
  onSentSuccess?: (token: string) => void;
}

const forgotPasswordSchema = yup.object().shape({
  email: yup
    .string()
    .email('Please enter a valid email address')
    .required('Email is required')
});

const ForgotPasswordScreen: React.FC<ForgotPasswordPageProps> = ({
  onBackToLogin,
  onSentSuccess
}) => {
  const [formData, setFormData] = useState<FormData>({ email: '' });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string>('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { value } = e.target;
    setFormData({ email: value });

    if (errors.email) {
      setErrors({});
    }

    if (submitError) {
      setSubmitError('');
    }
  };

  const validateForm = async (): Promise<boolean> => {
    try {
      await forgotPasswordSchema.validate(formData, { abortEarly: false });
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
      const result = await forgotPassword({ email: formData.email });
      if (result.success) {
        onSentSuccess?.(result.data.resetToken);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to send reset email';
      setSubmitError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = (): void => {
    onBackToLogin?.()
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
      style={{ backgroundColor: theme.background }}
    >
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2 text-gray-800">
            Forgot Password?
          </h2>
          <p className="text-base text-gray-600">
            No worries, we'll send you reset instructions
          </p>
        </div>

        {/* Form */}
        <div className="space-y-6">
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
                placeholder="Enter your email address"
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email}</p>
            )}
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
                Sending Reset Link...
              </div>
            ) : (
              'Send Reset Link'
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

export default ForgotPasswordScreen;