"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, User, Loader2, MessageSquare } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { chatAPI } from "@/lib/api";
import { useChatStore } from "@/stores/chat";
import { useToast } from "@/hooks/use-toast";
import type { SearchUserResponse } from "@/lib/api";

interface UserSearchProps {
  onClose: () => void;
}

export function UserSearch({ onClose }: UserSearchProps) {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState<SearchUserResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const { createConversation } = useChatStore();
  const { showSuccess, showError } = useToast();

  // Debounced search
  useEffect(() => {
    if (!query.trim()) {
      setUsers([]);
      return;
    }

    const timeoutId = setTimeout(() => {
      performSearch(query.trim());
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query]);

  const performSearch = useCallback(
    async (searchQuery: string) => {
      if (searchQuery.length < 2) return;

      setSearching(true);
      try {
        const results = await chatAPI.searchUsers(searchQuery);
        setUsers(results);
      } catch (error) {
        console.error("Search failed:", error);
        showError("Failed to search users");
      } finally {
        setSearching(false);
      }
    },
    [showError]
  );

  const handleStartChat = async (user: SearchUserResponse) => {
    setLoading(true);
    try {
      await createConversation([user.id], `Chat with ${user.display_name}`);
      showSuccess(`Started chat with ${user.display_name}`);
      onClose(); // Close search modal
    } catch (error) {
      console.error("Failed to create conversation:", error);
      showError("Failed to start chat");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-3 xl:p-4 border-b border-card-border">
        <h3 className="text-base xl:text-lg font-semibold text-text-primary">
          Start New Chat
        </h3>
        <Button
          size="sm"
          variant="ghost"
          onClick={onClose}
          className="text-text-muted hover:text-text-primary"
        >
          ×
        </Button>
      </div>

      {/* Search Input */}
      <div className="p-3 xl:p-4 border-b border-card-border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-text-muted" />
          <Input
            type="text"
            placeholder="Search by name or email..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10 bg-white/10 border-card-border text-text-primary placeholder:text-text-muted focus:border-nebula-purple"
          />
          {searching && (
            <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-text-muted animate-spin" />
          )}
        </div>
      </div>

      {/* Search Results */}
      <div className="flex-1 overflow-y-auto p-3 xl:p-4">
        <div className="space-y-2">
          {query.trim() && !searching && (!users || users.length === 0) && (
            <div className="text-center py-6 xl:py-8 text-text-muted">
              <User className="w-6 h-6 xl:w-8 xl:h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No users found</p>
              <p className="text-xs">
                Try searching with a different name or email
              </p>
            </div>
          )}

          {users?.map((user) => (
            <div
              key={user.id}
              className="flex items-center justify-between p-2 xl:p-3 rounded-lg bg-white/5 border border-card-border hover:bg-white/10 transition-colors"
            >
              <div className="flex items-center space-x-2 xl:space-x-3">
                <div className="relative">
                  <div className="w-8 h-8 xl:w-10 xl:h-10 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-xs xl:text-sm">
                      {user.display_name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </span>
                  </div>
                  {user.is_online && (
                    <div className="absolute -bottom-0.5 -right-0.5 xl:-bottom-1 xl:-right-1 w-2 h-2 xl:w-3 xl:h-3 bg-green-400 rounded-full border-2 border-card-bg"></div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="font-medium text-text-primary text-sm xl:text-base truncate">
                    {user.display_name}
                  </h4>
                  <p className="text-xs text-text-muted truncate">
                    {user.email}
                  </p>
                  <div className="flex items-center space-x-1 mt-1">
                    <div
                      className={`w-1.5 h-1.5 xl:w-2 xl:h-2 rounded-full ${
                        user.is_online ? "bg-green-400" : "bg-gray-400"
                      }`}
                    ></div>
                    <span className="text-xs text-text-muted">
                      {user.is_online ? "Online" : "Offline"}
                    </span>
                  </div>
                </div>
              </div>
              <Button
                size="sm"
                onClick={() => handleStartChat(user)}
                disabled={loading}
                className="bg-nebula-purple hover:bg-nebula-purple/80 text-white flex-shrink-0"
              >
                {loading ? (
                  <Loader2 className="w-3 h-3 xl:w-4 xl:h-4 animate-spin" />
                ) : (
                  <MessageSquare className="w-3 h-3 xl:w-4 xl:h-4" />
                )}
              </Button>
            </div>
          ))}

          {/* Help Text */}
          {!query.trim() && (
            <div className="text-center py-6 xl:py-8 text-text-muted">
              <Search className="w-6 h-6 xl:w-8 xl:h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">
                Search for users to start a conversation
              </p>
              <p className="text-xs">Type a name or email to find users</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
