'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

import { loginSchema, type LoginFormData } from '@/lib/validations';
import { useAuthStore } from '@/stores/auth';
import { useToast } from '@/hooks/use-toast'; // Thay thế import toast

export function LoginForm() {
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();
    const { login, isLoading, error } = useAuthStore();
    const { showSuccess, showError } = useToast(); // Sử dụng custom toast

    const form = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const onSubmit = async (data: LoginFormData) => {
        const result = await login(data.email, data.password);
        if (result) {
            // Login successful
            showSuccess('Login successful!');
            router.push('/dashboard');
        } else {
            // Login failed - show error toast
            if (error) {
                showError(error);
            } else {
                showError('Oops! Your cosmic credentials seem to be lost in space. Please try again!');
            }
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-text-primary">Email</FormLabel>
                            <FormControl>
                                <Input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="bg-transparent border-card-border text-text-primary placeholder:text-text-muted focus:border-nebula-purple focus:ring-nebula-purple h-12 text-base"
                                    autoComplete="off"
                                    autoCorrect="off"
                                    autoCapitalize="off"
                                    spellCheck="false"
                                    data-form-type="other"
                                    {...field}
                                    disabled={isLoading}
                                />
                            </FormControl>
                            <FormMessage className="form-message" />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-text-primary">Password</FormLabel>
                            <FormControl>
                                <div className="relative">
                                    <Input
                                        placeholder="Enter your password"
                                        className="bg-transparent border-card-border text-text-primary placeholder:text-text-muted focus:border-nebula-purple focus:ring-nebula-purple pr-10 h-12 text-base"
                                        autoComplete="current-password"
                                        {...field}
                                        disabled={isLoading}
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-text-muted hover:text-text-primary z-10"
                                        onClick={() => setShowPassword(!showPassword)}
                                        disabled={isLoading}
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </Button>
                                </div>
                            </FormControl>
                            <FormMessage className="form-message" />
                        </FormItem>
                    )}
                />

                {error && (
                    <div className="cosmic-error-container">
                        <div className="cosmic-error-content">
                            <div className="cosmic-error-icon">🚀</div>
                            <div className="cosmic-error-text">
                                <div className="cosmic-error-title">Mission Failed!</div>
                                <div className="cosmic-error-message">{error}</div>
                            </div>
                            <div className="cosmic-error-particles">
                                <div className="particle"></div>
                                <div className="particle"></div>
                                <div className="particle"></div>
                                <div className="particle"></div>
                                <div className="particle"></div>
                            </div>
                        </div>
                    </div>
                )}

                <Button
                    type="submit"
                    className="gradient-button w-full text-xl py-6 px-8"
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Signing in...
                        </>
                    ) : (
                        'Sign In to Your Adventure'
                    )}
                </Button>
            </form>
        </Form>
    );
}
