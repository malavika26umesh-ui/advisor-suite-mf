import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowSquareOut } from '@phosphor-icons/react';
import { Card, SourceBadge, DisclaimerBlock, Button } from '../../ui';
import type { FAQAnswer } from '../../../types';

interface FAQAnswerCardProps {
  query: string;
  answer: FAQAnswer;
}

export const FAQAnswerCard: React.FC<FAQAnswerCardProps> = ({ query, answer }) => {
  const navigate = useNavigate();
  const { answer_text, source_badges = [], source_urls = [], has_nav_data = false } = answer;

  const handleBookAdvisor = () => {
    navigate('/schedule');
  };

  return (
    <Card variant="default" className="flex flex-col gap-6 w-full">
      {/* User question bubble */}
      <div className="flex justify-start">
        <div className="bg-neutral-50 rounded-2xl px-4 py-3 max-w-[85%] border border-neutral-100">
          <p className="text-xs text-neutral-400 font-semibold mb-1 uppercase tracking-wider">Your Question</p>
          <p className="text-[15px] font-medium text-neutral-800 leading-normal">{query}</p>
        </div>
      </div>

      {/* Answer text */}
      <div className="text-neutral-800">
        <p className="font-body text-[16px] leading-[1.6] font-normal text-neutral-850">
          {answer_text}
        </p>
      </div>

      {/* Source Row */}
      {source_badges.length > 0 && (
        <div className="flex flex-wrap items-center gap-3 py-2 border-t border-b border-neutral-100">
          <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Sources:</span>
          <div className="flex flex-wrap gap-2">
            {source_badges.map((badge, idx) => {
              const url = source_urls[idx] || source_urls[0] || '#';
              return (
                <SourceBadge
                  key={`${badge}-${idx}`}
                  source={badge}
                  href={url}
                />
              );
            })}
          </div>
          {source_urls.length > 0 && (
            <a
              href={source_urls[0]}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-brand-teal hover:text-teal-700 font-medium inline-flex items-center gap-1 ml-auto"
              aria-label="View source document"
            >
              View Document
              <ArrowSquareOut size={12} aria-hidden="true" />
            </a>
          )}
        </div>
      )}

      {/* Disclaimers (Must appear on every answer state) */}
      <div className="flex flex-col gap-3">
        {/* Primary Disclaimer (Verbatim, always shown) */}
        <DisclaimerBlock variant="primary" />

        {/* Performance Disclaimer (Shown only if has_nav_data = true) */}
        {has_nav_data && (
          <DisclaimerBlock variant="performance" />
        )}
      </div>

      {/* Book a call CTA */}
      <div className="flex justify-center border-t border-neutral-100 pt-4">
        <Button
          variant="ghost"
          onClick={handleBookAdvisor}
          className="text-brand-teal hover:text-teal-800 font-heading text-sm"
        >
          Book a call with a SEBI-registered advisor →
        </Button>
      </div>
    </Card>
  );
};
