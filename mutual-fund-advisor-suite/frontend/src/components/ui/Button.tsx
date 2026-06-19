import React from 'react';
import { CircleNotch } from '@phosphor-icons/react';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'destructive';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-brand-saffron text-white hover:bg-warning-500 focus-visible:ring-brand-saffron disabled:bg-neutral-200 disabled:text-neutral-400',
  secondary:
    'border border-brand-navy text-brand-navy bg-transparent hover:bg-indigo-50 focus-visible:ring-brand-navy disabled:border-neutral-200 disabled:text-neutral-400',
  ghost:
    'text-brand-teal underline bg-transparent hover:text-teal-700 focus-visible:ring-brand-teal disabled:text-neutral-400 disabled:no-underline',
  destructive:
    'bg-error-500 text-white hover:bg-red-700 focus-visible:ring-error-500 disabled:bg-neutral-200 disabled:text-neutral-400',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-6 py-3 text-[15px]',
  lg: 'px-8 py-4 text-base',
};

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  disabled,
  children,
  className = '',
  ...rest
}) => {
  const isDisabled = disabled || loading;

  return (
    <button
      disabled={isDisabled}
      aria-disabled={isDisabled}
      className={[
        'inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-colors duration-150',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
        'disabled:cursor-not-allowed',
        variantClasses[variant],
        sizeClasses[size],
        fullWidth ? 'w-full' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...rest}
    >
      {loading ? (
        <>
          <CircleNotch className="animate-spin" size={16} aria-hidden="true" />
          <span className="sr-only">Loading…</span>
        </>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
