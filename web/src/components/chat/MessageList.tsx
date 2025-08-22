import { useRef, useEffect } from "react";
import type { Message } from "@/types/chat";

interface MessageListProps {
  messages: Message[];
  currentUserId: string;
}

export function MessageList({ messages, currentUserId }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex ${
            message.sender_id === currentUserId
              ? "justify-end"
              : "justify-start"
          }`}
        >
          <div
            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
              message.sender_id === currentUserId
                ? "bg-gradient-to-r from-cyan-400 to-blue-500 text-white"
                : "bg-white/10 text-white"
            }`}
          >
            <p className="text-sm">{message.content}</p>
            <p
              className={`text-xs mt-1 ${
                message.sender_id === currentUserId
                  ? "text-white/70"
                  : "text-white/50"
              }`}
            >
              {formatTime(message.created_at)}
            </p>
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
}
