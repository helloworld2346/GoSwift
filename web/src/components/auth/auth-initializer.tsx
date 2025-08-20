'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/stores/auth';

export function AuthInitializer() {
    const { initialize } = useAuthStore();

    useEffect(() => {
        initialize();
    }, [initialize]);

    return null;
}
