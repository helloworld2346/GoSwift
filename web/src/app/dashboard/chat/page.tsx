"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/stores/auth";
import { useChatStore } from "@/stores/chat";
import { MessageSquare } from "lucide-react";
import {
  ChatSidebar,
  ChatHeader,
  MessageList,
  MessageInput,
} from "@/components/chat";
import type { Conversation, Message } from "@/types/chat";

export default function ChatPage() {
  const { user } = useAuthStore();
  const {
    conversations,
    selectedConversation,
    messages,
    setConversations,
    setSelectedConversation,
    setMessages,
    addMessage,
  } = useChatStore();

  // Mock data for development
  useEffect(() => {
    const mockConversations: Conversation[] = [
      {
        id: "1",
        name: "Alice Johnson",
        type: "direct",
        created_by: "2",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        participants: [
          { id: "2", display_name: "Alice Johnson", is_online: true },
        ],
        last_message: {
          id: "1",
          conversation_id: "1",
          content: "Hey, how are you doing?",
          sender_id: "2",
          sender_name: "Alice Johnson",
          message_type: "text",
          created_at: new Date().toISOString(),
          is_read: false,
        },
      },
      {
        id: "2",
        name: "Bob Smith",
        type: "direct",
        created_by: "3",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        participants: [
          { id: "3", display_name: "Bob Smith", is_online: false },
        ],
        last_message: {
          id: "2",
          conversation_id: "2",
          content: "Thanks for the help!",
          sender_id: "3",
          sender_name: "Bob Smith",
          message_type: "text",
          created_at: new Date().toISOString(),
          is_read: true,
        },
      },
    ];

    setConversations(mockConversations);
  }, [setConversations]);

  // Mock messages for selected conversation
  useEffect(() => {
    if (selectedConversation) {
      const mockMessages: Message[] = [
        {
          id: "1",
          conversation_id: selectedConversation.id,
          content: "Hey there! 🚀",
          sender_id: selectedConversation.participants[0].id,
          sender_name: selectedConversation.participants[0].display_name,
          message_type: "text",
          created_at: new Date(Date.now() - 60000).toISOString(),
          is_read: true,
        },
        {
          id: "2",
          conversation_id: selectedConversation.id,
          content: "Hi! How are you doing?",
          sender_id: user?.id || "",
          sender_name: user?.display_name || "",
          message_type: "text",
          created_at: new Date(Date.now() - 30000).toISOString(),
          is_read: true,
        },
        {
          id: "3",
          conversation_id: selectedConversation.id,
          content: "I'm doing great! Just working on some new features.",
          sender_id: selectedConversation.participants[0].id,
          sender_name: selectedConversation.participants[0].display_name,
          message_type: "text",
          created_at: new Date().toISOString(),
          is_read: false,
        },
      ];
      setMessages(mockMessages);
    }
  }, [selectedConversation, user, setMessages]);

  const handleSendMessage = (content: string) => {
    if (!selectedConversation || !user) return;

    const message: Message = {
      id: Date.now().toString(),
      conversation_id: selectedConversation.id,
      content,
      sender_id: user.id,
      sender_name: user.display_name,
      message_type: "text",
      created_at: new Date().toISOString(),
      is_read: false,
    };

    addMessage(message);
    console.log("Sending message:", message);
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Sidebar */}
      <ChatSidebar
        conversations={conversations}
        selectedConversation={selectedConversation}
        onSelectConversation={setSelectedConversation}
      />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            <ChatHeader conversation={selectedConversation} />
            <MessageList messages={messages} currentUserId={user?.id || ""} />
            <MessageInput onSendMessage={handleSendMessage} />
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
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
