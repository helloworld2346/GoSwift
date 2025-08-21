import { useMemo } from 'react';
import { UseFormReturn } from 'react-hook-form';

export interface PasswordRequirement {
    id: string;
    text: string;
    regex: RegExp;
    met: boolean;
    hasError: boolean;
}

interface UsePasswordRequirementsProps {
    form: UseFormReturn<any>;
    passwordFieldName?: string;
}

export function usePasswordRequirements({
    form,
    passwordFieldName = 'password'
}: UsePasswordRequirementsProps) {
    const password = form.watch(passwordFieldName);
    const passwordErrors = form.formState.errors[passwordFieldName]?.message;

    const passwordRequirements = useMemo((): PasswordRequirement[] => {
        const hasPasswordError = !!passwordErrors;

        if (!password) {
            return [
                {
                    id: 'length',
                    text: 'At least 6 characters long',
                    regex: /.{6,}/,
                    met: false,
                    hasError: hasPasswordError
                },
                {
                    id: 'uppercase',
                    text: 'One uppercase letter (A-Z)',
                    regex: /[A-Z]/,
                    met: false,
                    hasError: hasPasswordError
                },
                {
                    id: 'lowercase',
                    text: 'One lowercase letter (a-z)',
                    regex: /[a-z]/,
                    met: false,
                    hasError: hasPasswordError
                },
                {
                    id: 'number',
                    text: 'One number (0-9)',
                    regex: /[0-9]/,
                    met: false,
                    hasError: hasPasswordError
                },
                {
                    id: 'special',
                    text: 'One special character (!@#$%^&*)',
                    regex: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,
                    met: false,
                    hasError: hasPasswordError
                },
            ];
        }

        return [
            {
                id: 'length',
                text: 'At least 6 characters long',
                regex: /.{6,}/,
                met: password.length >= 6,
                hasError: hasPasswordError && password.length < 6
            },
            {
                id: 'uppercase',
                text: 'One uppercase letter (A-Z)',
                regex: /[A-Z]/,
                met: /[A-Z]/.test(password),
                hasError: hasPasswordError && !/[A-Z]/.test(password)
            },
            {
                id: 'lowercase',
                text: 'One lowercase letter (a-z)',
                regex: /[a-z]/,
                met: /[a-z]/.test(password),
                hasError: hasPasswordError && !/[a-z]/.test(password)
            },
            {
                id: 'number',
                text: 'One number (0-9)',
                regex: /[0-9]/,
                met: /[0-9]/.test(password),
                hasError: hasPasswordError && !/[0-9]/.test(password)
            },
            {
                id: 'special',
                text: 'One special character (!@#$%^&*)',
                regex: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,
                met: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
                hasError: hasPasswordError && !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
            },
        ];
    }, [password, passwordErrors]);

    return {
        passwordRequirements,
        password,
        hasPasswordError: !!passwordErrors
    };
}
