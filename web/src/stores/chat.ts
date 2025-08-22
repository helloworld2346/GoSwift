import { create } from "zustand";
import { chatAPI } from "@/lib/api";
import type { Conversation, Message } from "@/types/chat";

interface ChatState {
  // State
  conversations: Conversation[];
  selectedConversation: Conversation | null;
  messages: Message[];
  loading: boolean;
  error: string | null;

  // Actions
  setConversations: (conversations: Conversation[]) => void;
  setSelectedConversation: (conversation: Conversation | null) => void;
  setMessages: (messages: Message[]) => void;
  addMessage: (message: Message) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;

  // API Actions
  loadConversations: () => Promise<void>;
  loadMessages: (conversationId: string) => Promise<void>;
  createConversation: (
    userIds: string[],
    name: string
  ) => Promise<Conversation>;
  sendMessage: (conversationId: string, content: string) => Promise<Message>;
}

export const useChatStore = create<ChatState>((set, get) => ({
  // Initial state
  conversations: [],
  selectedConversation: null,
  messages: [],
  loading: false,
  error: null,

  // Basic actions
  setConversations: (conversations) => set({ conversations }),
  setSelectedConversation: (conversation) =>
    set({ selectedConversation: conversation }),
  setMessages: (messages) => set({ messages }),
  addMessage: (message) => {
    const { messages, conversations, selectedConversation } = get();

    // Add message to messages list
    set({ messages: [...messages, message] });

    // Update last message in conversations list
    if (selectedConversation) {
      const updatedConversations = conversations.map((conv) =>
        conv.id === selectedConversation.id
          ? { ...conv, last_message: message }
          : conv
      );
      set({ conversations: updatedConversations });
    }
  },
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),

  // API Actions
  loadConversations: async () => {
    const { setLoading, setError, setConversations } = get();

    try {
      setLoading(true);
      setError(null);

      const conversations = await chatAPI.getConversations();
      setConversations(conversations);
    } catch (error) {
      console.error("Failed to load conversations:", error);
      setError(
        error instanceof Error ? error.message : "Failed to load conversations"
      );
    } finally {
      setLoading(false);
    }
  },

  loadMessages: async (conversationId: string) => {
    const { setLoading, setError, setMessages } = get();

    try {
      setLoading(true);
      setError(null);

      const messages = await chatAPI.getMessages(conversationId);
      setMessages(messages);
    } catch (error) {
      console.error("Failed to load messages:", error);
      setError(
        error instanceof Error ? error.message : "Failed to load messages"
      );
    } finally {
      setLoading(false);
    }
  },

  createConversation: async (userIds: string[], name: string) => {
    const { setLoading, setError, conversations, setConversations } = get();

    try {
      setLoading(true);
      setError(null);

      const newConversation = await chatAPI.createConversation({
        name,
        type: userIds.length === 1 ? "direct" : "group",
        user_ids: userIds,
      });

      // Add new conversation to the list
      setConversations([newConversation, ...conversations]);

      return newConversation;
    } catch (error) {
      console.error("Failed to create conversation:", error);
      setError(
        error instanceof Error ? error.message : "Failed to create conversation"
      );
      throw error;
    } finally {
      setLoading(false);
    }
  },

  sendMessage: async (conversationId: string, content: string) => {
    const { setError } = get();

    try {
      const message = await chatAPI.sendMessage(conversationId, {
        conversation_id: conversationId,
        content,
        message_type: "text",
      });

      // Add message to store
      get().addMessage(message);

      return message;
    } catch (error) {
      console.error("Failed to send message:", error);
      setError(
        error instanceof Error ? error.message : "Failed to send message"
      );
      throw error;
    }
  },
}));
