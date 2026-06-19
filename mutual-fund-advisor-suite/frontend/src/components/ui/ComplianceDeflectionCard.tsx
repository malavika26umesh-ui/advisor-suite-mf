import React from 'react';
import { ShieldCheck } from '@phosphor-icons/react';
import { Button } from './Button';
import { TopicPill } from './TopicPill';

export interface ComplianceDeflectionCardProps {
  queryText?: string;
  onBookAdvisor: () => void;
  onContinueToFaq: () => void;
  suggestions?: string[];
  onSuggestionClick?: (suggestion: string) => void;
  className?: string;
}

export const ComplianceDeflectionCard: React.FC<ComplianceDeflectionCardProps> = ({
  queryText,
  onBookAdvisor,
  onContinueToFaq,
  suggestions = [],
  onSuggestionClick,
  className = '',
}) => (
  <div
    role="alert"
    aria-live="polite"
    className={[
      'rounded-lg border border-warning-500 bg-[#FEF3C7] p-5',
      className,
    ]
      .filter(Boolean)
      .join(' ')}
  >
    {/* Header */}
    <div className="flex items-start gap-3 mb-3">
      <ShieldCheck
        size={20}
        weight="fill"
        className="shrink-0 mt-0.5 text-warning-500"
        aria-hidden="true"
      />
      <div>
        <h3 className="text-[14px] font-semibold text-neutral-800 mb-1">
          This question needs personalised advice
        </h3>
        {queryText && (
          <p className="text-[13px] text-neutral-600 italic">"{queryText}"</p>
        )}
      </div>
    </div>

    {/* Body */}
    <p className="text-[13px] text-neutral-700 mb-4 ml-8">
      As a SEBI-compliant information platform, we can share factual information but cannot
      provide personalised investment advice. For guidance tailored to your situation, please
      speak to a SEBI-registered investment advisor.
    </p>

    {/* Topic suggestions */}
    {suggestions.length > 0 && (
      <div className="flex flex-wrap gap-2 mb-4 ml-8">
        {suggestions.map((s) => (
          <TopicPill
            key={s}
            label={s}
            selected={false}
            onClick={() => onSuggestionClick?.(s)}
          />
        ))}
      </div>
    )}

    {/* Actions */}
    <div className="flex flex-wrap gap-3 ml-8">
      <Button variant="primary" size="sm" onClick={onBookAdvisor}>
        Book a call with an advisor
      </Button>
      <Button variant="secondary" size="sm" onClick={onContinueToFaq}>
        Continue to FAQ
      </Button>
    </div>
  </div>
);

export default ComplianceDeflectionCard;
