import React, { useId } from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, id: idProp, className = '', ...rest }, ref) => {
    const generatedId = useId();
    const inputId = idProp ?? generatedId;
    const errorId = `${inputId}-error`;
    const helperId = `${inputId}-helper`;

    const describedBy = [error ? errorId : null, helperText ? helperId : null]
      .filter(Boolean)
      .join(' ');

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-[13px] font-medium text-neutral-700"
          >
            {label}
          </label>
        )}

        <input
          ref={ref}
          id={inputId}
          aria-describedby={describedBy || undefined}
          aria-invalid={!!error}
          className={[
            'h-11 w-full rounded-lg border px-[14px] text-[14px]',
            'bg-white text-neutral-800 placeholder-neutral-400',
            'transition-all duration-150 outline-none',
            error
              ? 'border-error-500 focus:border-error-500 focus:ring-2 focus:ring-error-500/20'
              : 'border-neutral-200 focus:border-brand-teal focus:ring-2 focus:ring-brand-teal/20',
            'disabled:bg-neutral-50 disabled:text-neutral-400 disabled:cursor-not-allowed',
            className,
          ]
            .filter(Boolean)
            .join(' ')}
          {...rest}
        />

        {helperText && !error && (
          <p id={helperId} className="text-[12px] text-neutral-400">
            {helperText}
          </p>
        )}

        {error && (
          <p id={errorId} role="alert" className="text-[12px] text-error-500">
            {error}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';

export default Input;
