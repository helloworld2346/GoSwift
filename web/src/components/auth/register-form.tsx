'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Loader2, Check } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

import { registerSchema, type RegisterFormData } from '@/lib/validations';
import { useAuthStore } from '@/stores/auth';
import { useToast } from '@/hooks/use-toast'; // Thay thế import toast

interface PasswordRequirement {
    id: string;
    text: string;
    regex: RegExp;
    met: boolean;
}

export function RegisterForm() {
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();
    const { register, isLoading, error } = useAuthStore();
    const { showSuccess, showError } = useToast(); // Sử dụng custom toast
    const form = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            email: '',
            password: '',
            display_name: '',
        },
    });

    const password = form.watch('password');

    // Password requirements with real-time validation
    const passwordRequirements = useMemo((): PasswordRequirement[] => {
        if (!password) {
            return [
                { id: 'length', text: 'At least 6 characters long', regex: /.{6,}/, met: false },
                { id: 'uppercase', text: 'One uppercase letter (A-Z)', regex: /[A-Z]/, met: false },
                { id: 'lowercase', text: 'One lowercase letter (a-z)', regex: /[a-z]/, met: false },
                { id: 'number', text: 'One number (0-9)', regex: /[0-9]/, met: false },
                { id: 'special', text: 'One special character (!@#$%^&*)', regex: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/, met: false },
            ];
        }

        return [
            { id: 'length', text: 'At least 6 characters long', regex: /.{6,}/, met: password.length >= 6 },
            { id: 'uppercase', text: 'One uppercase letter (A-Z)', regex: /[A-Z]/, met: /[A-Z]/.test(password) },
            { id: 'lowercase', text: 'One lowercase letter (a-z)', regex: /[a-z]/, met: /[a-z]/.test(password) },
            { id: 'number', text: 'One number (0-9)', regex: /[0-9]/, met: /[0-9]/.test(password) },
            { id: 'special', text: 'One special character (!@#$%^&*)', regex: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/, met: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password) },
        ];
    }, [password]);

    const onSubmit = async (data: RegisterFormData) => {
        const result = await register(data.email, data.password, data.display_name);
        if (result) {
            // Registration successful
            showSuccess('Registration successful! Please sign in.');
            router.push('/login');
        } else {
            // Registration failed - show error toast
            if (error) {
                showError(error);
            } else {
                showError('Registration failed. Please try again.');
            }
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="display_name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-text-primary">Display Name</FormLabel>
                            <FormControl>
                                <Input
                                    type="text"
                                    placeholder="Enter your display name"
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
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="Enter your password"
                                        className="bg-transparent border-card-border text-text-primary placeholder:text-text-muted focus:border-nebula-purple focus:ring-nebula-purple pr-10 h-12 text-base"
                                        autoComplete="new-password"
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
                            <div className="text-xs text-text-muted mt-2 p-3 bg-transparent border border-card-border rounded-lg backdrop-filter blur(10px)">
                                <div className="font-medium mb-2">Password Requirements:</div>
                                <ul className="space-y-2 text-xs">
                                    {passwordRequirements.map((requirement) => (
                                        <li key={requirement.id} className="flex items-center space-x-2">
                                            <div className={`flex-shrink-0 w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${requirement.met
                                                ? 'border-green-400 bg-green-400'
                                                : 'border-text-muted'
                                                }`}>
                                                {requirement.met && (
                                                    <Check className="w-2.5 h-2.5 text-white password-requirement-check" />
                                                )}
                                            </div>
                                            <span className={`transition-colors duration-300 ${requirement.met ? 'text-green-400' : 'text-text-muted'
                                                }`}>
                                                {requirement.text}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
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
                            Creating Your Account...
                        </>
                    ) : (
                        'Launch Your Adventure'
                    )}
                </Button>
            </form>
        </Form>
    );
}
