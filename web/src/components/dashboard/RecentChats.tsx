import { MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RecentChat {
  name: string;
  lastMessage: string;
  time: string;
  unread: number;
  online: boolean;
}

const recentChats: RecentChat[] = [
  {
    name: "Alice Johnson",
    lastMessage: "Hey, how are you doing?",
    time: "2 min ago",
    unread: 1,
    online: true,
  },
  {
    name: "Bob Smith",
    lastMessage: "Thanks for the help!",
    time: "5 min ago",
    unread: 0,
    online: false,
  },
  {
    name: "Carol Davis",
    lastMessage: "See you tomorrow!",
    time: "1 hour ago",
    unread: 0,
    online: true,
  },
  {
    name: "David Wilson",
    lastMessage: "Great idea!",
    time: "2 hours ago",
    unread: 2,
    online: false,
  },
];

export function RecentChats() {
  return (
    <div className="space-card p-4 xl:p-6 rounded-xl xl:rounded-2xl border border-card-border">
      <div className="flex items-center justify-between mb-4 xl:mb-6">
        <div className="flex items-center space-x-2 xl:space-x-3">
          <div className="w-8 h-8 xl:w-10 xl:h-10 bg-gradient-to-r from-green-400 to-emerald-500 rounded-lg xl:rounded-xl flex items-center justify-center">
            <MessageSquare className="w-4 h-4 xl:w-5 xl:h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg xl:text-xl font-bold text-text-primary">
              Recent Chats
            </h2>
            <p className="text-text-muted text-xs xl:text-sm">
              Continue your conversations
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="text-text-muted hover:text-text-primary hover:bg-white/10 text-xs xl:text-sm"
        >
          View All
        </Button>
      </div>

      <div className="space-y-2 xl:space-y-3">
        {recentChats.map((chat, index) => (
          <div
            key={index}
            className="flex items-center space-x-2 xl:space-x-3 p-2 xl:p-3 rounded-lg xl:rounded-xl hover:bg-white/5 transition-colors group cursor-pointer"
          >
            <div className="relative">
              <div className="w-8 h-8 xl:w-10 xl:h-10 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-xs xl:text-sm">
                  {chat.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </span>
              </div>
              {chat.online && (
                <div className="absolute -bottom-0.5 -right-0.5 xl:-bottom-1 xl:-right-1 w-2 h-2 xl:w-3 xl:h-3 bg-green-400 rounded-full border-2 border-card-bg"></div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <div className="font-medium text-text-primary text-sm xl:text-base">
                  {chat.name}
                </div>
                <div className="text-xs text-text-muted">{chat.time}</div>
              </div>
              <div className="text-xs xl:text-sm text-text-muted truncate">
                {chat.lastMessage}
              </div>
            </div>
            {chat.unread > 0 && (
              <div className="w-4 h-4 xl:w-5 xl:h-5 bg-nebula-purple rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-medium">
                  {chat.unread}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
