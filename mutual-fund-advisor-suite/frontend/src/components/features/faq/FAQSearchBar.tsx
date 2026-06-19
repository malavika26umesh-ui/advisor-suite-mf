import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MagnifyingGlass, Microphone, X } from '@phosphor-icons/react';
import { Button } from '../../ui';
import { useToast } from '../../ui/Toast';
import { faqService } from '../../../services/faq.service';
import type { FAQResponse } from '../../../types';

interface FAQSearchBarProps {
  sessionId: string;
  onSearchStart: (query: string) => void;
  onSearchResult: (result: FAQResponse, query: string) => void;
  onSearchError: (error: any) => void;
  isLoading?: boolean;
  query?: string;
}

const TOPIC_LABELS: Record<string, string> = {
  fees: 'Fees & charges',
  scheme: 'Scheme details',
  processes: 'Processes',
  regulatory: 'Regulatory questions',
  fund_categories: 'Types of mutual funds',
  sip: 'How SIPs work',
  tax: 'Tax implications',
  investor_rights: 'My rights as an investor',
  other: 'Something else'
};

export const FAQSearchBar: React.FC<FAQSearchBarProps> = ({
  sessionId,
  onSearchStart,
  onSearchResult,
  onSearchError,
  isLoading = false,
  query: queryProp
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState('');
  const { addToast } = useToast();
  const topicParam = searchParams.get('topic');

  // Sync with parent query prop
  useEffect(() => {
    if (queryProp !== undefined) {
      setQuery(queryProp);
    }
  }, [queryProp]);

  // Load and search on mount if ?topic= is present
  useEffect(() => {
    if (topicParam && TOPIC_LABELS[topicParam]) {
      // Pre-populate query depending on the topic
      const defaultQueries: Record<string, string> = {
        fees: 'What are the exit load charges?',
        scheme: 'Show me the details of Parag Parikh Flexi Cap Fund',
        processes: 'How do I start a SIP?',
        regulatory: 'What are the SEBI regulations for expense ratios?',
        fund_categories: 'What are the different types of mutual funds?',
        sip: 'How does a SIP work?',
        tax: 'What are the tax implications on mutual fund returns?',
        investor_rights: 'What are my rights as a mutual fund investor?'
      };
      const prefilled = defaultQueries[topicParam] || '';
      setQuery(prefilled);
    }
  }, [topicParam]);

  const handleSearch = async (searchQuery: string) => {
    const trimmed = searchQuery.trim();
    if (!trimmed) return;

    onSearchStart(trimmed);
    try {
      const res = await faqService.queryFAQ(trimmed, sessionId);
      onSearchResult(res, trimmed);
    } catch (err: any) {
      console.error('FAQ Search error:', err);
      onSearchError(err);
      addToast(err.response?.data?.detail || 'Failed to search FAQ. Please try again.', 'error');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(query);
  };

  const handleMicClick = () => {
    addToast('Voice search will be enabled in Sprint 12.', 'info');
  };

  const handleClearTopic = () => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('topic');
    setSearchParams(newParams);
    setQuery('');
  };

  return (
    <div className="w-full flex flex-col gap-3">
      <form
        onSubmit={handleSubmit}
        className="w-full h-[52px] bg-white border border-neutral-200 focus-within:border-brand-teal focus-within:ring-2 focus-within:ring-brand-teal/20 rounded-xl shadow-level-1 flex items-center transition-all duration-200 overflow-hidden"
      >
        {/* Search Icon Left */}
        <div className="pl-4 pr-2 text-neutral-400 shrink-0">
          <MagnifyingGlass size={20} weight="bold" />
        </div>

        {/* Input */}
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask a question about fees, NAVs, or covered schemes..."
          className="flex-1 bg-transparent border-none outline-none text-neutral-800 text-[15px] font-body font-medium placeholder-neutral-400 focus:ring-0 focus:outline-none h-full py-2"
          disabled={isLoading}
        />

        {/* Mic Icon Right */}
        <button
          type="button"
          onClick={handleMicClick}
          className="p-2 mr-1 text-brand-teal hover:text-teal-700 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-teal rounded-full shrink-0"
          aria-label="Voice input"
          disabled={isLoading}
        >
          <Microphone size={20} weight="fill" />
        </button>

        {/* Ask Button Saffron */}
        <Button
          type="submit"
          disabled={!query.trim() || isLoading}
          className="h-full rounded-r-xl rounded-l-none px-6 bg-brand-saffron hover:bg-amber-600 text-white font-heading text-sm font-semibold flex items-center justify-center shrink-0 border-none outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus:ring-0"
        >
          Ask
        </Button>
      </form>

      {/* Topic Chip below Search Bar */}
      {topicParam && TOPIC_LABELS[topicParam] && (
        <div className="flex items-center gap-2 self-start bg-source-badge-bg border border-[#BFDBFE] px-3 py-1.5 rounded-full text-xs font-semibold text-source-badge-text">
          <span>Topic: {TOPIC_LABELS[topicParam]}</span>
          <button
            type="button"
            onClick={handleClearTopic}
            className="hover:text-blue-800 transition-colors rounded-full"
            aria-label="Clear topic filter"
          >
            <X size={12} weight="bold" />
          </button>
        </div>
      )}
    </div>
  );
};
