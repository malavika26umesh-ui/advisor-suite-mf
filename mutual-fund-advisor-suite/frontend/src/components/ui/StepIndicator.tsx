import React from 'react';
import { Check } from '@phosphor-icons/react';

export interface StepIndicatorStep {
  label: string;
}

export interface StepIndicatorProps {
  steps: StepIndicatorStep[];
  /** 0-indexed */
  currentStep: number;
  completedSteps?: number[];
  className?: string;
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({
  steps,
  currentStep,
  completedSteps = [],
  className = '',
}) => {
  const isCompleted = (index: number) => completedSteps.includes(index) || index < currentStep;
  const isActive = (index: number) => index === currentStep;

  return (
    <nav aria-label="Progress" className={['flex items-start', className].join(' ')}>
      {steps.map((step, index) => (
        <React.Fragment key={step.label}>
          {/* Step */}
          <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
            {/* Circle */}
            <div
              aria-current={isActive(index) ? 'step' : undefined}
              className={[
                'w-8 h-8 rounded-full flex items-center justify-center',
                'text-[13px] font-semibold border-2 transition-all duration-250',
                isCompleted(index)
                  ? 'bg-success-500 border-success-500 text-white'
                  : isActive(index)
                    ? 'bg-brand-navy border-brand-navy text-white'
                    : 'bg-white border-neutral-200 text-neutral-400',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              {isCompleted(index) ? (
                <Check size={14} weight="bold" aria-hidden="true" />
              ) : (
                <span>{index + 1}</span>
              )}
            </div>

            {/* Label */}
            <span
              className={[
                'text-[12px] text-center max-w-[80px]',
                isActive(index)
                  ? 'text-brand-navy font-medium'
                  : isCompleted(index)
                    ? 'text-success-500'
                    : 'text-neutral-400',
              ].join(' ')}
            >
              {step.label}
            </span>
          </div>

          {/* Connector line — not after last step */}
          {index < steps.length - 1 && (
            <div
              aria-hidden="true"
              className={[
                'h-0.5 flex-1 mt-4 mx-1 transition-colors duration-250',
                isCompleted(index) ? 'bg-brand-teal' : 'bg-neutral-200',
              ].join(' ')}
            />
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default StepIndicator;
