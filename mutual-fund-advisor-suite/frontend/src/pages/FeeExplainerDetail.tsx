import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CaretRight } from '@phosphor-icons/react';
import { Card, SourceBadge, DisclaimerBlock, Skeleton } from '../components/ui';
import { faqService } from '../services/faq.service';
import type { FeeExplainerContent } from '../types';

export const FeeExplainerDetail: React.FC = () => {
  const [data, setData] = useState<FeeExplainerContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const result = await faqService.getFeeExplainer();
        setData(result);
      } catch (err) {
        console.error('Error fetching fee explainer details:', err);
        setError('Failed to load fee explainer details.');
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
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
        month: 'long',
        year: 'numeric'
      });
    } catch {
      return dateStr;
    }
  };

  if (loading) {
    return (
      <div className="max-w-max-width mx-auto px-4 py-8 md:py-12">
        <Skeleton variant="text" width="200px" height="16px" className="mb-6" />
        <Skeleton variant="text" width="300px" height="32px" className="mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} variant="card" width="100%" height="120px" className="rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="max-w-max-width mx-auto px-4 py-12 text-center">
        <h2 className="text-xl font-bold text-neutral-800 mb-4">Explainer Unavailable</h2>
        <p className="text-neutral-600 mb-6">{error || 'Fee explainer details could not be retrieved.'}</p>
        <Link to="/faq" className="text-brand-teal font-semibold hover:underline">
          Return to FAQ Centre
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-max-width mx-auto px-4 py-8 md:py-12">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs font-body font-semibold text-neutral-500 mb-6" aria-label="Breadcrumb">
        <Link to="/" className="hover:text-brand-teal transition-colors">
          Home
        </Link>
        <CaretRight size={10} className="text-neutral-400" />
        <Link to="/faq" className="hover:text-brand-teal transition-colors">
          FAQ Centre
        </Link>
        <CaretRight size={10} className="text-neutral-400" />
        <span className="text-neutral-800">
          Fee Explainer
        </span>
      </nav>

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-200 pb-6 mb-8">
        <div>
          <span className="bg-info-50 border border-info-500 text-info-500 font-semibold text-xs px-2.5 py-1 rounded-full inline-flex items-center gap-1 mb-3">
            📌 Active Spotlight
          </span>
          <h1 className="font-heading text-text-h1 md:text-[32px] font-bold text-neutral-900 leading-tight">
            {data.fee_term}
          </h1>
        </div>
        <div className="text-left md:text-right shrink-0">
          <p className="text-xs text-neutral-500 font-medium">Version: v{data.version}</p>
          <p className="text-xs text-neutral-500 font-medium mt-1">Last Checked: {formatDate(data.updated_at)}</p>
        </div>
      </div>

      {/* 6 Numbered Bullet Cards (Grid) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {data.bullets.slice(0, 6).map((bullet, idx) => (
          <Card
            key={idx}
            variant="default"
            className="flex flex-col gap-4 border border-neutral-100 shadow-sm relative overflow-hidden group hover:border-brand-teal/40 transition-colors duration-200"
          >
            {/* Corner visual decoration */}
            <div className="absolute top-0 right-0 w-12 h-12 bg-neutral-50 rounded-bl-3xl group-hover:bg-info-50 transition-colors duration-200 flex items-center justify-center text-[10px] font-mono text-neutral-400 font-bold">
              #{idx + 1}
            </div>

            {/* Number Indicator */}
            <div className="w-8 h-8 rounded-full bg-brand-teal text-white flex items-center justify-center font-heading font-bold text-sm shrink-0 shadow-sm">
              {idx + 1}
            </div>

            {/* Bullet Text */}
            <p className="text-sm font-body font-medium text-neutral-700 leading-relaxed">
              {bullet}
            </p>
          </Card>
        ))}
      </div>

      {/* Sources Citation block */}
      {data.source_links.length > 0 && (
        <Card variant="default" className="flex flex-col gap-3 p-5 mb-8 border border-neutral-100 shadow-sm">
          <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
            Verified Source Documents
          </h3>
          <p className="text-xs text-neutral-600 font-body">
            This information is sourced directly from regulatory guidelines and official industry disclosures. Click below to verify the original circulars:
          </p>
          <div className="flex flex-wrap gap-2.5 mt-1">
            {data.source_links.map((link, idx) => (
              <SourceBadge
                key={`${link}-${idx}`}
                source={getSourceLabel(link)}
                href={link}
              />
            ))}
          </div>
        </Card>
      )}

      {/* Compliance Disclaimer */}
      <div className="mt-8 border-t border-neutral-200 pt-6">
        <DisclaimerBlock variant="primary" />
      </div>
    </div>
  );
};

export default FeeExplainerDetail;
