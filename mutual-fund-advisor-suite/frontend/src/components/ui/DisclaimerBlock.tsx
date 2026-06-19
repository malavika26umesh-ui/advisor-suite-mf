import React from 'react';
import { Warning } from '@phosphor-icons/react';
import { PRIMARY_DISCLAIMER, PERFORMANCE_DISCLAIMER, BOOKING_CTA_TEXT } from '../../utils/compliance';

export type DisclaimerVariant = 'primary' | 'performance';

export interface DisclaimerBlockProps {
  variant: DisclaimerVariant;
  showBookingCta?: boolean;
  onBookingCtaClick?: () => void;
  className?: string;
}

const DISCLAIMER_TEXT: Record<DisclaimerVariant, string> = {
  primary: PRIMARY_DISCLAIMER,
  performance: PERFORMANCE_DISCLAIMER,
};

export const DisclaimerBlock: React.FC<DisclaimerBlockProps> = ({
  variant,
  showBookingCta = false,
  onBookingCtaClick,
  className = '',
}) => {
  const text = DISCLAIMER_TEXT[variant];

  return (
    <div
      role="note"
      aria-label="Compliance disclaimer"
      className={[
        'flex gap-3 px-4 py-3 rounded-r-lg',
        'bg-disclaimer-bg border-l-4 border-disclaimer-border',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <Warning
        size={16}
        weight="fill"
        className="shrink-0 mt-0.5 text-disclaimer-border"
        aria-hidden="true"
      />
      <div className="flex flex-col gap-1">
        <p className="text-disclaimer text-neutral-600 leading-[1.55]">{text}</p>
        {showBookingCta && (
          <button
            type="button"
            onClick={onBookingCtaClick}
            className="self-start text-disclaimer text-brand-teal underline hover:text-teal-700 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal"
          >
            {BOOKING_CTA_TEXT}
          </button>
        )}
      </div>
    </div>
  );
};

export default DisclaimerBlock;
