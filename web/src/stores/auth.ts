import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { apiClient, type AuthResponse, type UserResponse } from '@/lib/api';

interface User {
    id: string;
    email: string;
    display_name: string;
    avatar_url: string;
    is_online: boolean;
    last_seen: string;
    created_at: string;
}

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
    isInitialized: boolean; // Track if initial auth check is done
    refreshToken: string | null;
    isLoggingOut: boolean; // Track logout state to prevent race conditions

    // Actions
    login: (email: string, password: string) => Promise<boolean>;
    register: (email: string, password: string, display_name: string) => Promise<UserResponse | null>;
    logout: () => Promise<void>;
    getProfile: () => Promise<void>;
    clearError: () => void;
    setLoading: (loading: boolean) => void;
    initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
            isInitialized: false,
            refreshToken: null,
            isLoggingOut: false,

            setLoading: (loading) => set({ isLoading: loading }),

            clearError: () => set({ error: null }),

            initialize: async () => {
                const { token, isLoggingOut } = get();

                // Don't initialize if currently logging out
                if (isLoggingOut) {
                    set({ isInitialized: true });
                    return;
                }

                if (token) {
                    try {
                        await get().getProfile();
                    } catch (error) {
                        // Token is invalid, clear it
                        localStorage.removeItem('token');
                        set({
                            user: null,
                            token: null,
                            isAuthenticated: false,
                        });
                    }
                }
                set({ isInitialized: true });
            },

            login: async (email: string, password: string) => {
                try {
                    set({ isLoading: true, error: null });

                    const response: AuthResponse = await apiClient.login({ email, password });

                    set({
                        user: response.user,
                        token: response.token,
                        isAuthenticated: true,
                        isLoading: false,
                        error: null,
                    });

                    return true; // Return boolean instead of response
                } catch (error) {
                    const errorMessage = error instanceof Error ? error.message : 'Login failed';
                    set({
                        isLoading: false,
                        error: errorMessage,
                    });

                    return false; // Return false on error
                }
            },

            register: async (email: string, password: string, display_name: string) => {
                try {
                    set({ isLoading: true, error: null });

                    const user = await apiClient.register({ email, password, display_name });

                    set({
                        isLoading: false,
                        error: null,
                    });

                    return user; // Return user data
                } catch (error) {
                    set({
                        isLoading: false,
                        error: error instanceof Error ? error.message : 'Registration failed',
                    });

                    // Throw error instead of returning null
                    throw error;
                }
            },

            logout: async () => {
                // Prevent multiple logout calls
                if (get().isLoggingOut) {
                    return;
                }

                try {
                    set({ isLoading: true, isLoggingOut: true });

                    // Get current token before clearing state
                    const currentToken = get().token;

                    if (currentToken) {
                        try {
                            await apiClient.logout(currentToken);
                        } catch (error) {
                            console.error('Logout API error:', error);
                        }
                    }
                } catch (error) {
                    console.error('Logout error:', error);
                } finally {
                    set({
                        user: null,
                        token: null,
                        isAuthenticated: false,
                        isLoading: false,
                        error: null,
                        isLoggingOut: false,
                    });
                }
            },

            getProfile: async () => {
                try {
                    set({ isLoading: true, error: null });

                    const user = await apiClient.getProfile();

                    set({
                        user,
                        isAuthenticated: true,
                        isLoading: false,
                        error: null,
                    });
                } catch (error) {
                    set({
                        isLoading: false,
                        error: error instanceof Error ? error.message : 'Failed to get profile',
                    });

                    // If profile fetch fails, user might be logged out
                    if (error instanceof Error && error.message.includes('401')) {
                        set({
                            user: null,
                            token: null,
                            isAuthenticated: false,
                        });
                    }
                }
            },
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({
                token: state.token,
                user: state.user,
                isAuthenticated: state.isAuthenticated,
            }),
            // Add version for migrations
            version: 1,
        }
    )
);
