import { create } from "zustand";
import type { Message, Conversation } from "@/types/chat";

interface ChatState {
  conversations: Conversation[];
  selectedConversation: Conversation | null;
  messages: Message[];
  isLoading: boolean;
  error: string | null;

  // Actions
  setConversations: (conversations: Conversation[]) => void;
  setSelectedConversation: (conversation: Conversation | null) => void;
  setMessages: (messages: Message[]) => void;
  addMessage: (message: Message) => void;
  updateLastMessage: (conversationId: string, message: Message) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  conversations: [],
  selectedConversation: null,
  messages: [],
  isLoading: false,
  error: null,

  setConversations: (conversations) => set({ conversations }),

  setSelectedConversation: (conversation) =>
    set({ selectedConversation: conversation }),

  setMessages: (messages) => set({ messages }),

  addMessage: (message) => {
    set((state) => ({
      messages: [...state.messages, message],
    }));

    // Update last message in conversation
    get().updateLastMessage(message.conversation_id, message);
  },

  updateLastMessage: (conversationId, message) => {
    set((state) => ({
      conversations: state.conversations.map((conv) =>
        conv.id === conversationId
          ? { ...conv, last_message: message, updated_at: message.created_at }
          : conv
      ),
    }));
  },

  setLoading: (loading) => set({ isLoading: loading }),

  setError: (error) => set({ error }),

  clearError: () => set({ error: null }),
}));
