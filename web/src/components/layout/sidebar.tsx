'use client';

import { useState } from 'react';
import {
    MessageSquare,
    User,
    Settings,
    LogOut,
    X,
    Home,
    Loader2,
    Rocket,
    Satellite,
    Users,
    Bell,
    Shield,
    Zap
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/stores/auth';
import { useToast } from '@/hooks/use-toast';
import { apiClient } from '@/lib/api';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const { user, isLoading } = useAuthStore();
    const { showSuccess, showError } = useToast();

    const handleLogout = async () => {
        try {
            setIsLoggingOut(true);

            // Show loading screen for a bit
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Call logout API first (while token still exists)
            try {
                await apiClient.logout();
            } catch (error) {
                console.error('Logout API error:', error);
            }

            // Clear localStorage after API call
            localStorage.removeItem('token');

            // Clear auth state manually
            useAuthStore.setState({
                user: null,
                token: null,
                isAuthenticated: false,
                isLoading: false,
                error: null,
            });

            showSuccess('See you in the cosmos, space explorer!');

            // Add small delay to prevent flash
            await new Promise(resolve => setTimeout(resolve, 300));

            // Use window.location to prevent flash and ensure clean navigation
            window.location.href = '/';
        } catch (error) {
            showError('Failed to logout');
            setIsLoggingOut(false);
        }
    };

    const navigation = [
        {
            name: 'Mission Control',
            href: '/dashboard',
            icon: Home,
            description: 'Main dashboard'
        },
        {
            name: 'Communication Hub',
            href: '/dashboard/chat',
            icon: MessageSquare,
            description: 'Real-time messaging'
        },
        {
            name: 'Crew Directory',
            href: '/dashboard/users',
            icon: Users,
            description: 'User management'
        },
        {
            name: 'Commander Profile',
            href: '/dashboard/profile',
            icon: User,
            description: 'Your profile'
        },
        {
            name: 'Notifications',
            href: '/dashboard/notifications',
            icon: Bell,
            description: 'System alerts'
        },
        {
            name: 'System Config',
            href: '/dashboard/settings',
            icon: Settings,
            description: 'App settings'
        },
    ];

    return (
        <>
            {/* Logout Loading Overlay */}
            {isLoggingOut && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-space-bg-primary backdrop-blur-sm">
                    <div className="space-card p-8 text-center max-w-sm mx-4">
                        {/* Animated Rocket */}
                        <div className="mb-6 relative">
                            <Rocket className="w-16 h-16 text-nebula-purple mx-auto animate-bounce" />
                            <div className="absolute -top-2 -right-2 w-8 h-8 bg-nebula-magenta rounded-full animate-ping opacity-75"></div>
                        </div>

                        {/* Loading Spinner */}
                        <div className="mb-4">
                            <Loader2 className="w-8 h-8 text-nebula-purple mx-auto animate-spin" />
                        </div>

                        {/* Loading Text */}
                        <h3 className="text-xl font-semibold text-text-primary mb-2 gradient-text">
                            Preparing for Departure...
                        </h3>
                        <p className="text-text-muted text-sm">
                            Safely returning you to the cosmic homepage
                        </p>

                        {/* Progress Bar */}
                        <div className="mt-4 w-full bg-card-border rounded-full h-2 overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-nebula-purple to-nebula-magenta rounded-full animate-pulse"></div>
                        </div>
                    </div>
                </div>
            )}

            {/* Mobile sidebar */}
            <div className={`fixed inset-0 z-50 lg:hidden ${isOpen ? 'block' : 'hidden'}`}>
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
                <div className="fixed inset-y-0 left-0 flex w-80 flex-col space-card border-r border-card-border">
                    {/* Header */}
                    <div className="flex h-20 items-center justify-between px-6 border-b border-card-border">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-nebula-purple to-nebula-magenta rounded-xl flex items-center justify-center shadow-lg">
                                <Satellite className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h1 className="text-lg font-bold gradient-text">STATION-001</h1>
                                <p className="text-xs text-text-muted">Space Station Alpha</p>
                            </div>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onClose}
                            className="text-text-muted hover:text-text-primary hover:bg-white/10 rounded-xl"
                        >
                            <X className="h-5 w-5" />
                        </Button>
                    </div>

                    {/* User Info */}
                    <div className="px-6 py-4 border-b border-card-border">
                        <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center">
                                <User className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-sm font-semibold text-text-primary">
                                    {user?.display_name || 'Commander'}
                                </h3>
                                <p className="text-xs text-text-muted">Online</p>
                            </div>
                            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-4 py-6 space-y-2">
                        {navigation.map((item) => {
                            const Icon = item.icon;
                            return (
                                <a
                                    key={item.name}
                                    href={item.href}
                                    className="group flex items-center px-4 py-3 text-sm font-medium rounded-xl text-text-muted hover:bg-white/10 hover:text-text-primary transition-all duration-200 hover:shadow-lg"
                                >
                                    <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center mr-3 group-hover:bg-white/10 transition-colors">
                                        <Icon className="h-5 w-5 group-hover:text-nebula-purple transition-colors" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="font-medium">{item.name}</div>
                                        <div className="text-xs opacity-60">{item.description}</div>
                                    </div>
                                </a>
                            );
                        })}
                    </nav>

                    {/* Footer */}
                    <div className="border-t border-card-border p-4">
                        <Button
                            variant="ghost"
                            className="w-full justify-start text-text-muted hover:text-text-primary hover:bg-white/10 rounded-xl h-12"
                            onClick={handleLogout}
                            disabled={isLoading || isLoggingOut}
                        >
                            {isLoggingOut ? (
                                <>
                                    <div className="w-10 h-10 bg-red-500/10 rounded-lg flex items-center justify-center mr-3">
                                        <Loader2 className="h-5 w-5 animate-spin text-red-400" />
                                    </div>
                                    <div className="flex-1 text-left">
                                        <div className="font-medium">Disconnecting...</div>
                                        <div className="text-xs opacity-60">Please wait</div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="w-10 h-10 bg-red-500/10 rounded-lg flex items-center justify-center mr-3">
                                        <LogOut className="h-5 w-5 text-red-400" />
                                    </div>
                                    <div className="flex-1 text-left">
                                        <div className="font-medium">Disconnect</div>
                                        <div className="text-xs opacity-60">Logout from station</div>
                                    </div>
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Desktop sidebar - Floating Card Style */}
            <div className="hidden lg:block lg:fixed lg:inset-y-0 lg:left-6 lg:top-6 lg:bottom-6 lg:w-80">
                <div className="h-full flex flex-col space-card rounded-3xl border border-card-border shadow-2xl backdrop-blur-xl relative overflow-hidden">
                    {/* Animated Background Elements */}
                    <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute top-10 right-10 w-20 h-20 bg-nebula-purple/10 rounded-full blur-xl animate-pulse"></div>
                        <div className="absolute bottom-20 left-10 w-16 h-16 bg-nebula-magenta/10 rounded-full blur-xl animate-pulse delay-1000"></div>
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl animate-pulse delay-500"></div>
                    </div>

                    {/* Header */}
                    <div className="flex h-24 items-center px-8 border-b border-card-border relative z-10">
                        <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-gradient-to-r from-nebula-purple to-nebula-magenta rounded-2xl flex items-center justify-center shadow-lg">
                                <Satellite className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold gradient-text">STATION-001</h1>
                                <p className="text-sm text-text-muted">Space Station Alpha</p>
                            </div>
                        </div>
                    </div>

                    {/* User Info */}
                    <div className="px-8 py-6 border-b border-card-border relative z-10">
                        <div className="flex items-center space-x-4">
                            <div className="w-14 h-14 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
                                <User className="w-7 h-7 text-white" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-base font-semibold text-text-primary">
                                    {user?.display_name || 'Commander'}
                                </h3>
                                <p className="text-sm text-text-muted">Online • Active</p>
                            </div>
                            <div className="w-4 h-4 bg-green-400 rounded-full animate-pulse shadow-lg"></div>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-6 py-8 space-y-3 relative z-10">
                        {navigation.map((item) => {
                            const Icon = item.icon;
                            return (
                                <a
                                    key={item.name}
                                    href={item.href}
                                    className="group flex items-center px-4 py-4 text-sm font-medium rounded-2xl text-text-muted hover:bg-white/10 hover:text-text-primary transition-all duration-300 hover:shadow-xl hover:scale-105"
                                >
                                    <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center mr-4 group-hover:bg-white/10 transition-all duration-300 group-hover:scale-110">
                                        <Icon className="h-6 w-6 group-hover:text-nebula-purple transition-colors" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="font-semibold">{item.name}</div>
                                        <div className="text-xs opacity-60 mt-1">{item.description}</div>
                                    </div>
                                    <div className="w-2 h-2 bg-nebula-purple rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                </a>
                            );
                        })}
                    </nav>

                    {/* Footer */}
                    <div className="border-t border-card-border p-6 relative z-10">
                        <Button
                            variant="ghost"
                            className="w-full justify-start text-text-muted hover:text-text-primary hover:bg-white/10 rounded-2xl h-14 transition-all duration-300 hover:shadow-xl"
                            onClick={handleLogout}
                            disabled={isLoading || isLoggingOut}
                        >
                            {isLoggingOut ? (
                                <>
                                    <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center mr-4">
                                        <Loader2 className="h-6 w-6 animate-spin text-red-400" />
                                    </div>
                                    <div className="flex-1 text-left">
                                        <div className="font-semibold">Disconnecting...</div>
                                        <div className="text-sm opacity-60 mt-1">Please wait</div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center mr-4">
                                        <LogOut className="h-6 w-6 text-red-400" />
                                    </div>
                                    <div className="flex-1 text-left">
                                        <div className="font-semibold">Disconnect</div>
                                        <div className="text-sm opacity-60 mt-1">Logout from station</div>
                                    </div>
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
}
