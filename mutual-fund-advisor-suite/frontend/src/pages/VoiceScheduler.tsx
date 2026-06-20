import { useEffect } from 'react';
import { ArrowLeft } from '@phosphor-icons/react';
import { StepIndicator } from '../components/ui';
import {
  GreetingStep,
  TopicCaptureStep,
  SlotSelectionStep,
  ContextCaptureStep,
  EmailCaptureStep,
  ConfirmationStep,
} from '../components/features/scheduler';
import { useSchedulerStore } from '../stores/schedulerStore';

const STEPS = [
  { label: 'Greeting' },
  { label: 'Topic' },
  { label: 'Time Slot' },
  { label: 'Context' },
  { label: 'Email' },
  { label: 'Confirmed' },
];

export default function VoiceScheduler() {
  const { currentStep, goBack, reset } = useSchedulerStore();

  useEffect(() => {
    reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <GreetingStep />;
      case 2:
        return <TopicCaptureStep />;
      case 3:
        return <SlotSelectionStep />;
      case 4:
        return <ContextCaptureStep />;
      case 5:
        return <EmailCaptureStep />;
      case 6:
        return <ConfirmationStep />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-[640px] mx-auto px-6 py-10">
      <StepIndicator steps={STEPS} currentStep={currentStep - 1} className="mb-8" />

      {currentStep !== 6 && currentStep !== 1 && (
        <button
          type="button"
          onClick={goBack}
          className="flex items-center gap-1.5 text-[13px] font-medium text-neutral-500 hover:text-brand-teal transition-colors mb-4"
        >
          <ArrowLeft size={14} aria-hidden="true" />
          Back
        </button>
      )}

      {renderStep()}
    </div>
  );
}
