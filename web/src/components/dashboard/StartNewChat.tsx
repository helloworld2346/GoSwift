import { Plus, Search, MessageSquare, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

export function StartNewChat() {
  return (
    <div className="space-card p-4 xl:p-6 rounded-xl xl:rounded-2xl border border-card-border">
      <div className="flex items-center space-x-2 xl:space-x-3 mb-4 xl:mb-6">
        <div className="w-8 h-8 xl:w-10 xl:h-10 bg-gradient-to-r from-orange-400 to-red-500 rounded-lg xl:rounded-xl flex items-center justify-center">
          <Plus className="w-4 h-4 xl:w-5 xl:h-5 text-white" />
        </div>
        <div>
          <h2 className="text-lg xl:text-xl font-bold text-text-primary">
            Start New Chat
          </h2>
          <p className="text-text-muted text-xs xl:text-sm">
            Connect with someone new
          </p>
        </div>
      </div>

      <div className="space-y-3 xl:space-y-4">
        <div className="relative">
          <Search className="absolute left-2 xl:left-3 top-1/2 transform -translate-y-1/2 w-3 h-3 xl:w-4 xl:h-4 text-text-muted" />
          <input
            type="text"
            placeholder="Search for users..."
            className="w-full pl-8 xl:pl-10 pr-3 xl:pr-4 py-2 xl:py-3 bg-white/5 border border-card-border rounded-lg xl:rounded-xl text-text-primary placeholder:text-text-muted focus:outline-none focus:border-nebula-purple transition-colors text-sm xl:text-base"
          />
        </div>

        <div className="grid grid-cols-2 gap-2 xl:gap-3">
          <Button className="w-full bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 text-white text-xs xl:text-sm">
            <MessageSquare className="w-3 h-3 xl:w-4 xl:h-4 mr-1 xl:mr-2" />
            New Chat
          </Button>
          <Button
            variant="outline"
            className="w-full border-card-border text-text-primary hover:bg-white/10 text-xs xl:text-sm"
          >
            <Users className="w-3 h-3 xl:w-4 xl:h-4 mr-1 xl:mr-2" />
            Find People
          </Button>
        </div>
      </div>
    </div>
  );
}
