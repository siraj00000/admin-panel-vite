import axios from 'axios';
import type { Announcement, ApiResponse, Business, ErrorResponse, Library, Program, SimpleResponse } from '../types/apiTypes';
import { APP_CONFIG } from '../utils/constants';
const BASE_URL = APP_CONFIG.API_BASE_URL;

export const announcementService = {
  create: async (data: FormData | Omit<Announcement, '_id' | 'createdAt' | 'updatedAt'>): Promise<Announcement> => {
    try {
      const response = await axios.post<ApiResponse<Announcement>>(`${BASE_URL}/announcements`, data, {
        headers: data instanceof FormData ? {} : { 'Content-Type': 'application/json' }
      });

      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to create announcement');
      }

      return response.data.data!;
    } catch (err) {
      const error = err as ErrorResponse;
      const message = error.response?.data?.message || 'Failed to create announcement';
      throw new Error(message);
    }
  },

  getAll: async (params: {
    search?: string;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  } = {}): Promise<SimpleResponse<Announcement>> => {
    try {
      const {
        search = '',
        limit = 100,
        sortBy = 'createdAt',
        sortOrder = 'desc'
      } = params;

      const queryParams = new URLSearchParams();
      if (search) queryParams.append('search', search);
      if (limit) queryParams.append('limit', limit.toString());
      if (sortBy) queryParams.append('sortBy', sortBy);
      if (sortOrder) queryParams.append('sortOrder', sortOrder);

      const response = await axios.get<SimpleResponse<Announcement>>(
        `${BASE_URL}/announcements?${queryParams.toString()}`
      );

      return response.data;
    } catch (err) {
      const error = err as ErrorResponse;
      const message = error.response?.data?.message || 'Failed to fetch announcements';
      throw new Error(message);
    }
  },

  getTodayLast: async (): Promise<Announcement | null> => {
    try {
      const response = await axios.get<ApiResponse<Announcement>>(`${BASE_URL}/announcements/today/last`);
      return response.data.data || null;
    } catch (err) {
      return null;
    }
  },

  update: async (id: string, data: FormData | Partial<Announcement>): Promise<Announcement> => {
    try {
      const response = await axios.patch<ApiResponse<Announcement>>(`${BASE_URL}/announcements/${id}`, data, {
        headers: data instanceof FormData ? {} : { 'Content-Type': 'application/json' }
      });

      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to update announcement');
      }

      return response.data.data!;
    } catch (err) {
      const error = err as ErrorResponse;
      const message = error.response?.data?.message || 'Failed to update announcement';
      throw new Error(message);
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      const response = await axios.delete<ApiResponse>(`${BASE_URL}/announcements/${id}`);

      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to delete announcement');
      }
    } catch (err) {
      const error = err as ErrorResponse;
      const message = error.response?.data?.message || 'Failed to delete announcement';
      throw new Error(message);
    }
  }
};

export const businessService = {
  create: async (data: FormData | Omit<Business, '_id' | 'createdAt' | 'updatedAt'>): Promise<Business> => {
    try {
      const response = await axios.post<ApiResponse<Business>>(`${BASE_URL}/businesses`, data, {
        headers: data instanceof FormData ? {} : { 'Content-Type': 'application/json' }
      });

      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to create business');
      }

      return response.data.data!;
    } catch (err) {
      const error = err as ErrorResponse;
      const message = error.response?.data?.message || 'Failed to create business';
      throw new Error(message);
    }
  },

  getAll: async (params: { search?: string; limit?: number } = {}): Promise<SimpleResponse<Business>> => {
    try {
      const { search = '', limit = 100 } = params;

      const queryParams = new URLSearchParams();
      if (search) queryParams.append('search', search);
      if (limit) queryParams.append('limit', limit.toString());

      const response = await axios.get<SimpleResponse<Business>>(
        `${BASE_URL}/businesses?${queryParams.toString()}`
      );
      return response.data;
    } catch (err) {
      const error = err as ErrorResponse;
      const message = error.response?.data?.message || 'Failed to fetch businesses';
      throw new Error(message);
    }
  },

  getByCategory: async (category: string): Promise<Business[]> => {
    try {
      const response = await axios.get<ApiResponse<Business[]>>(
        `${BASE_URL}/businesses/category?type=${category}`
      );
      return response.data.data || [];
    } catch (err) {
      const error = err as ErrorResponse;
      const message = error.response?.data?.message || 'Failed to fetch businesses by category';
      throw new Error(message);
    }
  },

  update: async (id: string, data: FormData | Partial<Business>): Promise<Business> => {
    try {
      const response = await axios.patch<ApiResponse<Business>>(`${BASE_URL}/businesses/${id}`, data, {
        headers: data instanceof FormData ? {} : { 'Content-Type': 'application/json' }
      });

      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to update business');
      }

      return response.data.data!;
    } catch (err) {
      const error = err as ErrorResponse;
      const message = error.response?.data?.message || 'Failed to update business';
      throw new Error(message);
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      const response = await axios.delete<ApiResponse>(`${BASE_URL}/businesses/${id}`);

      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to delete business');
      }
    } catch (err) {
      const error = err as ErrorResponse;
      const message = error.response?.data?.message || 'Failed to delete business';
      throw new Error(message);
    }
  }
};

