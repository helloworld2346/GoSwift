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
  updateParticipantStatus: (userId: string, isOnline: boolean) => void;

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
    set({ selectedConversation: conversation, messages: [] }), // Reset messages when switching conversations
  setMessages: (messages) => {
    // Sort messages by created_at timestamp
    const sortedMessages = [...messages].sort(
      (a, b) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );
    set({ messages: sortedMessages });
  },
  addMessage: (message) => {
    const { messages, conversations, selectedConversation } = get();

    // Check if message already exists to avoid duplicates
    const messageExists = messages.some((m) => m.id === message.id);
    if (messageExists) {
      console.log("Message already exists, skipping add:", message.id);
      return;
    }

    // Add message and sort by timestamp
    const updatedMessages = [...messages, message].sort(
      (a, b) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );

    console.log(
      "Adding new message:",
      message.content,
      "Total messages:",
      updatedMessages.length
    );
    set({ messages: updatedMessages });

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
  updateParticipantStatus: (userId: string, isOnline: boolean) => {
    console.log(
      "updateParticipantStatus called:",
      userId,
      "isOnline:",
      isOnline
    );
    const { conversations, selectedConversation } = get();

    // Update conversations
    const updatedConversations = conversations.map((conv) => ({
      ...conv,
      participants: conv.participants.map((p) =>
        p.id === userId ? { ...p, is_online: isOnline } : p
      ),
    }));

    // Update selected conversation
    let updatedSelectedConversation = selectedConversation;
    if (selectedConversation) {
      updatedSelectedConversation = {
        ...selectedConversation,
        participants: selectedConversation.participants.map((p) =>
          p.id === userId ? { ...p, is_online: isOnline } : p
        ),
      };
    }

    console.log("Updated conversations:", updatedConversations);
    console.log("Updated selected conversation:", updatedSelectedConversation);

    set({
      conversations: updatedConversations,
      selectedConversation: updatedSelectedConversation,
    });
  },

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
    const { setLoading, setError, messages, setMessages } = get();

    try {
      setLoading(true);
      setError(null);

      const apiMessages = await chatAPI.getMessages(conversationId);

      // Merge API messages with existing WebSocket messages
      const existingMessageIds = new Set(messages.map((m) => m.id));
      const newMessages = apiMessages.filter(
        (m) => !existingMessageIds.has(m.id)
      );

      if (newMessages.length > 0) {
        const mergedMessages = [...messages, ...newMessages].sort(
          (a, b) =>
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
        setMessages(mergedMessages);
      } else {
        // If no new messages, just sort existing ones
        const sortedMessages = [...messages].sort(
          (a, b) =>
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
        setMessages(sortedMessages);
      }
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
