import React, { useState } from 'react';
import { OutOfScopeCard, Skeleton } from '../../ui';
import { faqService } from '../../../services/faq.service';

interface FAQOutOfScopeCardProps {
  schemeName?: string | null;
}

export const FAQOutOfScopeCard: React.FC<FAQOutOfScopeCardProps> = ({ schemeName }) => {
  const [schemes, setSchemes] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const handleViewCoveredSchemes = async () => {
    if (expanded) {
      setExpanded(false);
      return;
    }
    setExpanded(true);
    if (schemes.length === 0) {
      setLoading(true);
      try {
        const list = await faqService.getCoveredSchemes();
        setSchemes(list);
      } catch (err) {
        console.error('Failed to fetch covered schemes:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="w-full flex flex-col gap-3">
      <OutOfScopeCard
        schemeName={schemeName || undefined}
        onViewCoveredSchemes={handleViewCoveredSchemes}
      />

      {expanded && (
        <div className="ml-8 p-4 bg-white border border-neutral-200 rounded-xl max-h-[220px] overflow-y-auto shadow-level-1 transition-all duration-250">
          <h4 className="text-xs font-semibold text-neutral-400 mb-2 uppercase tracking-wider">
            Covered Top 20 Schemes
          </h4>
          {loading ? (
            <div className="flex flex-col gap-2 mt-2">
              <Skeleton variant="text" width="90%" height="16px" />
              <Skeleton variant="text" width="80%" height="16px" />
              <Skeleton variant="text" width="85%" height="16px" />
            </div>
          ) : (
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
              {schemes.map((name, idx) => (
                <li
                  key={`${name}-${idx}`}
                  className="text-xs font-medium text-brand-teal hover:text-teal-700 list-disc list-inside truncate"
                  title={name}
                >
                  {name}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};
