import React, { useEffect, useState } from 'react';
import { CaretDown, CaretUp, Info } from '@phosphor-icons/react';
import { Card, Skeleton } from '../../ui';
import { faqService } from '../../../services/faq.service';

export const CoveredSchemesPanel: React.FC = () => {
  const [schemes, setSchemes] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    const fetchCoveredSchemes = async () => {
      try {
        const list = await faqService.getCoveredSchemes();
        setSchemes(list);
      } catch (err) {
        console.error('Error fetching covered schemes:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCoveredSchemes();
  }, []);

  return (
    <Card variant="default" className="flex flex-col gap-3 w-full relative">
      {/* Header and Toggle Button */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between w-full text-left font-heading text-text-h4 font-bold text-neutral-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal rounded px-1 py-0.5"
      >
        <span>Covered Schemes ({loading ? '...' : schemes.length})</span>
        <span className="text-neutral-500">
          {isExpanded ? <CaretUp size={16} weight="bold" /> : <CaretDown size={16} weight="bold" />}
        </span>
      </button>

      {/* Tooltip Row */}
      <div className="flex items-center gap-1.5 text-xs text-neutral-500 relative">
        <span>Curated Top 20 AMFI List</span>
        <div
          className="relative inline-flex items-center cursor-help"
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          onClick={() => setShowTooltip(!showTooltip)}
        >
          <Info size={14} className="text-brand-teal shrink-0" />
          {showTooltip && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-64 bg-neutral-900 text-white text-[11px] leading-relaxed p-2.5 rounded-lg shadow-level-3 z-30 pointer-events-none">
              <p>
                To maintain strict SEBI/AMFI compliance and absolute factual accuracy, our advisory corpus is focused on the top 20 mutual fund schemes by AUM.
              </p>
              <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-neutral-900"></div>
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={() => setShowTooltip(!showTooltip)}
          className="text-brand-teal hover:underline text-[11px] font-semibold ml-auto md:hidden"
        >
          Why only 20?
        </button>
        <span
          className="text-brand-teal hover:underline text-[11px] font-semibold ml-auto hidden md:inline cursor-help"
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          Why only 20 schemes?
        </span>
      </div>

      {/* Expandable Section */}
      {isExpanded && (
        <div className="mt-2 border-t border-neutral-100 pt-3">
          {loading ? (
            <div className="flex flex-col gap-1.5">
              <Skeleton variant="text" width="85%" height="14px" />
              <Skeleton variant="text" width="90%" height="14px" />
              <Skeleton variant="text" width="75%" height="14px" />
            </div>
          ) : (
            <div className="max-h-[200px] overflow-y-auto pr-1 flex flex-col gap-2 scrollbar-thin scrollbar-thumb-neutral-200 scrollbar-track-transparent">
              {schemes.map((name, idx) => (
                <div
                  key={`${name}-${idx}`}
                  className="text-[12px] font-medium text-brand-teal hover:text-teal-700 transition-colors py-0.5 truncate"
                  title={name}
                >
                  {name}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </Card>
  );
};
