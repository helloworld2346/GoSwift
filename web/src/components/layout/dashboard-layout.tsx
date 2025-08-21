'use client';

import { useState } from 'react';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/stores/auth';
import { Sidebar } from './sidebar';
import { SpaceBackground } from '@/components/ui/space-background';

interface DashboardLayoutProps {
    children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { user } = useAuthStore();

    return (
        <SpaceBackground>
            {/* Sidebar Component */}
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            {/* Main content */}
            <div className="lg:pl-96">
                {/* Mobile menu button - floating */}
                <div className="lg:hidden fixed top-6 left-6 z-50">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-text-primary hover:text-text-primary hover:bg-white/10 backdrop-blur-xl border border-card-border shadow-lg"
                        onClick={() => setSidebarOpen(true)}
                    >
                        <Menu className="h-5 w-5" />
                    </Button>
                </div>

                {/* Page content */}
                <main className="min-h-screen">
                    {children}
                </main>
            </div>
        </SpaceBackground>
    );
}
