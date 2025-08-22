"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/stores/auth";
import { useChatStore } from "@/stores/chat";
import { useWebSocket } from "@/hooks/useWebSocket";
import { MessageSquare } from "lucide-react";
import {
  ChatSidebar,
  ChatHeader,
  MessageList,
  MessageInput,
} from "@/components/chat";
import type { Message } from "@/types/chat";

export default function ChatPage() {
  const { user } = useAuthStore();
  const {
    conversations,
    selectedConversation,
    messages,
    loading,
    error,
    setSelectedConversation,
    addMessage,
    setError,
    clearError,
    loadConversations,
    loadMessages,
  } = useChatStore();

  // WebSocket hook for real-time messaging
  const {
    isConnected,
    sendMessage,
    error: wsError,
  } = useWebSocket(selectedConversation?.id);

  // State for sidebar collapse
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Load conversations on mount
  useEffect(() => {
    if (user) {
      loadConversations();
    }
  }, [user, loadConversations]);

  // Load messages when conversation is selected
  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation.id);
    }
  }, [selectedConversation, loadMessages]);

  // Handle WebSocket errors
  useEffect(() => {
    if (wsError) {
      setError(wsError);
    } else {
      clearError();
    }
  }, [wsError, setError, clearError]);

  const handleSendMessage = async (content: string) => {
    if (!selectedConversation || !user || !isConnected) {
      setError(
        "Cannot send message: not connected or no conversation selected"
      );
      return;
    }

    try {
      // Send message via WebSocket
      sendMessage(content);

      // Create local message for immediate UI update
      const message: Message = {
        id: Date.now().toString(), // Temporary ID
        conversation_id: selectedConversation.id,
        content,
        sender_id: user.id,
        sender_name: user.display_name,
        message_type: "text",
        created_at: new Date().toISOString(),
        is_read: false,
      };

      // Add message to store
      addMessage(message);
    } catch (error) {
      console.error("Failed to send message:", error);
      setError("Failed to send message");
    }
  };

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div className="min-h-screen p-6">
      <div className="h-[calc(100vh-3rem)] flex space-card rounded-3xl border border-card-border shadow-2xl backdrop-blur-xl overflow-hidden">
        {/* Sidebar */}
        <ChatSidebar
          conversations={conversations}
          selectedConversation={selectedConversation}
          onSelectConversation={setSelectedConversation}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={toggleSidebar}
          loading={loading}
        />

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col bg-white/5">
          {selectedConversation ? (
            <>
              <ChatHeader
                conversation={selectedConversation}
                isConnected={isConnected}
              />
              <MessageList messages={messages} currentUserId={user?.id || ""} />
              <MessageInput
                onSendMessage={handleSendMessage}
                disabled={!isConnected}
              />
            </>
          ) : (
            /* Empty State */
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageSquare className="w-16 h-16 text-white/40 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">
                  Select a conversation
                </h3>
                <p className="text-white/60">
                  Choose a conversation from the sidebar to start chatting
                </p>
                {!isConnected && (
                  <div className="mt-4 p-3 bg-yellow-500/20 border border-yellow-500/30 rounded-lg">
                    <p className="text-yellow-300 text-sm">
                      Connecting to chat server...
                    </p>
                  </div>
                )}
                {error && (
                  <div className="mt-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
                    <p className="text-red-300 text-sm">{error}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
