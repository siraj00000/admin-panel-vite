// src/schemas/validationSchemas.ts
import * as yup from 'yup';

// ============================================================================
// ANNOUNCEMENT SCHEMA
// ============================================================================
export const announcementSchema = yup.object().shape({
  title: yup.string()
    .required('Title is required')
    .max(200, 'Title must be less than 200 characters'),
  
  hijri_date: yup.string()
    .optional(),
  
  georgian_date: yup.string()
    .required('Georgian date is required'),
  
  description: yup.string()
    .max(1000, 'Description must be less than 1000 characters')
    .optional(),
  
  images: yup.array()
    .of(yup.string().url('Invalid image URL'))
    .optional()
});

export interface AnnouncementFormData {
  title: string;
  hijri_date: string;
  georgian_date: string;
  description?: string;
  images?: string[];
}

// ============================================================================
// PROGRAM SCHEMA
// ============================================================================
export const programSchema = yup.object().shape({
  title: yup.string()
    .required('Title is required')
    .max(200, 'Title must be less than 200 characters'),
  
  hijri_date: yup.string()
    .optional(),
  
  georgian_date: yup.string()
    .required('Georgian date is required'),
  
  description: yup.string()
    .max(1000, 'Description must be less than 1000 characters')
    .optional(),
  
  speaker: yup.string()
    .max(100, 'Speaker name must be less than 100 characters')
    .optional()
});

export interface ProgramFormData {
  title: string;
  hijri_date: string;
  georgian_date: string;
  description?: string;
  speaker?: string;
}

// ============================================================================
// BUSINESS SCHEMA
// ============================================================================
export const businessSchema = yup.object().shape({
  title: yup.string()
    .required('Business title is required')
    .max(200, 'Title must be less than 200 characters'),
  
  business_type: yup.string()
    .max(100, 'Business type must be less than 100 characters')
    .required('Business type is required'),
  
  business_detail: yup.string()
    .max(500, 'Business detail must be less than 500 characters')
    .optional(),
  
  address: yup.string()
    .max(300, 'Address must be less than 300 characters')
    .optional(),
  
  contact_person: yup.string()
    .max(100, 'Contact person name must be less than 100 characters')
    .optional(),
  
  services: yup.array()
    .of(yup.string())
    .optional(),
  
  phone_number: yup.string()
    .matches(/^[\+]?[1-9][\d]{0,15}$/, 'Invalid phone number format')
    .optional(),
  
  email: yup.string()
    .email('Invalid email format')
    .optional(),
  
  website: yup.string()
    .url('Invalid website URL')
    .optional(),
  
  fb_id: yup.string()
    .max(100, 'Facebook ID must be less than 100 characters')
    .optional(),
  
  insta_id: yup.string()
    .max(100, 'Instagram ID must be less than 100 characters')
    .optional(),
  
  portfolio_images: yup.array()
    .of(yup.string().url('Invalid image URL'))
    .optional()
});

export interface BusinessFormData {
  title: string;
  business_type?: string;
  business_detail?: string;
  address?: string;
  contact_person?: string;
  services?: string[];
  phone_number?: string;
  email?: string;
  website?: string;
  fb_id?: string;
  insta_id?: string;
  portfolio_images?: string[];
}

// ============================================================================
// LIBRARY SCHEMA
// ============================================================================
export const librarySchema = yup.object().shape({
  title: yup.string()
    .required('Title is required')
    .max(200, 'Title must be less than 200 characters'),
  
  description: yup.string()
    .max(1000, 'Description must be less than 1000 characters')
    .optional(),
  
  email: yup.string()
    .email('Invalid email format')
    .optional()
});

export interface LibraryFormData {
  title: string;
  description?: string;
  email?: string;
}

// ============================================================================
// VALIDATION UTILITIES
// ============================================================================

// Date validation helpers
export const dateValidation = {
  hijriDate: (date: string) => {
    // Basic hijri date validation (you can make this more sophisticated)
    const hijriRegex = /^\d{1,2}\/\d{1,2}\/\d{4}$/;
    return hijriRegex.test(date);
  },
  
  georgianDate: (date: string) => {
    // Validate georgian date format
    const dateObj = new Date(date);
    return !isNaN(dateObj.getTime());
  }
};

// Image validation helpers
export const imageValidation = {
  isValidUrl: (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  },
  
  isImageUrl: (url: string) => {
    const imageExtensions = /\.(jpg|jpeg|png|gif|webp|svg)$/i;
    return imageExtensions.test(url);
  }
};

// Phone number validation helpers
export const phoneValidation = {
  international: /^[\+]?[1-9][\d]{0,15}$/,
  pakistan: /^(\+92|0)?[1-9]\d{9}$/,
  
  formatPakistan: (phone: string) => {
    // Remove all non-digits
    const cleaned = phone.replace(/\D/g, '');
    
    // Add Pakistan country code if needed
    if (cleaned.length === 10 && cleaned.startsWith('3')) {
      return '+92' + cleaned;
    }
    
    return phone;
  }
};

// Helper function to validate form with Yup
export const validateFormWithYup = async <T>(
  schema: yup.ObjectSchema<any>, 
  data: T
): Promise<{ isValid: boolean; errors: Record<string, string> }> => {
  try {
    await schema.validate(data, { abortEarly: false });
    return { isValid: true, errors: {} };
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      const errors: Record<string, string> = {};
      error.inner.forEach(err => {
        if (err.path) {
          errors[err.path] = err.message;
        }
      });
      return { isValid: false, errors };
    }
    return { isValid: false, errors: { general: 'Validation failed' } };
  }
};

// Export validation schemas for specific operations
export const createAnnouncementSchema = announcementSchema;
export const updateAnnouncementSchema = announcementSchema.clone().shape({
  title: yup.string().optional(),
  hijri_date: yup.string().optional(),
  georgian_date: yup.string().optional()
});

export const createProgramSchema = programSchema;
export const updateProgramSchema = programSchema.clone().shape({
  title: yup.string().optional(),
  hijri_date: yup.string().optional(),
  georgian_date: yup.string().optional()
});

export const createBusinessSchema = businessSchema;
export const updateBusinessSchema = businessSchema.clone().shape({
  title: yup.string().optional()
});

export const createLibrarySchema = librarySchema;
export const updateLibrarySchema = librarySchema.clone().shape({
  title: yup.string().optional()
});

// ============================================================================
// VALIDATION BANK
// ============================================================================

export const bankSchema = yup.object().shape({
  bank_name: yup.string()
    .required('Bank name is required')
    .max(200, 'Bank name must be less than 200 characters'),

  account_title: yup.string()
    .required('Account title is required')
    .max(200, 'Account title must be less than 200 characters'),

  account_number: yup.string()
    .required('Account number is required')
    .matches(/^[0-9]+$/, 'Account number must contain only digits')
    .min(8, 'Account number must be at least 8 digits')
    .max(20, 'Account number must be less than 20 digits'),
});

export interface BankFormData {
  bank_name: string;
  account_title: string;
  account_number: string;
}