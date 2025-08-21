'use client';

import { useAuthStore } from '@/stores/auth';
import {
    MessageSquare,
    Users,
    Settings,
    Rocket,
    Clock,
    Send,
    Search,
    Plus
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function DashboardPage() {
    const { user } = useAuthStore();

    const quickActions = [
        {
            title: 'Start New Chat',
            description: 'Begin a conversation with someone',
            icon: MessageSquare,
            href: '/dashboard/chat',
            color: 'from-cyan-400 to-blue-500'
        },
        {
            title: 'Find People',
            description: 'Search and connect with users',
            icon: Users,
            href: '/dashboard/users',
            color: 'from-green-400 to-emerald-500'
        },
        {
            title: 'Settings',
            description: 'Manage your account preferences',
            icon: Settings,
            href: '/dashboard/settings',
            color: 'from-purple-400 to-pink-500'
        }
    ];

    const recentChats = [
        {
            name: 'Alice Johnson',
            lastMessage: 'Hey, how are you doing?',
            time: '2 min ago',
            unread: 1,
            online: true
        },
        {
            name: 'Bob Smith',
            lastMessage: 'Thanks for the help!',
            time: '5 min ago',
            unread: 0,
            online: false
        },
        {
            name: 'Carol Davis',
            lastMessage: 'See you tomorrow!',
            time: '1 hour ago',
            unread: 0,
            online: true
        },
        {
            name: 'David Wilson',
            lastMessage: 'Great idea!',
            time: '2 hours ago',
            unread: 2,
            online: false
        }
    ];

    return (
        <div className="min-h-screen p-6 lg:p-8">
            {/* Welcome Section */}
            <div className="mb-8">
                <div className="flex items-center space-x-4 mb-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
                        <Rocket className="w-8 h-8 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl lg:text-4xl font-bold text-text-primary gradient-text">
                            Welcome back, {user?.display_name || 'Commander'}! 🚀
                        </h1>
                        <p className="text-text-muted text-lg">
                            Ready to connect with your crew? Start chatting now!
                        </p>
                    </div>
                </div>

                {/* Current Time & Status */}
                <div className="flex items-center space-x-6 text-sm text-text-muted">
                    <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4" />
                        <span>{new Date().toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        <span>Online</span>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="mb-8">
                <div className="space-card p-6 rounded-2xl border border-card-border">
                    <div className="flex items-center space-x-3 mb-6">
                        <div className="w-10 h-10 bg-gradient-to-r from-nebula-purple to-nebula-magenta rounded-xl flex items-center justify-center">
                            <Send className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-text-primary">Quick Actions</h2>
                            <p className="text-text-muted">Get started with chatting</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {quickActions.map((action) => {
                            const Icon = action.icon;
                            return (
                                <a
                                    key={action.title}
                                    href={action.href}
                                    className="group flex items-center p-4 rounded-xl border border-card-border hover:bg-white/5 hover:border-nebula-purple transition-all duration-300 hover:scale-105"
                                >
                                    <div className={`w-12 h-12 bg-gradient-to-r ${action.color} rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform`}>
                                        <Icon className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <div className="font-semibold text-text-primary group-hover:text-nebula-purple transition-colors">
                                            {action.title}
                                        </div>
                                        <div className="text-sm text-text-muted">{action.description}</div>
                                    </div>
                                </a>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Recent Chats */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-card p-6 rounded-2xl border border-card-border">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-emerald-500 rounded-xl flex items-center justify-center">
                                <MessageSquare className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-text-primary">Recent Chats</h2>
                                <p className="text-text-muted">Continue your conversations</p>
                            </div>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-text-muted hover:text-text-primary hover:bg-white/10"
                        >
                            View All
                        </Button>
                    </div>

                    <div className="space-y-3">
                        {recentChats.map((chat, index) => (
                            <div
                                key={index}
                                className="flex items-center space-x-3 p-3 rounded-xl hover:bg-white/5 transition-colors group cursor-pointer"
                            >
                                <div className="relative">
                                    <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center">
                                        <span className="text-white font-semibold text-sm">
                                            {chat.name.split(' ').map(n => n[0]).join('')}
                                        </span>
                                    </div>
                                    {chat.online && (
                                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-card-bg"></div>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between">
                                        <div className="font-medium text-text-primary">{chat.name}</div>
                                        <div className="text-xs text-text-muted">{chat.time}</div>
                                    </div>
                                    <div className="text-sm text-text-muted truncate">{chat.lastMessage}</div>
                                </div>
                                {chat.unread > 0 && (
                                    <div className="w-5 h-5 bg-nebula-purple rounded-full flex items-center justify-center">
                                        <span className="text-white text-xs font-medium">{chat.unread}</span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Start New Chat */}
                <div className="space-card p-6 rounded-2xl border border-card-border">
                    <div className="flex items-center space-x-3 mb-6">
                        <div className="w-10 h-10 bg-gradient-to-r from-orange-400 to-red-500 rounded-xl flex items-center justify-center">
                            <Plus className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-text-primary">Start New Chat</h2>
                            <p className="text-text-muted">Connect with someone new</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-text-muted" />
                            <input
                                type="text"
                                placeholder="Search for users..."
                                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-card-border rounded-xl text-text-primary placeholder:text-text-muted focus:outline-none focus:border-nebula-purple transition-colors"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <Button
                                className="w-full bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 text-white"
                            >
                                <MessageSquare className="w-4 h-4 mr-2" />
                                New Chat
                            </Button>
                            <Button
                                variant="outline"
                                className="w-full border-card-border text-text-primary hover:bg-white/10"
                            >
                                <Users className="w-4 h-4 mr-2" />
                                Find People
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
