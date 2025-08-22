import { MoreVertical, Wifi, WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Conversation } from "@/types/chat";

interface ChatHeaderProps {
  conversation: Conversation;
  isConnected?: boolean;
}

export function ChatHeader({
  conversation,
  isConnected = true,
}: ChatHeaderProps) {
  return (
    <div className="p-4 border-b border-card-border bg-white/5">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold">
                {conversation.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </span>
            </div>
            {conversation.participants[0]?.is_online && (
              <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-card-bg"></div>
            )}
          </div>
          <div>
            <h3 className="font-semibold text-text-primary">
              {conversation.name}
            </h3>
            <div className="flex items-center space-x-2">
              <p className="text-sm text-text-muted">
                {conversation.participants[0]?.is_online ? "Online" : "Offline"}
              </p>
              <div className="flex items-center space-x-1">
                {isConnected ? (
                  <Wifi className="w-3 h-3 text-green-400" />
                ) : (
                  <WifiOff className="w-3 h-3 text-red-400" />
                )}
                <span
                  className={`text-xs ${
                    isConnected ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {isConnected ? "Connected" : "Disconnected"}
                </span>
              </div>
            </div>
          </div>
        </div>
        <Button
          size="sm"
          variant="ghost"
          className="text-text-primary hover:bg-white/10"
        >
          <MoreVertical className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
