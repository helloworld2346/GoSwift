'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/stores/auth';

interface AuthGuardProps {
    children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
    const { isAuthenticated, isInitialized } = useAuthStore();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (!isInitialized) return;

        // If user is authenticated and on auth pages, redirect to dashboard
        if (isAuthenticated && (pathname === '/login' || pathname === '/register' || pathname === '/')) {
            router.replace('/dashboard');
            return;
        }

        // If user is not authenticated and on protected pages, redirect to login
        if (!isAuthenticated && pathname.startsWith('/dashboard')) {
            router.replace('/login');
            return;
        }
    }, [isAuthenticated, isInitialized, pathname, router]);

    // Handle browser back/forward buttons
    useEffect(() => {
        const handlePopState = () => {
            if (isInitialized) {
                if (isAuthenticated && (pathname === '/login' || pathname === '/register' || pathname === '/')) {
                    router.replace('/dashboard');
                } else if (!isAuthenticated && pathname.startsWith('/dashboard')) {
                    router.replace('/login');
                }
            }
        };

        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, [isAuthenticated, isInitialized, pathname, router]);

    if (!isInitialized) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-nebula-purple mx-auto"></div>
                    <p className="mt-2 text-text-muted">Loading...</p>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}
