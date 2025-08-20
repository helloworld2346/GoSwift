'use client';

import { createContext, useContext, useState, useCallback } from 'react';
import { ToastContainer, ToastMessage } from '@/components/ui/toast-container';

interface ToastContextType {
    showToast: (toast: Omit<ToastMessage, 'id'>) => void;
    showSuccess: (message: string, title?: string) => void;
    showError: (message: string, title?: string) => void;
    showInfo: (message: string, title?: string) => void;
    showWarning: (message: string, title?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<ToastMessage[]>([]);

    const addToast = useCallback((toast: Omit<ToastMessage, 'id'>) => {
        const id = Math.random().toString(36).substr(2, 9);
        const newToast = { ...toast, id };
        setToasts(prev => [...prev, newToast]);
    }, []);

    const removeToast = useCallback((id: string) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    }, []);

    const showSuccess = useCallback((message: string, title: string = 'Success') => {
        addToast({ type: 'success', title, message });
    }, [addToast]);

    const showError = useCallback((message: string, title: string = 'Error') => {
        addToast({ type: 'error', title, message });
    }, [addToast]);

    const showInfo = useCallback((message: string, title: string = 'Info') => {
        addToast({ type: 'info', title, message });
    }, [addToast]);

    const showWarning = useCallback((message: string, title: string = 'Warning') => {
        addToast({ type: 'warning', title, message });
    }, [addToast]);

    return (
        <ToastContext.Provider value={{
            showToast: addToast,
            showSuccess,
            showError,
            showInfo,
            showWarning,
        }}>
            {children}
            <ToastContainer toasts={toasts} onRemove={removeToast} />
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (context === undefined) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
}
