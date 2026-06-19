import { useQueryBuilderStore } from '../stores/queryBuilderStore';
import { StepIndicator } from '../components/ui';
import { IntentStep } from '../components/features/query-builder/IntentStep';
import { TopicStep } from '../components/features/query-builder/TopicStep';
import { RoutingStep } from '../components/features/query-builder/RoutingStep';
import { ArrowLeft, LockKey } from '@phosphor-icons/react';

export default function QueryBuilder() {
  const { currentStep, intentSelection, setStep } = useQueryBuilderStore();

  const handleBack = () => {
    if (currentStep > 1) {
      setStep((currentStep - 1) as 1 | 2 | 3);
    }
  };

  return (
    <div className="font-body min-h-[calc(100vh-64px)] bg-neutral-50 py-8 md:py-12">
      <div className="max-w-max-width mx-auto px-6 flex flex-col">
        {/* Header with Back Button */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={handleBack}
            disabled={currentStep === 1}
            className={`flex items-center gap-2 text-[14px] font-medium transition-colors ${
              currentStep === 1 
                ? 'text-neutral-300 cursor-not-allowed' 
                : 'text-neutral-600 hover:text-brand-navy'
            }`}
          >
            <ArrowLeft size={16} />
            Back
          </button>
          
          <div className="flex items-center gap-1.5 text-[12px] font-medium text-neutral-500 bg-white px-3 py-1.5 rounded-full border border-neutral-200">
            <LockKey size={14} />
            No login required · No personal information collected
          </div>
        </div>

        {/* Step Indicator */}
        <div className="w-full max-w-[600px] mx-auto mb-12">
          <StepIndicator
            steps={[
              { label: 'Intent' },
              { label: 'Topic' },
              { label: 'Routing' }
            ]}
            currentStep={currentStep - 1}
          />
        </div>

        {/* Step Content */}
        <div className="flex-1 w-full flex items-start justify-center">
          {currentStep === 1 && <IntentStep />}
          {currentStep === 2 && intentSelection !== 'advisor' && (
            <TopicStep mode={intentSelection as 'specific' | 'learn'} />
          )}
          {currentStep === 3 && <RoutingStep />}
        </div>
      </div>
    </div>
  );
}
