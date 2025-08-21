'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { LoadingScreen } from '@/components/ui/loading-screen';
import { SpaceBackground } from '@/components/ui/space-background';

export default function TestLoadingPage() {
    const [showLoading, setShowLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('Preparing for launch...');
    const [showSpinner, setShowSpinner] = useState(true);

    const testLoading = (message: string, spinner: boolean = true) => {
        setLoadingMessage(message);
        setShowSpinner(spinner);
        setShowLoading(true);

        // Auto hide after 3 seconds
        setTimeout(() => {
            setShowLoading(false);
        }, 3000);
    };

    return (
        <SpaceBackground>
            <div className="min-h-screen p-8">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-4xl font-bold text-text-primary mb-8 gradient-text text-center">
                        Loading Screen Test
                    </h1>

                    <div className="space-card p-8 rounded-2xl border border-card-border">
                        <h2 className="text-2xl font-semibold text-text-primary mb-6">
                            Test Different Loading States
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Button
                                onClick={() => testLoading('Initializing GoSwift...', true)}
                                className="bg-gradient-to-r from-nebula-purple to-nebula-magenta hover:from-nebula-magenta hover:to-nebula-purple"
                            >
                                Test Auth Loading
                            </Button>

                            <Button
                                onClick={() => testLoading('Loading dashboard...', true)}
                                className="bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600"
                            >
                                Test Dashboard Loading
                            </Button>

                            <Button
                                onClick={() => testLoading('Preparing for Departure...', true)}
                                className="bg-gradient-to-r from-orange-400 to-red-500 hover:from-orange-500 hover:to-red-600"
                            >
                                Test Logout Loading
                            </Button>

                            <Button
                                onClick={() => testLoading('Connecting to server...', false)}
                                className="bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600"
                            >
                                Test Without Spinner
                            </Button>

                            <Button
                                onClick={() => testLoading('Custom message test...', true)}
                                className="bg-gradient-to-r from-purple-400 to-pink-500 hover:from-purple-500 hover:to-pink-600"
                            >
                                Custom Message
                            </Button>

                            <Button
                                onClick={() => testLoading('Long loading process...', true)}
                                className="bg-gradient-to-r from-indigo-400 to-purple-500 hover:from-indigo-500 hover:to-purple-600"
                            >
                                Long Process (5s)
                            </Button>
                        </div>

                        <div className="mt-8 p-6 bg-white/5 rounded-xl border border-card-border">
                            <h3 className="text-lg font-semibold text-text-primary mb-4">
                                Loading Screen Features:
                            </h3>
                            <ul className="space-y-2 text-text-muted">
                                <li>✅ SpaceBackground with animated stars</li>
                                <li>✅ Large GoSwift logo with glow effect</li>
                                <li>✅ Orbiting particles around logo</li>
                                <li>✅ Customizable loading message</li>
                                <li>✅ Optional spinner component</li>
                                <li>✅ Animated progress bar with shimmer</li>
                                <li>✅ Floating background elements</li>
                                <li>✅ Responsive design</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Loading Screen Overlay */}
            {showLoading && (
                <LoadingScreen
                    message={loadingMessage}
                    showSpinner={showSpinner}
                />
            )}
        </SpaceBackground>
    );
}
