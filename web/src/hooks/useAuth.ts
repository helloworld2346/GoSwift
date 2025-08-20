import { useEffect } from 'react';
import { useAuthStore } from '@/stores/auth';

export const useAuth = () => {
    const auth = useAuthStore();

    useEffect(() => {
        if (!auth.isInitialized) {
            auth.initialize();
        }
    }, [auth.isInitialized]);

    return auth;
};
