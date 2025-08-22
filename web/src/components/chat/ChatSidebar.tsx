import { MessageSquare, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Conversation } from "@/types/chat";

interface ChatSidebarProps {
  conversations: Conversation[];
  selectedConversation: Conversation | null;
  onSelectConversation: (conversation: Conversation) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export function ChatSidebar({
  conversations,
  selectedConversation,
  onSelectConversation,
  isCollapsed,
  onToggleCollapse,
}: ChatSidebarProps) {
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
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
            {!isCollapsed && (
              <Button
                size="sm"
                variant="ghost"
                className="text-text-primary hover:bg-white/10"
              >
                <MessageSquare className="w-3 h-3 xl:w-4 xl:h-4" />
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
        {conversations.map((conversation) => (
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
              // Collapsed view - only avatar with tooltip
              <div className="p-2 xl:p-3 flex justify-center">
                <div className="relative group">
                  <div className="w-8 h-8 xl:w-10 xl:h-10 2xl:w-12 2xl:h-12 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-xs xl:text-sm 2xl:text-base">
                      {conversation.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </span>
                  </div>
                  {conversation.participants[0]?.is_online && (
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

                  {/* Custom Tooltip with fixed positioning */}
                  <div className="invisible group-hover:visible fixed bg-gray-900 text-white text-xs rounded-lg py-2 px-3 whitespace-nowrap z-[99999] shadow-xl border border-gray-700 pointer-events-none">
                    <div className="font-medium mb-1">{conversation.name}</div>
                    {conversation.last_message && (
                      <div className="text-gray-300 text-xs max-w-48 truncate">
                        {conversation.last_message.content}
                      </div>
                    )}
                    {/* Arrow pointing to avatar */}
                    <div className="absolute right-full top-1/2 transform -translate-y-1/2 w-0 h-0 border-l-0 border-r-4 border-t-4 border-b-4 border-transparent border-l-gray-900"></div>
                  </div>
                </div>
              </div>
            ) : (
              // Expanded view - full information
              <div className="p-3 xl:p-4">
                <div className="flex items-center space-x-2 xl:space-x-3">
                  <div className="relative">
                    <div className="w-10 h-10 xl:w-12 xl:h-12 2xl:w-14 2xl:h-14 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-sm xl:text-base 2xl:text-lg">
                        {conversation.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </span>
                    </div>
                    {conversation.participants[0]?.is_online && (
                      <div className="absolute -bottom-0.5 -right-0.5 xl:-bottom-1 xl:-right-1 2xl:-bottom-1 2xl:-right-1 w-2.5 h-2.5 xl:w-3 xl:h-3 2xl:w-4 2xl:h-4 bg-green-400 rounded-full border-2 border-card-bg"></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-text-primary truncate text-sm xl:text-base 2xl:text-lg">
                        {conversation.name}
                      </h3>
                      {conversation.last_message && (
                        <span className="text-xs text-text-muted">
                          {formatTime(conversation.last_message.created_at)}
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
        ))}
      </div>
    </div>
  );
}
