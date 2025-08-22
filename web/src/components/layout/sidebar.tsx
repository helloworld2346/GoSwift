"use client";

import {
  MessageSquare,
  User,
  Settings,
  LogOut,
  Home,
  Satellite,
  Users,
  Bell,
  Loader2,
} from "lucide-react";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/auth";
import { useToast } from "@/hooks/use-toast";
import { useWebSocket } from "@/hooks/useWebSocket";

export function Sidebar() {
  const { user, isLoading, isLoggingOut } = useAuthStore();
  const { showSuccess, showError } = useToast();
  const pathname = usePathname();

  // Get WebSocket connection status (no conversation needed for connection status)
  const { isConnected } = useWebSocket(undefined);

  const handleLogout = async () => {
    if (isLoggingOut) return; // Prevent multiple clicks

    try {
      // Clear auth state - AuthGuard will handle redirect
      await useAuthStore.getState().logout();

      showSuccess("See you in the cosmos, space explorer!");
    } catch (error) {
      console.error("❌ Logout failed:", error);
      showError("Failed to logout");
    }
  };

  const navigation = [
    {
      name: "Mission Control",
      href: "/dashboard",
      icon: Home,
      description: "Main dashboard",
    },
    {
      name: "Communication Hub",
      href: "/dashboard/chat",
      icon: MessageSquare,
      description: "Real-time messaging",
    },
    {
      name: "Crew Directory",
      href: "/dashboard/users",
      icon: Users,
      description: "User management",
    },
    {
      name: "Commander Profile",
      href: "/dashboard/profile",
      icon: User,
      description: "Your profile",
    },
    {
      name: "Notifications",
      href: "/dashboard/notifications",
      icon: Bell,
      description: "System alerts",
    },
    {
      name: "System Config",
      href: "/dashboard/settings",
      icon: Settings,
      description: "App settings",
    },
  ];

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }
    return pathname.startsWith(href);
  };

  return (
    <div className="fixed inset-y-0 left-6 top-6 bottom-6 w-64 xl:w-80 2xl:w-96">
      <div className="h-full flex flex-col space-card rounded-3xl border border-card-border shadow-2xl backdrop-blur-xl relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-10 right-10 w-20 h-20 bg-nebula-purple/10 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute bottom-20 left-10 w-16 h-16 bg-nebula-magenta/10 rounded-full blur-xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl animate-pulse delay-500"></div>
        </div>

        {/* Header - Fixed height */}
        <div className="flex h-16 xl:h-20 items-center px-4 xl:px-6 border-b border-card-border relative z-10 flex-shrink-0">
          <div className="flex items-center space-x-2 xl:space-x-3">
            <div className="w-8 h-8 xl:w-10 xl:h-10 bg-gradient-to-r from-nebula-purple to-nebula-magenta rounded-lg xl:rounded-xl flex items-center justify-center shadow-lg">
              <Satellite className="w-4 h-4 xl:w-5 xl:h-5 text-white" />
            </div>
            <div>
              <h1 className="text-sm xl:text-lg font-bold gradient-text">
                STATION-001
              </h1>
              <p className="text-xs text-text-muted">Space Station Alpha</p>
            </div>
          </div>
        </div>

        {/* User Info - Fixed height */}
        <div className="px-4 xl:px-6 py-3 xl:py-4 border-b border-card-border relative z-10 flex-shrink-0">
          <div className="flex items-center space-x-2 xl:space-x-3">
            <div className="w-10 h-10 xl:w-12 xl:h-12 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-lg xl:rounded-xl flex items-center justify-center shadow-lg">
              <User className="w-5 h-5 xl:w-6 xl:h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-xs xl:text-sm font-semibold text-text-primary">
                {user?.display_name || "Commander"}
              </h3>
              <p
                className={`text-xs ${
                  isConnected ? "text-blue-400" : "text-red-400"
                }`}
              >
                {isConnected ? "Online" : "Offline"}
              </p>
            </div>
            <div
              className={`w-2.5 h-2.5 xl:w-3 xl:h-3 rounded-full shadow-lg ${
                isConnected ? "bg-blue-400 animate-pulse" : "bg-red-400"
              }`}
            ></div>
          </div>
        </div>

        {/* Navigation - Scrollable */}
        <nav className="flex-1 px-3 xl:px-4 py-4 xl:py-6 space-y-1 xl:space-y-2 relative z-10 overflow-y-auto">
          {navigation.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <a
                key={item.name}
                href={item.href}
                className={`group flex items-center px-2 xl:px-3 py-2 xl:py-3 text-sm font-medium rounded-lg xl:rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-105 ${
                  active
                    ? "bg-white/10 text-text-primary shadow-lg"
                    : "text-text-muted hover:bg-white/10 hover:text-text-primary"
                }`}
              >
                <div
                  className={`w-8 h-8 xl:w-10 xl:h-10 rounded-md xl:rounded-lg flex items-center justify-center mr-2 xl:mr-3 transition-all duration-300 group-hover:scale-110 ${
                    active
                      ? "bg-white/10 group-hover:bg-white/15"
                      : "bg-white/5 group-hover:bg-white/10"
                  }`}
                >
                  <Icon
                    className={`h-4 w-4 xl:h-5 xl:w-5 transition-colors ${
                      active
                        ? "text-nebula-purple"
                        : "group-hover:text-nebula-purple"
                    }`}
                  />
                </div>
                <div className="flex-1">
                  <div className="font-medium xl:font-semibold text-xs xl:text-sm">
                    {item.name}
                  </div>
                  <div className="text-xs opacity-60 mt-0.5">
                    {item.description}
                  </div>
                </div>
                <div
                  className={`w-1 h-1 xl:w-1.5 xl:h-1.5 bg-nebula-purple rounded-full transition-opacity ${
                    active ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                  }`}
                ></div>
              </a>
            );
          })}
        </nav>

        {/* Footer - Fixed height */}
        <div className="border-t border-card-border p-3 xl:p-4 relative z-10 flex-shrink-0">
          <Button
            variant="ghost"
            className="w-full justify-start text-text-muted hover:text-text-primary hover:bg-white/10 rounded-lg xl:rounded-xl h-10 xl:h-12 transition-all duration-300 hover:shadow-lg"
            onClick={handleLogout}
            disabled={isLoading || isLoggingOut}
          >
            <div className="w-8 h-8 xl:w-10 xl:h-10 bg-red-500/10 rounded-md xl:rounded-lg flex items-center justify-center mr-2 xl:mr-3">
              {isLoggingOut ? (
                <Loader2 className="h-4 w-4 xl:h-5 xl:w-5 animate-spin text-red-400" />
              ) : (
                <LogOut className="h-4 w-4 xl:h-5 xl:w-5 text-red-400" />
              )}
            </div>
            <div className="flex-1 text-left">
              <div className="font-medium xl:font-semibold text-xs xl:text-sm">
                {isLoggingOut ? "Disconnecting..." : "Disconnect"}
              </div>
              <div className="text-xs opacity-60 mt-0.5">
                {isLoggingOut ? "Please wait" : "Logout from station"}
              </div>
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
}
