// web/src/lib/constants.ts
export const API_ENDPOINTS = {
    AUTH: {
        LOGIN: '/auth/login',
        REGISTER: '/auth/register',
        PROFILE: '/auth/profile',
        LOGOUT: '/auth/logout',
    },
    HEALTH: '/health',
} as const;

export const STORAGE_KEYS = {
    TOKEN: 'token',
    REFRESH_TOKEN: 'refresh_token',
    USER_PREFERENCES: 'user_preferences',
} as const;

export const APP_CONFIG = {
    NAME: process.env.NEXT_PUBLIC_APP_NAME || 'GoSwift',
    VERSION: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
    API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1',
} as const;

export const ROUTES = {
    HOME: '/',
    LOGIN: '/login',
    REGISTER: '/register',
    DASHBOARD: '/dashboard',
    CHAT: '/dashboard/chat',
    PROFILE: '/dashboard/profile',
    SETTINGS: '/dashboard/settings',
} as const;

// web/src/types/api.ts
export interface ApiError {
    error: string;
    code?: string;
    details?: any;
}

export interface ApiResponse<T> {
    data: T;
    message?: string;
}
