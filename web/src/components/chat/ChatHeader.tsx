import { MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Conversation } from "@/types/chat";

interface ChatHeaderProps {
  conversation: Conversation;
}

export function ChatHeader({ conversation }: ChatHeaderProps) {
  return (
    <div className="p-4 border-b border-white/20 bg-white/5">
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
              <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-slate-900"></div>
            )}
          </div>
          <div>
            <h3 className="font-semibold text-white">{conversation.name}</h3>
            <p className="text-sm text-white/60">
              {conversation.participants[0]?.is_online ? "Online" : "Offline"}
            </p>
          </div>
        </div>
        <Button
          size="sm"
          variant="ghost"
          className="text-white hover:bg-white/20"
        >
          <MoreVertical className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
