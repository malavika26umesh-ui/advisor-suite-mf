import React, { useState, useCallback } from 'react';
import { CopySimple, Check } from '@phosphor-icons/react';

export interface BookingCodeDisplayProps {
  code: string;
  showCopy?: boolean;
  className?: string;
}

export const BookingCodeDisplay: React.FC<BookingCodeDisplayProps> = ({
  code,
  showCopy = true,
  className = '',
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API not available — silent failure
    }
  }, [code]);

  return (
    <div className={['flex flex-col items-center gap-2', className].filter(Boolean).join(' ')}>
      <p className="text-[13px] font-medium text-neutral-600 uppercase tracking-wide">
        Your Booking Code
      </p>

      <div className="flex items-center gap-3">
        <div
          className="flex items-center justify-center px-8 py-4 rounded-lg border-2 border-brand-navy bg-neutral-50"
          aria-label={`Booking code: ${code}`}
        >
          <span className="font-mono text-[28px] font-bold text-brand-navy tracking-widest">
            {code}
          </span>
        </div>

        {showCopy && (
          <button
            type="button"
            onClick={handleCopy}
            aria-label={copied ? 'Copied!' : 'Copy booking code to clipboard'}
            title={copied ? 'Copied!' : 'Copy to clipboard'}
            className={[
              'flex items-center justify-center w-10 h-10 rounded-lg border transition-all duration-150',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal',
              copied
                ? 'bg-success-50 border-success-500 text-success-500'
                : 'bg-white border-neutral-200 text-neutral-600 hover:border-brand-teal hover:text-brand-teal',
            ].join(' ')}
          >
            {copied ? (
              <Check size={18} weight="bold" aria-hidden="true" />
            ) : (
              <CopySimple size={18} aria-hidden="true" />
            )}
          </button>
        )}
      </div>

      {copied && (
        <p role="status" aria-live="polite" className="text-[12px] text-success-500">
          Copied to clipboard!
        </p>
      )}
    </div>
  );
};

export default BookingCodeDisplay;
