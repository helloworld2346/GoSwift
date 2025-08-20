'use client';

import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Info, AlertTriangle, X } from 'lucide-react';

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
        const iconClass = "text-3xl";
        switch (type) {
            case 'success':
                return <CheckCircle className={`${iconClass} text-[#47D764]`} />;
            case 'error':
                return <XCircle className={`${iconClass} text-[#ff355b]`} />;
            case 'info':
                return <Info className={`${iconClass} text-[#2F86EB]`} />;
            case 'warning':
                return <AlertTriangle className={`${iconClass} text-[#FFC021]`} />;
        }
    };

    const getBorderColor = () => {
        switch (type) {
            case 'success':
                return 'border-l-[#47D764]';
            case 'error':
                return 'border-l-[#ff355b]';
            case 'info':
                return 'border-l-[#2F86EB]';
            case 'warning':
                return 'border-l-[#FFC021]';
        }
    };

    return (
        <div
            className={`
                w-full h-20 p-5 bg-white rounded-lg 
                grid grid-cols-[1.3fr_6fr_0.5fr] items-center
                shadow-[0_15px_30px_rgba(0,0,0,0.08)]
                border-l-3 ${getBorderColor()}
                transition-all duration-300 ease-in-out
                ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}
            `}
        >
            {/* Icon Container */}
            <div className="flex justify-center items-center">
                {getIcon()}
            </div>

            {/* Content Container */}
            <div className="flex flex-col justify-center">
                <p className="text-[#101020] font-semibold text-base leading-none">
                    {title}
                </p>
                <p className="text-[#656565] font-normal text-xs mt-1 break-words">
                    {message}
                </p>
            </div>

            {/* Close Button */}
            <button
                onClick={() => {
                    setIsVisible(false);
                    setTimeout(() => onClose(id), 300);
                }}
                className="justify-self-end text-[#656565] text-xl leading-none cursor-pointer 
                         hover:text-gray-800 transition-colors duration-200
                         flex items-center justify-center w-6 h-6"
            >
                <X size={16} />
            </button>
        </div>
    );
}
