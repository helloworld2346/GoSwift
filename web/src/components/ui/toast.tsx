'use client';

import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Info, AlertTriangle, X, Rocket, Zap, Shield, Star } from 'lucide-react';

export interface ToastProps {
    id: string;
    type: 'success' | 'error' | 'info' | 'warning';
    title: string;
    message: string;
    duration?: number;
    onClose: (id: string) => void;
}

export function Toast({ id, type, title, message, duration = 5000, onClose }: ToastProps) {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(() => onClose(id), 300); // Wait for fade out animation
        }, duration);

        return () => clearTimeout(timer);
    }, [id, duration, onClose]);

    const getIcon = () => {
        const iconClass = "text-2xl";
        switch (type) {
            case 'success':
                return <Rocket className={`${iconClass} text-green-400`} />;
            case 'error':
                return <XCircle className={`${iconClass} text-red-400`} />;
            case 'info':
                return <Star className={`${iconClass} text-nebula-purple`} />;
            case 'warning':
                return <Shield className={`${iconClass} text-nebula-magenta`} />;
        }
    };

    const getBorderColor = () => {
        switch (type) {
            case 'success':
                return 'border-green-400';
            case 'error':
                return 'border-red-400';
            case 'info':
                return 'border-nebula-purple';
            case 'warning':
                return 'border-nebula-magenta';
        }
    };

    const getGlowColor = () => {
        switch (type) {
            case 'success':
                return 'shadow-[0_0_20px_rgba(6,182,212,0.3)]';
            case 'error':
                return 'shadow-[0_0_20px_rgba(248,113,113,0.3)]';
            case 'info':
                return 'shadow-[0_0_20px_rgba(138,43,226,0.3)]';
            case 'warning':
                return 'shadow-[0_0_20px_rgba(255,0,255,0.3)]';
        }
    };

    return (
        <div
            className={`
                w-full p-4 bg-card-space border border-card-border rounded-lg 
                backdrop-filter backdrop-blur(15px)
                ${getBorderColor()} ${getGlowColor()}
                transition-all duration-500 ease-out
                ${isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-4 scale-95'}
                relative overflow-hidden
            `}
        >
            {/* Shimmer Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-shimmer"></div>

            {/* Content */}
            <div className="flex items-start space-x-3 relative z-10">
                {/* Icon Container */}
                <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-black/20 backdrop-blur-sm">
                    {getIcon()}
                </div>

                {/* Text Content */}
                <div className="flex-1 min-w-0">
                    <h4 className="text-text-primary font-semibold text-sm leading-tight mb-1">
                        {title}
                    </h4>
                    <p className="text-text-muted text-xs leading-relaxed">
                        {message}
                    </p>
                </div>

                {/* Close Button */}
                <button
                    onClick={() => {
                        setIsVisible(false);
                        setTimeout(() => onClose(id), 300);
                    }}
                    className="flex-shrink-0 text-text-muted hover:text-text-primary 
                             transition-colors duration-200 p-1 rounded-full
                             hover:bg-white/10 backdrop-blur-sm"
                >
                    <X size={14} />
                </button>
            </div>

            {/* Progress Bar */}
            <div className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-nebula-purple to-nebula-magenta rounded-full animate-progress"></div>
        </div>
    );
}
