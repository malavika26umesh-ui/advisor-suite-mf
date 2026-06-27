import React, { useState } from 'react';
import { OutOfScopeCard } from '../../ui';

const COVERED_SCHEMES = [
  'Parag Parikh Flexi Cap Fund',
  'SBI Bluechip Fund',
  'ICICI Prudential Bluechip Fund',
  'HDFC Flexi Cap Fund',
  'ICICI Prudential Value Discovery Fund',
  'Nippon India Large Cap Fund',
  'Nippon India Small Cap Fund',
  'SBI Small Cap Fund',
  'HDFC Mid-Cap Opportunities Fund',
  'Kotak Emerging Equity Fund',
];

interface FAQOutOfScopeCardProps {
  schemeName?: string | null;
}

export const FAQOutOfScopeCard: React.FC<FAQOutOfScopeCardProps> = ({ schemeName }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="w-full flex flex-col gap-3">
      <OutOfScopeCard
        schemeName={schemeName || undefined}
        onViewCoveredSchemes={() => setExpanded(prev => !prev)}
      />

      {expanded && (
        <div className="ml-8 p-4 bg-white border border-neutral-200 rounded-xl max-h-[220px] overflow-y-auto shadow-level-1 transition-all duration-250">
          <h4 className="text-xs font-semibold text-neutral-400 mb-2 uppercase tracking-wider">
            Covered Top 10 Schemes
          </h4>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
            {COVERED_SCHEMES.map((name, idx) => (
              <li
                key={`${name}-${idx}`}
                className="text-xs font-medium text-brand-teal hover:text-teal-700 list-disc list-inside break-words leading-snug"
                title={name}
              >
                {name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
