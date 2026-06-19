import React, { useId } from 'react';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  maxLength?: number;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      error,
      helperText,
      maxLength,
      id: idProp,
      value,
      onChange,
      className = '',
      ...rest
    },
    ref,
  ) => {
    const generatedId = useId();
    const textareaId = idProp ?? generatedId;
    const errorId = `${textareaId}-error`;
    const helperId = `${textareaId}-helper`;
    const counterId = `${textareaId}-counter`;

    const currentLength = typeof value === 'string' ? value.length : 0;

    const describedBy = [
      error ? errorId : null,
      helperText ? helperId : null,
      maxLength != null ? counterId : null,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={textareaId}
            className="text-[13px] font-medium text-neutral-700"
          >
            {label}
          </label>
        )}

        <textarea
          ref={ref}
          id={textareaId}
          maxLength={maxLength}
          value={value}
          onChange={onChange}
          aria-describedby={describedBy || undefined}
          aria-invalid={!!error}
          className={[
            'w-full rounded-lg border px-[14px] py-3 text-[14px]',
            'bg-white text-neutral-800 placeholder-neutral-400',
            'transition-all duration-150 outline-none resize-y min-h-[96px]',
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

        {/* Bottom row: helper/error left, character counter right */}
        <div className="flex justify-between items-start gap-2">
          <div>
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

          {maxLength != null && (
            <p
              id={counterId}
              aria-live="polite"
              className={[
                'text-[12px] shrink-0 ml-auto',
                currentLength >= maxLength ? 'text-error-500' : 'text-neutral-400',
              ].join(' ')}
            >
              {currentLength}/{maxLength}
            </p>
          )}
        </div>
      </div>
    );
  },
);

Textarea.displayName = 'Textarea';

export default Textarea;
