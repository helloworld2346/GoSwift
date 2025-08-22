import { Clock } from "lucide-react";
import { useAuthStore } from "@/stores/auth";

export function WelcomeSection() {
  const { user } = useAuthStore();

  return (
    <div className="mb-6 xl:mb-8">
      <div className="flex items-center space-x-3 xl:space-x-4 mb-3 xl:mb-4">
        <div className="w-12 h-12 xl:w-16 xl:h-16 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-xl xl:rounded-2xl flex items-center justify-center shadow-lg">
          <svg
            className="w-6 h-6 xl:w-8 xl:h-8 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
        </div>
        <div>
          <h1 className="text-2xl xl:text-3xl 2xl:text-4xl font-bold text-text-primary gradient-text">
            Welcome back, {user?.display_name || "Commander"}! 🚀
          </h1>
          <p className="text-text-muted text-sm xl:text-lg">
            Ready to connect with your crew? Start chatting now!
          </p>
        </div>
      </div>

      {/* Current Time & Status */}
      <div className="flex items-center space-x-4 xl:space-x-6 text-xs xl:text-sm text-text-muted">
        <div className="flex items-center space-x-1 xl:space-x-2">
          <Clock className="w-3 h-3 xl:w-4 xl:h-4" />
          <span>
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </div>
      </div>
    </div>
  );
}
