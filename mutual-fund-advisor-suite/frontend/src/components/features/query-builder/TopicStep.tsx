import React, { useEffect } from 'react';
import { TopicPill, Button, Textarea } from '../../ui';
import { useQueryBuilderStore } from '../../../stores/queryBuilderStore';
import { triageService } from '../../../services/triage.service';
import { useNavigate } from 'react-router-dom';

interface TopicStepProps {
  mode: 'specific' | 'learn';
}

const SPECIFIC_TOPICS = [
  { label: 'Fees & charges', id: 'fees' },
  { label: 'Scheme details', id: 'scheme' },
  { label: 'Processes', id: 'processes' },
  { label: 'Regulatory questions', id: 'regulatory' },
  { label: 'Something else', id: 'other' }
];

const LEARN_TOPICS = [
  { label: 'Types of mutual funds', id: 'fund_categories' },
  { label: 'How SIPs work', id: 'sip' },
  { label: 'Tax implications', id: 'tax' },
  { label: 'Understanding fees and costs', id: 'fees' },
  { label: 'My rights as an investor', id: 'investor_rights' },
  { label: 'Something else', id: 'other' }
];

export const TopicStep: React.FC<TopicStepProps> = ({ mode }) => {
  const navigate = useNavigate();
  const { 
    topicSelection, setTopic, 
    freeTextQuery, setFreeText,
    setTriageResult, setStep,
    isLoading, setIsLoading 
  } = useQueryBuilderStore();
  
  const topics = mode === 'specific' ? SPECIFIC_TOPICS : LEARN_TOPICS;
  const isOtherSelected = topicSelection === 'other';

  // Handle preset topic selection (non-other)
  useEffect(() => {
    if (topicSelection && topicSelection !== 'other' && !isLoading) {
      if (mode === 'specific') {
        navigate(`/faq?topic=${topicSelection}`);
      } else {
        navigate(`/education?category=${topicSelection}`);
      }
    }
  }, [topicSelection, mode, navigate, isLoading]);

  const handleContinue = async () => {
    if (isOtherSelected && freeTextQuery.trim().length > 0) {
      setIsLoading(true);
      try {
        // Generate a random session ID or use a UUID library if available
        const sessionId = Math.random().toString(36).substring(2, 15);
        const result = await triageService.classifyQuery(freeTextQuery, sessionId);
        setTriageResult(result);
        setStep(3);
      } catch (error) {
        console.error('Triage error:', error);
        // Fallback edge case if backend is down
        setTriageResult({
          bucket: 'edge',
          confidence: 0,
          routing_destination: 'escalation',
          scheme_out_of_scope: false,
          scheme_name_detected: null,
          escalation_flag: true
        });
        setStep(3);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const isContinueDisabled = !topicSelection || (isOtherSelected && freeTextQuery.trim().length === 0) || isLoading;

  return (
    <div className="flex flex-col gap-6 w-full max-w-[600px] mx-auto">
      <div className="text-center mb-2">
        <h2 className="font-heading text-[24px] font-bold text-neutral-900 mb-2">
          {mode === 'specific' ? 'What do you need help with?' : 'What would you like to learn about?'}
        </h2>
        <p className="text-[15px] text-neutral-600">Select a topic or type your question.</p>
      </div>

      <div className="flex flex-wrap gap-3 justify-center">
        {topics.map((t) => (
          <TopicPill
            key={t.id}
            id={`topic-pill-${t.id}`}
            label={t.label}
            selected={topicSelection === t.id}
            onClick={() => setTopic(t.id)}
          />
        ))}
      </div>

      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOtherSelected ? 'max-h-[300px] opacity-100 mt-4' : 'max-h-0 opacity-0 m-0'}`}>
        <div className="flex flex-col gap-3">
          <Textarea
            id="free-text-query"
            label="What is your question?"
            placeholder="E.g., I'm saving for retirement, where should I invest?"
            value={freeTextQuery}
            onChange={(e) => setFreeText(e.target.value)}
            disabled={isLoading}
            maxLength={300}
            rows={4}
          />
        </div>
      </div>

      <div className="mt-6 flex justify-center w-full">
        <Button
          variant="primary"
          size="lg"
          className="w-full md:w-auto min-w-[200px]"
          disabled={isContinueDisabled}
          onClick={handleContinue}
          loading={isLoading}
        >
          {isLoading ? 'Processing...' : 'Continue'}
        </Button>
      </div>
    </div>
  );
};
