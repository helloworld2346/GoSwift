"use client";

import {
  WelcomeSection,
  QuickActions,
  RecentChats,
  StartNewChat,
} from "@/components/dashboard";

export default function DashboardPage() {
  return (
    <div className="min-h-screen p-4 xl:p-6 2xl:p-8">
      <WelcomeSection />
      <QuickActions />

      {/* Recent Chats & Start New Chat */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 xl:gap-8">
        <RecentChats />
        <StartNewChat />
      </div>
    </div>
  );
}
