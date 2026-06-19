import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, SourceBadge, Skeleton } from '../../ui';
import { faqService } from '../../../services/faq.service';
import type { FeeExplainerContent } from '../../../types';

export const FeeExplainerPanel: React.FC = () => {
  const [data, setData] = useState<FeeExplainerContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeeExplainer = async () => {
      try {
        const result = await faqService.getFeeExplainer();
        setData(result);
      } catch (err) {
        console.error('Error fetching fee explainer:', err);
        setError('Failed to load fee explainer.');
      } finally {
        setLoading(false);
      }
    };

    fetchFeeExplainer();
  }, []);

  const getSourceLabel = (url: string): string => {
    if (url.toLowerCase().includes('sebi')) return 'SEBI';
    if (url.toLowerCase().includes('amfi')) return 'AMFI';
    return 'Source';
  };

  const formatDate = (dateStr: string): string => {
    if (!dateStr) return 'Recently';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return dateStr;
    }
  };

  if (loading) {
    return (
      <Card variant="default" className="flex flex-col gap-4">
        <Skeleton variant="badge" width="180px" height="24px" />
        <Skeleton variant="text" width="60%" height="24px" />
        <div className="flex flex-col gap-2 border-l-4 border-brand-teal bg-[#F0FAFB] p-4 rounded-r-lg">
          <Skeleton variant="text" width="90%" height="16px" />
          <Skeleton variant="text" width="95%" height="16px" />
          <Skeleton variant="text" width="85%" height="16px" />
        </div>
      </Card>
    );
  }

  if (error || !data) {
    return (
      <Card variant="default" className="p-5">
        <p className="text-sm font-medium text-neutral-600">Fee explainer currently unavailable.</p>
      </Card>
    );
  }

  return (
    <Card variant="default" className="flex flex-col gap-4 w-full">
      {/* Chip Header */}
      <div className="flex items-center justify-between">
        <span className="bg-info-50 border border-info-500 text-info-500 font-semibold text-xs px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
          📌 Fee Explainer — This Week
        </span>
        <span className="text-[11px] font-mono text-neutral-400">
          v{data.version}
        </span>
      </div>

      {/* Fee Term H3 */}
      <h3 className="font-heading text-text-h3 font-bold text-neutral-900 leading-snug">
        {data.fee_term}
      </h3>

      {/* 6 Bullet Points Card with Teal Left Border */}
      <div className="border-l-4 border-brand-teal bg-[#F0FAFB] p-4 rounded-r-xl shadow-sm flex flex-col gap-3">
        <ul className="flex flex-col gap-2.5">
          {data.bullets.slice(0, 6).map((bullet, idx) => (
            <li
              key={idx}
              className="text-[13px] font-body font-medium text-neutral-700 list-none relative pl-4 before:content-['•'] before:absolute before:left-0 before:text-brand-teal before:font-bold"
            >
              {bullet}
            </li>
          ))}
        </ul>
      </div>

      {/* Source badges row */}
      {data.source_links.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-neutral-100">
          <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">Sources:</span>
          <div className="flex flex-wrap gap-1.5">
            {data.source_links.map((link, idx) => (
              <SourceBadge
                key={`${link}-${idx}`}
                source={getSourceLabel(link)}
                href={link}
              />
            ))}
          </div>
        </div>
      )}

      {/* Footer info: Last checked, Link to detail */}
      <div className="flex items-center justify-between pt-2 border-t border-neutral-100 text-xs text-neutral-500">
        <span>Last checked: {formatDate(data.updated_at)}</span>
        <Link
          to="/faq/fee-explainer"
          className="text-brand-teal hover:underline font-semibold flex items-center gap-0.5"
        >
          View Full Details →
        </Link>
      </div>
    </Card>
  );
};
