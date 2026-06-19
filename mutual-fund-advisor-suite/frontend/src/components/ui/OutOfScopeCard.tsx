import React from 'react';
import { ProhibitInset } from '@phosphor-icons/react';

export interface OutOfScopeCardProps {
  schemeName?: string;
  onViewCoveredSchemes?: () => void;
  className?: string;
}

export const OutOfScopeCard: React.FC<OutOfScopeCardProps> = ({
  schemeName,
  onViewCoveredSchemes,
  className = '',
}) => (
  <div
    role="status"
    aria-live="polite"
    className={[
      'rounded-xl border border-dashed border-neutral-400 bg-neutral-50 p-5',
      className,
    ]
      .filter(Boolean)
      .join(' ')}
  >
    {/* Header */}
    <div className="flex items-start gap-3 mb-3">
      <ProhibitInset
        size={20}
        className="shrink-0 mt-0.5 text-neutral-400"
        aria-hidden="true"
      />
      <div>
        <h3 className="text-[14px] font-semibold text-neutral-800 mb-1">
          {schemeName
            ? `We don't have verified data for "${schemeName}" yet`
            : "We don't have verified data for this scheme yet"}
        </h3>
        <p className="text-[13px] text-neutral-600">
          Our knowledge base covers the top 20 AMFI-ranked schemes. This scheme is currently
          outside our corpus.
        </p>
      </div>
    </div>

    {/* Actions */}
    <div className="flex flex-wrap gap-4 ml-8">
      <a
        href="https://www.amfiindia.com"
        target="_blank"
        rel="noopener noreferrer"
        className="text-[13px] text-brand-teal underline hover:text-teal-700 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal"
      >
        Visit AMFI website →
      </a>
      {onViewCoveredSchemes && (
        <button
          type="button"
          onClick={onViewCoveredSchemes}
          className="text-[13px] text-brand-teal underline hover:text-teal-700 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal"
        >
          View covered schemes →
        </button>
      )}
    </div>
  </div>
);

export default OutOfScopeCard;
