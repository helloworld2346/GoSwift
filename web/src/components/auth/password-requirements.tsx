import { Check } from 'lucide-react';
import { PasswordRequirement } from '@/hooks/usePasswordRequirements';

interface PasswordRequirementsProps {
    requirements: PasswordRequirement[];
    className?: string;
}

export function PasswordRequirements({
    requirements,
    className = ''
}: PasswordRequirementsProps) {
    return (
        <div className={`space-y-2 ${className}`}>
            <p className="text-sm text-text-muted mb-3">
                Password requirements:
            </p>
            <ul className="space-y-2">
                {requirements.map((requirement) => (
                    <li key={requirement.id} className="flex items-center space-x-2">
                        <div className={`flex-shrink-0 w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${requirement.met
                            ? 'border-green-400 bg-green-400'
                            : requirement.hasError
                                ? 'border-red-400 bg-red-400'
                                : 'border-text-muted'
                            }`}>
                            {requirement.met && (
                                <Check className="w-2.5 h-2.5 text-white password-requirement-check" />
                            )}
                            {requirement.hasError && !requirement.met && (
                                <span className="w-2.5 h-2.5 text-white text-xs font-bold flex items-center justify-center leading-none">!</span>
                            )}
                        </div>
                        <span className={`transition-colors duration-300 ${requirement.met
                            ? 'text-green-400'
                            : requirement.hasError
                                ? 'text-red-400'
                                : 'text-text-muted'
                            }`}>
                            {requirement.text}
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    );
}
