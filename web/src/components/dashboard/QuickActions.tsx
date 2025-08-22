import { Send, MessageSquare, Users, Settings } from "lucide-react";

interface QuickAction {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  color: string;
}

const quickActions: QuickAction[] = [
  {
    title: "Start New Chat",
    description: "Begin a conversation with someone",
    icon: MessageSquare,
    href: "/dashboard/chat",
    color: "from-cyan-400 to-blue-500",
  },
  {
    title: "Find People",
    description: "Search and connect with users",
    icon: Users,
    href: "/dashboard/users",
    color: "from-green-400 to-emerald-500",
  },
  {
    title: "Settings",
    description: "Manage your account preferences",
    icon: Settings,
    href: "/dashboard/settings",
    color: "from-purple-400 to-pink-500",
  },
];

export function QuickActions() {
  return (
    <div className="mb-6 xl:mb-8">
      <div className="space-card p-4 xl:p-6 rounded-xl xl:rounded-2xl border border-card-border">
        <div className="flex items-center space-x-2 xl:space-x-3 mb-4 xl:mb-6">
          <div className="w-8 h-8 xl:w-10 xl:h-10 bg-gradient-to-r from-nebula-purple to-nebula-magenta rounded-lg xl:rounded-xl flex items-center justify-center">
            <Send className="w-4 h-4 xl:w-5 xl:h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg xl:text-xl font-bold text-text-primary">
              Quick Actions
            </h2>
            <p className="text-text-muted text-xs xl:text-sm">
              Get started with chatting
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 xl:gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <a
                key={action.title}
                href={action.href}
                className="group flex items-center p-3 xl:p-4 rounded-lg xl:rounded-xl border border-card-border hover:bg-white/5 hover:border-nebula-purple transition-all duration-300 hover:scale-105"
              >
                <div
                  className={`w-10 h-10 xl:w-12 xl:h-12 bg-gradient-to-r ${action.color} rounded-lg xl:rounded-xl flex items-center justify-center mr-3 xl:mr-4 group-hover:scale-110 transition-transform`}
                >
                  <Icon className="w-5 h-5 xl:w-6 xl:h-6 text-white" />
                </div>
                <div>
                  <div className="font-semibold text-text-primary group-hover:text-nebula-purple transition-colors text-sm xl:text-base">
                    {action.title}
                  </div>
                  <div className="text-xs xl:text-sm text-text-muted">
                    {action.description}
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}
