import React from 'react';
import { ComplianceDeflectionCard } from '../../ui';

interface FAQDeflectionCardProps {
  queryText: string;
  onBookAdvisor: () => void;
  onContinueToFaq: () => void;
  onSuggestionClick: (suggestion: string) => void;
  suggestions?: string[];
}

const DEFAULT_SUGGESTIONS = [
  'What is the exit load for Parag Parikh Flexi Cap Fund?',
  'What is the TER of SBI Bluechip Fund?',
  'How are capital gains taxed?'
];

export const FAQDeflectionCard: React.FC<FAQDeflectionCardProps> = ({
  queryText,
  onBookAdvisor,
  onContinueToFaq,
  onSuggestionClick,
  suggestions = DEFAULT_SUGGESTIONS
}) => {
  return (
    <div className="w-full">
      <ComplianceDeflectionCard
        queryText={queryText}
        onBookAdvisor={onBookAdvisor}
        onContinueToFaq={onContinueToFaq}
        suggestions={suggestions}
        onSuggestionClick={onSuggestionClick}
      />
    </div>
  );
};
