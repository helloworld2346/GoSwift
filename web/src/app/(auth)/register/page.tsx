'use client';

import { RegisterForm } from '@/components/auth/register-form';
import Link from 'next/link';
import { ArrowLeft, Rocket } from 'lucide-react';

export default function RegisterPage() {
    return (
        <div className="space-bg min-h-screen relative overflow-hidden">
            {/* Animated Background Elements (Stars and Shooting Stars) */}
            <div className="absolute inset-0">
                {/* Stars */}
                <div className="star" style={{ top: '5%', left: '10%', width: '2px', height: '2px' }}></div>
                <div className="star" style={{ top: '15%', left: '25%', width: '1px', height: '1px' }}></div>
                <div className="star" style={{ top: '25%', left: '45%', width: '3px', height: '3px' }}></div>
                <div className="star" style={{ top: '35%', left: '65%', width: '2px', height: '2px' }}></div>
                <div className="star" style={{ top: '45%', left: '85%', width: '1px', height: '1px' }}></div>
                <div className="star" style={{ top: '55%', left: '15%', width: '2px', height: '2px' }}></div>
                <div className="star" style={{ top: '65%', left: '35%', width: '1px', height: '1px' }}></div>
                <div className="star" style={{ top: '75%', left: '55%', width: '3px', height: '3px' }}></div>
                <div className="star" style={{ top: '85%', left: '75%', width: '2px', height: '2px' }}></div>
                <div className="star" style={{ top: '95%', left: '95%', width: '1px', height: '1px' }}></div>
                <div className="star" style={{ top: '10%', left: '80%', width: '2px', height: '2px' }}></div>
                <div className="star" style={{ top: '20%', left: '60%', width: '1px', height: '1px' }}></div>
                <div className="star" style={{ top: '30%', left: '40%', width: '3px', height: '3px' }}></div>
                <div className="star" style={{ top: '40%', left: '20%', width: '2px', height: '2px' }}></div>
                <div className="star" style={{ top: '50%', left: '90%', width: '1px', height: '1px' }}></div>
                <div className="star" style={{ top: '60%', left: '70%', width: '2px', height: '2px' }}></div>
                <div className="star" style={{ top: '70%', left: '50%', width: '1px', height: '1px' }}></div>
                <div className="star" style={{ top: '80%', left: '30%', width: '3px', height: '3px' }}></div>
                <div className="star" style={{ top: '90%', left: '10%', width: '2px', height: '2px' }}></div>
                <div className="star" style={{ top: '12%', left: '50%', width: '1px', height: '1px' }}></div>
                <div className="star" style={{ top: '22%', left: '30%', width: '2px', height: '2px' }}></div>
                <div className="star" style={{ top: '32%', left: '70%', width: '1px', height: '1px' }}></div>
                <div className="star" style={{ top: '42%', left: '90%', width: '3px', height: '3px' }}></div>
                <div className="star" style={{ top: '52%', left: '10%', width: '2px', height: '2px' }}></div>
                <div className="star" style={{ top: '62%', left: '40%', width: '1px', height: '1px' }}></div>
                <div className="star" style={{ top: '72%', left: '80%', width: '2px', height: '2px' }}></div>
                <div className="star" style={{ top: '82%', left: '60%', width: '1px', height: '1px' }}></div>
                <div className="star" style={{ top: '92%', left: '20%', width: '2px', height: '2px' }}></div>
                <div className="star" style={{ top: '8%', left: '70%', width: '1px', height: '1px' }}></div>
                <div className="star" style={{ top: '18%', left: '90%', width: '3px', height: '3px' }}></div>
                <div className="star" style={{ top: '28%', left: '10%', width: '2px', height: '2px' }}></div>
                <div className="star" style={{ top: '38%', left: '50%', width: '1px', height: '1px' }}></div>
                <div className="star" style={{ top: '48%', left: '30%', width: '2px', height: '2px' }}></div>
                <div className="star" style={{ top: '58%', left: '80%', width: '1px', height: '1px' }}></div>
                <div className="star" style={{ top: '68%', left: '20%', width: '3px', height: '3px' }}></div>
                <div className="star" style={{ top: '78%', left: '40%', width: '2px', height: '2px' }}></div>
                <div className="star" style={{ top: '88%', left: '70%', width: '1px', height: '1px' }}></div>
                <div className="star" style={{ top: '92%', left: '72%', width: '1px', height: '1px' }}></div>

                {/* Shooting Stars */}
                <div className="shooting-star" style={{ top: '15%', animationDelay: '0s' }}></div>
                <div className="shooting-star" style={{ top: '55%', animationDelay: '2s' }}></div>
                <div className="shooting-star" style={{ top: '85%', animationDelay: '5s' }}></div>
            </div>

            {/* Back to Home Button */}
            <div className="absolute top-6 left-6 z-20">
                <Link
                    href="/"
                    className="flex items-center space-x-2 text-text-secondary hover:text-text-primary transition-colors duration-300"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span className="text-sm font-medium">Back to Home</span>
                </Link>
            </div>

            {/* Main Content */}
            <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
                <div className="w-full max-w-md">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="flex items-center justify-center mb-6">
                            <Rocket className="w-12 h-12 text-nebula-purple" />
                        </div>
                        <h1 className="gradient-text text-4xl font-bold mb-2 text-glow-purple">
                            Join the Adventure
                        </h1>
                        <p className="text-text-muted">
                            Create your account and start exploring the cosmic universe
                        </p>
                    </div>

                    {/* Register Form Card */}
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
                </div>
            </div>
        </div>
    );
}
