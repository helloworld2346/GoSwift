'use client';

import { useState, useCallback } from 'react';
import { Toast, ToastProps } from './toast';

export interface ToastMessage {
    id: string;
    type: 'success' | 'error' | 'info' | 'warning';
    title: string;
    message: string;
    duration?: number;
}

interface ToastContainerProps {
    toasts: ToastMessage[];
    onRemove: (id: string) => void;
}

export function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
    return (
        <div className="fixed top-6 right-6 z-50 space-y-4 w-80 pointer-events-none">
            {toasts.map((toast) => (
                <div key={toast.id} className="pointer-events-auto">
                    <Toast
                        {...toast}
                        onClose={onRemove}
                    />
                </div>
            ))}
        </div>
    );
}
