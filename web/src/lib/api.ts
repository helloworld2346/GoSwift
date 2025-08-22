import type { Conversation, Message } from "@/types/chat";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  display_name: string;
}

export interface CreateConversationRequest {
  name: string;
  type: "direct" | "group";
  user_ids: string[];
}

export interface SendMessageRequest {
  conversation_id: string;
  content: string;
  message_type: "text" | "image" | "file";
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

export interface SearchUserResponse {
  id: string;
  email: string;
  display_name: string;
  avatar_url: string;
  is_online: boolean;
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
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    };

    // Add auth token if available
    if (typeof window !== "undefined") {
      // Try to get token from Zustand store first, then localStorage as fallback
      let token: string | null = null;
      try {
        // Dynamic import to avoid SSR issues
        const { useAuthStore } = await import("@/stores/auth");
        token = useAuthStore.getState().token;
      } catch {
        // Fallback to localStorage
        token = localStorage.getItem("token");
      }

      if (token) {
        config.headers = {
          ...config.headers,
          Authorization: `Bearer ${token}`,
        };
      }
    }

    const response = await fetch(url, config);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));

      // Custom error messages for space theme
      const customMessage = this.getCustomErrorMessage(
        errorData.error || `HTTP error! status: ${response.status}`
      );

      throw new Error(customMessage);
    }

    return response.json();
  }

  private getCustomErrorMessage(message: string): string {
    // Transform common error messages to space theme
    if (
      message.includes("Invalid email or password") ||
      message.includes("invalid credentials") ||
      message.includes("authentication failed")
    ) {
      return "Oops! Your cosmic credentials seem to be lost in space. Please try again!";
    } else if (
      message.includes("email already exists") ||
      message.includes("duplicate email")
    ) {
      return "This cosmic traveler already exists in our universe! Try a different email.";
    } else if (message.includes("password") && message.includes("weak")) {
      return "Your password needs more cosmic energy! Make it stronger.";
    } else if (message.includes("validation") || message.includes("invalid")) {
      return "Some cosmic data seems to be misaligned. Please check your input!";
    } else if (message.includes("not found") || message.includes("404")) {
      return "This cosmic destination seems to be lost in space!";
    } else if (message.includes("unauthorized") || message.includes("401")) {
      return "Access denied! You need proper cosmic clearance.";
    } else if (message.includes("forbidden") || message.includes("403")) {
      return "This cosmic area is restricted!";
    } else if (message.includes("server error") || message.includes("500")) {
      return "Our cosmic servers are experiencing some turbulence. Please try again later!";
    } else if (message.includes("timeout") || message.includes("408")) {
      return "The cosmic connection timed out. Please try again!";
    } else if (message.includes("network") || message.includes("fetch")) {
      return "Cosmic network issues detected! Please check your connection.";
    }

    return message;
  }

  private async requestWithRetry<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    let lastError: Error;

    for (let attempt = 1; attempt <= this.retryAttempts; attempt++) {
      try {
        return await this.request<T>(endpoint, options);
      } catch (error) {
        lastError = error as Error;

        // Don't retry on client errors (4xx)
        if (this.isClientError(error as Error)) {
          throw error;
        }

        // Don't retry on the last attempt
        if (attempt === this.retryAttempts) {
          break;
        }

        // Wait before retrying
        await this.delay(this.retryDelay * attempt);
      }
    }

    throw lastError!;
  }

  private isClientError(error: Error): boolean {
    return (
      error.message.includes("400") ||
      error.message.includes("401") ||
      error.message.includes("403") ||
      error.message.includes("404") ||
      error.message.includes("422")
    );
  }

  private isRetryableError(error: Error): boolean {
    return (
      error.message.includes("500") ||
      error.message.includes("502") ||
      error.message.includes("503") ||
      error.message.includes("network")
    );
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // Generic HTTP methods
  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "GET" });
  }

  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "DELETE" });
  }

  // Auth endpoints
  async login(data: LoginRequest): Promise<AuthResponse> {
    return this.requestWithRetry<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async register(data: RegisterRequest): Promise<UserResponse> {
    return this.request<UserResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async getProfile(): Promise<UserResponse> {
    return this.request<UserResponse>("/auth/profile");
  }

  async logout(token?: string): Promise<{ message: string }> {
    // If token is provided, use it directly; otherwise use the default request method
    if (token) {
      const url = `${this.baseURL}/auth/logout`;
      const config: RequestInit = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await fetch(url, config);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const customMessage = this.getCustomErrorMessage(
          errorData.error || `HTTP error! status: ${response.status}`
        );
        throw new Error(customMessage);
      }

      return response.json();
    }

    // Fallback to default request method
    return this.request<{ message: string }>("/auth/logout", {
      method: "POST",
    });
  }

  // Health check
  async healthCheck(): Promise<Record<string, unknown>> {
    return this.request<Record<string, unknown>>("/health");
  }
}

export const apiClient = new ApiClient();

// Chat API functions
export const chatAPI = {
  // Get all conversations for the current user
  getConversations: async (): Promise<Conversation[]> => {
    return apiClient.get<Conversation[]>("/conversations");
  },

  // Get messages for a specific conversation
  getMessages: async (conversationId: string): Promise<Message[]> => {
    return apiClient.get<Message[]>(
      `/conversations/${conversationId}/messages`
    );
  },

  // Create a new conversation
  createConversation: async (
    data: CreateConversationRequest
  ): Promise<Conversation> => {
    return apiClient.post<Conversation>("/conversations", data);
  },

  // Send a message
  sendMessage: async (
    conversationId: string,
    data: SendMessageRequest
  ): Promise<Message> => {
    return apiClient.post<Message>(
      `/conversations/${conversationId}/messages`,
      data
    );
  },

  // Search users to start a conversation
  searchUsers: async (query: string): Promise<SearchUserResponse[]> => {
    return apiClient.get<SearchUserResponse[]>(
      `/users/search?q=${encodeURIComponent(query)}`
    );
  },
};
