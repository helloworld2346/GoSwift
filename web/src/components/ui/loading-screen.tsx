'use client';

import Image from 'next/image';
import { Loader2 } from 'lucide-react';
import { SpaceBackground } from '@/components/ui/space-background';

interface LoadingScreenProps {
    message?: string;
    showSpinner?: boolean;
}

export function LoadingScreen({
    message = "Preparing for launch...",
    showSpinner = true
}: LoadingScreenProps) {
    return (
        <div className="fixed inset-0 z-[100] w-full h-full">
            <SpaceBackground>
                <div className="w-full h-full flex items-center justify-center">
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                        {/* Logo Container */}
                        <div className="relative z-10 mb-8">
                            <div className="relative w-64 h-64">
                                {/* Logo with glow effect */}
                                <div className="absolute inset-0 bg-gradient-to-r from-nebula-purple to-nebula-magenta rounded-full blur-2xl opacity-30 animate-pulse"></div>

                                {/* Main logo */}
                                <div className="relative w-full h-full bg-gradient-to-br from-white/10 to-white/5 rounded-full p-8 backdrop-blur-sm border border-white/20 shadow-2xl">
                                    <Image
                                        src="/assets/images/goswift.png"
                                        alt="GoSwift Logo"
                                        width={256}
                                        height={256}
                                        className="w-full h-full object-contain animate-pulse"
                                        priority
                                    />
                                </div>

                                {/* Orbiting particles */}
                                <div className="absolute inset-0">
                                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-nebula-purple rounded-full animate-ping opacity-75"></div>
                                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-nebula-magenta rounded-full animate-ping opacity-75 delay-500"></div>
                                    <div className="absolute top-1/2 left-0 transform -translate-y-1/2 w-4 h-4 bg-cyan-400 rounded-full animate-ping opacity-75 delay-1000"></div>
                                    <div className="absolute top-1/2 right-0 transform -translate-y-1/2 w-4 h-4 bg-blue-400 rounded-full animate-ping opacity-75 delay-1500"></div>
                                </div>
                            </div>
                        </div>

                        {/* Loading Spinner */}
                        {showSpinner && (
                            <div className="relative z-10 mb-6">
                                <div className="relative">
                                    {/* Outer ring */}
                                    <div className="w-12 h-12 border-2 border-card-border rounded-full animate-spin">
                                        <div className="w-full h-full border-2 border-transparent border-t-nebula-purple rounded-full animate-spin"></div>
                                    </div>

                                    {/* Inner spinner */}
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <Loader2 className="w-6 h-6 text-nebula-purple animate-spin" />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Loading Text */}
                        <div className="relative z-10 text-center">
                            <h3 className="text-xl font-semibold text-text-primary mb-3 gradient-text">
                                {message}
                            </h3>
                            <p className="text-text-muted text-sm">
                                Initializing cosmic systems...
                            </p>
                        </div>

                        {/* Progress Bar */}
                        <div className="relative z-10 mt-6">
                            <div className="w-64 bg-card-border rounded-full h-2 overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-nebula-purple via-nebula-magenta to-cyan-400 rounded-full animate-pulse relative">
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
                                </div>
                            </div>
                        </div>

                        {/* Floating elements */}
                        <div className="absolute inset-0 pointer-events-none">
                            <div className="absolute top-8 left-8 w-1 h-1 bg-nebula-purple rounded-full animate-bounce"></div>
                            <div className="absolute top-12 right-12 w-1 h-1 bg-nebula-magenta rounded-full animate-bounce delay-300"></div>
                            <div className="absolute bottom-8 left-12 w-1 h-1 bg-cyan-400 rounded-full animate-bounce delay-600"></div>
                            <div className="absolute bottom-12 right-8 w-1 h-1 bg-blue-400 rounded-full animate-bounce delay-900"></div>
                        </div>

                        {/* Full page floating elements */}
                        <div className="fixed inset-0 pointer-events-none">
                            <div className="absolute top-20 left-20 w-2 h-2 bg-nebula-purple/60 rounded-full animate-ping"></div>
                            <div className="absolute top-40 right-32 w-1 h-1 bg-nebula-magenta/80 rounded-full animate-ping delay-1000"></div>
                            <div className="absolute bottom-32 left-40 w-1 h-1 bg-cyan-400/70 rounded-full animate-ping delay-2000"></div>
                            <div className="absolute bottom-20 right-20 w-2 h-2 bg-blue-400/60 rounded-full animate-ping delay-3000"></div>
                            <div className="absolute top-1/3 left-1/4 w-1 h-1 bg-green-400/80 rounded-full animate-ping delay-1500"></div>
                            <div className="absolute top-2/3 right-1/4 w-1 h-1 bg-yellow-400/70 rounded-full animate-ping delay-2500"></div>
                            <div className="absolute top-1/4 right-1/3 w-1 h-1 bg-pink-400/60 rounded-full animate-ping delay-500"></div>
                            <div className="absolute bottom-1/4 left-1/3 w-1 h-1 bg-orange-400/80 rounded-full animate-ping delay-3500"></div>
                        </div>
                    </div>
                </div>
            </SpaceBackground>
        </div>
    );
}

// Shimmer animation for progress bar
const shimmerAnimation = `
@keyframes shimmer {
    0% {
        transform: translateX(-100%);
    }
    100% {
        transform: translateX(100%);
    }
}

.animate-shimmer {
    animation: shimmer 2s infinite;
}
`;

// Add shimmer animation to global styles
if (typeof document !== 'undefined') {
    const style = document.createElement('style');
    style.textContent = shimmerAnimation;
    document.head.appendChild(style);
}
