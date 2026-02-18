import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost';
    children: ReactNode;
    isLoading?: boolean;
}

export default function Button({
    variant = 'primary',
    children,
    isLoading = false,
    disabled,
    className = '',
    ...props
}: ButtonProps) {
    const baseStyles = 'px-6 py-3 rounded-xl font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2';

    const variants = {
        primary: 'bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white hover:shadow-[var(--shadow-glow)] hover:scale-[1.02] active:scale-[0.98]',
        secondary: 'glass text-white hover:bg-white/10 border border-white/20',
        ghost: 'text-[var(--foreground-muted)] hover:text-white hover:bg-white/5',
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${className}`}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading ? (
                <>
                    <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    Loading...
                </>
            ) : (
                children
            )}
        </button>
    );
}
