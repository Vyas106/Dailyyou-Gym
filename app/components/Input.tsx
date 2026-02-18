import { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    icon?: React.ReactNode;
}

export default function Input({
    label,
    error,
    icon,
    className = '',
    id,
    ...props
}: InputProps) {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
        <div className="w-full">
            {label && (
                <label
                    htmlFor={inputId}
                    className="block text-sm font-medium text-[var(--foreground-muted)] mb-2"
                >
                    {label}
                </label>
            )}
            <div className="relative">
                {icon && (
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--foreground-subtle)]">
                        {icon}
                    </div>
                )}
                <input
                    id={inputId}
                    className={`
            w-full px-4 py-3 
            ${icon ? 'pl-12' : 'px-4'}
            bg-[var(--background-lighter)] 
            border border-white/10
            rounded-xl 
            text-white 
            placeholder:text-[var(--foreground-subtle)]
            focus:outline-none 
            focus:border-[var(--primary)]
            focus:ring-2
            focus:ring-[var(--primary)]/20
            transition-all
            ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}
            ${className}
          `}
                    {...props}
                />
            </div>
            {error && (
                <p className="mt-2 text-sm text-red-400">{error}</p>
            )}
        </div>
    );
}