export const libraryService = {
  // Create library item
  create: async (data: Omit<Library, '_id' | 'createdAt' | 'updatedAt'>): Promise<Library> => {
    try {
      const response = await axios.post<ApiResponse<Library>>(`${BASE_URL}/libraries`, data);

      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to create library item');
      }

      return response.data.data!;
    } catch (err) {
      const error = err as ErrorResponse;
      const message = error.response?.data?.message || 'Failed to create library item';
      throw new Error(message);
    }
  },

  // Get all library items - Simple version
  getAll: async (params: { search?: string; limit?: number } = {}): Promise<SimpleResponse<Library>> => {
    try {
      const { search = '', limit = 100 } = params;

      const queryParams = new URLSearchParams();
      if (search) queryParams.append('search', search);
      if (limit) queryParams.append('limit', limit.toString());

      const response = await axios.get<SimpleResponse<Library>>(
        `${BASE_URL}/libraries?${queryParams.toString()}`
      );
      return response.data;
    } catch (err) {
      const error = err as ErrorResponse;
      const message = error.response?.data?.message || 'Failed to fetch library items';
      throw new Error(message);
    }
  },

  // Update library item
  update: async (id: string, data: Partial<Library>): Promise<Library> => {
    try {
      const response = await axios.patch<ApiResponse<Library>>(`${BASE_URL}/libraries/${id}`, data);

      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to update library item');
      }

      return response.data.data!;
    } catch (err) {
      const error = err as ErrorResponse;
      const message = error.response?.data?.message || 'Failed to update library item';
      throw new Error(message);
    }
  },

  // Delete library item
  delete: async (id: string): Promise<void> => {
    try {
      const response = await axios.delete<ApiResponse>(`${BASE_URL}/libraries/${id}`);

      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to delete library item');
      }
    } catch (err) {
      const error = err as ErrorResponse;
      const message = error.response?.data?.message || 'Failed to delete library item';
      throw new Error(message);
    }
  }
};

export const programService = {
  // Create program
  create: async (data: Omit<Program, '_id' | 'createdAt' | 'updatedAt'>): Promise<Program> => {
    try {
      const response = await axios.post<ApiResponse<Program>>(`${BASE_URL}/programs`, data);

      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to create program');
      }

      return response.data.data!;
    } catch (err) {
      const error = err as ErrorResponse;
      const message = error.response?.data?.message || 'Failed to create program';
      throw new Error(message);
    }
  },

  // Get all programs - Simple version
  getAll: async (params: { search?: string; limit?: number } = {}): Promise<SimpleResponse<Program>> => {
    try {
      const { search = '', limit = 100 } = params;

      const queryParams = new URLSearchParams();
      if (search) queryParams.append('search', search);
      if (limit) queryParams.append('limit', limit.toString());

      const response = await axios.get<SimpleResponse<Program>>(
        `${BASE_URL}/programs?${queryParams.toString()}`
      );
      return response.data;
    } catch (err) {
      const error = err as ErrorResponse;
      const message = error.response?.data?.message || 'Failed to fetch programs';
      throw new Error(message);
    }
  },

  // Get daily program
  getDaily: async (): Promise<Program[]> => {
    try {
      const response = await axios.get<ApiResponse<Program[]>>(`${BASE_URL}/programs/daily`);
      return response.data.data || [];
    } catch (err) {
      const error = err as ErrorResponse;
      const message = error.response?.data?.message || 'Failed to fetch daily programs';
      throw new Error(message);
    }
  },

  // Update program
  update: async (id: string, data: Partial<Program>): Promise<Program> => {
    try {
      const response = await axios.patch<ApiResponse<Program>>(`${BASE_URL}/programs/${id}`, data);

      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to update program');
      }

      return response.data.data!;
    } catch (err) {
      const error = err as ErrorResponse;
      const message = error.response?.data?.message || 'Failed to update program';
      throw new Error(message);
    }
  },

  // Delete program
  delete: async (id: string): Promise<void> => {
    try {
      const response = await axios.delete<ApiResponse>(`${BASE_URL}/programs/${id}`);

      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to delete program');
      }
    } catch (err) {
      const error = err as ErrorResponse;
      const message = error.response?.data?.message || 'Failed to delete program';
      throw new Error(message);
    }
  }
};

export type { ApiResponse, SimpleResponse };