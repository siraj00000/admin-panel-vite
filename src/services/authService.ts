import axios from 'axios';
import { APP_CONFIG } from '../utils/constants';
import type { Admin, ApiSuccessResponse, ErrorResponse, LoginResponse, Session } from '../types/apiTypes';
const BASE_URL = APP_CONFIG.API_BASE_URL;


// Login function
export async function signIn({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<Session> {
  try {
    const response = await axios.post<LoginResponse>(`${BASE_URL}/admin/login`, {
      email,
      password,
    });

    const data = response.data;

    if (!data.success) {
      throw new Error(data.message || 'Login failed');
    }

    // Store token in localStorage for persistence
    localStorage.setItem('authToken', data.data.token);
    localStorage.setItem('adminData', JSON.stringify(data.data.admin));

    return {
      token: data.data.token,
      admin: data.data.admin,
    };
  } catch (err) {
    const error = err as ErrorResponse;
    const message = error.response?.data?.message || 
                   error.response?.data?.error ||
                   'Login failed. Please try again.';
    throw new Error(message);
  }
}

// Forgot Password function
export async function forgotPassword({
  email,
}: {
  email: string;
}): Promise<ApiSuccessResponse> {
  try {
    const response = await axios.post<ApiSuccessResponse>(`${BASE_URL}/admin/forgot-password`, {
      email,
    });

    const data = response.data;

    if (!data.success) {
      throw new Error(data.message || 'Failed to send reset email');
    }

    return data;
  } catch (err) {
    const error = err as ErrorResponse;
    const message = error.response?.data?.message || 
                   error.response?.data?.error ||
                   'Failed to send reset email. Please try again.';
    throw new Error(message);
  }
}

// Reset Password function
export async function resetPassword({
  token,
  newPassword,
}: {
  token: string;
  newPassword: string;
}): Promise<void> {
  try {
    const response = await axios.post<ApiSuccessResponse>(`${BASE_URL}/admin/reset-password`, {
      token,
      newPassword,
    });

    const data = response.data;

    if (!data.success) {
      throw new Error(data.message || 'Failed to reset password');
    }

    return;
  } catch (err) {
    const error = err as ErrorResponse;
    const message = error.response?.data?.message || 
                   error.response?.data?.error ||
                   'Failed to reset password. Please try again.';
    throw new Error(message);
  }
}

// Verify Reset Token function
export async function verifyResetToken({
  token,
}: {
  token: string;
}): Promise<boolean> {
  try {
    const response = await axios.post<ApiSuccessResponse>(`${BASE_URL}/admin/verify-reset-token`, {
      token,
    });

    const data = response.data;
    return data.success;
  } catch (err) {
    return false;
  }
}

// Change Password function (for authenticated users)
export async function changePassword({
  currentPassword,
  newPassword,
}: {
  currentPassword: string;
  newPassword: string;
}): Promise<void> {
  try {
    const response = await axios.post<ApiSuccessResponse>(`${BASE_URL}/admin/change-password`, {
      currentPassword,
      newPassword,
    });

    const data = response.data;

    if (!data.success) {
      throw new Error(data.message || 'Failed to change password');
    }

    return;
  } catch (err) {
    const error = err as ErrorResponse;
    const message = error.response?.data?.message || 
                   error.response?.data?.error ||
                   'Failed to change password. Please try again.';
    throw new Error(message);
  }
}

// Refresh Token function
export async function refreshToken(): Promise<Session> {
  try {
    const currentToken = localStorage.getItem('authToken');
    
    if (!currentToken) {
      throw new Error('No token available');
    }

    const response = await axios.post<LoginResponse>(`${BASE_URL}/admin/refresh-token`, {}, {
      headers: {
        Authorization: `Bearer ${currentToken}`,
      },
    });

    const data = response.data;

    if (!data.success) {
      throw new Error(data.message || 'Failed to refresh token');
    }

    // Update stored token
    localStorage.setItem('authToken', data.data.token);
    localStorage.setItem('adminData', JSON.stringify(data.data.admin));

    return {
      token: data.data.token,
      admin: data.data.admin,
    };
  } catch (err) {
    // If refresh fails, logout user
    signOut();
    throw new Error('Session expired. Please login again.');
  }
}

// Logout function
export async function signOut(): Promise<void> {
  // try {
  //   // Optional: Call backend logout endpoint if you have one
  //   const token = localStorage.getItem('authToken');
  //   if (token) {
  //     await axios.post<ApiSuccessResponse>(`${BASE_URL}/admin/logout`, {}, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });
  //   }
  // } catch (err) {
  //   // Continue with logout even if backend call fails
  //   console.warn('Logout request failed:', err);
  // } finally {
  //   // Always clear local storage
  // }
  localStorage.removeItem('authToken');
  localStorage.removeItem('adminData');

  setTimeout(() => {
    window.location.href = '/login';
  }, 1000); 
}

// Get current session from localStorage
export function getCurrentSession(): Session | null {
  try {
    const token = localStorage.getItem('authToken');
    const adminData = localStorage.getItem('adminData');

    if (!token || !adminData) {
      return null;
    }

    return {
      token,
      admin: JSON.parse(adminData),
    };
  } catch (err) {
    console.error('Failed to get current session:', err);
    // Clear corrupted data
    localStorage.removeItem('authToken');
    localStorage.removeItem('adminData');
    return null;
  }
}

// Check if user is authenticated
export function isAuthenticated(): boolean {
  const session = getCurrentSession();
  return !!session?.token;
}

// Get auth token for API requests
export function getAuthToken(): string | null {
  return localStorage.getItem('authToken');
}

// Get current admin data
export function getCurrentAdmin(): Admin | null {
  const session = getCurrentSession();
  return session?.admin || null;
}

// Update admin profile
export async function updateProfile({
  username,
  email,
}: {
  username?: string;
  email?: string;
}): Promise<Admin> {
  try {
    const response = await axios.put<{
      success: boolean;
      message: string;
      data: { admin: Admin };
    }>(`${BASE_URL}/admin/profile`, {
      username,
      email,
    });

    const data = response.data;

    if (!data.success) {
      throw new Error(data.message || 'Failed to update profile');
    }

    // Update stored admin data
    localStorage.setItem('adminData', JSON.stringify(data.data.admin));

    return data.data.admin;
  } catch (err) {
    const error = err as ErrorResponse;
    const message = error.response?.data?.message || 
                   error.response?.data?.error ||
                   'Failed to update profile. Please try again.';
    throw new Error(message);
  }
}

// Verify current session with backend
export async function verifySession(): Promise<boolean> {
  try {
    const token = getAuthToken();
    if (!token) {
      return false;
    }

    const response = await axios.get<ApiSuccessResponse>(`${BASE_URL}/admin/verify`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data.success;
  } catch (err) {
    // If verification fails, clear session
    signOut();
    return false;
  }
}

// Axios interceptor to add auth token to requests
export function setupAxiosInterceptors(): void {
  // Request interceptor to add auth token
  axios.interceptors.request.use(
    (config) => {
      const token = getAuthToken();
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor to handle auth errors
  axios.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      // Handle 401 errors (unauthorized)
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          // Try to refresh token
          await refreshToken();
          
          // Retry the original request with new token
          const token = getAuthToken();
          if (token && originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${token}`;
          }
          
          return axios(originalRequest);
        } catch (refreshError) {
          // Refresh failed, logout user
          signOut();
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      }

      // Handle 403 errors (forbidden)
      if (error.response?.status === 403) {
        console.error('Access forbidden. Insufficient permissions.');
        // You might want to show a forbidden page or redirect
      }

      return Promise.reject(error);
    }
  );
}

// Initialize auth service (call this once in your app)
export function initializeAuth(): void {
  setupAxiosInterceptors();
  
  // Optionally verify session on app start
  if (isAuthenticated()) {
    // verifySession().catch(() => {
    //   console.warn('Session verification failed on app start');
    // });
  }
}

// Clear all auth data (useful for testing or forced logout)
export function clearAuthData(): void {
  localStorage.removeItem('authToken');
  localStorage.removeItem('adminData');
}

// Export types for use in components
export type { Session, Admin, LoginResponse, ApiSuccessResponse };