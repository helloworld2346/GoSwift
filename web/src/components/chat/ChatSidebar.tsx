import { MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Conversation } from "@/types/chat";

interface ChatSidebarProps {
  conversations: Conversation[];
  selectedConversation: Conversation | null;
  onSelectConversation: (conversation: Conversation) => void;
}

export function ChatSidebar({
  conversations,
  selectedConversation,
  onSelectConversation,
}: ChatSidebarProps) {
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="w-80 bg-white/10 backdrop-blur-sm border-r border-white/20">
      <div className="p-4 border-b border-white/20">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Messages</h2>
          <Button
            size="sm"
            variant="ghost"
            className="text-white hover:bg-white/20"
          >
            <MessageSquare className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="overflow-y-auto h-[calc(100vh-80px)]">
        {conversations.map((conversation) => (
          <div
            key={conversation.id}
            onClick={() => onSelectConversation(conversation)}
            className={`p-4 border-b border-white/10 cursor-pointer transition-colors ${
              selectedConversation?.id === conversation.id
                ? "bg-white/20"
                : "hover:bg-white/10"
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold">
                    {conversation.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </span>
                </div>
                {conversation.participants[0]?.is_online && (
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-slate-900"></div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-white truncate">
                    {conversation.name}
                  </h3>
                  {conversation.last_message && (
                    <span className="text-xs text-white/60">
                      {formatTime(conversation.last_message.created_at)}
                    </span>
                  )}
                </div>
                {conversation.last_message && (
                  <p className="text-sm text-white/70 truncate">
                    {conversation.last_message.content}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
