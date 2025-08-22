import {
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip } from "@/components/ui/tooltip";
import { useAuthStore } from "@/stores/auth";

import type { Conversation } from "@/types/chat";

interface ChatSidebarProps {
  conversations: Conversation[];
  selectedConversation: Conversation | null;
  onSelectConversation: (conversation: Conversation) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  loading?: boolean;
  onStartNewChat?: () => void;
}

export function ChatSidebar({
  conversations,
  selectedConversation,
  onSelectConversation,
  isCollapsed,
  onToggleCollapse,
  loading = false,
  onStartNewChat,
}: ChatSidebarProps) {
  const { user } = useAuthStore();

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (diffInHours < 24) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else {
      return date.toLocaleDateString([], { month: "short", day: "numeric" });
    }
  };

  return (
    <>
      <div
        className={`border-r border-card-border transition-all duration-300 ${
          isCollapsed ? "w-16 xl:w-20 2xl:w-24" : "w-64 xl:w-80 2xl:w-96"
        }`}
      >
        {/* Header */}
        <div className="p-3 xl:p-4 border-b border-card-border">
          <div className="flex items-center justify-between">
            {!isCollapsed && (
              <h2 className="text-lg xl:text-xl font-bold text-text-primary">
                Messages
              </h2>
            )}
            <div className="flex items-center space-x-1 xl:space-x-2">
              {!isCollapsed && onStartNewChat && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={onStartNewChat}
                  className="text-text-primary hover:bg-white/10"
                  title="Start New Chat"
                >
                  <Plus className="w-3 h-3 xl:w-4 xl:h-4" />
                </Button>
              )}
              <Button
                size="sm"
                variant="ghost"
                onClick={onToggleCollapse}
                className="text-text-primary hover:bg-white/10"
              >
                {isCollapsed ? (
                  <ChevronRight className="w-3 h-3 xl:w-4 xl:h-4" />
                ) : (
                  <ChevronLeft className="w-3 h-3 xl:w-4 xl:h-4" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Conversations List */}
        <div className="overflow-y-auto h-[calc(100vh-12rem)]">
          {loading ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="w-6 h-6 text-text-muted animate-spin" />
              <span className="ml-2 text-text-muted">
                Loading conversations...
              </span>
            </div>
          ) : conversations.length === 0 ? (
            <div className="flex items-center justify-center p-8">
              <div className="text-center">
                <MessageSquare className="w-8 h-8 text-text-muted mx-auto mb-2" />
                <p className="text-text-muted text-sm">No conversations yet</p>
              </div>
            </div>
          ) : (
            conversations.map((conversation) => {
              // Find the other participant (not the current user)
              const otherParticipant = conversation.participants.find(
                (p) => p.id !== user?.id
              );

              // Get display name and online status of the other participant
              const otherUserName =
                otherParticipant?.display_name || "Unknown User";
              const otherUserOnline = otherParticipant?.is_online || false;

              // Generate avatar initials from other user's name
              const avatarInitials = otherUserName
                .split(" ")
                .map((n) => n[0])
                .join("");

              return (
                <div
                  key={conversation.id}
                  onClick={() => onSelectConversation(conversation)}
                  className={`border-b border-card-border cursor-pointer transition-colors ${
                    selectedConversation?.id === conversation.id
                      ? "bg-white/20"
                      : "hover:bg-white/10"
                  }`}
                >
                  {isCollapsed ? (
                    <div className="p-2 xl:p-3 flex justify-center">
                      <Tooltip content={otherUserName} position="right">
                        <div className="relative">
                          <div className="w-8 h-8 xl:w-10 xl:h-10 2xl:w-12 2xl:h-12 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center">
                            <span className="text-white font-semibold text-xs xl:text-sm 2xl:text-base">
                              {avatarInitials}
                            </span>
                          </div>
                          {otherUserOnline && (
                            <div className="absolute -bottom-0.5 -right-0.5 xl:-bottom-1 xl:-right-1 2xl:-bottom-1 2xl:-right-1 w-2 h-2 xl:w-2.5 xl:h-2.5 2xl:w-3 2xl:h-3 bg-green-400 rounded-full border-2 border-card-bg"></div>
                          )}
                          {conversation.last_message &&
                            !conversation.last_message.is_read && (
                              <div className="absolute -top-0.5 -right-0.5 xl:-top-1 xl:-right-1 2xl:-top-1 2xl:-right-1 w-2.5 h-2.5 xl:w-3 xl:h-3 2xl:w-4 2xl:h-4 bg-nebula-purple rounded-full flex items-center justify-center">
                                <span className="text-white text-xs font-medium">
                                  !
                                </span>
                              </div>
                            )}
                        </div>
                      </Tooltip>
                    </div>
                  ) : (
                    <div className="p-3 xl:p-4">
                      <div className="flex items-center space-x-2 xl:space-x-3">
                        <div className="relative">
                          <div className="w-10 h-10 xl:w-12 xl:h-12 2xl:w-14 2xl:h-14 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center">
                            <span className="text-white font-semibold text-sm xl:text-base 2xl:text-lg">
                              {avatarInitials}
                            </span>
                          </div>
                          {otherUserOnline && (
                            <div className="absolute -bottom-0.5 -right-0.5 xl:-bottom-1 xl:-right-1 2xl:-bottom-1 2xl:-right-1 w-2.5 h-2.5 xl:w-3 xl:h-3 2xl:w-4 2xl:h-4 bg-green-400 rounded-full border-2 border-card-bg"></div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-text-primary truncate text-sm xl:text-base 2xl:text-lg">
                              {otherUserName}
                            </h3>
                            {conversation.last_message && (
                              <span className="text-xs text-text-muted">
                                {formatTime(
                                  conversation.last_message.created_at
                                )}
                              </span>
                            )}
                          </div>
                          {conversation.last_message && (
                            <p className="text-xs xl:text-sm 2xl:text-base text-text-muted truncate">
                              {conversation.last_message.content}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
}
