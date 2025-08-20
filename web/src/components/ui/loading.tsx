import { Loader2 } from 'lucide-react';

interface LoadingProps {
    size?: 'sm' | 'md' | 'lg';
    text?: string;
    className?: string;
}

export function Loading({ size = 'md', text, className = '' }: LoadingProps) {
    const sizeClasses = {
        sm: 'h-4 w-4',
        md: 'h-8 w-8',
        lg: 'h-12 w-12',
    };

    return (
        <div className={`flex items-center justify-center ${className}`}>
            <div className="text-center">
                <Loader2 className={`animate-spin ${sizeClasses[size]} mx-auto text-blue-600`} />
                {text && <p className="mt-2 text-sm text-gray-600">{text}</p>}
            </div>
        </div>
    );
}
