'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/stores/auth';
import { LoadingScreen } from '@/components/ui/loading-screen';

interface AuthGuardProps {
    children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
    const { isAuthenticated, isInitialized } = useAuthStore();
    const router = useRouter();
    const pathname = usePathname();
    const [isRedirecting, setIsRedirecting] = useState(false);

    useEffect(() => {
        if (!isInitialized) return;

        // If user is authenticated and on auth pages, redirect to dashboard
        if (isAuthenticated && (pathname === '/login' || pathname === '/register' || pathname === '/')) {
            setIsRedirecting(true);
            router.replace('/dashboard');
            return;
        }

        // If user is not authenticated and on protected pages, redirect to homepage
        if (!isAuthenticated && pathname.startsWith('/dashboard')) {
            setIsRedirecting(true);
            router.replace('/');
            return;
        }

        // Reset redirecting state when no redirect is needed
        setIsRedirecting(false);
    }, [isAuthenticated, isInitialized, pathname, router]);

    // Handle browser back/forward buttons
    useEffect(() => {
        const handlePopState = () => {
            if (isInitialized) {
                if (isAuthenticated && (pathname === '/login' || pathname === '/register' || pathname === '/')) {
                    setIsRedirecting(true);
                    router.replace('/dashboard');
                } else if (!isAuthenticated && pathname.startsWith('/dashboard')) {
                    setIsRedirecting(true);
                    router.replace('/');
                }
            }
        };

        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, [isAuthenticated, isInitialized, pathname, router]);

    // Reset redirecting state when pathname changes (redirect completed)
    useEffect(() => {
        setIsRedirecting(false);
    }, [pathname]);

    if (!isInitialized || isRedirecting) {
        return (
            <LoadingScreen
                message={!isInitialized ? "Initializing GoSwift..." : "Redirecting..."}
                showSpinner={true}
            />
        );
    }

    return <>{children}</>;
}
