import { useState } from "react";
import { Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { chatAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

import type { Message } from "@/types/chat";

interface MessageInputProps {
  onSendMessage: (message: Message) => void;
  disabled?: boolean;
  conversationId?: string;
}

export function MessageInput({
  onSendMessage,
  disabled = false,
  conversationId,
}: MessageInputProps) {
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const { showError } = useToast();

  const handleSend = async () => {
    if (!message.trim() || disabled || !conversationId) return;

    setSending(true);
    try {
      // Send message via API
      const sentMessage = await chatAPI.sendMessage(conversationId, {
        conversation_id: conversationId,
        content: message.trim(),
        message_type: "text",
      });

      // Call the callback with the actual message from API
      onSendMessage(sentMessage);
      setMessage("");
    } catch (error) {
      console.error("Failed to send message:", error);
      showError("Failed to send message. Please try again.");
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const isDisabled = !message.trim() || disabled || sending || !conversationId;

  return (
    <div className="p-4 border-t border-card-border">
      <div className="flex space-x-2">
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type a message..."
          disabled={disabled || sending}
          className="flex-1 bg-white/10 border-card-border text-text-primary placeholder:text-text-muted focus:border-nebula-purple"
        />
        <Button
          onClick={handleSend}
          disabled={isDisabled}
          className="bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 disabled:opacity-50"
        >
          {sending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </Button>
      </div>
    </div>
  );
}
