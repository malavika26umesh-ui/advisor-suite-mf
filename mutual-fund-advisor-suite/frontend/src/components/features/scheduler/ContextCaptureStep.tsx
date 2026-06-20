import React, { useState } from 'react';
import { LockSimple } from '@phosphor-icons/react';
import { Button, Textarea } from '../../ui';
import { useSchedulerStore } from '../../../stores/schedulerStore';
import { schedulerService } from '../../../services/scheduler.service';

const MAX_LENGTH = 300;

export const ContextCaptureStep: React.FC = () => {
  const { investorContext, setInvestorContext, goNext } = useSchedulerStore();
  const [piiWarning, setPiiWarning] = useState<string | null>(null);
  const [checking, setChecking] = useState(false);

  const handleBlur = async () => {
    if (!investorContext.trim()) {
      setPiiWarning(null);
      return;
    }
    setChecking(true);
    try {
      const result = await schedulerService.checkPii(investorContext);
      setPiiWarning(
        result.has_pii
          ? result.deflection_message ??
              "For your security, please don't share your PAN, Aadhaar, folio number, or account details here."
          : null
      );
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <h2 className="font-heading text-[18px] font-semibold text-neutral-900 text-center">
        Anything else the advisor should know? <span className="text-neutral-400 font-normal">(optional)</span>
      </h2>

      <Textarea
        value={investorContext}
        onChange={(e) => setInvestorContext(e.target.value)}
        onBlur={handleBlur}
        maxLength={MAX_LENGTH}
        placeholder="E.g. I'm trying to understand exit load timing before I redeem..."
        aria-label="Additional context for the advisor"
      />

      {checking && <p className="text-[12px] text-neutral-400">Checking…</p>}

      {piiWarning && (
        <div role="alert" className="flex items-start gap-2 rounded-lg bg-[#FFF8E1] border border-disclaimer-border px-4 py-3">
          <LockSimple size={16} className="text-disclaimer-border shrink-0 mt-0.5" aria-hidden="true" />
          <p className="text-[13px] text-neutral-700 leading-relaxed">🔒 {piiWarning}</p>
        </div>
      )}

      <div className="flex flex-col gap-3">
        <Button variant="primary" onClick={goNext} fullWidth>
          Add context &amp; Continue
        </Button>
        <button
          type="button"
          onClick={() => {
            setInvestorContext('');
            goNext();
          }}
          className="self-center text-[13px] font-medium text-brand-teal underline hover:text-teal-700 transition-colors"
        >
          Skip — Continue without context
        </button>
      </div>
    </div>
  );
};

export default ContextCaptureStep;
