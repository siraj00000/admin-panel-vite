export interface ApiResponse<T = any> {
    success: boolean;
    message: string;
    data?: T;
    error?: string;
}

export interface SimpleResponse<T> {
    success: boolean;
    message: string;
    data: {
        items: T[];
        total: number;
        hasSearch?: boolean;
    };
}

export interface StatsApiResponse<T> {
    success: boolean;
    message: string;
    data: T
}

export interface ErrorResponse {
    response?: {
        data: ApiResponse
    };
}

// ============================================================================
// ANNOUNCEMENT SERVICES
// ============================================================================

export interface Announcement {
    _id?: string;
    title: string;
    hijri_date: string;
    georgian_date: string;
    description?: string;
    images?: string[];
    createdAt?: string;
    updatedAt?: string;
}

export interface Admin {
    username: string;
    email: string;
    role: string;
}

export interface LoginResponse {
    success: boolean;
    message: string;
    data: {
        token: string;
        admin: Admin;
    };
}

export interface ApiSuccessResponse {
    success: boolean;
    message: string;
    data?: any;
}

export interface ApiErrorResponse {
    success: boolean;
    message: string;
    error?: string;
}

export interface Session {
    token: string;
    admin: Admin;
}

export interface Business {
    _id?: string;
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
    createdAt?: string;
    updatedAt?: string;
}

export interface Library {
    _id?: string;
    title: string;
    description?: string;
    email?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface Program {
    _id?: string;
    title: string;
    hijri_date: string;
    georgian_date: string;
    description?: string;
    speaker?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface Stats {
    users: number;
    businesses: number;
    liberaries: number;
    programs: number;
}

export interface Bank {
    _id?: string;
    bank_name: string;
    account_title: string;
    account_number: string;
    createdAt?: string;
    updatedAt?: string;
}