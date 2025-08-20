'use client';


import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuthStore } from '@/stores/auth';

export default function DashboardPage() {
    const { user } = useAuthStore();

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold">Dashboard</h1>
                <p className="text-gray-600">Welcome to your GoSwift dashboard</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader>
                        <CardTitle>Profile</CardTitle>
                        <CardDescription>Your account information</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <div>
                                <span className="font-medium">Name:</span> {user?.display_name}
                            </div>
                            <div>
                                <span className="font-medium">Email:</span> {user?.email}
                            </div>
                            <div>
                                <span className="font-medium">Status:</span>
                                <span className={`ml-2 px-2 py-1 text-xs rounded-full ${user?.is_online ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                    }`}>
                                    {user?.is_online ? 'Online' : 'Offline'}
                                </span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                        <CardDescription>Common tasks</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <a
                                href="/dashboard/chat"
                                className="block p-2 text-sm text-blue-600 hover:bg-blue-50 rounded"
                            >
                                Start a new chat
                            </a>
                            <a
                                href="/dashboard/profile"
                                className="block p-2 text-sm text-blue-600 hover:bg-blue-50 rounded"
                            >
                                Edit profile
                            </a>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Statistics</CardTitle>
                        <CardDescription>Your activity</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <div>
                                <span className="font-medium">Member since:</span>
                                <div className="text-sm text-gray-600">
                                    {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
