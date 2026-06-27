import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CaretDown, CaretUp, ArrowClockwise, BookOpen, Question, ChatCenteredText } from '@phosphor-icons/react';
import {
  FAQSearchBar,
  FAQAnswerCard,
  FAQDeflectionCard,
  FAQOutOfScopeCard,
  FeeExplainerPanel,
  CoveredSchemesPanel
} from '../components/features/faq';
import { Card, DisclaimerBlock, Skeleton, Button, Input } from '../components/ui';
import { faqService } from '../services/faq.service';
import type { FAQResponse } from '../types';

type FAQState = 'idle' | 'loading' | 'answered' | 'deflected' | 'out_of_scope' | 'no_answer' | 'clarification_needed';

export const FAQCentre: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const topicParam = searchParams.get('topic');
  const qParam = searchParams.get('q');

  // Scheme pill two-stage selection
  const [selectedSchemePill, setSelectedSchemePill] = useState<string | null>(null);

  // State Machine
  const [state, setState] = useState<FAQState>('idle');
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState<FAQResponse | null>(null);
  const [followUpText, setFollowUpText] = useState('');
  const [followUpLoading, setFollowUpLoading] = useState(false);
  const [clarificationText, setClarificationText] = useState('');
  
  // Mobile accordion state for sidebar panels
  const [isSidebarMobileExpanded, setIsSidebarMobileExpanded] = useState(false);

  // Generate / Retrieve session_id
  const [sessionId] = useState(() => {
    const stored = sessionStorage.getItem('faq_session_id');
    if (stored) return stored;
    const val = 'faq-session-' + Math.random().toString(36).substring(2, 15);
    sessionStorage.setItem('faq_session_id', val);
    return val;
  });

  // Handle auto-searching on mount if ?topic= is present
  useEffect(() => {
    if (topicParam) {
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
      const prefilled = defaultQueries[topicParam];
      if (prefilled) {
        setQuery(prefilled);
        triggerAutoSearch(prefilled);
      }
    }
  }, [topicParam]);

  // Handle auto-searching on mount if ?q= is present (arrives here from the
  // Query Builder's RoutingStep, which routes "factual" queries to /faq?q=...).
  useEffect(() => {
    if (qParam && qParam.trim()) {
      setQuery(qParam);
      triggerAutoSearch(qParam);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qParam]);

  const triggerAutoSearch = async (prefilledQuery: string) => {
    setState('loading');
    try {
      const res = await faqService.queryFAQ(prefilledQuery, sessionId);
      handleSearchResult(res, prefilledQuery);
    } catch (err) {
      console.error('Auto search error:', err);
      setState('no_answer');
    }
  };

  const handleSearchStart = (searchQuery: string) => {
    setQuery(searchQuery);
    setState('loading');
    setResponse(null);
  };

  const handleSearchResult = (result: FAQResponse, searchQuery: string) => {
    setQuery(searchQuery);
    setResponse(result);
    setFollowUpText('');

    // Map backend status to frontend state machine
    if (result.status === 'answered') {
      if (result.answer?.clarification_needed) {
        setState('clarification_needed');
      } else {
        setState('answered');
      }
    } else if (result.status === 'advice_deflected') {
      setState('deflected');
    } else if (result.status === 'out_of_scope') {
      setState('out_of_scope');
    } else if (result.status === 'no_answer') {
      setState('no_answer');
    } else if (result.status === 'clarification_needed') {
      setState('clarification_needed');
    } else {
      setState('no_answer');
    }
  };

  const handleSearchError = () => {
    setState('no_answer');
  };

  const handleFollowUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = followUpText.trim();
    if (!trimmed) return;

    setFollowUpLoading(true);
    // Combine follow up query into standard loading state for the main card, or show loading on follow-up
    try {
      const res = await faqService.queryFAQ(trimmed, sessionId);
      handleSearchResult(res, trimmed);
    } catch (err) {
      console.error('Follow-up error:', err);
      setState('no_answer');
    } finally {
      setFollowUpLoading(false);
    }
  };

  const handleClarificationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = clarificationText.trim();
    if (!trimmed) return;

    setState('loading');
    try {
      // Send the clarified query back
      const res = await faqService.queryFAQ(`${query} (Clarification: ${trimmed})`, sessionId);
      handleSearchResult(res, `${query} - ${trimmed}`);
      setClarificationText('');
    } catch (err) {
      console.error('Clarification submit error:', err);
      setState('no_answer');
    }
  };

  const handleReset = () => {
    setState('idle');
    setQuery('');
    setResponse(null);
    setFollowUpText('');
    setClarificationText('');
  };

  const handleSuggestionClick = (suggestionText: string) => {
    handleSearchStart(suggestionText);
    triggerAutoSearch(suggestionText);
  };

  return (
    <div className="max-w-max-width mx-auto px-4 py-8 md:py-12">
      {/* Page Header */}
      <div className="mb-8 md:mb-10 text-center md:text-left">
        <h1 className="font-heading text-text-h1 md:text-[36px] font-bold text-neutral-900 mb-2">
          FAQ Centre
        </h1>
        <p className="text-[16px] text-neutral-600 leading-relaxed max-w-2xl font-body">
          Search SEBI-compliant information about mutual fund costs, calculations, rules, and covered schemes.
        </p>
      </div>

      {/* Main Layout: 2 Columns on Desktop, 1 Column on Mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column (65% main) */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Search Bar + Scheme Pills */}
          <div className="flex flex-col gap-3">
            <FAQSearchBar
              sessionId={sessionId}
              onSearchStart={handleSearchStart}
              onSearchResult={handleSearchResult}
              onSearchError={handleSearchError}
              isLoading={state === 'loading' || followUpLoading}
              query={query}
            />
            {/* Two-stage scheme picker: pick scheme → pick parameter → fire precise query */}
            <div className="flex flex-col gap-2">
              <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                Ask about NAV, AUM or Exit Load for any of these 10 covered schemes:
              </p>
              <div className="flex flex-wrap gap-2">
                {[
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
                ].map((name) => (
                  <button
                    key={name}
                    type="button"
                    onClick={() => setSelectedSchemePill(prev => prev === name ? null : name)}
                    className={`text-[11px] font-medium border transition-colors px-2.5 py-1 rounded-full whitespace-normal text-left leading-tight ${
                      selectedSchemePill === name
                        ? 'bg-brand-teal text-white border-brand-teal'
                        : 'text-brand-teal border-brand-teal/40 bg-teal-50 hover:bg-teal-100 hover:border-brand-teal'
                    }`}
                  >
                    {name}
                  </button>
                ))}
              </div>

              {/* Parameter picker — appears only after a scheme is selected */}
              {selectedSchemePill && (
                <div className="flex items-center gap-2 pt-1 pl-1 border-l-2 border-brand-teal/30">
                  <span className="text-[11px] text-neutral-500 font-medium shrink-0">
                    What do you want to know?
                  </span>
                  {(['NAV', 'AUM', 'Exit Load'] as const).map((param) => (
                    <button
                      key={param}
                      type="button"
                      onClick={() => {
                        const q = `What is the ${param} of ${selectedSchemePill}?`;
                        setSelectedSchemePill(null);
                        handleSearchStart(q);
                        triggerAutoSearch(q);
                      }}
                      className="text-[11px] font-semibold bg-brand-navy text-white px-3 py-1 rounded-full hover:bg-opacity-90 transition-colors"
                    >
                      {param}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setSelectedSchemePill(null)}
                    className="text-[11px] text-neutral-400 hover:text-neutral-600 ml-auto"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* State Machine Rendering */}
          <div className="transition-all duration-300">
            {state === 'idle' && (
              <Card variant="default" className="flex flex-col gap-6 p-6">
                <div className="flex flex-col items-center text-center py-6">
                  <div className="w-16 h-16 rounded-full bg-info-50 flex items-center justify-center text-brand-teal mb-4 shadow-sm border border-blue-100">
                    <ChatCenteredText size={32} weight="duotone" />
                  </div>
                  <h3 className="font-heading text-text-h3 font-bold text-neutral-900 mb-2">
                    How can we help you today?
                  </h3>
                  <p className="text-sm text-neutral-600 max-w-md font-body">
                    Ask any factual question about mutual fund exit loads, expense ratios, tax implications, or processes.
                  </p>
                </div>

                <div className="border-t border-neutral-100 pt-6">
                  <h4 className="text-xs font-bold text-neutral-400 mb-3 uppercase tracking-wider">
                    Suggested Questions
                  </h4>
                  <div className="flex flex-col gap-2.5">
                    <button
                      type="button"
                      onClick={() => handleSuggestionClick('What is the exit load for Parag Parikh Flexi Cap Fund?')}
                      className="text-left text-[13px] font-medium text-brand-teal hover:underline flex items-center gap-2 py-1 px-2 hover:bg-neutral-50 rounded transition-colors"
                    >
                      <Question size={14} className="shrink-0 text-brand-teal" />
                      What is the exit load for Parag Parikh Flexi Cap Fund?
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSuggestionClick('What is a Total Expense Ratio (TER)?')}
                      className="text-left text-[13px] font-medium text-brand-teal hover:underline flex items-center gap-2 py-1 px-2 hover:bg-neutral-50 rounded transition-colors"
                    >
                      <Question size={14} className="shrink-0 text-brand-teal" />
                      What is a Total Expense Ratio (TER)?
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSuggestionClick('How are capital gains taxed on mutual funds?')}
                      className="text-left text-[13px] font-medium text-brand-teal hover:underline flex items-center gap-2 py-1 px-2 hover:bg-neutral-50 rounded transition-colors"
                    >
                      <Question size={14} className="shrink-0 text-brand-teal" />
                      How are capital gains taxed on mutual funds?
                    </button>
                  </div>
                </div>
              </Card>
            )}

            {state === 'loading' && (
              <Card variant="default" className="flex flex-col gap-6 p-6">
                <div className="flex justify-start">
                  <Skeleton variant="card" width="160px" height="40px" className="rounded-2xl" />
                </div>
                <div className="flex flex-col gap-2 mt-4">
                  <Skeleton variant="text" width="100%" height="16px" />
                  <Skeleton variant="text" width="95%" height="16px" />
                  <Skeleton variant="text" width="80%" height="16px" />
                </div>
                <div className="mt-4">
                  <Skeleton variant="card" width="100%" height="60px" className="rounded-lg" />
                </div>
              </Card>
            )}

            {state === 'answered' && response?.answer && (
              <div className="flex flex-col gap-6">
                <FAQAnswerCard query={query} answer={response.answer} />

                {/* Follow-up question input */}
                <Card variant="default" className="p-5 flex flex-col gap-4 border border-neutral-100 shadow-sm">
                  <h4 className="font-heading text-sm font-bold text-neutral-800">
                    Ask a follow-up question
                  </h4>
                  <form onSubmit={handleFollowUpSubmit} className="flex gap-3">
                    <Input
                      type="text"
                      placeholder="Ask a clarifying question about this answer..."
                      value={followUpText}
                      onChange={(e) => setFollowUpText(e.target.value)}
                      disabled={followUpLoading}
                      className="flex-1"
                    />
                    <Button
                      type="submit"
                      variant="secondary"
                      size="md"
                      disabled={!followUpText.trim() || followUpLoading}
                      loading={followUpLoading}
                    >
                      Ask
                    </Button>
                  </form>
                </Card>

                <div className="flex justify-start">
                  <Button variant="ghost" onClick={handleReset} className="text-xs text-neutral-500 font-semibold flex items-center gap-1">
                    <ArrowClockwise size={14} /> Clear and start over
                  </Button>
                </div>
              </div>
            )}

            {state === 'clarification_needed' && response?.answer && (
              <div className="flex flex-col gap-6">
                <Card variant="default" className="p-6 border-l-4 border-brand-saffron bg-warning-50 flex flex-col gap-4">
                  <div className="bg-white rounded-2xl px-4 py-3 border border-neutral-150 self-start">
                    <p className="text-xs text-neutral-400 font-semibold mb-1 uppercase tracking-wider">Your Question</p>
                    <p className="text-[15px] font-medium text-neutral-800 leading-normal">{query}</p>
                  </div>
                  <div>
                    <h3 className="font-heading text-[15px] font-bold text-neutral-900 mb-1">
                      We need a bit more detail to answer accurately:
                    </h3>
                    <p className="text-sm font-body font-semibold text-brand-teal">
                      {response.answer.clarification_question}
                    </p>
                  </div>

                  <form onSubmit={handleClarificationSubmit} className="flex flex-col gap-3 mt-2">
                    <Input
                      type="text"
                      placeholder="Type your response here..."
                      value={clarificationText}
                      onChange={(e) => setClarificationText(e.target.value)}
                      className="w-full"
                    />
                    <div className="flex gap-3">
                      <Button type="submit" variant="primary" disabled={!clarificationText.trim()} size="sm">
                        Submit Clarification
                      </Button>
                      <Button type="button" variant="secondary" size="sm" onClick={handleReset}>
                        Cancel
                      </Button>
                    </div>
                  </form>

                  <div className="border-t border-neutral-200/50 pt-4">
                    <DisclaimerBlock variant="primary" />
                  </div>
                </Card>
              </div>
            )}

            {state === 'deflected' && (
              <div className="flex flex-col gap-4">
                <FAQDeflectionCard
                  queryText={query}
                  onBookAdvisor={() => navigate('/schedule')}
                  onContinueToFaq={handleReset}
                  onSuggestionClick={handleSuggestionClick}
                />
                <div className="flex justify-start">
                  <Button variant="ghost" onClick={handleReset} className="text-xs text-neutral-500 font-semibold flex items-center gap-1">
                    <ArrowClockwise size={14} /> Back to search
                  </Button>
                </div>
              </div>
            )}

            {state === 'out_of_scope' && (
              <div className="flex flex-col gap-4">
                <FAQOutOfScopeCard schemeName={response?.out_of_scope_scheme} />
                <div className="flex justify-start">
                  <Button variant="ghost" onClick={handleReset} className="text-xs text-neutral-500 font-semibold flex items-center gap-1">
                    <ArrowClockwise size={14} /> Back to search
                  </Button>
                </div>
              </div>
            )}

            {state === 'no_answer' && (
              <div className="flex flex-col gap-6">
                <Card variant="default" className="flex flex-col gap-6 p-6">
                  {/* User question bubble */}
                  <div className="flex justify-start">
                    <div className="bg-neutral-50 rounded-2xl px-4 py-3 max-w-[85%] border border-neutral-100">
                      <p className="text-xs text-neutral-400 font-semibold mb-1 uppercase tracking-wider">Your Question</p>
                      <p className="text-[15px] font-medium text-neutral-800 leading-normal">{query}</p>
                    </div>
                  </div>

                  {/* Fallback error message (no fabricated content message) */}
                  <div className="text-neutral-800">
                    <p className="font-body text-[15px] font-medium text-neutral-600 leading-relaxed">
                      We don't have verified information about this in our knowledge base.
                    </p>
                  </div>

                  {/* DisclaimerBlock (Must appear on every answer state — verbatim primary disclaimer) */}
                  <DisclaimerBlock variant="primary" />

                  {/* Book a call alternative */}
                  <div className="border-t border-neutral-100 pt-4 flex justify-between items-center text-xs text-neutral-500">
                    <span>Try rephrasing or asking a different question.</span>
                    <Button variant="ghost" onClick={() => navigate('/schedule')} className="text-brand-teal font-semibold">
                      Speak to an Advisor →
                    </Button>
                  </div>
                </Card>

                <div className="flex justify-start">
                  <Button variant="ghost" onClick={handleReset} className="text-xs text-neutral-500 font-semibold flex items-center gap-1">
                    <ArrowClockwise size={14} /> Back to search
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column / Sidebar (35% sidebar) */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          
          {/* Mobile Accordion Toggle: only visible on screens < lg */}
          <div className="block lg:hidden">
            <button
              type="button"
              onClick={() => setIsSidebarMobileExpanded(!isSidebarMobileExpanded)}
              className="w-full flex items-center justify-between bg-white border border-neutral-200 p-4 rounded-xl shadow-level-1 font-heading font-bold text-neutral-800 focus:outline-none"
            >
              <span className="flex items-center gap-2">
                <BookOpen size={20} className="text-brand-teal" />
                Fee Explainer & Covered Schemes
              </span>
              <span className="text-neutral-500">
                {isSidebarMobileExpanded ? <CaretUp size={18} /> : <CaretDown size={18} />}
              </span>
            </button>

            {/* Collapsible content area */}
            <div className={`mt-3 flex flex-col gap-4 overflow-hidden transition-all duration-300 ease-in-out ${isSidebarMobileExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0 pointer-events-none'}`}>
              <FeeExplainerPanel />
              <CoveredSchemesPanel />
            </div>
          </div>

          {/* Desktop Sidebar: always visible on screens >= lg */}
          <div className="hidden lg:flex lg:flex-col lg:gap-6">
            <FeeExplainerPanel />
            <CoveredSchemesPanel />
          </div>

        </div>

      </div>
    </div>
  );
};

export default FAQCentre;
