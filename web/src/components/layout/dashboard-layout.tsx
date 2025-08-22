"use client";

import { Sidebar } from "./sidebar";
import { SpaceBackground } from "@/components/ui/space-background";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <SpaceBackground>
      {/* Sidebar Component */}
      <Sidebar />

      {/* Main content */}
      <div className="pl-80 xl:pl-96 2xl:pl-[28rem]">
        {/* Page content */}
        <main className="min-h-screen">{children}</main>
      </div>
    </SpaceBackground>
  );
}
