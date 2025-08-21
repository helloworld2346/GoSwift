const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    email: string;
    password: string;
    display_name: string;
}

export interface AuthResponse {
    token: string;
    user: {
        id: string;
        email: string;
        display_name: string;
        avatar_url: string;
        is_online: boolean;
        last_seen: string;
        created_at: string;
    };
}

export interface UserResponse {
    id: string;
    email: string;
    display_name: string;
    avatar_url: string;
    is_online: boolean;
    last_seen: string;
    created_at: string;
}

class ApiClient {
    private baseURL: string;
    private retryAttempts = 3;
    private retryDelay = 1000;

    constructor() {
        this.baseURL = API_BASE_URL;
    }

    private async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<T> {
        const url = `${this.baseURL}${endpoint}`;

        const config: RequestInit = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
            ...options,
        };

        // Add auth token if available
        if (typeof window !== 'undefined') {
            // Try to get token from Zustand store first, then localStorage as fallback
            let token = null;
            try {
                // Import here to avoid SSR issues
                const { useAuthStore } = require('@/stores/auth');
                token = useAuthStore.getState().token;
            } catch (error) {
                // Fallback to localStorage
                token = localStorage.getItem('token');
            }

            if (token) {
                config.headers = {
                    ...config.headers,
                    'Authorization': `Bearer ${token}`,
                };
            }
        }

        const response = await fetch(url, config);

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));

            // Custom error messages for space theme
            let customMessage = errorData.error || `HTTP error! status: ${response.status}`;

            // Transform common error messages to space theme
            if (customMessage.includes('Invalid email or password') ||
                customMessage.includes('invalid credentials') ||
                customMessage.includes('authentication failed')) {
                customMessage = 'Oops! Your cosmic credentials seem to be lost in space. Please try again!';
            } else if (customMessage.includes('email already exists') ||
                customMessage.includes('duplicate email')) {
                customMessage = 'This cosmic traveler already exists in our universe! Try a different email.';
            } else if (customMessage.includes('password') && customMessage.includes('weak')) {
                customMessage = 'Your password needs more cosmic strength! Add uppercase, lowercase, numbers, and special characters.';
            } else if (customMessage.includes('email') && customMessage.includes('invalid')) {
                customMessage = 'Please enter a valid cosmic email address!';
            } else if (customMessage.includes('display_name') && customMessage.includes('invalid')) {
                customMessage = 'Your display name contains forbidden cosmic symbols! Use only letters, numbers, spaces, hyphens, and underscores.';
            }

            throw new Error(customMessage);
        }

        return response.json();
    }

    private async requestWithRetry<T>(
        endpoint: string,
        options: RequestInit = {},
        retryCount = 0
    ): Promise<T> {
        try {
            return await this.request<T>(endpoint, options);
        } catch (error) {
            if (retryCount < this.retryAttempts && this.isRetryableError(error)) {
                await this.delay(this.retryDelay * Math.pow(2, retryCount));
                return this.requestWithRetry<T>(endpoint, options, retryCount + 1);
            }
            throw error;
        }
    }

    private isRetryableError(error: any): boolean {
        return error.message.includes('500') ||
            error.message.includes('502') ||
            error.message.includes('503') ||
            error.message.includes('network');
    }

    private delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Auth endpoints
    async login(data: LoginRequest): Promise<AuthResponse> {
        return this.requestWithRetry<AuthResponse>('/auth/login', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async register(data: RegisterRequest): Promise<UserResponse> {
        return this.request<UserResponse>('/auth/register', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async getProfile(): Promise<UserResponse> {
        return this.request<UserResponse>('/auth/profile');
    }

    async logout(): Promise<{ message: string }> {
        return this.request<{ message: string }>('/auth/logout', {
            method: 'POST',
        });
    }

    // Health check
    async healthCheck(): Promise<any> {
        return this.request('/health');
    }
}

export const apiClient = new ApiClient();
