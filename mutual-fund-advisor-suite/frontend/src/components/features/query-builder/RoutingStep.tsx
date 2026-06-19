import React, { useEffect } from 'react';
import { useQueryBuilderStore } from '../../../stores/queryBuilderStore';
import { ComplianceDeflectionCard, OutOfScopeCard, Button } from '../../ui';
import { useNavigate } from 'react-router-dom';
import { CheckCircle } from '@phosphor-icons/react';

export const RoutingStep: React.FC = () => {
  const triageResult = useQueryBuilderStore((state) => state.triageResult);
  const freeTextQuery = useQueryBuilderStore((state) => state.freeTextQuery);
  const navigate = useNavigate();

  useEffect(() => {
    // Auto-navigate for factual/educational successful routing
    if (triageResult && (triageResult.bucket === 'factual' || triageResult.bucket === 'educational')) {
      const timer = setTimeout(() => {
        if (triageResult.routing_destination === 'faq') {
          navigate(`/faq?q=${encodeURIComponent(freeTextQuery)}`);
        } else if (triageResult.routing_destination === 'education') {
          navigate(`/education?q=${encodeURIComponent(freeTextQuery)}`);
        }
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [triageResult, navigate, freeTextQuery]);

  if (!triageResult) return null;

  // 1. Advice seeking state
  if (triageResult.bucket === 'advice_seeking') {
    return (
      <div className="w-full max-w-[600px] mx-auto animate-fade-in">
        <ComplianceDeflectionCard
          onBookAdvisor={() => navigate('/schedule')}
          onContinueToFaq={() => navigate(`/faq?q=${encodeURIComponent(freeTextQuery)}`)}
        />
      </div>
    );
  }

  // 2. Edge / Out of scope state
  if (triageResult.bucket === 'edge' || triageResult.escalation_flag || triageResult.scheme_out_of_scope) {
    return (
      <div className="w-full max-w-[600px] mx-auto animate-fade-in flex flex-col gap-6">
        <OutOfScopeCard
          onViewCoveredSchemes={() => navigate('/sources')}
        />
        <div className="text-center">
          <p className="text-[14px] text-neutral-600 mb-3">Still need help?</p>
          <Button variant="ghost" onClick={() => navigate('/schedule')} className="text-brand-saffron">
            Book a call with an advisor
          </Button>
        </div>
      </div>
    );
  }

  // 3. Routing transition state (Factual / Educational)
  return (
    <div className="w-full max-w-[600px] mx-auto flex flex-col items-center justify-center py-12 animate-fade-in">
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-success-100 rounded-full animate-ping opacity-75"></div>
        <CheckCircle size={64} weight="fill" className="text-success-500 relative z-10" />
      </div>
      <h2 className="font-heading text-[22px] font-bold text-neutral-900 mb-2">
        Great, we can help with that.
      </h2>
      <p className="text-[15px] text-neutral-600">
        Taking you to the {triageResult.routing_destination === 'faq' ? 'FAQ Centre' : 'Education Hub'}...
      </p>
    </div>
  );
};
