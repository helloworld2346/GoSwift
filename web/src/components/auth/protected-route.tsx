'use client';

import { useAuthStore } from '@/stores/auth';
import { LoadingScreen } from '@/components/ui/loading-screen';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
    const { isAuthenticated, isInitialized } = useAuthStore();

    if (!isInitialized) {
        return (
            <LoadingScreen
                message="Loading dashboard..."
                showSpinner={true}
            />
        );
    }

    if (!isAuthenticated) {
        return null;
    }

    return <>{children}</>;
}
