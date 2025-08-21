'use client';

import { RegisterForm } from '@/components/auth/register-form';
import Link from 'next/link';
import { ArrowLeft, Rocket } from 'lucide-react';
import {
    PageTransition,
    StaggerContainer,
    StaggerItem,
    CosmicTransition
} from '@/components/ui/page-transition';
import { SpaceBackground } from '@/components/ui/space-background';

export default function RegisterPage() {
    return (
        <SpaceBackground>

            {/* Back to Home Button */}
            <StaggerItem>
                <div className="absolute top-6 left-6 z-20">
                    <Link
                        href="/"
                        className="flex items-center space-x-2 text-text-secondary hover:text-text-primary transition-colors duration-300"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span className="text-sm font-medium">Back to Home</span>
                    </Link>
                </div>
            </StaggerItem>

            {/* Main Content */}
            <PageTransition className="relative z-10 flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
                <div className="w-full max-w-md">
                    {/* Header */}
                    <StaggerContainer className="text-center mb-8">
                        <StaggerItem>
                            <div className="flex items-center justify-center mb-6">
                                <Rocket className="w-12 h-12 text-nebula-purple" />
                            </div>
                        </StaggerItem>
                        <StaggerItem>
                            <h1 className="gradient-text text-4xl font-bold mb-2 text-glow-purple">
                                Join the Adventure
                            </h1>
                        </StaggerItem>
                        <StaggerItem>
                            <p className="text-text-muted">
                                Create your account and start exploring the cosmic universe
                            </p>
                        </StaggerItem>
                    </StaggerContainer>

                    {/* Register Form Card */}
                    <CosmicTransition>
                        <div className="space-card p-8">
                            <RegisterForm />

                            {/* Divider */}
                            <div className="relative my-6">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-card-border"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 text-text-muted bg-transparent">Already have an account?</span>
                                </div>
                            </div>

                            {/* Login Link */}
                            <div className="text-center">
                                <Link
                                    href="/login"
                                    className="text-nebula-purple hover:text-nebula-magenta transition-colors duration-300 font-medium"
                                >
                                    Sign in to your account
                                </Link>
                            </div>
                        </div>
                    </CosmicTransition>
                </div>
            </PageTransition>
        </SpaceBackground>
    );
}
